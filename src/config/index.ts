
// Unified configuration module
import { logger } from '@/utils/enhanced-logger';

// Configuration types
export interface AppConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  paystack: {
    publicKey: string;
    baseUrl: string;
    currency: 'GHS';
    channels: readonly ('card' | 'mobile_money' | 'bank' | 'ussd' | 'qr')[];
  };
  app: {
    baseUrl: string;
    environment: 'development' | 'staging' | 'production';
    imageCdnUrl: string;
    defaultPageSize: number;
    maxPageSize: number;
    maxImageSize: number;
    allowedImageTypes: readonly string[];
    allowedVideoTypes: readonly string[];
  };
  features: {
    enableNotifications: boolean;
    enableAnalytics: boolean;
    enableOfflineMode: boolean;
  };
  payment: {
    platformCommissionRate: number;
    agentCommissionRate: number;
    agentMinimumFee: number;
    paystackFeeRate: number;
    bookingFeeRate: number;
  };
}

// Validate required environment variables
const validateRequiredEnvVar = (key: string, value?: string): string => {
  if (!value) {
    const error = `Required environment variable ${key} is not set`;
    logger.error(error);
    throw new Error(error);
  }
  return value;
};

// Create and validate configuration
export const config: AppConfig = {
  supabase: {
    url: validateRequiredEnvVar('VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL),
    anonKey: validateRequiredEnvVar('VITE_SUPABASE_ANON_KEY', import.meta.env.VITE_SUPABASE_ANON_KEY),
  },
  paystack: {
    publicKey: validateRequiredEnvVar('VITE_PAYSTACK_PUBLIC_KEY', import.meta.env.VITE_PAYSTACK_PUBLIC_KEY),
    baseUrl: import.meta.env.VITE_PAYSTACK_BASE_URL || 'https://api.paystack.co',
    currency: 'GHS',
    channels: ['card', 'mobile_money', 'bank', 'ussd', 'qr'] as const,
  },
  app: {
    baseUrl: import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5173',
    environment: import.meta.env.MODE as 'development' | 'staging' | 'production',
    imageCdnUrl: import.meta.env.VITE_IMAGE_CDN_URL || '',
    defaultPageSize: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE || '10'),
    maxPageSize: parseInt(import.meta.env.VITE_MAX_PAGE_SIZE || '100'),
    maxImageSize: parseInt(import.meta.env.VITE_MAX_IMAGE_SIZE || '5242880'), // 5MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'] as const,
    allowedVideoTypes: ['video/mp4', 'video/webm'] as const,
  },
  features: {
    enableNotifications: true,
    enableAnalytics: import.meta.env.MODE === 'production',
    enableOfflineMode: false,
  },
  payment: {
    platformCommissionRate: 0.05, // 5% platform commission
    agentCommissionRate: 0.037, // 3.7% agent commission
    agentMinimumFee: 100, // GHS 100 minimum
    paystackFeeRate: 0.0195, // 1.95% Paystack fee
    bookingFeeRate: 0.02, // 2% booking fee
  },
};

// Validate configuration at runtime
export function validateConfig(): void {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_PAYSTACK_PUBLIC_KEY',
  ];

  const missing = requiredVars.filter((key) => !import.meta.env[key]);

  if (missing.length > 0) {
    const message = `Missing required environment variables: ${missing.join(', ')}`;

    if (import.meta.env.DEV) {
      logger.warn(message);
    } else {
      logger.error(message);
      throw new Error(message);
    }
  }

  // Validate Paystack key format
  const paystackKey = config.paystack.publicKey;
  if (paystackKey && !paystackKey.startsWith('pk_test_') && !paystackKey.startsWith('pk_live_')) {
    const message = 'Invalid Paystack public key format';
    logger.error(message);
    throw new Error(message);
  }

  // Validate Supabase URL format
  const supabaseUrl = config.supabase.url;
  if (supabaseUrl && !supabaseUrl.includes('supabase.co')) {
    const message = 'Invalid Supabase URL format';
    logger.warn(message);
  }

  logger.debug('Configuration validated successfully', {
    environment: config.app.environment,
    hasSupabase: !!config.supabase.url,
    hasPaystack: !!config.paystack.publicKey,
    paystackMode: paystackKey?.startsWith('pk_test_') ? 'test' : 'live'
  });
}

// Export singleton instance
export default config;
