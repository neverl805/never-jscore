// Node.js bootstrap initialization extension for never-jscore
//
// Previously this extension pre-created __bootstrap.ext_node_* objects before
// deno_node loaded its ESM modules. As of deno_node 0.181+, the deno_node
// extension handles this itself via its own global_object_middleware and
// global_template_middleware. This extension is now a no-op placeholder.

use deno_core::Extension;

deno_core::extension!(
    never_jscore_node_bootstrap,
);

pub fn init() -> Extension {
    never_jscore_node_bootstrap::init()
}
