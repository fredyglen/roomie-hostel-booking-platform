-- Duplicate foreign key constraint removal
-- The working constraint is: fk_properties_owner
-- The duplicate is: properties_owner_id_fkey
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_owner_id_fkey;
