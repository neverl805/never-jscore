use anyhow::{Result, anyhow};
use deno_core::{JsRuntime, RuntimeOptions};
use pyo3::exceptions::PyException;
use pyo3::prelude::*;
use pyo3::types::PyList;
use serde_json::Value as JsonValue;
use std::cell::RefCell;
use std::rc::Rc;

use crate::convert::{json_to_python, python_to_json};
use crate::ops;
use crate::runtime::{ensure_v8_initialized, run_with_tokio};
use crate::storage::ResultStorage;

// ============================================
// 权限容器 - Web扩展需要
// ============================================

/// 权限容器，用于控制Web API的权限
///
/// 在JS逆向场景中，我们允许所有权限
struct PermissionsContainer;

// impl deno_web::TimersPermission for PermissionsContainer {
//     fn allow_hrtime(&mut self) -> bool {
//         true  // 允许高精度时间
//     }
// }

/// JavaScript 执行上下文
///
/// 每个 Context 包含一个独立的 V8 isolate 和 JavaScript 运行时环境。
/// 支持 Promise 和 async/await，默认自动等待 Promise 结果。
///
/// 使用方式类似 py_mini_racer：
/// ```python
/// ctx = never_jscore.Context(enable_extensions=True, enable_logging=False)
/// ctx.eval("function add(a, b) { return a + b; }")
/// result = ctx.call("add", [1, 2])
/// ```
#[pyclass(unsendable)]
pub struct Context {
    runtime: RefCell<JsRuntime>,
    result_storage: Rc<ResultStorage>,
    exec_count: RefCell<usize>,
    extensions_loaded: bool,
    logging_enabled: bool,
}

// JavaScript polyfill 代码
const JS_POLYFILL: &str = include_str!("dddd_js/js_polyfill.js");

impl Context {
    /// 创建新的 Context
    ///
    /// # Arguments
    /// * `enable_extensions` - 是否启用扩展（crypto, encoding 等）
    /// * `enable_logging` - 是否启用操作日志输出
    /// * `random_seed` - 随机数种子（可选）。如果提供，所有随机数 API 将使用固定种子
    pub fn new(enable_extensions: bool, enable_logging: bool, random_seed: Option<u32>) -> PyResult<Self> {
        let storage = Rc::new(ResultStorage::new());

        let mut extensions = vec![
            // Custom ops for result storage
            ops::pyexecjs_ext::init(storage.clone()),
        ];

        // 根据参数决定是否加载扩展
        if enable_extensions {
            extensions.push(crate::random_ops::random_ops::init());  // Random seed control (always loaded with extensions)
            extensions.push(crate::crypto_ops::crypto_ops::init());
            extensions.push(crate::encoding_ops::encoding_ops::init());
            // Use real async timers instead of fake ones
            extensions.push(crate::timer_real_ops::timer_real_ops::init());
            extensions.push(crate::worker_ops::worker_ops::init());
            extensions.push(crate::fs_ops::fs_ops::init());
            extensions.push(crate::fetch_ops::fetch_ops::init());
            extensions.push(crate::performance_ops::performance_ops::init());

            // 新增: 浏览器环境 API
            extensions.push(crate::ops::web_storage::web_storage_ops::init());
            extensions.push(crate::ops::browser_env::browser_env_ops::init());
        }

        let mut runtime = JsRuntime::new(RuntimeOptions {
            extensions,
            ..Default::default()
        });

        // 如果启用扩展，自动注入 JavaScript polyfill
        if enable_extensions {
            // Set random seed if provided
            if let Some(seed) = random_seed {
                crate::random_state::set_random_seed(seed as u64);
            }

            // Set logging flag in global scope before loading polyfill
            let logging_flag = if enable_logging { "true" } else { "false" };
            let logging_setup = format!("globalThis.__NEVER_JSCORE_LOGGING__ = {};", logging_flag);

            let _log_result = runtime
                .execute_script("<logging_setup>", logging_setup)
                .map_err(|e| PyException::new_err(format!("Failed to setup logging: {:?}", e)))?;
            std::mem::forget(_log_result);

            let _result = runtime
                .execute_script("<polyfill>", JS_POLYFILL.to_string())
                .map_err(|e| PyException::new_err(format!("Failed to load polyfill: {:?}", e)))?;

            // Leak the v8::Global to avoid HandleScope issues
            std::mem::forget(_result);
        }

        Ok(Context {
            runtime: RefCell::new(runtime),
            result_storage: storage,
            exec_count: RefCell::new(0),
            extensions_loaded: enable_extensions,
            logging_enabled: enable_logging,
        })
    }

