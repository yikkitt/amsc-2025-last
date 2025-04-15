const fs = require('fs');
const path = require('path');

/**
 * This script updates all imports from @supabase/auth-helpers-nextjs
 * to use our local utility file instead
 */

// Simple glob implementation since we don't want to depend on external modules
function findFiles(dir, pattern, results = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules
      if (file === 'node_modules') continue;
      findFiles(filePath, pattern, results);
    } else if (stat.isFile() && pattern.test(file)) {
      results.push(filePath);
    }
  }
  
  return results;
}

function updateImports() {
  try {
    console.log('Updating Supabase import statements...');
    
    // Find all TypeScript/JavaScript files (excluding node_modules)
    const filesPattern = /\.(ts|tsx|js|jsx)$/;
    const files = findFiles('./src', filesPattern);
    
    // Counter for tracking
    let updatedFiles = 0;
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Skip files that don't use the old imports
      if (!content.includes('@supabase/auth-helpers-nextjs')) {
        continue;
      }
      
      // Update the imports
      let updatedContent = content
        .replace(
          /import\s*{\s*createClientComponentClient\s*}\s*from\s*["']@supabase\/auth-helpers-nextjs["']/g,
          "import { createClientComponentClient } from '@/lib/supabase'"
        )
        .replace(
          /import\s*{\s*createServerComponentClient\s*}\s*from\s*["']@supabase\/auth-helpers-nextjs["']/g,
          "import { createServerComponentClient } from '@/lib/supabase'"
        )
        .replace(
          /import\s*{\s*createMiddlewareClient\s*}\s*from\s*["']@supabase\/auth-helpers-nextjs["']/g,
          "import { createMiddlewareClient } from '@/lib/supabase'"
        );
      
      // Update if there were changes
      if (content !== updatedContent) {
        fs.writeFileSync(file, updatedContent, 'utf8');
        console.log(`Updated imports in ${file}`);
        updatedFiles++;
      }
    }
    
    console.log(`Successfully updated ${updatedFiles} files.`);
  } catch (error) {
    console.error('Error updating imports:', error);
    process.exit(1);
  }
}

updateImports(); 