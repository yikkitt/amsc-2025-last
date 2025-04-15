import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// Hardcoded values for deployment safety
const SUPABASE_URL = 'https://kiotgupdmepdyiscbrmb.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpb3RndXBkbWVwZHlpc2Nicm1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5OTc4MDQsImV4cCI6MjA1OTU3MzgwNH0.USrVcvc8lzraMh4a4BpaTSope81DwX4EsYCxMddC1I8'

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
          return cookieStore.get(name)?.value
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