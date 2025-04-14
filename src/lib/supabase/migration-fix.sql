-- This script adds the missing columns to the amsc_2025_user table
-- Run this in the Supabase SQL Editor to fix the schema

-- First, check if the columns already exist
DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    -- Check for postcode column
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'amsc_2025_user'
        AND column_name = 'postcode'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE amsc_2025_user ADD COLUMN postcode TEXT;
        RAISE NOTICE 'Added postcode column';
    ELSE
        RAISE NOTICE 'postcode column already exists';
    END IF;
    
    -- Check for state column
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'amsc_2025_user'
        AND column_name = 'state'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE amsc_2025_user ADD COLUMN state TEXT;
        RAISE NOTICE 'Added state column';
    ELSE
        RAISE NOTICE 'state column already exists';
    END IF;
    
    -- Check for country column
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'amsc_2025_user'
        AND column_name = 'country'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE amsc_2025_user ADD COLUMN country TEXT;
        RAISE NOTICE 'Added country column';
    ELSE
        RAISE NOTICE 'country column already exists';
    END IF;
    
    -- Check for updated_at column
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'amsc_2025_user'
        AND column_name = 'updated_at'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        ALTER TABLE amsc_2025_user ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());
        RAISE NOTICE 'Added updated_at column';
    ELSE
        RAISE NOTICE 'updated_at column already exists';
    END IF;
    
    -- Add tel column if telephone exists but tel doesn't
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'amsc_2025_user'
        AND column_name = 'tel'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        -- Check if telephone exists
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'amsc_2025_user'
            AND column_name = 'telephone'
        ) INTO column_exists;
        
        IF column_exists THEN
            -- Add tel column and copy data from telephone
            ALTER TABLE amsc_2025_user ADD COLUMN tel TEXT;
            UPDATE amsc_2025_user SET tel = telephone;
            RAISE NOTICE 'Added tel column and copied data from telephone';
        ELSE
            ALTER TABLE amsc_2025_user ADD COLUMN tel TEXT;
            RAISE NOTICE 'Added tel column';
        END IF;
    ELSE
        RAISE NOTICE 'tel column already exists';
    END IF;
    
    -- Add telephone column if tel exists but telephone doesn't
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'amsc_2025_user'
        AND column_name = 'telephone'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        -- Check if tel exists
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'amsc_2025_user'
            AND column_name = 'tel'
        ) INTO column_exists;
        
        IF column_exists THEN
            -- Add telephone column and copy data from tel
            ALTER TABLE amsc_2025_user ADD COLUMN telephone TEXT;
            UPDATE amsc_2025_user SET telephone = tel;
            RAISE NOTICE 'Added telephone column and copied data from tel';
        ELSE
            ALTER TABLE amsc_2025_user ADD COLUMN telephone TEXT;
            RAISE NOTICE 'Added telephone column';
        END IF;
    ELSE
        RAISE NOTICE 'telephone column already exists';
    END IF;
    
END $$; 