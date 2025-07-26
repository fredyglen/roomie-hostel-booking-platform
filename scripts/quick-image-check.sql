-- Quick check to see what image columns exist and their data
-- Run this in Supabase SQL Editor

-- 1. Check what columns exist in properties table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'properties' 
  AND column_name LIKE '%image%'
ORDER BY column_name;

-- 2. Check first 5 properties and their image data
SELECT 
  id,
  title,
  CASE 
    WHEN column_name = 'image_url' THEN 'image_url exists'
    ELSE 'image_url missing'
  END as image_url_status
FROM properties 
CROSS JOIN (
  SELECT column_name 
  FROM information_schema.columns 
  WHERE table_name = 'properties' AND column_name = 'image_url'
  LIMIT 1
) cols
WHERE is_available = true
LIMIT 5;

-- 3. If image_url exists, show its values
-- (This will error if column doesn't exist, which tells us the column is missing)
SELECT id, title, image_url, images
FROM properties 
WHERE is_available = true
LIMIT 5;