    /// 执行脚本，将代码加入全局作用域（不返回值）
    ///
    /// 这个方法会直接执行代码并将定义的函数/变量加入全局作用域
    fn exec_script(&self, code: &str) -> Result<()> {
        let mut runtime = self.runtime.borrow_mut();

        // execute_script returns a v8::Global<v8::Value>
        // We don't need the result, so we leak it to avoid drop issues
        let result = runtime
            .execute_script("<exec>", code.to_string())
            .map_err(|e| anyhow!("Execution error: {:?}", e))?;

        // Leak the v8::Global to avoid HandleScope issues on drop
        std::mem::forget(result);

        // 更新执行计数
        let mut count = self.exec_count.borrow_mut();
        *count += 1;

        // 每 100 次执行后提示 GC
        if *count % 100 == 0 {
            std::hint::black_box(());
        }

        Ok(())
    }

    /// 执行 JavaScript 代码并返回结果
    ///
    /// 根据 auto_await 参数决定是否自动等待 Promise。
    /// 注意：这个方法用于求值，代码在IIFE中执行，不会影响全局作用域
    fn execute_js(&self, code: &str, auto_await: bool) -> Result<String> {
        self.result_storage.clear();

        if auto_await {
            // 异步模式：自动等待 Promise
            // 使用线程本地的单线程 Tokio runtime
            run_with_tokio(async {
                let mut runtime = self.runtime.borrow_mut();

                // 使用 JSON 序列化来安全转义代码字符串（处理所有特殊字符）
                let code_json = serde_json::to_string(code)
                    .map_err(|e| anyhow!("Failed to serialize code: {}", e))?;

                // 包装代码以自动等待 Promise
                let wrapped_code = format!(
                    r#"
                    (async function() {{
                        try {{
                            const code = {};
                            const __result = await Promise.resolve(eval(code));
                            if (__result === undefined) {{
                                Deno.core.ops.op_store_result("null");
                                return null;
                            }}
                            try {{
                                const json = JSON.stringify(__result);
                                Deno.core.ops.op_store_result(json);
                                return __result;
                            }} catch(e) {{
                                const str = JSON.stringify(String(__result));
                                Deno.core.ops.op_store_result(str);
                                return __result;
                            }}
                        }} catch(err) {{
                            throw err;
                        }}
                    }})()
                    "#,
                    code_json
                );

                let _result = runtime
                    .execute_script("<eval_async>", wrapped_code)
                    .map_err(|e| {
                        // 检查是否是提前返回信号
                        let err_str = format!("{:?}", e);
                        if err_str.contains("NEVER_JSCORE_EARLY_RETURN") || err_str.contains("EarlyReturnSignal") {
                            // 这是提前返回，不是真正的错误
                            return anyhow!("Early return detected");
                        }
                        anyhow!("Execution failed: {:?}", e)
                    })?;

                // Leak the v8::Global to avoid HandleScope issues
                std::mem::forget(_result);

                // 检查是否是提前返回
                if self.result_storage.is_early_return() {
                    // 提前返回：直接获取结果，不需要运行event loop
                    let result = self
                        .result_storage
                        .take()
                        .ok_or_else(|| anyhow!("Early return but no result stored"))?;

                    // 清理标志
                    self.result_storage.clear();

                    // 更新执行计数
                    let mut count = self.exec_count.borrow_mut();
                    *count += 1;

                    return Ok(result);
                }

                // 运行 event loop 等待 Promise 完成
                runtime
                    .run_event_loop(Default::default())
                    .await
                    .map_err(|e| {
                        // 检查是否是提前返回信号
                        let err_str = format!("{:?}", e);
                        if err_str.contains("NEVER_JSCORE_EARLY_RETURN") || err_str.contains("EarlyReturnSignal") {
                            // 这是提前返回，不是真正的错误
                            return anyhow!("Early return in event loop");
                        }
                        anyhow!("Event loop error: {:?}", e)
                    })?;

                let result = self
                    .result_storage
                    .take()
                    .ok_or_else(|| anyhow!("No result stored"))?;

                // 再次检查提前返回（可能在event loop中发生）
                if self.result_storage.is_early_return() {
                    self.result_storage.clear();
                }

                // 更新执行计数
                let mut count = self.exec_count.borrow_mut();
                *count += 1;

                // 每 100 次执行后提示 GC
                if *count % 100 == 0 {
                    drop(runtime);
                    std::hint::black_box(());
                }

                Ok(result)
            })
        } else {
            // 同步模式：不等待 Promise
            let mut runtime = self.runtime.borrow_mut();

            // 使用 JSON 序列化来安全转义代码字符串（处理所有特殊字符）
            let code_json = serde_json::to_string(code)
                .map_err(|e| anyhow!("Failed to serialize code: {}", e))?;

            let wrapped_code = format!(
                r#"
                (function() {{
                    const code = {};
                    const __result = eval(code);
                    if (__result === undefined) {{
                        Deno.core.ops.op_store_result("null");
                        return null;
                    }}
                    try {{
                        const json = JSON.stringify(__result);
                        Deno.core.ops.op_store_result(json);
                        return __result;
                    }} catch(e) {{
                        const str = JSON.stringify(String(__result));
                        Deno.core.ops.op_store_result(str);
                        return __result;
                    }}
                }})()
                "#,
                code_json
            );

            let execute_result = runtime.execute_script("<eval_sync>", wrapped_code);

            // 检查是否是提前返回
            let is_early_return = if let Err(ref e) = execute_result {
                let err_str = format!("{:?}", e);
                err_str.contains("NEVER_JSCORE_EARLY_RETURN") || err_str.contains("EarlyReturnSignal")
            } else {
                false
            };

            if is_early_return {
                // 提前返回：不需要处理执行结果
            } else {
                // 不是提前返回：检查错误并leak结果
                let result_handle = execute_result
                    .map_err(|e| anyhow!("Execution failed: {:?}", e))?;
                std::mem::forget(result_handle);
            }

            let result = self
                .result_storage
                .take()
                .ok_or_else(|| anyhow!("No result stored"))?;

            // 清理提前返回标志
            if self.result_storage.is_early_return() {
                self.result_storage.clear();
            }

            let mut count = self.exec_count.borrow_mut();
            *count += 1;

            if *count % 100 == 0 {
                drop(runtime);
                std::hint::black_box(());
            }

            Ok(result)
        }
    }

