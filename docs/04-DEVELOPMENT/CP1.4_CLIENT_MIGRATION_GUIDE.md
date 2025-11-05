# CP#1.4 - Client Migration Guide: Legacy to New Payment API

**Target Audience:** Frontend Developers  
**Migration Timeline:** CP#1.6 (Post-CP#1.5 Testing)  
**Priority:** MEDIUM (Non-breaking, but recommended)  
**Estimated Effort:** 3-4 hours

---

## 📊 OVERVIEW

This guide provides step-by-step instructions for migrating client-side payment initialization code from the **legacy API** (client-calculated total) to the **new API** (server-validated commissions).

### **Why Migrate?**

**Legacy API Issues:**
- ⚠️ Bypasses server-side commission validation
- ⚠️ Vulnerable to client-side tampering
- ⚠️ No audit trail for commission calculations
- ⚠️ Requires client to calculate commissions correctly

**New API Benefits:**
- ✅ Server-side commission validation
- ✅ Protection against tampering
- ✅ Complete audit trail with commission snapshot
- ✅ Automatic rate synchronization with admin changes
- ✅ Simplified client code (no commission calculation needed)

### **Migration Status**

| Component | Status | Priority |
|-----------|--------|----------|
| `PaymentStep.tsx` | 🔄 PENDING | HIGH |
| `useBusinessPaymentFlow.tsx` | 🔄 PENDING | HIGH |
| `PaymentFirstBookingService.ts` | 🔄 PENDING | HIGH |
| Other payment flows | 🔄 PENDING | MEDIUM |

---

## 🔄 API COMPARISON

### **Legacy API (Current - Deprecated)**

```typescript
// ⚠️ OLD: Client calculates total, server trusts it
const { data, error } = await supabase.functions.invoke('initialize-payment', {
  body: {
    email: user.email,
    amount: totalAmount,        // ❌ Client-calculated total (vulnerable)
    currency: 'GHS',
    metadata: {
      booking_id: bookingId,
      student_id: studentId,
      property_owner_id: ownerId,
      agent_id: agentId
    }
  }
});
```

**Issues:**
- Client calculates `totalAmount` using `centralizedCommissionEngine`
- Server **trusts** client-provided amount without validation
- Malicious client could submit arbitrary amount
- No server-side verification

### **New API (Recommended)**

```typescript
// ✅ NEW: Client sends base amount, server calculates and validates
const { data, error } = await supabase.functions.invoke('initialize-payment', {
  body: {
    email: user.email,
    base_amount: propertyRent,  // ✅ Base amount (property rent)
    has_agent: !!agentId,       // ✅ Agent involvement flag
    currency: 'GHS',
    metadata: {
      booking_id: bookingId,
      student_id: studentId,
      property_owner_id: ownerId,
      agent_id: agentId,
      
      // ✅ OPTIONAL: Include client calculation for validation
      commission_breakdown: {
        baseAmount: commissionResult.baseAmount,
        platformCommission: commissionResult.platformCommission,
        platformFixedFee: commissionResult.platformFixedFee,
        agentCommission: commissionResult.agentCommission,
        paystackFee: commissionResult.paystackFee,
        vatAmount: commissionResult.vatAmount,
        totalAmount: commissionResult.totalAmount
      }
    }
  }
});
```

**Benefits:**
- Server calculates commission using database rates
- Server validates client calculation (if provided)
- Rejects requests with mismatched values
- Complete audit trail with commission snapshot

---

## 🛠️ MIGRATION STEPS

### **Step 1: Identify Payment Initialization Calls**

Search for all calls to `initialize-payment` Edge Function:

```bash
# Search for Edge Function invocations
grep -r "initialize-payment" src/
```

**Known Files:**
1. `src/components/booking/PaymentStep.tsx` (Line 183)
2. `src/hooks/useBusinessPaymentFlow.tsx` (Line 81)
3. `src/services/PaymentFirstBookingService.ts` (Line 199)

### **Step 2: Update Each Call**

For each file, follow the pattern below:

#### **Before (Legacy API):**
```typescript
// Calculate commission using centralized engine
const commissionResult = centralizedCommissionEngine.calculateCommissions(
  propertyRent,
  hasAgent
);

// Send total to Edge Function
const { data, error } = await supabase.functions.invoke('initialize-payment', {
  body: {
    email: user.email,
    amount: commissionResult.totalAmount,  // ❌ Client-calculated total
    currency: 'GHS',
    metadata: { /* ... */ }
  }
});
```

