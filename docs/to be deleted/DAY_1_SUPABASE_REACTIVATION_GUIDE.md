# 🔥 DAY 1: SUPABASE REACTIVATION GUIDE - GET ROOMI BACK ONLINE!

**MISSION**: Reactivate your paused Supabase project and get ROOMi working in 30 minutes

---

## 🎯 **STEP 1: ACCESS SUPABASE DASHBOARD**

### **Go to Supabase Dashboard**
1. Open browser and go to: **https://supabase.com/dashboard**
2. Login with your account (the one you used with Lovable)
3. You should see your project list

### **Find Your ROOMi Project**
- **Project Name**: Look for `ymqnbekeqarjmxftzvks` or similar
- **Status**: Will show "Paused" or "Inactive" with a ⏸️ icon
- **Project URL**: `https://ymqnbekeqarjmxftzvks.supabase.co`

---

## 🚀 **STEP 2: RESTORE/UNPAUSE PROJECT**

### **Click on Your Paused Project**
1. Click on the paused project card
2. You'll see a message: "This project is paused"
3. Look for a **"Restore"** or **"Unpause"** button
4. Click the button

### **Wait for Reactivation**
- **Time**: 2-5 minutes
- **Status**: Will change from "Paused" to "Active" 
- **Indicator**: Green dot ✅ next to project name

### **If You Don't See Restore Button:**
1. Check if project is deleted (after 90 days)
2. Look for "Download backup" option
3. Contact Supabase support if needed

---

## 🧪 **STEP 3: TEST DATABASE CONNECTION**

### **Test from Your ROOMi Project**
1. Open terminal in your ROOMi project folder
2. Run the test script:
   ```bash
   node test-database-connection.js
   ```

### **Expected Success Output:**
```
🔧 Supabase URL: https://ymqnbekeqarjmxftzvks.supabase.co
🔧 Supabase Key (first 20 chars): eyJhbGciOiJIUzI1NiIs...
🔍 Testing database connection...
✅ Database connection successful
✅ Properties table accessible
✅ Found X properties in database
```

### **If Connection Fails:**
```bash
# Try this alternative test
npx tsx src/scripts/check-database-schema.ts
```

---

## 🌐 **STEP 4: START DEVELOPMENT SERVER**

### **Start ROOMi Application**
```bash
npm run dev
```

### **Expected Output:**
```
VITE v5.4.19  ready in 800ms
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.42.101:5173/
```

### **Test All Three Portals:**
1. **Student Portal**: http://localhost:5173/student/properties
2. **Owner Portal**: http://localhost:5173/owner/dashboard
3. **Admin Portal**: http://localhost:5173/admin/dashboard

---

## 🔍 **STEP 5: VERIFY DATA INTEGRITY**

### **Check Your Database Tables**
1. Go to Supabase Dashboard → Your Project
2. Click "Table Editor" in sidebar
3. Verify these tables exist:
   - ✅ `properties`
   - ✅ `bookings_enhanced` 
   - ✅ `profiles`
   - ✅ `auth.users`

### **Check Sample Data**
1. Click on `properties` table
2. Should see your existing property listings
3. If empty, that's OK - we'll add real data later

---

## 🚨 **TROUBLESHOOTING COMMON ISSUES**

### **Issue 1: "Project Not Found"**
**Cause**: Project might be deleted after 90 days
**Solution**: 
1. Check email for Supabase deletion notice
2. Create new project if needed
3. Import backup if available

### **Issue 2: "Connection Timeout"**
**Cause**: Project still starting up
**Solution**: 
1. Wait 5 more minutes
2. Refresh Supabase dashboard
3. Try connection test again

### **Issue 3: "Invalid API Key"**
**Cause**: Keys might have changed after restore
**Solution**:
1. Go to Project Settings → API
2. Copy new `anon` key
3. Update `.env` file:
   ```
   VITE_SUPABASE_ANON_KEY=your_new_key_here
   ```

### **Issue 4: "Database Empty"**
**Cause**: Data might not have restored properly
**Solution**:
1. Don't panic - this is fixable
2. We'll add real data from property owners
3. Better to start fresh than with mock data

---

## ✅ **SUCCESS CHECKLIST FOR DAY 1**

### **Before Moving to Day 2, Confirm:**
- [ ] Supabase project shows "Active" status
- [ ] `node test-database-connection.js` succeeds
- [ ] `npm run dev` starts without errors
- [ ] Can access http://localhost:5173
- [ ] Student portal loads (even if empty)
- [ ] Owner portal loads (even if empty)
- [ ] Admin portal loads (even if empty)

### **If ANY Item Fails:**
1. **DON'T PANIC** - this is normal
2. **DON'T START DEBUGGING** - ask for help
3. **DON'T WRITE DOCUMENTATION** - focus on fixing
4. **DO ASK FOR SPECIFIC HELP** - with exact error messages

---

## 🎯 **WHAT TO DO AFTER SUCCESS**

### **Celebrate! 🎉**
You just brought ROOMi back from the dead!

### **Next Steps:**
1. Take a screenshot of working portals
2. Move to DAY 2: Fix table naming issues
3. Stay focused on shipping, not perfecting

### **Remember:**
- **Working > Perfect**
- **Shipped > Polished** 
- **Revenue > Code Quality**

---

## 🆘 **EMERGENCY CONTACTS**

### **If You Get Stuck:**
1. **Supabase Support**: https://supabase.com/support
2. **Supabase Discord**: https://discord.supabase.com
3. **Documentation**: https://supabase.com/docs

### **What to Include in Support Request:**
- Project ID: `ymqnbekeqarjmxftzvks`
- Error message (exact text)
- What you were trying to do
- Screenshots if helpful

---

## 🔥 **MOTIVATION FOR TODAY**

**Remember**: Every minute your platform is down, students are paying unnecessary agent fees and struggling to find housing.

**Your mission**: Get ROOMi back online so you can start helping real students TODAY.

**Let's do this! 🚀**
