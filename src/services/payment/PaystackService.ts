import { config } from '@/config';
import { ErrorHandler } from '@/utils/ErrorHandler';
import { logger } from '@/utils/enhanced-logger';
import { supabase } from '@/integrations/supabase/client';
import crypto from 'crypto';

// Comprehensive type definitions
export interface PaystackTransactionInitParams {
  email: string;
  amount: number; // in base currency (e.g., GHS)
  currency?: 'GHS' | 'NGN' | 'USD';
  reference?: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
  channels?: Array<'card' | 'bank' | 'ussd' | 'qr' | 'mobile_money' | 'bank_transfer'>;
  split_code?: string;
  subaccount?: string;
}

export interface PaystackTransactionResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerificationResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: Record<string, unknown>;
    customer: {
      id: number;
      first_name: string | null;
      last_name: string | null;
      email: string;
      phone: string | null;
      metadata: Record<string, unknown> | null;
    };
  };
}

export interface PaystackWebhookEvent {
  event: string;
  data: PaystackVerificationResponse['data'];
}

export class PaystackService {
  private static baseUrl = config.paystack.baseUrl;
  private static publicKey = config.paystack.publicKey;
  private static secretKey = import.meta.env.VITE_PAYSTACK_SECRET_KEY || '';
  
  /**
   * Validates Paystack configuration
   * @throws Error if configuration is invalid
   */
  private static validateConfig(): void {
    if (!this.publicKey || this.publicKey === 'pk_test_placeholder') {
      throw new Error('Paystack public key is not configured');
    }
    
    if (!this.publicKey.startsWith('pk_test_') && !this.publicKey.startsWith('pk_live_')) {
      throw new Error('Invalid Paystack public key format');
    }
    
    if (!this.secretKey && import.meta.env.PROD) {
      logger.warn('Paystack secret key is not configured. Webhook validation will be disabled.');
    }
  }
  
  /**
   * Initializes a transaction via Paystack API
   */
  public static async initializeTransaction(
    params: PaystackTransactionInitParams
  ): Promise<PaystackTransactionResponse> {
    try {
      this.validateConfig();
      
      // Convert amount to smallest currency unit (e.g., pesewas)
      const amount = Math.round(params.amount * 100);
      
      // Generate reference if not provided
      const reference = params.reference || this.generateReference();
      
      const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.secretKey || this.publicKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...params,
          amount,
          reference
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to initialize transaction');
      }
      
      const data = await response.json() as PaystackTransactionResponse;
      
      // Log successful initialization
      logger.info('Payment initialized successfully', {
        reference,
        amount: params.amount,
        email: params.email
      });
      
      return data;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      ErrorHandler.handle(err, 'Failed to initialize Paystack transaction');
      throw err;
    }
  }
  
  /**
   * Verifies a transaction using its reference
   */
  public static async verifyTransaction(reference: string): Promise<PaystackVerificationResponse> {
    try {
      this.validateConfig();
      
      const response = await fetch(`${this.baseUrl}/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.secretKey || this.publicKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Transaction verification failed');
      }
      
      const data = await response.json() as PaystackVerificationResponse;
      
      // Log verification result
      logger.info('Payment verification completed', {
        reference,
        status: data.data.status,
        amount: data.data.amount / 100
      });
      
      return data;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      ErrorHandler.handle(err, 'Failed to verify Paystack transaction');
      throw err;
    }
  }
  
  /**
   * Validates a webhook signature from Paystack
   */
  public static validateWebhookSignature(signature: string, payload: string): boolean {
    if (!this.secretKey) {
      logger.warn('Cannot validate webhook: Secret key not configured');
      return false;
    }
    
    const hash = crypto
      .createHmac('sha512', this.secretKey)
      .update(payload)
      .digest('hex');
      
    return hash === signature;
  }
  
  /**
   * Processes a webhook event from Paystack
   */
  public static async processWebhookEvent(
    event: PaystackWebhookEvent
  ): Promise<void> {
    try {
      // Handle different event types
      switch (event.event) {
        case 'charge.success':
          await this.handleSuccessfulPayment(event.data);
          break;
        case 'transfer.success':
          await this.handleSuccessfulTransfer(event.data);
          break;
        case 'transfer.failed':
          await this.handleFailedTransfer(event.data);
          break;
        default:
          logger.info(`Unhandled Paystack event: ${event.event}`, { 
            reference: event.data.reference 
          });
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      ErrorHandler.handle(err, 'Failed to process Paystack webhook');
      throw err;
    }
  }
  
  /**
   * Handles a successful payment event
   */
  private static async handleSuccessfulPayment(
    data: PaystackVerificationResponse['data']
  ): Promise<void> {
    try {
      // Update transaction in database
      const { error } = await supabase
        .from('transactions')
        .update({
          status: 'success',
          payment_date: data.paid_at,
          payment_channel: data.channel,
          payment_method: data.channel,
          gateway_response: data.gateway_response,
          updated_at: new Date().toISOString()
        })
        .eq('reference', data.reference);
      
      if (error) {
        throw new Error(`Failed to update transaction: ${error.message}`);
      }
      
      logger.info('Payment recorded successfully', {
        reference: data.reference,
        amount: data.amount / 100
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      ErrorHandler.handle(err, 'Failed to handle successful payment');
      throw err;
    }
  }
  
  /**
   * Handles a successful transfer event
   */
  private static async handleSuccessfulTransfer(
    data: PaystackVerificationResponse['data']
  ): Promise<void> {
    // Implementation for transfer success
    logger.info('Transfer successful', { reference: data.reference });
  }
  
  /**
   * Handles a failed transfer event
   */
  private static async handleFailedTransfer(
    data: PaystackVerificationResponse['data']
  ): Promise<void> {
    // Implementation for transfer failure
    logger.warn('Transfer failed', { 
      reference: data.reference,
      reason: data.gateway_response
    });
  }
  
  /**
   * Generates a unique payment reference
   */
  public static generateReference(prefix: string = 'ROOMI'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}_${timestamp}_${random}`;
  }
  
  /**
   * Converts currency to smallest unit (e.g., GHS to pesewas)
   */
  public static convertToSmallestUnit(amount: number): number {
    return Math.round(amount * 100);
  }
  
  /**
   * Validates payment amount against limits
   */
  public static validatePaymentAmount(amount: number): boolean {
    return amount > 0 && amount <= 50000; // Max ₵50,000 per transaction
  }
}