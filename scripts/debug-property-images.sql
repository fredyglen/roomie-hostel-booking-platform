-- DEBUG: Check property images in database
-- Run this in Supabase SQL Editor to see what's in your properties

-- 1. Check all properties and their image data
SELECT
  id,
  title,
  images,
  image_url,
  verification_status,
  is_available,
  created_at
FROM properties
WHERE is_available = true
ORDER BY created_at DESC;

-- 2. Check specifically for properties with images
SELECT
  id,
  title,
  array_length(images, 1) as image_count,
  images,
  image_url
FROM properties
WHERE is_available = true
  AND verification_status = 'verified'
  AND (images IS NOT NULL OR image_url IS NOT NULL)
ORDER BY created_at DESC;

-- 3. Check if images column is properly formatted
SELECT 
  id,
  title,
  CASE 
    WHEN images IS NULL THEN 'NULL'
    WHEN array_length(images, 1) IS NULL THEN 'EMPTY_ARRAY'
    ELSE 'HAS_IMAGES'
  END as image_status,
  array_length(images, 1) as image_count,
  images[1] as first_image_url
FROM properties
WHERE is_available = true 
  AND verification_status = 'verified'
ORDER BY created_at DESC;

-- 4. Sample update to add test images (if needed)
-- UNCOMMENT ONLY IF YOU WANT TO ADD TEST IMAGES

-- For properties with images array column:
/*
UPDATE properties
SET images = ARRAY[
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'
]
WHERE verification_status = 'verified'
  AND is_available = true
  AND (images IS NULL OR array_length(images, 1) IS NULL);
*/

-- For properties with single image_url column:
/*
UPDATE properties
SET image_url = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800'
WHERE is_available = true
  AND (image_url IS NULL OR image_url = '');
*/
