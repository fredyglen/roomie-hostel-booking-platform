# Database Migration Instructions

## ⚠️ CRITICAL: Apply Master Migration

The database migrations need to be applied to fix the compounds and beds system.

### **OPTION 1: Supabase Dashboard SQL Editor (RECOMMENDED)**

1. **Open Supabase SQL Editor:**
   - Go to: https://supabase.com/dashboard/project/ymqnbekeqarjmxftzvks/sql/new

2. **Copy the master migration file:**
   - Open: `supabase/migrations/20251105_master_migration.sql`
   - Copy the ENTIRE file contents (477 lines)

3. **Paste and run:**
   - Paste the SQL into the SQL Editor
   - Click **"Run"** button
   - Wait for success message

4. **Verify tables created:**
   - Go to: https://supabase.com/dashboard/project/ymqnbekeqarjmxftzvks/editor
   - Check that these tables exist:
     - ✅ `compounds`
     - ✅ `rooms`
     - ✅ `beds`
     - ✅ `compound_properties`
   - Check that `properties` table has new columns:
     - ✅ `structure_type`
     - ✅ `is_part_of_compound`
     - ✅ `compound_id`

---

### **OPTION 2: Supabase CLI (If you have the password)**

```powershell
# Run from project root
supabase db push
# Enter password when prompted
```

---

## 🔍 What This Migration Does

### **Tables Created:**
1. **compounds** - Multi-property compound management
2. **rooms** - Room tracking for properties
3. **beds** - Individual bed tracking for hostels
4. **compound_properties** - Junction table linking properties to compounds

### **Columns Added to Properties:**
1. **structure_type** - Property structure type (simple/building/compound)
2. **is_part_of_compound** - Boolean flag for compound membership
3. **compound_id** - Foreign key to compounds table

### **Features:**
- ✅ All RLS policies enabled
- ✅ Indexes for performance
- ✅ Triggers for automatic metric updates
- ✅ Comments for documentation
- ✅ No dependencies on missing tables (user_roles, properties.agent_id)

---

## ✅ After Migration Complete

1. **Test compounds page:**
   - Navigate to: http://localhost:5173/owner/compounds
   - Should load without 404 errors
   - Should show empty state (no compounds yet)

2. **Test property creation:**
   - Navigate to: http://localhost:5173/owner/property/new
   - Complete IntelligentPropertyRouter (5 steps)
   - Verify form shows only 4 tabs: Info, Rooms, Amenities, Media
   - Submit property
   - Verify structure_type is saved to database

3. **Verify database:**
   - Check that compounds table returns empty array (not 404)
   - Check that properties have structure_type column

---

## 🐛 If Migration Fails

**Error: "relation already exists"**
- This is OK - it means some tables already exist
- The migration uses `IF NOT EXISTS` so it's safe to run multiple times

**Error: "column already exists"**
- This is OK - it means some columns already exist
- The migration uses `ADD COLUMN IF NOT EXISTS` so it's safe

**Error: "user_roles does not exist"**
- This should NOT happen - we removed all user_roles dependencies
- If you see this, let me know immediately

**Error: "properties.agent_id does not exist"**
- This should NOT happen - we removed all agent_id dependencies
- If you see this, let me know immediately

---

## 📋 Next Steps After Migration

Once the migration is complete:
1. ✅ Mark Task 2 as complete
2. ✅ Proceed to Category 8: Testing & Verification
3. ✅ Test all implemented features systematically
4. ✅ Update IMPLEMENTATION_TASK_TRACKER.md with progress

