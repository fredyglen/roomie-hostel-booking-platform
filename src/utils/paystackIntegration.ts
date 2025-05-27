
import { formatCurrency } from './currency';

export interface PaystackConfig {
  publicKey: string;
  amount: number; // in Ghana pesewas (GHS * 100)
  email: string;
  currency: 'GHS';
  ref: string;
  metadata?: Record<string, any>;
  onSuccess: (reference: any) => void;
  onCancel: () => void;
}

export interface MobileMoneyConfig {
  amount: number;
  phoneNumber: string;
  network: 'mtn' | 'vodafone' | 'airtel';
  email: string;
  ref: string;
  onSuccess: (reference: any) => void;
  onError: (error: any) => void;
}

// Paystack Integration Helper
export const initializePaystackPayment = (config: PaystackConfig) => {
  // In production, this would integrate with Paystack's JavaScript library
  // For now, we'll simulate the payment process
  
  console.log('Initializing Paystack payment:', {
    amount: formatCurrency(config.amount / 100),
    email: config.email,
    reference: config.ref
  });
  
  // Simulate payment processing
  setTimeout(() => {
    const success = Math.random() > 0.1; // 90% success rate for demo
    
    if (success) {
      config.onSuccess({
        reference: config.ref,
        status: 'success',
        trans: `PSK_${Date.now()}`,
        trxref: config.ref,
        amount: config.amount,
        currency: config.currency
      });
    } else {
      config.onCancel();
    }
  }, 2000);
};

// Mobile Money Integration Helper
export const initializeMobileMoneyPayment = (config: MobileMoneyConfig) => {
  console.log('Initializing Mobile Money payment:', {
    amount: formatCurrency(config.amount),
    network: config.network.toUpperCase(),
    phone: config.phoneNumber
  });
  
  // Simulate mobile money processing
  setTimeout(() => {
    const success = Math.random() > 0.15; // 85% success rate for demo
    
    if (success) {
      config.onSuccess({
        reference: config.ref,
        status: 'success',
        trans: `MOMO_${Date.now()}`,
        amount: config.amount,
        network: config.network
      });
    } else {
      config.onError({
        message: 'Payment failed. Please check your mobile money account and try again.',
        code: 'PAYMENT_FAILED'
      });
    }
  }, 3000);
};

// Generate unique payment reference
export const generatePaymentReference = (prefix: string = 'ROOMi'): string => {
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
  return amount > 0 && amount <= 10000; // Max ₵10,000 per transaction
};

// Format payment reference for display
export const formatPaymentReference = (ref: string): string => {
  return ref.replace(/_/g, '-');
};
