import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

console.log('Supabase Config:', { 
  url: supabaseUrl ? 'Set' : 'Not set',
  key: supabaseAnonKey ? 'Set' : 'Not set',
  mockAuth: process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true' ? 'Enabled' : 'Disabled'
});

// Basic client creation without typing for now
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
}); 