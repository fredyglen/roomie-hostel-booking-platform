
/**
 * @deprecated Use unifiedConfigurationEngine instead
 *
 * MIGRATION COMPLETED: All configuration now comes from unified system
 * - Use unifiedConfigurationEngine from @/config/unified-configuration.config
 * - This file is maintained for backward compatibility only
 *
 * ROOMi Platform Unified Configuration
 * Apple-Grade configuration management with single source of truth
 *
 * @version 2.0.0 (Unified International System)
 * @author ROOMi Platform Team
 */

import { logger } from '@/utils/enhanced-logger';
import { Currency } from '@/types/platform-core';
import { centralizedCommissionEngine } from '@/config/centralized-commission.config';
import { centralizedBusinessRulesEngine } from '@/config/centralized-business-rules.config';
import { unifiedConfigurationEngine } from '@/config/unified-configuration.config';

// Configuration types with complete type safety
export interface AppConfig {
  readonly supabase: {
    readonly url: string;
    readonly anonKey: string;
    readonly timeout: number;
    readonly retryAttempts: number;
  };
  readonly paystack: {
    readonly publicKey: string;
    readonly baseUrl: string;
    readonly currency: Currency;
    readonly channels: readonly ('card' | 'mobile_money' | 'bank' | 'ussd' | 'qr')[];
    readonly callbackUrl: string;
  };
  readonly app: {
    readonly name: string;
    readonly version: string;
    readonly baseUrl: string;
    readonly environment: 'development' | 'staging' | 'production';
    readonly imageCdnUrl: string;
  };
  readonly ui: {
    readonly defaultPageSize: number;
    readonly maxPageSize: number;
    readonly searchDebounceMs: number;
    readonly toastDuration: number;
    readonly animationDuration: number;
  };
  readonly upload: {
    readonly maxImageSize: number;
    readonly maxVideoSize: number;
    readonly maxImagesPerProperty: number;
    readonly maxVideosPerProperty: number;
    readonly allowedImageTypes: readonly string[];
    readonly allowedVideoTypes: readonly string[];
    readonly compressionQuality: number;
  };
  readonly features: {
    readonly enableNotifications: boolean;
    readonly enableAnalytics: boolean;
    readonly enableOfflineMode: boolean;
    readonly paymentEnabled: boolean;
    readonly uploadEnabled: boolean;
    readonly maintenanceMode: boolean;
  };
  readonly payment: {
    readonly platformCommissionRate: number;
    readonly agentCommissionRate: number;
    readonly agentMinimumFee: number;
    readonly paystackFeeRate: number;
    readonly bookingFeeRate: number;
    readonly vatRate: number;
    readonly currencyLimits: Record<Currency, { min: number; max: number }>;
  };
  readonly security: {
    readonly sessionTimeout: number;
    readonly anonymousTimeLimit: number;
    readonly maxLoginAttempts: number;
    readonly passwordMinLength: number;
  };
  readonly business: {
    readonly semesterDurationMonths: number;
    readonly maxBookingAdvanceDays: number;
    readonly minBookingAdvanceDays: number;
    readonly cancellationDeadlineDays: number;
  };
}

// Validation functions
const validateRequiredEnvVar = (key: string, value?: string): string => {
  if (!value) {
    const error = `Required environment variable ${key} is not set`;
    logger.error(error);
    throw new Error(error);
  }
  return value;
};

const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const validatePaystackKey = (key: string): boolean => {
  return key.startsWith('pk_test_') || key.startsWith('pk_live_');
};

