'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import UserDataContainer from '@/components/UserDataContainer'
import { syncFormWithSupabase, checkPreviousFormSubmission } from '@/lib/forms/submitHandler'
import { PdfButton } from '@/components/ui/PdfButton'
import Link from 'next/link'
import Image from 'next/image'

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
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<any>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const supabase = getSupabaseBrowserClient()
  const [fasciaName, setFasciaName] = useState<string[]>(Array(25).fill(''))
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

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
            .eq('form_type', '1')
            .maybeSingle()
            
          if (error) {
            console.error('Error checking previous submission:', error)
          } else if (data && typeof data.data === 'object' && data.data !== null) {
            setSubmitted(true)
            setSubmittedData(data.data)
            // Update fascia name with submitted data
            const formData = data.data as { fascia_name?: string }
            if (formData.fascia_name) {
              setFasciaName(formData.fascia_name.split('').concat(Array(25).fill('')).slice(0, 25))
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

  // Handle input change and auto-focus to next box
  const handleInputChange = (index: number, value: string) => {
    // Accept letters, numbers, and space
    if (value && !/^[A-Z0-9 ]$/.test(value.toUpperCase())) {
      return;
    }

    // Update the fasciaName state
    const newFasciaName = fasciaName.slice();
    newFasciaName[index] = value.toUpperCase();
    setFasciaName(newFasciaName);

    // Focus the next input if a character was entered (and it's not a space)
    if (value && index < 24) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 10);
    }
  }

  // Handle backspace key to move to previous box
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !fasciaName[index]) {
      // Move to previous input on backspace if current is empty
      if (index > 0) {
        setTimeout(() => {
          inputRefs.current[index - 1]?.focus();
        }, 10);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      // Move left on left arrow
      setTimeout(() => {
        inputRefs.current[index - 1]?.focus();
      }, 10);
    } else if (e.key === 'ArrowRight' && index < 24) {
      // Move right on right arrow
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 10);
    }
  }

  // Handle paste to fill multiple boxes
  const handlePaste = (index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').toUpperCase();
    // Allow spaces in the pasted text
    const validChars = pastedText.replace(/[^A-Z0-9 ]/g, '').slice(0, 25 - index);
    
    if (validChars) {
      const newFasciaName = fasciaName.slice();
      
      for (let i = 0; i < validChars.length; i++) {
        if (index + i < 25) {
          newFasciaName[index + i] = validChars[i];
        }
      }
      
      setFasciaName(newFasciaName);
      
      // Focus the box after the last filled box
      const nextIndex = Math.min(index + validChars.length, 24);
      setTimeout(() => {
        inputRefs.current[nextIndex]?.focus();
      }, 10);
    }
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
        form_type: 1,
        company_data: {
          company_name: userData?.company_name || '',
          booth_number: userData?.booth_number || '',
          contact_person: userData?.contact_person || '',
          email: userData?.email || '',
          tel: userData?.tel || '',
          fax: userData?.fax || '',
          address: userData?.address || '',
        },
        fascia_name: fasciaName.join('').trim(),
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
          <h1 className="text-2xl font-bold mb-2 text-blue-600">FORM 1</h1>
          <h2 className="text-xl font-semibold mb-4">FASCIA NAME FORM</h2>
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

            {/* Display submitted fascia name in read-only mode */}
            <div className="mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-700 mb-4">Submitted Fascia Name:</h4>
                <div className="flex flex-col gap-2">
                  {/* First row: 13 boxes */}
                  <div className="flex gap-1 justify-center">
                    {fasciaName.slice(0, 13).map((char, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center bg-white text-center uppercase font-bold"
                      >
                        {char}
                      </div>
                    ))}
                  </div>
                  {/* Second row: 12 boxes */}
                  <div className="flex gap-1 justify-center">
                    {fasciaName.slice(13).map((char, i) => (
                      <div
                        key={i + 13}
                        className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center bg-white text-center uppercase font-bold"
                      >
                        {char}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-6">
              <PdfButton
                formData={submittedData || {}}
                formType={1}
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
                  {fasciaName.slice(0, 13).map((_, i) => (
                    <input
                      key={i}
                      ref={el => { inputRefs.current[i] = el }}
                      type="text"
                      maxLength={1}
                      className="w-10 h-10 border border-gray-300 rounded text-center uppercase font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      value={fasciaName[i] || ''}
                      onChange={(e) => handleInputChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      onPaste={(e) => handlePaste(i, e)}
                      autoComplete="off"
                    />
                  ))}
                </div>
                {/* Second row: 12 boxes */}
                <div className="flex gap-1 justify-center">
                  {fasciaName.slice(13).map((_, i) => (
                    <input
                      key={i + 13}
                      ref={el => { inputRefs.current[i + 13] = el }}
                      type="text"
                      maxLength={1}
                      className="w-10 h-10 border border-gray-300 rounded text-center uppercase font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      value={fasciaName[i + 13] || ''}
                      onChange={(e) => handleInputChange(i + 13, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i + 13, e)}
                      onPaste={(e) => handlePaste(i + 13, e)}
                      autoComplete="off"
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
                        <td className="py-2">Fluorescent Tube</td>
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