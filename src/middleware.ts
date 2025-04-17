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
        console.error('[Middleware] Error getting session:', error);
        return response;
      }
      
      const session = data.session;
      const pathname = request.nextUrl.pathname;
      console.log(`[Middleware] Path: ${pathname}, Session Exists: ${!!session}`);
      
      // Protect dashboard routes - redirect to login if not authenticated
      if (!session && pathname.startsWith('/dashboard')) {
        console.log('[Middleware] No session, accessing dashboard. Redirecting to signin...');
        const redirectUrl = new URL('/auth/signin', request.url);
        return NextResponse.redirect(redirectUrl);
      }
      
      // Redirect from login/root to dashboard if already logged in
      if (session && (pathname === '/' || pathname === '/auth/signin')) {
        console.log('[Middleware] Session found, accessing root or signin. Redirecting to dashboard...');
        const redirectUrl = new URL('/dashboard', request.url);
        return NextResponse.redirect(redirectUrl);
      } else if (session) {
        console.log('[Middleware] Session found, accessing allowed page:', pathname);
      } else {
        console.log('[Middleware] No session, accessing allowed page:', pathname);
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