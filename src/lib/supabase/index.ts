// Export Supabase client methods from their correct sources

// Re-export from auth-helpers-nextjs for client components
export { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Re-export our client instances for easier imports
export { supabase, getSupabaseBrowserClient, createFreshSupabaseClient } from './client';
export { createSupabaseServerClient } from './server';
export { createSupabaseApiClient } from './api'; 