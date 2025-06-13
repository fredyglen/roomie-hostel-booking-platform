import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  initializePaystackPayment,
  verifyPayment,
  validatePaymentAmount,
  generatePaymentReference
} from '@/utils/paystackIntegration';
import { useStandardizedErrorHandler } from '@/hooks/common/useStandardizedErrorHandler';
import type { PaymentData, PaymentTransaction } from '@/types/payment';

interface UsePaystackPaymentReturn {
  initiatePayment: (data: Omit<PaymentData, 'reference' | 'onSuccess' | 'onCancel'>) => void;
  verifyTransaction: (reference: string) => Promise<PaymentTransaction | null>;
  isProcessing: boolean;
  transaction: PaymentTransaction | null;
}

export const usePaystackPayment = (): UsePaystackPaymentReturn => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [transaction, setTransaction] = useState<PaymentTransaction | null>(null);
  const { toast } = useToast();
  const handleError = useStandardizedErrorHandler();

  const initiatePayment = (