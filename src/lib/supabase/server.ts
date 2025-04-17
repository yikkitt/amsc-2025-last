import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// Hardcoded values for deployment safety
const SUPABASE_URL = 'https://kiotgupdmepdyiscbrmb.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpb3RndXBkbWVwZHlpc2Nicm1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5OTc4MDQsImV4cCI6MjA1OTU3MzgwNH0.USrVcvc8lzraMh4a4BpaTSope81DwX4EsYCxMddC1I8'

// Helper function to get project reference from URL
function getProjectRef(): string {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL;
    // URL format: https://{project-ref}.supabase.co
    const matches = url.match(/https:\/\/(.*?)\.supabase\.co/);
    if (matches && matches[1]) {
      return matches[1];
    }
  } catch (e) {
    console.error('[SERVER] Error extracting project ref:', e);
  }
  // Use fallback from hardcoded URL
  try {
    const matches = SUPABASE_URL.match(/https:\/\/(.*?)\.supabase\.co/);
    if (matches && matches[1]) {
      return matches[1];
    }
  } catch (e) {
    console.error('[SERVER] Error extracting fallback project ref:', e);
  }
  return 'unknown';
}

// Helper function to get Supabase URL for server-side
function getSupabaseUrlServer(): string {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (envUrl) {
    try {
      new URL(envUrl)
      return envUrl
    } catch (error) {
      console.error('[SERVER] Invalid Supabase URL format from env:', error)
    }
  }
  return SUPABASE_URL
}

// Helper function to get Supabase key for server-side
function getSupabaseKeyServer(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_KEY
}

const supabaseUrl = getSupabaseUrlServer()
const supabaseKey = getSupabaseKeyServer()

/**
 * Create a Supabase client for use in server components
 * Renamed from createServerComponentClient
 */
export const createSupabaseServerClient = () => {
  const cookieStore = cookies()
  
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      // @ts-ignore - The cookies object is valid for server component usage but not explicitly typed
      cookies: {
        get(name: string) {
          try {
            // Get the cookie directly
            const value = cookieStore.get(name)?.value;
            if (value) {
              return value;
            }
            
            // If not found, try different naming patterns
            // First, check for project-specific cookie naming
            if (name.startsWith('sb-') && name.includes('-auth-')) {
              const projectRef = getProjectRef();
              
              // Check for the token in various formats
              if (name.endsWith('-auth-token')) {
                // Try alternate formats
                const alternates = [
                  `sb-${projectRef}-auth-token`,
                  'sb-auth-token',
                  `sb-access-token`,
                  `sb-${projectRef}-access-token`,
                ];
                
                for (const alt of alternates) {
                  const altValue = cookieStore.get(alt)?.value;
                  if (altValue) {
                    console.log(`[SERVER] Found alternate cookie: ${alt}`);
                    return altValue;
                  }
                }
              }
              
              // Check for refresh token
              if (name.includes('refresh')) {
                const alternates = [
                  `sb-${projectRef}-refresh-token`,
                  'sb-refresh-token'
                ];
                
                for (const alt of alternates) {
                  const altValue = cookieStore.get(alt)?.value;
                  if (altValue) {
                    console.log(`[SERVER] Found alternate cookie: ${alt}`);
                    return altValue;
                  }
                }
              }
            }
            
            // Not found in any format
            return undefined;
          } catch (e) {
            console.error('[SERVER] Error getting cookie:', e);
            return undefined;
          }
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            console.error('Error setting cookie:', error)
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            console.error('Error removing cookie:', error)
          }
        }
      }
    }
  })
} 