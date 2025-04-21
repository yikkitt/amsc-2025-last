import { createClient } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { FormData } from '@/types/forms';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

/**
 * Checks if the current date is past the form submission deadline
 * @returns Boolean indicating if current date is past the deadline
 */
export function isPastDeadline(): boolean {
  const deadlineDate = new Date('2025-06-30T23:59:59');
  const currentDate = new Date();
  return currentDate > deadlineDate;
}

/**
 * Calculates the late charge for a form based on the form ID, subtotal, and whether it's past the deadline
 * @param formId The ID of the form (1-8)
 * @param subtotal The subtotal amount before late charges
 * @param isPastDeadline Whether the submission is past the deadline
 * @returns The calculated late charge amount
 */
export function calculateLateCharge(
  formId: number,
  subtotal: number,
  isPastDeadline: boolean
): number {
  // If not past deadline, no late charge
  if (!isPastDeadline) {
    return 0;
  }

  // Calculate late charge based on form ID
  switch (formId) {
    case 1:
      // Form 1: Fascia Name Form - Flat rate of RM 150
      return 150;
    case 2:
      // Form 2: Contractor Pass Application Form - Flat rate of RM 100
      return 100;
    case 3:
      // Form 3: Electrical & Lighting Order Form - 10% of subtotal
      return subtotal * 0.1;
    case 4:
      // Form 4: Furniture Order Form - 30% of subtotal
      return subtotal * 0.3;
    case 5:
      // Form 5: Printing Order Form - 30% of subtotal
      return subtotal * 0.3;
    case 6:
      // Form 6: Performance Bond - Flat rate of RM 100
      return 100;
    case 7:
      // Form 7: Admin Fees - Flat rate of RM 100
      return 100;
    case 8:
      // Form 8: Letter of Indemnity - No late charge
      return 0;
    default:
      // Any other forms have no late charge
      return 0;
  }
}

/**
 * Submits form data to the database
 * @param formData The form data to submit
 * @param formId The ID of the form being submitted
 * @returns Object with success status and data/error
 */
export async function submitForm(
  formData: any,
  formId: number
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    // Calculate subtotal based on items if present
    const subtotal = formData.items?.reduce(
      (acc: number, item: any) => acc + (item.total || 0),
      0
    ) || 0;

    // Check if past deadline
    const pastDeadline = isPastDeadline();
    
    // Calculate late charge
    const lateCharge = calculateLateCharge(formId, subtotal, pastDeadline);
    
    // Prepare data with totals
    const dataToSubmit = {
      ...formData,
      subtotal,
      late_charge: lateCharge,
      grand_total: subtotal + lateCharge,
      form_id: formId,
      submission_date: new Date().toISOString(),
      past_deadline: pastDeadline
    };

    // Insert into appropriate table
    const { data, error } = await supabase
      .from('form_submissions')
      .insert(dataToSubmit)
      .select();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
}

/**
 * Enhanced form submission that ensures consistent data formatting and error handling
 * This function is designed to be the central submission handler for all forms
 * 
 * @param formData The form data to submit
 * @param formType The type of form (number or string)
 * @returns Object with success status, data and message
 */
export async function syncFormWithSupabase(formData: any, formType: number) {
  try {
    console.log('Starting form submission with data:', formData);
    
    // Get current user from supabase
    const supabase = createClientComponentClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, submittedData: null, message: "User not authenticated." };
    }

    // Determine form_id
    const form_id = Number(formType);
    
    // Normalize items field (could be items or orderItems depending on form type)
    let normalizedItems = [];
    if (formData.items && Array.isArray(formData.items)) {
      normalizedItems = formData.items
        .filter((item: any) => item.quantity > 0)
        .map((item: any) => {
          // Keep only the essential data for each item (especially description)
          return {
            description: item.description,
            quantity: item.quantity,
            unitCost: item.unitCost || item.price || 0,
            total: item.total || (item.quantity * (item.unitCost || item.price || 0)),
            // Add any other essential fields needed for reporting
            id: item.id
          };
        });
    } else if (formData.orderItems && Array.isArray(formData.orderItems)) {
      normalizedItems = formData.orderItems
        .filter((item: any) => item.quantity > 0)
        .map((item: any) => ({
          description: item.description,
          quantity: item.quantity,
          price: item.price || item.unitCost || 0,
          total: item.total || (item.quantity * (item.price || item.unitCost || 0))
        }));
    }
    
    // Prepare standardized data structure for submission
    const dataToSubmit = {
      // Add user identification
      user_id: user.id,
      
      // Add form identification
      form_type: form_id,
      form_id: form_id, // For backward compatibility with existing code
      
      // Add company information
      company_data: formData.company_data || {},
      
      // Add standardized items array
      items: normalizedItems,
      
      // Add financial data
      subtotal: formData.subtotal || 0,
      late_charge: formData.late_charge || 0,
      grand_total: formData.grand_total || 0,
      
      // Add timestamps
      submission_date: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      
      // Add authorization details if available
      auth_details: formData.auth_details || {}
    };
    
    console.log('Submitting standardized data to Supabase:', dataToSubmit);
    
    // Submit to Supabase
    const { data, error } = await supabase
      .from('form_submissions')
      .insert(dataToSubmit)
      .select('*')
      .single();
      
    if (error) {
      console.error("Error submitting form to Supabase:", error);
      return { success: false, submittedData: null, message: error.message };
    }
    
    console.log('Form submission successful:', data);
    return { 
      success: true, 
      submittedData: data, 
      message: "Form submitted successfully." 
    };
  } catch (error) {
    console.error("Error in syncFormWithSupabase:", error);
    return { 
      success: false, 
      submittedData: null, 
      message: error instanceof Error ? error.message : "An unknown error occurred." 
    };
  }
} 