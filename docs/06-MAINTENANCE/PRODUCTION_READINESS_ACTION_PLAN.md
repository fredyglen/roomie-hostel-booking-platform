# PRODUCTION READINESS ACTION PLAN
**Created:** 2025-11-05  
**Target:** 3-4 weeks to production-ready  
**Priority:** Fix critical issues before adding features

---

## PHASE 1: CRITICAL FIXES (Week 1 - 5 days)

### Day 1-2: Remove Fake Ratings ⚠️ CRITICAL

**Problem:** 6+ files show hardcoded 4.5/4.4 star ratings and fake reviews

**Files to Fix:**
1. `src/components/StoryViewer.tsx` (lines 74-75)
2. `src/components/property/PropertyDetailDesktop.tsx` (line 51)
3. `src/components/property/PropertyDetailModal.tsx` (similar pattern)
4. `src/components/property/PropertyDetailsView.tsx` (similar pattern)
5. `src/components/property/PropertyDetailTabs.tsx` (lines 444-466)
6. `src/components/admin/CampusAnalytics.tsx` (lines 332, 359-360)

**Step-by-Step Fix:**

**Step 1:** Create shared hook
```typescript
// CREATE: src/hooks/usePropertyReviewSummary.ts
import { useQuery } from '@tanstack/react-query';
import { reviewService } from '@/services/reviewService';

export function usePropertyReviewSummary(propertyId: string) {
  return useQuery({
    queryKey: ['property-review-summary', propertyId],
    queryFn: async () => {
      const analytics = await reviewService.getReviewAnalytics(propertyId);
      return {
        avgRating: analytics.averageRating || null,
        reviewCount: analytics.totalReviews || 0,
        distribution: analytics.ratingDistribution || {}
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!propertyId
  });
}
```

**Step 2:** Update StoryViewer.tsx
```typescript
// REPLACE lines 74-75:
rating: 4.5, // TODO: Get from reviews
reviewCount: 0 // TODO: Get from reviews

// WITH:
const { data: reviewSummary } = usePropertyReviewSummary(propertyId);
// In propertyDetails object:
rating: reviewSummary?.avgRating || null,
reviewCount: reviewSummary?.reviewCount || 0

// In JSX (line 290):
{propertyDetails.rating ? (
  <>
    <Icon icon="solar:star-bold" className="h-4 w-4 text-yellow-400" />
    <span className="ml-1">{propertyDetails.rating.toFixed(1)} ({propertyDetails.reviewCount} reviews)</span>
  </>
) : (
  <span className="ml-1 text-gray-500 text-sm">No reviews yet</span>
)}
```

**Step 3:** Update PropertyDetailDesktop.tsx
```typescript
// ADD at top of component:
const { data: reviewSummary } = usePropertyReviewSummary(property.id.toString());

// REPLACE lines around 51:
<span className="font-bold">{property.rating || '4.5'}</span>
<div className="text-sm">(24 reviews)</div>

// WITH:
{reviewSummary?.avgRating ? (
  <>
    <span className="font-bold">{reviewSummary.avgRating.toFixed(1)}</span>
    <div className="text-sm">({reviewSummary.reviewCount} reviews)</div>
  </>
) : (
  <div className="text-sm text-gray-500">No reviews yet</div>
)}
```

**Step 4:** Remove mock reviews from PropertyDetailTabs.tsx
```typescript
// DELETE lines 444-466 (entire getReviews function)

// REPLACE with real data fetch:
const { data: reviews } = useQuery({
  queryKey: ['property-reviews', propertyId],
  queryFn: () => reviewService.getPropertyReviews(propertyId, { limit: 10 })
});

// In JSX:
{reviews && reviews.length > 0 ? (
  reviews.map((review) => (
    <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
      {/* Real review data */}
    </div>
  ))
) : (
  <div className="text-center py-8 text-gray-500">
    <p>No reviews yet</p>
    <p className="text-sm">Be the first to review this property!</p>
  </div>
)}
```

**Step 5:** Fix admin analytics
```typescript
// src/components/admin/CampusAnalytics.tsx
// REPLACE lines 332, 359-360:
studentSatisfactionScore: 4.5, // TODO
averageSessionDuration: 8.5, // TODO

// WITH:
// Fetch real review analytics for campus
const { data: campusReviews } = await reviewService.getCampusReviewAnalytics(selectedCampus.campusCode);
studentSatisfactionScore: campusReviews?.averageRating || null,

// In JSX, show "Not available" for null values:
{analyticsData.studentMetrics.studentSatisfactionScore ? (
  <span>{analyticsData.studentMetrics.studentSatisfactionScore.toFixed(1)}</span>
) : (
  <span className="text-gray-400">Not available</span>
)}
```

**Testing:**
- [ ] View property details - should show "No reviews yet" for properties without reviews
- [ ] Submit a test review - should update immediately
- [ ] Check admin dashboard - should show real or "Not available"

---

### Day 3-4: Fix Payment Validation Bypass ⚠️ CRITICAL

**Problem:** 3 client files use legacy `amount` API that bypasses server validation

