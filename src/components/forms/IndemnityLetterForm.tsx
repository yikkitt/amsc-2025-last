'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@/lib/supabase'
import UserDataContainer from '@/components/UserDataContainer'

interface IndemnityLetterFormProps {
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

export default function IndemnityLetterForm({ userData }: IndemnityLetterFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const { error } = await supabase.from('form_submissions').insert({
        form_type: 8,
        company_data: {
          company_name: userData?.company_name || '',
          booth_number: userData?.booth_number || '',
        },
        auth_details: {
          name: formData.get('name'),
          designation: formData.get('designation'),
          date: formData.get('date'),
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
        <h1 className="text-2xl font-bold mb-2 text-blue-600">FORM 8</h1>
        <h2 className="text-xl font-semibold mb-4">LETTER OF INDEMNITY FOR NON-OFFICIAL CONTRACTOR</h2>
        <p className="text-gray-600 mb-2">DEADLINE: June 30, 2025</p>
        <h3 className="text-lg font-semibold mb-2">Aesthetic Medicine & Surgery Conference & Exhibition 2025</h3>
        <p className="text-gray-600">Kuala Lumpur Convention Centre</p>
      </div>

      {/* User Data Container */}
      <UserDataContainer userData={userData} />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Introduction */}
        <div className="mb-6">
          <p className="text-justify mb-4">
            It is the responsibility of the contractor to ensure all the regulations, policies and deadlines outlined in the contractor's regulations
            during the show are observed carefully and performed by contractor involved in Exhibition. The following guidelines must adhered to:
          </p>
        </div>

        {/* KLCC Information Section */}
        <div className="mb-6">
          <h4 className="font-semibold mb-4">Kuala Lumpur Convention Centre - Information & Rules for the Exhibitor's Appointed Contractor (EAC) When Working in the Centre</h4>
          
          <div className="space-y-3">
            <ol className="list-decimal list-outside ml-4 space-y-2">
              <li>All non-official contractors are required to register with the Official Contractor.</li>
              <li>The EAC must possess valid business registration license, workmen compensation insurance and public liability and or third-party liability insurance.</li>
              <li>The EAC must wear a pass supplied by the official contractor all the times when entering to the halls.</li>
              <li>All Malaysian workers must possess an Identity Card (IC) and all foreign worker must possess a valid work permit in order to obtain a contractor badge.</li>
              <li>No persons under age 18 years old are permitted to enter or work on the premises.</li>
              <li>No consumption of food items is allowed either at the back-of-house, loading docks, along Persiaran KLCC or in the public areas.</li>
              <li>Alcohol is not permitted in the work areas and no one is allowed to work while under the influence of drugs or alcohol.</li>
              <li>Smoking is not allowed at any time in the Halls and associated work areas.</li>
              <li>Covered footwear must be worn at all times whilst working on site. No thongs, sandals or open-toed shoes are allowed.</li>
              <li>Construction materials are not allowed to be piled onto NO FREIGHT AISLE, or obstruct fire exit and firefighting equipment. All materials must be kept within contracted booth space at all times.</li>
              <li>All contractors and their employees are strictly prohibited from using the guest's toilet facilities or loitering at the lobby and public area.</li>
              <li>Urinating in paint washing room or any unauthorised designation is strictly prohibited.</li>
              <li>Preparation and cleaning of paints must be conducted in wash room located at ground floor, loading dock 2 and loading dock 4.</li>
              <li>Contractor caught cleaning and disposing paint, chemical of build-up materials in the toilet bowl and washing basin will be penalised and liable to bear any cost incurred for rectifying the drainage system.</li>
              <li>All contractors must ensure the removal of all debris, rubbish and packing materials from the premises.</li>
              <li>Activities which generate dust such as welding, sanding sawing are strictly prohibited. Stand structure shall pre-fabricate off site and no major painting is permitted.</li>
              <li>Any person working on scaffolding of 2 metres and above must be protected with appropriate personal protective equipment such as safety helmet, body harness, covered or safety shoes. Only competent and experienced personnel shall be allowed to erect and dismantle the scaffolding.</li>
              <li>Screwing, drilling, nailing or painting on the floor, walls, pillars or any part of the Exhibition Hall are strictly not allowed.</li>
              <li>Unruly or unacceptable behaviour and violent acts are strictly prohibited. People acting without due care for others or not following directions of Security personnel shall be evicted from site.</li>
              <li>Any person with using abusive language, violent behaviour or committing unsafe work practices and or non-compliance activities will be prohibited from working in the Centre immediately.</li>
              <li>The Kl Convention Centre's Security Department deals with all reported incidents. Any incidents occur during the build and tear down activity, the contractors should report to the Centre's Security Services which located at the Concourse Level.</li>
            </ol>

            <p className="italic mt-4">
              Note: The Centre reserves the right to add and change any of the procedures and requirements at any time. Any person caught
              committing unsafe work practices and or non-compliance activities will be fined or prohibited from working in the Centre.
            </p>
          </div>
        </div>

        {/* Rules and Regulations */}
        <div className="mb-6">
          <h4 className="font-semibold mb-4">Rules and Regulations:</h4>
          <ol className="list-decimal list-outside ml-4 space-y-2">
            <li>The use of multiple socket outlets is strictly prohibited to avoid any overloading as this may lead to a trip in the incoming power supply will result in a re-energisation fee.</li>
            <li>Deadline for submission of raw space/special stand design with design appraisal checklist attached: September 2, 2024.</li>
            <li>Deadline for submission of the power, electricity: September 2, 2024.</li>
            <li>Electrical power supplied is used for running equipment / exhibit only. If used for lighting purposes, lighting connection charges will be applied.</li>
            <li>Exhibitors and their non-official contractors will have to bear any charges levied by Hall Owners for damages caused to their property, walls and floorings or for debris not cleared away.</li>
            <li>It is the responsibility of respective vendors to ensure the stability of own stand structures. Vendor is liable for the penalty charges by the Organiser or Official Contractor, should there be any insecure structure found within the stand area.</li>
            <li>A Warning Notice will be issued to non-official contractors, if found non-compliant to the Rules & Regulations.</li>
            <li>The Organiser and Official Contractor reserve the right to impose penalty charges to non-official contractors, if found non-compliant to the Rules & Regulations.</li>
          </ol>
        </div>

        {/* Authorization Section */}
        <div className="border-2 p-6 rounded-lg">
          <p className="mb-6 text-center">
            I hereby confirm that I have read and understood the above and agree to abide by the terms and conditions by duly signing the rules
            and regulations.
          </p>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Signature</label>
              <input type="text" name="signature" className="w-full border-2 rounded p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input type="text" name="name" className="w-full border-2 rounded p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Designation</label>
              <input type="text" name="designation" className="w-full border-2 rounded p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input type="date" name="date" className="w-full border-2 rounded p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Company Stamp</label>
              <input type="text" name="company_stamp" className="w-full border-2 rounded p-2" required />
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