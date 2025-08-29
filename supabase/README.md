# Supabase Database Setup

This directory contains SQL migrations for setting up the Supabase database schema for the DDCON 2025 Exhibition Management System.

## Database Schema

The application uses the following main tables:

1. **ddcon_2025_user**: Stores exhibitor information linked to Supabase Auth users
2. **form_submissions**: Stores all form submissions from exhibitors
3. **form_configs**: Stores configuration for each form type, including deadlines and late fees

## How to Apply Migrations

### Option 1: Using Supabase CLI (Recommended)

If you have the Supabase CLI installed:

1. Connect to your project:
   ```
   supabase link --project-ref YOUR_PROJECT_REF
   ```

2. Apply the migrations:
   ```
   supabase db push
   ```

### Option 2: Using Supabase Dashboard

If you don't have the Supabase CLI:

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Copy the content of the SQL files in the `migrations` directory
4. Paste and execute the SQL in the SQL Editor

## Migration Files

- `20240524_update_form_tables.sql`: Creates or updates the `form_submissions` and `form_configs` tables, adds a helpful view, and sets up indexes for performance.
- `20240525_add_total_column.sql`: Adds a `total` column to the `form_submissions` table for backward compatibility with existing code, including a trigger to keep `total` and `grand_total` in sync.

## Data Model

### form_submissions

This table stores all form submissions from users. Each form type has its own submission record.

Key fields:
- `user_id`: References the user who submitted the form
- `form_type`: Integer identifying the form type (1-8)
- `company_data`: JSONB object containing company details
- `items`: JSONB array of form line items (for order forms)
- `subtotal`: Numeric total before late fees
- `late_charge`: Any applicable late submission fees
- `grand_total`: Final total including late fees
- `submitted_at`: Timestamp when the form was submitted
- `status`: Current status of the form submission

### form_configs

This table stores configuration for each form type, including:
- Form name
- Late charge type (none, percentage, lumpsum)
- Late charge value
- Submission deadline
- Default form items (if applicable)

## Helpful View

The `form_submissions_with_user` view joins form submissions with user data for easy reporting. 