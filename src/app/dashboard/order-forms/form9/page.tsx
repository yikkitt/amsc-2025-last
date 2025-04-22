import { createSupabaseServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import AVEquipmentForm from '@/components/forms/AVEquipmentForm'
import { getUserProfileData } from '@/lib/utils/get-user-data'

export default async function Form9Page() {
  const supabase = createSupabaseServerClient()
  const userData = await getUserProfileData(supabase)

  return (
    <div className="container mx-auto py-8">
      <AVEquipmentForm userData={userData} />
    </div>
  )
} 