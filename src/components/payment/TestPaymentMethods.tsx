
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Smartphone, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const TestPaymentMethods: React.FC = () => {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Use these test credentials in Stripe's test mode. Real payments will not be processed.
        </AlertDescription>
      </Alert>

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
              <code className="bg-gray-100 px-1 rounded">4084084084084081</code>
            </div>
            <div className="flex justify-between">
              <span>Insufficient Funds:</span>
              <code className="bg-gray-100 px-1 rounded">4111111111111113</code>
            </div>
            <div className="flex justify-between">
              <span>CVV:</span>
              <code className="bg-gray-100 px-1 rounded">123</code>
            </div>
            <div className="flex justify-between">
              <span>Expiry:</span>
              <code className="bg-gray-100 px-1 rounded">Any future date</code>
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
              <code className="bg-gray-100 px-1 rounded">0547000000</code>
            </div>
            <div className="flex justify-between">
              <span>Vodafone Success:</span>
              <code className="bg-gray-100 px-1 rounded">0507000000</code>
            </div>
            <div className="flex justify-between">
              <span>AirtelTigo Success:</span>
              <code className="bg-gray-100 px-1 rounded">0267000000</code>
            </div>
            <div className="flex justify-between">
              <span>Insufficient Funds:</span>
              <code className="bg-gray-100 px-1 rounded">0247000001</code>
            </div>
            <div className="flex justify-between">
              <span>PIN:</span>
              <code className="bg-gray-100 px-1 rounded">0000</code>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-2">
          <p>1. Use the test card numbers above for card payments</p>
          <p>2. Use the test mobile money numbers for mobile money payments</p>
          <p>3. Any future expiry date will work for cards</p>
          <p>4. Use CVV 123 for all test cards</p>
          <p>5. Use PIN 0000 for all test mobile money transactions</p>
          <p className="text-amber-600 font-medium">
            ⚠️ These are test credentials only - no real money will be charged
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestPaymentMethods;
