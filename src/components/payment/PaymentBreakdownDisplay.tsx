
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
            <span>Platform Fee (80 GHS)</span>
            <span>{formatCurrency(80)}</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Processing Fee (20 GHS)</span>
            <span>{formatCurrency(20)}</span>
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between font-semibold">
            <span>Total Payment</span>
            <span className="text-green-600">{formatCurrency(breakdown.totalAmount)}</span>
          </div>
        </div>

        {/* Info note about owner commission */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 italic">
            Note: Property owner pays 10% platform commission separately
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentBreakdownDisplay;
