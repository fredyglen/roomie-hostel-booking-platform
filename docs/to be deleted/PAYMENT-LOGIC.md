# 🔧 ROOMi Platform Hardcoded Values Inventory

**Date**: 2025-01-05  
**Branch**: `fix/typescript-errors`  
**Purpose**: Complete inventory of hardcoded values requiring centralization  

---

## 🚨 **CRITICAL HARDCODED VALUES**

### **💰 Payment & Business Logic**

#### **Commission Rates (RESOLVED)**
```typescript
// src/config/index.ts
platformCommissionRate: 0.05, // 5% ✅

// src/constants/payment.ts
PLATFORM_COMMISSION_RATE: 0.05, // 5% ✅ RESOLVED

// src/BE CONSCIOUS/platform-definitions.ts
platform_commission_rate: 0.05; // 5% ✅

// PAYMENT-LOGIC.md
platformCommissionRate: 0.05, // 5% ✅

// src/types/platform-core.ts
PLATFORM_COMMISSION_RATE: 0.05, // 5% ✅
PLATFORM_FIXED_FEE: 100, // GHS 100 ✅

// src/utils/paymentCalculations.ts
platformFeePercentage: 0.05, // 5% ✅
platformFixedFee: 100, // GHS 100 ✅
```
**Status**: ✅ RESOLVED - All files now use 5% + GHS 100 platform fee structure

#### **Platform Fees**
```typescript
// Database schema
platform_fee DECIMAL(10, 2) NOT NULL DEFAULT 100.00, // Fixed 100 GHS

// src/config/environment.ts
platformFee: Number(import.meta.env.VITE_PLATFORM_FEE) || 100,

// src/constants/payment.ts
AGENT_MINIMUM_FEE: 100, // GHS 100 minimum
```

#### **Paystack Configuration**
```typescript
// src/config/index.ts
currency: 'GHS', // ❌ Hardcoded currency
channels: ['card', 'mobile_money', 'bank', 'ussd', 'qr'], // ❌ Hardcoded channels
paystackFeeRate: 0.0195, // 1.95% ❌ Should be configurable
```

### **🏫 University & Location Data**

#### **University List (Hardcoded)**
```typescript
// src/components/owner/property-form/BasicInfoFields.tsx
const UNIVERSITIES = [
  { label: "University of Ghana", value: "university_of_ghana" },
  { label: "Kwame Nkrumah University of Science and Technology", value: "knust" },
  { label: "University of Cape Coast", value: "ucc" },
  // ... 7 more hardcoded universities
];
```

#### **Default Location Values**
```typescript
// src/utils/data-seeder.ts
currency: 'GHS', // ❌ Hardcoded currency
university_name: 'UPSA', // ❌ Hardcoded university
default_state: 'Greater Accra', // ❌ Hardcoded state
```

### **⏱️ Time & Duration Values**

#### **Anonymous User Time Limits**
```typescript
// src/hooks/useAnonymousTimeLimit.ts
const TIME_LIMIT = 30000; // 30 seconds ❌ Hardcoded
const messages = {
  navigation: 'Your 30-second preview has expired...', // ❌ Hardcoded message
  property_view: 'Time limit reached...', // ❌ Hardcoded message
};
```

#### **Semester Duration**
```typescript
// Multiple files reference 4-month semesters
semester_duration: 4, // ❌ Should be configurable
academic_year_start: 'September', // ❌ Hardcoded academic calendar
```

### **📁 File & Upload Limits**

#### **File Size Limits**
```typescript
// src/config/environment.ts
maxFileSize: Number(import.meta.env.VITE_UPLOAD_MAX_SIZE) || 5242880, // 5MB
maxImagesPerProperty: Number(import.meta.env.VITE_MAX_IMAGES_PER_PROPERTY) || 10,
compressionQuality: Number(import.meta.env.VITE_IMAGE_COMPRESSION_QUALITY) || 0.8,

// src/config/index.ts
maxImageSize: 5242880, // 5MB ❌ Duplicated hardcoded value
allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'], // ❌ Hardcoded types
```

### **🏠 Property Rules & Defaults**

#### **Default Property Rules**
```typescript
// src/config/property-constants.ts
export const DEFAULT_PROPERTY_RULES = [
  'No smoking inside the premises', // ❌ Hardcoded rules
  'No loud music after 10:00 PM',
  'No overnight guests without prior approval',
  // ... 5 more hardcoded rules
] as const;
```

#### **Property Pricing**
```typescript
// Demo data files
pricePerSemester: 3200, // ❌ Hardcoded pricing
roomOptions: [
  { type: '2-in-a-room', price: 3200 }, // ❌ Hardcoded room pricing
  { type: '4-in-a-room', price: 2800 }
],
```

