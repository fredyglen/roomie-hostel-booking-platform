import React, { useState } from 'react';
import { ModernPaystackPayment } from './ModernPaystackPayment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { debugPaystackConfig } from '@/utils/paystack-errors';
import { ModernPaymentSuccessResult } from '@/types/booking';

export const PaystackTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  
  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleTestPayment = (result: ModernPaymentSuccessResult) => {
    addTestResult(`✅ Payment successful with reference: ${result.reference}`);
    // Safely access verification amount or fallback to direct amount
    const verifiedAmount = result.verification?.amount ?? result.amount;
    addTestResult(`✅ Amount verified: GH₵${verifiedAmount}`);
    setShowPayment(false);
  };
  
  const handleTestError = (error: string) => {
    addTestResult(`❌ Payment error: ${error}`);
    setShowPayment(false);
  };

  const runConfigTest = () => {
    try {
      debugPaystackConfig();
      addTestResult('✅ Configuration test completed - check console for details');
    } catch (error) {
      addTestResult(`❌ Configuration error: ${error}`);
    }
  };
  
  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Test Paystack Integration</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Button onClick={runConfigTest} variant="outline" className="w-full">
            Test Configuration
          </Button>
          
          <Button 
            onClick={() => setShowPayment(true)} 
            className="w-full bg-[#9b87f5] hover:bg-[#8b77f0]"
          >
            Test GH₵10 Payment
          </Button>
          
          {showPayment && (
            <ModernPaystackPayment
              amount={10}
              email="test@student.ug.edu.gh"
              firstName="Test"
              lastName="Student"
              phone="0200000000"
              onSuccess={handleTestPayment}
              onError={handleTestError}
              title="Test Payment"
              description="GH₵10 test transaction"
            />
          )}
          
          <div className="bg-gray-100 p-4 rounded max-h-60 overflow-y-auto">
            <h3 className="font-semibold mb-2">Test Results:</h3>
            {testResults.length === 0 ? (
              <p className="text-gray-500">No tests run yet</p>
            ) : (
              testResults.map((result, index) => (
                <p key={index} className="text-sm mb-1">{result}</p>
              ))
            )}
          </div>
          
          <div className="text-sm text-gray-600">
            <p><strong>Test Details:</strong></p>
            <p>Amount: GH₵10.00</p>
            <p>Email: test@student.ug.edu.gh</p>
            <p>Use test card: 4084084084084081</p>
            <p>CVV: 408, Expiry: 01/30</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
