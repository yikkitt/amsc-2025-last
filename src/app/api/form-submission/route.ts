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
      
      // Clean formData to remove problematic fields
      const cleanedData = { ...formData };
      delete cleanedData.surcharge;
      delete cleanedData.id;
      delete cleanedData.inserted_at;
      delete cleanedData.updated_at;
      
      // Set user_id field
      if (userId) {
        cleanedData.user_id = userId;
      }
      
      // Format submission timestamp
      const timestamp = new Date().toISOString();
      
      // Check for existing submission if we have a userId
      let existingSubmission = null;
      
      if (userId && formData.form_type) {
        const { data: existingData, error: checkError } = await supabase
          .from('form_submissions')
          .select('id')
          .match({ 
            user_id: userId, 
            form_type: formData.form_type 
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
          .update({
            ...cleanedData,
            updated_at: timestamp
          })
          .eq('id', existingSubmission.id)
          .select();
      } else {
        // Create new submission
        console.log('Creating new form submission with data:', cleanedData);
        result = await supabase
          .from('form_submissions')
          .insert([{
            ...cleanedData,
            created_at: timestamp,
            updated_at: timestamp
          }])
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