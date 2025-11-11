#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test Performance API functionality
"""

import never_jscore

def test_performance_now():
    """Test performance.now()"""
    print("=== Testing performance.now() ===")
    ctx = never_jscore.Context(enable_extensions=True)

    result = ctx.eval("""
        const t1 = performance.now();
        let sum = 0;
        for (let i = 0; i < 1000000; i++) {
            sum += i;
        }
        const t2 = performance.now();
        ({
            t1: t1,
            t2: t2,
            elapsed: t2 - t1,
            sum: sum
        })
    """, return_value=True)

    print(f"Start time: {result['t1']:.4f}ms")
    print(f"End time: {result['t2']:.4f}ms")
    print(f"Elapsed: {result['elapsed']:.4f}ms")
    print(f"Sum: {result['sum']}")
    assert result['t2'] > result['t1'], "Time should increase"
    print("✓ performance.now() works correctly\n")

def test_performance_time_origin():
    """Test performance.timeOrigin"""
    print("=== Testing performance.timeOrigin ===")
    ctx = never_jscore.Context(enable_extensions=True)

    result = ctx.eval("""
        ({
            timeOrigin: performance.timeOrigin,
            now: performance.now(),
            absolute: performance.timeOrigin + performance.now()
        })
    """, return_value=True)

    print(f"Time origin: {result['timeOrigin']:.2f}")
    print(f"Current time (relative): {result['now']:.4f}ms")
    print(f"Absolute timestamp: {result['absolute']:.2f}")
    assert result['timeOrigin'] > 0, "Time origin should be positive"
    print("✓ performance.timeOrigin works correctly\n")

def test_performance_mark():
    """Test performance.mark()"""
    print("=== Testing performance.mark() ===")
    ctx = never_jscore.Context(enable_extensions=True)

    result = ctx.eval("""
        performance.mark('start');
        let sum = 0;
        for (let i = 0; i < 500000; i++) {
            sum += i;
        }
        performance.mark('middle');
        for (let i = 0; i < 500000; i++) {
            sum += i;
        }
        performance.mark('end');

        const marks = performance.getEntriesByType('mark');
        ({
            marks: marks,
            markNames: marks.map(m => m.name),
            sum: sum
        })
    """, return_value=True)

    print(f"Created marks: {result['markNames']}")
    print(f"Mark details:")
    for mark in result['marks']:
        print(f"  - {mark['name']}: {mark['startTime']:.4f}ms")

    assert len(result['marks']) == 3, "Should have 3 marks"
    assert 'start' in result['markNames'], "Should have 'start' mark"
    assert 'middle' in result['markNames'], "Should have 'middle' mark"
    assert 'end' in result['markNames'], "Should have 'end' mark"
    print("✓ performance.mark() works correctly\n")

def test_performance_measure():
    """Test performance.measure()"""
    print("=== Testing performance.measure() ===")
    ctx = never_jscore.Context(enable_extensions=True)

    result = ctx.eval("""
        performance.mark('loop-start');
        let sum = 0;
        for (let i = 0; i < 1000000; i++) {
            sum += i;
        }
        performance.mark('loop-end');

        const measure1 = performance.measure('loop-duration', 'loop-start', 'loop-end');
        const measure2 = performance.measure('total-time', 'loop-start');

        const measures = performance.getEntriesByType('measure');
        ({
            measures: measures,
            measure1: measure1,
            measure2: measure2,
            sum: sum
        })
    """, return_value=True)

    print(f"Measure 1 (loop-duration): {result['measure1']['duration']:.4f}ms")
    print(f"Measure 2 (total-time): {result['measure2']['duration']:.4f}ms")
    print(f"All measures: {[m['name'] for m in result['measures']]}")

    assert result['measure1']['duration'] > 0, "Duration should be positive"
    assert len(result['measures']) == 2, "Should have 2 measures"
    print("✓ performance.measure() works correctly\n")

def test_performance_get_entries():
    """Test performance.getEntries() and filters"""
    print("=== Testing performance.getEntries() ===")
    ctx = never_jscore.Context(enable_extensions=True)

    result = ctx.eval("""
        performance.mark('test1');
        performance.mark('test2');
        performance.mark('test3');
        performance.measure('test-measure', 'test1', 'test2');

        ({
            allEntries: performance.getEntries(),
            marksOnly: performance.getEntriesByType('mark'),
            measuresOnly: performance.getEntriesByType('measure'),
            byName: performance.getEntriesByName('test1'),
            byNameAndType: performance.getEntriesByName('test1', 'mark')
        })
    """, return_value=True)

    print(f"All entries: {len(result['allEntries'])} total")
    print(f"Marks only: {len(result['marksOnly'])} marks")
    print(f"Measures only: {len(result['measuresOnly'])} measures")
    print(f"By name 'test1': {len(result['byName'])} entries")
    print(f"By name 'test1' + type 'mark': {len(result['byNameAndType'])} entries")

    assert len(result['allEntries']) == 4, "Should have 4 total entries (3 marks + 1 measure)"
    assert len(result['marksOnly']) == 3, "Should have 3 marks"
    assert len(result['measuresOnly']) == 1, "Should have 1 measure"
    print("✓ performance.getEntries() works correctly\n")

def test_performance_clear():
    """Test performance.clearMarks() and clearMeasures()"""
    print("=== Testing performance.clearMarks/clearMeasures() ===")
    ctx = never_jscore.Context(enable_extensions=True)

    result = ctx.eval("""
        performance.mark('mark1');
        performance.mark('mark2');
        performance.mark('mark3');
        performance.measure('measure1', 'mark1', 'mark2');

        const before = performance.getEntries();

        performance.clearMarks('mark2');
        const afterClearOne = performance.getEntriesByType('mark');

        performance.clearMarks();
        const afterClearAll = performance.getEntriesByType('mark');

        performance.clearMeasures();
        const afterClearMeasures = performance.getEntriesByType('measure');

        ({
            before: before.length,
            afterClearOne: afterClearOne.length,
            afterClearAll: afterClearAll.length,
            afterClearMeasures: afterClearMeasures.length
        })
    """, return_value=True)

    print(f"Before clearing: {result['before']} entries")
    print(f"After clearing one mark: {result['afterClearOne']} marks")
    print(f"After clearing all marks: {result['afterClearAll']} marks")
    print(f"After clearing measures: {result['afterClearMeasures']} measures")

    assert result['before'] == 4, "Should start with 4 entries"
    assert result['afterClearOne'] == 2, "Should have 2 marks after clearing one"
    assert result['afterClearAll'] == 0, "Should have 0 marks after clearing all"
    assert result['afterClearMeasures'] == 0, "Should have 0 measures after clearing"
    print("✓ performance.clearMarks/clearMeasures() works correctly\n")

def test_real_world_scenario():
    """Test real-world performance monitoring scenario"""
    print("=== Testing Real-World Scenario ===")
    ctx = never_jscore.Context(enable_extensions=True)

    result = ctx.eval("""
        // Simulate a multi-step operation
        performance.mark('task-start');

        // Step 1: Data preparation
        performance.mark('step1-start');
        let data = [];
        for (let i = 0; i < 100000; i++) {
            data.push(i * 2);
        }
        performance.mark('step1-end');
        performance.measure('step1-duration', 'step1-start', 'step1-end');

        // Step 2: Data processing
        performance.mark('step2-start');
        let sum = data.reduce((acc, val) => acc + val, 0);
        performance.mark('step2-end');
        performance.measure('step2-duration', 'step2-start', 'step2-end');

        // Step 3: Data transformation
        performance.mark('step3-start');
        let filtered = data.filter(x => x % 10 === 0);
        performance.mark('step3-end');
        performance.measure('step3-duration', 'step3-start', 'step3-end');

        performance.mark('task-end');
        performance.measure('total-duration', 'task-start', 'task-end');

        const measures = performance.getEntriesByType('measure');
        ({
            measures: measures.map(m => ({
                name: m.name,
                duration: m.duration.toFixed(4) + 'ms'
            })),
            dataSize: data.length,
            sum: sum,
            filteredSize: filtered.length
        })
    """, return_value=True)

    print("Performance Report:")
    for measure in result['measures']:
        print(f"  {measure['name']}: {measure['duration']}")
    print(f"\nResults:")
    print(f"  Data size: {result['dataSize']}")
    print(f"  Sum: {result['sum']}")
    print(f"  Filtered size: {result['filteredSize']}")

    assert len(result['measures']) == 4, "Should have 4 measurements"
    print("✓ Real-world scenario works correctly\n")

def main():
    print("Testing Performance API")
    print("=" * 50 + "\n")

    try:
        test_performance_now()
        test_performance_time_origin()
        test_performance_mark()
        test_performance_measure()
        test_performance_get_entries()
        test_performance_clear()
        test_real_world_scenario()

        print("=" * 50)
        print("All Performance API tests passed! ✓")

    except Exception as e:
        print(f"\n✗ Test failed: {e}")
        import traceback
        traceback.print_exc()
        return 1

    return 0

if __name__ == "__main__":
    exit(main())
