'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import UserDataContainer from '@/components/UserDataContainer'
import { syncFormWithSupabase, checkPreviousFormSubmission } from '@/lib/forms/submitHandler'
import { PdfButton } from '../ui/PdfButton'
import Link from 'next/link'
import FormDisclaimer from '@/components/ui/FormDisclaimer'

interface OrderItem {
  id: string
  description: string
  dimension: string
  unitCost: number
  quantity: number
  image: string
}

interface FurnitureOrderFormProps {
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

export default function FurnitureOrderForm({ userData }: FurnitureOrderFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const formRef = useRef<HTMLFormElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<any>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { id: '201', description: 'Information Desk', dimension: '1030 x 540 x 760 mm', unitCost: 80.00, quantity: 0, image: '/products/info-desk.jpg' },
    { id: '202', description: 'Lockable Cupboard', dimension: '1030 x 540 x 760mm H', unitCost: 115.00, quantity: 0, image: '/products/lockable-cupboard.jpg' },
    { id: '203', description: 'Low Round Table', dimension: '800Ø x 750 mm H', unitCost: 130.00, quantity: 0, image: '/products/low-round-table.jpg' },
    { id: '204', description: 'Tall Round Table', dimension: '600Ø x 1000 mm H', unitCost: 150.00, quantity: 0, image: '/products/tall-round-table.jpg' },
    { id: '205', description: 'Oscar Bar Stool', dimension: '440Ø x 440 x 1210 mm H', unitCost: 115.00, quantity: 0, image: '/products/bar-stool.jpg' },
    { id: '206', description: 'Folding Chair', dimension: '450 x 400 x 770 mm', unitCost: 30.00, quantity: 0, image: '/products/folding-chair.jpg' },
    { id: '207', description: 'Brochure Rack Zig Zag', dimension: '320 x 600 x 1380mm H', unitCost: 170.00, quantity: 0, image: '/products/brochure-rack.jpg' },
    { id: '208', description: 'Shelf (Slope flat) please indicate', dimension: '1000 x 310 mm', unitCost: 60.00, quantity: 0, image: '/products/shelf.jpg' },
    { id: '209', description: 'Discussion Table Crystal D3', dimension: '900Ø x 760 mm H', unitCost: 150.00, quantity: 0, image: '/products/discussion-table.jpg' },
    { id: '210', description: 'Curved Chair', dimension: '470 x 400 x 800mm H', unitCost: 90.00, quantity: 0, image: '/products/curved-chair.jpg' },
    { id: '211', description: 'Glass Top Coffee Table', dimension: '600 x 600 x 520mm H', unitCost: 100.00, quantity: 0, image: '/products/coffee-table.jpg' },
    { id: '212', description: 'Sofa Black', dimension: '740 x 740 x 750 mm H', unitCost: 250.00, quantity: 0, image: '/products/sofa-black.jpg' },
    { id: '213', description: 'Black Leather Arm Chair', dimension: '560 x 560 x 760 mm H', unitCost: 80.00, quantity: 0, image: '/products/arm-chair.jpg' },
    { id: '214', description: 'Square Table', dimension: '600 x 600 x 760 mm H', unitCost: 130.00, quantity: 0, image: '/products/square-table.jpg' },
    { id: '216', description: 'Low Display Cube', dimension: '500 x 500 x 500 mm H', unitCost: 95.00, quantity: 0, image: '/products/low-cube.jpg' },
    { id: '217', description: 'High Display Cube', dimension: '500 x 500 x 760 mm H', unitCost: 120.00, quantity: 0, image: '/products/high-cube.jpg' },
    { id: '218', description: 'Refrigerator (Medium)', dimension: '490 x 540 x 825 mm H', unitCost: 450.00, quantity: 0, image: '/products/refrigerator-medium.jpg' },
    { id: '219', description: 'Refrigerator (Small)', dimension: '439 x 470 x 510 mm H', unitCost: 300.00, quantity: 0, image: '/products/refrigerator-small.jpg' },
    { id: '220', description: 'Low Showcase (c/w 1m White LED Strip)', dimension: '1030mm x 535mm x 1030mm H', unitCost: 390.00, quantity: 0, image: '/products/low-showcase.jpg' },
    { id: '221', description: 'High Showcase (c/w 2 units Downlight)', dimension: '1030mm x 535mm x 2000mm H', unitCost: 530.00, quantity: 0, image: '/products/high-showcase.jpg' },
    { id: '222', description: 'AMES Discussion Table', dimension: '800 x 800 x 750 mm H', unitCost: 125.00, quantity: 0, image: '/products/ames-table.jpg' },
    { id: '223', description: 'Wooden Leg Chair (White/Black)', dimension: '470 x 420 x 820 mm H', unitCost: 75.00, quantity: 0, image: '/products/wooden-leg-chair.jpg' },
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
            .eq('form_type', '4')
            .maybeSingle()
            
          if (error) {
            console.error('Error checking previous submission:', error)
          } else if (data && typeof data.data === 'object' && data.data !== null) {
            setSubmitted(true)
            setSubmittedData(data.data)
            // Update order items with submitted quantities
            const formData = data.data as { items?: Array<{ id: string; quantity: number }> }
            if (formData.items && Array.isArray(formData.items)) {
              setOrderItems(prevItems => 
                prevItems.map(item => {
                  const submittedItem = formData.items?.find(i => i.id === item.id)
                  return submittedItem ? { ...item, quantity: submittedItem.quantity } : item
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

  const handleQuantityChange = (id: string, value: number) => {
    setOrderItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, value) } : item
      )
    )
  }

  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.unitCost * item.quantity), 0)
  }

  const subtotal = calculateSubtotal()
  const isLateOrder = new Date() > new Date('2025-06-30')
  const lateCharge = isLateOrder ? subtotal * 0.3 : 0
  const grandTotal = subtotal + lateCharge

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
        form_type: 4,
        company_data: {
          company_name: userData?.company_name || '',
          booth_number: userData?.booth_number || '',
          contact_person: userData?.contact_person || '',
          email: userData?.email || '',
          tel: userData?.tel || '',
          tax_identification_number: userData?.tax_identification_number || '',
          address: userData?.address || '',
        },
        items: orderItems
          .filter(item => item.quantity > 0)
          .map(item => ({
            id: item.id,
            description: item.description,
            dimension: item.dimension,
            quantity: item.quantity,
            unitCost: item.unitCost,
            total: item.unitCost * item.quantity
          })),
        subtotal,
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
          <h1 className="text-2xl font-bold mb-2 text-blue-600">FORM 4</h1>
          <h2 className="text-xl font-semibold mb-4">FURNITURE ORDER FORM</h2>
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

            {/* Display submitted order details in read-only mode */}
            <div className="mb-8 overflow-x-auto">
              <h3 className="text-lg font-semibold mb-4">Submitted Details:</h3>
              <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-300 p-2 text-left">NO</th>
                    <th className="border border-gray-300 p-2 text-left">IMAGE</th>
                    <th className="border border-gray-300 p-2 text-left">DESCRIPTION OF SERVICE / ITEMS</th>
                    <th className="border border-gray-300 p-2 text-left">DIMENSION (L x W x H)</th>
                    <th className="border border-gray-300 p-2 text-right">UNIT COST (RM)</th>
                    <th className="border border-gray-300 p-2 text-center">QTY</th>
                    <th className="border border-gray-300 p-2 text-right">COST (RM)</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems
                    .filter(item => item.quantity > 0)
                    .map((item) => (
                      <tr key={item.id}>
                        <td className="border border-gray-300 p-2">{item.id}</td>
                        <td className="border border-gray-300 p-2 relative">
                          <div className="relative group w-14 h-14">
                            <img 
                              src={item.image} 
                              alt={item.description}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.src = "https://via.placeholder.com/100x100?text=No+Image"
                                e.currentTarget.onerror = null
                              }}
                            />
                          </div>
                        </td>
                        <td className="border border-gray-300 p-2">{item.description}</td>
                        <td className="border border-gray-300 p-2">{item.dimension}</td>
                        <td className="border border-gray-300 p-2 text-right">{item.unitCost.toFixed(2)}</td>
                        <td className="border border-gray-300 p-2 text-center">{item.quantity}</td>
                        <td className="border border-gray-300 p-2 text-right">
                          {(item.unitCost * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                  ))}
                  <tr>
                    <td colSpan={5} className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2 text-right font-medium">Subtotal:</td>
                    <td className="border border-gray-300 p-2 text-right">{subtotal.toFixed(2)}</td>
                  </tr>
                  {lateCharge > 0 && (
                    <tr>
                      <td colSpan={5} className="border border-gray-300 p-2 text-center italic text-sm text-gray-600">
                        A SURCHARGE OF 30% will be imposed for orders received after 30th June 2025.
                      </td>
                      <td className="border border-gray-300 p-2 text-right font-medium">Late Charge (30%):</td>
                      <td className="border border-gray-300 p-2 text-right">{lateCharge.toFixed(2)}</td>
                    </tr>
                  )}
                  <tr className="font-bold">
                    <td colSpan={5} className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2 text-right">Total Amount:</td>
                    <td className="border border-gray-300 p-2 text-right">{grandTotal.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <FormDisclaimer />

            <div className="flex justify-center space-x-6">
              <PdfButton
                formData={{
                  form_type: 4,
                  company_data: submittedData?.company_data || {},
                  items: submittedData?.items || [],
                  subtotal: submittedData?.subtotal || 0,
                  late_charge: submittedData?.late_charge || 0,
                  grand_total: submittedData?.grand_total || 0,
                  auth_details: submittedData?.auth_details || {}
                }}
                formType={4}
                containerRef={containerRef}
                className="px-8 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
              />
              <Link
                href="/"
                className="px-8 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors print:hidden"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8" ref={formRef}>
            {/* Instructions */}
            <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
              <p>This form must be completed and returned by every exhibitor. If service is not required, please endorse "NOT APPLICABLE" and return this form to the address below.</p>
              <p className="font-bold">*ORDER ONLY YOUR ADDITIONAL REQUIREMENTS.</p>
            </div>

            {/* Order Table */}
            <div className="mb-8 overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-300 p-2 text-left">NO</th>
                    <th className="border border-gray-300 p-2 text-left">IMAGE</th>
                    <th className="border border-gray-300 p-2 text-left">DESCRIPTION OF SERVICE / ITEMS</th>
                    <th className="border border-gray-300 p-2 text-left">DIMENSION (L x W x H)</th>
                    <th className="border border-gray-300 p-2 text-right">UNIT COST (RM)</th>
                    <th className="border border-gray-300 p-2 text-center">QTY</th>
                    <th className="border border-gray-300 p-2 text-right">COST (RM)</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item.id}>
                      <td className="border border-gray-300 p-2">{item.id}</td>
                      <td className="border border-gray-300 p-2 relative">
                        <div className="relative group w-14 h-14 cursor-pointer">
                          <img 
                            src={item.image} 
                            alt={item.description}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              // Fall back to a generic image or placeholder if the image fails to load
                              e.currentTarget.src = "https://via.placeholder.com/100x100?text=No+Image"
                              e.currentTarget.onerror = null // Prevent infinite fallback loop
                            }}
                          />
                          <div className="absolute top-0 left-0 w-0 h-0 bg-white opacity-0 group-hover:opacity-100 group-hover:w-48 group-hover:h-48 transition-all duration-200 z-10 overflow-hidden rounded shadow-lg">
                            <img 
                              src={item.image} 
                              alt={item.description} 
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                // Fall back to a generic image or placeholder if the image fails to load
                                e.currentTarget.src = "https://via.placeholder.com/200x200?text=No+Image"
                                e.currentTarget.onerror = null // Prevent infinite fallback loop
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">{item.description}</td>
                      <td className="border border-gray-300 p-2">{item.dimension}</td>
                      <td className="border border-gray-300 p-2 text-right">{item.unitCost.toFixed(2)}</td>
                      <td className="border border-gray-300 p-2">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                          className="w-20 text-center border border-gray-300 rounded p-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mx-auto"
                        />
                      </td>
                      <td className="border border-gray-300 p-2 text-right">
                        {(item.unitCost * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={5} className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2 text-right font-medium">Subtotal:</td>
                    <td className="border border-gray-300 p-2 text-right">{subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={5} className="border border-gray-300 p-2 text-center italic">
                      A SURCHARGE OF 30% will be imposed for orders received after 30th June 2025.
                    </td>
                    <td className="border border-gray-300 p-2 text-right font-medium">Late Charge (30%):</td>
                    <td className="border border-gray-300 p-2 text-right">{lateCharge.toFixed(2)}</td>
                  </tr>
                  <tr className="font-bold">
                    <td colSpan={5} className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2 text-right">Total Amount:</td>
                    <td className="border border-gray-300 p-2 text-right">{grandTotal.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Important Notes */}
            <div className="mb-8 bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-700 mb-4">PLEASE NOTE:</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>All items are on rental basis.</li>
                <li>A <strong>SURCHARGE OF 30%</strong> will be imposed for orders received after 30th June 2025.</li>
                <li>A <strong>SURCHARGE OF 50%</strong> will be imposed for orders received on site or on-site alteration/relocation, and is subject to availability.</li>
                <li>All payments are to be in favour of BLUE CIRCLE PLUS SDN. BHD. and must be accompanied by this Order Form. All bank charges must be borne by remitter. Bank Details: CIMB BANK BERHAD (Sri Damansara Branch) B-G-3, Blok B, Plaza Ativo, Persiaran Perdana, Bandar Sri Damansara, 52200 Kuala Lumpur, Malaysia. Bank Account No: 800 984924. Bank Swift Code: CIBBMYKL</li>
              </ol>
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

            {/* Footer */}
            <div className="text-center text-sm text-gray-600 mt-8 pt-4 border-t border-gray-200">
              <p>All data collected will be used solely for this event and marketing purposes.</p>
            </div>
          </form>
        )}
      </div>
    </div>
  )
} 