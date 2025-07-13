/**
 * ✅ ENHANCED CENTRALIZED COMMISSION CONFIGURATION SYSTEM - BE CONSCIOUS COMPLIANCE
 *
 * Apple-Grade Single Source of Truth with Real-Time Updates
 * "Phone Number Dial" Simplicity for Commission Rate Changes
 */

import { logger } from '@/utils/enhanced-logger';
import { supabase } from '@/integrations/supabase/client';

// BRANDED TYPES FOR COMPILE-TIME SAFETY
type CommissionRate = number & { readonly __brand: 'CommissionRate' };
type PlatformFee = number & { readonly __brand: 'PlatformFee' };

const createCommissionRate = (rate: number): CommissionRate => {
  if (rate < 0 || rate > 1) {
    throw new Error(`Commission rate must be between 0 and 1, got: ${rate}`);
  }
  return rate as CommissionRate;
};

const createPlatformFee = (fee: number): PlatformFee => {
  if (fee < 0) {
    throw new Error(`Platform fee must be non-negative, got: ${fee}`);
  }
  return fee as PlatformFee;
};

// SINGLE SOURCE OF TRUTH FOR ALL COMMISSION CALCULATIONS
const AUTHORITATIVE_COMMISSION_CONFIG: CommissionConfiguration = {
  rates: {
    platform: createCommissionRate(0.05),    // 5% - DEFINITIVE RATE
    agent: createCommissionRate(0.037),      // 3.7% - DEFINITIVE RATE  
    paystack: createCommissionRate(0.0195),  // 1.95% - Paystack standard
    vat: createCommissionRate(0.125)         // 12.5% - Ghana VAT rate
  },
  fees: {
    fixed: createPlatformFee(100),           // 100 GHS - DEFINITIVE FEE
    agentMinimum: createPlatformFee(100)     // 100 GHS - DEFINITIVE MINIMUM
  },
  // Additional configuration...
} as const;

// ============================================================================
// COMMISSION CALCULATION ENGINE
// ============================================================================

interface CommissionCalculationResult {
  readonly baseAmount: number;
  readonly platformCommission: number;
  readonly platformFixedFee: number;
  readonly agentCommission: number;
  readonly paystackFee: number;
  readonly vatAmount: number;
  readonly totalAmount: number;
  readonly ownerReceives: number;
  readonly breakdown: {
    readonly subtotal: number;
    readonly beforeVat: number;
    readonly totalFees: number;
  };
}

class CentralizedCommissionEngine {
  private config: CommissionConfiguration;
  private subscribers: Map<string, ConfigurationSubscriber> = new Map();
  private changeHistory: ConfigurationChangeEvent[] = [];
  private isInitialized: boolean = false;

  constructor() {
    this.config = AUTHORITATIVE_COMMISSION_CONFIG;
    this.initializeRealTimeConfig();
  }

  /**
   * ✅ REAL-TIME INITIALIZATION - BE CONSCIOUS COMPLIANCE
   * Initialize with database-stored configuration and real-time updates
   */
  private async initializeRealTimeConfig(): Promise<void> {
    try {
      // Load configuration from database
      await this.loadConfigurationFromDatabase();

      // Set up real-time listeners
      this.setupRealTimeListeners();

      // Validate configuration
      this.validateConfiguration();

      this.isInitialized = true;

      logger.info('✅ Enhanced Centralized Commission Engine initialized', {
        version: this.config.version,
        environment: this.config.environment,
        platformRate: this.config.rates.platform,
        agentRate: this.config.rates.agent,
        realTimeEnabled: true,
        subscriberCount: this.subscribers.size
      });
    } catch (error) {
      logger.error('❌ Failed to initialize commission engine', error);
      // Fallback to static configuration
      this.validateConfiguration();
      this.isInitialized = true;
    }
  }

