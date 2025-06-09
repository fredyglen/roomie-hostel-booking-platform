
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { initializePaystackPayment } from '@/lib/paystack-config';
import { verifyPaystackPayment } from '@/utils/paystack-verification';
import { handlePaystackError, debugPaystackConfig } from '@/utils/paystack-errors';
import { formatCurrency } from '@/utils/currency';
import { PaystackVerificationData } from '@/utils/paystack-verification';
import { Loader2, CreditCard, Smartphone, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ErrorHandler } from '@/utils/ErrorHandler';
import { ModernPaymentSuccessResult, MinimalPaystackTransaction } from '@/types/booking';

interface ModernPaystackPaymentProps {
  amount: number; // Amount in GHS
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  metadata?: Record<string, unknown>;
  onSuccess: (verificationResult: ModernPaymentSuccessResult) => void;
  onError?: (error: string) => void;
  title?: string;
  description?: string;
}

export const ModernPaystackPayment: React.FC<ModernPaystackPaymentProps> = ({
  amount,
  email,
  firstName = '',
  lastName = '',
  phone = '',
  metadata = {},
  onSuccess,
  onError,
  title = 'Complete Payment',
  description = 'Secure payment processing'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile_money' | 'bank'>('card');
  const [mobileNetwork, setMobileNetwork] = useState<'mtn' | 'vodafone' | 'airtel'>('mtn');
  const [customerPhone, setCustomerPhone] = useState(phone);
  const [customerEmail, setCustomerEmail] = useState(email);
  const [customerFirstName, setCustomerFirstName] = useState(firstName);
  const [customerLastName, setCustomerLastName] = useState(lastName);
  
  const { toast } = useToast();

  const handlePayment = async () => {
    // Debug configuration
    debugPaystackConfig();
    
    try {
      setIsLoading(true);
      
      // Validate required fields
      if (!customerEmail || !amount) {
        throw new Error('Email and amount are required');
      }
      
      if (amount < 1) {
        throw new Error('Minimum payment amount is GH₵1.00');
      }

      // Validate mobile money requirements
      if (paymentMethod === 'mobile_money' && !customerPhone) {
        throw new Error('Phone number is required for mobile money payments');
      }
      
      const paymentReference = `ROOMI_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      const paymentData = {
        email: customerEmail,
        amount: amount,
        firstName: customerFirstName,
        lastName: customerLastName,
        phone: customerPhone,
        reference: paymentReference,
        metadata: {
          ...metadata,
          payment_method: paymentMethod,
          mobile_network: paymentMethod === 'mobile_money' ? mobileNetwork : undefined,
        },
        onSuccess: async (transaction: any) => {
          ErrorHandler.log('Payment successful:', JSON.stringify(transaction));
          
          try {
            // Verify the payment
            const verification = await verifyPaystackPayment(transaction.reference);
            
            if (verification.success) {
              toast({
                title: "Payment Successful",
                description: `Payment of ${formatCurrency(verification.amount || amount)} completed successfully.`,
              });
              
              const result: ModernPaymentSuccessResult = {
                reference: transaction.reference,
                amount: verification.amount,
                status: 'success',
                transaction: {
                  reference: transaction.reference,
                  amount: verification.amount || amount,
                  status: 'success'
                },
                verification: verification.data
              };
              
              onSuccess(result);
            } else {
              throw new Error(verification.message || 'Payment verification failed');
            }
          } catch (verificationError) {
            ErrorHandler.log('Payment verification failed:', verificationError);
            toast({
              title: "Payment Verification Failed",
              description: "Payment completed but verification failed. Please contact support.",
              variant: "destructive"
            });
            if (onError) {
              onError('Payment verification failed');
            }
          } finally {
            setIsLoading(false);
          }
        },
        onCancel: () => {
          ErrorHandler.log('Payment cancelled by user');
          setIsLoading(false);
          toast({
            title: "Payment Cancelled",
            description: "Your payment was cancelled.",
            variant: "destructive"
          });
          if (onError) {
            onError('Payment was cancelled');
          }
        },
        onClose: () => {
          ErrorHandler.log('Payment window closed');
          setIsLoading(false);
        }
      };

      const paymentDataWithCurrency = {
        ...paymentData,
        currency: 'GHS' // Adding required currency field
      };

      await initializePaystackPayment(paymentDataWithCurrency);
      
    } catch (error) {
      ErrorHandler.log('Payment initialization error:', error);
      const errorMessage = handlePaystackError(error);
      setIsLoading(false);
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive"
      });
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  const isFormValid = () => {
    if (!customerEmail || !amount) return false;
    if (paymentMethod === 'mobile_money' && !customerPhone) return false;
    return true;
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>{title}</span>
        </CardTitle>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Amount Display */}
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600">Amount to Pay</p>
          <p className="text-2xl font-bold text-[#9b87f5]">{formatCurrency(amount)}</p>
        </div>

        {/* Customer Information */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={customerFirstName}
              onChange={(e) => setCustomerFirstName(e.target.value)}
              placeholder="John"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={customerLastName}
              onChange={(e) => setCustomerLastName(e.target.value)}
              placeholder="Doe"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="john@student.edu.gh"
            required
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="0551234567"
            required={paymentMethod === 'mobile_money'}
          />
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-3">
          <Label>Payment Method</Label>
          
          <div className="grid gap-2">
            <div 
              className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${paymentMethod === 'card' ? 'border-[#9b87f5] bg-purple-50' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              <input 
                type="radio" 
                checked={paymentMethod === 'card'} 
                onChange={() => setPaymentMethod('card')}
                className="text-[#9b87f5]"
              />
              <CreditCard className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Card Payment</p>
                <p className="text-xs text-gray-500">Visa, Mastercard, Verve</p>
              </div>
            </div>

            <div 
              className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${paymentMethod === 'mobile_money' ? 'border-[#9b87f5] bg-purple-50' : ''}`}
              onClick={() => setPaymentMethod('mobile_money')}
            >
              <input 
                type="radio" 
                checked={paymentMethod === 'mobile_money'} 
                onChange={() => setPaymentMethod('mobile_money')}
                className="text-[#9b87f5]"
              />
              <Smartphone className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Mobile Money</p>
                <p className="text-xs text-gray-500">MTN, Vodafone, AirtelTigo</p>
              </div>
            </div>

            <div 
              className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${paymentMethod === 'bank' ? 'border-[#9b87f5] bg-purple-50' : ''}`}
              onClick={() => setPaymentMethod('bank')}
            >
              <input 
                type="radio" 
                checked={paymentMethod === 'bank'} 
                onChange={() => setPaymentMethod('bank')}
                className="text-[#9b87f5]"
              />
              <Building2 className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium">Bank Transfer</p>
                <p className="text-xs text-gray-500">Direct bank transfer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Money Network Selection */}
        {paymentMethod === 'mobile_money' && (
          <div>
            <Label htmlFor="network">Mobile Money Provider</Label>
            <Select value={mobileNetwork} onValueChange={(value) => setMobileNetwork(value as 'mtn' | 'vodafone' | 'airtel')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mtn">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span>MTN Mobile Money</span>
                  </div>
                </SelectItem>
                <SelectItem value="vodafone">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-600" />
                    <span>Vodafone Cash</span>
                  </div>
                </SelectItem>
                <SelectItem value="airtel">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span>AirtelTigo Money</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Payment Button */}
        <Button 
          onClick={handlePayment}
          disabled={isLoading || !isFormValid()}
          className="w-full bg-[#9b87f5] hover:bg-[#8b77f0]"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Payment...
            </>
          ) : (
            `Pay ${formatCurrency(amount)}`
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Secure payment powered by Paystack. Your payment information is safe and encrypted.
        </p>
      </CardContent>
    </Card>
  );
};
