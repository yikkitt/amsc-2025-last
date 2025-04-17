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
  console.log("Dashboard layout rendering");
  
  // --- BEGIN SERVER COOKIE DEBUG ---
  const cookieStore = cookies();
  const allCookies = cookieStore.getAll();
  console.log('[Layout] All cookies received by server:', JSON.stringify(allCookies, null, 2));
  // Default Supabase cookie names often start with sb-
  // Look for common patterns
  const supabaseCookie = allCookies.find(cookie => cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token'));
  console.log('[Layout] Found Supabase auth token cookie:', !!supabaseCookie);
  // --- END SERVER COOKIE DEBUG ---

  // More robust auth check
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  
  console.log('[Layout] Auth check result:', { hasUser: !!data?.user, error: !!error });
  
  if (error || !data?.user) {
    console.log('[Layout] User not authenticated, redirecting to signin');
    redirect('/auth/signin');
  }
  
  console.log('[Layout] User authenticated, rendering dashboard');

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
