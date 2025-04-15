import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@/lib/supabase/server';
import PageHeader from '@/components/dashboard/PageHeader'
import Sidebar from '@/components/layout/Sidebar'

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
  
  // DEVELOPMENT MODE BYPASS - NEVER DO THIS IN PRODUCTION
  if (process.env.NODE_ENV === 'development') {
    console.log("Development mode: Skipping auth check");
    
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
  }
  
  // Production auth check
  try {
    const supabase = createServerComponentClient();
    const { data } = await supabase.auth.getSession();
    
    console.log('Production mode - Session check:', !!data.session);
    
    if (!data.session) {
      console.log('No session detected, redirecting to login...');
      redirect('/auth/signin');
    }
  } catch (error) {
    console.error('Error checking session:', error);
    redirect('/auth/signin');
  }
  
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