    /// 请求垃圾回收
    fn request_gc(&self) -> Result<()> {
        let mut runtime = self.runtime.borrow_mut();
        let _ =
            runtime.execute_script("<gc_hint>", "if (typeof gc === 'function') { gc(); } null;");
        Ok(())
    }
}

impl Drop for Context {
    fn drop(&mut self) {
        // V8 runtime 会在 RefCell 销毁时自动清理
        // 注意：不要在这里调用 gc()，因为 Drop 可能在不同线程上被调用
        // 如果需要手动 GC，请在业务代码中显式调用 ctx.gc() 或使用 with 语句
    }
}

// ============================================
// Python Methods
// ============================================

#[pymethods]
impl Context {
    /// Python构造函数
    ///
    /// 创建一个新的JavaScript执行上下文
    ///
    /// Args:
    ///     enable_extensions: 是否启用扩展（crypto, encoding 等），默认 True
    ///                       - True: 启用所有扩展，自动注入 btoa/atob/md5/sha256 等函数
    ///                       - False: 纯净 V8 环境，只包含 ECMAScript 标准 API
    ///     enable_logging: 是否启用操作日志输出，默认 False
    ///                     - True: 输出所有扩展操作的日志（用于调试）
    ///                     - False: 不输出日志（推荐生产环境）
    ///     random_seed: 随机数种子（可选），用于确定性随机数生成
    ///                  - None: 使用系统随机数（非确定性）
    ///                  - int: 使用固定种子（确定性）
    ///                    所有随机数 API（Math.random、crypto.getRandomValues 等）
    ///                    将基于此种子生成，方便调试和算法对比
    ///
    /// Example:
    ///     ```python
    ///     import never_jscore
    ///
    ///     # 创建带扩展的上下文（默认）
    ///     ctx = never_jscore.Context()
    ///     result = ctx.evaluate("btoa('hello')")  # 可以直接使用 btoa
    ///
    ///     # 创建纯净 V8 环境
    ///     ctx_pure = never_jscore.Context(enable_extensions=False)
    ///     # 只有 ECMAScript 标准 API，无 btoa/atob 等
    ///
    ///     # 创建带日志的上下文（用于调试）
    ///     ctx_debug = never_jscore.Context(enable_logging=True)
    ///
    ///     # 创建带固定随机数种子的上下文（用于调试和算法对比）
    ///     ctx_seeded = never_jscore.Context(random_seed=12345)
    ///     r1 = ctx_seeded.evaluate("Math.random()")  # 确定性随机数
    ///     r2 = ctx_seeded.evaluate("Math.random()")  # 下一个确定性随机数
    ///
    ///     # 另一个相同种子的上下文将产生相同的随机数序列
    ///     ctx_seeded2 = never_jscore.Context(random_seed=12345)
    ///     r3 = ctx_seeded2.evaluate("Math.random()")  # r3 == r1
    ///     ```
    #[new]
    #[pyo3(signature = (enable_extensions=true, enable_logging=false, random_seed=None))]
    fn py_new(enable_extensions: bool, enable_logging: bool, random_seed: Option<u32>) -> PyResult<Self> {
        crate::runtime::ensure_v8_initialized();
        Self::new(enable_extensions, enable_logging, random_seed)
    }

