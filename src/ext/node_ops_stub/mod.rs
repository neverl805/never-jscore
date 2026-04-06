// Stub ops for deno_node compatibility
// These ops are from Deno RUNTIME (not deno_node) that deno_node's polyfills expect

use deno_core::op2;
use deno_core::OpState;
use deno_error::JsErrorBox;

/// Returns the color depth of the terminal (stub: always 24-bit)
#[op2(fast)]
pub fn op_bootstrap_color_depth() -> i32 {
    24
}

/// Get unstable args (stub: empty array)
#[op2]
#[serde]
pub fn op_bootstrap_unstable_args() -> Vec<String> {
    vec![]
}

/// Check if we can write vectored (stub: false)
#[op2(fast)]
pub fn op_can_write_vectored(_state: &mut OpState, #[smi] _rid: u32) -> bool {
    false
}

/// Raw write vectored (stub: returns 0)
#[op2(fast)]
#[smi]
pub fn op_raw_write_vectored(
    _state: &mut OpState,
    #[smi] _rid: u32,
    #[buffer] _buf: &[u8],
) -> u32 {
    0
}

/// Set response trailers (stub) - from deno_http
#[op2]
pub fn op_http_set_response_trailers(
    _state: &mut OpState,
    #[serde] _external: serde_json::Value,
    #[serde] _trailers: Vec<(String, String)>,
) {
    // No-op
}

// ============ Worker Stubs (from Deno runtime, not deno_node) ============

/// Create worker (stub: not supported)
#[op2]
#[smi]
pub fn op_create_worker(
    _state: &mut OpState,
    #[serde] _args: serde_json::Value,
) -> Result<u32, JsErrorBox> {
    Err(JsErrorBox::generic("Workers not supported in never-jscore"))
}

/// Host post message (stub)
#[op2]
pub fn op_host_post_message(
    _state: &mut OpState,
    #[smi] _id: u32,
    #[serde] _data: serde_json::Value,
) -> Result<(), JsErrorBox> {
    Err(JsErrorBox::generic("Workers not supported in never-jscore"))
}

/// Host recv ctrl (stub)
#[op2]
#[serde]
pub async fn op_host_recv_ctrl(
    _state: std::rc::Rc<std::cell::RefCell<OpState>>,
    #[smi] _id: u32,
) -> Result<serde_json::Value, JsErrorBox> {
    Err(JsErrorBox::generic("Workers not supported in never-jscore"))
}

/// Host recv message (stub)
#[op2]
#[serde]
pub async fn op_host_recv_message(
    _state: std::rc::Rc<std::cell::RefCell<OpState>>,
    #[smi] _id: u32,
) -> Result<Option<serde_json::Value>, JsErrorBox> {
    Err(JsErrorBox::generic("Workers not supported in never-jscore"))
}

/// Host terminate worker (stub)
#[op2(fast)]
pub fn op_host_terminate_worker(
    _state: &mut OpState,
    #[smi] _id: u32,
) {
    // No-op
}

/// HTTP serve address override (stub: no override)
/// From deno_http; node:http imports this to check for Deno tunnel/serve overrides.
#[op2]
#[serde]
pub fn op_http_serve_address_override() -> (u8, String, u32, bool) {
    (0, String::new(), 0, false)
}

/// Host get worker CPU usage (stub: always zero)
#[op2(fast)]
pub fn op_host_get_worker_cpu_usage(
    _state: &mut OpState,
    #[smi] _id: u32,
    #[buffer] out: &mut [f64],
) {
    if out.len() >= 2 {
        out[0] = 0.0;
        out[1] = 0.0;
    }
}

/// Current thread CPU usage (stub: always zero)
#[op2(fast)]
pub fn op_current_thread_cpu_usage(#[buffer] out: &mut [f64]) {
    if out.len() >= 2 {
        out[0] = 0.0; // user
        out[1] = 0.0; // system
    }
}

// ============ NAPI Stubs ============

/// Open NAPI module (stub: not supported)
#[op2]
#[serde]
pub fn op_napi_open(
    _state: &mut OpState,
    #[string] _path: String,
    _global: bool,
) -> Result<serde_json::Value, JsErrorBox> {
    Err(JsErrorBox::generic("Native addons (NAPI) not supported in never-jscore"))
}

// Define the extension with all stub ops
deno_core::extension!(
    never_jscore_node_ops,
    ops = [
        op_bootstrap_color_depth,
        op_bootstrap_unstable_args,
        op_can_write_vectored,
        op_raw_write_vectored,
        op_http_set_response_trailers,
        op_create_worker,
        op_host_post_message,
        op_host_recv_ctrl,
        op_host_recv_message,
        op_host_terminate_worker,
        op_http_serve_address_override,
        op_host_get_worker_cpu_usage,
        op_current_thread_cpu_usage,
        op_napi_open,
    ],
);
