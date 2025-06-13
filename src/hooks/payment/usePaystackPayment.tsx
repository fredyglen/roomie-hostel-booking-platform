import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  initializePaystackPayment,
  verifyPayment,
  validatePaymentAmount,
  generatePaymentReference
} from '@/utils/paystackIntegration';
import { useStandardizedErrorHandler } from '@/hooks/common/useStandardizedErrorHandler';
import { PaymentService } from '@/services/payment-service';
import { useAuth } from '@/context/EnhancedAuthContext';
import type { PaymentData, PaymentTransaction, PaymentMethod } from '@/types/payment';

interface UsePaystackPaymentReturn {
  initiatePayment: (data: Omit<PaymentData, 'reference' | 'onSuccess' | 'onCancel'> & {
    description: string;
    metadata?: Record<string, unknown>;
  }) => void;
  verifyTransaction: (reference: string) => Promise<PaymentTransaction | null>;
  isProcessing: boolean;
  transaction: PaymentTransaction | null;
}

export const usePaystackPayment = (): UsePaystackPaymentReturn => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [transaction, setTransaction] = useState<PaymentTransaction | null>(null);
  const { toast } = useToast();
  const { handleError } = useStandardizedErrorHandler();
  const { user } = useAuth();

  const initiatePayment = useCallback(async (
    data: Omit<PaymentData, 'reference' | 'onSuccess' | 'onCancel'> & {
      description: string;
      metadata?: Record<string, unknown>;
    }
  ) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to make a payment.",
        variant: "destructive"
      });
      return;
    }

    if (!validatePaymentAmount(data.amount)) {
      toast({
        title: "Invalid Amount",
        description: "Payment amount must be between ₵0.10 and ₵50,000.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Generate a unique reference
      const reference = generatePaymentReference();

      // Create payment record in database
      const paymentRecord = await PaymentService.createPaymentRecord({
        userId: user.id,
        amount: data.amount,
        reference,
        description: data.description,
        metadata: data.metadata
      });

      if (!paymentRecord) {
        throw new Error("Failed to create payment record");
      }

      // Initialize Paystack payment
      initializePaystackPayment({
        email: data.email,
        amount: data.amount,
        reference,
        metadata: data.metadata,
        onSuccess: async (transaction) => {
          setTransaction(transaction);
          setIsProcessing(false);

          // Update payment status in database
          await PaymentService.updatePaymentStatus({
            reference: transaction.reference,
            status: 'success',
            transactionId: transaction.id?.toString(),
            paymentDate: transaction.transaction_date
          });

          toast({
            title: "Payment Successful",
            description: `Your payment of ₵${data.amount} was successful.`,
          });
        },
        onCancel: () => {
          setIsProcessing(false);
          toast({
            title: "Payment Cancelled",
            description: "You cancelled the payment process.",
          });
        }
      });
    } catch (error) {
      setIsProcessing(false);
      handleError(error, "Payment initialization failed");
    }
  }, [user, toast, handleError]);

  const verifyTransaction = useCallback(async (reference: string): Promise<PaymentTransaction | null> => {
    try {
      setIsProcessing(true);
      const transaction = await verifyPayment(reference);
      setTransaction(transaction);
      return transaction;
    } catch (error) {
      handleError(error, "Payment verification failed");
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [handleError]);

  return {
    initiatePayment,
    verifyTransaction,
    isProcessing,
    transaction
  };
};
