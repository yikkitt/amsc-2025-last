'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import UserDataContainer from '@/components/UserDataContainer'
import { syncFormWithSupabase } from '@/lib/forms/submitHandler'
import { PdfButton } from '@/components/ui/PdfButton'
import Link from 'next/link'

interface OrderItem {
  id: string
  description: string
  printableSize: string
  unitPrice: number
  quantity: number
  image: string
  unit: string
}

interface PrintingOrderFormProps {
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

export default function PrintingOrderForm({ userData }: PrintingOrderFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<any>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const supabase = getSupabaseBrowserClient()
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { id: '301', description: 'Digital Inkjet Print on Internal System Panel - Poles will be visible', printableSize: '950mm x 2350mmH', unitPrice: 450, quantity: 0, image: '/products/digital-inkjet.jpg', unit: 'panel' },
    { id: '302', description: 'Digital Print on Compressed Foam Panel - Poles will not be visible', printableSize: '1000mm x 2440mmH', unitPrice: 550, quantity: 0, image: '/products/compressed-foam.jpg', unit: 'panel' },
    { id: '303', description: 'Inkjet Sticker on Information Desk', printableSize: 'Front: 950mm x 670mmH', unitPrice: 350, quantity: 0, image: '/products/inkjet-desk.jpg', unit: 'pc' },
    { id: '304', description: 'Compress Foam on Information Desk', printableSize: 'Front: 1030mm x 750mmH\nSide: 535mm x 750mmH', unitPrice: 500, quantity: 0, image: '/products/foam-desk.jpg', unit: 'set' },
    { id: '305', description: 'Inkjet Sticker on Low Showcase', printableSize: '950mm x 950mmH', unitPrice: 350, quantity: 0, image: '/products/inkjet-showcase.jpg', unit: 'pc' },
    { id: '306', description: 'Inkjet Sticker on High Showcase', printableSize: 'Front: 950mm x 890mmH\nTop: 950mm x 2100mmH', unitPrice: 550, quantity: 0, image: '/products/inkjet-high-showcase.jpg', unit: 'pc' },
    { id: '307', description: 'Inkjet Sticker on Curve Counter', printableSize: '1533mm x 890mmH', unitPrice: 500, quantity: 0, image: '/products/inkjet-curve.jpg', unit: 'pc' },
    { id: '308', description: 'Pull-up Banner with Aluminium Stand', printableSize: '800mm x 2000mmH', unitPrice: 400, quantity: 0, image: '/products/pullup-banner.jpg', unit: 'pc' },
  ])

  // Check if form has been previously submitted
  useEffect(() => {
    const checkPreviousSubmission = async () => {
      setIsLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const { data, error } = await supabase
            .from('forms')
            .select('*')
            .eq('user_id', user.id)
            .eq('form_type', '5')
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
    
    checkPreviousSubmission()
  }, [supabase])

  const handleQuantityChange = (id: string, value: number) => {
    setOrderItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, value) } : item
      )
    )
  }

  const calculateSubTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)
  }

  const calculateSurcharge = () => {
    // 30% surcharge for late orders
    return calculateSubTotal() * 0.3
  }

  const calculateGrandTotal = () => {
    return calculateSubTotal() + calculateSurcharge()
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
      ];

      const missingFields = requiredFields.filter(field => !formData.get(field));
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      const formDataObj = {
        form_type: 5,
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
            printableSize: item.printableSize,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            total: item.unitPrice * item.quantity
          })),
        subtotal: calculateSubTotal(),
        late_charge: calculateSurcharge(),
        grand_total: calculateGrandTotal(),
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
          <h1 className="text-2xl font-bold mb-2 text-blue-600">FORM 5</h1>
          <h2 className="text-xl font-semibold mb-4">PRINTING ORDER FORM</h2>
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
        ) : submitted ? (
          <div>
            {/* Order Table - Read Only */}
            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-300 p-2 text-left">CODE</th>
                    <th className="border border-gray-300 p-2 text-left">IMAGE</th>
                    <th className="border border-gray-300 p-2 text-left">ITEMS</th>
                    <th className="border border-gray-300 p-2 text-left">PRINTABLE SIZE</th>
                    <th className="border border-gray-300 p-2 text-right">UNIT PRICE (MYR)</th>
                    <th className="border border-gray-300 p-2 text-center">QTY</th>
                    <th className="border border-gray-300 p-2 text-right">TOTAL PRICE (MYR)</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item.id}>
                      <td className="border border-gray-300 p-2">{item.id}</td>
                      <td className="border border-gray-300 p-2 relative">
                        <div className="relative group w-14 h-14">
                          <img 
                            src={item.image} 
                            alt={item.description}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">{item.description}</td>
                      <td className="border border-gray-300 p-2 whitespace-pre-line">{item.printableSize}</td>
                      <td className="border border-gray-300 p-2 text-right">{item.unitPrice.toFixed(2)}/{item.unit}</td>
                      <td className="border border-gray-300 p-2 text-center">{item.quantity}</td>
                      <td className="border border-gray-300 p-2 text-right">
                        {(item.unitPrice * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={6} className="border border-gray-300 p-2 text-right font-bold">Sub Total</td>
                    <td className="border border-gray-300 p-2 text-right">{calculateSubTotal().toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={5} className="border border-gray-300 p-2 text-center italic text-sm text-gray-600">
                      Order made after deadline is subjected to 50% surcharge
                    </td>
                    <td className="border border-gray-300 p-2 text-right font-medium">Surcharge (50%):</td>
                    <td className="border border-gray-300 p-2 text-right">{calculateSurcharge().toFixed(2)}</td>
                  </tr>
                  <tr className="font-bold">
                    <td colSpan={6} className="border border-gray-300 p-2 text-right">Grand Total</td>
                    <td className="border border-gray-300 p-2 text-right">{calculateGrandTotal().toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 space-y-4">
              <div className="text-green-600 font-medium">Form submitted successfully!</div>
              <div className="flex gap-4">
                <PdfButton
                  formData={submittedData}
                  formType={5}
                  containerRef={containerRef}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Download PDF
                </PdfButton>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8" ref={formRef}>
            {/* Order Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-300 p-2 text-left">CODE</th>
                    <th className="border border-gray-300 p-2 text-left">IMAGE</th>
                    <th className="border border-gray-300 p-2 text-left">ITEMS</th>
                    <th className="border border-gray-300 p-2 text-left">PRINTABLE SIZE</th>
                    <th className="border border-gray-300 p-2 text-right">UNIT PRICE (MYR)</th>
                    <th className="border border-gray-300 p-2 text-center">QTY</th>
                    <th className="border border-gray-300 p-2 text-right">TOTAL PRICE (MYR)</th>
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
                              e.currentTarget.src = "https://via.placeholder.com/100x100?text=No+Image";
                              e.currentTarget.onerror = null; // Prevent infinite fallback loop
                            }}
                          />
                          <div className="absolute top-0 left-0 w-0 h-0 bg-white opacity-0 group-hover:opacity-100 group-hover:w-48 group-hover:h-48 transition-all duration-200 z-10 overflow-hidden rounded shadow-lg">
                            <img 
                              src={item.image} 
                              alt={item.description} 
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                // Fall back to a generic image or placeholder if the image fails to load
                                e.currentTarget.src = "https://via.placeholder.com/200x200?text=No+Image";
                                e.currentTarget.onerror = null; // Prevent infinite fallback loop
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-300 p-2">{item.description}</td>
                      <td className="border border-gray-300 p-2 whitespace-pre-line">{item.printableSize}</td>
                      <td className="border border-gray-300 p-2 text-right">{item.unitPrice.toFixed(2)}/{item.unit}</td>
                      <td className="border border-gray-300 p-2">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                          className="w-20 text-center border border-gray-300 rounded p-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="border border-gray-300 p-2 text-right">
                        {(item.unitPrice * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={6} className="border border-gray-300 p-2 text-right font-bold">Sub Total</td>
                    <td className="border border-gray-300 p-2 text-right">{calculateSubTotal().toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={5} className="border border-gray-300 p-2 text-center italic text-sm text-gray-600">
                      Order made after deadline is subjected to 50% surcharge
                    </td>
                    <td className="border border-gray-300 p-2 text-right font-medium">Surcharge (50%):</td>
                    <td className="border border-gray-300 p-2 text-right">{calculateSurcharge().toFixed(2)}</td>
                  </tr>
                  <tr className="font-bold">
                    <td colSpan={6} className="border border-gray-300 p-2 text-right">Grand Total</td>
                    <td className="border border-gray-300 p-2 text-right">{calculateGrandTotal().toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Please Note Section */}
            <div className="space-y-2 bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-700 mb-4">PLEASE NOTE:</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                <li>Kindly send in the final artwork in AI format / high resolution PDF as well as the same copy in JPEG for reference.</li>
                <li>All artwork must be provided 2 week before the event date.</li>
                <li>Any cancellation after the deadline will be charged 50% on the item priced. 100% cancellation fee will be charged for order cancelled after deadline.</li>
                <li>All payments are to be in favour of BLUE CIRCLE PLUS SDN. BHD. and must be accompanied by this Order Form. Bank Details: CIMB BANK BERHAD (Sri Damansara Branch) B-G-6, Blok B, Plaza Ativo, Persiaran Perdana, Bandar Sri Damansara, 52200 Kuala Lumpur, Malaysia. Bank Account No: 8010655824, Bank Swift Code: CIBBMYKL</li>
                <li>Late order: 30% surcharge will be charged for any late orders received after the deadline 30 June 2025, while orders received on site will be subject to a 50% surcharge.</li>
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
                      <label className="block text-sm font-medium mb-1 text-gray-700">Fax</label>
                      <input 
                        type="tel" 
                        name="auth_fax"
                        className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        defaultValue={userData?.fax || ''}
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