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

// Enhanced function to get complete profile data
async function getUserProfile(userId: string) {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  try {
    // Query profiles table for all user data
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    console.log('Retrieved company data from Supabase:', {
      company_name: profile?.company_name,
      first_name: profile?.first_name,
      last_name: profile?.last_name,
      booth_number: profile?.booth_number,
      email: profile?.email
    });
    
    return profile;
  } catch (error) {
    console.error('Unexpected error fetching profile:', error);
    return null;
  }
}

export default async function DashboardPage() {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  // Get session
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/auth/signin');
  }
  
  // Fetch user's profile data from Supabase
  const userProfile = await getUserProfile(session.user.id);
  
  if (!userProfile) {
    console.error('User profile not found in Supabase');
  }
  
  // Prepare data for display, defaulting if not available
  const companyName = userProfile?.company_name || 'Not Available';
  const contactPerson = userProfile?.first_name && userProfile?.last_name 
    ? `${userProfile.first_name} ${userProfile.last_name}` 
    : 'Not Available';
  const boothNumber = userProfile?.booth_number || 'Not Available';
  const email = userProfile?.email || session.user.email || 'Not Available';
  
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
      
      {/* Company Data Section - Using data from Supabase */}
      <div className="mb-6">
        <Suspense fallback={<LoadingBox className="h-24 mb-6" />}>
          <CompanyData 
            companyName={companyName}
            contactPerson={contactPerson}
            boothNumber={boothNumber}
            email={email}
          />
        </Suspense>
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