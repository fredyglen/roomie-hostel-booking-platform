
# Payment Rules & Commission Structure

## Core Payment Principles

### Base Commission Structure
- **Platform Commission**: 5% + GHS 100 platform fee
- **Agent Commission**: 3.7% of total booking value (DEFINITIVE)
- **Property Owner**: Receives base property price (fees are additional)
- **Moving Fee**: Eliminated (GHS 0)
- **Paystack Fees**: 1.95% for local transactions
- **VAT**: 12.5% (Ghana standard rate)

### Commission Calculation Formula

```
Base Property Price = Property Price
Platform Commission = Base * 5%
Platform Fixed Fee = 100 GHS
Agent Commission = Base * 3.7% (minimum 100 GHS)
Paystack Fee = Subtotal * 1.95%
VAT = (Subtotal + Paystack) * 12.5%
Total Amount = Base + Platform Commission + Platform Fee + Agent Commission + Paystack Fee + VAT
Property Owner Gets = Base Property Price
```

## Property Type Commission Examples

| Property Type | Base Price | Agent Fee (3.7%) | Platform Fee (5% + 100) | Total Amount | Owner Gets |
|---------------|------------|------------------|-------------------------|--------------|------------|
| 4-in-room | GHS 2,700 | GHS 100* | GHS 235 | GHS 3,400** | GHS 2,700 |
| 3-in-room | GHS 3,600 | GHS 133 | GHS 280 | GHS 4,500** | GHS 3,600 |
| 2-in-room | GHS 4,000 | GHS 148 | GHS 300 | GHS 5,000** | GHS 4,000 |
| 1-in-room Executive | GHS 10,000 | GHS 370 | GHS 600 | GHS 12,500** | GHS 10,000 |

*Agent commission has 100 GHS minimum fee
**Total includes Paystack fees (1.95%) and VAT (12.5%)

## Payment Distribution Rules

### 1. Student Payment Processing
- Student pays full amount upfront
- Single transaction through Paystack
- Automatic distribution to stakeholders
- Transparent fee breakdown displayed

### 2. Property Owner Payment
- Receives base property price (100% of listed price)
- Payment processed within 24 hours
- Bank transfer or mobile money
- Automatic payment confirmation

### 3. Agent Commission
- 3.7% of booking amount (minimum 100 GHS)
- Paid after successful booking confirmation
- Monthly consolidated payments
- Performance bonuses for volume

### 4. Platform Revenue
- 5% commission + GHS 100 platform fee from each booking
- Covers Paystack fees (1.95%)
- Net platform revenue: ~3.05% + GHS 100
- Additional revenue from premium features

## Premium Features & Additional Revenue

### Property Owner Premium Services
- **Free**: 1 property listing
- **Basic Plan**: GHS 50/month per additional property
- **Professional Plan**: GHS 150/month per property
  - Professional photography
  - Priority placement
  - Virtual tours
  - Enhanced analytics
- **Enterprise Plan**: GHS 300/month per property
  - All Professional features
  - Dedicated account manager
  - Custom booking terms

### Student Premium Subscriptions
- **Basic**: Free (standard features)
- **Student Plus**: GHS 30/semester
  - Priority booking alerts
  - Advanced filters
  - Booking history
- **Student Premium**: GHS 60/semester
  - All Plus features
  - Concierge service
  - Roommate matching

### Agent Premium Tools
- **Standard**: Free (basic tools)
- **Agent Pro**: GHS 100/month
  - Advanced CRM
  - Marketing automation
  - Performance analytics
- **Agent Enterprise**: GHS 250/month
  - Team management
  - White-label solutions
  - Priority support

## Payment Security Rules

### 1. Escrow System
- All payments held in escrow until booking confirmation
- 24-hour confirmation window
- Automatic refund for failed bookings
- Dispute resolution mechanism

### 2. Verification Requirements
- Property owner bank account verification
- Agent identity verification
- Student payment method verification
- Regular compliance audits

### 3. Fraud Prevention
- Transaction monitoring
- Suspicious activity alerts
- Multi-factor authentication
- Regular security updates

## Discount & Promotion Rules

### Early Booking Discounts
- 30+ days advance: 5% discount
- 60+ days advance: 8% discount
- Full academic year: 10% discount

### Loyalty Discounts
- Second booking: 3% discount
- Third+ booking: 5% discount
- Referral bonus: GHS 50 credit

### Seasonal Promotions
- Off-peak periods: Up to 15% discount
- New property launch: 10% discount
- Partnership university: 5% discount

## Configuration Parameters

