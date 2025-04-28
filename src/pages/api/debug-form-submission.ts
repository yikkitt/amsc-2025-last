import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', allowedMethod: 'POST' });
  }

  try {
    // Parse the request body
    const { formData, userId: providedUserId, formType } = req.body;
    
    if (!formData) {
      return res.status(400).json({ error: 'Missing form data' });
    }
    
    console.log('Received form data:', JSON.stringify(formData));
    console.log('Provided user ID:', providedUserId);
    console.log('Form type:', formType);
    
    // Create Supabase client with service role key for admin access
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('Missing Supabase URL or service role key');
      return res.status(500).json({ 
        error: 'Server configuration error', 
        details: 'Missing required environment variables'
      });
    }
    
    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    // Get the user's session from the request headers
    const authHeader = req.headers.authorization;
    let userId = providedUserId;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        // Verify the token and get the user ID
        const { data: userData, error: authError } = await supabaseAdmin.auth.getUser(token);
        
        if (authError) {
          console.error('Error verifying user token:', authError);
          // Continue with provided userId if available, don't fail the request
          if (!userId) {
            console.warn('No valid user ID available, proceeding with anonymous submission');
          }
        } else {
          // Use the token's user ID if no user ID was provided
          if (!userId && userData.user) {
            userId = userData.user.id;
            console.log('Using user ID from token:', userId);
          }
        }
      } catch (tokenError) {
        console.error('Error processing authentication token:', tokenError);
        // Continue with provided userId
      }
    }
    
    if (!userId) {
      console.warn('No user ID available. Proceeding with an anonymous submission.');
      userId = ''; // Use empty string for anonymous submissions
    }
    
    // Get form type from the data
    const formTypeToUse = formType || formData.formType || formData.form_type || 'unknown';
    console.log('Form type to use:', formTypeToUse);
    
    // Prepare the data to insert
    const submission = {
      user_id: userId,
      form_type: formTypeToUse.toString(),
      data: formData,
      status: 'submitted',
      submitted_at: new Date().toISOString()
    };
    
    console.log('Submitting to forms table:', JSON.stringify(submission, null, 2));
    
    // Insert into forms table using service role
    const { data, error } = await supabaseAdmin
      .from('forms')
      .insert(submission)
      .select();
    
    if (error) {
      console.error('Error inserting form data:', error);
      return res.status(500).json({ 
        error: 'Failed to insert form data', 
        details: error.message,
        code: error.code,
        hint: error.hint
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Form submitted successfully', 
      data 
    });
  } catch (error: any) {
    console.error('Unexpected error in form submission API:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
} 