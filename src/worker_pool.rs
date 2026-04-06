//! Worker Pool - 持久化Worker线程池
//!
//! 核心功能：
//! - 管理多个持久化的Worker线程
//! - 每个Worker持有一个预加载了JS代码的JsRuntime
//! - Worker永久存活，重复使用，避免重复加载JS代码
//! - 通过Channel队列分发任务到空闲Worker
//!
//! 解决的问题：
//! - V8 Isolate不能跨线程传输
//! - JS代码重复加载导致性能低下
//! - 多线程场景下的资源复用

use tokio::sync::{mpsc, oneshot};
use std::sync::{Arc, Mutex};
use std::thread;
use std::rc::Rc;
use serde_json::Value as JsonValue;
use deno_core::{JsRuntime, RuntimeOptions, PollEventLoopOptions};
use anyhow::Result;

use crate::ext::{ExtensionOptions, all_extensions};
use crate::storage::{ResultStorage, WorkerId, get_hook_data_for_worker, clear_hook_data_for_worker};
use crate::runtime::ensure_v8_initialized;

#[cfg(feature = "node_compat")]
use crate::node_compat::NodeCompatOptions;

/// 任务类型
#[derive(Debug)]
pub enum TaskType {
    /// 执行代码片段
    Execute {
        code: String,
    },
    /// 调用已定义的函数
    Call {
        func_name: String,
        args: Vec<JsonValue>,
    },
}

/// 任务定义
pub struct Task {
    pub task_type: TaskType,
    pub tx: oneshot::Sender<Result<JsonValue, String>>,
}

/// Worker池配置
#[derive(Clone)]
pub struct WorkerPoolConfig {
    /// Worker数量
    pub worker_count: usize,
    /// 初始化代码（只在Worker启动时加载一次）
    pub init_code: Option<String>,
    /// 启用Web API扩展
    pub enable_extensions: bool,
    /// 启用调试日志
    pub enable_logging: bool,
    /// 随机数种子
    pub random_seed: Option<u32>,
    /// 启用Node.js兼容
    pub enable_node_compat: bool,
    /// 快速返回模式：函数return后立即返回，不等待定时器
    /// 对于有setInterval/setTimeout的JS代码很有用
    pub fast_return: bool,
    /// Node.js兼容选项
    #[cfg(feature = "node_compat")]
    pub node_compat_options: Option<NodeCompatOptions>,
}

impl Default for WorkerPoolConfig {
    fn default() -> Self {
        Self {
            worker_count: std::thread::available_parallelism()
                .map(|n| n.get())
                .unwrap_or(4),
            init_code: None,
            enable_extensions: true,
            enable_logging: false,
            random_seed: None,
            enable_node_compat: false,
            fast_return: false,  // 默认关闭，保持原有行为
            #[cfg(feature = "node_compat")]
            node_compat_options: None,
        }
    }
}

/// Worker池
pub struct WorkerPool {
    task_tx: mpsc::UnboundedSender<Task>,
    worker_count: usize,
    _handles: Vec<thread::JoinHandle<()>>,
}

impl WorkerPool {
    /// 创建Worker池
    pub fn new(config: WorkerPoolConfig) -> Result<Self, String> {
        // 确保V8已初始化
        ensure_v8_initialized();

        let (task_tx, task_rx) = mpsc::unbounded_channel::<Task>();
        let task_rx = Arc::new(Mutex::new(task_rx));

        let mut handles = Vec::new();

        for worker_id in 0..config.worker_count {
            let rx = Arc::clone(&task_rx);
            let cfg = config.clone();

            let handle = thread::Builder::new()
                .name(format!("jscore_worker_{}", worker_id))
                .spawn(move || {
                    worker_main(worker_id, rx, cfg);
                })
                .map_err(|e| format!("Failed to spawn worker {}: {}", worker_id, e))?;

            handles.push(handle);
        }

        Ok(WorkerPool {
            task_tx,
            worker_count: config.worker_count,
            _handles: handles,
        })
    }

