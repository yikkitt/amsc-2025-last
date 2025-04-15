import { createSupabaseServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import FurnitureOrderForm from '@/components/forms/FurnitureOrderForm'
import { getUserProfileData } from '@/lib/utils/get-user-data'

export default async function Form4Page() {
  const supabase = createSupabaseServerClient()
  const userData = await getUserProfileData(supabase)

  return (
    <div className="container mx-auto py-8">
      <FurnitureOrderForm userData={userData} />
    </div>
  )
} 