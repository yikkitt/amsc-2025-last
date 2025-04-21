-- Migration to fix form field name inconsistencies
-- This script ensures all necessary columns exist and handles 
-- variations in field naming (items vs particulars, unitCost vs unitPrice, etc.)

-- First, ensure form_submissions table exists and has all required columns
DO $$
BEGIN
  -- Check if form_submissions table exists, create if needed
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'form_submissions') THEN
    CREATE TABLE public.form_submissions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id),
      form_type TEXT NOT NULL,
      status TEXT DEFAULT 'submitted',
      data JSONB DEFAULT '{}'::JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      subtotal DECIMAL(10,2) DEFAULT 0,
      late_charge DECIMAL(10,2) DEFAULT 0,
      grand_total DECIMAL(10,2) DEFAULT 0
    );
    
    -- Grant access
    GRANT ALL ON public.form_submissions TO authenticated;
    GRANT ALL ON public.form_submissions TO service_role;
    
    -- Enable RLS with permissive policy for debugging
    ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
    
    -- Create policy
    CREATE POLICY "Allow all access to form_submissions" 
      ON public.form_submissions
      USING (true)
      WITH CHECK (true);
  ELSE
    -- Ensure all required columns exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = 'form_submissions' AND column_name = 'data') THEN
      ALTER TABLE public.form_submissions ADD COLUMN data JSONB DEFAULT '{}'::JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = 'form_submissions' AND column_name = 'subtotal') THEN
      ALTER TABLE public.form_submissions ADD COLUMN subtotal DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = 'form_submissions' AND column_name = 'late_charge') THEN
      ALTER TABLE public.form_submissions ADD COLUMN late_charge DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = 'form_submissions' AND column_name = 'grand_total') THEN
      ALTER TABLE public.form_submissions ADD COLUMN grand_total DECIMAL(10,2) DEFAULT 0;
    END IF;
  END IF;
END
$$;

-- Create functions to process form data

-- Function to standardize item fields - handles various naming conventions
CREATE OR REPLACE FUNCTION public.standardize_form_items(form_data JSONB)
RETURNS JSONB AS $$
DECLARE
  item_field TEXT;
  items_array JSONB;
  standardized_items JSONB;
  item JSONB;
  item_index INTEGER;
  result JSONB;
BEGIN
  -- Clone the input data
  result := form_data;
  
  -- Look for items in various field names
  FOREACH item_field IN ARRAY ARRAY['items', 'orderItems', 'formItems', 'electricalItems', 
                                    'furnitureItems', 'printingItems', 'particular', 'particulars']
  LOOP
    IF form_data ? item_field AND jsonb_typeof(form_data->item_field) = 'array' THEN
      items_array := form_data->item_field;
      
      -- Create standardized items array
      standardized_items := '[]'::JSONB;
      
      -- Process each item
      FOR item_index IN 0..jsonb_array_length(items_array)-1 LOOP
        item := items_array->item_index;
        
        -- Standardize field names within the item
        item := jsonb_build_object(
          'description', COALESCE(item->>'description', item->>'particular', item->>'item', item->>'name', ''),
          'quantity', COALESCE((item->>'quantity')::NUMERIC, 0),
          'unitCost', COALESCE(
            (item->>'unitCost')::NUMERIC, 
            (item->>'unitPrice')::NUMERIC, 
            (item->>'unit_cost')::NUMERIC,
            (item->>'unit_price')::NUMERIC,
            (item->>'price')::NUMERIC,
            (item->>'cost')::NUMERIC,
            0
          ),
          'total', COALESCE(
            (item->>'total')::NUMERIC, 
            (item->>'amount')::NUMERIC,
            (item->>'totalPrice')::NUMERIC,
            (item->>'totalCost')::NUMERIC,
            0
          )
        );
        
        -- Calculate total if missing
        IF (item->>'total')::NUMERIC = 0 AND (item->>'quantity')::NUMERIC > 0 AND (item->>'unitCost')::NUMERIC > 0 THEN
          item := jsonb_set(item, '{total}', ((item->>'quantity')::NUMERIC * (item->>'unitCost')::NUMERIC)::TEXT::JSONB);
        END IF;
        
        -- Add to standardized items
        standardized_items := standardized_items || item;
      END LOOP;
      
      -- Set standardized items
      result := jsonb_set(result, '{items}', standardized_items);
      
      -- Only process the first found items array
      EXIT;
    END IF;
  END LOOP;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to normalize totals and monetary values
