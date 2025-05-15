'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import UserDataContainer from '@/components/UserDataContainer'
import { syncFormWithSupabase } from '@/lib/forms/submitHandler'
import { PdfButton } from '@/components/ui/PdfButton'
import Link from 'next/link'
import FormDisclaimer from '@/components/ui/FormDisclaimer'

interface IndemnityLetterFormProps {
  userData?: {
    company_name: string
    booth_number: string
    contact_person?: string
    address?: string
    postcode?: string
    state?: string
    country?: string
    tel?: string
    tax_identification_number?: string
    email?: string
  } | null
}

export default function IndemnityLetterForm({ userData }: IndemnityLetterFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<any>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Check if form has been previously submitted
  useEffect(() => {
    const checkSubmission = async () => {
      setIsLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const { data, error } = await supabase
            .from('forms')
            .select('*')
            .eq('user_id', user.id)
            .eq('form_type', '8')
            .maybeSingle()
            
          if (error) {
            console.error('Error checking previous submission:', error)
          } else if (data && typeof data.data === 'object' && data.data !== null) {
            setSubmitted(true)
            setSubmittedData(data.data)
          }
        }
      } catch (error) {
        console.error('Error checking previous submissions:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkSubmission()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const formData = new FormData(e.target as HTMLFormElement)
      
      // Validate required fields
      const requiredFields = [
        'auth_name',
        'auth_designation',
        'auth_company',
        'auth_booth',
        'auth_address',
        'auth_email',
        'auth_tel'
      ]

      const missingFields = requiredFields.filter(field => !formData.get(field))
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`)
      }

      const formDataObj = {
        form_type: 8,
        company_data: {
          company_name: userData?.company_name || '',
          booth_number: userData?.booth_number || '',
          contact_person: userData?.contact_person || '',
          email: userData?.email || '',
          tel: userData?.tel || '',
          tax_identification_number: userData?.tax_identification_number || '',
          address: userData?.address || '',
        },
        auth_details: {
          name: formData.get('auth_name')?.toString() || userData?.contact_person || '',
          designation: formData.get('auth_designation')?.toString() || '',
          company: formData.get('auth_company')?.toString() || userData?.company_name || '',
          booth_number: formData.get('auth_booth')?.toString() || userData?.booth_number || '',
          address: formData.get('auth_address')?.toString() || userData?.address || '',
          email: formData.get('auth_email')?.toString() || userData?.email || '',
          tel: formData.get('auth_tel')?.toString() || userData?.tel || '',
          signature: formData.get('auth_signature')?.toString() || '',
          date: formData.get('auth_date')?.toString() || new Date().toISOString()
        }
      }

      const result = await syncFormWithSupabase(formDataObj)
      
      if (!result.success) {
        throw new Error(result.message)
      }

      setSubmittedData(formDataObj)
      setSubmitted(true)
      
      // Show success message
      alert("Form submitted successfully!")
    } catch (error) {
      console.error('Error submitting form:', error)
      let errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      // Check for specific error types from Supabase
      if (errorMessage.includes('violates not-null constraint')) {
        errorMessage = "Required form fields are missing. Please ensure all required fields are filled."
      } else if (errorMessage.includes('duplicate key')) {
        errorMessage = "You have already submitted this form. Please view your submissions in the dashboard."
      } else if (errorMessage.includes('column')) {
        errorMessage = "There was a database field mismatch. Our team has been notified and will fix this issue."
      }
      
      alert(`Error submitting form: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div ref={containerRef} className="bg-white p-6 rounded-lg shadow">
        {/* Form Header */}
        <div className="text-center mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-2xl font-bold mb-2 text-blue-600">FORM 8</h1>
          <h2 className="text-xl font-semibold mb-4">INDEMNITY LETTER</h2>
          <p className="text-gray-600 mb-2">DEADLINE: 30th June 2025</p>
          <h3 className="text-lg font-semibold mb-2">Aesthetic Medicine & Surgery Conference & Exhibition 2025</h3>
          <p className="text-gray-600">Kuala Lumpur Convention Centre</p>
        </div>

        {/* User Data Container */}
        <UserDataContainer userData={userData} />

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Checking submission status...</span>
          </div>
        ) : submitted ? (
          <div className="space-y-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-green-600 font-semibold text-lg mb-2">
                Form Successfully Submitted
              </div>
              <p className="text-gray-600">
                You have already submitted this form. You can download a PDF copy or return to the dashboard.
              </p>
            </div>

            {/* Display submitted details in read-only mode */}
            <div className="mb-8 bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-blue-700 mb-4">Submitted Details:</h4>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Company Name:</p>
                  <p>{submittedData?.company_data?.company_name}</p>
                </div>
                <div>
                  <p className="font-medium">Booth Number:</p>
                  <p>{submittedData?.company_data?.booth_number}</p>
                </div>
                <div>
                  <p className="font-medium">Authorized By:</p>
                  <p>{submittedData?.auth_details?.name}</p>
                </div>
                <div>
                  <p className="font-medium">Designation:</p>
                  <p>{submittedData?.auth_details?.designation}</p>
                </div>
                <div>
                  <p className="font-medium">Date:</p>
                  <p>{new Date(submittedData?.auth_details?.date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <FormDisclaimer />

            <div className="flex justify-center space-x-6">
              <PdfButton
                formData={submittedData || {}}
                formType={8}
                containerRef={containerRef}
                className="px-8 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
              />
              <Link
                href="/dashboard"
                className="px-8 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8" ref={formRef}>
            {/* Instructions */}
            <div className="space-y-4 text-sm bg-gray-50 p-4 rounded-lg">
              <p>This form must be completed and returned by every exhibitor with special design booth.</p>
              <p>Please read the following carefully before signing:</p>
              <div className="pl-4">
                <p>1. We hereby confirm that we have appointed and authorized the following contractor to construct our booth at the above exhibition.</p>
                <p>2. We confirm that we have read and understood the Exhibition Rules & Regulations as set out in the Exhibitor's Manual and confirm that we will comply with them.</p>
                <p>3. We further confirm that we have reminded our contractor to read and understand the Rules & Regulations and to comply with them accordingly.</p>
                <p>4. We agree that we will be fully responsible and will indemnify the Organizer and Official Contractor against any claims arising from any damage to property or injury including death to any person which may in any way be connected with the construction of our booth by our contractor or his servants or agents.</p>
                <p>5. We also agree that we will be responsible for any damages to the exhibition hall that may occur during construction, fair days and dismantling.</p>
              </div>
            </div>

            {/* Authorization Section */}
            <div className="mb-8">
              <p className="mb-6 text-center text-gray-700">Please retain a copy for your record & return this form via email to:</p>
              
              <div className="mb-8 text-center bg-gray-50 py-4 rounded-lg">
                <h5 className="font-bold text-blue-600 mb-2">BLUE CIRCLE PLUS SDN BHD</h5>
                <p className="mb-1">Attn: Mr. Francis Chan / Ms. YJ Hoh</p>
                <p className="mb-1">Email: francis@bcpgroup.com.my</p>
                <p className="mb-1">or yijie@bcpgroup.com.my</p>
                <p>Tel: +6011-2327 9795 / +6016-263 1150</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
                <h5 className="font-bold mb-4 text-blue-600">Authorized Representative Applying:</h5>
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
                      <input 
                        type="text" 
                        name="auth_name"
                        className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        defaultValue={userData?.contact_person || ''}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Designation</label>
                      <input 
                        type="text" 
                        name="auth_designation"
                        className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Company</label>
                    <input 
                      type="text" 
                      name="auth_company"
                      className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      defaultValue={userData?.company_name || ''}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Booth No</label>
                    <input 
                      type="text" 
                      name="auth_booth"
                      className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      defaultValue={userData?.booth_number || ''}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Address</label>
                    <textarea 
                      name="auth_address"
                      className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      rows={3}
                      defaultValue={userData?.address || ''}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Tel</label>
                      <input 
                        type="tel" 
                        name="auth_tel"
                        className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        defaultValue={userData?.tel || ''}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Tax Identification Number</label>
                      <input 
                        type="text" 
                        name="auth_tax_identification_number"
                        className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        defaultValue={userData?.tax_identification_number || ''}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                    <input 
                      type="email" 
                      name="auth_email"
                      className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      defaultValue={userData?.email || ''}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Signature</label>
                      <input 
                        type="text" 
                        name="auth_signature"
                        className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Date</label>
                      <input 
                        type="date" 
                        name="auth_date"
                        className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        defaultValue={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-center space-x-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Form'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
} 