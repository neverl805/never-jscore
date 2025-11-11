// js_polyfill.js - JavaScript 封装层，提供 Web API 兼容的接口
// 自动注入到 never_jscore 运行时环境

// ============================================
// Base64 操作 (兼容 Web API)
// ============================================

/**
 * Base64 编码（兼容浏览器 btoa）
 * @param {string} str - 要编码的字符串
 * @returns {string} Base64 编码结果
 */
function btoa(str) {
    return Deno.core.ops.op_base64_encode(String(str));
}

/**
 * Base64 解码（兼容浏览器 atob）
 * @param {string} str - Base64 编码的字符串
 * @returns {string} 解码结果
 */
function atob(str) {
    return Deno.core.ops.op_base64_decode(String(str));
}

// ============================================
// 哈希函数
// ============================================

/**
 * MD5 哈希
 * @param {string} str - 输入字符串
 * @returns {string} MD5 哈希值（hex）
 */
function md5(str) {
    return Deno.core.ops.op_md5(String(str));
}

/**
 * SHA1 哈希
 * @param {string} str - 输入字符串
 * @returns {string} SHA1 哈希值（hex）
 */
function sha1(str) {
    return Deno.core.ops.op_sha1(String(str));
}

/**
 * SHA256 哈希
 * @param {string} str - 输入字符串
 * @returns {string} SHA256 哈希值（hex）
 */
function sha256(str) {
    return Deno.core.ops.op_sha256(String(str));
}

/**
 * SHA512 哈希
 * @param {string} str - 输入字符串
 * @returns {string} SHA512 哈希值（hex）
 */
function sha512(str) {
    return Deno.core.ops.op_sha512(String(str));
}

// ============================================
// HMAC 操作
// ============================================

/**
 * HMAC-MD5
 * @param {string} key - 密钥
 * @param {string} message - 消息
 * @returns {string} HMAC 值（hex）
 */
function hmacMd5(key, message) {
    return Deno.core.ops.op_hmac_md5(String(key), String(message));
}

/**
 * HMAC-SHA1
 * @param {string} key - 密钥
 * @param {string} message - 消息
 * @returns {string} HMAC 值（hex）
 */
function hmacSha1(key, message) {
    return Deno.core.ops.op_hmac_sha1(String(key), String(message));
}

/**
 * HMAC-SHA256
 * @param {string} key - 密钥
 * @param {string} message - 消息
 * @returns {string} HMAC 值（hex）
 */
function hmacSha256(key, message) {
    return Deno.core.ops.op_hmac_sha256(String(key), String(message));
}

// ============================================
// Hex 操作
// ============================================

/**
 * Hex 编码
 * @param {string} str - 输入字符串
 * @returns {string} Hex 编码结果
 */
function hexEncode(str) {
    return Deno.core.ops.op_hex_encode(String(str));
}

/**
 * Hex 解码
 * @param {string} str - Hex 编码的字符串
 * @returns {string} 解码结果
 */
function hexDecode(str) {
    return Deno.core.ops.op_hex_decode(String(str));
}

// ============================================
// URL 编码（覆盖原生实现或提供缺失的实现）
// ============================================

/**
 * URL 编码（编码所有特殊字符）
 * @param {string} str - 输入字符串
 * @returns {string} URL 编码结果
 */
function urlEncode(str) {
    return Deno.core.ops.op_url_encode(String(str));
}

/**
 * URL 解码
 * @param {string} str - URL 编码的字符串
 * @returns {string} 解码结果
 */
function urlDecode(str) {
    return Deno.core.ops.op_url_decode(String(str));
}

/**
 * encodeURIComponent（兼容 Web API）
 * 编码 URI 组件，编码所有特殊字符
 * @param {string} str - 输入字符串
 * @returns {string} 编码结果
 */
if (typeof encodeURIComponent === 'undefined') {
    globalThis.encodeURIComponent = function(str) {
        return Deno.core.ops.op_encode_uri_component(String(str));
    };
}

/**
 * decodeURIComponent（兼容 Web API）
 * 解码 URI 组件
 * @param {string} str - 编码的字符串
 * @returns {string} 解码结果
 */
if (typeof decodeURIComponent === 'undefined') {
    globalThis.decodeURIComponent = function(str) {
        return Deno.core.ops.op_decode_uri_component(String(str));
    };
}

/**
 * encodeURI（兼容 Web API）
 * 编码 URI，保留 URI 结构字符
 * @param {string} str - 输入字符串
 * @returns {string} 编码结果
 */
if (typeof encodeURI === 'undefined') {
    globalThis.encodeURI = function(str) {
        return Deno.core.ops.op_encode_uri(String(str));
    };
}

/**
 * decodeURI（兼容 Web API）
 * 解码 URI
 * @param {string} str - 编码的字符串
 * @returns {string} 解码结果
 */
if (typeof decodeURI === 'undefined') {
    globalThis.decodeURI = function(str) {
        return Deno.core.ops.op_decode_uri_component(String(str));
    };
}

// ============================================
// Crypto 命名空间（类 Node.js crypto 风格）
// ============================================

/**
 * Crypto 工具对象
 */
