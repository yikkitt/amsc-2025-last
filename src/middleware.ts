import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Define public paths that don't require authentication
const PUBLIC_PATHS = [
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
];

export async function middleware(request: NextRequest) {
  const requestPath = request.nextUrl.pathname;
  
  // Skip middleware for static files, API routes, and other special paths
  if (
    requestPath.startsWith('/_next') ||
    requestPath.startsWith('/api') ||
    requestPath.includes('/favicon.') ||
    requestPath.includes('.') ||
    requestPath === '/heartbeat'
  ) {
    return NextResponse.next();
  }
  
  console.log(`[Middleware] Processing request for path: ${requestPath}`);
  
  // Create a response to modify
  const response = NextResponse.next();

  try {
    // Initialize the Supabase client with proper cookie handling
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            const cookie = request.cookies.get(name);
            return cookie?.value;
          },
          set(name, value, options) {
            // If the response has already been modified, we need to clone it
            request.cookies.set(name, value);
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name, options) {
            request.cookies.delete(name);
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    // Debug: Log some important cookie names to help with debugging
    const accessTokenCookie = request.cookies.get('sb-access-token');
    const refreshTokenCookie = request.cookies.get('sb-refresh-token');
    const authTokenCookie = request.cookies.get('sb-kiotgupdmepdyiscbrmb-auth-token');
    
    console.log('[Middleware] Cookie status:', {
      hasAccessToken: !!accessTokenCookie,
      hasRefreshToken: !!refreshTokenCookie,
      hasAuthToken: !!authTokenCookie,
    });
    
    // Get the session - this is the most critical part
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    
    console.log(`[Middleware] Path: ${requestPath}, Session exists: ${!!session}`);
    
    // If we have a session (user is logged in)
    if (session) {
      // If user is trying to access auth pages but is already logged in,
      // redirect them to the dashboard
      if (requestPath.startsWith('/auth')) {
        console.log('[Middleware] User is authenticated, redirecting from auth page to dashboard');
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      
      // If user is at the root path, redirect to dashboard
      if (requestPath === '/') {
        console.log('[Middleware] User is authenticated, redirecting from root to dashboard');
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      
      // For all other paths, proceed as normal for authenticated users
      return response;
    }
    // If we don't have a session (user is not logged in)
    else {
      // If user is trying to access protected pages, redirect to signin
      if (requestPath.startsWith('/dashboard')) {
        console.log('[Middleware] User is not authenticated, redirecting from dashboard to signin');
        return NextResponse.redirect(new URL('/auth/signin', request.url));
      }
      
      // If user is at the root path, redirect to signin
      if (requestPath === '/') {
        console.log('[Middleware] User is not authenticated, redirecting from root to signin');
        return NextResponse.redirect(new URL('/auth/signin', request.url));
      }
      
      // For all other paths, proceed as normal for unauthenticated users
      return response;
    }
  } catch (error) {
    console.error('[Middleware] Error in middleware:', error);
    // In case of error, proceed to the requested page
    // This avoids locking users out completely if there's an issue
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api (API routes)
     */
    '/((?!_next/static|_next/image|favicon|public|api).*)',
  ],
}; 