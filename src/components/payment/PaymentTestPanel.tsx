
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBusinessPaymentFlow } from '@/hooks/payment/useBusinessPaymentFlow';
import { useAuth } from '@/context/EnhancedAuthContext';
import { calculatePaymentBreakdown } from '@/utils/paymentCalculations';
import { BOOKING_PACKAGES } from '@/utils/paymentSplitting';
import { formatCurrency } from '@/utils/currency';
import { CreditCard, Smartphone } from 'lucide-react';
import PaymentTestConfiguration from './PaymentTestConfiguration';
import PaymentBreakdownDisplay from './PaymentBreakdownDisplay';
import TestPaymentMethods from './TestPaymentMethods';

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
      endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
          <PaymentTestConfiguration 
            testData={testData} 
            onTestDataChange={setTestData} 
          />
          
          <PaymentBreakdownDisplay breakdown={breakdown} />

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

          <TestPaymentMethods />
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentTestPanel;
