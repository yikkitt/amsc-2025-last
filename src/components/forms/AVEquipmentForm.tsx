'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import UserDataContainer from '@/components/UserDataContainer'
import { syncFormWithSupabase } from '@/lib/forms/submitHandler'
import { PdfButton } from '@/components/ui/PdfButton'
import Link from 'next/link'
import FormDisclaimer from '@/components/ui/FormDisclaimer'

interface AVEquipmentItem {
  id: number
  name: string
  unit: string
  rate: number
  quantity: number
  total: number
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
    tax_identification_number?: string
    email?: string
    designation?: string
  } | null
}

export default function AVEquipmentForm({ userData }: AVEquipmentFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<any>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [orderItems, setOrderItems] = useState<AVEquipmentItem[]>([
    { id: 1, name: 'LCD TV 42"', unit: 'unit', rate: 800, quantity: 0, total: 0 },
    { id: 2, name: 'LCD TV 50"', unit: 'unit', rate: 1000, quantity: 0, total: 0 },
    { id: 3, name: 'LCD TV 65"', unit: 'unit', rate: 1500, quantity: 0, total: 0 },
    { id: 4, name: 'LCD TV 75"', unit: 'unit', rate: 2000, quantity: 0, total: 0 },
    { id: 5, name: 'LCD TV 85"', unit: 'unit', rate: 2500, quantity: 0, total: 0 },
    { id: 6, name: 'TV Stand', unit: 'unit', rate: 200, quantity: 0, total: 0 }
  ])

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
            .eq('form_type', '9')
            .maybeSingle()
            
          if (error) {
            console.error('Error checking previous submission:', error)
          } else if (data && typeof data.data === 'object' && data.data !== null) {
            setSubmitted(true)
            setSubmittedData(data.data)
            // Update order items with submitted quantities
            if (data.data.order_items) {
              setOrderItems(prevItems => 
                prevItems.map(item => {
                  const submittedItem = data.data.order_items.find((si: AVEquipmentItem) => si.id === item.id)
                  if (submittedItem) {
                    return {
                      ...item,
                      quantity: submittedItem.quantity,
                      total: submittedItem.quantity * item.rate
                    }
                  }
                  return item
                })
              )
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

  const handleQuantityChange = (id: number, value: number) => {
    setOrderItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity: value, total: value * item.rate }
          : item
      )
    )
  }

  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + item.total, 0)
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

      // Check if at least one item is ordered
      const hasOrders = orderItems.some(item => item.quantity > 0)
      if (!hasOrders) {
        throw new Error('Please order at least one item')
      }

      const formDataObj = {
        form_type: 9,
        company_data: {
          company_name: userData?.company_name || '',
          booth_number: userData?.booth_number || '',
          contact_person: userData?.contact_person || '',
          email: userData?.email || '',
          tel: userData?.tel || '',
          tax_identification_number: userData?.tax_identification_number || '',
          address: userData?.address || '',
        },
        order_items: orderItems.filter(item => item.quantity > 0),
        subtotal: calculateSubtotal(),
        auth_details: {
          name: formData.get('auth_name')?.toString() || userData?.contact_person || '',
          designation: formData.get('auth_designation')?.toString() || userData?.designation || '',
          company: formData.get('auth_company')?.toString() || userData?.company_name || '',
          booth_number: formData.get('auth_booth')?.toString() || userData?.booth_number || '',
          address: formData.get('auth_address')?.toString() || userData?.address || '',
          email: formData.get('auth_email')?.toString() || userData?.email || '',
          tel: formData.get('auth_tel')?.toString() || userData?.tel || '',
          tax_identification_number: formData.get('auth_tax_identification_number')?.toString() || userData?.tax_identification_number || '',
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
          <h1 className="text-2xl font-bold mb-2 text-blue-600">FORM 9</h1>
          <h2 className="text-xl font-semibold mb-4">AV EQUIPMENT ORDER FORM</h2>
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
              
              {/* Order Items Table */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="border border-gray-300 p-2 text-left">Item</th>
                      <th className="border border-gray-300 p-2 text-center">Unit</th>
                      <th className="border border-gray-300 p-2 text-center">Rate (RM)</th>
                      <th className="border border-gray-300 p-2 text-center">Quantity</th>
                      <th className="border border-gray-300 p-2 text-center">Total (RM)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submittedData?.order_items?.map((item: AVEquipmentItem) => (
                      <tr key={item.id} className="border-b">
                        <td className="border border-gray-300 p-2">{item.name}</td>
                        <td className="border border-gray-300 p-2 text-center">{item.unit}</td>
                        <td className="border border-gray-300 p-2 text-center">{item.rate.toFixed(2)}</td>
                        <td className="border border-gray-300 p-2 text-center">{item.quantity}</td>
                        <td className="border border-gray-300 p-2 text-center">{item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="font-bold">
                      <td colSpan={4} className="border border-gray-300 p-2 text-right">Subtotal:</td>
                      <td className="border border-gray-300 p-2 text-center">
                        {submittedData?.subtotal?.toFixed(2) || '0.00'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Authorization Details */}
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Authorized By:</p>
                  <p>{submittedData?.auth_details?.name}</p>
                </div>
                <div>
                  <p className="font-medium">Designation:</p>
                  <p>{submittedData?.auth_details?.designation}</p>
                </div>
                <div>
                  <p className="font-medium">Company:</p>
                  <p>{submittedData?.auth_details?.company}</p>
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
                formData={{
                  form_type: 9,
                  company_data: submittedData?.company_data || {},
                  order_items: submittedData?.order_items || [],
                  subtotal: submittedData?.subtotal || 0,
                  auth_details: submittedData?.auth_details || {}
                }}
                formType={9}
                containerRef={containerRef as React.RefObject<HTMLElement>}
                className="px-8 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
              />
              <Link
                href="/"
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
              <p>Please complete this form for ordering AV equipment for your booth.</p>
              <p>Note:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>All prices are in Malaysian Ringgit (RM)</li>
                <li>Prices are for the entire duration of the exhibition</li>
                <li>All equipment will be installed and tested before the exhibition</li>
                <li>Technical support will be available during the exhibition hours</li>
                <li>Late orders may be subject to availability and additional charges</li>
              </ul>
            </div>

            {/* Order Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-300 p-2 text-left">Item</th>
                    <th className="border border-gray-300 p-2 text-center">Unit</th>
                    <th className="border border-gray-300 p-2 text-center">Rate (RM)</th>
                    <th className="border border-gray-300 p-2 text-center">Quantity</th>
                    <th className="border border-gray-300 p-2 text-center">Total (RM)</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map(item => (
                    <tr key={item.id} className={item.quantity > 0 ? 'bg-gray-50' : 'text-gray-400'}>
                      <td className="border border-gray-300 p-2">{item.name}</td>
                      <td className="border border-gray-300 p-2 text-center">{item.unit}</td>
                      <td className="border border-gray-300 p-2 text-center">{item.rate.toFixed(2)}</td>
                      <td className="border border-gray-300 p-2 text-center">
                        <input
                          type="number"
                          min="0"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                          className="w-16 text-center border border-gray-300 rounded p-1"
                        />
                      </td>
                      <td className="border border-gray-300 p-2 text-center">{item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td colSpan={4} className="border border-gray-300 p-2 text-right">Subtotal:</td>
                    <td className="border border-gray-300 p-2 text-center">{calculateSubtotal().toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
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
                        defaultValue={userData?.designation || ''}
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