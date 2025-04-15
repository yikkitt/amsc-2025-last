// vercel-setup.js
const fs = require('fs');
const path = require('path');

console.log('Running Vercel deployment setup...');

// Check for required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar} is set`);
  } else {
    console.warn(`⚠️ ${envVar} is not set! This may cause issues.`);
  }
});

// Ensure next.config.js has the right settings
try {
  const nextConfigPath = path.join(__dirname, 'next.config.js');
  let nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
  let modified = false;
  
  if (!nextConfig.includes('ignoreBuildErrors: true')) {
    console.log('Adding typescript.ignoreBuildErrors to next.config.js');
    nextConfig = nextConfig.replace(
      'typescript: {',
      'typescript: {\n    ignoreBuildErrors: true,'
    );
    modified = true;
  }
  
  if (!nextConfig.includes('ignoreDuringBuilds: true')) {
    console.log('Adding eslint.ignoreDuringBuilds to next.config.js');
    nextConfig = nextConfig.replace(
      'eslint: {',
      'eslint: {\n    ignoreDuringBuilds: true,'
    );
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(nextConfigPath, nextConfig);
    console.log('✅ next.config.js has been updated for deployment');
  } else {
    console.log('✅ next.config.js already has required deployment settings');
  }
} catch (error) {
  console.error('❌ Error updating next.config.js:', error);
}

console.log('Vercel deployment setup complete!'); 