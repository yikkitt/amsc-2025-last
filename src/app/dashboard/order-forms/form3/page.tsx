import { createSupabaseServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import ElectricalLightingForm from '@/components/forms/ElectricalLightingForm'
import { getUserProfileData } from '@/lib/utils/get-user-data'

export default async function Form3Page() {
  const supabase = createSupabaseServerClient()
  const userData = await getUserProfileData(supabase)

  return (
    <div className="container mx-auto py-8">
      <ElectricalLightingForm userData={userData} />
    </div>
  )
} 