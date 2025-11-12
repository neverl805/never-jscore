from concurrent.futures import ThreadPoolExecutor
import never_jscore

js = """
        const CryptoJS = require('crypto-js');
        function encrypt(word) {
              const key = CryptoJS.enc.Utf8.parse('123456789');
              const iv = CryptoJS.enc.Utf8.parse('123456789');
              const srcs = CryptoJS.enc.Utf8.parse(word);
              const encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
              return encrypted.toString();
            }
    """

# 修复版本 1：在循环外创建 Context（最推荐）
def run_fixed1():
    ctx = never_jscore.Context()  # 循环外创建一次
    ctx.compile(js)

    for i in range(10):
        params = ctx.call("encrypt", ['fsdfsdfds'])
        print(f"  Thread-{threading.current_thread().name} [{i}]: {params}")


# 修复版本 2：显式 del（适合必须在循环内创建的场景）
def run_fixed2():
    for i in range(2):
        ctx = never_jscore.Context()
        ctx.compile(js)
        params = ctx.call("encrypt", ['fsdfsdfds'])
        print(f"  Thread-{threading.current_thread().name} [{i}]: {params}")
        del ctx  # 显式删除，立即释放资源


# 修复版本 3：使用 ThreadLocal（多线程最推荐）
import threading

thread_local = threading.local()

def get_context():
    if not hasattr(thread_local, 'ctx'):
        thread_local.ctx = never_jscore.Context()
        thread_local.ctx.compile(js)
    return thread_local.ctx

def run_fixed3():
    ctx = get_context()  # 线程本地复用
    for i in range(10):
        params = ctx.call("encrypt", ['fsdfsdfds'])
        print(f"  Thread-{threading.current_thread().name} [{i}]: {params}")


print("=" * 60)
print("测试修复版本 1：循环外创建 Context")
print("=" * 60)
with ThreadPoolExecutor(4) as t:
    for i in range(4):
        t.submit(run_fixed1)
    t.shutdown(True)
print("[OK] 成功！")

print("\n" + "=" * 60)
print("测试修复版本 2：显式 del")
print("=" * 60)
with ThreadPoolExecutor(4) as t:
    for i in range(4):
        t.submit(run_fixed2)
    t.shutdown(True)
print("[OK] 成功！")

print("\n" + "=" * 60)
print("测试修复版本 3：ThreadLocal 复用（最推荐）")
print("=" * 60)
with ThreadPoolExecutor(4) as t:
    for i in range(4):
        t.submit(run_fixed3)
    t.shutdown(True)
print("[OK] 成功！")
