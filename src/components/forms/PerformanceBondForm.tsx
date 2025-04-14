'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import UserDataContainer from '@/components/UserDataContainer'

interface PerformanceBondFormProps {
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

export default function PerformanceBondForm({ userData }: PerformanceBondFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [squareMetre, setSquareMetre] = useState<string>('')

  const calculateAmount = (sqm: number) => {
    if (sqm <= 37) {
      return 5000
    } else if (sqm <= 100) {
      return 10000
    } else {
      return 15000
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const sqm = parseFloat(squareMetre) || 0
      const formData = new FormData(e.target as HTMLFormElement)
      const { error } = await supabase.from('form_submissions').insert({
        form_type: 6,
        company_data: {
          company_name: formData.get('company'),
          booth_number: formData.get('booth_no'),
          address: formData.get('address'),
          tel: formData.get('tel'),
          fax: formData.get('fax'),
          email: formData.get('email')
        },
        square_metre: sqm,
        amount: calculateAmount(sqm),
        auth_details: {
          name: formData.get('name'),
          designation: formData.get('designation'),
          date: formData.get('date'),
          signature: formData.get('signature')
        }
      })

      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md">
      {/* Form Header */}
      <div className="text-center mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-2xl font-bold mb-2 text-blue-600">FORM 6</h1>
        <h2 className="text-xl font-semibold mb-4">NON-OFFICIAL CONTRACTOR FORM (PERFORMANCE BOND)</h2>
        <p className="text-gray-600 mb-2">DEADLINE: September 2, 2024</p>
        <h3 className="text-lg font-semibold mb-2">REGIONAL CONFERENCE OF DERMATOLOGY 2024</h3>
        <p className="text-gray-600">Kuala Lumpur Convention Centre</p>
      </div>

      {/* User Data Container */}
      <UserDataContainer userData={userData} />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Eligibility Section */}
        <div className="mb-6">
          <p className="font-semibold mb-2">This form is applicable, who are:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Contracted for bare space</li>
            <li>Building their own stand</li>
            <li>Engaging their own stand contractor</li>
            <li>Dismantle for contractor used</li>
            <li>For exhibitors who are doing any constructions work for their stand</li>
          </ul>
        </div>

        {/* Performance Bond Information */}
        <div className="mb-6 space-y-4">
          <p className="text-justify">Before permission is granted for a non-official contractor to work at the exhibition, the non-official contractor is required to place a performance bond (refundable) by rm. RM 5,000.00 (37 sqm and below), RM 10,000.00 (37 sqm and 100 sqm) and RM 15,000.00 (101 sqm and above) per contractor per stand with Blue Circle Plus Sdn. Bhd. and sign an undertaking letter to guarantee conduct, proper schedule of production and observance of the exhibition rules and regulations.</p>
          
          <p className="text-justify">Performance bond (refundable) is to cover of any damages done during the set-up, exhibition period and dismantling.</p>
          
          <p className="text-justify">Performance bond (refundable) is to be paid before any work can commence on-site. The Performance bond (refundable) shall be held by the Official Contractor until the completion of tear and shall be refunded without interest to the non-official contractor within 30 days from the completion of exhibition after deduction of:-</p>
        </div>

        {/* Damages List */}
        <div className="mb-6">
          <p className="mb-2">Any sums for any loss of items, damage, alternative, defects, fixtures and fittings directly or indirectly caused by the non-official contractor:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Paint marks/stains and illegal disposal of paint materials</li>
            <li>Any type of adhesive tape stains</li>
            <li>Damages or defects to the exhibitor's floor coverings, wall and/or structure</li>
            <li>Heavy construction</li>
            <li>Waste material/rubbish leftover</li>
            <li>Booth construction materials leftover (i.e. glass, plastic, wood and etc)</li>
            <li>Unable to comply with the exhibition and/or venue construction rules & regulations</li>
            <li>Failure of booth structure integrity</li>
          </ul>
        </div>

        {/* Performance Bond Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-2 text-left">NO</th>
                <th className="border p-2 text-left">PARTICULAR</th>
                <th className="border p-2 text-center">SQUARE METRE</th>
                <th className="border p-2 text-right">AMOUNT (RM)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">1)</td>
                <td className="border p-2">Performance Bond (Refundable)<br/>(For Non-Official Contractor)</td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={squareMetre}
                    onChange={(e) => setSquareMetre(e.target.value)}
                    className="w-full text-center border rounded p-1"
                    min="0"
                    step="0.01"
                  />
                </td>
                <td className="border p-2 text-right">
                  {squareMetre ? calculateAmount(parseFloat(squareMetre)).toFixed(2) : '0.00'}
                </td>
              </tr>
              <tr className="font-bold">
                <td colSpan={3} className="border p-2 text-right">Total Amount:</td>
                <td className="border p-2 text-right">
                  {squareMetre ? calculateAmount(parseFloat(squareMetre)).toFixed(2) : '0.00'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Important Note Section */}
        <div className="space-y-2">
          <h4 className="font-bold">Important Note:</h4>
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>Please issue separate cheque for the performance bond. For bank in payment, kindly attach a copy of bank in slip as confirmation.</li>
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
        <div className="flex justify-center space-x-6">
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
    </div>
  )
} 