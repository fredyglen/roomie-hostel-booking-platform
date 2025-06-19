# ROOMi Payment System Architecture & Implementation Guide

**Version**: 1.0  
**Last Updated**: December 17, 2024  
**Status**: Production Implementation Ready  

---

## 🎯 **EXECUTIVE SUMMARY**

This document serves as the living documentation for ROOMi's comprehensive payment system, designed for flexibility as business terms evolve. The system handles automatic payment distribution between property owners, agents, and ROOMi's commission structure while supporting Ghana's mobile-first payment preferences.

### **Current Business Model**
- **ROOMi Commission**: 5% of booking value
- **Platform Fee**: 100 GHS fixed fee per booking
- **Agent Commission**: TBD (framework ready for implementation)
- **Payment Methods**: Card, Mobile Money (MTN, Vodafone, AirtelTigo), Bank Transfer

---

## 🏗️ **TECHNICAL ARCHITECTURE OVERVIEW**

### **Payment Flow Architecture**
```
Student Booking → Payment Processing → Multi-Account Distribution → Booking Confirmation
     ↓                    ↓                      ↓                        ↓
Booking State      Paystack Gateway      Subaccount Splits      Database Updates
```

### **Core Components**
1. **Payment Initiation**: `ModernPaystackPayment.tsx` (✅ Implemented)
2. **Booking Integration**: `useBookingViewModel.tsx` (❌ Needs Connection)
3. **Payment Processing**: Paystack API + Supabase Edge Functions
4. **Database Persistence**: Booking + Transaction Records
5. **Multi-Account Distribution**: Paystack Subaccounts + Split Payments

---

## 💰 **BUSINESS MODEL CONFIGURATION**

### **Current Payment Structure**
```typescript
// EDITABLE BUSINESS TERMS - Update as negotiations conclude
const BUSINESS_MODEL = {
  // ROOMi Revenue
  platformCommissionRate: 0.05,        // 5% of booking value
  platformFixedFee: 100,               // 100 GHS per booking
  
  // Agent Compensation (Future Implementation)
  agentCommissionRate: 0.00,           // TBD - Currently 0%
  agentFixedFee: 0,                    // TBD - Currently 0 GHS
  
  // Payment Processing
  paystackFeeRate: 0.0195,             // 1.95% Paystack fee
  
  // Calculation Logic
  calculateTotal: (basePrice: number) => {
    const platformCommission = basePrice * BUSINESS_MODEL.platformCommissionRate;
    const platformFee = BUSINESS_MODEL.platformFixedFee;
    const subtotal = basePrice + platformCommission + platformFee;
    const paystackFee = subtotal * BUSINESS_MODEL.paystackFeeRate;
    return subtotal + paystackFee;
  }
};
```

### **Payment Distribution Logic**
```typescript
// AUTOMATIC DISTRIBUTION CALCULATION
const calculatePaymentDistribution = (bookingAmount: number) => {
  const platformCommission = bookingAmount * BUSINESS_MODEL.platformCommissionRate;
  const platformFee = BUSINESS_MODEL.platformFixedFee;
  const agentCommission = bookingAmount * BUSINESS_MODEL.agentCommissionRate;
  
  return {
    propertyOwnerAmount: bookingAmount - platformCommission - agentCommission,
    roomiAmount: platformCommission + platformFee,
    agentAmount: agentCommission,
    totalAmount: bookingAmount + platformFee
  };
};
```

---

## 🔧 **IMPLEMENTATION REQUIREMENTS**

### **1. Environment Configuration**
```bash
# Required Environment Variables
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxx  # Production: pk_live_xxx
PAYSTACK_SECRET_KEY=sk_test_xxx       # Production: sk_live_xxx
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key

# Paystack Subaccount Configuration
ROOMI_MAIN_SUBACCOUNT=ACCT_xxx        # ROOMi's main account
DEFAULT_AGENT_SUBACCOUNT=ACCT_xxx     # Default agent account (future)
```

