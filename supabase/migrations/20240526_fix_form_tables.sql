-- Comprehensive fix for form submission tables
-- This migration ensures both 'forms' and 'form_submissions' tables exist and reconciles them

-- 1. First ensure 'forms' table exists with proper structure
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'forms') THEN
    CREATE TABLE public.forms (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id),
      form_type TEXT NOT NULL,
      status TEXT DEFAULT 'submitted',
      data JSONB DEFAULT '{}'::JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Enable RLS but with permissive policies for debugging
    ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;
    
    -- Grant permissions
    GRANT ALL ON public.forms TO authenticated;
    GRANT ALL ON public.forms TO service_role;
    
    -- Create permissive policy for debugging
    CREATE POLICY "Allow authenticated users full access to forms"
      ON public.forms
      USING (true)
      WITH CHECK (true);
  ELSE
    -- Ensure forms table has all required columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = 'forms' AND column_name = 'data') THEN
      ALTER TABLE public.forms ADD COLUMN data JSONB DEFAULT '{}'::JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = 'forms' AND column_name = 'submitted_at') THEN
      ALTER TABLE public.forms ADD COLUMN submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
  END IF;
END
$$;

-- 2. Fix the form_submissions table to make it compatible with the app
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'form_submissions') THEN
    -- Add the grand_total column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = 'form_submissions' AND column_name = 'grand_total') THEN
      ALTER TABLE public.form_submissions ADD COLUMN grand_total DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    -- Make sure NOT NULL constraint is relaxed on grand_total
    BEGIN
      ALTER TABLE public.form_submissions ALTER COLUMN grand_total DROP NOT NULL;
    EXCEPTION WHEN OTHERS THEN
      -- Column might not have NOT NULL constraint
      NULL;
    END;
    
    -- Ensure that all other common columns exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = 'form_submissions' AND column_name = 'subtotal') THEN
      ALTER TABLE public.form_submissions ADD COLUMN subtotal DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = 'form_submissions' AND column_name = 'late_charge') THEN
      ALTER TABLE public.form_submissions ADD COLUMN late_charge DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    -- Temporarily disable RLS to diagnose issues
    ALTER TABLE public.form_submissions DISABLE ROW LEVEL SECURITY;
    
    -- Create permissive policy
    DROP POLICY IF EXISTS "Allow all access to form_submissions" ON public.form_submissions;
    CREATE POLICY "Allow all access to form_submissions"
      ON public.form_submissions
      USING (true)
      WITH CHECK (true);
    
    -- Re-enable RLS with permissive policy
    ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
  END IF;
END
$$;

-- 3. Create a trigger to auto-populate grand_total if it's NULL
CREATE OR REPLACE FUNCTION public.set_grand_total_if_null()
RETURNS TRIGGER AS $$
BEGIN
  -- For form_submissions table
  IF TG_TABLE_NAME = 'form_submissions' THEN
    IF NEW.grand_total IS NULL THEN
      NEW.grand_total := COALESCE(NEW.subtotal, 0) + COALESCE(NEW.late_charge, 0);
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply trigger to form_submissions table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'form_submissions') THEN
    DROP TRIGGER IF EXISTS set_grand_total_on_insert ON public.form_submissions;
    CREATE TRIGGER set_grand_total_on_insert
      BEFORE INSERT OR UPDATE ON public.form_submissions
      FOR EACH ROW
      EXECUTE FUNCTION public.set_grand_total_if_null();
  END IF;
END
$$;

-- 4. Create a view that combines data from both tables for backward compatibility
CREATE OR REPLACE VIEW form_data_combined AS
  -- Get data from forms table
  SELECT 
    f.id,
    f.user_id,
    f.form_type,
    f.status,
    f.data,
    COALESCE((f.data->>'subtotal')::DECIMAL, 0) as subtotal,
    COALESCE((f.data->>'late_charge')::DECIMAL, 0) as late_charge,
    COALESCE((f.data->>'grand_total')::DECIMAL, 0) as grand_total,
    f.submitted_at,
    f.updated_at,
    'forms' as source_table
  FROM 
    public.forms f
  
  UNION ALL
  
  -- Get data from form_submissions table if it exists
  SELECT 
    fs.id,
    fs.user_id,
    fs.form_type::TEXT, -- Ensure consistent type
    COALESCE(fs.status, 'submitted') as status,
    COALESCE(fs.data, '{}'::JSONB) as data,
    COALESCE(fs.subtotal, 0) as subtotal,
    COALESCE(fs.late_charge, 0) as late_charge,
    COALESCE(fs.grand_total, 0) as grand_total,
    fs.submitted_at,
    fs.updated_at,
    'form_submissions' as source_table
  FROM 
    public.form_submissions fs
  WHERE 
    EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'form_submissions');

-- Grant access to the view
GRANT SELECT ON form_data_combined TO authenticated;
GRANT SELECT ON form_data_combined TO service_role; 