---

## 🔧 **MEDIUM PRIORITY HARDCODED VALUES**

### **🎨 UI Text & Messages**

#### **Error Messages**
```typescript
// src/errors/user-errors.ts
readonly userMessage = 'User account not found'; // ❌ Hardcoded error message
readonly userMessage = 'Invalid email or password'; // ❌ Hardcoded error message

// src/schemas/validation-schemas.ts
const messages = {
  required: 'This field is required', // ❌ Hardcoded validation messages
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid Ghana phone number',
};
```

#### **Pagination & Limits**
```typescript
// src/config/environment.ts
defaultPageSize: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE || '10'), // ❌ Hardcoded default
maxPageSize: parseInt(import.meta.env.VITE_MAX_PAGE_SIZE || '100'), // ❌ Hardcoded max

// src/config/index.ts
defaultPageSize: 20, // ❌ Conflicting hardcoded value
maxPageSize: 100,
```

### **🌐 API & URL Configuration**

#### **API Endpoints**
```typescript
// src/config/environment.ts
baseUrl: import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5173', // ❌ Hardcoded localhost
paystackBaseUrl: import.meta.env.VITE_PAYSTACK_BASE_URL || 'https://api.paystack.co', // ❌ Hardcoded API URL
```

#### **Image Paths**
```typescript
// Demo data files
images: ['/placeholder.svg'], // ❌ Hardcoded placeholder paths
images: ['/images/hostels/kitatsu-exterior.jpg'], // ❌ Hardcoded image paths
```

---

## 📊 **CONFIGURATION CONFLICTS**

### **Commission Rate Conflicts (RESOLVED)**
| File | Commission Rate | Status |
|------|----------------|---------|
| `src/config/index.ts` | 5% + GHS 100 | ✅ Resolved |
| `src/constants/payment.ts` | 5% + GHS 100 | ✅ Resolved |
| `src/types/platform-core.ts` | 5% + GHS 100 | ✅ Resolved |
| `src/utils/paymentCalculations.ts` | 5% + GHS 100 | ✅ Resolved |
| `platform-definitions.ts` | 5% + GHS 100 | ✅ Matches |
| `PAYMENT-LOGIC.md` | 5% + GHS 100 | ✅ Matches |
| `PAYMENT_RULES.md` | 5% + GHS 100 | ✅ Resolved |

### **Page Size Conflicts**
| File | Default Size | Max Size | Status |
|------|-------------|----------|---------|
| `src/config/index.ts` | 20 | 100 | ❌ Conflict |
| `src/config/environment.ts` | 10 | 100 | ❌ Conflict |

---

## 🎯 **CENTRALIZATION STRATEGY**

### **Phase 1: Business Logic Centralization**
1. **Create `src/config/business-rules.ts`**
   - Centralize all commission rates
   - Unify payment configuration
   - Standardize pricing rules

2. **Create `src/config/ghana-market.ts`**
   - University configurations
   - Academic calendar settings
   - Regional pricing standards

### **Phase 2: UI Configuration Centralization**
1. **Create `src/config/ui-constants.ts`**
   - Error messages
   - Validation messages
   - Pagination settings

2. **Create `src/config/media-settings.ts`**
   - File upload limits
   - Image compression settings
   - Allowed file types

### **Phase 3: Environment-Specific Configuration**
1. **Enhance `.env` files**
   - Add missing environment variables
   - Document all configuration options
   - Create environment validation

2. **Create configuration validation**
   - Runtime configuration checks
   - Environment-specific overrides
   - Configuration documentation

---

## ✅ **IMMEDIATE ACTIONS REQUIRED**

### **Critical Fixes**
1. **Resolve Commission Rate Conflicts** - Choose single source of truth
2. **Centralize Payment Configuration** - Remove duplicate payment settings
3. **Unify University Data** - Create dynamic university configuration
4. **Standardize Error Messages** - Centralize all user-facing text

### **Configuration Files to Create**
- `src/config/business-rules.ts` - Business logic configuration
- `src/config/ghana-market.ts` - Ghana-specific settings
- `src/config/ui-constants.ts` - UI text and messages
- `src/config/media-settings.ts` - File upload configuration

### **Files to Update**
- Remove hardcoded values from all demo data files
- Update payment services to use centralized configuration
- Modify property forms to use dynamic university data
- Update error handling to use centralized messages

---

## 📈 **SUCCESS METRICS**

### **Post-Centralization Targets**
- **Zero Hardcoded Business Values** in application code
- **Single Source of Truth** for all configuration
- **Environment-Specific Overrides** for all settings
- **Runtime Configuration Validation** for all critical values
- **Documentation** for all configuration options
ritical values
- **Documentation** for all configuration options

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