### Commission Rates (Easily Adjustable)
```json
{
  "platform_commission_rate": 0.05,
  "platform_fixed_fee": 100,
  "agent_commission_rate": 0.04,
  "property_owner_retention": 0.88,
  "paystack_fee_rate": 0.0195
}
```

### Premium Pricing (Monthly/Semester)
```json
{
  "property_owner_premium": {
    "basic": 50,
    "professional": 150,
    "enterprise": 300
  },
  "student_premium": {
    "plus": 30,
    "premium": 60
  },
  "agent_premium": {
    "pro": 100,
    "enterprise": 250
  }
}
```

### Discount Rules
```json
{
  "early_booking": {
    "30_days": 0.05,
    "60_days": 0.08,
    "academic_year": 0.10
  },
  "loyalty": {
    "second_booking": 0.03,
    "third_plus": 0.05,
    "referral_bonus": 50
  }
}
```

## Update Procedures

### Changing Commission Rates
1. Update configuration in `PAYMENT_RULES.md`
2. Update constants in `src/utils/paymentCalculations.ts`
3. Run database migration if needed
4. Update documentation
5. Notify all stakeholders 48 hours in advance

### Adding New Premium Features
1. Define feature in rules file
2. Update pricing structure
3. Implement feature functionality
4. Update billing system
5. Launch with promotional pricing

### Modifying Discount Rules
1. Update discount configuration
2. Test calculation logic
3. Update user interface
4. Monitor impact on revenue
5. Adjust based on performance
revenue
5. Adjust based on performance
e
4. Monitor impact on revenue
5. Adjust based on performance
Dynamic form generation
   - Real-time option loading
   - Conditional UI rendering

---

## 📋 **ELIMINATION CHECKLIST**

### **Files to Eliminate/Modify**
- [ ] `src/data/sampleProperties.ts` - ELIMINATE
- [ ] `src/data/ghana-hostels-mock-data.ts` - ELIMINATE  
- [ ] `src/data/bookingSampleProperties.ts` - ELIMINATE
- [ ] `src/hooks/usePropertyData.ts` - MODIFY (remove hardcoded data)
- [ ] `src/data/mock-properties.ts` - ELIMINATE
- [ ] `src/types/platform-core.ts` - CENTRALIZE rules
- [ ] `src/types/business-rules.ts` - CENTRALIZE rules
- [ ] `src/components/booking/BookingWizard.tsx` - DYNAMIZE
- [ ] `src/hooks/booking/useRoomOptionsForm.tsx` - DYNAMIZE

### **Database Changes Required**
- [ ] Create `property_content` table
- [ ] Create `amenities` reference table
- [ ] Create `house_rules` reference table
- [ ] Create `platform_configuration` table
- [ ] Add proper relationships and constraints

### **API Changes Required**
- [ ] Property content management endpoints
- [ ] Dynamic configuration endpoints
- [ ] Real-time update mechanisms
- [ ] Validation and sanitization

---

## 🚀 **IMMEDIATE NEXT STEPS**

1. **Start with Property Data** (Highest Impact)
   - Create property_content database table
   - Migrate existing sample data to database
   - Update property detail components to load from database

2. **Centralize Business Rules** (Critical for Revenue)
   - Create single configuration file
   - Update all references to use centralized rules
   - Add environment-based overrides

3. **Connect Owner Portal** (Enable Real Properties)
   - Create owner content management interface
   - Implement real-time synchronization
   - Add content validation

**TIMELINE**: Complete elimination within 2 weeks to unblock all other development

---

## ⚠️ **RISKS & MITIGATION**

### **Risk**: Breaking existing functionality during migration
**Mitigation**: Implement feature flags and gradual rollout

### **Risk**: Data loss during migration
**Mitigation**: Comprehensive backup and rollback procedures

### **Risk**: Performance impact from dynamic loading
**Mitigation**: Implement caching and optimization from day one

**REMEMBER**: This is not optional - it's required for platform scalability and Apple-grade compliance.

---

## 🚨 **CRITICAL UPDATE: ADDITIONAL SCATTERED VALUES DISCOVERED**

**Date**: 2025-01-08
**Discovery Context**: Task 1.3 Property Content Management System Implementation

### **🔴 NEWLY IDENTIFIED VIOLATIONS**

#### **CATEGORY 5: Commission Rate Conflicts (CRITICAL)**
```typescript
// ❌ CRITICAL VIOLATION - Multiple conflicting commission rates
// src/types/platform-core.ts: 5% and 4%
PLATFORM_COMMISSION_RATE: 0.05, // 5%
AGENT_COMMISSION_RATE: 0.04,    // 4%

// src/types/hostel-management.ts: 5% and 3.7%
PLATFORM_COMMISSION_RATE: 0.05, // 5%
AGENT_COMMISSION_RATE: 0.037,   // 3.7% ❌ CONFLICT!

// src/config/index.ts: References both sources
platformCommissionRate: PLATFORM_RULES.PLATFORM_COMMISSION_RATE,
agentCommissionRate: PLATFORM_RULES.AGENT_COMMISSION_RATE,
```
**Impact**: Revenue calculations inconsistent across different parts of platform

