/**
 * ✅ REAL-TIME COMMISSION CONFIGURATION HOOK - BE CONSCIOUS COMPLIANCE
 * 
 * React hook for real-time commission configuration updates across all portals
 * 
 * Features:
 * - Automatic subscription to commission rate changes
 * - Real-time updates without page refresh
 * - Portal-specific configuration management
 * - Instant Paystack integration synchronization
 * - Apple-Grade error handling and logging
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { centralizedCommissionEngine, type CommissionConfiguration, type CommissionRates } from '@/config/centralized-commission.config';
import { logger } from '@/utils/enhanced-logger';

interface UseRealTimeCommissionConfigOptions {
  portal: 'student' | 'owner' | 'admin' | 'paystack';
  autoSubscribe?: boolean;
  onConfigChange?: (config: CommissionConfiguration) => void;
  onError?: (error: Error) => void;
}

interface CommissionConfigState {
  config: CommissionConfiguration | null;
  rates: CommissionRates | null;
  isLoading: boolean;
  isConnected: boolean;
  lastUpdated: string | null;
  error: string | null;
  subscriberCount: number;
}

export const useRealTimeCommissionConfig = (options: UseRealTimeCommissionConfigOptions) => {
  const {
    portal,
    autoSubscribe = true,
    onConfigChange,
    onError
  } = options;

  // State management
  const [state, setState] = useState<CommissionConfigState>({
    config: null,
    rates: null,
    isLoading: true,
    isConnected: false,
    lastUpdated: null,
    error: null,
    subscriberCount: 0
  });

  // Refs for cleanup
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const portalIdRef = useRef<string>(`${portal}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  /**
   * ✅ HANDLE CONFIGURATION UPDATES
   */
  const handleConfigUpdate = useCallback((newConfig: CommissionConfiguration) => {
    try {
      setState(prev => ({
        ...prev,
        config: newConfig,
        rates: centralizedCommissionEngine.getCommissionRates(),
        lastUpdated: newConfig.lastUpdated,
        error: null,
        isLoading: false
      }));

      // Call external callback if provided
      if (onConfigChange) {
        onConfigChange(newConfig);
      }

      logger.info(`✅ ${portal} portal received real-time commission config update`, {
        version: newConfig.version,
        lastUpdated: newConfig.lastUpdated,
        portalId: portalIdRef.current
      });

    } catch (error: any) {
      const errorMessage = `Failed to handle config update in ${portal} portal: ${error.message}`;
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      
      if (onError) {
        onError(new Error(errorMessage));
      }
      
      logger.error(`❌ ${portal} portal config update failed`, { error, portalId: portalIdRef.current });
    }
  }, [portal, onConfigChange, onError]);

  /**
   * ✅ SUBSCRIBE TO REAL-TIME UPDATES
   */
  const subscribe = useCallback(() => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Subscribe to real-time updates
      const unsubscribe = centralizedCommissionEngine.subscribeToConfigChanges(
        portalIdRef.current,
        portal,
        handleConfigUpdate
      );

      unsubscribeRef.current = unsubscribe;

      // Load initial configuration
      const initialRates = centralizedCommissionEngine.getCommissionRates();
      const configInfo = centralizedCommissionEngine.getConfigurationInfo();

      setState(prev => ({
        ...prev,
        rates: initialRates,
        isConnected: true,
        isLoading: false,
        subscriberCount: configInfo.subscriberCount,
        lastUpdated: configInfo.lastUpdated
      }));

      logger.info(`✅ ${portal} portal subscribed to real-time commission updates`, {
        portalId: portalIdRef.current,
        subscriberCount: configInfo.subscriberCount
      });

    } catch (error: any) {
      const errorMessage = `Failed to subscribe ${portal} portal to commission updates: ${error.message}`;
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false, isConnected: false }));
      
      if (onError) {
        onError(new Error(errorMessage));
      }
      
      logger.error(`❌ ${portal} portal subscription failed`, { error, portalId: portalIdRef.current });
    }
  }, [portal, handleConfigUpdate, onError]);

  /**
   * ✅ UNSUBSCRIBE FROM UPDATES
   */
  const unsubscribe = useCallback(() => {
    try {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }

      setState(prev => ({
        ...prev,
        isConnected: false,
        subscriberCount: 0
      }));

      logger.info(`✅ ${portal} portal unsubscribed from commission updates`, {
        portalId: portalIdRef.current
      });

    } catch (error: any) {
      logger.error(`❌ ${portal} portal unsubscribe failed`, { error, portalId: portalIdRef.current });
    }
  }, [portal]);

  /**
   * ✅ REFRESH CONFIGURATION
   */
  const refreshConfig = useCallback(() => {
    try {
      const rates = centralizedCommissionEngine.getCommissionRates();
      const configInfo = centralizedCommissionEngine.getConfigurationInfo();

      setState(prev => ({
        ...prev,
        rates,
        subscriberCount: configInfo.subscriberCount,
        lastUpdated: configInfo.lastUpdated,
        error: null
      }));

      logger.info(`✅ ${portal} portal configuration refreshed`, {
        portalId: portalIdRef.current,
        version: configInfo.version
      });

    } catch (error: any) {
      const errorMessage = `Failed to refresh ${portal} portal configuration: ${error.message}`;
      setState(prev => ({ ...prev, error: errorMessage }));
      
      if (onError) {
        onError(new Error(errorMessage));
      }
      
      logger.error(`❌ ${portal} portal refresh failed`, { error, portalId: portalIdRef.current });
    }
  }, [portal, onError]);

  /**
   * ✅ CALCULATE COMMISSIONS WITH CURRENT RATES
   */
  const calculateCommissions = useCallback((baseAmount: number, includeAgent: boolean = true) => {
    try {
      return centralizedCommissionEngine.calculateCommissions(baseAmount, includeAgent);
    } catch (error: any) {
      logger.error(`❌ Commission calculation failed in ${portal} portal`, { 
        error, 
        baseAmount, 
        includeAgent,
        portalId: portalIdRef.current 
      });
      throw error;
    }
  }, [portal]);

  /**
   * ✅ GET PORTAL-SPECIFIC COMMISSION RATES
   */
  const getPortalRates = useCallback(() => {
    if (!state.rates) return null;

    switch (portal) {
      case 'student':
        // Students see total cost breakdown
        return {
          platform: state.rates.platform,
          agent: state.rates.agent,
          paystack: state.rates.paystack,
          vat: state.rates.vat
        };
      
      case 'owner':
        // Owners see deductions from their earnings
        return {
          platform: state.rates.platform,
          agent: state.rates.agent
        };
      
      case 'admin':
        // Admins see all rates
        return state.rates;
      
      case 'paystack':
        // Paystack integration sees payment processing rates
        return {
          paystack: state.rates.paystack,
          vat: state.rates.vat
        };
      
      default:
        return state.rates;
    }
  }, [portal, state.rates]);

  // ✅ AUTO-SUBSCRIBE ON MOUNT
  useEffect(() => {
    if (autoSubscribe) {
      subscribe();
    }

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, [autoSubscribe, subscribe, unsubscribe]);

  return {
    // State
    ...state,
    
    // Actions
    subscribe,
    unsubscribe,
    refreshConfig,
    calculateCommissions,
    
    // Portal-specific data
    portalRates: getPortalRates(),
    portalId: portalIdRef.current,
    
    // Utilities
    isSubscribed: state.isConnected,
    hasError: !!state.error,
    isRealTimeEnabled: state.isConnected && !state.error
  };
};
