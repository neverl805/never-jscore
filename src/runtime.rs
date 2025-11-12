use std::cell::RefCell;
use std::sync::OnceLock;

/// 全局 V8 平台初始化标志
///
/// V8 平台只能初始化一次，使用 OnceLock 确保线程安全。
static V8_INITIALIZED: OnceLock<()> = OnceLock::new();

/// 线程本地 Tokio Runtime
///
/// 每个线程有自己独立的单线程 Tokio runtime。
/// 这样可以避免多线程 runtime 带来的线程安全问题，
/// 同时允许多个 Python 线程并行执行各自的 Context。
thread_local! {
    static TOKIO_RUNTIME: RefCell<Option<tokio::runtime::Runtime>> = RefCell::new(None);
}

/// 确保 V8 平台已初始化
///
/// 这个函数是幂等的，可以多次调用，但只会初始化一次。
/// 必须在创建任何 JsRuntime 之前调用。
///
/// # 多线程支持
///
/// V8 平台是全局单例，多个 Isolate 可以共存。
/// 每个线程有独立的单线程 Tokio runtime，避免线程安全问题。
///
/// 使用模式：
/// - 每个线程创建独立的 Context
/// - 不同线程的 Context 可以并行执行
/// - 单个 Context 不应跨线程共享（V8 Isolate 限制）
pub fn ensure_v8_initialized() {
    // 初始化 V8 平台（全局只执行一次）
    V8_INITIALIZED.get_or_init(|| {
        deno_core::JsRuntime::init_platform(None, false);
    });
}

/// 在当前线程的 Tokio Runtime 上执行异步代码
///
/// 每个线程有自己独立的单线程 Tokio runtime。
/// 这样可以避免多线程调度器带来的 RefCell 问题。
///
/// # 线程安全
///
/// 使用 thread_local! 确保每个 OS 线程有独立的 runtime。
/// 多个 Python 线程可以并行运行，每个使用自己的 runtime。
pub fn run_with_tokio<F, R>(f: F) -> R
where
    F: std::future::Future<Output = R>,
{
    TOKIO_RUNTIME.with(|cell| {
        // 如果当前线程还没有 runtime，创建一个
        if cell.borrow().is_none() {
            let rt = tokio::runtime::Builder::new_current_thread()
                .enable_all()
                .build()
                .expect("Failed to create tokio runtime");

            cell.borrow_mut().replace(rt);
        }

        // 使用 runtime 执行异步代码
        let rt_ref = cell.borrow();
        let rt = rt_ref.as_ref().expect("Runtime should be initialized");
        rt.block_on(f)
    })
}
