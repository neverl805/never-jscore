// Stub for deno_http/00_serve.ts
// Provides minimal exports needed by deno_node's http/https polyfills.

export function serve() {
  throw new Error("HTTP serve is not supported in never-jscore");
}

export function serveHttpOnListener() {
  throw new Error("HTTP serve is not supported in never-jscore");
}

export function serveHttpOnConnection() {
  throw new Error("HTTP serve is not supported in never-jscore");
}

export function upgradeHttpRaw() {
  throw new Error("HTTP upgrade is not supported in never-jscore");
}

export function upgradeHttpRawConnect() {
  throw new Error("HTTP upgrade is not supported in never-jscore");
}
