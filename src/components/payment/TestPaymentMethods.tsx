
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Smartphone } from 'lucide-react';

const TestPaymentMethods: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            Test Card Numbers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span>Successful Payment:</span>
            <code>4084084084084081</code>
          </div>
          <div className="flex justify-between">
            <span>Insufficient Funds:</span>
            <code>4111111111111113</code>
          </div>
          <div className="flex justify-between">
            <span>CVV:</span>
            <code>123</code>
          </div>
          <div className="flex justify-between">
            <span>Expiry:</span>
            <code>Any future date</code>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center">
            <Smartphone className="mr-2 h-4 w-4" />
            Test Mobile Money
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span>MTN Success:</span>
            <code>0547000000</code>
          </div>
          <div className="flex justify-between">
            <span>Vodafone Success:</span>
            <code>0507000000</code>
          </div>
          <div className="flex justify-between">
            <span>AirtelTigo Success:</span>
            <code>0267000000</code>
          </div>
          <div className="flex justify-between">
            <span>Insufficient Funds:</span>
            <code>0247000001</code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestPaymentMethods;
