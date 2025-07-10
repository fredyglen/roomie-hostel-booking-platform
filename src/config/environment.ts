/**
 * @deprecated Use unifiedConfigurationEngine instead
 *
 * MIGRATION COMPLETED: All environment configuration now comes from unified system
 * - Use unifiedConfigurationEngine from @/config/unified-configuration.config
 * - This file is maintained for backward compatibility only
 *
 * Environment Configuration for ROOMi Platform
 * Centralizes all configuration values with proper validation
 *
 * @version 2.0.0 (Unified International System)
 */

import { logger } from '@/utils/enhanced-logger';

// Environment configuration interface
export interface EnvironmentConfig {
  readonly app: {
    readonly name: string;
    readonly version: string;
    readonly environment: 'development' | 'staging' | 'production';
    readonly baseUrl: string;
  };
  readonly api: {
    readonly supabaseUrl: string;
    readonly supabaseAnonKey: string;
    readonly timeout: number;
    readonly retryAttempts: number;
  };
  readonly payment: {
    readonly paystackPublicKey: string;
    readonly paystackCallbackUrl: string;
    readonly currency: string;
    readonly platformFee: number;
    readonly commissionRate: number;
  };
  readonly upload: {
    readonly maxFileSize: number;
    readonly allowedImageTypes: readonly string[];
    readonly maxImagesPerProperty: number;
    readonly compressionQuality: number;
  };
  readonly security: {
    readonly sessionTimeout: number;
    readonly anonymousTimeLimit: number;
    readonly maxLoginAttempts: number;
    readonly passwordMinLength: number;
  };
  readonly features: {
    readonly paymentEnabled: boolean;
    readonly uploadEnabled: boolean;
    readonly notificationsEnabled: boolean;
    readonly analyticsEnabled: boolean;
    readonly maintenanceMode: boolean;
  };
  readonly ui: {
    readonly defaultPageSize: number;
    readonly maxPageSize: number;
    readonly searchDebounceMs: number;
    readonly toastDuration: number;
    readonly animationDuration: number;
  };
}

// Validation functions
const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const validatePositiveNumber = (value: string): boolean => {
  const num = Number(value);
  return !isNaN(num) && num > 0;
};

const validateBoolean = (value: string): boolean => {
  return value === 'true' || value === 'false';
};

// Environment variable validation rules
const VALIDATION_RULES = [
  {
    key: 'VITE_SUPABASE_URL',
    required: true,
    validator: validateUrl,
    errorMessage: 'VITE_SUPABASE_URL must be a valid URL'
  },
  {
    key: 'VITE_SUPABASE_ANON_KEY',
    required: true,
    validator: (value: string) => value.length > 20,
    errorMessage: 'VITE_SUPABASE_ANON_KEY must be a valid Supabase key'
  },
  {
    key: 'VITE_PAYSTACK_PUBLIC_KEY',
    required: true,
    validator: (value: string) => value.startsWith('pk_'),
    errorMessage: 'VITE_PAYSTACK_PUBLIC_KEY must be a valid Paystack public key'
  },
  {
    key: 'VITE_APP_BASE_URL',
    required: false,
    validator: validateUrl,
    errorMessage: 'VITE_APP_BASE_URL must be a valid URL if provided'
  }
] as const;

