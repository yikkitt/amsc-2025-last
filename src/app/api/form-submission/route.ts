import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create authenticated Supabase client using the service role key
// This bypasses RLS policies for debugging purposes
const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

export async function POST(request: NextRequest) {
  try {
    console.log('Form submission API handler invoked');
    
    // Parse request body
    const body = await request.json();
    const { formData, userId } = body;
    
    console.log('Form submission details:', { 
      formType: formData?.form_type, 
      userId,
      itemCount: formData?.items?.length || 0
    });
    
    if (!formData) {
      console.error('Missing required form data fields');
      return NextResponse.json(
        { success: false, message: 'Missing required form data' },
        { status: 400 }
      );
    }
    
    try {
      // Create admin client that bypasses RLS
      const supabase = createAdminClient();
      
      // Clean formData again to ensure no problematic fields
      const cleanedData = { ...formData };
      
      // Remove ALL potentially problematic fields
      ['surcharge', 'id', 'inserted_at', 'updated_at', 'created_at'].forEach(field => {
        delete cleanedData[field];
      });
      
      // Special handling for complex data structures
      const processedData: Record<string, any> = {
        form_type: cleanedData.form_type || cleanedData.formType,
        company_name: cleanedData.company_name,
        booth_number: cleanedData.booth_number,
        user_id: userId || null,
        data: {} // Store complex objects in JSONB data field
      };
      
      // Store objects and arrays in the data JSONB field
      for (const key in cleanedData) {
        if (key !== 'form_type' && key !== 'company_name' && key !== 'booth_number' && key !== 'user_id') {
          if (typeof cleanedData[key] === 'object') {
            processedData.data[key] = cleanedData[key];
          } else {
            // Add primitive values directly to the top level
            processedData[key] = cleanedData[key];
          }
        }
      }
      
      console.log('Processed data for submission:', processedData);
      
      // Format submission timestamp
      const timestamp = new Date().toISOString();
      processedData.updated_at = timestamp;
      
      // Check for existing submission if we have a userId
      let existingSubmission = null;
      
      if (userId && processedData.form_type) {
        const { data: existingData, error: checkError } = await supabase
          .from('form_submissions')
          .select('id')
          .match({ 
            user_id: userId, 
            form_type: processedData.form_type 
          })
          .maybeSingle();
          
        if (checkError) {
          console.error('Error checking for existing submission:', checkError);
        } else {
          existingSubmission = existingData;
        }
      }
      
      let result;
      
      if (existingSubmission?.id) {
        // Update existing submission
        console.log(`Updating existing submission ID: ${existingSubmission.id}`);
        result = await supabase
          .from('form_submissions')
          .update(processedData)
          .eq('id', existingSubmission.id)
          .select();
      } else {
        // Create new submission
        console.log('Creating new form submission');
        processedData.created_at = timestamp;
        result = await supabase
          .from('form_submissions')
          .insert([processedData])
          .select();
      }
      
      const { data, error } = result;
      
      if (error) {
        console.error('Error submitting form to database:', error);
        
        // Handle specific error cases
        if (error.code === '42703') {
          return NextResponse.json(
            { 
              success: false, 
              message: 'Database schema error: Column does not exist',
              details: error
            },
            { status: 400 }
          );
        }
        
        if (error.code === '23505') {
          return NextResponse.json(
            { 
              success: false, 
              message: 'A submission for this form already exists',
              details: error
            },
            { status: 409 }
          );
        }
        
        // Generic error response
        return NextResponse.json(
          { 
            success: false, 
            message: `Database error: ${error.message}`,
            details: error
          },
          { status: 500 }
        );
      }
      
      console.log('Form submission successful:', data?.[0]?.id);
      return NextResponse.json({
        success: true,
        message: 'Form submitted successfully',
        data: data
      });
      
    } catch (dbError) {
      console.error('Database operation error:', dbError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Database operation failed',
          details: dbError instanceof Error ? dbError.message : String(dbError)
        },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Unhandled error in form submission API:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Server error processing form submission',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 