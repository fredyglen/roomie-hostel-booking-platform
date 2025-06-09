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
import { useStandardizedErrorHandler } from '@/hooks/common/useStandardizedErrorHandler';

interface PaymentData {
  amount: number;
  email: string;
  metadata?: Record<string, unknown>;
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
  const { handleError } = useStandardizedErrorHandler();

  const processPayment = async (
    paymentData: PaymentData,
    onSuccess: (reference: string) => void,
    onError?: (error: unknown) => void
  ) => {
    if (!validatePaymentAmount(paymentData.amount)) {
      handleError(new Error("Payment amount must be between ₵1 and ₵50,000"), "usePaystackIntegration: Invalid amount");
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
            handleError(error, "usePaystackIntegration: Mobile Money payment failed");
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
            handleError(new Error("Payment cancelled by user."), "usePaystackIntegration: Payment cancelled");
            if (onError) {
              onError({ message: 'Payment cancelled by user', code: 'CANCELLED' });
            }
          },
          onError: (error) => {
            setProcessing(false);
            handleError(error, "usePaystackIntegration: Card/Bank payment failed");
            if (onError) onError(error);
          }
        };

        await initializePaystackPayment(paystackConfig);
      }
    } catch (error) {
      setProcessing(false);
      handleError(error, "usePaystackIntegration: Payment processing failed");
      if (onError) {
        onError(error);
      }
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
      handleError(error, "usePaystackIntegration: Verification failed");
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
