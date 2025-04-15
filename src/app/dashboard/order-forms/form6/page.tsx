import { createServerComponentClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import PerformanceBondForm from '@/components/forms/PerformanceBondForm'
import { getUserProfileData } from '@/lib/utils/get-user-data'

export default async function PerformanceBondPage() {
  const supabase = createServerComponentClient({ cookies })
  const userData = await getUserProfileData(supabase)

  return (
    <div className="container mx-auto py-8">
      <PerformanceBondForm userData={userData} />
    </div>
  )
} 