// Minimal stub for deno_node — provides only what deno_crypto needs.
// Used when full node_compat is disabled but deno_web_api (crypto) is enabled.
// deno_crypto/00_crypto.js imports kKeyObject from ext:deno_node/internal/crypto/constants.ts

// The extension name MUST be `deno_node` so the specifier resolves correctly
// as `ext:deno_node/internal/crypto/constants.ts`.
#[allow(non_snake_case)]
mod deno_node_crypto_stub {
    deno_core::extension!(
        deno_node,
        esm = [
            dir "src/ext/node_crypto_stub",
            "internal/crypto/constants.ts",
        ],
    );

    pub fn init() -> deno_core::Extension {
        deno_node::init()
    }
}

pub fn init() -> deno_core::Extension {
    deno_node_crypto_stub::init()
}
