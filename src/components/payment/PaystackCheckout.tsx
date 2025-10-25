import React, { useState } from 'react';
import { usePaystack } from '@/hooks/payment/usePaystack';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ErrorHandler } from '@/utils/ErrorHandler';
import { centralizedCommissionEngine } from '@/config/centralized-commission.config';

interface PaystackCheckoutProps {
  amount: number;
  email: string;
  description?: string;
  metadata?: Record<string, unknown>;
  onSuccess?: (reference: string) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
  buttonText?: string;
  className?: string;
}

export function PaystackCheckout({
  amount,
  email,
  description = 'Payment for services',
  metadata = {},
  onSuccess,
  onError,
  onCancel,
  buttonText = 'Pay Now',
  className
}: PaystackCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { initializePayment, verifyPayment } = usePaystack({
    onSuccess: (reference) => {
      setIsLoading(false);
      if (onSuccess) onSuccess(reference);
    },
    onError: (error) => {
      setIsLoading(false);
      if (onError) onError(error);
    },
    onCancel: () => {
      setIsLoading(false);
      if (onCancel) onCancel();
    }
  });

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      
      // Initialize payment
      const paymentData = await initializePayment({
        email,
        amount,
        description,
        metadata: {
          ...metadata,
          description,
          base_amount_ghs: (metadata as any)?.base_amount_ghs ?? amount,
          commission_version: centralizedCommissionEngine.getConfigurationInfo().version
        }
      });

      // Set up verification check
      // In a real app, you'd handle this via webhook or callback URL
      // This is a simplified approach for demo purposes
      const checkInterval = setInterval(async () => {
        try {
          if (!paymentData.reference) return;
          
          const result = await verifyPayment(paymentData.reference);
          
          if (result.status === 'success') {
            clearInterval(checkInterval);
          }
        } catch (error) {
          clearInterval(checkInterval);
          ErrorHandler.handle(error, 'Payment verification failed');
        }
      }, 5000);
      
      // Clear interval after 10 minutes (maximum wait time)
      setTimeout(() => {
        clearInterval(checkInterval);
      }, 10 * 60 * 1000);
      
    } catch (error) {
      setIsLoading(false);
      ErrorHandler.handle(error, 'Payment process failed');
      
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Complete Your Payment</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} disabled />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="flex items-center">
              <span className="mr-2 text-sm font-medium">₵</span>
              <Input id="amount" type="text" value={amount.toFixed(2)} disabled />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Processing...' : 'Pay Now'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaystackCheckout;