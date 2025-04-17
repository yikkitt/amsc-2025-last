import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Import directly from supabase-js to avoid package conflicts
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  // Create response to return at the end
  const response = NextResponse.next();
  
  // Add debug header to track middleware execution
  response.headers.set('x-middleware-executed', 'true');
  response.headers.set('x-requested-path', request.nextUrl.pathname);

  // Basic session check using cookies
  try {
    // Get auth cookie
    const supabaseCookie = request.cookies.get('sb-access-token')?.value;
    response.headers.set('x-has-auth-cookie', String(!!supabaseCookie));

    // Simple redirect logic
    const path = request.nextUrl.pathname;
    
    // Since we can't verify the cookie server-side without adding complexity,
    // we'll just use existence of the cookie as a simple check
    if (!supabaseCookie && path.startsWith('/dashboard')) {
      const redirectUrl = new URL('/auth/signin', request.url);
      response.headers.set('x-redirect-reason', 'dashboard-no-cookie');
      return NextResponse.redirect(redirectUrl);
    }
  } catch (error) {
    response.headers.set('x-middleware-error', String(error));
  }
  
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