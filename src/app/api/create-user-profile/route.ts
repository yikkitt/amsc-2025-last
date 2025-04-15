import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseApiClient } from '@/lib/supabase/api';

export const dynamic = 'force-dynamic';

// Define interface for user data
interface UserData {
  id: string;
  email: string;
  company_name: string;
  booth_number: string;
  contact_person: string;
  address: string;
  telephone: string;
  tel: string;
  fax?: string;
  postcode?: string;
  state?: string;
  country?: string;
}

/**
 * API route to create a user profile in the amsc_2025_user table
 */
export async function POST(request: NextRequest) {
  console.log('Received request to create user profile');
  
  try {
    const requestData = await request.json();
    console.log('Request data received:', {
      id: requestData.id ? 'Provided' : 'Missing',
      email: requestData.email ? 'Provided' : 'Missing',
      company_name: requestData.company_name ? 'Provided' : 'Missing'
    });
    
    // Validate request data
    if (!requestData.id) {
      console.error('Missing required field: id');
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      );
    }
    
    if (!requestData.email) {
      console.error('Missing required field: email');
      return NextResponse.json(
        { error: 'Missing required field: email' },
        { status: 400 }
      );
    }
    
    // Use the API client
    const supabaseAdmin = createSupabaseApiClient();
    
    // Prepare the data for insertion/update
    const userData: UserData = {
      id: requestData.id,
      email: requestData.email,
      company_name: requestData.company_name || '',
      booth_number: requestData.booth_number || '',
      contact_person: requestData.contact_person || '',
      address: requestData.address || '',
      telephone: requestData.telephone || '',
      tel: requestData.tel || requestData.telephone || ''
    };
    
    // Add optional fields if they exist
    if (requestData.fax) userData.fax = requestData.fax;
    if (requestData.postcode) userData.postcode = requestData.postcode;
    if (requestData.state) userData.state = requestData.state;
    if (requestData.country) userData.country = requestData.country;
    
    // First check if the table exists to provide better error messages
    console.log('Checking if amsc_2025_user table exists...');
    try {
      // Instead of using RPC which might not be available, use a more basic approach
      const { data: schemas, error: schemaError } = await supabaseAdmin
        .from('pg_catalog.pg_tables')
        .select('schemaname,tablename')
        .eq('schemaname', 'public');
        
      if (schemaError) {
        console.error('Error checking schema:', schemaError);
      } else {
        console.log('Tables in public schema:', schemas);
        
        // Check if our target table exists
        const tableExists = schemas && Array.isArray(schemas) && 
          schemas.some(table => table.tablename === 'amsc_2025_user');
          
        if (!tableExists) {
          console.error('Database table amsc_2025_user does not exist in public schema!');
          return NextResponse.json(
            { error: 'Table amsc_2025_user does not exist - database setup issue' },
            { status: 500 }
          );
        }
      }
    } catch (e) {
      console.error('Error checking schema directly:', e);
      // Continue anyway, the main operation will fail with a more specific error
      // if there's a problem
    }
    
    // Check if user already exists to determine if we need insert or update
    console.log(`Checking if user profile with ID ${requestData.id} already exists...`);
    const { data: existingUser, error: userCheckError } = await supabaseAdmin
      .from('amsc_2025_user')
      .select('id')
      .eq('id', requestData.id)
      .single();
    
    if (userCheckError && userCheckError.code !== 'PGRST116') {
      console.error('Error checking for existing user:', userCheckError);
      return NextResponse.json(
        { error: `Database error: ${userCheckError.message}` },
        { status: 500 }
      );
    }
    
    // Insert or update the user
    let result;
    if (existingUser) {
      console.log(`User ${requestData.id} exists, updating...`);
      const { data, error } = await supabaseAdmin
        .from('amsc_2025_user')
        .update(userData)
        .eq('id', requestData.id)
        .select();
      
      if (error) {
        console.error('Error updating user profile:', error);
        return NextResponse.json(
          { error: `Database error updating user: ${error.message}` },
          { status: 500 }
        );
      }
      
      result = data;
      console.log('User profile updated successfully');
    } else {
      console.log(`User ${requestData.id} does not exist, inserting...`);
      
      // Simplified insert approach - only include required fields to avoid schema errors
      // Use any type to avoid TypeScript errors with dynamic properties
      const insertData: Record<string, any> = {
        id: requestData.id,
        email: requestData.email
      };
      
      // Add other fields only if they exist in the userData object
      if (userData.company_name) insertData.company_name = userData.company_name;
      if (userData.booth_number) insertData.booth_number = userData.booth_number;
      if (userData.contact_person) insertData.contact_person = userData.contact_person;
      if (userData.address) insertData.address = userData.address;
      if (userData.telephone) insertData.telephone = userData.telephone;
      if (userData.tel) insertData.tel = userData.tel;
      if (userData.fax) insertData.fax = userData.fax;
      if (userData.postcode) insertData.postcode = userData.postcode;
      if (userData.state) insertData.state = userData.state;
      if (userData.country) insertData.country = userData.country;
      
      const { data, error } = await supabaseAdmin
        .from('amsc_2025_user')
        .insert(insertData)
        .select();
      
      if (error) {
        console.error('Error inserting user profile:', error);
        return NextResponse.json(
          { error: `Database error inserting user: ${error.message}` },
          { status: 500 }
        );
      }
      
      result = data;
      console.log('User profile created successfully');
    }
    
    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    console.error('Unexpected error in create-user-profile API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Server error: ${errorMessage}` },
      { status: 500 }
    );
  }
} 