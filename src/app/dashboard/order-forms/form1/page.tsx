import { createServerComponentClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import FasciaNameForm from '@/components/forms/form-1-fascia-name'
import { getUserProfileData } from '@/lib/utils/get-user-data'

export default async function Form1Page() {
  const supabase = createServerComponentClient({ cookies })
  
  // Use getUserProfileData to get complete user profile
  const userData = await getUserProfileData(supabase)
  
  console.log('Form1Page - User data:', userData);
  
  return (
    <div className="container mx-auto py-8">
      <FasciaNameForm userData={userData} />
    </div>
  )
} 