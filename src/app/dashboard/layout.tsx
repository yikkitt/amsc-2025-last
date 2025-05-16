import React from 'react';
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import PageHeader from '@/components/dashboard/PageHeader'
import Sidebar from '@/components/layout/Sidebar'

// Disable the auth check in dashboard layout 
// to prevent redirection and let the middleware handle auth instead
export const dynamic = 'force-dynamic'; // Force dynamic rendering for this layout and its children

export const metadata: Metadata = {
  title: 'AMSC 2025 | Dashboard',
  description: 'Exhibitor Manual Dashboard for AMSC 2025',
}

// Server component to check auth at the layout level
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    console.log('[DASHBOARD LAYOUT] Creating Supabase client');
    const cookieStore = cookies();
    
    // Log some important cookies first for debugging
    const accessTokenCookie = cookieStore.get('sb-access-token');
    const projectAccessTokenCookie = cookieStore.get('sb-kiotgupdmepdyiscbrmb-access-token');
    const authTokenCookie = cookieStore.get('sb-kiotgupdmepdyiscbrmb-auth-token');
    
    console.log('[DASHBOARD LAYOUT] Cookie status:', {
      hasAccessToken: !!accessTokenCookie,
      hasProjectAccessToken: !!projectAccessTokenCookie,
      hasAuthToken: !!authTokenCookie,
    });

    // Create the Supabase client with the same approach as middleware
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Get session - same method as middleware
    const { data, error: sessionError } = await supabase.auth.getSession();
    const session = data.session;
    
    if (sessionError) {
      console.error('[DASHBOARD LAYOUT] Session error:', sessionError.message);
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Authentication Error</h1>
            <p>There was a problem verifying your session. Please try signing in again.</p>
          </div>
        </div>
      );
    }

    if (!session) {
      console.log('[DASHBOARD LAYOUT] No valid session found, redirecting to sign in');
      redirect('/auth/signin');
    }

    console.log('[DASHBOARD LAYOUT] Valid session found, user ID:', session.user.id);

    return (
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 flex flex-col w-full h-screen">
          <PageHeader />
          <div className="flex-1 overflow-y-auto overscroll-none">
            <div className="p-4 sm:p-6 md:px-8 lg:px-12 max-w-6xl mx-auto w-full pt-4 pb-40">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (e) {
    console.error('[DASHBOARD LAYOUT] Unexpected error:', e);
    
    // If this is a redirect exception from Next.js, let it propagate
    if (e instanceof Error && e.message.includes('NEXT_REDIRECT')) {
      throw e;
    }
    
    // For other errors, show an error UI
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p>We encountered an unexpected error. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }
} 
