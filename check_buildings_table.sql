-- Check buildings table structure to verify property_id column exists
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'buildings'
ORDER BY ordinal_position;

