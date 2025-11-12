# HandleScope 错误解决方案

## 问题描述

在循环中反复创建 `Context` 而不显式释放时，会遇到 V8 HandleScope 错误：

```
Fatal error in v8::HandleScope::CreateHandle()
Cannot create a handle without a HandleScope
```

## 问题原因

1. **V8 HandleScope 机制**：V8 使用 HandleScope 来管理 JavaScript 对象的引用
2. **Python GC 延迟**：Python 的垃圾回收不是立即的，旧 Context 可能还未释放
3. **资源积累**：循环中快速创建多个 Context，导致 HandleScope 耗尽

**问题代码示例**：

```python
def run():
    for i in range(2):
        ctx = never_jscore.Context()  # ❌ 循环中创建
        ctx.compile(js)
        result = ctx.call("encrypt", ['data'])
        print(result)
        # ❌ 没有 del ctx，资源未释放

with ThreadPoolExecutor(4) as t:
    for i in range(4):
        t.submit(run)  # ❌ 多个线程同时运行，问题加剧
```

## 解决方案

### 方案 1：循环外创建 Context（最推荐） ⭐⭐⭐⭐⭐

**适用场景**：同一JS代码需要多次调用

**优点**：
- ✅ 性能最好（只创建一次）
- ✅ 无内存问题
- ✅ 代码简单

```python
def run():
    ctx = never_jscore.Context()  # ✅ 循环外创建一次
    ctx.compile(js)

    for i in range(100):  # 可以循环很多次
        result = ctx.call("encrypt", ['data'])
        print(result)

with ThreadPoolExecutor(4) as t:
    for i in range(4):
        t.submit(run)
```

**测试结果**：✅ 循环100次，无错误

---

### 方案 2：显式 del ⭐⭐⭐⭐

**适用场景**：必须在循环内创建Context（如每次需要不同的配置）

**优点**：
- ✅ 确保及时释放
- ✅ 适用于必须在循环内创建的场景

```python
def run():
    for i in range(10):
        ctx = never_jscore.Context()
        ctx.compile(js)
        result = ctx.call("encrypt", ['data'])
        print(result)
        del ctx  # ✅ 显式删除，立即释放资源
```

**测试结果**：✅ 多线程环境成功

---

### 方案 3：使用 with 语句 ⭐⭐⭐⭐⭐

**适用场景**：希望代码更清晰，自动管理生命周期

**优点**：
- ✅ 代码最清晰
- ✅ 自动调用 `__exit__` 并 GC
- ✅ 异常安全

```python
def run():
    for i in range(10):
        with never_jscore.Context() as ctx:  # ✅ with 自动管理
            ctx.compile(js)
            result = ctx.call("encrypt", ['data'])
            print(result)
        # ✅ with 结束时自动清理
```

**测试结果**：✅ 自动清理，无错误

---

### 方案 4：ThreadLocal 复用（多线程最推荐） ⭐⭐⭐⭐⭐

**适用场景**：多线程环境，每个线程需要独立的Context

**优点**：
- ✅ 每个线程只创建一次Context
- ✅ 线程安全
- ✅ 性能最优

```python
import threading

thread_local = threading.local()

def get_context():
    """获取线程本地的Context（懒初始化）"""
    if not hasattr(thread_local, 'ctx'):
        thread_local.ctx = never_jscore.Context()
        thread_local.ctx.compile(js)
    return thread_local.ctx

def run():
    ctx = get_context()  # ✅ 线程本地复用
    for i in range(100):
        result = ctx.call("encrypt", ['data'])
        print(result)

with ThreadPoolExecutor(4) as t:
    for i in range(4):
        t.submit(run)
```

**测试结果**：✅ 多线程高性能，无错误

---

### 方案 5：del + gc.collect()（强制清理） ⭐⭐⭐

**适用场景**：需要强制立即清理的场景

**优点**：
- ✅ 确保立即释放
- ✅ 适合资源敏感场景

```python
import gc

def run():
    for i in range(10):
        ctx = never_jscore.Context()
        ctx.compile(js)
        result = ctx.call("encrypt", ['data'])
        print(result)
        del ctx

        if i % 5 == 0:  # 每5次强制GC
            gc.collect()  # ✅ 强制Python GC
```

**测试结果**：✅ 强制清理成功

