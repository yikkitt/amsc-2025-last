import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import FurnitureOrderForm from '@/components/forms/FurnitureOrderForm'
import { getUserProfileData } from '@/lib/utils/get-user-data'

export default async function Form4Page() {
  const supabase = createServerComponentClient({ cookies })
  const userData = await getUserProfileData(supabase)

  return (
    <div className="container mx-auto py-8">
      <FurnitureOrderForm userData={userData} />
    </div>
  )
} 