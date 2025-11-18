/**
 * ✅ PORTAL INTEGRATION EXAMPLES - REAL-TIME COMMISSION SYNCHRONIZATION
 * 
 * BE CONSCIOUS Apple-Grade Examples showing how each portal integrates
 * with the real-time commission configuration system
 * 
 * Features:
 * - Student Portal: Real-time booking cost updates
 * - Owner Portal: Real-time earnings calculation updates
 * - Admin Portal: Real-time configuration management
 * - Paystack Integration: Real-time payment processing updates
 */

import React, { useEffect, useState } from 'react';
import { useRealTimeCommissionConfig } from '@/hooks/useRealTimeCommissionConfig';
import { enhancedPaystackService } from '@/services/enhanced-paystack.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Zap, DollarSign, Users, Settings } from 'lucide-react';

// ============================================================================
// STUDENT PORTAL INTEGRATION EXAMPLE
// ============================================================================

export const StudentPortalCommissionExample: React.FC<{ bookingAmount: number }> = ({ bookingAmount }) => {
  const {
    rates,
    calculateCommissions,
    isConnected,
    lastUpdated,
    error
  } = useRealTimeCommissionConfig({
    portal: 'student',
    onConfigChange: (config) => {
      console.log('✅ Student Portal: Commission rates updated!', config.version);
    }
  });

  const [commissionBreakdown, setCommissionBreakdown] = useState<any>(null);

  useEffect(() => {
    if (rates && bookingAmount > 0) {
      try {
        const breakdown = calculateCommissions(bookingAmount, true);
        setCommissionBreakdown(breakdown);
      } catch (error) {
        console.error('Failed to calculate commissions:', error);
      }
    }
  }, [rates, bookingAmount, calculateCommissions]);

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          Student Portal - Real-Time Booking Cost
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Real-Time Status:</span>
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>

        {/* Error Display */}
        {error && (
          <Alert className="border-red-500 bg-red-50">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {/* Commission Breakdown */}
        {commissionBreakdown && (
          <div className="space-y-2">
            <h4 className="font-medium">Booking Cost Breakdown (Updates in Real-Time)</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span>Base Amount:</span>
                <span>GHS {commissionBreakdown.baseAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee:</span>
                <span>GHS {commissionBreakdown.platformCommission.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Agent Fee:</span>
                <span>GHS {commissionBreakdown.agentCommission.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Fee:</span>
                <span>GHS {commissionBreakdown.paystackFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT:</span>
                <span>GHS {commissionBreakdown.vatAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-1">
                <span>Total Amount:</span>
                <span>GHS {commissionBreakdown.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Last Updated */}
        {lastUpdated && (
          <div className="text-xs text-gray-500">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ============================================================================
// OWNER PORTAL INTEGRATION EXAMPLE
// ============================================================================

export const OwnerPortalCommissionExample: React.FC<{ monthlyEarnings: number }> = ({ monthlyEarnings }) => {
  const {
    rates,
    calculateCommissions,
    isConnected,
    portalRates
  } = useRealTimeCommissionConfig({
    portal: 'owner',
    onConfigChange: (config) => {
      console.log('✅ Owner Portal: Commission rates updated!', config.version);
    }
  });

  const [earningsBreakdown, setEarningsBreakdown] = useState<any>(null);

  useEffect(() => {
    if (rates && monthlyEarnings > 0) {
      try {
        const breakdown = calculateCommissions(monthlyEarnings, true);
        setEarningsBreakdown(breakdown);
      } catch (error) {
        console.error('Failed to calculate earnings:', error);
      }
    }
  }, [rates, monthlyEarnings, calculateCommissions]);

  return (
    <Card className="border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-500" />
          Owner Portal - Real-Time Earnings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Real-Time Status:</span>
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>

        {/* Current Commission Rates */}
        {portalRates && (
          <div className="space-y-2">
            <h4 className="font-medium">Current Commission Rates (Updates in Real-Time)</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span>Platform Commission:</span>
                <Badge variant="outline">{(portalRates.platform * 100).toFixed(1)}%</Badge>
              </div>
              <div className="flex justify-between">
                <span>Agent Commission:</span>
                <Badge variant="outline">{(portalRates.agent * 100).toFixed(1)}%</Badge>
              </div>
            </div>
          </div>
        )}

        {/* Earnings Breakdown */}
        {earningsBreakdown && (
          <div className="space-y-2">
            <h4 className="font-medium">Monthly Earnings Breakdown</h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex justify-between">
                <span>Gross Bookings:</span>
                <span>GHS {earningsBreakdown.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Platform Commission:</span>
                <span>-GHS {earningsBreakdown.platformCommission.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Agent Commission:</span>
                <span>-GHS {earningsBreakdown.agentCommission.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-green-600 border-t pt-1">
                <span>You Receive:</span>
                <span>GHS {earningsBreakdown.ownerReceives.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Real-Time Indicator */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Zap className="h-3 w-3" />
          <span>Updates automatically when commission rates change</span>
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================================================
// ADMIN PORTAL INTEGRATION EXAMPLE
// ============================================================================

export const AdminPortalCommissionExample: React.FC = () => {
  const {
    rates,
    isConnected,
    subscriberCount,
    lastUpdated,
    refreshConfig
  } = useRealTimeCommissionConfig({
    portal: 'admin',
    onConfigChange: (config) => {
      console.log('✅ Admin Portal: Commission configuration updated!', config.version);
    }
  });

  return (
    <Card className="border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-purple-500" />
          Admin Portal - Real-Time Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* System Status */}
        <div className="space-y-2">
          <h4 className="font-medium">Real-Time System Status</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span>Connection:</span>
              <Badge variant={isConnected ? "default" : "destructive"}>
                {isConnected ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Connected Portals:</span>
              <Badge variant="outline">{subscriberCount}</Badge>
            </div>
          </div>
        </div>

        {/* Current Rates */}
        {rates && (
          <div className="space-y-2">
            <h4 className="font-medium">Current Commission Rates</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span>Platform:</span>
                <Badge className="bg-blue-500">{(rates.platform * 100).toFixed(1)}%</Badge>
              </div>
              <div className="flex justify-between">
                <span>Agent:</span>
                <Badge className="bg-green-500">{(rates.agent * 100).toFixed(1)}%</Badge>
              </div>
              <div className="flex justify-between">
                <span>Paystack:</span>
                <Badge className="bg-purple-500">{(rates.paystack * 100).toFixed(2)}%</Badge>
              </div>
              <div className="flex justify-between">
                <span>VAT:</span>
                <Badge className="bg-orange-500">{(rates.vat * 100).toFixed(1)}%</Badge>
              </div>
            </div>
          </div>
        )}

        {/* Last Updated */}
        {lastUpdated && (
          <div className="text-xs text-gray-500">
            Configuration last updated: {new Date(lastUpdated).toLocaleString()}
          </div>
        )}

        {/* Manual Refresh Control */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={refreshConfig}
            className="rounded-md border border-purple-200 px-3 py-1 text-xs font-medium text-purple-700 hover:bg-purple-50"
          >
            Refresh configuration
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================================================
// PAYSTACK INTEGRATION EXAMPLE
// ============================================================================

export const PaystackIntegrationExample: React.FC<{ paymentAmount: number }> = ({ paymentAmount }) => {
  const [paystackStatus, setPaystackStatus] = useState<any>(null);
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    // Get Paystack service status
    const status = enhancedPaystackService.getConnectionStatus();
    const rates = enhancedPaystackService.getCurrentRates();
    setPaystackStatus({ ...status, rates });

    // Prepare payment data
    if (paymentAmount > 0) {
      try {
        const data = enhancedPaystackService.preparePaymentData(
          'test@example.com',
          paymentAmount,
          `ref_${Date.now()}`,
          true
        );
        setPaymentData(data);
      } catch (error) {
        console.error('Failed to prepare payment data:', error);
      }
    }
  }, [paymentAmount]);

  return (
    <Card className="border-yellow-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Paystack Integration - Real-Time Rates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Paystack Status */}
        {paystackStatus && (
          <div className="space-y-2">
            <h4 className="font-medium">Paystack Service Status</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span>Real-Time Updates:</span>
                <Badge variant={paystackStatus.isSubscribed ? "default" : "destructive"}>
                  {paystackStatus.isSubscribed ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Current Paystack Rate:</span>
                <Badge variant="outline">{paystackStatus.rates.paystack.toFixed(2)}%</Badge>
              </div>
              <div className="flex justify-between">
                <span>Current VAT Rate:</span>
                <Badge variant="outline">{paystackStatus.rates.vat.toFixed(1)}%</Badge>
              </div>
            </div>
          </div>
        )}

        {/* Payment Data */}
        {paymentData && (
          <div className="space-y-2">
            <h4 className="font-medium">Payment Calculation (Real-Time Rates)</h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex justify-between">
                <span>Amount (Kobo):</span>
                <span>{paymentData.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Currency:</span>
                <span>{paymentData.currency}</span>
              </div>
              <div className="flex justify-between">
                <span>Commission Version:</span>
                <Badge variant="outline">
                  {paymentData.metadata?.commission_version}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Real-Time Indicator */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Zap className="h-3 w-3" />
          <span>Payment calculations update automatically with commission changes</span>
        </div>
      </CardContent>
    </Card>
  );
};
