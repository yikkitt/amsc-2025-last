const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTestUser() {
  try {
    // Create user profile directly with service role key
    const { data, error } = await supabase
      .from('amsc_2025_user')
      .insert([
        {
          company_name: 'Test Company',
          contact_person: 'Test User',
          address: 'Test Address',
          booth_number: 'TEST-001',
          telephone: '0123456789',
          email: 'yikkit97@hotmail.com'
        }
      ])
      .select();

    if (error) {
      throw error;
    }

    console.log('Test user profile created:', data);
  } catch (error) {
    console.error('Error creating test user:', error);
  }
}

createTestUser(); 