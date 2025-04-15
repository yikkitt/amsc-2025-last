import { createClient, SupabaseClientOptions } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { type CookieOptions } from '@supabase/ssr'

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
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    // Define cookie methods for Supabase client
    const cookieOptions: { [key: string]: any } = {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        // If the cookie is set, update the request and response cookies
        request.cookies.set({
          name,
          value,
          ...options,
        })
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        })
        response.cookies.set({
          name,
          value,
          ...options,
        })
      },
      remove(name: string, options: CookieOptions) {
        // If the cookie is removed, update the request and response cookies
        request.cookies.set({
          name,
          value: '',
          ...options,
        })
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        })
        response.cookies.set({
          name,
          value: '',
          ...options,
        })
      },
    }

    const supabase = createClient(
      supabaseUrl, 
      supabaseKey, 
      {
        // Pass cookie methods in the options object
        global: { 
          fetch: fetch 
        },
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
          flowType: 'pkce', // Recommended for SSR
        },
        cookies: cookieOptions // Pass the cookie handler object here
      } as SupabaseClientOptions<"public"> // Cast to SupabaseClientOptions type
    );

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