#### **After (New API):**
```typescript
// Calculate commission for UI display (optional)
const commissionResult = centralizedCommissionEngine.calculateCommissions(
  propertyRent,
  hasAgent
);

// Send base amount to Edge Function
const { data, error } = await supabase.functions.invoke('initialize-payment', {
  body: {
    email: user.email,
    base_amount: propertyRent,             // ✅ Base amount only
    has_agent: hasAgent,                   // ✅ Agent flag
    currency: 'GHS',
    metadata: {
      /* ... existing metadata ... */
      
      // ✅ OPTIONAL: Include breakdown for validation
      commission_breakdown: {
        baseAmount: commissionResult.baseAmount,
        platformCommission: commissionResult.platformCommission,
        platformFixedFee: commissionResult.platformFixedFee,
        agentCommission: commissionResult.agentCommission,
        paystackFee: commissionResult.paystackFee,
        vatAmount: commissionResult.vatAmount,
        totalAmount: commissionResult.totalAmount
      }
    }
  }
});
```

### **Step 3: Handle Validation Errors**

Add error handling for commission validation failures:

```typescript
const { data, error } = await supabase.functions.invoke('initialize-payment', {
  body: { /* ... */ }
});

if (error) {
  // Check if it's a validation error
  if (error.message?.includes('Commission validation failed')) {
    console.error('Commission mismatch detected. Refreshing rates...');
    
    // Reload commission rates from database
    await centralizedCommissionEngine.loadConfigurationFromDatabase();
    
    // Recalculate and retry
    const newCommissionResult = centralizedCommissionEngine.calculateCommissions(
      propertyRent,
      hasAgent
    );
    
    // Show user-friendly message
    toast.error('Payment rates have been updated. Please review and try again.');
    
    // Update UI with new amounts
    setCommissionBreakdown(newCommissionResult);
    
    return;
  }
  
  // Handle other errors
  console.error('Payment initialization failed:', error);
  toast.error('Failed to initialize payment. Please try again.');
}
```

### **Step 4: Update TypeScript Types**

Update type definitions to reflect new API:

```typescript
// ✅ NEW: Payment initialization request type
interface PaymentInitRequest {
  email: string;
  base_amount: number;        // Property rent (before commissions)
  has_agent: boolean;         // Agent involvement flag
  currency?: string;
  metadata?: {
    booking_id?: string;
    student_id?: string;
    property_id?: string;
    property_owner_id?: string;
    agent_id?: string;
    commission_breakdown?: {
      baseAmount: number;
      platformCommission: number;
      platformFixedFee: number;
      agentCommission: number;
      paystackFee: number;
      vatAmount: number;
      totalAmount: number;
    };
  };
  callback_url?: string;
  channels?: string[];
}

// ⚠️ DEPRECATED: Legacy request type
interface LegacyPaymentInitRequest {
  email: string;
  amount: number;             // Client-calculated total (deprecated)
  currency?: string;
  metadata?: Record<string, unknown>;
  callback_url?: string;
  channels?: string[];
}
```

---

## 📝 DETAILED MIGRATION EXAMPLES

### **Example 1: PaymentStep.tsx**

**File:** `src/components/booking/PaymentStep.tsx`  
**Lines:** 183-195

#### **Before:**
```typescript
// Calculate total amount including commissions
const commissionResult = centralizedCommissionEngine.calculateCommissions(
  propertyRent,
  !!agentId
);
const totalAmount = commissionResult.totalAmount;

// Initialize payment with Paystack
const { data, error } = await supabase.functions.invoke<InitPaymentResponse>(
  'initialize-payment',
  {
    body: {
      email: user?.email || '',
      amount: totalAmount,      // ❌ Client-calculated total
      currency: 'GHS',
      metadata: paystackMetadata,
      channels: ['card', 'mobile_money', 'bank', 'ussd'],
      callback_url: `${window.location.origin}/payment-success`,
    },
  }
);
```

#### **After:**
```typescript
// Calculate commission for UI display
const commissionResult = centralizedCommissionEngine.calculateCommissions(
  propertyRent,
  !!agentId
);

// Initialize payment with Paystack (NEW API)
const { data, error } = await supabase.functions.invoke<InitPaymentResponse>(
  'initialize-payment',
  {
    body: {
      email: user?.email || '',
      base_amount: propertyRent,        // ✅ Base amount only
      has_agent: !!agentId,             // ✅ Agent flag
      currency: 'GHS',
      metadata: {
        ...paystackMetadata,
        
        // ✅ Include breakdown for validation
        commission_breakdown: {
          baseAmount: commissionResult.baseAmount,
          platformCommission: commissionResult.platformCommission,
          platformFixedFee: commissionResult.platformFixedFee,
          agentCommission: commissionResult.agentCommission,
          paystackFee: commissionResult.paystackFee,
          vatAmount: commissionResult.vatAmount,
          totalAmount: commissionResult.totalAmount
        }
      },
      channels: ['card', 'mobile_money', 'bank', 'ussd'],
      callback_url: `${window.location.origin}/payment-success`,
    },
  }
);

// Handle validation errors
if (error) {
  if (error.message?.includes('Commission validation failed')) {
    console.error('Commission mismatch. Rates may have changed.');
    toast.error('Payment rates have been updated. Please review and try again.');
    
    // Reload rates and recalculate
    await centralizedCommissionEngine.loadConfigurationFromDatabase();
    const newResult = centralizedCommissionEngine.calculateCommissions(propertyRent, !!agentId);
    setCommissionBreakdown(newResult);
    
    return;
  }
  
  console.error('Payment initialization failed:', error);
  toast.error('Failed to initialize payment. Please try again.');
  return;
}
```

