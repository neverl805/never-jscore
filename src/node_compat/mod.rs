// Node.js compatibility layer for never-jscore
// Full deno_node integration for complete Node.js built-in modules support

use deno_core::Extension;
use std::path::PathBuf;
use std::rc::Rc;

#[cfg(feature = "node_compat")]
use deno_fs::sync::MaybeArc;

mod node_require_loader;
mod npm_checker;

pub use node_require_loader::NeverJsCoreRequireLoader;
pub use npm_checker::{NeverJsCoreNpmPackageChecker, NeverJsCoreNpmPackageFolderResolver};

/// Node.js compatibility layer configuration
#[derive(Clone, Debug)]
pub struct NodeCompatOptions {
    /// Path to node_modules directory
    pub node_modules_path: Option<PathBuf>,
    /// Current working directory for module resolution
    pub cwd: PathBuf,
}

impl Default for NodeCompatOptions {
    fn default() -> Self {
        Self {
            node_modules_path: Some(PathBuf::from("./node_modules")),
            cwd: std::env::current_dir().unwrap_or_else(|_| PathBuf::from(".")),
        }
    }
}

/// Create minimal Node.js extensions (deno_node module registry only, no require() loader).
///
/// Required even when node_compat is disabled because deno_web/02_timers.js lazy-loads
/// `ext:deno_node/internal/timers.mjs` for its setTimeout/setInterval implementation.
#[cfg(feature = "node_compat")]
pub fn create_minimal_node_extensions(fs: deno_fs::FileSystemRc) -> Vec<Extension> {
    let mut extensions = vec![];

    // IO stubs (provides op_set_raw stub for deno_io)
    extensions.push(crate::ext::never_jscore_io_stubs::init());

    // Node bootstrap (no-op placeholder)
    extensions.push(crate::ext::node_bootstrap::init());

    // Node ops stubs (provides missing ops like op_bootstrap_color_depth)
    extensions.push(crate::ext::node_ops_stub::never_jscore_node_ops::init());

    // deno_io, deno_fs, deno_os, deno_process (deno_node dependencies)
    extensions.push(deno_io::deno_io::init(Some(deno_io::Stdio::default())));
    extensions.push(deno_fs::deno_fs::init(fs.clone()));
    extensions.push(deno_os::deno_os::init(None));
    extensions.push(deno_process::deno_process::init(None));

    // Stub for ext:runtime/98_global_scope_shared.js (deno_node import)
    extensions.push(crate::ext::runtime_stub::init());

    // Stub for ext:deno_http/00_serve.ts (deno_node import)
    extensions.push(crate::ext::http_stub::init());

    // deno_node_crypto / deno_node_sqlite: provide ops that deno_node's polyfills
    // import from ext:core/ops (op_node_fill_random, DatabaseSync, etc.)
    extensions.push(deno_node_crypto::deno_node_crypto::init());
    extensions.push(deno_node_sqlite::deno_node_sqlite::init());

    // deno_node with no services — registers all ext:deno_node/... module specifiers
    // including internal/timers.mjs needed by deno_web timers.
    extensions.push(deno_node::deno_node::init::<
        NeverJsCoreNpmPackageChecker,
        NeverJsCoreNpmPackageFolderResolver,
        sys_traits::impls::RealSys,
    >(None, fs));

    extensions
}

/// Create full Node.js compatibility extensions (deno_node + require() loader).
///
/// This function creates extensions for:
/// - deno_io (stdin/stdout/stderr)
/// - deno_fs (file system operations)
/// - deno_node (Node.js built-in modules and require())
#[cfg(feature = "node_compat")]
pub fn create_node_extensions(
    options: NodeCompatOptions,
    fs: deno_fs::FileSystemRc,
) -> Vec<Extension> {
    use deno_node::{NodeExtInitServices, NodeRequireLoaderRc};
    use node_resolver::{PackageJsonResolver, DenoIsBuiltInNodeModuleChecker};
    use node_resolver::cache::NodeResolutionSys;
    use sys_traits::impls::RealSys;

    let mut extensions = vec![];

    let sys = RealSys;
    let node_resolution_sys = NodeResolutionSys::new(sys.clone(), None);

    let pkg_json_resolver: node_resolver::PackageJsonResolverRc<RealSys> =
        MaybeArc::new(PackageJsonResolver::new(sys.clone(), None));

    let npm_package_checker = NeverJsCoreNpmPackageChecker::default();
    let npm_folder_resolver = NeverJsCoreNpmPackageFolderResolver::new(options.node_modules_path.clone());
    let builtin_checker = DenoIsBuiltInNodeModuleChecker;

    let node_resolver: MaybeArc<deno_node::NodeResolver<
        NeverJsCoreNpmPackageChecker,
        NeverJsCoreNpmPackageFolderResolver,
        RealSys,
    >> = MaybeArc::new(node_resolver::NodeResolver::new(
        npm_package_checker.clone(),
        builtin_checker,
        npm_folder_resolver.clone(),
        pkg_json_resolver.clone(),
        node_resolution_sys,
        node_resolver::NodeResolverOptions::default(),
    ));

    let node_require_loader: NodeRequireLoaderRc = Rc::new(NeverJsCoreRequireLoader);

    let node_init_services = NodeExtInitServices {
        node_require_loader,
        node_resolver,
        pkg_json_resolver,
        sys: sys.clone(),
    };

    // IO stubs (provides op_set_raw stub for deno_io)
    extensions.push(crate::ext::never_jscore_io_stubs::init());

    // CRITICAL: Bootstrap extension before deno_node's 00_globals.js
    extensions.push(crate::ext::node_bootstrap::init());

    // Node ops stubs (provides missing ops like op_bootstrap_color_depth)
    extensions.push(crate::ext::node_ops_stub::never_jscore_node_ops::init());

    extensions.push(deno_io::deno_io::init(Some(deno_io::Stdio::default())));
    extensions.push(deno_fs::deno_fs::init(fs.clone()));
    extensions.push(deno_os::deno_os::init(None));
    extensions.push(deno_process::deno_process::init(None));

    // Stub for ext:runtime/98_global_scope_shared.js
    extensions.push(crate::ext::runtime_stub::init());

    // Stub for ext:deno_http/00_serve.ts
    extensions.push(crate::ext::http_stub::init());

    // deno_node_crypto: provides op_node_fill_random and other crypto ops
    extensions.push(deno_node_crypto::deno_node_crypto::init());

    // deno_node_sqlite: provides DatabaseSync, Session, StatementSync cppgc objects
    extensions.push(deno_node_sqlite::deno_node_sqlite::init());

    // Full deno_node with require() services
    extensions.push(deno_node::deno_node::init::<
        NeverJsCoreNpmPackageChecker,
        NeverJsCoreNpmPackageFolderResolver,
        RealSys,
    >(
        Some(node_init_services),
        fs,
    ));

    // Node initialization (sets up global require, etc.)
    extensions.push(crate::ext::node_init::init());

    extensions
}

/// Stub when node_compat feature is disabled — returns empty.
#[cfg(not(feature = "node_compat"))]
pub fn create_minimal_node_extensions(_fs: ()) -> Vec<Extension> {
    vec![]
}

/// Stub when node_compat feature is disabled — returns empty.
#[cfg(not(feature = "node_compat"))]
pub fn create_node_extensions(_options: NodeCompatOptions) -> Vec<Extension> {
    vec![]
}
