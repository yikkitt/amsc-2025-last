-- Migration to reorganize tables with specific columns for form items
-- This adds a new form_items table to store line items with their own columns

-- Create the form_items table to store individual line items
CREATE TABLE IF NOT EXISTS public.form_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID NOT NULL,
  item_no INTEGER NOT NULL,
  item_name TEXT NOT NULL,
  description TEXT,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  quantity INTEGER NOT NULL DEFAULT 1,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add foreign key constraints
  CONSTRAINT fk_form_id_forms FOREIGN KEY (form_id) 
    REFERENCES public.forms(id) ON DELETE CASCADE,
    
  -- Add uniqueness constraints
  CONSTRAINT unique_item_per_form UNIQUE (form_id, item_no)
);

-- Enable RLS on the new table
ALTER TABLE public.form_items ENABLE ROW LEVEL SECURITY;

-- Grant access to authenticated users and service role
GRANT ALL ON public.form_items TO authenticated;
GRANT ALL ON public.form_items TO service_role;

-- Create policy to allow users to manage their own form items
CREATE POLICY "Users can manage their own form items"
  ON public.form_items
  USING (form_id IN (SELECT id FROM public.forms WHERE user_id = auth.uid()))
  WITH CHECK (form_id IN (SELECT id FROM public.forms WHERE user_id = auth.uid()));

-- Create trigger to auto-calculate total based on unit_price and quantity
CREATE OR REPLACE FUNCTION public.calculate_item_total()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total := NEW.unit_price * NEW.quantity;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS calculate_item_total_trigger ON public.form_items;
CREATE TRIGGER calculate_item_total_trigger
  BEFORE INSERT OR UPDATE ON public.form_items
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_item_total();

-- Create a trigger to update the form's grand_total when items change
CREATE OR REPLACE FUNCTION public.update_form_grand_total()
RETURNS TRIGGER AS $$
DECLARE
  form_subtotal DECIMAL(10,2);
  form_id_val UUID;
BEGIN
  -- Determine which form to update
  IF TG_OP = 'DELETE' THEN
    form_id_val := OLD.form_id;
  ELSE
    form_id_val := NEW.form_id;
  END IF;
  
  -- Calculate the new subtotal
  SELECT COALESCE(SUM(total), 0) INTO form_subtotal
  FROM public.form_items
  WHERE form_id = form_id_val;
  
  -- Update the forms table
  UPDATE public.forms
  SET 
    data = jsonb_set(
      jsonb_set(data, '{subtotal}', to_jsonb(form_subtotal)),
      '{grand_total}', 
      to_jsonb(form_subtotal + COALESCE((data->>'late_charge')::DECIMAL, 0))
    ),
    updated_at = NOW()
  WHERE id = form_id_val;
  
  RETURN NULL; -- for AFTER triggers
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS update_form_total_trigger ON public.form_items;
CREATE TRIGGER update_form_total_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.form_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_form_grand_total();

-- Create a view that combines form data with its items for easy querying
CREATE OR REPLACE VIEW form_items_view AS
SELECT 
  f.id AS form_id,
  f.user_id,
  f.form_type,
  f.status,
  f.submitted_at,
  fi.id AS item_id,
  fi.item_no,
  fi.item_name,
  fi.description,
  fi.unit_price,
  fi.quantity,
  fi.total,
  COALESCE((f.data->>'subtotal')::DECIMAL, 0) AS subtotal,
  COALESCE((f.data->>'late_charge')::DECIMAL, 0) AS late_charge,
  COALESCE((f.data->>'grand_total')::DECIMAL, 0) AS grand_total
FROM 
  public.forms f
LEFT JOIN 
  public.form_items fi ON f.id = fi.form_id
ORDER BY
  f.id, fi.item_no;

-- Grant access to the view
GRANT SELECT ON form_items_view TO authenticated;
GRANT SELECT ON form_items_view TO service_role;

-- Helper function to migrate existing JSON data to the new structure
CREATE OR REPLACE FUNCTION public.migrate_form_items() 
RETURNS void AS $$
DECLARE
  f RECORD;
  items JSONB;
  item JSONB;
  item_index INTEGER;
BEGIN
  -- Process each form with items in the data column
  FOR f IN 
    SELECT id, data FROM public.forms 
    WHERE data ? 'items' AND jsonb_typeof(data->'items') = 'array'
  LOOP
    items := f.data->'items';
    
    -- Process each item in the array
    FOR item_index IN 0..jsonb_array_length(items)-1 LOOP
      item := items->item_index;
      
      -- Insert the item into the new table
      INSERT INTO public.form_items (
        form_id, 
        item_no, 
        item_name, 
        description, 
        unit_price, 
        quantity
      ) VALUES (
        f.id, 
        item_index + 1, -- Convert 0-based index to 1-based item_no
        COALESCE(item->>'name', item->>'item_name', 'Unnamed Item'),
        COALESCE(item->>'description', ''),
        COALESCE((item->>'price')::DECIMAL, (item->>'unit_price')::DECIMAL, 0),
        COALESCE((item->>'quantity')::INTEGER, 1)
      );
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run the migration function (comment this out if you want to run it manually)
SELECT public.migrate_form_items();

-- Clean up the migration function after use
DROP FUNCTION public.migrate_form_items(); 