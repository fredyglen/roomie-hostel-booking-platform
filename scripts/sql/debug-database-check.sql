-- COMPREHENSIVE DATABASE VERIFICATION
-- Run this to see exactly what's in your database

-- 1. Check if images were actually updated
SELECT 
  id,
  title,
  images,
  array_length(images, 1) as image_count,
  is_available,
  verification_status,
  created_at
FROM properties 
WHERE is_available = true
ORDER BY created_at DESC
LIMIT 5;

-- 2. Check all columns in properties table
SELECT 
  id,
  title,
  description,
  property_type,
  property_category,
  address,
  city,
  rent,
  base_price_per_semester,
  images,
  is_available,
  verification_status
FROM properties 
WHERE is_available = true
LIMIT 3;
