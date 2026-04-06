// Deno Web API Initialization for never-jscore
// This file imports all Deno extensions and exposes APIs to globalThis

// Define __getDeno helper for compatibility
globalThis.__getDeno = () => globalThis.Deno;

// ============================================================================
// deno_webidl - WebIDL (Foundation for other APIs)
// ============================================================================
// Note: API Protection utilities are available but protection is handled
// centrally in init_protection.js which runs after all APIs are loaded

import * as webidl from 'ext:deno_webidl/00_webidl.js';

// ============================================================================
// deno_web - Core Web APIs
// ============================================================================
import * as infra from 'ext:deno_web/00_infra.js';
import * as domException from 'ext:deno_web/01_dom_exception.js';
import * as mimesniff from 'ext:deno_web/01_mimesniff.js';
import * as event from 'ext:deno_web/02_event.js';
import * as structuredClone from 'ext:deno_web/02_structured_clone.js';
import * as timers from 'ext:deno_web/02_timers.js';
import * as abortSignal from 'ext:deno_web/03_abort_signal.js';
import * as globalInterfaces from 'ext:deno_web/04_global_interfaces.js';
import * as base64 from 'ext:deno_web/05_base64.js';
import * as streams from 'ext:deno_web/06_streams.js';
import * as encoding from 'ext:deno_web/08_text_encoding.js';
import * as file from 'ext:deno_web/09_file.js';
import * as fileReader from 'ext:deno_web/10_filereader.js';
import * as locationModule from 'ext:deno_web/12_location.js';
import * as messagePort from 'ext:deno_web/13_message_port.js';
import * as compression from 'ext:deno_web/14_compression.js';
import * as performance from 'ext:deno_web/15_performance.js';
import * as imageData from 'ext:deno_web/16_image_data.js';
import * as url from 'ext:deno_web/00_url.js';
import * as urlpattern from 'ext:deno_web/01_urlpattern.js';
import * as console from 'ext:deno_web/01_console.js';
import * as broadcastChannel from 'ext:deno_web/01_broadcast_channel.js';

// DOMException
globalThis.DOMException = domException.DOMException;

// Console API (integrated in deno_web)
globalThis.console = new console.Console((msg, level) => {
    globalThis.Deno.core.print(msg, level > 1);
});

// URL APIs (integrated in deno_web)
globalThis.URL = url.URL;
globalThis.URLSearchParams = url.URLSearchParams;
globalThis.URLPattern = urlpattern.URLPattern;

// BroadcastChannel API (integrated in deno_web)
globalThis.BroadcastChannel = broadcastChannel.BroadcastChannel;

// Event APIs
globalThis.Event = event.Event;
globalThis.EventTarget = event.EventTarget;
globalThis.CustomEvent = event.CustomEvent;
globalThis.ErrorEvent = event.ErrorEvent;
globalThis.CloseEvent = event.CloseEvent;
globalThis.MessageEvent = event.MessageEvent;
globalThis.PromiseRejectionEvent = event.PromiseRejectionEvent;
globalThis.ProgressEvent = event.ProgressEvent;
globalThis.reportError = event.reportError;
globalThis.addEventListener = event.addEventListener;
globalThis.removeEventListener = event.removeEventListener;
globalThis.dispatchEvent = event.dispatchEvent;

// Structured Clone
globalThis.structuredClone = structuredClone.structuredClone;

// Timers -- wrapped as plain functions to be Proxy-safe.
//
// Problem: supplemental environment (bu-huanjing) scripts commonly wrap globalThis
// in a Proxy (e.g. watch(window, "window")). When a timer function is accessed
// through that Proxy and called, the JS engine sets this = <Proxy>, not globalThis.
// Deno's checkThis() in 02_timers.js rejects anything !== null/undefined/globalThis
// and throws "Illegal invocation".
//
// Fix: wrap each function so the internal call is a plain call with no this binding.
// In strict mode a plain call sets this = undefined, which checkThis() allows.
const _setTimeout = timers.setTimeout;
const _clearTimeout = timers.clearTimeout;
const _setInterval = timers.setInterval;
const _clearInterval = timers.clearInterval;

globalThis.setTimeout = function setTimeout(fn, delay, ...args) {
    return _setTimeout(fn, delay, ...args);
};
globalThis.clearTimeout = function clearTimeout(id) {
    return _clearTimeout(id);
};
globalThis.setInterval = function setInterval(fn, delay, ...args) {
    return _setInterval(fn, delay, ...args);
};
globalThis.clearInterval = function clearInterval(id) {
    return _clearInterval(id);
};

// AbortController / AbortSignal
globalThis.AbortController = abortSignal.AbortController;
globalThis.AbortSignal = abortSignal.AbortSignal;

// Base64 encoding/decoding
globalThis.atob = base64.atob;
globalThis.btoa = base64.btoa;