### **2. Database Schema Requirements**
```sql
-- Payment tracking fields in bookings table (✅ Already implemented)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_reference TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS paystack_reference TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP WITH TIME ZONE;

-- Payment distribution tracking
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS platform_commission DECIMAL(10, 2);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS platform_fee DECIMAL(10, 2) DEFAULT 100.00;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS agent_commission DECIMAL(10, 2) DEFAULT 0;
```

### **3. Critical Code Modifications**

#### **A. Connect Payment to Booking Flow**
**File**: `src/hooks/booking/useBookingViewModel.tsx`
**Current Issue**: Lines 136-154 simulate payment
**Required Change**:
```typescript
// REPLACE SIMULATION WITH REAL PAYMENT INTEGRATION
const processPayment = async () => {
  try {
    setLoading(true);
    
    // Calculate payment amounts
    const distribution = calculatePaymentDistribution(totalPrice);
    
    // Create booking record first
    const bookingData = {
      student_id: user.id,
      property_id: id,
      total_amount: distribution.totalAmount,
      platform_commission: distribution.roomiAmount - BUSINESS_MODEL.platformFixedFee,
      platform_fee: BUSINESS_MODEL.platformFixedFee,
      agent_commission: distribution.agentAmount,
      // ... other booking fields
    };
    
    const booking = await BookingQueries.createBooking(bookingData);
    
    // Initialize payment with booking reference
    const paymentResult = await initializePaystackPayment({
      amount: distribution.totalAmount,
      email: formData.email,
      metadata: { booking_id: booking.id },
      onSuccess: handlePaymentSuccess,
      onError: handlePaymentError
    });
    
  } catch (error) {
    handlePaymentError(error.message);
  }
};
```

#### **B. Payment Success Handler**
```typescript
const handlePaymentSuccess = async (paymentResult) => {
  try {
    // Update booking status
    await supabase
      .from('bookings')
      .update({
        payment_status: 'completed',
        status: 'confirmed',
        payment_reference: paymentResult.reference,
        paystack_reference: paymentResult.trans,
        paid_at: new Date().toISOString()
      })
      .eq('id', bookingResult.id);
    
    // Clear form data
    localStorage.removeItem(`booking_form_${id}`);
    
    // Navigate to confirmation
    navigate('/student/booking-confirmation', { 
      state: { bookingId: bookingResult.id } 
    });
    
  } catch (error) {
    ErrorHandler.handle(error, 'Payment success processing failed');
  }
};
```

---

## 🇬🇭 **GHANA-SPECIFIC PAYMENT FEATURES**

### **Mobile Money Integration**
```typescript
// Ghana Mobile Money Networks (✅ Already implemented)
const GHANA_MOBILE_MONEY = {
  mtn: { name: 'MTN Mobile Money', code: 'mtn', color: '#FFCC00' },
  vodafone: { name: 'Vodafone Cash', code: 'vodafone', color: '#E60000' },
  airtel: { name: 'AirtelTigo Money', code: 'airtel', color: '#FF6600' }
};

// Payment Method Preferences for Ghana
const PAYMENT_PREFERENCES = {
  primary: 'mobile_money',     // Most popular in Ghana
  secondary: 'card',           // Growing adoption
  tertiary: 'bank_transfer'    // Traditional method
};
```

### **Currency and Pricing Display**
```typescript
// Ghana Cedis formatting (✅ Already implemented)
const formatGhanaCurrency = (amount: number) => {
  return `GH₵${amount.toLocaleString('en-GH', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  })}`;
};
```

---

## 🔄 **MULTI-ACCOUNT PAYMENT DISTRIBUTION**

