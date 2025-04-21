-- Fix RLS policies for form_submissions table

-- First, enable row level security if not already enabled
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view own submissions" ON form_submissions;
DROP POLICY IF EXISTS "Users can insert own submissions" ON form_submissions;
DROP POLICY IF EXISTS "Users can update own submissions" ON form_submissions;

-- Create the select policy
CREATE POLICY "Users can view own submissions"
ON form_submissions
FOR SELECT
USING (auth.uid() = user_id);

-- Create the insert policy
CREATE POLICY "Users can insert own submissions"
ON form_submissions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create the update policy
CREATE POLICY "Users can update own submissions"
ON form_submissions
FOR UPDATE
USING (auth.uid() = user_id);

-- Allow service role to access form_submissions
CREATE POLICY "Service role can access all form submissions"
ON form_submissions
USING (auth.role() = 'service_role');

-- Print confirmation message
DO $$
BEGIN
  RAISE NOTICE 'Form submissions RLS policies updated successfully';
END $$; 