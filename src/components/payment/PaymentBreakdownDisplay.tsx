
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
            <span>Property Rent</span>
            <span>{formatCurrency(breakdown.propertyRent)}</span>
          </div>
          
          <div className="flex justify-between text-gray-600">
            <span>Platform Fee</span>
            <span>{formatCurrency(breakdown.platformFee)}</span>
          </div>
          
          <div className="flex justify-between text-gray-600">
            <span>Payment Processor Fee</span>
            <span>{formatCurrency(breakdown.paymentProcessorFee)}</span>
          </div>
          
          <div className="flex justify-between text-gray-600">
            <span>Agent Fee</span>
            <span>{formatCurrency(breakdown.agentFee)}</span>
          </div>
          
          <div className="flex justify-between text-gray-600">
            <span>VAT</span>
            <span>{formatCurrency(breakdown.vat)}</span>
          </div>
        </div>
        
        <div className="border-t pt-3">
          <div className="flex justify-between font-semibold">
            <span>Owner Receives</span>
            <span className="text-green-600">{formatCurrency(breakdown.ownerReceives)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentBreakdownDisplay;
