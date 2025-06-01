
import { PaystackPop } from '@paystack/inline-js';

export const PAYSTACK_CONFIG = {
  publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder',
  currency: 'GHS' as const,
  channels: ['card', 'mobile_money', 'bank', 'ussd', 'qr'] as const,
};

export interface PaystackPaymentData {
  email: string;
  amount: number; // Amount in kobo (GHS * 100)
  firstName?: string;
  lastName?: string;
  phone?: string;
  reference?: string;
  metadata?: Record<string, any>;
  onSuccess: (transaction: any) => void;
  onCancel: () => void;
  onClose?: () => void;
}

export const validatePaystackConfig = () => {
  const publicKey = PAYSTACK_CONFIG.publicKey;
  
  if (!publicKey || publicKey === 'pk_test_placeholder') {
    throw new Error('VITE_PAYSTACK_PUBLIC_KEY is not set in environment variables');
  }
  
  if (!publicKey.startsWith('pk_test_') && !publicKey.startsWith('pk_live_')) {
    throw new Error('Invalid Paystack public key format');
  }
  
  return publicKey;
};

export const initializePaystackPayment = (paymentData: PaystackPaymentData) => {
  try {
    const publicKey = validatePaystackConfig();
    
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
      onSuccess: paymentData.onSuccess,
      onCancel: paymentData.onCancel,
      onClose: paymentData.onClose || (() => console.log('Payment modal closed')),
    });
    
    paystack.openIframe();
  } catch (error) {
    console.error('Payment initialization error:', error);
    throw error;
  }
};
