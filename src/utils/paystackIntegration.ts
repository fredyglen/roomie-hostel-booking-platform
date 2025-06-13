import { supabase } from '@/lib/supabase';
import { formatCurrency } from './currency';
import { ErrorHandler } from '@/utils/ErrorHandler';
import { config } from '@/config';
import { PAYMENT_CONSTANTS } from '@/constants/payment';

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
  phoneNumber: string;
  network: 'mtn' | 'vodafone' | 'airtel';
  email: string;
  metadata?: Record<string, any>;
  onSuccess: (reference: any) => void;
  onError: (error: any) => void;
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
export const initializePaystackPayment = async (config: PaystackConfig): Promise<PaymentInitResult> => {
  try {
    // Validate inputs before proceeding
    if (!config.email) {
      return { success: false, message: 'Email is required for payment' };
    }
    
    if (!config.amount || config.amount <= 0) {
      return { success: false, message: 'Valid amount is required for payment' };
    }

    ErrorHandler.log('Initializing Paystack payment: ' + JSON.stringify({
      amount: formatCurrency(config.amount),
      email: config.email,
      currency: config.currency || 'GHS'
    }));

    // Call our Supabase Edge Function to initialize payment
    const { data, error } = await supabase.functions.invoke('initialize-payment', {
      body: {
        email: config.email,
        amount: config.amount,
        currency: config.currency || 'GHS',
        metadata: config.metadata,
        channels: config.channels,
        split_code: config.split_code,
        subaccount: config.subaccount,
        callback_url: config.callback_url
      }
    });

    if (error) {
      ErrorHandler.handle(error, 'Payment initialization error');
      return { 
        success: false, 
        message: error.message || 'Failed to initialize payment',
        error: error
      };
    }

    if (!data.status) {
      return { 
        success: false, 
        message: data.message || 'Payment initialization failed'
      };
    }

    // Use Paystack Popup for frontend payment
    if (typeof window !== 'undefined' && (window as any).PaystackPop) {
      const popup = new (window as any).PaystackPop();
      
      popup.resumeTransaction(data.data.access_code, {
        onSuccess: (transaction: { reference: string }) => {
          ErrorHandler.log('Payment successful:', JSON.stringify(transaction));
          config.onSuccess(transaction.reference);
        },
        onCancel: () => {
          ErrorHandler.log('Payment cancelled');
          config.onCancel();
        },
        onClose: config.onClose,
        onError: (error: unknown) => {
          ErrorHandler.handle(error, 'Paystack payment error');
          config.onError && config.onError(error);
        }
      });
    } else {
      // Fallback to redirect
      window.location.href = data.data.authorization_url;
    }

  } catch (error) {
    ErrorHandler.handle('Payment initialization error:', error);
  }
};

// Mobile Money Integration using Paystack Charge API
export const initializeMobileMoneyPayment = async (config: MobileMoneyConfig) => {
  try {
    ErrorHandler.log('Initializing Mobile Money payment: ' + JSON.stringify({
      amount: formatCurrency(config.amount),
      network: config.network.toUpperCase(),
      phone: config.phoneNumber
    }));

    // Initialize transaction first
    const { data, error } = await supabase.functions.invoke('initialize-payment', {
      body: {
        email: config.email,
        amount: config.amount,
        currency: 'GHS',
        metadata: {
          ...config.metadata,
          payment_method: 'mobile_money',
          mobile_money: {
            phone: config.phoneNumber,
            provider: config.network.toUpperCase()
          }
        },
        channels: ['mobile_money']
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.status) {
      throw new Error(data.message);
    }

    // For mobile money, we'll redirect to Paystack's mobile money flow
    window.location.href = data.data.authorization_url;

  } catch (error) {
    ErrorHandler.handle('Mobile Money payment error:', error);
  }
};

// Verify payment status
export const verifyPayment = async (reference: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('verify-payment', {
      body: { reference }
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    ErrorHandler.handle('Payment verification error:', error);
    throw error;
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
