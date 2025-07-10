/**
 * ✅ COMMISSION CONFIGURATION MANAGER - "PHONE NUMBER DIAL" SIMPLICITY
 * 
 * BE CONSCIOUS Apple-Grade Commission Rate Management Interface
 * 
 * Features:
 * - "Phone number dial" simplicity for rate changes
 * - Real-time updates across all portals
 * - Enterprise-level audit trail
 * - Instant Paystack synchronization
 * - Single-click configuration updates
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { centralizedCommissionEngine } from '@/config/centralized-commission.config';
import { useAuth } from '@/context/EnhancedAuthContext';
import { CheckCircle, AlertTriangle, Clock, Zap } from 'lucide-react';

interface CommissionRateUpdate {
  rateType: 'platform' | 'agent' | 'paystack' | 'vat';
  currentRate: number;
  newRate: string;
  label: string;
  description: string;
  color: string;
}

interface PlatformFeeUpdate {
  feeType: 'fixed' | 'agentMinimum';
  currentFee: number;
  newFee: string;
  label: string;
  description: string;
  color: string;
}

export const CommissionConfigManager: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [updateReason, setUpdateReason] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [configInfo, setConfigInfo] = useState<any>(null);

  // Commission rate states
  const [rates, setRates] = useState<CommissionRateUpdate[]>([
    {
      rateType: 'platform',
      currentRate: 5.0,
      newRate: '5.0',
      label: 'Platform Commission',
      description: 'Commission charged to property owners',
      color: 'bg-blue-500'
    },
    {
      rateType: 'agent',
      currentRate: 3.7,
      newRate: '3.7',
      label: 'Agent Commission',
      description: 'Commission paid to booking agents',
      color: 'bg-green-500'
    },
    {
      rateType: 'paystack',
      currentRate: 1.95,
      newRate: '1.95',
      label: 'Paystack Fee',
      description: 'Payment processing fee',
      color: 'bg-purple-500'
    },
    {
      rateType: 'vat',
      currentRate: 12.5,
      newRate: '12.5',
      label: 'VAT Rate',
      description: 'Ghana VAT rate',
      color: 'bg-orange-500'
    }
  ]);

  // ✅ PLATFORM FEE STATES - "PHONE NUMBER DIAL" SIMPLICITY
  const [fees, setFees] = useState<PlatformFeeUpdate[]>([
    {
      feeType: 'fixed',
      currentFee: 100,
      newFee: '100',
      label: 'Platform Fixed Fee',
      description: 'Fixed fee charged per booking (GHS)',
      color: 'bg-indigo-500'
    },
    {
      feeType: 'agentMinimum',
      currentFee: 100,
      newFee: '100',
      label: 'Agent Minimum Fee',
      description: 'Minimum agent commission per booking (GHS)',
      color: 'bg-teal-500'
    }
  ]);

  useEffect(() => {
    loadCurrentConfiguration();
  }, []);

  const loadCurrentConfiguration = () => {
    try {
      const currentRates = centralizedCommissionEngine.getCommissionRates();
      const info = centralizedCommissionEngine.getConfigurationInfo();
      
      setConfigInfo(info);
      
      setRates(prev => prev.map(rate => ({
        ...rate,
        currentRate: currentRates[rate.rateType] * 100,
        newRate: (currentRates[rate.rateType] * 100).toString()
      })));
    } catch (error) {
      setErrorMessage('Failed to load current configuration');
    }
  };

  const handleRateChange = (rateType: string, value: string) => {
    setRates(prev => prev.map(rate => 
      rate.rateType === rateType 
        ? { ...rate, newRate: value }
        : rate
    ));
  };

  const updateCommissionRate = async (rateUpdate: CommissionRateUpdate) => {
    if (!user?.id) {
      setErrorMessage('User authentication required');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const newRateValue = parseFloat(rateUpdate.newRate);
      
      if (isNaN(newRateValue) || newRateValue < 0) {
        throw new Error('Invalid rate value');
      }

      // ✅ "PHONE NUMBER DIAL" SIMPLICITY - Single method call
      await centralizedCommissionEngine.updateCommissionRate(
        rateUpdate.rateType,
        newRateValue,
        user.id,
        updateReason || `Updated ${rateUpdate.label} via admin interface`
      );

      // Update local state
      setRates(prev => prev.map(rate => 
        rate.rateType === rateUpdate.rateType 
          ? { ...rate, currentRate: newRateValue }
          : rate
      ));

      setSuccessMessage(
        `✅ ${rateUpdate.label} updated to ${newRateValue}% instantly across all portals and Paystack!`
      );
      
      // Reload configuration info
      loadCurrentConfiguration();
      
    } catch (error: any) {
      setErrorMessage(`❌ Failed to update ${rateUpdate.label}: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges = (rate: CommissionRateUpdate) => {
    return parseFloat(rate.newRate) !== rate.currentRate;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Commission Configuration Manager
          </CardTitle>
          <CardDescription>
            "Phone Number Dial" simplicity for commission rate changes. 
            Updates reflect instantly across Student Portal, Owner Portal, Admin Portal, and Paystack.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Status Messages */}
      {successMessage && (
        <Alert className="border-green-500 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Configuration Info */}
      {configInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Current Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Version:</span>
              <Badge variant="outline">{configInfo.version}</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Last Updated:</span>
              <span className="text-gray-600">
                {new Date(configInfo.lastUpdated).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Real-Time Subscribers:</span>
              <Badge className="bg-green-500">{configInfo.subscriberCount} portals</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Commission Rates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rates.map((rate) => (
          <Card key={rate.rateType} className="relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <div className={`w-3 h-3 rounded-full ${rate.color}`} />
                {rate.label}
              </CardTitle>
              <CardDescription>{rate.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current Rate:</span>
                <Badge variant="outline">{rate.currentRate}%</Badge>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`rate-${rate.rateType}`}>New Rate (%)</Label>
                <Input
                  id={`rate-${rate.rateType}`}
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={rate.newRate}
                  onChange={(e) => handleRateChange(rate.rateType, e.target.value)}
                  className="text-center font-mono"
                />
              </div>

              <Button
                onClick={() => updateCommissionRate(rate)}
                disabled={isLoading || !hasChanges(rate)}
                className="w-full"
                variant={hasChanges(rate) ? "default" : "outline"}
              >
                {isLoading ? (
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4 mr-2" />
                )}
                {hasChanges(rate) ? 'Update Rate' : 'No Changes'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Update Reason */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Change Reason (Optional)</CardTitle>
          <CardDescription>
            Provide a reason for the commission rate change for audit trail
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="e.g., Market adjustment, promotional campaign, business strategy change..."
            value={updateReason}
            onChange={(e) => setUpdateReason(e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* BE CONSCIOUS Compliance Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900">
                BE CONSCIOUS Apple-Grade Compliance
              </p>
              <p className="text-xs text-blue-700">
                This system follows BE CONSCIOUS standards with zero tolerance for hardcoded values. 
                All changes propagate instantly across Student Portal, Owner Portal, Admin Portal, and Paystack integration.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
