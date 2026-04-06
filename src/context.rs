use anyhow::{Result, anyhow};
use deno_core::{JsRuntime, RuntimeOptions, error::JsError};
use pyo3::exceptions::PyException;
use pyo3::prelude::*;
use pyo3::types::{PyDict, PyList};
use serde_json::Value as JsonValue;
use std::cell::RefCell;
use std::rc::Rc;


use crate::convert::{json_to_python, python_to_json};
use crate::storage::ResultStorage;

#[cfg(feature = "deno_web_api")]
use crate::permissions::create_allow_all_permissions;

/// 包装裸指针以绕过Send约束
///
/// 这是安全的，因为：
/// 1. allow_threads不会spawn新线程，只是释放GIL
/// 2. JavaScript代码仍然在当前线程上执行
/// 3. V8 Isolate不会被跨线程访问
struct SendPtr<T>(*const T);
unsafe impl<T> Send for SendPtr<T> {}

impl<T> SendPtr<T> {
    #[inline]
    unsafe fn as_ref(&self) -> &T {
        &*self.0
    }
}

#[cfg(feature = "deno_web_api")]
deno_core::extension!(
    deno_web_init,
    deps = [deno_web, deno_webidl],
    esm_entry_point = "ext:deno_web_init/deno_web_init.js",
    esm = [
        dir "src",
        "deno_web_init.js",
    ],
);

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
    /// 每个 Context 独立的 Tokio Runtime
    ///
    /// 这样 Context drop 时 runtime 也会被自动清理，
    /// 所有后台任务（定时器、IO 等）会被终止，进程可以正常退出。
    tokio_runtime: RefCell<tokio::runtime::Runtime>,
    result_storage: Rc<ResultStorage>,
    exec_count: RefCell<usize>,
    extensions_loaded: bool,
    logging_enabled: bool,
    random_seed: Option<u32>,  // Store seed for deferred initialization (for deno_crypto)
    fast_return: bool,  // 快速返回模式，函数return后立即返回不等待定时器
}


/// 格式化 JavaScript 错误为人类可读的字符串
///
/// 将 deno_core 的 JsError 转换为清晰的错误消息，包含：
/// - 错误类型和消息
/// - 格式化的调用堆栈
/// - 源代码位置信息
fn format_js_error(error: &JsError) -> String {
    let mut output = String::new();

    // 1. 错误类型和消息
    if let Some(name) = &error.name {
        output.push_str(name);
        output.push_str(": ");
    }
    if let Some(message) = &error.message {
        output.push_str(message);
    }
    output.push('\n');

    // 2. 格式化的堆栈跟踪
    if let Some(stack) = &error.stack {
        // 清理堆栈信息，移除重复的错误消息
        let stack_lines: Vec<&str> = stack.lines().collect();

        // 跳过第一行（通常是重复的错误消息）
        for (i, line) in stack_lines.iter().enumerate() {
            if i == 0 && (line.contains(&error.name.as_deref().unwrap_or("")) ||
                         line.contains(&error.message.as_deref().unwrap_or(""))) {
                continue; // 跳过重复的错误消息
            }

            // 清理行内容
            let cleaned = line.trim();
            if !cleaned.is_empty() {
                output.push_str("  ");
                output.push_str(cleaned);
                output.push('\n');
            }
        }
    } else if !error.frames.is_empty() {
        // 如果没有 stack 字符串，从 frames 构建
        output.push_str("Stack trace:\n");
        for frame in &error.frames {
            output.push_str("  at ");

            if let Some(func_name) = &frame.function_name {
                output.push_str(func_name);
            } else {
                output.push_str("<anonymous>");
            }

            output.push_str(" (");

            if let Some(file_name) = &frame.file_name {
                output.push_str(file_name);
            } else if let Some(eval_origin) = &frame.eval_origin {
                output.push_str(eval_origin);
            } else {
                output.push_str("<eval>");
            }

            if let Some(line) = frame.line_number {
                output.push(':');
                output.push_str(&line.to_string());

                if let Some(col) = frame.column_number {
                    output.push(':');
                    output.push_str(&col.to_string());
                }
            }

            output.push_str(")\n");
        }
    }

    // 3. 源代码行（如果有）
    if let Some(source_line) = &error.source_line {
        output.push('\n');
        output.push_str("Source:\n  ");
        output.push_str(source_line);
        output.push('\n');
    }

    output
}

