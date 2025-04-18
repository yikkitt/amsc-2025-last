import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getDashboardUserData } from '@/lib/utils/get-user-data';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import VenueFloorPlan from '@/components/dashboard/VenueFloorPlan';
import DeadlineReminders from '@/components/dashboard/DeadlineReminders';
import CompanyData from '@/components/dashboard/CompanyData';
import LoadingBox from '@/components/ui/LoadingBox';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export default async function DashboardPage() {
  // Create Supabase client using the same approach as order forms
  const supabase = createSupabaseServerClient();
  
  // Get session
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    console.log('No session found, redirecting to signin');
    redirect('/auth/signin');
  }
  
  // Fetch user data using the same utility function used in order forms
  const userData = await getDashboardUserData(supabase);
  console.log('Dashboard user data retrieved:', userData);
  
  if (!userData) {
    console.error('User data not found in any table');
  }
  
  // Prepare display data from userData
  const companyName = userData?.company_name || 'Not Available';
  const contactPerson = userData?.contact_person || 'Not Available';
  const boothNumber = userData?.booth_number || 'Not Available';
  const email = userData?.email || session.user.email || 'Not Available';
  
  // Check if profile is complete for display purposes
  const profileCompleted = Boolean(
    userData?.company_name && 
    userData?.contact_person && 
    userData?.booth_number
  );
  
  // Extract first name for the welcome banner
  const firstName = userData?.contact_person?.split(' ')[0] || 'Exhibitor';
  
  return (
    <div className="dashboard-content fade-in">
      <WelcomeBanner 
        firstName={firstName} 
        companyName={companyName}
        profileCompleted={profileCompleted}
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