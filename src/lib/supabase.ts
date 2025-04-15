import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Ensure these are always defined with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string || ''

// Check if URL and key are set
if (!supabaseUrl || !supabaseKey) {
  console.error('⚠️ Supabase URL or key is missing! Authentication will fail.')
}

/**
 * Create a Supabase client for use in the browser
 */
export const createClientComponentClient = () => {
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    }
  })
}

/**
 * Create a Supabase client for use in server components
 */
export const createServerComponentClient = ({ cookies }: { cookies: any } = { cookies: undefined }) => {
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}

/**
 * Create a Supabase client for use in middleware
 */
export const createMiddlewareClient = (request: NextRequest) => {
  try {
    // Initialize response
    const response = NextResponse.next();
    
    // Access cookie store from request
    const cookieStore = request.cookies;
    
    // Create Supabase client specific for middleware
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      }
    });
    
    // Define custom cookies implementation
    const customAuth = {
      ...supabase.auth,
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
    };
    
    // @ts-ignore - Override the auth object with our custom implementation
    supabase.auth = customAuth;
    
    return { supabase, response };
  } catch (error) {
    console.error('Error creating middleware client:', error);
    const response = NextResponse.next();
    return { 
      supabase: createClient(supabaseUrl, supabaseKey),
      response 
    };
  }
}; 