import { supabase } from '@/integrations/supabase/client';
import { ErrorHandler } from '@/utils/ErrorHandler';

export interface PaystackVerificationData {
  reference: string;
  amount: number;
  customer: Record<string, unknown>;
  channel: string;
  id: number;
  metadata?: Record<string, unknown>; // Add metadata property
}

export interface PaymentVerificationResult {
  success: boolean;
  data?: PaystackVerificationData;
  amount?: number;
  reference?: string;
  customer?: unknown;
  message?: string;
  error?: string;
}

export const verifyPaystackPayment = async (reference: string): Promise<PaymentVerificationResult> => {
  try {
    ErrorHandler.log('Verifying payment with reference:', reference);
    
    // Use our Supabase Edge Function for verification
    const { data, error } = await supabase.functions.invoke('verify-payment', {
      body: { reference }
    });

    if (error) {
      ErrorHandler.handle('Verification error:', error);
      return {
        success: false,
        message: 'Failed to verify payment',
        error: error.message
      };
    }

    if (data?.status && data?.data) {
      const paystackResponse = data;

      // Handle potential errors in the response structure
      if (!paystackResponse || !paystackResponse.data) {
        ErrorHandler.handle('Invalid Paystack verification response', paystackResponse);
        return { success: false, message: 'Invalid verification response from payment provider.' };
      }

      const paystackData = paystackResponse.data;

      // Basic checks (can be expanded)
      if (!paystackData.status || paystackData.status !== 'success') {
        ErrorHandler.handle('Paystack verification status not success', paystackData);
        return { success: false, message: paystackData.gateway_response || 'Payment verification failed.' };
      }

      // Further validation and data extraction with type guards
      const reference = typeof paystackData.reference === 'string' ? paystackData.reference : null;
      const amount = typeof paystackData.amount === 'number' ? paystackData.amount : null;
      const customer = typeof paystackData.customer === 'object' && paystackData.customer !== null ? paystackData.customer as Record<string, unknown> : null;
      const channel = typeof paystackData.channel === 'string' ? paystackData.channel : null;
      const id = typeof paystackData.id === 'number' ? paystackData.id : null; // Assuming ID is a number

      if (!reference || amount === null || !customer || !channel || id === null) {
        ErrorHandler.handle('Missing essential data in Paystack verification response', paystackData);
        return { success: false, message: 'Incomplete data from payment provider.' };
      }

      // Return essential verification data (including metadata when available)
      return {
        success: true,
        data: {
          reference,
          amount,
          customer,
          channel,
          id,
          metadata: (paystackData.metadata as Record<string, unknown> | undefined)
        },
        message: 'Payment verified successfully.'
      };
    } else {
      return {
        success: false,
        message: data?.message || 'Payment verification failed',
      };
    }
  } catch (error) {
    ErrorHandler.handle('Payment verification error:', error);
    return {
      success: false,
      message: 'Failed to verify payment',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