// Create and validate environment configuration
function createEnvironmentConfig(): EnvironmentConfig {
  const missingVars: string[] = [];
  const invalidVars: string[] = [];
  const warnings: string[] = [];

  // Validate required environment variables
  for (const rule of VALIDATION_RULES) {
    const value = import.meta.env[rule.key];
    
    if (rule.required && !value) {
      missingVars.push(rule.key);
      continue;
    }
    
    if (value && rule.validator && !rule.validator(value)) {
      invalidVars.push(rule.key);
      if (rule.errorMessage) {
        warnings.push(rule.errorMessage);
      }
    }
  }

  // Handle validation errors
  if (missingVars.length > 0) {
    const error = `Missing required environment variables: ${missingVars.join(', ')}`;
    logger.error('Environment validation failed', { missingVars });
    throw new Error(error);
  }

  if (invalidVars.length > 0) {
    const error = `Invalid environment variables: ${invalidVars.join(', ')}`;
    logger.error('Environment validation failed', { invalidVars, warnings });
    throw new Error(error);
  }

  // Log warnings for development
  if (warnings.length > 0 && import.meta.env.DEV) {
    warnings.forEach(warning => logger.warn(warning));
  }

  // Build configuration object
  const config: EnvironmentConfig = {
    app: {
      name: import.meta.env.VITE_APP_NAME || 'ROOMi Campus Nest',
      version: import.meta.env.VITE_APP_VERSION || '1.0.0',
      environment: (import.meta.env.MODE as 'development' | 'staging' | 'production') || 'development',
      baseUrl: import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5173'
    },
    api: {
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL!,
      supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY!,
      timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
      retryAttempts: Number(import.meta.env.VITE_API_RETRY_ATTEMPTS) || 3
    },
    payment: {
      paystackPublicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY!,
      paystackCallbackUrl: import.meta.env.VITE_PAYSTACK_CALLBACK_URL || `${import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5173'}/payment/callback`,
      currency: import.meta.env.VITE_PAYMENT_CURRENCY || 'GHS',
      platformFee: Number(import.meta.env.VITE_PLATFORM_FEE) || 100,
      commissionRate: Number(import.meta.env.VITE_COMMISSION_RATE) || 0.05
    },
    upload: {
      maxFileSize: Number(import.meta.env.VITE_UPLOAD_MAX_SIZE) || 5242880, // 5MB
      allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'] as const,
      maxImagesPerProperty: Number(import.meta.env.VITE_MAX_IMAGES_PER_PROPERTY) || 10,
      compressionQuality: Number(import.meta.env.VITE_IMAGE_COMPRESSION_QUALITY) || 0.8
    },
    security: {
      sessionTimeout: Number(import.meta.env.VITE_SESSION_TIMEOUT) || 3600000, // 1 hour
      anonymousTimeLimit: Number(import.meta.env.VITE_ANONYMOUS_TIME_LIMIT) || 1800, // 30 minutes
      maxLoginAttempts: Number(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS) || 5,
      passwordMinLength: Number(import.meta.env.VITE_PASSWORD_MIN_LENGTH) || 8
    },
    features: {
      paymentEnabled: import.meta.env.VITE_PAYMENT_ENABLED === 'true',
      uploadEnabled: import.meta.env.VITE_UPLOAD_ENABLED !== 'false', // Default true
      notificationsEnabled: import.meta.env.VITE_NOTIFICATIONS_ENABLED === 'true',
      analyticsEnabled: import.meta.env.VITE_ANALYTICS_ENABLED === 'true',
      maintenanceMode: import.meta.env.VITE_MAINTENANCE_MODE === 'true'
    },
    ui: {
      // RESOLVED CONFLICT: Using PLATFORM_RULES as single source of truth for pagination
      defaultPageSize: Number(import.meta.env.VITE_DEFAULT_PAGE_SIZE) || 20, // Aligned with PLATFORM_RULES.DEFAULT_PAGE_SIZE
      maxPageSize: Number(import.meta.env.VITE_MAX_PAGE_SIZE) || 100, // Aligned with PLATFORM_RULES.MAX_PAGE_SIZE
      searchDebounceMs: Number(import.meta.env.VITE_SEARCH_DEBOUNCE_MS) || 300,
      toastDuration: Number(import.meta.env.VITE_TOAST_DURATION) || 5000,
      animationDuration: Number(import.meta.env.VITE_ANIMATION_DURATION) || 200
    }
  };

  // Log configuration in development (without sensitive data)
  if (import.meta.env.DEV) {
    const safeConfig = {
      ...config,
      api: {
        ...config.api,
        supabaseAnonKey: '[REDACTED]'
      },
      payment: {
        ...config.payment,
        paystackPublicKey: '[REDACTED]'
      }
    };
    logger.info('Environment configuration loaded', safeConfig);
  }

  return config;
}

// Export singleton configuration
export const environmentConfig = createEnvironmentConfig();

// Export individual config sections for convenience
export const appConfig = environmentConfig.app;
export const apiConfig = environmentConfig.api;
export const paymentConfig = environmentConfig.payment;
export const uploadConfig = environmentConfig.upload;
export const securityConfig = environmentConfig.security;
export const featureConfig = environmentConfig.features;
export const uiConfig = environmentConfig.ui;

// Export validation function for testing
export { createEnvironmentConfig };
