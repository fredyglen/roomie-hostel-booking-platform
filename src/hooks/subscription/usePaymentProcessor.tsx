import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePaystackIntegration } from '@/hooks/payment/usePaystackIntegration';
import { validatePaymentAmount } from '@/utils/paystackIntegration';
import { ErrorHandler } from '@/utils/ErrorHandler';
import { useStandardizedErrorHandler } from '@/hooks/common/useStandardizedErrorHandler';

interface PaymentData {
  amount: number;
  email: string;
  phone?: string;
  method: 'card' | 'mobile_money' | 'bank';
  network?: 'mtn' | 'vodafone' | 'airtel';
  metadata?: Record<string, unknown>;
  split_code?: string;
  subaccount?: string;
}

export const usePaymentProcessor = () => {
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  const { processPayment: paystackProcess } = usePaystackIntegration();
  const { handleError } = useStandardizedErrorHandler();

  const processPayment = async (
    paymentData: PaymentData,
    onSuccess: (reference: string) => void,
    onError?: (error: unknown) => void
  ) => {
    if (!validatePaymentAmount(paymentData.amount)) {
      handleError(new Error("Payment amount must be between ₵0.10 and ₵50,000"), "Invalid payment amount");
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
          if (onError) onError(error);
        }
      );
    } catch (error) {
      setProcessing(false);
      ErrorHandler.handle(error, 'usePaymentProcessor payment processing error');
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
