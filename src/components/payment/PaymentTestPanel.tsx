import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBusinessPaymentFlow } from '@/hooks/payment/useBusinessPaymentFlow';
import { useAuth } from '@/context/EnhancedAuthContext';
import { calculatePaymentBreakdown } from '@/utils/paymentCalculations';
import { BOOKING_PACKAGES } from '@/utils/paymentSplitting';
import { CreditCard, Smartphone, AlertCircle } from 'lucide-react';
import PaymentTestConfiguration from './PaymentTestConfiguration';
import PaymentBreakdownDisplay from './PaymentBreakdownDisplay';
import TestPaymentMethods from './TestPaymentMethods';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ErrorHandler } from '@/utils/ErrorHandler';

const PaymentTestPanel: React.FC = () => {
  const { user } = useAuth();
  const { initializePayment, processing } = useBusinessPaymentFlow();
  const [error, setError] = useState<string | null>(null);
  
  // Use proper UUIDs for test data
  const [testData, setTestData] = useState({
    packageType: 'standard' as 'standard' | 'premium' | 'luxury',
    studentEmail: user?.email || 'test@example.com',
    propertyOwnerId: '550e8400-e29b-41d4-a716-446655440001', // Valid UUID format
    agentId: '550e8400-e29b-41d4-a716-446655440002' // Valid UUID format
  });

  const handleTestPayment = async () => {
    if (!user) {
      setError('Please log in to test payments');
      return;
    }

    setError(null);

    const paymentData = {
      propertyId: '550e8400-e29b-41d4-a716-446655440000', // Valid UUID for test property
      studentId: user.id,
      propertyOwnerId: testData.propertyOwnerId,
      agentId: testData.agentId,
      packageType: testData.packageType,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      studentEmail: testData.studentEmail,
      metadata: {
        test_mode: true,
        test_timestamp: new Date().toISOString(),
        source: 'payment_test_panel'
      }
    };
    try {
      ErrorHandler.log('Initializing test payment with data:', JSON.stringify(paymentData));
      const result = await initializePayment(paymentData);
      
      if (result.success) {
        ErrorHandler.log('Payment initialized successfully:', JSON.stringify(result));
        setError(null);
        // Show success message
        alert(`Payment initialized successfully! Reference: ${result.paymentData.reference}`);
      } else {
        ErrorHandler.log('Payment initialization failed:', result.error);
        setError(`Payment failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      ErrorHandler.log('Test payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Test payment failed: ${errorMessage}`);
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
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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
