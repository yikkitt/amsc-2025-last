'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import Image from 'next/image'
import UserDataContainer from '@/components/UserDataContainer';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quantity, setQuantity] = useState<number>(0);
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

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
      const { error } = await supabase.from('form_submissions').insert({
        form_type: 2,
        company_data: {
          exhibitor_company: formData.get('exhibitor_company'),
          exhibitor_booth: formData.get('exhibitor_booth'),
          contractor_company: formData.get('contractor_company'),
          contractor_person: formData.get('contractor_person'),
          mobile: formData.get('mobile'),
          tel: formData.get('tel'),
          fax: formData.get('fax'),
          email: formData.get('email'),
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
          name: formData.get('auth_name'),
          designation: formData.get('auth_designation'),
          company: formData.get('auth_company'),
          address: formData.get('auth_address'),
          email: formData.get('auth_email'),
          tel: formData.get('auth_tel'),
          fax: formData.get('auth_fax'),
          date: formData.get('auth_date'),
        }
      });

      if (error) throw error;
      // router.refresh();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md">
      {/* Form Header */}
      <div className="text-center mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-2xl font-bold mb-2 text-blue-600">FORM 2</h1>
        <h2 className="text-xl font-semibold mb-4">CONTRACTOR PASS APPLICATION FORM</h2>
        <p className="text-gray-600 mb-2">DEADLINE: June 30, 2025</p>
        <h3 className="text-lg font-semibold mb-2">Aesthetic Medicine & Surgery Conference & Exhibition 2025</h3>
        <p className="text-gray-600">Kuala Lumpur Convention Centre</p>
      </div>

      {/* User Data Container */}
      <UserDataContainer userData={userData} />

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
    </div>
  );
} 