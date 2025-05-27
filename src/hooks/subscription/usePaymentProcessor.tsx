
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  initializePaystackPayment, 
  initializeMobileMoneyPayment, 
  generatePaymentReference,
  convertToPesewas,
  validatePaymentAmount
} from '@/utils/paystackIntegration';

interface PaymentData {
  amount: number;
  email: string;
  phone?: string;
  method: 'card' | 'momo';
  network?: 'mtn' | 'vodafone' | 'airtel';
  metadata?: Record<string, any>;
}

export const usePaymentProcessor = () => {
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const processPayment = async (
    paymentData: PaymentData,
    onSuccess: (reference: any) => void,
    onError?: (error: any) => void
  ) => {
    if (!validatePaymentAmount(paymentData.amount)) {
      toast({
        title: "Invalid Amount",
        description: "Payment amount must be between ₵1 and ₵10,000",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    const paymentRef = generatePaymentReference();

    try {
      if (paymentData.method === 'card') {
        initializePaystackPayment({
          publicKey: 'pk_test_placeholder', // Replace with actual Paystack public key
          amount: convertToPesewas(paymentData.amount),
          email: paymentData.email,
          currency: 'GHS',
          ref: paymentRef,
          metadata: paymentData.metadata,
          onSuccess: (reference) => {
            setProcessing(false);
            toast({
              title: "Payment Successful",
              description: `Payment of ₵${paymentData.amount} completed successfully.`,
            });
            onSuccess(reference);
          },
          onCancel: () => {
            setProcessing(false);
            toast({
              title: "Payment Cancelled",
              description: "Your payment was cancelled.",
              variant: "destructive"
            });
            if (onError) {
              onError({ message: 'Payment cancelled by user', code: 'CANCELLED' });
            }
          }
        });
      } else if (paymentData.method === 'momo' && paymentData.phone && paymentData.network) {
        initializeMobileMoneyPayment({
          amount: paymentData.amount,
          phoneNumber: paymentData.phone,
          network: paymentData.network,
          email: paymentData.email,
          ref: paymentRef,
          onSuccess: (reference) => {
            setProcessing(false);
            toast({
              title: "Payment Successful",
              description: `Mobile Money payment of ₵${paymentData.amount} completed successfully.`,
            });
            onSuccess(reference);
          },
          onError: (error) => {
            setProcessing(false);
            toast({
              title: "Payment Failed",
              description: error.message || "Mobile Money payment failed. Please try again.",
              variant: "destructive"
            });
            if (onError) {
              onError(error);
            }
          }
        });
      } else {
        throw new Error('Invalid payment method or missing required fields');
      }
    } catch (error) {
      setProcessing(false);
      toast({
        title: "Payment Error",
        description: "An error occurred while processing your payment.",
        variant: "destructive"
      });
      if (onError) {
        onError(error);
      }
    }
  };

  return {
    processPayment,
    processing
  };
};
