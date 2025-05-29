
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { 
  calculatePaymentDistribution, 
  createBookingWithPayment,
  BOOKING_PACKAGES 
} from '@/utils/paymentSplitting';

interface PaymentFlowData {
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

export const useBusinessPaymentFlow = () => {
  const [processing, setProcessing] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const { toast } = useToast();

  const initializePayment = async (paymentData: PaymentFlowData) => {
    setProcessing(true);
    
    try {
      console.log('Initializing payment flow for package:', paymentData.packageType);
      
      // Create booking record first
      const { booking, distribution } = await createBookingWithPayment(paymentData);
      
      console.log('Created booking:', booking.id);
      console.log('Payment distribution:', distribution);

      // Initialize payment with Paystack
      const { data: paymentInit, error: paymentError } = await supabase.functions.invoke('initialize-payment', {
        body: {
          email: paymentData.studentEmail,
          amount: BOOKING_PACKAGES[paymentData.packageType].totalPrice,
          currency: 'GHS',
          metadata: {
            booking_id: booking.id,
            property_id: paymentData.propertyId,
            student_id: paymentData.studentId,
            property_owner_id: paymentData.propertyOwnerId,
            agent_id: paymentData.agentId,
            package_type: paymentData.packageType,
            payment_distribution: distribution,
            ...paymentData.metadata
          },
          channels: ['card', 'mobile_money', 'bank']
        }
      });

      if (paymentError) {
        throw new Error(paymentError.message || 'Payment initialization failed');
      }

      if (!paymentInit.status) {
        throw new Error(paymentInit.message || 'Payment initialization failed');
      }

      // Update booking with payment reference
      await supabase
        .from('bookings_enhanced')
        .update({ 
          payment_reference: paymentInit.data.reference,
          paystack_access_code: paymentInit.data.access_code 
        })
        .eq('id', booking.id);

      console.log('Payment initialized successfully:', paymentInit.data.reference);
      
      return {
        success: true,
        booking,
        paymentData: paymentInit.data
      };

    } catch (error) {
      console.error('Payment initialization error:', error);
      toast({
        title: "Payment Initialization Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      setProcessing(false);
    }
  };

  const verifyAndProcessPayment = async (reference: string) => {
    setVerifying(true);
    
    try {
      console.log('Verifying payment:', reference);
      
      // Verify payment with our edge function
      const { data: verification, error: verifyError } = await supabase.functions.invoke('verify-payment', {
        body: { reference }
      });

      if (verifyError) {
        throw new Error(verifyError.message || 'Payment verification failed');
      }

      if (!verification.status) {
        throw new Error(verification.message || 'Payment verification failed');
      }

      console.log('Payment verified successfully:', verification.data);

      // Get the booking to process payment distribution
      const { data: booking, error: bookingError } = await supabase
        .from('bookings_enhanced')
        .select('*')
        .eq('payment_reference', reference)
        .single();

      if (bookingError || !booking) {
        throw new Error('Booking not found');
      }

      // Process payment splitting
      await processPaymentSplitting(booking, verification.data);

      toast({
        title: "Payment Successful",
        description: `Your booking has been confirmed. Reference: ${reference}`,
      });

      return {
        success: true,
        verification: verification.data,
        booking
      };

    } catch (error) {
      console.error('Payment verification error:', error);
      toast({
        title: "Payment Verification Failed",
        description: error instanceof Error ? error.message : "Please contact support",
        variant: "destructive"
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Verification failed'
      };
    } finally {
      setVerifying(false);
    }
  };

  const processPaymentSplitting = async (booking: any, paymentData: any) => {
    try {
      console.log('Processing payment splitting for booking:', booking.id);
      
      const distribution = calculatePaymentDistribution(
        booking.package_type,
        booking.property_owner_id,
        booking.agent_id
      );

      // Create payment distribution record
      const { error: distributionError } = await supabase
        .from('payment_distributions')
        .insert({
          booking_id: booking.id,
          payment_reference: booking.payment_reference,
          property_owner_id: booking.property_owner_id,
          agent_id: booking.agent_id,
          property_owner_amount: distribution.propertyOwnerAmount,
          agent_amount: distribution.agentAmount,
          platform_amount: distribution.platformAmount,
          paystack_fees: distribution.paystackFees,
          platform_net: distribution.platformNet,
          status: 'pending_distribution',
          total_amount: booking.total_price
        });

      if (distributionError) {
        console.error('Error creating payment distribution:', distributionError);
        throw distributionError;
      }

      // Update booking status
      await supabase
        .from('bookings_enhanced')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .eq('id', booking.id);

      console.log('Payment splitting processed successfully');

    } catch (error) {
      console.error('Payment splitting error:', error);
      throw error;
    }
  };

  return {
    initializePayment,
    verifyAndProcessPayment,
    processing,
    verifying
  };
};
