'use client';

import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image'
import UserDataContainer from '@/components/UserDataContainer';
import { isPastDeadline, syncFormWithSupabase, checkPreviousFormSubmission } from '@/lib/forms/submitHandler';
import { PdfButton } from '@/components/ui/PdfButton';

interface ContractorPassFormProps {
  userData?: {
    company_name: string;
    booth_number: string;
    contact_person?: string;
    address?: string;
    postcode?: string;
    state?: string;
    country?: string;
    tel?: string;
    fax?: string;
    email?: string;
  } | null;
}

export default function ContractorPassForm({ userData }: ContractorPassFormProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [quantity, setQuantity] = useState<number>(0);

  // Check if form has been previously submitted
  useEffect(() => {
    const checkPreviousSubmission = async () => {
      setIsLoading(true);
      try {
        const { isSubmitted, data } = await checkPreviousFormSubmission("2", supabase);
        setFormSubmitted(isSubmitted);
        if (isSubmitted && data) {
          setSubmittedData(data.data || {});
        }
      } catch (error) {
        console.error('Error checking previous submissions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkPreviousSubmission();
  }, [supabase]);

  const unitPrice = 25.00;
  const total = quantity * unitPrice;
  const lateSurcharge = 0; // Can be calculated based on date if needed
  const grandTotal = total + lateSurcharge;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setQuantity(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      
      // Validate required fields
      const requiredFields = [
        'exhibitor_company',
        'exhibitor_booth',
        'contractor_company',
        'contractor_person',
        'mobile',
        'tel',
        'email',
        'auth_name',
        'auth_designation',
        'auth_company',
        'auth_address',
        'auth_email',
        'auth_tel'
      ];

      const missingFields = requiredFields.filter(field => !formData.get(field));
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      const formDataObj = {
        form_type: 2,
        company_data: {
          exhibitor_company: formData.get('exhibitor_company')?.toString() || '',
          exhibitor_booth: formData.get('exhibitor_booth')?.toString() || '',
          contractor_company: formData.get('contractor_company')?.toString() || '',
          contractor_person: formData.get('contractor_person')?.toString() || '',
          mobile: formData.get('mobile')?.toString() || '',
          tel: formData.get('tel')?.toString() || '',
          fax: formData.get('fax')?.toString() || '',
          email: formData.get('email')?.toString() || '',
        },
        items: [
          {
            item: 'Contractor Pass',
            quantity: quantity,
            unit_price: unitPrice,
            total: total
          }
        ],
        subtotal: total,
        late_charge: lateSurcharge,
        grand_total: grandTotal,
        auth_details: {
          name: formData.get('auth_name')?.toString() || '',
          designation: formData.get('auth_designation')?.toString() || '',
          company: formData.get('auth_company')?.toString() || '',
          address: formData.get('auth_address')?.toString() || '',
          email: formData.get('auth_email')?.toString() || '',
          tel: formData.get('auth_tel')?.toString() || '',
          fax: formData.get('auth_fax')?.toString() || '',
          date: formData.get('auth_date')?.toString() || new Date().toISOString(),
        }
      };

      // Use syncFormWithSupabase for submission
      const result = await syncFormWithSupabase(formDataObj);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      // Store submitted data for reference
      setSubmittedData(formDataObj);
      setFormSubmitted(true);
      
      // Show success message
      alert("Form submitted successfully!");
    } catch (error) {
      console.error('Error submitting form:', error);
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
      setIsSubmitting(false);
    }
  };

  // Handle navigation back to order forms after viewing PDF
  const handleReturnToDashboard = () => {
    router.push('/dashboard/order-forms');
  };

  return (
    <div ref={formRef} className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md">
      {/* Form Header */}
      <div className="text-center mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-2xl font-bold mb-2 text-blue-600">FORM 2</h1>
        <h2 className="text-xl font-semibold mb-4">CONTRACTOR PASS APPLICATION FORM</h2>
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
              formType={2}
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
          {/* Exhibitor Details */}
          <div className="mb-8 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-700 mb-4">Exhibitor Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700">Company Name</label>
                <input
                  type="text"
                  name="exhibitor_company"
                  defaultValue={userData?.company_name}
                  className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700">Booth No.</label>
                <input
                  type="text"
                  name="exhibitor_booth"
                  defaultValue={userData?.booth_number}
                  className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Contractor Details */}
          <div className="mb-8 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-700 mb-4">Contractor Details</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700">Company Name</label>
                <input type="text" name="contractor_company" className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700">Contact Person</label>
                <input type="text" name="contractor_person" className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700">Mobile No.</label>
                <input type="tel" name="mobile" className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700">Tel No.</label>
                <input type="tel" name="tel" className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700">Fax No.</label>
                <input type="tel" name="fax" className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700">Email</label>
                <input type="email" name="email" className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          {/* Order Table */}
          <div className="mb-8 overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-gray-300 p-2 text-center">Item</th>
                  <th className="border border-gray-300 p-2 text-center">Quantity</th>
                  <th className="border border-gray-300 p-2 text-center">Unit Price (RM)</th>
                  <th className="border border-gray-300 p-2 text-center">Total (RM)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2">Contractor Pass</td>
                  <td className="border border-gray-300 p-2 text-center">
                    <input 
                      type="number" 
                      name="quantity" 
                      className="w-24 text-center border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mx-auto" 
                      min="0"
                      step="any"
                      value={quantity}
                      onChange={handleQuantityChange}
                    />
                  </td>
                  <td className="border border-gray-300 p-2 text-center">25.00</td>
                  <td className="border border-gray-300 p-2 text-center">{total.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={2} className="border border-gray-300 p-2"></td>
                  <td className="border border-gray-300 p-2 text-right">Late Surcharge:<br/>(if applicable)</td>
                  <td className="border border-gray-300 p-2 text-center">{lateSurcharge.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={2} className="border border-gray-300 p-2"></td>
                  <td className="border border-gray-300 p-2 text-right font-bold">Total Amount:</td>
                  <td className="border border-gray-300 p-2 text-center font-bold">{grandTotal.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Important Notes */}
          <div className="mb-8 bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-700 mb-4">Important Notes:</h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Each contractor pass is priced at RM 25.00 after the deadline of June 30, 2025.</li>
              <li>Official Contractor will not issue any contractor badges during tear down, therefore please ensure that you have order in advance the sufficient number of badges to be used during build up as well as the tear down.</li>
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
              <h5 className="font-bold mb-4 text-blue-600">Authorized Representative Applying:-</h5>
              <p className="text-gray-600 mb-4">(Please type or attach business name card)</p>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1 text-gray-700">Authorized by</label>
                    <input 
                      type="text" 
                      name="auth_name" 
                      className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                      defaultValue={userData?.contact_person || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-700">Booth No</label>
                    <input 
                      type="text" 
                      name="auth_booth" 
                      className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                      defaultValue={userData?.booth_number || ''}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-700">Designation</label>
                  <input type="text" name="auth_designation" className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-700">Company Address</label>
                  <textarea 
                    name="auth_address" 
                    className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                    rows={2}
                    defaultValue={userData?.address || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-700">Email</label>
                  <input 
                    type="email" 
                    name="auth_email" 
                    className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    defaultValue={userData?.email || ''}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1 text-gray-700">Tel/Hp</label>
                    <input 
                      type="tel" 
                      name="auth_tel" 
                      className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      defaultValue={userData?.tel || ''}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-700">Fax</label>
                    <input 
                      type="tel" 
                      name="auth_fax" 
                      className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      defaultValue={userData?.fax || ''}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1 text-gray-700">Signature</label>
                    <input type="text" name="auth_signature" className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-700">Date</label>
                    <input 
                      type="date" 
                      name="auth_date" 
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
  );
} 