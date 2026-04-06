// Unified Browser Protection for never-jscore
// Makes all Web APIs appear as native browser implementations
// This is the ONLY protection file - all protection logic is centralized here

(() => {
    'use strict';

    // ========================================================================
    // Step 1: Store original functions before any modification
    // ========================================================================
    const OriginalFunction = Function;
    const originalFunctionToString = Function.prototype.toString;
    const originalObjectKeys = Object.keys;
    const originalGetOwnPropertyNames = Object.getOwnPropertyNames;
    const originalGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    const originalGetOwnPropertyDescriptors = Object.getOwnPropertyDescriptors;
    const originalReflectOwnKeys = Reflect.ownKeys;
    const originalGetPrototypeOf = Object.getPrototypeOf;
    const originalDefineProperty = Object.defineProperty;

    // ========================================================================
    // Step 2: Hide Deno internals (keep internal reference for ops)
    // ========================================================================
    if (typeof Deno !== 'undefined') {
        const __realDeno__ = Deno;

        // Store real Deno for internal ops (non-enumerable, hidden name)
        try {
            originalDefineProperty(globalThis, '__deno_internal__', {
                value: __realDeno__,
                writable: false,
                enumerable: false,
                configurable: false
            });
        } catch (e) {
            // Already exists
        }

        // Hide Deno from enumeration
        try {
            originalDefineProperty(globalThis, 'Deno', {
                enumerable: false,
                configurable: false
            });
        } catch (e) {
            // Can't modify
        }
    }

    // ========================================================================
    // Step 3: Logging system (if enabled)
    // ========================================================================
    const loggingEnabled = typeof globalThis.__NEVER_JSCORE_LOGGING__ !== 'undefined' &&
                          globalThis.__NEVER_JSCORE_LOGGING__;

    // Get Deno core ops for logging
    const denoCore = globalThis.__deno_internal__ || globalThis.Deno;
    const logOp = denoCore?.core?.ops?.op_log;

    /**
     * Log API call to Rust side (if logging enabled)
     */
    function logAPICall(apiName, args) {
        if (!loggingEnabled || !logOp) return;

        try {
            // Format arguments safely
            const argsStr = Array.from(args).map((arg) => {
                if (arg === null) return 'null';
                if (arg === undefined) return 'undefined';
                if (typeof arg === 'function') return '[Function]';
                if (typeof arg === 'object') {
                    try {
                        // Limit object depth
                        const str = JSON.stringify(arg);
                        return str.length > 100 ? str.substring(0, 100) + '...' : str;
                    } catch {
                        return '[Object]';
                    }
                }
                const str = String(arg);
                return str.length > 50 ? str.substring(0, 50) + '...' : str;
            }).join(', ');

            logOp(`[API] ${apiName}(${argsStr})`);
        } catch (e) {
            // Silently ignore logging errors
        }
    }

    // ========================================================================
    // Step 4: Native code protection - Unified implementation
    // ========================================================================
    const protectedFunctions = new WeakSet();
    const originalFunctions = new WeakMap(); // Store original for internal use
    const nativeCodeString = (name) => `function ${name || ''}() { [native code] }`;

    /**
     * Make a function appear as native code with optional logging
     * Uses defineProperty approach (more reliable than Proxy)
     */
    function makeNative(fn, name, enableLogging = false) {
        if (!fn || typeof fn !== 'function') return fn;
        if (protectedFunctions.has(fn)) return fn;

        const targetName = name || fn.name || 'anonymous';
        let wrappedFn = fn;

        // Wrap with logging if enabled
        if (enableLogging && loggingEnabled) {
            const originalFn = fn;
            wrappedFn = function(...args) {
                logAPICall(targetName, args);
                return originalFn.apply(this, args);
            };

            // Store original function
            originalFunctions.set(wrappedFn, originalFn);

            // Copy length property
            try {
                originalDefineProperty(wrappedFn, 'length', {
                    value: originalFn.length,
                    writable: false,
                    enumerable: false,
                    configurable: true
                });
            } catch (e) {}
        }

        try {
            // Override toString
            originalDefineProperty(wrappedFn, 'toString', {
                value: function() {
                    return nativeCodeString(targetName);
                },
                writable: false,
                enumerable: false,
                configurable: true
            });

            // Fix name
            originalDefineProperty(wrappedFn, 'name', {
                value: targetName,
                writable: false,
                enumerable: false,
                configurable: true
            });

            protectedFunctions.add(wrappedFn);
        } catch (e) {
            // Some built-in functions can't be modified
        }

        return wrappedFn;
    }

    /**
     * Protect a class constructor and all its prototype methods
     */
    function protectClass(ClassConstructor, className) {
        if (!ClassConstructor || typeof ClassConstructor !== 'function') return ClassConstructor;

        // Protect constructor
        makeNative(ClassConstructor, className);

        // Protect prototype methods
        if (ClassConstructor.prototype) {
            const proto = ClassConstructor.prototype;

            // Make constructor property non-enumerable
            try {
                originalDefineProperty(proto, 'constructor', {
                    value: ClassConstructor,
                    writable: true,
                    enumerable: false,
                    configurable: true
                });
            } catch (e) {}

            // Protect all methods
            const methodNames = originalGetOwnPropertyNames(proto);
            for (const methodName of methodNames) {
                if (methodName === 'constructor') continue;

                try {
                    const descriptor = originalGetOwnPropertyDescriptor(proto, methodName);
                    if (descriptor && typeof descriptor.value === 'function') {
                        makeNative(descriptor.value, methodName);
                    }
                    // Also protect getters/setters
                    if (descriptor && typeof descriptor.get === 'function') {
                        makeNative(descriptor.get, `get ${methodName}`);
                    }
                    if (descriptor && typeof descriptor.set === 'function') {
                        makeNative(descriptor.set, `set ${methodName}`);
                    }
                } catch (e) {}
            }
        }

        // Protect static methods
        const staticNames = originalGetOwnPropertyNames(ClassConstructor);
        for (const name of staticNames) {
            if (['prototype', 'length', 'name', 'toString'].includes(name)) continue;
            try {
                const descriptor = originalGetOwnPropertyDescriptor(ClassConstructor, name);
                if (descriptor && typeof descriptor.value === 'function') {
                    makeNative(descriptor.value, name);
                }
            } catch (e) {}
        }

        return ClassConstructor;
    }

    // ========================================================================
    // Step 4: Override Function.prototype.toString globally
    // ========================================================================
    Function.prototype.toString = function() {
        // If this function is protected, return native code string
        if (protectedFunctions.has(this)) {
            return nativeCodeString(this.name);
        }
        // Otherwise use original toString
        return originalFunctionToString.call(this);
    };
    protectedFunctions.add(Function.prototype.toString);

    // ========================================================================
    // Step 5: Protect all Web APIs
    // ========================================================================

    // Complete list of all global APIs to protect
    const globalClasses = [
        // Encoding
        'TextEncoder', 'TextDecoder', 'TextEncoderStream', 'TextDecoderStream',

        // URL
        'URL', 'URLSearchParams', 'URLPattern',

        // Events
        'Event', 'EventTarget', 'CustomEvent', 'ErrorEvent', 'CloseEvent',
        'MessageEvent', 'PromiseRejectionEvent', 'ProgressEvent',

        // Abort
        'AbortController', 'AbortSignal',

        // Fetch API
        'Headers', 'Request', 'Response', 'FormData',

        // File API
        'Blob', 'File', 'FileReader',

        // Streams
        'ReadableStream', 'WritableStream', 'TransformStream',
        'ReadableStreamDefaultReader', 'WritableStreamDefaultWriter',
        'ReadableByteStreamController', 'ReadableStreamBYOBReader',
        'ReadableStreamBYOBRequest', 'ReadableStreamDefaultController',
        'TransformStreamDefaultController', 'WritableStreamDefaultController',
        'ByteLengthQueuingStrategy', 'CountQueuingStrategy',

        // Compression
        'CompressionStream', 'DecompressionStream',

        // Crypto
        'Crypto', 'CryptoKey', 'SubtleCrypto',

        // Performance
        'Performance', 'PerformanceEntry', 'PerformanceMark', 'PerformanceMeasure',

        // Storage
        'Storage',

        // Message
        'MessageChannel', 'MessagePort', 'BroadcastChannel',

        // Image
        'ImageData',

        // Exception
        'DOMException',

        // XMLHttpRequest
        'XMLHttpRequest',

        // Console
        'Console',
    ];

    // Functions with logging enabled (key APIs to monitor)
    const globalFunctionsWithLogging = [
        'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval',
        'queueMicrotask', 'fetch', 'atob', 'btoa',
    ];

    // Functions without logging (less important)
    const globalFunctionsNoLogging = [
        'addEventListener', 'removeEventListener', 'dispatchEvent', 'reportError',
        'structuredClone',
        '$return', '$exit', '$terminate', '$storeResult',
        '__neverjscore_return__', '__saveAndTerminate__', '__getDeno',
    ];

    // Protect classes
    for (const className of globalClasses) {
        if (typeof globalThis[className] === 'function') {
            try {
                protectClass(globalThis[className], className);
            } catch (e) {}
        }
    }

    // Protect functions with logging
    for (const funcName of globalFunctionsWithLogging) {
        if (typeof globalThis[funcName] === 'function') {
            try {
                const originalFn = globalThis[funcName];
                const wrappedFn = makeNative(originalFn, funcName, true); // Enable logging
                if (wrappedFn !== originalFn) {
                    globalThis[funcName] = wrappedFn;
                }
            } catch (e) {}
        }
    }

    // Protect functions without logging
    for (const funcName of globalFunctionsNoLogging) {
        if (typeof globalThis[funcName] === 'function') {
            try {
                makeNative(globalThis[funcName], funcName, false);
            } catch (e) {}
        }
    }

    // Protect crypto object methods with logging
    if (typeof crypto !== 'undefined') {
        if (typeof crypto.getRandomValues === 'function') {
            const original = crypto.getRandomValues;
            const wrapped = makeNative(original.bind(crypto), 'getRandomValues', true);
            crypto.getRandomValues = wrapped;
        }
        if (typeof crypto.randomUUID === 'function') {
            const original = crypto.randomUUID;
            const wrapped = makeNative(original.bind(crypto), 'randomUUID', true);
            crypto.randomUUID = wrapped;
        }

        if (crypto.subtle) {
            const subtleMethods = ['encrypt', 'decrypt', 'sign', 'verify', 'digest',
                'generateKey', 'deriveKey', 'deriveBits', 'importKey', 'exportKey',
                'wrapKey', 'unwrapKey'];
            for (const method of subtleMethods) {
                if (typeof crypto.subtle[method] === 'function') {
                    const original = crypto.subtle[method];
                    const wrapped = makeNative(original.bind(crypto.subtle), method, true);
                    crypto.subtle[method] = wrapped;
                }
            }
        }
    }

    // Protect console methods (no logging to avoid recursion)
    if (typeof console !== 'undefined') {
        const consoleMethods = ['log', 'info', 'warn', 'error', 'debug', 'trace',
            'dir', 'dirxml', 'table', 'count', 'countReset', 'group', 'groupCollapsed',
            'groupEnd', 'time', 'timeEnd', 'timeLog', 'assert', 'clear', 'profile',
            'profileEnd', 'timeStamp'];
        for (const method of consoleMethods) {
            if (typeof console[method] === 'function') {
                makeNative(console[method], method, false);
            }
        }
    }

    // Protect performance methods with logging
    if (typeof performance !== 'undefined') {
        const perfMethods = ['now', 'mark', 'measure', 'clearMarks', 'clearMeasures',
            'getEntries', 'getEntriesByName', 'getEntriesByType', 'toJSON'];
        for (const method of perfMethods) {
            if (typeof performance[method] === 'function') {
                const original = performance[method];
                const wrapped = makeNative(original.bind(performance), method, true);
                performance[method] = wrapped;
            }
        }
    }

    // ========================================================================
    // Step 6: Protect reflection APIs
    // ========================================================================

    // Hidden properties that should not be exposed.
    // Node.js-specific globals (Buffer, require, etc.) are hidden so that
    // browser-fingerprint scripts cannot detect a Node/Deno runtime environment.
    const hiddenGlobalProps = [
        // Deno internals
        'Deno', '__deno_core__', '__deno_internal__', '__NEVER_JSCORE_LOGGING__',
        // Node.js globals that betray a non-browser environment
        'global', 'Buffer', 'require', 'module', '__dirname', '__filename',
        'setImmediate', 'clearImmediate', 'process',
    ];

    // Object.keys - hide Deno-related properties
    Object.keys = function(obj) {
        const keys = originalObjectKeys(obj);
        if (obj === globalThis) {
            return keys.filter(key => !hiddenGlobalProps.includes(key));
        }
        return keys;
    };
    makeNative(Object.keys, 'keys');

    // Object.getOwnPropertyNames - hide Deno-related properties
    Object.getOwnPropertyNames = function(obj) {
        const names = originalGetOwnPropertyNames(obj);
        if (obj === globalThis) {
            return names.filter(name => !hiddenGlobalProps.includes(name));
        }
        return names;
    };
    makeNative(Object.getOwnPropertyNames, 'getOwnPropertyNames');

    // Object.getOwnPropertyDescriptors - hide Deno-related properties
    Object.getOwnPropertyDescriptors = function(obj) {
        const descriptors = originalGetOwnPropertyDescriptors(obj);
        if (obj === globalThis) {
            for (const prop of hiddenGlobalProps) {
                delete descriptors[prop];
            }
        }
        return descriptors;
    };
    makeNative(Object.getOwnPropertyDescriptors, 'getOwnPropertyDescriptors');

    // Reflect.ownKeys - hide Deno-related properties
    Reflect.ownKeys = function(obj) {
        const keys = originalReflectOwnKeys(obj);
        if (obj === globalThis) {
            return keys.filter(key =>
                typeof key !== 'string' || !hiddenGlobalProps.includes(key)
            );
        }
        return keys;
    };
    makeNative(Reflect.ownKeys, 'ownKeys');

    // ========================================================================
    // Step 7: Error.stack cleanup
    // ========================================================================
    const originalErrorConstructor = Error;
    const stackCleanPatterns = [
        // Deno extension module paths
        /\s+at\s+.*ext:.*\n?/g,
        /\s+at\s+.*deno:.*\n?/g,
        /\s+at\s+.*deno_.*\n?/g,
        /\s+at\s+.*__deno.*\n?/g,
        /\s+at\s+.*never_jscore.*\n?/g,
        // V8 internal synthetic script names used by never-jscore runtime
        /\s+at\s+.*<init_core>.*\n?/g,
        /\s+at\s+.*<init_xhr>.*\n?/g,
        /\s+at\s+.*<exec>.*\n?/g,
        /\s+at\s+.*<eval_async>.*\n?/g,
        /\s+at\s+.*<anonymous>.*never.*\n?/g,
    ];

    function cleanStack(stack) {
        if (!stack) return stack;
        let cleaned = stack;
        for (const pattern of stackCleanPatterns) {
            cleaned = cleaned.replace(pattern, '');
        }
        // Remove multiple consecutive newlines
        cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
        return cleaned;
    }

    // Override Error.prepareStackTrace if available (V8)
    if (typeof Error.captureStackTrace === 'function') {
        const originalCaptureStackTrace = Error.captureStackTrace;
        Error.captureStackTrace = function(targetObject, constructorOpt) {
            originalCaptureStackTrace.call(this, targetObject, constructorOpt);
            if (targetObject.stack) {
                targetObject.stack = cleanStack(targetObject.stack);
            }
        };
        makeNative(Error.captureStackTrace, 'captureStackTrace');
    }

    // Override stack property on Error.prototype
    const originalStackDescriptor = originalGetOwnPropertyDescriptor(Error.prototype, 'stack');
    if (originalStackDescriptor) {
        originalDefineProperty(Error.prototype, 'stack', {
            get: function() {
                const stack = originalStackDescriptor.get ?
                    originalStackDescriptor.get.call(this) :
                    this._stack;
                return cleanStack(stack);
            },
            set: function(value) {
                if (originalStackDescriptor.set) {
                    originalStackDescriptor.set.call(this, value);
                } else {
                    this._stack = value;
                }
            },
            enumerable: false,
            configurable: true
        });
    }

    // ========================================================================
    // Step 8: Symbol.toStringTag protection
    // ========================================================================

    // Ensure objects have correct toStringTag
    const toStringTagMap = {
        'crypto': 'Crypto',
        'performance': 'Performance',
        'console': 'console',
        'localStorage': 'Storage',
        'sessionStorage': 'Storage',
    };

    for (const [objName, tag] of Object.entries(toStringTagMap)) {
        const obj = globalThis[objName];
        if (obj && typeof obj === 'object') {
            try {
                originalDefineProperty(obj, Symbol.toStringTag, {
                    value: tag,
                    writable: false,
                    enumerable: false,
                    configurable: true
                });
            } catch (e) {}
        }
    }

    // ========================================================================
    // Step 9: Freeze critical protections
    // ========================================================================
    Object.freeze(Object.keys);
    Object.freeze(Object.getOwnPropertyNames);
    Object.freeze(Object.getOwnPropertyDescriptors);
    Object.freeze(Reflect.ownKeys);
    Object.freeze(Function.prototype.toString);

})();
