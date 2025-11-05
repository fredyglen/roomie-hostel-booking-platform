# IMMEDIATE ACTION CHECKLIST
**Created:** 2025-11-05  
**Priority:** CRITICAL - Start Today  
**Goal:** Production-ready in 3-4 weeks

---

## 🚨 WEEK 1: CRITICAL FIXES (P0)

### Day 1-2: Remove Fake Ratings ⚠️ CRITICAL
**Files to Fix:**
- [ ] `src/components/StoryViewer.tsx` (line 74-75)
- [ ] `src/components/property/PropertyDetailDesktop.tsx` (line 51)
- [ ] `src/components/property/PropertyDetailModal.tsx`
- [ ] `src/components/property/PropertyDetailsView.tsx`
- [ ] `src/components/property/PropertyDetailTabs.tsx` (lines 444-466)
- [ ] `src/components/admin/CampusAnalytics.tsx` (lines 332, 359-360)

**Action:**
1. Create `src/hooks/usePropertyReviewSummary.ts`
2. Connect to `reviewService.getReviewAnalytics()`
3. Replace all hardcoded ratings with real data
4. Show "No reviews yet" when rating is null
5. Delete mock `getReviews()` function

**Test:**
- [ ] View property without reviews - shows "No reviews yet"
- [ ] Submit test review - updates immediately
- [ ] Admin dashboard shows real or "Not available"

---

### Day 3-4: Fix Payment Validation Bypass ⚠️ CRITICAL
**Files to Fix:**
- [ ] `src/components/booking/PaymentStep.tsx` (lines 185-195)
- [ ] `src/hooks/payment/useBusinessPaymentFlow.tsx`
- [ ] `src/services/payment/PaymentFirstBookingService.ts` (lines 199-217)

**Action:**
1. Replace `amount` with `base_amount` + `has_agent`
2. Add `commission_breakdown` to metadata
3. Set `ALLOW_LEGACY_PAYMENTS=false` in Edge Function env

**Test:**
- [ ] Create booking and pay - uses validated API
- [ ] Check transaction - has commission_snapshot
- [ ] Try to manipulate amount in browser - fails

---

### Day 5: Fix Price Filter Defaults
**Files to Fix:**
- [ ] `src/hooks/filters/useFilteredProperties.tsx` (line 26)
- [ ] `src/hooks/filters/index.tsx` (line 23)
- [ ] `src/services/hostel-management.service.ts`

**Action:**
1. Create `src/config/constants.ts` with `PRICE_MAX_DEFAULT = 50000`
2. Replace all `10000` with `PRICE_MAX_DEFAULT`
3. Update filter UI components

**Test:**
- [ ] Open property listing - all properties visible
- [ ] Filter by price - works up to 50K
- [ ] Check expensive properties (>10K) - visible

---

## 🔥 WEEK 2: INVENTORY MANAGEMENT (P0)

### Day 1-3: Minimal Bed Tracking
**Files to Fix:**
- [ ] `supabase/functions/paystack-webhook/index.ts` (after line 206)

**Action:**
1. Add inventory decrement after booking confirmation
2. Run SQL: `ALTER TABLE rooms ADD CONSTRAINT check_beds_available_non_negative CHECK (beds_available >= 0)`
3. Create trigger `update_property_occupancy()`

**SQL to Run:**
```sql
-- Add CHECK constraint
ALTER TABLE rooms
ADD CONSTRAINT check_beds_available_non_negative
CHECK (beds_available >= 0);

-- Create trigger
CREATE OR REPLACE FUNCTION update_property_occupancy()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE properties
  SET current_occupancy = (
    SELECT COALESCE(SUM(occupied_beds), 0)
    FROM rooms
    WHERE property_id = NEW.property_id
  )
  WHERE id = NEW.property_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_property_occupancy
AFTER UPDATE OF occupied_beds ON rooms
FOR EACH ROW
EXECUTE FUNCTION update_property_occupancy();
```

**Test:**
- [ ] Create booking and pay
- [ ] Check rooms table - beds_available decreased
- [ ] Check properties table - current_occupancy increased
- [ ] Try to book when beds_available = 0 - fails gracefully

---

### Day 4-5: Create Beds Table
**Action:**
1. Create migration: `supabase/migrations/20251105_create_beds_table.sql`
2. Run migration in Supabase
3. Seed beds for existing properties

**SQL Migration:**
```sql
-- Create beds table
CREATE TABLE IF NOT EXISTS beds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  bed_number INTEGER NOT NULL,
  is_occupied BOOLEAN DEFAULT FALSE,
  reserved_until TIMESTAMP WITH TIME ZONE,
  reserved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_bed_per_room UNIQUE(room_id, bed_number),
  CONSTRAINT valid_bed_number CHECK (bed_number > 0)
);

CREATE INDEX idx_beds_room_id ON beds(room_id);
CREATE INDEX idx_beds_availability ON beds(is_occupied, reserved_until);

-- Enable RLS
ALTER TABLE beds ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Students can view available beds" ON beds
  FOR SELECT USING (is_occupied = false);

CREATE POLICY "Owners can manage beds for their properties" ON beds
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM rooms r
      JOIN properties p ON r.property_id = p.id
      WHERE r.id = beds.room_id AND p.owner_id = auth.uid()
    )
  );
```

