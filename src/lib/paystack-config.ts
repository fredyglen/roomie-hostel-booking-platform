
import { PaystackPop } from '@paystack/inline-js';
import { APP_CONFIG } from '@/config/constants';
import { logger } from '@/utils/enhanced-logger';
import type { PaymentData } from '@/types/common';

export const PAYSTACK_CONFIG = {
  publicKey: APP_CONFIG.PAYSTACK.PUBLIC_KEY,
  currency: APP_CONFIG.PAYSTACK.CURRENCY,
  channels: APP_CONFIG.PAYSTACK.CHANNELS,
} as const;

export interface PaystackPaymentData extends PaymentData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  onSuccess: (transaction: unknown) => void;
  onCancel: () => void;
  onClose?: () => void;
}

export const validatePaystackConfig = (): string => {
  const publicKey = PAYSTACK_CONFIG.publicKey;
  
  if (!publicKey || publicKey === 'pk_test_placeholder') {
    const error = 'VITE_PAYSTACK_PUBLIC_KEY is not set in environment variables';
    logger.error('Paystack configuration error', { error });
    throw new Error(error);
  }
  
  if (!publicKey.startsWith('pk_test_') && !publicKey.startsWith('pk_live_')) {
    const error = 'Invalid Paystack public key format';
    logger.error('Paystack configuration error', { error, keyPrefix: publicKey.substring(0, 8) });
    throw new Error(error);
  }
  
  logger.debug('Paystack configuration validated', { 
    isTestMode: publicKey.startsWith('pk_test_'),
    keyPrefix: publicKey.substring(0, 8)
  });
  
  return publicKey;
};

export const initializePaystackPayment = (paymentData: PaystackPaymentData): void => {
  try {
    const publicKey = validatePaystackConfig();
    
    logger.info('Initializing Paystack payment', {
      amount: paymentData.amount,
      email: paymentData.email,
      currency: PAYSTACK_CONFIG.currency
    });
    
    const paystack = PaystackPop.setup({
      key: publicKey,
      email: paymentData.email,
      amount: Math.round(paymentData.amount * 100), // Convert GHS to pesewas
      currency: PAYSTACK_CONFIG.currency,
      channels: PAYSTACK_CONFIG.channels,
      firstname: paymentData.firstName,
      lastname: paymentData.lastName,
      phone: paymentData.phone,
      ref: paymentData.reference || `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      metadata: paymentData.metadata,
      onSuccess: (transaction) => {
        logger.info('Payment successful', { 
          reference: transaction?.reference || 'unknown',
          amount: paymentData.amount 
        });
        paymentData.onSuccess(transaction);
      },
      onCancel: () => {
        logger.info('Payment cancelled by user');
        paymentData.onCancel();
      },
      onClose: () => {
        logger.debug('Payment modal closed');
        paymentData.onClose?.();
      },
    });
    
    paystack.openIframe();
  } catch (error) {
    logger.error('Payment initialization failed', error instanceof Error ? error : new Error(String(error)));
    throw error;
  }
};
