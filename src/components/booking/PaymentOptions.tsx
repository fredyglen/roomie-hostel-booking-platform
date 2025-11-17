
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getMobileMoneyProviders } from '@/utils/paystackIntegration';
import { formatCurrency } from '@/utils/currency';
import { Smartphone, Building2 } from 'lucide-react';

interface PaymentOptionsProps {
  totalPrice: number;
  selectedPaymentMethod: string;
  onSelectPaymentMethod: (method: string) => void;
  onMobileMoneyConfig?: (config: { network: string; phone: string }) => void;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  totalPrice,
  selectedPaymentMethod,
  onSelectPaymentMethod,
  onMobileMoneyConfig
}) => {
  const [mobileMoneyNetwork, setMobileMoneyNetwork] = useState('mtn');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const mobileMoneyProviders = getMobileMoneyProviders();

  const handleMobileMoneyChange = (field: string, value: string) => {
    if (field === 'network') {
      setMobileMoneyNetwork(value);
    } else if (field === 'phone') {
      setPhoneNumber(value);
    }
    
    if (onMobileMoneyConfig) {
      onMobileMoneyConfig({
        network: field === 'network' ? value : mobileMoneyNetwork,
        phone: field === 'phone' ? value : phoneNumber
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Payment Method</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <RadioGroup
          value={selectedPaymentMethod}
          onValueChange={onSelectPaymentMethod}
          className="space-y-4"
        >
          {/* Mobile Money (Primary) */}
          <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedPaymentMethod === 'mobile_money' ? 'border-[#9b87f5] bg-purple-50' : 'hover:bg-gray-50'}`}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="mobile_money" id="mobile_money" />
              <Smartphone className="h-5 w-5 text-green-600" />
              <Label htmlFor="mobile_money" className="flex-1 cursor-pointer">
                <div>
                  <p className="font-medium">Mobile Money</p>
                  <p className="text-sm text-gray-600">MTN, Vodafone, AirtelTigo</p>
                </div>
              </Label>
              <div className="flex space-x-2">
                <div className="w-8 h-5 bg-yellow-500 rounded text-white text-xs flex items-center justify-center font-bold">M</div>
                <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">V</div>
                <div className="w-8 h-5 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">A</div>
              </div>
            </div>
            
            {selectedPaymentMethod === 'mobile_money' && (
              <div className="mt-4 space-y-3 pl-8">
                <div>
                  <Label htmlFor="momo-provider" className="text-sm">Select Provider</Label>
                  <Select 
                    value={mobileMoneyNetwork} 
                    onValueChange={(value) => handleMobileMoneyChange('network', value)}
                  >
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
                  <Label htmlFor="momo-phone" className="text-sm">Mobile Money Number</Label>
                  <Input
                    id="momo-phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => handleMobileMoneyChange('phone', e.target.value)}
                    placeholder="0551234567"
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bank Transfer */}
          <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedPaymentMethod === 'bank' ? 'border-[#9b87f5] bg-purple-50' : 'hover:bg-gray-50'}`}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="bank" id="bank" />
              <Building2 className="h-5 w-5 text-purple-600" />
              <Label htmlFor="bank" className="flex-1 cursor-pointer">
                <div>
                  <p className="font-medium">Bank Transfer</p>
                  <p className="text-sm text-gray-600">Direct bank transfer</p>
                </div>
              </Label>
            </div>
          </div>
        </RadioGroup>
        
        {/* Total Amount */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total Amount</span>
            <span className="text-[#9b87f5]">{formatCurrency(totalPrice)}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Secure payment processing powered by Paystack
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentOptions;
