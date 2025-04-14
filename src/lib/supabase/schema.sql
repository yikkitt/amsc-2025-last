-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the amsc_2025_user table
CREATE TABLE amsc_2025_user (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  address TEXT NOT NULL,
  booth_number TEXT NOT NULL,
  telephone TEXT NOT NULL,
  fax TEXT,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  CONSTRAINT fk_auth_user
    FOREIGN KEY (id)
    REFERENCES auth.users (id)
    ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE amsc_2025_user ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own data
CREATE POLICY "Users can view own data"
  ON amsc_2025_user
  FOR SELECT
  USING (auth.uid() = id);

-- Create policy to allow the service role to insert data
CREATE POLICY "Service role can insert data"
  ON amsc_2025_user
  FOR INSERT
  USING (true);

-- Create the form_submissions table
CREATE TABLE form_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES amsc_2025_user(id),
  form_type INTEGER NOT NULL,
  company_data JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  late_charge DECIMAL(10,2) NOT NULL DEFAULT 0,
  grand_total DECIMAL(10,2) NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  payment_details JSONB NOT NULL DEFAULT '{}',
  auth_details JSONB NOT NULL,
  UNIQUE(user_id, form_type)
);

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
  (1, 'Fascia Name Form for Shell Scheme', 'none', 0, '2025-06-30 23:59:59+00'),
  (2, 'Contractor Pass Application Form', 'lumpsum', 100, '2025-06-30 23:59:59+00'),
  (3, 'Electrical & Lighting Order Form', 'percentage', 10, '2025-06-30 23:59:59+00'),
  (4, 'Furniture Order Form', 'percentage', 30, '2025-06-30 23:59:59+00'),
  (5, 'Printing Order Form', 'percentage', 30, '2025-06-30 23:59:59+00'),
  (6, 'Non-Official Contractor Form', 'none', 0, '2025-06-30 23:59:59+00'),
  (7, 'Non-Official Contractor Form (Admin Fees)', 'none', 0, '2025-06-30 23:59:59+00'),
  (8, 'Letter of Indemnity for Non-Official Contractor', 'none', 0, '2025-06-30 23:59:59+00');

-- Example: Insert a test user (replace UUID with actual auth.users id)
-- First create the user in Supabase Auth:
-- Email: daniel@bcpgroup.com.my
-- Password: AMSC2025!  (or any password you choose)
-- Then use the generated UUID in this insert:
INSERT INTO amsc_2025_user (
  id,  -- This should match the UUID from auth.users
  company_name,
  contact_person,
  address,
  booth_number,
  telephone,
  email
) VALUES (
  '74ac317a-7674-4b11-be22-21d822549bc7',  -- Replace with actual UUID from auth.users
  'Blue Circle Plus',
  'Daniel Chan',
  'Damansara',
  '1001',
  '012345678',
  'daniel@bcpgroup.com.my'
);

-- Check if user was inserted correctly
SELECT * FROM amsc_2025_user;

-- Check if form configs were inserted
SELECT * FROM form_configs; 