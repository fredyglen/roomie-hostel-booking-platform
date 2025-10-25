import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PaystackService, PaystackTransactionInitParams } from '@/services/payment/PaystackService';
import { ErrorHandler } from '@/utils/ErrorHandler';
import { logger } from '@/utils/enhanced-logger';
import { enhancedPaystackService } from '@/services/enhanced-paystack.service';

interface UsePaystackOptions {
  onSuccess?: (reference: string) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
}

interface PaystackPaymentOptions extends Omit<PaystackTransactionInitParams, 'reference'> {
  reference?: string;
  description?: string;
}

export function usePaystack(options: UsePaystackOptions = {}) {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [transactionRef, setTransactionRef] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize payment
  const initializePayment = useCallback(async (paymentOptions: PaystackPaymentOptions) => {
    try {
      setIsInitializing(true);
      
      // Validate amount
      if (!PaystackService.validatePaymentAmount(paymentOptions.amount)) {
        throw new Error('Invalid payment amount. Amount must be between ₵1 and ₵50,000');
      }
      
      // Generate reference if not provided
      const reference = paymentOptions.reference || PaystackService.generateReference();
      
      // Prepare enriched metadata using enhancedPaystackService (does not alter amount)
      let enrichedMetadata = paymentOptions.metadata ?? {};
      try {
        const base = (enrichedMetadata as any)?.base_amount_ghs as number | undefined;
        const hasBreakdown = Boolean((enrichedMetadata as any)?.commission_breakdown);
        if (base && !hasBreakdown) {
          const includeAgent = Number((enrichedMetadata as any)?.agent_fee_ghs) > 0;
          const prepared = enhancedPaystackService.preparePaymentData(
            paymentOptions.email,
            base,
            reference,
            includeAgent,
            enrichedMetadata
          );
          enrichedMetadata = prepared.metadata ?? enrichedMetadata;
        }
      } catch (e) {
        logger.warn('Enhanced Paystack preparation skipped', { error: String(e) });
      }

      // Initialize transaction (keep caller-provided amount to avoid UI mismatch)
      const response = await PaystackService.initializeTransaction({
        ...paymentOptions,
        metadata: enrichedMetadata,
        reference
      });

      setTransactionRef(reference);

      // Open Paystack checkout in new window
      window.open(response.data.authorization_url, '_blank');

      toast({
        title: "Payment Initiated",
        description: "Please complete your payment in the new window.",
      });
      
      return response.data;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      ErrorHandler.handle(err, 'Payment initialization failed');
      
      toast({
        title: "Payment Failed",
        description: "Could not initialize payment. Please try again.",
        variant: "destructive"
      });
      
      if (options.onError) {
        options.onError(err);
      }
      
      throw err;
    } finally {
      setIsInitializing(false);
    }
  }, [toast, options.onError]);
  
  // Verify payment
  const verifyPayment = useCallback(async (reference: string) => {
    try {
      setIsVerifying(true);
      
      const response = await PaystackService.verifyTransaction(reference);
      
      if (response.data.status === 'success') {
        toast({
          title: "Payment Successful",
          description: `Your payment of ₵${response.data.amount / 100} was successful.`,
        });
        
        if (options.onSuccess) {
          options.onSuccess(reference);
        }
      } else {
        toast({
          title: "Payment Incomplete",
          description: "Your payment has not been completed. Please try again.",
          variant: "destructive"
        });
        
        if (options.onError) {
          options.onError(new Error('Payment verification failed'));
        }
      }
      
      return response.data;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      ErrorHandler.handle(err, 'Payment verification failed');
      
      toast({
        title: "Verification Failed",
        description: "Could not verify your payment. Please contact support.",
        variant: "destructive"
      });
      
      if (options.onError) {
        options.onError(err);
      }
      
      throw err;
    } finally {
      setIsVerifying(false);
    }
  }, [toast, options.onSuccess, options.onError]);
  
  return {
    initializePayment,
    verifyPayment,
    isInitializing,
    isVerifying,
    transactionRef
  };
}