var CryptoUtils = {
    // 哈希函数
    md5: md5,
    sha1: sha1,
    sha256: sha256,
    sha512: sha512,

    // HMAC
    hmacMd5: hmacMd5,
    hmacSha1: hmacSha1,
    hmacSha256: hmacSha256,

    // Base64
    base64Encode: btoa,
    base64Decode: atob,

    // Hex
    hexEncode: hexEncode,
    hexDecode: hexDecode,

    // URL
    urlEncode: urlEncode,
    urlDecode: urlDecode,

    /**
     * 创建哈希对象（链式调用风格）
     * @param {string} algorithm - 算法名称: 'md5', 'sha1', 'sha256', 'sha512'
     * @returns {Object} 哈希对象
     */
    createHash: function(algorithm) {
        var data = '';
        return {
            update: function(input) {
                data += String(input);
                return this;
            },
            digest: function(encoding) {
                var result;
                switch (algorithm.toLowerCase()) {
                    case 'md5':
                        result = md5(data);
                        break;
                    case 'sha1':
                        result = sha1(data);
                        break;
                    case 'sha256':
                        result = sha256(data);
                        break;
                    case 'sha512':
                        result = sha512(data);
                        break;
                    default:
                        throw new Error('Unsupported hash algorithm: ' + algorithm);
                }

                if (encoding === 'base64') {
                    return btoa(result);
                }
                return result; // 默认返回 hex
            }
        };
    },

    /**
     * 创建 HMAC 对象（链式调用风格）
     * @param {string} algorithm - 算法名称: 'md5', 'sha1', 'sha256'
     * @param {string} key - 密钥
     * @returns {Object} HMAC 对象
     */
    createHmac: function(algorithm, key) {
        var data = '';
        var hmacKey = String(key);
        return {
            update: function(input) {
                data += String(input);
                return this;
            },
            digest: function(encoding) {
                var result;
                switch (algorithm.toLowerCase()) {
                    case 'md5':
                        result = hmacMd5(hmacKey, data);
                        break;
                    case 'sha1':
                        result = hmacSha1(hmacKey, data);
                        break;
                    case 'sha256':
                        result = hmacSha256(hmacKey, data);
                        break;
                    default:
                        throw new Error('Unsupported HMAC algorithm: ' + algorithm);
                }

                if (encoding === 'base64') {
                    return btoa(result);
                }
                return result; // 默认返回 hex
            }
        };
    }
};

// ============================================
// 导出到全局作用域
// ============================================

// 将常用函数导出到全局
globalThis.btoa = btoa;
globalThis.atob = atob;
globalThis.CryptoUtils = CryptoUtils;

// 便捷的全局哈希函数
globalThis.md5 = md5;
globalThis.sha1 = sha1;
globalThis.sha256 = sha256;
globalThis.sha512 = sha512;

// ============================================
// 控制台提示（可选）
// ============================================

// 标记环境已加载扩展
globalThis.__NEVER_JSCORE_EXTENSIONS_LOADED__ = true;

// ============================================
// Timer API polyfills (setTimeout/setInterval)
// ============================================

/**
 * Fake setTimeout - executes immediately via Promise
 * @param {Function} callback - 回调函数
 * @param {number} delay - 延迟（忽略，立即执行）
 * @param {...*} args - 传给回调的参数
 * @returns {number} timer ID
 */
if (typeof setTimeout === 'undefined') {
    const timers = new Map();
    let nextTimerId = 1;

    globalThis.setTimeout = function(callback, delay = 0, ...args) {
        const id = nextTimerId++;

        // Execute immediately (not actually async!)
        Promise.resolve().then(() => {
            if (timers.has(id)) {
                callback(...args);
                timers.delete(id);
            }
        });

        timers.set(id, { callback, type: 'timeout' });
        return id;
    };

    globalThis.setInterval = function(callback, delay = 0, ...args) {
        const id = nextTimerId++;

        // Only execute once (fake interval)
        Promise.resolve().then(() => {
            if (timers.has(id)) {
                callback(...args);
                // Note: Real setInterval would repeat, but we don't
            }
        });

        timers.set(id, { callback, type: 'interval' });
        return id;
    };

    globalThis.clearTimeout = function(id) {
        timers.delete(id);
    };

    globalThis.clearInterval = function(id) {
        timers.delete(id);
    };
}

// ============================================
// Worker API polyfill (fake single-threaded)
// ============================================

/**
 * Fake Worker - single-threaded, for API detection
 */
if (typeof Worker === 'undefined') {
    class Worker {
        constructor(scriptURL, options = {}) {
            this._id = Math.floor(Math.random() * 1000000);
            this._scriptURL = scriptURL;
            this._terminated = false;
            this.onmessage = null;
            this.onerror = null;
        }

        postMessage(message) {
            if (this._terminated) {
                throw new Error('Worker has been terminated');
            }

            // Fake processing - immediately trigger onmessage if set
            if (this.onmessage) {
                setTimeout(() => {
                    if (!this._terminated && this.onmessage) {
                        const event = {
                            type: 'message',
                            data: message,
                            origin: '',
                        };
                        this.onmessage(event);
                    }
                }, 0);
            }
        }

        terminate() {
            this._terminated = true;
        }

        addEventListener(type, listener) {
            if (type === 'message') {
                this.onmessage = listener;
            } else if (type === 'error') {
                this.onerror = listener;
            }
        }

        removeEventListener(type, listener) {
            if (type === 'message' && this.onmessage === listener) {
                this.onmessage = null;
            } else if (type === 'error' && this.onerror === listener) {
                this.onerror = null;
            }
        }
    }

    globalThis.Worker = Worker;
}

// ============================================
// Crypto random functions
// ============================================

/**
 * Crypto namespace with random functions
 */
if (typeof crypto === 'undefined') {
    globalThis.crypto = {};
}

