import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

// Singleton instance to prevent "Multiple GoTrueClient instances detected" warnings
let supabaseInstance: ReturnType<typeof createClientComponentClient<Database>> | null = null;

// Create and export a singleton function that returns the same instance
export const supabase = (() => {
  if (typeof window !== 'undefined') {
    // Only create the client on the client side
    if (!supabaseInstance) {
      console.log('Creating singleton Supabase client');
      supabaseInstance = createClientComponentClient<Database>({
        cookieOptions: {
          name: 'amsc-supabase-auth-unique-key'
        }
      });
    }
    return supabaseInstance;
  }
  
  // For server-side, create a new instance each time
  // This won't cause the warning since server context is isolated
  return createClientComponentClient<Database>();
})();

// AVOID USING THIS except in special cases
// This will create a new client and may trigger warnings
export const createFreshSupabaseClient = () => {
  console.warn('Creating a fresh Supabase client - use with caution to avoid multiple GoTrueClient instances');
  return createClientComponentClient<Database>();
}; 