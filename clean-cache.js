// Script to clean the Next.js cache and rebuild
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Paths to clean
const nextCachePath = path.join(__dirname, '.next');
const publicPath = path.join(__dirname, 'public', '_next');

console.log('Cleaning Next.js cache...');

// Remove the .next directory if it exists
if (fs.existsSync(nextCachePath)) {
  try {
    // Use rmdir /s /q for Windows
    execSync(`rmdir /s /q "${nextCachePath}"`);
    console.log('.next directory removed successfully');
  } catch (error) {
    console.error(`Error removing .next directory: ${error.message}`);
  }
}

// Remove the public/_next directory if it exists
if (fs.existsSync(publicPath)) {
  try {
    // Use rmdir /s /q for Windows
    execSync(`rmdir /s /q "${publicPath}"`);
    console.log('public/_next directory removed successfully');
  } catch (error) {
    console.error(`Error removing public/_next directory: ${error.message}`);
  }
}

console.log('Cache cleaning completed'); 