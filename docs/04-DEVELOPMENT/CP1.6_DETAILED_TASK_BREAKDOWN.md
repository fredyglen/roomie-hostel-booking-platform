# CP#1.6 - Detailed Task Breakdown

**Date:** 2025-11-01  
**Purpose:** Step-by-step implementation guide for commission engine migration  
**Prerequisite:** CP1.6_CLIENT_MIGRATION_PLAN.md approved

---

## 🎯 TASK 1: EDGE FUNCTION SERVER-SIDE VALIDATION

### File: `supabase/functions/initialize-payment/index.ts`
**Priority:** 🔴 CRITICAL  
**Estimated Time:** 4-6 hours  
**Risk Level:** HIGH - Revenue integrity

---

### Step 1.1: Import Server Commission Engine
**Location:** Top of file (after existing imports)

```typescript
// Add this import
import { ServerCommissionEngine } from '../_shared/commission-engine.ts';
```

**Verification:**
- [ ] Import resolves without TypeScript errors
- [ ] Deno can find the module (test with `deno check`)

---

### Step 1.2: Initialize Engine and Load Rates
**Location:** Inside main handler function, before payment initialization

```typescript
// Add after user authentication check
const commissionEngine = new ServerCommissionEngine();

try {
  await commissionEngine.loadRates(supabase);
  
  if (!commissionEngine.isReady()) {
    throw new Error('Commission engine failed to load rates');
  }
  
  console.log('✅ Commission rates loaded:', commissionEngine.getCurrentRates());
} catch (error) {
  console.error('❌ Failed to load commission rates:', error);
  return new Response(
    JSON.stringify({ 
      error: 'Commission configuration unavailable',
      details: error.message 
    }),
    { status: 500, headers: { 'Content-Type': 'application/json' } }
  );
}
```

**Verification:**
- [ ] Engine loads rates from database
- [ ] Falls back to default rates if database unavailable
- [ ] Logs rate loading success/failure

---

### Step 1.3: Extract and Validate Client Metadata
**Location:** After rate loading, before Paystack initialization

```typescript
// Extract base amount and agent flag from client metadata
const metadata = paymentData.metadata || {};
const baseAmountGHS = Number(metadata.base_amount_ghs);
const hasAgent = Boolean(metadata.agent_id);

// Validate base amount
if (!baseAmountGHS || baseAmountGHS <= 0 || !Number.isFinite(baseAmountGHS)) {
  return new Response(
    JSON.stringify({ 
      error: 'Invalid base amount',
      details: 'base_amount_ghs must be a positive number'
    }),
    { status: 400, headers: { 'Content-Type': 'application/json' } }
  );
}

console.log('📊 Client payment request:', {
  baseAmount: baseAmountGHS,
  hasAgent,
  clientProvidedTotal: paymentData.amount
});
```

**Verification:**
- [ ] Base amount extracted correctly
- [ ] Agent flag detected correctly
- [ ] Invalid amounts rejected with 400 error

---

### Step 1.4: Calculate Server-Side Commissions
**Location:** After metadata extraction

```typescript
// Calculate authoritative commission breakdown server-side
let serverBreakdown;
try {
  serverBreakdown = commissionEngine.calculateCommissions(baseAmountGHS, hasAgent);
  
  console.log('✅ Server-side commission calculation:', {
    baseAmount: serverBreakdown.baseAmount,
    platformCommission: serverBreakdown.platformCommission,
    platformFixedFee: serverBreakdown.platformFixedFee,
    agentCommission: serverBreakdown.agentCommission,
    paystackFee: serverBreakdown.paystackFee,
    vatAmount: serverBreakdown.vatAmount,
    totalAmount: serverBreakdown.totalAmount,
    ownerReceives: serverBreakdown.ownerReceives
  });
} catch (error) {
  console.error('❌ Commission calculation failed:', error);
  return new Response(
    JSON.stringify({ 
      error: 'Commission calculation failed',
      details: error.message 
    }),
    { status: 500, headers: { 'Content-Type': 'application/json' } }
  );
}
```

**Verification:**
- [ ] Calculation succeeds for valid amounts
- [ ] Calculation fails gracefully for invalid amounts
- [ ] All breakdown fields populated correctly

---

### Step 1.5: Validate Client Amount Against Server Calculation
**Location:** After server calculation

```typescript
// Validate client-provided amount matches server calculation
const tolerance = 0.01; // 1 pesewa tolerance for rounding errors
const amountDifference = Math.abs(paymentData.amount - serverBreakdown.totalAmount);

if (amountDifference > tolerance) {
  console.error('❌ Amount mismatch detected:', {
    clientAmount: paymentData.amount,
    serverAmount: serverBreakdown.totalAmount,
    difference: amountDifference,
    tolerance
  });
  
  return new Response(
    JSON.stringify({ 
      error: 'Amount validation failed',
      details: 'Client amount does not match server calculation',
      clientAmount: paymentData.amount,
      serverAmount: serverBreakdown.totalAmount,
      difference: amountDifference
    }),
    { status: 400, headers: { 'Content-Type': 'application/json' } }
  );
}

console.log('✅ Amount validation passed:', {
  clientAmount: paymentData.amount,
  serverAmount: serverBreakdown.totalAmount,
  difference: amountDifference
});
```

