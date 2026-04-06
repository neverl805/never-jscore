# never_jscore

> 基于 Deno Core (V8) 的高性能 Python JavaScript 执行引擎

[![PyPI](https://img.shields.io/pypi/v/never-jscore)](https://pypi.org/project/never-jscore/)
[![Python](https://img.shields.io/pypi/pyversions/never-jscore)](https://pypi.org/project/never-jscore/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

**专为 JavaScript 逆向工程设计** • 完整 Promise/async 支持 • Hook 拦截 • 确定性调试 • 极致性能

---

## 一句话介绍

never_jscore 是目前 **最快、功能最完整** 的 Python JavaScript 引擎，提供：
- 🚀 **极致性能** - 简单任务 255,000+ ops/s，复杂任务 20,000+ ops/s
- 🎣 **双模式 Hook 拦截**（`$return` + `$terminate`），专为逆向设计
- ⚡ **v3.0.0 GIL 释放优化** - 多线程性能显著提升
- 🌐 **完整 Web/Node.js API**，零配置补环境
- 🎲 **确定性随机数**，可复现的调试体验

```python
# ❌ 错误方式：每次都要重新加载 JS（慢 ~50 ops/s）
for data in data_list:
    ctx = Context()
    ctx.compile(js_code)
    result = ctx.call("encrypt", [data])

# ✅ 推荐方式：Context 复用，性能极致 (~255,000 ops/s)
ctx = Context()
ctx.compile(js_code)
for data in data_list:
    result = ctx.call("encrypt", [data])  # 快 5000 倍！
del ctx
```

---

## 快速开始

### 安装

```bash
pip install never-jscore
```

**支持**：Windows、Linux、macOS | Python 3.8+

**推荐**：使用 Python 3.14 以获得最佳性能和稳定性

### 30 秒上手

```python
import never_jscore

# 方式 1：Context（适合探索、调试）
ctx = never_jscore.Context()
ctx.compile("function add(a, b) { return a + b; }")
print(ctx.call("add", [1, 2]))  # 3

# 方式 2：JSEngine（适合批量处理，v3.0.0+）
engine = never_jscore.JSEngine("""
    function encrypt(data) {
        return btoa(data);  // Base64 编码
    }
""", workers=4)

# 批量处理（性能提升 10-100 倍）
results = [engine.call("encrypt", [f"data_{i}"]) for i in range(1000)]
print(f"处理完成：{len(results)} 条数据")
```

---

## 核心特性

### 🚀 双模式架构（v3.0.0 重大升级）

never_jscore 提供两种执行模式，适应不同场景：

#### 模式对比 (基于实测数据)

| 特性 | Context（推荐 99% 场景） | JSEngine（Worker Pool）|
|------|-------------------|-------------------------------|
| **JS 代码加载** | 复用模式：加载一次，反复调用 | 预加载一次，workers 复用 |
| **简单任务性能** | **255,969 ops/s** ⭐ | 743 ops/s |
| **复杂任务性能** | **23,675 ops/s** ⭐ | 550 ops/s |
| **冷启动性能** | 50 ops/s | **607 ops/s** ⭐ |
| **多线程安全** | ThreadLocal 模式 | ✅ 内置线程安全队列 |
| **Hook 数据隔离** | 全局存储 | ✅ Worker 级别隔离 |
| **GIL 释放** | ✅ v3.0.0 优化 | ✅ 自动释放 |
| **实现复杂度** | ✅ 简单 (3 行代码) | ⚠️ 适中 |
| **任务调度开销** | **~0.004ms** ⭐ | ~1-2ms (MPSC channel) |
| **适用场景** | 大多数场景 (99%) | 无法复用 Context 的场景 (1%) |

**性能结论**：Context 复用模式快 **50-340 倍**！

**JSEngine 优势场景**：
- 每次执行不同的 JS 代码（无法复用 Context）
- 避免重复加载大型 JS 库（冷启动优化）
- 多线程使用例子[test_engine.py](tests/test_engine.py),[test_multithreading.py](tests/test_multithreading.py),
- 不同使用情况下测速[test_performance_comparison.py](tests/test_performance_comparison.py)
#### Context 模式示例

```python
import never_jscore

# 适合：探索性脚本、调试、灵活修改代码
ctx = never_jscore.Context(enable_extensions=True)

# 定义函数
ctx.compile("""
    async function fetchUserData(userId) {
        const response = await fetch(`https://api.example.com/users/${userId}`);
        return await response.json();
    }
""")

# 调用函数（自动等待 Promise）
user = ctx.call("fetchUserData", [12345])
print(user)  # {'id': 12345, 'name': 'John', ...}

# 一次性求值（不污染全局作用域）
result = ctx.evaluate("Math.random() * 100")
print(result)  # 随机数

del ctx  # 清理资源
```

#### JSEngine 模式示例

```python
import never_jscore
from concurrent.futures import ThreadPoolExecutor

# 适合：批量处理、高并发、生产环境
engine = never_jscore.JSEngine("""
    const CryptoJS = require('crypto-js');

    function encrypt(data, key) {
        return CryptoJS.AES.encrypt(data, key).toString();
    }

    function decrypt(encrypted, key) {
        const bytes = CryptoJS.AES.decrypt(encrypted, key);
        return bytes.toString(CryptoJS.enc.Utf8);
    }
""", workers=4, enable_node_compat=True)

# 单线程批量处理
data_list = [f"data_{i}" for i in range(1000)]
results = []
for data in data_list:
    encrypted = engine.call("encrypt", [data, "secret_key"])
    results.append(encrypted)

# 多线程并发处理（自动释放 GIL）
def process(data):
    return engine.call("encrypt", [data, "secret_key"])

with ThreadPoolExecutor(max_workers=10) as executor:
    results = list(executor.map(process, data_list))

print(f"✓ 处理完成：{len(results)} 条数据")
del engine
```

### 🎣 双模式 Hook 拦截

专为 JavaScript 逆向工程设计，提供两种 Hook 模式：

#### 模式 1：`$return()` - 快速拦截

```python
ctx = never_jscore.Context()

# 拦截函数执行
result = ctx.evaluate("""
    function encrypt(data) {
        const step1 = processData(data);

        // Hook：提前返回中间结果
        $return({
            intercepted: true,
            step1: step1,
            timestamp: Date.now()
        });

        // 后续代码不会执行
        const step2 = furtherProcess(step1);
        return step2;
    }

    encrypt("sensitive_data")
""")

print(result)  # {'intercepted': True, 'step1': ..., 'timestamp': ...}
```

#### 模式 2：`$terminate()` - 强制终止（无法被 try-catch 捕获）

```python
import json
ctx = never_jscore.Context()

# 即使有 try-catch 也会被终止
try:
    ctx.evaluate("""
        try {
            XMLHttpRequest.prototype.send = function(data) {
                // 强制终止，无法被捕获
                $terminate({
                    url: this._url,
                    method: this._method,
                    encrypted: data
                });
            };

            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://api.example.com/login');
            xhr.send(encryptedPayload);
        } catch (e) {
            console.log("不会执行");  // ❌ try-catch 无法捕获
        }
    """)
except Exception as e:
    print("✓ JS 被强制终止")

# 获取拦截的数据
hook_data = json.loads(ctx.get_hook_data())
print(f"拦截到：{hook_data}")
```

#### JSEngine + Hook 并发隔离（v3.0.0 新特性）

```python
engine = never_jscore.JSEngine("""
    function processWithHook(id) {
        $terminate({
            taskId: id,
            result: compute(id),
            timestamp: Date.now()
        });
    }
""", workers=4)

# 并发调用（每个 worker 的 hook 数据独立）
from concurrent.futures import ThreadPoolExecutor

def process(task_id):
    result = engine.call("processWithHook", [task_id])

    # v3.0.0: Hook 数据直接在结果中返回
    if isinstance(result, dict) and result.get("__hook__"):
        return result["data"]  # 直接获取
    return result

with ThreadPoolExecutor(max_workers=10) as executor:
    results = list(executor.map(process, range(100)))

print(f"✓ 处理完成：{len(results)} 个任务，每个任务的 hook 数据独立")
```

### 🎲 确定性随机数调试

固定随机数种子，让加密算法的执行结果可复现：

```python
# 使用固定种子
ctx = never_jscore.Context(random_seed=12345)

# 每次运行结果完全相同
r1 = ctx.evaluate("Math.random()")  # 0.8831156266...
r2 = ctx.evaluate("Math.random()")  # 0.5465919174...

# 新 Context 使用相同种子，结果也相同
ctx2 = never_jscore.Context(random_seed=12345)
r3 = ctx2.evaluate("Math.random()")  # 0.8831156266... (与 r1 相同)

# 适用于所有随机 API
uuid = ctx.evaluate("crypto.randomUUID()")  # 固定的 UUID
random_bytes = ctx.evaluate("crypto.getRandomValues(new Uint8Array(4))")
```

**影响的 API**：
- `Math.random()`
- `crypto.randomUUID()`
- `crypto.getRandomValues()`

### 🌐 完整 Web/Node.js API（零配置补环境）

#### Web API

```python
ctx = never_jscore.Context()

# Fetch API
result = ctx.evaluate("""
    (async () => {
        const response = await fetch('https://api.github.com/users/github');
        const data = await response.json();
        return data.login;
    })()
""")
print(result)  # 'github'

# localStorage / sessionStorage
ctx.eval("localStorage.setItem('token', 'abc123')")
token = ctx.evaluate("localStorage.getItem('token')")
print(token)  # 'abc123'

# URL / URLSearchParams
url_info = ctx.evaluate("""
    const url = new URL('https://example.com/path?foo=bar');
    ({
        origin: url.origin,
        pathname: url.pathname,
        search: url.search
    })
""")
print(url_info)  # {'origin': 'https://example.com', 'pathname': '/path', ...}

# TextEncoder / TextDecoder
encoded = ctx.evaluate("""
    const encoder = new TextEncoder();
    Array.from(encoder.encode('Hello'))
""")
print(encoded)  # [72, 101, 108, 108, 111]

# ReadableStream
chunks = ctx.evaluate("""
    const stream = new ReadableStream({
        start(controller) {
            controller.enqueue('chunk1');
            controller.enqueue('chunk2');
            controller.close();
        }
    });

    const reader = stream.getReader();
    async function read() {
        const chunks = [];
        while (true) {
            const {done, value} = await reader.read();
            if (done) break;
            chunks.push(value);
        }
        return chunks;
    }
    read()
""")
print(chunks)  # ['chunk1', 'chunk2']
```

**支持的 Web API**：
- ✅ URL / URLSearchParams / URLPattern
- ✅ TextEncoder / TextDecoder / TextEncoderStream / TextDecoderStream
- ✅ fetch / XMLHttpRequest
- ✅ localStorage / sessionStorage
- ✅ atob / btoa (Base64)
- ✅ console (log/info/warn/error/debug)
- ✅ Event / EventTarget / CustomEvent
- ✅ AbortController / AbortSignal
- ✅ crypto.randomUUID() / crypto.getRandomValues()
- ✅ setTimeout / setInterval / clearTimeout / clearInterval
- ✅ performance.now() / mark / measure
- ✅ ReadableStream / WritableStream / TransformStream
- ✅ structuredClone

#### Node.js 兼容模式

```python
# 启用 Node.js 兼容
ctx = never_jscore.Context(enable_node_compat=True)

# 使用 Node.js 内置模块
result = ctx.evaluate("""
    const path = require('path');
    const crypto = require('crypto');

    ({
        joined: path.join('a', 'b', 'c'),
        hash: crypto.createHash('md5').update('hello').digest('hex')
    })
""")
print(result)
# {'joined': 'a\\b\\c', 'hash': '5d41402abc4b2a76b9719d911017c592'}

# 加载 npm 包（需要先 npm install）
ctx2 = never_jscore.Context(enable_node_compat=True)
result = ctx2.evaluate("""
    const { JSDOM } = require('jsdom');
    const dom = new JSDOM('<html><body><h1>Hello</h1></body></html>');
    const document = dom.window.document;

    ({
        tagName: document.querySelector('h1').tagName,
        text: document.querySelector('h1').textContent
    })
""")
print(result)  # {'tagName': 'H1', 'text': 'Hello'}
```

**支持的 Node.js 模块**：
- ✅ `require()` 函数（全局可用）
- ✅ 内置模块：path, fs, crypto, buffer, stream, url, util, events, sqlite 等
- ✅ npm 包：jsdom, lodash, crypto-js, ws 等
- ✅ `__dirname` / `__filename`
- ✅ `process.env` / `process.cwd()`（通过 `require('process')` 访问）
- ✅ `Buffer` 全局对象（v3.2.0 修复）
- ✅ `setImmediate` / `clearImmediate`（v3.2.0 修复）

详见：[Node.js API 对比文档](NODEJS_V25_API_COMPARISON.md)

### 🎨 Canvas 2D API（纯 Rust 实现）

```python
ctx = never_jscore.Context()

# 创建 Canvas 并绘图
ctx.evaluate("""
    const canvas = createCanvas(200, 200);
    const ctx = canvas.getContext('2d');

    // 绘制矩形
    ctx.fillStyle = 'red';
    ctx.fillRect(10, 10, 50, 50);

    // 绘制文字
    ctx.font = '20px Arial';
    ctx.fillText('Hello', 70, 35);

    // 保存为 PNG
    canvas.toDataURL();  // 返回 base64
""")
```

详见：[Canvas API 参考文档](docs/CANVAS_API_REFERENCE.md)

### 🔬 V8 堆内存分析

```python
ctx = never_jscore.Context()

# 获取堆统计信息
stats = ctx.get_heap_statistics()
print(f"总堆大小: {stats['total_heap_size'] / 1024 / 1024:.2f} MB")
print(f"已使用堆: {stats['used_heap_size'] / 1024 / 1024:.2f} MB")
print(f"使用率: {stats['used_heap_size'] / stats['total_heap_size'] * 100:.1f}%")

# 导出 Chrome DevTools 堆快照
ctx.take_heap_snapshot("heap_snapshot.heapsnapshot")
# 然后在 Chrome DevTools -> Memory -> Load 加载快照进行分析

# 手动触发 GC
ctx.gc()
```

---

## 性能基准测试

### 与其他库对比

| 测试项目 | never_jscore | PyMiniRacer | PyExecJS |
|---------|-------------|-------------|----------|
| 简单计算 | **0.007ms** | 0.005ms | 2.3ms |
| 字符串操作 | **0.004ms** ⭐ | 0.008ms | 2.3ms |
| 数组操作 | **0.004ms** ⭐ | 0.006ms | 2.3ms |
| 复杂算法(1000次) | **11ms** ⭐ | 38ms | 69473ms |
| Promise/async | **✅ 3ms** | ❌ 不支持 | ❌ 不支持 |

### Context vs JSEngine 性能真相 ⚠️

**重要发现**：Context 复用模式在 99% 场景下性能更好！

| 测试场景 | Context (复用) | JSEngine (Pool) | 性能差距 |
|---------|---------------|----------------|---------|
| 简单 JS (btoa) | **255,969 ops/s** | 743 ops/s | Context 快 **344x** 🔥 |
| 复杂计算 (循环) | **23,675 ops/s** | 550 ops/s | Context 快 **43x** 🔥 |
| 冷启动 (每次重建) | 50 ops/s | **607 ops/s** | JSEngine 快 **12x** ✅ |

```python
import time
import never_jscore

js_code = "function test() { return btoa('hello'); }"

# 方案 1：Context 冷启动（不推荐）
start = time.time()
for i in range(1000):
    ctx = never_jscore.Context()
    ctx.compile(js_code)
    result = ctx.call("test", [])
    del ctx
t1 = time.time() - start

# 方案 2：Context 复用（⭐ 推荐大多数场景）
start = time.time()
ctx = never_jscore.Context()
ctx.compile(js_code)
for i in range(1000):
    result = ctx.call("test", [])
del ctx
t2 = time.time() - start

# 方案 3：JSEngine Worker Pool（⚠️ 仅冷启动场景有优势）
start = time.time()
engine = never_jscore.JSEngine(js_code, workers=4)
for i in range(1000):
    result = engine.call("test", [])
del engine
t3 = time.time() - start

print(f"Context（冷启动）: {t1:.2f}s  (~{1000/t1:.0f} ops/s)")
print(f"Context（复用）:   {t2:.3f}s  (~{1000/t2:.0f} ops/s) ⭐")
print(f"JSEngine（Pool）:  {t3:.2f}s  (~{1000/t3:.0f} ops/s)")
```

**实测结果**（1000 次调用）：
- Context（冷启动）：~20s (50 ops/s)
- Context（复用）：**0.004s (255,969 ops/s)** ⭐
- JSEngine（Pool）：~1.3s (743 ops/s)

**结论**：Context 复用比 JSEngine 快 **344 倍**！

**原因**：JSEngine 的任务调度开销 (MPSC channel) 约 1-2ms/次，远大于简单 JS 执行时间。

📖 详细分析请参考：[性能优化指南](PERFORMANCE_GUIDE.md)

---

## API 参考

### Context 类

```python
never_jscore.Context(
    enable_extensions: bool = True,      # 启用 Web API 扩展
    enable_logging: bool = False,        # 打印 Rust 日志（调试用）
    random_seed: int | None = None,      # 随机数种子（None = 真随机）
    enable_node_compat: bool = False     # 启用 Node.js 兼容模式
)
```

**方法**：

| 方法 | 说明 | 返回值 |
|------|------|--------|
| `compile(code)` | 编译代码到全局作用域 | None |
| `evaluate(code, auto_await=True)` | 求值（不污染全局） | Any |
| `eval(code, return_value=False, auto_await=True)` | 执行代码（可选返回值） | Any |
| `call(name, args, auto_await=True)` | 调用函数 | Any |
| `gc()` | 请求垃圾回收 | None |
| `get_heap_statistics()` | 获取 V8 堆统计 | dict |
| `take_heap_snapshot(path)` | 导出堆快照 | None |
| `get_hook_data()` | 获取 Hook 数据 | str \| None |
| `clear_hook_data()` | 清空 Hook 数据 | None |

**v3.0.0 性能优化**：所有方法现在都会释放 GIL，多线程性能显著提升！

### JSEngine 类（v3.0.0+）

```python
never_jscore.JSEngine(
    js_code: str,                    # 预加载的 JavaScript 代码
    workers: int = 4,                # Worker 数量
    enable_extensions: bool = True,  # 启用 Web API 扩展
    enable_node_compat: bool = False # 启用 Node.js 兼容模式
)
```

**workers 参数配置** ⚠️：

单线程顺序调用时，workers 数量对性能影响很小（差异 < 2%）：

```python
# 实测：复杂 JS 计算
engine_1 = JSEngine(js_code, workers=1)  # 702 ops/s
engine_4 = JSEngine(js_code, workers=4)  # 713 ops/s (几乎相同)
```

**推荐配置**：
- 单线程顺序调用 → `workers=1` (或直接用 Context 复用，快 22 倍)
- 多线程并发 → `workers = CPU 核心数`
- FastAPI 等异步框架 → `workers = CPU 核心数`

**方法**：

| 方法 | 说明 | 返回值 |
|------|------|--------|
| `call(function_name, args)` | 调用预加载的函数 | Any |
| `execute(code)` | 执行一次性代码 | Any |

**选择建议** (基于实测数据)：

| 场景 | 推荐 | 原因 |
|------|------|------|
| 单线程批量处理 | **Context 复用** ⭐ | 快 50-300 倍 |
| FastAPI / Flask | **Context + ThreadLocal** ⭐ | GIL 释放，性能极佳 |
| 多线程并发 | **Context + ThreadLocal** ⭐ | 性能最好 |
| 每次不同 JS 代码 | **JSEngine** | 避免重复加载 |
| 大型 JS 库 (>1MB) | **JSEngine** | 预加载优势 |
| 简单 JS (btoa/hash) | **Context 复用** ⭐ | 快 300+ 倍 |
| 复杂计算 | **Context 复用** ⭐ | 快 40+ 倍 |

**默认建议**: 先用 Context 复用，除非遇到冷启动问题再考虑 JSEngine

📖 详细选择指南：[性能优化指南 - 快速决策表](PERFORMANCE_GUIDE.md#快速决策表)

### 类型转换

| Python | JavaScript | 示例 |
|--------|-----------|------|
| `None` | `null` | `None` → `null` |
| `bool` | `boolean` | `True` → `true` |
| `int` | `number` | `42` → `42` |
| `float` | `number` | `3.14` → `3.14` |
| `str` | `string` | `"hello"` → `"hello"` |
| `list` | `Array` | `[1, 2]` → `[1, 2]` |
| `dict` | `Object` | `{"a": 1}` → `{a: 1}` |

**嵌套结构自动转换**：

```python
ctx = never_jscore.Context()

# Python → JavaScript
result = ctx.call("processData", [{
    "users": [
        {"id": 1, "name": "Alice", "active": True},
        {"id": 2, "name": "Bob", "active": False}
    ],
    "count": 2
}])

# JavaScript → Python
data = ctx.evaluate("({status: 'ok', items: [1, 2, 3]})")
print(type(data))  # <class 'dict'>
print(data['items'])  # [1, 2, 3]
```

---

## 最佳实践

### ✅ 推荐做法

#### 1. Context 复用（提升性能）

```python
# ✅ 推荐：复用 Context
ctx = never_jscore.Context()
ctx.compile(js_code)

for i in range(10000):
    result = ctx.call("encrypt", [data])

del ctx  # 清理资源
```

#### 2. JSEngine 批量处理（v3.0.0）

```python
# ✅ 推荐：批量处理使用 JSEngine
engine = never_jscore.JSEngine(js_code, workers=4)

for data in data_list:  # 可以处理任意数量
    result = engine.call("encrypt", [data])

del engine
```

#### 3. 多线程 + ThreadLocal（Context 模式）

```python
# ✅ 推荐：每个线程复用 Context
import threading
from concurrent.futures import ThreadPoolExecutor

thread_local = threading.local()

def get_context():
    if not hasattr(thread_local, 'ctx'):
        thread_local.ctx = never_jscore.Context()
        thread_local.ctx.compile(js_code)
    return thread_local.ctx

def worker(data):
    ctx = get_context()
    return ctx.call("process", [data])

with ThreadPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(worker, data_list))
```

#### 4. 多线程 + JSEngine（v3.0.0，更简单）

```python
# ✅ 推荐：JSEngine 自动处理线程安全
from concurrent.futures import ThreadPoolExecutor

engine = never_jscore.JSEngine(js_code, workers=4)

def worker(data):
    return engine.call("process", [data])

with ThreadPoolExecutor(max_workers=10) as executor:
    results = list(executor.map(worker, data_list))

del engine
```

#### 5. 多进程 + 多线程并发（v3.1.0，生产级并发）

```python
# ✅ 推荐：多进程套多线程，充分利用多核 CPU
import os
from multiprocessing import get_context
from concurrent.futures import ThreadPoolExecutor
import never_jscore

js_code = """
function encrypt(data, key) {
    return btoa(data + key);
}
"""

def process_worker(process_id):
    """每个进程的工作函数"""
    pid = os.getpid()
    print(f"进程 {process_id} 启动 (PID: {pid})")

    # ⚠️ 重要：每个进程必须创建独立的 JSEngine/Context
    # JSEngine/Context 不能跨进程共享！
    engine = never_jscore.JSEngine(js_code, workers=2, enable_node_compat=True)

    def thread_worker(task_id):
        """线程任务"""
        return engine.call("encrypt", [f"data_{task_id}", "secret"])

    # 每个进程内使用多线程
    with ThreadPoolExecutor(max_workers=2) as pool:
        futures = [pool.submit(thread_worker, i) for i in range(10)]
        results = [f.result() for f in futures]

    del engine  # 显式清理资源
    return len([r for r in results if r])

if __name__ == "__main__":
    # ⚠️ Windows 必须使用 'spawn' 方式
    ctx = get_context('spawn')

    with ctx.Pool(processes=4) as pool:
        results = pool.map(process_worker, range(4))

    print(f"总计完成: {sum(results)} 个任务")
```

**多进程注意事项** ⚠️：

| 要点 | 说明 |
|------|------|
| **进程隔离** | 每个进程必须创建独立的 JSEngine/Context，不能跨进程共享 |
| **Windows 兼容** | 必须使用 `get_context('spawn')`，不能用 `fork` |
| **`__main__` 保护** | 多进程代码必须放在 `if __name__ == "__main__":` 中 |
| **资源清理** | 进程结束前用 `del engine` 显式清理，确保正常退出 |
| **线程数配置** | 每个进程的 workers 数 × 进程数 ≤ CPU 核心数 × 2 |

**典型配置建议**（8 核 CPU）：

```python
# 方案 1：4 进程 × 2 workers = 8 并发
ctx.Pool(processes=4)  # 4 进程
JSEngine(js_code, workers=2)  # 每进程 2 workers

# 方案 2：2 进程 × 4 workers = 8 并发
ctx.Pool(processes=2)  # 2 进程
JSEngine(js_code, workers=4)  # 每进程 4 workers

# 方案 3：Context + ThreadLocal（最高性能）
# 每个进程内用 ThreadLocal 复用 Context
```

### ❌ 错误做法

#### 1. 循环中重复创建 Context

```python
# ❌ 错误：性能极差
for i in range(1000):
    ctx = never_jscore.Context()
    ctx.compile(js_code)
    result = ctx.call("encrypt", [data])
    del ctx  # 每次都要重新初始化 V8
```

#### 2. 循环中直接使用 with 语句

```python
# ❌ 错误：会在第 10-20 次崩溃
for i in range(100):
    with never_jscore.Context() as ctx:
        result = ctx.call("encrypt", [data])
```

**原因**：Python 的 `with` 不保证对象立即销毁，导致 V8 Isolate 堆积。

**解决方案**：用函数包装

```python
# ✅ 正确：函数作用域强制清理
def process(data):
    with never_jscore.Context() as ctx:
        ctx.compile(js_code)
        return ctx.call("encrypt", [data])

for i in range(10000):
    result = process(data)
```

#### 3. 跨线程共享 Context

```python
# ❌ 错误：会崩溃
ctx = never_jscore.Context()  # 全局 Context

def worker(data):
    return ctx.call("encrypt", [data])  # ❌ 多线程访问同一个 Context

with ThreadPoolExecutor(max_workers=4) as executor:
    results = executor.map(worker, data_list)  # 崩溃
```

**原因**：Context 不是线程安全的。

**解决方案**：使用 ThreadLocal 或 JSEngine。

---

## 常见问题

### Q: 什么时候选择 never_jscore 而不是 PyMiniRacer？

**选择 never_jscore**：
- ✅ 需要 Promise/async 支持（现代 JS 库必须）
- ✅ 需要浏览器/Node.js 环境（补环境）
- ✅ 需要 Hook 拦截功能（逆向必备）
- ✅ 需要确定性随机数（调试加密算法）
- ✅ 需要批量处理（JSEngine 性能更强）

**选择 PyMiniRacer**：
- ✅ 只需要执行简单同步 JS
- ✅ 不需要任何 Web API

### Q: 为什么比 PyExecJS 快 100-300 倍？

**PyExecJS 架构**：
```
Python → 启动进程 → 外部 JS 引擎 → JSON 序列化 → 进程通信 → Python
```
每次调用都有进程启动和 IPC 开销（~2ms）。

**never_jscore 架构**：
```
Python → Rust FFI → V8 引擎 → Rust FFI → Python
```
直接内存通信，无进程开销（~0.004ms）。

### Q: compile() 和 evaluate() 有什么区别？

| | compile() | evaluate() / call() |
|---|-----------|---------------------|
| **用途** | 定义函数、加载库 | 执行代码、获取结果 |
| **全局作用域** | ✅ 影响 | ❌ 不影响 |
| **运行微任务** | ✅ queueMicrotask | ✅ queueMicrotask |
| **运行宏任务** | ❌ 不等待 setTimeout | ✅ 等待 setTimeout |
| **等待 Promise** | ❌ 不等待 | ✅ 自动等待 |

**典型用法**：
```python
# 第一步：用 compile 加载 JS 库（快）
ctx.compile("""
    function encrypt(data) {
        return new Promise(resolve => {
            setTimeout(() => resolve(btoa(data)), 100);
        });
    }
""")

# 第二步：用 call 调用函数（自动等待 Promise）
result = ctx.call("encrypt", ["hello"])  # 会等待 100ms
```

### Q: Context vs JSEngine，该用哪个？⚠️ 重要

**真相**：Context 复用模式在 99% 场景下性能更好（快 50-340 倍）！

**快速判断**：
- **默认选择** → Context 复用 ⭐
- **无法复用** (每次不同 JS 代码) → JSEngine
- **大型 JS 库** (>1MB) 冷启动 → JSEngine
- **FastAPI / Flask** → Context + ThreadLocal ⭐
- **单线程批量** → Context 复用 ⭐

**性能对比** (实测)：
```python
# Context 复用：255,969 ops/s ⭐
ctx = Context()
ctx.compile(js_code)
for data in data_list:
    result = ctx.call("process", [data])

# JSEngine：743 ops/s (慢 344 倍)
engine = JSEngine(js_code, workers=4)
for data in data_list:
    result = engine.call("process", [data])
```

📖 详细分析：[性能优化指南](PERFORMANCE_GUIDE.md)

### Q: 如何处理大量数据（避免内存溢出）？

**方法 1**：批量处理 + 手动 GC

```python
ctx = never_jscore.Context()
ctx.compile(js_code)

for batch in chunks(data, 1000):  # 每 1000 条一批
    results = [ctx.call("process", [item]) for item in batch]
    ctx.gc()  # 手动触发垃圾回收
    save_results(results)
```

**方法 2**：使用 JSEngine（推荐）

```python
engine = never_jscore.JSEngine(js_code, workers=4)

for item in data:  # 可以处理任意数量
    result = engine.call("process", [item])
    save_result(result)

del engine
```

---

## 完整示例

查看 `tests/` 目录获取更多示例：

| 测试文件 | 功能 |
|---------|------|
| `test_async_promise.py` | Promise/async/await |
| `test_terminate_hook.py` | Hook 拦截系统 |
| `test_random_seed.py` | 确定性随机数 |
| `test_multithreading.py` | 多线程使用 |
| `test_engine.py` | JSEngine Worker Pool |
| `test_memory_and_performance.py` | 内存监控和性能 |
| `canvas_complete_example.py` | Canvas 2D API |

运行所有测试：
```bash
python tests/run_all_tests.py
```

---

## 更新日志

### v3.2.0 (2026-04-06) 🔧 Node.js 兼容性修复 & 运行时优化

#### V8 / Deno Core 升级
- **deno_core 0.380 → 0.396**，V8 引擎 ~13.0 → **14.7**
- **V8 14.7 新特性**：更强的 JIT（TurboFan/Maglev 优化）、更完整的 ES2024 支持、WebAssembly 性能提升
- **simdutf 集成**：SIMD 加速的 UTF-8 / Base64 编解码，`atob`/`btoa` 性能大幅提升
- 新增 `deno_node_sqlite` / `deno_node_crypto` 作为独立 crate，提供 `node:sqlite` / `node:crypto` 支持
- `.cargo/config.toml` 新增 `RUSTY_V8_ARCHIVE` 配置（`force = true`），无需手动设置环境变量即可编译

#### 反检测增强
- 🛡️ **Node.js 全局变量设为不可枚举**（`enumerable: false`）
  - `Buffer`, `global`, `require`, `module`, `__dirname`, `__filename`, `setImmediate`, `clearImmediate` 不再出现在 `Object.keys(globalThis)` / `for..in` 中
- 🛡️ **反射 API 隐藏 Node.js 特征**
  - `hiddenGlobalProps` 新增：`global`, `Buffer`, `require`, `module`, `__dirname`, `__filename`, `setImmediate`, `clearImmediate`, `process`
  - 对 `Object.getOwnPropertyNames` / `Reflect.ownKeys` / `Object.getOwnPropertyDescriptors` 同样生效
- 🛡️ **Error.stack 清理增强**
  - 新增过滤内部脚本名：`<init_core>`, `<init_xhr>`, `<exec>`, `<eval_async>`

#### 性能优化
- ⚡ **定时器清理复杂度从 O(总计数) 降为 O(本次创建数)**
  - 原：`for i in 0..=totalTimerCount+1000`（随执行次数线性增长）
  - 现：`for i in baseId..=endId`（仅清理本次执行窗口内创建的定时器）
- ⚡ **微任务队列排空改为自适应终止**
  - 原：固定 poll 10 次（无论队列是否已空）
  - 现：`Poll::Ready`（队列空）或 `Poll::Pending`（仅剩 I/O/定时器）时立即退出，最大 32 次兜底

---

### v3.1.0 (2026-01-30) ⚡ 性能优化与稳定性修复

- 🔧 **进程退出修复**
  - 修复 Python 进程执行完成后卡住不退出的问题
  - 每个 Context 现在拥有独立的 Tokio Runtime，随 Context 销毁自动清理
  - 解决 `setTimeout` 定时器阻塞事件循环的问题

- ⚡ **JSEngine Runtime 复用优化**
  - 使用 `thread_local OnceCell` 复用 Tokio Runtime
  - 避免每次调用都创建新 Runtime，性能提升约 200%

- 🚀 **类型转换性能优化**
  - `json_to_python` 数组转换消除双重迭代
  - `ResultStorage` 使用 `Cell<bool>` 替代 `RefCell<bool>`，减少借用检查开销

- 🔧 **FastReturnMode 修复**
  - `op_store_result` 仅在 `FastReturnMode` 启用时才终止执行
  - 修复非 fast_return 模式下 "execution terminated" 错误

- 📖 **多进程 + 多线程文档**
  - 新增生产级多进程并发使用指南
  - 详细说明 Windows `spawn` 模式、进程隔离等注意事项

### v3.0.0 (2026-01-01) 🎉 重大架构升级

- 🚀 **Worker Pool 架构 - JSEngine**
  - 预加载 JS 代码到多个 workers，避免重复加载
  - **适用场景**：冷启动优化（无法复用 Context 时）
  - 冷启动性能提升 10-100 倍（相比 Context 重复加载）
  - Worker 级别的 hook 数据隔离，无数据竞争
  - Hook 数据直接返回，消除竞态条件
  - 自动 Worker 池管理和任务调度
  - 多线程使用例子[test_engine.py](tests/test_engine.py),[test_multithreading.py](tests/test_multithreading.py),
  - 不同使用情况下测速[test_performance_comparison.py](tests/test_performance_comparison.py)

- ⚡ **Context GIL 释放优化** ⭐ 最重要的性能提升
  - 所有方法（`compile`, `call`, `eval`, `evaluate`）现在都会释放 GIL
  - 使用 `SendPtr` 包装器实现安全的 GIL 释放
  - **性能飞跃**：Context 复用模式达到 255,000 ops/s（简单任务）
  - 多线程 Python 程序性能显著提升

- 🔧 **Cargo.toml 依赖优化**
  - 移除 7 个不必要的显式依赖
  - 依赖精简 14%，降低编译复杂度

- 📖 **性能真相揭秘**
  - **Context 复用** 快 50-340 倍（相比 JSEngine）
  - [UVICORN_WORKERS_EXPLAINED.md](docs/UVICORN_WORKERS_EXPLAINED.md) fastapi多进程测试报告
  - 更新最佳实践建议：默认使用 Context 复用

### v2.5.2 (2025-12-26)

- 🎯 Canvas 2D API（纯 Rust 实现，替代 node-canvas）
- 🔧 编译参数优化，Linux whl 从 41MB 减小至 29MB
- 🛡️ deno_core 升级至 0.376.0（V8 142.2.0）

### v2.5.0 (2025-11-30)

- 🏗️ 模块化扩展架构
- 🔄 完整 Node.js 兼容层（require + npm 包）
- 🛡️ API 保护增强（隐藏 Deno 特征）

详见完整更新日志（历史版本省略）。

---

## 文档和资源

### 📚 官方文档

- **快速开始**：本 README
- **性能优化指南** ⭐：[PERFORMANCE_GUIDE.md](PERFORMANCE_GUIDE.md) - Context vs JSEngine 性能真相
- **Canvas API 参考**：[docs/CANVAS_API_REFERENCE.md](docs/CANVAS_API_REFERENCE.md)
- **Node.js API 对比**：[NODEJS_V25_API_COMPARISON.md](NODEJS_V25_API_COMPARISON.md)
- **多线程支持**：[UVICORN_WORKERS_EXPLAINED.md](docs/UVICORN_WORKERS_EXPLAINED.md)

### 🔗 相关项目

- [Deno](https://github.com/denoland/deno) - 现代 JavaScript/TypeScript 运行时
- [PyO3](https://github.com/PyO3/pyo3) - Rust ↔ Python 绑定库

---

## 技术交流

- **技术交流群**：加微信 xu970821582
- **博客**：http://www.ma2e.top/
- **提醒**：推荐使用 Python 3.14 以获得最佳性能

---

## 许可证

MIT License - 详见 [LICENSE](LICENSE)

**警告**：仅供技术研究和学习，请勿用于违法用途，后果自负。

---

## 贡献和反馈

欢迎提交 Issue 和 Pull Request！

- **Bug 报告**：[GitHub Issues](https://github.com/neverl805/never-jscore/issues)
- **功能建议**：[GitHub Discussions](https://github.com/neverl805/never-jscore/discussions)

---

**⭐ 如果这个项目对你有帮助，请给个 Star！**