    /// 提交任务到Worker池
    pub fn submit(&self, task: Task) -> Result<(), String> {
        self.task_tx
            .send(task)
            .map_err(|_| "Worker pool has been closed".to_string())
    }

    /// 获取Worker数量
    pub fn worker_count(&self) -> usize {
        self.worker_count
    }
}

impl Drop for WorkerPool {
    fn drop(&mut self) {
        // 关闭Channel，通知所有Worker退出
        // 当task_tx被drop时，所有Worker的recv()会返回None
    }
}

/// Worker线程主函数
fn worker_main(
    worker_id: usize,
    task_rx: Arc<Mutex<mpsc::UnboundedReceiver<Task>>>,
    config: WorkerPoolConfig,
) {
    if config.enable_logging {
        eprintln!("[Worker {}] Starting...", worker_id);
    }

    // 创建线程本地的Tokio runtime
    let rt = match tokio::runtime::Builder::new_current_thread()
        .enable_all()
        .build()
    {
        Ok(rt) => rt,
        Err(e) => {
            eprintln!("[Worker {}] Failed to create tokio runtime: {}", worker_id, e);
            return;
        }
    };

    rt.block_on(async move {
        // 创建并初始化JsRuntime（只创建一次！）
        let (mut js_runtime, result_storage) = match create_and_init_runtime(worker_id, &config).await {
            Ok((runtime, storage)) => (runtime, storage),
            Err(e) => {
                eprintln!("[Worker {}] Failed to initialize runtime: {}", worker_id, e);
                return;
            }
        };

        if config.enable_logging {
            eprintln!("[Worker {}] Ready to process tasks", worker_id);
        }

        // 任务处理循环
        let mut task_count = 0usize;
        loop {
            // 从队列获取任务
            let task = {
                let mut rx_guard = task_rx.lock().unwrap();
                rx_guard.recv().await
            };

            match task {
                Some(task) => {
                    task_count += 1;

                    // 执行任务
                    let result = execute_task(&mut js_runtime, &result_storage, worker_id, task.task_type, &config).await;

                    // 发送结果（忽略接收方已关闭的错误）
                    let _ = task.tx.send(result);

                    // 定期GC
                    if task_count % 100 == 0 {
                        js_runtime.v8_isolate().low_memory_notification();

                        if config.enable_logging {
                            eprintln!("[Worker {}] Processed {} tasks (GC triggered)", worker_id, task_count);
                        }
                    }
                }
                None => {
                    // Channel关闭，退出
                    if config.enable_logging {
                        eprintln!("[Worker {}] Shutting down (processed {} tasks)", worker_id, task_count);
                    }
                    break;
                }
            }
        }
    });
}

