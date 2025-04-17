import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Import directly from supabase-js to avoid package conflicts
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  // Add debug header to track middleware execution
  const response = NextResponse.next();
  response.headers.set('x-middleware-executed', 'true');
  
  try {
    // Get auth cookie - Supabase uses these cookie names by default
    const hasAccessToken = request.cookies.has('sb-access-token');
    const hasRefreshToken = request.cookies.has('sb-refresh-token');
    
    // Log check in headers
    response.headers.set('x-has-access-token', String(hasAccessToken));
    response.headers.set('x-has-refresh-token', String(hasRefreshToken));
    
    // Simple redirect logic based on path + cookie existence
    const path = request.nextUrl.pathname;
    
    if (!hasAccessToken && !hasRefreshToken && path.startsWith('/dashboard')) {
      // No session accessing dashboard - redirect to signin
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
    
    if ((hasAccessToken || hasRefreshToken) && 
        (path === '/' || path === '/auth/signin' || path === '/auth/signup')) {
      // Has session accessing public pages - redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    // For all other routes, don't redirect
    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    // If anything fails, continue normally
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 