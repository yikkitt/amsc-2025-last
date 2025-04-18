import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Database } from '@/types/supabase';
import VenueFloorPlan from '@/components/dashboard/VenueFloorPlan';
import NewsUpdates from '@/components/dashboard/NewsUpdates';
import DashboardTopCards from '@/components/dashboard/DashboardTopCards';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import DeadlineReminders from '@/components/dashboard/DeadlineReminders';
import LoadingBox from '@/components/ui/LoadingBox';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

async function getUserProfile(userId: string) {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return profile;
}

export default async function DashboardPage() {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  // Get session
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/auth/signin');
  }
  
  // Fetch user's profile data
  const userProfile = await getUserProfile(session.user.id);
  
  if (!userProfile) {
    // Handle case where profile doesn't exist
    console.error('User profile not found');
  }
  
  const companyName = userProfile?.company_name || 'Your Company';
  const profileCompleted = 
    userProfile?.first_name && 
    userProfile?.last_name && 
    userProfile?.company_name && 
    userProfile?.job_title;
  
  return (
    <div className="dashboard-content fade-in">
      <WelcomeBanner 
        firstName={userProfile?.first_name || 'Exhibitor'} 
        companyName={companyName}
        profileCompleted={!!profileCompleted}
      />
      
      <Suspense fallback={<LoadingBox className="h-24 mb-6" />}>
        <DashboardTopCards userId={session.user.id} />
      </Suspense>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2">
          <VenueFloorPlan />
        </div>
        
        <div className="flex flex-col gap-6">
          <Suspense fallback={<LoadingBox className="h-full" />}>
            <DeadlineReminders />
          </Suspense>
          
          <Suspense fallback={<LoadingBox className="h-full" />}>
            <NewsUpdates />
          </Suspense>
        </div>
      </div>
    </div>
  );
} 