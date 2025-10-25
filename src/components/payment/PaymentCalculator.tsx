import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { centralizedCommissionEngine } from '@/config/centralized-commission.config';
import { useRealTimeCommissionConfig } from '@/hooks/useRealTimeCommissionConfig';
import { formatCurrency } from '@/utils/formatters';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';

/**
 * ✅ APPLE-GRADE PAYMENT CALCULATOR - BE CONSCIOUS COMPLIANCE
 *
 * Dynamic payment calculator using centralized commission engine
 * Zero hardcoded business values with complete type safety
 */
export const PaymentCalculator: React.FC = () => {
  const [baseAmount, setBaseAmount] = useState<number>(0);
  const [includeAgent, setIncludeAgent] = useState<boolean>(false);
  const [calculation, setCalculation] = useState<ReturnType<typeof centralizedCommissionEngine.calculateCommissions> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { rates } = useRealTimeCommissionConfig({ portal: 'student' });


  useEffect(() => {
    try {
      if (baseAmount > 0) {
        // ✅ Using centralized commission engine - Single source of truth
        const result = centralizedCommissionEngine.calculateCommissions(baseAmount, includeAgent);
        setCalculation(result);
        setError(null);
      } else {
        setCalculation(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setCalculation(null);
    }
  }, [baseAmount, includeAgent]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setBaseAmount(isNaN(value) ? 0 : value);
  };

  const handleAgentToggle = () => {
    setIncludeAgent(!includeAgent);
  };

  return (
    <ErrorBoundary fallback={<p>Something went wrong with the payment calculator.</p>}>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Payment Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Property Price (GHS)</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="100"
                value={baseAmount || ''}
                onChange={handleAmountChange}
                placeholder="Enter property price"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="includeAgent"
                checked={includeAgent}
                onChange={handleAgentToggle}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="includeAgent">Include Agent Commission</Label>
            </div>

            {error && (
              <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
                {error}
              </div>
            )}

            {calculation && (
              <div className="mt-4 space-y-2">
                <Separator />
                <h3 className="font-medium text-lg">Payment Breakdown</h3>

                <div className="grid grid-cols-2 gap-1">
                  <span className="text-gray-600">Base Amount:</span>
                  <span className="font-medium text-right">{formatCurrency(calculation.baseAmount)}</span>

                  <span className="text-gray-600">Platform Commission ({(((rates?.platform ?? centralizedCommissionEngine.getCommissionRates().platform) * 100).toFixed(1))}%):</span>
                  <span className="font-medium text-right">{formatCurrency(calculation.platformCommission)}</span>

                  <span className="text-gray-600">Platform Fee:</span>
                  <span className="font-medium text-right">{formatCurrency(calculation.platformFixedFee)}</span>

                  {includeAgent && (
                    <>
                      <span className="text-gray-600">Agent Commission ({(((rates?.agent ?? centralizedCommissionEngine.getCommissionRates().agent) * 100).toFixed(1))}%):</span>
                      <span className="font-medium text-right">{formatCurrency(calculation.agentCommission)}</span>
                    </>
                  )}

                  <span className="text-gray-600">Paystack Fee:</span>
                  <span className="font-medium text-right">{formatCurrency(calculation.paystackFee)}</span>

                  <span className="text-gray-600">VAT:</span>
                  <span className="font-medium text-right">{formatCurrency(calculation.vatAmount)}</span>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-1">
                  <span className="text-gray-800 font-semibold">Total Amount:</span>
                  <span className="font-bold text-right">{formatCurrency(calculation.totalAmount)}</span>

                  <span className="text-gray-800 font-semibold">Owner Receives:</span>
                  <span className="font-bold text-right">{formatCurrency(calculation.ownerReceives)}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};