-- Migration: Add rating and review_count columns to properties table
-- Date: 2025-11-05
-- Purpose: Enable real rating storage instead of fake "4.5 stars" fallback
-- Related: REVISED_FIX_PLAN_2025-11-05.md Phase 1

-- ============================================================================
-- STEP 1: Add rating and review_count columns
-- ============================================================================

-- Add rating column (0.00 to 5.00, nullable until reviews exist)
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) 
CHECK (rating >= 0 AND rating <= 5);

-- Add review_count column (non-negative integer, defaults to 0)
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS review_count INTEGER 
DEFAULT 0 
CHECK (review_count >= 0);

-- ============================================================================
-- STEP 2: Create indexes for performance
-- ============================================================================

-- Index for sorting properties by rating (DESC, nulls last)
CREATE INDEX IF NOT EXISTS idx_properties_rating 
ON properties(rating DESC NULLS LAST);

-- Index for filtering properties with reviews
CREATE INDEX IF NOT EXISTS idx_properties_review_count 
ON properties(review_count) 
WHERE review_count > 0;

-- Composite index for rating + availability queries
CREATE INDEX IF NOT EXISTS idx_properties_rating_available 
ON properties(rating DESC NULLS LAST, is_available) 
WHERE verification_status = 'verified';

-- ============================================================================
-- STEP 3: Add helpful comments
-- ============================================================================

COMMENT ON COLUMN properties.rating IS 
'Aggregated average rating from property_reviews table (0.00-5.00). NULL means no reviews yet.';

COMMENT ON COLUMN properties.review_count IS 
'Total number of reviews from property_reviews table. Updated via trigger or application logic.';

-- ============================================================================
-- STEP 4: Verification queries (run after migration)
-- ============================================================================

-- Verify columns were added
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns 
-- WHERE table_name = 'properties' 
--   AND column_name IN ('rating', 'review_count')
-- ORDER BY column_name;

-- Verify indexes were created
-- SELECT indexname, indexdef 
-- FROM pg_indexes 
-- WHERE tablename = 'properties' 
--   AND indexname LIKE '%rating%';

-- Check current state (should all be NULL/0 initially)
-- SELECT id, title, rating, review_count 
-- FROM properties 
-- LIMIT 5;

-- ============================================================================
-- ROLLBACK INSTRUCTIONS (if needed)
-- ============================================================================

-- To rollback this migration:
-- DROP INDEX IF EXISTS idx_properties_rating_available;
-- DROP INDEX IF EXISTS idx_properties_review_count;
-- DROP INDEX IF EXISTS idx_properties_rating;
-- ALTER TABLE properties DROP COLUMN IF EXISTS review_count;
-- ALTER TABLE properties DROP COLUMN IF EXISTS rating;

-- ============================================================================
-- NOTES
-- ============================================================================

-- 1. Rating is nullable because properties without reviews should show NULL
-- 2. Review_count defaults to 0 for new properties
-- 3. These columns will be updated when reviews are submitted (Phase 5)
-- 4. Frontend will check: if (rating) { show rating } else { show "No reviews yet" }
-- 5. Indexes optimize sorting by rating and filtering verified+rated properties

