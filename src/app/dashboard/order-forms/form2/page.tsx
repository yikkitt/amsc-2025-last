import { createServerComponentClient } from '@/lib/supabase';
import { cookies } from 'next/headers';
import ContractorPassForm from '@/components/forms/ContractorPassForm';
import { getUserProfileData } from '@/lib/utils/get-user-data';

export default async function Form2Page() {
  const supabase = createServerComponentClient({ cookies });
  const userData = await getUserProfileData(supabase);

  return (
    <div className="container mx-auto py-8">
      <ContractorPassForm userData={userData} />
    </div>
  );
} 