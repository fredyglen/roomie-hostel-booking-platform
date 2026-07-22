-- Task 6: Deprecate legacy bookings table
-- Migrate any remaining data to bookings_enhanced, then drop old table

-- Step 1: Migrate remaining data (if any)
INSERT INTO bookings_enhanced (
  property_id, student_id, property_owner_id, room_id,
  check_in_date, check_out_date, start_date, end_date,
  total_amount, property_rent, status, payment_status,
  created_at, updated_at
)
SELECT 
  property_id, student_id, owner_id, NULL,
  start_date, end_date, start_date, end_date,
  amount, NULL, status, 'pending',
  created_at, updated_at
FROM bookings
ON CONFLICT (id) DO NOTHING;

-- Step 2: Verify migration (run SELECT COUNT(*) FROM bookings; should be 0 after migration if all moved, but we keep data safe)

-- Step 3: Drop legacy table
-- DROP TABLE IF EXISTS bookings;
-- Note: Only run DROP after confirming bookings_enhanced has all data