CREATE OR REPLACE FUNCTION public.standardize_form_totals(form_data JSONB)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  subtotal NUMERIC := 0;
  late_charge NUMERIC := 0;
  grand_total NUMERIC := 0;
BEGIN
  -- Clone the input data
  result := form_data;
  
  -- Calculate subtotal from items if present
  IF result ? 'items' AND jsonb_typeof(result->'items') = 'array' THEN
    SELECT COALESCE(SUM((item->>'total')::NUMERIC), 0)
    INTO subtotal
    FROM jsonb_array_elements(result->'items') AS item;
  ELSE
    -- Use existing subtotal if available
    subtotal := COALESCE((result->>'subtotal')::NUMERIC, 0);
  END IF;
  
  -- Handle late charge or surcharge
  IF result ? 'surcharge' THEN
    late_charge := COALESCE((result->>'surcharge')::NUMERIC, 0);
  ELSE
    late_charge := COALESCE((result->>'late_charge')::NUMERIC, 0);
  END IF;
  
  -- Calculate grand total
  grand_total := subtotal + late_charge;
  
  -- Update result with standardized values
  result := jsonb_set(result, '{subtotal}', to_jsonb(subtotal));
  result := jsonb_set(result, '{late_charge}', to_jsonb(late_charge));
  result := jsonb_set(result, '{grand_total}', to_jsonb(grand_total));
  
  RETURN result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Comprehensive function to standardize all form data
CREATE OR REPLACE FUNCTION public.standardize_form_data(form_data JSONB)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  -- Standardize items
  result := public.standardize_form_items(form_data);
  
  -- Standardize totals
  result := public.standardize_form_totals(result);
  
  RETURN result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create trigger to standardize form data on insert/update
CREATE OR REPLACE FUNCTION public.standardize_form_data_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Standardize the JSON data
  NEW.data := public.standardize_form_data(NEW.data);
  
  -- Update calculated fields from the standardized data
  NEW.subtotal := COALESCE((NEW.data->>'subtotal')::NUMERIC, 0);
  NEW.late_charge := COALESCE((NEW.data->>'late_charge')::NUMERIC, 0);
  NEW.grand_total := COALESCE((NEW.data->>'grand_total')::NUMERIC, 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply the trigger to form_submissions
DROP TRIGGER IF EXISTS standardize_form_data_on_insert ON public.form_submissions;
CREATE TRIGGER standardize_form_data_on_insert
  BEFORE INSERT OR UPDATE ON public.form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.standardize_form_data_trigger();

-- Apply the standardization to existing records
DO $$
DECLARE
  rec RECORD;
  standardized_data JSONB;
BEGIN
  FOR rec IN SELECT id, data FROM public.form_submissions LOOP
    standardized_data := public.standardize_form_data(rec.data);
    
    UPDATE public.form_submissions
    SET 
      data = standardized_data,
      subtotal = COALESCE((standardized_data->>'subtotal')::NUMERIC, 0),
      late_charge = COALESCE((standardized_data->>'late_charge')::NUMERIC, 0),
      grand_total = COALESCE((standardized_data->>'grand_total')::NUMERIC, 0),
      updated_at = NOW()
    WHERE id = rec.id;
  END LOOP;
END
$$;

-- Also apply standardization to 'forms' table data
DO $$
DECLARE
  rec RECORD;
  standardized_data JSONB;
BEGIN
  FOR rec IN SELECT id, data FROM public.forms LOOP
    standardized_data := public.standardize_form_data(rec.data);
    
    UPDATE public.forms
    SET 
      data = standardized_data,
      updated_at = NOW()
    WHERE id = rec.id;
  END LOOP;
END
$$;

-- Recreate the combined view with the latest columns
DROP VIEW IF EXISTS form_data_combined;
CREATE VIEW form_data_combined AS
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
  
  -- Get data from form_submissions table
  SELECT 
    fs.id,
    fs.user_id,
    fs.form_type::TEXT,
    COALESCE(fs.status, 'submitted') as status,
    COALESCE(fs.data, '{}'::JSONB) as data,
    COALESCE(fs.subtotal, 0) as subtotal,
    COALESCE(fs.late_charge, 0) as late_charge,
    COALESCE(fs.grand_total, 0) as grand_total,
    fs.submitted_at,
    fs.updated_at,
    'form_submissions' as source_table
  FROM 
    public.form_submissions fs;

-- Grant access to the view
GRANT SELECT ON form_data_combined TO authenticated;
GRANT SELECT ON form_data_combined TO service_role; 