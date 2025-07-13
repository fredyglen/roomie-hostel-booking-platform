import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { centralizedCommissionEngine } from '@/config/centralized-commission.config';
import { useAuth } from '@/context/AuthContext';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';

/**
 * ✅ APPLE-GRADE COMMISSION MANAGER - BE CONSCIOUS COMPLIANCE
 * 
 * Admin interface for managing commission rates and platform fees
 * Zero hardcoded business values with complete type safety
 */
export const CommissionConfigManager: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Commission rates (as percentages for better UX)
  const [platformRate, setPlatformRate] = useState<number>(5);
  const [agentRate, setAgentRate] = useState<number>(3.7);
  const [paystackRate, setPaystackRate] = useState<number>(1.95);
  const [vatRate, setVatRate] = useState<number>(12.5);
  
  // Platform fees
  const [platformFee, setPlatformFee] = useState<number>(100);
  const [agentMinimumFee, setAgentMinimumFee] = useState<number>(100);
  
  // Load current rates on component mount
  useEffect(() => {
    try {
      const rates = centralizedCommissionEngine.getCommissionRates();
      const fees = centralizedCommissionEngine.getPlatformFees();
      
      // Convert decimal rates to percentages for display
      setPlatformRate(rates.platform * 100);
      setAgentRate(rates.agent * 100);
      setPaystackRate(rates.paystack * 100);
      setVatRate(rates.vat * 100);
      
      setPlatformFee(fees.fixed);
      setAgentMinimumFee(fees.agentMinimum);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load commission rates');
    }
  }, []);
  
  const handleUpdateRate = async (
    rateType: 'platform' | 'agent' | 'paystack' | 'vat',
    newRate: number
  ) => {
    if (!user) {
      setError('You must be logged in to update commission rates');
      return;
    }
    
    setLoading(true);
    setSuccess(null);
    setError(null);
    
    try {
      await centralizedCommissionEngine.updateCommissionRate(
        rateType,
        newRate,
        user.id,
        `Admin update via Commission Manager`
      );
      
      setSuccess(`${rateType.charAt(0).toUpperCase() + rateType.slice(1)} commission rate updated successfully`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update commission rate');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateFee = async (
    feeType: 'fixed' | 'agentMinimum',
    newFee: number
  ) => {
    if (!user) {
      setError('You must be logged in to update platform fees');
      return;
    }
    
    setLoading(true);
    setSuccess(null);
    setError(null);
    
    try {
      await centralizedCommissionEngine.updatePlatformFee(
        feeType,
        newFee,
        user.id,
        `Admin update via Commission Manager`
      );
      
      setSuccess(`Platform fee updated successfully`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update platform fee');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ErrorBoundary fallback={<p>Something went wrong with the commission manager.</p>}>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Commission Configuration</CardTitle>
          <CardDescription>
            Manage platform commission rates and fees. Changes will affect all future calculations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert variant="success" className="mb-4">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Commission Rates</h3>
              <Separator className="mb-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platformRate">Platform Commission Rate (%)</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="platformRate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={platformRate}
                      onChange={(e) => setPlatformRate(parseFloat(e.target.value) || 0)}
                    />
                    <Button 
                      onClick={() => handleUpdateRate('platform', platformRate)}
                      disabled={loading}
                    >
                      Update
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="agentRate">Agent Commission Rate (%)</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="agentRate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={agentRate}
                      onChange={(e) => setAgentRate(parseFloat(e.target.value) || 0)}
                    />
                    <Button 
                      onClick={() => handleUpdateRate('agent', agentRate)}
                      disabled={loading}
                    >
                      Update
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paystackRate">Paystack Fee Rate (%)</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="paystackRate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={paystackRate}
                      onChange={(e) => setPaystackRate(parseFloat(e.target.value) || 0)}
                    />
                    <Button 
                      onClick={() => handleUpdateRate('paystack', paystackRate)}
                      disabled={loading}
                    >
                      Update
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vatRate">VAT Rate (%)</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="vatRate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={vatRate}
                      onChange={(e) => setVatRate(parseFloat(e.target.value) || 0)}
                    />
                    <Button 
                      onClick={() => handleUpdateRate('vat', vatRate)}
                      disabled={loading}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Platform Fees</h3>
              <Separator className="mb-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platformFee">Platform Fixed Fee (GHS)</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="platformFee"
                      type="number"
                      min="0"
                      step="10"
                      value={platformFee}
                      onChange={(e) => setPlatformFee(parseFloat(e.target.value) || 0)}
                    />
                    <Button 
                      onClick={() => handleUpdateFee('fixed', platformFee)}
                      disabled={loading}
                    >
                      Update
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="agentMinimumFee">Agent Minimum Fee (GHS)</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="agentMinimumFee"
                      type="number"
                      min="0"
                      step="10"
                      value={agentMinimumFee}
                      onChange={(e) => setAgentMinimumFee(parseFloat(e.target.value) || 0)}
                    />
                    <Button 
                      onClick={() => handleUpdateFee('agentMinimum', agentMinimumFee)}
                      disabled={loading}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};

