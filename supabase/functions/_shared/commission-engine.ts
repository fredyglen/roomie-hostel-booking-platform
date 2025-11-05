/**
 * ✅ DENO-COMPATIBLE CENTRALIZED COMMISSION ENGINE
 * 
 * Server-side commission calculation for Supabase Edge Functions
 * Reads from commission_configurations table for real-time rates
 * 
 * @module commission-engine
 * @version 1.0.0
 * @security CRITICAL - Revenue integrity depends on this module
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface CommissionRates {
  platform: number;    // e.g., 0.05 for 5%
  agent: number;       // e.g., 0.037 for 3.7%
  paystack: number;    // e.g., 0.0195 for 1.95%
  vat: number;         // e.g., 0.125 for 12.5%
}

export interface PlatformFees {
  fixed: number;           // e.g., 100 GHS
  agentMinimum: number;    // e.g., 100 GHS
}

export interface CommissionCalculationResult {
  baseAmount: number;
  platformCommission: number;
  platformFixedFee: number;
  agentCommission: number;
  paystackFee: number;
  vatAmount: number;
  totalAmount: number;
  ownerReceives: number;
  breakdown: {
    subtotal: number;
    beforeVat: number;
    totalFees: number;
  };
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface RatesInfo {
  rates: CommissionRates | null;
  fees: PlatformFees | null;
  version?: string;
  lastLoaded?: Date;
}

// ============================================================================
// DEFAULT CONFIGURATION (Fallback)
// ============================================================================

const DEFAULT_RATES: CommissionRates = {
  platform: 0.05,      // 5%
  agent: 0.037,        // 3.7%
  paystack: 0.0195,    // 1.95%
  vat: 0.125           // 12.5%
};

const DEFAULT_FEES: PlatformFees = {
  fixed: 100,          // 100 GHS
  agentMinimum: 100    // 100 GHS
};

// ============================================================================
// SERVER COMMISSION ENGINE CLASS
// ============================================================================

export class ServerCommissionEngine {
  private rates: CommissionRates | null = null;
  private fees: PlatformFees | null = null;
  private version: string | null = null;
  private lastLoaded: Date | null = null;
  private cacheTimeout = 60000; // 1 minute cache

  /**
   * Load commission rates from database
   * Uses 1-minute cache to minimize database queries
   * Falls back to default rates on error
   */
  async loadRates(supabase: ReturnType<typeof createClient>): Promise<void> {
    // Check cache validity
    if (this.rates && this.lastLoaded && 
        (Date.now() - this.lastLoaded.getTime()) < this.cacheTimeout) {
      console.log('✅ Using cached commission rates', {
        age: `${Math.round((Date.now() - this.lastLoaded.getTime()) / 1000)}s`,
        version: this.version
      });
      return; // Use cached rates
    }

    try {
      const { data, error } = await supabase
        .from('commission_configurations')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        // Check if it's a "no rows" error (PGRST116)
        if (error.code === 'PGRST116') {
          console.warn('⚠️  No active commission configuration found, using defaults');
        } else {
          console.error('❌ Failed to load commission rates from database:', error);
        }
        
        // Fall back to default rates
        this.rates = DEFAULT_RATES;
        this.fees = DEFAULT_FEES;
        this.version = 'default-fallback';
        this.lastLoaded = new Date();
        return;
      }

      // Successfully loaded from database
      this.rates = {
        platform: data.platform_rate,
        agent: data.agent_rate,
        paystack: data.paystack_rate,
        vat: data.vat_rate
      };

      this.fees = {
        fixed: data.platform_fixed_fee,
        agentMinimum: data.agent_minimum_fee
      };

      this.version = data.version;
      this.lastLoaded = new Date();
      
      console.log('✅ Commission rates loaded from database:', {
        version: this.version,
        environment: data.environment,
        platform: `${(this.rates.platform * 100).toFixed(2)}%`,
        agent: `${(this.rates.agent * 100).toFixed(2)}%`,
        paystack: `${(this.rates.paystack * 100).toFixed(2)}%`,
        vat: `${(this.rates.vat * 100).toFixed(2)}%`,
        fixedFee: `${this.fees.fixed} GHS`,
        agentMinimum: `${this.fees.agentMinimum} GHS`
      });
    } catch (error) {
      console.error('❌ Unexpected error loading commission rates:', error);
      
      // Fall back to default rates
      this.rates = DEFAULT_RATES;
      this.fees = DEFAULT_FEES;
      this.version = 'default-fallback';
      this.lastLoaded = new Date();
    }
  }

  /**
   * Calculate comprehensive commission breakdown
   * 
   * @param baseAmount - Property rent (base amount before commissions)
   * @param includeAgent - Whether to include agent commission
   * @returns Complete commission breakdown
   * @throws Error if rates not loaded or invalid base amount
   */
  calculateCommissions(
    baseAmount: number,
    includeAgent: boolean = false
  ): CommissionCalculationResult {
    // Validate rates are loaded
    if (!this.rates || !this.fees) {
      throw new Error('Commission rates not loaded. Call loadRates() first.');
    }

    // Validate base amount
    if (baseAmount <= 0) {
      throw new Error(`Base amount must be positive, got: ${baseAmount}`);
    }

    if (!Number.isFinite(baseAmount)) {
      throw new Error(`Base amount must be a finite number, got: ${baseAmount}`);
    }

    // Core commission calculations
    const platformCommission = baseAmount * this.rates.platform;
    const platformFixedFee = this.fees.fixed;
    const agentCommission = includeAgent 
      ? Math.max(baseAmount * this.rates.agent, this.fees.agentMinimum)
      : 0;

    // Subtotal before payment processing and VAT
    const subtotal = baseAmount + platformCommission + platformFixedFee + agentCommission;
    
    // Payment processing fee (calculated on subtotal)
    const paystackFee = subtotal * this.rates.paystack;
    
    // Amount before VAT
    const beforeVat = subtotal + paystackFee;
    
    // VAT calculation (applied to everything)
    const vatAmount = beforeVat * this.rates.vat;
    
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
   * Validate client-provided commission breakdown against server calculation
   * 
   * @param serverCalculated - Server-side calculated commissions
   * @param clientProvided - Client-provided commission breakdown
   * @param tolerance - Tolerance for rounding errors (default: 0.01 GHS = 1 pesewa)
   * @returns Validation result with errors if any
   */
  validateCommissionBreakdown(
    serverCalculated: CommissionCalculationResult,
    clientProvided: Partial<CommissionCalculationResult>,
    tolerance: number = 0.01
  ): ValidationResult {
    const errors: string[] = [];

    // Helper function to check field
    const checkField = (
      fieldName: keyof CommissionCalculationResult,
      serverValue: number,
      clientValue: number | undefined
    ) => {
      if (clientValue !== undefined) {
        const diff = Math.abs(serverValue - clientValue);
        if (diff > tolerance) {
          errors.push(
            `${fieldName} mismatch: server=${serverValue.toFixed(2)} GHS, ` +
            `client=${clientValue.toFixed(2)} GHS, diff=${diff.toFixed(2)} GHS`
          );
        }
      }
    };

    // Validate critical fields
    checkField('totalAmount', serverCalculated.totalAmount, clientProvided.totalAmount);
    checkField('platformCommission', serverCalculated.platformCommission, clientProvided.platformCommission);
    checkField('platformFixedFee', serverCalculated.platformFixedFee, clientProvided.platformFixedFee);
    checkField('agentCommission', serverCalculated.agentCommission, clientProvided.agentCommission);
    checkField('paystackFee', serverCalculated.paystackFee, clientProvided.paystackFee);
    checkField('vatAmount', serverCalculated.vatAmount, clientProvided.vatAmount);

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get current rates and fees (for logging/debugging)
   */
  getCurrentRates(): RatesInfo {
    return {
      rates: this.rates,
      fees: this.fees,
      version: this.version || undefined,
      lastLoaded: this.lastLoaded || undefined
    };
  }

  /**
   * Check if rates are loaded and valid
   */
  isReady(): boolean {
    return this.rates !== null && this.fees !== null;
  }

  /**
   * Force cache invalidation (for testing)
   */
  invalidateCache(): void {
    this.lastLoaded = null;
    console.log('🔄 Commission rates cache invalidated');
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Singleton instance of ServerCommissionEngine
 * Use this instance across all Edge Function invocations
 */
export const serverCommissionEngine = new ServerCommissionEngine();