### **Example 2: useBusinessPaymentFlow.tsx**

**File:** `src/hooks/useBusinessPaymentFlow.tsx`  
**Lines:** 81-95

#### **Before:**
```typescript
// Calculate total with commissions
const commissionResult = centralizedCommissionEngine.calculateCommissions(
  data.pricing.baseAmount,
  !!data.agentId
);
const totalAmount = commissionResult.totalAmount;

// Initialize payment
const { data: paymentInit, error: paymentError } = await supabase.functions.invoke(
  'initialize-payment',
  {
    body: {
      email: data.studentEmail,
      amount: totalAmount,      // ❌ Client-calculated total
      currency: 'GHS',
      metadata: {
        booking_id: booking.id,
        student_id: data.studentId,
        property_owner_id: data.propertyOwnerId,
        agent_id: data.agentId,
        package_type: data.packageType,
        ...data.metadata
      }
    }
  }
);
```

#### **After:**
```typescript
// Calculate commission for UI display
const commissionResult = centralizedCommissionEngine.calculateCommissions(
  data.pricing.baseAmount,
  !!data.agentId
);

// Initialize payment (NEW API)
const { data: paymentInit, error: paymentError } = await supabase.functions.invoke(
  'initialize-payment',
  {
    body: {
      email: data.studentEmail,
      base_amount: data.pricing.baseAmount,  // ✅ Base amount only
      has_agent: !!data.agentId,             // ✅ Agent flag
      currency: 'GHS',
      metadata: {
        booking_id: booking.id,
        student_id: data.studentId,
        property_owner_id: data.propertyOwnerId,
        agent_id: data.agentId,
        package_type: data.packageType,
        ...data.metadata,
        
        // ✅ Include breakdown for validation
        commission_breakdown: {
          baseAmount: commissionResult.baseAmount,
          platformCommission: commissionResult.platformCommission,
          platformFixedFee: commissionResult.platformFixedFee,
          agentCommission: commissionResult.agentCommission,
          paystackFee: commissionResult.paystackFee,
          vatAmount: commissionResult.vatAmount,
          totalAmount: commissionResult.totalAmount
        }
      }
    }
  }
);

// Handle validation errors
if (paymentError) {
  if (paymentError.message?.includes('Commission validation failed')) {
    console.error('Commission validation failed. Refreshing rates...');
    await centralizedCommissionEngine.loadConfigurationFromDatabase();
    throw new Error('Payment rates have been updated. Please try again.');
  }
  
  throw paymentError;
}
```

### **Example 3: PaymentFirstBookingService.ts**

**File:** `src/services/PaymentFirstBookingService.ts`  
**Lines:** 199-217

#### **Before:**
```typescript
// Initialize payment with Paystack
const { error: paymentError } = await supabase.functions.invoke(
  'initialize-payment',
  {
    body: {
      email: data.student.email,
      amount: data.pricing.totalAmount,  // ❌ Client-calculated total
      currency: 'GHS',
      reference: paymentReference,
      metadata: {
        student_id: data.student.id,
        property_id: data.property.id,
        property_owner_id: data.property.ownerId,
        agent_id: data.property.owner?.id || null,
        booking_type: 'semester_accommodation',
        platform: 'roomi_ghana'
      }
    }
  }
);
```

