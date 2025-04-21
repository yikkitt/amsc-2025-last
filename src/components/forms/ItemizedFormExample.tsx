import { useState } from 'react';
import { FormItem, FormSubmissionData, submitFormWithItems } from '@/lib/forms/itemSubmitHandler';

interface ItemizedFormExampleProps {
  formType: string;
  companyName: string;
  boothNumber: string;
}

export default function ItemizedFormExample({ formType, companyName, boothNumber }: ItemizedFormExampleProps) {
  const [items, setItems] = useState<FormItem[]>([
    { item_no: 1, item_name: '', description: '', unit_price: 0, quantity: 1 }
  ]);
  const [lateCharge, setLateCharge] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [success, setSuccess] = useState<boolean | null>(null);

  // Calculate subtotal and grand total
  const subtotal = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  const grandTotal = subtotal + lateCharge;

  // Handle adding a new item
  const addItem = () => {
    setItems([
      ...items,
      { item_no: items.length + 1, item_name: '', description: '', unit_price: 0, quantity: 1 }
    ]);
  };

  // Handle removing an item
  const removeItem = (index: number) => {
    if (items.length <= 1) return; // Keep at least one item
    
    // Remove the item and renumber remaining items
    const newItems = items.filter((_, i) => i !== index).map((item, i) => ({
      ...item,
      item_no: i + 1
    }));
    
    setItems(newItems);
  };

  // Handle item field changes
  const updateItem = (index: number, field: keyof FormItem, value: string | number) => {
    const newItems = [...items];
    
    // For numeric fields, ensure we have a number
    if (field === 'unit_price' || field === 'quantity') {
      const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
      newItems[index] = {
        ...newItems[index],
        [field]: numValue
      };
    } else if (field === 'item_name' || field === 'description') {
      const strValue = String(value);
      newItems[index] = {
        ...newItems[index],
        [field]: strValue
      };
    } else if (field === 'item_no') {
      const numValue = typeof value === 'string' ? parseInt(value, 10) || 0 : value;
      newItems[index] = {
        ...newItems[index],
        [field]: numValue
      };
    }
    
    setItems(newItems);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setSuccess(null);

    try {
      // Validate items
      const validItems = items.filter(item => item.item_name.trim() !== '');
      
      if (validItems.length === 0) {
        setMessage('Please add at least one item with a name');
        setSuccess(false);
        setIsSubmitting(false);
        return;
      }

      // Prepare form data
      const formData: FormSubmissionData = {
        form_type: formType,
        late_charge: lateCharge,
        data: {
          companyName,
          boothNumber,
          notes: 'Submitted via new itemized form'
        },
        items: validItems
      };

      // Submit the form
      const result = await submitFormWithItems(formData);
      
      if (result.success) {
        setMessage(result.message || 'Form submitted successfully!');
        setSuccess(true);
        // Reset form
        setItems([{ item_no: 1, item_name: '', description: '', unit_price: 0, quantity: 1 }]);
        setLateCharge(0);
      } else {
        setMessage(result.error || 'Error submitting form');
        setSuccess(false);
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      setMessage('An unexpected error occurred');
      setSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">{formType} Form</h2>
      
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-700"><span className="font-semibold">Company:</span> {companyName}</p>
        </div>
        <div>
          <p className="text-gray-700"><span className="font-semibold">Booth Number:</span> {boothNumber}</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Items Table */}
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-2 px-3 border-b w-16">No.</th>
                <th className="py-2 px-3 border-b">Item Name</th>
                <th className="py-2 px-3 border-b">Description</th>
                <th className="py-2 px-3 border-b w-24">Unit Price</th>
                <th className="py-2 px-3 border-b w-20">Qty</th>
                <th className="py-2 px-3 border-b w-24">Total</th>
                <th className="py-2 px-3 border-b w-16">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3 text-center">{item.item_no}</td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      className="w-full p-1 border rounded"
                      value={item.item_name}
                      onChange={(e) => updateItem(index, 'item_name', e.target.value)}
                      required
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      className="w-full p-1 border rounded"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full p-1 border rounded"
                      value={item.unit_price}
                      onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                      required
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      min="1"
                      className="w-full p-1 border rounded"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      required
                    />
                  </td>
                  <td className="py-2 px-3 text-right">
                    ${(item.unit_price * item.quantity).toFixed(2)}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeItem(index)}
                    >
                      &times;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={7} className="p-2">
                  <button
                    type="button"
                    className="bg-blue-50 text-blue-600 px-3 py-1 rounded border border-blue-200 hover:bg-blue-100"
                    onClick={addItem}
                  >
                    + Add Item
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        {/* Totals */}
        <div className="flex justify-end mb-6">
          <div className="w-64 border border-gray-300 rounded">
            <div className="flex justify-between p-2 border-b">
              <span className="font-semibold">Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-2 border-b">
              <span className="font-semibold">Late Charge:</span>
              <div className="flex items-center">
                $
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-20 p-1 border rounded ml-1"
                  value={lateCharge}
                  onChange={(e) => setLateCharge(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
            <div className="flex justify-between p-2 font-bold">
              <span>Grand Total:</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Form'}
          </button>
        </div>
        
        {/* Status Message */}
        {message && (
          <div className={`mt-4 p-3 rounded ${success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
} 