// npm checkers and package resolver implementation for never-jscore
// Based on Deno's BYONM (Bring Your Own Node Modules) pattern

use deno_core::url::Url;
use node_resolver::{InNpmPackageChecker, NpmPackageFolderResolver, UrlOrPathRef, UrlOrPath};
use node_resolver::errors::{PackageFolderResolveError, PackageNotFoundError};
use std::path::{Path, PathBuf};

/// BYONM-style npm package checker
/// Checks if a specifier is in a node_modules directory
#[derive(Debug, Clone, Default)]
pub struct NeverJsCoreNpmPackageChecker;

impl InNpmPackageChecker for NeverJsCoreNpmPackageChecker {
    fn in_npm_package(&self, specifier: &Url) -> bool {
        // Check if the file URL is in a node_modules directory
        if specifier.scheme() != "file" {
            return false;
        }

        let path = specifier.path().to_ascii_lowercase();
        // Check for both Unix and Windows style paths
        path.contains("/node_modules/") || path.contains("\\node_modules\\")
    }
}

/// BYONM-style npm package folder resolver
/// Searches for packages in node_modules directories
#[derive(Debug, Clone)]
pub struct NeverJsCoreNpmPackageFolderResolver {
    /// Root node_modules directory (optional)
    root_node_modules_dir: Option<PathBuf>,
}

impl Default for NeverJsCoreNpmPackageFolderResolver {
    fn default() -> Self {
        Self::new(None)
    }
}

impl NeverJsCoreNpmPackageFolderResolver {
    pub fn new(root_node_modules_dir: Option<PathBuf>) -> Self {
        Self { root_node_modules_dir }
    }

    /// Try to resolve a package in node_modules directories
    fn resolve_in_node_modules(
        &self,
        package_name: &str,
        start_dir: &Path,
    ) -> Option<PathBuf> {
        // Handle scoped packages (@scope/package)
        let package_path: PathBuf = if package_name.starts_with('@') {
            let parts: Vec<&str> = package_name.splitn(2, '/').collect();
            if parts.len() == 2 {
                PathBuf::from(parts[0]).join(parts[1])
            } else {
                PathBuf::from(package_name)
            }
        } else {
            PathBuf::from(package_name)
        };

        // Search up the directory tree for node_modules
        let mut current = Some(start_dir);
        while let Some(dir) = current {
            let node_modules = dir.join("node_modules");
            let package_dir = node_modules.join(&package_path);

            if package_dir.is_dir() {
                // Try to canonicalize the path
                return match std::fs::canonicalize(&package_dir) {
                    Ok(canonical) => Some(canonical),
                    Err(_) => Some(package_dir),
                };
            }

            current = dir.parent();
        }

        // Also check root node_modules if configured
        if let Some(ref root) = self.root_node_modules_dir {
            let package_dir = root.join(&package_path);
            if package_dir.is_dir() {
                return match std::fs::canonicalize(&package_dir) {
                    Ok(canonical) => Some(canonical),
                    Err(_) => Some(package_dir),
                };
            }
        }

        None
    }
}

impl NpmPackageFolderResolver for NeverJsCoreNpmPackageFolderResolver {
    fn resolve_package_folder_from_package(
        &self,
        name: &str,
        referrer: &UrlOrPathRef,
    ) -> Result<PathBuf, PackageFolderResolveError> {
        // Get the referrer path using the path() method
        let referrer_path = match referrer.path() {
            Ok(p) => p.to_path_buf(),
            Err(_) => {
                // If path conversion fails, use cwd
                std::env::current_dir().unwrap_or_else(|_| PathBuf::from("."))
            }
        };

        // Get the directory to start searching from
        let start_dir = if referrer_path.is_file() {
            referrer_path.parent().unwrap_or(&referrer_path)
        } else {
            &referrer_path
        };

        // Try to resolve the package
        if let Some(package_folder) = self.resolve_in_node_modules(name, start_dir) {
            return Ok(package_folder);
        }

        // If we have a root node_modules, also try from current working directory
        if let Ok(cwd) = std::env::current_dir() {
            if let Some(package_folder) = self.resolve_in_node_modules(name, &cwd) {
                return Ok(package_folder);
            }
        }

        Err(PackageNotFoundError {
            package_name: name.to_string(),
            referrer: UrlOrPath::Path(referrer_path),
            referrer_extra: None,
        }.into())
    }

    fn resolve_types_package_folder(
        &self,
        types_package_name: &str,
        _maybe_package_version: Option<&deno_semver::Version>,
        maybe_referrer: Option<&UrlOrPathRef<'_>>,
    ) -> Option<PathBuf> {
        // Get the referrer path, or use current directory
        let referrer_path = if let Some(ref_val) = maybe_referrer {
            match ref_val.path() {
                Ok(p) => p.to_path_buf(),
                Err(_) => std::env::current_dir().unwrap_or_else(|_| PathBuf::from(".")),
            }
        } else {
            std::env::current_dir().unwrap_or_else(|_| PathBuf::from("."))
        };

        let start_dir = if referrer_path.is_file() {
            referrer_path.parent().unwrap_or(&referrer_path).to_path_buf()
        } else {
            referrer_path.clone()
        };

        // types_package_name is already in "@types/..." form — use directly
        self.resolve_in_node_modules(types_package_name, &start_dir)
    }
}