**Verification:**
- [ ] Matching amounts pass validation
- [ ] Mismatched amounts rejected with 400 error
- [ ] Tolerance allows for minor rounding differences
- [ ] Validation logs include all relevant details

---

### Step 1.6: Enrich Paystack Metadata with Authoritative Breakdown
**Location:** Replace existing Paystack payload construction

```typescript
// Get current rates snapshot for audit trail
const ratesInfo = commissionEngine.getCurrentRates();

// Construct Paystack payload with authoritative commission data
const paystackPayload = {
  email: paymentData.email,
  amount: Math.round(serverBreakdown.totalAmount * 100), // Convert to pesewas
  reference: paymentData.reference || generatePaymentReference(),
  metadata: {
    // Preserve original client metadata
    ...metadata,
    
    // Add authoritative server-calculated breakdown
    commission_breakdown: {
      baseAmount: serverBreakdown.baseAmount,
      platformCommission: serverBreakdown.platformCommission,
      platformFixedFee: serverBreakdown.platformFixedFee,
      agentCommission: serverBreakdown.agentCommission,
      paystackFee: serverBreakdown.paystackFee,
      vatAmount: serverBreakdown.vatAmount,
      totalAmount: serverBreakdown.totalAmount,
      ownerReceives: serverBreakdown.ownerReceives
    },
    
    // Add rates snapshot for audit trail
    rates_snapshot: ratesInfo.rates,
    commission_version: ratesInfo.version,
    
    // Add validation metadata
    server_validated: true,
    validation_timestamp: new Date().toISOString(),
    validation_tolerance: tolerance,
    amount_difference: amountDifference,
    
    // Add user and platform context
    user_id: user.id,
    platform: 'roomi',
    payment_type: metadata.payment_type || 'booking'
  }
};

console.log('📤 Paystack payload prepared:', {
  amount: paystackPayload.amount,
  reference: paystackPayload.reference,
  hasCommissionBreakdown: Boolean(paystackPayload.metadata.commission_breakdown),
  serverValidated: paystackPayload.metadata.server_validated
});
```

**Verification:**
- [ ] Metadata includes complete commission breakdown
- [ ] Rates snapshot captured for audit
- [ ] Validation metadata included
- [ ] Original client metadata preserved
- [ ] Amount converted to pesewas correctly

---

### Step 1.7: Add Error Handling and Logging
**Location:** Wrap entire handler in try-catch

```typescript
try {
  // ... all existing logic ...
  
  // Initialize Paystack payment
  const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('PAYSTACK_SECRET_KEY')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(paystackPayload)
  });
  
  const paystackData = await paystackResponse.json();
  
  if (!paystackResponse.ok) {
    throw new Error(`Paystack initialization failed: ${paystackData.message}`);
  }
  
  console.log('✅ Payment initialized successfully:', {
    reference: paystackPayload.reference,
    authorizationUrl: paystackData.data.authorization_url
  });
  
  return new Response(
    JSON.stringify({
      success: true,
      data: paystackData.data,
      commission_breakdown: serverBreakdown,
      server_validated: true
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
  
} catch (error) {
  console.error('❌ Payment initialization failed:', error);
  
  return new Response(
    JSON.stringify({ 
      error: 'Payment initialization failed',
      details: error.message,
      timestamp: new Date().toISOString()
    }),
    { status: 500, headers: { 'Content-Type': 'application/json' } }
  );
}
```

**Verification:**
- [ ] All errors caught and logged
- [ ] Error responses include helpful details
- [ ] Success responses include commission breakdown
- [ ] Paystack errors handled gracefully

---

### Step 1.8: Testing Checklist

#### Unit Tests (Create: `supabase/functions/initialize-payment/index.test.ts`)
- [ ] Test: Server calculation matches client calculation for valid amounts
- [ ] Test: Amount validation rejects mismatched amounts
- [ ] Test: Amount validation allows minor rounding differences (±0.01 GHS)
- [ ] Test: Invalid base amounts rejected with 400 error
- [ ] Test: Missing commission configuration handled gracefully
- [ ] Test: Metadata enrichment includes all required fields
- [ ] Test: Rates snapshot captured correctly

#### Integration Tests
- [ ] Test: Full booking flow with server validation
- [ ] Test: Client manipulation attempt rejected
- [ ] Test: Rate change propagates to new payments
- [ ] Test: Paystack receives correct amount and metadata

#### Manual Testing
- [ ] Test: Create booking with valid amount → Payment succeeds
- [ ] Test: Manipulate client amount → Payment rejected
- [ ] Test: Check Paystack dashboard → Metadata includes breakdown
- [ ] Test: Check database → Audit log captures validation

---

