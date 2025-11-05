-- =====================================================
-- VERIFY "BROKEN" FOREIGN KEY CONSTRAINTS
-- =====================================================
-- This query checks if the constraints actually exist
-- and what they reference (including cross-schema refs)

SELECT
  conname AS constraint_name,
  conrelid::regclass AS table_name,
  confrelid::regclass AS foreign_table_name,
  pg_get_constraintdef(oid) AS constraint_definition,
  CASE 
    WHEN confrelid::regclass::text LIKE 'auth.%' THEN '✅ References auth schema'
    WHEN confrelid::regclass::text LIKE 'public.%' THEN '✅ References public schema'
    ELSE '❌ Unknown reference'
  END as status
FROM pg_constraint
WHERE contype = 'f'
  AND conname IN (
    'beds_current_occupant_id_fkey',
    'bookings_student_id_fkey',
    'compounds_owner_id_fkey',
    'favorites_user_id_fkey',
    'payments_user_id_fkey',
    'profiles_id_fkey',
    'properties_owner_id_fkey',
    'property_views_user_id_fkey',
    'user_subscriptions_user_id_fkey'
  )
ORDER BY constraint_name;

