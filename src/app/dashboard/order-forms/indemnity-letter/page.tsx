import { createSupabaseServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import IndemnityLetterForm from '@/components/forms/IndemnityLetterForm'
import { getUserProfileData } from '@/lib/utils/get-user-data'

export default async function IndemnityLetterPage() {
  const supabase = createSupabaseServerClient()
  const userData = await getUserProfileData(supabase)

  return <IndemnityLetterForm userData={userData} />
} 