import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
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
  console.log("[DASHBOARD LAYOUT] Dashboard layout rendering");
  
  // --- BEGIN SERVER COOKIE DEBUG ---
  const cookieStore = cookies();
  const allCookies = cookieStore.getAll();
  // --- Log statements removed for brevity ---
  // --- END SERVER COOKIE DEBUG ---

  // More robust auth check
  const supabase = createSupabaseServerClient();
  console.log('[DASHBOARD LAYOUT] Supabase server client created');
  
  try {
    const { data, error } = await supabase.auth.getUser();
    
    // Use a conditional for visibility instead of a redirect for debugging
    if ((error || !data?.user)) {
      console.log('[DASHBOARD LAYOUT] Authentication failed - redirecting to signin');
      redirect('/auth/signin');
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
    );
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
} 
