-- Check what's actually stored in the images column
SELECT 
  id,
  title,
  images,
  pg_typeof(images) as images_type,
  array_length(images, 1) as images_count,
  images[1] as first_image
FROM properties 
WHERE images IS NOT NULL 
LIMIT 5;

