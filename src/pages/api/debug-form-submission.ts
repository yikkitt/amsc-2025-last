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
    // Parse the form data from the request body
    const formData = req.body;
    console.log('Received form data:', formData);
    
    // Create Supabase client with service role key for admin access
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
    
    // Get the user's session from the request headers
    const authHeader = req.headers.authorization;
    let userId;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      // Verify the token and get the user ID
      const { data: userData, error: authError } = await supabaseAdmin.auth.getUser(token);
      
      if (authError) {
        console.error('Error verifying user token:', authError);
        return res.status(401).json({ error: 'Unauthorized', details: authError.message });
      }
      
      userId = userData.user?.id;
      console.log('Verified user ID:', userId);
    } else {
      return res.status(401).json({ error: 'Unauthorized - No valid authentication token provided' });
    }
    
    // Prepare the data with the verified user ID
    const submission = {
      ...formData,
      user_id: userId,
      updated_at: new Date().toISOString(),
      submission_date: new Date().toISOString()
    };
    
    console.log('Submitting to form_submissions:', submission);
    
    // Insert into form_submissions table using service role
    const { data, error } = await supabaseAdmin
      .from('form_submissions')
      .insert(submission)
      .select();
    
    if (error) {
      console.error('Error inserting form submission:', error);
      return res.status(500).json({ 
        error: 'Failed to insert form submission', 
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