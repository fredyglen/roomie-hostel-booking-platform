// Unified configuration with validation
import { logger } from '@/utils/enhanced-logger';
import { getValidatedEnvironment, type EnvironmentConfig } from '@/utils/environment-validator';

export interface AppConfig extends EnvironmentConfig {
  paystack: EnvironmentConfig['paystack'] & {
    currency: 'GHS';
    channels: readonly ('card' | 'mobile_money' | 'bank' | 'ussd' | 'qr')[];
  };
}

// Create and validate configuration using the environment validator
const envConfig = getValidatedEnvironment();

export const config: AppConfig = {
  ...envConfig,
  paystack: {
    ...envConfig.paystack,
    currency: 'GHS',
    channels: ['card', 'mobile_money', 'bank', 'ussd', 'qr'] as const,
  },
};

// Export singleton instance
export default config;