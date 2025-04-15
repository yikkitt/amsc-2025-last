import { createServerComponentClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import PrintingOrderForm from '@/components/forms/PrintingOrderForm'
import { getUserProfileData } from '@/lib/utils/get-user-data'

export default async function Form5Page() {
  const supabase = createServerComponentClient({ cookies })
  const userData = await getUserProfileData(supabase)

  return (
    <div className="container mx-auto py-8">
      <PrintingOrderForm userData={userData} />
    </div>
  )
} 