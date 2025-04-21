import { createSupabaseServerClient } from '@/lib/supabase/server'
import FasciaNameFormDownload from '@/components/forms/form-1-fascia-name-download'
import { getUserProfileData } from '@/lib/utils/get-user-data'

export default async function FasciaNameFormDownloadPage() {
  const supabase = createSupabaseServerClient()
  
  // Use getUserProfileData to get complete user profile
  const userData = await getUserProfileData(supabase)
  
  return (
    <div className="container mx-auto py-8">
      <FasciaNameFormDownload userData={userData} />
    </div>
  )
} 