### **Paystack Subaccount Setup**
```typescript
// Subaccount creation for property owners
const createPropertyOwnerSubaccount = async (ownerData) => {
  const subaccountData = {
    business_name: ownerData.businessName,
    settlement_bank: ownerData.bankCode,
    account_number: ownerData.accountNumber,
    percentage_charge: 0, // ROOMi handles all fees
    description: `Property Owner: ${ownerData.name}`,
    primary_contact_email: ownerData.email,
    primary_contact_name: ownerData.name,
    primary_contact_phone: ownerData.phone,
    metadata: {
      owner_id: ownerData.id,
      property_ids: ownerData.propertyIds
    }
  };
  
  return await PaystackService.createSubaccount(subaccountData);
};
```

### **Split Payment Configuration**
```typescript
// Payment split for each booking
const createPaymentSplit = (booking) => {
  const distribution = calculatePaymentDistribution(booking.total_amount);
  
  return {
    type: "percentage",
    currency: "GHS",
    subaccounts: [
      {
        subaccount: booking.property_owner_subaccount,
        share: (distribution.propertyOwnerAmount / distribution.totalAmount) * 100
      },
      {
        subaccount: ROOMI_MAIN_SUBACCOUNT,
        share: (distribution.roomiAmount / distribution.totalAmount) * 100
      }
      // Agent subaccount will be added when commission structure is finalized
    ],
    bearer_type: "all-proportional",
    bearer_subaccount: ROOMI_MAIN_SUBACCOUNT
  };
};
```

---

## 🛡️ **ERROR HANDLING & USER EXPERIENCE**

### **Payment Error Scenarios**
```typescript
const PAYMENT_ERROR_HANDLERS = {
  // Network/Connection Issues
  'network_error': {
    message: 'Connection issue. Please check your internet and try again.',
    action: 'retry',
    userFriendly: true
  },
  
  // Insufficient Funds
  'insufficient_funds': {
    message: 'Insufficient funds. Please check your account balance.',
    action: 'change_payment_method',
    userFriendly: true
  },
  
  // Invalid Card/Mobile Money
  'invalid_payment_method': {
    message: 'Payment method invalid. Please verify your details.',
    action: 'update_details',
    userFriendly: true
  },
  
  // Paystack API Issues
  'paystack_error': {
    message: 'Payment service temporarily unavailable. Please try again.',
    action: 'retry_later',
    userFriendly: true
  },
  
  // Booking Creation Failed
  'booking_creation_failed': {
    message: 'Booking could not be created. Please contact support.',
    action: 'contact_support',
    userFriendly: true
  }
};
```

### **Mobile-Optimized Error Recovery**
```typescript
const handlePaymentError = (error, context) => {
  const errorConfig = PAYMENT_ERROR_HANDLERS[error.type] || PAYMENT_ERROR_HANDLERS['paystack_error'];
  
  // Log for debugging
  ErrorHandler.log('Payment error occurred', { error, context });
  
  // Show user-friendly message
  toast({
    title: 'Payment Issue',
    description: errorConfig.message,
    variant: 'destructive',
    action: errorConfig.action === 'retry' ? (
      <Button onClick={() => retryPayment()}>Try Again</Button>
    ) : null
  });
  
  // Reset payment state
  setPaymentProcessing(false);
  
  // Provide recovery options
  if (errorConfig.action === 'change_payment_method') {
    setShowPaymentMethodSelector(true);
  }
};
```

---

## 🔮 **FUTURE-READY AGENT COMMISSION SYSTEM**

### **Agent Commission Framework (DO NOT IMPLEMENT YET)**
```typescript
// PLACEHOLDER ARCHITECTURE - Ready for future implementation
const AGENT_COMMISSION_FRAMEWORK = {
  // Commission Structure Options
  commissionTypes: {
    percentage: 'Percentage of booking value',
    fixed: 'Fixed amount per booking',
    tiered: 'Performance-based tiers',
    hybrid: 'Combination of fixed + percentage'
  },

  // Performance Metrics for Tiered System
  performanceMetrics: {
    bookingsPerMonth: 'Number of bookings facilitated',
    propertyOwnerSatisfaction: 'Rating from property owners',
    studentSatisfaction: 'Rating from students',
    responseTime: 'Average response time to inquiries'
  },

  // Payment Distribution Logic (Template)
  calculateAgentCommission: (booking, agent) => {
    // Will be implemented based on final business model
    switch (agent.commissionType) {
      case 'percentage':
        return booking.amount * agent.commissionRate;
      case 'fixed':
        return agent.fixedCommission;
      case 'tiered':
        return calculateTieredCommission(booking, agent);
      default:
        return 0;
    }
  }
};

// Agent Subaccount Management (Future)
const AGENT_SUBACCOUNT_SYSTEM = {
  // Automatic subaccount creation for verified agents
  createAgentSubaccount: async (agentData) => {
    // Implementation pending business model finalization
  },

  // Commission payment automation
  processAgentCommissions: async (bookingId) => {
    // Implementation pending business model finalization
  }
};
```

