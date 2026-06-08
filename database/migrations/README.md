# How to Run This Migration

## Step 1: Open Supabase Dashboard
1. Go to https://app.supabase.com
2. Select your ROOMi project

## Step 2: Open SQL Editor
1. Click "SQL Editor" in the left sidebar
2. Click "New Query"

## Step 3: Run the Migration
1. Open the file `004_fix_property_sync.sql` in this folder
2. Copy ALL the SQL code
3. Paste it into the SQL Editor
4. Click "Run"

## Step 4: Verify It Worked
The query will show:
- "Migration complete!"
- Total number of properties
- Total number of verification entries
- Number of properties needing approval

## What This Fixes
1. ✅ Adds all missing columns to `properties` table
2. ✅ Creates `property_verifications` table (admin approval queue)
3. ✅ Creates `buildings`, `floors`, `rooms` tables
4. ✅ Fixes existing data (sets proper defaults)
5. ✅ Creates indexes for fast queries
6. ✅ Sets up security policies (RLS)

## After Running
The property creation pipeline will now:
- Create a property with `verification_status = 'pending'`
- Create a verification entry for the admin queue
- Admin can approve → property becomes visible to students
