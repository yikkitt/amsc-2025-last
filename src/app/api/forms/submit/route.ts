import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

export async function POST(request: NextRequest) {
  try {
    // Initialize Supabase client
    const supabase = createRouteHandlerClient<Database>({ cookies });

    // Get current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { formData } = body;

    // Validate form data
    if (!formData) {
      return NextResponse.json(
        { error: 'Missing form data' },
        { status: 400 }
      );
    }

    // Validate form type
    const validFormTypes = [
      '1', '2', '3', '4', '5', '6', '7', '8', '9',
      1, 2, 3, 4, 5, 6, 7, 8, 9
    ];

    const formType = formData.formType || formData.form_type;
    if (!validFormTypes.includes(formType)) {
      return NextResponse.json(
        { error: `Invalid form type: ${formType}` },
        { status: 400 }
      );
    }

    // Normalize form type to string
    const normalizedFormType = String(formType);

    // Prepare form data for insertion
    const insertData = {
      user_id: user.id,
      form_type: normalizedFormType,
      data: formData,
      status: 'submitted',
      submitted_at: new Date().toISOString()
    };

    // Insert form submission
    const { data, error } = await supabase
      .from('forms')
      .insert(insertData)
      .select();

    if (error) {
      console.error('Form submission error:', error);
      return NextResponse.json(
        { error: `Error submitting form: ${error.message}` },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      data
    });

  } catch (error) {
    console.error('Form submission exception:', error);
    return NextResponse.json(
      { error: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 