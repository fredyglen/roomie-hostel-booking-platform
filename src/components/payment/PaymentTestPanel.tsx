
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBusinessPaymentFlow } from '@/hooks/payment/useBusinessPaymentFlow';
import { useAuth } from '@/context/EnhancedAuthContext';
import { calculatePaymentBreakdown } from '@/utils/paymentCalculations';
import { BOOKING_PACKAGES } from '@/utils/paymentSplitting';
import { formatCurrency } from '@/utils/currency';
import { CreditCard, Smartphone, Building } from 'lucide-react';

const PaymentTestPanel: React.FC = () => {
  const { user } = useAuth();
  const { initializePayment, processing } = useBusinessPaymentFlow();
  
  const [testData, setTestData] = useState({
    packageType: 'standard' as 'standard' | 'premium' | 'luxury',
    studentEmail: user?.email || 'test@example.com',
    propertyOwnerId: 'test-owner-id',
    agentId: 'test-agent-id'
  });

  const handleTestPayment = async () => {
    if (!user) {
      alert('Please log in to test payments');
      return;
    }

    const paymentData = {
      propertyId: 'test-property-id',
      studentId: user.id,
      propertyOwnerId: testData.propertyOwnerId,
      agentId: testData.agentId,
      packageType: testData.packageType,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4 months
      studentEmail: testData.studentEmail,
      metadata: {
        test_mode: true,
        test_timestamp: new Date().toISOString()
      }
    };

    try {
      const result = await initializePayment(paymentData);
      
      if (result.success) {
        console.log('Payment initialized successfully:', result);
        // In a real scenario, this would redirect to Paystack
        alert(`Payment initialized! Reference: ${result.paymentData.reference}`);
      } else {
        console.error('Payment initialization failed:', result.error);
        alert(`Payment failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Test payment error:', error);
      alert('Test payment failed. Check console for details.');
    }
  };

  const selectedPackage = BOOKING_PACKAGES[testData.packageType];
  const breakdown = calculatePaymentBreakdown(selectedPackage.totalPrice);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Payment Test Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="packageType">Package Type</Label>
              <Select 
                value={testData.packageType} 
                onValueChange={(value: 'standard' | 'premium' | 'luxury') => 
                  setTestData(prev => ({ ...prev, packageType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Package (₵2,700)</SelectItem>
                  <SelectItem value="premium">Premium Package (₵3,600)</SelectItem>
                  <SelectItem value="luxury">Luxury Package (₵4,000)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentEmail">Student Email</Label>
              <Input
                id="studentEmail"
                type="email"
                value={testData.studentEmail}
                onChange={(e) => setTestData(prev => ({ ...prev, studentEmail: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyOwnerId">Property Owner ID</Label>
              <Input
                id="propertyOwnerId"
                value={testData.propertyOwnerId}
                onChange={(e) => setTestData(prev => ({ ...prev, propertyOwnerId: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agentId">Agent ID</Label>
              <Input
                id="agentId"
                value={testData.agentId}
                onChange={(e) => setTestData(prev => ({ ...prev, agentId: e.target.value }))}
              />
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold mb-3">Payment Breakdown Preview</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-semibold">{formatCurrency(breakdown.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-green-700">
                <span>Property Owner (98%):</span>
                <span>{formatCurrency(breakdown.propertyOwnerAmount)}</span>
              </div>
              <div className="flex justify-between text-blue-700">
                <span>Agent Commission (3.7%):</span>
                <span>{formatCurrency(breakdown.agentCommission)}</span>
              </div>
              <div className="flex justify-between text-purple-700">
                <span>Platform Fee (4.2%):</span>
                <span>{formatCurrency(breakdown.platformFee)}</span>
              </div>
              <div className="flex justify-between text-red-700">
                <span>Paystack Fees (1.95%):</span>
                <span>{formatCurrency(breakdown.paystackFee)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Platform Net:</span>
                <span>{formatCurrency(breakdown.platformNet)}</span>
              </div>
            </div>
          </div>

          {/* Test Payment Button */}
          <Button 
            onClick={handleTestPayment}
            disabled={processing}
            className="w-full"
            size="lg"
          >
            {processing ? (
              'Initializing Payment...'
            ) : (
              <>
                <Smartphone className="mr-2 h-4 w-4" />
                Test Payment Flow
              </>
            )}
          </Button>

          {/* Test Cards Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Test Card Numbers</CardTitle>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentTestPanel;
