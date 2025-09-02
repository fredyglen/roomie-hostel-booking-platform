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
