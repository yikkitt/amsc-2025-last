// Simple build script without any Node.js module dependencies
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting clean build process...');

// Step 1: Ensure public/fonts directory exists
const fontDir = path.join(__dirname, 'public', 'fonts');
if (!fs.existsSync(fontDir)) {
  console.log('Creating fonts directory...');
  fs.mkdirSync(fontDir, { recursive: true });
}

// Step 2: Clean any build artifacts
try {
  console.log('Cleaning build artifacts...');
  // Remove .next directory if it exists
  const nextDir = path.join(__dirname, '.next');
  if (fs.existsSync(nextDir)) {
    console.log('Removing .next directory...');
    fs.rmSync(nextDir, { recursive: true, force: true });
  }
} catch (error) {
  console.warn('Warning during cleanup:', error);
}

// Step 3: Run the actual build
console.log('Starting Next.js build...');
try {
  execSync('node ./node_modules/next/dist/bin/next build', { stdio: 'inherit' });
  console.log('Build completed successfully');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} 