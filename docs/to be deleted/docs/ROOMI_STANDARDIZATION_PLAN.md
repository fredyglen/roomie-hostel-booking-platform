# ROOMi Platform Standardization Plan

## Overview

This document outlines a comprehensive standardization plan for the ROOMi platform to address inconsistencies in naming conventions, data structures, and coding patterns. Based on analysis of the codebase and documentation, this plan provides concrete steps to establish consistent standards across all three portals.

## 1. Standardized Naming Conventions

### Database Table Names

Based on the existing `TABLE_NAMES` constant in `src/services/database/standardizedQueries.ts`, we should expand this to include all tables and ensure consistent usage:

```typescript
export const TABLE_NAMES = {
  // Existing tables
  PROPERTIES: 'properties',
  BOOKINGS: 'bookings_enhanced',
  PROFILES: 'profiles',
  ROOMS: 'rooms',
  BEDS: 'beds',
  PROPERTY_VERIFICATIONS: 'property_verifications',
  PROPERTY_VISIBILITY_LOG: 'property_visibility_log',
  AGENT_PROPERTIES: 'agent_properties',
  BOOKING_ROOMMATES: 'booking_roommates',
  
  // Additional tables identified in documentation
  PAYMENTS: 'payments',
  TRANSACTIONS: 'transactions',
  PROPERTY_AMENITIES: 'property_amenities',
  PROPERTY_MEDIA: 'property_media',
  PROPERTY_REVIEWS: 'property_reviews',
  NOTIFICATIONS: 'notifications',
  VERIFICATION_REQUESTS: 'verification_requests',
  USER_PREFERENCES: 'user_preferences',
  CAMPUS_LOCATIONS: 'campus_locations',
  SEMESTER_PERIODS: 'semester_periods'
} as const;
```

### Component Naming Patterns

Establish consistent naming patterns for React components:

```typescript
// Portal-specific components
export const COMPONENT_PREFIXES = {
  STUDENT: 'Student',
  OWNER: 'Owner',
  AGENT: 'Agent',
  ADMIN: 'Admin',
  SHARED: '' // No prefix for shared components
} as const;

// Component type suffixes
export const COMPONENT_TYPES = {
  PAGE: 'Page',
  MODAL: 'Modal',
  FORM: 'Form',
  CARD: 'Card',
  LIST: 'List',
  ITEM: 'Item',
  BUTTON: 'Button',
  INPUT: 'Input'
} as const;
```

### API Endpoint Patterns

Standardize API endpoint construction:

```typescript
export const API_ENDPOINTS = {
  // Base endpoints
  PROPERTIES: '/properties',
  BOOKINGS: '/bookings',
  USERS: '/users',
  PAYMENTS: '/payments',
  VERIFICATION: '/verification',
  
  // Nested endpoints - use functions for dynamic parameters
  PROPERTY_DETAILS: (id: string) => `/properties/${id}`,
  PROPERTY_ROOMS: (id: string) => `/properties/${id}/rooms`,
  PROPERTY_BEDS: (propertyId: string, roomId: string) => 
    `/properties/${propertyId}/rooms/${roomId}/beds`,
  BOOKING_DETAILS: (id: string) => `/bookings/${id}`,
  USER_PROFILE: (id: string) => `/users/${id}/profile`
} as const;
```

### Business Constants

Centralize all business-related constants:

```typescript
export const BUSINESS_CONSTANTS = {
  // Commission rates from documentation
  PLATFORM_COMMISSION_RATE: 0.05, // 5%
  PLATFORM_FIXED_FEE: 100, // GHS 100
  AGENT_COMMISSION_RATE: 0.04, // 4%
  
  // Booking periods
  SEMESTER_DURATION_MONTHS: 4,
  DEFAULT_BOOKING_DURATION_DAYS: 120, // 4 months
  
  // Verification statuses
  VERIFICATION_STATUSES: {
    PENDING: 'pending',
    VERIFIED: 'verified',
    REJECTED: 'rejected'
  },
  
  // Property types
  PROPERTY_TYPES: {
    HOSTEL: 'hostel',
    HOMESTEL: 'homestel',
    APARTMENT: 'apartment'
  }
} as const;
```

## 2. Implementation Plan