if (!crypto.randomUUID) {
    crypto.randomUUID = function() {
        return Deno.core.ops.op_crypto_random_uuid();
    };
}

if (!crypto.getRandomValues) {
    crypto.getRandomValues = function(typedArray) {
        // Generate random hex string and fill typed array
        const length = typedArray.length;
        const hexString = Deno.core.ops.op_crypto_get_random_values(length);

        for (let i = 0; i < length; i++) {
            const hex = hexString.substr(i * 2, 2);
            typedArray[i] = parseInt(hex, 16);
        }

        return typedArray;
    };
}

// Math.random override using crypto random (optional)
globalThis.cryptoRandom = function() {
    return Deno.core.ops.op_crypto_random();
};

// ============================================
// Fetch API polyfill
// ============================================

/**
 * Response class (simplified for Node.js compatibility)
 */
class Response {
    constructor(body, init = {}) {
        this._body = body;
        this.status = init.status || 200;
        this.statusText = init.statusText || 'OK';
        this.ok = this.status >= 200 && this.status < 300;
        this.headers = new Headers(init.headers || {});
        this.url = init.url || '';
    }

    async text() {
        return Promise.resolve(this._body);
    }

    async json() {
        try {
            return Promise.resolve(JSON.parse(this._body));
        } catch(e) {
            throw new Error('Invalid JSON: ' + e.message);
        }
    }

    async blob() {
        // 简化实现：返回文本
        return Promise.resolve(this._body);
    }

    async arrayBuffer() {
        const encoder = new TextEncoder();
        return Promise.resolve(encoder.encode(this._body).buffer);
    }

    clone() {
        return new Response(this._body, {
            status: this.status,
            statusText: this.statusText,
            headers: this.headers,
            url: this.url
        });
    }
}

/**
 * Headers class (simplified)
 */
class Headers {
    constructor(init = {}) {
        this._headers = {};
        if (init) {
            for (let key in init) {
                this.set(key, init[key]);
            }
        }
    }

    get(name) {
        return this._headers[name.toLowerCase()] || null;
    }

    set(name, value) {
        this._headers[name.toLowerCase()] = String(value);
    }

    has(name) {
        return name.toLowerCase() in this._headers;
    }

    delete(name) {
        delete this._headers[name.toLowerCase()];
    }

    forEach(callback, thisArg) {
        for (let name in this._headers) {
            callback.call(thisArg, this._headers[name], name, this);
        }
    }

    keys() {
        return Object.keys(this._headers);
    }

    values() {
        return Object.values(this._headers);
    }

    entries() {
        return Object.entries(this._headers);
    }
}

/**
 * Fetch API (Node.js/Browser compatible)
 */
if (typeof fetch === 'undefined') {
    globalThis.fetch = async function(url, options = {}) {
        // 构建请求选项
        const method = (options.method || 'GET').toUpperCase();
        const headers = {};

        // 处理 headers
        if (options.headers) {
            if (options.headers instanceof Headers) {
                options.headers.forEach((value, key) => {
                    headers[key] = value;
                });
            } else if (typeof options.headers === 'object') {
                for (let key in options.headers) {
                    headers[key] = options.headers[key];
                }
            }
        }

        // 处理 body
        let body = '';
        if (options.body !== undefined) {
            if (typeof options.body === 'string') {
                body = options.body;
            } else if (typeof options.body === 'object') {
                // 自动序列化 JSON
                body = JSON.stringify(options.body);
                if (!headers['content-type'] && !headers['Content-Type']) {
                    headers['Content-Type'] = 'application/json';
                }
            }
        }

        // 构建 Rust 端的请求选项
        const fetchOptions = {
            method: method,
            headers: headers,
            body: body,
            timeout: options.timeout || 30000
        };

        // 调用 Rust op
        const responseJson = Deno.core.ops.op_fetch(url, JSON.stringify(fetchOptions));
        const responseData = JSON.parse(responseJson);

        // 检查错误
        if (responseData.error) {
            throw new Error('Fetch failed: ' + responseData.error);
        }

        // 构建 Response 对象
        const response = new Response(responseData.body, {
            status: responseData.status,
            statusText: responseData.statusText,
            headers: responseData.headers,
            url: url
        });

        return response;
    };

    globalThis.Response = Response;
    globalThis.Headers = Headers;
}

// ============================================
// File System API for require()
// ============================================

/**
 * 简化的 fs 模块（Node.js风格）
 */
const fs = {
    readFileSync: function(path, encoding = 'utf8') {
        const content = Deno.core.ops.op_read_file_sync(path);
        if (content.startsWith('Error:')) {
            throw new Error(content);
        }
        return content;
    },

    writeFileSync: function(path, content) {
        const result = Deno.core.ops.op_write_file_sync(path, String(content));
        if (result !== 'OK') {
            throw new Error(result);
        }
    },

    existsSync: function(path) {
        return Deno.core.ops.op_file_exists(path);
    },

    statSync: function(path) {
        return {
            isFile: () => Deno.core.ops.op_is_file(path),
            isDirectory: () => Deno.core.ops.op_is_directory(path)
        };
    },

    readdirSync: function(path) {
        const result = Deno.core.ops.op_readdir(path);
        if (result.startsWith('Error:')) {
            throw new Error(result);
        }
        return JSON.parse(result);
    }
};

/**
 * 简化的 path 模块（Node.js风格）
 */
