import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';
import { supabase } from '@/lib/supabase/client';

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

// Enhanced form submission function that attempts to use a server API first, 
// then falls back to direct Supabase access if needed
export async function syncFormWithSupabase(
  formData: Record<string, any>,
  userId: string | undefined
): Promise<{ success: boolean; message: string; data?: any }> {
  console.log('Starting form submission process with data:', formData);

  try {
    // Clone the data to avoid modifying the original
    const cleanedData = { ...formData };
    
    // Ensure formType is a string 
    if (typeof cleanedData.form_type !== 'string' && cleanedData.form_type !== undefined) {
      cleanedData.form_type = String(cleanedData.form_type);
    }
    
    // Remove ALL potentially problematic fields
    const fieldsToRemove = [
      'surcharge', 'id', 'inserted_at', 'updated_at', 
      'created_at', 'late_charge', 'status'
    ];
    
    fieldsToRemove.forEach(field => {
      delete cleanedData[field];
    });
    
    // Handle case where form data has items with surcharge property
    if (cleanedData.items && Array.isArray(cleanedData.items)) {
      cleanedData.items = cleanedData.items.map(item => {
        const cleanItem = { ...item };
        delete cleanItem.surcharge;
        return cleanItem;
      });
    }
    
    // Remove null/undefined values
    Object.keys(cleanedData).forEach(key => {
      if (cleanedData[key] === null || cleanedData[key] === undefined) {
        delete cleanedData[key];
      }
    });
    
    console.log('Cleaned form data:', cleanedData);
    
    // Get the current session for authentication
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    
    try {
      // Try to use the API endpoint (correct path for Next.js App Router)
      const response = await fetch('/api/form-submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          formData: cleanedData,
          userId
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Form submitted successfully via API:', result);
        return { 
          success: true, 
          message: 'Form submitted successfully!',
          data: result 
        };
      } else {
        const errorText = await response.text();
        console.error('API submission error:', response.status, errorText);
        throw new Error(`API submission failed: ${response.status} ${errorText}`);
      }
    } catch (apiError) {
      console.warn('API submission failed, falling back to direct Supabase access:', apiError);
      
      // Convert form data to a flattened format for database insertion
      const flattenedData: Record<string, any> = {
        ...cleanedData,
        user_id: userId || null
      };
      
      // For arrays or complex objects like 'items', convert to JSON string or JSONB
      for (const key in flattenedData) {
        if (typeof flattenedData[key] === 'object' && flattenedData[key] !== null) {
          // Store complex objects in a 'data' JSONB field
          if (!flattenedData.data) flattenedData.data = {};
          flattenedData.data[key] = flattenedData[key];
          delete flattenedData[key];
        }
      }
      
      console.log('Sending flattened data to Supabase:', flattenedData);
      
      // Fallback to direct Supabase submission
      const { data, error } = await (supabase as any)
        .from('form_submissions')
        .insert([flattenedData])
        .select();
      
      if (error) {
        console.error('Supabase direct submission error:', error);
        throw error;
      }
      
      console.log('Form submitted successfully via direct Supabase:', data);
      return { 
        success: true, 
        message: 'Form submitted successfully (via fallback)!',
        data 
      };
    }
  } catch (error: any) {
    console.error('Form submission error:', error);
    return { 
      success: false, 
      message: `Error submitting form: ${error.message || 'Unknown error'}`
    };
  }
} 