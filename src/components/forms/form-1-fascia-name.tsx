'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import UserDataContainer from '@/components/UserDataContainer'
import { syncFormWithSupabase, checkPreviousFormSubmission } from '@/lib/forms/submitHandler'
import { PdfButton } from '@/components/ui/PdfButton'
import Link from 'next/link'
import Image from 'next/image'
import FormDisclaimer from '@/components/ui/FormDisclaimer'
import FormLoadingWrapper from '@/components/wrappers/FormLoadingWrapper'

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
    tax_identification_number?: string
    email?: string
    designation?: string
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
          tax_identification_number: userData?.tax_identification_number || '',
          address: userData?.address || '',
        },
        fascia_name: fasciaName.join('').trim(),
        auth_details: {
          name: formData.get('auth_name')?.toString() || userData?.contact_person || '',
          designation: formData.get('auth_designation')?.toString() || userData?.designation || '',
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
    <FormLoadingWrapper isLoading={isLoading} fallbackMessage="Loading Fascia Name Form...">
      <div className="w-full max-w-5xl mx-auto">
        <div ref={containerRef} className="bg-white p-6 rounded-lg shadow">
          {/* Form Header */}
          <div className="text-center mb-8 border-b border-gray-200 pb-6">
            <h1 className="text-2xl font-bold mb-2 text-blue-600">FORM 1</h1>
            <h2 className="text-xl font-semibold mb-4">FASCIA NAME</h2>
            <p className="text-gray-600 mb-2">DEADLINE: 30th June 2025</p>
            <p className="text-red-500 font-semibold mb-2">MANDATORY FORM</p>
                    <h3 className="text-lg font-semibold mb-2">Disruptive Doctors Conference & Exhibition 2025</h3>
        <p className="text-gray-600">Sime Darby Convention Centre</p>
          </div>

          {/* User Data Container */}
          <UserDataContainer userData={userData} />

          {/* Display submitted data if already submitted */}
          {submitted ? (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Form successfully submitted
                </p>
              </div>
              
              {/* Display form data */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Your Submission</h3>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-2">Fascia Name</h4>
                  <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono text-lg text-center">
                    {submittedData?.fascia_name || ''}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Authorized By</h4>
                    <p><span className="font-semibold">Name:</span> {submittedData?.auth_details?.name}</p>
                    <p><span className="font-semibold">Designation:</span> {submittedData?.auth_details?.designation}</p>
                    <p><span className="font-semibold">Company:</span> {submittedData?.auth_details?.company}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Submission Details</h4>
                    <p><span className="font-semibold">Date:</span> {new Date(submittedData?.auth_details?.date).toLocaleDateString()}</p>
                    <p><span className="font-semibold">Email:</span> {submittedData?.auth_details?.email}</p>
                    <p><span className="font-semibold">Tel:</span> {submittedData?.auth_details?.tel}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <Link
                  href="/"
                  className="px-8 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors print:hidden"
                >
                  Return to Dashboard
                </Link>
                {/* PDF Download Button */}
                <PdfButton 
                  formData={submittedData || {}}
                  formType={1}
                  containerRef={containerRef as React.RefObject<HTMLElement>}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} ref={formRef} className="space-y-8">
              {/* Form Information Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Form Information</h3>
                <p className="text-gray-600 mb-4">
                  This form is for the submission of your company name as it will appear on your booth fascia board.
                  Please complete all required fields marked with an asterisk (*).
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800">
                    <span className="font-semibold">Important:</span> The fascia name will be displayed on your booth. 
                    Please ensure it is correct as changes after submission may incur additional charges.
                  </p>
                </div>
              </div>

              {/* Fascia Name Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Fascia Name</h3>
                <p className="text-gray-600 mb-4">
                  Please fill in your company name as it should appear on the fascia board. One letter per box, max 25 characters.
                </p>
                
                {/* Example Fascia Image */}
                <div className="mb-6 text-center">
                  <h4 className="text-md font-medium text-gray-700 mb-2">Example Fascia</h4>
                  <div className="relative w-full max-w-3xl mx-auto h-64 mb-2 border border-gray-200 rounded">
                    <Image
                      src="/images/shell-shceme-booth-example.png"
                      alt="Booth Fascia Example"
                      width={800}
                      height={400}
                      className="object-contain w-full h-full"
                      onError={(e) => {
                        // Fallback image if the main one fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/800x400?text=Fascia+Example";
                        target.onerror = null;
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-500">Example of how your company name will appear on the fascia board</p>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {fasciaName.map((char, index) => (
                      <div key={`char-${index}`} className="flex flex-col items-center">
                        <input
                          type="text"
                          maxLength={1}
                          value={char}
                          onChange={(e) => handleInputChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={(e) => handlePaste(index, e)}
                          ref={(el) => { inputRefs.current[index] = el }}
                          className="w-10 h-10 border-2 border-gray-300 rounded-md text-center text-xl uppercase focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                          style={{ aspectRatio: '1/1' }}
                        />
                        <span className="text-xs text-gray-500 mt-1">{index + 1}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    Only letters, numbers, and spaces are allowed.
                  </p>
                </div>
              </div>
              
              {/* Authorization Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Authorization</h3>
                <p className="text-gray-600 mb-4">
                  Please provide the details of the authorized person for this submission.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="auth_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="auth_name"
                      name="auth_name"
                      defaultValue={userData?.contact_person || ''}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="auth_designation" className="block text-sm font-medium text-gray-700 mb-1">
                      Designation
                    </label>
                    <input
                      type="text"
                      id="auth_designation"
                      name="auth_designation"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      defaultValue={userData?.designation || ''}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="auth_company" className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      id="auth_company"
                      name="auth_company"
                      defaultValue={userData?.company_name || ''}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="auth_booth" className="block text-sm font-medium text-gray-700 mb-1">
                      Booth Number
                    </label>
                    <input
                      type="text"
                      id="auth_booth"
                      name="auth_booth"
                      defaultValue={userData?.booth_number || ''}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="auth_address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      id="auth_address"
                      name="auth_address"
                      defaultValue={userData?.address || ''}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="auth_email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="auth_email"
                      name="auth_email"
                      defaultValue={userData?.email || ''}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="auth_tel" className="block text-sm font-medium text-gray-700 mb-1">
                      Tel
                    </label>
                    <input
                      type="tel"
                      id="auth_tel"
                      name="auth_tel"
                      defaultValue={userData?.tel || ''}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="auth_tax_identification_number" className="block text-sm font-medium text-gray-700 mb-1">
                      Tax Identification Number
                    </label>
                    <input
                      type="text"
                      id="auth_tax_identification_number"
                      name="auth_tax_identification_number"
                      defaultValue={userData?.tax_identification_number || ''}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="auth_date" className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      id="auth_date"
                      name="auth_date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Review Section */}
              <div className="mb-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
                  <FormDisclaimer />
                </div>
              </div>
              
              {/* Submit button */}
              <div className="flex justify-end mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    isSubmitting
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Form'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </FormLoadingWrapper>
  )
} 