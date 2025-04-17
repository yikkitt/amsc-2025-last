import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Import directly from supabase-js to avoid package conflicts
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  // Fast path approach - just check cookie existence without complex operations
  try {
    const path = request.nextUrl.pathname;
    console.log('[MIDDLEWARE DEBUG] Request path:', path);
    
    // Get all cookies at once for better performance
    const cookieStore = request.cookies;
    
    // Check for any of the possible auth cookies using a simplified approach
    const projectRef = 'kiotgupdmepdyiscbrmb';
    const hasAuth = cookieStore.has('sb-access-token') || 
                   cookieStore.has('sb-refresh-token') || 
                   cookieStore.has(`sb-${projectRef}-access-token`) || 
                   cookieStore.has(`sb-${projectRef}-refresh-token`);
    
    // Log all cookies for debugging
    console.log('[MIDDLEWARE DEBUG] Has auth cookies:', hasAuth);
    console.log('[MIDDLEWARE DEBUG] All cookie names:', Array.from(cookieStore.getAll()).map(c => c.name));
    
    // IMPORTANT: Special case for root path to avoid redirect loops
    // Let the page component handle root path redirection
    if (path === '/') {
      console.log('[MIDDLEWARE DEBUG] Root path, skipping middleware redirects');
      return NextResponse.next();
    }
    
    // Quick redirect logic based on path + cookie existence
    if (!hasAuth && path.startsWith('/dashboard')) {
      console.log('[MIDDLEWARE DEBUG] No auth, redirecting to signin');
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
    
    // Only redirect authenticated users from auth paths
    if (hasAuth && (path === '/auth/signin' || path === '/auth/signup')) {
      console.log('[MIDDLEWARE DEBUG] Has auth, redirecting to dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    // For all other routes, continue normally
    console.log('[MIDDLEWARE DEBUG] Continuing normally for path:', path);
    return NextResponse.next();
  } catch (error) {
    console.error('[Middleware] Error:', error);
    // If anything fails, continue normally
    return NextResponse.next();
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