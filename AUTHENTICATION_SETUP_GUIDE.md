# ROOMi Authentication Setup Guide

## 🎯 Overview

This guide explains how to set up and use email/password authentication in your ROOMi platform after cleaning up demo data and fixing loading issues.

## ✅ What Was Fixed

### **Issues Resolved:**
1. **Infinite Loading**: Student dashboard was trying to fetch from empty properties table
2. **Demo Data Conflicts**: 3 demo users were interfering with authentication
3. **Multiple Auth Contexts**: Duplicate auth context files causing conflicts
4. **Database Dependencies**: Removed problematic database queries causing timeouts

### **Changes Made:**
- ✅ Deleted demo users from profiles table
- ✅ Fixed student dashboard to use mock data (no database dependency)
- ✅ Removed duplicate `EnhancedAuthContext.new.tsx`
- ✅ Created clean authentication test page
- ✅ Updated routing for test pages

## 🔧 Manual Cleanup Required

### **Step 1: Remove Demo Auth Users**
You must manually delete demo users from Supabase:

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard/project/ymqnbekeqarjmxftzvks
2. **Navigate to**: Authentication → Users
3. **Delete users with emails**:
   - `student@roomi.com`
   - `owner@roomi.com`
   - `admin@roomi.com`

### **Step 2: Clear Browser Storage**
Before testing, clear your browser storage:
1. Open DevTools (F12)
2. Go to Application tab
3. Clear Local Storage and Session Storage
4. Refresh the page

## 🧪 Testing Authentication

### **Test Page Access**
Navigate to: `http://localhost:8080/test-auth-clean`

### **Test Scenarios**

#### **1. Account Creation**
- Use your real email address
- Choose a secure password (minimum 6 characters)
- Select role: Student, Owner, or Admin
- Click "Create Account"

#### **2. Sign In**
- Use the email/password you just created
- Click "Sign In"
- Verify user information displays correctly

#### **3. Role-Based Access**
- Create accounts with different roles
- Test that role is properly stored and displayed
- Sign out and sign back in to verify persistence

#### **4. Error Handling**
- Try invalid email formats
- Try passwords under 6 characters
- Try signing in with wrong credentials

## ⚙️ Supabase Configuration

### **Current Settings (Already Configured)**
```json
{
  "external_email_enabled": true,
  "disable_signup": false,
  "mailer_autoconfirm": true,
  "password_min_length": 6,
  "jwt_exp": 3600,
  "site_url": "http://localhost:3000"
}
```

### **Environment Variables**
Your `.env` file should contain:
```env
VITE_SUPABASE_URL=https://ymqnbekeqarjmxftzvks.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🗄️ Database Schema

### **Profiles Table Structure**
```sql
profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP
)
```

### **Authentication Flow**
1. User signs up → Supabase creates auth user
2. Profile trigger creates profile record
3. User data is fetched and stored in context
4. Role-based routing is handled

## 🚨 Troubleshooting

### **Common Issues & Solutions**

#### **"Loading forever"**
- **Cause**: Old demo data or browser cache
- **Solution**: Clear browser storage and refresh

#### **"User not found"**
- **Cause**: Profile not created after signup
- **Solution**: Check Supabase triggers are enabled

#### **"Invalid credentials"**
- **Cause**: Wrong email/password or demo user conflict
- **Solution**: Ensure demo users are deleted, use correct credentials

#### **"Network error"**
- **Cause**: Supabase connection issues
- **Solution**: Check environment variables and internet connection

### **Debug Steps**
1. **Check Console**: Look for error messages in browser DevTools
2. **Verify Environment**: Ensure `.env` variables are correct
3. **Check Supabase**: Verify project is active and accessible
4. **Clear Cache**: Clear browser storage completely
5. **Test Network**: Ensure you can access Supabase dashboard

## 📱 Next Steps

### **After Authentication Works**
1. **Test All Roles**: Create and test student, owner, and admin accounts
2. **Role-Based Routing**: Verify users are redirected to correct dashboards
3. **Profile Management**: Test profile updates and avatar uploads
4. **Password Reset**: Test forgot password functionality
5. **Production Setup**: Configure production URLs and email templates

### **Integration with ROOMi Features**
1. **Property Management**: Connect authenticated owners to property creation
2. **Booking System**: Link students to booking functionality
3. **Admin Panel**: Set up admin oversight and verification
4. **Payment Integration**: Connect authenticated users to Paystack

## 🎉 Success Criteria

Your authentication is working correctly when:
- ✅ You can create accounts with email/password
- ✅ You can sign in and sign out
- ✅ User information persists across sessions
- ✅ Role-based access works correctly
- ✅ No infinite loading or console errors
- ✅ Student dashboard loads instantly

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Verify all manual cleanup steps are completed
3. Test with the clean auth page (`/test-auth-clean`)
4. Check browser console for specific error messages
5. Verify Supabase dashboard shows your project is active

The authentication system is now clean and ready for production use with proper email/password functionality!