---

## 方案对比

| 方案 | 性能 | 易用性 | 适用场景 | 推荐度 |
|------|------|--------|----------|--------|
| 1. 循环外创建 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 单线程/多线程 | ⭐⭐⭐⭐⭐ |
| 2. 显式 del | ⭐⭐⭐ | ⭐⭐⭐⭐ | 必须循环内创建 | ⭐⭐⭐⭐ |
| 3. with 语句 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 代码清晰度优先 | ⭐⭐⭐⭐⭐ |
| 4. ThreadLocal | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 多线程 | ⭐⭐⭐⭐⭐ |
| 5. gc.collect() | ⭐⭐ | ⭐⭐⭐ | 强制清理 | ⭐⭐⭐ |

---

## 最佳实践

### ✅ 推荐做法

1. **单线程场景**：
   ```python
   # 首选：循环外创建
   ctx = never_jscore.Context()
   ctx.compile(js)
   for i in range(1000):
       result = ctx.call("func", args)
   ```

2. **多线程场景**：
   ```python
   # 首选：ThreadLocal 复用
   thread_local = threading.local()

   def get_ctx():
       if not hasattr(thread_local, 'ctx'):
           thread_local.ctx = never_jscore.Context()
       return thread_local.ctx
   ```

3. **必须循环内创建**：
   ```python
   # 首选：with 语句
   for i in range(100):
       with never_jscore.Context() as ctx:
           result = ctx.evaluate(code)
   ```

### ❌ 避免的做法

```python
# ❌ 避免：循环内创建而不清理
for i in range(100):
    ctx = never_jscore.Context()
    result = ctx.evaluate(code)
    # 没有 del ctx

# ❌ 避免：多线程共享 Context
ctx = never_jscore.Context()  # 全局创建

def worker():
    result = ctx.evaluate(code)  # ❌ 多线程共享

threads = [threading.Thread(target=worker) for _ in range(4)]
```

---

## 技术细节

### V8 HandleScope 工作原理

```
V8 Isolate
    └── HandleScope (栈结构)
            ├── Handle 1
            ├── Handle 2
            └── Handle N
```

- 每个 JavaScript 对象需要一个 Handle
- HandleScope 有大小限制
- 循环创建 Context 会耗尽 HandleScope

### Python GC vs V8 GC

```python
ctx = never_jscore.Context()  # 创建 Context（包含 V8 Isolate）
ctx = None  # Python 引用计数减1，但不一定立即释放

del ctx  # 显式删除，尽快触发析构
gc.collect()  # 强制 Python GC
```

- Python GC 是延迟的（引用计数 + 分代回收）
- V8 资源需要显式管理
- `del` 可以尽快触发析构

### Context 生命周期

```rust
// src/context.rs
impl Drop for Context {
    fn drop(&mut self) {
        // V8 runtime 会在 RefCell 销毁时自动清理
    }
}

#[pymethods]
impl Context {
    fn __exit__(&self, ...) -> PyResult<bool> {
        self.gc()?;  // with 语句结束时调用
        Ok(false)
    }
}
```

---

## 示例代码

完整的可运行示例：`examples/test.py`

```bash
# 运行修复后的示例
python examples/test.py

# 输出：
# 测试修复版本 1：循环外创建 Context
# [OK] 成功！
# 测试修复版本 2：显式 del
# [OK] 成功！
# 测试修复版本 3：ThreadLocal 复用
# [OK] 成功！
```

---

## 总结

**问题根源**：循环中反复创建 Context 而不释放

**核心解决方案**：
1. ⭐⭐⭐⭐⭐ 循环外创建，循环内复用
2. ⭐⭐⭐⭐⭐ 多线程用 ThreadLocal
3. ⭐⭐⭐⭐⭐ 用 with 语句自动管理
4. ⭐⭐⭐⭐ 显式 del
5. ⭐⭐⭐ del + gc.collect()

**关键点**：
- Context 创建有开销，尽量复用
- 必须在循环内创建时，务必 `del`
- 多线程用 ThreadLocal，不要共享 Context
- with 语句是最清晰的资源管理方式

**参考资料**：
- `examples/test.py` - 完整示例
- `examples/test_fixed.py` - 所有解决方案
- `tests/test_multithreading.py` - 多线程测试
