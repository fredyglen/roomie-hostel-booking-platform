-- QUICK PROPERTY VERIFICATION SCRIPT
-- Run this in your Supabase SQL Editor to verify all pending properties

-- 1. First, let's see what properties exist and their current status
SELECT 
  id,
  title,
  property_type,
  verification_status,
  is_available,
  created_at,
  owner_id
FROM properties
ORDER BY created_at DESC;

-- 2. Update ALL pending properties to verified status
UPDATE properties 
SET 
  verification_status = 'verified',
  updated_at = NOW()
WHERE verification_status = 'pending'
  AND is_available = true;

-- 3. Verify the update worked - show all verified properties
SELECT 
  id,
  title,
  property_type,
  verification_status,
  is_available,
  updated_at
FROM properties
WHERE verification_status = 'verified'
ORDER BY updated_at DESC;

-- 4. Check if properties are now visible to students (this is what the student portal queries)
SELECT 
  id,
  title,
  property_type,
  verification_status,
  is_available
FROM properties
WHERE is_available = true 
  AND verification_status = 'verified'
ORDER BY created_at DESC;
