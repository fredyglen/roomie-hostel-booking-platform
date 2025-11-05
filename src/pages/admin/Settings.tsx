
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { centralizedCommissionEngine } from '@/config/centralized-commission.config';
import { useRealTimeCommissionConfig } from '@/hooks/useRealTimeCommissionConfig';
import { useAuth } from '@/context/EnhancedAuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // ✅ REAL-TIME COMMISSION CONFIG - Connected to centralized engine
  const { rates, isLoading: configLoading, error: configError, refreshConfig } = useRealTimeCommissionConfig({
    portal: 'admin',
    autoSubscribe: true
  });

  // Local state for form inputs (as percentages for better UX)
  const [platformRate, setPlatformRate] = useState<number>(5);
  const [agentRate, setAgentRate] = useState<number>(3.7);
  const [platformFee, setPlatformFee] = useState<number>(100);
  const [isUpdating, setIsUpdating] = useState(false);

  // ✅ SYNC LOCAL STATE WITH REAL-TIME RATES
  useEffect(() => {
    if (rates) {
      setPlatformRate(rates.platform * 100); // Convert to percentage
      setAgentRate(rates.agent * 100);
      const fees = centralizedCommissionEngine.getPlatformFees();
      setPlatformFee(fees.fixed);
    }
  }, [rates]);

  // ✅ UPDATE COMMISSION RATE
  const handleUpdateRate = async (
    rateType: 'platform' | 'agent' | 'paystack' | 'vat',
    newRate: number
  ) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to update commission rates",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);
    try {
      await centralizedCommissionEngine.updateCommissionRate(
        rateType,
        newRate,
        user.id,
        `Admin settings update via Settings page`
      );

      toast({
        title: "Success",
        description: `${rateType.charAt(0).toUpperCase() + rateType.slice(1)} commission rate updated to ${newRate}%`,
        variant: "default"
      });

      // Refresh to get latest data
      refreshConfig();
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : 'Failed to update commission rate',
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // ✅ UPDATE PLATFORM FEE
  const handleUpdateFee = async (newFee: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to update platform fees",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);
    try {
      await centralizedCommissionEngine.updatePlatformFee(
        'fixed',
        newFee,
        user.id,
        `Admin settings update via Settings page`
      );

      toast({
        title: "Success",
        description: `Platform fee updated to ${newFee} GHS`,
        variant: "default"
      });

      // Refresh to get latest data
      refreshConfig();
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : 'Failed to update platform fee',
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AdminLayout pageTitle="Platform Settings">
      {/* Configuration Error Alert */}
      {configError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-red-900">Configuration Error</h4>
            <p className="text-sm text-red-700 mt-1">{configError}</p>
          </div>
        </div>
      )}

      {/* Commission & Fee Settings */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Commission & Fee Settings</h3>
            <p className="text-sm text-gray-500 mt-1">
              Real-time commission rates synchronized across all portals
            </p>
          </div>
          {configLoading && (
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          )}
        </div>

        <div className="space-y-6">
          {/* Platform Commission Rate */}
          <div className="border-b border-gray-200 pb-4">
            <Label htmlFor="platformRate" className="text-base font-medium text-gray-900">
              Platform Commission Rate
            </Label>
            <p className="text-sm text-gray-500 mt-1 mb-3">
              Percentage charged on each booking (currently: {rates ? (rates.platform * 100).toFixed(1) : '...'}%)
            </p>
            <div className="flex items-center gap-3">
              <Input
                id="platformRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={platformRate}
                onChange={(e) => setPlatformRate(parseFloat(e.target.value) || 0)}
                className="w-32"
                disabled={isUpdating || configLoading}
              />
              <span className="text-gray-600">%</span>
              <Button
                onClick={() => handleUpdateRate('platform', platformRate)}
                disabled={isUpdating || configLoading || !rates || platformRate === rates.platform * 100}
                size="sm"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Rate'
                )}
              </Button>
            </div>
          </div>

          {/* Agent Commission Rate */}
          <div className="border-b border-gray-200 pb-4">
            <Label htmlFor="agentRate" className="text-base font-medium text-gray-900">
              Agent Commission Rate
            </Label>
            <p className="text-sm text-gray-500 mt-1 mb-3">
              Percentage paid to agents (currently: {rates ? (rates.agent * 100).toFixed(1) : '...'}%)
            </p>
            <div className="flex items-center gap-3">
              <Input
                id="agentRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={agentRate}
                onChange={(e) => setAgentRate(parseFloat(e.target.value) || 0)}
                className="w-32"
                disabled={isUpdating || configLoading}
              />
              <span className="text-gray-600">%</span>
              <Button
                onClick={() => handleUpdateRate('agent', agentRate)}
                disabled={isUpdating || configLoading || !rates || agentRate === rates.agent * 100}
                size="sm"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Rate'
                )}
              </Button>
            </div>
          </div>

          {/* Platform Fixed Fee */}
          <div className="border-b border-gray-200 pb-4">
            <Label htmlFor="platformFee" className="text-base font-medium text-gray-900">
              Platform Fixed Fee
            </Label>
            <p className="text-sm text-gray-500 mt-1 mb-3">
              Fixed fee per booking in GHS (currently: {platformFee} GHS)
            </p>
            <div className="flex items-center gap-3">
              <Input
                id="platformFee"
                type="number"
                min="0"
                step="10"
                value={platformFee}
                onChange={(e) => setPlatformFee(parseFloat(e.target.value) || 0)}
                className="w-32"
                disabled={isUpdating || configLoading}
              />
              <span className="text-gray-600">GHS</span>
              <Button
                onClick={() => handleUpdateFee(platformFee)}
                disabled={isUpdating || configLoading}
                size="sm"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Fee'
                )}
              </Button>
            </div>
          </div>

          {/* Read-only rates for reference */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Payment Gateway Rates (Read-only)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Paystack Rate:</span>
                <span className="font-medium text-gray-900">
                  {rates ? (rates.paystack * 100).toFixed(2) : '...'}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">VAT Rate:</span>
                <span className="font-medium text-gray-900">
                  {rates ? (rates.vat * 100).toFixed(2) : '...'}%
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              These rates are set by payment providers and cannot be modified
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
