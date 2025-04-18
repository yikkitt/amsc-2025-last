'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import UserDataContainer from '@/components/UserDataContainer'
import { isPastDeadline } from '@/lib/forms/submitHandler'

interface OrderItem {
  id: string
  description: string
  dimension: string
  unitCost: number
  quantity: number
  image: string
}

interface FurnitureOrderFormProps {
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

export default function FurnitureOrderForm({ userData }: FurnitureOrderFormProps) {
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { id: '201', description: 'Information Desk', dimension: '1030 x 540 x 760 mm', unitCost: 80.00, quantity: 0, image: '/products/info-desk.jpg' },
    { id: '202', description: 'Lockable Cupboard', dimension: '1030 x 540 x 760mm H', unitCost: 115.00, quantity: 0, image: '/products/lockable-cupboard.jpg' },
    { id: '203', description: 'Low Round Table', dimension: '800Ø x 750 mm H', unitCost: 130.00, quantity: 0, image: '/products/low-round-table.jpg' },
    { id: '204', description: 'Tall Round Table', dimension: '600Ø x 1000 mm H', unitCost: 150.00, quantity: 0, image: '/products/tall-round-table.jpg' },
    { id: '205', description: 'Oscar Bar Stool', dimension: '440Ø x 440 x 1210 mm H', unitCost: 115.00, quantity: 0, image: '/products/bar-stool.jpg' },
    { id: '206', description: 'Folding Chair', dimension: '450 x 400 x 770 mm', unitCost: 30.00, quantity: 0, image: '/products/folding-chair.jpg' },
    { id: '207', description: 'Brochure Rack Zig Zag', dimension: '320 x 600 x 1380mm H', unitCost: 170.00, quantity: 0, image: '/products/brochure-rack.jpg' },
    { id: '208', description: 'Shelf (Slope flat) please indicate', dimension: '1000 x 310 mm', unitCost: 60.00, quantity: 0, image: '/products/shelf.jpg' },
    { id: '209', description: 'Discussion Table Crystal D3', dimension: '900Ø x 760 mm H', unitCost: 150.00, quantity: 0, image: '/products/discussion-table.jpg' },
    { id: '210', description: 'Curved Chair', dimension: '470 x 400 x 800mm H', unitCost: 90.00, quantity: 0, image: '/products/curved-chair.jpg' },
    { id: '211', description: 'Glass Top Coffee Table', dimension: '600 x 600 x 520mm H', unitCost: 100.00, quantity: 0, image: '/products/coffee-table.jpg' },
    { id: '212', description: 'Sofa Black', dimension: '740 x 740 x 750 mm H', unitCost: 250.00, quantity: 0, image: '/products/sofa-black.jpg' },
    { id: '213', description: 'Black Leather Arm Chair', dimension: '560 x 560 x 760 mm H', unitCost: 80.00, quantity: 0, image: '/products/arm-chair.jpg' },
    { id: '214', description: 'Square Table', dimension: '600 x 600 x 760 mm H', unitCost: 130.00, quantity: 0, image: '/products/square-table.jpg' },
    { id: '216', description: 'Low Display Cube', dimension: '500 x 500 x 500 mm H', unitCost: 95.00, quantity: 0, image: '/products/low-cube.jpg' },
    { id: '217', description: 'High Display Cube', dimension: '500 x 500 x 760 mm H', unitCost: 120.00, quantity: 0, image: '/products/high-cube.jpg' },
    { id: '218', description: 'Refrigerator (Medium)', dimension: '490 x 540 x 825 mm H', unitCost: 450.00, quantity: 0, image: '/products/refrigerator-medium.jpg' },
    { id: '219', description: 'Refrigerator (Small)', dimension: '439 x 470 x 510 mm H', unitCost: 300.00, quantity: 0, image: '/products/refrigerator-small.jpg' },
    { id: '220', description: 'Low Showcase (c/w 1m White LED Strip)', dimension: '1030mm x 535mm x 1030mm H', unitCost: 390.00, quantity: 0, image: '/products/low-showcase.jpg' },
    { id: '221', description: 'High Showcase (c/w 2 units Downlight)', dimension: '1030mm x 535mm x 2000mm H', unitCost: 530.00, quantity: 0, image: '/products/high-showcase.jpg' },
    { id: '222', description: 'AMES Discussion Table', dimension: '800 x 800 x 750 mm H', unitCost: 125.00, quantity: 0, image: '/products/ames-table.jpg' },
    { id: '223', description: 'Wooden Leg Chair (White/Black)', dimension: '470 x 420 x 820 mm H', unitCost: 75.00, quantity: 0, image: '/products/wooden-leg-chair.jpg' },
  ])

  const handleQuantityChange = (id: string, value: number) => {
    setOrderItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, value) } : item
      )
    )
  }

  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.unitCost * item.quantity), 0)
  }

  const subtotal = calculateSubtotal()

  const isLateOrder = isPastDeadline()
  const lateCharge = isLateOrder ? subtotal * 0.3 : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Filter items with quantity > 0
      const selectedItems = orderItems
        .filter(item => item.quantity > 0)
        .map(item => ({
          ...item,
          total: item.quantity * item.unitCost
        }));
        
      if (selectedItems.length === 0) {
        alert('Please select at least one item before submitting.');
        setIsSubmitting(false);
        return;
      }
      
      // Create form data object
      const formData = {
        form_type: 4,
        company_data: {
          company_name: userData?.company_name || '',
          booth_number: userData?.booth_number || '',
          contact_person: userData?.contact_person || '',
          email: userData?.email || '',
        },
        items: selectedItems,
        subtotal: subtotal,
        late_charge: lateCharge,
        total: subtotal + lateCharge,
        auth_details: {
          name: '',
          designation: '',
          date: new Date().toISOString(),
        }
      };

      const { error } = await supabase.from('form_submissions').insert(formData)

      if (error) throw error
      // router.refresh()
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
        <h1 className="text-2xl font-bold mb-2 text-blue-600">FORM 4</h1>
        <h2 className="text-xl font-semibold mb-4">FURNITURE ORDER FORM</h2>
        <p className="text-gray-600 mb-2">DEADLINE: June 30, 2025</p>
        <h3 className="text-lg font-semibold mb-2">Aesthetic Medicine & Surgery Conference & Exhibition 2025</h3>
        <p className="text-gray-600">Kuala Lumpur Convention Centre</p>
      </div>

      {/* User Data Container */}
      <UserDataContainer userData={userData} />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Instructions */}
        <div className="space-y-2 text-sm">
          <p>This form must be completed and returned by every exhibitor. If service is not required, please endorse "NOT APPLICABLE" and return this form to the address below.</p>
          <p className="font-bold">*ORDER ONLY YOUR ADDITIONAL REQUIREMENTS.</p>
        </div>

        {/* Order Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-2 text-left">NO</th>
                <th className="border p-2 text-left">IMAGE</th>
                <th className="border p-2 text-left">DESCRIPTION OF SERVICE / ITEMS</th>
                <th className="border p-2 text-left">DIMENSION (L x W x H)</th>
                <th className="border p-2 text-right">UNIT COST (RM)</th>
                <th className="border p-2 text-center">QTY</th>
                <th className="border p-2 text-right">COST (RM)</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item) => (
                <tr key={item.id}>
                  <td className="border p-2">{item.id}</td>
                  <td className="border p-2 relative">
                    <div className="relative group w-14 h-14 cursor-pointer">
                      <img 
                        src={item.image} 
                        alt={item.description}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          // Fall back to a generic image or placeholder if the image fails to load
                          e.currentTarget.src = "https://via.placeholder.com/100x100?text=No+Image";
                          e.currentTarget.onerror = null; // Prevent infinite fallback loop
                        }}
                      />
                      <div className="absolute top-0 left-0 w-0 h-0 bg-white opacity-0 group-hover:opacity-100 group-hover:w-48 group-hover:h-48 transition-all duration-200 z-10 overflow-hidden rounded shadow-lg">
                        <img 
                          src={item.image} 
                          alt={item.description} 
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            // Fall back to a generic image or placeholder if the image fails to load
                            e.currentTarget.src = "https://via.placeholder.com/200x200?text=No+Image";
                            e.currentTarget.onerror = null; // Prevent infinite fallback loop
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="border p-2">{item.description}</td>
                  <td className="border p-2">{item.dimension}</td>
                  <td className="border p-2 text-right">{item.unitCost.toFixed(2)}</td>
                  <td className="border p-2">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                      className="w-20 text-center border rounded p-1"
                    />
                  </td>
                  <td className="border p-2 text-right">
                    {(item.unitCost * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="font-bold bg-gray-50">
                <td colSpan={6} className="border p-2 text-right">TOTAL COST (RM)</td>
                <td className="border p-2 text-right">{subtotal.toFixed(2)}</td>
              </tr>
              <tr className="font-bold bg-gray-50">
                <td colSpan={6} className="border p-2 text-right">LATE CHARGE (RM)</td>
                <td className="border p-2 text-right">{lateCharge.toFixed(2)}</td>
              </tr>
              <tr className="font-bold bg-gray-50">
                <td colSpan={6} className="border p-2 text-right">TOTAL COST INCLUDING LATE CHARGE (RM)</td>
                <td className="border p-2 text-right">{(subtotal + lateCharge).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
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
                  <input type="text" className="w-full border-2 rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Designation</label>
                  <input type="text" className="w-full border-2 rounded p-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Company</label>
                <input 
                  type="text" 
                  className="w-full border-2 rounded p-2"
                  defaultValue={userData?.company_name || ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Booth No</label>
                <input 
                  type="text" 
                  className="w-full border-2 rounded p-2"
                  defaultValue={userData?.booth_number || ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <textarea className="w-full border-2 rounded p-2" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Tel</label>
                  <input type="tel" className="w-full border-2 rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Fax</label>
                  <input type="tel" className="w-full border-2 rounded p-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input type="email" className="w-full border-2 rounded p-2" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Signature</label>
                  <input type="text" className="w-full border-2 rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input type="date" className="w-full border-2 rounded p-2" />
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