import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from './lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  try {
    // Initialize the Supabase client with the request
    const { supabase, response } = createMiddlewareClient(request);
    
    // Verify supabase.auth is properly initialized
    if (!supabase || !supabase.auth) {
      console.error('Middleware error: Supabase or supabase.auth is undefined');
      return NextResponse.next();
    }
    
    // Get the user's session with error handling
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session in middleware:', error);
        return response;
      }
      
      const session = data.session;
      
      if (isDevelopment) {
        console.log('Development mode: Auth session status:', session ? 'Authenticated' : 'Not authenticated');
        console.log('Session ID:', session?.user?.id || 'None');
      }
      
      // Protect dashboard routes - redirect to login if not authenticated
      if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
        const redirectUrl = new URL('/auth/signin', request.url);
        return NextResponse.redirect(redirectUrl);
      }
      
      // Redirect from login to dashboard if already logged in
      if (session && (request.nextUrl.pathname === '/' || 
                     request.nextUrl.pathname === '/auth/signin')) {
        const redirectUrl = new URL('/dashboard', request.url);
        return NextResponse.redirect(redirectUrl);
      }
    } catch (sessionError) {
      console.error('Session retrieval error:', sessionError);
    }
    
    // For all other routes, just proceed normally
    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/auth/:path*'],
}; 