const path = {
    resolve: function(...paths) {
        if (paths.length === 0) {
            return Deno.core.ops.op_getcwd();
        }
        let resolved = paths[0];
        for (let i = 1; i < paths.length; i++) {
            resolved = Deno.core.ops.op_join_path(resolved, paths[i]);
        }
        return Deno.core.ops.op_resolve_path(resolved);
    },

    join: function(...paths) {
        let result = paths[0] || '';
        for (let i = 1; i < paths.length; i++) {
            result = Deno.core.ops.op_join_path(result, paths[i]);
        }
        return result;
    },

    dirname: function(p) {
        return Deno.core.ops.op_dirname(p);
    },

    basename: function(p) {
        return Deno.core.ops.op_basename(p);
    },

    extname: function(p) {
        const base = Deno.core.ops.op_basename(p);
        const lastDot = base.lastIndexOf('.');
        if (lastDot === -1 || lastDot === 0) return '';
        return base.substring(lastDot);
    },

    isAbsolute: function(p) {
        // Windows: C:\ or \\
        // Unix: /
        return /^([a-zA-Z]:\\|\\\\|\\|\/)/.test(p);
    },

    parse: function(p) {
        // 简化的 path.parse 实现
        const isAbsolute = this.isAbsolute(p);
        const dir = this.dirname(p);
        const base = this.basename(p);
        const ext = this.extname(p);
        const name = ext ? base.substring(0, base.length - ext.length) : base;

        // 确定根路径
        let root = '';
        if (isAbsolute) {
            if (p.match(/^[a-zA-Z]:\\/)) {
                // Windows: C:\
                root = p.substring(0, 3);
            } else if (p.startsWith('\\\\') || p.startsWith('//')) {
                // UNC path: \\server\share
                root = '\\\\';
            } else if (p.startsWith('\\') || p.startsWith('/')) {
                // Unix: /
                root = p.substring(0, 1);
            }
        }

        return { root, dir, base, ext, name };
    },

    sep: typeof process !== 'undefined' && process.platform === 'win32' ? '\\' : '/'
};

// ============================================
// CommonJS require() implementation
// ============================================

/**
 * Module cache
 */
const Module = {
    _cache: {},
    _extensions: {}
};

/**
 * require() 实现（完整的 Node.js 模块解析）
 */
function createRequire(baseDir) {
    const require = function(modulePath) {
        // 0. 检查内置模块（fs, path等），直接从缓存返回
        if (Module._cache[modulePath] && Module._cache[modulePath].loaded) {
            return Module._cache[modulePath].exports;
        }

        // 解析模块路径
        const resolved = require.resolve(modulePath);

        // 检查缓存
        if (Module._cache[resolved]) {
            return Module._cache[resolved].exports;
        }

        // 创建新模块对象
        const module = {
            exports: {},
            id: resolved,
            filename: resolved,
            loaded: false,
            parent: null,
            children: [],
            paths: []
        };

        // 添加到缓存
        Module._cache[resolved] = module;

        // 加载模块
        try {
            const ext = path.extname(resolved) || '.js';
            const loader = Module._extensions[ext] || Module._extensions['.js'];
            loader(module, resolved);
            module.loaded = true;
        } catch (e) {
            // 加载失败，从缓存中移除
            delete Module._cache[resolved];
            throw e;
        }

        return module.exports;
    };

    /**
     * 模块路径解析（完整的 Node.js 解析算法）
     */
    require.resolve = function(modulePath) {
        // 1. 核心模块（Node.js 内置模块不支持，直接跳过）

        // 2. 相对路径或绝对路径
        if (modulePath.startsWith('./') || modulePath.startsWith('../') || path.isAbsolute(modulePath)) {
            return resolveAsFile(path.resolve(baseDir, modulePath)) ||
                   resolveAsDirectory(path.resolve(baseDir, modulePath)) ||
                   throwNotFound(modulePath);
        }

        // 3. 从 node_modules 查找
        return resolveNodeModules(modulePath, baseDir) || throwNotFound(modulePath);
    };

    /**
     * 作为文件解析
     */
    function resolveAsFile(p) {
        // 尝试精确路径
        if (fs.existsSync(p) && fs.statSync(p).isFile()) {
            return p;
        }

        // 尝试添加扩展名
        const extensions = ['.js', '.json', '.node'];
        for (const ext of extensions) {
            const withExt = p + ext;
            if (fs.existsSync(withExt) && fs.statSync(withExt).isFile()) {
                return withExt;
            }
        }

        return null;
    }

    /**
     * 作为目录解析
     */
    function resolveAsDirectory(p) {
        if (!fs.existsSync(p) || !fs.statSync(p).isDirectory()) {
            return null;
        }

        // 1. 检查 package.json
        const packageJson = path.join(p, 'package.json');
        if (fs.existsSync(packageJson)) {
            try {
                const pkg = JSON.parse(fs.readFileSync(packageJson));
                if (pkg.main) {
                    const mainPath = path.resolve(p, pkg.main);
                    const resolved = resolveAsFile(mainPath) || resolveAsFile(path.join(mainPath, 'index'));
                    if (resolved) return resolved;
                }
            } catch (e) {
                // package.json 解析失败，继续
            }
        }

        // 2. 查找 index.js, index.json, index.node
        return resolveAsFile(path.join(p, 'index'));
    }

    /**
     * 从 node_modules 查找
     */
    function resolveNodeModules(moduleName, startDir) {
        const dirs = getNodeModulesPaths(startDir);
        for (const dir of dirs) {
            const modulePath = path.join(dir, moduleName);
            const resolved = resolveAsFile(modulePath) || resolveAsDirectory(modulePath);
            if (resolved) return resolved;
        }
        return null;
    }

    /**
     * 获取所有可能的 node_modules 路径（递归向上）
     */
    function getNodeModulesPaths(startDir) {
        const paths = [];
        let currentDir = path.resolve(startDir);
        const root = path.parse(currentDir).root;

        while (true) {
            // 不在 node_modules 目录内
            if (!currentDir.endsWith(path.sep + 'node_modules')) {
                paths.push(path.join(currentDir, 'node_modules'));
            }

            // 到达根目录
            if (currentDir === root) break;

            // 向上一级
            const parentDir = path.dirname(currentDir);
            if (parentDir === currentDir) break;
            currentDir = parentDir;
        }

        return paths;
    }

    /**
     * 抛出模块未找到错误
     */
    function throwNotFound(modulePath) {
        throw new Error("Cannot find module '" + modulePath + "'");
    }

    /**
     * require.cache - 模块缓存
     */
    require.cache = Module._cache;

    /**
     * require.main - 主模块
     */
    require.main = null;

    return require;
}