### Phase 1: Audit & Documentation (Week 1)

1. **Complete Codebase Scan**
   - Use grep/search tools to find all instances of:
     - Hardcoded table names
     - Inconsistent component naming
     - Duplicate business constants
     - Hardcoded API endpoints
   - Document all instances in a spreadsheet with file locations

2. **Create Centralized Constants Files**
   - Create `src/constants/database.ts` for table names
   - Create `src/constants/components.ts` for component naming
   - Create `src/constants/api.ts` for API endpoints
   - Create `src/constants/business.ts` for business rules
   - Ensure all constants are properly typed with `as const`

3. **Generate TypeScript Types**
   - Use Supabase CLI to generate types from database schema
   - Place generated types in `src/types/database.ts`
   - Create mapped types for frontend use in `src/types/frontend.ts`

### Phase 2: Gradual Implementation (Weeks 2-3)

1. **Database Layer Standardization**
   - Create standardized query hooks for each table
   - Implement in highest-priority components first
   - Add ESLint rule to prevent direct table name strings

2. **Component Renaming**
   - Start with shared components
   - Move to portal-specific components
   - Update imports and references

3. **API Endpoint Standardization**
   - Create API client with standardized endpoints
   - Replace direct Supabase calls with API client
   - Add request/response type validation

### Phase 3: Enforcement & Validation (Week 4)

1. **Automated Enforcement**
   - Add ESLint rules to enforce naming conventions
   - Create pre-commit hooks to check for violations
   - Add TypeScript validation for standardized constants

2. **Documentation & Training**
   - Create developer guide for standardization
   - Hold training session for all developers
   - Add examples to documentation

3. **Monitoring & Compliance**
   - Add metrics to track standardization adoption
   - Create dashboard for compliance monitoring
   - Regular code reviews focused on standards

## 3. Alternative Approaches Considered

### Option 1: Complete Rewrite
- **Pros**: Clean slate, no legacy issues, perfect standardization
- **Cons**: Time-consuming, high risk, delays launch significantly
- **Assessment**: Too disruptive given current project state

### Option 2: Gradual Migration with Feature Flags
- **Pros**: Less disruptive, can launch sooner, lower risk
- **Cons**: Technical debt persists longer, more complex codebase temporarily
- **Assessment**: Better balance of progress and stability

### Option 3: Hybrid Approach (Selected)
- **Pros**: Addresses critical issues first, allows parallel work, clear path forward
- **Cons**: Requires careful coordination, some temporary inconsistency
- **Assessment**: Best option for current situation

### Option 4: Minimal Standards Enforcement
- **Pros**: Fastest path to launch, minimal changes to existing code
- **Cons**: Technical debt remains, future development slowed
- **Assessment**: Too short-sighted, doesn't solve fundamental issues

## 4. Challenges and Mitigation Strategies

### Challenge 1: Developer Resistance
- **Risk**: Developers resist adopting new standards
- **Mitigation**: Clear documentation, automated enforcement, code reviews

### Challenge 2: Breaking Changes
- **Risk**: Standardization causes unexpected breaks
- **Mitigation**: Comprehensive test suite, gradual rollout, feature flags

### Challenge 3: Timeline Pressure
- **Risk**: Standardization delays launch
- **Mitigation**: Prioritize critical paths, parallel work streams

### Challenge 4: Incomplete Standards
- **Risk**: Standards don't cover all cases
- **Mitigation**: Regular reviews, iterative improvement

## 5. Success Metrics

1. **Code Quality Metrics**
   - Percentage of codebase using standardized constants
   - Number of ESLint warnings/errors related to standards
   - TypeScript error count

2. **Developer Experience Metrics**
   - Time to implement new features
   - Number of bugs related to inconsistency
   - Developer satisfaction surveys

3. **Business Impact Metrics**
   - Time to implement business rule changes
   - Reduction in deployment issues
   - Improved platform stability

## Conclusion

This standardization plan provides a balanced approach to addressing the inconsistencies in the ROOMi platform while allowing development to continue. By implementing these standards, we can improve code quality, reduce bugs, and create a more maintainable codebase.

The hybrid approach selected offers the best balance between immediate progress and long-term stability, with clear steps for implementation and metrics for success.