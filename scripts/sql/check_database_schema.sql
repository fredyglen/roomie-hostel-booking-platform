-- =====================================================
-- DATABASE SCHEMA VERIFICATION SCRIPT
-- =====================================================
-- Run this in Supabase SQL Editor to see EXACTLY what exists
-- This will tell us the actual column names and structure

-- 1. Check properties table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'properties'
ORDER BY ordinal_position;

-- 2. Check if profiles table exists and its structure
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 3. Check what tables already exist
SELECT 
  table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 4. Check if compounds, rooms, beds, compound_properties already exist
SELECT 
  table_name,
  CASE 
    WHEN table_name IN ('compounds', 'rooms', 'beds', 'compound_properties') THEN 'EXISTS'
    ELSE 'MISSING'
  END as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('compounds', 'rooms', 'beds', 'compound_properties');

-- 5. Check foreign key constraints on properties table
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'properties'
  AND tc.table_schema = 'public';

