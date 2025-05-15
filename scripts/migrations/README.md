# Database Migrations

## add_tin_remove_fax.sql

This migration script makes the following changes:

1. Adds a `tax_identification_number` column to the `amsc_2025_user` table.
2. Transfers any existing data from the `fax` column to the `tax_identification_number` column.
3. Removes the `fax` column from the `amsc_2025_user` table.
4. Makes the same changes to the `profiles` table if it exists.

### How to Apply

Connect to your Supabase database and run this script using the SQL Editor or via psql:

```sql
psql -h YOUR_DATABASE_HOST -U YOUR_DATABASE_USER -d YOUR_DATABASE_NAME -f add_tin_remove_fax.sql
```

Or through the Supabase SQL Editor, paste the contents of the script and execute.

### Application Changes

The following changes have been made to the application to support this database change:

1. Added Tax Identification Number (TIN) field to the signup form.
2. Removed Fax number field from all forms.
3. Updated UserDataContainer to display TIN instead of Fax.
4. Updated all order forms to collect TIN instead of Fax.
5. Added a note that foreign clients should enter "N/A" for the TIN field. 