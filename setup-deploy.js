/**
 * Setup script to prepare for deployment
 * This script should be run before pushing to GitHub or deploying to Vercel
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting deployment preparation...');

// Ensure directories exist
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Ensure public directories
ensureDirectoryExists(path.join(__dirname, 'public', 'fonts'));

// Run font download if needed
if (!fs.existsSync(path.join(__dirname, 'public', 'fonts', 'Inter-Regular.woff2'))) {
  console.log('Downloading fonts...');
  try {
    execSync('node download-fonts.js', { stdio: 'inherit' });
  } catch (error) {
    console.warn('Warning: Font download failed, but continuing with setup.');
  }
}

// Update imports 
console.log('Updating Supabase imports...');
try {
  execSync('node update-imports.js', { stdio: 'inherit' });
} catch (error) {
  console.warn('Warning: Import update failed, but continuing with setup.');
}

// Clean cache
console.log('Cleaning cache...');
try {
  execSync('node clean-cache.js', { stdio: 'inherit' });
} catch (error) {
  console.warn('Warning: Cache cleaning failed, but continuing with setup.');
}

// Verify critical files exist
const criticalFiles = [
  'next.config.js',
  'vercel.json',
  'src/lib/supabase.ts',
  'module-resolve.js',
  'clean-build.js'
];

let missingFiles = false;
for (const file of criticalFiles) {
  if (!fs.existsSync(path.join(__dirname, file))) {
    console.error(`Missing critical file: ${file}`);
    missingFiles = true;
  }
}

if (missingFiles) {
  console.error('Some critical files are missing. Please fix before deployment.');
  process.exit(1);
}

console.log('Deployment preparation complete! You can now:');
console.log('1. Push to GitHub: git add . && git commit -m "Ready for deployment" && git push');
console.log('2. Deploy to Vercel through the Vercel dashboard or CLI'); 