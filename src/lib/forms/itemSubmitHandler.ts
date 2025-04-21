import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Get Supabase client
const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(supabaseUrl, supabaseAnonKey);
};

export interface FormItem {
  item_no: number;
  item_name: string;
  description?: string;
  unit_price: number;
  quantity: number;
}

export interface FormSubmissionData {
  form_type: string;
  user_id?: string;
  late_charge?: number;
  data?: Record<string, any>;
  items: FormItem[];
}

interface FormItemRow {
  form_id: string;
  user_id: string;
  form_type: string;
  status: string;
  submitted_at: string;
  item_id?: string;
  item_no?: number;
  item_name?: string;
  description?: string;
  unit_price?: number;
  quantity?: number;
  total?: number;
  subtotal: number;
  late_charge: number;
  grand_total: number;
}

/**
 * Submits a form with individual line items to the database
 * @param formData The form data including items
 * @returns Result of the submission
 */
export async function submitFormWithItems(formData: FormSubmissionData) {
  const supabase = getSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id || formData.user_id;
  
  if (!userId) {
    console.error('No user ID available for form submission');
    return { success: false, error: 'User not authenticated' };
  }

  try {
    // Start a transaction by inserting the form first
    const { data: formData_, error: formError } = await supabase
      .from('forms')
      .insert({
        user_id: userId,
        form_type: formData.form_type,
        data: formData.data || {},
        submitted_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (formError) {
      console.error('Error creating form:', formError);
      return { success: false, error: formError.message };
    }

    const formId = formData_.id;
    
    // Prepare the items for insertion
    const itemsToInsert = formData.items.map((item, index) => ({
      form_id: formId,
      item_no: item.item_no || index + 1,
      item_name: item.item_name,
      description: item.description || '',
      unit_price: item.unit_price,
      quantity: item.quantity
    }));

    // Insert all items
    if (itemsToInsert.length > 0) {
      const { error: itemsError } = await supabase
        .from('form_items')
        .insert(itemsToInsert);

      if (itemsError) {
        console.error('Error inserting form items:', itemsError);
        // Try to clean up the form if items insertion fails
        await supabase.from('forms').delete().eq('id', formId);
        return { success: false, error: itemsError.message };
      }
    }

    // Update late charge if provided (triggers will recalculate grand total)
    if (typeof formData.late_charge === 'number') {
      const { error: updateError } = await supabase
        .from('forms')
        .update({
          data: { 
            ...formData.data,
            late_charge: formData.late_charge 
          }
        })
        .eq('id', formId);

      if (updateError) {
        console.error('Error updating late charge:', updateError);
      }
    }

    return { 
      success: true, 
      formId, 
      message: 'Form and items submitted successfully' 
    };
  } catch (error) {
    console.error('Unexpected error in form submission:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Gets all forms and their items for a user
 */
export async function getUserForms() {
  const supabase = getSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    const { data: forms, error } = await supabase
      .from('form_items_view')
      .select('*')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    // Group the results by form_id to organize items under their forms
    const formMap = new Map();
    
    forms.forEach((row: FormItemRow) => {
      if (!formMap.has(row.form_id)) {
        formMap.set(row.form_id, {
          id: row.form_id,
          form_type: row.form_type,
          status: row.status,
          submitted_at: row.submitted_at,
          subtotal: row.subtotal,
          late_charge: row.late_charge,
          grand_total: row.grand_total,
          items: []
        });
      }
      
      // Only add the item if it exists (some forms might not have items)
      if (row.item_id) {
        formMap.get(row.form_id).items.push({
          id: row.item_id,
          item_no: row.item_no,
          item_name: row.item_name,
          description: row.description,
          unit_price: row.unit_price,
          quantity: row.quantity,
          total: row.total
        });
      }
    });

    return {
      success: true,
      forms: Array.from(formMap.values())
    };
  } catch (error) {
    console.error('Error fetching user forms:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Gets a single form with all its items by form ID
 */
export async function getFormWithItems(formId: string) {
  const supabase = getSupabaseClient();
  
  try {
    const { data: rows, error } = await supabase
      .from('form_items_view')
      .select('*')
      .eq('form_id', formId)
      .order('item_no', { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    if (rows.length === 0) {
      return { success: false, error: 'Form not found' };
    }

    // Use the first row for form data
    const formData = {
      id: rows[0].form_id,
      form_type: rows[0].form_type,
      status: rows[0].status,
      submitted_at: rows[0].submitted_at,
      subtotal: rows[0].subtotal,
      late_charge: rows[0].late_charge,
      grand_total: rows[0].grand_total,
      items: rows
        .filter((row: FormItemRow) => row.item_id) // Only include rows with items
        .map((row: FormItemRow) => ({
          id: row.item_id,
          item_no: row.item_no,
          item_name: row.item_name,
          description: row.description,
          unit_price: row.unit_price,
          quantity: row.quantity,
          total: row.total
        }))
    };

    return {
      success: true,
      form: formData
    };
  } catch (error) {
    console.error('Error fetching form with items:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 