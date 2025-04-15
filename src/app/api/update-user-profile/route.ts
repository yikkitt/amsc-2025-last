import { createSupabaseApiClient } from '@/lib/supabase/api';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

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
 * API route to update or create a user profile in the amsc_2025_user table
 */
export async function POST(request: NextRequest) {
  console.log('Received request to update user profile');
  
  try {
    // Log the request headers for debugging
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    
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
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }
    
    if (!requestData.email) {
      console.error('Missing required field: email');
      return NextResponse.json(
        { error: 'Missing required field: email' },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }
    
    // Use the API client
    const supabaseAdmin = createSupabaseApiClient()
    
    // Check if we're using a temporary user ID (for demo purposes)
    const isTemporaryUser = requestData.id === '00000000-0000-0000-0000-000000000000';
    console.log('Is using temporary user ID:', isTemporaryUser);
    
    if (isTemporaryUser) {
      // For temporary users, just return success with sample data
      // This helps with testing when no actual user is authenticated
      
      console.log('Using temporary user mode - returning mock success');
      
      return NextResponse.json(
        { 
          success: true, 
          data: [{
            id: requestData.id,
            email: requestData.email,
            company_name: requestData.company_name,
            booth_number: requestData.booth_number,
            contact_person: requestData.contact_person,
            telephone: requestData.telephone,
            tel: requestData.tel,
            address: requestData.address,
            created_at: new Date().toISOString()
          }],
          note: "Using temporary user mode"
        },
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }
    
    // Prepare the user data for real users
    const userData: Partial<UserData> = {
      id: requestData.id,
      email: requestData.email,
    };
    
    // Add other fields if provided
    if (requestData.company_name) userData.company_name = requestData.company_name;
    if (requestData.booth_number) userData.booth_number = requestData.booth_number;
    if (requestData.contact_person) userData.contact_person = requestData.contact_person;
    if (requestData.address) userData.address = requestData.address;
    if (requestData.telephone) userData.telephone = requestData.telephone;
    if (requestData.tel) userData.tel = requestData.tel || requestData.telephone;
    if (requestData.fax) userData.fax = requestData.fax;
    if (requestData.postcode) userData.postcode = requestData.postcode;
    if (requestData.state) userData.state = requestData.state;
    if (requestData.country) userData.country = requestData.country;
    
    console.log('Checking for existing user profile with ID:', requestData.id);
    
    // Check if the user already exists
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('amsc_2025_user')
      .select('id')
      .eq('id', requestData.id)
      .single();
    
    if (checkError) {
      console.log('Check error:', checkError);
    }
    
    let result;
    
    // Insert or update based on whether the user exists
    if (!existingUser || checkError) {
      console.log('User does not exist, inserting new record');
      
      // User doesn't exist - insert new record with required fields
      const insertData: Record<string, any> = {
        id: requestData.id,
        email: requestData.email,
        company_name: requestData.company_name || 'My Company',
        booth_number: requestData.booth_number || 'TBD',
        contact_person: requestData.contact_person || requestData.email.split('@')[0],
        telephone: requestData.telephone || '',
        tel: requestData.tel || requestData.telephone || '',
        address: requestData.address || '',
      };
      
      const { data, error } = await supabaseAdmin
        .from('amsc_2025_user')
        .insert(insertData)
        .select();
      
      if (error) {
        console.error('Error inserting user profile:', error);
        return NextResponse.json(
          { error: `Database error: ${error.message}` },
          { 
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          }
        );
      }
      
      result = data;
      console.log('User profile created successfully');
    } else {
      console.log('User exists, updating record');
      
      // User exists - update the record
      const { data, error } = await supabaseAdmin
        .from('amsc_2025_user')
        .update(userData)
        .eq('id', requestData.id)
        .select();
      
      if (error) {
        console.error('Error updating user profile:', error);
        return NextResponse.json(
          { error: `Database error: ${error.message}` },
          { 
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          }
        );
      }
      
      result = data;
      console.log('User profile updated successfully');
    }
    
    return NextResponse.json(
      { success: true, data: result },
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  } catch (error: any) {
    console.error('Error in update-user-profile API:', error);
    return NextResponse.json(
      { error: `Server error: ${error.message || 'Unknown error'}` },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}

// Add support for OPTIONS requests (CORS preflight)
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
} 