/// 从 anyhow::Error 中提取并格式化 JsError
///
/// 尝试从错误链中找到 JsError 并格式化，如果找不到则返回原始错误消息
fn format_error(error: anyhow::Error) -> String {
    // 尝试 downcast 到 JsError
    match error.downcast::<JsError>() {
        Ok(js_error) => format_js_error(&js_error),
        Err(original_error) => {
            // 不是 JsError，检查是否包含 JsError 的 cause chain
            let error_chain = format!("{:?}", original_error);

            // 尝试从调试输出中提取 JsError
            if error_chain.contains("JsError") {
                // 包含 JsError，但无法直接访问，尝试解析
                // 这是临时方案，返回简化的错误信息
                if let Some(msg_start) = error_chain.find("message: Some(\"") {
                    let msg_part = &error_chain[msg_start + 15..];
                    if let Some(msg_end) = msg_part.find("\")") {
                        let message = &msg_part[..msg_end];

                        if let Some(stack_start) = error_chain.find("stack: Some(\"") {
                            let stack_part = &error_chain[stack_start + 13..];
                            if let Some(stack_end) = stack_part.find("\"),") {
                                let stack = &stack_part[..stack_end];
                                // 清理转义字符
                                let cleaned_stack = stack.replace("\\n", "\n").replace("\\\"", "\"");
                                return format!("{}\n{}", message, cleaned_stack);
                            }
                        }

                        return message.to_string();
                    }
                }
            }

            // 无法提取 JsError，返回原始错误
            format!("{}", original_error)
        }
    }
}

/// RAII guard for V8 isolate enter/exit
///
/// This guard ensures that isolate.exit() is always called, even if a panic occurs.
/// This prevents the "Disposing the isolate that is entered" error and resource leaks.
///
/// # Usage
/// ```rust
/// let _guard = IsolateGuard::new(&self);
/// // ... V8 operations
/// // Guard automatically calls exit() on drop
/// ```
struct IsolateGuard<'a> {
    context: &'a Context,
}

impl<'a> IsolateGuard<'a> {
    /// Create a new guard and enter the isolate
    fn new(context: &'a Context) -> Self {
        context.enter_isolate();
        Self { context }
    }
}

impl<'a> Drop for IsolateGuard<'a> {
    /// Automatically exit the isolate when the guard goes out of scope
    fn drop(&mut self) {
        self.context.exit_isolate();
    }
}

impl Context {
    /// 创建新的 Context
    ///
    /// # Arguments
    /// * `enable_extensions` - 是否启用扩展（crypto, encoding 等）
    /// * `enable_logging` - 是否启用操作日志输出
    /// * `random_seed` - 随机数种子（可选）。如果提供，所有随机数 API 将使用固定种子
    /// * `enable_node_compat` - 是否启用 Node.js 兼容层（require() 支持）
    /// * `fast_return` - 快速返回模式，函数return后立即返回不等待定时器
    pub fn new(
        enable_extensions: bool,
        enable_logging: bool,
        random_seed: Option<u32>,
        enable_node_compat: bool,
        fast_return: bool,
    ) -> PyResult<Self> {
        let storage = Rc::new(ResultStorage::new());

        // Use the new modular extension system
        let mut ext_options = crate::ext::ExtensionOptions::new(storage.clone())
            .with_logging(enable_logging)
            .with_extensions(enable_extensions);

        // Apply random seed if provided
        ext_options = if let Some(seed) = random_seed {
            ext_options.with_random_seed(seed as u64)
        } else {
            ext_options
        };

        // Apply Node.js compatibility if requested
        #[cfg(feature = "node_compat")]
        if enable_node_compat {
            ext_options = ext_options.with_node_compat(
                crate::node_compat::NodeCompatOptions::default()
            );
        }

        // Load extensions based on configuration
        let extensions = crate::ext::all_extensions(ext_options, false /* is_snapshot */);

        // Configure extension transpiler for TypeScript.
        // Required whenever deno_node is loaded (which is always when both
        // node_compat and deno_web_api features are on) because deno_node
        // extension files are TypeScript (.ts/.mjs with TS syntax).
        #[cfg(feature = "node_compat")]
        let extension_transpiler: Option<std::rc::Rc<dyn Fn(deno_core::ModuleName, deno_core::ModuleCodeString) -> Result<(deno_core::ModuleCodeString, Option<deno_core::SourceMapData>), deno_error::JsErrorBox>>> =
            Some(std::rc::Rc::new(crate::transpile::maybe_transpile_source));

        #[cfg(not(feature = "node_compat"))]
        let extension_transpiler: Option<std::rc::Rc<dyn Fn(deno_core::ModuleName, deno_core::ModuleCodeString) -> Result<(deno_core::ModuleCodeString, Option<deno_core::SourceMapData>), deno_error::JsErrorBox>>> = None;

        // Create module loader for ESM support
        #[cfg(feature = "node_compat")]
        let module_loader: std::rc::Rc<dyn deno_core::ModuleLoader> = if enable_node_compat {
            crate::module_loader::FileModuleLoader::new().into_rc()
        } else {
            std::rc::Rc::new(deno_core::NoopModuleLoader)
        };

        #[cfg(not(feature = "node_compat"))]
        let module_loader: std::rc::Rc<dyn deno_core::ModuleLoader> = std::rc::Rc::new(deno_core::NoopModuleLoader);

        let mut runtime = JsRuntime::new(RuntimeOptions {
            extensions,
            extension_transpiler,
            module_loader: Some(module_loader),
            ..Default::default()
        });

        // 获取 IsolateHandle 并存储到 OpState，用于 op_terminate_execution
        let isolate_handle = runtime.v8_isolate().thread_safe_handle();
        {
            let op_state = runtime.op_state();
            let mut op_state_mut = op_state.borrow_mut();
            op_state_mut.put(isolate_handle);

            // 添加 FastReturnMode 到 OpState
            op_state_mut.put(crate::ext::core::FastReturnMode::new(fast_return));

            // 初始化 deno_web 需要的权限系统
            #[cfg(feature = "deno_web_api")]
            {
                op_state_mut.put(create_allow_all_permissions());
            }
        }

        // DON'T access OpState or Isolate during construction
        // Store the seed and set it on first execution instead

        // DON'T load polyfill here - defer to first execution to avoid isolate conflicts

        // 创建独立的 Tokio Runtime
        // 这样 Context drop 时 runtime 也会被自动清理，进程可以正常退出
        let tokio_rt = tokio::runtime::Builder::new_current_thread()
            .enable_all()
            .build()
            .map_err(|e| pyo3::exceptions::PyRuntimeError::new_err(
                format!("Failed to create tokio runtime: {}", e)
            ))?;

        Ok(Context {
            runtime: RefCell::new(runtime),
            tokio_runtime: RefCell::new(tokio_rt),
            result_storage: storage,
            exec_count: RefCell::new(0),
            extensions_loaded: enable_extensions,
            logging_enabled: enable_logging,
            random_seed,
            fast_return,
        })
    }