/// 创建并初始化Runtime
async fn create_and_init_runtime(
    worker_id: usize,
    config: &WorkerPoolConfig,
) -> Result<(JsRuntime, Rc<ResultStorage>), String> {
    // 创建ResultStorage
    let storage = Rc::new(ResultStorage::new());

    // 构建ExtensionOptions
    let mut ext_options = ExtensionOptions {
        enable_logging: config.enable_logging,
        random_seed: config.random_seed.map(|s| s as u64),
        enable_extensions: config.enable_extensions,
        storage: storage.clone(),  // Clone the Rc so we can return it later
        #[cfg(feature = "deno_web_api")]
        permissions: None,
        #[cfg(feature = "deno_web_api")]
        blob_store: None,
        #[cfg(feature = "node_compat")]
        enable_node_compat: config.enable_node_compat,
        #[cfg(feature = "node_compat")]
        node_compat_options: config.node_compat_options.clone(),
    };

    // 添加permissions和blob_store
    #[cfg(feature = "deno_web_api")]
    {
        ext_options.permissions = Some(crate::permissions::create_allow_all_permissions());
        ext_options.blob_store = Some(std::sync::Arc::new(deno_web::BlobStore::default()));
    }

    // 获取所有extensions
    let extensions = all_extensions(ext_options, false);

    // Always enable TypeScript transpiler when node_compat feature is on,
    // because deno_node is now always loaded and its extension files are TypeScript.
    #[cfg(feature = "node_compat")]
    let extension_transpiler: Option<std::rc::Rc<dyn Fn(deno_core::ModuleName, deno_core::ModuleCodeString) -> Result<(deno_core::ModuleCodeString, Option<deno_core::SourceMapData>), deno_error::JsErrorBox>>> =
        Some(std::rc::Rc::new(crate::transpile::maybe_transpile_source));

    #[cfg(not(feature = "node_compat"))]
    let extension_transpiler: Option<std::rc::Rc<dyn Fn(deno_core::ModuleName, deno_core::ModuleCodeString) -> Result<(deno_core::ModuleCodeString, Option<deno_core::SourceMapData>), deno_error::JsErrorBox>>> = None;

    // Create module loader for ESM support
    #[cfg(feature = "node_compat")]
    let module_loader: std::rc::Rc<dyn deno_core::ModuleLoader> = if config.enable_node_compat {
        crate::module_loader::FileModuleLoader::new().into_rc()
    } else {
        std::rc::Rc::new(deno_core::NoopModuleLoader)
    };

    #[cfg(not(feature = "node_compat"))]
    let module_loader: std::rc::Rc<dyn deno_core::ModuleLoader> = std::rc::Rc::new(deno_core::NoopModuleLoader);

    // 创建RuntimeOptions
    let runtime_options = RuntimeOptions {
        extensions,
        extension_transpiler,
        module_loader: Some(module_loader),
        ..Default::default()
    };

    // 创建JsRuntime
    let mut runtime = JsRuntime::new(runtime_options);

    // NOTE: __bootstrap.ext_node_nodeGlobals and ext_node_denoGlobals are now
    // initialized by the node_bootstrap extension's global_object_middleware,
    // which runs during JsRuntime::new() BEFORE ESM modules are loaded.
    // See src/ext/node_bootstrap.rs for the implementation.

    // 将 IsolateHandle 和 worker_id 存入 OpState
    {
        let isolate_handle = runtime.v8_isolate().thread_safe_handle();
        let op_state = runtime.op_state();
        let mut op_state_mut = op_state.borrow_mut();
        op_state_mut.put(isolate_handle);  // 供 op_terminate_execution 使用
        op_state_mut.put(WorkerId(worker_id));  // 供 op_save_hook_data 使用

        // 设置快速返回模式
        op_state_mut.put(crate::ext::core::FastReturnMode::new(config.fast_return));

        // 初始化 deno_web 需要的权限系统
        #[cfg(feature = "deno_web_api")]
        {
            op_state_mut.put(crate::permissions::create_allow_all_permissions());
        }
    }

    // 加载扩展的 JavaScript 初始化代码（$terminate 等函数）
    if config.enable_extensions {
        // Load core extension functions ($return, $exit, etc.)
        let core_init = crate::ext::core::get_init_js();
        runtime
            .execute_script("<init_core>", core_init.to_string())
            .map_err(|e| format!("Failed to load core extension: {}", e))?;

        // Load hook extension functions ($terminate, etc.)
        let hook_init = crate::ext::hook::get_init_js();
        runtime
            .execute_script("<init_hook>", hook_init.to_string())
            .map_err(|e| format!("Failed to load hook extension: {}", e))?;

        if config.enable_logging {
            eprintln!("[Worker {}] Loaded extension JavaScript", worker_id);
        }
    }

    // 如果有初始化代码，加载它（只加载一次！）
    if let Some(init_code) = &config.init_code {
        if config.enable_logging {
            eprintln!(
                "[Worker {}] Loading init code ({} bytes)...",
                worker_id,
                init_code.len()
            );
        }

        // 执行初始化代码
        runtime
            .execute_script("<pool_init>", init_code.clone())
            .map_err(|e| format!("Init code error: {}", e))?;

        // 初始化阶段：只处理微任务，不等待宏任务（定时器等）
        // 使用 poll 模式快速处理 Promise，但不阻塞等待定时器
        {
            let waker = futures::task::noop_waker_ref();
            let mut cx = std::task::Context::from_waker(waker);
            // 多次 poll 以处理微任务队列
            for _ in 0..10 {
                let _ = runtime.poll_event_loop(
                    &mut cx,
                    PollEventLoopOptions {
                        wait_for_inspector: false,
                    },
                );
            }
        }

        if config.enable_logging {
            eprintln!("[Worker {}] Init code loaded successfully", worker_id);
        }
    }

    Ok((runtime, storage))
}