#### **After:**
```typescript
// Calculate commission for validation
const commissionResult = centralizedCommissionEngine.calculateCommissions(
  data.pricing.baseAmount,
  !!data.property.owner?.id
);

// Initialize payment with Paystack (NEW API)
const { error: paymentError } = await supabase.functions.invoke(
  'initialize-payment',
  {
    body: {
      email: data.student.email,
      base_amount: data.pricing.baseAmount,      // ✅ Base amount only
      has_agent: !!data.property.owner?.id,      // ✅ Agent flag
      currency: 'GHS',
      reference: paymentReference,
      metadata: {
        student_id: data.student.id,
        property_id: data.property.id,
        property_owner_id: data.property.ownerId,
        agent_id: data.property.owner?.id || null,
        booking_type: 'semester_accommodation',
        platform: 'roomi_ghana',
        
        // ✅ Include breakdown for validation
        commission_breakdown: {
          baseAmount: commissionResult.baseAmount,
          platformCommission: commissionResult.platformCommission,
          platformFixedFee: commissionResult.platformFixedFee,
          agentCommission: commissionResult.agentCommission,
          paystackFee: commissionResult.paystackFee,
          vatAmount: commissionResult.vatAmount,
          totalAmount: commissionResult.totalAmount
        }
      }
    }
  }
);

// Handle validation errors
if (paymentError) {
  if (paymentError.message?.includes('Commission validation failed')) {
    logger.error('Commission validation failed', { 
      studentId: data.student.id,
      propertyId: data.property.id,
      error: paymentError 
    });
    throw new Error('Payment rates have been updated. Please refresh and try again.');
  }
  
  throw paymentError;
}
```

---

## ✅ TESTING CHECKLIST

After migration, test the following scenarios:

### **Functional Testing:**
- [ ] Payment initialization succeeds with valid data
- [ ] Commission breakdown displays correctly in UI
- [ ] Paystack redirect works as expected
- [ ] Payment success callback updates booking status
- [ ] Transaction stored with commission snapshot

### **Validation Testing:**
- [ ] Server validates commission breakdown correctly
- [ ] Mismatched values rejected with 400 error
- [ ] User-friendly error message displayed
- [ ] Rates refresh on validation failure

### **Edge Cases:**
- [ ] Payment with agent commission
- [ ] Payment without agent commission
- [ ] High-value property (large commission)
- [ ] Low-value property (minimum agent fee)
- [ ] Rate change during booking flow

### **Error Handling:**
- [ ] Network errors handled gracefully
- [ ] Database errors handled gracefully
- [ ] Invalid email format rejected
- [ ] Missing required fields rejected

---

## 📅 MIGRATION TIMELINE

### **Phase 1: Preparation (CP#1.5)**
- ✅ Complete comprehensive testing
- ✅ Verify Edge Function in staging
- ✅ Document migration guide (this document)

### **Phase 2: Migration (CP#1.6)**
- 🔄 Update `PaymentStep.tsx`
- 🔄 Update `useBusinessPaymentFlow.tsx`
- 🔄 Update `PaymentFirstBookingService.ts`
- 🔄 Update other payment flows
- 🔄 Update TypeScript types
- 🔄 Add error handling

### **Phase 3: Testing (CP#1.6)**
- 🔄 Run unit tests
- 🔄 Run integration tests
- 🔄 Test in staging environment
- 🔄 Verify with real Paystack transactions

### **Phase 4: Deployment (CP#1.6)**
- 🔄 Deploy to production
- 🔄 Monitor Edge Function logs
- 🔄 Track legacy API usage
- 🔄 Verify commission accuracy

### **Phase 5: Deprecation (Future)**
- 🔄 Monitor legacy API usage (should be 0%)
- 🔄 Remove legacy API support
- 🔄 Clean up deprecated code

---

## ⚠️ IMPORTANT NOTES

1. **Backward Compatibility:**
   - Legacy API will continue to work during migration
   - No rush to migrate all code at once
   - Can migrate incrementally

2. **Testing:**
   - Test each migrated component thoroughly
   - Verify in staging before production
   - Monitor Edge Function logs for errors

3. **Rate Changes:**
   - If admin changes rates during booking, validation may fail
   - Handle gracefully by refreshing rates and showing message
   - User should review new amounts before retrying

4. **Commission Breakdown:**
   - Including `commission_breakdown` is **optional** but **recommended**
   - Provides additional validation layer
   - Helps detect rate synchronization issues

5. **Error Messages:**
   - Show user-friendly messages for validation failures
   - Log detailed errors for debugging
   - Provide clear next steps (refresh, retry)

---

## 📞 SUPPORT

If you encounter issues during migration:

1. **Check Edge Function Logs:**
   ```bash
   supabase functions logs initialize-payment
   ```

2. **Verify Commission Rates:**
   - Check `commission_configurations` table
   - Verify active configuration exists
   - Confirm rates match expected values

3. **Test Validation:**
   - Use test script: `node scripts/test-edge-function-validation.mjs`
   - Check for TypeScript errors
   - Verify database connectivity

4. **Review Documentation:**
   - `CP1.4_EDGE_FUNCTION_SECURITY_REPORT.md` - Architecture details
   - `FEE_INTEGRATION_AUDIT.md` - Original audit findings
   - `CP1.3_ADMIN_SETTINGS_VERIFICATION_REPORT.md` - Database setup

---

**Migration Guide Version:** 1.0.0  
**Last Updated:** 2025-11-01  
**Author:** Augment Agent

