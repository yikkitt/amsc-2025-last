import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Create a simple response first
  const response = NextResponse.next();
  
  // Add debug headers to track middleware execution
  response.headers.set('x-middleware-executed', 'true');
  response.headers.set('x-requested-path', request.nextUrl.pathname);

  // Create Supabase client
  try {
    const supabase = createMiddlewareClient({ req: request, res: response });
    
    // Mark that we created the client
    response.headers.set('x-supabase-client-created', 'true');

    // Get session (simplified)
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    
    // Log session status in header
    response.headers.set('x-session-exists', String(!!session));

    // Simple redirect logic
    const path = request.nextUrl.pathname;
    
    // Redirect to signin if accessing dashboard without session
    if (!session && path.startsWith('/dashboard')) {
      const redirectUrl = new URL('/auth/signin', request.url);
      response.headers.set('x-redirect-reason', 'dashboard-no-session');
      return NextResponse.redirect(redirectUrl);
    }
    
    // Redirect to dashboard if accessing auth pages with session
    if (session && (path === '/' || path.startsWith('/auth/'))) {
      const redirectUrl = new URL('/dashboard', request.url);
      response.headers.set('x-redirect-reason', 'auth-with-session');
      return NextResponse.redirect(redirectUrl);
    }
    
    // No redirect needed
    response.headers.set('x-no-redirect', 'true');
    return response;
  } catch (error) {
    // If anything fails, log in header and continue
    response.headers.set('x-middleware-error', String(error));
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
    '/((?!api|_next/static|_next/image|favicon.ico).*) ',
  ],
}; 