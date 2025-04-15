import { createClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

// Hardcoded values for deployment safety
const SUPABASE_URL = 'https://kiotgupdmepdyiscbrmb.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpb3RndXBkbWVwZHlpc2Nicm1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5OTc4MDQsImV4cCI6MjA1OTU3MzgwNH0.USrVcvc8lzraMh4a4BpaTSope81DwX4EsYCxMddC1I8'

// Helper function to get Supabase URL for middleware
function getSupabaseUrlMiddleware(): string {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (envUrl) {
    try {
      new URL(envUrl)
      return envUrl
    } catch (error) {
      console.error('[MW] Invalid Supabase URL format from env:', error)
    }
  }
  return SUPABASE_URL
}

// Helper function to get Supabase key for middleware
function getSupabaseKeyMiddleware(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_KEY
}

const supabaseUrl = getSupabaseUrlMiddleware()
const supabaseKey = getSupabaseKeyMiddleware()

/**
 * Create a Supabase client for use in middleware
 */
export const createMiddlewareClient = (request: NextRequest) => {
  try {
    const response = NextResponse.next()
    const cookieStore = request.cookies
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        // @ts-ignore - The cookies object is valid for server component usage
        cookies: {
          get(name: string) {
            const cookie = cookieStore.get(name);
            return cookie?.value;
          },
          set(name: string, value: string, options: any) {
            response.cookies.set({
              name,
              value,
              ...options,
              path: '/',
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production'
            });
          },
          remove(name: string, options: any) {
            response.cookies.set({
              name,
              value: '',
              ...options,
              maxAge: -1,
              path: '/',
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production'
            });
          },
        }
      }
    });
    
    return { supabase, response }
  } catch (error) {
    console.error('Error creating middleware client:', error)
    const response = NextResponse.next()
    return {
      supabase: createClient(supabaseUrl, supabaseKey), // Basic fallback
      response
    }
  }
} 