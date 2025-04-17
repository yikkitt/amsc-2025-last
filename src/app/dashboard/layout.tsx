import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import PageHeader from '@/components/dashboard/PageHeader'
import Sidebar from '@/components/layout/Sidebar'

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
  console.log("[DASHBOARD LAYOUT] Dashboard layout rendering");
  
  // --- BEGIN SERVER COOKIE DEBUG ---
  const cookieStore = cookies();
  const allCookies = cookieStore.getAll();
  console.log('[DASHBOARD LAYOUT] All cookies received by server:', JSON.stringify(allCookies, null, 2));
  
  // Look for Supabase specific cookies
  const supabaseCookies = allCookies.filter(cookie => cookie.name.startsWith('sb-'));
  console.log('[DASHBOARD LAYOUT] Supabase cookies found:', supabaseCookies.length);
  console.log('[DASHBOARD LAYOUT] Supabase cookie names:', supabaseCookies.map(c => c.name));
  
  // Default Supabase cookie names often start with sb-
  // Look for common patterns
  const supabaseCookie = allCookies.find(cookie => cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token'));
  console.log('[DASHBOARD LAYOUT] Found Supabase auth token cookie:', !!supabaseCookie);
  // --- END SERVER COOKIE DEBUG ---

  // More robust auth check
  const supabase = createSupabaseServerClient();
  console.log('[DASHBOARD LAYOUT] Supabase server client created');
  
  try {
    const { data, error } = await supabase.auth.getUser();
    
    console.log('[DASHBOARD LAYOUT] Auth check result:', { 
      hasUser: !!data?.user, 
      error: error ? { message: error.message, name: error.name } : null 
    });
    
    // Workaround for local development or Vercel preview deployments
    // Check URL params for auth bypass for testing
    const isBypassRequested = false; // We can't access URL params in server components without headers
    
    if (data?.user) {
      console.log('[DASHBOARD LAYOUT] Auth successful! User ID:', data.user.id);
    } else {
      console.log('[DASHBOARD LAYOUT] No authenticated user found');
    }
    
    // Use a conditional for visibility instead of a redirect for debugging
    if ((error || !data?.user) && !isBypassRequested) {
      console.log('[DASHBOARD LAYOUT] Authentication failed - would normally redirect to signin');
      // TEMPORARILY COMMENTED OUT FOR DEBUGGING
      // redirect('/auth/signin');
      
      // Instead, show auth debug info
      return (
        <div className="p-8 bg-red-50 min-h-screen">
          <h1 className="text-2xl font-bold text-red-800 mb-4">Authentication Debug</h1>
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-2">Authentication Failed</h2>
            <p className="mb-4">You would normally be redirected to signin, but for debugging we're showing this page.</p>
            
            <h3 className="font-bold mb-2">Error details:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto mb-4">
              {JSON.stringify(error || 'No error object, but auth check failed', null, 2)}
            </pre>
            
            <h3 className="font-bold mb-2">Authentication Attempt:</h3>
            <p className="mb-2">Try directly reading the auth token cookie:</p>
            {(() => {
              try {
                const projectRef = 'kiotgupdmepdyiscbrmb';
                const authCookie = allCookies.find(c => c.name === `sb-${projectRef}-auth-token`);
                if (authCookie) {
                  try {
                    const authData = JSON.parse(authCookie.value);
                    return (
                      <div className="mb-4">
                        <p className="text-green-700 font-semibold mb-2">Successfully parsed auth token cookie!</p>
                        <p className="mb-1">Access token exists: {!!authData.access_token ? 'Yes' : 'No'}</p>
                        <p className="mb-1">Refresh token exists: {!!authData.refresh_token ? 'Yes' : 'No'}</p>
                        <p className="mb-1">Expires at: {new Date(authData.expires_at * 1000).toLocaleString()}</p>
                        <p className="mb-1">User ID: {authData.user?.id || 'Not found'}</p>
                      </div>
                    );
                  } catch (e) {
                    return <p className="text-red-700 mb-4">Error parsing auth cookie: {String(e)}</p>;
                  }
                }
                return <p className="text-red-700 mb-4">Auth token cookie not found</p>;
              } catch (e) {
                return <p className="text-red-700 mb-4">Error checking auth token: {String(e)}</p>;
              }
            })()}
            
            <h3 className="font-bold mb-2">Cookies present:</h3>
            <p className="mb-2">Total cookies: {allCookies.length}</p>
            <p className="mb-2">Supabase cookies: {supabaseCookies.length}</p>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(allCookies.map(c => ({ 
                name: c.name, 
                value: c.name.includes('token') ? '[REDACTED]' : c.value
              })), null, 2)}
            </pre>
          </div>
        </div>
      );
    }
  } catch (dbgError) {
    console.error('[DASHBOARD LAYOUT] Exception during auth check:', dbgError);
    return (
      <div className="p-8 bg-red-50 min-h-screen">
        <h1 className="text-2xl font-bold text-red-800 mb-4">Authentication Error</h1>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Exception during authentication</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(dbgError, null, 2)}
          </pre>
        </div>
      </div>
    );
  }
  
  console.log('[DASHBOARD LAYOUT] User authenticated, rendering dashboard');

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full">
        <PageHeader />
        <div className="flex-grow p-6 md:px-12">
          {children}
        </div>
      </div>
    </div>
  )
} 
