import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import FasciaNameForm from '@/components/forms/form-1-fascia-name'
import ContractorPassForm from '@/components/forms/ContractorPassForm'
import ElectricalLightingForm from '@/components/forms/ElectricalLightingForm'
import FurnitureOrderForm from '@/components/forms/FurnitureOrderForm'
import PrintingOrderForm from '@/components/forms/PrintingOrderForm'
import PerformanceBondForm from '@/components/forms/PerformanceBondForm'
import AdminFeesForm from '@/components/forms/AdminFeesForm'
import IndemnityLetterForm from '@/components/forms/IndemnityLetterForm'

export const metadata: Metadata = {
  title: 'Order Form - AMSC 2025',
  description: 'Submit your exhibition order form',
}

type BaseForm = {
  name: string
  description: string
  deadline: string
  hasLateCharge: boolean
}

type FormWithoutLateCharge = BaseForm & {
  hasLateCharge: false
}

type FormWithLateCharge = BaseForm & {
  hasLateCharge: true
  lateCharge: string
}

type Form = FormWithoutLateCharge | FormWithLateCharge

const forms: Record<number, Form> = {
  1: {
    name: 'Form 1: Fascia Name Form',
    description: 'Submit your company name as it should appear on the fascia board.',
    deadline: '30th June 2025',
    hasLateCharge: true,
    lateCharge: 'RM 150.00',
  },
  2: {
    name: 'Form 2: Contractor Pass Application Form',
    description: 'Apply for a contractor pass for the exhibition.',
    deadline: '30th June 2025',
    hasLateCharge: true,
    lateCharge: 'RM 100',
  },
  3: {
    name: 'Form 3: Electrical & Lighting Order Form',
    description: 'Order electrical points and additional lighting.',
    deadline: '30th June 2025',
    hasLateCharge: true,
    lateCharge: '10%',
  },
  4: {
    name: 'Form 4: Furniture Order Form',
    description: 'Order furniture for your booth.',
    deadline: '30th June 2025',
    hasLateCharge: true,
    lateCharge: '30%',
  },
  5: {
    name: 'Form 5: Printing Order Form',
    description: 'Order printing services for your booth.',
    deadline: '30th June 2025',
    hasLateCharge: true,
    lateCharge: '30%',
  },
  6: {
    name: 'Form 6: Non-Official Contractor Form (Performance Bond)',
    description: 'Apply for a non-official contractor (Performance Bond) for the exhibition.',
    deadline: '30th June 2025',
    hasLateCharge: true,
    lateCharge: 'RM 100',
  },
  7: {
    name: 'Form 7: Non-Official Contractor Form (Admin Fees)',
    description: 'Apply for a non-official contractor (Admin Fees) for the exhibition.',
    deadline: '30th June 2025',
    hasLateCharge: true,
    lateCharge: 'RM 100',
  },
  8: {
    name: 'Form 8: Letter Of Indemnity For Non-Official Contractor',
    description: 'Apply for a letter of Indemnity for a non-official contractor for the exhibition.',
    deadline: '30th June 2025',
    hasLateCharge: false,
  },
}

export default async function OrderFormPage({ params }: { params: { id: string } }) {
  const formId = parseInt(params.id)
  const form = forms[formId as keyof typeof forms]

  if (!form) {
    notFound()
  }

  const supabase = createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  const { data: userData } = await supabase
    .from('amsc_2025_user')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h3 className="text-2xl font-semibold leading-6 text-gray-900">{form.name}</h3>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          {form.description}
        </p>
        <div className="mt-2 flex items-center">
          <span className="text-sm text-gray-500">
            <span className="font-medium">Deadline:</span> {form.deadline}
          </span>
          {form.hasLateCharge && (
            <span className="ml-4 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
              Late charge: {form.lateCharge}
            </span>
          )}
        </div>
      </div>

      {formId === 1 && <FasciaNameForm userData={userData} />}
      {formId === 2 && <ContractorPassForm userData={userData} />}
      {formId === 3 && <ElectricalLightingForm userData={userData} />}
      {formId === 4 && <FurnitureOrderForm userData={userData} />}
      {formId === 5 && <PrintingOrderForm userData={userData} />}
      {formId === 6 && <PerformanceBondForm userData={userData} />}
      {formId === 7 && <AdminFeesForm userData={userData} />}
      {formId === 8 && <IndemnityLetterForm userData={userData} />}
    </div>
  )
} 