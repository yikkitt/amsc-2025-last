'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import UserDataContainer from '@/components/UserDataContainer'
import { isPastDeadline } from '@/lib/forms/submitHandler'
import { syncFormWithSupabase } from '@/lib/forms/submitHandler'
import { PdfButton } from '@/components/ui/PdfButton'
import { User } from '@supabase/supabase-js'
import { Dispatch, FormEvent, SetStateAction, useEffect } from 'react'
import type { FormData as FormDataType } from 'undici'

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
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  // Prepare form data for submission and PDF generation
  const prepareFormData = (form: HTMLFormElement) => {
    // Ensure all monetary values are valid numbers
    const validSubtotal = isNaN(subtotal) ? 0 : subtotal;
    const validLateCharge = isNaN(lateCharge) ? 0 : lateCharge;
    const validGrandTotal = isNaN(grandTotal) ? validSubtotal + validLateCharge : grandTotal;
    
    const formDataObj = new FormData(form);
    
    // Create transformed items array - make sure items with quantity > 0 are included
    const transformedItems = orderItems
      .filter(item => item.quantity > 0)
      .map(item => ({
        id: item.id,
        description: item.description,
        quantity: parseInt(String(item.quantity)) || 0,
        unitCost: parseFloat(String(item.unitCost)) || 0,
        total: parseFloat(String(item.quantity * item.unitCost)) || 0
      }));
    
    // Only add security deposit as a separate item if there are other items selected
    const securityDepositItem = {
      id: 'security-deposit',
      description: "Security Deposit",
      quantity: 1,
      unitCost: securityDeposit,
      total: securityDeposit
    };
    
    // Combine all items
    const allItems = [...transformedItems, securityDepositItem];
    
    // Log items to verify they're being included
    console.log('Items to be submitted:', allItems);
    
    return {
      formType: 9,
      form_type: '9',
      orderItems: allItems, // Include items with the name orderItems as well
      items: allItems, // Include items with the standard name items
      company_data: {
        company_name: formDataObj.get('company') as string || userData?.company_name || '',
        booth_number: formDataObj.get('booth_no') as string || userData?.booth_number || '',
        contact_person: formDataObj.get('name') as string || userData?.contact_person || '',
        email: formDataObj.get('email') as string || userData?.email || '',
        tel: formDataObj.get('tel') as string || userData?.tel || '',
        fax: formDataObj.get('fax') as string || userData?.fax || '',
        address: formDataObj.get('address') as string || userData?.address || '',
      },
      subtotal: validSubtotal,
      security_deposit: securityDeposit,
      late_charge: validLateCharge,
      grand_total: validGrandTotal,
      auth_details: {
        name: formDataObj.get('name') as string || '',
        designation: formDataObj.get('designation') as string || '',
        date: formDataObj.get('date') as string || new Date().toISOString(),
        signature: formDataObj.get('signature') as string || '',
      }
    };
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = prepareFormData(e.target as HTMLFormElement);
      console.log('Submitting form data:', formData);
      
      // Verify grand_total is not null before submission
      if (formData.grand_total === null || formData.grand_total === undefined || isNaN(formData.grand_total)) {
        throw new Error("Invalid grand total amount. Please try again.");
      }
      
      // Use the syncFormWithSupabase function for submission
      const result = await syncFormWithSupabase(formData);
      
      if (!result.success) throw new Error(result.message);
      
      // Store submitted data for PDF generation
      setSubmittedData(formData);
      setFormSubmitted(true);
      
      // Show success message
      alert("Form submitted successfully!");
      
      // Don't redirect immediately - stay on page so user can download PDF
    } catch (error) {
      console.error('Error submitting form:', error)
      let errorMessage = error instanceof Error ? error.message : 'Unknown error';
      // Check for specific error types from Supabase
      if (errorMessage.includes('surcharge') || errorMessage.includes('column')) {
        errorMessage = "There was a database field mismatch. Our team has been notified and will fix this issue.";
      } else if (errorMessage.includes('duplicate key')) {
        errorMessage = "You have already submitted this form. Please view your submissions in the dashboard.";
      } else if (errorMessage.includes('violates not-null constraint')) {
        errorMessage = "Required form fields are missing. Please ensure all required fields are filled.";
      }
      
      alert(`Error submitting form: ${errorMessage}`);
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

      {!formSubmitted ? (
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
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
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
            <p className="text-center mb-6">Please retain a copy for your record & return this form via email to:</p>
            
            <div className="text-center mb-8">
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
                      name="name" 
                      className="w-full border-2 rounded p-2" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Designation</label>
                    <input 
                      type="text" 
                      name="designation" 
                      className="w-full border-2 rounded p-2" 
                      required 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <input 
                    type="text" 
                    name="company"
                    className="w-full border-2 rounded p-2"
                    defaultValue={userData?.company_name || ''}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Booth No</label>
                  <input 
                    type="text" 
                    name="booth_no"
                    className="w-full border-2 rounded p-2"
                    defaultValue={userData?.booth_number || ''}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <textarea 
                    name="address" 
                    className="w-full border-2 rounded p-2" 
                    rows={3} 
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tel</label>
                    <input 
                      type="tel" 
                      name="tel" 
                      className="w-full border-2 rounded p-2" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Fax</label>
                    <input 
                      type="tel" 
                      name="fax" 
                      className="w-full border-2 rounded p-2" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    className="w-full border-2 rounded p-2" 
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Signature</label>
                    <input 
                      type="text" 
                      name="signature" 
                      className="w-full border-2 rounded p-2" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <input 
                      type="date" 
                      name="date" 
                      className="w-full border-2 rounded p-2" 
                      required 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-center space-x-6 mt-8">
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
      ) : (
        <div className="space-y-8">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-bold text-green-800 mb-2">Form Submitted Successfully!</h3>
            <p className="text-green-700">
              Your AV Equipment order has been successfully submitted. You can download a PDF copy for your records.
            </p>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={handleReturnToDashboard}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Return to Dashboard
            </button>
            
            {submittedData && (
              <PdfButton
                formData={submittedData}
                formType={9}
                containerRef={formRef}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
} 