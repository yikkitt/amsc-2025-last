import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';
import { supabase } from '@/lib/supabase/client';
import { standardizeFormData, validateFormData } from './standardizeFormData';

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

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Insert into appropriate table
    const { data, error } = await supabase
      .from('forms')
      .insert({
        user_id: user?.id || null,
        form_type: formId.toString(),
        data: dataToSubmit,
        status: 'submitted',
        submitted_at: new Date().toISOString()
      })
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
 * Synchronizes form data with Supabase
 * @param formData - The form data to submit
 * @param userId - The user ID (optional)
 * @returns Object with success status and message
 */
export async function syncFormWithSupabase(
  formData: Record<string, any>,
  userId?: string
): Promise<{ success: boolean; message: string }> {
  try {
    console.log("Syncing form data with Supabase:", formData);
    console.log("User ID:", userId);

    // Extract form number from formType
    const formNumber = parseInt(String(formData.formType || formData.form_type || '0'), 10);
    if (isNaN(formNumber) || formNumber < 1 || formNumber > 8) {
      return { success: false, message: `Invalid form type: ${formData.formType}` };
    }
    
    // Standardize the form data
    const standardizedData = standardizeFormData(formData, formNumber);
    
    // Validate the standardized data
    const validation = validateFormData(standardizedData);
    if (!validation.valid) {
      return { success: false, message: `Form validation failed: ${validation.errors.join(', ')}` };
    }

    console.log("Standardized data:", standardizedData);

    // Try to submit to API endpoint first
    try {
      console.log("Attempting API submission");
      
      const token = (await supabase.auth.getSession())?.data?.session?.access_token;
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch("/api/debug-form-submission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          formData: standardizedData,
          userId: userId,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "API submission failed");
      }

      console.log("API submission successful:", result);
      return { success: true, message: "Form submitted successfully via API" };
    } catch (apiError) {
      console.error("API submission failed, falling back to direct access:", apiError);
      
      // Fall back to direct Supabase access
      const { error } = await supabase
        .from('form_submissions')
        .insert({
          ...standardizedData,
          user_id: userId,
          submitted_at: new Date().toISOString(),
        });

      if (error) {
        console.error("Supabase submission error:", error);
        return { 
          success: false, 
          message: `Form submission failed: ${error.message}` 
        };
      }

      return { success: true, message: "Form submitted successfully via direct access" };
    }
  } catch (error: any) {
    console.error("Form submission error:", error);
    return {
      success: false,
      message: `Form submission failed: ${error.message || "Unknown error"}`,
    };
  }
} 