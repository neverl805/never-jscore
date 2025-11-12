# never_jscore

基于 Deno Core (V8) 的高性能 Python JavaScript 执行引擎，**专为 JS 逆向工程优化**。

[![PyPI](https://img.shields.io/pypi/v/never-jscore)](https://pypi.org/project/never-jscore/)
[![Python](https://img.shields.io/pypi/pyversions/never-jscore)](https://pypi.org/project/never-jscore/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

**警告**：仅供技术研究和学习，请勿用于违法用途，后果自负。

加v进交流群: xu970821582

---

## 核心特性

- ⚡ **极致性能**：比 PyExecJS 快 100-300 倍，与 PyMiniRacer 性能相当
- 🔄 **Promise/async 支持**：完整支持 Promise 和 async/await（PyMiniRacer 不支持）
- 🎣 **Hook 拦截**：支持在任意位置终止 JS 执行并返回结果（`$return(value)`）
- 🎲 **确定性随机数**：支持固定种子，方便调试动态参数算法
- 🌐 **完整 Web API**：require()、fetch()、localStorage、浏览器环境等
- 🎯 **JS 逆向优化**：专为补环境设计，无需额外 polyfill
- 📦 **上下文隔离**：每个 Context 独立的 V8 执行环境
- 🛡️ **类型安全**：完整的类型提示（.pyi 文件）

## 性能对比

| 测试项目 | never_jscore | PyMiniRacer | PyExecJS |
|---------|-------------|-------------|----------|
| 简单计算 | 0.007ms | 0.005ms | 2.3ms |
| 字符串操作 | **0.004ms** 🏆 | 0.008ms | 2.3ms |
| 数组操作 | **0.004ms** 🏆 | 0.006ms | 2.3ms |
| 复杂算法(1000次) | **0.0111s** 🏆 | 0.0383s | 69.4735s |
| Promise | **✅ 0.003ms** | ❌ 不支持 | ❌ 不支持 |

## 安装

```bash
pip install never-jscore
```

## 快速开始

### 基本用法

```python
import never_jscore

# 创建 Context
ctx = never_jscore.Context()

# 编译 JavaScript 代码
ctx.compile("""
    function add(a, b) {
        return a + b;
    }
""")

# 调用函数
result = ctx.call("add", [5, 3])
print(result)  # 8

# 一次性求值
result = ctx.evaluate("1 + 2 + 3")
print(result)  # 6
```

### Promise/async 支持

```python
import never_jscore

ctx = never_jscore.Context()

# async 函数
ctx.compile("""
    async function fetchData(id) {
        return await Promise.resolve({id: id, name: "User" + id});
    }
""")

# Promise 自动等待
result = ctx.call("fetchData", [123])
print(result)  # {'id': 123, 'name': 'User123'}

# Promise 链
result = ctx.evaluate("""
    Promise.resolve(10)
        .then(x => x * 2)
        .then(x => x + 5)
""")
print(result)  # 25
```

### Hook 拦截（v2.2.2+）

```python
import never_jscore

ctx = never_jscore.Context()

# Hook XMLHttpRequest.send 拦截加密数据
result = ctx.evaluate("""
    (async () => {
        // Hook XMLHttpRequest.send
        const originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(data) {
            // 拦截数据，立即返回
            $return({
                method: this._method,
                url: this._url,
                data: data  // 加密数据
            });
        };

        // 执行加密和发送
        const encrypted = btoa(JSON.stringify({ secret: 'value' }));
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://api.example.com/login');
        xhr.send(encrypted);  // 被拦截
    })()
""")

print(f"拦截到的数据: {result['data']}")
```

**Hook API**：
- `__neverjscore_return__(value)` - 完整函数名
- `$return(value)` - 简短别名（推荐）
- `$exit(value)` - 替代别名

### 确定性随机数（v2.3.0+）

```python
import never_jscore

# 使用固定种子
ctx = never_jscore.Context(random_seed=12345)

# 每次运行产生相同的随机数
r1 = ctx.evaluate("Math.random()")  # 0.8831156266...
r2 = ctx.evaluate("Math.random()")  # 0.5465919174...

# 相同种子产生相同结果
ctx2 = never_jscore.Context(random_seed=12345)
r3 = ctx2.evaluate("Math.random()")  # 0.8831156266... (与 r1 相同!)

# 适用于所有随机数 API
uuid = ctx.evaluate("crypto.randomUUID()")  # 固定的 UUID
```

### Web API 扩展

```python
import never_jscore

# 启用扩展（默认）
ctx = never_jscore.Context(enable_extensions=True)

# require() - CommonJS 模块
result = ctx.evaluate("""
    const CryptoJS = require('crypto-js');
    CryptoJS.AES.encrypt('message', 'secret').toString();
""")

# fetch() - HTTP 请求
result = ctx.evaluate("""
    (async () => {
        const response = await fetch('https://api.github.com/users/github');
        const data = await response.json();
        return data.login;
    })()
""")

# localStorage - 浏览器存储
ctx.eval("localStorage.setItem('token', 'abc123');")
token = ctx.evaluate("localStorage.getItem('token')")

# Crypto API - 加密
result = ctx.evaluate("""
    const hash = md5('test');
    const encoded = btoa(hash);
    encoded
""")

# 浏览器环境
result = ctx.evaluate("""
    JSON.stringify({
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        href: location.href
    })
""")
```

## 重要使用限制

### ⚠️ HandleScope 错误（循环中创建 Context）

**问题**：在循环中反复创建 Context 而不释放会导致崩溃。

```python
# ❌ 错误：会崩溃
for i in range(10):
    ctx = never_jscore.Context()
    result = ctx.call("func", args)
    # 没有 del ctx
```

**解决方案**：

```python
# ✅ 方案 1：循环外创建（最推荐）
ctx = never_jscore.Context()
ctx.compile(js)
for i in range(1000):
    result = ctx.call("func", args)

# ✅ 方案 2：显式 del
for i in range(10):
    ctx = never_jscore.Context()
    result = ctx.call("func", args)
    del ctx  # 显式删除

# ✅ 方案 3：函数作用域 + with
def process():
    with never_jscore.Context() as ctx:
        return ctx.evaluate(code)

for i in range(100):
    result = process()

# ✅ 方案 4：多线程用 ThreadLocal
import threading
thread_local = threading.local()

def get_context():
    if not hasattr(thread_local, 'ctx'):
        thread_local.ctx = never_jscore.Context()
    return thread_local.ctx
```

### ⚠️ with 语句限制

**问题**：直接在循环中使用 with 会崩溃（Python GC 延迟）。

```python
# ❌ 错误：会崩溃
for i in range(10):
    with never_jscore.Context() as ctx:
        result = ctx.call("func", args)
```

**解决方案**：使用函数作用域

```python
# ✅ 正确：函数作用域 + with
def encrypt_data(data):
    with never_jscore.Context() as ctx:
        ctx.compile(js)
        return ctx.call("encrypt", [data])

for i in range(100):  # 可以循环很多次
    result = encrypt_data('data')
```

**详细文档**：
- `docs/HANDLESCOPE_ERROR_SOLUTIONS.md` - HandleScope 错误完整解决方案
- `docs/WITH_STATEMENT_LIMITATION.md` - with 语句限制说明
- `WITH_STATEMENT_FIX.md` - 快速修复指南

### ⚠️ 多线程支持

**推荐**：每个线程创建独立的 Context，使用 ThreadLocal 复用。

```python
import threading
from concurrent.futures import ThreadPoolExecutor

thread_local = threading.local()

def get_context():
    if not hasattr(thread_local, 'ctx'):
        thread_local.ctx = never_jscore.Context()
        thread_local.ctx.compile(js)
    return thread_local.ctx

def worker():
    ctx = get_context()
    for i in range(100):
        result = ctx.call("encrypt", ['data'])

with ThreadPoolExecutor(4) as executor:
    for i in range(4):
        executor.submit(worker)
```

**详细文档**：`docs/MULTITHREADING.md`

## API 参考

### Context 类

```python
never_jscore.Context(
    enable_extensions: bool = True,
    enable_logging: bool = False,
    random_seed: int = None
)
```

**参数**：
- `enable_extensions`：是否启用 Web API 扩展（默认 True）
- `enable_logging`：是否启用日志输出（默认 False）
- `random_seed`：随机数种子，用于确定性执行（默认 None）

**方法**：
- `compile(code: str)` - 编译代码并加入全局作用域
- `eval(code: str, return_value: bool = False, auto_await: bool = True)` - 执行代码
- `evaluate(code: str, auto_await: bool = True)` - 求值（不影响全局）
- `call(name: str, args: list, auto_await: bool = True)` - 调用函数
- `gc()` - 请求垃圾回收
- `get_stats()` - 获取统计信息
- `reset_stats()` - 重置统计

**上下文管理器**：
```python
with never_jscore.Context() as ctx:
    result = ctx.evaluate("1 + 2")
# 自动清理
```

### 类型转换

| Python | JavaScript |
|--------|-----------|
| None | null |
| bool | boolean |
| int | number |
| float | number |
| str | string |
| list | Array |
| dict | Object |

## 内置 Web API

**启用扩展后可用**（`enable_extensions=True`）：

- **Node.js**：require()、fs、path、Buffer、process
- **浏览器存储**：localStorage、sessionStorage
- **浏览器环境**：navigator、location、document、window、screen
- **网络请求**：fetch()、XMLHttpRequest
- **URL 处理**：URL、URLSearchParams、FormData
- **事件系统**：Event、EventTarget
- **加密 API**：md5、sha256、Base64、HMAC
- **编码 API**：encodeURIComponent、TextEncoder、TextDecoder
- **随机数**：crypto.randomUUID、crypto.getRandomValues
- **性能监控**：performance.now、performance.mark、performance.measure

## 示例代码

- `examples/benchmark.py` - 性能基准测试
- `examples/hook_examples.py` - Hook 拦截示例
- `examples/test.py` - 多线程示例
- `tests/test_*.py` - 完整测试套件

## 常见问题

### Q: 什么时候选择 never_jscore？

**A**: 当你需要：
- Promise/async 支持（现代 JS 库）
- 完整的 Node.js 和浏览器环境（补环境）
- Hook 拦截和提前返回（JS 逆向）
- 确定性随机数（调试动态参数）
- 高性能 + Rust 稳定性

### Q: 为什么比 PyExecJS 快那么多？

**A**: PyExecJS 通过进程调用外部 JS 运行时，每次都有进程通信开销。never_jscore 使用 Rust + V8 直接绑定，无额外开销。

### Q: 与 PyMiniRacer 的区别？

**A**:
- **相似**：都使用 V8 引擎，性能相当
- **优势**：支持 Promise/async、完整 Web API、Hook 拦截
- **劣势**：PyMiniRacer 是 V8 的直接绑定，理论上开销更小

### Q: 多线程安全吗？

**A**: 安全。每个线程创建独立的 Context，使用 ThreadLocal 复用。详见 `docs/MULTITHREADING.md`。

### Q: with 语句为什么在循环中会崩溃？

**A**: Python 的 with 语句结束后对象还在内存中，未被立即 GC。解决方案：使用函数作用域包装。详见 `WITH_STATEMENT_FIX.md`。

## 更新日志

### v2.3.1 (2025-11-13) - 多线程完善

- ✨ 添加with never_jscore.Context() as ctx:上下文管理
- ✨ 修复require导入第三方库使用报错
- ✨ 多线程优化（线程本地 Tokio runtime）
- 🔧 重构setInterval,clearInterval等计时器逻辑,修复递归bug

### v2.3.0 (2025-11-12) - 确定性随机数

- ✨ 随机数种子控制（`random_seed` 参数）
- ✨ 支持 Math.random、crypto.randomUUID、crypto.getRandomValues
- ✨ 多线程优化（线程本地 Tokio runtime）
- 🔧 WASM 二进制加载修复
- 🔧 Base64 解码修复
- 📚 完整的多线程文档

### v2.2.2 (2025-11-12) - Hook 拦截

- ✨ Hook 拦截 API（`$return()`, `$exit()`, `__neverjscore_return__()`）
- ✨ 提前返回机制（立即终止 JS 执行）
- 🎯 适用于 Hook 加密函数、拦截请求数据
- 📚 完整的 Hook 使用文档和示例

### v2.2.1 (2025-11-11) - Performance API

- ✨ Performance API（performance.now、mark、measure）
- 📊 高精度时间测量
- 🎯 性能分析和优化

### v2.2.0 (2025-11-11) - 重大功能扩展

- ✨ require() - CommonJS 模块系统
- ✨ fetch() - HTTP 网络请求
- ✨ localStorage/sessionStorage - 浏览器存储
- ✨ 浏览器环境对象（navigator、location、document 等）
- ✨ URL/URLSearchParams、FormData
- ✨ Event/EventTarget、XMLHttpRequest

### v2.0.0 (2025-11-05) - 架构重构

- 🔄 改为 py_mini_racer 风格的实例化 API
- ✅ 修复 HandleScope 错误
- ✨ Web API 扩展系统（Crypto、URL 编码、定时器等）

[查看完整更新日志](CHANGELOG.md)

## 文档

- **快速开始**：本 README
- **HandleScope 错误**：`docs/HANDLESCOPE_ERROR_SOLUTIONS.md`
- **with 语句限制**：`docs/WITH_STATEMENT_LIMITATION.md`
- **多线程支持**：`docs/MULTITHREADING.md`
- **Hook 拦截**：`examples/hook_examples.py`
- **开发指南**：`CLAUDE.md`

## 许可证

MIT License

## 相关项目

- [py_mini_racer](https://github.com/sqreen/PyMiniRacer) - Python MiniRacer 实现
- [PyExecJS](https://github.com/doloopwhile/PyExecJS) - Python ExecJS 实现
- [Deno](https://github.com/denoland/deno) - 现代 JavaScript/TypeScript 运行时
- [PyO3](https://github.com/PyO3/pyo3) - Rust Python bindings
