import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { FormData } from '@/types/forms';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Global singleton instance for Supabase client
let globalSupabaseInstance: SupabaseClient | null = null;

/**
 * Creates a singleton Supabase client to avoid multiple GoTrueClient instances
 */
export const getSupabaseClient = (): SupabaseClient => {
  // For server-side rendering
  if (typeof window === 'undefined') {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
  }
  
  // Client-side singleton pattern
  if (!globalSupabaseInstance) {
    console.log('Creating single global Supabase client instance');
    globalSupabaseInstance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        auth: {
          persistSession: true,
          storage: window.localStorage,
          storageKey: 'amsc-supabase-auth', // Use app-specific key
          autoRefreshToken: true,
          detectSessionInUrl: false // Disable to prevent extra instances
        }
      }
    );
  }
  
  return globalSupabaseInstance;
};

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
    const supabase = getSupabaseClient();

    // Calculate subtotal based on items if present
    const subtotal = formData.items?.reduce(
      (acc: number, item: any) => acc + (parseFloat(item.total) || 0),
      0
    ) || 0;

    // Check if past deadline
    const pastDeadline = isPastDeadline();
    
    // Calculate late charge
    const lateCharge = calculateLateCharge(formId, subtotal, pastDeadline);
    
    // Ensure grand_total is never null
    const grandTotal = subtotal + lateCharge || 0;
    if (isNaN(grandTotal) || grandTotal === null) {
      throw new Error("Invalid grand total calculation");
    }
    
    // Prepare data with totals
    const dataToSubmit = {
      ...formData,
      subtotal: subtotal || 0,
      late_charge: lateCharge || 0,
      grand_total: grandTotal,
      form_type: formId, // Use form_type instead of form_id
      submitted_at: new Date().toISOString(),
      status: 'submitted'
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

// Helper function to normalize items data with strict number handling
function normalizeItems(items: any[]) {
  if (!items || !Array.isArray(items)) return [];
  
  return items
    .filter(item => item && typeof item === 'object') // Only process valid items
    .map(item => ({
      description: item.description || '',
      quantity: parseInt(item.quantity) || 0,
      unitCost: parseFloat(item.unitCost) || 0,
      total: parseFloat(item.total) || (parseInt(item.quantity) || 0) * (parseFloat(item.unitCost) || 0)
    }));
}

/**
 * Enhanced form submission with proper data validation and error handling
 */
export const syncFormWithSupabase = async (formData: any, formType: number): Promise<{ success: boolean; submittedData?: any; message: string }> => {
  try {
    console.log('Starting form submission to Supabase:', { formType });
    
    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return { success: false, message: 'You must be logged in to submit a form' };
    }
    
    // Clean input data
    const cleanedFormData = {...formData};
    // Remove any fields that don't exist in the database schema
    if ('surcharge' in cleanedFormData) delete cleanedFormData.surcharge;
    if ('submission_date' in cleanedFormData) delete cleanedFormData.submission_date;
    if ('form_id' in cleanedFormData) delete cleanedFormData.form_id;
    
    // Normalize items for consistent data format and proper number handling
    const normalizedItems = cleanedFormData.items ? normalizeItems(cleanedFormData.items) : [];
    
    // Calculate financial totals with strict number handling
    const subtotalValue = parseFloat(cleanedFormData.subtotal) || 
                          normalizedItems.reduce((sum, item) => sum + (item.total || 0), 0);
    const lateChargeValue = parseFloat(cleanedFormData.late_charge) || 0;
    
    // Ensure grand_total is never null and is a valid number
    const grandTotalValue = subtotalValue + lateChargeValue;
    if (isNaN(grandTotalValue)) {
      return { 
        success: false, 
        message: 'Invalid total calculation. Please check your amounts.'
      };
    }
    
    // Prepare data in exact format matching database schema
    const submissionData = {
      user_id: user.id,
      form_type: formType,
      company_data: cleanedFormData.company_data || {},
      items: normalizedItems,
      subtotal: subtotalValue,
      late_charge: lateChargeValue,
      grand_total: grandTotalValue, // This must never be null
      total: grandTotalValue, // For backward compatibility
      submitted_at: new Date().toISOString(),
      auth_details: cleanedFormData.auth_details || {},
      status: 'submitted',
      payment_details: {}
    };
    
    console.log('Prepared submission data:', submissionData);
    
    // Check for existing submission
    const { data: existingSubmission, error: checkError } = await supabase
      .from('form_submissions')
      .select('id')
      .match({ user_id: user.id, form_type: formType })
      .maybeSingle();
      
    if (checkError) {
      console.error('Error checking for existing submission:', checkError);
    }
    
    let result;
    
    // If submission exists, update it
    if (existingSubmission?.id) {
      console.log('Updating existing submission:', existingSubmission.id);
      result = await supabase
        .from('form_submissions')
        .update({
          ...submissionData,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSubmission.id);
    } else {
      // Create new submission
      console.log('Creating new submission');
      result = await supabase
        .from('form_submissions')
        .insert([submissionData]);
    }
    
    const { error } = result;
    
    if (error) {
      console.error('Error submitting form to Supabase:', error);
      return { 
        success: false, 
        message: `Database error: ${error.message}` 
      };
    }
    
    return { 
      success: true, 
      submittedData: submissionData, 
      message: 'Form submitted successfully' 
    };
  } catch (error) {
    console.error('Exception in syncFormWithSupabase:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}; 