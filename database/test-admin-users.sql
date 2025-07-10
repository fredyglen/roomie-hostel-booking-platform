-- Production Admin Users for ROOMi Platform
-- Apple-Grade implementation following BE CONSCIOUS standards
--
-- Business Purpose: Creates production admin users for the ROOMi platform
-- with proper role assignments, permissions, and jurisdiction management
--
-- Technical Implementation: Inserts admin users into auth.users and profiles,
-- then assigns roles using the new admin_roles and admin_jurisdictions tables
--
-- @author ROOMi Platform Team
-- @version 3.0.0 - Production Ready
-- @compliance BE CONSCIOUS Apple-Grade Standards

-- ============================================================================
-- SUPREME ADMIN PRODUCTION USER
-- ============================================================================

-- Insert Supreme Admin user into auth.users
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'supreme.admin@roomi.com',
  crypt('admin123', gen_salt('bf')), -- Password: admin123
  now(),
  now(),
  now(),
  'authenticated',
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "admin", "admin_type": "supreme"}'
) ON CONFLICT (email) DO NOTHING;

-- Insert Supreme Admin profile
INSERT INTO profiles (
  id,
  email,
  role,
  first_name,
  last_name,
  phone,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'supreme.admin@roomi.com'),
  'supreme.admin@roomi.com',
  'supreme_admin',
  'Supreme',
  'Administrator',
  '+233200000001',
  now(),
  now()
) ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone,
  updated_at = now();

-- Insert Supreme Admin jurisdiction (Global access)
INSERT INTO admin_jurisdictions (
  admin_user_id,
  jurisdiction_type,
  jurisdiction_code,
  jurisdiction_name,
  assigned_by,
  metadata
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'supreme.admin@roomi.com'),
  'country',
  'GH',
  'Ghana',
  (SELECT id FROM auth.users WHERE email = 'supreme.admin@roomi.com'), -- Self-assigned for initial setup
  jsonb_build_object(
    'campuses', ARRAY['UPSA-Accra', 'UG-Legon', 'KNUST-Kumasi', 'UCC-Cape-Coast'],
    'access_level', 'global',
    'setup_type', 'initial'
  )
) ON CONFLICT (admin_user_id, jurisdiction_type, jurisdiction_code) DO NOTHING;

-- ============================================================================
-- CAMPUS ADMIN PRODUCTION USERS
-- ============================================================================

-- Insert UPSA Campus Admin user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'campus.admin.upsa@roomi.com',
  crypt('campus123', gen_salt('bf')), -- Password: campus123
  now(),
  now(),
  now(),
  'authenticated',
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "admin", "admin_type": "campus", "university": "UPSA"}'
) ON CONFLICT (email) DO NOTHING;

-- Insert UPSA Campus Admin profile
INSERT INTO profiles (
  id,
  email,
  role,
  first_name,
  last_name,
  phone,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'campus.admin.upsa@roomi.com'),
  'campus.admin.upsa@roomi.com',
  'campus_admin',
  'UPSA Campus',
  'Administrator',
  '+233200000002',
  now(),
  now()
) ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone,
  updated_at = now();

-- Insert UPSA Campus Admin jurisdiction
INSERT INTO admin_jurisdictions (
  admin_user_id,
  jurisdiction_type,
  jurisdiction_code,
  jurisdiction_name,
  assigned_by,
  metadata
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'campus.admin.upsa@roomi.com'),
  'campus',
  'upsa-accra',
  'University of Professional Studies, Accra',
  (SELECT id FROM auth.users WHERE email = 'supreme.admin@roomi.com'),
  jsonb_build_object(
    'university_code', 'UPSA',
    'campus_location', 'Accra',
    'access_level', 'campus',
    'setup_type', 'initial'
  )
) ON CONFLICT (admin_user_id, jurisdiction_type, jurisdiction_code) DO NOTHING;

-- Insert University of Ghana Campus Admin user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'campus.admin.ug@roomi.com',
  crypt('campus123', gen_salt('bf')), -- Password: campus123
  now(),
  now(),
  now(),
  'authenticated',
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "admin", "admin_type": "campus", "university": "UG"}'
) ON CONFLICT (email) DO NOTHING;

