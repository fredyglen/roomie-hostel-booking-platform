# Database Migration Instructions (CORRECTED)

## ⚠️ CRITICAL: Apply Master Migration

The database migrations need to be applied to fix the compounds and beds system.

## 🔧 WHAT WAS FIXED

**PROBLEM:** Initial migration incorrectly assumed missing dependencies and removed critical RLS policies.

**SOLUTION:** Migration now uses **existing schema**:
- ✅ Uses `profiles.role` for admin role checking (NOT a separate user_roles table)
- ✅ Uses `properties.agent_id` for agent assignment (already exists from migration 202510240002)
- ✅ Uses `properties.owner_id` for ownership (already exists from migration 20241215)
- ✅ Includes ALL proper RLS policies for admin, agent, owner, and student access

**RESULT:** Database will be **fully functional** after migration with complete role-based access control.

---

### **OPTION 1: Supabase Dashboard SQL Editor (RECOMMENDED)**

1. **Open Supabase SQL Editor:**
   - Go to: https://supabase.com/dashboard/project/ymqnbekeqarjmxftzvks/sql/new

2. **Copy the master migration file:**
   - Open: `supabase/migrations/20251105_master_migration.sql`
   - Copy the ENTIRE file contents (~580 lines)

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
- ✅ All RLS policies enabled (owner, agent, admin, public, student, occupant)
- ✅ Indexes for performance
- ✅ Triggers for automatic metric updates
- ✅ Comments for documentation
- ✅ Uses existing schema (profiles.role, properties.agent_id, properties.owner_id)

### **RLS Policies Created:**
- ✅ **Owner policies** - Owners can manage their own compounds/rooms/beds
- ✅ **Agent policies** - Agents can manage properties assigned to them (uses properties.agent_id)
- ✅ **Admin policies** - Admins can manage all resources (uses profiles.role)
- ✅ **Public policies** - Public can view all resources for browsing
- ✅ **Student policies** - Students can view available beds
- ✅ **Occupant policies** - Current occupants can view their own bed

### **Fully Functional After Migration:**
- ✅ Admin users can access all compound data
- ✅ Agents can manage properties assigned to them
- ✅ Owners can manage their own properties
- ✅ Students can browse and view available beds
- ✅ All role-based access control is working

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

**Error: "profiles does not exist"**
- This should NOT happen - profiles table exists from migration 20241215
- Check that migration 20241215_core_profiles_and_properties.sql was applied

**Error: "properties.agent_id does not exist"**
- This should NOT happen - agent_id column exists from migration 202510240002
- Check that migration 202510240002_properties_add_missing_columns.sql was applied

**Error: "column property_id does not exist"**
- This was the original error - now fixed in corrected migration
- The migration now properly references properties.id

---

## 📋 Next Steps After Migration

Once the migration is complete:
1. ✅ Mark Task 2 as complete
2. ✅ Proceed to Category 8: Testing & Verification
3. ✅ Test all implemented features systematically
4. ✅ Update IMPLEMENTATION_TASK_TRACKER.md with progress

