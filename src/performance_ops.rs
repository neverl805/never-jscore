// performance_ops.rs - Performance API for JS reverse engineering
//
// Provides high-precision timing APIs compatible with Web Performance API
// Used for performance measurement and timing analysis in JavaScript code

use deno_core::{extension, op2};
use std::cell::RefCell;
use std::collections::HashMap;
use std::time::{SystemTime, UNIX_EPOCH, Instant};

// ============================================
// Performance Entry Storage
// ============================================

#[derive(Debug, Clone)]
struct PerformanceEntry {
    name: String,
    entry_type: String,
    start_time: f64,
    duration: f64,
}

thread_local! {
    static PERFORMANCE_START: RefCell<Instant> = RefCell::new(Instant::now());
    static TIME_ORIGIN: RefCell<f64> = RefCell::new({
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs_f64() * 1000.0
    });
    static PERFORMANCE_MARKS: RefCell<HashMap<String, f64>> = RefCell::new(HashMap::new());
    static PERFORMANCE_MEASURES: RefCell<Vec<PerformanceEntry>> = RefCell::new(Vec::new());
}

// ============================================
// Internal Helper Functions
// ============================================

/// Internal helper to get current performance timestamp
/// This is separate from the op to avoid naming conflicts with extension! macro
fn get_performance_now() -> f64 {
    PERFORMANCE_START.with(|start| {
        start.borrow().elapsed().as_secs_f64() * 1000.0
    })
}

// ============================================
// Core Performance APIs
// ============================================

#[op2(fast)]
/// Get high-precision timestamp in milliseconds since performance.timeOrigin
pub fn op_performance_now() -> f64 {
    get_performance_now()
}

#[op2(fast)]
/// Get the time origin (Unix timestamp in milliseconds when runtime started)
pub fn op_performance_time_origin() -> f64 {
    TIME_ORIGIN.with(|origin| *origin.borrow())
}

// ============================================
// Performance Mark APIs
// ============================================

#[op2(fast)]
/// Create a performance mark with the given name
pub fn op_performance_mark(#[string] name: String) {
    let timestamp = get_performance_now();
    PERFORMANCE_MARKS.with(|marks| {
        marks.borrow_mut().insert(name, timestamp);
    });
}

#[op2]
#[string]
/// Get a performance mark by name (returns timestamp as string, or empty if not found)
pub fn op_performance_get_mark(#[string] name: String) -> String {
    PERFORMANCE_MARKS.with(|marks| {
        marks.borrow()
            .get(&name)
            .map(|t| t.to_string())
            .unwrap_or_default()
    })
}

#[op2(fast)]
/// Clear specific mark by name, or all marks if name is empty
pub fn op_performance_clear_marks(#[string] name: String) {
    PERFORMANCE_MARKS.with(|marks| {
        if name.is_empty() {
            marks.borrow_mut().clear();
        } else {
            marks.borrow_mut().remove(&name);
        }
    });
}

// ============================================
// Performance Measure APIs
// ============================================

#[op2]
#[string]
/// Create a performance measure between two marks
/// Returns JSON string with measure data or error message
pub fn op_performance_measure(
    #[string] name: String,
    #[string] start_mark: String,
    #[string] end_mark: String,
) -> String {
    // Get start time
    let start_time = if start_mark.is_empty() {
        0.0
    } else {
        // Validate start mark exists
        let mark_time = PERFORMANCE_MARKS.with(|marks| marks.borrow().get(&start_mark).copied());
        if mark_time.is_none() {
            return format!("Error: Mark '{}' not found", start_mark);
        }
        mark_time.unwrap()
    };

    // Get end time
    let end_time = if end_mark.is_empty() {
        get_performance_now()
    } else {
        // Validate end mark exists
        let mark_time = PERFORMANCE_MARKS.with(|marks| marks.borrow().get(&end_mark).copied());
        if mark_time.is_none() {
            return format!("Error: Mark '{}' not found", end_mark);
        }
        mark_time.unwrap()
    };

    let duration = end_time - start_time;

    let entry = PerformanceEntry {
        name: name.clone(),
        entry_type: "measure".to_string(),
        start_time,
        duration,
    };

    PERFORMANCE_MEASURES.with(|measures| {
        measures.borrow_mut().push(entry.clone());
    });

    // Return JSON
    format!(
        r#"{{"name":"{}","entryType":"measure","startTime":{},"duration":{}}}"#,
        name, start_time, duration
    )
}

