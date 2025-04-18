import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Database } from '@/types/supabase';
import VenueFloorPlan from '@/components/dashboard/VenueFloorPlan';
import DeadlineReminders from '@/components/dashboard/DeadlineReminders';
import CompanyData from '@/components/dashboard/CompanyData';
import LoadingBox from '@/components/ui/LoadingBox';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';

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
        hideViewFormsButton={true}
      />
      
      {/* Company Data Section */}
      <div className="mb-6">
        <CompanyData 
          companyName={userProfile?.company_name || 'Not Available'}
          contactPerson={`${userProfile?.first_name || ''} ${userProfile?.last_name || ''}`.trim() || 'Not Available'}
          boothNumber={userProfile?.booth_number || 'Not Available'}
          email={userProfile?.email || session.user.email || 'Not Available'}
        />
      </div>
      
      {/* Deadlines Section */}
      <div className="mb-6">
        <Suspense fallback={<LoadingBox className="h-24 mb-6" />}>
          <DeadlineReminders />
        </Suspense>
      </div>
      
      {/* Venue Floor Plan */}
      <div className="mb-6">
        <VenueFloorPlan />
      </div>
    </div>
  );
} 