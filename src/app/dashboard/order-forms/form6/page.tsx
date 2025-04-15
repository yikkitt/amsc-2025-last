import { createSupabaseServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import PerformanceBondForm from '@/components/forms/PerformanceBondForm'
import { getUserProfileData } from '@/lib/utils/get-user-data'

export default async function PerformanceBondPage() {
  const supabase = createSupabaseServerClient()
  const userData = await getUserProfileData(supabase)

  return (
    <div className="container mx-auto py-8">
      <PerformanceBondForm userData={userData} />
    </div>
  )
} 