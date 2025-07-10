/**
 * ✅ ENHANCED PAYSTACK SERVICE - REAL-TIME COMMISSION INTEGRATION
 * 
 * BE CONSCIOUS Apple-Grade Paystack Integration with Real-Time Commission Updates
 * 
 * Features:
 * - Real-time commission rate synchronization
 * - Automatic payment calculation updates
 * - Instant rate change reflection
 * - Enterprise-level error handling
 * - Commission-aware payment processing
 */

import { centralizedCommissionEngine, type CommissionCalculationResult } from '@/config/centralized-commission.config';
import { useRealTimeCommissionConfig } from '@/hooks/useRealTimeCommissionConfig';
import { logger } from '@/utils/enhanced-logger';

interface PaystackPaymentData {
  email: string;
  amount: number; // Base amount in kobo (GHS * 100)
  currency: string;
  reference: string;
  callback_url?: string;
  metadata?: {
    booking_id?: string;
    property_id?: string;
    user_id?: string;
    commission_breakdown?: CommissionCalculationResult;
  };
}

interface EnhancedPaystackResponse {
  success: boolean;
  data?: any;
  error?: string;
  commission_breakdown?: CommissionCalculationResult;
  total_amount_kobo?: number;
  base_amount_kobo?: number;
}

class EnhancedPaystackService {
  private commissionRates: any = null;
  private isSubscribed: boolean = false;
  private readonly portalId: string;

  constructor() {
    this.portalId = `paystack_service_${Date.now()}`;
    this.initializeRealTimeCommission();
  }

  /**
   * ✅ INITIALIZE REAL-TIME COMMISSION UPDATES
   */
  private initializeRealTimeCommission(): void {
    try {
      // Subscribe to real-time commission updates
      const unsubscribe = centralizedCommissionEngine.subscribeToConfigChanges(
        this.portalId,
        'paystack',
        (config) => {
          this.handleCommissionUpdate(config);
        }
      );

      // Load initial rates
      this.commissionRates = centralizedCommissionEngine.getCommissionRates();
      this.isSubscribed = true;

      logger.info('✅ Enhanced Paystack Service initialized with real-time commission updates', {
        portalId: this.portalId,
        paystackRate: this.commissionRates.paystack * 100,
        vatRate: this.commissionRates.vat * 100
      });

    } catch (error) {
      logger.error('❌ Failed to initialize Paystack real-time commission updates', error);
      // Fallback to static rates
      this.commissionRates = centralizedCommissionEngine.getCommissionRates();
    }
  }

  /**
   * ✅ HANDLE REAL-TIME COMMISSION UPDATES
   */
  private handleCommissionUpdate(config: any): void {
    try {
      this.commissionRates = centralizedCommissionEngine.getCommissionRates();
      
      logger.info('✅ Paystack service received real-time commission update', {
        portalId: this.portalId,
        newPaystackRate: this.commissionRates.paystack * 100,
        newVatRate: this.commissionRates.vat * 100,
        version: config.version
      });

    } catch (error) {
      logger.error('❌ Failed to handle Paystack commission update', error);
    }
  }

  /**
   * ✅ CALCULATE PAYMENT AMOUNT WITH REAL-TIME COMMISSION RATES
   */
  calculatePaymentAmount(baseAmountGHS: number, includeAgent: boolean = true): CommissionCalculationResult {
    try {
      if (!this.commissionRates) {
        throw new Error('Commission rates not loaded');
      }

      // Use real-time commission engine for calculations
      const breakdown = centralizedCommissionEngine.calculateCommissions(baseAmountGHS, includeAgent);

      logger.info('✅ Payment amount calculated with real-time commission rates', {
        baseAmount: baseAmountGHS,
        totalAmount: breakdown.totalAmount,
        paystackFee: breakdown.paystackFee,
        vatAmount: breakdown.vatAmount,
        includeAgent
      });

      return breakdown;

    } catch (error: any) {
      logger.error('❌ Failed to calculate payment amount', { error, baseAmountGHS, includeAgent });
      throw new Error(`Payment calculation failed: ${error.message}`);
    }
  }

