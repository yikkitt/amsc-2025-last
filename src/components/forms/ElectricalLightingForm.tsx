'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import React from 'react'
import UserDataContainer from '@/components/UserDataContainer'
import { isPastDeadline } from '@/lib/forms/submitHandler'
import FormSubmitActions from './FormSubmitActions'
import { FormData } from '@/types/forms'

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
  const supabase = getSupabaseBrowserClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedData, setSubmittedData] = useState<any>(null)
  const formRef = useRef<HTMLDivElement>(null)
  
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
    { id: 'LC1', description: 'Lighting Connection with cabling (Max 100w per bulb/tube)', unitCost: 100.00, quantity: 0, image: '/products/lighting-connection.jpg', section: 'LIGHTING CONNECTION' },
    { id: 'LC2', description: 'Lighting Connection for LED strip / Bulb / Tube (Max 1mL or 1 bulb / tube per connection)', unitCost: 100.00, quantity: 0, image: '/products/led-strip-connection.jpg', section: 'LIGHTING CONNECTION' },
    
    // POWER POINT / ISOLATOR
    { id: '109', description: '13 Amp/230V single phase power point (max 500W & not for lighting)', unitCost: 110.00, quantity: 0, image: '/products/power-point-13a.jpg', section: 'POWER POINT / ISOLATOR' },
    { id: '110', description: '13 Amp / 230V Single Phase Power Point 24 Hours usage (max 500W & not for lighting)', unitCost: 330.00, quantity: 0, image: '/products/power-point-13a-24h.jpg', section: 'POWER POINT / ISOLATOR' },
    { id: '111', description: '15 Amp/230V single phase outlet (max 2KW & not for lighting)', unitCost: 135.00, quantity: 0, image: '/products/power-point-15a.jpg', section: 'POWER POINT / ISOLATOR' },
    { id: '112', description: '15 Amp / 230V Single Phase Power Point 24 Hours usage (max 2KW & not for lighting)', unitCost: 580.00, quantity: 0, image: '/products/power-point-15a-24h.jpg', section: 'POWER POINT / ISOLATOR' },
    
    // TEMPORARY POWER SUPPLY
    { id: 'TPS1', description: '13 Amp/230V single phase power point (Temporary power supply for set up)', unitCost: 150.00, quantity: 0, image: '/products/temp-power.jpg', section: 'TEMPORARY POWER SUPPLY' },
  ])
  
  // Function to check if an item is the first of its section
  const isFirstInSection = (index: number): boolean => {
    if (index === 0) return true;
    return orderItems[index].section !== orderItems[index - 1].section;
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
  const isLateOrder = isPastDeadline(); // Use the isPastDeadline function
  const subtotal = calculateTotal();
  const lateCharge = isLateOrder ? subtotal * 0.1 : 0;

  // Prepare form data for submission and PDF generation
  const formData: FormData = {
    form_type: 3,
    company_data: {
      company_name: userData?.company_name || '',
      booth_number: userData?.booth_number || '',
      contact_person: userData?.contact_person || '',
      email: userData?.email || '',
    },
    items: orderItems.filter(item => item.quantity > 0).map(item => ({
      ...item,
      total: item.quantity * item.unitCost
    })),
    subtotal: subtotal,
    late_charge: lateCharge,
    grand_total: subtotal + lateCharge,
    auth_details: {
      name: '',
      designation: '',
      date: new Date().toISOString(),
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Submit to Supabase
      const { error } = await supabase.from('form_submissions').insert(formData);

      if (error) throw error;

      // Store submitted data for PDF generation
      setSubmittedData(formData);

      // Log form submission (instead of sending email)
      console.log('Form submitted successfully:', formData);

      // Remove or comment out the router.refresh() call
      // router.refresh();
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div ref={formRef} className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md">
      {/* Form Header */}
      <div className="text-center mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-2xl font-bold mb-2 text-blue-600">FORM 3</h1>
        <h2 className="text-xl font-semibold mb-4">ELECTRICAL & LIGHTING ORDER FORM</h2>
        <p className="text-gray-600 mb-2">DEADLINE: June 30, 2025</p>
        <h3 className="text-lg font-semibold mb-2">Aesthetic Medicine & Surgery Conference & Exhibition 2025</h3>
        <p className="text-gray-600">Kuala Lumpur Convention Centre</p>
      </div>

      {/* User Data Container */}
      <UserDataContainer userData={userData} />

      <form onSubmit={handleSubmit} className="space-y-8">
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
                <td className="border border-gray-300 p-2 text-center">{(subtotal + lateCharge).toFixed(2)}</td>
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
                  <label className="block text-sm font-medium mb-1 text-gray-700">Authorized by</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                    defaultValue={userData?.company_name || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Booth No</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                    defaultValue={userData?.booth_number || ''}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Designation</label>
                <input type="text" className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Company Address</label>
                <textarea 
                  className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                <input 
                  type="email" 
                  className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Tel/Hp</label>
                  <input 
                    type="tel" 
                    className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Fax</label>
                  <input 
                    type="tel" 
                    className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Signature</label>
                  <input type="text" className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Date</label>
                  <input 
                    type="date" 
                    className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    defaultValue={new Date().toISOString().split('T')[0]}
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
          
          {submittedData ? (
            <PdfButton
              formData={submittedData}
              formType={3}
              includeEmptyItems={false}
              containerRef={formRef}
              className="px-8 py-3"
            />
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
} 