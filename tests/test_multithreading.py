"""
多线程测试 - 验证优化后的多线程支持

测试两种使用模式：
1. 线程本地 Context（推荐）- 每个线程创建独立的 Context
2. 共享 Context（如果实现了 Send）- 多个线程共享同一个 Context
"""

import never_jscore
import threading
import time


def test_thread_local_contexts():
    """测试线程本地 Context - 每个线程独立创建 Context"""
    print("\n=== 测试 1: 线程本地 Context（推荐模式）===")

    results = []
    errors = []

    def worker(thread_id):
        try:
            # 每个线程创建自己的 Context
            ctx = never_jscore.Context(enable_extensions=True)

            # 执行一些计算
            result = ctx.evaluate(f"""
                (async () => {{
                    // 模拟一些异步操作
                    await new Promise(resolve => setTimeout(resolve, 10));

                    // 使用扩展功能
                    const hash = md5('thread-{thread_id}');

                    return {{
                        thread_id: {thread_id},
                        hash: hash,
                        random: Math.random()
                    }};
                }})()
            """)

            results.append(result)
            print(f"线程 {thread_id} 完成: {result}")

        except Exception as e:
            errors.append((thread_id, str(e)))
            print(f"线程 {thread_id} 错误: {e}")

    # 创建多个线程
    threads = []
    for i in range(5):
        t = threading.Thread(target=worker, args=(i,))
        threads.append(t)
        t.start()

    # 等待所有线程完成
    for t in threads:
        t.join()

    print(f"\n[OK] 成功: {len(results)} 个线程")
    print(f"[FAIL] 失败: {len(errors)} 个线程")

    if errors:
        print("\n错误详情:")
        for thread_id, error in errors:
            print(f"  线程 {thread_id}: {error}")

    assert len(results) == 5, f"应该有 5 个成功结果，实际: {len(results)}"
    assert len(errors) == 0, f"不应该有错误，实际: {len(errors)}"


def test_concurrent_execution():
    """测试并发执行性能"""
    print("\n=== 测试 2: 并发执行性能 ===")

    def compute_intensive_task(thread_id):
        ctx = never_jscore.Context(enable_extensions=True)

        start = time.time()
        result = ctx.evaluate("""
            (async () => {
                let sum = 0;
                for (let i = 0; i < 100000; i++) {
                    sum += Math.sqrt(i);
                }

                // 测试异步操作
                await Promise.all([
                    new Promise(resolve => setTimeout(resolve, 10)),
                    new Promise(resolve => setTimeout(resolve, 20)),
                    new Promise(resolve => setTimeout(resolve, 15))
                ]);

                return sum;
            })()
        """)
        elapsed = time.time() - start

        return thread_id, result, elapsed

    # 单线程执行
    print("单线程执行...")
    single_start = time.time()
    single_results = []
    for i in range(3):
        single_results.append(compute_intensive_task(i))
    single_elapsed = time.time() - single_start

    print(f"单线程总时间: {single_elapsed:.3f}s")

    # 多线程执行
    print("\n多线程执行...")
    multi_start = time.time()
    threads = []
    multi_results = []

    def worker(tid):
        result = compute_intensive_task(tid)
        multi_results.append(result)



    for i in range(3):
        t = threading.Thread(target=worker, args=(i,))
        threads.append(t)
        t.start()

    for t in threads:
        t.join()

    multi_elapsed = time.time() - multi_start

    print(f"多线程总时间: {multi_elapsed:.3f}s")
    print(f"加速比: {single_elapsed / multi_elapsed:.2f}x")

    # 由于当前是单线程 Tokio runtime，多线程可能不会更快
    # 但至少应该能工作不报错
    assert len(multi_results) == 3


def test_context_isolation():
    """测试 Context 隔离性"""
    print("\n=== 测试 3: Context 隔离性 ===")

    results = {}

    def worker(thread_id):
        ctx = never_jscore.Context(enable_extensions=True)

        # 设置全局变量
        ctx.eval(f"var threadId = {thread_id};")
        ctx.eval(f"var secret = 'secret-{thread_id}';")

        # 读取全局变量
        result = ctx.evaluate("({ threadId, secret })")
        results[thread_id] = result

    threads = []
    for i in range(5):
        t = threading.Thread(target=worker, args=(i,))
        threads.append(t)
        t.start()

    for t in threads:
        t.join()

    # 验证每个线程的 Context 是独立的
    for i in range(5):
        assert results[i]['threadId'] == i
        assert results[i]['secret'] == f'secret-{i}'
        print(f"线程 {i}: {results[i]}")

    print("[OK] 所有 Context 正确隔离")

def test_context_with():
    """测试 Context 隔离性"""
    print("\n=== 测试 4: Context with ===")

    results = {}

    def create_and_use(thread_id):
        with never_jscore.Context() as ctx:
            # 设置全局变量
            ctx.eval(f"var threadId = {thread_id};")
            ctx.eval(f"var secret = 'secret-{thread_id}';")

            # 读取全局变量
            result = ctx.evaluate("({ threadId, secret })")
            results[thread_id] = result

    def worker(thread_id):
        for i in range(20):
            create_and_use(thread_id)

    threads = []
    for i in range(5):
        t = threading.Thread(target=worker, args=(i,))
        threads.append(t)
        t.start()

    for t in threads:
        t.join()

    # 验证每个线程的 Context 是独立的
    for i in range(5):
        assert results[i]['threadId'] == i
        assert results[i]['secret'] == f'secret-{i}'
        print(f"线程 {i}: {results[i]}")

    print("[OK] 所有 Context 正确隔离")

if __name__ == "__main__":
    print("=" * 60)
    print("多线程测试")
    print("=" * 60)

    try:
        test_thread_local_contexts()
        print("\n[OK] 测试 1 通过")
    except Exception as e:
        print(f"\n[FAIL] 测试 1 失败: {e}")
        import traceback
        traceback.print_exc()

    try:
        test_concurrent_execution()
        print("\n[OK] 测试 2 通过")
    except Exception as e:
        print(f"\n[FAIL] 测试 2 失败: {e}")
        import traceback
        traceback.print_exc()

    try:
        test_context_isolation()
        print("\n[OK] 测试 3 通过")
    except Exception as e:
        print(f"\n[FAIL] 测试 3 失败: {e}")
        import traceback
        traceback.print_exc()

    try:
        test_context_with()
        print("\n[OK] 测试 4 通过")
    except Exception as e:
        print(f"\n[FAIL] 测试 4 失败: {e}")
        import traceback
        traceback.print_exc()
    print("\n" + "=" * 60)
    print("测试完成")
    print("=" * 60)