/**
 * JavaScript 模块加载器
 */
Module._extensions['.js'] = function(module, filename) {
    const content = fs.readFileSync(filename, 'utf8');

    // 创建模块作用域
    const dirname = path.dirname(filename);
    const require = createRequire(dirname);

    // 包装模块代码
    const wrapper = '(function(exports, require, module, __filename, __dirname) {\n' +
                   content + '\n' +
                   '})';

    // 编译并执行
    const compiledWrapper = eval(wrapper);
    compiledWrapper(module.exports, require, module, filename, dirname);
};

/**
 * JSON 模块加载器
 */
Module._extensions['.json'] = function(module, filename) {
    const content = fs.readFileSync(filename, 'utf8');
    module.exports = JSON.parse(content);
};

/**
 * 全局 require（从当前工作目录）
 */
if (typeof require === 'undefined') {
    const cwd = Deno.core.ops.op_getcwd();
    globalThis.require = createRequire(cwd);
    globalThis.module = { exports: {} };
    globalThis.exports = globalThis.module.exports;
    globalThis.__dirname = cwd;
    globalThis.__filename = '';
}

// 导出 fs 和 path 模块，可以通过 require 使用
Module._cache['fs'] = { exports: fs, loaded: true };
Module._cache['path'] = { exports: path, loaded: true };

// ============================================
// localStorage / sessionStorage
// ============================================

if (typeof localStorage === 'undefined') {
    class Storage {
        setItem(key, value) {
            const result = Deno.core.ops.op_local_storage_set_item(String(key), String(value));
            if (result !== 'OK') throw new Error(result);
        }
        getItem(key) {
            const result = Deno.core.ops.op_local_storage_get_item(String(key));
            return result === 'null' ? null : result;
        }
        removeItem(key) {
            Deno.core.ops.op_local_storage_remove_item(String(key));
        }
        clear() {
            Deno.core.ops.op_local_storage_clear();
        }
        key(index) {
            const keys = JSON.parse(Deno.core.ops.op_local_storage_keys());
            return keys[index] || null;
        }
        get length() {
            return Deno.core.ops.op_local_storage_length();
        }
    }

    class SessionStorage {
        setItem(key, value) {
            const result = Deno.core.ops.op_session_storage_set_item(String(key), String(value));
            if (result !== 'OK') throw new Error(result);
        }
        getItem(key) {
            const result = Deno.core.ops.op_session_storage_get_item(String(key));
            return result === 'null' ? null : result;
        }
        removeItem(key) {
            Deno.core.ops.op_session_storage_remove_item(String(key));
        }
        clear() {
            Deno.core.ops.op_session_storage_clear();
        }
        key(index) {
            const keys = JSON.parse(Deno.core.ops.op_session_storage_keys());
            return keys[index] || null;
        }
        get length() {
            return Deno.core.ops.op_session_storage_length();
        }
    }

    globalThis.localStorage = new Storage();
    globalThis.sessionStorage = new SessionStorage();
}

// ============================================
// Browser Environment (navigator, location, document, window, screen)
// ============================================

if (typeof navigator === 'undefined') {
    const navigatorData = JSON.parse(Deno.core.ops.op_get_navigator());
    globalThis.navigator = navigatorData;
}

if (typeof location === 'undefined') {
    const locationData = JSON.parse(Deno.core.ops.op_get_location('https://example.com/'));
    globalThis.location = locationData;
}

if (typeof document === 'undefined') {
    const docProps = JSON.parse(Deno.core.ops.op_get_document_props());
    globalThis.document = Object.assign({
        getElementById: () => null,
        getElementsByClassName: () => [],
        getElementsByTagName: () => [],
        querySelector: () => null,
        querySelectorAll: () => [],
        createElement: (tag) => ({ tagName: tag.toUpperCase(), nodeName: tag.toUpperCase() }),
        addEventListener: () => {},
        removeEventListener: () => {}
    }, docProps);
}

if (typeof window === 'undefined') {
    globalThis.window = globalThis;
}

const windowProps = JSON.parse(Deno.core.ops.op_get_window_props());
Object.assign(globalThis, windowProps);

if (typeof screen === 'undefined') {
    const screenData = JSON.parse(Deno.core.ops.op_get_screen());
    globalThis.screen = screenData;
}

// Enhanced Console (if needed)
if (typeof console.table === 'undefined') {
    console.table = function(data) {
        console.log(JSON.stringify(data, null, 2));
    };
}

// Mark browser environment loaded
globalThis.__NEVER_JSCORE_BROWSER_ENV_LOADED__ = true;

