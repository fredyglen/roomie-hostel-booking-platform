
import { useState } from 'react';

interface PaymentInfo {
  method: string;
  momoNumber: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  isProcessing: boolean;
  isComplete: boolean;
}

export const usePaymentForm = (initialData?: Partial<PaymentInfo>) => {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: initialData?.method || '',
    momoNumber: initialData?.momoNumber || '',
    cardNumber: initialData?.cardNumber || '',
    cardExpiry: initialData?.cardExpiry || '',
    cardCvc: initialData?.cardCvc || '',
    isProcessing: initialData?.isProcessing || false,
    isComplete: initialData?.isComplete || false
  });

  const handlePaymentInfoChange = (name: string, value: string) => {
    setPaymentInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return {
    paymentInfo,
    setPaymentInfo,
    handlePaymentInfoChange
  };
};
