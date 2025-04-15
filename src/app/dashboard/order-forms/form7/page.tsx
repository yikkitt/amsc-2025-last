import { createSupabaseServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import AdminFeesForm from '@/components/forms/AdminFeesForm'
import { getUserProfileData } from '@/lib/utils/get-user-data'

export default async function AdminFeesPage() {
  const supabase = createSupabaseServerClient()
  const userData = await getUserProfileData(supabase)

  return <AdminFeesForm userData={userData} />
} 