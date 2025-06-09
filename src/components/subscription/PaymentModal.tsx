import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@iconify/react';
import { formatCurrency } from '@/utils/currency';
import { usePaymentProcessor } from '@/hooks/subscription/usePaymentProcessor';
import { SubscriptionTier } from '@/types/subscription';
import { ErrorHandler } from '@/utils/ErrorHandler';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: SubscriptionTier;
  onPaymentSuccess: () => void;
  isLoading?: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  tier,
  onPaymentSuccess,
  isLoading = false
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile_money'>('card');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    momoNumber: '',
    momoNetwork: 'mtn' as 'mtn' | 'vodafone' | 'airtel'
  });

  const { processPayment, processing } = usePaymentProcessor();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePayment = () => {
    const serviceFee = tier.price * 0.05;
    const totalAmount = tier.price + serviceFee;

    processPayment(
      {
        amount: totalAmount,
        email: formData.email,
        phone: paymentMethod === 'mobile_money' ? formData.momoNumber : undefined,
        method: paymentMethod === 'mobile_money' ? 'mobile_money' : 'card',
        network: paymentMethod === 'mobile_money' ? formData.momoNetwork : undefined,
        metadata: {
          tier_id: tier.id,
          tier_name: tier.name,
          billing_cycle: tier.billing_cycle
        }
      },
      (reference) => {
        ErrorHandler.log('Payment successful:', reference);
        onPaymentSuccess();
      },
      (error) => {
        ErrorHandler.handle('Payment failed:', error);
      }
    );
  };

  const serviceFee = tier.price * 0.05; // 5% service fee
  const totalAmount = tier.price + serviceFee;
  const isFormValid = formData.email && (
    paymentMethod === 'card' ? 
      formData.cardNumber && formData.expiryDate && formData.cvv :
      formData.momoNumber
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon icon="solar:card-bold" className="text-blue-600" />
            Complete Payment
          </DialogTitle>
          <DialogDescription>
            Upgrade to {tier.name} for {formatCurrency(tier.price)}/{tier.billing_cycle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Payment Method Selection */}
          <div className="flex space-x-2">
            <Button
              variant={paymentMethod === 'card' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('card')}
              className="flex-1"
            >
              <Icon icon="solar:card-bold" className="mr-2" width={16} />
              Card
            </Button>
            <Button
              variant={paymentMethod === 'mobile_money' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('mobile_money')}
              className="flex-1"
            >
              <Icon icon="solar:phone-bold" className="mr-2" width={16} />
              Mobile Money
            </Button>
          </div>

          {/* Payment Form */}
          {paymentMethod === 'card' ? (
            <div className="space-y-3">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="expiryDate">Expiry</Label>
                  <Input
                    id="expiryDate"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                    placeholder="123"
                    required
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="momoNumber">Mobile Money Number</Label>
                <Input
                  id="momoNumber"
                  value={formData.momoNumber}
                  onChange={(e) => handleInputChange('momoNumber', e.target.value)}
                  placeholder="0XX XXX XXXX"
                  required
                />
              </div>
              <div>
                <Label htmlFor="momoNetwork">Network</Label>
                <select
                  id="momoNetwork"
                  value={formData.momoNetwork}
                  onChange={(e) => handleInputChange('momoNetwork', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="mtn">MTN Mobile Money</option>
                  <option value="vodafone">Vodafone Cash</option>
                  <option value="airtel">AirtelTigo Money</option>
                </select>
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subscription ({tier.billing_cycle})</span>
              <span>{formatCurrency(tier.price)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Service Fee</span>
              <span>{formatCurrency(serviceFee)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={onClose} disabled={processing}>
            Cancel
          </Button>
          <Button 
            onClick={handlePayment} 
            disabled={!isFormValid || processing || isLoading}
          >
            {processing ? (
              <Icon icon="solar:spinner-bold" className="animate-spin mr-2" width={16} />
            ) : (
              <Icon icon="solar:lock-bold" className="mr-2" width={16} />
            )}
            Pay {formatCurrency(totalAmount)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
