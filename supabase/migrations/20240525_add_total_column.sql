-- Add 'total' column to form_submissions table for backward compatibility
DO $$
BEGIN
  -- Check if the column already exists
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'form_submissions' 
    AND column_name = 'total'
  ) THEN
    -- Add the missing column
    ALTER TABLE form_submissions 
    ADD COLUMN total DECIMAL(10,2) DEFAULT 0;
    
    -- Add a trigger to keep 'total' and 'grand_total' in sync
    CREATE OR REPLACE FUNCTION sync_total_with_grand_total()
    RETURNS TRIGGER AS $$
    BEGIN
      IF TG_OP = 'INSERT' OR NEW.grand_total != OLD.grand_total THEN
        NEW.total := NEW.grand_total;
      END IF;
      
      IF TG_OP = 'INSERT' OR NEW.total != OLD.total THEN
        NEW.grand_total := NEW.total;
      END IF;
      
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    
    -- Create triggers for both directions
    DROP TRIGGER IF EXISTS sync_total_trigger ON form_submissions;
    CREATE TRIGGER sync_total_trigger
    BEFORE INSERT OR UPDATE ON form_submissions
    FOR EACH ROW
    EXECUTE FUNCTION sync_total_with_grand_total();
    
    -- Update existing rows to set total = grand_total
    UPDATE form_submissions 
    SET total = grand_total 
    WHERE true;
  END IF;
END
$$; 