**Files to Fix:**
1. `src/components/booking/PaymentStep.tsx` (lines 185-195)
2. `src/hooks/payment/useBusinessPaymentFlow.tsx` (similar)
3. `src/services/payment/PaymentFirstBookingService.ts` (lines 199-217)

**Step-by-Step Fix:**

**Step 1:** Update PaymentStep.tsx
```typescript
// REPLACE lines 185-195:
const { data, error } = await supabase.functions.invoke<InitPaymentResponse>('initialize-payment', {
  body: {
    email: user?.email || '',
    amount: totalAmount, // ❌ LEGACY
    currency: 'GHS',
    metadata: paystackMetadata,
    channels: ['card', 'mobile_money', 'bank', 'ussd'],
    callback_url: `${window.location.origin}/payment-success`,
  },
});

// WITH:
// Calculate base amount (property rent without fees)
const baseAmount = propertyRent; // Get from booking context
const hasAgent = !!agentId; // Get from property data

// Use validated API
const { data, error } = await supabase.functions.invoke<InitPaymentResponse>('initialize-payment', {
  body: {
    email: user?.email || '',
    base_amount: baseAmount, // ✅ Server validates
    has_agent: hasAgent,
    currency: 'GHS',
    metadata: {
      ...paystackMetadata,
      // Include breakdown for audit trail
      commission_breakdown: centralizedCommissionEngine.calculateCommissions(baseAmount, hasAgent)
    },
    channels: ['card', 'mobile_money', 'bank', 'ussd'],
    callback_url: `${window.location.origin}/payment-success`,
  },
});
```

**Step 2:** Update useBusinessPaymentFlow.tsx
```typescript
// Similar pattern - replace amount with base_amount + has_agent
```

**Step 3:** Update PaymentFirstBookingService.ts
```typescript
// REPLACE lines 199-217:
const { error: paymentError } = await supabase.functions.invoke(
  'initialize-payment',
  {
    body: {
      email: data.student.email,
      amount: data.pricing.totalAmount, // ❌ LEGACY
      currency: 'GHS',
      reference: paymentReference,
      metadata: { ... }
    }
  }
);

// WITH:
const { error: paymentError } = await supabase.functions.invoke(
  'initialize-payment',
  {
    body: {
      email: data.student.email,
      base_amount: data.property.rent, // ✅ Base rent
      has_agent: !!data.property.agent_id,
      currency: 'GHS',
      reference: paymentReference,
      metadata: {
        ...metadata,
        commission_breakdown: centralizedCommissionEngine.calculateCommissions(
          data.property.rent,
          !!data.property.agent_id
        )
      }
    }
  }
);
```

**Step 4:** Add server-side flag (optional but recommended)
```typescript
// supabase/functions/initialize-payment/index.ts
// Add at top:
const ALLOW_LEGACY_PAYMENTS = Deno.env.get('ALLOW_LEGACY_PAYMENTS') === 'true';

// In validation section (around line 167):
} else if (paymentData.amount) {
  if (!ALLOW_LEGACY_PAYMENTS) {
    return new Response(JSON.stringify({
      status: false,
      message: 'Legacy payment API is deprecated. Use base_amount + has_agent instead.'
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  // ... existing legacy handling
}
```

**Testing:**
- [ ] Create booking and pay - should use validated API
- [ ] Check transaction record - should have commission_snapshot
- [ ] Verify total matches server calculation
- [ ] Try to manipulate amount in browser - should fail

---

### Day 5: Fix Price Filter Defaults

**Problem:** Some filters use 10K max, should be 50K

**Files to Fix:**
1. `src/hooks/filters/useFilteredProperties.tsx` (line 26)
2. `src/hooks/filters/index.tsx` (line 23)
3. Any other filter implementations

**Step-by-Step Fix:**

**Step 1:** Create constant
```typescript
// src/config/constants.ts (create if doesn't exist)
export const PRICE_FILTER_DEFAULTS = {
  MIN: 0,
  MAX: 50000, // GHS
  STEP: 100
} as const;
```

**Step 2:** Update useFilteredProperties.tsx
```typescript
// ADD import:
import { PRICE_FILTER_DEFAULTS } from '@/config/constants';

// REPLACE line 26:
if (filters.priceRange.min > 0 || filters.priceRange.max < 10000) {

// WITH:
if (filters.priceRange.min > 0 || filters.priceRange.max < PRICE_FILTER_DEFAULTS.MAX) {
```

**Step 3:** Update index.tsx
```typescript
// REPLACE line 23:
max: filters.priceRange?.[1] || 10000

// WITH:
max: filters.priceRange?.[1] || PRICE_FILTER_DEFAULTS.MAX
```

**Step 4:** Update any filter UI components
```typescript
// In filter slider/input components:
<Slider
  min={PRICE_FILTER_DEFAULTS.MIN}
  max={PRICE_FILTER_DEFAULTS.MAX}
  step={PRICE_FILTER_DEFAULTS.STEP}
  value={[priceRange.min, priceRange.max]}
  onValueChange={([min, max]) => setPriceRange({ min, max })}
/>
```

