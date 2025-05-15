-- Add tax_identification_number column to amsc_2025_user table
ALTER TABLE amsc_2025_user ADD COLUMN IF NOT EXISTS tax_identification_number TEXT;

-- First, update any existing data to transfer fax values to tax_identification_number if tax_identification_number is NULL
UPDATE amsc_2025_user SET tax_identification_number = fax WHERE tax_identification_number IS NULL AND fax IS NOT NULL;

-- Then remove the fax column
ALTER TABLE amsc_2025_user DROP COLUMN IF EXISTS fax;

-- Now update any related tables (profiles table if it exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') THEN
        -- Add tax_identification_number column to profiles table if it doesn't exist
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'tax_identification_number' AND table_schema = 'public') THEN
            ALTER TABLE profiles ADD COLUMN tax_identification_number TEXT;
        END IF;
        
        -- Transfer any fax data to tax_identification_number if fax column exists
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'fax' AND table_schema = 'public') THEN
            UPDATE profiles SET tax_identification_number = fax WHERE tax_identification_number IS NULL AND fax IS NOT NULL;
            
            -- Remove fax column
            ALTER TABLE profiles DROP COLUMN fax;
        END IF;
    END IF;
END $$; 