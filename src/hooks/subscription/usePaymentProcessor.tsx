
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePaystackIntegration } from '@/hooks/payment/usePaystackIntegration';
import { validatePaymentAmount } from '@/utils/paystackIntegration';

interface PaymentData {
  amount: number;
  email: string;
  phone?: string;
  method: 'card' | 'mobile_money' | 'bank';
  network?: 'mtn' | 'vodafone' | 'airtel';
  metadata?: Record<string, any>;
  split_code?: string;
  subaccount?: string;
}

export const usePaymentProcessor = () => {
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  const { processPayment: paystackProcess } = usePaystackIntegration();

  const processPayment = async (
    paymentData: PaymentData,
    onSuccess: (reference: any) => void,
    onError?: (error: any) => void
  ) => {
    if (!validatePaymentAmount(paymentData.amount)) {
      toast({
        title: "Invalid Amount",
        description: "Payment amount must be between ₵0.10 and ₵50,000",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);

    try {
      await paystackProcess(
        {
          amount: paymentData.amount,
          email: paymentData.email,
          method: paymentData.method,
          metadata: paymentData.metadata,
          split_code: paymentData.split_code,
          subaccount: paymentData.subaccount,
          ...(paymentData.method === 'mobile_money' && {
            mobileMoneyNetwork: paymentData.network,
            phoneNumber: paymentData.phone
          })
        },
        (reference) => {
          setProcessing(false);
          toast({
            title: "Payment Successful",
            description: `Payment of ₵${paymentData.amount} completed successfully.`,
          });
          onSuccess(reference);
        },
        (error) => {
          setProcessing(false);
          toast({
            title: "Payment Failed",
            description: error.message || "Payment failed. Please try again.",
            variant: "destructive"
          });
          if (onError) onError(error);
        }
      );
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

  return {
    processPayment,
    processing
  };
};
