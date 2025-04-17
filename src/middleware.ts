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
      console.log(`[Middleware] Attempting getSession for path: ${request.nextUrl.pathname}`);
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('[Middleware] Error getting session:', error);
        // Log error but still return response to potentially show error page
        return response; 
      }
      
      const session = data.session;
      const pathname = request.nextUrl.pathname;
      // Log the raw data object and the determined session status
      console.log('[Middleware] Raw getSession data:', JSON.stringify(data, null, 2));
      console.log(`[Middleware] Path: ${pathname}, Session Exists: ${!!session}`);
      
      // Protect dashboard routes - redirect to login if not authenticated
      if (!session && pathname.startsWith('/dashboard')) {
        console.log('[Middleware] No session, accessing dashboard. Redirecting to signin...');
        const redirectUrl = new URL('/auth/signin', request.url);
        return NextResponse.redirect(redirectUrl);
      }
      
      // Redirect from login/root to dashboard if already logged in
      if (session && (pathname === '/' || pathname === '/auth/signin')) {
        console.log(`[Middleware] Condition MET: Session exists (${!!session}) AND path is root/signin (${pathname}). Redirecting to dashboard...`);
        const redirectUrl = new URL('/dashboard', request.url);
        return NextResponse.redirect(redirectUrl);
      } else {
        // Log why the redirect condition was NOT met
        console.log(`[Middleware] Condition NOT MET for redirect to dashboard. Session: ${!!session}, Path: ${pathname}`);
      }
      
      // Log final decision if no redirect happened earlier
      console.log('[Middleware] Proceeding with original response for path:', pathname);

    } catch (sessionError) {
      console.error('[Middleware] Session retrieval error:', sessionError);
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