    /// Load JavaScript extension initialization scripts
    ///
    /// This method loads all JS-based extensions (core, hook, random, XHR, protection)
    /// Should only be called once on first execution
    ///
    /// # DRY Improvement
    /// This eliminates code duplication between exec_script() and execute_js()
    fn load_js_extensions(&self, runtime: &mut JsRuntime) -> Result<()> {
        // Set logging flag before loading protection extension
        if self.logging_enabled {
            runtime
                .execute_script("<set_logging>", "globalThis.__NEVER_JSCORE_LOGGING__ = true;".to_string())
                .map_err(|e| anyhow!("Failed to set logging flag: {}", format_error(e.into())))?;
        }

        // Load core extension functions ($return, $exit, etc.)
        let core_init = crate::ext::core::get_init_js();
        runtime
            .execute_script("<init_core>", core_init.to_string())
            .map_err(|e| anyhow!("Failed to load core extension: {}", format_error(e.into())))?;

        // Load hook extension functions ($terminate, etc.)
        let hook_init = crate::ext::hook::get_init_js();
        runtime
            .execute_script("<init_hook>", hook_init.to_string())
            .map_err(|e| anyhow!("Failed to load hook extension: {}", format_error(e.into())))?;

        // Load random extension (override Math.random() with seeded RNG)
        let random_init = crate::ext::random::get_init_js();
        runtime
            .execute_script("<init_random>", random_init.to_string())
            .map_err(|e| anyhow!("Failed to load random extension: {}", format_error(e.into())))?;

        // Load XMLHttpRequest polyfill (fetch-based implementation)
        let xhr_init = crate::ext::xhr::get_init_js();
        runtime
            .execute_script("<init_xhr>", xhr_init.to_string())
            .map_err(|e| anyhow!("Failed to load XHR extension: {}", format_error(e.into())))?;

        // Load browser protection (hide Deno, make functions show [native code])
        let protection_init = crate::ext::protection::get_init_js();
        runtime
            .execute_script("<init_protection>", protection_init.to_string())
            .map_err(|e| anyhow!("Failed to load protection extension: {}", format_error(e.into())))?;

        Ok(())
    }

    /// Load polyfill on first execution
    /// 重新进入此 Context 的 Isolate
    ///
    /// 当存在多个 Context 实例时，V8 的 thread-local "current isolate" 可能指向错误的 isolate。
    /// 这个方法确保在执行任何 V8 操作前，正确的 isolate 是当前的。
    ///
    /// # Safety
    ///
    /// 这是一个 unsafe 操作，因为我们需要：
    /// 1. 从 RefCell 中获取原始指针
    /// 2. 调用 v8_isolate().enter() 来重新进入 isolate
    ///
    /// 但这是安全的，因为：
    /// - RefCell 确保了运行时的唯一性（通过 borrow_mut 检查）
    /// - 我们在同一个线程上操作
    /// - enter() 是可重入的（V8 文档保证）
    fn enter_isolate(&self) {
        unsafe {
            // SAFETY:
            // 1. runtime 被 RefCell 保护，as_ptr() 获取原始指针
            // 2. 我们立即解引用并调用 enter()，不存储指针
            // 3. enter() 本身是线程安全的（V8 保证）
            let runtime_ptr = self.runtime.as_ptr();
            let runtime = &mut *runtime_ptr;
            let isolate = runtime.v8_isolate();
            isolate.enter();
        }
    }

