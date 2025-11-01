# ROOMi Database Schema Consolidation Plan

## 🎯 **OBJECTIVE**: Establish Single Source of Truth for All Data Entities

### **CRITICAL ISSUE IDENTIFIED**
The ROOMi platform currently suffers from **database schema fragmentation** where multiple tables exist for the same data type, causing:
- Inconsistent data retrieval
- Broken owner portal analytics
- Failed cross-portal interconnectivity
- Data integrity issues

## 📊 **CURRENT STATE ANALYSIS**

### **1. Booking Tables Conflict**

#### **PROBLEM**: Two booking tables in use
- `bookings` (basic schema) - 6 components
- `bookings_enhanced` (comprehensive schema) - 7 components

#### **AUTHORITATIVE TABLE**: `bookings_enhanced`
**Rationale**: Defined in `standardizedQueries.ts` as `TABLE_NAMES.BOOKINGS`

#### **Migration Required**:
```sql
-- Step 1: Migrate data from bookings to bookings_enhanced
INSERT INTO bookings_enhanced (
  student_id, property_id, property_owner_id, 
  check_in_date, check_out_date, total_amount, 
  status, payment_status, created_at
)
SELECT 
  student_id, property_id, owner_id,
  start_date, end_date, amount,
  status, 'pending', created_at
FROM bookings
WHERE id NOT IN (SELECT id FROM bookings_enhanced);

-- Step 2: Drop old bookings table after verification
-- DROP TABLE bookings;
```

### **2. Property Tables Status**
✅ **CONSOLIDATED**: Single `properties` table used consistently
- All components use same table
- No conflicts detected

### **3. Profile Tables Status**
✅ **CONSOLIDATED**: Single `profiles` table used consistently
- All components use same table
- No conflicts detected

## 🔧 **CONSOLIDATION TASKS**

### **Phase 1: Booking Table Unification (HIGH PRIORITY)**

#### **Components to Update**:
1. `src/services/booking/useBookingService.ts` (Lines 27, 60)
2. `src/components/student/BookingHistory.tsx` (Line 52)
3. `src/pages/student/BookingHistory.tsx` (Line 55)
4. `src/components/booking/AdvancedBookingForm.tsx` (Line 81)

#### **Required Changes**:
```typescript
// BEFORE (Incorrect)
.from('bookings')

// AFTER (Correct)
.from(TABLE_NAMES.BOOKINGS) // resolves to 'bookings_enhanced'
```

### **Phase 2: Mock Data Elimination (HIGH PRIORITY)**

#### **Files with Mock Data Fallbacks**:
1. `src/pages/owner/Properties.tsx` (Line 162)
   ```typescript
   // REMOVE THIS FALLBACK
   const propertyList = properties && properties.length > 0 ? properties : mockProperties;
   ```

#### **Required Action**:
- Remove all mock data fallbacks
- Force components to use real database data only
- Add proper error handling for empty states

### **Phase 3: Import Standardization (MEDIUM PRIORITY)**

#### **Enforce TABLE_NAMES Usage**:
All database queries must use:
```typescript
import { TABLE_NAMES } from '@/services/database/standardizedQueries';

// Use TABLE_NAMES.BOOKINGS instead of hardcoded strings
supabase.from(TABLE_NAMES.BOOKINGS)
```

## 🚀 **IMPLEMENTATION PLAN**

### **Step 1: Data Migration (Day 1)**
1. Backup existing data
2. Run booking table migration script
3. Verify data integrity
4. Test basic functionality

### **Step 2: Code Updates (Day 1-2)**
1. Update all components to use `TABLE_NAMES.BOOKINGS`
2. Remove mock data fallbacks
3. Add missing imports (e.g., supabase in usePropertyCreation)
4. Test each updated component

### **Step 3: Verification (Day 2)**
1. Test owner portal analytics
2. Verify booking data consistency
3. Test cross-portal data flow
4. Confirm student-owner interconnectivity

### **Step 4: Cleanup (Day 3)**
1. Remove deprecated booking table
2. Update documentation
3. Add schema validation tests
4. Deploy to production

## 📋 **VERIFICATION CHECKLIST**

### **Owner Portal Functionality**
- [ ] Dashboard analytics show real data
- [ ] Property creation works
- [ ] Property editing works
- [ ] Booking management displays all bookings
- [ ] Revenue calculations are accurate

### **Cross-Portal Data Flow**
- [ ] Student bookings appear in owner dashboard
- [ ] Owner property updates reflect in student portal
- [ ] Admin portal shows consolidated data
- [ ] Real-time updates work across portals

### **Data Integrity**
- [ ] No duplicate bookings
- [ ] All booking data preserved
- [ ] Foreign key relationships intact
- [ ] No orphaned records

## ⚠️ **RISKS AND MITIGATION**

### **Risk 1: Data Loss During Migration**
**Mitigation**: Full database backup before migration

### **Risk 2: Downtime During Updates**
**Mitigation**: Staged deployment with rollback plan

### **Risk 3: Component Failures**
**Mitigation**: Comprehensive testing after each update

## 🎯 **SUCCESS METRICS**

1. **Owner Portal Analytics**: Show real revenue/booking data
2. **Zero Mock Data**: All components use database data
3. **Cross-Portal Sync**: Real-time data consistency
4. **Error Reduction**: No more "table not found" errors
5. **Performance**: Faster queries with single data source

## 📝 **NEXT IMMEDIATE ACTIONS**

1. **URGENT**: Fix missing supabase import in usePropertyCreation ✅ DONE
2. **HIGH**: Update booking table references to use TABLE_NAMES
3. **HIGH**: Remove mock data fallbacks in Properties.tsx
4. **MEDIUM**: Test owner portal property creation workflow
5. **MEDIUM**: Verify booking data migration requirements