-- Insert UG Campus Admin profile
INSERT INTO profiles (
  id,
  email,
  role,
  first_name,
  last_name,
  phone,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'campus.admin.ug@roomi.com'),
  'campus.admin.ug@roomi.com',
  'campus_admin',
  'UG Campus',
  'Administrator',
  '+233200000003',
  now(),
  now()
) ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone,
  updated_at = now();

-- Insert UG Campus Admin jurisdiction
INSERT INTO admin_jurisdictions (
  admin_user_id,
  jurisdiction_type,
  jurisdiction_code,
  jurisdiction_name,
  assigned_by,
  metadata
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'campus.admin.ug@roomi.com'),
  'campus',
  'ug-legon',
  'University of Ghana, Legon',
  (SELECT id FROM auth.users WHERE email = 'supreme.admin@roomi.com'),
  jsonb_build_object(
    'university_code', 'UG',
    'campus_location', 'Legon',
    'access_level', 'campus',
    'setup_type', 'initial'
  )
) ON CONFLICT (admin_user_id, jurisdiction_type, jurisdiction_code) DO NOTHING;

-- ============================================================================
-- DEVELOPMENT ADMIN USER (Simple credentials for testing)
-- ============================================================================

-- Insert Development Admin user with simple credentials
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'admin@roomi.com',
  crypt('admin123', gen_salt('bf')), -- Password: admin123
  now(),
  now(),
  now(),
  'authenticated',
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "admin", "admin_type": "supreme"}'
) ON CONFLICT (email) DO NOTHING;

-- Insert Development Admin profile
INSERT INTO profiles (
  id,
  email,
  role,
  first_name,
  last_name,
  phone,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@roomi.com'),
  'admin@roomi.com',
  'supreme_admin',
  'Development',
  'Administrator',
  '+233200000000',
  now(),
  now()
) ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone,
  updated_at = now();

-- Insert Development Admin jurisdiction (Global access)
INSERT INTO admin_jurisdictions (
  admin_user_id,
  jurisdiction_type,
  jurisdiction_code,
  jurisdiction_name,
  assigned_by,
  metadata
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@roomi.com'),
  'country',
  'GH',
  'Ghana',
  (SELECT id FROM auth.users WHERE email = 'admin@roomi.com'), -- Self-assigned for development
  jsonb_build_object(
    'campuses', ARRAY['UPSA-Accra', 'UG-Legon', 'KNUST-Kumasi', 'UCC-Cape-Coast'],
    'access_level', 'global',
    'setup_type', 'development'
  )
) ON CONFLICT (admin_user_id, jurisdiction_type, jurisdiction_code) DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify admin users were created with proper profiles and jurisdictions
SELECT
  u.email,
  u.email_confirmed_at,
  p.role,
  p.first_name,
  p.last_name,
  p.phone,
  aj.jurisdiction_type,
  aj.jurisdiction_code,
  aj.jurisdiction_name,
  aj.is_active as jurisdiction_active
FROM auth.users u
JOIN profiles p ON u.id = p.id
LEFT JOIN admin_jurisdictions aj ON u.id = aj.admin_user_id
WHERE u.email LIKE '%admin%roomi.com'
  AND p.role IN ('supreme_admin', 'campus_admin')
ORDER BY u.email, aj.jurisdiction_type;

-- Verify admin roles configuration
SELECT
  role_type,
  role_name,
  array_length(permissions, 1) as permission_count,
  array_length(features, 1) as feature_count,
  jurisdiction_scope,
  international_access,
  is_active
FROM admin_roles
ORDER BY role_type;

-- Summary of admin setup
SELECT
  'Admin Users Created' as metric,
  COUNT(*) as count
FROM profiles
WHERE role IN ('supreme_admin', 'campus_admin')
UNION ALL
SELECT
  'Admin Jurisdictions Assigned' as metric,
  COUNT(*) as count
FROM admin_jurisdictions
WHERE is_active = true;
