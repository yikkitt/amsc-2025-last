import { NextResponse } from 'next/server';

// This middleware function helps ensure proper Vercel deployment
// It can be expanded later to handle auth, redirects, etc.
export function middleware(request) {
  // Continue with the request normally
  return NextResponse.next();
}

// See: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  // Skip static assets 
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/|public/).*)'],
}; 