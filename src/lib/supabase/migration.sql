-- Add missing columns to amsc_2025_user table
ALTER TABLE amsc_2025_user 
ADD COLUMN IF NOT EXISTS postcode TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());

-- Update the table to normalize column names
ALTER TABLE amsc_2025_user
RENAME COLUMN telephone TO tel;

-- Add tel column back and set values from renamed column
ALTER TABLE amsc_2025_user
ADD COLUMN telephone TEXT;

-- Update all existing rows to have telephone = tel
UPDATE amsc_2025_user SET telephone = tel; 