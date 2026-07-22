-- ============================================================================
-- COMPREHENSIVE BLOB URL CLEANUP SCRIPT
-- ============================================================================
-- This script removes all blob: URLs from properties.images and properties.media
-- Run this AFTER confirming the frontend fix works
-- ============================================================================

-- Step 1: Show properties with blob: URLs in images array
SELECT
  id,
  title,
  images,
  (SELECT COUNT(*) FROM unnest(images) AS img WHERE img LIKE 'blob:%') as blob_count
FROM properties
WHERE EXISTS (
  SELECT 1 FROM unnest(images) AS img WHERE img LIKE 'blob:%'
);

-- Step 2: Remove blob: URLs from images array (keep valid URLs)
UPDATE properties
SET images = (
  SELECT ARRAY_AGG(img)
  FROM unnest(images) AS img
  WHERE img NOT LIKE 'blob:%' AND img NOT LIKE '%localhost%'
)
WHERE EXISTS (
  SELECT 1 FROM unnest(images) AS img
  WHERE img LIKE 'blob:%' OR img LIKE '%localhost%'
);

-- Step 3: Show properties with blob: URLs in media JSONB array
SELECT
  id,
  title,
  media
FROM properties
WHERE media::text LIKE '%blob:%';

-- Step 4: Remove blob: URLs from media JSONB array
UPDATE properties
SET media = (
  SELECT jsonb_agg(item)
  FROM jsonb_array_elements(media) AS item
  WHERE item->>'url' NOT LIKE 'blob:%'
    AND item->>'url' NOT LIKE '%localhost%'
)
WHERE media::text LIKE '%blob:%' OR media::text LIKE '%localhost%';

-- Step 5: Verify cleanup - show all properties with their image status
SELECT
  id,
  title,
  verification_status,
  CASE
    WHEN images IS NULL OR array_length(images, 1) = 0 THEN '❌ No images'
    WHEN images[1] LIKE 'blob:%' THEN '❌ Still has blob'
    WHEN images[1] LIKE '%localhost%' THEN '❌ Still has localhost'
    WHEN images[1] LIKE '%unsplash%' THEN '⚠️ Unsplash fallback'
    WHEN images[1] LIKE '%supabase%' THEN '✅ Valid Supabase URL'
    ELSE '✅ Valid URL'
  END as image_status,
  images[1] as cover_image
FROM properties
ORDER BY verification_status, image_status;

