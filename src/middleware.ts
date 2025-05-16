import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Define paths that don't require authentication
const PUBLIC_PATHS = [
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
];

const isPublicPath = (path: string) => {
  return PUBLIC_PATHS.some(publicPath => path.startsWith(publicPath));
};

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
  
  // Always allow access to public paths (auth pages)
  if (isPublicPath(requestPath)) {
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

    // Debug: Log some important cookie names
    const accessTokenCookie = request.cookies.get('sb-access-token');
    const projectAccessTokenCookie = request.cookies.get('sb-kiotgupdmepdyiscbrmb-access-token');
    const authTokenCookie = request.cookies.get('sb-kiotgupdmepdyiscbrmb-auth-token');
    
    console.log('[Middleware] Cookie status:', {
      hasAccessToken: !!accessTokenCookie,
      hasProjectAccessToken: !!projectAccessTokenCookie,
      hasAuthToken: !!authTokenCookie,
    });
    
    // Get the session
    const { data, error } = await supabase.auth.getSession();
    const session = data.session;
    
    console.log(`[Middleware] Path: ${requestPath}, Session exists: ${!!session}`);
    
    // Handle requests based on authentication status
    if (!session) {
      // User is not authenticated
      
      // If trying to access protected pages (dashboard), redirect to signin
      if (requestPath.startsWith('/dashboard') || requestPath === '/') {
        console.log('[Middleware] User is not authenticated, redirecting to signin');
        const redirectUrl = new URL('/auth/signin', request.url);
        return NextResponse.redirect(redirectUrl);
      }
    } else {
      // User is authenticated
      
      // If at root path, redirect to dashboard
      if (requestPath === '/') {
        console.log('[Middleware] User is authenticated, redirecting to dashboard');
        const redirectUrl = new URL('/dashboard', request.url);
        return NextResponse.redirect(redirectUrl);
      }
    }
    
    // For all other paths, proceed normally
    return response;
    
  } catch (error) {
    console.error('[Middleware] Error in middleware:', error);
    // On error, allow access to signin page
    if (requestPath.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
    // For all other errors, just proceed
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