    /// 退出此 Context 的 Isolate
    ///
    /// 恢复之前的 isolate（如果有）。
    /// 应该在完成 V8 操作后调用。
    ///
    /// 重要：每个 enter_isolate() 都必须有对应的 exit_isolate()，
    /// 否则在 Context drop 时会导致 "Disposing the isolate that is entered" 错误。
    fn exit_isolate(&self) {
        unsafe {
            // SAFETY: 同 enter_isolate()
            let runtime_ptr = self.runtime.as_ptr();
            let runtime = &mut *runtime_ptr;
            let isolate = runtime.v8_isolate();
            isolate.exit();
        }
    }

    /// 执行脚本，将代码加入全局作用域（不返回值）
    ///
    /// 这个方法会直接执行代码并将定义的函数/变量加入全局作用域
    fn exec_script(&self, code: &str) -> Result<()> {
        // RAII guard ensures isolate.exit() is always called, even on panic
        let _guard = IsolateGuard::new(self);

        // Load extension init scripts on first execution
        let is_first_exec = *self.exec_count.borrow() == 0;
        if is_first_exec && self.extensions_loaded {
            let mut runtime = self.runtime.borrow_mut();
            self.load_js_extensions(&mut runtime)?;
            drop(runtime);
        }

        // 整个执行过程都需要在 Tokio runtime 上下文中，因为 JS 代码可能注册定时器
        let code_owned = code.to_string();

        // 使用 Context 自己的 tokio runtime，而不是全局的 thread_local runtime
        // 这样 Context drop 时 runtime 也会被清理，进程可以正常退出
        let tokio_rt = self.tokio_runtime.borrow();
        tokio_rt.block_on(async {
            let mut runtime = self.runtime.borrow_mut();

            // execute_script returns a v8::Global<v8::Value>
            // We let it drop immediately
            let _result = runtime
                .execute_script("<exec>", code_owned)
                .map_err(|e| anyhow!("{}", format_error(e.into())))?;
            // v8::Global drops here

            // Drain the microtask queue after exec_script.
            // Behavior matches ExecJS: process Promises / microtasks but never await timers.
            // Strategy: poll with a noop waker until the event loop returns Poll::Ready
            // (meaning the microtask queue is empty) or we hit the safety limit.
            // Poll::Pending means there are pending I/O or timer futures -- we stop there
            // so we never block waiting for setTimeout/setInterval.
            let waker = futures::task::noop_waker_ref();
            let mut cx = std::task::Context::from_waker(waker);
            for _ in 0..32 {
                match runtime.poll_event_loop(
                    &mut cx,
                    deno_core::PollEventLoopOptions {
                        wait_for_inspector: false,
                    },
                ) {
                    std::task::Poll::Ready(_) => break,   // microtask queue empty
                    std::task::Poll::Pending => break,    // only I/O or timers remain -- stop
                }
            }

            Ok::<(), anyhow::Error>(())
        })?;

        // 更新执行计数
        let mut count = self.exec_count.borrow_mut();
        *count += 1;

        // Trigger low memory notification every 100 executions to encourage GC
        if *count % 100 == 0 {
            // Request actual GC instead of meaningless black_box
            drop(count);
            let mut rt = self.runtime.borrow_mut();
            rt.v8_isolate().low_memory_notification();
        }

        Ok(())
        // RAII guard exits isolate here automatically
    }

