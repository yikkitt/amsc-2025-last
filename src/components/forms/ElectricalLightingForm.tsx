'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import UserDataContainer from '@/components/UserDataContainer'
import { syncFormWithSupabase, checkPreviousFormSubmission } from '@/lib/forms/submitHandler'
import { PdfButton } from '@/components/ui/PdfButton'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface OrderItem {
  id: string
  description: string
  unitCost: number
  quantity: number
  image: string
  section?: string  // Optional section identifier
}

interface ElectricalLightingFormProps {
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

export default function ElectricalLightingForm({ userData }: ElectricalLightingFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<any>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const supabase = getSupabaseBrowserClient()
  
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    // SECTION A - INDIVIDUAL
    { id: '101', description: '12W LED spotlight', unitCost: 105.00, quantity: 0, image: '/products/led-spotlight.jpg', section: 'SECTION A - INDIVIDUAL' },
    { id: '102', description: '12W LED Long Arm spotlight', unitCost: 115.00, quantity: 0, image: '/products/led-long-arm.jpg', section: 'SECTION A - INDIVIDUAL' },
    { id: '103', description: '15W LED Spotlight', unitCost: 125.00, quantity: 0, image: '/products/led-spotlight-2.jpg', section: 'SECTION A - INDIVIDUAL' },
    { id: '104', description: '15W LED Long Arm Spotlight', unitCost: 135.00, quantity: 0, image: '/products/led-long-arm-2.jpg', section: 'SECTION A - INDIVIDUAL' },
    { id: '105', description: '9W LED Downlight', unitCost: 130.00, quantity: 0, image: '/products/led-downlight.jpg', section: 'SECTION A - INDIVIDUAL' },
    { id: '106', description: '40W Fluorescent Light (Full or Loose Set)', unitCost: 80.00, quantity: 0, image: '/products/fluorescent.jpg', section: 'SECTION A - INDIVIDUAL' },
    { id: '107', description: '50W LED Metal Halide Floodlight', unitCost: 300.00, quantity: 0, image: '/products/halide-50w.jpg', section: 'SECTION A - INDIVIDUAL' },
    { id: '108', description: '100W LED Metal Halide Floodlight', unitCost: 350.00, quantity: 0, image: '/products/halide-100w.jpg', section: 'SECTION A - INDIVIDUAL' },
    
    // LIGHTING CONNECTION
    { id: 'LC1', description: 'Lighting Connection with cabling (Max 100w per bulb/tube)', unitCost: 100.00, quantity: 0, image: '', section: 'LIGHTING CONNECTION' },
    { id: 'LC2', description: 'Lighting Connection for LED strip / Bulb / Tube (Max 1mL or 1 bulb / tube per connection)', unitCost: 100.00, quantity: 0, image: '', section: 'LIGHTING CONNECTION' },
    
    // POWER POINT / ISOLATOR
    { id: '109', description: '13 Amp/230V single phase power point (max 500W & not for lighting)', unitCost: 110.00, quantity: 0, image: '/products/power-point-13a.jpg', section: 'POWER POINT / ISOLATOR' },
    { id: '110', description: '13 Amp / 230V Single Phase Power Point 24 Hours usage (max 500W & not for lighting)', unitCost: 330.00, quantity: 0, image: '/products/power-point-13a-24h.jpg', section: 'POWER POINT / ISOLATOR' },
    { id: '111', description: '15 Amp/230V single phase outlet (max 2KW & not for lighting)', unitCost: 135.00, quantity: 0, image: '/products/power-point-15a.jpg', section: 'POWER POINT / ISOLATOR' },
    { id: '112', description: '15 Amp / 230V Single Phase Power Point 24 Hours usage (max 2KW & not for lighting)', unitCost: 580.00, quantity: 0, image: '/products/power-point-15a-24h.jpg', section: 'POWER POINT / ISOLATOR' },
    
    // TEMPORARY POWER SUPPLY
    { id: 'TPS1', description: '13 Amp/230V single phase power point (Temporary power supply for set up)', unitCost: 150.00, quantity: 0, image: '', section: 'TEMPORARY POWER SUPPLY' },
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
            .eq('form_type', '3')
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
  
  // Function to check if an item is the first of its section
  const isFirstInSection = (index: number): boolean => {
    if (index === 0) return true
    return orderItems[index].section !== orderItems[index - 1].section
  }

  const handleQuantityChange = (id: string, value: number) => {
    setOrderItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, value) } : item
      )
    )
  }

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.unitCost * item.quantity), 0)
  }

  // Calculate late charge (10% of subtotal) if applicable
  const isLateOrder = new Date() > new Date('2025-06-30')
  const subtotal = calculateTotal()
  const lateCharge = isLateOrder ? subtotal * 0.1 : 0
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

      const formDataObj = {
        form_type: 3,
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
            section: item.section,
            quantity: item.quantity,
            unitCost: item.unitCost,
            total: item.unitCost * item.quantity
          })),
        subtotal: calculateTotal(),
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
          <h1 className="text-2xl font-bold mb-2 text-blue-600">FORM 3</h1>
          <h2 className="text-xl font-semibold mb-4">ELECTRICAL & LIGHTING ORDER FORM</h2>
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
          <div className="space-y-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-green-600 font-semibold text-lg mb-2">
                Form Successfully Submitted
              </div>
              <p className="text-gray-600">
                You have already submitted this form. You can download a PDF copy or return to the dashboard.
              </p>
            </div>

            {/* Display submitted order items in read-only mode */}
            <div className="mb-8 overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-300 p-2 text-center">NO</th>
                    <th className="border border-gray-300 p-2 text-center">IMAGE</th>
                    <th className="border border-gray-300 p-2 text-left">DESCRIPTION OF SERVICE / ITEMS</th>
                    <th className="border border-gray-300 p-2 text-center">UNIT COST (RM)</th>
                    <th className="border border-gray-300 p-2 text-center">QTY</th>
                    <th className="border border-gray-300 p-2 text-center">COST (RM)</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item, index) => (
                    <React.Fragment key={item.id}>
                      {isFirstInSection(index) && (
                        <tr key={`section-${index}`}>
                          <td colSpan={6} className="border border-gray-300 p-2 font-bold bg-gray-50">
                            {item.section}
                            {item.section === 'SECTION A - INDIVIDUAL' && (
                              <><br /><span className="text-sm font-normal">(Inclusive of electricity consumption)</span></>
                            )}
                            {item.section === 'LIGHTING CONNECTION' && (
                              <><br /><span className="text-sm font-normal">Charges included supply electrical consumption. Wiring and maintenance are the responsibility of the contractor appointed by the Exhibitor.</span></>
                            )}
                            {item.section === 'POWER POINT / ISOLATOR' && (
                              <><br /><span className="text-sm font-normal">Equipment and fittings on hire from the official contractor: Power point are used for single machinery / electrical appliances / exhibits only. STRICTLY NOT for lighting purposes.</span></>
                            )}
                            {item.section === 'TEMPORARY POWER SUPPLY' && (
                              <><br /><span className="text-sm font-normal">(BUILD-UP ONLY)</span></>
                            )}
                          </td>
                        </tr>
                      )}
                      <tr className={item.quantity > 0 ? 'bg-gray-50' : 'text-gray-400'}>
                        <td className="border border-gray-300 p-2 text-center">{item.id}</td>
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
                        <td className="border border-gray-300 p-2 text-center">{item.unitCost.toFixed(2)}</td>
                        <td className="border border-gray-300 p-2 text-center">{item.quantity}</td>
                        <td className="border border-gray-300 p-2 text-center">
                          {(item.unitCost * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                  <tr>
                    <td colSpan={4} className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2 text-right font-medium">Subtotal:</td>
                    <td className="border border-gray-300 p-2 text-center">{subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="border border-gray-300 p-2 text-center italic">
                      A SURCHARGE OF 10% will be imposed for orders received after June 30, 2025.
                    </td>
                    <td className="border border-gray-300 p-2 text-right font-medium">Late Charge (10%):</td>
                    <td className="border border-gray-300 p-2 text-center">{lateCharge.toFixed(2)}</td>
                  </tr>
                  <tr className="font-bold">
                    <td colSpan={4} className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2 text-right">Total Amount:</td>
                    <td className="border border-gray-300 p-2 text-center">{grandTotal.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-center space-x-6">
              <PdfButton
                formData={submittedData || {}}
                formType={3}
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
              <p>1. This form must be completed and returned by every exhibitor. If service is not required, please endorse "NOT APPLICABLE" and return this form to the address below.</p>
              <p>2. ORDER ONLY YOUR ADDITIONAL REQUIREMENTS.</p>
              <p>3. For services not listed below, such as step-up/step-down transformers etc, please contact the Official Contractor for a quotation.</p>
              <p>4. The supply at REGIONAL CONFERENCE OF DERMATOLOGY is 230V 50Hz AC and 415V TPN 50Hz AC.</p>
            </div>

            {/* Order Table */}
            <div className="mb-8 overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-300 p-2 text-center">NO</th>
                    <th className="border border-gray-300 p-2 text-center">IMAGE</th>
                    <th className="border border-gray-300 p-2 text-left">DESCRIPTION OF SERVICE / ITEMS</th>
                    <th className="border border-gray-300 p-2 text-center">UNIT COST (RM)</th>
                    <th className="border border-gray-300 p-2 text-center">QTY</th>
                    <th className="border border-gray-300 p-2 text-center">COST (RM)</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item, index) => (
                    <React.Fragment key={item.id}>
                      {isFirstInSection(index) && (
                        <tr key={`section-${index}`}>
                          <td colSpan={6} className="border border-gray-300 p-2 font-bold bg-gray-50">
                            {item.section}
                            {item.section === 'SECTION A - INDIVIDUAL' && (
                              <><br /><span className="text-sm font-normal">(Inclusive of electricity consumption)</span></>
                            )}
                            {item.section === 'LIGHTING CONNECTION' && (
                              <><br /><span className="text-sm font-normal">Charges included supply electrical consumption. Wiring and maintenance are the responsibility of the contractor appointed by the Exhibitor.</span></>
                            )}
                            {item.section === 'POWER POINT / ISOLATOR' && (
                              <><br /><span className="text-sm font-normal">Equipment and fittings on hire from the official contractor: Power point are used for single machinery / electrical appliances / exhibits only. STRICTLY NOT for lighting purposes.</span></>
                            )}
                            {item.section === 'TEMPORARY POWER SUPPLY' && (
                              <><br /><span className="text-sm font-normal">(BUILD-UP ONLY)</span></>
                            )}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td className="border border-gray-300 p-2 text-center">{item.id}</td>
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
                        <td className="border border-gray-300 p-2 text-center">{item.unitCost.toFixed(2)}</td>
                        <td className="border border-gray-300 p-2">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            className="w-20 text-center border border-gray-300 rounded p-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mx-auto block"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                          />
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {(item.unitCost * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                  <tr>
                    <td colSpan={4} className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2 text-right font-medium">Subtotal:</td>
                    <td className="border border-gray-300 p-2 text-center">{subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="border border-gray-300 p-2 text-center italic">
                      A SURCHARGE OF 10% will be imposed for orders received after June 30, 2025.
                    </td>
                    <td className="border border-gray-300 p-2 text-right font-medium">Late Charge (10%):</td>
                    <td className="border border-gray-300 p-2 text-center">{lateCharge.toFixed(2)}</td>
                  </tr>
                  <tr className="font-bold">
                    <td colSpan={4} className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2 text-right">Total Amount:</td>
                    <td className="border border-gray-300 p-2 text-center">{grandTotal.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Important Notes */}
            <div className="mb-8 bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-700 mb-4">PLEASE NOTE:</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>All items are on rental basis.</li>
                <li>Exhibitors/Contractors who are bringing in their own light fittings are required to order lighting connections from the Official Electrical Contractor. Power outlets are not to be used for lighting purposes.</li>
                <li>Exhibitors with very sensitive equipment are advised to bring their own stabilizer or UPS for protection of frequency fluctuations as the Organiser shall not be responsible for any damage to the exhibitors' equipment. One socket is for one exhibit only. Multi-point connection is not allowed to prevent the risk of power overload.</li>
                <li>A <strong>SURCHARGE OF 10%</strong> will be imposed for orders received after September 2, 2024.</li>
                <li>A <strong>SURCHARGE OF 50%</strong> will be imposed for orders received on site or on-site alteration/relocation, and is subject to availability.</li>
                <li>All electrical installations must be undertaken by the Official Contractor.</li>
                <li>All payments are to be in favour of BLUE CIRCLE PLUS SDN. BHD. and must be received by this Order Form. All bank charges must be borne by remitter. Bank Details: CIMB BANK BERHAD (Sri Damansara Branch) B-G-3, Blok B, Plaza Ativo, Persiaran Perdana, Bandar Sri Damansara, 52200 Kuala Lumpur, Malaysia. Bank Account No: 800 984924. Bank Swift Code: CIBBMYKL</li>
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