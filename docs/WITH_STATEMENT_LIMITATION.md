# with 语句使用限制说明

## 问题现象

在循环中直接使用 `with` 语句会导致 HandleScope 错误：

```python
# ❌ 这样会崩溃
for i in range(10):
    with never_jscore.Context() as ctx:
        result = ctx.call("func", args)
```

**错误信息**：
```
Fatal error in v8::HandleScope::CreateHandle()
Cannot create a handle without a HandleScope
```

## 问题原因

1. **Python with 语句的生命周期**：
   - `with` 语句结束时，只调用 `__exit__` 方法
   - 对象本身还在内存中，未被立即销毁
   - Python GC 是延迟的（引用计数 + 分代回收）

2. **循环中的问题**：
   ```python
   for i in range(10):
       with never_jscore.Context() as ctx:  # 创建 Context #1
           pass
       # __exit__ 被调用，但 Context #1 还在内存中

       with never_jscore.Context() as ctx:  # 创建 Context #2
           pass
       # Context #1 和 #2 都还在内存中

       # ... 继续循环，Context 累积
   ```

3. **HandleScope 耗尽**：
   - V8 HandleScope 有大小限制
   - 多个未释放的 Context 导致 HandleScope 耗尽
   - 崩溃！

## 解决方案

### ✅ 方案 1：函数作用域 + with（推荐）

**原理**：函数返回后，局部变量立即被清理

```python
def encrypt_data(data):
    """在函数内使用 with，返回后自动清理"""
    with never_jscore.Context() as ctx:
        ctx.compile(js)
        return ctx.call("encrypt", [data])

# 循环调用函数
for i in range(100):  # 可以循环很多次
    result = encrypt_data('data')
    print(result)
```

**优点**：
- ✅ 代码清晰
- ✅ 自动清理
- ✅ 可以循环很多次

**测试结果**：✅ 循环 100 次成功

---

### ✅ 方案 2：循环外创建（最推荐）

**原理**：复用同一个 Context，无需反复创建

```python
ctx = never_jscore.Context()  # 循环外创建一次
ctx.compile(js)

for i in range(1000):  # 可以循环很多次
    result = ctx.call("encrypt", ['data'])
    print(result)
```

**优点**：
- ✅ 性能最好
- ✅ 最简单
- ✅ 无内存问题

**适用**：90% 的场景

---

### ✅ 方案 3：直接用 del（最简单）

**原理**：不用 with，直接显式 del

```python
for i in range(100):
    ctx = never_jscore.Context()
    ctx.compile(js)
    result = ctx.call("encrypt", ['data'])
    print(result)
    del ctx  # 显式删除，立即释放
```

**优点**：
- ✅ 简单直接
- ✅ 灵活控制
- ✅ 立即释放

---

### ✅ 方案 4：手动管理 with（不推荐）

**原理**：手动调用 `__enter__` 和 `__exit__` + del

```python
for i in range(10):
    ctx = never_jscore.Context()
    ctx.__enter__()
    try:
        ctx.compile(js)
        result = ctx.call("encrypt", ['data'])
    finally:
        ctx.__exit__(None, None, None)
        del ctx  # 关键：显式删除
```

**缺点**：
- ❌ 代码繁琐
- ❌ 不如直接用 del

---

## with 语句的正确用法

### ✅ 适用场景

1. **单次使用**：
   ```python
   with never_jscore.Context() as ctx:
       result = ctx.evaluate("1 + 2")
   ```

2. **函数作用域**：
   ```python
   def process():
       with never_jscore.Context() as ctx:
           return ctx.evaluate(code)
   ```

3. **异常处理**：
   ```python
   try:
       with never_jscore.Context() as ctx:
           result = ctx.call("risky_func", args)
   except Exception as e:
       print(f"Error: {e}")
   ```

### ❌ 不适用场景

1. **直接在循环中**：
   ```python
   # ❌ 会崩溃
   for i in range(10):
       with never_jscore.Context() as ctx:
           result = ctx.call("func", args)
   ```

2. **高频创建**：
   ```python
   # ❌ 会崩溃
   for i in range(100):
       with never_jscore.Context() as ctx:
           result = ctx.evaluate(code)
   ```

---

## 方案对比

| 方案 | 循环次数 | 性能 | 易用性 | 推荐度 |
|------|----------|------|--------|--------|
| 1. 函数作用域 + with | 100+ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 2. 循环外创建 | 无限 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 3. 直接用 del | 100+ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 4. 手动管理 with | 10+ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| ❌ 直接循环 with | **崩溃** | - | - | - |

---

## 技术原理

### Python with 语句的执行流程

```python
with obj as var:
    # do something
```

等价于：

```python
var = obj.__enter__()
try:
    # do something
finally:
    obj.__exit__(exc_type, exc_value, traceback)
```

**关键点**：
- `__exit__` 被调用后，`obj` 还在内存中
- 只有当 `obj` 被垃圾回收时，才会调用 `__del__`
- 在循环中，旧的 `obj` 可能还未被 GC

### V8 HandleScope 工作原理

```
V8 Isolate
    └── HandleScope (栈结构)
            ├── Handle 1 (JS对象引用)
            ├── Handle 2
            └── Handle N
```

- 每个 JavaScript 对象需要一个 Handle
- HandleScope 有大小限制（约 1000-2000 个）
- 循环创建 Context 会耗尽 HandleScope

### 为什么函数作用域有效？

```python
def func():
    with Context() as ctx:
        return ctx.call("foo")
    # 函数返回后，局部变量 ctx 立即被清理

for i in range(100):
    func()  # 每次调用后，ctx 被立即清理
```

Python 的局部变量在函数返回后立即被清理（引用计数减为 0），触发 `__del__`。

---

## 示例代码

完整可运行示例：`examples/test_with_correct_usage.py`

```bash
python examples/test_with_correct_usage.py

# 输出：
# [OK] 正确用法 1：函数作用域 + with（推荐）
# [OK] 正确用法 2：显式 del + with
# [OK] 正确用法 3：不用 with，直接 del（最简单）
# [OK] 正确用法 4：循环外创建（最推荐）
```

---

## 总结

### with 语句的限制

- ✅ 适合单次使用
- ✅ 适合函数作用域
- ❌ **不适合直接在循环中使用**

### 推荐方案

1. **首选**：循环外创建，循环内复用
2. **推荐**：函数作用域 + with
3. **简单**：直接用 del

### 记住

**with 语句在循环中不会立即释放资源！**

如果必须在循环中创建 Context：
- ✅ 用函数作用域包装
- ✅ 或者直接用 del
- ❌ 不要直接在循环中用 with
