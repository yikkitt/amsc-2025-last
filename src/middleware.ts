import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  try {
    // Initialize the Supabase client with the request and response
    const supabase = createMiddlewareClient({ req: request, res });
    
    // Get the user's session
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    
    if (isDevelopment) {
      console.log('Development mode: Auth session status:', session ? 'Authenticated' : 'Not authenticated');
      // In development mode, we still want auth but don't need to redirect - allows testing the UI
      return res;
    }
    
    // Protect dashboard routes - redirect to login if not authenticated
    if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
      const redirectUrl = new URL('/auth/signin', request.url);
      return NextResponse.redirect(redirectUrl);
    }
    
    // Redirect from login to dashboard if already logged in
    if (session && (request.nextUrl.pathname === '/' || 
                   request.nextUrl.pathname === '/auth/signin')) {
      const redirectUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(redirectUrl);
    }
    
    // For all other routes, just proceed normally
    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    return res;
  }
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/auth/:path*'],
}; 