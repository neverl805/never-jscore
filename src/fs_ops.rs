// fs_ops.rs - File System operations for require() implementation
use deno_core::{extension, op2};
use std::fs;
use std::path::{Path, PathBuf};

// ============================================
// File System Operations
// ============================================

#[op2]
#[string]
/// 读取文件内容（同步）
///
/// # Arguments
/// * `path` - 文件路径（绝对路径或相对路径）
///
/// # Returns
/// 文件内容字符串，失败时返回错误信息
pub fn op_read_file_sync(#[string] path: String) -> String {
    match fs::read_to_string(&path) {
        Ok(content) => content,
        Err(e) => format!("Error: Failed to read file '{}': {}", path, e),
    }
}

#[op2]
#[string]
/// 写入文件内容（同步）
///
/// # Arguments
/// * `path` - 文件路径
/// * `content` - 要写入的内容
///
/// # Returns
/// 成功返回 "OK"，失败返回错误信息
pub fn op_write_file_sync(#[string] path: String, #[string] content: String) -> String {
    match fs::write(&path, content) {
        Ok(_) => "OK".to_string(),
        Err(e) => format!("Error: Failed to write file '{}': {}", path, e),
    }
}

#[op2(fast)]
/// 检查文件是否存在
///
/// # Arguments
/// * `path` - 文件路径
///
/// # Returns
/// true 如果文件存在，false 如果不存在
pub fn op_file_exists(#[string] path: String) -> bool {
    Path::new(&path).exists()
}

#[op2(fast)]
/// 检查路径是否为文件
///
/// # Arguments
/// * `path` - 文件路径
///
/// # Returns
/// true 如果是文件，false 如果不是或不存在
pub fn op_is_file(#[string] path: String) -> bool {
    match Path::new(&path).metadata() {
        Ok(metadata) => metadata.is_file(),
        Err(_) => false,
    }
}

#[op2(fast)]
/// 检查路径是否为目录
///
/// # Arguments
/// * `path` - 目录路径
///
/// # Returns
/// true 如果是目录，false 如果不是或不存在
pub fn op_is_directory(#[string] path: String) -> bool {
    match Path::new(&path).metadata() {
        Ok(metadata) => metadata.is_dir(),
        Err(_) => false,
    }
}

#[op2]
#[string]
/// 解析路径（转换为绝对路径）
///
/// # Arguments
/// * `path` - 要解析的路径
///
/// # Returns
/// 绝对路径字符串，失败时返回错误信息
pub fn op_resolve_path(#[string] path: String) -> String {
    match Path::new(&path).canonicalize() {
        Ok(absolute) => absolute.to_string_lossy().to_string(),
        Err(_) => {
            // 如果文件不存在，尝试手动构建绝对路径
            let path_buf = PathBuf::from(&path);
            if path_buf.is_absolute() {
                path
            } else {
                match std::env::current_dir() {
                    Ok(mut cwd) => {
                        cwd.push(&path);
                        cwd.to_string_lossy().to_string()
                    },
                    Err(e) => format!("Error: Failed to resolve path '{}': {}", path, e),
                }
            }
        }
    }
}

#[op2]
#[string]
/// 连接路径
///
/// # Arguments
/// * `base` - 基础路径
/// * `relative` - 相对路径
///
/// # Returns
/// 连接后的路径字符串
pub fn op_join_path(#[string] base: String, #[string] relative: String) -> String {
    let base_path = Path::new(&base);
    let result = base_path.join(&relative);
    result.to_string_lossy().to_string()
}

#[op2]
#[string]
/// 获取路径的目录部分
///
/// # Arguments
/// * `path` - 文件路径
///
/// # Returns
/// 目录路径字符串
pub fn op_dirname(#[string] path: String) -> String {
    let path_obj = Path::new(&path);
    match path_obj.parent() {
        Some(parent) => {
            let parent_str = parent.to_string_lossy().to_string();
            // 如果 parent 为空字符串，说明是根目录，返回原路径
            if parent_str.is_empty() {
                path
            } else {
                parent_str
            }
        },
        None => {
            // 已经是根目录，返回路径本身
            path
        },
    }
}

#[op2]
#[string]
/// 获取路径的文件名部分
///
/// # Arguments
/// * `path` - 文件路径
///
/// # Returns
/// 文件名字符串
pub fn op_basename(#[string] path: String) -> String {
    match Path::new(&path).file_name() {
        Some(name) => name.to_string_lossy().to_string(),
        None => "".to_string(),
    }
}

#[op2]
#[string]
/// 获取当前工作目录
///
/// # Returns
/// 当前工作目录路径，失败时返回错误信息
pub fn op_getcwd() -> String {
    match std::env::current_dir() {
        Ok(cwd) => cwd.to_string_lossy().to_string(),
        Err(e) => format!("Error: Failed to get current directory: {}", e),
    }
}

#[op2]
#[string]
/// 列出目录内容
///
/// # Arguments
/// * `path` - 目录路径
///
/// # Returns
/// JSON 数组字符串，包含目录中的所有条目名称
pub fn op_readdir(#[string] path: String) -> String {
    match fs::read_dir(&path) {
        Ok(entries) => {
            let mut items = Vec::new();
            for entry in entries {
                if let Ok(entry) = entry {
                    if let Ok(name) = entry.file_name().into_string() {
                        items.push(format!("\"{}\"", name));
                    }
                }
            }
            format!("[{}]", items.join(","))
        },
        Err(e) => format!("Error: Failed to read directory '{}': {}", path, e),
    }
}

#[op2]
#[string]
/// 读取环境变量
///
/// # Arguments
/// * `key` - 环境变量名
///
/// # Returns
/// 环境变量值，如果不存在返回空字符串
pub fn op_getenv(#[string] key: String) -> String {
    std::env::var(&key).unwrap_or_default()
}

#[op2]
#[string]
/// 获取所有环境变量（JSON 格式）
///
/// # Returns
/// JSON 对象字符串，包含所有环境变量
pub fn op_getenv_all() -> String {
    let env_vars: Vec<String> = std::env::vars()
        .map(|(k, v)| {
            // 转义 JSON 特殊字符
            let key = k.replace('\\', "\\\\").replace('"', "\\\"");
            let value = v.replace('\\', "\\\\").replace('"', "\\\"");
            format!("\"{}\":\"{}\"", key, value)
        })
        .collect();
    format!("{{{}}}", env_vars.join(","))
}

// ============================================
// Extension Definition
// ============================================

extension!(
    fs_ops,
    ops = [
        op_read_file_sync,
        op_write_file_sync,
        op_file_exists,
        op_is_file,
        op_is_directory,
        op_resolve_path,
        op_join_path,
        op_dirname,
        op_basename,
        op_getcwd,
        op_readdir,
        op_getenv,
        op_getenv_all,
    ],
);