  /**
   * ✅ PREPARE PAYSTACK PAYMENT DATA WITH COMMISSION BREAKDOWN
   */
  preparePaymentData(
    email: string,
    baseAmountGHS: number,
    reference: string,
    includeAgent: boolean = true,
    metadata?: any
  ): PaystackPaymentData {
    try {
      // Calculate with real-time commission rates
      const commissionBreakdown = this.calculatePaymentAmount(baseAmountGHS, includeAgent);
      
      // Convert to kobo (GHS * 100)
      const totalAmountKobo = Math.round(commissionBreakdown.totalAmount * 100);

      const paymentData: PaystackPaymentData = {
        email,
        amount: totalAmountKobo,
        currency: 'GHS',
        reference,
        metadata: {
          ...metadata,
          commission_breakdown: commissionBreakdown,
          base_amount_ghs: baseAmountGHS,
          total_amount_ghs: commissionBreakdown.totalAmount,
          paystack_fee_ghs: commissionBreakdown.paystackFee,
          vat_amount_ghs: commissionBreakdown.vatAmount,
          commission_version: centralizedCommissionEngine.getConfigurationInfo().version
        }
      };

      logger.info('✅ Paystack payment data prepared with real-time commission rates', {
        reference,
        baseAmountGHS,
        totalAmountKobo,
        commissionVersion: paymentData.metadata?.commission_version
      });

      return paymentData;

    } catch (error: any) {
      logger.error('❌ Failed to prepare Paystack payment data', { error, email, baseAmountGHS, reference });
      throw new Error(`Payment preparation failed: ${error.message}`);
    }
  }

  /**
   * ✅ INITIALIZE PAYSTACK PAYMENT WITH REAL-TIME RATES
   */
  async initializePayment(paymentData: PaystackPaymentData): Promise<EnhancedPaystackResponse> {
    try {
      // Ensure we have the latest commission rates
      if (!this.isSubscribed) {
        this.initializeRealTimeCommission();
      }

      // Make Paystack API call
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();

      if (response.ok && result.status) {
        logger.info('✅ Paystack payment initialized successfully with real-time commission rates', {
          reference: paymentData.reference,
          amount: paymentData.amount,
          commissionVersion: paymentData.metadata?.commission_version
        });

        return {
          success: true,
          data: result.data,
          commission_breakdown: paymentData.metadata?.commission_breakdown,
          total_amount_kobo: paymentData.amount,
          base_amount_kobo: Math.round((paymentData.metadata?.base_amount_ghs || 0) * 100)
        };
      } else {
        throw new Error(result.message || 'Paystack initialization failed');
      }

    } catch (error: any) {
      logger.error('❌ Paystack payment initialization failed', { error, reference: paymentData.reference });
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * ✅ VERIFY PAYMENT WITH COMMISSION VALIDATION
   */
  async verifyPayment(reference: string): Promise<EnhancedPaystackResponse> {
    try {
      const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY}`,
        }
      });

      const result = await response.json();

      if (response.ok && result.status) {
        // Validate commission calculations if metadata exists
        const metadata = result.data.metadata;
        if (metadata?.commission_breakdown) {
          const currentBreakdown = this.calculatePaymentAmount(
            metadata.base_amount_ghs,
            true // Assume agent commission included
          );

          // Check if commission rates have changed since payment
          const ratesDiffer = Math.abs(
            currentBreakdown.totalAmount - metadata.commission_breakdown.totalAmount
          ) > 0.01; // Allow 1 pesewa difference

          if (ratesDiffer) {
            logger.warn('⚠️ Commission rates changed since payment initialization', {
              reference,
              originalTotal: metadata.commission_breakdown.totalAmount,
              currentTotal: currentBreakdown.totalAmount
            });
          }
        }

        logger.info('✅ Paystack payment verified successfully', {
          reference,
          amount: result.data.amount,
          status: result.data.status
        });

        return {
          success: true,
          data: result.data
        };
      } else {
        throw new Error(result.message || 'Payment verification failed');
      }

    } catch (error: any) {
      logger.error('❌ Paystack payment verification failed', { error, reference });
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * ✅ GET CURRENT COMMISSION RATES FOR PAYSTACK
   */
  getCurrentRates(): { paystack: number; vat: number; version: string } {
    const rates = this.commissionRates || centralizedCommissionEngine.getCommissionRates();
    const info = centralizedCommissionEngine.getConfigurationInfo();
    
    return {
      paystack: rates.paystack * 100, // Return as percentage
      vat: rates.vat * 100, // Return as percentage
      version: info.version
    };
  }

  /**
   * ✅ CHECK REAL-TIME CONNECTION STATUS
   */
  getConnectionStatus(): {
    isSubscribed: boolean;
    portalId: string;
    lastUpdate: string;
  } {
    const info = centralizedCommissionEngine.getConfigurationInfo();
    
    return {
      isSubscribed: this.isSubscribed,
      portalId: this.portalId,
      lastUpdate: info.lastUpdated
    };
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const enhancedPaystackService = new EnhancedPaystackService();

// Export types
export type {
  PaystackPaymentData,
  EnhancedPaystackResponse
};
