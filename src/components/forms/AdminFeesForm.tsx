'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import UserDataContainer from '@/components/UserDataContainer'
import { syncFormWithSupabase } from '@/lib/forms/submitHandler'
import { PdfButton } from '@/components/ui/PdfButton'

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
    fax?: string
    email?: string
  } | null
}

export default function AdminFeesForm({ userData }: AdminFeesFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<any>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const [squareMetre, setSquareMetre] = useState<string>('')

  const calculateAmount = (sqm: number) => {
    return sqm * 50.00 // RM 50.00 per sqm
  }
  
  const prepareFormData = (formData: FormData) => {
    const sqm = parseFloat(squareMetre) || 0;
    const calculatedAmount = calculateAmount(sqm);
    
    return {
      form_type: 7,
      company_name: formData.get('company') as string || userData?.company_name || '',
      booth_number: formData.get('booth_no') as string || userData?.booth_number || '',
      square_metre: sqm,
      grand_total: calculatedAmount, // Use grand_total instead of amount
      auth_details: {
        name: formData.get('name') as string || '',
        designation: formData.get('designation') as string || '',
        date: formData.get('date') as string || new Date().toISOString(),
        signature: formData.get('signature') as string || ''
      },
      address: formData.get('address') as string || userData?.address || '',
      tel: formData.get('tel') as string || userData?.tel || '',
      fax: formData.get('fax') as string || userData?.fax || '',
      email: formData.get('email') as string || userData?.email || ''
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const formElement = e.target as HTMLFormElement;
      const formData = new FormData(formElement);
      const preparedData = prepareFormData(formData);
      
      console.log('Submitting form data:', preparedData);
      
      // Use the syncFormWithSupabase function for submission
      const result = await syncFormWithSupabase(preparedData, userData?.company_name);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      // Store submitted data for PDF generation
      setSubmittedData(preparedData);
      setFormSubmitted(true);
      
      // Show success message
      alert("Form submitted successfully!");
    } catch (error) {
      console.error('Error submitting form:', error)
      let errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Check for specific error types from Supabase
      if (errorMessage.includes('violates not-null constraint')) {
        errorMessage = "Required form fields are missing. Please ensure all required fields are filled.";
      } else if (errorMessage.includes('duplicate key')) {
        errorMessage = "You have already submitted this form. Please view your submissions in the dashboard.";
      } else if (errorMessage.includes('column')) {
        errorMessage = "There was a database field mismatch. Our team has been notified and will fix this issue.";
      }
      
      alert(`Error submitting form: ${errorMessage}`);
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div ref={formRef} className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md">
      {/* Form Header */}
      <div className="text-center mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-2xl font-bold mb-2 text-blue-600">FORM 7</h1>
        <h2 className="text-xl font-semibold mb-4">NON-OFFICIAL CONTRACTOR FORM (ADMIN FEES)</h2>
        <p className="text-gray-600 mb-2">DEADLINE: June 30, 2025</p>
        <h3 className="text-lg font-semibold mb-2">Aesthetic Medicine & Surgery Conference & Exhibition 2025</h3>
        <p className="text-gray-600">Kuala Lumpur Convention Centre</p>
      </div>

      {/* User Data Container */}
      <UserDataContainer userData={userData} />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Notes Section */}
        <div className="mb-6">
          <h4 className="font-bold mb-2">Notes:</h4>
          <p className="text-justify">
            A non-refundable administrative fee of RM 50.00 per sqm is payable to the official contractor by non-official contractor for the
            processing of the communication, management function including securing approval from relevant authorities.
          </p>
        </div>

        {/* Admin Fees Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-2 text-left">NO</th>
                <th className="border p-2 text-left">PARTICULAR</th>
                <th className="border p-2 text-center">PER SQUARE METRE</th>
                <th className="border p-2 text-center">SQUARE METRE</th>
                <th className="border p-2 text-right">AMOUNT [RM]</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">1)</td>
                <td className="border p-2">Admin Fee to Construct / Decorate Special Design Stand (Non-Refundable)</td>
                <td className="border p-2 text-center">RM 50.00</td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={squareMetre}
                    onChange={(e) => setSquareMetre(e.target.value)}
                    className="w-full text-center border rounded p-1"
                    min="0"
                    step="any"
                  />
                </td>
                <td className="border p-2 text-right">
                  {squareMetre ? calculateAmount(parseFloat(squareMetre)).toFixed(2) : '0.00'}
                </td>
              </tr>
              <tr className="font-bold">
                <td colSpan={4} className="border p-2 text-right">Total Amount:</td>
                <td className="border p-2 text-right">
                  {squareMetre ? calculateAmount(parseFloat(squareMetre)).toFixed(2) : '0.00'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Important Note Section */}
        <div className="space-y-2">
          <h4 className="font-bold">Important Note:-</h4>
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>All stand design must be submitted to Official Contractor no later than September 2, 2024 for pre-approval, otherwise we will not responsible for any instruction by Venue Management to amend the booth structure on site.</li>
            <li>Please see below (Appendix) for the sample of booth design submission.</li>
            <li>All payments are to be in favour of BLUE CIRCLE PLUS SDN. BHD. and must be accompanied by this Order Form. All bank charges must be borne by remitter. Bank Details: CIMB BANK BERHAD (Sri Damansara Branch) B-G-6, Blok B, Plaza Ativo, Persiaran Perdana, Bandar Sri Damansara, 52200 Kuala Lumpur, Malaysia. Bank Account No: 800 9085824, Bank Swift Code: CIBBMYKL</li>
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
                  <input type="text" name="name" className="w-full border-2 rounded p-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Designation</label>
                  <input type="text" name="designation" className="w-full border-2 rounded p-2" required />
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
                <textarea name="address" className="w-full border-2 rounded p-2" rows={3} required />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Tel</label>
                  <input type="tel" name="tel" className="w-full border-2 rounded p-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Fax</label>
                  <input type="tel" name="fax" className="w-full border-2 rounded p-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input type="email" name="email" className="w-full border-2 rounded p-2" required />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Signature</label>
                  <input type="text" name="signature" className="w-full border-2 rounded p-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input type="date" name="date" className="w-full border-2 rounded p-2" required />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-center space-x-6 mt-8">
          {formSubmitted ? (
            <>
              <PdfButton
                formData={submittedData}
                formType={7}
                containerRef={formRef}
                className="px-8 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
              />
              <button
                type="button"
                onClick={() => router.push('/dashboard/order-forms')}
                className="px-8 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Return to Dashboard
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </form>
    </div>
  )
} 