/// 执行任务
async fn execute_task(
    runtime: &mut JsRuntime,
    result_storage: &Rc<ResultStorage>,
    worker_id: usize,
    task_type: TaskType,
    config: &WorkerPoolConfig,
) -> Result<JsonValue, String> {
    match task_type {
        TaskType::Execute { code } => {
            // 清空之前的结果
            result_storage.clear();

            // 序列化代码
            let code_json = serde_json::to_string(&code)
                .map_err(|e| format!("Failed to serialize code: {}", e))?;

            // 包装代码以使用 op_store_result
            let wrapped_code = format!(
                r#"
                (async function() {{
                    const code = {};
                    const __result = await Promise.resolve(eval(code));

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

            // 执行包装后的代码
            let execute_result = runtime.execute_script("<pool_exec>", wrapped_code);

            match execute_result {
                Err(e) => {
                    // 检查是否是 terminate_execution 错误（hook场景）
                    let error_msg = format_js_error(*e);
                    if error_msg.contains("execution terminated") {
                        // 恢复 isolate 状态，允许 Worker 继续处理后续任务
                        runtime.v8_isolate().cancel_terminate_execution();

                        if config.enable_logging {
                            eprintln!("[Worker {}] Execution terminated (hook), isolate recovered", worker_id);
                        }

                        // 检查是否有 hook data
                        if let Some(hook_data) = get_hook_data_for_worker(worker_id) {
                            // 立即清空，避免被下一个任务覆盖
                            clear_hook_data_for_worker(worker_id);

                            if config.enable_logging {
                                eprintln!("[Worker {}] Hook data detected, returning with data", worker_id);
                            }

                            // 直接返回 hook data，不需要 Python 再次调用
                            let hook_json: JsonValue = serde_json::from_str(&hook_data)
                                .map_err(|e| format!("Failed to parse hook data: {}", e))?;

                            return Ok(serde_json::json!({
                                "__hook__": true,
                                "worker_id": worker_id,
                                "data": hook_json
                            }));
                        }
                    }
                    return Err(error_msg);
                }
                Ok(result_handle) => {
                    // Forget the result handle - we'll get the result from storage
                    std::mem::forget(result_handle);
                }
            }

            // 运行事件循环 - op_store_result 会在结果存储后自动终止执行
            // 这样即使有定时器，函数 return 后也会立即返回
            let event_loop_result = runtime
                .run_event_loop(PollEventLoopOptions::default())
                .await;

            // 检查事件循环结果
            if let Err(e) = event_loop_result {
                let error_msg = format!("Event loop error: {}", e);
                if error_msg.contains("execution terminated") {
                    // 正常情况：op_store_result 触发的终止，恢复 isolate 状态
                    runtime.v8_isolate().cancel_terminate_execution();

                    // 检查是否有 hook data（$terminate 场景）
                    if let Some(hook_data) = get_hook_data_for_worker(worker_id) {
                        clear_hook_data_for_worker(worker_id);
                        let hook_json: JsonValue = serde_json::from_str(&hook_data)
                            .map_err(|e| format!("Failed to parse hook data: {}", e))?;
                        return Ok(serde_json::json!({
                            "__hook__": true,
                            "worker_id": worker_id,
                            "data": hook_json
                        }));
                    }
                    // 不是 hook，是正常的结果返回终止，继续获取结果
                } else {
                    return Err(error_msg);
                }
            }

            // 从 storage 获取结果
            let json_str = result_storage
                .take()
                .ok_or_else(|| "No result stored after event loop".to_string())?;

            // 解析 JSON 字符串为 JsonValue
            serde_json::from_str(&json_str)
                .map_err(|e| format!("Failed to parse result JSON: {}", e))
        }

        TaskType::Call { func_name, args } => {
            // 清空之前的结果
            result_storage.clear();

            // 构造函数调用代码
            let args_json = serde_json::to_string(&args)
                .map_err(|e| format!("Failed to serialize args: {}", e))?;

            // 包装函数调用以使用 op_store_result
            let wrapped_code = format!(
                r#"
                (async function() {{
                    const __result = await Promise.resolve({}(...{}));

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
                func_name, args_json
            );

            if config.enable_logging {
                eprintln!("[Worker] Calling: {}(...{})", func_name, args_json);
            }

            // 执行调用
            let execute_result = runtime.execute_script("<pool_call>", wrapped_code);

            match execute_result {
                Err(e) => {
                    // 检查是否是 terminate_execution 错误（hook场景或结果返回）
                    let error_msg = format_js_error(*e);
                    if error_msg.contains("execution terminated") {
                        // 恢复 isolate 状态，允许 Worker 继续处理后续任务
                        runtime.v8_isolate().cancel_terminate_execution();

                        // 检查是否有 hook data
                        if let Some(hook_data) = get_hook_data_for_worker(worker_id) {
                            clear_hook_data_for_worker(worker_id);
                            let hook_json: JsonValue = serde_json::from_str(&hook_data)
                                .map_err(|e| format!("Failed to parse hook data: {}", e))?;
                            return Ok(serde_json::json!({
                                "__hook__": true,
                                "worker_id": worker_id,
                                "data": hook_json
                            }));
                        }

                        // 检查是否有结果存储（op_store_result 触发的终止）
                        if result_storage.has_result() {
                            let json_str = result_storage.take().unwrap();
                            return serde_json::from_str(&json_str)
                                .map_err(|e| format!("Failed to parse result JSON: {}", e));
                        }
                    }
                    return Err(error_msg);
                }
                Ok(result_handle) => {
                    std::mem::forget(result_handle);
                }
            }

            // 运行事件循环 - op_store_result 会在结果存储后自动终止执行
            let event_loop_result = runtime
                .run_event_loop(PollEventLoopOptions::default())
                .await;

            if let Err(e) = event_loop_result {
                let error_msg = format!("Event loop error: {}", e);
                if error_msg.contains("execution terminated") {
                    runtime.v8_isolate().cancel_terminate_execution();

                    // 检查是否有 hook data
                    if let Some(hook_data) = get_hook_data_for_worker(worker_id) {
                        clear_hook_data_for_worker(worker_id);
                        let hook_json: JsonValue = serde_json::from_str(&hook_data)
                            .map_err(|e| format!("Failed to parse hook data: {}", e))?;
                        return Ok(serde_json::json!({
                            "__hook__": true,
                            "worker_id": worker_id,
                            "data": hook_json
                        }));
                    }
                    // 正常的结果返回终止，继续获取结果
                } else {
                    return Err(error_msg);
                }
            }

            // 从 storage 获取结果
            let json_str = result_storage
                .take()
                .ok_or_else(|| "No result stored after event loop".to_string())?;

            serde_json::from_str(&json_str)
                .map_err(|e| format!("Failed to parse result JSON: {}", e))
        }
    }
}

/// 格式化JavaScript错误
fn format_js_error(error: deno_core::error::JsError) -> String {
    let mut output = String::new();

    // 错误类型和消息
    if let Some(name) = &error.name {
        output.push_str(name);
        output.push_str(": ");
    }
    if let Some(message) = &error.message {
        output.push_str(message);
    }
    output.push('\n');

    // 堆栈信息
    if let Some(stack) = &error.stack {
        let stack_lines: Vec<&str> = stack.lines().collect();
        for (i, line) in stack_lines.iter().enumerate() {
            if i == 0 && (line.contains(&error.name.as_deref().unwrap_or("")) ||
                         line.contains(&error.message.as_deref().unwrap_or(""))) {
                continue; // 跳过重复的错误消息
            }

            let cleaned = line.trim();
            if !cleaned.is_empty() {
                output.push_str("  ");
                output.push_str(cleaned);
                output.push('\n');
            }
        }
    }

    output
}