// ============================================
// URL and URLSearchParams API
// ============================================

if (typeof URL === 'undefined') {
    class URL {
        constructor(url, base) {
            const urlString = base ? this._resolveUrl(url, base) : url;
            const parsed = JSON.parse(Deno.core.ops.op_parse_url(urlString));

            this.href = parsed.href;
            this.protocol = parsed.protocol;
            this.hostname = parsed.hostname;
            this.port = parsed.port;
            this.host = parsed.host;
            this.pathname = parsed.pathname;
            this.search = parsed.search;
            this.hash = parsed.hash;
            this.origin = parsed.origin;

            this._searchParams = null;
        }

        _resolveUrl(url, base) {
            if (url.startsWith('http://') || url.startsWith('https://')) {
                return url;
            }
            // 简单的相对 URL 解析
            if (url.startsWith('/')) {
                const baseParsed = JSON.parse(Deno.core.ops.op_parse_url(base));
                return `${baseParsed.origin}${url}`;
            }
            return `${base}/${url}`;
        }

        get searchParams() {
            if (!this._searchParams) {
                this._searchParams = new URLSearchParams(this.search);
            }
            return this._searchParams;
        }

        toString() {
            return this.href;
        }

        toJSON() {
            return this.href;
        }
    }

    globalThis.URL = URL;
}

if (typeof URLSearchParams === 'undefined') {
    class URLSearchParams {
        constructor(init) {
            this._params = new Map();

            if (typeof init === 'string') {
                // 移除开头的 ?
                const str = init.startsWith('?') ? init.substring(1) : init;
                if (str) {
                    str.split('&').forEach(pair => {
                        const [key, value = ''] = pair.split('=');
                        this.append(
                            decodeURIComponent(key),
                            decodeURIComponent(value)
                        );
                    });
                }
            } else if (init instanceof URLSearchParams) {
                init.forEach((value, key) => {
                    this.append(key, value);
                });
            } else if (typeof init === 'object' && init !== null) {
                Object.keys(init).forEach(key => {
                    this.append(key, init[key]);
                });
            }
        }

        append(name, value) {
            const key = String(name);
            const val = String(value);
            if (!this._params.has(key)) {
                this._params.set(key, []);
            }
            this._params.get(key).push(val);
        }

        delete(name) {
            this._params.delete(String(name));
        }

        get(name) {
            const values = this._params.get(String(name));
            return values ? values[0] : null;
        }

        getAll(name) {
            return this._params.get(String(name)) || [];
        }

        has(name) {
            return this._params.has(String(name));
        }

        set(name, value) {
            this._params.set(String(name), [String(value)]);
        }

        forEach(callback, thisArg) {
            this._params.forEach((values, key) => {
                values.forEach(value => {
                    callback.call(thisArg, value, key, this);
                });
            });
        }

        keys() {
            return this._params.keys();
        }

        values() {
            const result = [];
            this._params.forEach(values => {
                result.push(...values);
            });
            return result[Symbol.iterator]();
        }

        entries() {
            const result = [];
            this._params.forEach((values, key) => {
                values.forEach(value => {
                    result.push([key, value]);
                });
            });
            return result[Symbol.iterator]();
        }

        toString() {
            const parts = [];
            this._params.forEach((values, key) => {
                values.forEach(value => {
                    parts.push(
                        encodeURIComponent(key) + '=' + encodeURIComponent(value)
                    );
                });
            });
            return parts.join('&');
        }

        [Symbol.iterator]() {
            return this.entries();
        }
    }

    globalThis.URLSearchParams = URLSearchParams;
}

// ============================================
// FormData API
// ============================================

if (typeof FormData === 'undefined') {
    class FormData {
        constructor() {
            this._data = new Map();
        }

        append(name, value, filename) {
            const key = String(name);
            if (!this._data.has(key)) {
                this._data.set(key, []);
            }

            const entry = { value: String(value) };
            if (filename !== undefined) {
                entry.filename = String(filename);
            }

            this._data.get(key).push(entry);
        }

        delete(name) {
            this._data.delete(String(name));
        }

        get(name) {
            const entries = this._data.get(String(name));
            return entries ? entries[0].value : null;
        }

        getAll(name) {
            const entries = this._data.get(String(name));
            return entries ? entries.map(e => e.value) : [];
        }

        has(name) {
            return this._data.has(String(name));
        }

        set(name, value, filename) {
            const key = String(name);
            const entry = { value: String(value) };
            if (filename !== undefined) {
                entry.filename = String(filename);
            }
            this._data.set(key, [entry]);
        }

        forEach(callback, thisArg) {
            this._data.forEach((entries, key) => {
                entries.forEach(entry => {
                    callback.call(thisArg, entry.value, key, this);
                });
            });
        }

        keys() {
            return this._data.keys();
        }

        values() {
            const result = [];
            this._data.forEach(entries => {
                entries.forEach(entry => result.push(entry.value));
            });
            return result[Symbol.iterator]();
        }

        entries() {
            const result = [];
            this._data.forEach((entries, key) => {
                entries.forEach(entry => result.push([key, entry.value]));
            });
            return result[Symbol.iterator]();
        }

        [Symbol.iterator]() {
            return this.entries();
        }
    }

    globalThis.FormData = FormData;
}

// ============================================
// Event and EventTarget API
// ============================================

