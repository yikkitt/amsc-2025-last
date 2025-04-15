import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and key from environment variables with empty string fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Log configuration status
console.log('Supabase Config:', { 
  url: supabaseUrl ? 'Set' : 'Not set',
  key: supabaseAnonKey ? 'Set' : 'Not set',
  mockAuth: process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true' ? 'Enabled' : 'Disabled'
});

// Fail clearly if critical values are missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or key is missing. Authentication will not work properly.');
}

// Create a client specifically for browser use
const createBrowserSupabase = () => {
  try {
    // Only create with localStorage in browser environment
    if (typeof window !== 'undefined') {
      return createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storage: window.localStorage
        }
      });
    }
  } catch (error) {
    console.error('Error creating browser Supabase client:', error);
  }
  
  // Fallback for server environment or errors
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
};

// Export the appropriate client
export const supabase = createBrowserSupabase(); 