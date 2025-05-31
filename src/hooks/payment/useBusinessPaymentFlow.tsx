
import { useState } from 'react';
import { useAuth } from '@/context/EnhancedAuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';
import { logger } from '@/utils/logger';

interface PaymentData {
  propertyId: string;
  studentId: string;
  propertyOwnerId: string;
  agentId: string;
  packageType: 'standard' | 'premium' | 'luxury';
  startDate: string;
  endDate: string;
  studentEmail: string;
  metadata?: Record<string, any>;
}

interface PaymentResult {
  success: boolean;
  paymentData?: {
    reference: string;
    access_code: string;
    authorization_url: string;
  };
  error?: string;
}

export const useBusinessPaymentFlow = () => {
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();

  const initializePayment = async (paymentData: PaymentData): Promise<PaymentResult> => {
    if (!user) {
      const error = 'User must be authenticated to initialize payment';
      logger.error(error);
      toast.error('Authentication required');
      return { success: false, error };
    }

    setProcessing(true);
    logger.info('Initializing business payment flow', { paymentData });

    try {
      // Calculate amount based on package type
      const packagePricing = {
        standard: 2700,
        premium: 3600,
        luxury: 4000
      };

      const amount = packagePricing[paymentData.packageType];
      
      const { data, error } = await supabase.functions.invoke('initialize-payment', {
        body: {
          email: paymentData.studentEmail,
          amount,
          currency: 'GHS',
          metadata: {
            ...paymentData.metadata,
            property_id: paymentData.propertyId,
            student_id: paymentData.studentId,
            property_owner_id: paymentData.propertyOwnerId,
            agent_id: paymentData.agentId,
            package_type: paymentData.packageType,
            start_date: paymentData.startDate,
            end_date: paymentData.endDate,
            payment_type: 'property_booking'
          },
          channels: ['card', 'mobile_money']
        }
      });

      if (error) {
        logger.error('Payment initialization failed', { error });
        toast.error('Payment initialization failed');
        return { success: false, error: error.message };
      }

      if (!data.status) {
        logger.error('Payment service returned error', { data });
        toast.error(data.message || 'Payment initialization failed');
        return { success: false, error: data.message };
      }

      logger.info('Payment initialized successfully', { reference: data.data.reference });
      
      // Redirect to Paystack checkout
      if (data.data.authorization_url) {
        window.location.href = data.data.authorization_url;
      }

      return {
        success: true,
        paymentData: data.data
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      logger.error('Payment initialization error', { error: errorMessage });
      toast.error('Payment initialization failed');
      return { success: false, error: errorMessage };
    } finally {
      setProcessing(false);
    }
  };

  return {
    initializePayment,
    processing
  };
};
