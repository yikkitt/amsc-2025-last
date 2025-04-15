import { createClient } from '@supabase/supabase-js'

// Hardcoded values for deployment safety
// These values will be replaced by environment variables at runtime
// but provide a fallback during build to prevent errors
const SUPABASE_URL = 'https://kiotgupdmepdyiscbrmb.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpb3RndXBkbWVwZHlpc2Nicm1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5OTc4MDQsImV4cCI6MjA1OTU3MzgwNH0.USrVcvc8lzraMh4a4BpaTSope81DwX4EsYCxMddC1I8'

// Helper function to get Supabase URL for client-side
function getSupabaseUrlClient(): string {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (envUrl) {
    try {
      new URL(envUrl)
      return envUrl
    } catch (error) {
      console.error('[CLIENT] Invalid Supabase URL format from env:', error)
    }
  }
  return SUPABASE_URL
}

// Helper function to get Supabase key for client-side
function getSupabaseKeyClient(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_KEY
}

const supabaseUrl = getSupabaseUrlClient()
const supabaseKey = getSupabaseKeyClient()

/**
 * Create a Supabase client for use in the browser (Client Components)
 * Renamed from createClientComponentClient
 */
export const getSupabaseBrowserClient = () => {
  // Ensure this runs only in the browser
  if (typeof window === 'undefined') {
    // Return a dummy client or throw an error on the server
    // to prevent accidental usage.
    console.warn('createClientComponentClient called on server. Returning basic client without auth persistence.');
    return createClient(supabaseUrl, supabaseKey, { 
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
    });
  }
  
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true, // Persist session in localStorage
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: window.localStorage, // Explicitly use localStorage
    }
  })
} 