
import React from 'react';
import { formatCurrency } from '@/utils/currency';

interface PaymentBreakdown {
  totalAmount: number;
  propertyOwnerAmount: number;
  agentCommission: number;
  platformFee: number;
  paystackFee: number;
  platformNet: number;
}

interface PaymentBreakdownDisplayProps {
  breakdown: PaymentBreakdown;
}

const PaymentBreakdownDisplay: React.FC<PaymentBreakdownDisplayProps> = ({ breakdown }) => {
  return (
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
        <div className="flex justify-between text-yellow-700">
          <span>Convenience Fee:</span>
          <span>{formatCurrency(100)}</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentBreakdownDisplay;
