'use client'

import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import FormSubmitActions from './FormSubmitActions';

interface FasciaNameFormProps {
  userData?: {
    company_name: string;
    booth_number: string;
    contact_person?: string;
    email?: string;
  } | null;
}

const FasciaNameForm = ({ userData }: FasciaNameFormProps) => {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fasciaText, setFasciaText] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
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

  return (
    <div ref={formRef} className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md">
      {/* Form Header */}
      <div className="text-center mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-2xl font-bold mb-2 text-blue-600">FORM 1</h1>
        <h2 className="text-xl font-semibold mb-4">FASCIA NAME FORM FOR SHELL SCHEME</h2>
        <p className="text-gray-600 mb-2">DEADLINE: June 30, 2025</p>
        <h3 className="text-lg font-semibold mb-2">Aesthetic Medicine & Surgery Conference & Exhibition 2025</h3>
        <p className="text-gray-600">Kuala Lumpur Convention Centre</p>
      </div>

      {/* User Data Display */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-4">Exhibitor Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Company Name</p>
            <p className="font-medium">{userData?.company_name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Booth Number</p>
            <p className="font-medium">{userData?.booth_number || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Contact Person</p>
            <p className="font-medium">{userData?.contact_person || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="font-medium">{userData?.email || 'N/A'}</p>
          </div>
        </div>
      </div>

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

      {/* Form Actions */}
      <FormSubmitActions
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
        formData={formData}
        formType={1}
        containerRef={formRef}
        onSuccess={() => {
          console.log('Form submitted successfully');
          setTimeout(() => {
            router.push('/dashboard/order-forms');
          }, 3000);
        }}
        className="mt-6"
      />
    </div>
  );
};

export default FasciaNameForm; 