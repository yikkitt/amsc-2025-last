'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { FormData } from '@/types/forms'

interface FormWrapperProps {
  formId: number
  children: React.ReactNode
  onSubmit: (data: FormData) => Promise<void>
}

export function FormWrapper({ formId, children, onSubmit }: FormWrapperProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<FormData | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkSubmissionStatus = async () => {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .eq('form_id', formId)
        .single()

      if (data) {
        setIsSubmitted(true)
        setSubmittedData(data.form_data as FormData)
      }
    }

    checkSubmissionStatus()
  }, [formId, supabase])

  if (isSubmitted && submittedData) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="mb-4">
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            Form Submitted
          </span>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Submitted Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Company Name</p>
              <p className="mt-1">{submittedData.company_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Contact Person</p>
              <p className="mt-1">{submittedData.contact_person}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Booth Number</p>
              <p className="mt-1">{submittedData.booth_number}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="mt-1">{submittedData.email}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 