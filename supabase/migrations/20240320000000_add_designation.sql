-- Add designation column to amsc_2025_user table
ALTER TABLE amsc_2025_user
ADD COLUMN designation VARCHAR(255);

-- Update the auth.users metadata to include designation
CREATE OR REPLACE FUNCTION update_user_metadata_with_designation()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE auth.users
    SET raw_user_meta_data = jsonb_set(
        COALESCE(raw_user_meta_data, '{}'::jsonb),
        '{designation}',
        to_jsonb(NEW.designation)
    )
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for designation updates
DROP TRIGGER IF EXISTS on_user_designation_update ON amsc_2025_user;
CREATE TRIGGER on_user_designation_update
    AFTER INSERT OR UPDATE OF designation
    ON amsc_2025_user
    FOR EACH ROW
    EXECUTE FUNCTION update_user_metadata_with_designation(); 