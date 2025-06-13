// Unified configuration with validation
import { logger } from '@/utils/enhanced-logger';

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
    imageCdnUrl: string;
    defaultPageSize: number;
    maxPageSize: number;
    maxImageSize: number;
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
    imageCdnUrl: import.meta.env.VITE_IMAGE_CDN_URL || '',
    defaultPageSize: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE || '10'),
    maxPageSize: parseInt(import.meta.env.VITE_MAX_PAGE_SIZE || '100'),
    maxImageSize: parseInt(import.meta.env.VITE_MAX_IMAGE_SIZE || '5242880'), // 5MB
  },
};

// Export singleton instance
export default config;