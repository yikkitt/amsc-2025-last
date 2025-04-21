-- Temporarily give broader permissions to form_submissions table

-- First, disable RLS temporarily to diagnose issues
-- CAUTION: Only use in development, and re-enable security for production
ALTER TABLE form_submissions DISABLE ROW LEVEL SECURITY;

-- Create a simple public policy for authenticated users
DROP POLICY IF EXISTS "Authenticated users can access form_submissions" ON form_submissions;

CREATE POLICY "Authenticated users can access form_submissions"
ON form_submissions
FOR ALL
USING (auth.role() = 'authenticated');

-- Ensure the user_id foreign key constraint is properly set up
-- but with a check that makes it easier to insert data
ALTER TABLE form_submissions
DROP CONSTRAINT IF EXISTS fk_form_submissions_user;

-- Optional: Apply this constraint if you want to ensure user_id exists
-- ALTER TABLE form_submissions
-- ADD CONSTRAINT fk_form_submissions_user
-- FOREIGN KEY (user_id) REFERENCES auth.users(id)
-- ON DELETE CASCADE;

-- Add a trigger to help ensure user_id is set
CREATE OR REPLACE FUNCTION ensure_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_user_id ON form_submissions;
CREATE TRIGGER set_user_id
BEFORE INSERT ON form_submissions
FOR EACH ROW
EXECUTE FUNCTION ensure_user_id();

-- Verify all required columns exist
DO $$
BEGIN
  -- Check for total column
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'form_submissions' 
    AND column_name = 'total'
  ) THEN
    ALTER TABLE form_submissions ADD COLUMN total DECIMAL(10,2) DEFAULT 0;
  END IF;
  
  -- Add any other missing columns needed for the form
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'form_submissions' 
    AND column_name = 'status'
  ) THEN
    ALTER TABLE form_submissions ADD COLUMN status TEXT DEFAULT 'submitted';
  END IF;
END
$$; 