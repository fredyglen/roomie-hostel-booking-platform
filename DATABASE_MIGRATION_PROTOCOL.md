# DATABASE MIGRATION PROTOCOL (MANDATORY)

## ⚠️ CRITICAL: READ THIS BEFORE TOUCHING ANY DATABASE CODE

This protocol was created after an AI agent nearly destroyed the production database by making assumptions instead of checking the actual schema.

---

## THE DISASTER THAT HAPPENED (2025-11-05)

**What the AI did wrong:**
1. ❌ Created migrations based on ASSUMPTIONS about what existed in the database
2. ❌ Removed critical dependencies (user_roles, properties.agent_id) thinking they didn't exist
3. ❌ Tried to create a duplicate `rooms` table that already existed
4. ❌ Used wrong column names (`property_id` instead of `properties.id`)
5. ❌ Rushed to "fix" things without understanding the actual schema
6. ❌ Created "temporary fixes" that would have left the system partially broken

**What the user had to do:**
1. ✅ STOP the AI from applying broken migrations
2. ✅ FORCE the AI to check the actual database schema first
3. ✅ Run 5+ SQL queries to reveal what actually exists
4. ✅ Correct the AI's assumptions one by one

**The result:**
- Nearly broke admin role-based access control
- Nearly broke agent property management
- Nearly created duplicate tables causing conflicts
- Wasted hours debugging AI assumptions

---

## MANDATORY PROTOCOL FOR DATABASE CHANGES

### STEP 1: STOP AND ANALYZE (REQUIRED)

Before writing ANY database migration, you MUST:

1. **Ask yourself these questions:**
   - What tables does this migration depend on?
   - What columns does this migration reference?
   - What foreign keys will this create?
   - What RLS policies will this affect?
   - Could this conflict with existing schema?

2. **If you answer "I don't know" to ANY question, STOP IMMEDIATELY**

---

### STEP 2: CHECK THE ACTUAL DATABASE (REQUIRED)

Create a schema verification script and have the user run it:

```sql
-- Template: Always check these before creating migrations

-- 1. Check if table exists
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'YOUR_TABLE_NAME';

-- 2. Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'YOUR_TABLE_NAME'
ORDER BY ordinal_position;

-- 3. Check foreign key constraints
SELECT
  tc.constraint_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'YOUR_TABLE_NAME'
  AND tc.table_schema = 'public';

-- 4. Check existing RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'YOUR_TABLE_NAME';
```

**WAIT for the user to run these queries and provide output.**

**DO NOT proceed until you have ACTUAL DATABASE OUTPUT.**

---

### STEP 3: DOCUMENT YOUR FINDINGS (REQUIRED)

Create a file documenting what you found:

```markdown
## Database Schema Analysis for [FEATURE_NAME]

### Tables That Already Exist:
- `table_name` - [columns, foreign keys, purpose]

### Columns That Already Exist:
- `table.column` - [data type, nullable, references]

### Tables That Need to Be Created:
- `new_table` - [purpose, columns, foreign keys]

### Potential Conflicts:
- [List any naming conflicts, duplicate tables, etc.]

### Dependencies:
- This migration depends on: [list tables/columns]
- This migration will be used by: [list future features]
```

---

### STEP 4: WRITE THE MIGRATION (ONLY AFTER STEPS 1-3)

**Rules:**
1. ✅ Use EXACT column names from the actual database
2. ✅ Reference EXISTING tables correctly (e.g., `properties.id`, not `property_id`)
3. ✅ Use `IF NOT EXISTS` for all CREATE statements
4. ✅ Use `IF EXISTS` for all DROP statements
5. ✅ Use `ADD COLUMN IF NOT EXISTS` for ALTER TABLE
6. ✅ Include rollback instructions in comments
7. ✅ Test each section independently if possible

**DO NOT:**
- ❌ Assume tables exist without checking
- ❌ Assume column names without checking
- ❌ Create duplicate tables
- ❌ Remove dependencies thinking they don't exist
- ❌ Use generic names like `property_id` when the actual column is `properties.id`

---

### STEP 5: VERIFY BEFORE APPLYING (REQUIRED)

Before the user applies the migration:

1. **Review the migration file line by line**
2. **Check that every table reference matches the actual schema**
3. **Check that every column reference matches the actual schema**
4. **Check that every foreign key references an existing column**
5. **Check that RLS policies use existing tables (e.g., `profiles.role`, not `user_roles`)**

**Create a verification checklist:**
```markdown
## Pre-Migration Verification Checklist

- [ ] All table names match actual database schema
- [ ] All column names match actual database schema
- [ ] All foreign keys reference existing columns
- [ ] No duplicate table creation
- [ ] RLS policies use existing tables/columns
- [ ] Indexes use correct column names
- [ ] Triggers reference correct tables
- [ ] No assumptions about missing dependencies
```

---

### STEP 6: APPLY AND MONITOR (REQUIRED)

1. **Have user apply migration in Supabase SQL Editor**
2. **Wait for user to report success or errors**
3. **If errors occur:**
   - DO NOT guess the fix
   - Ask user to copy the EXACT error message
   - Go back to STEP 2 and check the schema again
   - Identify the root cause before attempting a fix

---

## COMMON MISTAKES TO AVOID

### ❌ MISTAKE 1: Assuming Dependencies Don't Exist
```sql
-- WRONG: Removing dependency because you think it doesn't exist
CREATE POLICY "Admins can manage" ON table
  FOR ALL USING (true);  -- Removed user_roles check

-- RIGHT: Check if profiles.role exists first, then use it
CREATE POLICY "Admins can manage" ON table
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('supreme_admin', 'campus_admin')
    )
  );
```

### ❌ MISTAKE 2: Using Wrong Column Names
```sql
-- WRONG: Assuming column is named property_id
WHERE property_id = some_value

-- RIGHT: Check actual schema, use properties.id
WHERE properties.id = some_value
```

### ❌ MISTAKE 3: Creating Duplicate Tables
```sql
-- WRONG: Creating table without checking if it exists
CREATE TABLE rooms (...);

-- RIGHT: Check if table exists first
-- If it exists, reference it; if not, create it
CREATE TABLE IF NOT EXISTS rooms (...);
```

---

## EMERGENCY ROLLBACK PROCEDURE

If a migration breaks the database:

1. **STOP immediately**
2. **DO NOT try to "fix" it with another migration**
3. **Ask user to run:**
   ```sql
   -- Check what was created
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```
4. **Create a rollback migration that:**
   - Drops only the NEW tables created
   - Removes only the NEW columns added
   - Does NOT touch existing data
5. **Have user review rollback before applying**

---

## FINAL RULE: WHEN IN DOUBT, ASK

If you are UNSURE about:
- Whether a table exists
- Whether a column exists
- What the correct column name is
- Whether a dependency exists

**STOP and ask the user to run a verification query.**

**NEVER guess. NEVER assume. ALWAYS verify.**

---

## SUCCESS CRITERIA

A migration is ready to apply when:
- ✅ You have verified the actual database schema
- ✅ You have documented all dependencies
- ✅ You have checked for naming conflicts
- ✅ You have verified all foreign key references
- ✅ You have confirmed RLS policies use existing tables
- ✅ You have created a verification checklist
- ✅ The user has reviewed and approved the migration

**If ANY of these are missing, the migration is NOT ready.**