    /// 执行 JavaScript 代码并返回结果
    ///
    /// 根据 auto_await 参数决定是否自动等待 Promise。
    /// 注意：这个方法用于求值，代码在IIFE中执行，不会影响全局作用域
    ///
    /// Early Return 机制：
    /// - 当 JS 调用 __neverjscore_return__(value) 时，会抛出 EarlyReturnError
    /// - 该错误会携带返回值并中断 JS 执行
    /// - Rust 侧通过 downcast 检测并提取返回值
    fn execute_js(&self, code: &str, auto_await: bool) -> Result<String> {
        // RAII guard ensures isolate.exit() is always called
        let _guard = IsolateGuard::new(self);

        // Load extension init scripts on first execution
        let is_first_exec = *self.exec_count.borrow() == 0;
        if is_first_exec && self.extensions_loaded {
            let mut runtime = self.runtime.borrow_mut();
            self.load_js_extensions(&mut runtime)?;
            drop(runtime); // Explicitly drop borrow
        }

        self.result_storage.clear();

        if auto_await {
            // 异步模式：自动等待 Promise
            // 使用 Context 自己的 tokio runtime，而不是全局的 thread_local runtime
            // 这样 Context drop 时 runtime 也会被清理，进程可以正常退出
            let tokio_rt = self.tokio_runtime.borrow();
            let result = tokio_rt.block_on(async {
                let mut runtime = self.runtime.borrow_mut();

                // 序列化代码
                let code_json = serde_json::to_string(code)
                    .map_err(|e| anyhow!("Failed to serialize code: {}", e))?;

                // 简化的包装：只需要 async 函数和结果存储
                let wrapped_code = format!(
                    r#"
                    (async function() {{
                        // 记录执行前的定时器 ID 基准
                        const __timerBaseId = setTimeout(() => {{}}, 0);
                        clearTimeout(__timerBaseId);

                        const code = {};
                        let __result;
                        let __error;

                        try {{
                            __result = await Promise.resolve(eval(code));
                        }} catch(e) {{
                            __error = e;
                        }}

                        // Cancel only timers created during this execution window.
                        // __timerBaseId was sampled before eval; __timerEndId is sampled now.
                        // This keeps cancellation O(timers created here) instead of O(all-time timer count).
                        const __timerEndId = setTimeout(() => {{}}, 0);
                        clearTimeout(__timerEndId);
                        for (let i = __timerBaseId; i <= __timerEndId; i++) {{
                            clearTimeout(i);
                            clearInterval(i);
                        }}

                        // 如果有错误，重新抛出
                        if (__error) {{
                            throw __error;
                        }}

                        if (__result === undefined) {{
                            __getDeno().core.ops.op_store_result("null");
                            return null;
                        }}

                        try {{
                            const json = JSON.stringify(__result);
                            __getDeno().core.ops.op_store_result(json);
                            return __result;
                        }} catch(e) {{
                            const str = JSON.stringify(String(__result));
                            __getDeno().core.ops.op_store_result(str);
                            return __result;
                        }}
                    }})()
                    "#,
                    code_json
                );

                // 执行脚本
                let execute_result = runtime.execute_script("<eval_async>", wrapped_code);

                // 检查是否是 EarlyReturnError
                match execute_result {
                    Err(e) => {
                        // 检查是否是早期返回
                        if self.result_storage.is_early_return() {
                            // 提前返回：直接返回存储的值
                            let result = self.result_storage.take()
                                .ok_or_else(|| anyhow!("Early return but no result stored"))?;
                            let mut count = self.exec_count.borrow_mut();
                            *count += 1;
                            return Ok(result);
                        }

                        // ⚠️ 检查是否是 terminate_execution 错误（fast_return 模式）
                        let error_msg = format!("{}", format_error(e.into()));
                        if error_msg.contains("execution terminated") {
                            // 恢复 isolate 状态，允许后续执行
                            runtime.v8_isolate().cancel_terminate_execution();

                            // fast_return 模式：如果结果已存储，直接返回
                            if let Some(result) = self.result_storage.take() {
                                let mut count = self.exec_count.borrow_mut();
                                *count += 1;
                                return Ok(result);
                            }
                        }

                        // 其他错误 - 格式化后返回
                        return Err(anyhow!("{}", error_msg));
                    }
                    Ok(result_handle) => {
                        // 正常执行，leak handle
                        std::mem::forget(result_handle);
                    }
                }

                // 使用 poll 循环代替 run_event_loop
                // 这样可以在结果存储后立即返回，不被残留定时器阻塞
                let mut last_error: Option<anyhow::Error> = None;

                loop {
                    // 每次循环检查结果是否已存储
                    if let Some(result) = self.result_storage.take() {
                        let mut count = self.exec_count.borrow_mut();
                        *count += 1;
                        return Ok(result);
                    }

                    // 检查 early return 标志
                    if self.result_storage.is_early_return() {
                        let result = self.result_storage.take()
                            .ok_or_else(|| anyhow!("Early return but no result stored"))?;
                        let mut count = self.exec_count.borrow_mut();
                        *count += 1;
                        return Ok(result);
                    }

                    // Poll event loop 一次
                    let poll_result = futures::future::poll_fn(|cx| {
                        runtime.poll_event_loop(
                            cx,
                            deno_core::PollEventLoopOptions {
                                wait_for_inspector: false,
                            },
                        )
                    }).await;

                    match poll_result {
                        Ok(()) => {
                            // Event loop 完成（没有更多任务）
                            break;
                        }
                        Err(e) => {
                            // 检查是否是 terminate_execution 错误
                            let error_msg = format!("{}", format_error(e.into()));
                            if error_msg.contains("execution terminated") {
                                runtime.v8_isolate().cancel_terminate_execution();
                                // 检查结果是否已存储
                                if let Some(result) = self.result_storage.take() {
                                    let mut count = self.exec_count.borrow_mut();
                                    *count += 1;
                                    return Ok(result);
                                }
                            }
                            last_error = Some(anyhow!("{}", error_msg));
                            break;
                        }
                    }
                }

                // 最后再检查一次结果
                if let Some(result) = self.result_storage.take() {
                    let mut count = self.exec_count.borrow_mut();
                    *count += 1;
                    return Ok(result);
                }

                // 如果有错误，返回错误
                if let Some(e) = last_error {
                    return Err(e);
                }

                // 正常完成但没有结果
                let result = self
                    .result_storage
                    .take()
                    .ok_or_else(|| anyhow!("No result stored after event loop"))?;

                let mut count = self.exec_count.borrow_mut();
                *count += 1;

                Ok(result)
            });

            result
            // RAII guard exits isolate here
        } else {
            // 同步模式：不等待 Promise
            let mut runtime = self.runtime.borrow_mut();

            let code_json = serde_json::to_string(code)
                .map_err(|e| anyhow!("Failed to serialize code: {}", e))?;

            let wrapped_code = format!(
                r#"
                (function() {{
                    // 记录执行前的定时器 ID 基准
                    const __timerBaseId = setTimeout(() => {{}}, 0);
                    clearTimeout(__timerBaseId);

                    const code = {};
                    let __result;
                    let __error;

                    try {{
                        __result = eval(code);
                    }} catch(e) {{
                        __error = e;
                    }}

                    // 清除所有定时器（包括 compile 期间创建的）
                    const __timerEndId = setTimeout(() => {{}}, 0);
                    clearTimeout(__timerEndId);
                    for (let i = 0; i <= __timerEndId + 1000; i++) {{
                        clearTimeout(i);
                        clearInterval(i);
                    }}

                    // 如果有错误，重新抛出
                    if (__error) {{
                        throw __error;
                    }}

                    if (__result === undefined) {{
                        __getDeno().core.ops.op_store_result("null");
                        return null;
                    }}
                    try {{
                        const json = JSON.stringify(__result);
                        __getDeno().core.ops.op_store_result(json);
                        return __result;
                    }} catch(e) {{
                        const str = JSON.stringify(String(__result));
                        __getDeno().core.ops.op_store_result(str);
                        return __result;
                    }}
                }})()
                "#,
                code_json
            );

            let execute_result = runtime.execute_script("<eval_sync>", wrapped_code);

            // 检查是否是 EarlyReturnError
            match execute_result {
                Err(e) => {
                    // 检查是否是早期返回
                    if self.result_storage.is_early_return() {
                        // 提前返回
                        let result = self.result_storage.take()
                            .ok_or_else(|| anyhow!("Early return but no result stored"))?;
                        let mut count = self.exec_count.borrow_mut();
                        *count += 1;
                        return Ok(result);
                    }

                    // ⚠️ 检查是否是 terminate_execution 错误
                    let error_msg = format!("{}", format_error(e.into()));
                    if error_msg.contains("execution terminated") {
                        // 恢复 isolate 状态，允许后续执行
                        runtime.v8_isolate().cancel_terminate_execution();
                    }

                    return Err(anyhow!("{}", error_msg));
                }
                Ok(result_handle) => {
                    std::mem::forget(result_handle);
                }
            }

            // 从 storage 获取结果
            let result = self
                .result_storage
                .take()
                .ok_or_else(|| anyhow!("No result stored"))?;

            let mut count = self.exec_count.borrow_mut();
            *count += 1;

            Ok(result)
            // RAII guard exits isolate here
        }
    }