**Test:**
- [ ] Migration runs without errors
- [ ] Beds table exists in Supabase
- [ ] RLS policies work correctly

---

## ⚠️ WEEK 3: REMOVE MOCK DATA (P1)

### Day 1-2: Admin Components
**Files to Fix:**
- [ ] `src/components/admin/StudentVerificationSystem.tsx` (line 177)
- [ ] `src/components/admin/UniversityIntegration.tsx` (line 362)
- [ ] `src/components/admin/CampusAnalytics.tsx` (fake metrics)

**Action:**
1. Replace mock data with real API calls
2. Show "No data available" for missing data
3. Remove all `// Mock data` comments

---

### Day 3-4: Student Verification
**Files to Fix:**
- [ ] `src/hooks/booking/useStudentVerificationForm.tsx` (line 58)
- [ ] `src/components/booking/steps/VerificationStep.tsx`

**Action:**
1. Implement real verification API call
2. Integrate with university enrollment systems
3. Add proper error handling

---

### Day 5: Commission Hardcoding
**Files to Fix:**
- [ ] `src/services/database/standardizedQueries.ts` (lines 283-284)

**Action:**
1. Replace hardcoded `0.05` and `100` with `centralizedCommissionEngine.calculateCommissions()`
2. Ensure all booking creation uses centralized engine

---

## 🧪 WEEK 4: TESTING & DEPLOYMENT (P1)

### Day 1-2: Integration Testing
**Tests to Write:**
- [ ] Concurrent booking test (2 users, 1 bed)
- [ ] Payment failure scenario
- [ ] Inventory edge cases (negative, zero)
- [ ] Webhook idempotency (duplicate events)

---

### Day 3: Staging Deployment
**Checklist:**
- [ ] Deploy to staging Supabase project
- [ ] Run all migrations
- [ ] Test with real Paystack test keys
- [ ] Invite 5 beta testers

---

### Day 4: Bug Fixes
**Action:**
1. Fix bugs found by beta testers
2. Monitor error logs
3. Adjust based on feedback

---

### Day 5: Documentation
**Documents to Update:**
- [ ] README.md - Known limitations
- [ ] DEPLOYMENT.md - Deployment steps
- [ ] TROUBLESHOOTING.md - Common issues

---

## 📊 PROGRESS TRACKING

### Week 1 Progress:
- [ ] Fake ratings removed (6 files)
- [ ] Payment bypass fixed (3 files)
- [ ] Price filters fixed (3 files)

### Week 2 Progress:
- [ ] Inventory management implemented
- [ ] Beds table created
- [ ] Triggers deployed

### Week 3 Progress:
- [ ] Mock data removed
- [ ] Real verification implemented
- [ ] Commission hardcoding fixed

### Week 4 Progress:
- [ ] Integration tests written
- [ ] Staging deployed
- [ ] Beta testing complete
- [ ] Documentation updated

---

## 🎯 SUCCESS CRITERIA

### Before Launch:
- [ ] Zero hardcoded ratings in codebase
- [ ] All payments use validated API
- [ ] Inventory decrements on payment
- [ ] Price filters show all properties
- [ ] Concurrent booking tests pass
- [ ] Admin sees real or "Not available" data
- [ ] Staging deployment successful
- [ ] 5 beta users tested successfully

### After Launch:
- [ ] Monitor for double bookings (should be zero)
- [ ] Track payment validation errors
- [ ] Monitor inventory accuracy
- [ ] Collect real reviews

---

## 🚀 LAUNCH READINESS

### Pre-Launch Checklist:
- [ ] All Week 1 tasks complete
- [ ] All Week 2 tasks complete
- [ ] All Week 3 tasks complete
- [ ] All Week 4 tasks complete
- [ ] Beta testing successful
- [ ] Documentation complete
- [ ] Monitoring setup
- [ ] Rollback plan ready

### Launch Day:
- [ ] Deploy to production
- [ ] Monitor error logs
- [ ] Watch for double bookings
- [ ] Track payment success rate
- [ ] Respond to user feedback

---

## 📞 SUPPORT

### If Issues Arise:
1. Check error logs in Supabase
2. Review payment webhooks table
3. Check inventory counts
4. Verify RLS policies
5. Contact Paystack support if payment issues

---

**Remember: You're 80% there. Just finish the last 20% properly.**

**Don't rush. Don't skip steps. Follow this checklist exactly.**

**End of Checklist**

