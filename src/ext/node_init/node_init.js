// Initialize Node.js globals for never-jscore
// This runs after deno_node is loaded to set up require() globally

import { internals } from "ext:core/mod.js";
import { createRequire } from "node:module";
import { op_fs_cwd, op_node_build_os } from "ext:core/ops";
import { nodeGlobals } from "ext:deno_node/00_globals.js";

// CRITICAL: Set up internals.nodeGlobals for CJS module wrapper
// This is normally done in Deno's 99_main.js but never-jscore doesn't use that
// The CJS module wrapper in 01_require.js uses Deno[Deno.internal].nodeGlobals
// We use the same object reference (not a copy) so it stays in sync with 02_init.js
internals.nodeGlobals = nodeGlobals;

// Get the requireImpl from internals (before it's deleted by initialize)
const requireImpl = internals.requireImpl;

// Set up that we're using local node_modules
if (requireImpl && typeof requireImpl.setUsesLocalNodeModulesDir === "function") {
  requireImpl.setUsesLocalNodeModulesDir();
}

// Ensure Deno.build is set up -- __bootstrapNodeProcess reads Deno.build.standalone and .os.
// The full Deno runtime bootstrap normally sets this; we do it here since never-jscore
// skips that bootstrap.
if (typeof Deno !== "undefined" && !Deno.build) {
  try {
    const osType = op_node_build_os(); // "windows" | "linux" | "darwin" | ...
    let target, vendor, env;
    if (osType === "windows") {
      target = "x86_64-pc-windows-msvc";
      vendor = "pc";
      env = "msvc";
    } else if (osType === "darwin") {
      target = "aarch64-apple-darwin";
      vendor = "apple";
      env = "";
    } else {
      target = "x86_64-unknown-linux-gnu";
      vendor = "unknown";
      env = "gnu";
    }
    Deno.build = {
      standalone: false,
      os: osType,
      arch: "x86_64",
      target,
      vendor,
      env,
    };
  } catch (_) {
    // Fallback: minimal build object so at least .standalone is defined
    Deno.build = { standalone: false, os: "linux", arch: "x86_64", target: "x86_64-unknown-linux-gnu", vendor: "unknown", env: "gnu" };
  }
}

// Ensure Deno.pid and Deno.ppid are set (accessed by __bootstrapNodeProcess at lines 1404-1405)
if (typeof Deno !== "undefined") {
  if (Deno.pid === undefined) {
    try { Deno.pid = 1; } catch (_) {}
  }
  if (Deno.ppid === undefined) {
    try { Deno.ppid = 0; } catch (_) {}
  }
}

// Initialize the Node.js runtime if available
// This sets up process, Buffer, setTimeout, etc.
if (internals.node && typeof internals.node.initialize === "function") {
  try {
    internals.node.initialize({
      usesLocalNodeModulesDir: true,
      argv0: "never-jscore",
      runningOnMainThread: true,
      workerId: null,
      maybeWorkerMetadata: null,
      nodeDebug: "",
      warmup: false,
      moduleSpecifier: null,
    });
  } catch (e) {
    // Ignore initialization errors -- node globals set up above are sufficient
    // for the most common use cases (require, process.env, process.stderr.fd, etc.)
  }
}

// Find the project root by searching for node_modules directory
// This ensures require() works correctly regardless of where the script is run from
function findProjectRoot(startDir) {
  let dir = startDir;
  let prev = null;

  while (dir && dir !== prev) {
    try {
      // Alternative: try to use Deno.statSync if available
      if (typeof Deno !== "undefined" && Deno.statSync) {
        try {
          const stat = Deno.statSync(dir + "/node_modules");
          if (stat.isDirectory) {
            return dir;
          }
        } catch (_) {
          // Directory doesn't exist, continue searching
        }
      }
    } catch (_) {
      // Ignore errors and continue searching
    }

    prev = dir;
    // Go up one directory
    const lastSlash = Math.max(dir.lastIndexOf("/"), dir.lastIndexOf("\\"));
    if (lastSlash > 0) {
      dir = dir.substring(0, lastSlash);
    } else {
      break;
    }
  }

  // Fallback to start directory
  return startDir;
}

// Set Node.js globals that are NOT covered by deno_node's MANAGED_GLOBALS interceptor.
// The interceptor only handles: clearInterval, clearTimeout, process, setInterval, setTimeout, window.
// Buffer, setImmediate, clearImmediate, global must be set directly on globalThis.
//
// All Node.js-specific globals are made non-enumerable so that fingerprint scripts
// iterating Object.keys(globalThis) / for..in do not discover them and flag us as Node.js.
// The protection layer (init_protection.js) also hides them from reflection APIs.
function defineHidden(name, value) {
  try {
    Object.defineProperty(globalThis, name, {
      value: value,
      writable: true,
      enumerable: false,
      configurable: true,
    });
  } catch (_) {
    // Fallback: plain assignment if defineProperty fails (e.g. already non-configurable)
    try { globalThis[name] = value; } catch (__) {}
  }
}

if (nodeGlobals.Buffer) {
  defineHidden("Buffer", nodeGlobals.Buffer);
}
if (nodeGlobals.setImmediate) {
  defineHidden("setImmediate", nodeGlobals.setImmediate);
}
if (nodeGlobals.clearImmediate) {
  defineHidden("clearImmediate", nodeGlobals.clearImmediate);
}
// global -> globalThis (non-enumerable; browsers don't have this)
defineHidden("global", globalThis);

// Create a global require function based on project root (where node_modules is)
const cwd = op_fs_cwd();
const projectRoot = findProjectRoot(cwd);
const requireFromCwd = createRequire(projectRoot + "/");

defineHidden("require", requireFromCwd);

defineHidden("module", {
  exports: {},
  id: ".",
  path: cwd,
  filename: cwd + "/index.js",
  loaded: false,
  children: [],
  paths: requireFromCwd.resolve.paths(".") || [],
});

defineHidden("__dirname", cwd);
defineHidden("__filename", cwd + "/index.js");
