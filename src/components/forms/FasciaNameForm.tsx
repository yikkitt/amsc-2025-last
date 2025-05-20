'use client'

import React, { useState, FormEvent, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import UserDataContainer from '@/components/UserDataContainer'
import { isPastDeadline, syncFormWithSupabase, checkPreviousFormSubmission } from '@/lib/forms/submitHandler'
import { PdfButton } from '@/components/ui/PdfButton'

interface FasciaNameFormProps {
  userData?: {
    company_name: string;
    booth_number: string;
    contact_person?: string;
    address?: string;
    postcode?: string;
    state?: string;
    country?: string;
    tel?: string;
    tax_identification_number?: string;
    email?: string;
  } | null;
}

interface FormWrapperProps {
  children: React.ReactNode
  formId: number
  onSubmit: (data: FormData) => Promise<void>
}

export const FasciaNameForm: React.FC<FasciaNameFormProps> = ({ userData }) => {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<any>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const [fasciaText, setFasciaText] = useState<string>(''.padEnd(25, ' '))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  
  // Initialize inputRefs with the correct length (25 boxes)
  useEffect(() => {
    inputRefs.current = Array(25).fill(null);
  }, []);
  
  // Prepare form data whenever fasciaText changes
  const [formData, setFormData] = useState({
    company_data: {
      company_name: userData?.company_name || '',
      booth_number: userData?.booth_number || '',
      contact_person: userData?.contact_person || '',
      email: userData?.email || '',
    },
    fascia_name: fasciaText,
    items: [],
  });

  // Update form data when fasciaText or userData changes
  useEffect(() => {
    setFormData(prevData => ({
      ...prevData,
      fascia_name: fasciaText,
      company_data: {
        company_name: userData?.company_name || '',
        booth_number: userData?.booth_number || '',
        contact_person: userData?.contact_person || '',
        email: userData?.email || '',
      }
    }));
  }, [fasciaText, userData]);

  // Check if form has been previously submitted
  useEffect(() => {
    const checkPreviousSubmission = async () => {
      setIsLoading(true)
      try {
        const { isSubmitted, data } = await checkPreviousFormSubmission("1", supabase)
        setFormSubmitted(isSubmitted)
        if (isSubmitted && data) {
          setSubmittedData(data.data || {})
        }
      } catch (error) {
        console.error('Error checking previous submissions:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkPreviousSubmission()
  }, [supabase])

  // Handle input change and auto-focus to next box
  const handleInputChange = (index: number, value: string) => {
    // Accept letters, numbers, and space
    if (value && !/^[A-Z0-9 ]$/.test(value.toUpperCase())) {
      return;
    }

    // Update the fasciaName state
    const newFasciaName = fasciaText.split('');
    newFasciaName[index] = value.toUpperCase();
    setFasciaText(newFasciaName.join(''));

    // Focus the next input if a character was entered (and it's not a space)
    if (value && index < 24) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 10);
    }
  };

  // Handle backspace key to move to previous box
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !fasciaText[index]) {
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
  };

  // Handle paste to fill multiple boxes
  const handlePaste = (index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').toUpperCase();
    // Allow spaces in the pasted text
    const validChars = pastedText.replace(/[^A-Z0-9 ]/g, '').slice(0, 25 - index);
    
    if (validChars) {
      const newFasciaName = fasciaText.split('');
      
      for (let i = 0; i < validChars.length; i++) {
        if (index + i < 25) {
          newFasciaName[index + i] = validChars[i];
        }
      }
      
      setFasciaText(newFasciaName.join(''));
      
      // Focus the box after the last filled box
      const nextIndex = Math.min(index + validChars.length, 24);
      setTimeout(() => {
        inputRefs.current[nextIndex]?.focus();
      }, 10);
    }
  };

  // Handle navigation back to order forms after viewing PDF
  const handleReturnToDashboard = () => {
    router.push('/');
  }

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (isPastDeadline()) {
      alert('The submission deadline for this form has passed.')
      setIsSubmitting(false)
      return
    }

    const formData = new FormData()
    formData.append('form_type', '1')
    formData.append('company_name', userData?.company_name || '')
    formData.append('booth_number', userData?.booth_number || '')
    formData.append('fascia_name', fasciaText.trim())
    formData.append('contact_person', userData?.contact_person || '')
    formData.append('address', userData?.address || '')
    formData.append('postcode', userData?.postcode || '')
    formData.append('state', userData?.state || '')
    formData.append('country', userData?.country || '')
    formData.append('telephone', userData?.tel || '')
    formData.append('tax_identification_number', userData?.tax_identification_number || '')
    formData.append('email', userData?.email || '')

    try {
      const result = await syncFormWithSupabase(Object.fromEntries(formData))
      if (result.success) {
        setFormSubmitted(true)
        setSubmittedData(Object.fromEntries(formData))
      } else {
        alert(result.message || 'Failed to submit form')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('An error occurred while submitting the form')
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
        <p className="text-gray-600 mb-2">DEADLINE: 30th June 2025</p>
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
      ) : formSubmitted ? (
        <div className="space-y-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="text-green-600 font-semibold text-lg mb-2">
              Form Successfully Submitted
            </div>
            <p className="text-gray-600">
              You have already submitted this form. You can download a PDF copy or return to the dashboard.
            </p>
          </div>
          <div className="flex justify-center space-x-6">
            <PdfButton
              formData={submittedData || {}}
              formType={1}
              containerRef={formRef}
              className="px-8 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
            />
            <button
              type="button"
              onClick={handleReturnToDashboard}
              className="px-8 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      ) : (
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
                    ref={el => { inputRefs.current[i] = el }}
                    type="text"
                    maxLength={1}
                    className="w-10 h-10 border border-gray-300 rounded text-center uppercase font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={fasciaText[i] || ''}
                    onChange={(e) => handleInputChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={(e) => handlePaste(i, e)}
                    autoComplete="off"
                  />
                ))}
              </div>
              {/* Second row: 12 boxes */}
              <div className="flex gap-1 justify-center">
                {Array(12).fill(0).map((_, i) => (
                  <input
                    key={i + 13}
                    ref={el => { inputRefs.current[i + 13] = el }}
                    type="text"
                    maxLength={1}
                    className="w-10 h-10 border border-gray-300 rounded text-center uppercase font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={fasciaText[i + 13] || ''}
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

          {/* Download Button Only */}
          <div className="flex justify-center mt-6">
            <PdfButton
              formData={formData}
              formType={1}
              containerRef={formRef}
              className="w-full md:w-auto"
            />
          </div>
        </form>
      )}
    </div>
  )
} 