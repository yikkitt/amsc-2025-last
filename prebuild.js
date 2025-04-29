// prebuild.js - Enhanced version for Vercel deployment
const fs = require('fs');
const path = require('path');

console.log('🔧 Running enhanced prebuild for Vercel deployment...');

// Validate critical environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing required environment variables:');
  if (!SUPABASE_URL) console.error('- NEXT_PUBLIC_SUPABASE_URL');
  if (!SUPABASE_KEY) console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log(`✅ Supabase URL verified: ${SUPABASE_URL.substring(0, 25)}...`);

// Create environment file for client components with additional validation
try {
  if (!SUPABASE_URL.startsWith('https://')) {
    throw new Error('SUPABASE_URL must start with https://');
  }

  const envContent = `
// Generated environment file - DO NOT EDIT
// Generated at: ${new Date().toISOString()}
export const SUPABASE_CONFIG = {
  url: '${SUPABASE_URL}',
  key: '${SUPABASE_KEY}'
};
`;

  const envPath = path.join(__dirname, 'src', 'env-config.js');
  
  // Ensure src directory exists
  const srcDir = path.join(__dirname, 'src');
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir, { recursive: true });
    console.log('✅ Created src directory');
  }

  fs.writeFileSync(envPath, envContent);
  console.log(`✅ Created environment config at ${envPath}`);
} catch (err) {
  console.error(`❌ Failed to create environment file: ${err.message}`);
  process.exit(1);
}

// Ensure public directories exist for deployment
try {
  const publicDirs = ['fonts', 'images'];
  publicDirs.forEach(dir => {
    const fullPath = path.join(__dirname, 'public', dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`✅ Created ${dir} directory`);
    }
  });
} catch (err) {
  console.error(`❌ Failed to create public directories: ${err.message}`);
  process.exit(1);
}

console.log('✅ Prebuild completed successfully'); 