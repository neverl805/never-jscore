// Extension system for never_jscore
// Inspired by rustyscript's modular extension architecture

use deno_core::Extension;
use std::sync::Arc;

#[cfg(feature = "deno_web_api")]
use deno_permissions::PermissionsContainer;

// Extension modules
pub mod core;
pub mod hook;
pub mod random;
pub mod xhr;
pub mod protection;

// Canvas 2D extension
#[cfg(feature = "canvas")]
pub mod canvas;

// Runtime stub for deno_node compatibility
#[cfg(feature = "node_compat")]
pub mod runtime_stub;

// HTTP stub for deno_node compatibility
#[cfg(feature = "node_compat")]
pub mod http_stub;

// Node.js ops stubs for deno_node compatibility
#[cfg(feature = "node_compat")]
pub mod node_ops_stub;

// Node.js initialization (global require, etc.)
#[cfg(feature = "node_compat")]
pub mod node_init;

// Node.js bootstrap (creates __bootstrap.ext_node_* objects before deno_node loads)
#[cfg(feature = "node_compat")]
pub mod node_bootstrap;

// Minimal deno_node crypto stub — provides only ext:deno_node/internal/crypto/constants.ts
// Needed because deno_crypto (00_crypto.js) imports kKeyObject from that specifier.
// Only used when the full deno_node extension is NOT loaded.
#[cfg(feature = "deno_web_api")]
pub mod node_crypto_stub;

/// Trait for creating and configuring extensions
/// Provides a unified interface for all extension types
pub trait ExtensionTrait<Options> {
    /// Initialize the extension with given options
    fn init(options: Options) -> Extension;

    /// Prepare extension for snapshot/warmup
    /// Clears JS/ESM files to avoid reloading them from snapshot
    fn for_snapshot(mut ext: Extension) -> Extension {
        ext.js_files = ::std::borrow::Cow::Borrowed(&[]);
        ext.esm_files = ::std::borrow::Cow::Borrowed(&[]);
        ext.esm_entry_point = ::std::option::Option::None;
        ext
    }

    /// Build an extension with optional snapshot optimization
    fn build(options: Options, is_snapshot: bool) -> Extension {
        let ext = Self::init(options);
        if is_snapshot {
            Self::for_snapshot(ext)
        } else {
            ext
        }
    }
}

/// Centralized configuration for all extensions
#[derive(Clone)]
pub struct ExtensionOptions {
    /// Enable built-in logging for Rust operations
    pub enable_logging: bool,

    /// Random seed for deterministic random numbers
    pub random_seed: Option<u64>,

    /// Enable extensions (polyfills/deno_web)
    pub enable_extensions: bool,

    /// Storage for early return mechanism
    pub storage: std::rc::Rc<crate::storage::ResultStorage>,

    #[cfg(feature = "deno_web_api")]
    pub permissions: Option<PermissionsContainer>,

    #[cfg(feature = "deno_web_api")]
    pub blob_store: Option<Arc<deno_web::BlobStore>>,

    #[cfg(feature = "node_compat")]
    /// Enable Node.js compatibility layer (require() support)
    pub enable_node_compat: bool,

    #[cfg(feature = "node_compat")]
    /// Node.js compatibility options
    pub node_compat_options: Option<crate::node_compat::NodeCompatOptions>,
}

impl ExtensionOptions {
    /// Create options with default values suitable for reverse engineering
    pub fn new(storage: std::rc::Rc<crate::storage::ResultStorage>) -> Self {
        Self {
            enable_logging: false,
            random_seed: None,
            enable_extensions: true,
            storage,
            #[cfg(feature = "deno_web_api")]
            permissions: None,
            #[cfg(feature = "deno_web_api")]
            blob_store: None,
            #[cfg(feature = "node_compat")]
            enable_node_compat: false,
            #[cfg(feature = "node_compat")]
            node_compat_options: None,
        }
    }

    #[cfg(feature = "node_compat")]
    /// Enable Node.js compatibility layer
    pub fn with_node_compat(mut self, options: crate::node_compat::NodeCompatOptions) -> Self {
        self.enable_node_compat = true;
        self.node_compat_options = Some(options);
        self
    }

    /// Enable Rust operation logging
    pub fn with_logging(mut self, enable: bool) -> Self {
        self.enable_logging = enable;
        self
    }

    /// Set random seed for deterministic behavior
    pub fn with_random_seed(mut self, seed: u64) -> Self {
        self.random_seed = Some(seed);
        self
    }

    /// Enable or disable extensions
    pub fn with_extensions(mut self, enable: bool) -> Self {
        self.enable_extensions = enable;
        self
    }

    #[cfg(feature = "deno_web_api")]
    pub fn with_permissions(mut self, permissions: PermissionsContainer) -> Self {
        self.permissions = Some(permissions);
        self
    }

    #[cfg(feature = "deno_web_api")]
    pub fn with_blob_store(mut self, blob_store: Arc<deno_web::BlobStore>) -> Self {
        self.blob_store = Some(blob_store);
        self
    }
}

// Stub for op_tls_peer_certificate that deno_net expects
// This stub is loaded only when node_compat is not enabled at runtime
// When node_compat is enabled, deno_node provides the real implementation
#[cfg(feature = "deno_web_api")]
#[deno_core::op2]
#[serde]
pub fn op_tls_peer_certificate(
    #[smi] _rid: u32,
    _detailed: bool,
) -> Option<deno_core::serde_json::Value> {
    None
}

