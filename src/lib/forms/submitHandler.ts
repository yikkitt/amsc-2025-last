import { createClient } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { FormData } from '@/types/forms';

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
export async function syncFormWithSupabase(
  formData: FormData,
  formType: number | string
): Promise<{
  success: boolean;
  data?: any;
  message: string;
  submittedData?: FormData;
}> {
  try {
    console.log('Starting form submission to Supabase:', { formType, formData });
    
    // Get Supabase client
    const supabase = getSupabaseBrowserClient();
    
    // Get current user session - needed for RLS policies
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || !session.user) {
      console.error('No authenticated user session found');
      return {
        success: false,
        message: 'You must be logged in to submit forms. Please sign in and try again.',
      };
    }
    
    // Get the current user ID from the session
    const userId = session.user.id;
    const accessToken = session.access_token;
    console.log('Current authenticated user ID:', userId);
    
    // Ensure formType is a number
    const formId = typeof formType === 'number' ? formType : parseInt(formType.toString()) || 0;
    
    // Calculate subtotal based on items if present
    const subtotal = formData.items?.reduce(
      (acc: number, item: any) => acc + (
        (item.total || 0) || 
        (item.quantity && (item.unitCost || item.unitPrice) 
          ? item.quantity * (item.unitCost || item.unitPrice) 
          : 0)
      ),
      0
    ) || 0;
    
    // Check if past deadline
    const pastDeadline = isPastDeadline();
    
    // Calculate late charge
    const lateCharge = calculateLateCharge(formId, subtotal, pastDeadline);
    
    // Calculate grand total
    const grandTotal = subtotal + lateCharge;
    
    // Get current timestamp
    const timestamp = new Date().toISOString();
    
    // Clean the form data to remove any fields that don't exist in the database
    // Remove 'total' if it exists (since the DB uses 'grand_total')
    const cleanedFormData = { ...formData };
    if ('total' in cleanedFormData) {
      delete cleanedFormData.total;
    }
    
    // Ensure required fields exist
    const enhancedFormData = {
      ...cleanedFormData,
      // Explicitly set the user_id to the current authenticated user's ID (required for RLS)
      user_id: userId,
      items: formData.items || [],
      subtotal: subtotal,
      late_charge: lateCharge,
      grand_total: grandTotal,
      total: grandTotal, // Add total field to match grand_total
      form_type: formId,
      submission_date: timestamp,
      updated_at: timestamp,
      past_deadline: pastDeadline,
      auth_details: formData.auth_details || {
        name: '',
        designation: '',
        date: timestamp
      }
    };
    
    console.log('Prepared data for submission:', enhancedFormData);
    
    // NEW APPROACH: Use our server-side API instead of direct Supabase access
    try {
      // Make an API call to our server-side endpoint to bypass RLS issues
      const response = await fetch('/api/debug-form-submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(enhancedFormData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        console.error('API error submitting form:', result);
        return {
          success: false,
          message: `Failed to submit form: ${result.error} - ${result.details || ''}`
        };
      }
      
      console.log('Form submitted successfully via API:', result);
      
      return {
        success: true,
        data: result.data,
        submittedData: enhancedFormData,
        message: 'Form submitted successfully'
      };
    } catch (apiError) {
      console.error('Error calling form submission API:', apiError);
      
      // Fallback to direct Supabase access if API fails
      console.log('Falling back to direct Supabase submission...');
      
      // Submit to form_submissions table
      const { data, error: submissionError } = await supabase
        .from('form_submissions')
        .insert(enhancedFormData)
        .select();
        
      if (submissionError) {
        console.error('Supabase submission error:', submissionError);
        return {
          success: false,
          message: `Failed to submit form: ${submissionError.message}`,
        };
      }
      
      console.log('Form submitted successfully via fallback:', data);
      
      return {
        success: true,
        data,
        submittedData: enhancedFormData,
        message: 'Form submitted successfully'
      };
    }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error submitting form';
    console.error('Form submission error:', errorMessage);
    
    return {
      success: false,
      message: errorMessage,
    };
  }
} 