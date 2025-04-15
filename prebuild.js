// prebuild.js - Simplified version for Vercel deployment
const fs = require('fs');
const path = require('path');

console.log('🔧 Running simplified prebuild for Vercel deployment...');

// Critical environment variables with hardcoded fallbacks
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kiotgupdmepdyiscbrmb.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpb3RndXBkbWVwZHlpc2Nicm1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5OTc4MDQsImV4cCI6MjA1OTU3MzgwNH0.USrVcvc8lzraMh4a4BpaTSope81DwX4EsYCxMddC1I8';

console.log(`Using Supabase URL: ${SUPABASE_URL.substring(0, 25)}...`);

// Create a simple environment file for client components
try {
  const envContent = `
// Generated environment file - DO NOT EDIT
export const SUPABASE_CONFIG = {
  url: '${SUPABASE_URL}',
  key: '${SUPABASE_KEY}'
};
`;

  const envPath = path.join(__dirname, 'src', 'env-config.js');
  fs.writeFileSync(envPath, envContent);
  console.log(`✅ Created environment config at ${envPath}`);
} catch (err) {
  console.warn(`⚠️ Could not create environment file: ${err.message}`);
}

// Ensure public directories exist for deployment
try {
  const fontDir = path.join(__dirname, 'public', 'fonts');
  if (!fs.existsSync(fontDir)) {
    fs.mkdirSync(fontDir, { recursive: true });
    console.log('✅ Created font directory');
  }
} catch (err) {
  console.warn(`⚠️ Could not create directories: ${err.message}`);
}

console.log('✅ Prebuild completed successfully'); 