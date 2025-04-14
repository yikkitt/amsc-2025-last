'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import UserDataContainer from '@/components/UserDataContainer'
import { PdfButton } from '@/components/ui/PdfButton'

interface FasciaNameFormProps {
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

export default function FasciaNameForm({ userData }: FasciaNameFormProps) {
  const [fasciaName, setFasciaName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedData, setSubmittedData] = useState<any>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Prepare form data
      const formData = {
        form_type: 1,
        company_data: {
          company_name: userData?.company_name || '',
          booth_number: userData?.booth_number || '',
          fascia_name: fasciaName,
        },
        items: [],
        subtotal: 0,
        late_charge: 0,
        grand_total: 0,
        auth_details: {
          name: '',
          designation: '',
          date: new Date().toISOString(),
        }
      };

      // Submit to Supabase
      const { error } = await supabase.from('form_submissions').insert(formData);

      if (error) throw error;

      // Store submitted data for PDF generation
      setSubmittedData(formData);

      // Log form submission (instead of sending email)
      console.log('Form submitted successfully:', formData);

      router.refresh();
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
        <h1 className="text-2xl font-bold mb-2 text-blue-600">FORM 1</h1>
        <h2 className="text-xl font-semibold mb-4">FASCIA NAME FORM FOR SHELL SCHEME</h2>
        <p className="text-gray-600 mb-2">DEADLINE: September 2, 2024</p>
        <h3 className="text-lg font-semibold mb-2">REGIONAL CONFERENCE OF DERMATOLOGY 2024</h3>
        <p className="text-gray-600">Kuala Lumpur Convention Centre</p>
      </div>

      {/* User Data Container */}
      <UserDataContainer userData={userData} />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Instructions */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700 mb-4">This form must be completed and returned by all Standard Shell Scheme exhibitors.</p>
          <p className="font-bold mb-4">PLEASE USE BLOCK LETTERS</p>
          <label className="block font-bold">
            1. FASCIA NAME (A maximum of 25 letterings only can be accommodated)
          </label>
        </div>

        {/* Fascia Name Input */}
        <div className="mb-8">
          <div className="flex flex-col gap-2">
            {/* First row: 13 boxes */}
            <div className="flex gap-1 justify-center">
              {Array(13).fill(0).map((_, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  className="w-10 h-10 border border-gray-300 rounded text-center uppercase font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={fasciaName[i] || ''}
                  onChange={(e) => {
                    const newValue = e.target.value.toUpperCase();
                    if (newValue.match(/^[A-Z0-9]?$/)) {
                      const newFasciaName = fasciaName.split('');
                      newFasciaName[i] = newValue;
                      setFasciaName(newFasciaName.join(''));
                    }
                  }}
                />
              ))}
            </div>
            {/* Second row: 12 boxes */}
            <div className="flex gap-1 justify-center">
              {Array(12).fill(0).map((_, i) => (
                <input
                  key={i + 13}
                  type="text"
                  maxLength={1}
                  className="w-10 h-10 border border-gray-300 rounded text-center uppercase font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={fasciaName[i + 13] || ''}
                  onChange={(e) => {
                    const newValue = e.target.value.toUpperCase();
                    if (newValue.match(/^[A-Z0-9]?$/)) {
                      const newFasciaName = fasciaName.split('');
                      newFasciaName[i + 13] = newValue;
                      setFasciaName(newFasciaName.join(''));
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="mb-8 bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-700 mb-4">Important Note:</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Fascia Name will be in upper case, standard 70mm high sticker English letterings (maximum 25 letterings)</li>
            <li>Failure to submit the request after the deadline, the name on signed contract will be used</li>
            <li>Any changes on site will be charged RM 100.00/set of fascia name</li>
          </ol>
        </div>

        {/* Standard Booth Diagram */}
        <div className="mb-8">
          <h4 className="font-semibold text-blue-700 mb-4">2. STANDARD BOOTH</h4>
          <div className="border border-gray-200 rounded-lg overflow-hidden p-6">
            {/* Shell scheme booth example image */}
            <div className="mb-6">
              <Image
                src="/images/shell-shceme-booth-example.png"
                alt="Shell Scheme Booth Example"
                width={600}
                height={400}
                className="mx-auto rounded-lg shadow-sm"
              />
            </div>
            
            {/* Booth Package */}
            <div>
              <h5 className="font-bold mb-4 text-center">Booth Package Entitlement (9sqm)</h5>
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-2">Information Desk</td>
                    <td className="text-right font-bold">1</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2">White Folding Chair</td>
                    <td className="text-right font-bold">2</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2">Waste Paper Bin</td>
                    <td className="text-right font-bold">1</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2">LED T5 Tube</td>
                    <td className="text-right font-bold">2</td>
                  </tr>
                  <tr>
                    <td className="py-2">13Amp Power Socket (240Volt)</td>
                    <td className="text-right font-bold">1</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Authorization Section */}
        <div className="mb-8">
          <p className="mb-6 text-center text-gray-700">Please retain a copy for your record & return this form via email to:</p>
          
          <div className="mb-8 text-center bg-gray-50 py-4 rounded-lg">
            <h5 className="font-bold text-blue-600 mb-2">BLUE CIRCLE PLUS SDN BHD</h5>
            <p className="mb-1">Attn: Mr. Francis Chan / Ms. YJ Hoh</p>
            <p className="mb-1">Email: francis@bcpgroup.com.my /</p>
            <p className="mb-1">yj@bcpgroup.com.my</p>
            <p>Tel: +601-3257 9795 / +6016-263 1150</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
            <h5 className="font-bold mb-2 text-blue-600">Authorized Representative Applying:-</h5>
            <p className="text-gray-600 mb-4">(Please type or attach business name card)</p>
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
                <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  defaultValue={userData?.contact_person || ''}
                />
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
                  defaultValue={userData?.address || ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                <input 
                  type="email" 
                  className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  defaultValue={userData?.email || ''}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Tel/Hp</label>
                  <input 
                    type="tel" 
                    className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    defaultValue={userData?.tel || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Fax</label>
                  <input 
                    type="tel" 
                    className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    defaultValue={userData?.fax || ''}
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
        <div className="flex justify-center space-x-6 mt-8">
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
              formType={1}
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
  )
} 