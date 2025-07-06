# ROOMi Platform Configuration Migration Guide

## Configuration Consolidation & Conflict Resolution

This document outlines the consolidation of configuration files and resolution of conflicts found during the technical debt analysis.

## 🔧 Configuration Conflicts Resolved

### 1. Platform Commission Rate Conflict

**Conflicting Values Found:**
- `src/config/index.ts`: 5% platform commission
- `src/config/environment.ts`: 5% commission rate  
- `src/constants/payment.ts`: 4.2% platform commission ❌
- `src/types/platform-core.ts`: 5% platform commission

**Resolution:**
- **Adopted Value**: 5% platform commission rate
- **Source of Truth**: `PLATFORM_RULES.PLATFORM_COMMISSION_RATE` in `src/types/platform-core.ts`
- **Rationale**: Business decision aligning with platform strategy and market standards

### 2. Default Page Size Conflict

**Conflicting Values Found:**
- `src/config/index.ts`: defaultPageSize: 10 ❌
- `src/config/environment.ts`: itemsPerPage: 20

**Resolution:**
- **Adopted Value**: 20 items per page
- **Source of Truth**: `PLATFORM_RULES.DEFAULT_PAGE_SIZE` in `src/types/platform-core.ts`
- **Rationale**: Better mobile UX for Ghana market conditions

## 🏗️ New Unified Configuration Architecture

### Single Source of Truth Hierarchy

1. **Core Business Rules** (`src/types/platform-core.ts`)
   - `PLATFORM_RULES` constant with all business constraints
   - Immutable business logic values
   - Type-safe enums and constants

2. **Unified Configuration** (`src/config/index.ts`)
   - Environment variable mapping
   - Runtime configuration validation
   - Single export point for all config

3. **Deprecated Files** (Maintained for backward compatibility)
   - `src/config/environment.ts` - Use `src/config/index.ts` instead
   - `src/constants/payment.ts` - Use `config.payment` instead

### Configuration Usage Patterns

#### ✅ Recommended (New Code)
```typescript
import { config } from '@/config';
import { PLATFORM_RULES } from '@/types/platform-core';

// Use unified configuration
const commissionRate = config.payment.platformCommissionRate;
const pageSize = config.ui.defaultPageSize;

// Use business rules for constants
const maxImages = PLATFORM_RULES.MAX_IMAGES_PER_PROPERTY;
const currency = PLATFORM_RULES.CURRENCY_LIMITS;
```

#### ⚠️ Legacy (Backward Compatibility)
```typescript
import { PAYMENT_CONSTANTS } from '@/constants/payment';
import { environmentConfig } from '@/config/environment';

// These still work but are deprecated
const commissionRate = PAYMENT_CONSTANTS.PLATFORM_COMMISSION_RATE;
const pageSize = environmentConfig.ui.itemsPerPage;
```

## 📋 Migration Checklist

### For Developers

- [ ] Update imports to use `config` from `@/config`
- [ ] Replace `PAYMENT_CONSTANTS` with `config.payment`
- [ ] Replace `environmentConfig` with `config`
- [ ] Use `PLATFORM_RULES` for business constants
- [ ] Update tests to use unified configuration
- [ ] Remove direct imports from deprecated files

### For New Features

- [ ] Always use `config` from `@/config/index.ts`
- [ ] Add new configuration values to `AppConfig` interface
- [ ] Add environment variable mapping in config creation
- [ ] Add validation rules for new config values
- [ ] Document configuration in this guide

## 🔍 Configuration Validation

The unified configuration includes comprehensive validation:

### Runtime Validation
```typescript
import { validateConfig } from '@/config';

// Validates all configuration at startup
validateConfig();
```

### Validation Rules
- Required environment variables presence
- URL format validation
- Paystack key format validation
- Numeric range validation
- Business rule consistency

### Error Handling
- **Development**: Warnings logged, continues execution
- **Production**: Throws errors for invalid configuration
- **Staging**: Strict validation with detailed logging

## 🌍 Environment Variables

### Required Variables
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_PAYSTACK_PUBLIC_KEY=pk_test_or_pk_live_key
```

### Optional Variables (with defaults)
```bash
# App Configuration
VITE_APP_NAME="ROOMi Campus Nest"
VITE_APP_VERSION="1.0.0"
VITE_APP_BASE_URL="http://localhost:5173"

# UI Configuration
VITE_DEFAULT_PAGE_SIZE=20
VITE_MAX_PAGE_SIZE=100
VITE_SEARCH_DEBOUNCE_MS=300

# Payment Configuration
VITE_PLATFORM_COMMISSION_RATE=0.05
VITE_AGENT_COMMISSION_RATE=0.037
VITE_AGENT_MINIMUM_FEE=100

# Feature Flags
VITE_NOTIFICATIONS_ENABLED=true
VITE_ANALYTICS_ENABLED=false
VITE_PAYMENT_ENABLED=true
VITE_MAINTENANCE_MODE=false

# Upload Configuration
VITE_MAX_IMAGE_SIZE=5242880
VITE_MAX_IMAGES_PER_PROPERTY=10
VITE_IMAGE_COMPRESSION_QUALITY=0.8

# Security Configuration
VITE_SESSION_TIMEOUT=3600000
VITE_MAX_LOGIN_ATTEMPTS=5
VITE_PASSWORD_MIN_LENGTH=8
```

## 🔄 Breaking Changes

### Removed Exports
- `environmentConfig` from `@/config/environment` (use `config` instead)
- Individual config sections from environment.ts (use unified exports)

### Changed Values
- Platform commission rate: 4.2% → 5%
- Default page size: 10 → 20

### Deprecated Imports
```typescript
// ❌ Deprecated
import { environmentConfig } from '@/config/environment';
import { PAYMENT_CONSTANTS } from '@/constants/payment';

// ✅ Use instead
import { config } from '@/config';
import { PLATFORM_RULES } from '@/types/platform-core';
```

## 🧪 Testing Configuration

### Unit Tests
```typescript
import { config, validateConfig } from '@/config';

describe('Configuration', () => {
  it('should have valid commission rates', () => {
    expect(config.payment.platformCommissionRate).toBe(0.05);
    expect(config.payment.agentCommissionRate).toBe(0.037);
  });

  it('should validate successfully', () => {
    expect(() => validateConfig()).not.toThrow();
  });
});
```

### Environment Testing
```bash
# Test with missing required variables
unset VITE_SUPABASE_URL
npm run test:config

# Test with invalid values
export VITE_PAYSTACK_PUBLIC_KEY="invalid-key"
npm run test:config
```

## 📚 Additional Resources

- [Platform Architecture Guide](./PLATFORM_ARCHITECTURE_GUIDE.md)
- [Type Definitions](../types/platform-core.ts)
- [Business Rules](../types/business-rules.ts)
- [Configuration Source](../config/index.ts)

## 🚀 Next Steps

1. **Complete Type Safety Fixes**: Fix remaining `any` type in propertyService.ts
2. **Update Documentation**: Ensure all docs reference unified configuration
3. **Performance Optimization**: Implement configuration caching
4. **Monitoring**: Add configuration validation to CI/CD pipeline

This consolidation ensures a single source of truth for all platform configuration, eliminating conflicts and improving maintainability.
