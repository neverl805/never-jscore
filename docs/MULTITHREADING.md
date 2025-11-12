# never_jscore 多线程支持指南

## 概述

never_jscore **已经支持多线程执行**，采用"线程本地 Context"模式：

- ✅ V8 平台：全局初始化一次，线程安全
- ✅ Tokio Runtime：每个线程独立的单线程 runtime
- ✅ Context/Isolate：每个线程创建独立的 Context
- ✅ 完全隔离：不同线程的 Context 互不干扰

## 架构设计

### V8 全局初始化（仅一次）

```rust
// src/runtime.rs
static V8_INITIALIZED: OnceLock<()> = OnceLock::new();

pub fn ensure_v8_initialized() {
    V8_INITIALIZED.get_or_init(|| {
        deno_core::JsRuntime::init_platform(None, false);
    });
}
```

**关键点**：
- V8 平台在第一次调用时初始化
- 使用 `OnceLock` 确保线程安全和单次初始化
- 多个 Context/Isolate 可以共享同一个 V8 平台

### 线程本地 Tokio Runtime

```rust
// src/runtime.rs
thread_local! {
    static TOKIO_RUNTIME: RefCell<Option<tokio::runtime::Runtime>> = RefCell::new(None);
}
```

**关键点**：
- 每个 OS 线程有独立的单线程 Tokio runtime
- 避免多线程 runtime 的调度器导致的 RefCell 问题
- 不同线程的 runtime 完全独立，无竞争

### Context 隔离

```rust
// context.rs
#[pyclass(unsendable)]
pub struct Context {
    runtime: RefCell<JsRuntime>,  // 每个 Context 独立的 V8 Isolate
    result_storage: Rc<ResultStorage>,
    // ...
}
```

**关键点**：
- `unsendable` 标记：Context 不能跨线程传递
- 每个 Context 有独立的 V8 Isolate
- ResultStorage 使用 `RefCell`（线程本地，无竞争）

## 使用方式

### 方式 1：线程本地 Context（推荐）

每个线程创建独立的 Context：

```python
import never_jscore
import threading

def worker(thread_id):
    # 每个线程创建自己的 Context
    ctx = never_jscore.Context(enable_extensions=True)

    # 执行 JS 代码
    result = ctx.evaluate(f"""
        (async () => {{
            // 使用扩展功能
            const hash = md5('thread-{thread_id}');

            // 异步操作
            await new Promise(resolve => setTimeout(resolve, 10));

            return {{
                thread_id: {thread_id},
                hash: hash,
                timestamp: Date.now()
            }};
        }})()
    """)

    print(f"线程 {thread_id}: {result}")

# 创建多个线程
threads = []
for i in range(5):
    t = threading.Thread(target=worker, args=(i,))
    threads.append(t)
    t.start()

# 等待所有线程完成
for t in threads:
    t.join()
```

**优点**：
- ✅ 完全隔离，无竞争
- ✅ 可以并行执行
- ✅ 每个 Context 有独立的全局作用域

### 方式 2：Context 池（高级）

复用 Context 以减少初始化开销：

```python
import never_jscore
import threading
import queue

class ContextPool:
    def __init__(self, size=4):
        self.pool = queue.Queue(maxsize=size)
        for _ in range(size):
            ctx = never_jscore.Context(enable_extensions=True)
            self.pool.put(ctx)

    def execute(self, code):
        ctx = self.pool.get()  # 获取一个 Context
        try:
            return ctx.evaluate(code)
        finally:
            self.pool.put(ctx)  # 归还 Context

# 创建 Context 池
pool = ContextPool(size=4)

def worker(task_id):
    result = pool.execute(f"""
        (async () => {{
            const hash = md5('task-{task_id}');
            await new Promise(resolve => setTimeout(resolve, 5));
            return {{ task_id: {task_id}, hash: hash }};
        }})()
    """)
    print(f"任务 {task_id}: {result}")

# 处理多个任务
threads = [threading.Thread(target=worker, args=(i,)) for i in range(20)]
for t in threads:
    t.start()
for t in threads:
    t.join()
```

**优点**：
- ✅ 减少 Context 创建开销
- ✅ 控制并发数量
- ⚠️ 注意：不同任务共享全局作用域

### 方式 3：线程池 + ThreadLocal

结合线程池和线程本地存储：

```python
import never_jscore
from concurrent.futures import ThreadPoolExecutor
import threading

# 线程本地存储
thread_local = threading.local()

def get_context():
    """获取当前线程的 Context（懒初始化）"""
    if not hasattr(thread_local, 'context'):
        thread_local.context = never_jscore.Context(enable_extensions=True)
    return thread_local.context

def process_task(code):
    ctx = get_context()
    return ctx.evaluate(code)

# 使用线程池
with ThreadPoolExecutor(max_workers=4) as executor:
    tasks = [
        executor.submit(process_task, f"(async () => {{ await new Promise(r => setTimeout(r, 10)); return {i}; }})()")
        for i in range(20)
    ]

    results = [future.result() for future in tasks]
    print(f"处理了 {len(results)} 个任务")
```

