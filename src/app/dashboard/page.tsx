import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import DeadlineReminders from '@/components/dashboard/DeadlineReminders';
import CompanyData from '@/components/dashboard/CompanyData';
import VenueFloorPlan from '@/components/dashboard/VenueFloorPlan';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Create supabase client for server component
  const cookieStore = cookies();
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

  // Check if user is authenticated
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) {
    console.log('[DASHBOARD PAGE] No valid session found, redirecting to sign in');
    redirect('/auth/signin');
  }

  // Get user profile data
  const { data: userData, error: profileError } = await supabase
    .from('amsc_2025_user')
    .select('*')
    .eq('id', data.session.user.id)
    .maybeSingle();

  const firstName = userData?.contact_person?.split(' ')[0] || data.session.user.user_metadata?.contact_person?.split(' ')[0] || 'User';
  const companyName = userData?.company_name || data.session.user.user_metadata?.company_name || 'Your Company';
  const contactPerson = userData?.contact_person || data.session.user.user_metadata?.contact_person || 'Not Available';
  const boothNumber = userData?.booth_number || data.session.user.user_metadata?.booth_number || 'Not Available';
  const email = userData?.email || data.session.user.email || 'Not Available';

  return (
    <div className="space-y-6 dashboard-content">
      <WelcomeBanner 
        firstName={firstName}
        companyName={companyName}
      />
      
      <div className="space-y-6">
        <CompanyData 
          companyName={companyName}
          contactPerson={contactPerson}
          boothNumber={boothNumber}
          email={email}
        />
        <DeadlineReminders />
        <VenueFloorPlan />
      </div>
    </div>
  )
} 