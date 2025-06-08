import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePaystackIntegration } from '@/hooks/payment/usePaystackIntegration';
import { getMobileMoneyProviders } from '@/utils/paystackIntegration';
import { formatCurrency } from '@/utils/currency';
import { Loader2, CreditCard, Smartphone, Building2 } from 'lucide-react';
import { ErrorHandler } from '@/utils/ErrorHandler';

interface PaystackPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (reference: string) => void;
  amount: number;
  email: string;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  split_code?: string;
  subaccount?: string;
}

const PaystackPaymentModal: React.FC<PaystackPaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  amount,
  email,
  title,
  description,
  metadata,
  split_code,
  subaccount
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile_money' | 'bank'>('card');
  const [mobileMoneyNetwork, setMobileMoneyNetwork] = useState<'mtn' | 'vodafone' | 'airtel'>('mtn');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const { processPayment, processing } = usePaystackIntegration();
  const mobileMoneyProviders = getMobileMoneyProviders();

  // Load Paystack script
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.PaystackPop) {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v2/inline.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handlePayment = async () => {
    const paymentData = {
      amount,
      email,
      method: paymentMethod,
      metadata,
      split_code,
      subaccount,
      ...(paymentMethod === 'mobile_money' && {
        mobileMoneyNetwork,
        phoneNumber
      })
    };

    await processPayment(
      paymentData,
      (reference) => {
        onSuccess(reference);
        onClose();
      },
      (error) => {
        ErrorHandler.handle(error, 'PaystackPaymentModal payment error');
      }
    );
  };

  const isFormValid = () => {
    if (paymentMethod === 'mobile_money') {
      return phoneNumber.length >= 10;
    }
    return true;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </DialogHeader>

        <div className="space-y-6">
          {/* Amount Display */}
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">Amount to Pay</p>
            <p className="text-2xl font-bold text-[#9b87f5]">{formatCurrency(amount)}</p>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Select Payment Method</Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as 'card' | 'mobile_money' | 'bank')}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="card" id="card" />
                <CreditCard className="h-5 w-5 text-blue-600" />
                <Label htmlFor="card" className="flex-1">
                  <div>
                    <p className="font-medium">Card Payment</p>
                    <p className="text-xs text-gray-500">Visa, Mastercard, Verve</p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="mobile_money" id="mobile_money" />
                <Smartphone className="h-5 w-5 text-green-600" />
                <Label htmlFor="mobile_money" className="flex-1">
                  <div>
                    <p className="font-medium">Mobile Money</p>
                    <p className="text-xs text-gray-500">MTN, Vodafone, AirtelTigo</p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="bank" id="bank" />
                <Building2 className="h-5 w-5 text-purple-600" />
                <Label htmlFor="bank" className="flex-1">
                  <div>
                    <p className="font-medium">Bank Transfer</p>
                    <p className="text-xs text-gray-500">Direct bank transfer</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Mobile Money Configuration */}
          {paymentMethod === 'mobile_money' && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="network" className="text-sm font-medium">Mobile Money Provider</Label>
                <Select value={mobileMoneyNetwork} onValueChange={(value) => setMobileMoneyNetwork(value as 'mtn' | 'vodafone' | 'airtel')}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mobileMoneyProviders.map((provider) => (
                      <SelectItem key={provider.code} value={provider.code}>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: provider.color }}
                          />
                          <span>{provider.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0551234567"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter your mobile money registered number
                </p>
              </div>
            </div>
          )}

          {/* Payment Button */}
          <Button 
            onClick={handlePayment}
            disabled={processing || !isFormValid()}
            className="w-full bg-[#9b87f5] hover:bg-[#8b77f0]"
          >
            {processing ? (
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaystackPaymentModal;
