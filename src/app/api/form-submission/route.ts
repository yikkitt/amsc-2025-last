import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body
    const body = await request.json();
    const { formData, userId } = body;

    if (!formData) {
      return NextResponse.json(
        { error: 'Missing form data' },
        { status: 400 }
      );
    }

    console.log('API received form submission:', { formData, userId });

    // Create a Supabase client with the service role key
    // This bypasses RLS policies and allows admin-level access
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Remove problematic fields to ensure clean data
    const cleanedData = { ...formData };
    delete cleanedData.surcharge;
    delete cleanedData.id;
    delete cleanedData.inserted_at;
    delete cleanedData.updated_at;

    // Set the user_id field
    cleanedData.user_id = userId || null;

    // Insert the form data using the admin client
    const { data, error } = await supabaseAdmin
      .from('form_submissions')
      .insert([cleanedData])
      .select();

    if (error) {
      console.error('Form submission API error:', error);
      return NextResponse.json(
        { error: error.message, details: error, formData: cleanedData },
        { status: 500 }
      );
    }

    console.log('Form submission API success:', data);
    return NextResponse.json({ success: true, data });
    
  } catch (error: any) {
    console.error('Unexpected error in form submission API:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 