if (typeof Event === 'undefined') {
    class Event {
        constructor(type, eventInitDict = {}) {
            this.type = String(type);
            this.bubbles = eventInitDict.bubbles || false;
            this.cancelable = eventInitDict.cancelable || false;
            this.composed = eventInitDict.composed || false;

            this.target = null;
            this.currentTarget = null;
            this.eventPhase = 0; // Event.NONE
            this.defaultPrevented = false;
            this.timeStamp = Date.now();

            this._stopPropagation = false;
            this._stopImmediatePropagation = false;
        }

        preventDefault() {
            if (this.cancelable) {
                this.defaultPrevented = true;
            }
        }

        stopPropagation() {
            this._stopPropagation = true;
        }

        stopImmediatePropagation() {
            this._stopImmediatePropagation = true;
            this._stopPropagation = true;
        }

        // Event phase constants
        static get NONE() { return 0; }
        static get CAPTURING_PHASE() { return 1; }
        static get AT_TARGET() { return 2; }
        static get BUBBLING_PHASE() { return 3; }
    }

    globalThis.Event = Event;
}

if (typeof EventTarget === 'undefined') {
    class EventTarget {
        constructor() {
            this._listeners = new Map();
        }

        addEventListener(type, callback, options = {}) {
            if (typeof callback !== 'function') return;

            const typeStr = String(type);
            if (!this._listeners.has(typeStr)) {
                this._listeners.set(typeStr, []);
            }

            const listeners = this._listeners.get(typeStr);

            // 检查是否已经存在
            const exists = listeners.some(l =>
                l.callback === callback &&
                l.capture === (options.capture || false)
            );

            if (!exists) {
                listeners.push({
                    callback,
                    capture: options.capture || false,
                    once: options.once || false,
                    passive: options.passive || false
                });
            }
        }

        removeEventListener(type, callback, options = {}) {
            const typeStr = String(type);
            const listeners = this._listeners.get(typeStr);
            if (!listeners) return;

            const capture = options.capture || false;
            const index = listeners.findIndex(l =>
                l.callback === callback && l.capture === capture
            );

            if (index !== -1) {
                listeners.splice(index, 1);
            }

            if (listeners.length === 0) {
                this._listeners.delete(typeStr);
            }
        }

        dispatchEvent(event) {
            const typeStr = String(event.type);
            const listeners = this._listeners.get(typeStr);
            if (!listeners || listeners.length === 0) {
                return !event.defaultPrevented;
            }

            event.target = this;
            event.currentTarget = this;
            event.eventPhase = Event.AT_TARGET;

            // 复制监听器数组以防在回调中被修改
            const listenersCopy = [...listeners];

            for (const listener of listenersCopy) {
                if (event._stopImmediatePropagation) break;

                try {
                    listener.callback.call(this, event);
                } catch (err) {
                    console.error('Error in event listener:', err);
                }

                // 如果是 once，移除监听器
                if (listener.once) {
                    this.removeEventListener(
                        typeStr,
                        listener.callback,
                        { capture: listener.capture }
                    );
                }
            }

            return !event.defaultPrevented;
        }
    }

    globalThis.EventTarget = EventTarget;
}

// ============================================
// XMLHttpRequest API (基于 fetch 实现)
// ============================================

if (typeof XMLHttpRequest === 'undefined') {
    class XMLHttpRequest extends EventTarget {
        constructor() {
            super();

            // Ready states
            this.UNSENT = 0;
            this.OPENED = 1;
            this.HEADERS_RECEIVED = 2;
            this.LOADING = 3;
            this.DONE = 4;

            // State
            this.readyState = this.UNSENT;
            this.response = null;
            this.responseText = '';
            this.responseType = '';
            this.responseURL = '';
            this.responseXML = null;
            this.status = 0;
            this.statusText = '';
            this.timeout = 0;
            this.withCredentials = false;

            // Event handlers
            this.onreadystatechange = null;
            this.onload = null;
            this.onerror = null;
            this.onprogress = null;
            this.onloadstart = null;
            this.onloadend = null;
            this.ontimeout = null;
            this.onabort = null;

            // Internal
            this._method = null;
            this._url = null;
            this._headers = {};
            this._async = true;
            this._aborted = false;
        }

        open(method, url, async = true, username, password) {
            this._method = String(method).toUpperCase();
            this._url = String(url);
            this._async = Boolean(async);

            this.readyState = this.OPENED;
            this._triggerEvent('readystatechange');
        }

        setRequestHeader(name, value) {
            if (this.readyState !== this.OPENED) {
                throw new Error('InvalidStateError');
            }
            this._headers[String(name)] = String(value);
        }

        send(body = null) {
            if (this.readyState !== this.OPENED) {
                throw new Error('InvalidStateError');
            }

            if (this._aborted) return;

            this._triggerEvent('loadstart');

            // 使用 fetch 发送请求
            const options = {
                method: this._method,
                headers: this._headers
            };

            if (body !== null && this._method !== 'GET' && this._method !== 'HEAD') {
                options.body = body;
            }

            if (this.timeout > 0) {
                options.timeout = this.timeout;
            }

            const sendRequest = async () => {
                try {
                    const response = await fetch(this._url, options);

                    this.status = response.status;
                    this.statusText = response.statusText || '';
                    this.responseURL = this._url;

                    this.readyState = this.HEADERS_RECEIVED;
                    this._triggerEvent('readystatechange');

                    this.readyState = this.LOADING;
                    this._triggerEvent('readystatechange');

                    // 读取响应体
                    const text = await response.text();
                    this.responseText = text;
                    this.response = text;

                    this.readyState = this.DONE;
                    this._triggerEvent('readystatechange');
                    this._triggerEvent('load');
                    this._triggerEvent('loadend');

                } catch (error) {
                    this.readyState = this.DONE;
                    this._triggerEvent('error', error);
                    this._triggerEvent('loadend');
                }
            };

            if (this._async) {
                sendRequest();
            } else {
                // 同步请求（不推荐，但为了兼容性）
                console.warn('Synchronous XMLHttpRequest is deprecated');
                sendRequest();
            }
        }

        abort() {
            if (this.readyState === this.UNSENT || this.readyState === this.DONE) {
                return;
            }

            this._aborted = true;
            this.readyState = this.DONE;
            this._triggerEvent('abort');
            this._triggerEvent('loadend');
        }

        getAllResponseHeaders() {
            if (this.readyState < this.HEADERS_RECEIVED) {
                return '';
            }
            // 简化实现
            return Object.keys(this._headers)
                .map(key => `${key}: ${this._headers[key]}`)
                .join('\r\n');
        }

        getResponseHeader(name) {
            if (this.readyState < this.HEADERS_RECEIVED) {
                return null;
            }
            return this._headers[String(name).toLowerCase()] || null;
        }

        overrideMimeType(mime) {
            // 简化实现
        }

        _triggerEvent(eventName, detail) {
            // 触发 on* 处理器
            const handler = this['on' + eventName];
            if (typeof handler === 'function') {
                const event = new Event(eventName);
                if (detail) event.detail = detail;
                handler.call(this, event);
            }

            // 触发 EventTarget 监听器
            const event = new Event(eventName);
            if (detail) event.detail = detail;
            this.dispatchEvent(event);
        }
    }

    // 添加静态常量
    XMLHttpRequest.UNSENT = 0;
    XMLHttpRequest.OPENED = 1;
    XMLHttpRequest.HEADERS_RECEIVED = 2;
    XMLHttpRequest.LOADING = 3;
    XMLHttpRequest.DONE = 4;

    globalThis.XMLHttpRequest = XMLHttpRequest;
}