// Streams API
globalThis.ReadableStream = streams.ReadableStream;
globalThis.WritableStream = streams.WritableStream;
globalThis.TransformStream = streams.TransformStream;
globalThis.ReadableStreamDefaultReader = streams.ReadableStreamDefaultReader;
globalThis.WritableStreamDefaultWriter = streams.WritableStreamDefaultWriter;
globalThis.ByteLengthQueuingStrategy = streams.ByteLengthQueuingStrategy;
globalThis.CountQueuingStrategy = streams.CountQueuingStrategy;
globalThis.ReadableByteStreamController = streams.ReadableByteStreamController;
globalThis.ReadableStreamBYOBReader = streams.ReadableStreamBYOBReader;
globalThis.ReadableStreamBYOBRequest = streams.ReadableStreamBYOBRequest;
globalThis.ReadableStreamDefaultController = streams.ReadableStreamDefaultController;
globalThis.TransformStreamDefaultController = streams.TransformStreamDefaultController;
globalThis.WritableStreamDefaultController = streams.WritableStreamDefaultController;

// Text Encoding/Decoding
globalThis.TextEncoder = encoding.TextEncoder;
globalThis.TextDecoder = encoding.TextDecoder;
globalThis.TextEncoderStream = encoding.TextEncoderStream;
globalThis.TextDecoderStream = encoding.TextDecoderStream;

// File API
globalThis.Blob = file.Blob;
globalThis.File = file.File;
globalThis.FileReader = fileReader.FileReader;

// Compression Streams
globalThis.CompressionStream = compression.CompressionStream;
globalThis.DecompressionStream = compression.DecompressionStream;

// Performance API
globalThis.Performance = performance.Performance;
globalThis.PerformanceEntry = performance.PerformanceEntry;
globalThis.PerformanceMark = performance.PerformanceMark;
globalThis.PerformanceMeasure = performance.PerformanceMeasure;
globalThis.performance = performance.performance;

// ImageData
globalThis.ImageData = imageData.ImageData;

// MessagePort
globalThis.MessageChannel = messagePort.MessageChannel;
globalThis.MessagePort = messagePort.MessagePort;

// ============================================================================
// deno_crypto - Web Crypto API
// ============================================================================
import * as crypto from 'ext:deno_crypto/00_crypto.js';

globalThis.crypto = crypto.crypto;
globalThis.Crypto = crypto.Crypto;
globalThis.CryptoKey = crypto.CryptoKey;
globalThis.SubtleCrypto = crypto.SubtleCrypto;

// ============================================================================
// deno_fetch - Fetch API
// ============================================================================
import * as fetchModule from 'ext:deno_fetch/26_fetch.js';
import * as headersModule from 'ext:deno_fetch/20_headers.js';
import * as formDataModule from 'ext:deno_fetch/21_formdata.js';
import * as requestModule from 'ext:deno_fetch/23_request.js';
import * as responseModule from 'ext:deno_fetch/23_response.js';

globalThis.fetch = fetchModule.fetch;
globalThis.Request = requestModule.Request;
globalThis.Response = responseModule.Response;
globalThis.Headers = headersModule.Headers;
globalThis.FormData = formDataModule.FormData;

// ============================================================================
// deno_webstorage - localStorage and sessionStorage
// ============================================================================
import * as webStorageModule from 'ext:deno_webstorage/01_webstorage.js';

globalThis.Storage = webStorageModule.Storage;

// Create storage instances (deno_webstorage exports factory functions)
// localStorage and sessionStorage from deno are factory functions that need to be called
if (typeof webStorageModule.localStorage === 'function') {
    try {
        globalThis.localStorage = webStorageModule.localStorage();
    } catch (e) {
        // Fallback: try to use as-is
        globalThis.localStorage = webStorageModule.localStorage;
    }
} else {
    globalThis.localStorage = webStorageModule.localStorage;
}

if (typeof webStorageModule.sessionStorage === 'function') {
    try {
        globalThis.sessionStorage = webStorageModule.sessionStorage();
    } catch (e) {
        // Fallback: try to use as-is
        globalThis.sessionStorage = webStorageModule.sessionStorage;
    }
} else {
    globalThis.sessionStorage = webStorageModule.sessionStorage;
}

// ============================================================================
// never_jscore custom APIs (hook interception)
// ============================================================================

// $return() - Early return with result storage (catchable by try-catch)
globalThis.$return = function(value) {
    const json = JSON.stringify(value);
    globalThis.Deno.core.ops.op_store_result(json);
    throw new Error(`__EARLY_RETURN__:${json}`);
};

// Legacy alias
globalThis.__neverjscore_return__ = globalThis.$return;

// $terminate() - Force terminate execution (uncatchable, uses V8 terminate_execution)
globalThis.$terminate = function(value) {
    const json = JSON.stringify(value);
    // Save data to global storage first
    globalThis.Deno.core.ops.op_save_hook_data(json);
    // Then terminate execution (uncatchable)
    globalThis.Deno.core.ops.op_terminate_execution();
};

// Enhanced terminate with data saving
globalThis.__saveAndTerminate__ = globalThis.$terminate;


// ============================================================================
// Anti-Detection: Handled by init_protection.js (loaded later)
// All protection logic is centralized in src/ext/protection/init_protection.js
// ============================================================================

// ============================================================================
// Debug & Logging (optional)
// ============================================================================

if (globalThis.__NEVER_JSCORE_LOGGING__) {
    console.log('[never-jscore] Deno extensions initialized successfully');
    console.log('[never-jscore] Available APIs:', Object.keys(globalThis).filter(k =>
        typeof globalThis[k] === 'function' ||
        (typeof globalThis[k] === 'object' && globalThis[k] !== null)
    ).sort().join(', '));
}