#### **CATEGORY 6: Business Rules Duplication (CRITICAL)**
```typescript
// ❌ CRITICAL VIOLATION - Duplicate business rules in multiple files
// src/types/platform-core.ts
SEMESTER_DURATION_MONTHS: 4,
MAX_BOOKING_ADVANCE_DAYS: 90,
MAX_IMAGES_PER_PROPERTY: 10,

// src/types/hostel-management.ts
SEMESTER_DURATION_MONTHS: 4,    // ❌ DUPLICATE
MAX_ADVANCE_BOOKING_DAYS: 90,   // ❌ DUPLICATE
MAX_IMAGES_PER_HOSTEL: 10,      // ❌ DUPLICATE
```
**Impact**: Business rule changes require updates in multiple files

#### **CATEGORY 7: Configuration System Fragmentation (CRITICAL)**
```typescript
// ❌ CRITICAL VIOLATION - Multiple configuration systems
// src/config/index.ts - Main config
// src/config/environment.ts - Environment config
// src/types/platform-core.ts - Platform rules
// src/types/hostel-management.ts - Hostel rules
// Multiple other files with scattered constants
```
**Impact**: No single source of truth for platform configuration

#### **CATEGORY 8: Validation Rules Scattered (HIGH)**
```typescript
// ❌ HIGH VIOLATION - Validation rules in multiple places
// Property validation in multiple files
MAX_PROPERTY_TITLE_LENGTH: 100,
MIN_PROPERTY_DESCRIPTION_LENGTH: 20,
MAX_IMAGES_PER_PROPERTY: 10,
// Scattered across different type files
```
**Impact**: Inconsistent validation across platform

### **🎯 IMMEDIATE CENTRALIZATION REQUIREMENTS**

#### **CRITICAL PRIORITY TASKS IDENTIFIED**
1. **Commission Rate Unification** - Resolve 5% vs 3.7% agent commission conflict
2. **Business Rules Consolidation** - Single source for all platform rules
3. **Configuration System Unification** - Merge fragmented config systems
4. **Validation Rules Centralization** - Unified validation constants

#### **ESTIMATED TECHNICAL DEBT**
- **12+ files** with scattered business rules
- **6+ different commission rate definitions**
- **4+ separate configuration systems**
- **15+ duplicate constant definitions**

**BUSINESS RISK**: Platform cannot scale with this level of configuration chaos

---

## 🚨 **TASK 1.3 IMPLEMENTATION DISCOVERIES**

**Date**: 2025-01-08
**Context**: Property Content Management System Implementation

### **🔴 ADDITIONAL SCATTERED VALUES DISCOVERED**

#### **CATEGORY 9: Content Management Business Rules (CRITICAL)**
```typescript
// ❌ CRITICAL VIOLATION - Content validation rules scattered
// src/components/owner/property-content/AboutSectionEditor.tsx
const ABOUT_VALIDATION_RULES = {
  TITLE_MIN_LENGTH: 5,
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MIN_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 2000,
  MAX_HIGHLIGHTS: 10,
  HIGHLIGHT_MAX_LENGTH: 100
} as const;

// src/components/owner/property-content/AmenitiesManager.tsx
const AMENITIES_BUSINESS_RULES = {
  MAX_AMENITIES_PER_PROPERTY: 30,
  MIN_AMENITIES_REQUIRED: 3,
  PREMIUM_AMENITIES_LIMIT: 10
} as const;

// src/components/owner/property-content/ConsiderationsManager.tsx
const CONSIDERATIONS_BUSINESS_RULES = {
  MAX_CONSIDERATIONS_PER_PROPERTY: 15,
  MIN_TITLE_LENGTH: 5,
  MAX_TITLE_LENGTH: 100,
  MIN_DESCRIPTION_LENGTH: 10,
  MAX_DESCRIPTION_LENGTH: 500
} as const;
```
**Impact**: Content validation rules scattered across multiple components

#### **CATEGORY 10: UI Configuration Hardcoding (HIGH)**
```typescript
// ❌ HIGH VIOLATION - UI constants scattered
// src/components/owner/property-content/AmenitiesManager.tsx
const CATEGORY_DISPLAY_ORDER = [
  'Basic Utilities',
  'Security & Safety',
  'Internet & Technology',
  // ... more hardcoded categories
] as const;

// src/components/owner/property-content/ConsiderationsManager.tsx
const CONSIDERATION_CATEGORIES = [
  {
    id: 'infrastructure',
    name: 'Infrastructure Limitations',
    description: 'Limitations in infrastructure and utilities',
    iconName: 'solar:settings-bold'
  },
  // ... more hardcoded categories
] as const;
```
**Impact**: UI configuration changes require code deployment

