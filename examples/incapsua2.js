// 2412414 JOYBOY123J12LKJLKASJDASDA;


panda_vm = {}
panda_vm.storage = {}
myProxy = function (obj_, obj_name, proxy = false) {
function set_traverse_object(tarrget, obj, recursion_layers) {
    recursion_layers -= 1;
    for (let prop in obj) {
        const value = obj[prop];
        const tg_name = `${tarrget}.${prop.toString()}`;
        const value_type = get_value_type(value);
        if (value && value_type === "object" && recursion_layers >= 1) {
            set_traverse_object(tg_name, value, recursion_layers);
            continue
        }
        if (value && value.toString() !== '[object Object]') {
            // console.log(`setter  hook->${tg_name};  value-> ${value};  typeof-> ${value_type}`);
            continue
        }
        // console.log(`setter  hook->${tg_name};  value-> ${value};  typeof-> ${value_type}`)
    }
}

function new_handel(target_name, obj, number) {
    return new Proxy(obj, my_handler(target_name, number))
}

function get_value_type(value) {
    if (Array.isArray(value)) {
        return 'Array'
    }
    return typeof value;
}

function my_handler(target_name, number) {
    return {
        set: function (obj, prop, value) {
            const value_type = get_value_type(value);
            const tg_name = `${target_name}.${prop.toString()}`;

            if (value && value_type === "object") {
                set_traverse_object(tg_name, value, number)
            } else {
                if (tg_name.toString().indexOf('tuKr9') != -1) {
                    debugger;
                }
                // console.log(`setter  hook->${tg_name};  value-> ${value};  typeof-> ${value_type}`)
            }
            return Reflect.set(obj, prop, value);
        },
        get: function (obj, prop) {
            const tg_name = `${target_name}.${prop.toString()}`;
            const value = Reflect.get(obj, prop);
            let value_type = get_value_type(value);
            if (value && value_type === 'object') {
                return new_handel(tg_name, value, number)
            }
            if (tg_name === "document.body.parentNode.attributes") {
                debugger;
            }
            if (value === 'HTMLDocument') {
                debugger
            }
            if (tg_name === 'navigator.plugins.undefined') {
                debugger
            }
            // console.log(`getter  hook->${tg_name};  value-> ${value};  typeof-> ${value_type}`);
            return value
        },
        deleteProperty(target, propKey) {
            // 没有实现链式输出
            let result = Reflect.deleteProperty(target, propKey);
            let value_type = get_value_type(result);

            // console.log(`delete hook-> ${propKey}, result-> ${result};  typeof-> ${value_type}`);
            return result;
        }
    }
}

if (!(proxy === true)) {
    return obj_;
}
return new Proxy(obj_, my_handler(obj_name, 30));
};
!function () {
const $toString = Function.prototype.toString;
const symbol = Symbol(); // 独一无二的属性
let myToString = function myToString() {
    return typeof this === 'function' && this[symbol] || $toString.call(this);
}
myToString.toString = new Proxy(Date.toString, {
    get: function (target, property) {
        if (typeof property === 'symbol') {
            return function () {
                return '[object Object]'
            }
        }
        if (property === 'name') {
            return 'toString'
        }
        if (property === 'toString') {
            return function () {
                return "function toString() { [native code] }"
            }
        }
        // debugger
        // 对于除了 'arguments' 外的属性，返回原始函数对象的属性值
        return target[property];
    }
});
myToString = new Proxy(myToString, {
    get: function (target, property) {
        // if (property === 'arguments') {
        //     throw new TypeError('\'caller\', \'callee\', and \'arguments\' properties may not be accessed on strict mode functions or the arguments objects for calls to them');
        // }
        // if (typeof property === 'symbol') {
        //     return function () {
        //         return '[object Object]'
        //     }
        // }
        if (property === 'name') {
            return 'toString'
        }
        if (property === 'call') {
            return function () {
                if (arguments[0].name === 's') {
                    return 'function(){if("function"==typeof this){const s=this[n];if(s)return"function"==typeof s?e.call(s):Object.prototype.toString.call(s);if(this===Promise){const n=t[i];if(n)return e.call(n)}if(this===Error){const n=t[r];if(n)return e.call(n)}}return e.call(this)}'
                } else if (arguments[0].name === 'stringify') {
                    return 'function stringify() { [native code] }'
                } else if (arguments[0].name === 'getOwnPropertyDescriptor') {
                    return "function getOwnPropertyDescriptor() { [native code] }"
                } else if (arguments[0].name === 'call') {
                    return 'function call() { [native code] }'
                } else if (arguments[0].name === 'apply') {
                    return 'function apply() { [native code] }'
                } else if (arguments[0].name === 'bind') {
                    return 'function bind() { [native code] }'
                } else if (arguments[0].name === 'getParameter') {
                    return 'function getParameter() { [native code] }'
                } else if (arguments[0].name === 'getBattery') {
                    return 'function getBattery() { [native code] }'
                } else if (arguments[0].name === 'debug') {
                    return 'function () { [native code] }'
                } else if (arguments[0].name === '') {
                    return 'function () { [native code] }'
                } else if (arguments[0].name === 'get window') {
                    return arguments[0] + ''
                }

            }
        }
        if (property === 'toString') {
            return function () {
                return "function toString() { [native code] }"

            }
        }
        // debugger
        // 对于除了 'arguments' 外的属性，返回原始函数对象的属性值
        return target[property];
    }
});

function set_native(func, key, value) {
    Object.defineProperty(func, key, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: value
    });
}

stringify_toString = JSON.stringify.toString
get_window = function () {
}
getOwnPropertyDescriptor__ = Object.getOwnPropertyDescriptor
Object.getOwnPropertyDescriptor = function () {
    if (arguments[1] === 'window') {
        return {

            get: get_window,
            configurable: false,
            enumerable: false
        }
    }
    return getOwnPropertyDescriptor__.apply(this, arguments)
}
Object.getOwnPropertyDescriptor.toString = function toString() {
    return "function getOwnPropertyDescriptor() { [native code] }"
}
Object.defineProperty(Object.getOwnPropertyDescriptor, 'name', {
    get(){
        return 'getOwnPropertyDescriptor'},
    set(){}
});
delete Function.prototype.toString;
set_native(Function.prototype, "toString", myToString);
set_native(Function.prototype.toString, symbol, "function toString() { [native code] }");  // todo
set_native(Function.prototype.toString.toString, 'toString', myToString)
setNative = function (func, funcname) {
    set_native(func, symbol, `function ${funcname || func.name || ''}() { [native code] }`);
}
JSON.stringify.toString = stringify_toString
setNative(get_window, 'get window')
Object.defineProperty(get_window, 'name', {
    get() {
        return 'get window'
    }
})
}();

function setPrototypeNative(Obj) {
setNative(Obj, Obj.name)

for (let i in Obj.prototype) {
    let value = Object.getOwnPropertyDescriptor(Obj.prototype, i)
    if (value.get) {
        setNative(value.get, 'get ' + i);
    }
    if (value.value) {
        setNative(value.value, i);
    }
}
}

function definedWindow(name) {
Object.defineProperty(window, name, {
    configurable: true,
    enumerable: true,
    get: function () {
        return null
    },
    set: undefined,
})
}

function setPlugin(obj, name, value) {
let tmp = {}
Object.setPrototypeOf(tmp, Plugin.prototype)
Object.defineProperty(tmp, name, {
    value: value,
    writable: false,
    enumerable: false,
    configurable: true
})
Object.setPrototypeOf(obj, tmp)
}

// my_log = console.log
// console.log = function () {
// }

function setNameEmpty(fun) {
Object.defineProperty(fun, 'name', {
        get() {
            return ''
        }
    }
)
}

// fetch = function () {
//     my_log(arguments[1].body)
//     process.exit()
// }


setNative(btoa, 'btoa')
setTimeout = function setTimeout(fun,x){
    // fun.apply(this)
}
setNative(setTimeout, 'setTimeout')


window = globalThis
window.globalCanvas = {}
window.CanvasObj = {}

window.reeseSkipExpirationCheck = true;  // todo
window.chrome = {
'loadTimes': function () {
},
'csi': function csi() {
},
"app": {
    "isInstalled": false,
    getDetails() {
    },
    getIsInstalled() {
    },
    installState() {
    },
    runningState() {
    },
    "InstallState": {"DISABLED": "disabled", "INSTALLED": "installed", "NOT_INSTALLED": "not_installed"},
    "RunningState": {"CANNOT_RUN": "cannot_run", "READY_TO_RUN": "ready_to_run", "RUNNING": "running"},
}
}
var abcd = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36';
window.firstIframs = true
onlubKeys = ['onbeforeinstallprompt', 'onbeforexrselect', 'onbeforeinput', 'onbeforematch', 'onbeforetoggle', 'onblur', 'onbeforeprint', 'onbeforeunload', 'onunhandledrejection', 'onunload']
for (let i of onlubKeys) {
definedWindow(i)
}
// 'onbeforeprint', 'onbeforeunload', 'onunhandledrejection', 'onunload'

Object["getOwnPropertyNames_"] = Object["getOwnPropertyNames"]
window.getOwnPropertyNames_flag = true
window.getOwnPropertyNames_flag02 = false

Object["getOwnPropertyNames"] = function () {
if (getOwnPropertyNames_flag && arguments[0] === window) {
    getOwnPropertyNames_flag = false
    getOwnPropertyNames_flag02 = true

    return ['WritableStreamDefaultController', "onbeforeinstallprompt", "onbeforeinput", "onbeforematch", "onbeforetoggle", "onblur", "onbeforeprint", "onbeforeunload", "onunhandledrejection", "onunload",'WindowControlsOverlayGeometryChangeEvent', 'VirtualKeyboardGeometryChangeEvent', 'TransformStreamDefaultController', 'SVGComponentTransferFunctionElement', 'SVGAnimatedPreserveAspectRatio', 'ReadableStreamDefaultController', 'RTCPeerConnectionIceErrorEvent', 'OffscreenCanvasRenderingContext2D', 'NavigationCurrentEntryChangeEvent', 'MediaStreamAudioDestinationNode', 'ContentVisibilityAutoStateChangeEvent', 'BrowserCaptureMediaStreamTrack', 'oncontentvisibilityautostatechange', 'WebTransportBidirectionalStream', 'WebTransportDatagramDuplexStream', 'AuthenticatorAssertionResponse', 'AuthenticatorAttestationResponse', 'BluetoothCharacteristicProperties', 'BluetoothRemoteGATTCharacteristic', 'PresentationConnectionAvailableEvent', 'PresentationConnectionCloseEvent', 'USBIsochronousInTransferPacket', 'USBIsochronousInTransferResult', 'USBIsochronousOutTransferPacket', 'USBIsochronousOutTransferResult', 'PerformanceLongAnimationFrameTiming', 'webkitResolveLocalFileSystemURL', 'reese84InternalProtectionLoaded']
}
if (getOwnPropertyNames_flag02 && arguments[0] === window) {
    getOwnPropertyNames_flag02 = false
    // return ['__zone_symbol__ononlanguagechangepatched', '__zone_symbol__ononmessagepatched', '__zone_symbol__ononofflinepatched', '__zone_symbol__onononlinepatched', '__zone_symbol__ononpageshowpatched', '__zone_symbol__ononpagehidepatched', '__zone_symbol__ononpopstatepatched', '__zone_symbol__ononrejectionhandledpatched', '__zone_symbol__ononstoragepatched', '__zone_symbol__ononunhandledrejectionpatched', '__zone_symbol__ononunloadpatched', '__zone_symbol__onondragstartpatched', '__zone_symbol__ononanimationstartpatched', '__zone_symbol__ononsearchpatched', '__zone_symbol__onontransitionrunpatched', '__zone_symbol__onontransitionstartpatched', '__zone_symbol__ononwebkitanimationendpatched', '__zone_symbol__ononwebkitanimationiterationpatched', '__zone_symbol__ononwebkitanimationstartpatched', '__zone_symbol__ononwebkittransitionendpatched', '__zone_symbol__ononpointeroutpatched', '__zone_symbol__ononmessageerrorpatched', 'google_tag_manager', 'postscribe', 'google_tag_manager_external', 'google_tag_data', '__zone_symbol__loadfalse', 'webpackChunkweb_push_sdk', '__zone_symbol__storagefalse', 'reeseRetriedAutoload']
    return [
    "SharedWorker",
    "SpeechSynthe$",
    "SpeechSynthe$",
    "SpeechSynthe$",
    "SpeechSynthe$",
    "SpeechSynthe$",
    "ViewTransiti$",
    "WebSocketErr$",
    "WebSocketStr$",
    "webkitSpeech$",
    "webkitSpeech$",
    "webkitSpeech$",
    "webkitSpeech$",
    "webkitSpeech$",
    "webkitReques$",
    "webkitResolv$",
    "isSpa",
    "onProtection$",
    "reeseSkipExp$",
    "scriptElemen$",
    "showBlockPag$",
    "reese84",
    "a1_0x1616",
    "a1_0x584b",
    "reese84inter$",
    "initializePr$",
    "reeseScriptL$",
    "protectionSu$",
    "protectionLo$",
    "reese84Inter$"
]
}
return Object["getOwnPropertyNames_"].apply(this, arguments)
}
setNameEmpty(window.chrome.loadTimes)
setNameEmpty(window.chrome.csi)
setNative(window.chrome.loadTimes, '')
setNative(window.chrome.csi, 'csi')
setNative(window.chrome.app.getDetails, 'getDetails')
setNative(window.chrome.app.getIsInstalled, 'getIsInstalled')
setNative(window.chrome.app.installState, 'installState')
setNative(window.chrome.app.runningState, 'runningState')
window['__8'] = [3413, 3412, 3411, 3410]
window['__16'] = [34047, 34930, 34921, 35660]
window['__24'] = [3414]
window['__32'] = [35661]
window['__1024'] = [36349]
window['__4096'] = [36347]
window['__16384'] = [34076, 34024, 3379]
window['__23127'] = [[35633, 36338], [35633, 36337], [35633, 36336], [35632, 36338], [35632, 36337], [35632, 36336]]
window['__030'] = [[35633, 36341], [35633, 36340], [35633, 36339], [35632, 36341], [35632, 36340], [35632, 36339]]
window['__all_head_tag'] = [{
"tagName": "SCRIPT",
"src": "https://www.flysas.com/v1/airbus-boeing/1jiZy1uDyyRvmHb"
}] // 所有head的dom节点
window['__all_body_tag'] = [] // 所有body的dom节点
window.innerWidth = 0  // todo
window.innerHeight = 0; // todo
window.outerWidth = 1280;
window.outerHeight = 672;
window.devicePixelRatio = 1.5;
window.screenX = 0;
window.screenY = 0;
window.PERSISTENT = 1
window.TEMPORARY = 0


// PerformanceObserver
window.PerformanceObserver = function PerformanceObserver() {
if (new.target !== PerformanceObserver)
    throw new TypeError('Failed to construct \'Blob\': Please use the \'new\' operator, this DOM object constructor cannot be called as a function.')
if (arguments.length === 0) {
    throw new TypeError('Failed to construct \'PerformanceObserver\': 1 argument required, but only 0 present.')
}
}
PerformanceObserver.supportedEntryTypes = ['element', 'event', 'first-input', 'largest-contentful-paint', 'layout-shift', 'long-animation-frame', 'longtask', 'mark', 'measure', 'navigation', 'paint', 'resource', 'visibility-state']
PerformanceObserver.prototype = {
observe() {
    if (!(this instanceof PerformanceObserver))
        throw new TypeError('Illegal invocation')
}
}
PerformanceObserver.prototype[Symbol.toStringTag] = "PerformanceObserver"
setPrototypeNative(PerformanceObserver)

// VisualViewport
window.VisualViewport = function VisualViewport() {
throw new TypeError('Illegal invocation')
}
VisualViewport.prototype = {
get height() {
    if (!(this instanceof VisualViewport))
        throw new TypeError('Illegal invocation')
    return 654
},
get offsetLeft() {
    if (!(this instanceof VisualViewport))
        throw new TypeError('Illegal invocation')
    return 0
},
get offsetTop() {
    if (!(this instanceof VisualViewport))
        throw new TypeError('Illegal invocation')
    return 0
},
get scale() {
    if (!(this instanceof VisualViewport))
        throw new TypeError('Illegal invocation')
    return 1
},
get pageLeft() {
    if (!(this instanceof VisualViewport))
        throw new TypeError('Illegal invocation')
    return 0
},
get pageTop() {
    if (!(this instanceof VisualViewport))
        throw new TypeError('Illegal invocation')
    return 0
},
get width() {
    if (!(this instanceof VisualViewport))
        throw new TypeError('Illegal invocation')
    return 1358
},
get onresize() {
    if (!(this instanceof VisualViewport))
        throw new TypeError('Illegal invocation')
    return null
},
get onscroll() {
    if (!(this instanceof VisualViewport))
        throw new TypeError('Illegal invocation')
    return null
},
}
VisualViewport.prototype[Symbol.toStringTag] = "VisualViewport"
setPrototypeNative(VisualViewport)
visualViewport = {}
Object.setPrototypeOf(visualViewport, VisualViewport.prototype)

// Blob
window.Blob = function Blob() {
if (new.target !== Blob)
    throw new TypeError('Failed to construct \'Blob\': Please use the \'new\' operator, this DOM object constructor cannot be called as a function.')

}
Blob.prototype = {
arrayBuffer(param) {
    if (!(this instanceof Blob))
        throw new TypeError('Illegal invocation')
    debugger;
    return new ArrayBuffer(param)
},
get size() {
    if (!(this instanceof Blob))
        throw new TypeError('Illegal invocation')
    return 0
},
get type() {
    if (!(this instanceof Blob))
        throw new TypeError('Illegal invocation')
    return ''
},
slice() {
    if (!(this instanceof Blob))
        throw new TypeError('Illegal invocation')
    debugger;
    return new Blob()
},
stream() {
    if (!(this instanceof Blob))
        throw new TypeError('Illegal invocation')
    debugger;
    return new ReadableStream()
},
text() {
    if (!(this instanceof Blob))
        throw new TypeError('Illegal invocation')
    debugger;
    return new Promise((resolve, reject) => {
        resolve('')
    })
}
}
Blob.prototype[Symbol.toStringTag] = "Blob"
setPrototypeNative(Blob)

// Plugin
window.Plugin = function Plugin() {
throw new TypeError('Illegal constructor')
}
Plugin.prototype = {
get description() {
    if (!(this instanceof Plugin))
        throw new TypeError('Illegal invocation')
    return "Portable Document Format"
},
get filename() {
    if (!(this instanceof Plugin))
        throw new TypeError('Illegal invocation')
    return "internal-pdf-viewer"
},
get length() {
    if (!(this instanceof Plugin))
        throw new TypeError('Illegal invocation')
    return 2
},
get name() {
    if (!(this instanceof Plugin))
        throw new TypeError('Illegal invocation')
},
item(index) {
    if (!(this instanceof Plugin))
        throw new TypeError('Illegal invocation')
},
namedItem(name) {
    if (!(this instanceof Plugin))
        throw new TypeError('Illegal invocation')
}
}
Plugin.prototype[Symbol.toStringTag] = "Plugin"
setPrototypeNative(Plugin)

// PluginArray
window.PluginArray = function PluginArray() {
throw new TypeError('Illegal constructor')
}
PluginArray.prototype = {
get length() {
    if (!(this instanceof PluginArray))
        throw new TypeError('Illegal invocation')
    return Object.keys(this).length / 2
},
refresh() {
    if (!(this instanceof PluginArray))
        throw new TypeError('Illegal invocation')
    debugger
},
item(index) {
    if (!(this instanceof PluginArray))
        throw new TypeError('Illegal invocation')
    return this[index * 2]
},
namedItem(name) {
    if (!(this instanceof PluginArray))
        throw new TypeError('Illegal invocation')
    return this[name]
}
}
PluginArray.prototype[Symbol.toStringTag] = "PluginArray"
setPrototypeNative(PluginArray)

// File
window.File = function File() {
if (new.target !== File)
    throw new TypeError('Failed to construct \'File\': Please use the \'new\' operator, this DOM object constructor cannot be called as a function.')
this.lastModified = +new Date();
this.lastModifiedDate = new Date();
this.name = ''
this.webkitRelativePath = '';
}
Object.setPrototypeOf(File.prototype, Blob.prototype)
File.prototype[Symbol.toStringTag] = "File"
setNative(File, 'File')

// AnimationTimeline
window.AnimationTimeline = function AnimationTimeline() {
if (new.target !== AnimationTimeline)
    throw new TypeError('Failed to construct \'AnimationTimeline\': Please use the \'new\' operator, this DOM object constructor cannot be called as a function.')
}
AnimationTimeline.prototype = {
get currentTime() {
    if (!(this instanceof AnimationTimeline))
        throw new TypeError('Illegal invocation')
    let time = (12345.678 + Math.random() * 2000) + ''
    time = time.slice(0, time.indexOf('.') + 4)
    return +time
},
get duration() {
    if (!(this instanceof AnimationTimeline))
        throw new TypeError('Illegal invocation')
    return null
},

}
AnimationTimeline.prototype[Symbol.toStringTag] = "AnimationTimeline"
setPrototypeNative(AnimationTimeline)

// DocumentTimeline
window.DocumentTimeline = function DocumentTimeline() {
if (new.target !== DocumentTimeline)
    throw new TypeError('Failed to construct \'DocumentTimeline\': Please use the \'new\' operator, this DOM object constructor cannot be called as a function.')

}
Object.setPrototypeOf(DocumentTimeline.prototype, AnimationTimeline.prototype)
DocumentTimeline.prototype[Symbol.toStringTag] = "DocumentTimeline"
setNative(DocumentTimeline, 'DocumentTimeline')

// PerformanceTiming
window.PerformanceTiming = function PerformanceTiming() {
throw new TypeError('Illegal invocation')
}
PerformanceTiming.prototype = {
get navigationStart() {
    if (!(this instanceof PerformanceTiming))
        throw new TypeError('Illegal invocation')
    return +new Date() - Math.floor(Math.random()) * 5000
},
get fetchStart() {
    if (!(this instanceof PerformanceTiming))
        throw new TypeError('Illegal invocation')
    return +new Date()
},
get domainLookupStart() {
    if (!(this instanceof PerformanceTiming))
        throw new TypeError('Illegal invocation')
    return +new Date()
},
get domainLookupEnd() {
    if (!(this instanceof PerformanceTiming))
        throw new TypeError('Illegal invocation')
    return +new Date()
},
get domLoading() {
    if (!(this instanceof PerformanceTiming))
        throw new TypeError('Illegal invocation')
    return +new Date() + 1024
},
get domContentLoadedEventStart() {
    if (!(this instanceof PerformanceTiming))
        throw new TypeError('Illegal invocation')
    return +new Date() - 1024
},
get domContentLoadedEventEnd() {
    if (!(this instanceof PerformanceTiming))
        throw new TypeError('Illegal invocation')
    return +new Date() + 1024
},
get domComplete() {
    if (!(this instanceof PerformanceTiming))
        throw new TypeError('Illegal invocation')
    return +new Date() + 2048
},
get domInteractive() {
    if (!(this instanceof PerformanceTiming))
        throw new TypeError('Illegal invocation')
    return +new Date() + 2048
},
get redirectStart() {
    if (!(this instanceof PerformanceTiming))
        throw new TypeError('Illegal invocation')
    return 0
},
get redirectEnd() {
    if (!(this instanceof PerformanceTiming))
        throw new TypeError('Illegal invocation')
    return 0
},
get unloadEventStart() {
    if (!(this instanceof PerformanceTiming))
        throw new TypeError('Illegal invocation')
    return 0
},
get loadEventStart() {
    if (!(this instanceof PerformanceTiming))
        throw new TypeError('Illegal invocation')
    return +new Date() - 2000
},
get loadEventEnd() {
    if (!(this instanceof PerformanceTiming))
        throw new TypeError('Illegal invocation')
    return +new Date() - 1000
},
get unloadEventEnd() {
    if (!(this instanceof PerformanceTiming))
        throw new TypeError('Illegal invocation')
    return 0
},
get secureConnectionStart() {
    if (!(this instanceof PerformanceTiming))
        throw new TypeError('Illegal invocation')
    return 0
},
get responseStart() {
    if (!(this instanceof PerformanceTiming))
        throw new TypeError('Illegal invocation')
    return +new Date() - 1500
},
get responseEnd() {
    if (!(this instanceof PerformanceTiming))
        throw new TypeError('Illegal invocation')
    return +new Date() - 2000
},
get requestStart() {
    if (!(this instanceof PerformanceTiming))
        throw new TypeError('Illegal invocation')
    return +new Date()
},
get connectStart() {
    if (!(this instanceof PerformanceTiming))
        throw new TypeError('Illegal invocation')
    return +new Date()
},
get connectEnd() {
    if (!(this instanceof PerformanceTiming))
        throw new TypeError('Illegal invocation')
    return +new Date()
},
}
PerformanceTiming.prototype[Symbol.toStringTag] = "PerformanceTiming"
setPrototypeNative(AnimationTimeline)
timing = {}
Object.setPrototypeOf(timing, PerformanceTiming.prototype)
performance.timing = timing

// Screen
window.Screen = function Screen() {
throw new TypeError('Illegal invocation')

}
Screen.prototype = {
get width() {
    if (!(this instanceof Screen))
        throw new TypeError('Illegal invocation')
    return 1536
},
get pixelDepth() {
    if (!(this instanceof Screen))
        throw new TypeError('Illegal invocation')
    return 24
},
get availHeight() {
    if (!(this instanceof Screen))
        throw new TypeError('Illegal invocation')
    return 728
},
get availLeft() {
    if (!(this instanceof Screen))
        throw new TypeError('Illegal invocation')
    return 0
},
get availTop() {
    if (!(this instanceof Screen))
        throw new TypeError('Illegal invocation')
    return 0
},
get availWidth() {
    if (!(this instanceof Screen))
        throw new TypeError('Illegal invocation')
    return 1536
},
get isExtended() {
    if (!(this instanceof Screen))
        throw new TypeError('Illegal invocation')
    return false
},
get orientation() {
    if (!(this instanceof Screen))
        throw new TypeError('Illegal invocation')
    return {angle: 0, type: 'landscape-primary', onchange: null}
},
get onchange() {
    if (!(this instanceof Screen))
        throw new TypeError('Illegal invocation')
    return null
},
get height() {
    if (!(this instanceof Screen))
        throw new TypeError('Illegal invocation')
    return 864
},
get colorDepth() {
    if (!(this instanceof Screen))
        throw new TypeError('Illegal invocation')
    return 24
},
}
Screen.prototype[Symbol.toStringTag] = "Screen"
setPrototypeNative(Screen)
window.screen = {}
Object.setPrototypeOf(window.screen, Screen.prototype)

// Serial
window.Serial = function Serial() {
throw new TypeError('Illegal invocation')
};
Serial.prototype = {
getPorts() {
    if (!(this instanceof Serial))
        throw new TypeError('Illegal invocation')
    return {
        addEventListener: function addEventListener() {
        },
        onconnect: function onconnect() {
        },
        ondisconnect: function ondisconnect() {
        },
    }
},
get onconnect() {
    if (!(this instanceof Serial))
        throw new TypeError('Illegal invocation')
    return null
},
get ondisconnect() {
    if (!(this instanceof Serial))
        throw new TypeError('Illegal invocation')
    return null
},
requestPort() {
    if (!(this instanceof Serial))
        throw new TypeError('Illegal invocation')
    debugger;
}
}
Serial.prototype[Symbol.toStringTag] = "Serial"
setPrototypeNative(Serial)

// XRSystem
window.XRSystem = function XRSystem() {
throw new TypeError('Illegal invocation')
}
XRSystem.prototype = {
isSessionSupported() {
    if (!(this instanceof XRSystem))
        throw new TypeError('Illegal invocation')
    debugger;
    return new Promise(function (resolve, reject) {
        reject(true)
    })
},
get ondevicechange() {
    if (!(this instanceof XRSystem))
        throw new TypeError('Illegal invocation')
    return null
},
supportsSession() {
    if (!(this instanceof XRSystem))
        throw new TypeError('Illegal invocation')
    debugger;
    return new Promise(function (resolve, reject) {
        resolve(true)
    })
},
requestSession() {
    if (!(this instanceof XRSystem))
        throw new TypeError('Illegalinvocation')
    debugger
    return new Promise(function (resolve, reject) {
        reject(true)
    })
}
}
XRSystem.prototype[Symbol.toStringTag] = "XRSystem"
setPrototypeNative(XRSystem)

// USB
window.USB = function USB() {
throw new TypeError('Illegal invocation')
};
USB.prototype = {
getDevices() {
    if (!(this instanceof USB))
        throw new TypeError('Illegal invocation')
    return new Promise(function (resolve, reject) {
        resolve([])
    })
},
requestDevice() {
    if (!(this instanceof USB))
        throw new TypeError('Illegal invocation')
    return new Promise(function (resolve, reject) {
        resolve({
            addEventListener: function addEventListener() {
            },
            configuration: {
                configurationValue: 1,
                interface: {}
            }
        })
    })
},
get onconnect() {
    if (!(this instanceof USB))
        throw new TypeError('Illegal invocation')
    return null
},
get ondisconnect() {
    if (!(this instanceof USB))
        throw new TypeError('Illegal invocation')
    return null
}
}
USB.prototype[Symbol.toStringTag] = "USB"
setPrototypeNative(USB)

// Presentation
window.Presentation = function Presentation() {
throw new TypeError('Illegal invocation')
};
Presentation.prototype = {
get defaultRequest() {
    if (!(this instanceof Presentation))
        throw new TypeError('Illegal invocation')
    return null
},
get receiver() {
    if (!(this instanceof Presentation))
        throw new TypeError('Illegal invocation')
    return null
}
}


Presentation.prototype[Symbol.toStringTag] = "Presentation"
Presentation.prototype[Symbol.toStringTag] = "Presentation"
setPrototypeNative(Presentation)

// Permissions
window.Permissions = function Permissions() {
throw new TypeError('Illegal invocation')
}
Permissions.prototype = {
query() {
    if (!(this instanceof Permissions))
        throw new TypeError('Illegal invocation')
    return new Promise(function (resolve, reject) {
        resolve({
            state: 'granted'
        })
    })
},
}
Permissions.prototype[Symbol.toStringTag] = "Permissions"
setPrototypeNative(Permissions)

// MimeTypeArray
window.MimeTypeArray = function MimeTypeArray() {
throw new TypeError('Illegal invocation')
}
MimeTypeArray.prototype = {
item() {
    if (!(this instanceof MimeTypeArray))
        throw new TypeError('Illegal invocation')
    return {
        description: 'description',
        suffixes: 'suffixes',
        type: 'type',
    }
},
namedItem() {
    if (!(this instanceof MimeTypeArray))
        throw new TypeError('Illegal invocation')
    return {
        description: 'description',
        suffixes: 'suffixes',
        type: 'type',
    }
},
get length() {
    if (!(this instanceof MimeTypeArray))
        throw new TypeError('Illegal invocation')
    let tmp = Object.keys(this)
    return tmp.length / 2
},
}
MimeTypeArray.prototype[Symbol.toStringTag] = "MimeTypeArray"
setPrototypeNative(MimeTypeArray)

// NavigatorManagedData
window.NavigatorManagedData = function NavigatorManagedData() {
throw new TypeError('Illegal invocation')
}
NavigatorManagedData.prototype = {
get onmanagedconfigurationchange() {
    if (!(this instanceof NavigatorManagedData))
        throw new TypeError('Illegal invocation')
    return null
},
getManagedConfiguration() {
    if (!(this instanceof NavigatorManagedData))
        throw new TypeError('Illegal invocation')
    return new Promise(function (resolve, reject) {
        resolve({})
    })
},
}
NavigatorManagedData.prototype[Symbol.toStringTag] = "NavigatorManagedData"
setPrototypeNative(NavigatorManagedData)

// Scheduling
window.Scheduling = function Scheduling() {
throw new TypeError('Illegal invocation')
}
Scheduling.prototype = {
isInputPending() {
    if (!(this instanceof Scheduling))
        throw new TypeError('Illegal invocation')
    debugger;
}
}
Scheduling.prototype[Symbol.toStringTag] = "Scheduling"
setPrototypeNative(Scheduling)

// Clipboard
window.Clipboard = function Clipboard() {
throw new TypeError('Illegal invocation')
}
Clipboard.prototype = {
read() {
    if (!(this instanceof Clipboard))
        throw new TypeError('Illegal invocation')
    debugger
    return new Promise(function (resolve, reject) {
        resolve({
            types: ['text/plain'],
            getType: function getType() {
                return 'text/plain'
            }
        })
    })
},
readText() {
    if (!(this instanceof Clipboard))
        throw new TypeError('Illegal invocation')
    debugger
    return new Promise(function (resolve, reject) {
        resolve('text')
    })
},
write() {
    if (!(this instanceof Clipboard))
        throw new TypeError('Illegal invocation')
    debugger;
    return new Promise(function (resolve, reject) {
        resolve()
    })
},
writeText() {
    if (!(this instanceof Clipboard))
        throw new TypeError('Illegal invocation')
    debugger;
    return new Promise(function (resolve, reject) {
        resolve()
    })
}
}
Clipboard.prototype[Symbol.toStringTag] = "Clipboard"
setPrototypeNative(Clipboard)

// UserActivation
window.UserActivation = function UserActivation() {
throw new TypeError('Illegal invocation')
}
UserActivation.prototype = {
get hasBeenActive() {
    if (!(this instanceof UserActivation))
        throw new TypeError('Illegal invocation')
    return true
},
get isActive() {
    if (!(this instanceof UserActivation))
        throw new TypeError('Illegal invocation')
    return true
}
}
UserActivation.prototype[Symbol.toStringTag] = "UserActivation"
setPrototypeNative(UserActivation)

// Geolocation
window.Geolocation = function Geolocation() {
throw new TypeError('Illegal invocation')
}
Geolocation.prototype = {
getCurrentPosition() {
    if (!(this instanceof Geolocation))
        throw new TypeError('Illegal invocation')
    return {
        coords: {
            latitude: 0,
            longitude: 0,
        },
        timestamp: 0,
    }
},
watchPosition() {
    if (!(this instanceof Geolocation))
        throw new TypeError('Illegal invocation')
    return 0
},
clearWatch() {
    if (!(this instanceof Geolocation))
        throw new TypeError('Illegal invocation')
    debugger
}
}
Geolocation.prototype[Symbol.toStringTag] = "Geolocation"
setPrototypeNative(Geolocation)

// NetworkInformation
window.NetworkInformation = function NetworkInformation() {
throw new TypeError('Illegal invocation')
}
NetworkInformation.prototype = {
get downlink() {
    if (!(this instanceof NetworkInformation))
        throw new TypeError('Illegal invocation')
    return 3.85
},
get rtt() {
    if (!(this instanceof NetworkInformation))
        throw new TypeError('Illegal invocation')
    return 200
},
get onchange() {
    if (!(this instanceof NetworkInformation))
        throw new TypeError('Illegal invocation')
    return null
},
get effectiveType() {
    if (!(this instanceof NetworkInformation))
        throw new TypeError('Illegal invocation')
    return "4g"
},
get saveData() {
    if (!(this instanceof NetworkInformation))
        throw new TypeError('Illegal invocation')
    return false
}
}
NetworkInformation.prototype[Symbol.toStringTag] = "NetworkInformation"
setPrototypeNative(NetworkInformation)

// WindowControlsOverlay
window.WindowControlsOverlay = function WindowControlsOverlay() {
throw new TypeError('Illegal invocation')
}
WindowControlsOverlay.prototype = {
getTitlebarAreaRect() {
    if (!(this instanceof WindowControlsOverlay))
        throw new TypeError('Illegal invocation')
    debugger;
},
get ongeometrychange() {
    if (!(this instanceof WindowControlsOverlay))
        throw new TypeError('Illegal invocation')
    return null
},
get visible() {
    if (!(this instanceof WindowControlsOverlay))
        throw new TypeError('Illegal invocation')
    return false
}
}
WindowControlsOverlay.prototype[Symbol.toStringTag] = "WindowControlsOverlay"
setPrototypeNative(WindowControlsOverlay)

// DeprecatedStorageQuota
window.DeprecatedStorageQuota = function DeprecatedStorageQuota() {
throw new TypeError('Illegal invocation')
}
DeprecatedStorageQuota.prototype = {
queryUsageAndQuota() {
    if (!(this instanceof DeprecatedStorageQuota))
        throw new TypeError('Illegal invocation')
    debugger
},
requestQuota() {
    if (!(this instanceof DeprecatedStorageQuota))
        throw new TypeError('Illegal invocation')
    debugger
}
}
DeprecatedStorageQuota.prototype[Symbol.toStringTag] = "DeprecatedStorageQuota"
setPrototypeNative(DeprecatedStorageQuota)

// Bluetooth
window.Bluetooth = function Bluetooth() {
throw new TypeError('Illegal invocation')
}
Bluetooth.prototype = {
getAvailability() {
    if (!(this instanceof Bluetooth))
        throw new TypeError('Illegal invocation')
    return {
        addEventListener: function addEventListener() {
        },
        removeEventListener: function removeEventListener() {
        },
        onsuccess: function onsuccess() {
        },
        onerror: function onerror() {
        },
    }
},
requestDevice() {
    if (!(this instanceof Bluetooth))
        throw new TypeError('Illegal invocation')
    debugger;
}
}
Bluetooth.prototype[Symbol.toStringTag] = "Bluetooth"
setPrototypeNative(Bluetooth)

// Keyboard
window.Keyboard = function Keyboard() {
throw new TypeError('Illegal invocation')
}
Keyboard.prototype = {
getLayoutMap() {
    if (!(this instanceof Keyboard))
        throw new TypeError('Illegal invocation')
    debugger
    return []
},
lock() {
    if (!(this instanceof Keyboard))
        throw new TypeError('Illegal invocation')
    debugger;
    return false
},
unlock() {
    if (!(this instanceof Keyboard))
        throw new TypeError('Illegal invocation')
    debugger;
    return null
}
}
Keyboard.prototype[Symbol.toStringTag] = "Keyboard"
setPrototypeNative(Keyboard)

// WGSLLanguageFeatures
window.WGSLLanguageFeatures = function WGSLLanguageFeatures() {
throw new TypeError('Illegal invocation')
}
WGSLLanguageFeatures.prototype = {
values() {
    if (!(this instanceof WGSLLanguageFeatures))
        throw new TypeError('Illegal invocation')
    debugger;
    return []
},
get size() {
    if (!(this instanceof WGSLLanguageFeatures))
        throw new TypeError('Illegal invocation')
    debugger;
    return 4
},

entries() {
    if (!(this instanceof WGSLLanguageFeatures))
        throw new TypeError('Illegal invocation')
    debugger;
    return []
},
forEach() {
    if (!(this instanceof WGSLLanguageFeatures))
        throw new TypeError('Illegal invocation')
    debugger;
},
has() {
    if (!(this instanceof WGSLLanguageFeatures))
        throw new TypeError('Illegal invocation')
    debugger;
    return {}
},
keys() {
    if (!(this instanceof WGSLLanguageFeatures))
        throw new TypeError('Illegal invocation')
    debugger;
    return []
}
}
WGSLLanguageFeatures.prototype[Symbol.toStringTag] = "WGSLLanguageFeatures"
setPrototypeNative(WGSLLanguageFeatures)

// GPU
window.GPU = function GPU() {
throw new TypeError('Illegal invocation')
}
GPU.prototype = {
getPreferredCanvasFormat() {
    if (!(this instanceof GPU))
        throw new TypeError('Illegal invocation')
    debugger;
    return []
},
requestAdapter() {
    if (!(this instanceof GPU))
        throw new TypeError('Illegal invocation')
    debugger;
    return {}
},

get wgslLanguageFeatures() {
    if (!(this instanceof GPU))
        throw new TypeError('Illegal invocation')
    debugger;
    let tmp = {}
    Object.setPrototypeOf(tmp, WGSLLanguageFeatures.prototype)
    return tmp
}
}
GPU.prototype[Symbol.toStringTag] = "GPU"
setPrototypeNative(GPU)

// DelegatedInkTrailPresenter
window.DelegatedInkTrailPresenter = function DelegatedInkTrailPresenter() {
throw new TypeError('Illegal invocation')
}
DelegatedInkTrailPresenter.prototype = {
updateInkTrailStartPoint() {
    if (!(this instanceof DelegatedInkTrailPresenter))
        throw new TypeError('Illegal invocation')
    debugger;
},
presentationArea() {
    if (!(this instanceof DelegatedInkTrailPresenter))
        throw new TypeError('Illegal invocation')
    return null
},
expectedImprovement() {
    if (!(this instanceof DelegatedInkTrailPresenter))
        throw new TypeError('Illegal invocation')
    return 0
}
}
DelegatedInkTrailPresenter.prototype[Symbol.toStringTag] = "DelegatedInkTrailPresenter"
setPrototypeNative(DelegatedInkTrailPresenter)

// LockManager
window.LockManager = function LockManager() {
throw new TypeError('Illegal invocation')
}
LockManager.prototype = {
request() {
    if (!(this instanceof LockManager))
        throw new TypeError('Illegal invocation')
    debugger;
    return new Promise((resolve, reject) => {
        let tmp = {}
        Object.setPrototypeOf(tmp, Lock.prototype)
        resolve(tmp)
    })
},
query() {
    if (!(this instanceof LockManager))
        throw new TypeError('Illegal invocation')
    debugger;
    return new Promise((resolve, reject) => {
        resolve({})
    })
}
}
LockManager.prototype[Symbol.toStringTag] = "LockManager"
setPrototypeNative(LockManager)

// Ink
window.Ink = function Ink() {
throw new TypeError('Illegal invocation')
}
Ink.prototype = {
requestPresenter() {
    if (!(this instanceof Ink))
        throw new TypeError('Illegal invocation')
    debugger;
    return new Promise((resolve, reject) => {
        let tmp = {}
        Object.setPrototypeOf(tmp, DelegatedInkTrailPresenter.prototype)
        resolve(tmp)
    })
}
}
Ink.prototype[Symbol.toStringTag] = "Ink"
setPrototypeNative(Ink)

// StorageBucketManager
window.StorageBucketManager = function StorageBucketManager() {
throw new TypeError('Illegal invocation')
}
StorageBucketManager.prototype = {
delete() {
    if (!(this instanceof StorageBucketManager))
        throw new TypeError('Illegal invocation')
    debugger;
    return {}
},

keys() {
    if (!(this instanceof StorageBucketManager))
        throw new TypeError('Illegal invocation')
    debugger;
    return {}
},
open() {
    if (!(this instanceof StorageBucketManager))
        throw new TypeError('Illegal invocation')
    debugger;
    return {}
}

}
StorageBucketManager.prototype[Symbol.toStringTag] = "StorageBucketManager"
setPrototypeNative(StorageBucketManager)

// CredentialsContainer
window.CredentialsContainer = function CredentialsContainer() {
throw new TypeError('Illegal invocation')
}
CredentialsContainer.prototype = {
get() {
    if (!(this instanceof CredentialsContainer))
        throw new TypeError('Illegal invocation')
    debugger;
    return new Promise((resolve, reject) => {
        resolve({})
    })
},
preventSilentAccess() {
    if (!(this instanceof CredentialsContainer))
        throw new TypeError('Illegal invocation')
    debugger;
    return new Promise((resolve, reject) => {
        resolve({})
    })
},
create() {
    if (!(this instanceof CredentialsContainer))
        throw new TypeError('Illegal invocation')
    debugger;
    return {}
},
store() {
    if (!(this instanceof CredentialsContainer))
        throw new TypeError('Illegal invocation')
    debugger;
    return {}
},
}
CredentialsContainer.prototype[Symbol.toStringTag] = "CredentialsContainer"
setPrototypeNative(CredentialsContainer)

// MediaDevices
window.MediaDevices = function MediaDevices() {
throw new TypeError('Illegal invocation')
}
MediaDevices.prototype = {
getDisplayMedia() {
    if (!(this instanceof MediaDevices))
        throw new TypeError('Illegal invocation')
    debugger;
    return new Promise((resolve, reject) => {
        resolve({})
    })
},
getUserMedia() {
    if (!(this instanceof MediaDevices))
        throw new TypeError('Illegal invocation')
    debugger;
    return new Promise((resolve, reject) => {
        resolve({})
    })
},
get ondevicechange() {
    if (!(this instanceof MediaDevices))
        throw new TypeError('Illegal invocation')
    return null
},
enumerateDevices() {
    if (!(this instanceof MediaDevices))
        throw new TypeError('Illegal invocation')
    debugger;
},
setCaptureHandleConfig() {
    if (!(this instanceof MediaDevices))
        throw new TypeError('Illegal invocation')
    debugger;
},
getSupportedConstraints() {
    if (!(this instanceof MediaDevices))
        throw new TypeError('Illegal invocation')
    debugger;
}
}
MediaDevices.prototype[Symbol.toStringTag] = "MediaDevices"
setPrototypeNative(MediaDevices)

// NavigatorLogin
window.NavigatorLogin = function NavigatorLogin() {
throw new TypeError('Illegal invocation')
}
NavigatorLogin.prototype = {
get setStatus() {
    if (!(this instanceof NavigatorLogin))
        throw new TypeError('Illegal invocation')
    debugger;
    return {}
},
}
NavigatorLogin.prototype[Symbol.toStringTag] = "NavigatorLogin"
setPrototypeNative(NavigatorLogin)

// StorageManager
window.StorageManager = function StorageManager() {
throw new TypeError('Illegal invocation')
}
StorageManager.prototype = {
persist() {
    if (!(this instanceof StorageManager))
        throw new TypeError('Illegal invocation')
    debugger;
    return new Promise((resolve, reject) => {
        resolve(false)
    })
},
persisted() {
    if (!(this instanceof StorageManager))
        throw new TypeError('Illegal invocation')
    debugger;
    return new Promise((resolve, reject) => {
        resolve(false)
    })
},
estimate() {
    if (!(this instanceof StorageManager))
        throw new TypeError('Illegal invocation')
    debugger;
},
getDirectory() {
    if (!(this instanceof StorageManager))
        throw new TypeError('Illegal invocation')
    debugger;
}
}
StorageManager.prototype[Symbol.toStringTag] = "StorageManager"
setPrototypeNative(StorageManager)

// DOMRectReadOnly
window.DOMRectReadOnly = function DOMRectReadOnly() {
throw new TypeError('Illegal invocation')
}
DOMRectReadOnly.prototype = {
toJSON() {
    if (!(this instanceof DOMRectReadOnly))
        throw new TypeError('Illegal invocation')
    debugger;
},
get bottom() {
    if (!(this instanceof DOMRectReadOnly))
        throw new TypeError('Illegal invocation')
    return 0
},
get top() {
    if (!(this instanceof DOMRectReadOnly))
        throw new TypeError('Illegal invocation')
    return 0
},
get left() {
    if (!(this instanceof DOMRectReadOnly))
        throw new TypeError('Illegal invocation')
    return 0
},
get right() {
    if (!(this instanceof DOMRectReadOnly))
        throw new TypeError('Illegal invocation')
    return 0
},
get height() {
    if (!(this instanceof DOMRectReadOnly))
        throw new TypeError('Illegal invocation')
    return 0
},
get width() {
    if (!(this instanceof DOMRectReadOnly))
        throw new TypeError('Illegal invocation')
    return 0
},
get x() {
    if (!(this instanceof DOMRectReadOnly))
        throw new TypeError('Illegal invocation')
    return 0
},
get y() {
    if (!(this instanceof DOMRectReadOnly))
        throw new TypeError('Illegal invocation')
    return 0
},
}
DOMRectReadOnly.prototype[Symbol.toStringTag] = "DOMRectReadOnly"
setPrototypeNative(DOMRectReadOnly)

// DOMRect
window.DOMRect = function DOMRect() {
throw new TypeError('Illegal invocation')
}
DOMRect.prototype = {
get height() {
    if (!(this instanceof DOMRect))
        throw new TypeError('Illegal invocation')
    return 0
},
get width() {
    if (!(this instanceof DOMRect))
        throw new TypeError('Illegal invocation')
    return 0
},
get x() {
    if (!(this instanceof DOMRect))
        throw new TypeError('Illegal invocation')
    return 0
},
get y() {
    if (!(this instanceof DOMRect))
        throw new TypeError('Illegal invocation')
    return 0
}
}
DOMRect.prototype[Symbol.toStringTag] = "DOMRect"
setPrototypeNative(DOMRect)
Object.setPrototypeOf(DOMRect.prototype, DOMRectReadOnly.prototype)

// ServiceWorkerContainer
window.ServiceWorkerContainer = function ServiceWorkerContainer() {
throw new TypeError('Illegal invocation')
}
ServiceWorkerContainer.prototype = {
get ready() {
    if (!(this instanceof ServiceWorkerContainer))
        throw new TypeError('Illegal invocation')
    return new Promise((resolve, reject) => {
        resolve({})
    })
},
get onmessageerror() {
    if (!(this instanceof ServiceWorkerContainer))
        throw new TypeError('Illegal invocation')
    return null
},
get onmessage() {
    if (!(this instanceof ServiceWorkerContainer))
        throw new TypeError('Illegal invocation')
    return null
},
get controller() {
    if (!(this instanceof ServiceWorkerContainer))
        throw new TypeError('Illegal invocation')
    return null
},
getRegistration() {
    if (!(this instanceof ServiceWorkerContainer))
        throw new TypeError('Illegal invocation')
    debugger;
},
getRegistrations() {
    if (!(this instanceof ServiceWorkerContainer))
        throw new TypeError('Illegal invocation')
    debugger;
},
get oncontrollerchange() {
    if (!(this instanceof ServiceWorkerContainer))
        throw new TypeError('Illegal invocation')
    return null
},
register() {
    if (!(this instanceof ServiceWorkerContainer))
        throw new TypeError('Illegal invocation')
    debugger;
},
startMessages() {
    if (!(this instanceof ServiceWorkerContainer))
        throw new TypeError('Illegal invocation')
    debugger;
}
}
ServiceWorkerContainer.prototype[Symbol.toStringTag] = "ServiceWorkerContainer"
setPrototypeNative(ServiceWorkerContainer)

// VirtualKeyboard
window.VirtualKeyboard = function VirtualKeyboard() {
throw new TypeError('Illegal invocation')
}
VirtualKeyboard.prototype = {
get boundingRect() {
    if (!(this instanceof VirtualKeyboard))
        throw new TypeError('Illegal invocation')
    let tmp = {}
    Object.setPrototypeOf(tmp, DOMRect.prototype)
    return tmp
},
hide() {
    if (!(this instanceof VirtualKeyboard))
        throw new TypeError('Illegal invocation')
    debugger;
},
get ongeometrychange() {
    if (!(this instanceof VirtualKeyboard))
        throw new TypeError('Illegal invocation')
    return null
},
get overlaysContent() {
    if (!(this instanceof VirtualKeyboard))
        throw new TypeError('Illegal invocation')
    return false
},
show() {
    if (!(this instanceof VirtualKeyboard))
        throw new TypeError('Illegal invocation')
    debugger;
}
}
VirtualKeyboard.prototype[Symbol.toStringTag] = "VirtualKeyboard"
setPrototypeNative(VirtualKeyboard)

// NavigatorUAData
window.NavigatorUAData = function NavigatorUAData() {
throw new TypeError('Illegal invocation')
}
NavigatorUAData.prototype = {
get brands() {
    if (!(this instanceof NavigatorUAData))
        throw new TypeError('Illegal invocation')
    return [
        {brand: 'Chromium', version: '124'},
        {brand: 'Microsoft Edge', version: '124'},
        {brand: 'Not-A.Brand', version: '99'}
    ]
},
getHighEntropyValues() {
    if (!(this instanceof NavigatorUAData))
        throw new TypeError('Illegal invocation')
    debugger;
},
get platform() {
    if (!(this instanceof NavigatorUAData))
        throw new TypeError('Illegal invocation')
    return 'Windows'
},
get mobile() {
    if (!(this instanceof NavigatorUAData))
        throw new TypeError('Illegal invocation')
    return false
},
toJSON() {
    if (!(this instanceof NavigatorUAData))
        throw new TypeError('Illegal invocation')
    return {
        brands: this.brands,
        mobile: this.mobile,
        platform: this.platform
    }
}
}
NavigatorUAData.prototype[Symbol.toStringTag] = "NavigatorUAData"
setPrototypeNative(NavigatorUAData)

// CanvasRenderingContext2D
window.CanvasRenderingContext2D = function CanvasRenderingContext2D() {
throw new TypeError('Illegal invocation')
}
CanvasRenderingContext2D.prototype = {
get canvas() {
    if (!(this instanceof CanvasRenderingContext2D))
        throw new TypeError('Illegal invocation')
    return CanvasObj[this.__canvas_id]
},
set canvas(canvas) {
    if (!(this instanceof CanvasRenderingContext2D))
        throw new TypeError('Illegal invocation')
    this.__canvas_id = canvas.canvas_id
},
rect() {
    if (!(this instanceof CanvasRenderingContext2D))
        throw new TypeError('Illegal invocation')
    // console.log('调用 --> rect', [...arguments])
},
isPointInPath() {
    if (!(this instanceof CanvasRenderingContext2D))
        throw new TypeError('Illegal invocation')
    // console.log('调用 --> isPointInPath', [...arguments])
    return false
},
fillRect() {
    if (!(this instanceof CanvasRenderingContext2D))
        throw new TypeError('Illegal invocation')
    // console.log('调用 --> fillRect', [...arguments])
    // return false
},
fillText() {
    if (!(this instanceof CanvasRenderingContext2D))
        throw new TypeError('Illegal invocation')
    // console.log('调用 --> fillText', [...arguments])
},
beginPath() {
    if (!(this instanceof CanvasRenderingContext2D))
        throw new TypeError('Illegal invocation')
    // console.log('调用 --> beginPath', [...arguments])
},
arc() {
    if (!(this instanceof CanvasRenderingContext2D))
        throw new TypeError('Illegal invocation')
    // console.log('调用 --> arc', [...arguments])
},
closePath() {
    if (!(this instanceof CanvasRenderingContext2D))
        throw new TypeError('Illegal invocation')
    // console.log('调用 --> closePath', [...arguments])
},
fill() {
    if (!(this instanceof CanvasRenderingContext2D))
        throw new TypeError('Illegal invocation')
    // console.log('调用 --> fill', [...arguments])
},
getImageData() {
    if (!(this instanceof CanvasRenderingContext2D))
        throw new TypeError('Illegal invocation')
    // console.log('调用 --> getImageData', [...arguments])
    // debugger
    let tmp = {
        'data': new Uint8ClampedArray(64)
    }
    Object.setPrototypeOf(tmp, ImageData.prototype)
    return tmp
},
putImageData() {
    if (!(this instanceof CanvasRenderingContext2D))
        throw new TypeError('Illegal invocation')
    // console.log('调用 --> putImageData', [...arguments])
    // debugger
},
createImageData() {
    if (!(this instanceof CanvasRenderingContext2D))
        throw new TypeError('Illegal invocation')
    // console.log('调用 --> createImageData', [...arguments])
    let tmp = {
        'data': new Uint8ClampedArray(64)
    }
    Object.setPrototypeOf(tmp, ImageData.prototype)
    return tmp
},
measureText(v) {
    if (!(this instanceof CanvasRenderingContext2D))
        throw new TypeError('Illegal invocation')
    // console.log('measureText参数 --> ', v)
    // console.log('this.font --> ', this.font)
    if (this.font === '72px Calibri, serif') {
        return {
            actualBoundingBoxAscent: 51,
            actualBoundingBoxDescent: -1,
            actualBoundingBoxLeft: 0,
            actualBoundingBoxRight: 389,
            alphabeticBaseline: -0,
            fontBoundingBoxAscent: 62,
            fontBoundingBoxDescent: 10,
            hangingBaseline: 49.599998474121094,
            ideographicBaseline: -10,
            width: 399,
        }
    }
    else if (this.font === '72px Marlett, serif') {
        return {
            actualBoundingBoxAscent: 51,
            actualBoundingBoxDescent: -1,
            actualBoundingBoxLeft: 0,
            actualBoundingBoxRight: 389,
            alphabeticBaseline: -0,
            fontBoundingBoxAscent: 62,
            fontBoundingBoxDescent: 10,
            hangingBaseline: 49.599998474121094,
            ideographicBaseline: -10,
            width: 399,
        }
    }  else if (this.font === '72px SimHei, serif') return {
        actualBoundingBoxAscent: 51,
        actualBoundingBoxDescent: -1,
        actualBoundingBoxLeft: 0,
        actualBoundingBoxRight: 389,
        alphabeticBaseline: -0,
        fontBoundingBoxAscent: 62,
        fontBoundingBoxDescent: 10,
        hangingBaseline: 49.599998474121094,
        ideographicBaseline: -10,
        width: 399,
    }
    if (this.font.indexOf('monospace') !== -1) {
        return {
            actualBoundingBoxAscent: 51,
            actualBoundingBoxDescent: -1,
            actualBoundingBoxLeft: 0,
            actualBoundingBoxRight: 389,
            alphabeticBaseline: -0,
            fontBoundingBoxAscent: 62,
            fontBoundingBoxDescent: 10,
            hangingBaseline: 49.599998474121094,
            ideographicBaseline: -10,
            width: 396,
        }
    } else if (this.font.indexOf('sans-serif') !== -1) {
        return {
            actualBoundingBoxAscent: 58,
            actualBoundingBoxDescent: 0,
            actualBoundingBoxLeft: -5,
            actualBoundingBoxRight: 593.0390625,
            alphabeticBaseline: -0,
            fontBoundingBoxAscent: 76,
            fontBoundingBoxDescent: 19,
            hangingBaseline: 60.79999923706055,
            ideographicBaseline: -19,
            width: 597.19921875,
        }
    } else if (this.font.indexOf('serif') !== -1) {
        return {
            actualBoundingBoxAscent: 51,
            actualBoundingBoxDescent: -1,
            actualBoundingBoxLeft: 0,
            actualBoundingBoxRight: 389,
            alphabeticBaseline: -0,
            fontBoundingBoxAscent: 62,
            fontBoundingBoxDescent: 10,
            hangingBaseline: 49.599998474121094,
            ideographicBaseline: -10,
            width: 396,
        }
    }
}
}
CanvasRenderingContext2D.prototype[Symbol.toStringTag] = "CanvasRenderingContext2D"
setPrototypeNative(CanvasRenderingContext2D)

// WebGLRenderingContext
window.WebGLRenderingContext = function WebGLRenderingContext() {
throw new TypeError('Illegal invocation')
}
WebGLRenderingContext.prototype = {

get DEPTH_BUFFER_BIT() {
    return 256
}, get STENCIL_BUFFER_BIT() {
    return 1024
}, get COLOR_BUFFER_BIT() {
    return 16384
}, get POINTS() {
    return 0
}, get LINES() {
    return 1
}, get LINE_LOOP() {
    return 2
}, get LINE_STRIP() {
    return 3
}, get TRIANGLES() {
    return 4
}, get TRIANGLE_STRIP() {
    return 5
}, get TRIANGLE_FAN() {
    return 6
}, get ZERO() {
    return 0
}, get ONE() {
    return 1
}, get SRC_COLOR() {
    return 768
}, get ONE_MINUS_SRC_COLOR() {
    return 769
}, get SRC_ALPHA() {
    return 770
}, get ONE_MINUS_SRC_ALPHA() {
    return 771
}, get DST_ALPHA() {
    return 772
}, get ONE_MINUS_DST_ALPHA() {
    return 773
}, get DST_COLOR() {
    return 774
}, get ONE_MINUS_DST_COLOR() {
    return 775
}, get SRC_ALPHA_SATURATE() {
    return 776
}, get FUNC_ADD() {
    return 32774
}, get BLEND_EQUATION() {
    return 32777
}, get BLEND_EQUATION_RGB() {
    return 32777
}, get BLEND_EQUATION_ALPHA() {
    return 34877
}, get FUNC_SUBTRACT() {
    return 32778
}, get FUNC_REVERSE_SUBTRACT() {
    return 32779
}, get BLEND_DST_RGB() {
    return 32968
}, get BLEND_SRC_RGB() {
    return 32969
}, get BLEND_DST_ALPHA() {
    return 32970
}, get BLEND_SRC_ALPHA() {
    return 32971
}, get CONSTANT_COLOR() {
    return 32769
}, get ONE_MINUS_CONSTANT_COLOR() {
    return 32770
}, get CONSTANT_ALPHA() {
    return 32771
}, get ONE_MINUS_CONSTANT_ALPHA() {
    return 32772
}, get BLEND_COLOR() {
    return 32773
}, get ARRAY_BUFFER() {
    return 34962
}, get ELEMENT_ARRAY_BUFFER() {
    return 34963
}, get ARRAY_BUFFER_BINDING() {
    return 34964
}, get ELEMENT_ARRAY_BUFFER_BINDING() {
    return 34965
}, get STREAM_DRAW() {
    return 35040
}, get STATIC_DRAW() {
    return 35044
}, get DYNAMIC_DRAW() {
    return 35048
}, get BUFFER_SIZE() {
    return 34660
}, get BUFFER_USAGE() {
    return 34661
}, get CURRENT_VERTEX_ATTRIB() {
    return 34342
}, get FRONT() {
    return 1028
}, get BACK() {
    return 1029
}, get FRONT_AND_BACK() {
    return 1032
}, get TEXTURE_2D() {
    return 3553
}, get CULL_FACE() {
    return 2884
}, get BLEND() {
    return 3042
}, get DITHER() {
    return 3024
}, get STENCIL_TEST() {
    return 2960
}, get DEPTH_TEST() {
    return 2929
}, get SCISSOR_TEST() {
    return 3089
}, get POLYGON_OFFSET_FILL() {
    return 32823
}, get SAMPLE_ALPHA_TO_COVERAGE() {
    return 32926
}, get SAMPLE_COVERAGE() {
    return 32928
}, get NO_ERROR() {
    return 0
}, get INVALID_ENUM() {
    return 1280
}, get INVALID_VALUE() {
    return 1281
}, get INVALID_OPERATION() {
    return 1282
}, get OUT_OF_MEMORY() {
    return 1285
}, get CW() {
    return 2304
}, get CCW() {
    return 2305
}, get LINE_WIDTH() {
    return 2849
}, get ALIASED_POINT_SIZE_RANGE() {
    return 33901
}, get ALIASED_LINE_WIDTH_RANGE() {
    return 33902
}, get CULL_FACE_MODE() {
    return 2885
}, get FRONT_FACE() {
    return 2886
}, get DEPTH_RANGE() {
    return 2928
}, get DEPTH_WRITEMASK() {
    return 2930
}, get DEPTH_CLEAR_VALUE() {
    return 2931
}, get DEPTH_FUNC() {
    return 2932
}, get STENCIL_CLEAR_VALUE() {
    return 2961
}, get STENCIL_FUNC() {
    return 2962
}, get STENCIL_FAIL() {
    return 2964
}, get STENCIL_PASS_DEPTH_FAIL() {
    return 2965
}, get STENCIL_PASS_DEPTH_PASS() {
    return 2966
}, get STENCIL_REF() {
    return 2967
}, get STENCIL_VALUE_MASK() {
    return 2963
}, get STENCIL_WRITEMASK() {
    return 2968
}, get STENCIL_BACK_FUNC() {
    return 34816
}, get STENCIL_BACK_FAIL() {
    return 34817
}, get STENCIL_BACK_PASS_DEPTH_FAIL() {
    return 34818
}, get STENCIL_BACK_PASS_DEPTH_PASS() {
    return 34819
}, get STENCIL_BACK_REF() {
    return 36003
}, get STENCIL_BACK_VALUE_MASK() {
    return 36004
}, get STENCIL_BACK_WRITEMASK() {
    return 36005
}, get VIEWPORT() {
    return 2978
}, get SCISSOR_BOX() {
    return 3088
}, get COLOR_CLEAR_VALUE() {
    return 3106
}, get COLOR_WRITEMASK() {
    return 3107
}, get UNPACK_ALIGNMENT() {
    return 3317
}, get PACK_ALIGNMENT() {
    return 3333
}, get MAX_TEXTURE_SIZE() {
    return 3379
}, get MAX_VIEWPORT_DIMS() {
    return 3386
}, get SUBPIXEL_BITS() {
    return 3408
}, get RED_BITS() {
    return 3410
}, get GREEN_BITS() {
    return 3411
}, get BLUE_BITS() {
    return 3412
}, get ALPHA_BITS() {
    return 3413
}, get DEPTH_BITS() {
    return 3414
}, get STENCIL_BITS() {
    return 3415
}, get POLYGON_OFFSET_UNITS() {
    return 10752
}, get POLYGON_OFFSET_FACTOR() {
    return 32824
}, get TEXTURE_BINDING_2D() {
    return 32873
}, get SAMPLE_BUFFERS() {
    return 32936
}, get SAMPLES() {
    return 32937
}, get SAMPLE_COVERAGE_VALUE() {
    return 32938
}, get SAMPLE_COVERAGE_INVERT() {
    return 32939
}, get COMPRESSED_TEXTURE_FORMATS() {
    return 34467
}, get DONT_CARE() {
    return 4352
}, get FASTEST() {
    return 4353
}, get NICEST() {
    return 4354
}, get GENERATE_MIPMAP_HINT() {
    return 33170
}, get BYTE() {
    return 5120
}, get UNSIGNED_BYTE() {
    return 5121
}, get SHORT() {
    return 5122
}, get UNSIGNED_SHORT() {
    return 5123
}, get INT() {
    return 5124
}, get UNSIGNED_INT() {
    return 5125
}, get FLOAT() {
    return 5126
}, get DEPTH_COMPONENT() {
    return 6402
}, get ALPHA() {
    return 6406
}, get RGB() {
    return 6407
}, get RGBA() {
    return 6408
}, get LUMINANCE() {
    return 6409
}, get LUMINANCE_ALPHA() {
    return 6410
}, get UNSIGNED_SHORT_4_4_4_4() {
    return 32819
}, get UNSIGNED_SHORT_5_5_5_1() {
    return 32820
}, get UNSIGNED_SHORT_5_6_5() {
    return 33635
}, get FRAGMENT_SHADER() {
    return 35632
}, get VERTEX_SHADER() {
    return 35633
}, get MAX_VERTEX_ATTRIBS() {
    return 34921
}, get MAX_VERTEX_UNIFORM_VECTORS() {
    return 36347
}, get MAX_VARYING_VECTORS() {
    return 36348
}, get MAX_COMBINED_TEXTURE_IMAGE_UNITS() {
    return 35661
}, get MAX_VERTEX_TEXTURE_IMAGE_UNITS() {
    return 35660
}, get MAX_TEXTURE_IMAGE_UNITS() {
    return 34930
}, get MAX_FRAGMENT_UNIFORM_VECTORS() {
    return 36349
}, get SHADER_TYPE() {
    return 35663
}, get DELETE_STATUS() {
    return 35712
}, get LINK_STATUS() {
    return 35714
}, get VALIDATE_STATUS() {
    return 35715
}, get ATTACHED_SHADERS() {
    return 35717
}, get ACTIVE_UNIFORMS() {
    return 35718
}, get ACTIVE_ATTRIBUTES() {
    return 35721
}, get SHADING_LANGUAGE_VERSION() {
    return 35724
}, get CURRENT_PROGRAM() {
    return 35725
}, get NEVER() {
    return 512
}, get LESS() {
    return 513
}, get EQUAL() {
    return 514
}, get LEQUAL() {
    return 515
}, get GREATER() {
    return 516
}, get NOTEQUAL() {
    return 517
}, get GEQUAL() {
    return 518
}, get ALWAYS() {
    return 519
}, get KEEP() {
    return 7680
}, get REPLACE() {
    return 7681
}, get INCR() {
    return 7682
}, get DECR() {
    return 7683
}, get INVERT() {
    return 5386
}, get INCR_WRAP() {
    return 34055
}, get DECR_WRAP() {
    return 34056
}, get VENDOR() {
    return 7936
}, get RENDERER() {
    return 7937
}, get VERSION() {
    return 7938
}, get NEAREST() {
    return 9728
}, get LINEAR() {
    return 9729
}, get NEAREST_MIPMAP_NEAREST() {
    return 9984
}, get LINEAR_MIPMAP_NEAREST() {
    return 9985
}, get NEAREST_MIPMAP_LINEAR() {
    return 9986
}, get LINEAR_MIPMAP_LINEAR() {
    return 9987
}, get TEXTURE_MAG_FILTER() {
    return 10240
}, get TEXTURE_MIN_FILTER() {
    return 10241
}, get TEXTURE_WRAP_S() {
    return 10242
}, get TEXTURE_WRAP_T() {
    return 10243
}, get TEXTURE() {
    return 5890
}, get TEXTURE_CUBE_MAP() {
    return 34067
}, get TEXTURE_BINDING_CUBE_MAP() {
    return 34068
}, get TEXTURE_CUBE_MAP_POSITIVE_X() {
    return 34069
}, get TEXTURE_CUBE_MAP_NEGATIVE_X() {
    return 34070
}, get TEXTURE_CUBE_MAP_POSITIVE_Y() {
    return 34071
}, get TEXTURE_CUBE_MAP_NEGATIVE_Y() {
    return 34072
}, get TEXTURE_CUBE_MAP_POSITIVE_Z() {
    return 34073
}, get TEXTURE_CUBE_MAP_NEGATIVE_Z() {
    return 34074
}, get MAX_CUBE_MAP_TEXTURE_SIZE() {
    return 34076
}, get TEXTURE0() {
    return 33984
}, get TEXTURE1() {
    return 33985
}, get TEXTURE2() {
    return 33986
}, get TEXTURE3() {
    return 33987
}, get TEXTURE4() {
    return 33988
}, get TEXTURE5() {
    return 33989
}, get TEXTURE6() {
    return 33990
}, get TEXTURE7() {
    return 33991
}, get TEXTURE8() {
    return 33992
}, get TEXTURE9() {
    return 33993
}, get TEXTURE10() {
    return 33994
}, get TEXTURE11() {
    return 33995
}, get TEXTURE12() {
    return 33996
}, get TEXTURE13() {
    return 33997
}, get TEXTURE14() {
    return 33998
}, get TEXTURE15() {
    return 33999
}, get TEXTURE16() {
    return 34000
}, get TEXTURE17() {
    return 34001
}, get TEXTURE18() {
    return 34002
}, get TEXTURE19() {
    return 34003
}, get TEXTURE20() {
    return 34004
}, get TEXTURE21() {
    return 34005
}, get TEXTURE22() {
    return 34006
}, get TEXTURE23() {
    return 34007
}, get TEXTURE24() {
    return 34008
}, get TEXTURE25() {
    return 34009
}, get TEXTURE26() {
    return 34010
}, get TEXTURE27() {
    return 34011
}, get TEXTURE28() {
    return 34012
}, get TEXTURE29() {
    return 34013
}, get TEXTURE30() {
    return 34014
}, get TEXTURE31() {
    return 34015
}, get ACTIVE_TEXTURE() {
    return 34016
}, get REPEAT() {
    return 10497
}, get CLAMP_TO_EDGE() {
    return 33071
}, get MIRRORED_REPEAT() {
    return 33648
}, get FLOAT_VEC2() {
    return 35664
}, get FLOAT_VEC3() {
    return 35665
}, get FLOAT_VEC4() {
    return 35666
}, get INT_VEC2() {
    return 35667
}, get INT_VEC3() {
    return 35668
}, get INT_VEC4() {
    return 35669
}, get BOOL() {
    return 35670
}, get BOOL_VEC2() {
    return 35671
}, get BOOL_VEC3() {
    return 35672
}, get BOOL_VEC4() {
    return 35673
}, get FLOAT_MAT2() {
    return 35674
}, get FLOAT_MAT3() {
    return 35675
}, get FLOAT_MAT4() {
    return 35676
}, get SAMPLER_2D() {
    return 35678
}, get SAMPLER_CUBE() {
    return 35680
}, get VERTEX_ATTRIB_ARRAY_ENABLED() {
    return 34338
}, get VERTEX_ATTRIB_ARRAY_SIZE() {
    return 34339
}, get VERTEX_ATTRIB_ARRAY_STRIDE() {
    return 34340
}, get VERTEX_ATTRIB_ARRAY_TYPE() {
    return 34341
}, get VERTEX_ATTRIB_ARRAY_NORMALIZED() {
    return 34922
}, get VERTEX_ATTRIB_ARRAY_POINTER() {
    return 34373
}, get VERTEX_ATTRIB_ARRAY_BUFFER_BINDING() {
    return 34975
}, get IMPLEMENTATION_COLOR_READ_TYPE() {
    return 35738
}, get IMPLEMENTATION_COLOR_READ_FORMAT() {
    return 35739
}, get COMPILE_STATUS() {
    return 35713
}, get LOW_FLOAT() {
    return 36336
}, get MEDIUM_FLOAT() {
    return 36337
}, get HIGH_FLOAT() {
    return 36338
}, get LOW_INT() {
    return 36339
}, get MEDIUM_INT() {
    return 36340
}, get HIGH_INT() {
    return 36341
}, get FRAMEBUFFER() {
    return 36160
}, get RENDERBUFFER() {
    return 36161
}, get RGBA4() {
    return 32854
}, get RGB5_A1() {
    return 32855
}, get RGB565() {
    return 36194
}, get DEPTH_COMPONENT16() {
    return 33189
}, get STENCIL_INDEX8() {
    return 36168
}, get DEPTH_STENCIL() {
    return 34041
}, get RENDERBUFFER_WIDTH() {
    return 36162
}, get RENDERBUFFER_HEIGHT() {
    return 36163
}, get RENDERBUFFER_INTERNAL_FORMAT() {
    return 36164
}, get RENDERBUFFER_RED_SIZE() {
    return 36176
}, get RENDERBUFFER_GREEN_SIZE() {
    return 36177
}, get RENDERBUFFER_BLUE_SIZE() {
    return 36178
}, get RENDERBUFFER_ALPHA_SIZE() {
    return 36179
}, get RENDERBUFFER_DEPTH_SIZE() {
    return 36180
}, get RENDERBUFFER_STENCIL_SIZE() {
    return 36181
}, get FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE() {
    return 36048
}, get FRAMEBUFFER_ATTACHMENT_OBJECT_NAME() {
    return 36049
}, get FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL() {
    return 36050
}, get FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE() {
    return 36051
}, get COLOR_ATTACHMENT0() {
    return 36064
}, get DEPTH_ATTACHMENT() {
    return 36096
}, get STENCIL_ATTACHMENT() {
    return 36128
}, get DEPTH_STENCIL_ATTACHMENT() {
    return 33306
}, get NONE() {
    return 0
}, get FRAMEBUFFER_COMPLETE() {
    return 36053
}, get FRAMEBUFFER_INCOMPLETE_ATTACHMENT() {
    return 36054
}, get FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT() {
    return 36055
}, get FRAMEBUFFER_INCOMPLETE_DIMENSIONS() {
    return 36057
}, get FRAMEBUFFER_UNSUPPORTED() {
    return 36061
}, get FRAMEBUFFER_BINDING() {
    return 36006
}, get RENDERBUFFER_BINDING() {
    return 36007
}, get MAX_RENDERBUFFER_SIZE() {
    return 34024
}, get INVALID_FRAMEBUFFER_OPERATION() {
    return 1286
}, get UNPACK_FLIP_Y_WEBGL() {
    return 37440
}, get UNPACK_PREMULTIPLY_ALPHA_WEBGL() {
    return 37441
}, get CONTEXT_LOST_WEBGL() {
    return 37442
}, get UNPACK_COLORSPACE_CONVERSION_WEBGL() {
    return 37443
}, get BROWSER_DEFAULT_WEBGL() {
    return 37444
}, get RGB8() {
    return 32849
}, get RGBA8() {
    return 32856
},
createBuffer() {
    if (!(this instanceof WebGLRenderingContext))
        throw new TypeError('Illegal invocation')
    let tmp = {}
    Object.setPrototypeOf(tmp, WebGLBuffer.prototype)
    return tmp
},
bindBuffer() {
    if (!(this instanceof WebGLRenderingContext))
        throw new TypeError('Illegal invocation')
    // console.log('bindBuffer -> ', [...arguments])
    // debugger;
},
bufferData() {
    if (!(this instanceof WebGLRenderingContext))
        throw new TypeError('Illegal invocation')
    // console.log('bufferData -> ', [...arguments])
    // debugger;
},
createProgram() {
    if (!(this instanceof WebGLRenderingContext))
        throw new TypeError('Illegal invocation')
    // console.log('createProgram -> ', [...arguments])
    let tmp = {}
    Object.setPrototypeOf(tmp, WebGLProgram.prototype)
    return tmp
},
createShader() {
    if (!(this instanceof WebGLRenderingContext))
        throw new TypeError('Illegal invocation')
    // console.log('createShader -> ', [...arguments])
    let tmp = {}
    Object.setPrototypeOf(tmp, WebGLShader.prototype)
    return tmp
},
shaderSource() {
    if (!(this instanceof WebGLRenderingContext))
        throw new TypeError('Illegal invocation')
    // console.log('shaderSource -> ', [...arguments])
    // debugger;
},
compileShader() {
    if (!(this instanceof WebGLRenderingContext))
        throw new TypeError('Illegal invocation')
    // console.log('compileShader -> ', [...arguments])
    // debugger;
},
attachShader() {
    if (!(this instanceof WebGLRenderingContext))
        throw new TypeError('Illegal invocation')
    // console.log('attachShader -> ', [...arguments])
    // debugger;
},
linkProgram() {
    if (!(this instanceof WebGLRenderingContext))
        throw new TypeError('Illegal invocation')
    // console.log('linkProgram -> ', [...arguments])
    // debugger;
},
useProgram() {
    if (!(this instanceof WebGLRenderingContext))
        throw new TypeError('Illegal invocation')
    // console.log('useProgram -> ', [...arguments])
    // debugger;
},
getAttribLocation() {
    if (!(this instanceof WebGLRenderingContext))
        throw new TypeError('Illegal invocation')
    if (arguments[1] === 'attrVertex') {
        return 0
    }
},
getUniformLocation() {
    if (!(this instanceof WebGLRenderingContext))
        throw new TypeError('Illegal invocation')
    if (arguments[1] === 'uniformOffset') {
        let tmp = {}
        Object.setPrototypeOf(tmp, WebGLUniformLocation.prototype)
        return tmp
    }
},
enableVertexAttribArray() {
    if (!(this instanceof WebGLRenderingContext))
        throw new TypeError('Illegal invocation')
    // debugger
},
vertexAttribPointer() {
    if (!(this instanceof WebGLRenderingContext))
        throw new TypeError('Illegal invocation')
    // debugger
},
uniform2f() {
    if (!(this instanceof WebGLRenderingContext))
        throw new TypeError('Illegal invocation')
    // debugger
},
drawArrays() {
    if (!(this instanceof WebGLRenderingContext))
        throw new TypeError('Illegal invocation')
    // debugger
},
set canvas(canvas) {
    if (!(this instanceof WebGLRenderingContext))
        throw new TypeError('Illegal invocation')
    this.__canvas_id = canvas.canvas_id
},
get canvas() {
    if (!(this instanceof WebGLRenderingContext))
        throw new TypeError('Illegal invocation')
    return CanvasObj[this.__canvas_id]
},
readPixels() {
    if (!(this instanceof WebGLRenderingContext))
        throw new TypeError('Illegal invocation')
    // console.log('readPixels -> ', [...arguments])
    // debugger;
},
getSupportedExtensions() {
    if (!(this instanceof WebGLRenderingContext))
        throw new TypeError('Illegal invocation')
    // console.log('getSupportedExtensions -> ', [...arguments])
    return ['ANGLE_instanced_arrays', 'EXT_blend_minmax', 'EXT_clip_control', 'EXT_color_buffer_half_float', 'EXT_depth_clamp', 'EXT_disjoint_timer_query', 'EXT_float_blend', 'EXT_frag_depth', 'EXT_polygon_offset_clamp', 'EXT_shader_texture_lod', 'EXT_texture_compression_bptc', 'EXT_texture_compression_rgtc', 'EXT_texture_filter_anisotropic', 'EXT_sRGB', 'KHR_parallel_shader_compile', 'OES_element_index_uint', 'OES_fbo_render_mipmap', 'OES_standard_derivatives', 'OES_texture_float', 'OES_texture_float_linear', 'OES_texture_half_float', 'OES_texture_half_float_linear', 'OES_vertex_array_object', 'WEBGL_blend_func_extended', 'WEBGL_color_buffer_float', 'WEBGL_compressed_texture_s3tc', 'WEBGL_compressed_texture_s3tc_srgb', 'WEBGL_debug_renderer_info', 'WEBGL_debug_shaders', 'WEBGL_depth_texture', 'WEBGL_draw_buffers', 'WEBGL_lose_context', 'WEBGL_multi_draw', 'WEBGL_polygon_mode']
},
getShaderPrecisionFormat(v1, v2) {
    if (!(this instanceof WebGLRenderingContext))
        throw new TypeError('Illegal invocation')
    let tmp = [v1, v2]
    if ((window['__23127'] + '').includes(tmp + ''))
        return {precision: 23, rangeMax: 127, rangeMin: 127}
    else if ((window['__030'] + '').includes(tmp + '')) {
        return {precision: 0, rangeMax: 30, rangeMin: 31}
    } else {
        debugger;
    }
},
getParameter() {
    if (!(this instanceof WebGLRenderingContext))
        throw new TypeError('Illegal invocation')
    if (window['__8'].includes(arguments[0]))
        return 8
    else if (arguments[0] === 33902)
        return new Float32Array([1, 1])
    else if (arguments[0] === 33901)
        return new Float32Array([1, 1024])
    else if (window['__24'].includes(arguments[0]))
        return 24
    else if (window['__16'].includes(arguments[0])) {
        return 16
    } else if (window['__32'].includes(arguments[0])) {
        return 32
    } else if (window['__16384'].includes(arguments[0]))
        return 16384
    else if (window['__1024'].includes(arguments[0])) {
        return 1024
    } else if (window['__4096'].includes(arguments[0])) {
        return 4096
    } else if (arguments[0] === 36348) {
        return 30
    } else if (arguments[0] === 3386) {
        return new Int32Array([32767, 32767])
    } else if (arguments[0] === 7937) {
        return "WebKit WebGL"
    } else if (arguments[0] === 35724) {
        return "WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)"
    } else if (arguments[0] === 3415) {
        return 0
    } else if (arguments[0] === 7936) {
        return "WebKit"
    } else if (arguments[0] === 7938) {
        return "WebGL 1.0 (OpenGL ES 2.0 Chromium)"
    } else if (arguments[0] === 37445) {
        return "Google Inc. (Intel)"
    } else if (arguments[0] === 37446) {
        return "ANGLE (Intel, Intel(R) HD Graphics 620 (0x00005916) Direct3D11 vs_5_0 ps_5_0, D3D11)"
    } else {
        // console.log('getParameter 对应值未实现 -> ', arguments[0])
        debugger;
    }
},
getExtension() {
    if (!(this instanceof WebGLRenderingContext))
        throw new TypeError('Illegal invocation')
    if (arguments[0] === 'EXT_texture_filter_anisotropic') {
        let tmp = {}
        Object.setPrototypeOf(tmp, EXTTextureFilterAnisotropic.prototype)
        return tmp
    } else if (arguments[0] === "WEBGL_debug_renderer_info") {
        let tmp = {}
        Object.setPrototypeOf(tmp, WebGLDebugRendererInfo.prototype)
        return tmp
    }
},
getContextAttributes() {
    if (!(this instanceof WebGLRenderingContext))
        throw new TypeError('Illegal invocation')
    return {
        "alpha": true,
        "antialias": true,
        "depth": true,
        "desynchronized": false,
        "failIfMajorPerformanceCaveat": false,
        "powerPreference": "default",
        "premultipliedAlpha": true,
        "preserveDrawingBuffer": false,
        "stencil": false,
        "xrCompatible": false
    }
},
}
WebGLRenderingContext.prototype[Symbol.toStringTag] = "WebGLRenderingContext"
setPrototypeNative(WebGLRenderingContext)

// WebGLDebugRendererInfo
window.WebGLDebugRendererInfo = function WebGLDebugRendererInfo() {
throw new TypeError('Illegal invocation')
}
WebGLDebugRendererInfo.prototype = {
get UNMASKED_RENDERER_WEBGL() {
    return 37446
},
get UNMASKED_VENDOR_WEBGL() {
    return 37445
}
}
WebGLDebugRendererInfo.prototype[Symbol.toStringTag] = "WebGLDebugRendererInfo"
setPrototypeNative(WebGLDebugRendererInfo)

// EXTTextureFilterAnisotropic
window.EXTTextureFilterAnisotropic = function EXTTextureFilterAnisotropic() {
throw new TypeError('Illegal invocation')
}
EXTTextureFilterAnisotropic.prototype = {
get MAX_TEXTURE_MAX_ANISOTROPY_EXT() {
    return 34047
},
get TEXTURE_MAX_ANISOTROPY_EXT() {
    return 34046
}
}
EXTTextureFilterAnisotropic.prototype[Symbol.toStringTag] = "EXTTextureFilterAnisotropic"
setPrototypeNative(EXTTextureFilterAnisotropic)

// WebGLUniformLocation
window.WebGLUniformLocation = function WebGLUniformLocation() {
throw new TypeError('Illegal invocation')
}
WebGLUniformLocation.prototype[Symbol.toStringTag] = "WebGLUniformLocation"
setPrototypeNative(WebGLUniformLocation)

// WebGLBuffer
window.WebGLBuffer = function WebGLBuffer() {
throw new TypeError('Illegal invocation')
}
WebGLBuffer.prototype[Symbol.toStringTag] = "WebGLBuffer"
setPrototypeNative(WebGLBuffer)

// WebGLShader
window.WebGLShader = function WebGLShader() {
throw new TypeError('Illegal invocation')
}
WebGLShader.prototype[Symbol.toStringTag] = "WebGLShader"
setPrototypeNative(WebGLShader)

// WebGLProgram
window.WebGLProgram = function WebGLProgram() {
throw new TypeError('Illegal invocation')
}
WebGLProgram.prototype[Symbol.toStringTag] = "WebGLProgram"
setPrototypeNative(WebGLProgram)

// ImageData
window.ImageData = function ImageData() {
throw new TypeError('Illegal invocation')
}
ImageData.prototype = {
get width() {
    if (!(this instanceof ImageData))
        throw new TypeError('Illegal invocation')
    return 4 // todo
},
get height() {
    if (!(this instanceof ImageData))
        throw new TypeError('Illegal invocation')
    return 4 //todo
},
get colorSpace() {
    if (!(this instanceof ImageData))
        throw new TypeError('Illegal invocation')
    return "srgb" // todo
}
}
ImageData.prototype[Symbol.toStringTag] = "ImageData"
setPrototypeNative(ImageData)

// localStorage
window.Storage = function Storage() {
throw new TypeError('Illegal invocation')
};
Storage.prototype = {
getItem() {
    let key = arguments[0];
    return panda_vm.storage[key] ? panda_vm.storage[key] : null;
},
setItem() {
    panda_vm.storage[arguments[0]] = arguments[1]
}
};
Storage.prototype[Symbol.toStringTag] = "Storage"
setPrototypeNative(Storage)
localStorage = {};
localStorage.__proto__ = Storage.prototype;

// HTMLCollection
window.HTMLCollection = function HTMLCollection() {
throw new TypeError('Illegal invocation')
}
HTMLCollection.prototype = {
item() {
    if (!(this instanceof HTMLCollection))
        throw new TypeError('Illegal invocation')
    debugger
},
get length() {
    if (!(this instanceof HTMLCollection))
        throw new TypeError('Illegal invocation')
    return this.length
},
namedItem() {
    if (!(this instanceof HTMLCollection))
        throw new TypeError('Illegal invocation')
    debugger
}
}
HTMLCollection.prototype[Symbol.toStringTag] = "HTMLCollection"
setPrototypeNative(HTMLCollection)

// HTMLCanvasElement
window.HTMLCanvasElement = function HTMLCanvasElement() {
throw new TypeError('Illegal invocation')
}
HTMLCanvasElement.prototype = {
getContext(tag) {
    if (!(this instanceof HTMLCanvasElement))
        throw new TypeError('Illegal invocation')
    // debugger;
    if (tag === '2d') {
        let tmp = {}
        Object.setPrototypeOf(tmp, CanvasRenderingContext2D.prototype)
        window.CanvasObj[this.canvas_id] = this
        tmp.__canvas_id = this.canvas_id
        return tmp
    } else if (tag === 'webgl') {
        let tmp = {}
        Object.setPrototypeOf(tmp, WebGLRenderingContext.prototype)
        window.CanvasObj[this.canvas_id] = this
        tmp.__canvas_id = this.canvas_id
        return tmp
    } else {
        debugger;
        // console.log(tag + ' 未实现')
    }


},
transferControlToOffscreen() {
    if (!(this instanceof HTMLCanvasElement))
        throw new TypeError('Illegal invocation')
    debugger;
},
get height() {
    if (!(this instanceof HTMLCanvasElement))
        throw new TypeError('Illegal invocation')
    // debugger
    return window.globalCanvas[this.canvas_id].height
},
set height(value) {
    if (!(this instanceof HTMLCanvasElement))
        throw new TypeError('Illegal invocation')
    // debugger;
    window.globalCanvas[this.canvas_id].height = value
},

toDataURL() {
    if (!(this instanceof HTMLCanvasElement))
        throw new TypeError('Illegal invocation')
    // debugger;
    if (arguments[0] === "image/webp" && this.width === 1 && this.height === 1) {
        return "data:image/webp;base64,UklGRhACAABXRUJQVlA4WAoAAAAwAAAAAAAAAAAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZBTFBIAgAAAAAAVlA4IBgAAAAwAQCdASoBAAEAAUAmJaQAA3AA/v02aAA="
    } else if (this.width === 4 && this.height === 4) {
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAAA9JREFUGFdjZEADjKQLAAAA7gAFLaYDxAAAAABJRU5ErkJggg=="
    } else if (this.width === 600 && this.height === 160) {
        return 'data:image/png;base64,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'
    } else if (this.width === 0 && this.height === 0) {
        return "data:image/png;base64,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"
    }
},
captureStream() {
    if (!(this instanceof HTMLCanvasElement))
        throw new TypeError('Illegal invocation')
    debugger;

},
get width() {
    if (!(this instanceof HTMLCanvasElement))
        throw new TypeError('Illegal invocation')
    return window.globalCanvas[this.canvas_id].width

},
set width(value) {
    if (!(this instanceof HTMLCanvasElement))
        throw new TypeError('Illegal invocation')
    // debugger;
    window.globalCanvas[this.canvas_id].width = value
},
toBlob() {
    if (!(this instanceof HTMLCanvasElement))
        throw new TypeError('Illegal invocation')
    debugger;
}
}
HTMLCanvasElement.prototype[Symbol.toStringTag] = "HTMLCanvasElement"
setPrototypeNative(HTMLCanvasElement)

// HTMLMediaElement
window.HTMLMediaElement = function HTMLMediaElement() {
throw new TypeError('Illegal invocation')
}
HTMLMediaElement.prototype = {
canPlayType(v) {
    if (!(this instanceof HTMLMediaElement))
        throw new TypeError('Illegal invocation')
    // debugger;
    if (v === "audio/mpegurl" || v === "audio/x-m4a" || v === "audio/aac" ||
        v === "video/quicktime" || v === "video/x-matroska" || v === 'video/ogg; codecs="theora"') {
        return ""
    } else if (v instanceof Array && v.length === 0) {
        return ''
    } else if (v === "audio/x-m4a;") {
        return "maybe"
    }
    return 'probably'
},
get HAVE_CURRENT_DATA() {
    return 2
}, get HAVE_ENOUGH_DATA() {
    return 4
}, get HAVE_FUTURE_DATA() {
    return 3
}, get HAVE_METADATA() {
    return 1
}, get HAVE_NOTHING() {
    return 0
}, get NETWORK_EMPTY() {
    return 0
}, get NETWORK_IDLE() {
    return 1
}, get NETWORK_LOADING() {
    return 2
}, get NETWORK_NO_SOURCE() {
    return 3
}, get __zone_symbol__ononencryptedpatched() {
    return true
}, get __zone_symbol__ononwaitingforkeypatched() {
    return true
},
}
HTMLMediaElement.prototype[Symbol.toStringTag] = "HTMLMediaElement"
setPrototypeNative(HTMLMediaElement)

// HTMLVideoElement
window.HTMLVideoElement = function HTMLVideoElement() {
throw new TypeError('Illegal invocation')
};
HTMLVideoElement.prototype = {
cancelVideoFrameCallback() {
    if (!(this instanceof HTMLVideoElement))
        throw new TypeError('Illegal invocation')
    debugger;
},
getVideoPlaybackQuality(tag) {
    if (!(this instanceof HTMLVideoElement))
        throw new TypeError('Illegal invocation')
    debugger;
},
}
HTMLVideoElement.prototype[Symbol.toStringTag] = "HTMLVideoElement"
setPrototypeNative(HTMLVideoElement)
Object.setPrototypeOf(HTMLVideoElement.prototype, HTMLMediaElement.prototype)

// HTMLAudioElement
window.HTMLAudioElement = function HTMLAudioElement() {
throw new TypeError('Illegal invocation')
}
HTMLAudioElement.prototype[Symbol.toStringTag] = "HTMLAudioElement"
setPrototypeNative(HTMLAudioElement)
Object.setPrototypeOf(HTMLAudioElement.prototype, HTMLMediaElement.prototype)

// HTMLDivElement
window.HTMLDivElement = function HTMLDivElement() {
throw new TypeError('Illegal invocation')
}
HTMLDivElement.prototype = {}
HTMLDivElement.prototype[Symbol.toStringTag] = "HTMLDivElement"
setPrototypeNative(HTMLDivElement)

// HTMLHeadElement
window.HTMLHeadElement = function HTMLHeadElement() {
throw new TypeError('Illegal invocation')
}
HTMLHeadElement.prototype = {}
HTMLHeadElement.prototype[Symbol.toStringTag] = "HTMLHeadElement"
setPrototypeNative(HTMLHeadElement)

// HTMLBodyElement
window.HTMLBodyElement = function HTMLBodyElement() {
throw new TypeError('Illegal invocation')
}
HTMLBodyElement.prototype = {
get __zone_symbol__ononafterprintpatched() {
    return true
},
get __zone_symbol__ononbeforeprintpatched() {
    return true
},
get __zone_symbol__ononbeforeunloadpatched() {
    return true
},
get __zone_symbol__ononblurpatched() {
    return true
},
get __zone_symbol__ononerrorpatched() {
    return true
},
get __zone_symbol__ononfocuspatched() {
    return true
},
get __zone_symbol__ononhashchangepatched() {
    return true
},
get __zone_symbol__ononlanguagechangepatched() {
    return true
},
get __zone_symbol__ononloadpatched() {
    return true
},
get __zone_symbol__ononmessageerrorpatched() {
    return true
},
get __zone_symbol__ononmessagepatched() {
    return true
},
get __zone_symbol__ononofflinepatched() {
    return true
},
get __zone_symbol__onononlinepatched() {
    return true
},
get __zone_symbol__ononpagehidepatched() {
    return true
},
get __zone_symbol__ononpageshowpatched() {
    return true
},
get __zone_symbol__ononpopstatepatched() {
    return true
},
get __zone_symbol__ononresizepatched() {
    return true
},
get __zone_symbol__ononrejectionhandledpatched() {
    return true
},
get __zone_symbol__ononscrollpatched() {
    return true
},
get __zone_symbol__ononstoragepatched() {
    return true
},
get __zone_symbol__ononunhandledrejectionpatched() {
    return true
},
get __zone_symbol__ononunloadpatched() {
    return true
},
removeChild(child) {
}, // todo
insertBefore(child) {
} // todo
}
HTMLBodyElement.prototype[Symbol.toStringTag] = "HTMLBodyElement"
setPrototypeNative(HTMLBodyElement)


// WakeLock
window.WakeLock = function WakeLock() {
throw new TypeError('Illegal invocation')
}
WakeLock.prototype = {
request() {
    if (!(this instanceof WakeLock))
        throw new TypeError('Illegal invocation')
    debugger
},
}
WakeLock.prototype[Symbol.toStringTag] = "WakeLock"
setPrototypeNative(WakeLock)

// MediaCapabilities
window.MediaCapabilities = function MediaCapabilities() {
throw new TypeError('Illegal invocation')
}
MediaCapabilities.prototype = {
decodingInfo() {
    if (!(this instanceof MediaCapabilities))
        throw new TypeError('Illegal invocation')
    debugger;
    return {
        supported: true,
        smooth: true,
        powerEfficient: true,
        keySystemAccess: {
            keySystem: 'com.widevine.alpha',
            getConfiguration: function getConfiguration() {
                return {
                    audioRobustness: 'SW_SECURE_CRYPTO',
                    videoRobustness: 'SW_SECURE_CRYPTO',
                }
            }
        }
    }
},
encodingInfo() {
    if (!(this instanceof MediaCapabilities))
        throw new TypeError('Illegal invocation')
    debugger;
}
}
MediaCapabilities.prototype[Symbol.toStringTag] = "MediaCapabilities"
setPrototypeNative(MediaCapabilities)

// MediaSession
window.MediaSession = function MediaSession() {
throw new TypeError('Illegal invocation')
}
MediaSession.prototype = {
setActionHandler() {
    if (!(this instanceof MediaSession))
        throw new TypeError('Illegal invocation')
    debugger;
},
setCameraActive() {
    if (!(this instanceof MediaSession))
        throw new TypeError('Illegal invocation')
    debugger;
},
setMicrophoneActive() {
    if (!(this instanceof MediaSession))
        throw new TypeError('Illegal invocation')
    debugger;
},
setPositionState() {
    if (!(this instanceof MediaSession))
        throw new TypeError('Illegal invocation')
    debugger;
},
get playbackState() {
    if (!(this instanceof MediaSession))
        throw new TypeError('Illegal invocation')
    return "none"
},
get metadata() {
    if (!(this instanceof MediaSession))
        throw new TypeError('Illegal invocation')
    return null
},
}
MediaSession.prototype[Symbol.toStringTag] = "MediaSession"
setPrototypeNative(MediaSession)

// HID
window.HID = function HID() {
throw new TypeError('Illegal invocation')
}
HID.prototype = {
getDevices() {
    if (!(this instanceof HID))
        throw new TypeError('Illegal invocation')
    debugger;
},
requestDevice() {
    if (!(this instanceof HID))
        throw new TypeError('Illegal invocation')
    debugger;
},
get onconnect() {
    if (!(this instanceof HID))
        throw new TypeError('Illegal invocation')
    return null
},
get ondisconnect() {
    if (!(this instanceof HID))
        throw new TypeError('Illegal invocation')
    return null
}
}
HID.prototype[Symbol.toStringTag] = "HID"
setPrototypeNative(HID)

// IDBFactory
window.IDBFactory = function IDBFactory() {
throw new TypeError('Illegal invocation')
}
IDBFactory.prototype = {
open() {
    if (!(this instanceof IDBFactory))
        throw new TypeError('Illegal invocation')
    return {
        addEventListener: function addEventListener() {
        },
        objectStoreNames: {
            contains: function contains() {
                return false
            }
        },
        createObjectStore: function createObjectStore() {
            return {
                add: function add() {
                    return {
                        onsuccess: function onsuccess() {
                        },
                        onerror: function onerror() {
                        },
                    }
                }
            }
        },
    }
},
cmp() {
    if (!(this instanceof IDBFactory))
        throw new TypeError('Illegal invocation')
    return 0
},
deleteDatabase() {
    if (!(this instanceof IDBFactory))
        throw new TypeError('Illegal invocation')
    return {
        onsuccess: function onsuccess() {
        },
        onerror: function onerror() {
        },
    }
},
databases() {
    if (!(this instanceof IDBFactory))
        throw new TypeError('Illegal invocation')
    return {
        onsuccess: function onsuccess() {
        },
        onerror: function onerror() {
        },
    }
},

}
IDBFactory.prototype[Symbol.toStringTag] = "IDBFactory"
setPrototypeNative(IDBFactory)
indexedDB = {}
Object.setPrototypeOf(indexedDB, IDBFactory.prototype)

// External
window.External = function External() {
throw new TypeError('Illegal invocation')
}
External.prototype = {
AddSearchProvider() {
    if (!(this instanceof External))
        throw new TypeError('Illegal invocation')
},
IsSearchProviderInstalled() {
    if (!(this instanceof External))
        throw new TypeError('Illegal invocation')
},
getHostEnvironmentValue() {
    if (!(this instanceof External))
        throw new TypeError('Illegal invocation')
}
}
External.prototype[Symbol.toStringTag] = "External"
setPrototypeNative(External)
external = {}
Object.setPrototypeOf(external, External.prototype)

// Audio
window.Audio = function Audio() {
if (new.target !== Audio)
    throw new TypeError('Failed to construct \'Audio\': Please use the \'new\' operator, this DOM object constructor cannot be called as a function.')
Object.setPrototypeOf(this, HTMLAudioElement.prototype)
// return tmp
}
setNative(Audio, 'Audio')

window = myProxy(window, 'window')


// Document
Document = function Document() {
throw new TypeError('Illegal invocation')
}
Document.prototype = {
getElementsByTagName(v) {
    if (!(this instanceof Document))
        throw new TypeError('Illegal invocation')
    if (v === 'script') {
        return [{
            src: "/ccure-womannot-of-Prophem-ther-Meet-you-scredome", getAttribute: function (v) {
                if (v === 'src') {
                    return this.src
                }
            }
        },
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {}]
    }
    return []
},
createElement(tag_name) {
    // console.log(tag_name)
    if (!(this instanceof Document))
        throw new TypeError('Illegal invocation')
    let tmp;

    switch (tag_name.toLowerCase()) {
        case 'iframe':
            if (firstIframs) {
                window.firstIframs = false
                return {
                    contentWindow: window,
                    contentDocument: document,
                    style: {
                        display: ''
                    },
                    addEventListener: function () {
                        // debugger;
                        arguments[1]()
                    },
                    parentElement: function (tagName) {
                        return {
                            removeChild: function () {
                            }
                        }
                    }, // todo
                    parentNode: document.body
                }
            }
            tmp = Object.assign({}, window)
            // tmp.chrome = undefined
            tmp.Object = Object
            tmp.Function = Function

            tmp.String = String
            tmp.Uint8Array = Uint8Array
            // tmp.Function.prototype.toString = JSON.stringify
            return {
                contentWindow: tmp,
                contentDocument: document,
                style: {
                    display: ''
                },
                addEventListener: function () {
                    // debugger;
                    arguments[1]()
                },
                parentElement: function (tagName) {
                    return {
                        removeChild: function () {
                        }
                    }
                }, // todo
            }
        case 'canvas':
            tmp = {
                style: {}
            }
            tmp.canvas_id = Math.random() * +new Date()
            Object.setPrototypeOf(tmp, HTMLCanvasElement.prototype)
            window.globalCanvas[tmp.canvas_id] = {width: 0, height: 0}
            return tmp
        case 'video':
            tmp = {
                innerHTML: '',
                content: {},
                // cancelVideoFrameCallback: function () {
                //     console.log('调用 -> cancelVideoFrameCallback')
                // },
                // canPlayType: canPlayType
            };
            Object.setPrototypeOf(tmp, HTMLVideoElement.prototype);
            return tmp;
        case 'audio':
            tmp = {
                innerHTML: '',
                content: {},
                // cancelVideoFrameCallback: function () {
                //     console.log('调用 -> cancelVideoFrameCallback')
                // },
                // canPlayType: canPlayType
            };
            Object.setPrototypeOf(tmp, HTMLAudioElement.prototype);
            return tmp;
        case 'div':
            tmp = {
                innerHTML: '',
                content: {},
                tagName: 'DIV',
                style: {},
                parentElement: function (tagName) {
                    return {
                        removeChild: function () {
                        }
                    }
                }, // todo
                querySelector: function (tagName) {
                    if (tagName === 'iframe') {
                        let tmpWindow = {}
                        tmpWindow.navigator = navigator
                        tmpWindow.Audio = Audio
                        return {'contentWindow': window}
                    }
                }, // todo
            }
            Object.setPrototypeOf(tmp, HTMLDivElement.prototype);
            return tmp

        default:
        // console.log('createElement ' + tag_name + ' 未实现')

    }
    return {}
},
addEventListener() {
    if (!(this instanceof Document))
        throw new TypeError('Illegal invocation')
},
get body() {
    return {
        __proto__: {
            insertBefore: function () {
                debugger;
            }
        },

    }
},
documentElement(tag) {
    if (!(this instanceof Document))
        throw new TypeError('Illegal invocation')
},
createEvent() {
    if (!(this instanceof Document))
        throw new TypeError('Illegal invocation')
    if (navigator.platform === 'Win32') throw new DOMException("Failed to execute 'createEvent' on 'Document': The provided event type ('TouchEvent') is invalid.")
    // console.log('createEvent --> ', [...arguments])
},
createElementNS(v) {
    if (!(this instanceof Document))
        throw new TypeError('Illegal invocation')
    // console.log('createElementNS ', v, ' 未实现')
},
createAttribute(v) {
    if (!(this instanceof Document))
        throw new TypeError('Illegal invocation')
    // console.log('createAttribute ', v, ' 未实现')

}
}
Document.prototype.documentElement['getAttribute'] = function getAttribute() {
}
let __body = {
tagName: 'BODY',
appendChild() {
},
} // body 对象
Object.setPrototypeOf(__body, HTMLBodyElement.prototype)
let __head = {
tagName: 'HEAD',
}
Object.setPrototypeOf(__head, HTMLHeadElement.prototype)
Document.prototype.documentElement['children'] = [__head, __body]
Document.prototype[Symbol.toStringTag] = "Document"
setPrototypeNative(Document)
document = {
cookie: ''
// cookie: 'nlbi_2900896=xigvIoHigz7zhEgf77VrFwAAAAAWTdOKJT+Dox4I6vno1ztc; incap_ses_796_2900896=eLd1KmXyUA+wRMsMzfULC6vJKGYAAAAACOUEwyM42lVmFcj9T6+mSw==; nlbi_2847270=sxKYcsQjqxVSsjTdOKP74QAAAABipztYbXDQs31+5b5ajsBt; incap_ses_796_2847270=U+uba+pHVXHZR8sMzfULC6/JKGYAAAAAERx3pVRT2f2pXM5Gq4tRRg==; _ga_SEJ8DB2YNH=GS1.1.1713949043.1.1.1713949093.10.0.0; _ga_R4PMF3F8Y8=GS1.1.1713949044.1.1.1713949093.0.0.0',
}
document.head = __head
document.head.children = window['__all_head_tag']
document.body = __body
document.body.children = window['__all_body_tag']
document.removeEventListener = function () {
}
Object.setPrototypeOf(document, Document.prototype)
document = myProxy(document, 'document')

// DOMImplementation
window.DOMImplementation = function DOMImplementation() {
throw new TypeError('Illegal invocation')
}
DOMImplementation.prototype = {
createDocument(v) {
    if (!(this instanceof DOMImplementation))
        throw new TypeError('Illegal invocation')
    // console.log('createDocument ' + v + ' 未实现')
    debugger;
},
createDocumentType(v) {
    if (!(this instanceof DOMImplementation))
        throw new TypeError('Illegal invocation')
    // console.log('createDocumentType ' + v + ' 未实现')
    debugger;
},
createHTMLDocument(v) {  // 创建document
    if (!(this instanceof DOMImplementation))
        throw new TypeError('Illegal invocation')
    // console.log('createHTMLDocument ' + v + ' 未实现')
    return document
},
hasFeature(v) {
    if (!(this instanceof DOMImplementation))
        throw new TypeError('Illegal invocation')
    // console.log('hasFeature ' + v + ' 未实现')
    debugger;
},

}
DOMImplementation.prototype[Symbol.toStringTag] = "DOMImplementation"
setPrototypeNative(DOMImplementation)
Document.prototype['implementation'] = {}
Object.setPrototypeOf(Document.prototype['implementation'], DOMImplementation.prototype)


// Location
window.Loction = function Location() {
throw new TypeError('Illegal invocation')
}
Loction.prototype[Symbol.toStringTag] = "Loction"
setPrototypeNative(Loction)
location = {
search: '',
hash: '',
hostname: "flysas.com",
href: "https://www.flysas.com/",
host: "www.flysas.com",
pathname: '/',
origin: "https://www.flysas.com/",
protocol: "https:",
toString() {
    return this.href
}
}
Object.setPrototypeOf(location, Loction.prototype)
location = myProxy(location, 'location')
document.location = location

// Navigator
window.Navigator = function Navigator() {
throw new TypeError('Illegal invocation')
};
Navigator.prototype = {
get vendorSub() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    return ''
},

get productSub() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    return '20030107'
},
get vendor() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    return 'Google Inc.'
},
get maxTouchPoints() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    return 0
},
get scheduling() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    let tmp = {}
    Object.setPrototypeOf(tmp, Scheduling.prototype)
    return tmp
},
get userActivation() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    let tmp = {}
    Object.setPrototypeOf(tmp, UserActivation.prototype)
    return tmp
},
get doNotTrack() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    return "unknown"
},
get geolocation() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    let tmp = {}
    Object.setPrototypeOf(tmp, Geolocation.prototype)
    return tmp
},
get connection() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    let tmp = {}
    Object.setPrototypeOf(tmp, NetworkInformation.prototype)
    return tmp
},
get plugins() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    let PDF_Viewer = {
        0: {
            description: "Portable Document Format",
            suffixes: "pdf",
            type: "application/pdf",
            enabledPlugin: myProxy({filename: "internal-pdf-viewer"}, 'enabledPlugin'),
        },
        1: {
            description: "Portable Document Format",
            suffixes: "pdf",
            type: "text/pdf",
            enabledPlugin: myProxy({filename: "internal-pdf-viewer"}, 'enabledPlugin'),
        },
        // 'application/pdf': {
        //     description: "Portable Document Format",
        //     suffixes: "pdf",
        //     type: "application/pdf",
        //     enabledPlugin: myProxy({filename: "internal-pdf-viewer"}, 'enabledPlugin'),
        // },
        // 'text/pdf': {
        //     description: "Portable Document Format",
        //     suffixes: "pdf",
        //     type: 'text/pdf',
        //     enabledPlugin: myProxy({filename: "internal-pdf-viewer"}, 'enabledPlugin'),
        // },
    }
    setPlugin(PDF_Viewer, 'name', "PDF Viewer")
    let Chrome_PDF_Viewer = {
        0: {
            description: "Portable Document Format",
            suffixes: "pdf",
            type: "application/pdf",
            enabledPlugin: myProxy({filename: "internal-pdf-viewer"}, 'enabledPlugin'),
        },
        1: {
            description: "Portable Document Format",
            suffixes: "pdf",
            type: "text/pdf",
            enabledPlugin: myProxy({filename: "internal-pdf-viewer"}, 'enabledPlugin'),
        },
        // 'application/pdf': {
        //     description: "Portable Document Format",
        //     suffixes: "pdf",
        //     type: "application/pdf",
        //     enabledPlugin: myProxy({filename: "internal-pdf-viewer"}, 'enabledPlugin'),
        // },
        // 'text/pdf': {
        //     description: "Portable Document Format",
        //     suffixes: "pdf",
        //     type: "text/pdf",
        //     enabledPlugin: myProxy({filename: "internal-pdf-viewer"}, 'enabledPlugin'),
        //
        // },
    }
    setPlugin(Chrome_PDF_Viewer, 'name', "Chrome PDF Viewer")
    let Chromium_PDF_Viewer = {
        0: {
            description: "Portable Document Format",
            suffixes: "pdf",
            type: "application/pdf",
            enabledPlugin: myProxy({filename: "internal-pdf-viewer"}, 'enabledPlugin'),
        },
        1: {
            description: "Portable Document Format",
            suffixes: "pdf",
            type: "text/pdf",
            enabledPlugin: myProxy({filename: "internal-pdf-viewer"}, 'enabledPlugin'),
        },
        // 'application/pdf': {
        //     description: "Portable Document Format",
        //     suffixes: "pdf",
        //     type: "application/pdf",
        //     enabledPlugin: myProxy({filename: "internal-pdf-viewer"}, 'enabledPlugin'),
        // },
        // 'text/pdf': {
        //     description: "Portable Document Format",
        //     suffixes: "pdf",
        //     type: "text/pdf",
        //     enabledPlugin: myProxy({filename: "internal-pdf-viewer"}, 'enabledPlugin'),
        //
        // },
    }
    setPlugin(Chromium_PDF_Viewer, 'name', "Chromium PDF Viewer")
    let Microsoft_Edge_PDF_Viewer = {
        0: {
            description: "Portable Document Format",
            suffixes: "pdf",
            type: "application/pdf",
            enabledPlugin: myProxy({filename: "internal-pdf-viewer"}, 'enabledPlugin'),
        },
        1: {
            description: "Portable Document Format",
            suffixes: "pdf",
            type: "text/pdf",
            enabledPlugin: myProxy({filename: "internal-pdf-viewer"}, 'enabledPlugin'),
        },
        // 'application/pdf': {
        //     description: "Portable Document Format",
        //     suffixes: "pdf",
        //     type: "application/pdf",
        //     enabledPlugin: myProxy({filename: "internal-pdf-viewer"}, 'enabledPlugin'),
        // },
        // 'text/pdf': {
        //     description: "Portable Document Format",
        //     suffixes: "pdf",
        //     type: "text/pdf",
        //     enabledPlugin: myProxy({filename: "internal-pdf-viewer"}, 'enabledPlugin'),
        //
        // },
    }
    setPlugin(Microsoft_Edge_PDF_Viewer, 'name', "Microsoft Edge PDF Viewer")
    let WebKit_built_in_PDF = {
        0: {
            description: "Portable Document Format",
            suffixes: "pdf",
            type: "application/pdf",
            enabledPlugin: myProxy({filename: "internal-pdf-viewer"}, 'enabledPlugin'),
        },
        1: {
            description: "Portable Document Format",
            suffixes: "pdf",
            type: "text/pdf",
            enabledPlugin: myProxy({filename: "internal-pdf-viewer"}, 'enabledPlugin'),
        },
        // 'application/pdf': {
        //     description: "Portable Document Format",
        //     suffixes: "pdf",
        //     // type: "application/pdf",
        //     enabledPlugin: myProxy({filename: "internal-pdf-viewer"}, 'enabledPlugin'),
        // },
        // 'text/pdf': {
        //     description: "Portable Document Format",
        //     suffixes: "pdf",
        //     // type: "text/pdf",
        //     enabledPlugin: myProxy({filename: "internal-pdf-viewer"}, 'enabledPlugin'),
        //
        // },
    }
    setPlugin(WebKit_built_in_PDF, 'name', "WebKit built-in PDF")

    let tmp = {
        0: PDF_Viewer,
        1: Chrome_PDF_Viewer,
        2: Chromium_PDF_Viewer,
        3: Microsoft_Edge_PDF_Viewer,
        4: WebKit_built_in_PDF,
        'Chrome PDF Viewer': Chrome_PDF_Viewer,
        'Chromium PDF Viewer': Chromium_PDF_Viewer,
        'Microsoft Edge PDF Viewer': Microsoft_Edge_PDF_Viewer,
        'PDF Viewer': PDF_Viewer,
        'WebKit built-in PDF': WebKit_built_in_PDF,
    }
    Object.setPrototypeOf(tmp, PluginArray.prototype)
    return tmp
},
get mimeTypes() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    let tmp = {
        0: {
            description: "Portable Document Format",
            suffixes: "pdf",
            type: "application/pdf",
            enabledPlugin: myProxy({filename: "internal-pdf-viewer"}, 'enabledPlugin'),
        },
        1: {
            description: "Portable Document Format",
            suffixes: "pdf",
            type: "text/pdf",
            enabledPlugin: myProxy({filename: "internal-pdf-viewer"}, 'enabledPlugin'),
        },
        'application/pdf': {
            description: "Portable Document Format",
            suffixes: "pdf",
            type: "application/pdf",
            enabledPlugin: myProxy({filename: "internal-pdf-viewer"}, 'enabledPlugin'),
        },
        'text/pdf': {
            description: "Portable Document Format",
            suffixes: "pdf",
            type: "text/pdf",
            enabledPlugin: myProxy({filename: "internal-pdf-viewer"}, 'enabledPlugin'),

        },
    }
    Object.setPrototypeOf(tmp, MimeTypeArray.prototype)
    return tmp
},
get pdfViewerEnabled() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    return true
},
get webkitTemporaryStorage() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    let tmp = {}
    Object.setPrototypeOf(tmp, DeprecatedStorageQuota.prototype)
    return tmp
},
get webkitPersistentStorage() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    let tmp = {}
    Object.setPrototypeOf(tmp, DeprecatedStorageQuota.prototype)
    return tmp
},
get windowControlsOverlay() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    let tmp = {}
    Object.setPrototypeOf(tmp, WindowControlsOverlay.prototype)
    return tmp
},
get getParameter(){
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    },
get hardwareConcurrency() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    return 16
},
get cookieEnabled() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    return true
},
get appCodeName() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    return 'Mozilla'
},
get appName() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    return 'Netscape'
},
get appVersion() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    return abcd
},
get platform() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    return 'Win32'
},
get product() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    return 'Gecko'
},
get userAgent() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    return ''
},
get language() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    return 'zh-CN'
},
get languages() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    return ['zh-CN', "zh", 'en']
},
get onLine() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    return true
},
get webdriver() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    return false
},
getGamepads() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
},
get javaEnabled() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    return false
},
sendBeacon() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
},
vibrate() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
},
deprecatedRunAdAuctionEnforcesKAnonymity() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
},
protectedAudience() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
},

get bluetooth() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    let tmp = {}
    Object.setPrototypeOf(tmp, Bluetooth.prototype)
    return tmp
},
//     get deprecatedRunAdAuctionEnforcesKAnonymity() {
//     if (!(this instanceof Navigator))
//         throw new TypeError('Illegal invocation')
//     debugger;
//     let tmp = {}
//     Object.setPrototypeOf(tmp, Bluetooth.prototype)
//     return tmp
// },
//         get protectedAudience() {
//     if (!(this instanceof Navigator))
//         throw new TypeError('Illegal invocation')
//     debugger;
//     let tmp = {}
//     Object.setPrototypeOf(tmp, Bluetooth.prototype)
//     return tmp
// },
get storageBuckets() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    let tmp = {}
    Object.setPrototypeOf(tmp, StorageBucketManager.prototype)
    return tmp
},
get clipboard() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    let tmp = {}
    Object.setPrototypeOf(tmp, Clipboard.prototype)
    return tmp
},
get credentials() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    let tmp = {}
    Object.setPrototypeOf(tmp, CredentialsContainer.prototype)
    return tmp
},
get keyboard() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    let tmp = {}
    Object.setPrototypeOf(tmp, Keyboard.prototype)
    return tmp
},
get managed() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    let tmp = {}
    Object.setPrototypeOf(tmp, NavigatorManagedData.prototype)
    return tmp
},
get mediaDevices() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    let tmp = {}
    Object.setPrototypeOf(tmp, MediaDevices.prototype)
    return tmp
},
get storage() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    let tmp = {}
    Object.setPrototypeOf(tmp, StorageManager.prototype)
    return tmp
},
get serviceWorker() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    let tmp = {}
    Object.setPrototypeOf(tmp, ServiceWorkerContainer.prototype)
    return tmp
},
get virtualKeyboard() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    let tmp = {}
    Object.setPrototypeOf(tmp, VirtualKeyboard.prototype)
    return tmp
},
get wakeLock() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    let tmp = {}
    Object.setPrototypeOf(tmp, WakeLock.prototype)
    return tmp
},
get deviceMemory() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    return 8
},
get userAgentData() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    let tmp = {}
    Object.setPrototypeOf(tmp, NavigatorUAData.prototype)
    return tmp
},
    get cookieDeprecationLabel() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    let tmp = {}
    Object.setPrototypeOf(tmp, NavigatorUAData.prototype)
    return tmp
},
get login() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    let tmp = {}
    Object.setPrototypeOf(tmp, NavigatorLogin.prototype)
    return tmp
},
get ink() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    let tmp = {}
    Object.setPrototypeOf(tmp, Ink.prototype)
    return tmp
},
get mediaCapabilities() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    let tmp = {}
    Object.setPrototypeOf(tmp, MediaCapabilities.prototype)
    return tmp
},
get hid() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    let tmp = {}
    Object.setPrototypeOf(tmp, HID.prototype)
    return tmp
},
get locks() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    let tmp = {}
    Object.setPrototypeOf(tmp, LockManager.prototype)
    return tmp
},
get gpu() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    let tmp = {}
    Object.setPrototypeOf(tmp, GPU.prototype)
    return tmp
},
get mediaSession() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    let tmp = {}
    Object.setPrototypeOf(tmp, MediaSession.prototype)
    return tmp
},
get permissions() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    let tmp = {}
    Object.setPrototypeOf(tmp, Permissions.prototype)
    return tmp
},
get presentation() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    let tmp = {}
    Object.setPrototypeOf(tmp, Presentation.prototype)
    return tmp
},
get usb() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    let tmp = {}
    Object.setPrototypeOf(tmp, USB.prototype)
    return tmp
},
get xr() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    let tmp = {}
    Object.setPrototypeOf(tmp, XRSystem.prototype)
},
get serial() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    let tmp = {}
    Object.setPrototypeOf(tmp, Serial.prototype)
    return tmp
},
    get adAuctionComponents() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    let tmp = {}
    Object.setPrototypeOf(tmp, Serial.prototype)
    return tmp
},
        get runAdAuction() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    let tmp = {}
    Object.setPrototypeOf(tmp, Serial.prototype)
    return tmp
},
            get canLoadAdAuctionFencedFrame() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    let tmp = {}
    Object.setPrototypeOf(tmp, Serial.prototype)
    return tmp
},
// get adAuctionComponents() {
//     if (!(this instanceof Navigator))
//         throw new TypeError('Illegal invocation')
//     debugger;
//     return false
// },
// get runAdAuction() {
//     if (!(this instanceof Navigator))
//         throw new TypeError('Illegal invocation')
//     debugger;
//     return false
// },
// get canLoadAdAuctionFencedFrame() {
//     if (!(this instanceof Navigator))
//         throw new TypeError('Illegal invocation')
//     debugger;
//     return false
// },

canShare() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    return false
},
share() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    return new Promise(function (resolve, reject) {
        reject()
        resolve({})
    })
},
clearAppBadge() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
},
getBattery() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    return new Promise(function (resolve, reject) {
        resolve({
            charging: false,
            chargingTime: 0,
            dischargingTime: 0,
            level: 0.5
        })
    })
},
getUserMedia() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
},
requestMIDIAccess() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
},
requestMediaKeySystemAccess() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
},
setAppBadge() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
},
webkitGetUserMedia() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
},
get clearOriginJoinedAdInterestGroups() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
},
createAuctionNonce() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
},
deprecatedReplaceInURN() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
},
deprecatedURNToURL() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
},

getInstalledRelatedApps() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
    return new Promise(function (resolve, reject) {
        resolve([])
    })
},
joinAdInterestGroup() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
},
leaveAdInterestGroup() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
},
updateAdInterestGroups() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
},

registerProtocolHandler() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
},
unregisterProtocolHandler() {
    if (!(this instanceof Navigator))
        throw new TypeError('Illegal invocation')
    debugger;
},

}
Navigator.prototype[Symbol.toStringTag] = "Navigator"
setPrototypeNative(Navigator)
navigator = {}
Object.setPrototypeOf(navigator, Navigator.prototype)
navigator = myProxy(navigator, 'navigator')

// History
window.History = function History() {
throw new TypeError('Illegal invocation')
}
History.prototype = {
get length() {
    if (!(this instanceof History))
        throw new TypeError('Illegal invocation')
    return [1, 2, 3][Math.floor(Math.random() * 3)]  // todo
},
get scrollRestoration() {
    if (!(this instanceof History))
        throw new TypeError('Illegal invocation')
    return "auto"
},
get state() {
    if (!(this instanceof History))
        throw new TypeError('Illegal invocation')
    return null
},
back() {
    if (!(this instanceof History))
        throw new TypeError('Illegal invocation')
    debugger;
},
go() {
    if (!(this instanceof History))
        throw new TypeError('Illegal invocation')
    debugger;
},
pushState() {
    if (!(this instanceof History))
        throw new TypeError('Illegal invocation')
    debugger;
},
replaceState() {
    if (!(this instanceof History))
        throw new TypeError('Illegal invocation')
    debugger;
},
forward() {
    if (!(this instanceof History))
        throw new TypeError('Illegal invocation')
    debugger;
}
}
History.prototype[Symbol.toStringTag] = "History"
setPrototypeNative(History)
history = {}
Object.setPrototypeOf(history, History.prototype);
window.top =  Object.assign({}, window);
window.self = Object.assign({}, window);

Worker = function Worker(){};
setPrototypeNative(Worker);

WebGL2RenderingContext = function WebGL2RenderingContext(){};
setPrototypeNative(WebGL2RenderingContext,'WebGL2RenderingContext');
Object.defineProperty(WebGL2RenderingContext.prototype, 'toString', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (){
            return '[object WebGL2RenderingContext]'
        }
    });
WebGL2RenderingContext.prototype = {
    get getParameter(){
        if (!(this instanceof WebGL2RenderingContext))
        throw new TypeError('Illegal invocation')
    }
};

(function () {
  var TY = 0;
  var j2 = [];
  var gS = 0;
  var Ts = "rGwEzs3sLy0sTmfOrA9Ojsqsjk4sjkYErGwEzo6sTK5OLY6OjiwvbC3MzexOLW6OS6sopaVPayzL662szSxOxU7tqE7tBC/NjSxuDowtrW6OrK0pza5Ojo4sjW5ojohoxYqOjWhoiojtzW4trM0Pjo6o7Kwoionp68jp6k6Jju2sbKyNL2qsTi6u6cysD82M7S1t7K5sbYyubI6M7A2sLU4Jjqztro4NCiwpzc2O7S1uCo4t7A2sLewNLc2OTu1q7Y7NzOstrE6sTs2MTqzs60yujKyJ60jo6qiOLyyNbC0OrKxqzWxOrMysSqypasmK6ymqqYgpqairhMzMjEyLrgalBwaujGuL7a3MTqxOzY6srK5ure0sjU7NjqysD4yMze3OrA2sjI7uLY4siCysTszMTK5ubo0srmhsDu3Nji2OLKzNTi3N7akt7KwszaxO7c6sra5ure3uzc3tzW3urs3tTi+O7S1ujg3tzWrMKYqqyajrKOgpqajrqkoLioqoC+upKKxOzMxIrs2MTC3MjomsLY3OLOwsDqzlrS3troyKLEZIRkaO7WwsLGxqji1s7Q6OTm7tzS3rLKxOjY7MLazrrk4Pjo6siuuoC44NzeyNrKxOLIxqDWwNjiwsjq6OrO0trY6KbqwOjk4tamwszYwtLE6M7k6oDqwKLG4NjSwsyIwtraxO7SxsxamsTiwODQosbsiNLSysjO2tbE6pLK5O7A2qLcyObu1O7S1sralOLO3sCk6OrKwsbE5sjk6sjiyILOysrSyOKQ6ujYwNLYxorM0ODoosbUisSE6M6CzNjs4sqSgJKOmKrOjtjE5oDSytaE7tqMwpiWqKSumoqsUmbG0NrKxoLa1tii1sKq6OxaxsTE1t6axsaA2trIotbG2uLW4qDqyKL62srS0PjoqsjY3MLY0vDg6tLE4s7ewKTs1tjS2oSqhKyYhKqKxOTs5urOlMbKwszU6tzO2sTo4KrSztTs3ILe0tbqxsCk6sTiyMag2sjizsLcysTqxqLA5ubKyOzclOrI2MDS2sbKyuLMktbKyOjc4JrGxnLCzt5YwtLK7NjmysrG4PiEjtzeyMLa7NSO0sjY6uLGzoqCjJ60pLqGopiuspyQrpiOtqqCkoKIntrc2ODSyNCiyNjmysbExNjulurMzMrentTi3Mrs1GJ0xMRiashqzr7U6szI5IrE7NbmwtDS3tjinoaqrsqS3NLa2sjizs7K4szWyNbo2KakgpqOuJqslIKelKasqoqOso6OiqKMnricnoiCkJKMlqaulOSaxs7Y3NbmztbqwsrmtsLA5urexsTqzM7UisTo5urC3NrkyOaq5s7YwOTo5u7c2NyCyNaq2sjKyMbKysDyiKiekOyI7t7U4sju3sTk6OrC3NB4ZurKysjU5s7Y7tTu2MDg6sLA7uTq7NTuvOrE4t64ws6yyOrIgs7CmtjqysLGxO6+3tDg5OKI6MrGjtLE5sDY6sriwsjazOTqXOrE4tTIzurA4OBCwohehIJkpEhEQmbqesbO2MBGzOZ+4s7eWMLSyubg0Oro6s7CxO7axOzY7qLUoo64gpaCiKaopsDags7U4rzKzNTqxubI1uD6wKLSyMTqztzY4tbCyN7a6OrO2ubq3tbmfNjsztbuvOLCzNjmysza6t7WzkjC1s7Q6OTm7tzS3rLKxOjY7MLazrrk4Pjo6siuuoC0vrqelsbY4sTm7OrE4tbozOLCzNjmzsDawtTgnNrC3N7c2OLc1szK6O6y0ObE7rbqxOLc6MTqxM6+7N6y3tbI6uzYXMLU8uro4ErA8Ezg1uLw7sjW0ELM2MTO1OzE2tBGjuhCWrjy1sjg3o7axOjo6JrG6saCysTg4O7aqMjg6sLA7uTq7NrestrqzNrI3rbo7rLQ5sTg5u7c2OLaxszc1s7S1sjg3o7S3NbY0szchOzW5qLI2N6C0sjU7NjqwpzU6OjiwNbiyOzakt7Q6OTi1ubIysrE5ObertzexOLWqOjCwtzcpObqwsrsVs7U5OTgSoze2sTqyOLK0sTo4K7KzNbMyujustDmxO626sTi3OjE6sTOvuDuusTOXu7KytLM0t7C2NrowKjawsTKzNbgstriyMjk5urMzMrOntzaxPLa2OiuysSIqpjC1sjg3o7c1tSCwsjI3tSIpIbU4sjq7IrmevJiUGhQ+FjqysTk7Kjo4FLGyGzqzNpy3tLY7tbusK7I2OZ26szMyt6e1OLcyuzQ9ljqysTk7Kjo6nLI6szSyMLe1OaO2sD82KLy0sTm/OBSUtza0sjATtLWfOrI7MbunMTq3M7c0tBK5sRs6srQTtTi3Mrs2sZyyOLc1OjO3tD2iKrC3NTi/OLEYE";
  var ph = atob(Ts);
  var UQ = ph.length;
  var FJ = [];
  while (gS < UQ) {
    var t_ = ph.charCodeAt(gS);
    FJ.push(t_);
    gS += 1;
  }
  var xV = FJ;
  var Ic = xV.length;
  var oG = Ic - 1;
  var ld = [];
  while (oG >= 0) {
    ld.push(xV[oG]);
    oG -= 1;
  }
  var ca = ld;
  for (var Ri in ca) {
    var ls = ca[Ri];
    if (ca.hasOwnProperty(Ri)) {
      j2.push(ls);
    }
  }
  var jA = j2;
  var mD = jA;
  var Nb = mD.length;
  while (TY + 1 < Nb) {
    var wS = mD[TY];
    mD[TY] = mD[TY + 1];
    mD[TY + 1] = wS;
    TY += 2;
  }
  var s9 = document;
  function LA(sD, YJ) {
    var ch = [];
    for (var na in sD) {
      var RO = sD[na];
      if (sD.hasOwnProperty(na)) {
        ch["push"](YJ(RO));
      }
    }
    return ch;
  }
  var Jt = [];
  var Rp = 0;
  var GS = [];
  var OJ = [];
  var u6 = "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";
  var Pt = atob(u6);
  var Z1 = 0;
  var WR = Pt.length;
  while (Z1 < WR) {
    var Tp = Pt.charCodeAt(Z1);
    OJ.push(Tp);
    Z1 += 1;
  }
  var P0 = OJ;
  var Hf = 113;
  var TG = P0.length;
  var M4 = [71, 158, 27, 110, 34, 74, 84, 224, 158, 118, 61, 113, 34, 109, 90, 213, 79, 142, 247, 100, 121, 203, 31].length;
  while (Rp < TG) {
    var jn = [71, 158, 27, 110, 34, 74, 84, 224, 158, 118, 61, 113, 34, 109, 90, 213, 79, 142, 247, 100, 121, 203, 31][Rp % M4];
    var u5 = P0[Rp];
    var C9 = Hf;
    Hf = u5;
    GS.push(u5 ^ jn ^ C9);
    Rp += 1;
  }
  var Bh = GS;
  for (var MK in Bh) {
    var z9 = Bh[MK];
    if (Bh.hasOwnProperty(MK)) {
      Jt.push(z9);
    }
  }
  var J8 = Jt;
  var cp = J8;
  var b3 = 0;
  var sn = cp.length;
  while (b3 + 1 < sn) {
    var Lq = cp[b3];
    cp[b3] = cp[b3 + 1];
    cp[b3 + 1] = Lq;
    b3 += 2;
  }
  function Th(pd, KK) {
    var vD = [];
    for (var cW in pd) {
      var H7 = pd[cW];
      if (pd.hasOwnProperty(cW)) {
        if (KK(H7)) {
          vD["push"](H7);
        }
      }
    }
    return vD;
  }
  function C6(Gd, fQ) {
    return Gd["substring"](Gd["length"] - fQ["length"]) === fQ;
  }
  function hm(v2, UN) {
    var wd = "[depth limit]";
    if (UN < 2) {
      var xW = "string cast failed";
      try {
        xW = "string cast: " + v2;
      } catch (FS) {}
      var ME = "JSON.stringify exception";
      try {
        ME = JSON["stringify"](v2) + "";
      } catch (Hl) {}
      var Pb = "no Error.name";
      try {
        if (typeof v2["name"] === "string") {
          Pb = v2["name"];
        }
      } catch (Fe) {}
      var by = "no Error.message";
      try {
        if (typeof v2["message"] === "string") {
          by = v2["message"];
        }
      } catch (zb) {}
      var Y9 = "no Error.stack";
      try {
        if (typeof v2["stack"] === "string") {
          Y9 = v2["stack"];
        }
      } catch (cH) {}
      var jU = "no Error.cause";
      try {
        if (v2["cause"]) {
          jU = hm(v2["cause"], UN + 1);
        }
      } catch (qI) {}
      wd = xW + " ;; " + ME + " ;; " + Pb + " ;; " + by + " ;; " + Y9 + " ;; " + jU;
    }
    return wd;
  }
  function J4(K5) {
    var ga = {};
    var tT = 25928;
    ga["t"] = tT;
    ga["st"] = 1736591134;
    ga["sr"] = 3257989205;
    ga["og"] = 2;
    ga["ir"] = "/5ibsc1Qy+OyMSe+ccE9D4gIKD3JYp+V+kT0hosJJ2MdXsZDwdztKg==";
    ga["e"] = hm(K5, 0);
    return ga;
  }
  var ZD = new RegExp("\\s", "g");
  var ij = new RegExp("[\\u0080-\\uFFFF]", "g");
  var R9 = new RegExp("..", "g");
  var aQ = parseInt;
  var c3 = JSON["stringify"];
  var tZ = String["fromCharCode"];
  var iS = Array["from"];
  function fb(H9) {
    return typeof H9 === "function" && C6(H9["toString"]()["replace"](ZD, ""), "{[nativecode]}");
  }
  var EZ = String["fromCharCode"](55296);
  var tB = String["fromCharCode"](56319);
  var Dz = String["fromCharCode"](56320);
  var cP = String["fromCharCode"](57343);
  var CE = String["fromCharCode"](65533);
  var jR = new RegExp("(^|[^" + EZ + "-" + tB + "])[" + Dz + "-" + cP + "]", "g");
  var Rf = new RegExp("[" + EZ + "-" + tB + "]([^" + Dz + "-" + cP + "]|$)", "g");
  function QE(xq) {
    var l_ = undefined;
    try {
      xq();
    } catch (aj) {
      if (aj !== undefined && aj !== null && aj["stack"] && aj["message"]) {
        l_ = aj["message"];
      }
    }
    return l_;
  }
  function b5(iG, pE) {
    var bL = pE;
    var L7 = iG;
    return function () {
      var XL = bL;
      var pT = L7;
      pT ^= pT << 23;
      pT ^= pT >> 17;
      pT ^= XL;
      pT ^= XL >> 26;
      bL = pT;
      L7 = XL;
      return (L7 + bL) % 4294967296;
    };
  }
  var I_ = new RegExp("Trident");
  function ji(Bz) {
    return "\\u" + ("0000" + Bz.charCodeAt(0).toString(16)).substr(-4);
  }
  var uY = new RegExp("[\\u007F-\\uFFFF]", "g");
  function rp(aP) {
    this["interrogate"] = function (tk, ac) {
      try {
        var iZ = s9["createElement"]("IFRAME");
        iZ["style"]["display"] = "none";
        iZ["addEventListener"]("load", function () {
          try {
            var zM = aP["s"];
            var r7 = aP["pow"];
            var Sw = aP["pt"];
            var ky = aP["t"];
            var ih = aP["aih"];
            var PX = aP["sic"];
            var Q6 = aP["slt"];
            var BD = aP["at"];
            var gh = aP["slc"];
            var yf = aP["gcs"];
            ky["start"]("interrogation");
            var Yn = Math["random"]() * 1073741824 | 0;
            var Jq = iZ["contentWindow"];
            var i_ = Jq["navigator"];
            var KF = iZ["contentDocument"];
            var jS = null;
            var YW = null;
            var g6 = null;
            var bJ = null;
            var q3 = null;
            var AD = null;
            var xd = null;
            var nT = null;
            var lO = null;
            var e9 = null;
            var DS = null;
            var F7 = -1;
            var RE = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918000, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117];
            var jx = 0;
            var wZ = typeof Yn !== "string" ? "" + Yn : Yn;
            while (jx < wZ["length"]) {
              F7 = F7 >>> 8 ^ RE[(F7 ^ wZ["charCodeAt"](jx)) & 255];
              jx += 1;
            }
            var km = Yn;
            km;
            var LC = 0;
            var nR = "3257989205";
            while (LC < nR["length"]) {
              F7 = F7 >>> 8 ^ RE[(F7 ^ nR["charCodeAt"](LC)) & 255];
              LC += 1;
            }
            var zC = 3257989205;
            zC;
            var LX = 1;
            var DY = false;
            function A0(PJ) {
              var ZA = 0;
              var t1 = ["_Selenium_IDE_Recorder", "_phantom", "_selenium", "callPhantom", "callSelenium", "__nightmare"];
              var Gx = ["__driver_evaluate", "__webdriver_evaluate", "__selenium_evaluate", "__fxdriver_evaluate", "__driver_unwrapped", "__webdriver_unwrapped", "__selenium_unwrapped", "__fxdriver_unwrapped", "__webdriver_script_function", "__webdriver_script_func", "__webdriver_script_fn"];
              try {
                var ZC = 0;
                for (var RY in t1) {
                  var X3 = t1[RY];
                  if (t1.hasOwnProperty(RY)) {
                    (function (Gk, eD) {
                      if (PJ[Gk]) {
                        ZA = 100 + eD;
                      }
                    })(X3, ZC);
                    ZC += 1;
                  }
                }
                var oW = 0;
                for (var gs in Gx) {
                  var US = Gx[gs];
                  if (Gx.hasOwnProperty(gs)) {
                    (function (Z5, NB) {
                      if (PJ["document"][Z5]) {
                        ZA = 200 + NB;
                      }
                    })(US, oW);
                    oW += 1;
                  }
                }
              } catch (ka) {}
              try {
                if (!ZA && PJ["external"] && PJ["external"]["toString"]() && PJ["external"]["toString"]()["indexOf"]("Sequentum") !== -1) {
                  ZA = 400;
                }
              } catch (ZI) {}
              if (!ZA) {
                try {
                  if (PJ["document"]["documentElement"]["getAttribute"]("selenium")) {
                    ZA = 500;
                  } else if (PJ["document"]["documentElement"]["getAttribute"]("webdriver")) {
                    ZA = 600;
                  } else if (PJ["document"]["documentElement"]["getAttribute"]("driver")) {
                    ZA = 700;
                  }
                } catch (xO) {}
              }
              var xw = undefined;
              if (ZA) {
                var Qp = b5(3824474679, Yn);
                var jp = [];
                var U5 = 0;
                while (U5 < 74) {
                  jp.push(Qp() & 255);
                  U5 += 1;
                }
                var VR = jp;
                var PH = VR;
                var Wr = JSON.stringify(ZA, function (fG, fH) {
                  return fH === undefined ? null : fH;
                });
                var S2 = Wr.replace(uY, ji);
                var tF = [];
                var eR = 0;
                while (eR < S2.length) {
                  tF.push(S2.charCodeAt(eR));
                  eR += 1;
                }
                var hR = tF;
                var Qq = hR;
                var gy = Qq.length;
                var LW = PH["slice"](0, 26).length;
                var rg = [];
                var CC = 0;
                while (CC < gy) {
                  rg.push(Qq[CC]);
                  rg.push(PH["slice"](0, 26)[CC % LW]);
                  CC += 1;
                }
                var N6 = rg;
                var Nu = N6.length;
                var z8 = [];
                var Qu = 0;
                while (Qu < Nu) {
                  z8.push(N6[(Qu + PH[26]) % Nu]);
                  Qu += 1;
                }
                var nh = z8;
                var ew = nh.length;
                var fp = PH["slice"](27, 52).length;
                var Yx = [];
                var He = 113;
                var kF = 0;
                while (kF < ew) {
                  var ZJ = nh[kF];
                  var It = PH["slice"](27, 52)[kF % fp];
                  var sO = ZJ ^ It ^ He;
                  Yx.push(sO);
                  He = sO;
                  kF += 1;
                }
                var IP = Yx;
                var On = IP.length;
                var xk = PH["slice"](52, 73).length;
                var wW = [];
                var V8 = 113;
                var sm = 0;
                while (sm < On) {
                  var cg = IP[sm];
                  var qU = PH["slice"](52, 73)[sm % xk];
                  var BV = cg ^ qU ^ V8;
                  wW.push(BV);
                  V8 = BV;
                  sm += 1;
                }
                var hh = wW;
                var Ei = [];
                for (var si in hh) {
                  var WP = hh[si];
                  if (hh.hasOwnProperty(si)) {
                    var Di = String.fromCharCode(WP);
                    Ei.push(Di);
                  }
                }
                var VT = btoa(Ei.join(""));
                xw = VT;
              }
              return xw;
            }
            function Kx(ia, rY) {
              var pX = window;
              LX += 1;
              var Et = pX["setTimeout"](function () {
                if (!DY) {
                  var gb = window;
                  LX += 1;
                  var ax = gb["setTimeout"](function () {
                    if (!DY) {
                      Kx(ia, rY);
                    }
                  }, (LX - 1) * 200);
                  var mH = {};
                  mH["abort"] = function () {
                    gb["clearTimeout"](ax);
                  };
                  ia["push"](mH);
                  var GV = A0(gb);
                  if (GV) {
                    mH["abort"]();
                    DY = true;
                    rY(GV);
                  }
                }
              }, (LX - 1) * 200);
              var O0 = {};
              O0["abort"] = function () {
                pX["clearTimeout"](Et);
              };
              ia["push"](O0);
              var zB = A0(pX);
              if (zB) {
                O0["abort"]();
                DY = true;
                rY(zB);
              }
            }
            function Ue(j6, Oo, Mn) {
              var TC = {};
              try {
                if (Oo) {
                  TC["evaGqoQqvehc!Q=="] = Mn(Oo);
                } else if (j6 === null) {
                  TC["evaGqoQqvehc!Q=="] = Mn("skipped");
                } else {
                  var u4 = 260;
                  if (j6["length"] <= u4) {
                    var Rz = j6["substr"](33, 227);
                    TC["VwJ[soAImNJr_o(ZPIKQopBbmLpAvqGyqjVOHA=="] = Mn(Rz);
                  } else {
                    TC["evaGqoQqvehc!Q=="] = Mn("exceeded");
                  }
                }
              } catch (vO) {
                TC["evaGqoQqvehc!Q=="] = Mn(vO);
              }
              return TC;
            }
            var os = null;
            try {
              os = iZ["contentWindow"]["Function"]["prototype"]["toString"];
            } catch (FT) {}
            function Pr(x9) {
              var Hc = {};
              var BI = function () {};
              var WN = null;
              try {
                BI = x9();
                WN = typeof BI;
              } catch (YG) {}
              var QZ = b5(215464049, Yn);
              var i4 = [];
              var zh = 0;
              while (zh < 71) {
                i4.push(QZ() & 255);
                zh += 1;
              }
              var R2 = i4;
              var sf = R2;
              var us = JSON.stringify(WN, function (WJ, P5) {
                return P5 === undefined ? null : P5;
              });
              var Yv = us.replace(uY, ji);
              var CG = [];
              var zo = 0;
              while (zo < Yv.length) {
                CG.push(Yv.charCodeAt(zo));
                zo += 1;
              }
              var pm = CG;
              var Ed = pm;
              var VQ = Ed.length;
              var P1 = [];
              var Xa = 0;
              while (Xa < VQ) {
                P1.push(Ed[(Xa + sf[0]) % VQ]);
                Xa += 1;
              }
              var Lh = P1;
              var i1 = Lh.length;
              var XI = sf["slice"](1, 17).length;
              var sr = [];
              var EX = 0;
              while (EX < i1) {
                var jG = Lh[EX];
                var V9 = sf["slice"](1, 17)[EX % XI] & 127;
                sr.push((jG + V9) % 256 ^ 128);
                EX += 1;
              }
              var Tj = sr;
              var eP = Tj.length;
              var X9 = sf["slice"](17, 46).length;
              var MQ = [];
              var mM = 113;
              var KP = 0;
              while (KP < eP) {
                var SU = Tj[KP];
                var II = sf["slice"](17, 46)[KP % X9];
                var bm = SU ^ II ^ mM;
                MQ.push(bm);
                mM = bm;
                KP += 1;
              }
              var Gw = MQ;
              var Ug = Gw.length;
              var VS = sf["slice"](46, 70).length;
              var ZE = [];
              var jm = 0;
              while (jm < Ug) {
                var uz = Gw[jm];
                var uF = sf["slice"](46, 70)[jm % VS] & 127;
                ZE.push((uz + uF) % 256 ^ 128);
                jm += 1;
              }
              var Hx = ZE;
              var gM = [];
              for (var vG in Hx) {
                var RX = Hx[vG];
                if (Hx.hasOwnProperty(vG)) {
                  var p1 = String.fromCharCode(RX);
                  gM.push(p1);
                }
              }
              var tE = btoa(gM.join(""));
              Hc["fKzDNhM,"] = tE;
              if (WN === "function") {
                try {
                  var E1 = b5(215464049, Yn);
                  var Gz = [];
                  var QQ = 0;
                  while (QQ < 71) {
                    Gz.push(E1() & 255);
                    QQ += 1;
                  }
                  var Bv = Gz;
                  var D3 = Bv;
                  var pY = JSON.stringify(BI["toString"]()["replace"](BI["name"], "")["length"], function (C5, Sj) {
                    return Sj === undefined ? null : Sj;
                  });
                  var bT = pY.replace(uY, ji);
                  var ZT = [];
                  var iU = 0;
                  while (iU < bT.length) {
                    ZT.push(bT.charCodeAt(iU));
                    iU += 1;
                  }
                  var DE = ZT;
                  var Cq = DE;
                  var Cj = Cq.length;
                  var G9 = [];
                  var Tk = 0;
                  while (Tk < Cj) {
                    G9.push(Cq[(Tk + D3[0]) % Cj]);
                    Tk += 1;
                  }
                  var GY = G9;
                  var c9 = GY.length;
                  var bq = D3["slice"](1, 17).length;
                  var L8 = [];
                  var Rc = 0;
                  while (Rc < c9) {
                    var Ch = GY[Rc];
                    var Ry = D3["slice"](1, 17)[Rc % bq] & 127;
                    L8.push((Ch + Ry) % 256 ^ 128);
                    Rc += 1;
                  }
                  var hz = L8;
                  var B5 = hz.length;
                  var z_ = D3["slice"](17, 46).length;
                  var Y8 = [];
                  var Eq = 113;
                  var Dq = 0;
                  while (Dq < B5) {
                    var bb = hz[Dq];
                    var hF = D3["slice"](17, 46)[Dq % z_];
                    var Yk = bb ^ hF ^ Eq;
                    Y8.push(Yk);
                    Eq = Yk;
                    Dq += 1;
                  }
                  var Pd = Y8;
                  var JA = Pd.length;
                  var Xp = D3["slice"](46, 70).length;
                  var Te = [];
                  var JS = 0;
                  while (JS < JA) {
                    var Dc = Pd[JS];
                    var t7 = D3["slice"](46, 70)[JS % Xp] & 127;
                    Te.push((Dc + t7) % 256 ^ 128);
                    JS += 1;
                  }
                  var Jf = Te;
                  var Vj = [];
                  for (var AX in Jf) {
                    var Gs = Jf[AX];
                    if (Jf.hasOwnProperty(AX)) {
                      var tb = String.fromCharCode(Gs);
                      Vj.push(tb);
                    }
                  }
                  var mx = btoa(Vj.join(""));
                  (function (BT) {
                    if (BT !== undefined) {
                      Hc["Z*[[JhTmZsN+/p(KJP/xFzm*U/)QUkplQ(U="] = BT;
                    }
                  })(mx);
                } catch (hw) {}
                try {
                  var pH = b5(215464049, Yn);
                  var Wf = [];
                  var Zu = 0;
                  while (Zu < 71) {
                    Wf.push(pH() & 255);
                    Zu += 1;
                  }
                  var UY = Wf;
                  var CA = UY;
                  var JD = JSON.stringify(os["call"](BI)["replace"](BI["name"], "")["length"], function (Tf, j4) {
                    return j4 === undefined ? null : j4;
                  });
                  var Hm = JD.replace(uY, ji);
                  var Fm = [];
                  var Ii = 0;
                  while (Ii < Hm.length) {
                    Fm.push(Hm.charCodeAt(Ii));
                    Ii += 1;
                  }
                  var ag = Fm;
                  var Z2 = ag;
                  var N7 = Z2.length;
                  var nL = [];
                  var VE = 0;
                  while (VE < N7) {
                    nL.push(Z2[(VE + CA[0]) % N7]);
                    VE += 1;
                  }
                  var j1 = nL;
                  var CF = j1.length;
                  var ke = CA["slice"](1, 17).length;
                  var NW = [];
                  var f7 = 0;
                  while (f7 < CF) {
                    var uR = j1[f7];
                    var D6 = CA["slice"](1, 17)[f7 % ke] & 127;
                    NW.push((uR + D6) % 256 ^ 128);
                    f7 += 1;
                  }
                  var b6 = NW;
                  var M7 = b6.length;
                  var wr = CA["slice"](17, 46).length;
                  var Ap = [];
                  var SG = 113;
                  var WB = 0;
                  while (WB < M7) {
                    var BN = b6[WB];
                    var x3 = CA["slice"](17, 46)[WB % wr];
                    var bw = BN ^ x3 ^ SG;
                    Ap.push(bw);
                    SG = bw;
                    WB += 1;
                  }
                  var fs = Ap;
                  var jB = fs.length;
                  var Z3 = CA["slice"](46, 70).length;
                  var YU = [];
                  var Cw = 0;
                  while (Cw < jB) {
                    var df = fs[Cw];
                    var zl = CA["slice"](46, 70)[Cw % Z3] & 127;
                    YU.push((df + zl) % 256 ^ 128);
                    Cw += 1;
                  }
                  var QS = YU;
                  var Fa = [];
                  for (var Iv in QS) {
                    var L0 = QS[Iv];
                    if (QS.hasOwnProperty(Iv)) {
                      var R7 = String.fromCharCode(L0);
                      Fa.push(R7);
                    }
                  }
                  var U4 = btoa(Fa.join(""));
                  (function (QH) {
                    if (QH !== undefined) {
                      Hc["V-HREjqtF_H$NGaJYdfF!)bhFB/qcX+,rX_*,dpNxrcPwI$Xqs&eBA=="] = QH;
                    }
                  })(U4);
                } catch (xs) {}
                try {
                  var Ni = b5(215464049, Yn);
                  var Sy = [];
                  var EN = 0;
                  while (EN < 71) {
                    Sy.push(Ni() & 255);
                    EN += 1;
                  }
                  var S7 = Sy;
                  var U0 = S7;
                  var bP = BI["toString"]()["replace"](BI["name"], "")["slice"](-21)["replace"](jR, "$1" + CE)["replace"](Rf, CE + "$1");
                  var DH = JSON.stringify(bP, function (ok, Im) {
                    return Im === undefined ? null : Im;
                  });
                  var Rq = DH.replace(uY, ji);
                  var Yl = [];
                  var h6 = 0;
                  while (h6 < Rq.length) {
                    Yl.push(Rq.charCodeAt(h6));
                    h6 += 1;
                  }
                  var RD = Yl;
                  var r2 = RD;
                  var vm = r2.length;
                  var nq = [];
                  var np = 0;
                  while (np < vm) {
                    nq.push(r2[(np + U0[0]) % vm]);
                    np += 1;
                  }
                  var Vl = nq;
                  var PR = Vl.length;
                  var uq = U0["slice"](1, 17).length;
                  var Gq = [];
                  var Jo = 0;
                  while (Jo < PR) {
                    var rF = Vl[Jo];
                    var Gh = U0["slice"](1, 17)[Jo % uq] & 127;
                    Gq.push((rF + Gh) % 256 ^ 128);
                    Jo += 1;
                  }
                  var zg = Gq;
                  var rl = zg.length;
                  var dY = U0["slice"](17, 46).length;
                  var f8 = [];
                  var ff = 113;
                  var E3 = 0;
                  while (E3 < rl) {
                    var OC = zg[E3];
                    var o9 = U0["slice"](17, 46)[E3 % dY];
                    var DM = OC ^ o9 ^ ff;
                    f8.push(DM);
                    ff = DM;
                    E3 += 1;
                  }
                  var qW = f8;
                  var G2 = qW.length;
                  var vA = U0["slice"](46, 70).length;
                  var NJ = [];
                  var Gl = 0;
                  while (Gl < G2) {
                    var Ix = qW[Gl];
                    var u8 = U0["slice"](46, 70)[Gl % vA] & 127;
                    NJ.push((Ix + u8) % 256 ^ 128);
                    Gl += 1;
                  }
                  var mF = NJ;
                  var v6 = [];
                  for (var f_ in mF) {
                    var cs = mF[f_];
                    if (mF.hasOwnProperty(f_)) {
                      var ZF = String.fromCharCode(cs);
                      v6.push(ZF);
                    }
                  }
                  var r_ = btoa(v6.join(""));
                  (function (Rt) {
                    if (Rt !== undefined) {
                      Hc["e/q-XG)-qw-,ZDWRcZOBQ&CC"] = Rt;
                    }
                  })(r_);
                } catch (ir) {}
                try {
                  var uf = b5(215464049, Yn);
                  var SW = [];
                  var J6 = 0;
                  while (J6 < 71) {
                    SW.push(uf() & 255);
                    J6 += 1;
                  }
                  var b4 = SW;
                  var Ik = b4;
                  var d2 = os["call"](BI)["replace"](BI["name"], "")["slice"](-21)["replace"](jR, "$1" + CE)["replace"](Rf, CE + "$1");
                  var ZS = JSON.stringify(d2, function (Yb, bM) {
                    return bM === undefined ? null : bM;
                  });
                  var s2 = ZS.replace(uY, ji);
                  var k3 = [];
                  var aq = 0;
                  while (aq < s2.length) {
                    k3.push(s2.charCodeAt(aq));
                    aq += 1;
                  }
                  var Vq = k3;
                  var Kw = Vq;
                  var pj = Kw.length;
                  var Bo = [];
                  var rd = 0;
                  while (rd < pj) {
                    Bo.push(Kw[(rd + Ik[0]) % pj]);
                    rd += 1;
                  }
                  var Mr = Bo;
                  var n2 = Mr.length;
                  var JI = Ik["slice"](1, 17).length;
                  var l8 = [];
                  var tc = 0;
                  while (tc < n2) {
                    var FM = Mr[tc];
                    var up = Ik["slice"](1, 17)[tc % JI] & 127;
                    l8.push((FM + up) % 256 ^ 128);
                    tc += 1;
                  }
                  var J7 = l8;
                  var yk = J7.length;
                  var cF = Ik["slice"](17, 46).length;
                  var Of = [];
                  var Nv = 113;
                  var Zb = 0;
                  while (Zb < yk) {
                    var pU = J7[Zb];
                    var GU = Ik["slice"](17, 46)[Zb % cF];
                    var F_ = pU ^ GU ^ Nv;
                    Of.push(F_);
                    Nv = F_;
                    Zb += 1;
                  }
                  var Tm = Of;
                  var zH = Tm.length;
                  var Rd = Ik["slice"](46, 70).length;
                  var uJ = [];
                  var ks = 0;
                  while (ks < zH) {
                    var sP = Tm[ks];
                    var QA = Ik["slice"](46, 70)[ks % Rd] & 127;
                    uJ.push((sP + QA) % 256 ^ 128);
                    ks += 1;
                  }
                  var GF = uJ;
                  var At = [];
                  for (var hY in GF) {
                    var Bs = GF[hY];
                    if (GF.hasOwnProperty(hY)) {
                      var rS = String.fromCharCode(Bs);
                      At.push(rS);
                    }
                  }
                  var lo = btoa(At.join(""));
                  (function (vn) {
                    if (vn !== undefined) {
                      Hc["YbHcACi/KVjWGUmTbgk[(M,j_u)V-/LG[Ug+WWKQG(,="] = vn;
                    }
                  })(lo);
                } catch (Xu) {}
                try {
                  var IN = b5(215464049, Yn);
                  var st = [];
                  var EY = 0;
                  while (EY < 71) {
                    st.push(IN() & 255);
                    EY += 1;
                  }
                  var uv = st;
                  var U7 = uv;
                  var UX = BI["name"]["slice"](-21)["replace"](jR, "$1" + CE)["replace"](Rf, CE + "$1");
                  var FN = JSON.stringify(UX, function (q5, HM) {
                    return HM === undefined ? null : HM;
                  });
                  var Lf = FN.replace(uY, ji);
                  var m0 = [];
                  var T3 = 0;
                  while (T3 < Lf.length) {
                    m0.push(Lf.charCodeAt(T3));
                    T3 += 1;
                  }
                  var zV = m0;
                  var K1 = zV;
                  var Ki = K1.length;
                  var ET = [];
                  var EM = 0;
                  while (EM < Ki) {
                    ET.push(K1[(EM + U7[0]) % Ki]);
                    EM += 1;
                  }
                  var o3 = ET;
                  var eu = o3.length;
                  var F1 = U7["slice"](1, 17).length;
                  var eI = [];
                  var k5 = 0;
                  while (k5 < eu) {
                    var BJ = o3[k5];
                    var Go = U7["slice"](1, 17)[k5 % F1] & 127;
                    eI.push((BJ + Go) % 256 ^ 128);
                    k5 += 1;
                  }
                  var Zr = eI;
                  var Xo = Zr.length;
                  var Ou = U7["slice"](17, 46).length;
                  var Z0 = [];
                  var nF = 113;
                  var Zy = 0;
                  while (Zy < Xo) {
                    var ts = Zr[Zy];
                    var mW = U7["slice"](17, 46)[Zy % Ou];
                    var Fq = ts ^ mW ^ nF;
                    Z0.push(Fq);
                    nF = Fq;
                    Zy += 1;
                  }
                  var Z6 = Z0;
                  var Ec = Z6.length;
                  var fd = U7["slice"](46, 70).length;
                  var bK = [];
                  var Ew = 0;
                  while (Ew < Ec) {
                    var NC = Z6[Ew];
                    var eW = U7["slice"](46, 70)[Ew % fd] & 127;
                    bK.push((NC + eW) % 256 ^ 128);
                    Ew += 1;
                  }
                  var YM = bK;
                  var aJ = [];
                  for (var Uy in YM) {
                    var hJ = YM[Uy];
                    if (YM.hasOwnProperty(Uy)) {
                      var Y1 = String.fromCharCode(hJ);
                      aJ.push(Y1);
                    }
                  }
                  var FO = btoa(aJ.join(""));
                  (function (eh) {
                    if (eh !== undefined) {
                      Hc["abnIFC&fV/I="] = eh;
                    }
                  })(FO);
                } catch (al) {}
              }
              var qg = b5(215464049, Yn);
              var Hw = [];
              var SM = 0;
              while (SM < 71) {
                Hw.push(qg() & 255);
                SM += 1;
              }
              var h0 = Hw;
              var zD = h0;
              var QJ = JSON.stringify(Hc, function (RR, Wj) {
                return Wj === undefined ? null : Wj;
              });
              var eN = QJ.replace(uY, ji);
              var ho = [];
              var zZ = 0;
              while (zZ < eN.length) {
                ho.push(eN.charCodeAt(zZ));
                zZ += 1;
              }
              var qp = ho;
              var du = qp;
              var aY = du.length;
              var vR = [];
              var Zk = 0;
              while (Zk < aY) {
                vR.push(du[(Zk + zD[0]) % aY]);
                Zk += 1;
              }
              var jO = vR;
              var Cf = jO.length;
              var iJ = zD["slice"](1, 17).length;
              var fL = [];
              var fj = 0;
              while (fj < Cf) {
                var Kh = jO[fj];
                var ef = zD["slice"](1, 17)[fj % iJ] & 127;
                fL.push((Kh + ef) % 256 ^ 128);
                fj += 1;
              }
              var N9 = fL;
              var ZQ = N9.length;
              var oF = zD["slice"](17, 46).length;
              var zy = [];
              var bO = 113;
              var xu = 0;
              while (xu < ZQ) {
                var qN = N9[xu];
                var pv = zD["slice"](17, 46)[xu % oF];
                var nN = qN ^ pv ^ bO;
                zy.push(nN);
                bO = nN;
                xu += 1;
              }
              var mJ = zy;
              var AC = mJ.length;
              var WZ = zD["slice"](46, 70).length;
              var Sh = [];
              var Sn = 0;
              while (Sn < AC) {
                var HA = mJ[Sn];
                var Cz = zD["slice"](46, 70)[Sn % WZ] & 127;
                Sh.push((HA + Cz) % 256 ^ 128);
                Sn += 1;
              }
              var A9 = Sh;
              var Xj = [];
              for (var Ms in A9) {
                var dK = A9[Ms];
                if (A9.hasOwnProperty(Ms)) {
                  var BX = String.fromCharCode(dK);
                  Xj.push(BX);
                }
              }
              var cd = btoa(Xj.join(""));
              return cd;
            }
            var nJ = {};
            var fM = [];
            var f9 = [];
            f9["push"](function () {
              var P6 = 5;
              var Bi = {};
              var Vc = 0;
              Bi["ZrbMEDqtLVzSHUedZwAVz+cK+)Yutapt"] = [];
              var XB = undefined;
              var iV = function (cb) {
                (function (NF, CK) {
                  var Aj = {};
                  if (!NF) {
                    NF = {};
                  }
                  (function (xG) {
                    if (xG !== undefined) {
                      Aj["caHKFi/dSO_="] = xG;
                    }
                  })(NF["type"]);
                  (function (cr) {
                    if (cr !== undefined) {
                      Aj["ePSGqpc!qP$f!ob[Gre-*tiWfkQ="] = cr;
                    }
                  })(NF["timeStamp"]);
                  (function (m3) {
                    if (m3 !== undefined) {
                      Aj["fKzdATivI$LvIHymV+nW!A=="] = m3;
                    }
                  })(NF["clientX"]);
                  (function (zN) {
                    if (zN !== undefined) {
                      Aj["fKzdATivI$LvIHymVujX!Q=="] = zN;
                    }
                  })(NF["clientY"]);
                  (function (uo) {
                    if (uo !== undefined) {
                      Aj["ZrbMECm+KVjqJWmzQvzD)Q=="] = uo;
                    }
                  })(NF["screenX"]);
                  (function (xp) {
                    if (xp !== undefined) {
                      Aj["ZrbMECm+KVjqJWmzQ/&C)A=="] = xp;
                    }
                  })(NF["screenY"]);
                  var yb = b5(1650762707, Yn);
                  var w_ = [];
                  var gF = 0;
                  while (gF < 2) {
                    w_.push(yb() & 255);
                    gF += 1;
                  }
                  var qv = w_;
                  var LL = qv;
                  var Z4 = JSON.stringify(Aj, function (wm, i2) {
                    return i2 === undefined ? null : i2;
                  });
                  var Y7 = Z4.replace(uY, ji);
                  var YK = [];
                  var e5 = 0;
                  while (e5 < Y7.length) {
                    YK.push(Y7.charCodeAt(e5));
                    e5 += 1;
                  }
                  var Wu = YK;
                  var YR = Wu;
                  var aN = [];
                  for (var sa in YR) {
                    var Ti = YR[sa];
                    if (YR.hasOwnProperty(sa)) {
                      aN.push(Ti);
                    }
                  }
                  var hQ = aN;
                  var UD = hQ;
                  var k9 = UD.length;
                  var TH = 0;
                  while (TH + 1 < k9) {
                    var gi = UD[TH];
                    UD[TH] = UD[TH + 1];
                    UD[TH + 1] = gi;
                    TH += 2;
                  }
                  var ig = UD;
                  var l6 = ig.length;
                  var Q2 = LL[0] % 7 + 1;
                  var g5 = [];
                  var cS = 0;
                  while (cS < l6) {
                    g5.push((ig[cS] << Q2 | ig[cS] >> 8 - Q2) & 255);
                    cS += 1;
                  }
                  var w2 = g5;
                  var lQ = [];
                  for (var ZO in w2) {
                    var Ig = w2[ZO];
                    if (w2.hasOwnProperty(ZO)) {
                      var zI = String.fromCharCode(Ig);
                      lQ.push(zI);
                    }
                  }
                  var Er = btoa(lQ.join(""));
                  var BQ = Er;
                  Bi["ZrbMEDqtLVzSHUedZwAVz+cK+)Yutapt"]["push"](BQ);
                  Vc += 1;
                  if (Vc >= P6) {
                    CK["abort"]();
                  }
                })(cb, XB);
              };
              XB = {};
              XB["abort"] = function () {
                var kJ = [];
                for (var XC in ["dblclick", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseout", "mouseover", "mouseup"]) {
                  var Uz = ["dblclick", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseout", "mouseover", "mouseup"][XC];
                  if (["dblclick", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseout", "mouseover", "mouseup"].hasOwnProperty(XC)) {
                    kJ["push"](function (dC) {
                      s9["removeEventListener"](dC, iV);
                    }(Uz));
                  }
                }
                var U1 = kJ;
                U1;
              };
              var S6 = [];
              for (var b9 in ["dblclick", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseout", "mouseover", "mouseup"]) {
                var ED = ["dblclick", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseout", "mouseover", "mouseup"][b9];
                if (["dblclick", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseout", "mouseover", "mouseup"].hasOwnProperty(b9)) {
                  S6["push"](function (sx) {
                    s9["addEventListener"](sx, iV);
                  }(ED));
                }
              }
              var tu = S6;
              tu;
              var G1 = XB;
              var RB = G1;
              fM["push"](RB);
              var Ux = [];
              Ux["Z+aNa[g*vBmtQBgf+HBx/*BtkoRs*/k+L/+DX&bh"] = [];
              var Ef = undefined;
              var zW = function (xR) {
                (function (pS, d7) {
                  if (!pS) {
                    pS = {};
                  }
                  var P7 = pS["changedTouches"] || [];
                  if (P7["length"] === 0) {
                    var UV = {};
                    (function (Zd) {
                      if (Zd !== undefined) {
                        UV["caHKFi/dSO_="] = Zd;
                      }
                    })(pS["type"]);
                    (function (jj) {
                      if (jj !== undefined) {
                        UV["ePSGqpc!qP$f!ob[Gre-*tiWfkQ="] = jj;
                      }
                    })(pS["timeStamp"]);
                    var Mu = b5(8280770, Yn);
                    var sT = [];
                    var vg = 0;
                    while (vg < 2) {
                      sT.push(Mu() & 255);
                      vg += 1;
                    }
                    var x1 = sT;
                    var AT = x1;
                    var Bx = JSON.stringify(UV, function (Wm, k_) {
                      return k_ === undefined ? null : k_;
                    });
                    var Vk = Bx.replace(uY, ji);
                    var or = [];
                    var PW = 0;
                    while (PW < Vk.length) {
                      or.push(Vk.charCodeAt(PW));
                      PW += 1;
                    }
                    var uU = or;
                    var Zn = uU;
                    var H_ = [];
                    for (var TE in Zn) {
                      var ZR = Zn[TE];
                      if (Zn.hasOwnProperty(TE)) {
                        H_.push(ZR);
                      }
                    }
                    var dp = H_;
                    var vB = dp;
                    var ic = vB.length;
                    var ov = 0;
                    while (ov + 1 < ic) {
                      var fh = vB[ov];
                      vB[ov] = vB[ov + 1];
                      vB[ov + 1] = fh;
                      ov += 2;
                    }
                    var lc = vB;
                    var fP = lc.length;
                    var CJ = AT[0] % 7 + 1;
                    var Li = [];
                    var KH = 0;
                    while (KH < fP) {
                      Li.push((lc[KH] << CJ | lc[KH] >> 8 - CJ) & 255);
                      KH += 1;
                    }
                    var yQ = Li;
                    var dP = [];
                    for (var Kg in yQ) {
                      var mN = yQ[Kg];
                      if (yQ.hasOwnProperty(Kg)) {
                        dP.push(mN);
                      }
                    }
                    var Hh = dP;
                    var Bf = Hh;
                    var hP = Bf.length;
                    var sq = 0;
                    while (sq + 1 < hP) {
                      var rL = Bf[sq];
                      Bf[sq] = Bf[sq + 1];
                      Bf[sq + 1] = rL;
                      sq += 2;
                    }
                    var OO = Bf;
                    var JH = [];
                    for (var Ty in OO) {
                      var Jp = OO[Ty];
                      if (OO.hasOwnProperty(Ty)) {
                        var Vr = String.fromCharCode(Jp);
                        JH.push(Vr);
                      }
                    }
                    var a6 = btoa(JH.join(""));
                    var gj = a6;
                    Ux["Z+aNa[g*vBmtQBgf+HBx/*BtkoRs*/k+L/+DX&bh"]["push"](gj);
                  } else {
                    for (var Io in P7) {
                      var y8 = P7[Io];
                      if (P7.hasOwnProperty(Io)) {
                        var bU = {};
                        (function (TA) {
                          if (TA !== undefined) {
                            bU["caHKFi/dSO_="] = TA;
                          }
                        })(pS["type"]);
                        (function (li) {
                          if (li !== undefined) {
                            bU["ePSGqpc!qP$f!ob[Gre-*tiWfkQ="] = li;
                          }
                        })(pS["timeStamp"]);
                        (function (Mc) {
                          if (Mc !== undefined) {
                            bU["evaMoJU(uO$V(KfXMJ[Y$Pe!THY="] = Mc;
                          }
                        })(y8["identifier"]);
                        (function (bE) {
                          if (bE !== undefined) {
                            bU["fKzdATivI$LvIHymV+nW!A=="] = bE;
                          }
                        })(y8["clientX"]);
                        (function (LP) {
                          if (LP !== undefined) {
                            bU["fKzdATivI$LvIHymVujX!Q=="] = LP;
                          }
                        })(y8["clientY"]);
                        (function (H2) {
                          if (H2 !== undefined) {
                            bU["ZrbMECm+KVjqJWmzQvzD)Q=="] = H2;
                          }
                        })(y8["screenX"]);
                        (function (dQ) {
                          if (dQ !== undefined) {
                            bU["ZrbMECm+KVjqJWmzQ/&C)A=="] = dQ;
                          }
                        })(y8["screenY"]);
                        (function (FG) {
                          if (FG !== undefined) {
                            bU["e-vBHSi/Pk//MH[nVujX!Q=="] = FG;
                          }
                        })(y8["radiusX"]);
                        (function (mq) {
                          if (mq !== undefined) {
                            bU["e-vBHSi/Pk//MH[nV+nW!A=="] = mq;
                          }
                        })(y8["radiusY"]);
                        (function (Dw) {
                          if (Dw !== undefined) {
                            bU["YTRfm-Yuv/VL)r/oBLq[hKRvnb*Fu,+cixRkNg=="] = Dw;
                          }
                        })(y8["rotationAngle"]);
                        (function (jd) {
                          if (jd !== undefined) {
                            bU["beGdsZ)xu+!Z,A=="] = jd;
                          }
                        })(y8["force"]);
                        var HI = b5(8280770, Yn);
                        var W5 = [];
                        var mI = 0;
                        while (mI < 2) {
                          W5.push(HI() & 255);
                          mI += 1;
                        }
                        var wJ = W5;
                        var OB = wJ;
                        var DG = JSON.stringify(bU, function (BA, eM) {
                          return eM === undefined ? null : eM;
                        });
                        var oV = DG.replace(uY, ji);
                        var Vi = [];
                        var hT = 0;
                        while (hT < oV.length) {
                          Vi.push(oV.charCodeAt(hT));
                          hT += 1;
                        }
                        var er = Vi;
                        var qS = er;
                        var Nz = [];
                        for (var Eu in qS) {
                          var F3 = qS[Eu];
                          if (qS.hasOwnProperty(Eu)) {
                            Nz.push(F3);
                          }
                        }
                        var Un = Nz;
                        var Pf = Un;
                        var ss = Pf.length;
                        var xz = 0;
                        while (xz + 1 < ss) {
                          var nM = Pf[xz];
                          Pf[xz] = Pf[xz + 1];
                          Pf[xz + 1] = nM;
                          xz += 2;
                        }
                        var Mz = Pf;
                        var Bw = Mz.length;
                        var bs = OB[0] % 7 + 1;
                        var Ll = [];
                        var CX = 0;
                        while (CX < Bw) {
                          Ll.push((Mz[CX] << bs | Mz[CX] >> 8 - bs) & 255);
                          CX += 1;
                        }
                        var cM = Ll;
                        var sj = [];
                        for (var O_ in cM) {
                          var Ku = cM[O_];
                          if (cM.hasOwnProperty(O_)) {
                            sj.push(Ku);
                          }
                        }
                        var GG = sj;
                        var IJ = GG;
                        var ml = IJ.length;
                        var zk = 0;
                        while (zk + 1 < ml) {
                          var oy = IJ[zk];
                          IJ[zk] = IJ[zk + 1];
                          IJ[zk + 1] = oy;
                          zk += 2;
                        }
                        var HV = IJ;
                        var Yz = [];
                        for (var QD in HV) {
                          var xI = HV[QD];
                          if (HV.hasOwnProperty(QD)) {
                            var yK = String.fromCharCode(xI);
                            Yz.push(yK);
                          }
                        }
                        var Zi = btoa(Yz.join(""));
                        var w5 = Zi;
                        Ux["Z+aNa[g*vBmtQBgf+HBx/*BtkoRs*/k+L/+DX&bh"]["push"](w5);
                      }
                    }
                  }
                })(xR, Ef);
              };
              Ef = {};
              Ef["abort"] = function () {
                var kN = [];
                for (var XP in ["touchstart", "touchmove", "touchend", "touchcancel"]) {
                  var e7 = ["touchstart", "touchmove", "touchend", "touchcancel"][XP];
                  if (["touchstart", "touchmove", "touchend", "touchcancel"].hasOwnProperty(XP)) {
                    kN["push"](function (vW) {
                      s9["removeEventListener"](vW, zW);
                    }(e7));
                  }
                }
                var gg = kN;
                gg;
              };
              var gV = [];
              for (var m2 in ["touchstart", "touchmove", "touchend", "touchcancel"]) {
                var ne = ["touchstart", "touchmove", "touchend", "touchcancel"][m2];
                if (["touchstart", "touchmove", "touchend", "touchcancel"].hasOwnProperty(m2)) {
                  gV["push"](function (vK) {
                    s9["addEventListener"](vK, zW);
                  }(ne));
                }
              }
              var Dv = gV;
              Dv;
              var wT = Ef;
              var Ht = wT;
              fM["push"](Ht);
              Bi["Z+aNa[g*vBmtQBgf+HBx/*BtkoRs*/k+L/+DX&bh"] = Ux;
              var qy = Bi;
              nJ.arrKPwoh = qy;
            });
            f9["push"](function () {
              var M5 = {};
              try {
                var BE = undefined;
                var vx = function (BY) {
                  (function (wH, IB) {
                    if (!DY) {
                      var PF = window;
                      LX += 1;
                      var B2 = PF["setTimeout"](function () {
                        if (!DY) {
                          var DJ = window;
                          LX += 1;
                          var VC = DJ["setTimeout"](function () {
                            if (!DY) {
                              Kx(fM, function (e2) {
                                M5["abnBHSSzOkvjP[PH"] = e2;
                                IB["abort"]();
                              });
                            }
                          }, (LX - 1) * 200);
                          var Rw = {};
                          Rw["abort"] = function () {
                            DJ["clearTimeout"](VC);
                          };
                          fM["push"](Rw);
                          var iY = A0(DJ);
                          if (iY) {
                            Rw["abort"]();
                            DY = true;
                            (function (V_) {
                              M5["abnBHSSzOkvjP[PH"] = V_;
                              IB["abort"]();
                            })(iY);
                          }
                        }
                      }, (LX - 1) * 200);
                      var g9 = {};
                      g9["abort"] = function () {
                        PF["clearTimeout"](B2);
                      };
                      fM["push"](g9);
                      var Ul = A0(PF);
                      if (Ul) {
                        g9["abort"]();
                        DY = true;
                        (function (y0) {
                          M5["abnBHSSzOkvjP[PH"] = y0;
                          IB["abort"]();
                        })(Ul);
                      }
                    }
                  })(BY, BE);
                };
                BE = {};
                BE["abort"] = function () {
                  var kc = [];
                  for (var xi in ["driver-evaluate", "webdriver-evaluate", "selenium-evaluate"]) {
                    var S4 = ["driver-evaluate", "webdriver-evaluate", "selenium-evaluate"][xi];
                    if (["driver-evaluate", "webdriver-evaluate", "selenium-evaluate"].hasOwnProperty(xi)) {
                      kc["push"](function (r1) {
                        s9["removeEventListener"](r1, vx);
                      }(S4));
                    }
                  }
                  var ao = kc;
                  ao;
                };
                var hL = [];
                for (var oa in ["driver-evaluate", "webdriver-evaluate", "selenium-evaluate"]) {
                  var OP = ["driver-evaluate", "webdriver-evaluate", "selenium-evaluate"][oa];
                  if (["driver-evaluate", "webdriver-evaluate", "selenium-evaluate"].hasOwnProperty(oa)) {
                    hL["push"](function (Dj) {
                      s9["addEventListener"](Dj, vx);
                    }(OP));
                  }
                }
                var vr = hL;
                vr;
                var cK = BE;
                fM["push"](cK);
                var jL = window;
                LX += 1;
                var B9 = jL["setTimeout"](function () {
                  if (!DY) {
                    var hl = window;
                    LX += 1;
                    var lR = hl["setTimeout"](function () {
                      if (!DY) {
                        Kx(fM, function (Pv) {
                          M5["abnBHSSzOkvjP[PH"] = Pv;
                        });
                      }
                    }, (LX - 1) * 200);
                    var pJ = {};
                    pJ["abort"] = function () {
                      hl["clearTimeout"](lR);
                    };
                    fM["push"](pJ);
                    var Ze = A0(hl);
                    if (Ze) {
                      pJ["abort"]();
                      DY = true;
                      (function (Ek) {
                        M5["abnBHSSzOkvjP[PH"] = Ek;
                      })(Ze);
                    }
                  }
                }, (LX - 1) * 200);
                var f4 = {};
                f4["abort"] = function () {
                  jL["clearTimeout"](B9);
                };
                fM["push"](f4);
                var YC = A0(jL);
                if (YC) {
                  f4["abort"]();
                  DY = true;
                  (function (LG) {
                    M5["abnBHSSzOkvjP[PH"] = LG;
                  })(YC);
                }
              } catch (aH) {}
              var Gf = M5;
              nJ["ZuqatoMtvOlZ,LLCJImd_eOtUGo="] = Gf;
            });
            f9["push"](function () {
              nJ["bO[bfX,ruh+gTQcA!m!t,)d-h!Fi+eEmPu-ZRUbR"] = ih;
              var XZ = b5(2328399149, Yn);
              var LF = [];
              var X7 = 0;
              while (X7 < 32) {
                LF.push(XZ() & 255);
                X7 += 1;
              }
              var RA = LF;
              var Qt = RA;
              var tn = JSON.stringify(BD, function (dB, XS) {
                return XS === undefined ? null : XS;
              });
              var oN = tn.replace(uY, ji);
              var xF = [];
              var la = 0;
              while (la < oN.length) {
                xF.push(oN.charCodeAt(la));
                la += 1;
              }
              var qh = xF;
              var hg = qh;
              var rV = hg.length;
              var Ol = [];
              var Og = rV - 1;
              while (Og >= 0) {
                Ol.push(hg[Og]);
                Og -= 1;
              }
              var h_ = Ol;
              var bu = h_.length;
              var EQ = Qt[0] % 7 + 1;
              var cc = [];
              var JB = 0;
              while (JB < bu) {
                cc.push((h_[JB] << EQ | h_[JB] >> 8 - EQ) & 255);
                JB += 1;
              }
              var n8 = cc;
              var PK = n8.length;
              var PU = Qt["slice"](1, 31).length;
              var Yp = [];
              var wg = 0;
              while (wg < PK) {
                var mw = n8[wg];
                var ev = Qt["slice"](1, 31)[wg % PU] & 127;
                Yp.push((mw + ev) % 256 ^ 128);
                wg += 1;
              }
              var zO = Yp;
              var t9 = [];
              for (var be in zO) {
                var bI = zO[be];
                if (zO.hasOwnProperty(be)) {
                  var JJ = String.fromCharCode(bI);
                  t9.push(JJ);
                }
              }
              var yB = btoa(t9.join(""));
              nJ["eC$f*s)UhZw!-LbYJZs="] = yB;
              var Gv = b5(3633092690, Yn);
              var GR = [];
              var go = 0;
              while (go < 33) {
                GR.push(Gv() & 255);
                go += 1;
              }
              var Vf = GR;
              var Kd = Vf;
              var T8 = JSON.stringify(Q6, function (WM, ck) {
                return ck === undefined ? null : ck;
              });
              var it = T8.replace(uY, ji);
              var z2 = [];
              var rN = 0;
              while (rN < it.length) {
                z2.push(it.charCodeAt(rN));
                rN += 1;
              }
              var sF = z2;
              var pg = sF;
              var GL = pg.length;
              var OE = Kd["slice"](0, 31).length;
              var e3 = [];
              var sz = 113;
              var eZ = 0;
              while (eZ < GL) {
                var A1 = pg[eZ];
                var dw = Kd["slice"](0, 31)[eZ % OE];
                var iq = A1 ^ dw ^ sz;
                e3.push(iq);
                sz = iq;
                eZ += 1;
              }
              var Id = e3;
              var mP = Id.length;
              var pp = [];
              var xN = mP - 1;
              while (xN >= 0) {
                pp.push(Id[xN]);
                xN -= 1;
              }
              var qn = pp;
              var nu = qn.length;
              var F9 = Kd[31] % 7 + 1;
              var mT = [];
              var FR = 0;
              while (FR < nu) {
                mT.push((qn[FR] << F9 | qn[FR] >> 8 - F9) & 255);
                FR += 1;
              }
              var aM = mT;
              var sU = [];
              for (var e_ in aM) {
                var Jv = aM[e_];
                if (aM.hasOwnProperty(e_)) {
                  var fi = String.fromCharCode(Jv);
                  sU.push(fi);
                }
              }
              var vV = btoa(sU.join(""));
              nJ["YbHaBgWSE[LSHU[XchUq)MMuwv)N)+rexFU!XmeVHbg="] = vV;
              var lD = b5(936215363, Yn);
              var En = [];
              var Lr = 0;
              while (Lr < 24) {
                En.push(lD() & 255);
                Lr += 1;
              }
              var g2 = En;
              var ow = g2;
              var oz = JSON.stringify(PX, function (kI, C7) {
                return C7 === undefined ? null : C7;
              });
              var JE = oz.replace(uY, ji);
              var IZ = [];
              var Rn = 0;
              while (Rn < JE.length) {
                IZ.push(JE.charCodeAt(Rn));
                Rn += 1;
              }
              var gH = IZ;
              var m_ = gH;
              var jI = m_.length;
              var Bd = [];
              var MY = jI - 1;
              while (MY >= 0) {
                Bd.push(m_[MY]);
                MY -= 1;
              }
              var aF = Bd;
              var HR = aF.length;
              var Kz = ow["slice"](0, 23).length;
              var Cy = [];
              var xC = 113;
              var AP = 0;
              while (AP < HR) {
                var A2 = aF[AP];
                var vZ = ow["slice"](0, 23)[AP % Kz];
                var H4 = A2 ^ vZ ^ xC;
                Cy.push(H4);
                xC = H4;
                AP += 1;
              }
              var db = Cy;
              var M_ = [];
              for (var sN in db) {
                var iP = db[sN];
                if (db.hasOwnProperty(sN)) {
                  var sW = String.fromCharCode(iP);
                  M_.push(sW);
                }
              }
              var MR = btoa(M_.join(""));
              nJ["a+qGYEi-MZQwsOC_XoW-XHXxAq!cHgEuNsC,e_jfSB-*fCbJNIKMroCnZG+Awtmbiy!D_w=="] = MR;
              var F4 = b5(2069598282, Yn);
              var ug = [];
              var NP = 0;
              while (NP < 21) {
                ug.push(F4() & 255);
                NP += 1;
              }
              var k7 = ug;
              var wF = k7;
              var H8 = JSON.stringify(gh, function (tL, Qz) {
                return Qz === undefined ? null : Qz;
              });
              var m4 = H8.replace(uY, ji);
              var rW = [];
              var Qj = 0;
              while (Qj < m4.length) {
                rW.push(m4.charCodeAt(Qj));
                Qj += 1;
              }
              var sb = rW;
              var Xe = sb;
              var CB = Xe.length;
              var KE = [];
              var b0 = 0;
              while (b0 < CB) {
                KE.push(Xe[(b0 + wF[0]) % CB]);
                b0 += 1;
              }
              var fc = KE;
              var md = fc.length;
              var FL = wF[1] % 7 + 1;
              var mp = [];
              var kG = 0;
              while (kG < md) {
                mp.push((fc[kG] << FL | fc[kG] >> 8 - FL) & 255);
                kG += 1;
              }
              var ws = mp;
              var Zs = ws.length;
              var RT = wF[2] % 7 + 1;
              var wo = [];
              var v4 = 0;
              while (v4 < Zs) {
                wo.push((ws[v4] << RT | ws[v4] >> 8 - RT) & 255);
                v4 += 1;
              }
              var OQ = wo;
              var Ys = OQ.length;
              var Mw = wF["slice"](3, 20).length;
              var R3 = [];
              var Q1 = 0;
              while (Q1 < Ys) {
                R3.push(OQ[Q1]);
                R3.push(wF["slice"](3, 20)[Q1 % Mw]);
                Q1 += 1;
              }
              var Pe = R3;
              var zX = [];
              for (var cN in Pe) {
                var l1 = Pe[cN];
                if (Pe.hasOwnProperty(cN)) {
                  var HB = String.fromCharCode(l1);
                  zX.push(HB);
                }
              }
              var M2 = btoa(zX.join(""));
              nJ["e/+UYVN,-Mh[g*/HEaKmXnhIu[meNABkadO)LBnBVjeFyw=="] = M2;
              var nP = b5(107488850, Yn);
              var yI = [];
              var jv = 0;
              while (jv < 46) {
                yI.push(nP() & 255);
                jv += 1;
              }
              var Es = yI;
              var DN = Es;
              var FH = JSON.stringify(yf, function (Ma, GQ) {
                return GQ === undefined ? null : GQ;
              });
              var bV = FH.replace(uY, ji);
              var fo = [];
              var Cp = 0;
              while (Cp < bV.length) {
                fo.push(bV.charCodeAt(Cp));
                Cp += 1;
              }
              var Kn = fo;
              var Vt = Kn;
              var nH = Vt.length;
              var wP = DN[0] % 7 + 1;
              var wY = [];
              var uu = 0;
              while (uu < nH) {
                wY.push((Vt[uu] << wP | Vt[uu] >> 8 - wP) & 255);
                uu += 1;
              }
              var aZ = wY;
              var yl = aZ.length;
              var en = DN["slice"](1, 20).length;
              var n_ = [];
              var Uj = 0;
              while (Uj < yl) {
                n_.push(aZ[Uj]);
                n_.push(DN["slice"](1, 20)[Uj % en]);
                Uj += 1;
              }
              var q_ = n_;
              var ul = q_.length;
              var xo = [];
              var w6 = 0;
              while (w6 < ul) {
                xo.push(q_[(w6 + DN[20]) % ul]);
                w6 += 1;
              }
              var Dr = xo;
              var NL = Dr.length;
              var yy = DN["slice"](21, 45).length;
              var Sb = [];
              var BH = 0;
              while (BH < NL) {
                var DK = Dr[BH];
                var Tu = DN["slice"](21, 45)[BH % yy] & 127;
                Sb.push((DK + Tu) % 256 ^ 128);
                BH += 1;
              }
              var HL = Sb;
              var N5 = [];
              for (var nV in HL) {
                var E6 = HL[nV];
                if (HL.hasOwnProperty(nV)) {
                  var Ny = String.fromCharCode(E6);
                  N5.push(Ny);
                }
              }
              var xQ = btoa(N5.join(""));
              nJ["a(vFGSewOUj$OmS+VDMM$v_Q(dAp$*Pn)mMbfFOhL,o="] = xQ;
            });
            f9["push"](function () {
              var W_ = [];
              for (var nb in i_) {
                try {
                  function dZ(sZ) {
                    return sZ === "value" || !!Jq["Object"]["getOwnPropertyDescriptor"](i_, nb)[sZ];
                  }
                  function KZ(PE) {
                    return PE[0] || "";
                  }
                  var iA = Jq["Object"]["getOwnPropertyDescriptor"](i_, nb) ? LA(Th(Object["keys"](Jq["Object"]["getOwnPropertyDescriptor"](i_, nb)), dZ), KZ)["join"]("") : "";
                  W_[W_["length"]] = [nb, iA];
                } catch (tS) {}
              }
              var K_ = W_;
              nJ["ey!UkKggmtBzyprNMJOS-)tUoWOOpa+xpvOfakRv!cVgldrCIpGDe$*v"] = K_;
            });
            f9["push"](function () {
              var Hu = i_["userAgent"];
              var h7 = 0;
              var dz = typeof Hu !== "string" ? "" + Hu : Hu;
              while (h7 < dz["length"]) {
                F7 = F7 >>> 8 ^ RE[(F7 ^ dz["charCodeAt"](h7)) & 255];
                h7 += 1;
              }
              var XW = Hu;
              nJ["fPCBrZQ-uO$d!IT_D-Kn-*+ReEI="] = XW;
              var qc = i_["language"];
              var rX = 0;
              var am = typeof qc !== "string" ? "" + qc : qc;
              while (rX < am["length"]) {
                F7 = F7 >>> 8 ^ RE[(F7 ^ am["charCodeAt"](rX)) & 255];
                rX += 1;
              }
              var lv = qc;
              nJ["abnTDzSjKFnpJnWvQ/&-yA=="] = lv;
              var gr = {};
              try {
                gr["fJX,Jx(xZIo_,K_Z,O()Fz*xmc,ll!Xu!WQY/tGEBKEU+ZmebuY="] = Object["getOwnPropertyDescriptor"](i_, "languages") !== undefined;
              } catch (VJ) {}
              try {
                (function (ha) {
                  if (ha !== undefined) {
                    gr["cf[Dr,EvuO$d!A=="] = ha;
                  }
                })(navigator["languages"]);
              } catch (to) {}
              var hU = gr;
              nJ["b+-feUQRmD[fQxm*U(GwckCy"] = hU;
              if (navigator["buildID"] !== undefined) {
                var wj = b5(1781229836, Yn);
                var Pp = [];
                var gR = 0;
                while (gR < 28) {
                  Pp.push(wj() & 255);
                  gR += 1;
                }
                var Lt = Pp;
                var Qk = Lt;
                var GA = JSON.stringify(navigator["buildID"], function (O8, bS) {
                  return bS === undefined ? null : bS;
                });
                var tw = GA.replace(uY, ji);
                var i9 = [];
                var L1 = 0;
                while (L1 < tw.length) {
                  i9.push(tw.charCodeAt(L1));
                  L1 += 1;
                }
                var Kk = i9;
                var Rs = Kk;
                var dm = Rs.length;
                var uH = Qk[0] % 7 + 1;
                var eJ = [];
                var ec = 0;
                while (ec < dm) {
                  eJ.push((Rs[ec] << uH | Rs[ec] >> 8 - uH) & 255);
                  ec += 1;
                }
                var Ob = eJ;
                var cC = Ob.length;
                var oL = Qk["slice"](1, 27).length;
                var SY = [];
                var Be = 0;
                while (Be < cC) {
                  var OS = Ob[Be];
                  var Jg = Qk["slice"](1, 27)[Be % oL] & 127;
                  SY.push((OS + Jg) % 256 ^ 128);
                  Be += 1;
                }
                var nj = SY;
                var Ps = [];
                for (var VA in nj) {
                  var I5 = nj[VA];
                  if (nj.hasOwnProperty(VA)) {
                    var nm = String.fromCharCode(I5);
                    Ps.push(nm);
                  }
                }
                var tC = btoa(Ps.join(""));
                nJ["V,f)IBCHC&reEUyWe)XM/g=="] = tC;
              }
              var K7 = b5(3591488435, Yn);
              var eF = [];
              var iu = 0;
              while (iu < 49) {
                eF.push(K7() & 255);
                iu += 1;
              }
              var XJ = eF;
              var Yt = XJ;
              ky["startInternal"]("ct");
              var xt = {};
              try {
                var Wa = b5(4293051610, Yn);
                var So = [];
                var hG = 0;
                while (hG < 53) {
                  So.push(Wa() & 255);
                  hG += 1;
                }
                var W8 = So;
                var D5 = W8;
                var wB = JSON.stringify(new Date()["getTime"]()["toString"](), function (KO, wf) {
                  return wf === undefined ? null : wf;
                });
                var Yh = wB.replace(uY, ji);
                var v1 = [];
                var X1 = 0;
                while (X1 < Yh.length) {
                  v1.push(Yh.charCodeAt(X1));
                  X1 += 1;
                }
                var LU = v1;
                var xb = LU;
                var gI = xb.length;
                var pK = D5["slice"](0, 31).length;
                var l3 = [];
                var PC = 0;
                while (PC < gI) {
                  l3.push(xb[PC]);
                  l3.push(D5["slice"](0, 31)[PC % pK]);
                  PC += 1;
                }
                var bn = l3;
                var Ud = bn.length;
                var T9 = D5["slice"](31, 52).length;
                var wb = [];
                var Xw = 113;
                var ww = 0;
                while (ww < Ud) {
                  var OF = bn[ww];
                  var eg = D5["slice"](31, 52)[ww % T9];
                  var Am = OF ^ eg ^ Xw;
                  wb.push(Am);
                  Xw = Am;
                  ww += 1;
                }
                var qD = wb;
                var gJ = qD.length;
                var pQ = [];
                var k6 = gJ - 1;
                while (k6 >= 0) {
                  pQ.push(qD[k6]);
                  k6 -= 1;
                }
                var LR = pQ;
                var Ta = [];
                for (var SQ in LR) {
                  var Uq = LR[SQ];
                  if (LR.hasOwnProperty(SQ)) {
                    var MB = String.fromCharCode(Uq);
                    Ta.push(MB);
                  }
                }
                var TT = btoa(Ta.join(""));
                (function (pW) {
                  if (pW !== undefined) {
                    xt["abnCHifVROE="] = pW;
                  }
                })(TT);
              } catch (eH) {}
              try {
                var Wx = b5(1624825960, Yn);
                var QP = [];
                var HW = 0;
                while (HW < 24) {
                  QP.push(Wx() & 255);
                  HW += 1;
                }
                var gk = QP;
                var sM = gk;
                var bz = JSON.stringify(new window["File"]([], "")["lastModified"]["toString"](), function (SS, tH) {
                  return tH === undefined ? null : tH;
                });
                var t4 = bz.replace(uY, ji);
                var k8 = [];
                var j5 = 0;
                while (j5 < t4.length) {
                  k8.push(t4.charCodeAt(j5));
                  j5 += 1;
                }
                var pZ = k8;
                var tU = pZ;
                var Eb = tU.length;
                var vs = [];
                var AJ = 0;
                while (AJ < Eb) {
                  vs.push(tU[(AJ + sM[0]) % Eb]);
                  AJ += 1;
                }
                var Df = vs;
                var KD = Df.length;
                var fv = sM["slice"](1, 21).length;
                var kw = [];
                var Fh = 0;
                while (Fh < KD) {
                  kw.push(Df[Fh]);
                  kw.push(sM["slice"](1, 21)[Fh % fv]);
                  Fh += 1;
                }
                var ST = kw;
                var yw = ST.length;
                var V7 = sM[21] % 7 + 1;
                var Ru = [];
                var A7 = 0;
                while (A7 < yw) {
                  Ru.push((ST[A7] << V7 | ST[A7] >> 8 - V7) & 255);
                  A7 += 1;
                }
                var W9 = Ru;
                var DW = W9.length;
                var F2 = [];
                var uI = 0;
                while (uI < DW) {
                  F2.push(W9[(uI + sM[22]) % DW]);
                  uI += 1;
                }
                var vF = F2;
                var x0 = [];
                for (var wM in vF) {
                  var CI = vF[wM];
                  if (vF.hasOwnProperty(wM)) {
                    var og = String.fromCharCode(CI);
                    x0.push(og);
                  }
                }
                var pR = btoa(x0.join(""));
                (function (y5) {
                  if (y5 !== undefined) {
                    xt["YbHIFC&fVvM="] = y5;
                  }
                })(pR);
              } catch (qa) {}
              try {
                var TV = b5(2781904740, Yn);
                var yU = [];
                var Ka = 0;
                while (Ka < 54) {
                  yU.push(TV() & 255);
                  Ka += 1;
                }
                var a5 = yU;
                var ob = a5;
                var U2 = JSON.stringify(performance["now"]()["toString"](), function (vu, u2) {
                  return u2 === undefined ? null : u2;
                });
                var Np = U2.replace(uY, ji);
                var cU = [];
                var Qm = 0;
                while (Qm < Np.length) {
                  cU.push(Np.charCodeAt(Qm));
                  Qm += 1;
                }
                var IE = cU;
                var vL = IE;
                var es = vL.length;
                var dA = ob["slice"](0, 24).length;
                var DA = [];
                var Me = 113;
                var nc = 0;
                while (nc < es) {
                  var K6 = vL[nc];
                  var ft = ob["slice"](0, 24)[nc % dA];
                  var hH = K6 ^ ft ^ Me;
                  DA.push(hH);
                  Me = hH;
                  nc += 1;
                }
                var z6 = DA;
                var a2 = z6.length;
                var AL = ob["slice"](24, 53).length;
                var CR = [];
                var lu = 0;
                while (lu < a2) {
                  CR.push(z6[lu]);
                  CR.push(ob["slice"](24, 53)[lu % AL]);
                  lu += 1;
                }
                var d0 = CR;
                var tz = [];
                for (var Zc in d0) {
                  var SO = d0[Zc];
                  if (d0.hasOwnProperty(Zc)) {
                    var EF = String.fromCharCode(SO);
                    tz.push(EF);
                  }
                }
                var qA = btoa(tz.join(""));
                (function (po) {
                  if (po !== undefined) {
                    xt["Z/iB_/&WVhu-HEY(_ba,DymXZgjhdw=="] = po;
                  }
                })(qA);
              } catch (hy) {}
              try {
                var dE = b5(3391494669, Yn);
                var qP = [];
                var mV = 0;
                while (mV < 27) {
                  qP.push(dE() & 255);
                  mV += 1;
                }
                var an = qP;
                var aU = an;
                var AM = JSON.stringify(new window["DocumentTimeline"]()["currentTime"]["toString"](), function (xX, w0) {
                  return w0 === undefined ? null : w0;
                });
                var nQ = AM.replace(uY, ji);
                var SI = [];
                var La = 0;
                while (La < nQ.length) {
                  SI.push(nQ.charCodeAt(La));
                  La += 1;
                }
                var Si = SI;
                var bQ = Si;
                var cy = bQ.length;
                var n3 = [];
                var bf = cy - 1;
                while (bf >= 0) {
                  n3.push(bQ[bf]);
                  bf -= 1;
                }
                var Qv = n3;
                var r4 = Qv.length;
                var uw = [];
                var Vg = 0;
                while (Vg < r4) {
                  uw.push(Qv[(Vg + aU[0]) % r4]);
                  Vg += 1;
                }
                var Kb = uw;
                var Vm = Kb.length;
                var hu = aU["slice"](1, 26).length;
                var XU = [];
                var Aw = 113;
                var Oi = 0;
                while (Oi < Vm) {
                  var af = Kb[Oi];
                  var kg = aU["slice"](1, 26)[Oi % hu];
                  var Ra = af ^ kg ^ Aw;
                  XU.push(Ra);
                  Aw = Ra;
                  Oi += 1;
                }
                var qT = XU;
                var r3 = [];
                for (var Ub in qT) {
                  var dd = qT[Ub];
                  if (qT.hasOwnProperty(Ub)) {
                    var mQ = String.fromCharCode(dd);
                    r3.push(mQ);
                  }
                }
                var hk = btoa(r3.join(""));
                (function (qr) {
                  if (qr !== undefined) {
                    xt["YbHCHiewOEnxPnWvQ/&zwQ=="] = qr;
                  }
                })(hk);
              } catch (NM) {}
              try {
                var Vw = b5(1887139459, Yn);
                var XY = [];
                var g_ = 0;
                while (g_ < 27) {
                  XY.push(Vw() & 255);
                  g_ += 1;
                }
                var UP = XY;
                var YA = UP;
                var pc = JSON.stringify(performance["timing"]["navigationStart"]["toString"](), function (y6, mA) {
                  return mA === undefined ? null : mA;
                });
                var w1 = pc.replace(uY, ji);
                var SZ = [];
                var sk = 0;
                while (sk < w1.length) {
                  SZ.push(w1.charCodeAt(sk));
                  sk += 1;
                }
                var Dt = SZ;
                var bc = Dt;
                var TO = bc.length;
                var Nn = YA[0] % 7 + 1;
                var Vd = [];
                var lW = 0;
                while (lW < TO) {
                  Vd.push((bc[lW] << Nn | bc[lW] >> 8 - Nn) & 255);
                  lW += 1;
                }
                var gP = Vd;
                var Cs = gP.length;
                var ya = YA["slice"](1, 26).length;
                var PI = [];
                var j3 = 113;
                var y3 = 0;
                while (y3 < Cs) {
                  var SF = gP[y3];
                  var Qf = YA["slice"](1, 26)[y3 % ya];
                  var kS = SF ^ Qf ^ j3;
                  PI.push(kS);
                  j3 = kS;
                  y3 += 1;
                }
                var T7 = PI;
                var Nc = [];
                for (var S0 in T7) {
                  var PS = T7[S0];
                  if (T7.hasOwnProperty(S0)) {
                    var wn = String.fromCharCode(PS);
                    Nc.push(wn);
                  }
                }
                var xK = btoa(Nc.join(""));
                (function (Ej) {
                  if (Ej !== undefined) {
                    xt["abnSDiG[DH&CDV[HZwAUzugF/sMxz*Lm/m)eeVGjNJE="] = Ej;
                  }
                })(xK);
              } catch (sV) {}
              ky["stopInternal"]("ct");
              var dg = xt;
              var jg = JSON.stringify(dg, function (zL, BP) {
                return BP === undefined ? null : BP;
              });
              var qw = jg.replace(uY, ji);
              var XA = [];
              var OU = 0;
              while (OU < qw.length) {
                XA.push(qw.charCodeAt(OU));
                OU += 1;
              }
              var Tt = XA;
              var P2 = Tt;
              var sY = P2.length;
              var wy = Yt[0] % 7 + 1;
              var H3 = [];
              var IF = 0;
              while (IF < sY) {
                H3.push((P2[IF] << wy | P2[IF] >> 8 - wy) & 255);
                IF += 1;
              }
              var X5 = H3;
              var CT = X5.length;
              var Ie = Yt["slice"](1, 23).length;
              var Kj = [];
              var PL = 0;
              while (PL < CT) {
                Kj.push(X5[PL]);
                Kj.push(Yt["slice"](1, 23)[PL % Ie]);
                PL += 1;
              }
              var Gt = Kj;
              var tA = Gt.length;
              var P8 = Yt["slice"](23, 48).length;
              var hv = [];
              var GE = 113;
              var DP = 0;
              while (DP < tA) {
                var Ut = Gt[DP];
                var sd = Yt["slice"](23, 48)[DP % P8];
                var UF = Ut ^ sd ^ GE;
                hv.push(UF);
                GE = UF;
                DP += 1;
              }
              var mn = hv;
              var m1 = [];
              for (var jr in mn) {
                var HD = mn[jr];
                if (mn.hasOwnProperty(jr)) {
                  var Le = String.fromCharCode(HD);
                  m1.push(Le);
                }
              }
              var vz = btoa(m1.join(""));
              nJ["YbHaBgWSA&LNAliCeR,M$uQJ*ss$rqhv"] = vz;
              var Wl = b5(3736749910, Yn);
              var SD = [];
              var Q5 = 0;
              while (Q5 < 2) {
                SD.push(Wl() & 255);
                Q5 += 1;
              }
              var fm = SD;
              var Sr = fm;
              var E4 = [];
              try {
                var f5 = i_["mimeTypes"];
                for (var JG in Jq["Object"]["getOwnPropertyNames"](f5)) {
                  var Sv = Jq["Object"]["getOwnPropertyNames"](f5)[JG];
                  if (Jq["Object"]["getOwnPropertyNames"](f5).hasOwnProperty(JG)) {
                    (function (c_) {
                      try {
                        var nZ = f5[c_];
                        var mk = {};
                        mk["cKDWCjCnJFXxPnKoUuzp[w=="] = nZ["suffixes"];
                        mk["caHKFi/dSO_="] = nZ["type"];
                        mk["bYT&DzrbWIMNCFkV*TE[-*kr[/oRl-MvMrbM)MCCBXnJzJ[)UMfCKQNNsOcSoA=="] = nZ["enabledPlugin"]["filename"];
                        var PB = b5(3736749910, Yn);
                        var Bt = [];
                        var gL = 0;
                        while (gL < 2) {
                          Bt.push(PB() & 255);
                          gL += 1;
                        }
                        var CL = Bt;
                        var jH = CL;
                        var ku = JSON.stringify(mk, function (lT, uE) {
                          return uE === undefined ? null : uE;
                        });
                        var xP = ku.replace(uY, ji);
                        var L6 = [];
                        var Pz = 0;
                        while (Pz < xP.length) {
                          L6.push(xP.charCodeAt(Pz));
                          Pz += 1;
                        }
                        var ZX = L6;
                        var Uv = ZX;
                        var AA = Uv.length;
                        var JT = [];
                        var FZ = AA - 1;
                        while (FZ >= 0) {
                          JT.push(Uv[FZ]);
                          FZ -= 1;
                        }
                        var T0 = JT;
                        var il = T0.length;
                        var q9 = jH[0] % 7 + 1;
                        var Tz = [];
                        var Nk = 0;
                        while (Nk < il) {
                          Tz.push((T0[Nk] << q9 | T0[Nk] >> 8 - q9) & 255);
                          Nk += 1;
                        }
                        var B7 = Tz;
                        var DZ = B7.length;
                        var vh = [];
                        var Qb = DZ - 1;
                        while (Qb >= 0) {
                          vh.push(B7[Qb]);
                          Qb -= 1;
                        }
                        var N1 = vh;
                        var oi = [];
                        for (var u9 in N1) {
                          var jP = N1[u9];
                          if (N1.hasOwnProperty(u9)) {
                            oi.push(jP);
                          }
                        }
                        var id = oi;
                        var fZ = id;
                        var FY = fZ.length;
                        var GN = 0;
                        while (GN + 1 < FY) {
                          var zA = fZ[GN];
                          fZ[GN] = fZ[GN + 1];
                          fZ[GN + 1] = zA;
                          GN += 2;
                        }
                        var Jy = fZ;
                        var n4 = [];
                        for (var kk in Jy) {
                          var da = Jy[kk];
                          if (Jy.hasOwnProperty(kk)) {
                            var r6 = String.fromCharCode(da);
                            n4.push(r6);
                          }
                        }
                        var Oa = btoa(n4.join(""));
                        E4[E4["length"]] = [c_, Oa];
                      } catch (uZ) {}
                    })(Sv);
                  }
                }
              } catch (i3) {}
              var QL = E4;
              var wD = JSON.stringify(QL, function (o4, bA) {
                return bA === undefined ? null : bA;
              });
              var IC = wD.replace(uY, ji);
              var gA = [];
              var I3 = 0;
              while (I3 < IC.length) {
                gA.push(IC.charCodeAt(I3));
                I3 += 1;
              }
              var uP = gA;
              var V0 = uP;
              var aA = V0.length;
              var WF = [];
              var CH = aA - 1;
              while (CH >= 0) {
                WF.push(V0[CH]);
                CH -= 1;
              }
              var E2 = WF;
              var p4 = E2.length;
              var fN = Sr[0] % 7 + 1;
              var m9 = [];
              var zJ = 0;
              while (zJ < p4) {
                m9.push((E2[zJ] << fN | E2[zJ] >> 8 - fN) & 255);
                zJ += 1;
              }
              var Db = m9;
              var z5 = Db.length;
              var GJ = [];
              var b1 = z5 - 1;
              while (b1 >= 0) {
                GJ.push(Db[b1]);
                b1 -= 1;
              }
              var EI = GJ;
              var WU = [];
              for (var zm in EI) {
                var A3 = EI[zm];
                if (EI.hasOwnProperty(zm)) {
                  WU.push(A3);
                }
              }
              var sp = WU;
              var oB = sp;
              var Fo = oB.length;
              var qC = 0;
              while (qC + 1 < Fo) {
                var VK = oB[qC];
                oB[qC] = oB[qC + 1];
                oB[qC + 1] = VK;
                qC += 2;
              }
              var wt = oB;
              var HQ = [];
              for (var bD in wt) {
                var Gm = wt[bD];
                if (wt.hasOwnProperty(bD)) {
                  var Gj = String.fromCharCode(Gm);
                  HQ.push(Gj);
                }
              }
              var ct = btoa(HQ.join(""));
              nJ["V-HMDzyrOmzcHUWqSvzqyO(JOzDYQ_[Kg$M$-cFW(J_p!rRujunkPg=="] = ct;
              var hK = b5(612538604, Yn);
              var QK = [];
              var pI = 0;
              while (pI < 38) {
                QK.push(hK() & 255);
                pI += 1;
              }
              var DU = QK;
              var K0 = DU;
              var X_ = {};
              var kh = 0;
              var S_ = typeof screen["width"] !== "string" ? "" + screen["width"] : screen["width"];
              while (kh < S_["length"]) {
                F7 = F7 >>> 8 ^ RE[(F7 ^ S_["charCodeAt"](kh)) & 255];
                kh += 1;
              }
              var V3 = screen["width"];
              X_["YOyHq!M*seRC+w=="] = V3;
              var LI = 0;
              var nC = typeof screen["height"] !== "string" ? "" + screen["height"] : screen["height"];
              while (LI < nC["length"]) {
                F7 = F7 >>> 8 ^ RE[(F7 ^ nC["charCodeAt"](LI)) & 255];
                LI += 1;
              }
              var K9 = screen["height"];
              X_["b(/JFSy(NkfiPmnN"] = K9;
              (function (uh) {
                if (uh !== undefined) {
                  X_["b(/JFSy(NkfJBlWPbwgJ_+IP)s)gu(h/"] = uh;
                }
              })(screen["availHeight"]);
              (function (Kv) {
                if (Kv !== undefined) {
                  X_["fPCJpZwyu+!g[Yr-Gre[+suFeEI="] = Kv;
                }
              })(screen["availLeft"]);
              (function (UL) {
                if (UL !== undefined) {
                  X_.YeCeeFIHgyaHWwuvUrCPTWaU = UL;
                }
              })(screen["availTop"]);
              (function (Xy) {
                if (Xy !== undefined) {
                  X_["ZPuN&+LJWhenAVYr$rG$AiySeRfTRQ=="] = Xy;
                }
              })(screen["availWidth"]);
              (function (lS) {
                if (lS !== undefined) {
                  X_["ZPuB_/fcUB[)Gk_wzaq-DS+RaQfDVQ=="] = lS;
                }
              })(screen["pixelDepth"]);
              (function (ZU) {
                if (ZU !== undefined) {
                  X_["euWfzf/UXxKqDFsm[(y,DyGfdBreSA=="] = ZU;
                }
              })(window["innerWidth"]);
              (function (f3) {
                if (f3 !== undefined) {
                  X_["b(/JFSy(NkfJBkuRfRoUzucK/)IttrVy"] = f3;
                }
              })(window["innerHeight"]);
              try {
                (function (t3) {
                  if (t3 !== undefined) {
                    X_["euWfzeXOXhOtC$wh&Lu/CCaYcx&ZTw=="] = t3;
                  }
                })(window["outerWidth"]);
              } catch (Jr) {}
              try {
                (function (Ld) {
                  if (Ld !== undefined) {
                    X_["b(/JFSy(NkfJBkuRfRoO$OYL+MUqsbJ$"] = Ld;
                  }
                })(window["outerHeight"]);
              } catch (zt) {}
              try {
                (function (ZV) {
                  if (ZV !== undefined) {
                    X_["YfCZ/sc*vAm&az[ZZIaHRXCCQUewODaPjtutaUXNdz[JMGw("] = ZV;
                  }
                })(Jq["devicePixelRatio"]);
              } catch (YL) {}
              try {
                (function (q2) {
                  if (q2 !== undefined) {
                    X_["caHKFhWCCXjGCV+FeB)exPca-NUr$dfj-HkJblelMJU="] = q2;
                  }
                })(Jq["screen"]["orientation"]["type"]);
              } catch (CW) {}
              try {
                (function (Yo) {
                  if (Yo !== undefined) {
                    X_["ZrbMECm+KVjqJWmzQvzD)Q=="] = Yo;
                  }
                })(window["screenX"]);
              } catch (XQ) {}
              try {
                (function (Qc) {
                  if (Qc !== undefined) {
                    X_["ZrbMECm+KVjqJWmzQ/&C)A=="] = Qc;
                  }
                })(window["screenY"]);
              } catch (v3) {}
              var Qa = X_;
              var p6 = JSON.stringify(Qa, function (Bc, N3) {
                return N3 === undefined ? null : N3;
              });
              var bt = p6.replace(uY, ji);
              var xa = [];
              var MS = 0;
              while (MS < bt.length) {
                xa.push(bt.charCodeAt(MS));
                MS += 1;
              }
              var AY = xa;
              var Pi = AY;
              var ra = Pi.length;
              var wp = [];
              var Sa = ra - 1;
              while (Sa >= 0) {
                wp.push(Pi[Sa]);
                Sa -= 1;
              }
              var Fk = wp;
              var Zj = Fk.length;
              var HU = K0["slice"](0, 19).length;
              var Xt = [];
              var qE = 0;
              while (qE < Zj) {
                Xt.push(Fk[qE]);
                Xt.push(K0["slice"](0, 19)[qE % HU]);
                qE += 1;
              }
              var An = Xt;
              var QR = An.length;
              var jT = K0["slice"](19, 37).length;
              var ys = [];
              var n7 = 113;
              var bN = 0;
              while (bN < QR) {
                var Rl = An[bN];
                var Xs = K0["slice"](19, 37)[bN % jT];
                var eK = Rl ^ Xs ^ n7;
                ys.push(eK);
                n7 = eK;
                bN += 1;
              }
              var lx = ys;
              var lj = [];
              for (var ps in lx) {
                var Zo = lx[ps];
                if (lx.hasOwnProperty(ps)) {
                  var ri = String.fromCharCode(Zo);
                  lj.push(ri);
                }
              }
              var a_ = btoa(lj.join(""));
              nJ["bb&QDDOkMkP)IHre"] = a_;
              var FU = new Date()["getTimezoneOffset"]() / -60;
              nJ["Z(fSDjegKFnhLmW/U+&j_Q=="] = FU;
              var qK = null;
              try {
                qK = Jq["indexedDB"] ? true : false;
              } catch (vb) {
                qK = null;
              }
              var xr = qK;
              nJ["auadsbIcnch)xYLyHrO&+*KcaVM="] = xr;
              var rI = KF["body"]["addBehavior"] ? true : false;
              nJ["YbHYBDmuI$LmKXSueB)bweIP)s)mvbl+"] = rI;
              var W6 = Jq["openDatabase"] ? true : false;
              nJ["eMKyIhvpf*pq-rfjC*DEIgSAeNQQUld,ZJI="] = W6;
              var W3 = i_["cpuClass"];
              var xc = W3 ? W3 : "unknown";
              nJ["V*a)WnYjpQCifjKWfpyQUnaE"] = xc;
              var Ff = i_["platform"];
              var I1 = Ff ? Ff : "unknown";
              nJ["Z(fOEjqtKVjlKmW/W+X&xQ=="] = I1;
              var z4 = i_["doNotTrack"];
              var Uk = z4 ? z4 : "unknown";
              nJ["abnUCCC&DXzZFkacexwj+dE)xPkJkppd"] = Uk;
              ky["startInternal"]("plugins");
              var o8 = i_["appName"] === "Microsoft Internet Explorer" || i_["appName"] === "Netscape" && I_["test"](i_["userAgent"]);
              var tj = [];
              if (Jq["ActiveXObject"]) {
                var d1 = ["AcroPDF.PDF", "Adodb.Stream", "AgControl.AgControl", "DevalVRXCtrl.DevalVRXCtrl.1", "MacromediaFlashPaper.MacromediaFlashPaper", "Msxml2.DOMDocument", "Msxml2.XMLHTTP", "PDF.PdfCtrl", "QuickTime.QuickTime", "QuickTimeCheckObject.QuickTimeCheck.1", "RealPlayer", "RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)", "RealVideo.RealVideo(tm) ActiveX Control (32-bit)", "Scripting.Dictionary", "SWCtl.SWCtl", "Shell.UIHelper", "ShockwaveFlash.ShockwaveFlash", "Skype.Detection", "TDCCtl.TDCCtl", "WMPlayer.OCX", "rmocx.RealPlayer G2 Control", "rmocx.RealPlayer G2 Control.1"];
                var F0 = [];
                for (var ND in d1) {
                  var wi = d1[ND];
                  if (d1.hasOwnProperty(ND)) {
                    F0["push"](function (Yg) {
                      var tf = null;
                      try {
                        new window["ActiveXObject"](Yg);
                        tf = Yg;
                      } catch (u3) {}
                      return tf;
                    }(wi));
                  }
                }
                var gN = F0;
                tj = gN;
              }
              var ju = tj["join"](";");
              var Rb = [];
              var uA = i_["plugins"]["length"];
              var Sx = 0;
              while (Sx < uA) {
                var nv = i_["plugins"][Sx];
                if (nv) {
                  Rb["push"](nv);
                }
                Sx += 1;
              }
              Rb["sort"](function (Mi, OL) {
                var qe = 0;
                if (Mi["name"] > OL["name"]) {
                  qe = 1;
                } else if (Mi["name"] < OL["name"]) {
                  qe = -1;
                }
                return qe;
              });
              var gZ = [];
              for (var Ph in Rb) {
                var CS = Rb[Ph];
                if (Rb.hasOwnProperty(Ph)) {
                  gZ["push"](function (B0) {
                    var Z7 = [];
                    for (var Hj in B0) {
                      var GH = B0[Hj];
                      if (B0.hasOwnProperty(Hj)) {
                        var vJ = function (bW) {
                          var ng = null;
                          if (bW) {
                            ng = [bW["type"], bW["suffixes"]]["join"]("~");
                          }
                          return ng;
                        }(GH);
                        if (vJ !== null && vJ !== undefined) {
                          Z7["push"](vJ);
                        }
                      }
                    }
                    var gc = Z7;
                    var zf = gc;
                    return [B0["name"], B0["description"], zf]["join"]("::");
                  }(CS));
                }
              }
              var RW = gZ;
              var l2 = RW;
              var HT = l2["join"](";");
              var D7 = o8 ? ju : HT;
              ky["stopInternal"]("plugins");
              var AS = D7;
              var O2 = 0;
              var ab = typeof AS !== "string" ? "" + AS : AS;
              while (O2 < ab["length"]) {
                F7 = F7 >>> 8 ^ RE[(F7 ^ ab["charCodeAt"](O2)) & 255];
                O2 += 1;
              }
              var ds = AS;
              nJ["ZjNF(NcMnIU,-abIMow="] = ds;
              var Mh = {};
              try {
                Mh["ZeSeeFAFiSyiTxQT/&d-*NJvnYt$(ugvN+eWSkne"] = navigator["plugins"]["namedItem"]["name"];
                Mh["ZeSeeFAFiSyYRBayWri[dGye"] = navigator["plugins"]["item"]["name"];
                Mh["abnIFBeADXzeEUuRag_L_fMe)M_zqK!p"] = navigator["plugins"]["refresh"]["name"];
              } catch (oc) {}
              var WX = Mh;
              nJ["bb&PExCHEWDfEEacchUA[vEc)M_&rLN_"] = WX;
              ky["startInternal"]("canvas_d");
              var r5 = {};
              var Op = s9["createElement"]("canvas");
              Op["width"] = 600;
              Op["height"] = 160;
              Op["style"]["display"] = "inline";
              try {
                var TZ = Op["getContext"]("2d");
                TZ["rect"](1, 1, 11, 11);
                TZ["rect"](3, 3, 7, 7);
                r5["ZjNF(NQPhJ_l*LzSPII="] = TZ["isPointInPath"](6, 6, "evenodd") === false;
                try {
                  var ER = s9["createElement"]("canvas");
                  ER["width"] = 1;
                  ER["height"] = 1;
                  var el = ER["toDataURL"]("image/webp");
                  r5["bb&VCTqtPE&sMG&J"] = 0 === el["indexOf"]("data:image/webp");
                } catch (BU) {
                  r5["bb&VCTqtPE&sMG&J"] = null;
                }
                r5["YbHKFiSzM_L/MG[&Wefp[w=="] = function () {
                  var yJ = false;
                  try {
                    var YT = s9["createElement"]("canvas");
                    var kY = YT["getContext"]("2d");
                    kY["globalCompositeOperation"] = "screen";
                    yJ = "screen" === kY["globalCompositeOperation"];
                  } catch (Ro) {}
                  return yJ;
                }();
                TZ["textBaseline"] = "alphabetic";
                TZ["fillStyle"] = "#f60";
                TZ["fillRect"](125, 1, 62, 20);
                TZ["fillStyle"] = "#069";
                TZ["font"] = "11pt Arial";
                TZ["fillText"]("Cwm fjordbank glyphs vext quiz,", 2, 15);
                TZ["fillStyle"] = "rgba(102, 204, 0, 0.7)";
                TZ["font"] = "18pt Arial";
                TZ["fillText"]("Cwm fjordbank glyphs vext quiz,", 4, 45);
                try {
                  TZ["globalCompositeOperation"] = "multiply";
                } catch (Ve) {}
                TZ["fillStyle"] = "rgb(255,0,255)";
                TZ["beginPath"]();
                TZ["arc"](50, 50, 50, 0, 2 * Math["PI"], true);
                TZ["closePath"]();
                TZ["fill"]();
                TZ["fillStyle"] = "rgb(0,255,255)";
                TZ["beginPath"]();
                TZ["arc"](100, 50, 50, 0, 2 * Math["PI"], true);
                TZ["closePath"]();
                TZ["fill"]();
                TZ["fillStyle"] = "rgb(255,255,0)";
                TZ["beginPath"]();
                TZ["arc"](75, 100, 50, 0, 2 * Math["PI"], true);
                TZ["closePath"]();
                TZ["fill"]();
                TZ["fillStyle"] = "rgb(255,0,255)";
                TZ["arc"](75, 75, 75, 0, 2 * Math["PI"], true);
                TZ["arc"](75, 75, 25, 0, 2 * Math["PI"], true);
                TZ["fill"]("evenodd");
                try {
                  var o1 = TZ["getImageData"](Op["width"] - 5, Op["height"] - 5, 4, 4);
                  var PQ = s9["createElement"]("canvas");
                  PQ["width"] = o1["width"];
                  PQ["height"] = o1["height"];
                  var yC = PQ["getContext"]("2d");
                  yC["putImageData"](o1, 0, 0);
                  YW = PQ["toDataURL"]();
                } catch (ti) {
                  g6 = "errored";
                }
                jS = Op["toDataURL"]();
              } catch (Bq) {
                r5["evaGqoQqvehc!Q=="] = Bq["toString"]();
              }
              ky["stopInternal"]("canvas_d");
              q3 = r5;
            });
            f9["push"](function () {
              ky["startInternal"]("canvas_h");
              bJ = zM(jS);
              ky["stopInternal"]("canvas_h");
              ky["startInternal"]("canvas_o");
              var IH = b5(2284030616, Yn);
              var MZ = [];
              var OT = 0;
              while (OT < 22) {
                MZ.push(IH() & 255);
                OT += 1;
              }
              var zF = MZ;
              var lK = zF;
              ky["startInternal"]("canvas_io");
              var KA = b5(638959349, Yn);
              var tY = [];
              var C2 = 0;
              while (C2 < 30) {
                tY.push(KA() & 255);
                C2 += 1;
              }
              var Rr = tY;
              var Mv = Rr;
              var a8 = JSON.stringify(bJ, function (Q_, um) {
                return um === undefined ? null : um;
              });
              var kd = a8.replace(uY, ji);
              var S8 = [];
              var VV = 0;
              while (VV < kd.length) {
                S8.push(kd.charCodeAt(VV));
                VV += 1;
              }
              var Ml = S8;
              var Bk = Ml;
              var cl = Bk.length;
              var Gp = Mv["slice"](0, 27).length;
              var jh = [];
              var vi = 113;
              var Dd = 0;
              while (Dd < cl) {
                var he = Bk[Dd];
                var gY = Mv["slice"](0, 27)[Dd % Gp];
                var Nm = he ^ gY ^ vi;
                jh.push(Nm);
                vi = Nm;
                Dd += 1;
              }
              var cJ = jh;
              var nz = cJ.length;
              var mm = [];
              var Ib = 0;
              while (Ib < nz) {
                mm.push(cJ[(Ib + Mv[27]) % nz]);
                Ib += 1;
              }
              var tD = mm;
              var fq = tD.length;
              var dI = [];
              var Gu = 0;
              while (Gu < fq) {
                dI.push(tD[(Gu + Mv[28]) % fq]);
                Gu += 1;
              }
              var pO = dI;
              var Pg = [];
              for (var R_ in pO) {
                var EA = pO[R_];
                if (pO.hasOwnProperty(R_)) {
                  var zT = String.fromCharCode(EA);
                  Pg.push(zT);
                }
              }
              var cR = btoa(Pg.join(""));
              q3.YbHJPA_m = cR;
              ky["stopInternal"]("canvas_io");
              var eq = q3;
              var gQ = JSON.stringify(eq, function (DO, eY) {
                return eY === undefined ? null : eY;
              });
              var X6 = gQ.replace(uY, ji);
              var mL = [];
              var JC = 0;
              while (JC < X6.length) {
                mL.push(X6.charCodeAt(JC));
                JC += 1;
              }
              var fV = mL;
              var Ax = fV;
              var ez = Ax.length;
              var U9 = [];
              var cB = ez - 1;
              while (cB >= 0) {
                U9.push(Ax[cB]);
                cB -= 1;
              }
              var Zx = U9;
              var B4 = Zx.length;
              var hV = lK["slice"](0, 21).length;
              var ty = [];
              var qd = 113;
              var ux = 0;
              while (ux < B4) {
                var z1 = Zx[ux];
                var Qr = lK["slice"](0, 21)[ux % hV];
                var tp = z1 ^ Qr ^ qd;
                ty.push(tp);
                qd = tp;
                ux += 1;
              }
              var Jd = ty;
              var PG = [];
              for (var oP in Jd) {
                var kQ = Jd[oP];
                if (Jd.hasOwnProperty(oP)) {
                  var Xq = String.fromCharCode(kQ);
                  PG.push(Xq);
                }
              }
              var wQ = btoa(PG.join(""));
              nJ["fq(fAz-pL$()IH(a"] = wQ;
              ky["stopInternal"]("canvas_o");
            });
            f9["push"](function () {
              nJ["adOvPwv!aM$w)K(-Fs&FIzu/UPwGRFl[YZc="] = Ue(YW, g6, function (I8) {
                var jf = b5(1079950851, Yn);
                var O4 = [];
                var vf = 0;
                while (vf < 21) {
                  O4.push(jf() & 255);
                  vf += 1;
                }
                var ci = O4;
                var RI = ci;
                var c8 = JSON.stringify(I8, function (RZ, F5) {
                  return F5 === undefined ? null : F5;
                });
                var py = c8.replace(uY, ji);
                var If = [];
                var E5 = 0;
                while (E5 < py.length) {
                  If.push(py.charCodeAt(E5));
                  E5 += 1;
                }
                var RC = If;
                var mY = RC;
                var ex = mY.length;
                var Jn = RI["slice"](0, 20).length;
                var uG = [];
                var QI = 113;
                var lG = 0;
                while (lG < ex) {
                  var De = mY[lG];
                  var Od = RI["slice"](0, 20)[lG % Jn];
                  var Oe = De ^ Od ^ QI;
                  uG.push(Oe);
                  QI = Oe;
                  lG += 1;
                }
                var h9 = uG;
                var Fc = h9.length;
                var BF = [];
                var p0 = Fc - 1;
                while (p0 >= 0) {
                  BF.push(h9[p0]);
                  p0 -= 1;
                }
                var ub = BF;
                var xU = [];
                for (var sJ in ub) {
                  var s0 = ub[sJ];
                  if (ub.hasOwnProperty(sJ)) {
                    var ns = String.fromCharCode(s0);
                    xU.push(ns);
                  }
                }
                var is = btoa(xU.join(""));
                return is;
              });
            });
            f9["push"](function () {
              ky["startInternal"]("webgl_cc");
              var hd = s9["createElement"]("canvas");
              try {
                AD = hd["getContext"]("webgl2") || hd["getContext"]("webgl") || hd["getContext"]("experimental-webgl");
              } catch (Ho) {}
              ky["stopInternal"]("webgl_cc");
            });
            f9["push"](function () {
              ky["startInternal"]("webgl_d");
              var MO = AD;
              var yM = {};
              if (MO) {
                var NI = function (dv) {
                  return dv ? [dv[0], dv[1]] : null;
                };
                var Ak = function (AG) {
                  var UE = null;
                  var mC = AG["getExtension"]("EXT_texture_filter_anisotropic") || AG["getExtension"]("WEBKIT_EXT_texture_filter_anisotropic") || AG["getExtension"]("MOZ_EXT_texture_filter_anisotropic'");
                  if (mC) {
                    var NS = AG["getParameter"](mC["MAX_TEXTURE_MAX_ANISOTROPY_EXT"]);
                    UE = NS === 0 ? 2 : NS;
                  }
                  return UE;
                };
                var Ip = "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}";
                var TI = "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}";
                var sI = MO["createBuffer"] && MO["createBuffer"]();
                if (sI) {
                  MO["bindBuffer"](MO["ARRAY_BUFFER"], sI);
                  var q0 = new Float32Array([-0.2, -0.9, 0, 0.4, -0.26, 0, 0, 0.732134444, 0]);
                  MO["bufferData"](MO["ARRAY_BUFFER"], q0, MO["STATIC_DRAW"]);
                  sI["itemSize"] = 3;
                  sI["numItems"] = 3;
                  var Kf = MO["createProgram"]();
                  var di = MO["createShader"](MO["VERTEX_SHADER"]);
                  MO["shaderSource"](di, Ip);
                  MO["compileShader"](di);
                  var Dx = MO["createShader"](MO["FRAGMENT_SHADER"]);
                  MO["shaderSource"](Dx, TI);
                  MO["compileShader"](Dx);
                  MO["attachShader"](Kf, di);
                  MO["attachShader"](Kf, Dx);
                  MO["linkProgram"](Kf);
                  MO["useProgram"](Kf);
                  Kf["vertexPosAttrib"] = MO["getAttribLocation"](Kf, "attrVertex");
                  if (Kf["vertexPosAttrib"] === -1) {
                    Kf["vertexPosAttrib"] = 0;
                  }
                  Kf["offsetUniform"] = MO["getUniformLocation"](Kf, "uniformOffset");
                  if (Kf["offsetUniform"] === -1) {
                    Kf["offsetUniform"] = 0;
                  }
                  MO["enableVertexAttribArray"](Kf["vertexPosArray"]);
                  MO["vertexAttribPointer"](Kf["vertexPosAttrib"], sI["itemSize"], MO["FLOAT"], false, 0, 0);
                  MO["uniform2f"](Kf["offsetUniform"], 1, 1);
                  MO["drawArrays"](MO["TRIANGLE_STRIP"], 0, sI["numItems"]);
                  if (MO["canvas"] !== null) {
                    yM.YbHJPA_m = null;
                    try {
                      xd = MO["canvas"]["toDataURL"]();
                      try {
                        var JY = 4;
                        var DL = 4;
                        var bp = new Jq["Uint8Array"](64);
                        MO["readPixels"](0, 0, JY, DL, MO["RGBA"], MO["UNSIGNED_BYTE"], bp);
                        var fB = s9["createElement"]("canvas");
                        fB["width"] = JY;
                        fB["height"] = DL;
                        var A4 = fB["getContext"]("2d");
                        var Pm = A4["createImageData"](JY, DL);
                        Pm["data"]["set"](bp);
                        A4["putImageData"](Pm, 0, 0);
                        nT = fB["toDataURL"]();
                      } catch (h2) {
                        lO = "errored";
                      }
                    } catch (YQ) {
                      yM["evaGqoQqvehc!Q=="] = YQ["toString"]();
                    }
                  }
                }
                var Ky = MO["getSupportedExtensions"] && MO["getSupportedExtensions"]();
                yM["e/eGqpk&u+!M*aTUOJWBzfK)RX)="] = Ky ? Ky["join"](";") : null;
                yM["ZrbIFDqtF[bfEFuBbAsC[OgFxvsF+/(K[ks,X$ymJ!ImSgZ(k/T*SmHfIkyyKSXi"] = NI(MO["getParameter"](MO["ALIASED_LINE_WIDTH_RANGE"]));
                yM["ZrbIFDqtF[bSHViCYgUWzNQ!_ewZ!+XRx$Y!Xl[nJpMnSwd-kvX)S[DeI_[zKCTj"] = NI(MO["getParameter"](MO["ALIASED_POINT_SIZE_RANGE"]));
                yM["e/ecsIUrrPl&zpDgAay))NuVaFI="] = MO["getParameter"](MO["ALPHA_BITS"]);
                var de = MO["getContextAttributes"] && MO["getContextAttributes"]();
                yM["YbHdATyrJ$brJHqgQCcz-cAt_O_Rio*I"] = de ? de["antialias"] ? true : false : null;
                yM["beyGYFAFgieFWRK[VrS[dGye"] = MO["getParameter"](MO["BLUE_BITS"]);
                yM["e/ecsIUrrPl&zpnpFLmp!ceJcUs="] = MO["getParameter"](MO["DEPTH_BITS"]);
                yM["e/ecsIUrrPl&zp/vA--r!*KcZ$_="] = MO["getParameter"](MO["GREEN_BITS"]);
                yM["ZjNNiYoCn*Vl&I(ZKZeHtZ$WuJp$i,+clgl/LQ=="] = Ak(MO);
                yM["fEAA*c&mZkb!DFpCqRoX()f&CNoetKfD[[ETg-xez[rSUgNXq&BPqYsP*Fii,ObJ[S*vrJUClcNnpu_C)_VAYg=="] = MO["getParameter"](MO["MAX_COMBINED_TEXTURE_IMAGE_UNITS"]);
                yM["beGEqJ_zpfB+x!&tFruu,tGfe_G/XkFpT-bJFivETKIs+KIW/fPmDSlnpPMQoqjTx_Y="] = MO["getParameter"](MO["MAX_CUBE_MAP_TEXTURE_SIZE"]);
                yM["et+mNjXKVziI)-EF/_FTYUmCakiwTkBTXMOD_eDLXBGvCVAb+yAu(*$XlA&icXSjv,PxBD)UkLA="] = MO["getParameter"](MO["MAX_FRAGMENT_UNIFORM_VECTORS"]);
                yM["bfKL[ePIWBWmAGAr_AsOz+xmlA&zYHmuiLTTJhswuJgs)LUR)RMAwtooxsA="] = MO["getParameter"](MO["MAX_RENDERBUFFER_SIZE"]);
                yM["fZTULBX_dq_dGEoG!iIdwOIQ/t)xt-gkJaHb!)+NN_vi!(mYfOv,EyBum)w!iw=="] = MO["getParameter"](MO["MAX_TEXTURE_IMAGE_UNITS"]);
                yM["YbHdAQKVFWTHCEKYZQIawOIP!*oe,PPH&_,)W[KQD-o="] = MO["getParameter"](MO["MAX_TEXTURE_SIZE"]);
                yM["epPtMhj&TaMK&oA__N(NJhNdrvkWpKzXy_ojxcaTEbQL!rC&R))="] = MO["getParameter"](MO["MAX_VARYING_VECTORS"]);
                yM["V)ahxvsBiTyeQh+(W(mraVqoQEa)NAC!uO[XU&vzZC-aI[o*"] = MO["getParameter"](MO["MAX_VERTEX_ATTRIBS"]);
                yM["cCVf*t,Fkos/(qfJHwYeLAqsXSzEX_CHl_c[-sNU(p)r!LxmjunkPhD*PgP*AxouIrPYv!th,VTxnf[A"] = MO["getParameter"](MO["MAX_VERTEX_TEXTURE_IMAGE_UNITS"]);
                yM["aeiafFOhNpMtreayWIOGYFHVFrpMDhc,LtihYlfASx[!eBj&BrC$l-SDbWaY[seFowZh)Q=="] = MO["getParameter"](MO["MAX_VERTEX_UNIFORM_VECTORS"]);
                yM["ZeGNeEli(s!(ju([C(iqUnpKpnSYMjxYSPKbCwjQTSyc_g=="] = NI(MO["getParameter"](MO["MAX_VIEWPORT_DIMS"]));
                yM["YbHMEBOEBXTAD_KYYtzI+g=="] = MO["getParameter"](MO["RED_BITS"]);
                yM["eqrQDDSjKFntIm+$TvD$xw=="] = MO["getParameter"](MO["RENDERER"]);
                yM["YbHdAS+,OEnuIUGbdxAXzesG(*Iu_NXh+WgbfH+FB(INYTdKp)DBdlnnCGaTCAzL"] = MO["getParameter"](MO["SHADING_LANGUAGE_VERSION"]);
                yM["YbHMEBOEDXzEC$eNag_I_uEM,*,[rbJ$"] = MO["getParameter"](MO["STENCIL_BITS"]);
                yM["bLzNESi/LF&+InLW"] = MO["getParameter"](MO["VENDOR"]);
                yM["ZzJE(cIZjpcj)rvVMow="] = MO["getParameter"](MO["VERSION"]);
                if (MO["getShaderPrecisionFormat"]) {
                  var wa = MO["getShaderPrecisionFormat"](MO["VERTEX_SHADER"], MO["HIGH_FLOAT"]);
                  if (wa) {
                    yM["YOScoJXXWiaoreDBLbq+MBaMeGCItIBHRvuBDibidWzYLmcH,F!RY_[GaUu!R_*cQN+y,MznXRC$E__G,Ds&*tddngc="] = wa["precision"];
                    yM["ZvmH$fvQaieYPm,lxR,NzOJolw(wY&qtpJjYLQUuqoo_wZKKZdbpET,O*SfVf&wYPoTpeUCYGXjIhtGkXikWTXLlHM,h!v/I$D$UrJ!s,EX!eRlNoXp*mw=="] = wa["rangeMin"];
                    yM["ZvmH$fvQaieYPm,lxR,NzOJolw(wY&qtpJjYLQUuqoo_wZKKZdbpET,O*SfVf&wYPoTpeUCYGXjIhtGkXikWTXLlHM,h!v/I$D$UrIh-/lvnZwdTv[RjhQ=="] = wa["rangeMax"];
                    wa = MO["getShaderPrecisionFormat"](MO["VERTEX_SHADER"], MO["MEDIUM_FLOAT"]);
                    yM["bv+/[OkTgzaO,rnEKE*C*e$TvdMtu(S!oYr*_f,*h,EowpiAfen(DS)qwMM[ralufq(CHiu)Okv/MH[nXjkG&O)C/)I[yM/("] = wa["precision"];
                    yM["bYT)BDbXU,grLk,C!SEu)*_vwOETlZ_RDYnk[PS[DHDV_I-vSd(SXH&nJDzK*ugvP,L!dk+LAxqUYi*Po,+LaE,Q!F+&LBjf&g!_qIAXgPFFisMZ/kBJe$GaWXs="] = wa["rangeMin"];
                    yM["bYT)BDbXU,grLk,C!SEu)*_vwOETlZ_RDYnk[PS[DHDV_I-vSd(SXH&nJDzK*ugvP,L!dk+LAxqUYi*Po,+LaE,Q!F+&LBjf&g!_qIAXgPFFisMZ-FZXZU+ER[U="] = wa["rangeMax"];
                    wa = MO["getShaderPrecisionFormat"](MO["VERTEX_SHADER"], MO["LOW_FLOAT"]);
                    yM["ZyJRFBflctdj,(jsBN/XMQWBQu,NT_FuY!X,OwKVBlDvM[PHJ)XWFDrINzHPR$(n(rv(PxefG$HvVgVSvR,hWGj&"] = wa["precision"];
                    yM["aUIvAwDDSE(wGkxUrjozxeHkHR(&pb,QNrrR/cBu!LEMteycSufwvJTaKhDUNSwEGPGKVWiHCuRGkvJGt(m)V[QqxJNt&)K!riJUeEnnXQi)BV_tymc="] = wa["rangeMin"];
                    yM["aUIvAwDDSE(wGkxUrjozxeHkHR(&pb,QNrrR/cBu!LEMteycSufwvJTaKhDUNSwEGPGKVWiHCuRGkvJGt(m)V[QqxJNt&)K!uDRKZlf!QxaiG_Mz$Hk="] = wa["rangeMax"];
                    wa = MO["getShaderPrecisionFormat"](MO["FRAGMENT_SHADER"], MO["HIGH_FLOAT"]);
                    yM["bv+/[OwWlCGZ*aLfCW!)y+lXr)E(ra-jqYLC(sYFjog)$oSccubnESQh[*gttrJ$ZbXZBTCnIVDkK[a)RSIdx/QZ!Nkt_*Tg"] = wa["precision"];
                    yM["bYT)BDbXU,grLk,C!SEu)*_vwOETlZ_RDYnk[PS[DHDV_I-vSd(SXH&nJDzP)/),KJXibW-qPSSQZj$dtZmRckYY[[CPFBHWyhpotI)YnO$OgdgC!VtSYEqBQmA="] = wa["rangeMin"];
                    yM["bYT)BDbXU,grLk,C!SEu)*_vwOETlZ_RDYnk[PS[DHDV_I-vSd(SXH&nJDzP)/),KJXibW-qPSSQZj$dtZmRckYY[[CPFBHWyhpotI)YnO$OgdgC)_$MflSfXH,="] = wa["rangeMax"];
                    wa = MO["getShaderPrecisionFormat"](MO["FRAGMENT_SHADER"], MO["MEDIUM_FLOAT"]);
                    yM["Z,(*Ihj&TaMfy,E$$dvfNBZYqf,-iJHq*ncM-teCD-oI!YWCf/f!d$XoGQ/z+vDm(ajRlKZU&nvDQw*bu[BjhacjzWGKyPzT&ihWlQ=="] = wa["precision"];
                    yM["ZbX$KRCHBXTLBFqAexwj+dA*zvMB/+fTw$IuSXCKHagJZQV,heLjVHzCMlyhNwMOGjFbd_KBAAayWAoSxFBCtJaTa[iSwMNtZ+urh-)Bit*r_oDwHrOy/suFf_WwKynu"] = wa["rangeMin"];
                    yM["ZbX$KRCHBXTLBFqAexwj+dA*zvMB/+fTw$IuSXCKHagJZQV,heLjVHzCMlyhNwMOGjFbd_KBAAayWAoSxFBCtJaTa[iSwMNtZ+urh-)Bit*r_oDwHrOy/suFf_WmPTfw"] = wa["rangeMax"];
                    wa = MO["getShaderPrecisionFormat"](MO["FRAGMENT_SHADER"], MO["LOW_FLOAT"]);
                    yM["V_kh&O/UXZEfw,,qxiQg,sQ[wsQspJApJHEAxP$$/bcBuOaxSunvlr)o[wn(PCQTA+qWble[IfpbXj!yj_tKl(*NvZxh!w=="] = wa["precision"];
                    yM["b+-feUQRhiOtQBEW)Hhx/)t[g!VtZGp)dzJdGBvpeN$t(b&pDNfRNy+rQOwYWl$yVKLPDDWiI&XFBFO)RvDP(d(!CwD+vLr,!kM*rYN)/!Av)-UB!Qc,+tgq"] = wa["rangeMin"];
                    yM["b+-feUQRhiOtQBEW)Hhx/)t[g!VtZGp)dzJdGBvpeN$t(b&pDNfRNy+rQOwYWl$yVKLPDDWiI&XFBFO)RvDP(d(!CwD+vLr,!kM*rYN)/!A!!bsf+xkm!MY_"] = wa["rangeMax"];
                    wa = MO["getShaderPrecisionFormat"](MO["VERTEX_SHADER"], MO["HIGH_INT"]);
                    yM["V[sG))rhYEDwBVJKsAM)xPvLMuAPpbzYxH,Xh(VHzWjQUBxIqHNwlrQw&nKZ[+/AzTtKibwrkcd+v+cI-F!WdA=="] = wa["precision"];
                    yM["ei*vq!kRm*Fp_JzLK,iL)tBPoWOIo!eJhNGgCTznXUT*LHQa+uPr[cFnifgGq-Tfx[EW/tGxC&/Ww!lUqRcFNxXeNBbjeHq*qXk!!dxLybgHyJZM"] = wa["rangeMin"];
                    yM["ei*vq!kRm*Fp_JzLK,iL)tBPoWOIo!eJhNGgCTznXUT*LHQa+uPr[cFnifgGq-Tfx[EW/tGxC&/Ww!lUqRcFNxXeNBb$bmSjt[cn+)JV$-YZ$ohS"] = wa["rangeMax"];
                    wa = MO["getShaderPrecisionFormat"](MO["VERTEX_SHADER"], MO["MEDIUM_INT"]);
                    yM["YeWeopvZUS[jpuvKJrG$Ox[Hc[uDv,tMTfCKBS&pfmfTJWwM-$VaaEaNYkCyTERXS*S!-)fsVhu+GEkC,jkGx+$njhc="] = wa["precision"];
                    yM["ZvmH$fvQaieYPm,lxR,NzOJolw(wY&qtpJjYLQUupYU*yKiwVOfyCiQU(D(AamwILpT!aVCICWjYlsG_TjkGXWL$DN,x*u/YxC$EvI!))FXpaQldsWptiw=="] = wa["rangeMin"];
                    yM["ZvmH$fvQaieYPm,lxR,NzOJolw(wY&qtpJjYLQUupYU*yKiwVOfyCiQU(D(AamwILpT!aVCICWjYlsG_TjkGXWL$DN,x*u/YxC$EvJhq(kv&dxdDr&RzlQ=="] = wa["rangeMax"];
                    wa = MO["getShaderPrecisionFormat"](MO["VERTEX_SHADER"], MO["LOW_INT"]);
                    yM["beGatoslqP$f!ob[B-qv,*CecEq_VUhgd/uLp!I)qv*H/qLSPpOBzfq_d_[iQ_ZufpfXCCPMRqgVwaEV(uA="] = wa["precision"];
                    yM["V+qbFCfjb&bUInQU/tLXNAFfswjMV_iPmEg+,uF[!JUr!Ldtu*zOFDbbIx(kGhktJ(b[kbVPz&rfs/-DbwgeqYAX,jDGATUCHvePd_WkIPtYXQ=="] = wa["rangeMin"];
                    yM["V+qbFCfjb&bUInQU/tLXNAFfswjMV_iPmEg+,uF[!JUr!Ldtu*zOFDbbIx(kGhktJ(b[kbVPz&rfs/-DbwgeqZYB/C(YHyscAOmRaVu-PuVGQw=="] = wa["rangeMax"];
                    wa = MO["getShaderPrecisionFormat"](MO["FRAGMENT_SHADER"], MO["HIGH_INT"]);
                    yM["YeWSrq&veASwte(PJ(C,NgKYW_OskJVSTvOBDjXxdWzPOWAA!$lWZEqBbky+QEhbR*i$!)vgWheyFEUO(jUKy+RulQw="] = wa["precision"];
                    yM["ZvmH$fvQaieYPm,lxR,NzOJolw(wY&qtpJjYLQUupYU*yKiwUeLlHTMD*yXhS$I[KpDre_aeE&LQnv-LdgEPVHbhEMI++fPEzyZfp!Vn-_(ychJGqnF[kA=="] = wa["rangeMin"];
                    yM["ZvmH$fvQaieYPm,lxR,NzOJolw(wY&qtpJjYLQUupYU*yKiwUeLlHTMD*yXhS$I[KpDre_aeE&LQnv-LdgEPVHbhEMI++fPEzyZfp,Nx*VDsbAxYtG*ojg=="] = wa["rangeMax"];
                    wa = MO["getShaderPrecisionFormat"](MO["FRAGMENT_SHADER"], MO["MEDIUM_INT"]);
                    yM["ZfSe+cw[twK[[oj$I_RW,cN*hesRh,SJg-joxOwvpKIW/K-[WMzNOw,L)fIHnJhfT!/zLxqNC&rOAUyWbwg&(d,zwfwO)MTw"] = wa["precision"];
                    yM["bYT)BDbXU,grLk,C!SEu)*_vwOETlZ_RDYnk[PS[DHDV_IGgQNfoZkzWPyfV-eYhPYDyfX--LTSAdi$NpYmBYlYIy&CfBAHG[gp,pJ)IjP$ekcgS*UtCcFqRUnA="] = wa["rangeMin"];
                    yM["bYT)BDbXU,grLk,C!SEu)*_vwOETlZ_RDYnk[PS[DHDV_IGgQNfoZkzWPyfV-eYhPYDyfX--LTSAdi$NpYmBYlYIy&CfBAHG[gp,pJ)IjP$ekcgS,$$cbkSPTG,="] = wa["rangeMax"];
                    wa = MO["getShaderPrecisionFormat"](MO["FRAGMENT_SHADER"], MO["LOW_INT"]);
                    yM["VxJ/OgPxcNVl!bLmHMf,Hi[pW/cJS_$ifIr_NxmODVvkOGjMLM(dHzHDPDrETFXs!bDwNByUH$XtVDRjnT,xSGP)"] = wa["precision"];
                    yM["aUIvAwDDSE(wGkxUrjozxeHkHR(&pb,QNrrR/c*h(bg[j)e&UfzwvKTqBD(AIS,GHveAX&CfJctuuutfs([wW&s$yJ*[xMmypSlfc_LsVgO&DlYmwWw="] = wa["rangeMin"];
                    yM["aUIvAwDDSE(wGkxUrjozxeHkHR(&pb,QNrrR/c*h(bg[j)e&UfzwvKTqBD(AIS,GHveAX&CfJctuuutfs([wW&s$yJ*[xMmysz*BbVzySB[pEEg,&&I="] = wa["rangeMax"];
                  }
                }
                var rn = MO["getExtension"]("WEBGL_debug_renderer_info");
                if (rn) {
                  (function (YY) {
                    if (YY !== undefined) {
                      yM["fv+/WWE_tBGrRgoN!W$g(sd-k,Vs*/M_KfmIVG&-"] = YY;
                    }
                  })(MO["getParameter"](rn["UNMASKED_VENDOR_WEBGL"]));
                  (function (vH) {
                    if (vH !== undefined) {
                      yM["ffmUYVhz!MRwhd(GIZKXb$pqqXuELiBEVuyAEC&$fRyj(Q=="] = vH;
                    }
                  })(MO["getParameter"](rn["UNMASKED_RENDERER_WEBGL"]));
                }
              }
              if (yM["evaGqoQqvehc!Q=="] !== undefined) {
                var yN = yM["evaGqoQqvehc!Q=="];
                delete yM["evaGqoQqvehc!Q=="];
                yM["evaGqoQqvehc!Q=="] = yN;
              }
              DS = yM;
              ky["stopInternal"]("webgl_d");
            });
            f9["push"](function () {
              ky["startInternal"]("webgl_h");
              if (xd) {
                e9 = zM(xd);
              }
              ky["stopInternal"]("webgl_h");
            });
            f9["push"](function () {
              ky["startInternal"]("webgl_o");
              var x6 = b5(430797680, Yn);
              var mG = [];
              var lg = 0;
              while (lg < 29) {
                mG.push(x6() & 255);
                lg += 1;
              }
              var Kr = mG;
              var G6 = Kr;
              ky["startInternal"]("webgl_io");
              if (e9) {
                var I9 = b5(4143207636, Yn);
                var Lm = [];
                var Us = 0;
                while (Us < 19) {
                  Lm.push(I9() & 255);
                  Us += 1;
                }
                var G3 = Lm;
                var me = G3;
                var i8 = JSON.stringify(e9, function (eG, nW) {
                  return nW === undefined ? null : nW;
                });
                var Re = i8.replace(uY, ji);
                var fC = [];
                var uL = 0;
                while (uL < Re.length) {
                  fC.push(Re.charCodeAt(uL));
                  uL += 1;
                }
                var pB = fC;
                var AH = pB;
                var KQ = [];
                for (var E7 in AH) {
                  var xn = AH[E7];
                  if (AH.hasOwnProperty(E7)) {
                    KQ.push(xn);
                  }
                }
                var Fg = KQ;
                var s5 = Fg;
                var kO = s5.length;
                var T4 = 0;
                while (T4 + 1 < kO) {
                  var KN = s5[T4];
                  s5[T4] = s5[T4 + 1];
                  s5[T4 + 1] = KN;
                  T4 += 2;
                }
                var tR = s5;
                var Xl = tR.length;
                var au = me["slice"](0, 18).length;
                var r8 = [];
                var Gi = 113;
                var RU = 0;
                while (RU < Xl) {
                  var P_ = tR[RU];
                  var W1 = me["slice"](0, 18)[RU % au];
                  var q4 = P_ ^ W1 ^ Gi;
                  r8.push(q4);
                  Gi = q4;
                  RU += 1;
                }
                var lt = r8;
                var SX = [];
                for (var bk in lt) {
                  var W4 = lt[bk];
                  if (lt.hasOwnProperty(bk)) {
                    var Nw = String.fromCharCode(W4);
                    SX.push(Nw);
                  }
                }
                var iW = btoa(SX.join(""));
                DS.YbHJPA_m = iW;
              }
              ky["stopInternal"]("webgl_io");
              var lz = DS;
              var OZ = JSON.stringify(lz, function (Pj, ly) {
                return ly === undefined ? null : ly;
              });
              var YZ = OZ.replace(uY, ji);
              var q8 = [];
              var Kp = 0;
              while (Kp < YZ.length) {
                q8.push(YZ.charCodeAt(Kp));
                Kp += 1;
              }
              var O5 = q8;
              var cY = O5;
              var yq = [];
              for (var jb in cY) {
                var kK = cY[jb];
                if (cY.hasOwnProperty(jb)) {
                  yq.push(kK);
                }
              }
              var Il = yq;
              var Kl = Il;
              var WO = Kl.length;
              var vt = 0;
              while (vt + 1 < WO) {
                var Ye = Kl[vt];
                Kl[vt] = Kl[vt + 1];
                Kl[vt + 1] = Ye;
                vt += 2;
              }
              var jZ = Kl;
              var iT = jZ.length;
              var s7 = G6["slice"](0, 28).length;
              var qX = [];
              var Pc = 113;
              var pb = 0;
              while (pb < iT) {
                var Ji = jZ[pb];
                var uB = G6["slice"](0, 28)[pb % s7];
                var lA = Ji ^ uB ^ Pc;
                qX.push(lA);
                Pc = lA;
                pb += 1;
              }
              var C0 = qX;
              var qM = [];
              for (var Hq in C0) {
                var GZ = C0[Hq];
                if (C0.hasOwnProperty(Hq)) {
                  var BB = String.fromCharCode(GZ);
                  qM.push(BB);
                }
              }
              var NH = btoa(qM.join(""));
              nJ["V,f-Jh+IGmvWClL["] = NH;
              ky["stopInternal"]("webgl_o");
            });
            f9["push"](function () {
              nJ["bde/LxvpeN$g,L(qBt&VMyuvX/MPTXlWTbs="] = Ue(nT, lO, function (S5) {
                var sw = b5(781766443, Yn);
                var pD = [];
                var dO = 0;
                while (dO < 47) {
                  pD.push(sw() & 255);
                  dO += 1;
                }
                var tV = pD;
                var ah = tV;
                var Wi = JSON.stringify(S5, function (dk, ox) {
                  return ox === undefined ? null : ox;
                });
                var EG = Wi.replace(uY, ji);
                var v5 = [];
                var ep = 0;
                while (ep < EG.length) {
                  v5.push(EG.charCodeAt(ep));
                  ep += 1;
                }
                var p3 = v5;
                var Yu = p3;
                var NU = [];
                for (var BC in Yu) {
                  var dM = Yu[BC];
                  if (Yu.hasOwnProperty(BC)) {
                    NU.push(dM);
                  }
                }
                var AU = NU;
                var fX = AU;
                var s_ = fX.length;
                var iR = 0;
                while (iR + 1 < s_) {
                  var Ua = fX[iR];
                  fX[iR] = fX[iR + 1];
                  fX[iR + 1] = Ua;
                  iR += 2;
                }
                var c5 = fX;
                var xY = c5.length;
                var H0 = [];
                var u1 = xY - 1;
                while (u1 >= 0) {
                  H0.push(c5[u1]);
                  u1 -= 1;
                }
                var Ag = H0;
                var Rv = Ag.length;
                var M8 = ah["slice"](0, 30).length;
                var Vx = [];
                var Zt = 0;
                while (Zt < Rv) {
                  Vx.push(Ag[Zt]);
                  Vx.push(ah["slice"](0, 30)[Zt % M8]);
                  Zt += 1;
                }
                var VP = Vx;
                var DB = VP.length;
                var Zf = ah["slice"](30, 46).length;
                var Sm = [];
                var WC = 113;
                var Aa = 0;
                while (Aa < DB) {
                  var zU = VP[Aa];
                  var EO = ah["slice"](30, 46)[Aa % Zf];
                  var iy = zU ^ EO ^ WC;
                  Sm.push(iy);
                  WC = iy;
                  Aa += 1;
                }
                var hC = Sm;
                var tr = [];
                for (var UW in hC) {
                  var St = hC[UW];
                  if (hC.hasOwnProperty(UW)) {
                    var S9 = String.fromCharCode(St);
                    tr.push(S9);
                  }
                }
                var p5 = btoa(tr.join(""));
                return p5;
              });
            });
            f9["push"](function () {
              ky["startInternal"]("webgl_meta");
              var d3 = {};
              try {
                d3["V)atyvMJiz-KVgSgSKqkZn-MYmSaEg[_qP[PS&b+aSOTKmUy"] = window["WebGLRenderingContext"]["prototype"]["getParameter"]["name"];
                d3["bZvpKheAF_HxMH+QRvDkxuTDODPNVkuMnEwn+)ZR[qsl-qd*kfbiOA=="] = fb(window["WebGLRenderingContext"]["prototype"]["getParameter"]);
              } catch (YE) {}
              ky["stopInternal"]("webgl_meta");
              var qV = d3;
              nJ["b/Cw,tz&dzqcOmQZ!IOGMRulZgj/aQ=="] = qV;
              var BW = b5(764395007, Yn);
              var cq = [];
              var Ks = 0;
              while (Ks < 31) {
                cq.push(BW() & 255);
                Ks += 1;
              }
              var gv = cq;
              var C1 = gv;
              var oJ = {};
              if (typeof i_["maxTouchPoints"] !== "undefined") {
                oJ["ZrbAHC+,LVzSHUqQeh_I_voX/)IG+Ovfx$YkQ[yeD-o="] = i_["maxTouchPoints"];
              } else if (typeof i_["msMaxTouchPoints"] !== "undefined") {
                oJ["ZrbAHC+,LVzSHUqQeh_I_voX/)IG+Ovfx$YkQ[yeD-o="] = i_["msMaxTouchPoints"];
              } else {
                oJ["ZrbAHC+,LVzSHUqQeh_I_voX/)IG+Ovfx$YkQ[yeD-o="] = 0;
              }
              try {
                s9["createEvent"]("TouchEvent");
                oJ["YP+D_fjTWRSxF$whxqGkEyKcZQvPWQ=="] = true;
              } catch (p2) {
                oJ["YP+D_fjTWRSxF$whxqGkEyKcZQvPWQ=="] = false;
              }
              oJ["YP+D_fjTWRSxF$wh[r[)CziGaQfDVQ=="] = Jq["ontouchstart"] !== undefined;
              var eo = oJ;
              var Lg = JSON.stringify(eo, function (qY, Cu) {
                return Cu === undefined ? null : Cu;
              });
              var L_ = Lg.replace(uY, ji);
              var qJ = [];
              var Lp = 0;
              while (Lp < L_.length) {
                qJ.push(L_.charCodeAt(Lp));
                Lp += 1;
              }
              var r9 = qJ;
              var NY = r9;
              var g7 = NY.length;
              var lE = C1[0] % 7 + 1;
              var oj = [];
              var Nt = 0;
              while (Nt < g7) {
                oj.push((NY[Nt] << lE | NY[Nt] >> 8 - lE) & 255);
                Nt += 1;
              }
              var Ne = oj;
              var JK = Ne.length;
              var E9 = C1["slice"](1, 30).length;
              var s8 = [];
              var Ok = 113;
              var x5 = 0;
              while (x5 < JK) {
                var BZ = Ne[x5];
                var wI = C1["slice"](1, 30)[x5 % E9];
                var D_ = BZ ^ wI ^ Ok;
                s8.push(D_);
                Ok = D_;
                x5 += 1;
              }
              var Du = s8;
              var lZ = [];
              for (var To in Du) {
                var Km = Du[To];
                if (Du.hasOwnProperty(To)) {
                  var sA = String.fromCharCode(Km);
                  lZ.push(sA);
                }
              }
              var kV = btoa(lZ.join(""));
              nJ["YOyQvJU(seRB+A=="] = kV;
              var Tb = b5(2514653307, Yn);
              var vU = [];
              var SN = 0;
              while (SN < 46) {
                vU.push(Tb() & 255);
                SN += 1;
              }
              var R5 = vU;
              var oE = R5;
              ky["startInternal"]("video");
              var lH = KF["createElement"]("video");
              var ja = {};
              var u_ = "errored";
              try {
                u_ = lH["canPlayType"]("video/ogg; codecs=\"theora\"") || "" || "nope";
              } catch (zG) {}
              var u7 = u_;
              ja["Z(fPOgEq"] = u7;
              var J_ = "errored";
              try {
                J_ = lH["canPlayType"]("video/mp4; codecs=\"avc1.42E01E\"") || "" || "nope";
              } catch (HY) {}
              var BS = J_;
              ja["OuqdQSnbCK_="] = BS;
              var T6 = "errored";
              try {
                T6 = lH["canPlayType"]("video/webm; codecs=\"vp8, vorbis\"") || "" || "nope";
              } catch (yz) {}
              var xA = T6;
              ja["bb&VCTjKTeg="] = xA;
              ky["stopInternal"]("video");
              var wO = ja;
              var ot = JSON.stringify(wO, function (zd, g8) {
                return g8 === undefined ? null : g8;
              });
              var zQ = ot.replace(uY, ji);
              var Zz = [];
              var zs = 0;
              while (zs < zQ.length) {
                Zz.push(zQ.charCodeAt(zs));
                zs += 1;
              }
              var TJ = Zz;
              var NK = TJ;
              var Vn = [];
              for (var rq in NK) {
                var qq = NK[rq];
                if (NK.hasOwnProperty(rq)) {
                  Vn.push(qq);
                }
              }
              var N4 = Vn;
              var fg = N4;
              var FV = fg.length;
              var Sq = 0;
              while (Sq + 1 < FV) {
                var QO = fg[Sq];
                fg[Sq] = fg[Sq + 1];
                fg[Sq + 1] = QO;
                Sq += 2;
              }
              var Cd = fg;
              var RL = Cd.length;
              var Tv = oE["slice"](0, 21).length;
              var bh = [];
              var gz = 0;
              while (gz < RL) {
                var Yd = Cd[gz];
                var rh = oE["slice"](0, 21)[gz % Tv] & 127;
                bh.push((Yd + rh) % 256 ^ 128);
                gz += 1;
              }
              var Z8 = bh;
              var Ci = Z8.length;
              var KM = oE["slice"](21, 45).length;
              var Dm = [];
              var fY = 0;
              while (fY < Ci) {
                Dm.push(Z8[fY]);
                Dm.push(oE["slice"](21, 45)[fY % KM]);
                fY += 1;
              }
              var Yf = Dm;
              var r0 = Yf.length;
              var ZW = [];
              var Vs = r0 - 1;
              while (Vs >= 0) {
                ZW.push(Yf[Vs]);
                Vs -= 1;
              }
              var rz = ZW;
              var mh = [];
              for (var vo in rz) {
                var Ss = rz[vo];
                if (rz.hasOwnProperty(vo)) {
                  var QT = String.fromCharCode(Ss);
                  mh.push(QT);
                }
              }
              var As = btoa(mh.join(""));
              nJ["Z+uRvYUrp/JV(A=="] = As;
              var HE = b5(836013910, Yn);
              var lL = [];
              var o0 = 0;
              while (o0 < 19) {
                lL.push(HE() & 255);
                o0 += 1;
              }
              var s4 = lL;
              var Ln = s4;
              ky["startInternal"]("audio");
              var kD = KF["createElement"]("audio");
              var KV = {};
              var HK = "errored";
              try {
                HK = kD["canPlayType"]("audio/ogg; codecs=\"vorbis\"") || "" || "nope";
              } catch (yh) {}
              var vP = HK;
              KV["Z(fPOgEq"] = vP;
              var eS = "errored";
              try {
                eS = kD["canPlayType"]("audio/mpeg") || "" || "nope";
              } catch (gU) {}
              var IM = eS;
              KV.ZbWZbEBr = IM;
              var ZZ = "errored";
              try {
                ZZ = kD["canPlayType"]("audio/wav; codecs=\"1\"") || "" || "nope";
              } catch (Sp) {}
              var nn = ZZ;
              KV["f-/GMw,l"] = nn;
              var EV = "errored";
              try {
                EV = kD["canPlayType"]("audio/x-m4a;") || kD["canPlayType"]("audio/aac;") || "nope";
              } catch (Fi) {}
              var Jz = EV;
              KV["ZbXLPlZ*"] = Jz;
              var a4 = "errored";
              try {
                a4 = kD["canPlayType"]([]) || "" || "nope";
              } catch (O3) {}
              var tG = a4;
              KV["ce-F$/vQWBWhB_E)$LOhFiOdYA(KXA=="] = tG;
              var wL = "errored";
              try {
                wL = kD["canPlayType"]("video/mp4; codecs=\"avc1.4D401E\"") || "" || "nope";
              } catch (eO) {}
              var Xc = wL;
              KV["az!Xk-,mnNYzisWSdtXqk(sk&R/gy)nX[I&&Am*EkbFUofriX+zTK$$t"] = Xc;
              ky["stopInternal"]("audio");
              var gq = KV;
              var Lc = JSON.stringify(gq, function (pV, Ac) {
                return Ac === undefined ? null : Ac;
              });
              var hq = Lc.replace(uY, ji);
              var iL = [];
              var NT = 0;
              while (NT < hq.length) {
                iL.push(hq.charCodeAt(NT));
                NT += 1;
              }
              var YN = iL;
              var IY = YN;
              var od = IY.length;
              var pi = Ln["slice"](0, 17).length;
              var CN = [];
              var dn = 113;
              var jM = 0;
              while (jM < od) {
                var Os = IY[jM];
                var yo = Ln["slice"](0, 17)[jM % pi];
                var LT = Os ^ yo ^ dn;
                CN.push(LT);
                dn = LT;
                jM += 1;
              }
              var Mo = CN;
              var LM = [];
              for (var I4 in Mo) {
                var eX = Mo[I4];
                if (Mo.hasOwnProperty(I4)) {
                  LM.push(eX);
                }
              }
              var Gg = LM;
              var VN = Gg;
              var wq = VN.length;
              var pw = 0;
              while (pw + 1 < wq) {
                var iO = VN[pw];
                VN[pw] = VN[pw + 1];
                VN[pw + 1] = iO;
                pw += 2;
              }
              var bR = VN;
              var Xh = bR.length;
              var Ql = Ln[17] % 7 + 1;
              var yd = [];
              var QG = 0;
              while (QG < Xh) {
                yd.push((bR[QG] << Ql | bR[QG] >> 8 - Ql) & 255);
                QG += 1;
              }
              var jX = yd;
              var n9 = [];
              for (var In in jX) {
                var uj = jX[In];
                if (jX.hasOwnProperty(In)) {
                  var c1 = String.fromCharCode(uj);
                  n9.push(c1);
                }
              }
              var jz = btoa(n9.join(""));
              nJ["Z+udsYknt+JS-w=="] = jz;
              var l0 = i_["vendor"];
              nJ["bLzNESi/LF&+InLW"] = l0;
              var xf = i_["product"];
              nJ["az!U/cUelI_u/(DeI!_="] = xf;
              var kC = i_["productSub"];
              nJ["feKZy/jTRAmoDlMu_rWmEQm&XzHJXw=="] = kC;
              var o6 = b5(694216168, Yn);
              var rM = [];
              var Or = 0;
              while (Or < 44) {
                rM.push(o6() & 255);
                Or += 1;
              }
              var KS = rM;
              var EE = KS;
              var Oz = {};
              var ni = Jq["chrome"];
              var om = ni !== null && typeof ni === "object";
              var hx = i_["appName"] === "Microsoft Internet Explorer" || i_["appName"] === "Netscape" && I_["test"](i_["userAgent"]);
              Oz["beGXuw=="] = hx;
              if (om) {
                try {
                  var Ym = {};
                  Ym["ZOCab_Vu,sJnkszUM,C/R&NDumieNDZSX+WlNQ&VUTCOwA=="] = fb(ni["loadTimes"]);
                  try {
                    var w4 = ni["app"];
                    if (w4) {
                      var yV = 10;
                      var N0 = [];
                      Object["getOwnPropertyNames"](w4)["slice"](0, yV)["forEach"](function (LY) {
                        function Kt(Sl) {
                          return Sl === "value" || !!Object["getOwnPropertyDescriptor"](w4, LY)[Sl];
                        }
                        function bj(vC) {
                          return vC[0] || "";
                        }
                        var OX = Object["getOwnPropertyDescriptor"](w4, LY) ? LA(Th(Object["keys"](Object["getOwnPropertyDescriptor"](w4, LY)), Kt), bj)["join"]("") : "";
                        N0[N0["length"]] = [LY, OX];
                      });
                      var qj = N0;
                      Ym["abnWIw)k"] = qj;
                    }
                  } catch (fA) {}
                  try {
                    var dW = [];
                    try {
                      for (var lP in Object["getOwnPropertyNames"](window["chrome"])) {
                        var lF = Object["getOwnPropertyNames"](window["chrome"])[lP];
                        if (Object["getOwnPropertyNames"](window["chrome"]).hasOwnProperty(lP)) {
                          (function (nr) {
                            for (var cn in Object["getOwnPropertyNames"](window["chrome"][nr])) {
                              var no = Object["getOwnPropertyNames"](window["chrome"][nr])[cn];
                              if (Object["getOwnPropertyNames"](window["chrome"][nr]).hasOwnProperty(cn)) {
                                (function (sh) {
                                  try {
                                    var S3 = Object["getOwnPropertyNames"](window["chrome"][nr][sh]);
                                    var gl = nr + "." + sh;
                                    var EP = S3 && S3["length"] || 0;
                                    dW[dW["length"]] = [gl, EP];
                                  } catch (j7) {}
                                })(no);
                              }
                            }
                          })(lF);
                        }
                      }
                    } catch (ak) {}
                    var Oc = dW;
                    Ym["e/eNoZQ-q/!d!L(ON!qV[eyiTnQ="] = Oc;
                  } catch (HG) {}
                  var GK = Ym;
                  Oz["Z(faBjKlI$LmOmjM"] = GK;
                } catch (qZ) {}
              }
              var jw = i_["webdriver"] ? true : false;
              Oz["bO[Qdk)aiC[OUgisU(G,ek+*"] = jw;
              (function (Yw) {
                if (Yw !== undefined) {
                  Oz["YOSPekVu(s!$gN&FI!CvV&VFtGaSOCFFVO-SAgHZTy-e_A=="] = Yw;
                }
              })(om);
              try {
                (function (jQ) {
                  if (jQ !== undefined) {
                    Oz["az!EgLI-sftF/KD&CrSgkqdsr,$,hoKRgR!$Jw=="] = jQ;
                  }
                })(i_["connection"]["rtt"]);
              } catch (IU) {}
              try {
                Oz["bOifakJp-)t_gdvDJpWqUnpKsWOTOTFVWeOYCD/nYQCk-g=="] = navigator["duckduckgo"] ? Object["keys"](navigator["duckduckgo"])["length"] : null;
              } catch (y1) {}
              var Zl = Oz;
              var zu = JSON.stringify(Zl, function (gO, Y3) {
                return Y3 === undefined ? null : Y3;
              });
              var mg = zu.replace(uY, ji);
              var dr = [];
              var EW = 0;
              while (EW < mg.length) {
                dr.push(mg.charCodeAt(EW));
                EW += 1;
              }
              var io = dr;
              var DQ = io;
              var F0W = DQ.length;
              var IX = [];
              var ce = F0W - 1;
              while (ce >= 0) {
                IX.push(DQ[ce]);
                ce -= 1;
              }
              var g0 = IX;
              var MJ = [];
              for (var tK in g0) {
                var JW = g0[tK];
                if (g0.hasOwnProperty(tK)) {
                  MJ.push(JW);
                }
              }
              var oI = MJ;
              var xS = oI;
              var Hn = xS.length;
              var jY = 0;
              while (jY + 1 < Hn) {
                var rQ = xS[jY];
                xS[jY] = xS[jY + 1];
                xS[jY + 1] = rQ;
                jY += 2;
              }
              var fa = xS;
              var Ws = fa.length;
              var kM = EE["slice"](0, 25).length;
              var rD = [];
              var RS = 0;
              while (RS < Ws) {
                rD.push(fa[RS]);
                rD.push(EE["slice"](0, 25)[RS % kM]);
                RS += 1;
              }
              var Sc = rD;
              var YP = Sc.length;
              var k1 = EE["slice"](25, 43).length;
              var Je = [];
              var Ea = 113;
              var sC = 0;
              while (sC < YP) {
                var QY = Sc[sC];
                var Jj = EE["slice"](25, 43)[sC % k1];
                var Qg = QY ^ Jj ^ Ea;
                Je.push(Qg);
                Ea = Qg;
                sC += 1;
              }
              var VG = Je;
              var aW = [];
              for (var Qs in VG) {
                var U6 = VG[Qs];
                if (VG.hasOwnProperty(Qs)) {
                  var ay = String.fromCharCode(U6);
                  aW.push(ay);
                }
              }
              var mS = btoa(aW.join(""));
              nJ["bThU/dYNh!,*(LHfJJo="] = mS;
              var Bm = b5(1513031664, Yn);
              var Ez = [];
              var HdO = 0;
              while (HdO < 58) {
                Ez.push(Bm() & 255);
                HdO += 1;
              }
              var wc = Ez;
              var Wb = wc;
              var Ju = {};
              (function (Mg) {
                if (Mg !== undefined) {
                  Ju["ei*fm(M(redf!rHmB(mtn(*_hqRapKOwlglvPQ=="] = Mg;
                }
              })(history["length"]);
              (function (a9) {
                if (a9 !== undefined) {
                  Ju["a!&dHiewJ&HBAEinSvzuzOrNOTLQS_OEk_M!!ctcy(oe_Y$XsNfYAg=="] = a9;
                }
              })(navigator["hardwareConcurrency"]);
              Ju.abnUCDKlKVjsMGLG = window["self"] !== window["top"];
              Ju["ei*V/NQPnoc&!rvVJZs="] = fb(navigator["getBattery"]);
              try {
                Ju["e+qb/M)$swaybjyYcJKcXka_T_mnLyafg*ataWriYiiVLHwr"] = console["debug"]["name"];
              } catch (hs) {}
              try {
                (function (We) {
                  if (We !== undefined) {
                    Ju["bZvgIyC&N[HcHU[iWO(gwurNMjnHXEGGlkYt)cxb_KEv,Lhinvn(IQ=="] = We;
                  }
                })(fb(console["debug"]));
              } catch (pr) {}
              Ju["eOen*czncD[DJXkyyBMBwOJokAn)b&GmgLzQJRgzvp,i/q,K*xUb[f)N+f)="] = window["_phantom"] !== undefined;
              Ju["fKzdATyrJlf[OVmDZgEN$/Ec,*,a!PzI_EE[UWCSGL_="] = window["callPhantom"] !== undefined;
              var MX = [];
              var RF = MX;
              Ju["bZvyMQSTAlTkJXSbTfv$$//YKiHJUleQhlYg/NRDxbQLxI!Uu*zjOQ=="] = RF;
              if (window["PERSISTENT"] !== undefined) {
                Ju["fPCBrZQ-q/!c!bPDOZSGyuimSnA="] = window["PERSISTENT"];
              }
              if (window["TEMPORARY"] !== undefined) {
                Ju.ePmLbVQBkDWdQQyoQKKwclqo = window["TEMPORARY"];
              }
              if (window["PerformanceObserver"] !== undefined) {
                var JX = {};
                try {
                  if (window["PerformanceObserver"]["supportedEntryTypes"] !== undefined) {
                    JX["fClYnKUtl*$o_YvcIYKQ-cFesnCbsK-wuu+Ddk*k)dF!jMffCbqjW[!e"] = window["PerformanceObserver"]["supportedEntryTypes"];
                  }
                } catch (DD) {}
                var AR = JX;
                Ju["a!&sLxKFDVv,OWmGad/N()&qBg&kf&G[uWkE[OF[,JEi(b$nsdbTCQ=="] = AR;
              }
              Ju["cf[QvJQ-seRQ-aXVA--*)deZbVc="] = "__SENTRY__" in window;
              var A6 = Ju;
              var pl = JSON.stringify(A6, function (ui, uW) {
                return uW === undefined ? null : uW;
              });
              var GT = pl.replace(uY, ji);
              var lf = [];
              var i5 = 0;
              while (i5 < GT.length) {
                lf.push(GT.charCodeAt(i5));
                i5 += 1;
              }
              var N8 = lf;
              var Uw = N8;
              var B3 = Uw.length;
              var Uu = [];
              var K8 = 0;
              while (K8 < B3) {
                Uu.push(Uw[(K8 + Wb[0]) % B3]);
                K8 += 1;
              }
              var aS = Uu;
              var Xd = aS.length;
              var rt = Wb["slice"](1, 30).length;
              var bB = [];
              var Cr = 0;
              while (Cr < Xd) {
                bB.push(aS[Cr]);
                bB.push(Wb["slice"](1, 30)[Cr % rt]);
                Cr += 1;
              }
              var dD = bB;
              var OV = dD.length;
              var gE = Wb["slice"](30, 57).length;
              var cA = [];
              var zv = 113;
              var Hz = 0;
              while (Hz < OV) {
                var rO = dD[Hz];
                var y7 = Wb["slice"](30, 57)[Hz % gE];
                var pq = rO ^ y7 ^ zv;
                cA.push(pq);
                zv = pq;
                Hz += 1;
              }
              var yT = cA;
              var hA = [];
              for (var Wd in yT) {
                var dh = yT[Wd];
                if (yT.hasOwnProperty(Wd)) {
                  hA.push(dh);
                }
              }
              var Hb = hA;
              var LD = Hb;
              var C_ = LD.length;
              var lr = 0;
              while (lr + 1 < C_) {
                var oq = LD[lr];
                LD[lr] = LD[lr + 1];
                LD[lr + 1] = oq;
                lr += 2;
              }
              var CU = LD;
              var ko = [];
              for (var aC in CU) {
                var bG = CU[aC];
                if (CU.hasOwnProperty(aC)) {
                  var xy = String.fromCharCode(bG);
                  ko.push(xy);
                }
              }
              var Rk = btoa(ko.join(""));
              nJ["bLzNESSzIVD[Knre"] = Rk;
              var p_ = {};
              (function (Rx) {
                if (Rx !== undefined) {
                  p_["a(vLFz+oIlPwP&CqT/H+zA=="] = Rx;
                }
              })(s9["location"]["protocol"]);
              var LE = p_;
              nJ["YbHaBjusKlvlKnmjRPr$xw=="] = LE;
              ky["startInternal"]("canvas_fonts");
              var ib = ["monospace", "sans-serif", "serif"];
              var Hr = ["ARNOPRO", "AVENIRLTPro", "AgencyFB", "AparajitaMT", "ArabicTypesetting", "ArialUnicodeMS", "AvantGardeBkBT", "BankGothicMdBT", "Batang", "Bauhaus93", "BiomeMT", "BitstreamVeraSansMono", "Calibri", "Century", "CenturyGothic", "Clarendon", "EUROSTILE", "EdwardianScript", "FranklinGothic", "FuturaBkBT", "FuturaMdBT", "GOTHAM", "GillSans", "GishaMT", "HELV", "Haettenschweiler", "HelveticaNeue", "HighTower", "Humanst521BT", "Impacted", "JuiceIT", "KokilaMT", "Leelawadee", "LetterGothic", "LevenimMT", "LucidaBright", "LucidaSans", "MSMincho", "MSOutlook", "MSReferenceSpecialty", "MSUIGothic", "MTExtra", "MYRIADPRO", "Marlett", "MeiryoUI", "MicrosoftUighur", "MinionPro", "MonotypeCorsiva", "PMingLiU", "Pristina", "SCRIPTINA", "SegoeUILight", "Serifa", "SimHei", "SmallFonts", "Staccato222BT", "TRAJANPRO", "UniversCE55Medium", "Vrinda", "ZWAdobeF"];
              var lY = "mmmmmmmmlli";
              var w8 = 0.1;
              var Mp = function (AO, AE) {
                return AO === AE || Math["abs"](AO - AE) < w8;
              };
              var e1 = s9["createElement"]("canvas")["getContext"]("2d");
              var sG = [];
              for (var SE in ib) {
                var bY = ib[SE];
                if (ib.hasOwnProperty(SE)) {
                  e1["font"] = "72px " + bY;
                  sG["push"]([bY, e1["measureText"](lY)]);
                }
              }
              var pk = [];
              for (var lGr in Hr) {
                var Nr = Hr[lGr];
                if (Hr.hasOwnProperty(lGr)) {
                  var Ay = false;
                  for (var ii in sG) {
                    var Q9 = sG[ii];
                    if (sG.hasOwnProperty(ii)) {
                      if (!Ay) {
                        var Mj = Q9[0];
                        var A_ = Q9[1];
                        e1["font"] = "72px " + Nr + ", " + Mj;
                        var p7 = e1["measureText"](lY);
                        try {
                          if (!Mp(p7["width"], A_["width"]) || !Mp(p7["actualBoundingBoxAscent"], A_["actualBoundingBoxAscent"]) || !Mp(p7["actualBoundingBoxDescent"], A_["actualBoundingBoxDescent"]) || !Mp(p7["actualBoundingBoxLeft"], A_["actualBoundingBoxLeft"]) || !Mp(p7["actualBoundingBoxRight"], A_["actualBoundingBoxRight"])) {
                            Ay = true;
                          }
                        } catch (p9) {}
                      }
                    }
                  }
                  if (Ay) {
                    pk["push"](Nr);
                  }
                }
              }
              ky["stopInternal"]("canvas_fonts");
              var jl = pk;
              nJ["e+SP&e/ETgO_ElQpwaa_AzaIdRvfSQ=="] = jl;
              var vy = {};
              vy["fa&dAT-pE[LHCEedfRoI_vYb*MkN)/vPxFU!XnaED-o="] = 0;
              vy["V((EGynGSqQZzZwoyMbSORBet+AUpq(V)&IZ/*OGCq)M,b[-QMg="] = 0;
              vy["fa&dAT-pE[LHCFmDbwgF&/_Q,N_j&end_EE*WmOZFqMQfCxRh+DuWXHPPVO)JyLl"] = 0;
              var Mt = [];
              try {
                var tx = 10;
                var br = function () {
                  return document["documentElement"]["children"];
                }();
                for (var pG in br) {
                  var L4 = br[pG];
                  if (br.hasOwnProperty(pG)) {
                    try {
                      if (typeof L4 === "object") {
                        if (L4["tagName"]["toUpperCase"]() === "SCRIPT") {
                          if (L4["src"]) {
                            vy["fa&dAT-pE[LHCEedfRoI_vYb*MkN)/vPxFU!XnaED-o="] = vy["fa&dAT-pE[LHCEedfRoI_vYb*MkN)/vPxFU!XnaED-o="] + 1;
                            if (Mt["length"] < tx) {
                              var oY = {};
                              var lm = L4["src"]["slice"](0, 1000)["replace"](jR, "$1" + CE)["replace"](Rf, CE + "$1");
                              oY["src"] = lm;
                              Mt[Mt["length"]] = oY;
                            }
                          } else {
                            vy["V((EGynGSqQZzZwoyMbSORBet+AUpq(V)&IZ/*OGCq)M,b[-QMg="] = vy["V((EGynGSqQZzZwoyMbSORBet+AUpq(V)&IZ/*OGCq)M,b[-QMg="] + 1;
                          }
                        }
                      } else {
                        vy["fa&dAT-pE[LHCFmDbwgF&/_Q,N_j&end_EE*WmOZFqMQfCxRh+DuWXHPPVO)JyLl"] = vy["fa&dAT-pE[LHCFmDbwgF&/_Q,N_j&end_EE*WmOZFqMQfCxRh+DuWXHPPVO)JyLl"] + 1;
                      }
                    } catch (LQ) {
                      try {
                        vy["ZTBKjr,[tvxyy,DXMJOW()Vas&GJoqa,pfCcaUds+*tvmvriH-yiWnhI"] = vy["ZTBKjr,[tvxyy,DXMJOW()Vas&GJoqa,pfCcaUds+*tvmvriH-yiWnhI"] || [];
                        vy["ZTBKjr,[tvxyy,DXMJOW()Vas&GJoqa,pfCcaUds+*tvmvriH-yiWnhI"]["push"](LQ["toString"]());
                      } catch (Tn) {
                        vy["ZTBKjr,[tvxyy,DXMJOW()Vas&GJoqa,pfCcaUds+*tvmvriH-yiWnhI"]["push"]("uncollectable");
                      }
                    }
                  }
                }
              } catch (tl) {
                try {
                  vy["ZTBKjr,[tvxyy,DXMJOW()Vas&GJoqa,pfCcaUds+*tvmvriH-yiWnhI"] = vy["ZTBKjr,[tvxyy,DXMJOW()Vas&GJoqa,pfCcaUds+*tvmvriH-yiWnhI"] || [];
                  vy["ZTBKjr,[tvxyy,DXMJOW()Vas&GJoqa,pfCcaUds+*tvmvriH-yiWnhI"]["push"](tl["toString"]());
                } catch (hj) {
                  vy["ZTBKjr,[tvxyy,DXMJOW()Vas&GJoqa,pfCcaUds+*tvmvriH-yiWnhI"]["push"]("uncollectable");
                }
              }
              vy["bb&PEyq*NEXxPl-EeR,QyugF*Mkn[dHl)[IZflakL,o="] = Mt;
              var qu = [];
              try {
                var dc = 10;
                var M1 = function () {
                  return document["head"]["children"];
                }();
                for (var MD in M1) {
                  var Wk = M1[MD];
                  if (M1.hasOwnProperty(MD)) {
                    try {
                      if (typeof Wk === "object") {
                        if (Wk["tagName"]["toUpperCase"]() === "SCRIPT") {
                          if (Wk["src"]) {
                            vy["fa&dAT-pE[LHCEedfRoI_vYb*MkN)/vPxFU!XnaED-o="] = vy["fa&dAT-pE[LHCEedfRoI_vYb*MkN)/vPxFU!XnaED-o="] + 1;
                            if (qu["length"] < dc) {
                              var KI = {};
                              var rP = Wk["src"]["slice"](0, 1000)["replace"](jR, "$1" + CE)["replace"](Rf, CE + "$1");
                              KI["src"] = rP;
                              qu[qu["length"]] = KI;
                            }
                          } else {
                            vy["V((EGynGSqQZzZwoyMbSORBet+AUpq(V)&IZ/*OGCq)M,b[-QMg="] = vy["V((EGynGSqQZzZwoyMbSORBet+AUpq(V)&IZ/*OGCq)M,b[-QMg="] + 1;
                          }
                        }
                      } else {
                        vy["fa&dAT-pE[LHCFmDbwgF&/_Q,N_j&end_EE*WmOZFqMQfCxRh+DuWXHPPVO)JyLl"] = vy["fa&dAT-pE[LHCFmDbwgF&/_Q,N_j&end_EE*WmOZFqMQfCxRh+DuWXHPPVO)JyLl"] + 1;
                      }
                    } catch (SL) {
                      try {
                        vy["bO[TdUwZlDGTTwKmXb+-eGCS"] = vy["bO[TdUwZlDGTTwKmXb+-eGCS"] || [];
                        vy["bO[TdUwZlDGTTwKmXb+-eGCS"]["push"](SL["toString"]());
                      } catch (TR) {
                        vy["bO[TdUwZlDGTTwKmXb+-eGCS"]["push"]("uncollectable");
                      }
                    }
                  }
                }
              } catch (AK) {
                try {
                  vy["bO[TdUwZlDGTTwKmXb+-eGCS"] = vy["bO[TdUwZlDGTTwKmXb+-eGCS"] || [];
                  vy["bO[TdUwZlDGTTwKmXb+-eGCS"]["push"](AK["toString"]());
                } catch (X2) {
                  vy["bO[TdUwZlDGTTwKmXb+-eGCS"]["push"]("uncollectable");
                }
              }
              vy["bb&KFi(cWP_="] = qu;
              var PA = [];
              try {
                var Iy = 10;
                var Bp = function () {
                  return document["body"]["children"];
                }();
                for (var Ya in Bp) {
                  var uc = Bp[Ya];
                  if (Bp.hasOwnProperty(Ya)) {
                    try {
                      if (typeof uc === "object") {
                        if (uc["tagName"]["toUpperCase"]() === "SCRIPT") {
                          if (uc["src"]) {
                            vy["fa&dAT-pE[LHCEedfRoI_vYb*MkN)/vPxFU!XnaED-o="] = vy["fa&dAT-pE[LHCEedfRoI_vYb*MkN)/vPxFU!XnaED-o="] + 1;
                            if (PA["length"] < Iy) {
                              var DC = {};
                              var cO = uc["src"]["slice"](0, 1000)["replace"](jR, "$1" + CE)["replace"](Rf, CE + "$1");
                              DC["src"] = cO;
                              PA[PA["length"]] = DC;
                            }
                          } else {
                            vy["V((EGynGSqQZzZwoyMbSORBet+AUpq(V)&IZ/*OGCq)M,b[-QMg="] = vy["V((EGynGSqQZzZwoyMbSORBet+AUpq(V)&IZ/*OGCq)M,b[-QMg="] + 1;
                          }
                        }
                      } else {
                        vy["fa&dAT-pE[LHCFmDbwgF&/_Q,N_j&end_EE*WmOZFqMQfCxRh+DuWXHPPVO)JyLl"] = vy["fa&dAT-pE[LHCFmDbwgF&/_Q,N_j&end_EE*WmOZFqMQfCxRh+DuWXHPPVO)JyLl"] + 1;
                      }
                    } catch (D4) {
                      try {
                        vy["cfCLbV,LjCmLVxq+RaeiYHiK"] = vy["cfCLbV,LjCmLVxq+RaeiYHiK"] || [];
                        vy["cfCLbV,LjCmLVxq+RaeiYHiK"]["push"](D4["toString"]());
                      } catch (v0) {
                        vy["cfCLbV,LjCmLVxq+RaeiYHiK"]["push"]("uncollectable");
                      }
                    }
                  }
                }
              } catch (TF) {
                try {
                  vy["cfCLbV,LjCmLVxq+RaeiYHiK"] = vy["cfCLbV,LjCmLVxq+RaeiYHiK"] || [];
                  vy["cfCLbV,LjCmLVxq+RaeiYHiK"]["push"](TF["toString"]());
                } catch (mU) {
                  vy["cfCLbV,LjCmLVxq+RaeiYHiK"]["push"]("uncollectable");
                }
              }
              vy["Z(fKFjPBQOU="] = PA;
              var jq = vy;
              nJ["fClG(*oBlo)*(KDONIo="] = jq;
              var Y_ = b5(187585459, Yn);
              var e8 = [];
              var Fr = 0;
              while (Fr < 49) {
                e8.push(Y_() & 255);
                Fr += 1;
              }
              var fT = e8;
              var yL = fT;
              function yP() {
                var gn = undefined;
                try {
                  (function () {
                    Function["prototype"]["toString"]["apply"](null);
                  })();
                } catch (Iu) {
                  if (Iu !== undefined && Iu !== null && Iu["stack"] && Iu["message"]) {
                    gn = Iu["message"];
                  }
                }
                var Xf = gn;
                var jD = Xf;
                return jD["slice"](-30);
              }
              function cLt() {
                var ZN = {};
                ZN["toString"] = 1;
                var ut = QE(function () {
                  Function["prototype"]["toString"]["apply"](ZN);
                })["slice"](-30);
                return ut;
              }
              function kR() {
                var SH = 37445;
                var Ls = 37446;
                var dl = true;
                try {
                  window["WebGLRenderingContext"]["prototype"]["getParameter"]["call"](null, SH);
                } catch (bi) {
                  dl = false;
                }
                var TK = dl;
                var w3 = TK;
                var Yy = true;
                try {
                  window["WebGLRenderingContext"]["prototype"]["getParameter"]["call"](null, Ls);
                } catch (Su) {
                  Yy = false;
                }
                var xaN = Yy;
                var Cg = xaN;
                return w3 || Cg;
              }
              var sg = zM("ZjNF(MIZiJEz,oLsCxIdLxu*SzrYQ_[KmEgI$Ppt!!Y/)JBKt*DVDzjVOQT[CA_!M-LihaBa[WzUuOCd" + Yn)["match"](R9)["map"](function (Wn) {
                return aQ(Wn, 16);
              });
              function T2() {
                return tZ["apply"](null, iS(""["replace"]["call"](c3, ij, ""))["slice"](-21)["map"](function (My, WA) {
                  return My["charCodeAt"](0) ^ sg[WA % sg["length"]] & 127;
                }));
              }
              var iK = {};
              try {
                iK["eN-sRH_dp*NteDP+KJaSoIJJvJ!pl,yflgl&JSYNj)J*[,&GPebyMweNTtcjsK*,c/+Svocpk)Zj[ob[Gre*)dSaaVOXdmRMQag="] = cLt();
              } catch (wR) {}
              try {
                iK["ZrbAHDKlNEXnKEiSdBMH&eh/kUO*ek!!bIX[DifGTZYYHU_B/DgH[vkL)tMhp-AsJaHO)s+NN_v*+A=="] = yP();
              } catch (M3) {}
              try {
                iK["ZtymNhzEfh+i(LTBF[BiORuMZ(VxtrWCj[YV(dAxsWrPyobKHNjKFzXHPh/wdnj_/XkWKgNB$KgXy!s/&z_u(Mo,_tQqopYvJHEBxf$$"] = kR();
              } catch (dJ) {}
              try {
                iK["e+Sk*tP,ezaOKHA(&AcOz/pwmAHpek-ZjrLCNxgzvJw!!b)b,gAQ_vwO/Po="] = T2();
              } catch (Ee) {}
              var PT = iK;
              var KX = JSON.stringify(PT, function (Xr, IT) {
                return IT === undefined ? null : IT;
              });
              var Z9 = KX.replace(uY, ji);
              var XR = [];
              var qm = 0;
              while (qm < Z9.length) {
                XR.push(Z9.charCodeAt(qm));
                qm += 1;
              }
              var V1 = XR;
              var V7U = V1;
              var mO = V7U.length;
              var Zv = yL["slice"](0, 22).length;
              var XT = [];
              var G0 = 113;
              var Tw = 0;
              while (Tw < mO) {
                var gd = V7U[Tw];
                var VX = yL["slice"](0, 22)[Tw % Zv];
                var co = gd ^ VX ^ G0;
                XT.push(co);
                G0 = co;
                Tw += 1;
              }
              var pz = XT;
              var s1 = pz.length;
              var Jl = yL["slice"](22, 48).length;
              var yF = [];
              var a1 = 0;
              while (a1 < s1) {
                yF.push(pz[a1]);
                yF.push(yL["slice"](22, 48)[a1 % Jl]);
                a1 += 1;
              }
              var oO = yF;
              var mB = [];
              for (var Ad in oO) {
                var Qd = oO[Ad];
                if (oO.hasOwnProperty(Ad)) {
                  var cI = String.fromCharCode(Qd);
                  mB.push(cI);
                }
              }
              var m7 = btoa(mB.join(""));
              nJ["euWTwevASwayFF)ixaKnEDqEdhjseg=="] = m7;
              var hb = {};
              var qk = 0;
              var cz = [];
              var hZ = {};
              var m6 = [];
              var Lb = Object["getOwnPropertyNames"](window);
              var dH = Lb["length"];
              var VU = 0;
              var wcN = null;
              try {
                while (VU < dH) {
                  wcN = Lb[VU];
                  if (qk < 50) {
                    if (wcN["length"] >= 30 && wcN["length"] < 100) {
                      qk += 1;
                      cz["push"](wcN);
                    }
                  }
                  try {
                    var tv = wcN["slice"](0, 3)["toLowerCase"]();
                    if (tv === "onb" || tv === "onu") {
                      var BK = Object["getOwnPropertyDescriptor"](window, wcN);
                      function BR(M0) {
                        return M0 === "value" || !!BK[M0];
                      }
                      function uK(O6) {
                        return O6[0] || "";
                      }
                      var vY = BK ? LA(Th(Object["keys"](BK), BR), uK)["join"]("") : "";
                      m6["push"]([wcN, vY]);
                    }
                  } catch (RH) {}
                  VU += 1;
                }
              } catch (AB) {}
              hb["a"] = cz["join"](";;;");
              hb["b"] = hZ;
              var d4 = b5(231443536, Yn);
              var dR = [];
              var zR = 0;
              while (zR < 72) {
                dR.push(d4() & 255);
                zR += 1;
              }
              var Lu = dR;
              var ID = Lu;
              var RN = JSON.stringify(m6, function (bg, W0) {
                return W0 === undefined ? null : W0;
              });
              var VB = RN.replace(uY, ji);
              var L9 = [];
              var Js = 0;
              while (Js < VB.length) {
                L9.push(VB.charCodeAt(Js));
                Js += 1;
              }
              var bH = L9;
              var gD = bH;
              var gC = [];
              for (var w9 in gD) {
                var QC = gD[w9];
                if (gD.hasOwnProperty(w9)) {
                  gC.push(QC);
                }
              }
              var Hi = gC;
              var Gb = Hi;
              var K3 = Gb.length;
              var c0 = 0;
              while (c0 + 1 < K3) {
                var ZH = Gb[c0];
                Gb[c0] = Gb[c0 + 1];
                Gb[c0 + 1] = ZH;
                c0 += 2;
              }
              var UT = Gb;
              var g4 = UT.length;
              var JR = ID["slice"](0, 24).length;
              var bC = [];
              var oR = 0;
              while (oR < g4) {
                var U_ = UT[oR];
                var h4 = ID["slice"](0, 24)[oR % JR] & 127;
                bC.push((U_ + h4) % 256 ^ 128);
                oR += 1;
              }
              var Au = bC;
              var oK = Au.length;
              var MF = ID["slice"](24, 54).length;
              var Q8 = [];
              var RM = 113;
              var Zm = 0;
              while (Zm < oK) {
                var OoV = Au[Zm];
                var G4 = ID["slice"](24, 54)[Zm % MF];
                var QU = OoV ^ G4 ^ RM;
                Q8.push(QU);
                RM = QU;
                Zm += 1;
              }
              var BO = Q8;
              var ad = BO.length;
              var d6 = ID["slice"](54, 71).length;
              var uT = [];
              var NA = 0;
              while (NA < ad) {
                uT.push(BO[NA]);
                uT.push(ID["slice"](54, 71)[NA % d6]);
                NA += 1;
              }
              var IL = uT;
              var t8 = [];
              for (var Xb in IL) {
                var TU = IL[Xb];
                if (IL.hasOwnProperty(Xb)) {
                  var xnU = String.fromCharCode(TU);
                  t8.push(xnU);
                }
              }
              var qt = btoa(t8.join(""));
              hb["c"] = qt;
              var UZ = hb;
              var Ck = UZ;
              var B_ = b5(1172444063, Yn);
              var Fp = [];
              var jV = 0;
              while (jV < 39) {
                Fp.push(B_() & 255);
                jV += 1;
              }
              var MP = Fp;
              var Dy = MP;
              var IK = 0;
              var Az = typeof Ck["a"] !== "string" ? "" + Ck["a"] : Ck["a"];
              while (IK < Az["length"]) {
                F7 = F7 >>> 8 ^ RE[(F7 ^ Az["charCodeAt"](IK)) & 255];
                IK += 1;
              }
              var b7 = Ck["a"];
              var yt = JSON.stringify(b7, function (NN, Ke) {
                return Ke === undefined ? null : Ke;
              });
              var GS6 = yt.replace(uY, ji);
              var M9 = [];
              var uN = 0;
              while (uN < GS6.length) {
                M9.push(GS6.charCodeAt(uN));
                uN += 1;
              }
              var Ab = M9;
              var Qn = Ab;
              var UH = Qn.length;
              var B6 = Dy["slice"](0, 16).length;
              var UI = [];
              var GM = 113;
              var gK = 0;
              while (gK < UH) {
                var Eo = Qn[gK];
                var yg = Dy["slice"](0, 16)[gK % B6];
                var IW = Eo ^ yg ^ GM;
                UI.push(IW);
                GM = IW;
                gK += 1;
              }
              var Ij = UI;
              var EL = Ij.length;
              var fz = [];
              var rb = EL - 1;
              while (rb >= 0) {
                fz.push(Ij[rb]);
                rb -= 1;
              }
              var et = fz;
              var Gr = et.length;
              var wN = Dy["slice"](16, 37).length;
              var fr = [];
              var LV = 0;
              while (LV < Gr) {
                var Y4 = et[LV];
                var qB = Dy["slice"](16, 37)[LV % wN] & 127;
                fr.push((Y4 + qB) % 256 ^ 128);
                LV += 1;
              }
              var M7q = fr;
              var PP = M7q.length;
              var kn = [];
              var A5 = 0;
              while (A5 < PP) {
                kn.push(M7q[(A5 + Dy[37]) % PP]);
                A5 += 1;
              }
              var bl = kn;
              var v9 = [];
              for (var Jc in bl) {
                var ea = bl[Jc];
                if (bl.hasOwnProperty(Jc)) {
                  var je = String.fromCharCode(ea);
                  v9.push(je);
                }
              }
              var mv = btoa(v9.join(""));
              nJ["eOeXxevAVRiWMHgz$Q,Ky+JonQToe_+YhrrLPg_mr,)t)asP(w_Z[+,c!eM="] = mv;
              nJ["Z(fcACy(N_blKnasVjE_(s_g,*,xz)r+,nMafUS+BLEXeytWu*zSZUv$HnCYAxrd"] = Ck["c"];
              var dx = b5(2886650022, Yn);
              var su = [];
              var Xk = 0;
              while (Xk < 4) {
                su.push(dx() & 255);
                Xk += 1;
              }
              var YO = su;
              var pL = YO;
              var FX = Object["getOwnPropertyNames"](window);
              var eC = 12;
              var of = 30;
              var Py = [];
              var Bg = new RegExp("[\\ud800-\\udbff]$");
              try {
                var Ha = [];
                for (var u0 in FX["slice"](-of)) {
                  var LO = FX["slice"](-of)[u0];
                  if (FX["slice"](-of).hasOwnProperty(u0)) {
                    Ha["push"](function (BG) {
                      return BG["substring"](0, eC)["replace"](Bg, "") + (BG["length"] > eC ? "$" : "");
                    }(LO));
                  }
                }
                var oM = Ha;
                Py = oM;
              } catch (W2) {}
              var n6 = Py;
              var Xm = n6;
              var j9 = JSON.stringify(Xm, function (KY, b8) {
                return b8 === undefined ? null : b8;
              });
              var kX = j9.replace(uY, ji);
              var Ae = [];
              var jo = 0;
              while (jo < kX.length) {
                Ae.push(kX.charCodeAt(jo));
                jo += 1;
              }
              var Fz = Ae;
              var Pu = Fz;
              var YX = Pu.length;
              var Qi = [];
              var NQ = 0;
              while (NQ < YX) {
                Qi.push(Pu[(NQ + pL[0]) % YX]);
                NQ += 1;
              }
              var Av = Qi;
              var Ja = Av.length;
              var lq = pL[1] % 7 + 1;
              var zr = [];
              var ur = 0;
              while (ur < Ja) {
                zr.push((Av[ur] << lq | Av[ur] >> 8 - lq) & 255);
                ur += 1;
              }
              var P9 = zr;
              var VH = P9.length;
              var yj = [];
              var rK = 0;
              while (rK < VH) {
                yj.push(P9[(rK + pL[2]) % VH]);
                rK += 1;
              }
              var I6 = yj;
              var C4 = [];
              for (var Ih in I6) {
                var UO = I6[Ih];
                if (I6.hasOwnProperty(Ih)) {
                  var Oj = String.fromCharCode(UO);
                  C4.push(Oj);
                }
              }
              var vN = btoa(C4.join(""));
              nJ["f/uXYlN,+Nh*iN(GEKO&T&tLtmSTOQ$pZ*[tPQXdVjePwQ=="] = vN;
              var Y0 = b5(4271953189, Yn);
              var zK = [];
              var Rj = 0;
              while (Rj < 25) {
                zK.push(Y0() & 255);
                Rj += 1;
              }
              var Sf = zK;
              var c2 = Sf;
              var nw = {};
              try {
                (function (WI) {
                  if (WI !== undefined) {
                    nw["YOyHq!M*seRC+w=="] = WI;
                  }
                })(window["visualViewport"]["width"]);
              } catch (PV) {}
              try {
                (function (O1) {
                  if (O1 !== undefined) {
                    nw["b(/JFSy(NkfiPmnN"] = O1;
                  }
                })(window["visualViewport"]["height"]);
              } catch (Vp) {}
              try {
                (function (le) {
                  if (le !== undefined) {
                    nw["beGSvoMtq/!c!Q=="] = le;
                  }
                })(window["visualViewport"]["scale"]);
              } catch (Al) {}
              var d9 = nw;
              var t5 = JSON.stringify(d9, function (hM, Px) {
                return Px === undefined ? null : Px;
              });
              var Ds = t5.replace(uY, ji);
              var wl = [];
              var sy = 0;
              while (sy < Ds.length) {
                wl.push(Ds.charCodeAt(sy));
                sy += 1;
              }
              var CY = wl;
              var js = CY;
              var t0 = js.length;
              var Tc = [];
              var yr = t0 - 1;
              while (yr >= 0) {
                Tc.push(js[yr]);
                yr -= 1;
              }
              var w7 = Tc;
              var zY = w7.length;
              var Dk = [];
              var ES = 0;
              while (ES < zY) {
                Dk.push(w7[(ES + c2[0]) % zY]);
                ES += 1;
              }
              var JL = Dk;
              var Mk = JL.length;
              var jK = c2["slice"](1, 24).length;
              var XN = [];
              var GC = 0;
              while (GC < Mk) {
                var Za = JL[GC];
                var EC = c2["slice"](1, 24)[GC % jK] & 127;
                XN.push((Za + EC) % 256 ^ 128);
                GC += 1;
              }
              var Qx = XN;
              var v8 = [];
              for (var rE in Qx) {
                var LJ = Qx[rE];
                if (Qx.hasOwnProperty(rE)) {
                  v8.push(LJ);
                }
              }
              var SK = v8;
              var Pn = SK;
              var tO = Pn.length;
              var NZ = 0;
              while (NZ + 1 < tO) {
                var nK = Pn[NZ];
                Pn[NZ] = Pn[NZ + 1];
                Pn[NZ + 1] = nK;
                NZ += 2;
              }
              var wX = Pn;
              var aD = [];
              for (var gW in wX) {
                var oX = wX[gW];
                if (wX.hasOwnProperty(gW)) {
                  var cT = String.fromCharCode(oX);
                  aD.push(cT);
                }
              }
              var gT = btoa(aD.join(""));
              nJ["beyafFYDuRyhTBIV-WFy/NJvhZN)!/,!L/+QTGfw"] = gT;
              var fy = undefined;
              try {
                var HX = KF;
                var TB = ["createAttribute", "createElement", "createElementNS"];
                var YV = [];
                for (var Pq in TB) {
                  var nY = TB[Pq];
                  if (TB.hasOwnProperty(Pq)) {
                    YV["push"](function (ny) {
                      return HX[ny];
                    }(nY));
                  }
                }
                var n1 = YV;
                var vX = n1;
                var Da = HX["implementation"]["createHTMLDocument"]("");
                for (var Se in TB) {
                  var eT = TB[Se];
                  if (TB.hasOwnProperty(Se)) {
                    vX[vX["length"]] = vX["indexOf"](Da[eT]) === -1 ? Da[eT] : undefined;
                  }
                }
                var Pk = 0;
                var c7 = [];
                for (var Va in vX) {
                  var WE = vX[Va];
                  if (vX.hasOwnProperty(Va)) {
                    c7["push"](function (XH) {
                      var aG = undefined;
                      try {
                        aG = XH ? XH["name"] : aG;
                      } catch (Sk) {}
                      var Q0 = b5(2047203916, Yn);
                      var ln = [];
                      var px = 0;
                      while (px < 43) {
                        ln.push(Q0() & 255);
                        px += 1;
                      }
                      var zS = ln;
                      var IS = zS;
                      var sB = JSON.stringify([Pk, aG], function (tQ, Dp) {
                        return Dp === undefined ? null : Dp;
                      });
                      var fR = sB.replace(uY, ji);
                      var xe = [];
                      var rR = 0;
                      while (rR < fR.length) {
                        xe.push(fR.charCodeAt(rR));
                        rR += 1;
                      }
                      var vI = xe;
                      var R4 = vI;
                      var U3 = [];
                      for (var vQ in R4) {
                        var xJ = R4[vQ];
                        if (R4.hasOwnProperty(vQ)) {
                          U3.push(xJ);
                        }
                      }
                      var hS = U3;
                      var f6 = hS;
                      var wvo = f6.length;
                      var vE = 0;
                      while (vE + 1 < wvo) {
                        var AF = f6[vE];
                        f6[vE] = f6[vE + 1];
                        f6[vE + 1] = AF;
                        vE += 2;
                      }
                      var C8 = f6;
                      var q1 = C8.length;
                      var Lw = [];
                      var ML = 0;
                      while (ML < q1) {
                        Lw.push(C8[(ML + IS[0]) % q1]);
                        ML += 1;
                      }
                      var Jb = Lw;
                      var Jk = Jb.length;
                      var Hy = IS["slice"](1, 24).length;
                      var iN = [];
                      var Aa2 = 113;
                      var qb = 0;
                      while (qb < Jk) {
                        var cx = Jb[qb];
                        var MN = IS["slice"](1, 24)[qb % Hy];
                        var VW = cx ^ MN ^ Aa2;
                        iN.push(VW);
                        Aa2 = VW;
                        qb += 1;
                      }
                      var JN = iN;
                      var eA = JN.length;
                      var iFT = IS["slice"](24, 42).length;
                      var cD = [];
                      var PY = 0;
                      while (PY < eA) {
                        var ie = JN[PY];
                        var vk = IS["slice"](24, 42)[PY % iFT] & 127;
                        cD.push((ie + vk) % 256 ^ 128);
                        PY += 1;
                      }
                      var s3 = cD;
                      var iI = [];
                      for (var TX in s3) {
                        var zMc = s3[TX];
                        if (s3.hasOwnProperty(TX)) {
                          var JZ = String.fromCharCode(zMc);
                          iI.push(JZ);
                        }
                      }
                      var sYD = btoa(iI.join(""));
                      var Ct = sYD;
                      Pk += 1;
                      return Ct;
                    }(WE));
                  }
                }
                var Fj = c7;
                fy = Fj;
              } catch (qo) {}
              var T1 = fy;
              (function (rx) {
                if (rx !== undefined) {
                  nJ["ZZP,Ow+YInTAAUqlTfv+&OnOMTrVTkuMkEAy(sdQ$qcZ$o$XgebqMA=="] = rx;
                }
              })(T1);
            });
            f9["push"](function () {
              var Dl = b5(2417636879, Yn);
              var cw = [];
              var uy = 0;
              while (uy < 25) {
                cw.push(Dl() & 255);
                uy += 1;
              }
              var H5 = cw;
              var Mx = H5;
              var SC = new RegExp("^_[a-zA-Z]");
              function Jh(mNT) {
                return SC["test"](mNT);
              }
              var MC = Jq["Object"]["getOwnPropertyNames"](Jq)["filter"](Jh);
              var Lz = 20;
              var jc = 30;
              var pn = [];
              var kT = new RegExp("[\\ud800-\\udbff]$");
              try {
                var PHt = [];
                for (var HS in MC["slice"](-jc)) {
                  var UM = MC["slice"](-jc)[HS];
                  if (MC["slice"](-jc).hasOwnProperty(HS)) {
                    PHt["push"](function (iF) {
                      return iF["substring"](0, Lz)["replace"](kT, "") + (iF["length"] > Lz ? "$" : "");
                    }(UM));
                  }
                }
                var kv = PHt;
                pn = kv;
              } catch (ZAX) {}
              var aOn = pn;
              var SA = aOn;
              var CZ = JSON.stringify(SA, function (k4, o5) {
                return o5 === undefined ? null : o5;
              });
              var iB = CZ.replace(uY, ji);
              var b_ = [];
              var fW = 0;
              while (fW < iB.length) {
                b_.push(iB.charCodeAt(fW));
                fW += 1;
              }
              var gG = b_;
              var fQl = gG;
              var z0 = fQl.length;
              var Vy = [];
              var OI = z0 - 1;
              while (OI >= 0) {
                Vy.push(fQl[OI]);
                OI -= 1;
              }
              var G4S = Vy;
              var Wh = G4S.length;
              var d5 = Mx["slice"](0, 24).length;
              var yH = [];
              var wFQ = 0;
              while (wFQ < Wh) {
                var hn = G4S[wFQ];
                var ip = Mx["slice"](0, 24)[wFQ % d5] & 127;
                yH.push((hn + ip) % 256 ^ 128);
                wFQ += 1;
              }
              var VO = yH;
              var q6 = [];
              for (var rT in VO) {
                var d_ = VO[rT];
                if (VO.hasOwnProperty(rT)) {
                  q6.push(d_);
                }
              }
              var oH = q6;
              var Zw = oH;
              var aU6 = Zw.length;
              var qs = 0;
              while (qs + 1 < aU6) {
                var Hp = Zw[qs];
                Zw[qs] = Zw[qs + 1];
                Zw[qs + 1] = Hp;
                qs += 2;
              }
              var Cx = Zw;
              var qL = [];
              for (var op in Cx) {
                var mi = Cx[op];
                if (Cx.hasOwnProperty(op)) {
                  var Fd = String.fromCharCode(mi);
                  qL.push(Fd);
                }
              }
              var fE = btoa(qL.join(""));
              nJ["eOeXxevAVRiWMGoh[gEOz+thjhf+bWO_qZXkETgTn()dwZs/&z_p-*,s$dM="] = fE;
            });
            f9["push"](function () {
              nJ["bTh,vJAYlN!k&ZHGJJqZq,lCtpRskqa$vCNEFg=="] = !!window["reeseSkipExpirationCheck"];
            });
            f9["push"](function () {
              nJ["YbHaBjOkNUTmKWS+UjUh+*I/yvcAm!FW"] = true;
            });
            f9["push"](function () {
              try {
                (function (Bb) {
                  if (Bb !== undefined) {
                    nJ["Z+aOaGs+uRyoRQ_K&FRd_+RZpLJawdgfA*One$XC"] = Bb;
                  }
                })(fb(window["Worker"]));
              } catch (B8) {}
              try {
                nJ["e/qWcE_YnzqOYyss+nJ(*cJ/gpR[(eotNuaUSHHm"] = typeof WebAssembly === "object";
              } catch (bd) {
                nJ["e/qWcE_YnzqOYyss+nJ(*cJ/gpR[(eotNuaUSHHm"] = null;
              }
            });
            f9["push"](function () {
              var JM = b5(1506186811, Yn);
              var Hap = [];
              var iv = 0;
              while (iv < 33) {
                Hap.push(JM() & 255);
                iv += 1;
              }
              var uS = Hap;
              var IA = uS;
              var Z_ = {};
              Z_.bLzAHDKlM_LwLHzY = [];
              var i7 = [];
              try {
                var Ce = [["a!&dHiewJ&HBAEinSvzuzOrNOTLQS_OEk_M!!ctcy(oe_Y$XsNfYAg==", function (Xg) {
                  return Xg["navigator"]["hardwareConcurrency"];
                }], ["bLzNESi/LF&THFGLbQoexOIP*Mk(xdjs*GUUc$[vJYA=", function (sH) {
                  return sH["navigator"]["vendor"];
                }], ["fJXrNA/gbIIl)a)b/PLhCihmncowgpzn+XgJ(*KHDqslyIWCZOw=", function (G7) {
                  return (G7["navigator"]["languages"] || [])["join"](",");
                }], ["ZuKOe_li(s!,jcffOomZYXlJp&WBKzRQSPKKGi/&ZAW$+w==", function (dT) {
                  return dT["navigator"]["plugins"]["length"];
                }], ["ObXJ!c*h!bA+h*enR+ruopDeIxk=", function (kr) {
                  return new kr["Audio"]()["canPlayType"]("video/mp4; codecs=\"avc1.42E01E\"");
                }], ["ePSbt,oknst/xpTkAq+*)d-Qb$U=", function (Dh) {
                  return (Dh["chrome"] || {})["app"];
                }]];
                var ey = null;
                var N_ = {};
                N_["symbol"] = "bLzAHDKlM_LwLHzY";
                ey = KF["createElement"]("div");
                ey["style"]["display"] = "none";
                ey["innerHTML"] = "<iframe srcdoc=1></iframe>";
                KF["body"]["appendChild"](ey);
                N_["window"] = ey["querySelector"]("iframe")["contentWindow"];
                N_["container"] = ey;
                var Zg = N_;
                i7 = [Zg];
                for (var QSb in Ce) {
                  var Xv = Ce[QSb];
                  if (Ce.hasOwnProperty(QSb)) {
                    var VF = Xv[0];
                    var Po = Xv[1];
                    for (var Tq in i7) {
                      var I7 = i7[Tq];
                      if (i7.hasOwnProperty(Tq)) {
                        var JF = I7["symbol"];
                        var y_ = I7["window"];
                        var y9 = null;
                        var yv = null;
                        try {
                          y9 = Po(window);
                          var ma = (typeof y9)[0];
                          yv = ma;
                        } catch (Vb) {
                          yv = "e";
                        }
                        var pF = [y9, yv];
                        var n5 = pF;
                        var Kq = null;
                        var DX = null;
                        try {
                          Kq = Po(y_);
                          var fK = (typeof Kq)[0];
                          DX = fK;
                        } catch (tq) {
                          DX = "e";
                        }
                        var J2 = [Kq, DX];
                        var CV = J2;
                        var iQ = n5[0] === CV[0];
                        var OM = Z_[JF];
                        OM[OM["length"]] = [VF, n5[1], CV[1], iQ];
                      }
                    }
                  }
                }
              } catch (ve) {}
              for (var sl in i7) {
                var MOv = i7[sl];
                if (i7.hasOwnProperty(sl)) {
                  try {
                    var X0 = MOv["container"];
                    X0["parentElement"]["removeChild"](X0);
                  } catch (Oy) {}
                }
              }
              var Fu = Z_;
              var GO = JSON.stringify(Fu, function (Fn, pe) {
                return pe === undefined ? null : pe;
              });
              var uM = GO.replace(uY, ji);
              var yW = [];
              var MM = 0;
              while (MM < uM.length) {
                yW.push(uM.charCodeAt(MM));
                MM += 1;
              }
              var b2 = yW;
              var d8 = b2;
              var mz = d8.length;
              var rf = IA[0] % 7 + 1;
              var jN_ = [];
              var X8 = 0;
              while (X8 < mz) {
                jN_.push((d8[X8] << rf | d8[X8] >> 8 - rf) & 255);
                X8 += 1;
              }
              var yp = jN_;
              var Up = yp.length;
              var ql = IA["slice"](1, 31).length;
              var wU = [];
              var Kha = 0;
              while (Kha < Up) {
                var x4 = yp[Kha];
                var UC = IA["slice"](1, 31)[Kha % ql] & 127;
                wU.push((x4 + UC) % 256 ^ 128);
                Kha += 1;
              }
              var oC = wU;
              var Zp = oC.length;
              var rTL = IA[31] % 7 + 1;
              var Ao = [];
              var j_ = 0;
              while (j_ < Zp) {
                Ao.push((oC[j_] << rTL | oC[j_] >> 8 - rTL) & 255);
                j_ += 1;
              }
              var TP = Ao;
              var yZL = [];
              for (var aB in TP) {
                var OW = TP[aB];
                if (TP.hasOwnProperty(aB)) {
                  var yjy = String.fromCharCode(OW);
                  yZL.push(yjy);
                }
              }
              var G_ = btoa(yZL.join(""));
              nJ["YbHaBi+,MUD*MmK,QSYZw/Me(dAv_dTg)GEJblyuJIE="] = G_;
            });
            f9["push"](function () {
              var E_ = b5(215464049, Yn);
              var fk = [];
              var ZM = 0;
              while (ZM < 71) {
                fk.push(E_() & 255);
                ZM += 1;
              }
              var hp = fk;
              var ZK = hp;
              var s6 = {};
              try {
                s6["YbHcACi/KVjWGUmTbgk[(MUo_u)TiI$K"] = Pr(function () {
                  return Function["prototype"]["toString"];
                });
                s6["ey!uqpgQmtByy!(JOYeBs!$WrY*-hIaVngFqOA=="] = Pr(function () {
                  return JSON["stringify"];
                });
                s6["V((VLRT$d-wP_,Mn[jgo-sQ[[N,mrrYPE_Y*+fpy(qQBuPWiTu&*hKwz&R/_&+v$,rffdkWe"] = Pr(function () {
                  return Object["getOwnPropertyDescriptor"];
                });
                s6["ZDFP!tkCuKEez!b,HaM="] = Pr(function () {
                  return Function["prototype"]["call"];
                });
                s6["eKjHGyaxC&rFClOJecfL+Q=="] = Pr(function () {
                  return Function["prototype"]["apply"];
                });
                s6["ZjNF(NIJs-oVxJ&zHqA="] = Pr(function () {
                  return Function["prototype"]["bind"];
                });
                s6["V*a*W[I&tRCecyAnyUFDze*Sua*ZwsgPBNSqdlrN"] = Pr(function () {
                  return window["WebGLRenderingContext"]["prototype"]["getParameter"];
                });
                s6["avW$!)/kZCmfOX)C+Z-bLB+hSSfdSw=="] = Pr(function () {
                  return navigator["getBattery"];
                });
                s6["Z*[hMQr,aM$+/qTwHcb!Hz[!SeURU_tkc,U="] = Pr(function () {
                  return console["debug"];
                });
                s6["a++Ddk*k(Mx_gcrSBLezS[$drnyLIRVxbdelNQbeSSiR&w=="] = Pr(function () {
                  return window["chrome"]["loadTimes"];
                });
                s6["ZzJJjb)&u/FX(rjvFKqvna!lja*Rr-OwlglhMw=="] = Pr(function () {
                  return Jq["Object"]["getOwnPropertyDescriptor"](Jq, "window")["get"];
                });
              } catch (Ox) {}
              var xM = s6;
              var X4 = JSON.stringify(xM, function (Yc, Pa) {
                return Pa === undefined ? null : Pa;
              });
              var FW = X4.replace(uY, ji);
              var h3 = [];
              var Is = 0;
              while (Is < FW.length) {
                h3.push(FW.charCodeAt(Is));
                Is += 1;
              }
              var x7 = h3;
              var so = x7;
              var qx = so.length;
              var qG = [];
              var I0 = 0;
              while (I0 < qx) {
                qG.push(so[(I0 + ZK[0]) % qx]);
                I0 += 1;
              }
              var Fx = qG;
              var NR = Fx.length;
              var NX = ZK["slice"](1, 17).length;
              var g3 = [];
              var lJ = 0;
              while (lJ < NR) {
                var QB = Fx[lJ];
                var IcP = ZK["slice"](1, 17)[lJ % NX] & 127;
                g3.push((QB + IcP) % 256 ^ 128);
                lJ += 1;
              }
              var mWV = g3;
              var giO = mWV.length;
              var Ey = ZK["slice"](17, 46).length;
              var aR = [];
              var diA = 113;
              var ro = 0;
              while (ro < giO) {
                var Cb = mWV[ro];
                var sX = ZK["slice"](17, 46)[ro % Ey];
                var mK = Cb ^ sX ^ diA;
                aR.push(mK);
                diA = mK;
                ro += 1;
              }
              var Qe = aR;
              var th = Qe.length;
              var Gn = ZK["slice"](46, 70).length;
              var bo = [];
              var Hd = 0;
              while (Hd < th) {
                var IQ = Qe[Hd];
                var V2 = ZK["slice"](46, 70)[Hd % Gn] & 127;
                bo.push((IQ + V2) % 256 ^ 128);
                Hd += 1;
              }
              var cm = bo;
              var QM = [];
              for (var igV in cm) {
                var WT = cm[igV];
                if (cm.hasOwnProperty(igV)) {
                  var GW = String.fromCharCode(WT);
                  QM.push(GW);
                }
              }
              var eIA = btoa(QM.join(""));
              nJ["buqGc_ph-MhwhdzEIpGDe_x)v[[YMjZSQviTAzzkbw-q!A=="] = eIA;
            });
            f9["push"](function () {
              var oD = undefined;
              var W7 = 3;
              var HH = 50000;
              var Vu = Jq["dump"];
              var Ex = Jq["btoa"];
              try {
                var e6 = Jq["String"]["fromCharCode"](8203)["repeat"](483);
                var on = undefined;
                var WS = 25;
                if (typeof Vu === "function") {
                  try {
                    var F8 = Jq["performance"]["now"]();
                    var Ft = F8;
                    var A5C = 0;
                    while (A5C < HH && Ft - F8 < W7) {
                      var Na = Jq["Math"]["min"](A5C + WS, HH);
                      while (A5C < Na) {
                        Vu(e6);
                        A5C += 1;
                      }
                      Ft = Jq["performance"]["now"]();
                    }
                    on = [Ft - F8, A5C];
                  } catch (yD) {
                    on = [null, null];
                  }
                }
                var WK = on;
                var XIH = WK;
                if (XIH !== undefined) {
                  oD = {};
                  oD["fa&WCibUXPk="] = XIH[0];
                  oD["fPCBrYQqoPVH/p(uF(q&+)mHf_U="] = XIH[1];
                  var uQ = undefined;
                  var iH = 25;
                  if (typeof Ex === "function") {
                    try {
                      var bjN = Jq["performance"]["now"]();
                      var UR = bjN;
                      var pN = 0;
                      while (pN < HH && UR - bjN < W7) {
                        var fn = Jq["Math"]["min"](pN + iH, HH);
                        while (pN < fn) {
                          Ex("a");
                          pN += 1;
                        }
                        UR = Jq["performance"]["now"]();
                      }
                      uQ = [UR - bjN, pN];
                    } catch (Q4) {
                      uQ = [null, null];
                    }
                  }
                  var Ps_ = uQ;
                  var zp5 = Ps_;
                  if (zp5 !== undefined) {
                    oD["fKzRDTDCSO_="] = zp5[0];
                    oD["fPCBrYQqoPVH/p(uBquk-NuVa$E="] = zp5[1];
                  }
                }
              } catch (rC) {}
              var A8 = oD;
              var lN = A8;
              if (lN !== undefined) {
                var yZ = b5(1529465417, Yn);
                var Qw = [];
                var Hk = 0;
                while (Hk < 22) {
                  Qw.push(yZ() & 255);
                  Hk += 1;
                }
                var Ia = Qw;
                var MI = Ia;
                var QN = JSON.stringify(lN, function (G8, EJ) {
                  return EJ === undefined ? null : EJ;
                });
                var pA = QN.replace(uY, ji);
                var HN = [];
                var ar = 0;
                while (ar < pA.length) {
                  HN.push(pA.charCodeAt(ar));
                  ar += 1;
                }
                var KG = HN;
                var rJ = KG;
                var OY = rJ.length;
                var fdX = [];
                var EH = 0;
                while (EH < OY) {
                  fdX.push(rJ[(EH + MI[0]) % OY]);
                  EH += 1;
                }
                var nf = fdX;
                var VkR = nf.length;
                var SB = MI["slice"](1, 20).length;
                var C3 = [];
                var wv = 113;
                var kH = 0;
                while (kH < VkR) {
                  var KPE = nf[kH];
                  var Mm = MI["slice"](1, 20)[kH % SB];
                  var iC = KPE ^ Mm ^ wv;
                  C3.push(iC);
                  wv = iC;
                  kH += 1;
                }
                var hX = C3;
                var mf = hX.length;
                var oZ = [];
                var Lhy = mf - 1;
                while (Lhy >= 0) {
                  oZ.push(hX[Lhy]);
                  Lhy -= 1;
                }
                var HNX = oZ;
                var UA = HNX.length;
                var DV = MI[20] % 7 + 1;
                var Nl = [];
                var oo = 0;
                while (oo < UA) {
                  Nl.push((HNX[oo] << DV | HNX[oo] >> 8 - DV) & 255);
                  oo += 1;
                }
                var Fs = Nl;
                var Oq = [];
                for (var o2 in Fs) {
                  var f2 = Fs[o2];
                  if (Fs.hasOwnProperty(o2)) {
                    var dj = String.fromCharCode(f2);
                    Oq.push(dj);
                  }
                }
                var yR = btoa(Oq.join(""));
                nJ["bzpL,tcMhJ_l*L/RK!U="] = yR;
              }
              var Hs = b5(1850310790, Yn);
              var m3s = [];
              var GI = 0;
              while (GI < 59) {
                m3s.push(Hs() & 255);
                GI += 1;
              }
              var Sd = m3s;
              var Ui = Sd;
              var NO = [];
              var aE = Jq["String"]["prototype"]["replace"];
              try {
                for (var mo in [["bLzNESi/LF&THFGLbQoexOIP*Mk(xdjs*GUUc$[vJYA=", function () {
                  Jq["Object"]["getPrototypeOf"](Jq["navigator"])["vendor"];
                }], ["fJXrNA/gbIIl)a)b/PLhCihmit_/jbLJ$VQmwPWgKI_D(qOkQso=", function () {
                  Jq["Object"]["getPrototypeOf"](Jq["navigator"])["mimeTypes"];
                }], ["fJXrNA/gbIIl)a)b/PLhCihmncowgpzn+XgJ(*KHDqslyIWCZOw=", function () {
                  Jq["Object"]["getPrototypeOf"](Jq["navigator"])["languages"];
                }], ["VwJxtY,Ggct/xo(ZN,mHtZtQvpxzjbWmsC*EFg==", function () {
                  Jq["WebGL2RenderingContext"]["prototype"]["toString"]();
                }], ["YTRZnbU*q+Ff!q&-CrS,ir$[mrhCvIibhRprOQ==", function () {
                  Jq["Function"]["prototype"]["toString"]["apply"]();
                }], ["Z(fcAD[qKFnhLme*VTI)!thPsGKXUF!pYovmHjfWUIs_MWEt!yMm+),)weAMioUJAob,xPCyCHTX_g==", function () {
                  Jq["Object"]["getPrototypeOf"](Jq["navigator"])["hardwareConcurrency"];
                }], ["b/-D!N_ntQCjfyWBfJ-bWXOBfHqTGxGogdS/e_LKSAKMNWYx", function () {
                  Jq["WebGL2RenderingContext"]["prototype"]["getParameter"]();
                }], ["bfKO&OnCURyoDlUeyBMBwOhiihPpenahsY&kESwHjKwE[JUx$zU,+tgq+/_=", function () {
                  Jq["Object"]["getPrototypeOf"](Jq["navigator"])["deviceMemory"];
                }], ["ei*Vkb_$j)Vm&,/YJYaH/t!BtHabsLqks+aKf_$m(Mx_gc&VL!yVbUd&", function () {
                  Jq["Object"]["getPrototypeOf"](Jq["navigator"])["permissions"];
                }]]) {
                  var Z8l = [["bLzNESi/LF&THFGLbQoexOIP*Mk(xdjs*GUUc$[vJYA=", function () {
                    Jq["Object"]["getPrototypeOf"](Jq["navigator"])["vendor"];
                  }], ["fJXrNA/gbIIl)a)b/PLhCihmit_/jbLJ$VQmwPWgKI_D(qOkQso=", function () {
                    Jq["Object"]["getPrototypeOf"](Jq["navigator"])["mimeTypes"];
                  }], ["fJXrNA/gbIIl)a)b/PLhCihmncowgpzn+XgJ(*KHDqslyIWCZOw=", function () {
                    Jq["Object"]["getPrototypeOf"](Jq["navigator"])["languages"];
                  }], ["VwJxtY,Ggct/xo(ZN,mHtZtQvpxzjbWmsC*EFg==", function () {
                    Jq["WebGL2RenderingContext"]["prototype"]["toString"]();
                  }], ["YTRZnbU*q+Ff!q&-CrS,ir$[mrhCvIibhRprOQ==", function () {
                    Jq["Function"]["prototype"]["toString"]["apply"]();
                  }], ["Z(fcAD[qKFnhLme*VTI)!thPsGKXUF!pYovmHjfWUIs_MWEt!yMm+),)weAMioUJAob,xPCyCHTX_g==", function () {
                    Jq["Object"]["getPrototypeOf"](Jq["navigator"])["hardwareConcurrency"];
                  }], ["b/-D!N_ntQCjfyWBfJ-bWXOBfHqTGxGogdS/e_LKSAKMNWYx", function () {
                    Jq["WebGL2RenderingContext"]["prototype"]["getParameter"]();
                  }], ["bfKO&OnCURyoDlUeyBMBwOhiihPpenahsY&kESwHjKwE[JUx$zU,+tgq+/_=", function () {
                    Jq["Object"]["getPrototypeOf"](Jq["navigator"])["deviceMemory"];
                  }], ["ei*Vkb_$j)Vm&,/YJYaH/t!BtHabsLqks+aKf_$m(Mx_gc&VL!yVbUd&", function () {
                    Jq["Object"]["getPrototypeOf"](Jq["navigator"])["permissions"];
                  }]][mo];
                  if ([["bLzNESi/LF&THFGLbQoexOIP*Mk(xdjs*GUUc$[vJYA=", function () {
                    Jq["Object"]["getPrototypeOf"](Jq["navigator"])["vendor"];
                  }], ["fJXrNA/gbIIl)a)b/PLhCihmit_/jbLJ$VQmwPWgKI_D(qOkQso=", function () {
                    Jq["Object"]["getPrototypeOf"](Jq["navigator"])["mimeTypes"];
                  }], ["fJXrNA/gbIIl)a)b/PLhCihmncowgpzn+XgJ(*KHDqslyIWCZOw=", function () {
                    Jq["Object"]["getPrototypeOf"](Jq["navigator"])["languages"];
                  }], ["VwJxtY,Ggct/xo(ZN,mHtZtQvpxzjbWmsC*EFg==", function () {
                    Jq["WebGL2RenderingContext"]["prototype"]["toString"]();
                  }], ["YTRZnbU*q+Ff!q&-CrS,ir$[mrhCvIibhRprOQ==", function () {
                    Jq["Function"]["prototype"]["toString"]["apply"]();
                  }], ["Z(fcAD[qKFnhLme*VTI)!thPsGKXUF!pYovmHjfWUIs_MWEt!yMm+),)weAMioUJAob,xPCyCHTX_g==", function () {
                    Jq["Object"]["getPrototypeOf"](Jq["navigator"])["hardwareConcurrency"];
                  }], ["b/-D!N_ntQCjfyWBfJ-bWXOBfHqTGxGogdS/e_LKSAKMNWYx", function () {
                    Jq["WebGL2RenderingContext"]["prototype"]["getParameter"]();
                  }], ["bfKO&OnCURyoDlUeyBMBwOhiihPpenahsY&kESwHjKwE[JUx$zU,+tgq+/_=", function () {
                    Jq["Object"]["getPrototypeOf"](Jq["navigator"])["deviceMemory"];
                  }], ["ei*Vkb_$j)Vm&,/YJYaH/t!BtHabsLqks+aKf_$m(Mx_gc&VL!yVbUd&", function () {
                    Jq["Object"]["getPrototypeOf"](Jq["navigator"])["permissions"];
                  }]].hasOwnProperty(mo)) {
                    (function (dV) {
                      var S1 = [dV[0], "ZjNF(NgDkos$!LXbNYs="];
                      Jq["String"]["prototype"]["replace"] = function (Cko, aX) {
                        S1 = [dV[0], "ZLTHGyaxN_bzL&XR"];
                        return aE["call"](this, Cko, aX);
                      };
                      try {
                        dV[1]();
                      } catch (RDR) {}
                      NO[NO["length"]] = S1;
                    })(Z8l);
                  }
                }
              } catch (as) {}
              Jq["String"]["prototype"]["replace"] = aE;
              var ZG = NO;
              var wE = JSON.stringify(ZG, function (kt, XG) {
                return XG === undefined ? null : XG;
              });
              var Yq = wE.replace(uY, ji);
              var Ipd = [];
              var z7 = 0;
              while (z7 < Yq.length) {
                Ipd.push(Yq.charCodeAt(z7));
                z7 += 1;
              }
              var ge = Ipd;
              var hO = ge;
              var ms = hO.length;
              var cTT = Ui["slice"](0, 28).length;
              var nA = [];
              var rH = 0;
              while (rH < ms) {
                var sc = hO[rH];
                var TMV = Ui["slice"](0, 28)[rH % cTT] & 127;
                nA.push((sc + TMV) % 256 ^ 128);
                rH += 1;
              }
              var x8 = nA;
              var e0 = x8.length;
              var YB = Ui["slice"](28, 58).length;
              var GD = [];
              var sv = 0;
              while (sv < e0) {
                var kl = x8[sv];
                var KT = Ui["slice"](28, 58)[sv % YB] & 127;
                GD.push((kl + KT) % 256 ^ 128);
                sv += 1;
              }
              var HF = GD;
              var pa = [];
              for (var sE in HF) {
                var lX = HF[sE];
                if (HF.hasOwnProperty(sE)) {
                  var jE = String.fromCharCode(lX);
                  pa.push(jE);
                }
              }
              var p8 = btoa(pa.join(""));
              nJ["V-HbGDSjP[nMDV[yT/n[$OHGKiHJUleQhlYg/NRD_-If_INZv*jIEg=="] = p8;
              var YD = b5(3231912067, Yn);
              var WV = [];
              var MW = 0;
              while (MW < 44) {
                WV.push(YD() & 255);
                MW += 1;
              }
              var zp = WV;
              var MUQ = zp;
              var TM = (F7 ^ -1) >>> 0;
              var MH = JSON.stringify(TM, function (WW, my) {
                return my === undefined ? null : my;
              });
              var V5 = MH.replace(uY, ji);
              var Ng = [];
              var ZY = 0;
              while (ZY < V5.length) {
                Ng.push(V5.charCodeAt(ZY));
                ZY += 1;
              }
              var tm = Ng;
              var fI = tm;
              var zKH = fI.length;
              var fw = [];
              var lh = 0;
              while (lh < zKH) {
                fw.push(fI[(lh + MUQ[0]) % zKH]);
                lh += 1;
              }
              var N2 = fw;
              var tg = N2.length;
              var iD = MUQ[1] % 7 + 1;
              var qz = [];
              var Zx8 = 0;
              while (Zx8 < tg) {
                qz.push((N2[Zx8] << iD | N2[Zx8] >> 8 - iD) & 255);
                Zx8 += 1;
              }
              var wk = qz;
              var GP = wk.length;
              var sQ = MUQ["slice"](2, 20).length;
              var Lk = [];
              var Bl = 0;
              while (Bl < GP) {
                Lk.push(wk[Bl]);
                Lk.push(MUQ["slice"](2, 20)[Bl % sQ]);
                Bl += 1;
              }
              var K2 = Lk;
              var Lx = K2.length;
              var Ha0 = MUQ["slice"](20, 43).length;
              var oe = [];
              var T5 = 113;
              var oQ = 0;
              while (oQ < Lx) {
                var xx = K2[oQ];
                var Rg = MUQ["slice"](20, 43)[oQ % Ha0];
                var vM = xx ^ Rg ^ T5;
                oe.push(vM);
                T5 = vM;
                oQ += 1;
              }
              var QV = oe;
              var xfC = [];
              for (var bv in QV) {
                var Fw = QV[bv];
                if (QV.hasOwnProperty(bv)) {
                  var PM = String.fromCharCode(Fw);
                  xfC.push(PM);
                }
              }
              var Ww = btoa(xfC.join(""));
              nJ["e-vfAzyrK$rjLHCqTvDl$w=="] = Ww;
              var Eh = b5(3510753592, Yn);
              var Sjp = [];
              var Bn = 0;
              while (Bn < 31) {
                Sjp.push(Eh() & 255);
                Bn += 1;
              }
              var Gc = Sjp;
              var UK = Gc;
              var gt = JSON.stringify("beta", function (cQ, u6y) {
                return u6y === undefined ? null : u6y;
              });
              var em = gt.replace(uY, ji);
              var mt = [];
              var Af = 0;
              while (Af < em.length) {
                mt.push(em.charCodeAt(Af));
                Af += 1;
              }
              var R6 = mt;
              var EB = R6;
              var Vo = [];
              for (var vl in EB) {
                var LRK = EB[vl];
                if (EB.hasOwnProperty(vl)) {
                  Vo.push(LRK);
                }
              }
              var l9 = Vo;
              var TdC = l9;
              var Ai = TdC.length;
              var EK = 0;
              while (EK + 1 < Ai) {
                var cV = TdC[EK];
                TdC[EK] = TdC[EK + 1];
                TdC[EK + 1] = cV;
                EK += 2;
              }
              var FF = TdC;
              var hf = FF.length;
              var hB = UK["slice"](0, 30).length;
              var kx = [];
              var l7 = 113;
              var euP = 0;
              while (euP < hf) {
                var kP = FF[euP];
                var o7 = UK["slice"](0, 30)[euP % hB];
                var lB = kP ^ o7 ^ l7;
                kx.push(lB);
                l7 = lB;
                euP += 1;
              }
              var MT = kx;
              var dG = [];
              for (var Fb in MT) {
                var CfO = MT[Fb];
                if (MT.hasOwnProperty(Fb)) {
                  var Uo = String.fromCharCode(CfO);
                  dG.push(Uo);
                }
              }
              var nD = btoa(dG.join(""));
              nJ["ZzJE(cIZjpcj)rvVMow="] = nD;
              var aO = b5(1273776091, Yn);
              var CO = [];
              var ej = 0;
              while (ej < 47) {
                CO.push(aO() & 255);
                ej += 1;
              }
              var HZF = CO;
              var t6 = HZF;
              var RJ = JSON.stringify("/5ibsc1Qy+OyMSe+ccE9D4gIKD3JYp+V+kT0hosJJ2MdXsZDwdztKg==", function (aJP, rFw) {
                return rFw === undefined ? null : rFw;
              });
              var LK = RJ.replace(uY, ji);
              var vT = [];
              var nt = 0;
              while (nt < LK.length) {
                vT.push(LK.charCodeAt(nt));
                nt += 1;
              }
              var PHd = vT;
              var OK = PHd;
              var rc = OK.length;
              var nx = t6["slice"](0, 27).length;
              var Sg = [];
              var yn = 0;
              while (yn < rc) {
                var eKw = OK[yn];
                var Qy = t6["slice"](0, 27)[yn % nx] & 127;
                Sg.push((eKw + Qy) % 256 ^ 128);
                yn += 1;
              }
              var WL = Sg;
              var Zq = WL.length;
              var f1 = t6["slice"](27, 44).length;
              var XV = [];
              var LH = 0;
              while (LH < Zq) {
                XV.push(WL[LH]);
                XV.push(t6["slice"](27, 44)[LH % f1]);
                LH += 1;
              }
              var uk = XV;
              var OVJ = uk.length;
              var z5G = t6[44] % 7 + 1;
              var rr = [];
              var AYE = 0;
              while (AYE < OVJ) {
                rr.push((uk[AYE] << z5G | uk[AYE] >> 8 - z5G) & 255);
                AYE += 1;
              }
              var xB = rr;
              var T_ = xB.length;
              var fJ = [];
              var Ca = 0;
              while (Ca < T_) {
                fJ.push(xB[(Ca + t6[45]) % T_]);
                Ca += 1;
              }
              var Ot = fJ;
              var C95 = [];
              for (var qR in Ot) {
                var IV = Ot[qR];
                if (Ot.hasOwnProperty(qR)) {
                  var xv = String.fromCharCode(IV);
                  C95.push(xv);
                }
              }
              var CP = btoa(C95.join(""));
              nJ["YbHdATSjMEH$OnetSvT(yQ=="] = CP;
              var AQ = b5(319184527, Yn);
              var cX = [];
              var TW = 0;
              while (TW < 20) {
                cX.push(AQ() & 255);
                TW += 1;
              }
              var nB = cX;
              var za = nB;
              var pt = JSON.stringify("LnjRt5Ti5fw7LmZJyegYsDiKzKdig5IMrhayLTLz/6dR1yVkgVyRWYtIauvfja+dQPt3I530zYqpGfBz5WZhwnPW3mcUKG8amOuhDOnWqI01BsSTnPWWYlAhGLHjcSqN5e/6TaQwoO4bkr/CVY6TZiQAm9D95J4WOTo=", function (tM, kmo) {
                return kmo === undefined ? null : kmo;
              });
              var ym = pt.replace(uY, ji);
              var DI = [];
              var F6 = 0;
              while (F6 < ym.length) {
                DI.push(ym.charCodeAt(F6));
                F6 += 1;
              }
              var KL = DI;
              var tP = KL;
              var pf = tP.length;
              var pzr = za["slice"](0, 19).length;
              var YH = [];
              var iOx = 113;
              var lM = 0;
              while (lM < pf) {
                var J5 = tP[lM];
                var D2 = za["slice"](0, 19)[lM % pzr];
                var Co = J5 ^ D2 ^ iOx;
                YH.push(Co);
                iOx = Co;
                lM += 1;
              }
              var WQ = YH;
              var Pb3 = [];
              for (var vc in WQ) {
                var Tr = WQ[vc];
                if (WQ.hasOwnProperty(vc)) {
                  Pb3.push(Tr);
                }
              }
              var x_ = Pb3;
              var ds0 = x_;
              var wx = ds0.length;
              var K4 = 0;
              while (K4 + 1 < wx) {
                var Ov = ds0[K4];
                ds0[K4] = ds0[K4 + 1];
                ds0[K4 + 1] = Ov;
                K4 += 2;
              }
              var cgN = ds0;
              var JU = [];
              for (var m5 in cgN) {
                var Ar = cgN[m5];
                if (cgN.hasOwnProperty(m5)) {
                  var fU = String.fromCharCode(Ar);
                  JU.push(fU);
                }
              }
              var WD = btoa(JU.join(""));
              nJ["abnCHiO_JVTgL&[nT/Hl$w=="] = WD;
            });
            if (Sw > 0) {
              f9["push"](function () {
                r7(function (n3g) {
                  var jC = b5(290410654, Yn);
                  var qQ = [];
                  var fu = 0;
                  while (fu < 51) {
                    qQ.push(jC() & 255);
                    fu += 1;
                  }
                  var g1 = qQ;
                  var gB = g1;
                  var ONW = JSON.stringify(n3g, function (hr, gNX) {
                    return gNX === undefined ? null : gNX;
                  });
                  var M6 = ONW.replace(uY, ji);
                  var HZ = [];
                  var Qh = 0;
                  while (Qh < M6.length) {
                    HZ.push(M6.charCodeAt(Qh));
                    Qh += 1;
                  }
                  var KR = HZ;
                  var tt = KR;
                  var L_e = tt.length;
                  var lDs = gB[0] % 7 + 1;
                  var HC = [];
                  var ue = 0;
                  while (ue < L_e) {
                    HC.push((tt[ue] << lDs | tt[ue] >> 8 - lDs) & 255);
                    ue += 1;
                  }
                  var QOQ = HC;
                  var nd = QOQ.length;
                  var Oh = gB["slice"](1, 31).length;
                  var Pjn = [];
                  var tX = 113;
                  var mZ = 0;
                  while (mZ < nd) {
                    var Ev = QOQ[mZ];
                    var x7f = gB["slice"](1, 31)[mZ % Oh];
                    var dy = Ev ^ x7f ^ tX;
                    Pjn.push(dy);
                    tX = dy;
                    mZ += 1;
                  }
                  var gw = Pjn;
                  var WCU = gw.length;
                  var RJv = gB["slice"](31, 50).length;
                  var tJc = [];
                  var fl = 113;
                  var D53 = 0;
                  while (D53 < WCU) {
                    var rA = gw[D53];
                    var kj = gB["slice"](31, 50)[D53 % RJv];
                    var sR = rA ^ kj ^ fl;
                    tJc.push(sR);
                    fl = sR;
                    D53 += 1;
                  }
                  var dF = tJc;
                  var wA = [];
                  for (var nX in dF) {
                    var bwm = dF[nX];
                    if (dF.hasOwnProperty(nX)) {
                      var k2 = String.fromCharCode(bwm);
                      wA.push(k2);
                    }
                  }
                  var Xi = btoa(wA.join(""));
                  nJ["esCvPwj-bch[*r(qPOfhBy+raMQ!e&*QRrA="] = Xi;
                  var dX = {};
                  ky["startInternal"]("prop_o");
                  var WG = b5(1740574759, Yn);
                  var Cl = [];
                  var Vz = 0;
                  while (Vz < 58) {
                    Cl.push(WG() & 255);
                    Vz += 1;
                  }
                  var UG = Cl;
                  var zn = UG;
                  var hJ2 = JSON.stringify(nJ, function (Km7, YeK) {
                    return YeK === undefined ? null : YeK;
                  });
                  var fF = hJ2.replace(uY, ji);
                  var h1 = [];
                  var hHo = 0;
                  while (hHo < fF.length) {
                    h1.push(fF.charCodeAt(hHo));
                    hHo += 1;
                  }
                  var AI = h1;
                  var CM = AI;
                  var AN = CM.length;
                  var g_e = zn["slice"](0, 27).length;
                  var mX = [];
                  var we = 0;
                  while (we < AN) {
                    var ai = CM[we];
                    var uC = zn["slice"](0, 27)[we % g_e] & 127;
                    mX.push((ai + uC) % 256 ^ 128);
                    we += 1;
                  }
                  var XD = mX;
                  var GB = XD.length;
                  var qO = zn["slice"](27, 56).length;
                  var FD = [];
                  var Wt = 0;
                  while (Wt < GB) {
                    var zE = XD[Wt];
                    var bF = zn["slice"](27, 56)[Wt % qO] & 127;
                    FD.push((zE + bF) % 256 ^ 128);
                    Wt += 1;
                  }
                  var Y5 = FD;
                  var LdQ = Y5.length;
                  var eb = zn[56] % 7 + 1;
                  var Ur = [];
                  var kqX = 0;
                  while (kqX < LdQ) {
                    Ur.push((Y5[kqX] << eb | Y5[kqX] >> 8 - eb) & 255);
                    kqX += 1;
                  }
                  var HqJ = Ur;
                  var JTY = [];
                  for (var m3S in HqJ) {
                    var YI = HqJ[m3S];
                    if (HqJ.hasOwnProperty(m3S)) {
                      JTY.push(YI);
                    }
                  }
                  var SZN = JTY;
                  var NE = SZN;
                  var DYC = NE.length;
                  var j8 = 0;
                  while (j8 + 1 < DYC) {
                    var fO = NE[j8];
                    NE[j8] = NE[j8 + 1];
                    NE[j8 + 1] = fO;
                    j8 += 2;
                  }
                  var XE = NE;
                  var R1 = [];
                  for (var tI in XE) {
                    var iX = XE[tI];
                    if (XE.hasOwnProperty(tI)) {
                      var yc = String.fromCharCode(iX);
                      R1.push(yc);
                    }
                  }
                  var JQ = btoa(R1.join(""));
                  dX["p"] = JQ;
                  ky["stopInternal"]("prop_o");
                  dX["st"] = 1736591134;
                  dX["sr"] = 3257989205;
                  dX["cr"] = Yn;
                  dX["og"] = 2;
                  iZ["parentNode"]["baseRemoveChild_e421bb29"] = iZ["parentNode"]["__proto__"]["removeChild"];
                  iZ["parentNode"]["baseRemoveChild_e421bb29"](iZ);
                  setTimeout(function () {
                    var KC = [];
                    for (var Q7 in fM) {
                      var Rr6 = fM[Q7];
                      if (fM.hasOwnProperty(Q7)) {
                        KC["push"](function (RQ) {
                          RQ["abort"]();
                        }(Rr6));
                      }
                    }
                    var SR = KC;
                    SR;
                  }, 1);
                  ky["stop"]("interrogation");
                  tk(dX);
                });
              });
            } else {
              f9["push"](function () {
                var iM = {};
                ky["startInternal"]("prop_o");
                var av = b5(1740574759, Yn);
                var xT = [];
                var jt = 0;
                while (jt < 58) {
                  xT.push(av() & 255);
                  jt += 1;
                }
                var FA = xT;
                var lV = FA;
                var TS = JSON.stringify(nJ, function (OH, rzH) {
                  return rzH === undefined ? null : rzH;
                });
                var aL = TS.replace(uY, ji);
                var Y6 = [];
                var fD = 0;
                while (fD < aL.length) {
                  Y6.push(aL.charCodeAt(fD));
                  fD += 1;
                }
                var vNx = Y6;
                var WY = vNx;
                var e2C = WY.length;
                var BM = lV["slice"](0, 27).length;
                var ba = [];
                var YF = 0;
                while (YF < e2C) {
                  var U8 = WY[YF];
                  var fDD = lV["slice"](0, 27)[YF % BM] & 127;
                  ba.push((U8 + fDD) % 256 ^ 128);
                  YF += 1;
                }
                var a0 = ba;
                var rw = a0.length;
                var XO = lV["slice"](27, 56).length;
                var ry = [];
                var wz = 0;
                while (wz < rw) {
                  var J3 = a0[wz];
                  var zc = lV["slice"](27, 56)[wz % XO] & 127;
                  ry.push((J3 + zc) % 256 ^ 128);
                  wz += 1;
                }
                var e6y = ry;
                var fYc = e6y.length;
                var QE6 = lV[56] % 7 + 1;
                var gx = [];
                var jy = 0;
                while (jy < fYc) {
                  gx.push((e6y[jy] << QE6 | e6y[jy] >> 8 - QE6) & 255);
                  jy += 1;
                }
                var R8 = gx;
                var Ay2 = [];
                for (var Fwa in R8) {
                  var Tl = R8[Fwa];
                  if (R8.hasOwnProperty(Fwa)) {
                    Ay2.push(Tl);
                  }
                }
                var DR = Ay2;
                var SJc = DR;
                var TD = SJc.length;
                var SEQ = 0;
                while (SEQ + 1 < TD) {
                  var c6 = SJc[SEQ];
                  SJc[SEQ] = SJc[SEQ + 1];
                  SJc[SEQ + 1] = c6;
                  SEQ += 2;
                }
                var zz = SJc;
                var ol = [];
                for (var yi in zz) {
                  var tJ = zz[yi];
                  if (zz.hasOwnProperty(yi)) {
                    var XK = String.fromCharCode(tJ);
                    ol.push(XK);
                  }
                }
                var Gy = btoa(ol.join(""));
                iM["p"] = Gy;
                iM["st"] = 1736591134;
                iM["sr"] = 3257989205;
                iM["cr"] = Yn;
                iM["og"] = 2;
                tk(iM);
              });
            }
            var Wc = 0;
            var dI7 = function () {
              var VI = f9[Wc];
              if (VI) {
                try {
                  VI();
                  Wc += 1;
                  dI7()
                } catch (D9) {
                  ac(J4(D9));
                }
              }
            };
            dI7()
          } catch (bmU) {
            ac(J4(bmU));
          }
        });
      } catch (JO) {
        ac(J4(JO));
      }
    };
  }
  rp["st"] = 1736591134;
  reese84interrogator = rp;
})();

var _0x107700 = {
"hash": function (_0x22e699) {
    _0x22e699 = unescape(encodeURIComponent(_0x22e699));
    for (var _0x5ea1bd = [1518500249, 1859775393, 2400959708, 3395469782], _0x5b0a1a = (_0x22e699 += String["fromCharCode"](128))["length"] / 4 + 2, _0xe11ec7 = Math["ceil"](_0x5b0a1a / 16), _0x573f33 = new Array(_0xe11ec7), _0x1e1606 = 0; _0x1e1606 < _0xe11ec7; _0x1e1606++) {
        _0x573f33[_0x1e1606] = new Array(16);
        for (var _0x3362f8 = 0; _0x3362f8 < 16; _0x3362f8++) _0x573f33[_0x1e1606][_0x3362f8] = _0x22e699["charCodeAt"](64 * _0x1e1606 + 4 * _0x3362f8) << 24 | _0x22e699["charCodeAt"](64 * _0x1e1606 + 4 * _0x3362f8 + 1) << 16 | _0x22e699["charCodeAt"](64 * _0x1e1606 + 4 * _0x3362f8 + 2) << 8 | _0x22e699["charCodeAt"](64 * _0x1e1606 + 4 * _0x3362f8 + 3);
    }
    _0x573f33[_0xe11ec7 - 1][14] = 8 * (_0x22e699["length"] - 1) / Math["pow"](2, 32), _0x573f33[_0xe11ec7 - 1][14] = Math["floor"](_0x573f33[_0xe11ec7 - 1][14]), _0x573f33[_0xe11ec7 - 1][15] = 8 * (_0x22e699["length"] - 1) & 4294967295;
    var _0x29a1a4,
        _0x2f1c2d,
        _0x5dcb66,
        _0x255a60,
        _0x137695,
        _0x49449e = 1732584193,
        _0x47a0dc = 4023233417,
        _0xc74a8f = 2562383102,
        _0x332c51 = 271733878,
        _0x4053ab = 3285377520,
        _0x488d58 = new Array(80);
    for (_0x1e1606 = 0; _0x1e1606 < _0xe11ec7; _0x1e1606++) {
        for (var _0x33c734 = 0; _0x33c734 < 16; _0x33c734++) _0x488d58[_0x33c734] = _0x573f33[_0x1e1606][_0x33c734];
        for (_0x33c734 = 16; _0x33c734 < 80; _0x33c734++) _0x488d58[_0x33c734] = _0x107700["ROTL"](_0x488d58[_0x33c734 - 3] ^ _0x488d58[_0x33c734 - 8] ^ _0x488d58[_0x33c734 - 14] ^ _0x488d58[_0x33c734 - 16], 1);
        _0x29a1a4 = _0x49449e, _0x2f1c2d = _0x47a0dc, _0x5dcb66 = _0xc74a8f, _0x255a60 = _0x332c51, _0x137695 = _0x4053ab;
        for (_0x33c734 = 0; _0x33c734 < 80; _0x33c734++) {
            var _0x4ca73b = Math["floor"](_0x33c734 / 20),
                _0x4baa2f = _0x107700["ROTL"](_0x29a1a4, 5) + _0x107700["f"](_0x4ca73b, _0x2f1c2d, _0x5dcb66, _0x255a60) + _0x137695 + _0x5ea1bd[_0x4ca73b] + _0x488d58[_0x33c734] & 4294967295;
            _0x137695 = _0x255a60, _0x255a60 = _0x5dcb66, _0x5dcb66 = _0x107700["ROTL"](_0x2f1c2d, 30), _0x2f1c2d = _0x29a1a4, _0x29a1a4 = _0x4baa2f;
        }
        _0x49449e = _0x49449e + _0x29a1a4 & 4294967295, _0x47a0dc = _0x47a0dc + _0x2f1c2d & 4294967295, _0xc74a8f = _0xc74a8f + _0x5dcb66 & 4294967295, _0x332c51 = _0x332c51 + _0x255a60 & 4294967295, _0x4053ab = _0x4053ab + _0x137695 & 4294967295;
    }
    return _0x107700["toHexStr"](_0x49449e) + _0x107700["toHexStr"](_0x47a0dc) + _0x107700["toHexStr"](_0xc74a8f) + _0x107700["toHexStr"](_0x332c51) + _0x107700["toHexStr"](_0x4053ab);
},
"f": function (_0x21c60f, _0x26feac, _0x270097, _0x29fbf3) {
    switch (_0x21c60f) {
        case 0:
            return _0x26feac & _0x270097 ^ ~_0x26feac & _0x29fbf3;
        case 1:
        case 3:
            return _0x26feac ^ _0x270097 ^ _0x29fbf3;
        case 2:
            return _0x26feac & _0x270097 ^ _0x26feac & _0x29fbf3 ^ _0x270097 & _0x29fbf3;
    }
},
"ROTL": function (_0x35a021, _0xe21603) {
    return _0x35a021 << _0xe21603 | _0x35a021 >>> 32 - _0xe21603;
},
"toHexStr": function (_0x2f7273) {
    for (var _0x40f523 = "", _0xc6dedf = 7; _0xc6dedf >= 0; _0xc6dedf--) _0x40f523 += (_0x2f7273 >>> 4 * _0xc6dedf & 15)["toString"](16);
    return _0x40f523;
}
};


function _0x13c9fd() {
return Date["now"] ? Date["now"]() : new Date()["getTime"]();
}


function _0x19bf56() {
this["marks"] = {}, this["measures"] = {};
}

_0x19bf56["prototype"]["start"] = function (_0x4b4ccd) {
this["marks"][_0x4b4ccd] = _0x13c9fd();
}, _0x19bf56["prototype"]["startInternal"] = function (_0x196469) {
}
, _0x19bf56["prototype"]["stop"] = function (_0x4c446d) {
this["measures"][_0x4c446d] = _0x13c9fd() - this["marks"][_0x4c446d];
}
, _0x19bf56["prototype"]["stopInternal"] = function (_0x41f397) {
}
, _0x19bf56["prototype"]["summary"] = function () {
return this["measures"];
};

var _0x16c5ed = [0x5a827999, 0x6ed9eba1, -0x70e44324, -0x359d3e2a]
, _0x5e1d95 = 0x10
, _0x47c4d9 = _0x5e1d95 - 0x1
, _0x500037 = _0x5e1d95 - 0x1
, _0x5895a7 = 0x50
, _0x2394f2 = 0x50
, _0xc6697 = new Int32Array(_0x5895a7)
, _0x4de088 = new Uint8Array(0x8)
, _0x178cb6 = new ArrayBuffer(_0x2394f2)
, _0x294caf = new Uint8Array(_0x178cb6)
, _0x9ad684 = new Int32Array(_0x178cb6)
, _0x36c975 = 0x1388;

function _0x314ad6(_0x314ad6) {
var _0x354f27 = parseInt('0', 0xa);
if (isNaN(_0x354f27) && (_0x354f27 = 0x64),
0x0 !== _0x354f27) {
    var _0x18ae66 = new Date()['getTim' + 'e']()
        , _0x2ef760 = 0x0
        , _0x32615c = 0x0
        , _0xea6cad = 0x1 / 0x0
        , _0x34adac = 0x0;
    !function _0x2fecfd() {
        var b = function (t) {
            var e = _0x4de088.byteLength
                , l = -1
                , d = 1 / 0;

            function y() {
                return 254 === new Uint8Array(new Uint16Array([65279]).buffer)[0];
            }

            var v = function (t) {
                return t << 24 & 4278190080 | t << 8 & 16711680 | t >> 8 & 65280 | t >> 24 & 255;
            }
                , m = function (t) {
                return t;
            }
                , w = y() ? m : v
                , b = function (t) {
                return t << 1 | t >>> 31;
            }
                , g = function (t) {
                return t << 5 | t >>> 27;
            }
                , _ = function (t) {
                return t << 30 | t >>> 2;
            };

            function k(t, e, r, n) {
                return 0 === t ? e & r | ~e & n : 2 === t ? e & r | e & n | r & n : e ^ r ^ n;
            }

            for (var T = 0; T < _0x36c975; T++) {
                var E = t * _0x36c975 + T;
                _0x4de088[0] = 255 & E,
                    _0x4de088[1] = E >> 8 & 255,
                    _0x4de088[2] = E >> 16 & 255,
                    _0x4de088[3] = E >> 24 & 255,
                    _0x4de088[4] = E >> 32 & 255,
                    _0x4de088[5] = 0,
                    _0x4de088[6] = 0,
                    _0x4de088[7] = 0;
                for (var O = 1732584193, A = -271733879, S = -1732584194, C = 271733878, x = -1009589776, P = 0; P < _0x2394f2 / 4; P++)
                    _0x9ad684[P] = 0;
                _0x294caf.set(_0x4de088, 0);
                var I = e
                    , R = 0 | I;
                for (_0x294caf[R++] = 128; 3 & R;)
                    _0x294caf[R++] = 0;
                for (R >>= 2; R < _0x5e1d95;)
                    _0x9ad684[R++] = 0;
                var M = 8 * I
                    , j = (4294967295 & M) >>> 0
                    , D = (M - j) / 4294967296;
                D && (_0x9ad684[_0x47c4d9] = w(D)),
                j && (_0x9ad684[_0x500037] = w(j));
                for (var B = 0, N = 0; B < _0x5e1d95;)
                    _0xc6697[B++] = w(_0x9ad684[N++]);
                for (B = _0x5e1d95; B < _0x5895a7; B++)
                    _0xc6697[B] = b(_0xc6697[B - 3] ^ _0xc6697[B - 8] ^ _0xc6697[B - 14] ^ _0xc6697[B - 16]);
                for (var U = O, L = A, F = S, K = C, G = x, Y = 0; Y < _0x5895a7; Y++) {
                    var H = Y / 20 | 0
                        , J = g(U) + k(H, L, F, K) + G + _0xc6697[Y] + _0x16c5ed[H] | 0;
                    G = K,
                        K = F,
                        F = _(L),
                        L = U,
                        U = J;
                }
                O = U + O | 0,
                    A = L + A | 0,
                    S = F + S | 0,
                    C = K + C | 0,
                    x = G + x | 0,
                    _0x9ad684[0] = w(O),
                    _0x9ad684[1] = w(A),
                    _0x9ad684[2] = w(S),
                    _0x9ad684[3] = w(C),
                    _0x9ad684[4] = w(x);
                var q = _0x294caf[0] | _0x294caf[1] << 8 | _0x294caf[2] << 16 | _0x294caf[3] << 24 | _0x294caf[4] << 32;
                q < d && (l = E,
                    d = q);
            }
            return [l, d];
        }(_0x34adac)
            , g = b[0]
            , _ = b[1];
        _ < _0xea6cad && (_0x32615c = g,
            _0xea6cad = _),
            _0x34adac++,
            (_0x2ef760 = new Date().getTime() - _0x18ae66) >= _0x354f27 || _0x34adac * _0x36c975 >= 1000000 ? _0x314ad6({
                p: String(_0x32615c),
                t: _0x2ef760,
                u: _0x354f27,
                r: _0x34adac * _0x36c975
            }) : setTimeout(_0x2fecfd, 0);
    }();
} else
    _0x314ad6(null);
}


function get_result(aih,ua,url){
    Object.defineProperty(navigator.__proto__, 'userAgent', {
        get:function(param){
            return ua
        }
    });

    Object.defineProperty(navigator.__proto__, 'hardwareConcurrency', {
    get: function (params) {
        if (url.indexOf('flysas')!==-1)
        return 13

    }
    });
    window['__all_head_tag'] = [{
    "tagName": "SCRIPT",
    "src": url
    }]
    abcd = ua;
    let result = null;
    new window["reese84interrogator"]({
        "s": _0x107700['hash'],
        "t": new _0x19bf56(),
        "aih": aih, // Using the passed aih parameter
        "at": 1,
        'slc': 1,
        'sic': 1,
        'slt': +new Date,
        'pow': _0x314ad6,
        'pt': 0,
        'gcs': ["onProtectionInitialized"],
    }).interrogate(function (data){
        result = data
        // console.log(result)
    },function (){})
    all_result = {
        "solution": {
            "interrogation": result, "version": "beta"
        }, "old_token": null, "error": null, "performance": {
            "interrogation": Math.floor(Math.random() * (1400 - 500 + 1)) + 500
        }
    }
    return JSON.stringify(all_result)
}

ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
aih = 'X9jzW7OyvjPK6e+h18BITlPVbeDOpELGbaTkIlkGeWY='
url = 'https://booking.flyscoot.com/book/flight/one-way/ADL/2024-10-10/TNA?adult=1&child=0&infant=0'
console.log(get_result(ua,aih,url))