-- Simple version: just add the total column without complex triggers
-- Add 'total' column to form_submissions table if it doesn't exist
ALTER TABLE IF EXISTS form_submissions
ADD COLUMN IF NOT EXISTS total DECIMAL(10,2) DEFAULT 0;

-- Update existing records to set total = grand_total
UPDATE form_submissions
SET total = grand_total
WHERE total = 0 AND grand_total != 0; 