### Step 1.9: Deployment Checklist
- [ ] Code reviewed and approved
- [ ] All tests passing
- [ ] Edge function deployed to staging
- [ ] Staging tests pass
- [ ] Edge function deployed to production
- [ ] Production smoke test pass
- [ ] Monitoring alerts configured

---

## 🎯 TASK 2: GHANA ADMIN FEATURES REAL DATA

### File: `src/components/admin/GhanaAdminFeatures.tsx`
**Priority:** 🟡 MEDIUM  
**Estimated Time:** 2-3 hours  
**Risk Level:** MEDIUM - Admin accuracy

---

### Step 2.1: Replace Mock Data with Real Query
**Location:** `fetchGhanaMetrics` function (lines ~100-113)

**Current Code (REMOVE):**
```typescript
// ❌ MOCK DATA - REMOVE THIS
return {
  totalRevenue: 156800,
  commissionEarned: 7840,
  platformFees: 3400,
  activeUniversities: 8,
  verifiedStudents: 2340,
  mobileMoneyTransactions: 1890,
  complianceScore: 98.5
};
```

**New Code (ADD):**
```typescript
// ✅ REAL DATA - Query from database
const rates = centralizedCommissionEngine.getCommissionRates();
const fees = centralizedCommissionEngine.getPlatformFees();

// Query paid bookings
const { data: bookings, error: bookingsError } = await supabase
  .from('bookings_enhanced')
  .select('total_amount, property_rent, platform_fee, agent_fee, payment_status, created_at')
  .in('payment_status', ['paid', 'completed', 'success']);

if (bookingsError) {
  logger.error('Failed to fetch bookings for Ghana metrics', { error: bookingsError });
  throw bookingsError;
}

// Calculate real metrics
const totalRevenue = bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
const commissionEarned = bookings.reduce((sum, b) => sum + (b.platform_fee || 0), 0);
const platformFees = bookings.length * fees.fixed;

// Query other metrics (keep existing queries for universities, students, etc.)
// ... existing university/student queries ...

return {
  totalRevenue,
  commissionEarned,
  platformFees,
  activeUniversities, // from existing query
  verifiedStudents, // from existing query
  mobileMoneyTransactions, // from existing query
  complianceScore // from existing calculation
};
```

**Verification:**
- [ ] Query returns real booking data
- [ ] Commission calculations use engine rates
- [ ] Empty state handled when no bookings
- [ ] Error handling for query failures

---

### Step 2.2: Add Loading and Error States
**Location:** Component render function

```typescript
if (isLoading) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3">Loading Ghana metrics...</span>
        </div>
      </CardContent>
    </Card>
  );
}

if (error) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Failed to load Ghana metrics: {error.message}
      </AlertDescription>
    </Alert>
  );
}

if (!metrics || metrics.totalRevenue === 0) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center text-gray-500">
          <p>No booking data available yet</p>
          <p className="text-sm mt-2">Metrics will appear once bookings are created</p>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Verification:**
- [ ] Loading state displays while fetching
- [ ] Error state shows helpful message
- [ ] Empty state shows when no data
- [ ] Metrics display when data available

---

## 🎯 TASK 3: CAMPUS ANALYTICS REAL DATA

### File: `src/components/admin/CampusAnalytics.tsx`
**Priority:** 🟡 MEDIUM  
**Estimated Time:** 2-3 hours  
**Risk Level:** MEDIUM - Analytics accuracy

**Implementation:** Similar to Task 2, replace mock revenue metrics with real queries

---

## 🎯 TASK 4: LEGACY COMPONENT CLEANUP

### Files:
- `src/components/booking/BookingSummary.tsx`
- `src/utils/paymentCalculations.ts` (function: `calculatePaymentDistribution`)

**Priority:** 🟢 LOW  
**Estimated Time:** 2 hours  
**Risk Level:** LOW - Code cleanliness

**Steps:**
1. [ ] Search codebase for usages
2. [ ] Confirm components unused
3. [ ] Delete files/functions
4. [ ] Remove related tests
5. [ ] Update documentation

---

## 📊 PROGRESS TRACKING

### Overall Progress
- [x] Phase 1: Discovery & Audit (100%)
- [x] Phase 2: Migration Execution (100%) ✅ COMPLETE
  - [x] Task 1: Edge Function (100%) ✅ ALREADY IMPLEMENTED
  - [x] Task 2: Ghana Admin (100%) ✅ ALREADY IMPLEMENTED
  - [x] Task 3: Campus Analytics (100%) ✅ ALREADY IMPLEMENTED
  - [x] Task 4: Legacy Cleanup (100%) ✅ COMPLETE
- [x] Phase 3: Testing & Verification (100%) ✅ COMPLETE
- [ ] Phase 4: Deployment (0%)

### Time Tracking
- **Estimated Total:** 10-15 hours
- **Actual Time:** 30 minutes (Task 4 - Legacy cleanup)
- **Time Saved:** 9.5-14.5 hours (Tasks 1-3 already complete)

---

**Document Created:** 2025-11-01  
**Status:** Ready for implementation  
**Next Action:** Begin Task 1 (Edge Function) after user approval

