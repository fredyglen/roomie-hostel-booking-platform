
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  initializePaystackPayment,
  initializeMobileMoneyPayment,
  verifyPayment,
  validatePaymentAmount,
  PaystackConfig,
  MobileMoneyConfig
} from '@/utils/paystackIntegration';

interface PaymentData {
  amount: number;
  email: string;
  metadata?: Record<string, any>;
  method: 'card' | 'mobile_money' | 'bank';
  mobileMoneyNetwork?: 'mtn' | 'vodafone' | 'airtel';
  phoneNumber?: string;
  split_code?: string;
  subaccount?: string;
}

export const usePaystackIntegration = () => {
  const [processing, setProcessing] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const { toast } = useToast();

  const processPayment = async (
    paymentData: PaymentData,
    onSuccess: (reference: any) => void,
    onError?: (error: any) => void
  ) => {
    if (!validatePaymentAmount(paymentData.amount)) {
      toast({
        title: "Invalid Amount",
        description: "Payment amount must be between ₵1 and ₵50,000",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);

    try {
      if (paymentData.method === 'mobile_money' && paymentData.phoneNumber && paymentData.mobileMoneyNetwork) {
        const mobileMoneyConfig: MobileMoneyConfig = {
          amount: paymentData.amount,
          phoneNumber: paymentData.phoneNumber,
          network: paymentData.mobileMoneyNetwork,
          email: paymentData.email,
          metadata: paymentData.metadata,
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
            if (onError) onError(error);
          }
        };
        
        await initializeMobileMoneyPayment(mobileMoneyConfig);
      } else {
        // Card or bank payment
        const paystackConfig: PaystackConfig = {
          email: paymentData.email,
          amount: paymentData.amount,
          currency: 'GHS',
          metadata: paymentData.metadata,
          channels: paymentData.method === 'card' ? ['card'] : ['bank'],
          split_code: paymentData.split_code,
          subaccount: paymentData.subaccount,
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
          },
          onError: (error) => {
            setProcessing(false);
            toast({
              title: "Payment Error",
              description: error.message || "An error occurred while processing your payment.",
              variant: "destructive"
            });
            if (onError) onError(error);
          }
        };

        await initializePaystackPayment(paystackConfig);
      }
    } catch (error) {
      setProcessing(false);
      toast({
        title: "Payment Error",
        description: "An error occurred while processing your payment.",
        variant: "destructive"
      });
      if (onError) onError(error);
    }
  };

  const verifyTransaction = async (reference: string) => {
    setVerifying(true);
    try {
      const result = await verifyPayment(reference);
      setVerifying(false);
      return result;
    } catch (error) {
      setVerifying(false);
      toast({
        title: "Verification Error",
        description: "Failed to verify payment status.",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    processPayment,
    verifyTransaction,
    processing,
    verifying
  };
};
