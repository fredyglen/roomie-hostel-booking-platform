/**
 * Comprehensive environment validation for ROOMi platform
 * Ensures all required environment variables are present and valid
 */

import { logger } from './enhanced-logger';

export interface EnvironmentConfig {
  // Supabase Configuration
  supabase: {
    url: string;
    anonKey: string;
  };
  
  // Paystack Configuration
  paystack: {
    publicKey: string;
    baseUrl: string;
  };
  
  // Application Configuration
  app: {
    baseUrl: string;
    environment: 'development' | 'staging' | 'production';
    imageCdnUrl?: string;
    defaultPageSize: number;
    maxPageSize: number;
    maxImageSize: number;
  };
}

interface ValidationRule {
  key: string;
  required: boolean;
  validator?: (value: string) => boolean;
  errorMessage?: string;
}

const VALIDATION_RULES: ValidationRule[] = [
  {
    key: 'VITE_SUPABASE_URL',
    required: true,
    validator: (value) => value.startsWith('https://') && value.includes('.supabase.co'),
    errorMessage: 'VITE_SUPABASE_URL must be a valid Supabase URL'
  },
  {
    key: 'VITE_SUPABASE_ANON_KEY',
    required: true,
    validator: (value) => value.length > 100 && value.startsWith('eyJ'),
    errorMessage: 'VITE_SUPABASE_ANON_KEY must be a valid JWT token'
  },
  {
    key: 'VITE_PAYSTACK_PUBLIC_KEY',
    required: true,
    validator: (value) => value.startsWith('pk_'),
    errorMessage: 'VITE_PAYSTACK_PUBLIC_KEY must start with pk_'
  },
  {
    key: 'VITE_PAYSTACK_BASE_URL',
    required: false,
    validator: (value) => value.startsWith('https://'),
    errorMessage: 'VITE_PAYSTACK_BASE_URL must be a valid HTTPS URL'
  },
  {
    key: 'VITE_APP_BASE_URL',
    required: false,
    validator: (value) => value.startsWith('http'),
    errorMessage: 'VITE_APP_BASE_URL must be a valid URL'
  }
];

export class EnvironmentValidationError extends Error {
  constructor(
    message: string,
    public missingVars: string[] = [],
    public invalidVars: string[] = []
  ) {
    super(message);
    this.name = 'EnvironmentValidationError';
  }
}

export function validateEnvironment(): EnvironmentConfig {
  const missingVars: string[] = [];
  const invalidVars: string[] = [];
  const warnings: string[] = [];

  // Check each validation rule
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

  // Log warnings for development
  if (warnings.length > 0 && import.meta.env.DEV) {
    warnings.forEach(warning => logger.warn(warning));
  }

  // Throw error for missing required variables
  if (missingVars.length > 0) {
    const message = `Missing required environment variables: ${missingVars.join(', ')}`;
    logger.error(message);
    throw new EnvironmentValidationError(message, missingVars, invalidVars);
  }

  // Throw error for invalid variables in production
  if (invalidVars.length > 0 && import.meta.env.PROD) {
    const message = `Invalid environment variables: ${invalidVars.join(', ')}`;
    logger.error(message);
    throw new EnvironmentValidationError(message, missingVars, invalidVars);
  }

  // Return validated configuration
  return {
    supabase: {
      url: import.meta.env.VITE_SUPABASE_URL,
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    },
    paystack: {
      publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      baseUrl: import.meta.env.VITE_PAYSTACK_BASE_URL || 'https://api.paystack.co',
    },
    app: {
      baseUrl: import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5173',
      environment: import.meta.env.MODE as 'development' | 'staging' | 'production',
      imageCdnUrl: import.meta.env.VITE_IMAGE_CDN_URL,
      defaultPageSize: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE || '10'),
      maxPageSize: parseInt(import.meta.env.VITE_MAX_PAGE_SIZE || '100'),
      maxImageSize: parseInt(import.meta.env.VITE_MAX_IMAGE_SIZE || '5242880'), // 5MB
    },
  };
}

/**
 * Get environment configuration with validation
 * This should be called once at application startup
 */
export function getValidatedEnvironment(): EnvironmentConfig {
  try {
    const config = validateEnvironment();
    logger.info('Environment validation successful', {
      environment: config.app.environment,
      hasSupabase: !!config.supabase.url,
      hasPaystack: !!config.paystack.publicKey,
    });
    return config;
  } catch (error) {
    if (error instanceof EnvironmentValidationError) {
      // In development, allow missing non-critical variables
      if (import.meta.env.DEV) {
        logger.warn('Environment validation failed in development mode', {
          missingVars: error.missingVars,
          invalidVars: error.invalidVars,
        });
        
        // Return minimal config for development
        return {
          supabase: {
            url: import.meta.env.VITE_SUPABASE_URL || '',
            anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
          },
          paystack: {
            publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '',
            baseUrl: 'https://api.paystack.co',
          },
          app: {
            baseUrl: 'http://localhost:5173',
            environment: 'development',
            defaultPageSize: 10,
            maxPageSize: 100,
            maxImageSize: 5242880,
          },
        };
      }
    }
    
    // Re-throw in production
    throw error;
  }
}

/**
 * Check if environment is properly configured
 */
export function isEnvironmentConfigured(): boolean {
  try {
    validateEnvironment();
    return true;
  } catch {
    return false;
  }
}

/**
 * Get environment status for debugging
 */
export function getEnvironmentStatus() {
  const status = {
    isConfigured: false,
    environment: import.meta.env.MODE,
    missingVars: [] as string[],
    invalidVars: [] as string[],
    warnings: [] as string[],
  };

  try {
    validateEnvironment();
    status.isConfigured = true;
  } catch (error) {
    if (error instanceof EnvironmentValidationError) {
      status.missingVars = error.missingVars;
      status.invalidVars = error.invalidVars;
    }
  }

  return status;
}