  /**
   * ✅ "PHONE NUMBER DIAL" SIMPLICITY - UPDATE COMMISSION RATES
   *
   * Update commission rates with enterprise-level simplicity.
   * Single method call updates all portals and Paystack integration instantly.
   *
   * @param rateType - Type of rate to update
   * @param newRate - New rate value (as percentage, e.g., 5 for 5%)
   * @param changedBy - User making the change
   * @param reason - Optional reason for the change
   */
  async updateCommissionRate(
    rateType: 'platform' | 'agent' | 'paystack' | 'vat',
    newRate: number,
    changedBy: string,
    reason?: string
  ): Promise<void> {
    try {
      // Convert percentage to decimal
      const rateDecimal = newRate / 100;
      const oldRate = this.config.rates[rateType];

      // Validate new rate
      this.validateRateChange(rateType, rateDecimal);

      // Create change event
      const changeEvent: ConfigurationChangeEvent = {
        id: `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        changeType: 'commission_rate',
        field: rateType,
        oldValue: oldRate * 100, // Store as percentage
        newValue: newRate,
        changedBy,
        reason
      };

      // Update configuration
      this.config = {
        ...this.config,
        rates: {
          ...this.config.rates,
          [rateType]: createCommissionRate(rateDecimal)
        },
        lastUpdated: new Date().toISOString(),
        version: this.incrementVersion()
      };

      // Save to database
      await this.saveConfigurationToDatabase(changeEvent);

      // Notify all subscribers (real-time updates)
      this.notifySubscribers();

      // Log the change
      this.changeHistory.push(changeEvent);

      logger.info(`✅ Commission rate updated with phone-dial simplicity`, {
        rateType,
        oldRate: oldRate * 100,
        newRate,
        changedBy,
        reason,
        subscribersNotified: this.subscribers.size
      });

    } catch (error) {
      logger.error(`❌ Failed to update commission rate`, { rateType, newRate, error });
      throw error;
    }
  }

  /**
   * ✅ "PHONE NUMBER DIAL" SIMPLICITY - UPDATE PLATFORM FEES
   *
   * Update platform fees with enterprise-level simplicity.
   * Single method call updates all portals and Paystack integration instantly.
   *
   * @param feeType - Type of fee to update
   * @param newFee - New fee value (in GHS, e.g., 100 for 100 GHS)
   * @param changedBy - User making the change
   * @param reason - Optional reason for the change
   */
  async updatePlatformFee(
    feeType: 'fixed' | 'agentMinimum',
    newFee: number,
    changedBy: string,
    reason?: string
  ): Promise<void> {
    try {
      const oldFee = this.config.fees[feeType];

      // Validate new fee
      this.validateFeeChange(feeType, newFee);

      // Create change event
      const changeEvent: ConfigurationChangeEvent = {
        id: `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        changeType: 'platform_fee',
        field: feeType,
        oldValue: oldFee,
        newValue: newFee,
        changedBy,
        reason
      };

      // Update configuration
      this.config = {
        ...this.config,
        fees: {
          ...this.config.fees,
          [feeType]: createPlatformFee(newFee)
        },
        lastUpdated: new Date().toISOString(),
        version: this.incrementVersion()
      };

      // Save to database
      await this.saveConfigurationToDatabase(changeEvent);

      // Notify all subscribers (real-time updates)
      this.notifySubscribers();

      // Log the change
      this.changeHistory.push(changeEvent);

      logger.info(`✅ Platform fee updated with phone-dial simplicity`, {
        feeType,
        oldFee,
        newFee,
        changedBy,
        reason,
        subscribersNotified: this.subscribers.size
      });

    } catch (error: any) {
      logger.error(`❌ Failed to update platform fee`, { feeType, newFee, error });
      throw error;
    }
  }

