import { createMiddlewareClient } from '@supabase/ssr'; // Import from official package
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Create an unmodified response object before calling the Supabase client
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  }, {
    request,
    response,
  });

  const pathname = request.nextUrl.pathname;
  console.log(`[Middleware SSR] Request for path: ${pathname}`);

  console.log(`[Middleware SSR] Attempting getSession...`);
  // Refresh session if expired - important!
  const { data, error } = await supabase.auth.getSession();
  console.log(`[Middleware SSR] getSession finished. Error: ${!!error}, Session: ${!!data?.session}`);

  if (error) {
    console.error('[Middleware SSR] Error returned by getSession:', error);
    // Allow request to proceed but log the error
  }

  const session = data?.session;
  console.log(`[Middleware SSR] Path: ${pathname}, Session Exists: ${!!session}`);

  // Protect dashboard routes
  if (!session && pathname.startsWith('/dashboard')) {
    console.log('[Middleware SSR] No session, accessing dashboard. Redirecting to signin...');
    const redirectUrl = new URL('/auth/signin', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect from login/root to dashboard if already logged in
  if (session && (pathname === '/' || pathname === '/auth/signin')) {
    console.log(`[Middleware SSR] Session exists, accessing root or signin (${pathname}). Redirecting to dashboard...`);
    const redirectUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  console.log(`[Middleware SSR] No redirect needed for path: ${pathname}, Session: ${!!session}. Proceeding.`);

  // Return the response object, potentially modified by the Supabase client
  return response;
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
    '/((?!api|_next/static|_next/image|favicon.ico).*) ',
  ],
}; 