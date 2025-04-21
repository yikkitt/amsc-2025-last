# Form Data Standardization Fix

## Problem Identified

After analyzing the codebase, we identified several inconsistencies in form data handling which resulted in "Null" values being reflected in Supabase:

1. **Field naming inconsistencies:**
   - Some forms use "Item", others use "Items", "Particular", or "DESCRIPTION OF SERVICE / ITEMS"
   - Some use "Unit Cost", others use "Unit Price", "Amount [RM]", etc.
   - Some forms use "unitCost" while others use "unitPrice" in their data models

2. **Data transformation issues:**
   - Lack of standardization before submission to Supabase
   - Different forms submit data in different formats
   - Missing data normalization in Supabase triggers

3. **Database schema limitations:**
   - Some columns might be missing in the Supabase tables
   - Inconsistent handling of JSON data

## Solution Implemented

We've implemented a comprehensive solution to standardize form data across all forms:

### 1. Enhanced Frontend Data Standardization

The `standardizeFormData.ts` file now includes improved standardization functions:

- **Company Data Standardization**: Handles variations like `companyName` vs `company_name`
- **Item Data Standardization**: Normalizes item arrays regardless of naming conventions
- **Monetary Values Standardization**: Ensures all monetary values are consistently formatted

### 2. Database Schema Updates

The SQL migration script `20240531_fix_form_field_names.sql` includes:

- **Table Structure Verification**: Ensures all required columns exist
- **Field Standardization Functions**: SQL functions to standardize field names
- **Database Triggers**: Automatically standardize data on insert/update
- **Data Migration**: Applies standardization to existing records
- **Unified View**: Combined view for consistent data access

## How to Apply the Fix

### Step 1: Run the Frontend Code Update

1. Deploy the updated `standardizeFormData.ts` file.

### Step 2: Apply the Database Migration

1. Open the Supabase SQL Editor
2. Copy and paste the contents of `supabase/migrations/20240531_fix_form_field_names.sql`
3. Run the SQL to apply all database changes
4. Verify the changes by querying the form data

```sql
-- Verify standardized form data
SELECT id, form_type, data->>'items', subtotal, late_charge, grand_total
FROM form_data_combined
LIMIT 10;
```

### Step 3: Test Form Submissions

1. Test submitting each form type to ensure data is being properly standardized
2. Check the Supabase database to verify the data is correctly stored
3. Verify that previously "Null" fields now show appropriate values

## Field Name Reference

For future form development, use these standardized field names:

| Concept                | Standardized Field Name | Alternative Names (Handled Automatically) |
|------------------------|-------------------------|------------------------------------------|
| Form Items             | `items`                 | orderItems, formItems, particulars       |
| Item Description       | `description`           | particular, item, name                   |
| Quantity               | `quantity`              | qty                                      |
| Unit Price             | `unitCost`              | unitPrice, unit_price, price, cost       |
| Total                  | `total`                 | amount, totalPrice, totalCost            |
| Company Name           | `company_name`          | companyName, company                     |
| Booth Number           | `booth_number`          | boothNo, booth_no                        |
| Late Charge            | `late_charge`           | surcharge                                |
| Grand Total            | `grand_total`           | total, grandTotal                        |

## Troubleshooting

If form data still appears as "Null" in Supabase after applying these changes:

1. Check the console logs for any errors during form submission
2. Verify the form data structure in the browser console when submitting
3. Run the following SQL to identify any problematic records:

```sql
-- Find records with potential issues
SELECT id, form_type, data 
FROM form_data_combined
WHERE 
  data->>'items' IS NULL OR 
  data->>'subtotal' IS NULL OR
  data->>'grand_total' IS NULL;
``` 