import { supabase } from '@/integrations/supabase/client';
import { ErrorHandler } from '@/utils/ErrorHandler';
import { config } from '@/config';
import PaystackPop from '@paystack/inline-js';
import { logger } from '@/utils/enhanced-logger';
import type { PaymentData, PaymentTransaction, MobileMoneyNetwork } from '@/types/payment';

// Validate Paystack configuration
export const validatePaystackConfig = (): string => {
  const publicKey = config.paystack.publicKey;
  
  if (!publicKey || publicKey === 'pk_test_placeholder') {
    const error = 'VITE_PAYSTACK_PUBLIC_KEY is not set in environment variables';
    ErrorHandler.handle(new Error(error), 'Paystack configuration error');
    throw new Error(error);
  }
  
  if (!publicKey.startsWith('pk_test_') && !publicKey.startsWith('pk_live_')) {
    const error = 'Invalid Paystack public key format';
    ErrorHandler.handle(new Error(error), 'Paystack configuration error');
    throw new Error(error);
  }
  
  logger.debug('Paystack configuration validated', { 
    isTestMode: publicKey.startsWith('pk_test_'),
    keyPrefix: publicKey.substring(0, 8)
  });
  
  return publicKey;
};

export interface PaystackConfig {
  email: string;
  amount: number; // in GHS
  currency?: 'GHS' | 'NGN' | 'USD';
  metadata?: Record<string, any>;
  channels?: string[];
  split_code?: string;
  subaccount?: string;
  callback_url?: string;
  onSuccess: (reference: string) => void;
  onCancel: () => void;
  onError?: (error: unknown) => void;
  onClose?: () => void;
}

export interface MobileMoneyConfig {
  amount: number;
  email: string;
  phone: string;
  network: MobileMoneyNetwork;
  reference?: string;
  metadata?: Record<string, unknown>;
  onSuccess: (transaction: PaymentTransaction) => void;
  onError: (error: Error) => void;
}

export interface PaystackPaymentOptions {
  amount: number;
  email: string;
  reference?: string;
  metadata?: Record<string, unknown>;
  onSuccess: (reference: string) => void;
  onClose?: () => void;
  onError?: (error: unknown) => void;
}

export interface PaymentInitResult {
  success: boolean;
  message: string;
  error?: unknown;
  paymentData?: any;
}

// Initialize Paystack payment
export const initializePaystackPayment = (paymentData: PaymentData): void => {
  try {
    const publicKey = validatePaystackConfig();
    
    const paystack = PaystackPop.setup({
      key: publicKey,
      email: paymentData.email,
      amount: convertToPesewas(paymentData.amount),
      currency: config.paystack.currency,
      channels: config.paystack.channels as unknown as string[],
      ref: paymentData.reference || generatePaymentReference(),
      metadata: paymentData.metadata,
      onSuccess: (transaction: PaymentTransaction) => {
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
    });
    
    paystack.openIframe();
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    ErrorHandler.handle(err, 'Failed to initialize Paystack payment');
    throw err;
  }
};

// Initialize Mobile Money payment
export const initializeMobileMoneyPayment = async (mobileConfig: MobileMoneyConfig): Promise<void> => {
  try {
    const publicKey = validatePaystackConfig();

    const response = await fetch(`${config.paystack.baseUrl}/charge/mobile_money`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: mobileConfig.email,
        amount: convertToPesewas(mobileConfig.amount),
        mobile_money: {
          phone: mobileConfig.phone,
          provider: mobileConfig.network
        },
        reference: mobileConfig.reference || generatePaymentReference(),
        metadata: mobileConfig.metadata
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to initialize mobile money payment');
    }
    
    if (data.status === 'success') {
      mobileConfig.onSuccess(data.data as PaymentTransaction);
    } else {
      throw new Error(data.message || 'Mobile money payment failed');
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    ErrorHandler.handle(err, 'Mobile money payment failed');
    mobileConfig.onError(err);
  }
};

// Verify payment status
export const verifyPayment = async (reference: string): Promise<PaymentTransaction> => {
  try {
    const publicKey = validatePaystackConfig();

    const response = await fetch(`${config.paystack.baseUrl}/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Payment verification failed');
    }
    
    return data.data as PaymentTransaction;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    ErrorHandler.handle(err, 'Payment verification failed');
    throw err;
  }
};

// Generate unique payment reference
export const generatePaymentReference = (prefix: string = 'ROOMI'): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}_${timestamp}_${random}`;
};

// Convert Ghana Cedis to pesewas for Paystack
export const convertToPesewas = (amount: number): number => {
  return Math.round(amount * 100);
};

// Validate payment amount
export const validatePaymentAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 50000; // Max ₵50,000 per transaction
};

// Format payment reference for display
export const formatPaymentReference = (ref: string): string => {
  return ref.replace(/_/g, '-');
};

// Get supported mobile money providers
export const getMobileMoneyProviders = () => [
  { code: 'mtn', name: 'MTN Mobile Money', color: '#FFCC00' },
  { code: 'vodafone', name: 'Vodafone Cash', color: '#E60000' },
  { code: 'airtel', name: 'AirtelTigo Money', color: '#FF6600' }
];

// Check transaction status
export const getTransactionStatus = async (reference: string) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('reference', reference)
    .single();

  if (error) {
    throw error;
  }

  return data;
};
