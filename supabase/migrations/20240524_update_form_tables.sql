-- Check if form_submissions table exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'form_submissions') THEN
    -- Create the form_submissions table if it doesn't exist
    CREATE TABLE form_submissions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL,
      form_type INTEGER NOT NULL,
      company_data JSONB NOT NULL DEFAULT '{}',
      items JSONB NOT NULL DEFAULT '[]',
      subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
      late_charge DECIMAL(10,2) NOT NULL DEFAULT 0,
      grand_total DECIMAL(10,2) NOT NULL DEFAULT 0,
      submitted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
      past_deadline BOOLEAN DEFAULT FALSE,
      payment_details JSONB NOT NULL DEFAULT '{}',
      auth_details JSONB NOT NULL DEFAULT '{}',
      status TEXT DEFAULT 'submitted'
    );

    -- Add foreign key if amsc_2025_user table exists
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'amsc_2025_user') THEN
      ALTER TABLE form_submissions
        ADD CONSTRAINT fk_form_submissions_user
        FOREIGN KEY (user_id)
        REFERENCES amsc_2025_user(id)
        ON DELETE CASCADE;
    END IF;

    -- Add unique constraint on user_id and form_type
    ALTER TABLE form_submissions
      ADD CONSTRAINT form_submissions_user_form_unique
      UNIQUE (user_id, form_type);

    -- Enable Row Level Security
    ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

    -- Create policies for form_submissions
    CREATE POLICY "Users can view own submissions"
      ON form_submissions
      FOR SELECT
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert own submissions"
      ON form_submissions
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update own submissions"
      ON form_submissions
      FOR UPDATE
      USING (auth.uid() = user_id);
  ELSE
    -- If table exists, add any missing columns
    -- Check for updated_at column
    IF NOT EXISTS (
      SELECT 1 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'form_submissions' 
      AND column_name = 'updated_at'
    ) THEN
      ALTER TABLE form_submissions 
      ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());
    END IF;

    -- Check for past_deadline column
    IF NOT EXISTS (
      SELECT 1 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'form_submissions' 
      AND column_name = 'past_deadline'
    ) THEN
      ALTER TABLE form_submissions 
      ADD COLUMN past_deadline BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Check for status column
    IF NOT EXISTS (
      SELECT 1 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'form_submissions' 
      AND column_name = 'status'
    ) THEN
      ALTER TABLE form_submissions 
      ADD COLUMN status TEXT DEFAULT 'submitted';
    END IF;

    -- Make sure default values are set correctly
    ALTER TABLE form_submissions
      ALTER COLUMN company_data SET DEFAULT '{}',
      ALTER COLUMN items SET DEFAULT '[]',
      ALTER COLUMN payment_details SET DEFAULT '{}',
      ALTER COLUMN auth_details SET DEFAULT '{}';
  END IF;
END
$$;

-- Check if form_configs table exists and create it if not
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'form_configs') THEN
    -- Create the form_configs table
    CREATE TABLE form_configs (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      late_charge_type TEXT NOT NULL CHECK (late_charge_type IN ('none', 'percentage', 'lumpsum')),
      late_charge_value DECIMAL(10,2) NOT NULL DEFAULT 0,
      deadline TIMESTAMP WITH TIME ZONE NOT NULL,
      items JSONB NOT NULL DEFAULT '[]'
    );

    -- Enable Row Level Security
    ALTER TABLE form_configs ENABLE ROW LEVEL SECURITY;

    -- Create policy to allow all authenticated users to read form configs
    CREATE POLICY "Authenticated users can view form configs"
      ON form_configs
      FOR SELECT
      USING (auth.role() = 'authenticated');

    -- Insert initial form configurations
    INSERT INTO form_configs (id, name, late_charge_type, late_charge_value, deadline) VALUES
      (1, 'Fascia Name Form for Shell Scheme', 'lumpsum', 150, '2025-06-30 23:59:59+00'),
      (2, 'Contractor Pass Application Form', 'lumpsum', 100, '2025-06-30 23:59:59+00'),
      (3, 'Electrical & Lighting Order Form', 'percentage', 10, '2025-06-30 23:59:59+00'),
      (4, 'Furniture Order Form', 'percentage', 30, '2025-06-30 23:59:59+00'),
      (5, 'Printing Order Form', 'percentage', 30, '2025-06-30 23:59:59+00'),
      (6, 'Performance Bond Form', 'lumpsum', 100, '2025-06-30 23:59:59+00'),
      (7, 'Admin Fees Form', 'lumpsum', 100, '2025-06-30 23:59:59+00'),
      (8, 'Letter of Indemnity', 'none', 0, '2025-06-30 23:59:59+00');
  END IF;
END
$$;

-- Create a view for forms with user information
CREATE OR REPLACE VIEW form_submissions_with_user AS
SELECT 
  fs.id,
  fs.form_type,
  fs.company_data,
  fs.items,
  fs.subtotal,
  fs.late_charge,
  fs.grand_total,
  fs.submitted_at,
  fs.updated_at,
  fs.status,
  fs.past_deadline,
  fs.auth_details,
  u.company_name,
  u.contact_person,
  u.booth_number,
  u.email
FROM 
  form_submissions fs
JOIN 
  amsc_2025_user u ON fs.user_id = u.id;

-- Add necessary indexes
CREATE INDEX IF NOT EXISTS idx_form_submissions_user_id ON form_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_form_type ON form_submissions(form_type);
CREATE INDEX IF NOT EXISTS idx_form_submissions_submitted_at ON form_submissions(submitted_at); 