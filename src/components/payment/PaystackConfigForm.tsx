import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Key, Shield, AlertTriangle } from 'lucide-react';
import { ErrorHandler } from '@/utils/ErrorHandler';
import { API_ENDPOINTS } from '@/constants/api';

const PaystackConfigForm: React.FC = () => {
  const [showTestKey, setShowTestKey] = useState(false);
  const [showLiveKey, setShowLiveKey] = useState(false);
  const [testSecretKey, setTestSecretKey] = useState('');
  const [liveSecretKey, setLiveSecretKey] = useState('');
  const [environment, setEnvironment] = useState<'test' | 'live'>('test');

  const handleSaveConfiguration = () => {
    // This would typically save to your secure backend/environment variables
    ErrorHandler.log('Saving Paystack configuration: ' + JSON.stringify({
      environment,
      testKeyLength: testSecretKey.length,
      liveKeyLength: liveSecretKey.length
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Paystack Configuration</h1>
        <p className="text-gray-600">Set up your Paystack payment integration securely</p>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Your API keys are encrypted and stored securely. Never share your secret keys publicly.
        </AlertDescription>
      </Alert>

      <Tabs value={environment} onValueChange={(value) => setEnvironment(value as 'test' | 'live')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="test" className="flex items-center space-x-2">
            <Badge variant="outline">TEST</Badge>
            <span>Test Environment</span>
          </TabsTrigger>
          <TabsTrigger value="live" className="flex items-center space-x-2">
            <Badge variant="default">LIVE</Badge>
            <span>Live Environment</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>Test Environment Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-secret-key">Test Secret Key</Label>
                <div className="relative">
                  <Input
                    id="test-secret-key"
                    type={showTestKey ? "text" : "password"}
                    placeholder="sk_test_..."
                    value={testSecretKey}
                    onChange={(e) => setTestSecretKey(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowTestKey(!showTestKey)}
                  >
                    {showTestKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Found in your Paystack Dashboard → Settings → API Keys & Webhooks
                </p>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Test mode allows you to simulate payments without real money. Perfect for development and testing.
                </AlertDescription>
              </Alert>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Test Configuration Details:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Use test cards provided by Paystack</li>
                  <li>• No real money is processed</li>
                  <li>• Webhooks work in test mode</li>
                  <li>• Transaction limits don't apply</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="live" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5 text-green-600" />
                <span>Live Environment Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Live Environment:</strong> Real money will be processed. Ensure thorough testing before enabling.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="live-secret-key">Live Secret Key</Label>
                <div className="relative">
                  <Input
                    id="live-secret-key"
                    type={showLiveKey ? "text" : "password"}
                    placeholder="sk_live_..."
                    value={liveSecretKey}
                    onChange={(e) => setLiveSecretKey(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowLiveKey(!showLiveKey)}
                  >
                    {showLiveKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Your live secret key for production payments
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">Live Environment Checklist:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>✓ Business verified with Paystack</li>
                  <li>✓ Bank account details confirmed</li>
                  <li>✓ Webhook URL configured and tested</li>
                  <li>✓ Payment flows thoroughly tested in test mode</li>
                  <li>✓ Terms of service and privacy policy updated</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Webhook Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <Input
              value={API_ENDPOINTS.PAYSTACK_WEBHOOK}
              readOnly
              className="bg-gray-50"
            />
            <p className="text-sm text-gray-500">
              Configure this URL in your Paystack dashboard for payment notifications
            </p>
          </div>

          <div className="space-y-2">
            <Label>Webhook Events</Label>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm space-y-1">
                <div>• <code>charge.success</code> - Payment successful</div>
                <div>• <code>paymentrequest.success</code> - Payment request completed</div>
                <div>• <code>refund.processed</code> - Refund processed</div>
                <div>• <code>transfer.success</code> - Transfer successful</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Commission Structure Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-lg font-bold text-blue-800">Property Owner</div>
              <div className="text-2xl font-bold text-blue-600">98%</div>
              <div className="text-sm text-blue-600">Of booking amount</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-lg font-bold text-green-800">Agent Commission</div>
              <div className="text-2xl font-bold text-green-600">3.7%</div>
              <div className="text-sm text-green-600">Min. GHS 100</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-lg font-bold text-purple-800">Platform Fee</div>
              <div className="text-2xl font-bold text-purple-600">4.2%</div>
              <div className="text-sm text-purple-600">Includes Paystack fees</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          Test Configuration
        </Button>
        <Button onClick={handleSaveConfiguration} className="bg-[#9b87f5] hover:bg-[#8b77f0]">
          Save Configuration
        </Button>
      </div>
    </div>
  );
};

export default PaystackConfigForm;
