import { getUserProfileData } from '@/lib/utils/get-user-data';
import { createServerComponentClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { Mail, Phone, MapPin } from 'lucide-react'
import VenueFloorPlan from '@/components/dashboard/VenueFloorPlan'

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  
  console.log("Dashboard: Fetching user profile data");
  const userData = await getUserProfileData(supabase);
  console.log("Dashboard: User data received:", userData ? "Data found" : "No data");
  
  const profile = userData || {
    company_name: 'Not available',
    contact_person: 'Not available',
    address: 'Not available',
    booth_number: 'Not available',
    telephone: 'Not available',
    tel: 'Not available',
    email: 'Not available'
  };
  
  // Handle both telephone and tel field names
  const phoneNumber = profile.telephone || profile.tel || 'Not available';
  
  console.log("Dashboard: Final profile data:", {
    company_name: profile.company_name,
    booth_number: profile.booth_number,
    contact_person: profile.contact_person,
    has_email: !!profile.email,
    has_phone: !!phoneNumber,
    has_address: !!profile.address
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
        <p className="mt-1 text-sm text-gray-600">
          Manage your exhibitor forms and information here.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Company Name
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {profile?.company_name || 'Not set'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Booth Number
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {profile?.booth_number || 'Not set'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Contact Person
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {profile?.contact_person || 'Not set'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Mail className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Email
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {profile?.email || 'Not set'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Telephone */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Phone className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Telephone
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {phoneNumber}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MapPin className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Address
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 break-words">
                    {profile?.address || 'Not set'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Venue Floor Plan Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Event Information</h2>
        <VenueFloorPlan />
      </div>
    </div>
  )
} 