#[op2(fast)]
/// Clear specific measure by name, or all measures if name is empty
pub fn op_performance_clear_measures(#[string] name: String) {
    PERFORMANCE_MEASURES.with(|measures| {
        if name.is_empty() {
            measures.borrow_mut().clear();
        } else {
            measures.borrow_mut().retain(|m| m.name != name);
        }
    });
}

// ============================================
// Performance Entries Query APIs
// ============================================

#[op2]
#[string]
/// Get all performance entries (marks + measures) as JSON array
pub fn op_performance_get_entries() -> String {
    let mut entries = Vec::new();

    // Add marks
    PERFORMANCE_MARKS.with(|marks| {
        for (name, start_time) in marks.borrow().iter() {
            entries.push(format!(
                r#"{{"name":"{}","entryType":"mark","startTime":{},"duration":0}}"#,
                name, start_time
            ));
        }
    });

    // Add measures
    PERFORMANCE_MEASURES.with(|measures| {
        for measure in measures.borrow().iter() {
            entries.push(format!(
                r#"{{"name":"{}","entryType":"{}","startTime":{},"duration":{}}}"#,
                measure.name, measure.entry_type, measure.start_time, measure.duration
            ));
        }
    });

    format!("[{}]", entries.join(","))
}

#[op2]
#[string]
/// Get performance entries by type ("mark" or "measure")
pub fn op_performance_get_entries_by_type(#[string] entry_type: String) -> String {
    let mut entries = Vec::new();

    match entry_type.as_str() {
        "mark" => {
            PERFORMANCE_MARKS.with(|marks| {
                for (name, start_time) in marks.borrow().iter() {
                    entries.push(format!(
                        r#"{{"name":"{}","entryType":"mark","startTime":{},"duration":0}}"#,
                        name, start_time
                    ));
                }
            });
        }
        "measure" => {
            PERFORMANCE_MEASURES.with(|measures| {
                for measure in measures.borrow().iter() {
                    entries.push(format!(
                        r#"{{"name":"{}","entryType":"{}","startTime":{},"duration":{}}}"#,
                        measure.name, measure.entry_type, measure.start_time, measure.duration
                    ));
                }
            });
        }
        _ => {}
    }

    format!("[{}]", entries.join(","))
}

#[op2]
#[string]
/// Get performance entries by name
pub fn op_performance_get_entries_by_name(#[string] name: String) -> String {
    let mut entries = Vec::new();

    // Check marks
    PERFORMANCE_MARKS.with(|marks| {
        if let Some(start_time) = marks.borrow().get(&name) {
            entries.push(format!(
                r#"{{"name":"{}","entryType":"mark","startTime":{},"duration":0}}"#,
                name, start_time
            ));
        }
    });

    // Check measures
    PERFORMANCE_MEASURES.with(|measures| {
        for measure in measures.borrow().iter() {
            if measure.name == name {
                entries.push(format!(
                    r#"{{"name":"{}","entryType":"{}","startTime":{},"duration":{}}}"#,
                    measure.name, measure.entry_type, measure.start_time, measure.duration
                ));
            }
        }
    });

    format!("[{}]", entries.join(","))
}

// ============================================
// Extension Definition
// ============================================

extension!(
    performance_ops,
    ops = [
        op_performance_now,
        op_performance_time_origin,
        op_performance_mark,
        op_performance_get_mark,
        op_performance_clear_marks,
        op_performance_measure,
        op_performance_clear_measures,
        op_performance_get_entries,
        op_performance_get_entries_by_type,
        op_performance_get_entries_by_name,
    ],
);
