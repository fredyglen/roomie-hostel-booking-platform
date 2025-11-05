# Phase 1 Verification Checklist

## Migration File Created
✅ `supabase/migrations/20251105_add_rating_columns_to_properties.sql`

## What This Migration Does

### Adds Two Columns to `properties` Table:
1. **`rating`** - DECIMAL(3,2) with CHECK constraint (0.00 to 5.00)
   - Nullable (NULL = no reviews yet)
   - Will store aggregated average rating from property_reviews

2. **`review_count`** - INTEGER with CHECK constraint (>= 0)
   - Defaults to 0
   - Will store total number of reviews

### Creates Three Indexes:
1. **`idx_properties_rating`** - Sort by rating DESC (nulls last)
2. **`idx_properties_review_count`** - Filter properties with reviews
3. **`idx_properties_rating_available`** - Composite for rating + availability queries

## How to Apply This Migration

### Option 1: Supabase Dashboard (Recommended)
1. Open Supabase Dashboard → SQL Editor
2. Copy the entire contents of `supabase/migrations/20251105_add_rating_columns_to_properties.sql`
3. Paste into SQL Editor
4. Click "Run"
5. Verify success message

### Option 2: Supabase CLI
```bash
supabase db push
```

## Verification Queries (Run After Migration)

```sql
-- 1. Verify columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'properties' 
  AND column_name IN ('rating', 'review_count')
ORDER BY column_name;

-- Expected output:
-- rating       | numeric | YES | NULL
-- review_count | integer | YES | 0

-- 2. Verify indexes were created
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'properties' 
  AND indexname LIKE '%rating%';

-- Expected: 3 indexes (idx_properties_rating, idx_properties_review_count, idx_properties_rating_available)

-- 3. Check current state (should all be NULL/0)
SELECT id, title, rating, review_count 
FROM properties 
LIMIT 5;

-- Expected: All rating = NULL, all review_count = 0
```

## Success Criteria

- ✅ Migration runs without errors
- ✅ `rating` column exists with DECIMAL(3,2) type
- ✅ `review_count` column exists with INTEGER type
- ✅ All 3 indexes created successfully
- ✅ Existing properties have rating=NULL, review_count=0
- ✅ No data loss (all 60 original columns intact)

## Rollback Plan (If Needed)

```sql
DROP INDEX IF EXISTS idx_properties_rating_available;
DROP INDEX IF EXISTS idx_properties_review_count;
DROP INDEX IF EXISTS idx_properties_rating;
ALTER TABLE properties DROP COLUMN IF EXISTS review_count;
ALTER TABLE properties DROP COLUMN IF EXISTS rating;
```

## Next Steps After Confirmation

Once you confirm Phase 1 is complete:
- ✅ Proceed to Phase 2: Remove fake data from frontend components
- ✅ Update TypeScript types to include rating and review_count
- ✅ Replace hardcoded "4.5 stars" with real queries

## User Action Required

**Please run the migration and paste the verification query results to confirm Phase 1 is complete.**

