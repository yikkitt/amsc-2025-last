'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import UserDataContainer from '@/components/UserDataContainer'
import { syncFormWithSupabase } from '@/lib/forms/submitHandler'
import { PdfButton } from '@/components/ui/PdfButton'
import Link from 'next/link'
import FormDisclaimer from '@/components/ui/FormDisclaimer'

interface AdminFeesFormProps {
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

export default function AdminFeesForm({ userData }: AdminFeesFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<any>(null)
  const [squareMetre, setSquareMetre] = useState('0')
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
            .eq('form_type', '7')
            .maybeSingle()
            
          if (error) {
            console.error('Error checking previous submission:', error)
          } else if (data && typeof data.data === 'object' && data.data !== null) {
            setSubmitted(true)
            setSubmittedData(data.data)
            // Update square metre with submitted data
            const formData = data.data as { square_metre?: number }
            if (formData.square_metre) {
              setSquareMetre(formData.square_metre.toString())
            }
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

  const calculateAmount = (sqm: number) => {
    return sqm * 50.00 // RM 50.00 per square metre
  }

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

      const sqm = parseFloat(squareMetre) || 0
      if (sqm <= 0) {
        throw new Error('Please enter a valid square metre value greater than 0')
      }

      const formDataObj = {
        form_type: 7,
        company_data: {
          company_name: userData?.company_name || '',
          booth_number: userData?.booth_number || '',
          contact_person: userData?.contact_person || '',
          email: userData?.email || '',
          tel: userData?.tel || '',
          tax_identification_number: userData?.tax_identification_number || '',
          address: userData?.address || '',
        },
        square_metre: sqm,
        items: [
          {
            description: "Administration Fee to Construct / Decorate Special Design Stand (Non-Refundable)",
            quantity: 1,
            unitCost: 50.00,
            price_per_sqm: 50.00,
            square_metre: sqm,
            total: calculateAmount(sqm)
          }
        ],
        grand_total: calculateAmount(sqm),
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
          <h1 className="text-2xl font-bold mb-2 text-blue-600">FORM 7</h1>
          <h2 className="text-xl font-semibold mb-4">ADMINISTRATION FEE FORM</h2>
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
            <div className="mb-8 overflow-x-auto">
              <h4 className="font-semibold text-blue-700 mb-4">Submitted Details:</h4>
              <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-300 p-2 text-left">Description</th>
                    <th className="border border-gray-300 p-2 text-center">Square Metre</th>
                    <th className="border border-gray-300 p-2 text-right">Price per SQM (RM)</th>
                    <th className="border border-gray-300 p-2 text-right">Total (RM)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">Administration Fee to Construct / Decorate Special Design Stand (Non-Refundable)</td>
                    <td className="border border-gray-300 p-2 text-center">{squareMetre}</td>
                    <td className="border border-gray-300 p-2 text-right">50.00</td>
                    <td className="border border-gray-300 p-2 text-right">{calculateAmount(parseFloat(squareMetre)).toFixed(2)}</td>
                  </tr>
                  <tr className="font-bold">
                    <td colSpan={3} className="border border-gray-300 p-2 text-right">Total Amount:</td>
                    <td className="border border-gray-300 p-2 text-right">{calculateAmount(parseFloat(squareMetre)).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <FormDisclaimer />

            <div className="flex justify-center space-x-6">
              <PdfButton
                formData={submittedData || {}}
                formType={7}
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
            <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
              <p>This form must be completed and returned by every exhibitor with special design booth.</p>
            </div>

            {/* Order Details */}
            <div className="mb-8">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Square Metre (SQM)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={squareMetre}
                    onChange={(e) => setSquareMetre(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mb-8 overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-300 p-2 text-left">Description</th>
                    <th className="border border-gray-300 p-2 text-center">Square Metre</th>
                    <th className="border border-gray-300 p-2 text-right">Price per SQM (RM)</th>
                    <th className="border border-gray-300 p-2 text-right">Total (RM)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">Administration Fee to Construct / Decorate Special Design Stand (Non-Refundable)</td>
                    <td className="border border-gray-300 p-2 text-center">{squareMetre}</td>
                    <td className="border border-gray-300 p-2 text-right">50.00</td>
                    <td className="border border-gray-300 p-2 text-right">{calculateAmount(parseFloat(squareMetre)).toFixed(2)}</td>
                  </tr>
                  <tr className="font-bold">
                    <td colSpan={3} className="border border-gray-300 p-2 text-right">Total Amount:</td>
                    <td className="border border-gray-300 p-2 text-right">{calculateAmount(parseFloat(squareMetre)).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Important Notes */}
            <div className="mb-8 bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-700 mb-4">Important Notes:</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>All payments are to be in favour of BLUE CIRCLE PLUS SDN. BHD. and must be accompanied by this Order Form.</li>
                <li>All bank charges must be borne by remitter.</li>
                <li>Bank Details: CIMB BANK BERHAD (Sri Damansara Branch) B-G-3, Blok B, Plaza Ativo, Persiaran Perdana, Bandar Sri Damansara, 52200 Kuala Lumpur, Malaysia.</li>
                <li>Bank Account No: 800 984924</li>
                <li>Bank Swift Code: CIBBMYKL</li>
              </ol>
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