// Mark high-priority APIs loaded
globalThis.__NEVER_JSCORE_HIGH_PRIORITY_APIS_LOADED__ = true;

// ============================================
// Performance API (Web Performance Timing)
// ============================================

if (typeof performance === 'undefined') {
    class Performance {
        /**
         * Get high-precision timestamp in milliseconds
         * @returns {number} Time in milliseconds since timeOrigin
         */
        now() {
            return Deno.core.ops.op_performance_now();
        }

        /**
         * Get the time origin (Unix timestamp when runtime started)
         * @returns {number} Unix timestamp in milliseconds
         */
        get timeOrigin() {
            return Deno.core.ops.op_performance_time_origin();
        }

        /**
         * Create a performance mark
         * @param {string} name - Mark name
         * @returns {PerformanceMark} The created mark entry
         */
        mark(name) {
            Deno.core.ops.op_performance_mark(String(name));
            const timestamp = Deno.core.ops.op_performance_now();
            return {
                name: String(name),
                entryType: 'mark',
                startTime: timestamp,
                duration: 0
            };
        }

        /**
         * Create a performance measure between two marks
         * @param {string} name - Measure name
         * @param {string} startMark - Start mark name (optional)
         * @param {string} endMark - End mark name (optional)
         * @returns {PerformanceMeasure} The created measure entry
         */
        measure(name, startMark = '', endMark = '') {
            const result = Deno.core.ops.op_performance_measure(
                String(name),
                startMark ? String(startMark) : '',
                endMark ? String(endMark) : ''
            );

            if (result.startsWith('Error:')) {
                throw new Error(result);
            }

            return JSON.parse(result);
        }

        /**
         * Clear marks
         * @param {string} name - Mark name to clear (optional, clears all if not specified)
         */
        clearMarks(name = '') {
            Deno.core.ops.op_performance_clear_marks(name ? String(name) : '');
        }

        /**
         * Clear measures
         * @param {string} name - Measure name to clear (optional, clears all if not specified)
         */
        clearMeasures(name = '') {
            Deno.core.ops.op_performance_clear_measures(name ? String(name) : '');
        }

        /**
         * Get all performance entries
         * @returns {Array<PerformanceEntry>} Array of all entries
         */
        getEntries() {
            const json = Deno.core.ops.op_performance_get_entries();
            return JSON.parse(json);
        }

        /**
         * Get performance entries by type
         * @param {string} type - Entry type ("mark" or "measure")
         * @returns {Array<PerformanceEntry>} Array of matching entries
         */
        getEntriesByType(type) {
            const json = Deno.core.ops.op_performance_get_entries_by_type(String(type));
            return JSON.parse(json);
        }

        /**
         * Get performance entries by name
         * @param {string} name - Entry name
         * @param {string} type - Optional type filter ("mark" or "measure")
         * @returns {Array<PerformanceEntry>} Array of matching entries
         */
        getEntriesByName(name, type = '') {
            const json = Deno.core.ops.op_performance_get_entries_by_name(String(name));
            const entries = JSON.parse(json);

            if (type) {
                return entries.filter(e => e.entryType === String(type));
            }

            return entries;
        }

        /**
         * Convert to JSON (for debugging)
         * @returns {Object} Performance timing info
         */
        toJSON() {
            return {
                timeOrigin: this.timeOrigin,
                timing: {},
                navigation: {}
            };
        }
    }

    // Create and export global performance object
    globalThis.performance = new Performance();
}

// Mark Performance API loaded
globalThis.__NEVER_JSCORE_PERFORMANCE_API_LOADED__ = true;

