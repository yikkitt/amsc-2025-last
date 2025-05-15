import { createClient } from '@supabase/supabase-js'

// Hardcoded values for deployment safety
const SUPABASE_URL = 'https://kiotgupdmepdyiscbrmb.supabase.co'
// Use the Service Role Key for API routes by default
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpb3RndXBkbWVwZHlpc2Nicm1iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mzk5NzgwNCwiZXhwIjoyMDU5NTczODA0fQ.mKrhfzdqmXUkddeMYJdZfKM0bsXBd4Tx8mvTM3OMgVM' 

// Helper function to get Supabase URL for API routes
function getSupabaseUrlApi(): string {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (envUrl) {
    try {
      new URL(envUrl)
      return envUrl
    } catch (error) {
      console.error('[API] Invalid Supabase URL format from env:', error)
    }
  }
  console.warn('[API] Falling back to hardcoded Supabase URL.')
  return SUPABASE_URL
}

// Helper function to get Supabase Service Role Key for API routes
function getSupabaseServiceKey(): string {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    console.warn('[API] SUPABASE_SERVICE_ROLE_KEY environment variable is not set! Using fallback.')
    return SUPABASE_SERVICE_KEY // Use the fallback defined at the top
  }
  return serviceKey
}

const supabaseUrl = getSupabaseUrlApi()
const supabaseServiceKey = getSupabaseServiceKey()

/**
 * Create a Supabase client for use in API routes.
 * Uses the Service Role Key for elevated privileges.
 * IMPORTANT: Never expose this client or the Service Role Key to the browser.
 */
export const createSupabaseApiClient = () => {
  if (!supabaseUrl) {
    console.error('API Route Supabase client cannot be initialized: Missing URL.')
    throw new Error('Server configuration error for Supabase API client: Missing URL');
  }

  // Always proceed with whatever key we have (either from env or fallback)
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      // detectSessionInUrl: false // Not applicable/needed for service role
    }
  })
} 