**Testing:**
- [ ] Open property listing - should show all properties by default
- [ ] Filter by price - should work up to 50K
- [ ] Check expensive properties (>10K) - should be visible

---

## PHASE 2: INVENTORY MANAGEMENT (Week 2 - 5 days)

### Day 1-3: Minimal Bed Tracking

**Problem:** Webhook doesn't decrement inventory after payment

**Files to Fix:**
1. `supabase/functions/paystack-webhook/index.ts` (lines 194-207)

**Step-by-Step Fix:**

**Step 1:** Update webhook to decrement inventory
```typescript
// supabase/functions/paystack-webhook/index.ts
// AFTER line 206 (after booking update), ADD:

// Decrement room inventory
if (transaction?.metadata?.booking_id) {
  // Get booking details
  const { data: booking } = await supabase
    .from('bookings_enhanced')
    .select('room_id, room_type')
    .eq('id', transaction.metadata.booking_id)
    .single();

  if (booking?.room_id) {
    // Decrement specific room
    const { error: inventoryError } = await supabase
      .from('rooms')
      .update({
        beds_available: supabase.raw('beds_available - 1'),
        occupied_beds: supabase.raw('occupied_beds + 1')
      })
      .eq('id', booking.room_id)
      .gte('beds_available', 1); // Prevent negative

    if (inventoryError) {
      console.error('Failed to decrement room inventory:', inventoryError);
      // Log but don't fail - booking is already confirmed
    }
  }
}
```

**Step 2:** Add CHECK constraint to database
```sql
-- Run in Supabase SQL Editor:
ALTER TABLE rooms
ADD CONSTRAINT check_beds_available_non_negative
CHECK (beds_available >= 0);

ALTER TABLE rooms
ADD CONSTRAINT check_occupied_beds_valid
CHECK (occupied_beds >= 0 AND occupied_beds <= bed_count);
```

**Step 3:** Add property-level occupancy update
```sql
-- Create trigger to update property occupancy:
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

**Testing:**
- [ ] Create booking and pay
- [ ] Check rooms table - beds_available should decrease
- [ ] Check properties table - current_occupancy should increase
- [ ] Try to book when beds_available = 0 - should fail gracefully

---

### Day 4-5: Add Room/Bed Selection to Booking Flow

**Problem:** Bookings don't capture specific room_id or bed_id

**Files to Create/Modify:**
1. Create `src/components/booking/steps/RoomBedSelectionStep.tsx`
2. Modify `src/services/bookingService.ts`

**Step 1:** Create room/bed selection component
```typescript
// CREATE: src/components/booking/steps/RoomBedSelectionStep.tsx
// (Component to show available rooms and beds for selected room type)
```

**Step 2:** Update booking creation to require room_id
```typescript
// src/services/bookingService.ts
// In createBooking function, ADD validation:
if (!bookingData.room_id) {
  throw new Error('Room selection is required');
}

// Verify room availability before creating booking:
const { data: room } = await supabase
  .from('rooms')
  .select('beds_available')
  .eq('id', bookingData.room_id)
  .single();

if (!room || room.beds_available < 1) {
  throw new Error('Selected room is no longer available');
}
```

---

## PHASE 3: PROPER BED RESERVATION (Week 3 - 5 days)

### Create Beds Table and Reservation System

**Step 1:** Create beds table migration
```sql
-- Run in Supabase SQL Editor:
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
```

**Step 2:** Create reserve-bed Edge Function
```typescript
// CREATE: supabase/functions/reserve-bed/index.ts
// (Function to atomically reserve a bed with SELECT ... FOR UPDATE)
```

**Step 3:** Update booking flow to reserve before payment
```typescript
// Before payment initialization:
const { data: reservation } = await supabase.functions.invoke('reserve-bed', {
  body: {
    room_id: selectedRoomId,
    user_id: userId,
    ttl_minutes: 5
  }
});

// Store reservation.bed_id in booking metadata
// Payment webhook confirms reservation on success
```

---

## PHASE 4: POLISH & TESTING (Week 4 - 5 days)

### Day 1-2: Admin Analytics Real Data
- Connect to reviewService for real ratings
- Remove all TODO placeholders
- Add "Not available" states

### Day 3-4: Integration Testing
- Test concurrent bookings
- Test payment failures
- Test inventory edge cases

### Day 5: Documentation & Deploy
- Update README
- Document known limitations
- Deploy to staging
- Final smoke tests

---

## SUCCESS CRITERIA

### Before Launch:
- [ ] Zero hardcoded ratings in codebase
- [ ] All payments use validated API
- [ ] Inventory decrements on payment
- [ ] Price filters show all properties
- [ ] Concurrent booking tests pass
- [ ] Admin sees real or "Not available" data
- [ ] Staging deployment successful

### After Launch:
- [ ] Monitor for double bookings (should be zero)
- [ ] Track payment validation errors
- [ ] Monitor inventory accuracy
- [ ] Collect real reviews

---

**End of Action Plan**