    /// 编译JavaScript代码（便捷方法）
    ///
    /// 这是一个便捷方法，等价于 eval(code)。
    /// 执行代码并将函数/变量加入全局作用域。
    ///
    /// Args:
    ///     code: JavaScript 代码字符串
    ///
    /// Returns:
    ///     None
    ///
    /// Example:
    ///     ```python
    ///     ctx = never_jscore.Context()
    ///     ctx.compile('''
    ///         function add(a, b) { return a + b; }
    ///         function sub(a, b) { return a - b; }
    ///     ''')
    ///     result = ctx.call("add", [5, 3])
    ///     ```
    #[pyo3(signature = (code))]
    pub fn compile(&self, code: String) -> PyResult<()> {
        // 直接调用 exec_script，不经过 eval
        self.exec_script(&code)
            .map_err(|e| PyException::new_err(format!("Compile error: {}", e)))?;
        Ok(())
    }

    /// 调用 JavaScript 函数
    ///
    /// Args:
    ///     name: 函数名称
    ///     args: 参数列表
    ///     auto_await: 是否自动等待 Promise（默认 True）
    ///
    /// Returns:
    ///     函数返回值，自动转换为 Python 对象
    #[pyo3(signature = (name, args, auto_await=None))]
    pub fn call<'py>(
        &self,
        py: Python<'py>,
        name: String,
        args: &Bound<'_, PyAny>,
        auto_await: Option<bool>,
    ) -> PyResult<Bound<'py, PyAny>> {
        let json_args = if args.is_instance_of::<PyList>() {
            let list = args.downcast::<PyList>()?;
            let mut vec_args = Vec::with_capacity(list.len());
            for item in list.iter() {
                vec_args.push(python_to_json(&item)?);
            }
            vec_args
        } else {
            vec![python_to_json(args)?]
        };

        let args_json: Vec<String> = json_args
            .iter()
            .map(|arg| serde_json::to_string(arg).unwrap())
            .collect();
        let args_str = args_json.join(", ");
        let call_code = format!("{}({})", name, args_str);

        let result_json = self
            .execute_js(&call_code, auto_await.unwrap_or(true))
            .map_err(|e| PyException::new_err(format!("Call error: {}", e)))?;

        let result: JsonValue = serde_json::from_str(&result_json)
            .map_err(|e| PyException::new_err(format!("JSON parse error: {}", e)))?;

        json_to_python(py, &result)
    }

    /// 执行代码并将其加入全局作用域
    ///
    /// 这个方法会执行JavaScript代码，并将定义的函数/变量保留在全局作用域中。
    /// 类似 py_mini_racer 的 eval() 方法。
    ///
    /// Args:
    ///     code: JavaScript 代码
    ///     return_value: 是否返回最后一个表达式的值（默认 False）
    ///     auto_await: 是否自动等待 Promise（默认 True）
    ///
    /// Returns:
    ///     如果 return_value=True，返回最后一个表达式的值；否则返回 None
    ///
    /// Example:
    ///     ```python
    ///     ctx = Context()
    ///     ctx.eval("function add(a, b) { return a + b; }")
    ///     result = ctx.call("add", [1, 2])  # 可以调用，因为add在全局作用域
    ///     ```
    #[pyo3(signature = (code, return_value=false, auto_await=None))]
    pub fn eval<'py>(
        &self,
        py: Python<'py>,
        code: String,
        return_value: bool,
        auto_await: Option<bool>,
    ) -> PyResult<Bound<'py, PyAny>> {
        if return_value {
            // 需要返回值：使用包装的execute_js
            let result_json = self
                .execute_js(&code, auto_await.unwrap_or(true))
                .map_err(|e| PyException::new_err(format!("Eval error: {}", e)))?;

            let result: JsonValue = serde_json::from_str(&result_json)
                .map_err(|e| PyException::new_err(format!("JSON parse error: {}", e)))?;

            json_to_python(py, &result)
        } else {
            // 不需要返回值：直接执行脚本，加入全局作用域
            self.exec_script(&code)
                .map_err(|e| PyException::new_err(format!("Eval error: {}", e)))?;

            Ok(py.None().into_bound(py))
        }
    }

    /// 执行代码并返回结果（不影响全局作用域）
    ///
    /// 这个方法用于求值，代码在独立的作用域中执行，不会影响全局变量。
    ///
    /// Args:
    ///     code: JavaScript 代码
    ///     auto_await: 是否自动等待 Promise（默认 True）
    ///
    /// Returns:
    ///     表达式的值
    #[pyo3(signature = (code, auto_await=None))]
    pub fn evaluate<'py>(
        &self,
        py: Python<'py>,
        code: String,
        auto_await: Option<bool>,
    ) -> PyResult<Bound<'py, PyAny>> {
        let result_json = self
            .execute_js(&code, auto_await.unwrap_or(true))
            .map_err(|e| PyException::new_err(format!("Evaluate error: {}", e)))?;

        let result: JsonValue = serde_json::from_str(&result_json)
            .map_err(|e| PyException::new_err(format!("JSON parse error: {}", e)))?;

        json_to_python(py, &result)
    }

    /// 请求垃圾回收
    ///
    /// 注意：这只是向 V8 发送 GC 请求，V8 会根据自己的策略决定是否执行。
    fn gc(&self) -> PyResult<()> {
        self.request_gc()
            .map_err(|e| PyException::new_err(format!("GC error: {}", e)))
    }

    /// 获取执行统计信息
    ///
    /// Returns:
    ///     (exec_count,) 执行次数
    fn get_stats(&self) -> PyResult<(usize,)> {
        Ok((*self.exec_count.borrow(),))
    }

    /// 重置统计信息
    fn reset_stats(&self) -> PyResult<()> {
        *self.exec_count.borrow_mut() = 0;
        Ok(())
    }

    /// 上下文管理器支持：__enter__
    ///
    /// 允许使用 with 语句自动管理 Context 生命周期
    ///
    /// Example:
    ///     ```python
    ///     with never_jscore.Context() as ctx:
    ///         result = ctx.evaluate("1 + 2")
    ///         print(result)
    ///     # Context 自动清理
    ///     ```
    fn __enter__(slf: Py<Self>) -> Py<Self> {
        slf
    }

    /// 上下文管理器支持：__exit__
    ///
    /// 自动清理资源并请求 GC
    fn __exit__(
        &self,
        _exc_type: &Bound<'_, PyAny>,
        _exc_value: &Bound<'_, PyAny>,
        _traceback: &Bound<'_, PyAny>,
    ) -> PyResult<bool> {
        // 请求 GC，帮助释放资源
        self.gc()?;
        Ok(false)  // 不抑制异常
    }
}
