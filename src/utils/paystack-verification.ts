
import { supabase } from '@/lib/supabase';

export interface PaymentVerificationResult {
  success: boolean;
  data?: any;
  amount?: number;
  reference?: string;
  customer?: any;
  message?: string;
  error?: string;
}

export const verifyPaystackPayment = async (reference: string): Promise<PaymentVerificationResult> => {
  try {
    console.log('Verifying payment with reference:', reference);
    
    // Use our Supabase Edge Function for verification
    const { data, error } = await supabase.functions.invoke('verify-payment', {
      body: { reference }
    });

    if (error) {
      console.error('Verification error:', error);
      return {
        success: false,
        message: 'Failed to verify payment',
        error: error.message
      };
    }

    if (data?.status && data?.data) {
      return {
        success: true,
        data: data.data,
        amount: data.data.amount / 100, // Convert back to GHS
        reference: data.data.reference,
        customer: data.data.customer,
      };
    } else {
      return {
        success: false,
        message: data?.message || 'Payment verification failed',
      };
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return {
      success: false,
      message: 'Failed to verify payment',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
