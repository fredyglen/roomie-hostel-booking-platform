
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { handlePaystackError } from '@/utils/paystack-errors';
import { ModernPaymentSuccessResult, PaystackVerificationData } from '@/types/booking';

declare global {
  interface Window {
    PaystackPop?: {
      new(): {
        newTransaction(config: PaystackConfig): void;
      };
    };
  }
}

interface PaystackConfig {
  key: string;
  email: string;
  amount: number;
  currency: string;
  ref: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  channels?: string[];
  metadata?: Record<string, unknown>;
  onSuccess: (transaction: PaystackTransaction) => void;
  onCancel: () => void;
  onError: (error: unknown) => void;
  split_code?: string;
  split?: SplitPaymentConfig;
  subaccount?: string;
  bearer?: string;
  transaction_charge?: number;
}

interface PaystackTransaction {
  reference: string;
  transaction?: string;
  trans?: string;
  channel?: string;
  customer?: Record<string, unknown>;
  status: string;
}

interface SplitPaymentConfig {
  type: 'percentage' | 'flat';
  bearer_type: 'all' | 'all-proportional' | 'account' | 'subaccount';
  subaccounts: Array<{
    subaccount: string;
    share: number;
  }>;
  bearer_subaccount?: string;
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
  reference?: string;
  // Optional metadata to be attached to Paystack transaction
  metadata?: Record<string, unknown>;
  // New split payment support
  splitCode?: string;
  split?: SplitPaymentConfig;
  subaccountCode?: string;
  bearer?: 'account' | 'subaccount';
  transactionCharge?: number;
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
  disabled = false,
  reference,
  metadata = {},
  splitCode,
  split,
  subaccountCode,
  bearer = 'account',
  transactionCharge
}) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  // Load Paystack InlineJS V2 script
  useEffect(() => {
    if (window.PaystackPop) {
      setPaystackLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v2/inline.js'; // Updated to V2
    script.async = true;
    script.onload = () => setPaystackLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Paystack V2 script');
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
      const refToUse = reference ?? `roomi_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

      // Create PaystackPop instance (V2 approach)
      const popup = new window.PaystackPop();

      // Build transaction configuration
      const transactionConfig: PaystackConfig = {
        key: publicKey,
        email: email,
        amount: amount * 100, // Paystack expects amount in pesewas (GHS subunit)
        currency: 'GHS',
        ref: refToUse,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        channels: ['mobile_money', 'bank', 'ussd', 'bank_transfer'], // Ghana payment channels (no cards)
        metadata: {
          ...metadata,
          firstName,
          lastName,
          phone,
          platform: 'ROOMi',
          payment_type: 'accommodation_booking'
        },
        onSuccess: (transaction: PaystackTransaction) => {
          setIsProcessing(false);

          const verification: PaystackVerificationData = {
            amount: amount,
            reference: transaction.reference,
            channel: transaction.channel || 'unknown',
            id: transaction.transaction || transaction.trans,
            customer: transaction.customer || {}
          };

          const result: ModernPaymentSuccessResult = {
            reference: transaction.reference,
            status: transaction.status || 'success',
            transaction: {
              reference: transaction.reference,
              amount: amount,
              status: transaction.status || 'success'
            },
            verification
          };

          onSuccess(result);
        },
        onCancel: () => {
          setIsProcessing(false);
          toast({
            title: "Payment Cancelled",
            description: "You cancelled the payment process.",
            variant: "destructive"
          });
        },
        onError: (error: unknown) => {
          setIsProcessing(false);
          const errorMessage = handlePaystackError(error);
          onError(errorMessage);
        }
      };

      // Add split payment configuration if provided
      if (splitCode) {
        transactionConfig.split_code = splitCode;
      } else if (split) {
        transactionConfig.split = split;
      } else if (subaccountCode) {
        transactionConfig.subaccount = subaccountCode;
        transactionConfig.bearer = bearer;
        if (transactionCharge) {
          transactionConfig.transactionCharge = transactionCharge;
        }
      }

      // Initialize transaction using V2 method
      popup.newTransaction(transactionConfig);

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

        {/* Show split payment indicator */}
        {(splitCode || split || subaccountCode) && (
          <div className="bg-blue-50 p-2 rounded-lg">
            <p className="text-xs text-blue-700">
              ✓ Automatic payment distribution enabled
            </p>
          </div>
        )}
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
        <p className="text-sm text-gray-500 text-center">Loading payment system (V2)...</p>
      )}

      {/* Payment methods info for Ghana */}
      <div className="text-xs text-gray-500 text-center space-y-1">
        <p>Secure payment via Paystack</p>
        <p>Supports: Mobile Money • Bank Transfer</p>
        <p>Networks: MTN • Vodafone • AirtelTigo</p>
      </div>
    </div>
  );
};