### **Agent Integration Points**
```typescript
// Database schema ready for agent integration
const AGENT_READY_SCHEMA = {
  // bookings table already has agent_id field
  // agent_commission field ready for use
  // Subaccount fields ready for agent payment routing

  // Additional tables for future implementation:
  agent_performance: {
    agent_id: 'UUID',
    month: 'DATE',
    bookings_count: 'INTEGER',
    total_commission: 'DECIMAL',
    satisfaction_rating: 'DECIMAL',
    performance_tier: 'TEXT'
  },

  agent_payouts: {
    agent_id: 'UUID',
    booking_id: 'UUID',
    commission_amount: 'DECIMAL',
    payout_status: 'TEXT',
    payout_date: 'TIMESTAMP'
  }
};
```

---

## 🧪 **TESTING & VALIDATION STRATEGY**

### **Payment Flow Test Cases**
```typescript
const PAYMENT_TEST_SCENARIOS = {
  // Successful Payment Flow
  successful_payment: {
    description: 'Complete booking with successful payment',
    steps: [
      'Create booking with valid data',
      'Initialize Paystack payment',
      'Complete payment with test card',
      'Verify booking status updated to confirmed',
      'Verify payment reference stored',
      'Verify user redirected to confirmation page'
    ],
    expectedResult: 'Booking confirmed, payment recorded'
  },

  // Payment Failure Scenarios
  payment_failure: {
    description: 'Handle payment failure gracefully',
    steps: [
      'Create booking with valid data',
      'Initialize Paystack payment',
      'Simulate payment failure',
      'Verify booking status remains pending',
      'Verify user sees error message',
      'Verify retry option available'
    ],
    expectedResult: 'Booking pending, user can retry'
  },

  // Network Interruption
  network_interruption: {
    description: 'Handle network issues during payment',
    steps: [
      'Start payment process',
      'Simulate network disconnection',
      'Verify payment state preserved',
      'Restore network connection',
      'Verify payment can be resumed'
    ],
    expectedResult: 'Payment resumable after network restoration'
  },

  // Mobile Money Specific Tests
  mobile_money_payment: {
    description: 'Test Ghana mobile money integration',
    steps: [
      'Select MTN Mobile Money',
      'Enter valid phone number',
      'Complete USSD prompt',
      'Verify payment success',
      'Verify booking confirmation'
    ],
    expectedResult: 'Mobile money payment successful'
  }
};
```

### **Database Persistence Validation**
```sql
-- Test queries to verify payment integration
-- Verify booking creation with payment fields
SELECT
  id, booking_reference, payment_status,
  platform_commission, platform_fee, total_amount,
  payment_reference, paystack_reference
FROM bookings
WHERE student_id = 'test_user_id'
ORDER BY created_at DESC;

-- Verify payment distribution calculation
SELECT
  total_amount,
  platform_commission,
  platform_fee,
  (total_amount - platform_commission - platform_fee) as property_owner_amount
FROM bookings
WHERE payment_status = 'completed';
```

---

## 🚀 **IMPLEMENTATION ROADMAP**

### **Phase 1: Critical Payment Integration (Week 1)**
- [ ] **Connect ModernPaystackPayment to booking flow**
  - Modify `useBookingViewModel.tsx` processPayment function
  - Replace simulation with real Paystack integration
  - Estimated Time: 4-6 hours

