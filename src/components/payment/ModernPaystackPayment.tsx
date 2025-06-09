
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { handlePaystackError } from '@/utils/paystack-errors';
import { ModernPaymentSuccessResult, PaystackVerificationData } from '@/types/booking';

interface PaystackPop {
  setup: (config: any) => {
    openIframe: () => void;
  };
}

declare global {
  interface Window {
    PaystackPop?: PaystackPop;
  }
}

interface ModernPaystackPaymentProps {
  amount: number;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  onSuccess: (result: ModernPaymentSuccessResult) => void;
  onError: (error: string) => void;
  title?: string;
  description?: string;
  disabled?: boolean;
}

interface MinimalPaystackTransaction {
  reference: string;
  amount: number;
  status: string;
}

export const ModernPaystackPayment: React.FC<ModernPaystackPaymentProps> = ({
  amount,
  email,
  firstName = '',
  lastName = '',
  phone = '',
  onSuccess,
  onError,
  title = 'Complete Payment',
  description = 'Secure payment processing',
  disabled = false
}) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  // Load Paystack script
  useEffect(() => {
    if (window.PaystackPop) {
      setPaystackLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => setPaystackLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Paystack script');
      onError('Failed to load payment system');
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [onError]);

  const handlePayment = () => {
    if (!paystackLoaded || !window.PaystackPop) {
      onError('Payment system not ready. Please try again.');
      return;
    }

    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      onError('Payment configuration error. Please contact support.');
      return;
    }

    setIsProcessing(true);

    try {
      const reference = `ref_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      
      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: email,
        amount: amount * 100, // Paystack expects amount in pesewas
        currency: 'GHS',
        ref: reference,
        firstname: firstName,
        lastname: lastName,
        phone: phone,
        metadata: {
          firstName,
          lastName,
          phone
        },
        callback: function(response: any) {
          setIsProcessing(false);
          
          const verification: PaystackVerificationData = {
            amount: amount,
            reference: response.reference,
            channel: response.channel || 'unknown',
            id: response.id,
            customer: response.customer || {}
          };

          const result: ModernPaymentSuccessResult = {
            reference: response.reference,
            status: response.status || 'success',
            transaction: {
              reference: response.reference,
              amount: amount,
              status: response.status || 'success'
            },
            verification
          };
          
          onSuccess(result);
        },
        onClose: function() {
          setIsProcessing(false);
          toast({
            title: "Payment Cancelled",
            description: "You cancelled the payment process.",
            variant: "destructive"
          });
        }
      });

      handler.openIframe();
    } catch (error) {
      setIsProcessing(false);
      const errorMessage = handlePaystackError(error);
      onError(errorMessage);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600">{description}</p>
        <p className="text-2xl font-bold text-green-600">GH₵{amount.toFixed(2)}</p>
      </div>
      
      <Button
        onClick={handlePayment}
        disabled={disabled || isProcessing || !paystackLoaded}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
        size="lg"
      >
        {isProcessing ? 'Processing...' : `Pay GH₵${amount.toFixed(2)}`}
      </Button>
      
      {!paystackLoaded && (
        <p className="text-sm text-gray-500 text-center">Loading payment system...</p>
      )}
    </div>
  );
};