// Stub for op_set_raw that deno_io expects (normally provided by deno_tty)
#[cfg(feature = "node_compat")]
#[deno_core::op2(fast)]
pub fn op_set_raw(
    #[smi] _rid: u32,
    _mode: bool,
    _cbreak: bool,
) {
    // No-op stub - TTY raw mode is not supported in never-jscore
}

#[cfg(feature = "deno_web_api")]
deno_core::extension!(
    never_jscore_tls_stubs,
    ops = [op_tls_peer_certificate],
);

#[cfg(feature = "node_compat")]
deno_core::extension!(
    never_jscore_io_stubs,
    ops = [op_set_raw],
);

// NOTE: op_set_raw stub removed
// We no longer load deno_io to avoid "modules not evaluated" errors
// All file operations are provided through custom Rust ops

// Stub extension for deno_telemetry
// deno_fetch needs to import from ext:deno_telemetry/
#[cfg(feature = "deno_web_api")]
deno_core::extension!(
    deno_telemetry,
    esm = [
        dir "src/ext",
        "telemetry.ts",
        "util.ts",
    ],
);

// Init fetch extension - imports all fetch modules
#[cfg(feature = "deno_web_api")]
deno_core::extension!(
    init_fetch,
    deps = [deno_fetch],
    esm_entry_point = "ext:init_fetch/init_fetch.js",
    esm = [
        dir "src/ext",
        "init_fetch.js",
    ],
);

// API Protection extension - provides utilities for anti-detection
#[cfg(feature = "deno_web_api")]
deno_core::extension!(
    api_protection,
    esm_entry_point = "ext:api_protection/api_protection.js",
    esm = [
        dir "src/ext",
        "api_protection.js",
    ],
);

/// Build all extensions based on feature flags and options
/// This is the central function that orchestrates extension loading
pub(crate) fn all_extensions(options: ExtensionOptions, is_snapshot: bool) -> Vec<Extension> {
    // 预分配容量，避免多次重新分配（约 15-20 个扩展）
    let mut extensions = Vec::with_capacity(20);

    // Core extensions (always included)
    extensions.extend(core::extensions(options.clone(), is_snapshot));

    // Hook interception extensions
    extensions.extend(hook::extensions((), is_snapshot));

    // Random extension for seedable Math.random()
    extensions.extend(random::extensions(&options, is_snapshot));

    // Canvas 2D extension (if enabled)
    #[cfg(feature = "canvas")]
    {
        extensions.extend(canvas::extensions());
    }

    #[cfg(feature = "deno_web_api")]
    {
        // API Protection utilities (must be loaded early)
        extensions.push(api_protection::init());

        // Core dependencies (in dependency order)
        extensions.push(deno_webidl::deno_webidl::init());

        // TLS stub: only needed when deno_node is NOT loaded.
        // When both node_compat and deno_web_api features are on, deno_node is always
        // loaded (even minimal), so the real op_tls_peer_certificate comes from there.
        #[cfg(not(all(feature = "node_compat", feature = "deno_web_api")))]
        extensions.push(never_jscore_tls_stubs::init());

        // Web extension (includes console, url, broadcast_channel, etc)
        let blob_store = options
            .blob_store
            .unwrap_or_else(|| Arc::new(deno_web::BlobStore::default()));
        let broadcast_channel = deno_web::InMemoryBroadcastChannel::default();

        extensions.push(deno_web::deno_web::init(
            blob_store.clone(),
            None, // maybe_location
            broadcast_channel.clone(),
        ));

        // Crypto extension (depends on deno_web)
        let crypto_seed = options.random_seed;
        extensions.push(deno_crypto::deno_crypto::init(crypto_seed));

        // WebStorage extension
        extensions.push(deno_webstorage::deno_webstorage::init(None));

        // TLS extension (fetch dependency)
        extensions.push(deno_tls::deno_tls::init());

        // Net extension (fetch dependency)
        extensions.push(deno_net::deno_net::init(
            None, // root_cert_store_provider
            None, // unsafely_ignore_certificate_errors
        ));

        // Telemetry stub extension (fetch dependency)
        extensions.push(deno_telemetry::init());

        // Fetch extension
        let mut fetch_options = deno_fetch::Options::default();
        fetch_options.user_agent = "never-jscore/2.5.0".to_string();
        extensions.push(deno_fetch::deno_fetch::init(fetch_options));

        // Init fetch - imports all fetch modules
        extensions.push(init_fetch::init());

        // Custom initialization extension from context.rs
        extensions.push(crate::context::deno_web_init::init());
    }

    // deno_web/02_timers.js unconditionally lazy-loads ext:deno_node/internal/timers.mjs,
    // so deno_node must always be registered when deno_web_api is enabled.
    #[cfg(all(feature = "node_compat", feature = "deno_web_api"))]
    {
        let fs: deno_fs::FileSystemRc = deno_fs::sync::new_rc(deno_fs::RealFs);
        if options.enable_node_compat {
            let node_options = options.node_compat_options.unwrap_or_default();
            extensions.extend(crate::node_compat::create_node_extensions(node_options, fs));
        } else {
            extensions.extend(crate::node_compat::create_minimal_node_extensions(fs));
        }
    }

    extensions
}
