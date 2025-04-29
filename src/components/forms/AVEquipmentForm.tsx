'use client'

import React, { useState, FormEvent, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import UserDataContainer from '@/components/UserDataContainer'
import { isPastDeadline, syncFormWithSupabase, checkPreviousFormSubmission } from '@/lib/forms/submitHandler'
import { PdfButton } from '@/components/ui/PdfButton'
import { User } from '@supabase/supabase-js'
import { Dispatch, SetStateAction } from 'react'
import SubmissionNotification from '@/components/ui/SubmissionNotification'

interface OrderItem {
  id: string
  description: string
  unitCost: number
  quantity: number
  image: string
}

interface AVEquipmentFormProps {
  userData?: {
    company_name: string
    booth_number: string
    contact_person?: string
    address?: string
    postcode?: string
    state?: string
    country?: string
    tel?: string
    fax?: string
    email?: string
  } | null
}

export default function AVEquipmentForm({ userData }: AVEquipmentFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<any>(null)
  const formRef = useRef<HTMLDivElement>(null)
  
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { id: '901', description: '42" LED TV', unitCost: 1000.00, quantity: 0, image: '/products/42-led-tv.jpg' },
    { id: '902', description: '55" LED TV', unitCost: 1500.00, quantity: 0, image: '/products/55-led-tv.jpg' },
    { id: '903', description: '65" LED TV', unitCost: 2000.00, quantity: 0, image: '/products/65-led-tv.jpg' },
    { id: '904', description: 'PORTABLE TV STAND', unitCost: 500.00, quantity: 0, image: '/products/tv-stand.jpg' },
  ])
  
  // Fixed security deposit amount
  const securityDeposit = 2000.00;

  // Check if form has been previously submitted
  useEffect(() => {
    const checkPreviousSubmission = async () => {
      setIsLoading(true)
      try {
        const { isSubmitted, data } = await checkPreviousFormSubmission("9", supabase)
        setFormSubmitted(isSubmitted)
        if (isSubmitted && data) {
          setSubmittedData(data.data || {})
        }
      } catch (error) {
        console.error('Error checking previous submissions:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkPreviousSubmission()
  }, [supabase])

  const handleQuantityChange = (id: string, value: number) => {
    setOrderItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, value) } : item
      )
    )
  }

  const calculateSubtotal = () => {
    // Include regular items plus security deposit
    return orderItems.reduce((sum, item) => sum + (item.unitCost * item.quantity), 0) + securityDeposit;
  }

  // Calculate subtotal (items plus security deposit)
  const subtotal = calculateSubtotal();
  
  // Calculate late charge (30% of subtotal if past deadline)
  const isLateOrder = isPastDeadline(); 
  const lateCharge = isLateOrder ? subtotal * 0.3 : 0;
  
  // Final grand total 
  const grandTotal = subtotal + lateCharge;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
      ];

      const missingFields = requiredFields.filter(field => !formData.get(field));
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      const formDataObj = {
        form_type: 9,
        company_data: {
          company_name: userData?.company_name || '',
          booth_number: userData?.booth_number || '',
          contact_person: userData?.contact_person || '',
          email: userData?.email || '',
          tel: userData?.tel || '',
          fax: userData?.fax || '',
          address: userData?.address || '',
        },
        items: orderItems
          .filter(item => item.quantity > 0)
          .map(item => ({
            id: item.id,
            description: item.description,
            quantity: item.quantity,
            unitCost: item.unitCost,
            total: item.unitCost * item.quantity
          })),
        subtotal: subtotal,
        security_deposit: securityDeposit,
        late_charge: lateCharge,
        grand_total: grandTotal,
        auth_details: {
          name: formData.get('auth_name')?.toString() || userData?.contact_person || '',
          designation: formData.get('auth_designation')?.toString() || '',
          company: formData.get('auth_company')?.toString() || userData?.company_name || '',
          booth_number: formData.get('auth_booth')?.toString() || userData?.booth_number || '',
          address: formData.get('auth_address')?.toString() || userData?.address || '',
          email: formData.get('auth_email')?.toString() || userData?.email || '',
          tel: formData.get('auth_tel')?.toString() || userData?.tel || '',
          fax: formData.get('auth_fax')?.toString() || userData?.fax || '',
          signature: formData.get('auth_signature')?.toString() || '',
          date: formData.get('auth_date')?.toString() || new Date().toISOString()
        }
      }

      const result = await syncFormWithSupabase(formDataObj)
      
      if (!result.success) {
        throw new Error(result.message)
      }

      setSubmittedData(formDataObj)
      setFormSubmitted(true)
      
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

  // Handle navigation back to order forms after viewing PDF
  const handleReturnToDashboard = () => {
    router.push('/dashboard/order-forms');
  }

  return (
    <div ref={formRef} className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md">
      {/* Form Header */}
      <div className="text-center mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-2xl font-bold mb-2 text-blue-600">FORM 9</h1>
        <h2 className="text-xl font-semibold mb-4">AUDIO VISUAL EQUIPMENT</h2>
        <p className="text-gray-600 mb-2">DEADLINE: 2nd July 2025</p>
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
      ) : formSubmitted ? (
        <SubmissionNotification
          submittedData={submittedData}
          formType={9}
          containerRef={formRef}
          onReturnToDashboard={handleReturnToDashboard}
          isAlreadySubmitted={true}
          submissionDate={new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Order Table */}
          <div className="mb-8 overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">DESCRIPTION / ITEM</th>
                  <th className="border border-gray-300 px-4 py-2 text-center w-24">QTY</th>
                  <th className="border border-gray-300 px-4 py-2 text-right w-48">PRICE / UNIT (RM)</th>
                  <th className="border border-gray-300 px-4 py-2 text-right w-48">COST (RM)</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3">{item.description}</td>
                    <td className="border border-gray-300 px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                        className="w-full p-1 text-center rounded border border-gray-300"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right">{item.unitCost.toFixed(2)}</td>
                    <td className="border border-gray-300 px-4 py-3 text-right">
                      {(item.quantity * item.unitCost).toFixed(2)}
                    </td>
                  </tr>
                ))}
                {/* Security Deposit row - fixed and not editable */}
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 font-medium">Security Deposit</td>
                  <td className="border border-gray-300 px-4 py-3 text-center">1</td>
                  <td className="border border-gray-300 px-4 py-3 text-right">{securityDeposit.toFixed(2)}</td>
                  <td className="border border-gray-300 px-4 py-3 text-right">{securityDeposit.toFixed(2)}</td>
                </tr>
                {/* Subtotal row */}
                <tr>
                  <td className="border border-gray-300 px-4 py-3 text-right font-medium" colSpan={3}>
                    Subtotal (including Security Deposit)
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right font-medium">
                    {subtotal.toFixed(2)}
                  </td>
                </tr>
                {/* Late charge row - shown if applicable */}
                {isLateOrder && (
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 text-right font-medium text-amber-600" colSpan={3}>
                      Late Order Surcharge (30%)
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right font-medium text-amber-600">
                      {lateCharge.toFixed(2)}
                    </td>
                  </tr>
                )}
                {/* Grand Total row */}
                <tr className="bg-blue-50">
                  <td className="border border-gray-300 px-4 py-3 text-right font-bold" colSpan={3}>
                    Grand Total
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right font-bold">
                    {grandTotal.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Important Notes */}
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 pdf-exclude">
            <h3 className="font-bold text-amber-800 mb-2">Important Notes:</h3>
            <ol className="list-decimal list-inside space-y-1 text-amber-800">
              <li>All items are on rental basis.</li>
              <li>Late order: 30% penalty fee will be charged for any late orders received after the deadline, while orders received on site will be subject to a 50% surcharge.</li>
              <li>Any cancellation before/on 2nd July 2025 will be charged 50% on the item priced, 100% cancellation fee will be charged for order cancelled after 2nd July 2025</li>
              <li>All payments are to be in favour of BLUE CIRCLE PLUS SDN. BHD. and must be accompanied by this Order Form. All bank charges must be borne by remitter. Bank Details: CIMB BANK BERHAD (Sri Damansara Branch) B-G-8, Block B, Ativo Plaza, Persiaran Perdana, Bandar Sri Damansara, 52200 Kuala Lumpur, Malaysia. Bank Account No: 800 908 5824. Bank Swift Code: CIBBMYKL</li>
            </ol>
          </div>
          
          {/* Authorization Section */}
          <div className="mb-8">
            <h4 className="font-bold mb-6 text-center">AUTHORIZATION</h4>
            <p className="text-center mb-6 pdf-exclude">Please retain a copy for your record & return this form via email to:</p>
            
            <div className="text-center mb-8 pdf-exclude">
              <h5 className="font-bold mb-2">BLUE CIRCLE PLUS SDN BHD</h5>
              <p className="mb-1">Attn: Mr. Francis Chan / Ms. YJ Hoh</p>
              <p className="mb-1">Email: francis@bcpgroup.com.my</p>
              <p className="mb-1">or yijie@bcpgroup.com.my</p>
              <p>Tel: +6011-2327 9795 / +6016-263 1150</p>
            </div>

            <div className="border-2 p-6 rounded-lg">
              <h5 className="font-bold mb-4">Authorized Representative Applying:</h5>
              <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input 
                      type="text" 
                      name="auth_name" 
                      className="w-full border-2 rounded p-2" 
                      defaultValue={userData?.contact_person || ''}
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Designation</label>
                    <input 
                      type="text" 
                      name="auth_designation" 
                      className="w-full border-2 rounded p-2" 
                      required 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <input 
                    type="text" 
                    name="auth_company"
                    className="w-full border-2 rounded p-2"
                    defaultValue={userData?.company_name || ''}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Booth No</label>
                  <input 
                    type="text" 
                    name="auth_booth"
                    className="w-full border-2 rounded p-2"
                    defaultValue={userData?.booth_number || ''}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <textarea 
                    name="auth_address" 
                    className="w-full border-2 rounded p-2" 
                    rows={3}
                    defaultValue={userData?.address || ''}
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tel</label>
                    <input 
                      type="tel" 
                      name="auth_tel" 
                      className="w-full border-2 rounded p-2" 
                      defaultValue={userData?.tel || ''}
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Fax</label>
                    <input 
                      type="tel" 
                      name="auth_fax" 
                      className="w-full border-2 rounded p-2"
                      defaultValue={userData?.fax || ''} 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input 
                    type="email" 
                    name="auth_email" 
                    className="w-full border-2 rounded p-2" 
                    defaultValue={userData?.email || ''}
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Signature</label>
                    <input 
                      type="text" 
                      name="auth_signature" 
                      className="w-full border-2 rounded p-2" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <input 
                      type="date" 
                      name="auth_date" 
                      className="w-full border-2 rounded p-2"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      required 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-center space-x-6 pdf-exclude">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-3 border-2 border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
} 