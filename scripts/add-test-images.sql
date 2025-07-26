-- Add test images to properties that don't have any
-- This will work regardless of whether you have image_url or images column

-- First, try to add to image_url column (if it exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'properties' AND column_name = 'image_url'
  ) THEN
    UPDATE properties 
    SET image_url = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800'
    WHERE is_available = true
      AND (image_url IS NULL OR image_url = '');
    
    RAISE NOTICE 'Updated image_url column with test images';
  END IF;
END $$;

-- Then, try to add to images array column (if it exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'properties' AND column_name = 'images'
  ) THEN
    UPDATE properties 
    SET images = ARRAY[
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'
    ]
    WHERE is_available = true
      AND (images IS NULL OR array_length(images, 1) IS NULL);
    
    RAISE NOTICE 'Updated images array column with test images';
  END IF;
END $$;

-- Show what we have now
SELECT 
  id,
  title,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'image_url')
    THEN 'image_url column exists'
    ELSE 'image_url column missing'
  END as image_url_status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'images')
    THEN 'images column exists'
    ELSE 'images column missing'
  END as images_status
FROM properties 
WHERE is_available = true
LIMIT 3;
