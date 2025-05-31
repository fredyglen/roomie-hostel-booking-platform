
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/currency';
import { PaymentBreakdown } from '@/utils/paymentCalculations';

interface PaymentBreakdownDisplayProps {
  breakdown: PaymentBreakdown;
}

const PaymentBreakdownDisplay: React.FC<PaymentBreakdownDisplayProps> = ({ breakdown }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span>Total Amount</span>
          <span className="font-semibold">{formatCurrency(breakdown.totalAmount)}</span>
        </div>
        
        <div className="border-t pt-3 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Property Owner Amount</span>
            <span>{formatCurrency(breakdown.propertyOwnerAmount)}</span>
          </div>
          
          <div className="flex justify-between text-gray-600">
            <span>Agent Commission</span>
            <span>{formatCurrency(breakdown.agentCommission)}</span>
          </div>
          
          <div className="flex justify-between text-gray-600">
            <span>Platform Fee</span>
            <span>{formatCurrency(breakdown.platformFee)}</span>
          </div>
          
          <div className="flex justify-between text-gray-600">
            <span>Paystack Fee</span>
            <span>{formatCurrency(breakdown.paystackFee)}</span>
          </div>
        </div>
        
        <div className="border-t pt-3">
          <div className="flex justify-between font-semibold">
            <span>Platform Net</span>
            <span className="text-green-600">{formatCurrency(breakdown.platformNet)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentBreakdownDisplay;