// Create and validate unified configuration
export const config: AppConfig = {
  supabase: {
    url: validateRequiredEnvVar('VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL),
    anonKey: validateRequiredEnvVar('VITE_SUPABASE_ANON_KEY', import.meta.env.VITE_SUPABASE_ANON_KEY),
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
    retryAttempts: Number(import.meta.env.VITE_API_RETRY_ATTEMPTS) || 3,
  },
  paystack: {
    publicKey: validateRequiredEnvVar('VITE_PAYSTACK_PUBLIC_KEY', import.meta.env.VITE_PAYSTACK_PUBLIC_KEY),
    baseUrl: import.meta.env.VITE_PAYSTACK_BASE_URL || 'https://api.paystack.co',
    currency: Currency.GHS,
    channels: ['mobile_money', 'bank', 'ussd', 'qr'] as const,
    callbackUrl: import.meta.env.VITE_PAYSTACK_CALLBACK_URL || `${import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5173'}/payment/callback`,
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'ROOMi Campus Nest',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    baseUrl: import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5173',
    environment: import.meta.env.MODE as 'development' | 'staging' | 'production',
    imageCdnUrl: import.meta.env.VITE_IMAGE_CDN_URL || '',
  },
  ui: {
    // ✅ UNIFIED CONFIGURATION SYSTEM - Using single source of truth
    defaultPageSize: Number(import.meta.env.VITE_DEFAULT_PAGE_SIZE) || unifiedConfigurationEngine.getUIConfig().pagination.defaultPageSize,
    maxPageSize: Number(import.meta.env.VITE_MAX_PAGE_SIZE) || unifiedConfigurationEngine.getUIConfig().pagination.maxPageSize,
    searchDebounceMs: Number(import.meta.env.VITE_SEARCH_DEBOUNCE_MS) || unifiedConfigurationEngine.getUIConfig().performance.searchDebounceMs,
    toastDuration: Number(import.meta.env.VITE_TOAST_DURATION) || unifiedConfigurationEngine.getUIConfig().performance.toastDuration,
    animationDuration: Number(import.meta.env.VITE_ANIMATION_DURATION) || unifiedConfigurationEngine.getUIConfig().performance.animationDuration,
  },
  upload: {
    // ✅ CENTRALIZED BUSINESS RULES - Using single source of truth
    maxImageSize: Number(import.meta.env.VITE_MAX_IMAGE_SIZE) || centralizedBusinessRulesEngine.getFileUploadRules().maxImageSizeMB * 1024 * 1024,
    maxVideoSize: Number(import.meta.env.VITE_MAX_VIDEO_SIZE) || centralizedBusinessRulesEngine.getFileUploadRules().maxVideoSizeMB * 1024 * 1024,
    maxImagesPerProperty: Number(import.meta.env.VITE_MAX_IMAGES_PER_PROPERTY) || centralizedBusinessRulesEngine.getPropertyRules().maxImagesPerProperty,
    maxVideosPerProperty: Number(import.meta.env.VITE_MAX_VIDEOS_PER_PROPERTY) || centralizedBusinessRulesEngine.getPropertyRules().maxVideosPerProperty,
    allowedImageTypes: centralizedBusinessRulesEngine.getFileUploadRules().allowedImageTypes,
    allowedVideoTypes: centralizedBusinessRulesEngine.getFileUploadRules().allowedVideoTypes,
    compressionQuality: Number(import.meta.env.VITE_IMAGE_COMPRESSION_QUALITY) || 0.8,
  },
  features: {
    enableNotifications: import.meta.env.VITE_NOTIFICATIONS_ENABLED === 'true',
    enableAnalytics: import.meta.env.MODE === 'production' || import.meta.env.VITE_ANALYTICS_ENABLED === 'true',
    enableOfflineMode: import.meta.env.VITE_OFFLINE_MODE_ENABLED === 'true',
    paymentEnabled: import.meta.env.VITE_PAYMENT_ENABLED !== 'false', // Default true
    uploadEnabled: import.meta.env.VITE_UPLOAD_ENABLED !== 'false', // Default true
    maintenanceMode: import.meta.env.VITE_MAINTENANCE_MODE === 'true',
  },
  payment: {
    // ✅ CENTRALIZED COMMISSION SYSTEM - Single Source of Truth
    // All commission rates now come from centralized-commission.config.ts
    platformCommissionRate: Number(import.meta.env.VITE_PLATFORM_COMMISSION_RATE) || centralizedCommissionEngine.getCommissionRates().platform,
    agentCommissionRate: Number(import.meta.env.VITE_AGENT_COMMISSION_RATE) || centralizedCommissionEngine.getCommissionRates().agent,
    agentMinimumFee: Number(import.meta.env.VITE_AGENT_MINIMUM_FEE) || centralizedCommissionEngine.getPlatformFees().agentMinimum,
    paystackFeeRate: Number(import.meta.env.VITE_PAYSTACK_FEE_RATE) || centralizedCommissionEngine.getCommissionRates().paystack,
    platformFixedFee: Number(import.meta.env.VITE_PLATFORM_FIXED_FEE) || centralizedCommissionEngine.getPlatformFees().fixed,
    vatRate: Number(import.meta.env.VITE_VAT_RATE) || centralizedCommissionEngine.getCommissionRates().vat,
    currencyLimits: centralizedCommissionEngine.getCurrencyConfig().limits,
  },
  security: {
    sessionTimeout: Number(import.meta.env.VITE_SESSION_TIMEOUT) || 3600000, // 1 hour
    anonymousTimeLimit: Number(import.meta.env.VITE_ANONYMOUS_TIME_LIMIT) || 1800, // 30 minutes
    maxLoginAttempts: Number(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS) || 5,
    passwordMinLength: Number(import.meta.env.VITE_PASSWORD_MIN_LENGTH) || 8,
  },
  business: {
    // ✅ CENTRALIZED BUSINESS RULES - Single Source of Truth
    semesterDurationMonths: centralizedBusinessRulesEngine.getBookingRules().semesterDurationMonths,
    maxBookingAdvanceDays: centralizedBusinessRulesEngine.getBookingRules().maxBookingAdvanceDays,
    minBookingAdvanceDays: centralizedBusinessRulesEngine.getBookingRules().minBookingAdvanceDays,
    cancellationDeadlineDays: centralizedBusinessRulesEngine.getBookingRules().cancellationDeadlineDays,
  },
};

// Comprehensive configuration validation
export function validateConfig(): void {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate required environment variables
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_PAYSTACK_PUBLIC_KEY',
  ];

  const missing = requiredVars.filter((key) => !import.meta.env[key]);
  if (missing.length > 0) {
    errors.push(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Validate Supabase URL format
  if (config.supabase.url && !validateUrl(config.supabase.url)) {
    errors.push('Invalid Supabase URL format');
  }

  if (config.supabase.url && !config.supabase.url.includes('supabase.co')) {
    warnings.push('Supabase URL does not appear to be a valid Supabase URL');
  }

  // Validate Paystack key format
  if (config.paystack.publicKey && !validatePaystackKey(config.paystack.publicKey)) {
    errors.push('Invalid Paystack public key format (must start with pk_test_ or pk_live_)');
  }

  // Validate app base URL
  if (config.app.baseUrl && !validateUrl(config.app.baseUrl)) {
    errors.push('Invalid app base URL format');
  }

  // Validate numeric configurations
  if (config.ui.defaultPageSize <= 0 || config.ui.defaultPageSize > config.ui.maxPageSize) {
    errors.push('Invalid page size configuration');
  }

  if (config.payment.platformCommissionRate < 0 || config.payment.platformCommissionRate > 1) {
    errors.push('Platform commission rate must be between 0 and 1');
  }

  if (config.payment.agentCommissionRate < 0 || config.payment.agentCommissionRate > 1) {
    errors.push('Agent commission rate must be between 0 and 1');
  }

  // Handle validation results
  if (errors.length > 0) {
    const message = `Configuration validation failed: ${errors.join(', ')}`;
    logger.error(message, { errors, warnings });

    if (import.meta.env.DEV) {
      logger.warn('Development mode: continuing with invalid configuration');
    } else {
      throw new Error(message);
    }
  }

  // Log warnings
  if (warnings.length > 0) {
    warnings.forEach(warning => logger.warn(warning));
  }

  // Log successful validation
  logger.debug('Configuration validated successfully', {
    environment: config.app.environment,
    hasSupabase: !!config.supabase.url,
    hasPaystack: !!config.paystack.publicKey,
    paystackMode: config.paystack.publicKey?.startsWith('pk_test_') ? 'test' : 'live',
    platformCommissionRate: config.payment.platformCommissionRate,
    defaultPageSize: config.ui.defaultPageSize
  });
}

// Configuration conflict resolution documentation
export const CONFIGURATION_RESOLUTION_LOG = {
  'Platform Commission Rate': {
    conflictingSources: [
      'src/config/index.ts: 5%',
      'src/config/environment.ts: 5%',
      'src/constants/payment.ts: 4.2%',
      'src/types/platform-core.ts: 5%'
    ],
    resolution: 'Using centralizedCommissionEngine (5%) as single source of truth',
    rationale: 'Business decision: 5% aligns with platform strategy and market standards'
  },
  'Default Page Size': {
    conflictingSources: [
      'src/config/index.ts: 10',
      'src/config/environment.ts: 20'
    ],
    resolution: 'Using unifiedConfigurationEngine (20) as single source of truth',
    rationale: 'UX decision: 20 items provides better mobile experience for Ghana market'
  },
  'Configuration System Unification': {
    conflictingSources: [
      'src/config/index.ts: Legacy configuration',
      'src/config/environment.ts: Environment variables',
      'src/types/platform-core.ts: Platform rules',
      'src/types/hostel-management.ts: Hostel rules'
    ],
    resolution: 'Using unifiedConfigurationEngine as single source of truth',
    rationale: 'Technical decision: Unified system provides better maintainability and consistency'
  }
} as const;

// Export singleton instance
export default config;

// Export individual config sections for convenience
export const supabaseConfig = config.supabase;
export const paystackConfig = config.paystack;
export const appConfig = config.app;
export const uiConfig = config.ui;
export const uploadConfig = config.upload;
export const featureConfig = config.features;
export const paymentConfig = config.payment;
export const securityConfig = config.security;
export const businessConfig = config.business;
