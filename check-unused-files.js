const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all source files
const sourceFiles = execSync(
  'find "d:\\Sefareshat\\jahad\\mehrebaran\\mehre-baran-app\\packages\\dashboard\\src" -type f \\( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \\)',
  { encoding: 'utf-8' }
)
  .trim()
  .split('\n')
  .filter(Boolean);

// Entry points and files to exclude from unused check
const excludePatterns = [
  '/main.jsx',
  '/App.jsx',
  '/store.js',
  'Slice.js', // Redux slices
  'vite.config',
  'eslint.config',
];

// Check if file should be excluded
function shouldExclude(filePath) {
  return excludePatterns.some(pattern => filePath.includes(pattern));
}

// Get import name variations for a file
function getImportNames(filePath) {
  const basename = path.basename(filePath, path.extname(filePath));
  const dirname = path.dirname(filePath).split(path.sep).pop();

  return [
    basename,
    `${dirname}/${basename}`,
  ];
}

// Search for imports of a file
function findImports(filePath, searchDir) {
  const basename = path.basename(filePath, path.extname(filePath));
  const relativePath = filePath.replace(/\\/g, '/').split('/src/')[1];

  // Create search patterns
  const patterns = [
    `from.*['"]\\..*${basename}`,
    `from.*['"].*${basename}`,
    `import.*${basename}`,
    `require.*${basename}`,
  ];

  try {
    for (const pattern of patterns) {
      const result = execSync(
        `grep -r -l "${pattern}" "${searchDir}" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" 2>/dev/null || true`,
        { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
      ).trim();

      if (result) {
        const files = result.split('\n').filter(Boolean);
        // Filter out the file itself
        const importingFiles = files.filter(f =>
          !f.includes(filePath.replace(/\\/g, '/'))
        );

        if (importingFiles.length > 0) {
          return importingFiles;
        }
      }
    }
    return [];
  } catch (error) {
    return [];
  }
}

// Get file info
function getFileInfo(filePath) {
  const stats = fs.statSync(filePath);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').length;

  return {
    size: stats.size,
    lines: lines,
  };
}

console.log('Analyzing files...\n');
console.log(`Total files to check: ${sourceFiles.length}\n`);

const unusedFiles = [];
const searchDir = 'd:\\Sefareshat\\jahad\\mehrebaran\\mehre-baran-app\\packages\\dashboard';

for (const filePath of sourceFiles) {
  if (shouldExclude(filePath)) {
    continue;
  }

  const imports = findImports(filePath, searchDir);

  if (imports.length === 0) {
    const fileInfo = getFileInfo(filePath);
    const content = fs.readFileSync(filePath, 'utf-8').substring(0, 500);

    unusedFiles.push({
      path: filePath,
      size: fileInfo.size,
      lines: fileInfo.lines,
      preview: content,
    });
  }
}

console.log(`Found ${unusedFiles.length} potentially unused files\n`);
console.log(JSON.stringify(unusedFiles, null, 2));
