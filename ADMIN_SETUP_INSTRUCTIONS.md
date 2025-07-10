# 🔐 Admin Portal Authentication Setup Guide

**Date**: 2025-07-09  
**Status**: IMMEDIATE ACTION REQUIRED  
**Compliance**: BE CONSCIOUS Apple-Grade Standards  

---

## 🚨 **Issue Identified**

**Problem**: Cannot sign in to admin portal - admin users don't exist in database yet.

**Root Cause**: The admin user setup script hasn't been executed, so there are no admin accounts to authenticate against.

---

## 🔧 **Solution: Manual Admin User Setup**

Since the automated script requires additional environment variables, here's the manual approach:

### **Step 1: Access Supabase Dashboard**

1. Go to: https://supabase.com/dashboard
2. Select your project: **ROOMi_v3**
3. Navigate to: **SQL Editor**

### **Step 2: Execute Admin User Creation SQL**

Copy and paste this SQL script into the Supabase SQL Editor:

```sql
-- ============================================================================
-- MANUAL ADMIN USER SETUP FOR ROOMI PLATFORM (CORRECTED VERSION)
-- ============================================================================

-- Step 1: Check if admin user already exists
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Check if admin user exists
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@roomi.com';

    IF admin_user_id IS NULL THEN
        -- Create Development Admin User
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
          crypt('admin123', gen_salt('bf')),
          now(),
          now(),
          now(),
          'authenticated',
          '{"provider": "email", "providers": ["email"]}',
          '{"role": "admin", "admin_type": "supreme"}'
        );

        -- Get the newly created user ID
        SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@roomi.com';

        RAISE NOTICE 'Created admin user with ID: %', admin_user_id;
    ELSE
        RAISE NOTICE 'Admin user already exists with ID: %', admin_user_id;
    END IF;

    -- Create or update admin profile (using 'admin' role which is allowed)
    INSERT INTO profiles (
      id,
      email,
      role,
      first_name,
      last_name,
      phone,
      created_at
    ) VALUES (
      admin_user_id,
      'admin@roomi.com',
      'admin',
      'Development',
      'Administrator',
      '+233200000000',
      now()
    ) ON CONFLICT (id) DO UPDATE SET
      role = EXCLUDED.role,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      phone = EXCLUDED.phone;

    RAISE NOTICE 'Admin profile created/updated successfully';
END $$;
```

### **Step 3: Verify Admin User Creation**

Run this verification query in the SQL Editor:

```sql
-- Verify admin user was created
SELECT 
  u.email,
  p.role,
  p.first_name,
  p.last_name,
  u.created_at
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE u.email = 'admin@roomi.com';
```

You should see one row with the admin user details.

---

## 🔑 **Admin Login Credentials**

After running the SQL script, use these credentials to log in:

**Email**: `admin@roomi.com`  
**Password**: `admin123`  
**Role**: Supreme Admin (full access)

---

## 🧪 **Testing Steps**

### **Step 1: Access Admin Login**
Navigate to: `http://localhost:5173/admin/login`

### **Step 2: Enter Credentials**
- Email: `admin@roomi.com`
- Password: `admin123`

### **Step 3: Verify Access**
After successful login, you should:
- Be redirected to `/admin/dashboard`
- See "Supreme Administrator" role displayed
- Have access to all admin features

---

## 🔍 **Troubleshooting**

### **If Login Still Fails:**

1. **Check Browser Console** for error messages
2. **Verify Database**: Run the verification query again
3. **Clear Browser Cache**: Clear cookies and local storage
4. **Check Network Tab**: Look for failed API requests

### **Common Issues:**

**Issue**: "Invalid login credentials"
**Solution**: Ensure the SQL script ran successfully and the user exists

**Issue**: "Access denied: Admin privileges required"
**Solution**: Verify the profile role is set to 'supreme_admin'

**Issue**: Page redirects to regular login
**Solution**: Make sure you're accessing `/admin/login` not `/login`

---

## 🚀 **Next Steps After Successful Login**

1. **Change Default Password**: Update the admin password from the default
2. **Create Additional Admins**: Use the admin portal to create more admin users
3. **Test Admin Features**: Verify all admin functionality works correctly
4. **Set Up Campus Admins**: Create campus-specific admin accounts if needed

---

## 📋 **Additional Admin Accounts (Optional)**

If you need more admin accounts, you can also create:

**Supreme Admin (Production)**:
```sql
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, role, raw_app_meta_data, raw_user_meta_data) 
VALUES (gen_random_uuid(), 'supreme.admin@roomi.com', crypt('admin123', gen_salt('bf')), now(), now(), now(), 'authenticated', '{"provider": "email", "providers": ["email"]}', '{"role": "admin", "admin_type": "supreme"}') 
ON CONFLICT (email) DO NOTHING;

INSERT INTO profiles (id, email, role, first_name, last_name, phone, created_at, updated_at) 
VALUES ((SELECT id FROM auth.users WHERE email = 'supreme.admin@roomi.com'), 'supreme.admin@roomi.com', 'supreme_admin', 'Supreme', 'Administrator', '+233200000001', now(), now()) 
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, updated_at = now();
```

**Campus Admin (UPSA)**:
```sql
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, role, raw_app_meta_data, raw_user_meta_data) 
VALUES (gen_random_uuid(), 'campus.admin.upsa@roomi.com', crypt('campus123', gen_salt('bf')), now(), now(), now(), 'authenticated', '{"provider": "email", "providers": ["email"]}', '{"role": "admin", "admin_type": "campus", "university": "UPSA"}') 
ON CONFLICT (email) DO NOTHING;

INSERT INTO profiles (id, email, role, first_name, last_name, phone, created_at, updated_at) 
VALUES ((SELECT id FROM auth.users WHERE email = 'campus.admin.upsa@roomi.com'), 'campus.admin.upsa@roomi.com', 'campus_admin', 'UPSA Campus', 'Administrator', '+233200000002', now(), now()) 
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, updated_at = now();
```

---

## ✅ **Success Criteria**

You'll know the setup is successful when:
- [ ] Admin user exists in database (verification query returns results)
- [ ] Login with `admin@roomi.com` / `admin123` works
- [ ] Redirected to admin dashboard after login
- [ ] Admin features are accessible
- [ ] No authentication errors in console

---

**Status**: Ready for immediate implementation  
**Priority**: HIGH - Required for admin portal access  
**Estimated Time**: 5-10 minutes