    /// 请求垃圾回收
    fn request_gc(&self) -> Result<()> {
        let _guard = IsolateGuard::new(self);
        let mut runtime = self.runtime.borrow_mut();
        let _ =
            runtime.execute_script("<gc_hint>", "if (typeof gc === 'function') { gc(); } null;");
        Ok(())
    }

    /// 获取 V8 堆内存统计信息
    ///
    /// 返回当前 JavaScript 运行时的内存使用情况，包括总堆大小、已用大小等详细指标
    fn get_heap_stats(&self) -> Result<std::collections::HashMap<String, usize>> {
        let _guard = IsolateGuard::new(self);
        let mut runtime = self.runtime.borrow_mut();

        // 直接访问 V8 isolate 并获取堆统计信息
        let isolate = runtime.v8_isolate();
        let heap_stats = isolate.get_heap_statistics();

        let mut stats = std::collections::HashMap::new();
        stats.insert("total_heap_size".to_string(), heap_stats.total_heap_size());
        stats.insert("total_heap_size_executable".to_string(), heap_stats.total_heap_size_executable());
        stats.insert("total_physical_size".to_string(), heap_stats.total_physical_size());
        stats.insert("total_available_size".to_string(), heap_stats.total_available_size());
        stats.insert("used_heap_size".to_string(), heap_stats.used_heap_size());
        stats.insert("heap_size_limit".to_string(), heap_stats.heap_size_limit());
        stats.insert("malloced_memory".to_string(), heap_stats.malloced_memory());
        stats.insert("external_memory".to_string(), heap_stats.external_memory());
        stats.insert("peak_malloced_memory".to_string(), heap_stats.peak_malloced_memory());
        stats.insert("number_of_native_contexts".to_string(), heap_stats.number_of_native_contexts());
        stats.insert("number_of_detached_contexts".to_string(), heap_stats.number_of_detached_contexts());

        Ok(stats)
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
    ///
    ///     # 创建快速返回模式的上下文（适用于有定时器的JS代码）
    ///     ctx_fast = never_jscore.Context(fast_return=True)
    ///     # 函数return后立即返回，不等待setTimeout/setInterval
    ///     ```
    #[new]
    #[pyo3(signature = (enable_extensions=true, enable_logging=false, random_seed=None, enable_node_compat=false, fast_return=false))]
    fn py_new(
        enable_extensions: bool,
        enable_logging: bool,
        random_seed: Option<u32>,
        enable_node_compat: bool,
        fast_return: bool,
    ) -> PyResult<Self> {
        crate::runtime::ensure_v8_initialized();
        Self::new(enable_extensions, enable_logging, random_seed, enable_node_compat, fast_return)
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
    pub fn compile(&self, py: Python, code: String) -> PyResult<()> {
        // 使用SendPtr绕过Send约束，释放GIL提升多线程性能
        // 这是安全的，因为allow_threads不会跨线程执行代码，只是释放GIL
        let self_ptr = SendPtr(self as *const Context);
        py.allow_threads(move || {
            let ctx = unsafe { self_ptr.as_ref() };
            ctx.exec_script(&code)
        }).map_err(|e| PyException::new_err(format!("Compile error: {}", e)))?;
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
        // 准备参数（在持有GIL时）
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

        // 释放GIL执行JavaScript（提升多线程性能）
        let self_ptr = SendPtr(self as *const Context);
        let result_json = py.allow_threads(move || {
            let ctx = unsafe { self_ptr.as_ref() };
            ctx.execute_js(&call_code, auto_await.unwrap_or(true))
        }).map_err(|e| PyException::new_err(format!("Call error: {}", e)))?;

        // 转换结果（在持有GIL时）
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
            // 需要返回值：使用包装的execute_js，释放GIL
            let self_ptr = SendPtr(self as *const Context);
            let result_json = py.allow_threads(move || {
                let ctx = unsafe { self_ptr.as_ref() };
                ctx.execute_js(&code, auto_await.unwrap_or(true))
            }).map_err(|e| PyException::new_err(format!("Eval error: {}", e)))?;

            let result: JsonValue = serde_json::from_str(&result_json)
                .map_err(|e| PyException::new_err(format!("JSON parse error: {}", e)))?;

            json_to_python(py, &result)
        } else {
            // 不需要返回值：直接执行脚本，释放GIL
            let self_ptr = SendPtr(self as *const Context);
            py.allow_threads(move || {
                let ctx = unsafe { self_ptr.as_ref() };
                ctx.exec_script(&code)
            }).map_err(|e| PyException::new_err(format!("Eval error: {}", e)))?;

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
        // 释放GIL执行JavaScript（提升多线程性能）
        let self_ptr = SendPtr(self as *const Context);
        let result_json = py.allow_threads(move || {
            let ctx = unsafe { self_ptr.as_ref() };
            ctx.execute_js(&code, auto_await.unwrap_or(true))
        }).map_err(|e| PyException::new_err(format!("Evaluate error: {}", e)))?;

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

    /// 获取 V8 堆内存统计信息
    ///
    /// 返回当前 JavaScript 运行时的详细内存使用情况。
    /// 所有大小值以字节为单位。
    ///
    /// Returns:
    ///     字典，包含以下键：
    ///     - total_heap_size: V8 分配的总堆大小（字节）
    ///     - total_heap_size_executable: 可执行堆的总大小（字节）
    ///     - total_physical_size: 实际占用的物理内存（字节）
    ///     - total_available_size: 可用堆大小（字节）
    ///     - used_heap_size: 当前已使用的堆大小（字节）
    ///     - heap_size_limit: 配置的堆大小限制（字节）
    ///     - malloced_memory: 通过 malloc 分配的内存（字节）
    ///     - external_memory: 外部对象使用的内存（字节）
    ///     - peak_malloced_memory: malloc 内存使用峰值（字节）
    ///     - number_of_native_contexts: 原生 V8 上下文数量
    ///     - number_of_detached_contexts: 已分离的上下文数量
    ///
    /// Example:
    ///     ```python
    ///     import never_jscore
    ///
    ///     ctx = never_jscore.Context()
    ///
    ///     # 执行一些 JS 代码
    ///     ctx.evaluate("let arr = new Array(1000000).fill(0)")
    ///
    ///     # 获取内存统计
    ///     stats = ctx.get_heap_statistics()
    ///     print(f"使用内存: {stats['used_heap_size'] / 1024 / 1024:.2f} MB")
    ///     print(f"总堆大小: {stats['total_heap_size'] / 1024 / 1024:.2f} MB")
    ///     print(f"堆使用率: {stats['used_heap_size'] / stats['total_heap_size'] * 100:.1f}%")
    ///     print(f"堆限制: {stats['heap_size_limit'] / 1024 / 1024:.2f} MB")
    ///
    ///     # 监控内存变化
    ///     before = ctx.get_heap_statistics()
    ///     ctx.evaluate("let big = new Array(10000000).fill(0)")
    ///     after = ctx.get_heap_statistics()
    ///     increase = after['used_heap_size'] - before['used_heap_size']
    ///     print(f"内存增加: {increase / 1024 / 1024:.2f} MB")
    ///     ```
    fn get_heap_statistics(&self, py: Python) -> PyResult<Py<PyDict>> {
        let stats = self.get_heap_stats()
            .map_err(|e| PyException::new_err(format!("Failed to get heap statistics: {}", e)))?;

        let dict = PyDict::new(py);
        for (key, value) in stats {
            dict.set_item(key, value)?;
        }

        Ok(dict.into())
    }

    /// 导出 V8 堆快照到文件
    ///
    /// 导出完整的堆内存快照，可以用 Chrome DevTools 加载分析。
    /// 这对于查找内存泄漏、分析对象引用关系、提取加密密钥等逆向工程任务非常有用。
    ///
    /// Args:
    ///     file_path: 快照文件保存路径（推荐使用 .heapsnapshot 扩展名）
    ///
    /// Example:
    ///     ```python
    ///     import never_jscore
    ///
    ///     ctx = never_jscore.Context()
    ///
    ///     # 执行包含敏感数据的 JS 代码
    ///     ctx.evaluate("""
    ///         let config = {
    ///             apiKey: 'secret_key_12345',
    ///             encryptionKey: 'aes_key_67890'
    ///         };
    ///         let data = encrypt(config);
    ///     """)
    ///
    ///     # 导出堆快照
    ///     ctx.take_heap_snapshot("memory.heapsnapshot")
    ///
    ///     # 使用 Chrome DevTools 分析：
    ///     # 1. 打开 Chrome -> F12 -> Memory 标签
    ///     # 2. 点击 "Load" 按钮
    ///     # 3. 选择 memory.heapsnapshot 文件
    ///     # 4. 在搜索框搜索 "secret_key" 或 "apiKey" 找到对象
    ///     # 5. 查看对象的引用链，了解数据流向
    ///     ```
    ///
    /// Tips:
    ///     - 快照文件是 JSON 格式，但可能很大（几十 MB）
    ///     - 可以对比两个快照找内存泄漏（before/after）
    ///     - 搜索已知字符串可以快速定位关键对象
    ///     - 查看对象的 Retainers 了解为什么对象没有被回收
    fn take_heap_snapshot(&self, file_path: String) -> PyResult<()> {
        use std::io::Write;

        let _guard = IsolateGuard::new(self);
        let mut runtime = self.runtime.borrow_mut();
        let isolate = runtime.v8_isolate();

        // 创建输出文件
        let file = std::fs::File::create(&file_path)
            .map_err(|e| PyException::new_err(format!("Cannot create file '{}': {}", file_path, e)))?;

        let mut writer = std::io::BufWriter::new(file);

        // V8 会分多次调用回调函数，每次传递一块快照数据
        isolate.take_heap_snapshot(|chunk: &[u8]| {
            writer.write_all(chunk).is_ok()
        });

        // 确保所有数据写入磁盘
        writer.flush()
            .map_err(|e| PyException::new_err(format!("Failed to write snapshot: {}", e)))?;

        Ok(())
    }

    /// 获取 Hook 拦截的数据
    ///
    /// 当 JavaScript 调用 __saveAndTerminate__() 或 $terminate() 时，
    /// 数据会保存到全局存储中。使用此方法可以在 JS 被终止后获取保存的数据。
    ///
    /// Returns:
    ///     Option<String>: 如果有保存的数据则返回 JSON 字符串，否则返回 None
    ///
    /// Example:
    ///     ```python
    ///     import never_jscore
    ///     import json
    ///
    ///     ctx = never_jscore.Context()
    ///
    ///     # Hook XMLHttpRequest.send
    ///     hook_code = '''
    ///         XMLHttpRequest.prototype.send = function(body) {
    ///             __saveAndTerminate__({
    ///                 url: this._url,
    ///                 body: body,
    ///                 timestamp: Date.now()
    ///             });
    ///         };
    ///     '''
    ///     ctx.compile(hook_code)
    ///
    ///     # 执行会触发 Hook 的代码
    ///     try:
    ///         ctx.evaluate('''
    ///             const xhr = new XMLHttpRequest();
    ///             xhr.open('POST', '/api/login');
    ///             xhr.send('{"user":"admin"}');  // 触发 Hook
    ///         ''')
    ///     except Exception as e:
    ///         # JS 被 terminate，会抛出异常
    ///         print(f"JS terminated: {e}")
    ///
    ///     # 获取 Hook 拦截的数据
    ///     hook_data = ctx.get_hook_data()
    ///     if hook_data:
    ///         data = json.loads(hook_data)
    ///         print(f"Intercepted URL: {data['url']}")
    ///         print(f"Intercepted Body: {data['body']}")
    ///     ```
    fn get_hook_data(&self) -> Option<String> {
        crate::storage::get_hook_data()
    }

    /// 清空保存的 Hook 数据
    ///
    /// 在开始新的 JS 执行前调用，避免读取到旧数据。
    ///
    /// Example:
    ///     ```python
    ///     ctx = never_jscore.Context()
    ///
    ///     # 清空之前的数据
    ///     ctx.clear_hook_data()
    ///
    ///     # 执行新的 Hook 拦截
    ///     try:
    ///         ctx.evaluate('...')
    ///     except:
    ///         pass
    ///
    ///     # 获取新的数据
    ///     data = ctx.get_hook_data()
    ///     ```
    fn clear_hook_data(&self) {
        crate::storage::clear_hook_data();
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
