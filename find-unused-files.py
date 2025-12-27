#!/usr/bin/env python3
import os
import subprocess
import json
from pathlib import Path

# Base directories
DASHBOARD_DIR = r"d:\Sefareshat\jahad\mehrebaran\mehre-baran-app\packages\dashboard"
SRC_DIR = os.path.join(DASHBOARD_DIR, "src")

# Files to exclude from unused check
EXCLUDE_PATTERNS = [
    "main.jsx",
    "App.jsx",
    "store.js",
    "Slice.js",
    "vite.config",
    "eslint.config",
]

def should_exclude(filepath):
    """Check if file should be excluded from unused check"""
    for pattern in EXCLUDE_PATTERNS:
        if pattern in filepath:
            return True
    return False

def get_all_source_files():
    """Get all TypeScript/JavaScript files in src directory"""
    files = []
    for root, dirs, filenames in os.walk(SRC_DIR):
        for filename in filenames:
            if filename.endswith(('.js', '.jsx', '.ts', '.tsx')):
                filepath = os.path.join(root, filename)
                files.append(filepath)
    return files

def get_file_basename(filepath):
    """Get filename without extension"""
    return Path(filepath).stem

def is_file_imported(filepath, search_dir):
    """Check if file is imported anywhere in the codebase"""
    basename = get_file_basename(filepath)

    # Skip if it's a file we should exclude
    if should_exclude(filepath):
        return True

    # Search for imports of this file
    try:
        # Try multiple grep patterns
        patterns = [
            f'from.*[\'"].*{basename}',
            f'import.*{basename}',
            f"from.*[\"'].*{basename}",
        ]

        for pattern in patterns:
            cmd = [
                'grep',
                '-r',
                '-l',
                pattern,
                search_dir,
                '--include=*.js',
                '--include=*.jsx',
                '--include=*.ts',
                '--include=*.tsx'
            ]

            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                cwd=DASHBOARD_DIR
            )

            if result.returncode == 0 and result.stdout.strip():
                # Found imports, check if they're not just self-imports
                importing_files = result.stdout.strip().split('\n')
                # Filter out the file itself
                other_files = [f for f in importing_files if not f.endswith(os.path.basename(filepath))]
                if other_files:
                    return True

        return False
    except Exception as e:
        print(f"Error checking {basename}: {e}")
        return True  # If error, assume it's used to be safe

def get_file_info(filepath):
    """Get file size and line count"""
    try:
        stat = os.stat(filepath)
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            lines = len(f.readlines())
            f.seek(0)
            preview = f.read(500)

        return {
            'size': stat.st_size,
            'lines': lines,
            'preview': preview
        }
    except Exception as e:
        return {
            'size': 0,
            'lines': 0,
            'preview': f'Error reading file: {e}'
        }

def main():
    print("Finding all source files...")
    all_files = get_all_source_files()
    print(f"Total files found: {len(all_files)}")

    print("\nChecking for unused files...")
    unused_files = []

    for i, filepath in enumerate(all_files, 1):
        if i % 10 == 0:
            print(f"Progress: {i}/{len(all_files)}")

        if should_exclude(filepath):
            continue

        if not is_file_imported(filepath, DASHBOARD_DIR):
            file_info = get_file_info(filepath)
            unused_files.append({
                'path': filepath,
                'relative_path': os.path.relpath(filepath, DASHBOARD_DIR),
                'size': file_info['size'],
                'lines': file_info['lines'],
                'preview': file_info['preview']
            })

    print(f"\nFound {len(unused_files)} potentially unused files")

    # Save results to JSON
    output_file = os.path.join(DASHBOARD_DIR, 'unused-files-report.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(unused_files, f, indent=2, ensure_ascii=False)

    print(f"\nResults saved to: {output_file}")

    # Print summary
    for file in unused_files[:10]:  # Show first 10
        print(f"\n- {file['relative_path']}")
        print(f"  Size: {file['size']} bytes, Lines: {file['lines']}")

if __name__ == '__main__':
    main()
