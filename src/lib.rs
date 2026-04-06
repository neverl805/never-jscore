mod context;
mod convert;
mod ops;
mod runtime;
mod storage;
mod early_return;
mod ext;
mod node_compat;
mod module_loader;
mod worker_pool;
mod engine;

#[cfg(feature = "deno_web_api")]
mod permissions;

#[cfg(feature = "node_compat")]
mod transpile;

use pyo3::prelude::*;
use std::sync::Once;

use context::Context;
use engine::JSEngine;

// V8 platform initialization - must happen exactly once
static INIT: Once = Once::new();

fn ensure_v8_initialized() {
    INIT.call_once(|| {
        // Initialize V8 platform (required before creating any isolates)
        deno_core::JsRuntime::init_platform(None);

        // Initialize rustls CryptoProvider for HTTPS support
        #[cfg(feature = "deno_web_api")]
        {
            let _ = rustls::crypto::ring::default_provider().install_default();
        }
    });
}

/// never_jscore Python 模块
///
/// v3.0架构重构：
/// - JSEngine (新): 推荐用于多线程场景，JS代码只加载一次
/// - Context (保留): 向后兼容API
///
/// Example:
///     ```python
///     import never_jscore
///
///     # 方式1: 新API - JSEngine (推荐)
///     engine = never_jscore.JSEngine("""
///         function encrypt(data) {
///             return btoa(JSON.stringify(data));
///         }
///     """, workers=4)
///     result = engine.call("encrypt", ["hello"])
///
///     # 方式2: 旧API - Context (向后兼容)
///     ctx = never_jscore.Context()
///     ctx.compile("function add(a, b) { return a + b; }")
///     result = ctx.call("add", [1, 2])
///     ```
#[pymodule]
fn never_jscore(m: &Bound<'_, PyModule>) -> PyResult<()> {
    // Initialize V8 platform when module is first imported
    ensure_v8_initialized();

    // 导出新API - JSEngine (v3.0推荐)
    m.add_class::<JSEngine>()?;

    // 导出旧API - Context (向后兼容)
    m.add_class::<Context>()?;

    Ok(())
}