#### **CATEGORY 11: Sample Data Hardcoding (MEDIUM)**
```typescript
// ❌ MEDIUM VIOLATION - Sample content hardcoded
// src/components/owner/property-content/AboutSectionEditor.tsx
const SAMPLE_HIGHLIGHTS = [
  'Close to campus',
  '24/7 security',
  'High-speed WiFi',
  'Study areas available',
  // ... more hardcoded samples
] as const;
```
**Impact**: Sample content cannot be customized per market or university

#### **CATEGORY 12: Severity Level Configuration (MEDIUM)**
```typescript
// ❌ MEDIUM VIOLATION - Severity configurations hardcoded
// src/components/owner/property-content/ConsiderationsManager.tsx
const SEVERITY_LEVELS: ReadonlyArray<{
  value: ConsiderationSeverityLevel;
  label: string;
  description: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    value: 'info',
    label: 'Information',
    description: 'General information students should know',
    color: 'blue',
    icon: Info
  },
  // ... more hardcoded severity levels
] as const;
```
**Impact**: Severity level system cannot be customized or extended

### **🎯 CENTRALIZATION TASKS ADDED**

#### **IMMEDIATE PRIORITY TASKS**
1. **Content Validation Rules Centralization** - Move all validation constants to unified system
2. **UI Configuration Centralization** - Create centralized UI constants management
3. **Sample Data System** - Create database-driven sample content system
4. **Severity Level Configuration** - Move to configurable system

#### **ESTIMATED ADDITIONAL TECHNICAL DEBT**
- **8+ new files** with scattered business rules
- **4+ different validation rule systems**
- **3+ hardcoded category systems**
- **2+ sample data systems**

**TOTAL SCATTERED SYSTEMS IDENTIFIED**: 20+ separate configuration systems requiring centralization

---

## 🚨 **CRITICAL UPDATE: CENTRALIZATION WORK PAUSED**

**Date**: 2025-01-09
**Status**: CENTRALIZATION WORK SUSPENDED - FOUNDATION REPAIR REQUIRED
**Compliance**: BE CONSCIOUS Zero Tolerance Policy Enforcement

### **🔴 CRITICAL DISCOVERY: BROKEN FOUNDATION**

During centralization implementation, TypeScript compilation revealed **100+ critical errors** throughout the platform. Following BE CONSCIOUS MANDATORY_DEVELOPMENT_PROTOCOL, all centralization work has been **IMMEDIATELY SUSPENDED** to fix foundational issues first.

### **📊 TYPESCRIPT ERROR ANALYSIS**
- **Database Schema Mismatches**: API services failing due to incorrect table references
- **Type Safety Violations**: Branded types not properly implemented
- **Missing Exports**: Critical constants not exported from modules
- **Property Interface Conflicts**: Inconsistent property structures across codebase

### **🍎 APPLE-GRADE COMPLIANCE ENFORCEMENT**

**VIOLATION IDENTIFIED**: Attempting to build centralization on broken foundation violates:
- ❌ Production-first mindset requirement
- ❌ Zero tolerance for TypeScript errors
- ❌ Comprehensive testing before implementation
- ❌ Incremental development standards

**CORRECTIVE ACTION**: Following BE CONSCIOUS NO TOLERANCE policy:
1. **IMMEDIATE SUSPENSION** of all centralization work
2. **MANDATORY FOUNDATION REPAIR** - Fix all TypeScript errors first
3. **SYSTEMATIC ERROR RESOLUTION** in priority order
4. **VALIDATION REQUIREMENTS** - Zero errors before proceeding
5. **INCREMENTAL TESTING** at each step

### **🎯 REVISED IMPLEMENTATION STRATEGY**

**Phase 1: Foundation Repair (CURRENT PRIORITY)**
- Fix all TypeScript compilation errors
- Ensure platform compiles with zero errors/warnings
- Validate existing functionality works properly
- Document all fixes for audit trail

**Phase 2: Centralization (FUTURE)**
- Only proceed after Phase 1 is 100% complete
- Implement centralization incrementally with testing
- Follow BE CONSCIOUS approval process for each change
- Maintain zero tolerance for new errors

**LESSON LEARNED**: Never build on broken foundation. Apple-grade standards require solid base before enhancement.

**NEXT UPDATE**: After successful TypeScript error resolution and platform validation