- [ ] **Implement payment success callback**
  - Update booking status on payment success
  - Store payment references in database
  - Estimated Time: 2-3 hours

- [ ] **Add payment error handling**
  - Implement comprehensive error scenarios
  - Add user-friendly error messages
  - Estimated Time: 2-3 hours

### **Phase 2: Business Model Implementation (Week 2)**
- [ ] **Implement commission calculation**
  - Add 5% commission + 100 GHS fee logic
  - Update booking creation to include fees
  - Estimated Time: 3-4 hours

- [ ] **Setup Paystack subaccounts**
  - Create ROOMi main subaccount
  - Implement property owner subaccount creation
  - Estimated Time: 4-6 hours

- [ ] **Implement split payments**
  - Configure automatic payment distribution
  - Test multi-account settlements
  - Estimated Time: 6-8 hours

### **Phase 3: Ghana Mobile Optimization (Week 3)**
- [ ] **Enhance mobile money integration**
  - Optimize USSD flow for Ghana networks
  - Add network-specific error handling
  - Estimated Time: 4-5 hours

- [ ] **Mobile UX improvements**
  - Optimize payment flow for mobile devices
  - Add offline payment state management
  - Estimated Time: 3-4 hours

### **Phase 4: Future-Ready Architecture (Week 4)**
- [ ] **Agent commission framework**
  - Document agent integration points
  - Prepare database schema for agent system
  - Estimated Time: 2-3 hours (documentation only)

- [ ] **Advanced testing implementation**
  - Implement comprehensive test suite
  - Add payment flow monitoring
  - Estimated Time: 6-8 hours

---

## 📋 **PRODUCTION DEPLOYMENT CHECKLIST**

### **Pre-Deployment Requirements**
- [ ] **Environment Variables Configured**
  - Production Paystack keys set
  - Supabase production environment ready
  - All required environment variables validated

- [ ] **Database Schema Updated**
  - Payment fields added to bookings table
  - RLS policies updated for payment data
  - Indexes created for payment queries

- [ ] **Paystack Account Setup**
  - Business verification completed
  - Subaccounts created for ROOMi
  - Webhook endpoints configured

- [ ] **Testing Completed**
  - All payment scenarios tested
  - Mobile money integration verified
  - Error handling validated

### **Post-Deployment Monitoring**
- [ ] **Payment Success Rate Tracking**
- [ ] **Error Rate Monitoring**
- [ ] **Commission Distribution Verification**
- [ ] **User Experience Analytics**

---

## 🔄 **BUSINESS MODEL UPDATE PROCESS**

### **When Business Terms Change**
1. **Update Business Model Configuration** (Lines 31-50)
2. **Modify Payment Distribution Logic** (Lines 52-67)
3. **Update Database Schema** if needed
4. **Test Payment Calculations**
5. **Deploy Changes**
6. **Update Documentation**

### **Agent Commission Implementation (Future)**
1. **Finalize Agent Commission Structure**
2. **Update AGENT_COMMISSION_FRAMEWORK**
3. **Implement Agent Subaccount Creation**
4. **Add Agent Commission to Payment Distribution**
5. **Test Agent Payment Flow**
6. **Deploy Agent Commission System**

---

## 📞 **SUPPORT & MAINTENANCE**

### **Key Integration Points**
- **Payment Component**: `src/components/payment/ModernPaystackPayment.tsx`
- **Booking Integration**: `src/hooks/booking/useBookingViewModel.tsx`
- **Database Queries**: `src/services/database/standardizedQueries.ts`
- **Error Handling**: `src/utils/paystack-errors.ts`

### **Monitoring & Alerts**
- Payment success/failure rates
- Commission distribution accuracy
- Mobile money transaction success
- Database payment record integrity

This documentation will be updated as business terms evolve and new features are implemented. All technical implementations are designed for easy modification as the ROOMi business model develops.
```
