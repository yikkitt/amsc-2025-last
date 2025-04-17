import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Import directly from supabase-js to avoid package conflicts
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  // Add debug header to track middleware execution
  const response = NextResponse.next();
  response.headers.set('x-middleware-executed', 'true');
  
  try {
    // Get all cookies and log them
    const allCookies = request.cookies.getAll();
    console.log('[MIDDLEWARE DEBUG] All cookies:', 
      allCookies.map(c => ({ name: c.name, value: c.name.includes('token') ? '[REDACTED]' : c.value }))
    );
    
    // Get auth cookie - Supabase uses these cookie names by default
    const hasAccessToken = request.cookies.has('sb-access-token');
    const hasRefreshToken = request.cookies.has('sb-refresh-token');
    
    // Get the Supabase project ID from the cookies if present
    const projectCookies = allCookies.filter(c => c.name.startsWith('sb-'));
    const possibleProjectId = projectCookies.length > 0 
      ? projectCookies[0].name.split('-')[1]
      : 'unknown';
      
    console.log('[MIDDLEWARE DEBUG] Supabase Auth Check:', {
      hasAccessToken,
      hasRefreshToken,
      possibleProjectId,
      cookieCount: allCookies.length,
      hasSbCookies: projectCookies.length > 0,
      sbCookieNames: projectCookies.map(c => c.name)
    });
    
    // Log check in headers
    response.headers.set('x-has-access-token', String(hasAccessToken));
    response.headers.set('x-has-refresh-token', String(hasRefreshToken));
    
    // TEMPORARY: Allow access to dashboard for debugging
    // Remove the redirection to allow dashboard access for testing
    const path = request.nextUrl.pathname;
    console.log('[MIDDLEWARE DEBUG] Request path:', path);
    
    // Only redirect from auth pages to dashboard if auth cookies exist
    if ((hasAccessToken || hasRefreshToken) && 
        (path === '/' || path === '/auth/signin' || path === '/auth/signup')) {
      // Has session accessing public pages - redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    // For all other routes, don't redirect
    return response;
  } catch (error) {
    console.error('[MIDDLEWARE DEBUG] Error:', error);
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