-- Quick Property Verification Script
-- This script verifies all pending properties so they show up in the student portal

-- First, let's see what properties exist
SELECT 
  id,
  title,
  property_type,
  verification_status,
  is_available,
  created_at
FROM properties
ORDER BY created_at DESC;

-- Update all pending properties to verified status
UPDATE properties 
SET 
  verification_status = 'verified',
  updated_at = NOW()
WHERE verification_status = 'pending'
  AND is_available = true;

-- Verify the update worked
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