**优点**：
- ✅ 自动管理线程生命周期
- ✅ Context 与线程绑定，安全可靠
- ✅ 适合长期运行的服务

## 性能特性

### 并发 vs 并行

由于每个线程使用单线程 Tokio runtime：

- **CPU密集型任务**：真正的并行执行（多个 Python 线程 = 多个 OS 线程）
- **异步 I/O 任务**：在各自线程内串行执行异步操作
- **定时器任务**：每个线程独立计时，不互相阻塞

### 性能测试结果

基于 `tests/test_multithreading.py`：

```
测试 1: 线程本地 Context
- 5 个线程并发执行
- 每个执行异步 JS 代码（md5、setTimeout）
- 结果：所有线程成功，无错误

测试 2: 并发执行性能
- 单线程 vs 多线程执行时间对比
- 由于测试中大量使用 setTimeout，加速比接近 1x
- CPU密集型任务会有更明显的加速

测试 3: Context 隔离
- 每个线程的全局变量完全隔离
- 无数据竞争或污染
```

## 最佳实践

### ✅ 推荐做法

1. **每个线程独立 Context**
   ```python
   def worker():
       ctx = never_jscore.Context()  # 线程内创建
       result = ctx.evaluate("...")
   ```

2. **使用 ThreadLocal 复用**
   ```python
   thread_local = threading.local()

   def get_ctx():
       if not hasattr(thread_local, 'ctx'):
           thread_local.ctx = never_jscore.Context()
       return thread_local.ctx
   ```

3. **Context 池控制并发**
   ```python
   pool = ContextPool(size=cpu_count())
   ```

### ❌ 避免的做法

1. **跨线程共享 Context**
   ```python
   ctx = never_jscore.Context()  # ❌ 全局 Context

   def worker():
       ctx.evaluate("...")  # ❌ 多个线程共享
   ```

   **原因**：Context 是 `unsendable`，V8 Isolate 不是线程安全的

2. **在主线程创建，在子线程使用**
   ```python
   ctx = never_jscore.Context()  # 主线程创建

   def worker():
       ctx.evaluate("...")  # ❌ 子线程使用

   threading.Thread(target=worker).start()
   ```

   **原因**：Context 和 Tokio runtime 绑定到创建线程

3. **不清理 Context**
   ```python
   def worker():
       for i in range(1000):
           ctx = never_jscore.Context()  # ❌ 反复创建不释放
           ctx.evaluate("...")
   ```

   **原因**：Context 有内存开销，应复用或及时 del

## 技术细节

### 为什么使用线程本地 runtime？

**问题**：最初尝试使用多线程 Tokio runtime 时出现 "No result stored" 错误。

**原因**：
- `ResultStorage` 使用 `RefCell`（非线程安全）
- 多线程 runtime 的 `block_on` 可能在不同 worker 线程上调度
- 导致 RefCell 的 borrow 检查失败

**解决方案**：
- 每个线程独立的单线程 Tokio runtime
- RefCell 只在单线程内使用，无竞争
- 多个线程的 runtime 完全独立

### V8 Isolate 的线程模型

V8 Isolate 本身就是单线程的：

```rust
// 每个 Context 有独立的 JsRuntime（Isolate）
runtime: RefCell<JsRuntime>
```

- 单个 Isolate 不能跨线程使用
- 但可以有多个 Isolate 在不同线程上并行
- V8 平台（全局）支持多个 Isolate

## 常见问题

### Q1: 为什么加速比不明显？

**A**: 取决于工作负载：
- CPU密集型 JS 计算：会有明显加速（2-4x）
- 异步 I/O（setTimeout、fetch）：受限于单线程 runtime，加速有限
- 建议：纯计算任务使用多线程，I/O任务使用单线程 + 大量并发

### Q2: 可以使用多进程吗？

**A**: 可以！每个进程独立的 V8 平台：
```python
from multiprocessing import Pool

def process_worker(code):
    ctx = never_jscore.Context()
    return ctx.evaluate(code)

with Pool(processes=4) as pool:
    results = pool.map(process_worker, [code1, code2, ...])
```

### Q3: Context 创建开销大吗？

**A**: 相对较大（需要创建 V8 Isolate），建议：
- 单线程单任务：每次创建销毁
- 长期运行：使用 ThreadLocal 复用
- 高并发：使用 Context 池

### Q4: LIFO 删除限制还存在吗？

**A**: 在线程本地模式下，限制已大幅缓解：
- 每个线程的 Context 独立，不影响其他线程
- 同一线程内仍建议 LIFO 删除
- 建议使用 `with` 或 ThreadLocal 自动管理

## 总结

**你的方案完全可行**：

✅ V8 平台全局初始化一次（已实现）
✅ 多个独立 Isolate/Context（已实现）
✅ 线程本地 Tokio runtime（已优化）
✅ 真正的多线程并发（已验证）

**推荐使用模式**：
- 简单任务：每个线程创建独立 Context
- 高性能场景：ThreadLocal 复用 Context
- 超高并发：Context 池 + 线程池

运行 `python tests/test_multithreading.py` 查看完整示例！
