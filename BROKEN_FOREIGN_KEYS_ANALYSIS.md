# Broken Foreign Keys Analysis (2025-11-05)

## ✅ RESOLUTION: ALL CONSTRAINTS ARE WORKING CORRECTLY

**Status:** RESOLVED - No action needed

**Finding:** All 9 "broken" foreign keys actually reference `auth.users` correctly. They showed as `null` in the initial query because `information_schema` only displays constraints within the `public` schema. Cross-schema references (to `auth.users`) appear as `null` in that view.

**Verification Query Results:**
- ✅ beds.current_occupant_id → auth.users(id) ON DELETE SET NULL
- ✅ bookings.student_id → auth.users(id) ON DELETE CASCADE
- ✅ compounds.owner_id → auth.users(id) ON DELETE CASCADE
- ✅ favorites.user_id → auth.users(id) ON DELETE CASCADE
- ✅ payments.user_id → auth.users(id) ON DELETE CASCADE
- ✅ profiles.id → auth.users(id) ON DELETE CASCADE
- ✅ properties.owner_id → auth.users(id) ON DELETE CASCADE
- ✅ property_views.user_id → auth.users(id) ON DELETE CASCADE
- ✅ user_subscriptions.user_id → auth.users(id) ON DELETE CASCADE

**Conclusion:** Database foreign key constraints are healthy. No fixes required.

---

## ORIGINAL ANALYSIS (For Reference)

These foreign keys reference `auth.users` but the constraint metadata shows `null` because they reference a table outside the `public` schema.

---

## BROKEN FOREIGN KEYS (By Severity)

### 🔴 CRITICAL (Authentication System)

**1. profiles.id → auth.users(id)**
- **Constraint:** `profiles_id_fkey`
- **Status:** ❌ BROKEN (shows null)
- **Actual Reference:** Should reference `auth.users(id)`
- **Impact:** Core authentication - profiles MUST link to auth.users
- **Action:** Verify constraint exists, likely just metadata display issue

**2. compounds.owner_id → auth.users(id)**
- **Constraint:** `compounds_owner_id_fkey`
- **Status:** ❌ BROKEN (shows null)
- **Actual Reference:** Should reference `auth.users(id)`
- **Impact:** Compound ownership tracking broken
- **Action:** Fix to reference `auth.users(id)` or `profiles(id)`

---

### 🟡 HIGH PRIORITY (User Actions)

**3. beds.current_occupant_id → auth.users(id)**
- **Constraint:** `beds_current_occupant_id_fkey`
- **Status:** ❌ BROKEN (shows null)
- **Actual Reference:** Should reference `auth.users(id)`
- **Impact:** Can't track who occupies which bed
- **Action:** Fix to reference `auth.users(id)` or `profiles(id)`

**4. favorites.user_id → auth.users(id)**
- **Constraint:** `favorites_user_id_fkey`
- **Status:** ❌ BROKEN (shows null)
- **Actual Reference:** Should reference `auth.users(id)`
- **Impact:** Can't track user favorites
- **Action:** Fix to reference `auth.users(id)` or `profiles(id)`

**5. property_views.user_id → auth.users(id)**
- **Constraint:** `property_views_user_id_fkey`
- **Status:** ❌ BROKEN (shows null)
- **Actual Reference:** Should reference `auth.users(id)`
- **Impact:** Can't track property views by user
- **Action:** Fix to reference `auth.users(id)` or `profiles(id)`

**6. user_subscriptions.user_id → auth.users(id)**
- **Constraint:** `user_subscriptions_user_id_fkey`
- **Status:** ❌ BROKEN (shows null)
- **Actual Reference:** Should reference `auth.users(id)`
- **Impact:** Can't track user subscriptions
- **Action:** Fix to reference `auth.users(id)` or `profiles(id)`

---

### 🟢 MEDIUM PRIORITY (Legacy System)

**7. bookings.student_id → auth.users(id)**
- **Constraint:** `bookings_student_id_fkey`
- **Status:** ❌ BROKEN (shows null)
- **Actual Reference:** Should reference `auth.users(id)`
- **Impact:** Legacy bookings table (replaced by bookings_enhanced)
- **Action:** Likely can be ignored if bookings table is deprecated

**8. payments.user_id → auth.users(id)**
- **Constraint:** `payments_user_id_fkey`
- **Status:** ❌ BROKEN (shows null)
- **Actual Reference:** Should reference `auth.users(id)`
- **Impact:** Can't track payment user
- **Action:** Fix to reference `auth.users(id)` or `profiles(id)`

---

### 🔵 LOW PRIORITY (Duplicate Constraint)

**9. properties.owner_id → profiles(id)**
- **Constraint:** `properties_owner_id_fkey`
- **Status:** ❌ BROKEN (shows null)
- **Actual Reference:** DUPLICATE - `fk_properties_owner` already exists and works
- **Impact:** None - duplicate constraint
- **Action:** Drop this duplicate constraint

---

## ROOT CAUSE ANALYSIS

**Why do these show as "BROKEN"?**

The query checks `information_schema` which only shows constraints within the `public` schema. Constraints referencing `auth.users` (in the `auth` schema) show as `null` in the metadata.

**Two possibilities:**
1. ✅ Constraints exist but reference `auth.users` (cross-schema reference)
2. ❌ Constraints are actually broken and don't reference anything

---

## VERIFICATION NEEDED

Run this query to check if constraints actually exist:

```sql
-- Check actual constraint definitions
SELECT
  conname AS constraint_name,
  conrelid::regclass AS table_name,
  confrelid::regclass AS foreign_table_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE contype = 'f'
  AND connamespace = 'public'::regnamespace
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
  );
```

This will show the ACTUAL constraint definitions and what they reference.

---

## RECOMMENDED ACTIONS

### STEP 1: Verify Constraints (USER ACTION REQUIRED)
Run the verification query above and provide output.

### STEP 2: Fix Strategy (After Verification)

**Option A: If constraints reference auth.users correctly**
- No action needed - they're working, just showing null in metadata

**Option B: If constraints are actually broken**
- Drop broken constraints
- Recreate with correct references to `auth.users(id)`

**Option C: Standardize on profiles table**
- Change all user references to use `profiles(id)` instead of `auth.users(id)`
- More consistent with existing working constraints

---

## IMPACT ASSESSMENT

**If these are truly broken (not just metadata display):**
- 🔴 Authentication system may be compromised
- 🔴 User tracking features broken (favorites, views, subscriptions)
- 🔴 Bed occupancy tracking broken
- 🔴 Compound ownership tracking broken
- 🔴 Payment user tracking broken

**If these are just metadata display issues:**
- ✅ Everything works fine
- ✅ Just a cross-schema reference display quirk

---

## NEXT STEPS

1. **USER:** Run verification query to check actual constraint definitions
2. **AI:** Analyze results and determine if constraints are truly broken
3. **AI:** Create fix migration if needed
4. **USER:** Review and apply fix migration
5. **AI:** Verify all constraints working after fix

