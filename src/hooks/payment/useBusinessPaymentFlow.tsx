
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { verifyPaystackPayment } from '@/utils/paystack-verification';
import { useToast } from '@/hooks/use-toast';

interface PaymentInitializationData {
  propertyId: string;
  studentId: string;
  propertyOwnerId: string;
  agentId: string;
  packageType: 'standard' | 'premium' | 'luxury';
  startDate: string;
  endDate: string;
  studentEmail: string;
  metadata?: any;
}

interface PaymentInitializationResult {
  success: boolean;
  booking?: any;
  paymentData?: any;
  error?: string;
}

export const useBusinessPaymentFlow = () => {
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const initializePayment = async (data: PaymentInitializationData): Promise<PaymentInitializationResult> => {
    setProcessing(true);
    
    try {
      console.log('Initializing business payment flow:', data);

      // Get package pricing (simplified for now)
      const packagePrices = {
        standard: 1200,
        premium: 1800,
        luxury: 2500
      };

      const totalAmount = packagePrices[data.packageType];

      // Create booking record first
      const { data: booking, error: bookingError } = await supabase
        .from('bookings_enhanced')
        .insert({
          property_id: data.propertyId,
          student_id: data.studentId,
          property_owner_id: data.propertyOwnerId,
          agent_id: data.agentId,
          start_date: data.startDate,
          end_date: data.endDate,
          total_amount: totalAmount,
          package_type: data.packageType,
          payment_status: 'pending',
          status: 'pending',
          metadata: data.metadata
        })
        .select()
        .single();

      if (bookingError) {
        console.error('Error creating booking:', bookingError);
        throw new Error('Failed to create booking');
      }

      // Initialize payment with Supabase Edge Function
      const { data: paymentInit, error: paymentError } = await supabase.functions.invoke('initialize-payment', {
        body: {
          email: data.studentEmail,
          amount: totalAmount,
          currency: 'GHS',
          metadata: {
            booking_id: booking.id,
            property_id: data.propertyId,
            student_id: data.studentId,
            property_owner_id: data.propertyOwnerId,
            agent_id: data.agentId,
            package_type: data.packageType,
            ...data.metadata
          }
        }
      });

      if (paymentError) {
        console.error('Payment initialization error:', paymentError);
        throw new Error('Failed to initialize payment');
      }

      return {
        success: true,
        booking,
        paymentData: paymentInit.data
      };

    } catch (error) {
      console.error('Business payment flow error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment initialization failed';
      
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive"
      });

      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setProcessing(false);
    }
  };

  const verifyAndProcessPayment = async (reference: string) => {
    try {
      console.log('Verifying and processing payment:', reference);
      
      const verification = await verifyPaystackPayment(reference);
      
      if (verification.success && verification.data) {
        // Update booking status
        const bookingId = verification.data.metadata?.booking_id;
        
        if (bookingId) {
          const { error: updateError } = await supabase
            .from('bookings_enhanced')
            .update({
              payment_status: 'paid',
              status: 'confirmed',
              transaction_reference: reference,
              paystack_reference: verification.data.id?.toString(),
              payment_method: verification.data.channel,
              updated_at: new Date().toISOString()
            })
            .eq('id', bookingId);

          if (updateError) {
            console.error('Error updating booking:', updateError);
          }
        }

        return {
          success: true,
          verification: verification.data,
          booking: bookingId ? { id: bookingId } : null
        };
      }

      return {
        success: false,
        error: verification.message || 'Payment verification failed'
      };

    } catch (error) {
      console.error('Payment verification error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Verification failed'
      };
    }
  };

  return {
    initializePayment,
    verifyAndProcessPayment,
    processing
  };
};