  /**
   * ✅ REAL-TIME PORTAL SUBSCRIPTION
   *
   * Subscribe portals for instant configuration updates
   */
  subscribeToConfigChanges(
    portalId: string,
    portal: 'student' | 'owner' | 'admin' | 'paystack',
    callback: (config: CommissionConfiguration) => void
  ): () => void {
    const subscriber: ConfigurationSubscriber = {
      id: portalId,
      portal,
      callback
    };

    this.subscribers.set(portalId, subscriber);

    logger.info(`✅ Portal subscribed to real-time config updates`, {
      portalId,
      portal,
      totalSubscribers: this.subscribers.size
    });

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(portalId);
      logger.info(`Portal unsubscribed from config updates`, { portalId, portal });
    };
  }

  /**
   * Calculate comprehensive commission breakdown
   */
  calculateCommissions(baseAmount: number, includeAgent: boolean = true): CommissionCalculationResult {
    if (baseAmount <= 0) {
      throw new Error('Base amount must be positive');
    }

    // Core commission calculations
    const platformCommission = baseAmount * this.config.rates.platform;
    const platformFixedFee = this.config.fees.fixed;
    const agentCommission = includeAgent ? Math.max(
      baseAmount * this.config.rates.agent,
      this.config.fees.agentMinimum
    ) : 0;

    // Subtotal before payment processing and VAT
    const subtotal = baseAmount + platformCommission + platformFixedFee + agentCommission;
    
    // Payment processing fee (calculated on total)
    const paystackFee = subtotal * this.config.rates.paystack;
    
    // Amount before VAT
    const beforeVat = subtotal + paystackFee;
    
    // VAT calculation
    const vatAmount = beforeVat * this.config.rates.vat;
    
    // Final totals
    const totalAmount = beforeVat + vatAmount;
    const totalFees = platformCommission + platformFixedFee + agentCommission + paystackFee + vatAmount;
    const ownerReceives = baseAmount; // Owner gets the base amount, fees are additional

    return {
      baseAmount,
      platformCommission,
      platformFixedFee,
      agentCommission,
      paystackFee,
      vatAmount,
      totalAmount,
      ownerReceives,
      breakdown: {
        subtotal,
        beforeVat,
        totalFees
      }
    };
  }

  /**
   * Get commission rates for external use
   */
  getCommissionRates(): CommissionRates {
    return { ...this.config.rates };
  }

  /**
   * Get platform fees for external use
   */
  getPlatformFees(): PlatformFees {
    return { ...this.config.fees };
  }

  /**
   * Get currency configuration
   */
  getCurrencyConfig(): { currency: Currency; limits: Record<Currency, CurrencyLimits> } {
    return {
      currency: this.config.currency,
      limits: { ...this.config.currencyLimits }
    };
  }

  /**
   * Validate configuration integrity
   */
  private validateConfiguration(): void {
    const { rates, fees } = this.config;

    // Validate rates are within acceptable ranges
    if (rates.platform < 0.01 || rates.platform > 0.15) {
      throw new Error(`Platform commission rate out of range: ${rates.platform}`);
    }

    if (rates.agent < 0 || rates.agent > 0.10) {
      throw new Error(`Agent commission rate out of range: ${rates.agent}`);
    }

    if (fees.fixed < 0 || fees.fixed > 1000) {
      throw new Error(`Platform fixed fee out of range: ${fees.fixed}`);
    }

    logger.info('Commission configuration validated successfully');
  }

  /**
   * ✅ DATABASE PERSISTENCE - REAL-TIME CONFIGURATION STORAGE
   */
  private async loadConfigurationFromDatabase(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('commission_configurations')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      if (data) {
        // Load configuration from database
        this.config = {
          ...this.config,
          rates: {
            platform: createCommissionRate(data.platform_rate),
            agent: createCommissionRate(data.agent_rate),
            paystack: createCommissionRate(data.paystack_rate),
            vat: createCommissionRate(data.vat_rate)
          },
          fees: {
            fixed: createPlatformFee(data.platform_fixed_fee),
            agentMinimum: createPlatformFee(data.agent_minimum_fee)
          },
          lastUpdated: data.updated_at,
          version: data.version
        };

        logger.info('✅ Configuration loaded from database', {
          version: data.version,
          lastUpdated: data.updated_at
        });
      } else {
        // No configuration in database, save current as initial
        await this.saveConfigurationToDatabase();
        logger.info('✅ Initial configuration saved to database');
      }
    } catch (error) {
      logger.error('❌ Failed to load configuration from database', error);
      // Continue with static configuration
    }
  }

  /**
   * ✅ SAVE CONFIGURATION TO DATABASE
   */
  private async saveConfigurationToDatabase(changeEvent?: ConfigurationChangeEvent): Promise<void> {
    try {
      // Deactivate previous configurations
      await supabase
        .from('commission_configurations')
        .update({ is_active: false })
        .eq('is_active', true);

      // Insert new configuration
      const { error } = await supabase
        .from('commission_configurations')
        .insert({
          platform_rate: this.config.rates.platform,
          agent_rate: this.config.rates.agent,
          paystack_rate: this.config.rates.paystack,
          vat_rate: this.config.rates.vat,
          platform_fixed_fee: this.config.fees.fixed,
          agent_minimum_fee: this.config.fees.agentMinimum,
          currency: this.config.currency,
          version: this.config.version,
          is_active: true,
          change_event: changeEvent ? JSON.stringify(changeEvent) : null,
          environment: this.config.environment
        });

      if (error) throw error;

      logger.info('✅ Configuration saved to database', {
        version: this.config.version,
        hasChangeEvent: !!changeEvent
      });
    } catch (error) {
      logger.error('❌ Failed to save configuration to database', error);
      throw error;
    }
  }

  /**
   * ✅ REAL-TIME LISTENERS SETUP
   */
  private setupRealTimeListeners(): void {
    // Listen for configuration changes from other instances
    supabase
      .channel('commission_config_changes')
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'commission_configurations',
          filter: 'is_active=eq.true'
        },
        (payload) => {
          this.handleExternalConfigChange(payload.new);
        }
      )
      .subscribe();

    logger.info('✅ Real-time listeners established for commission configuration');
  }

  /**
   * ✅ HANDLE EXTERNAL CONFIGURATION CHANGES
   */
  private handleExternalConfigChange(newConfig: any): void {
    try {
      // Update local configuration
      this.config = {
        ...this.config,
        rates: {
          platform: createCommissionRate(newConfig.platform_rate),
          agent: createCommissionRate(newConfig.agent_rate),
          paystack: createCommissionRate(newConfig.paystack_rate),
          vat: createCommissionRate(newConfig.vat_rate)
        },
        fees: {
          fixed: createPlatformFee(newConfig.platform_fixed_fee),
          agentMinimum: createPlatformFee(newConfig.agent_minimum_fee)
        },
        lastUpdated: newConfig.updated_at,
        version: newConfig.version
      };

      // Notify all subscribers
      this.notifySubscribers();

      logger.info('✅ Configuration updated from external change', {
        version: newConfig.version,
        subscribersNotified: this.subscribers.size
      });
    } catch (error) {
      logger.error('❌ Failed to handle external config change', error);
    }
  }

  /**
   * ✅ NOTIFY ALL SUBSCRIBERS
   */
  private notifySubscribers(): void {
    this.subscribers.forEach((subscriber) => {
      try {
        subscriber.callback(this.config);
      } catch (error) {
        logger.error(`❌ Failed to notify subscriber ${subscriber.id}`, error);
      }
    });
  }

  /**
   * ✅ VALIDATE RATE CHANGES
   */
  private validateRateChange(rateType: string, newRate: number): void {
    switch (rateType) {
      case 'platform':
        if (newRate < 0.01 || newRate > 0.15) {
          throw new Error(`Platform commission rate must be between 1% and 15%, got: ${newRate * 100}%`);
        }
        break;
      case 'agent':
        if (newRate < 0 || newRate > 0.10) {
          throw new Error(`Agent commission rate must be between 0% and 10%, got: ${newRate * 100}%`);
        }
        break;
      case 'paystack':
        if (newRate < 0.01 || newRate > 0.05) {
          throw new Error(`Paystack fee rate must be between 1% and 5%, got: ${newRate * 100}%`);
        }
        break;
      case 'vat':
        if (newRate < 0 || newRate > 0.25) {
          throw new Error(`VAT rate must be between 0% and 25%, got: ${newRate * 100}%`);
        }
        break;
      default:
        throw new Error(`Unknown rate type: ${rateType}`);
    }
  }

  /**
   * ✅ VALIDATE FEE CHANGES
   */
  private validateFeeChange(feeType: string, newFee: number): void {
    switch (feeType) {
      case 'fixed':
        if (newFee < 0 || newFee > 1000) {
          throw new Error(`Platform fixed fee must be between 0 and 1000 GHS, got: ${newFee} GHS`);
        }
        break;
      case 'agentMinimum':
        if (newFee < 0 || newFee > 500) {
          throw new Error(`Agent minimum fee must be between 0 and 500 GHS, got: ${newFee} GHS`);
        }
        break;
      default:
        throw new Error(`Unknown fee type: ${feeType}`);
    }
  }

  /**
   * ✅ INCREMENT VERSION
   */
  private incrementVersion(): string {
    const [major, minor, patch] = this.config.version.split('.').map(Number);
    return `${major}.${minor}.${patch + 1}`;
  }

  /**
   * Get configuration metadata
   */
  getConfigurationInfo(): {
    version: string;
    lastUpdated: string;
    environment: string;
    subscriberCount: number;
    isRealTimeEnabled: boolean;
  } {
    return {
      version: this.config.version,
      lastUpdated: this.config.lastUpdated,
      environment: this.config.environment,
      subscriberCount: this.subscribers.size,
      isRealTimeEnabled: this.isInitialized
    };
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const centralizedCommissionEngine = new CentralizedCommissionEngine();

// Export types for external use
export type {
  CommissionRate,
  PlatformFee,
  Currency,
  CommissionRates,
  PlatformFees,
  CurrencyLimits,
  CommissionConfiguration,
  CommissionCalculationResult
};

export {
  createCommissionRate,
  createPlatformFee
};

// Export configuration for read-only access
export const COMMISSION_CONFIG = AUTHORITATIVE_COMMISSION_CONFIG;


