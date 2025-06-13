import { supabase } from '@/integrations/supabase/client';
import { config } from '@/config';
import { logger } from '@/utils/enhanced-logger';
import { ErrorHandler } from '@/utils/ErrorHandler';
import type { PaymentTransaction } from '@/types/payment';

interface CreatePaymentRecord {
  userId: string;
  amount: number;
  reference: string;
  description: string;
  metadata?: Record<string, unknown>;
}

interface UpdatePaymentStatus {
  reference: string;
  status: 'success' | 'failed' | 'pending';
  transactionId?: string;
  paymentDate?: string;
}

/**
 * Service for handling payment-related operations
 */
export const PaymentService = {
  /**
   * Create a new payment record in the database
   */
  async createPaymentRecord({
    userId,
    amount,
    reference,
    description,
    metadata
  }: CreatePaymentRecord): Promise<{ id: string } | null> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert({
          user_id: userId,
          amount,
          reference,
          description,
          status: 'pending',
          metadata
        })
        .select('id')
        .single();

      if (error) {
        throw error;
      }

      logger.info('Payment record created', { reference, userId });
      return data;
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to create payment record');
      return null;
    }
  },

  /**
   * Update payment status after processing
   */
  async updatePaymentStatus({
    reference,
    status,
    transactionId,
    paymentDate
  }: UpdatePaymentStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('payments')
        .update({
          status,
          transaction_id: transactionId,
          payment_date: paymentDate || new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('reference', reference);

      if (error) {
        throw error;
      }

      logger.info('Payment status updated', { reference, status });
      return true;
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to update payment status');
      return false;
    }
  },

  /**
   * Handle webhook notification from payment provider
   */
  async handlePaymentWebhook(payload: any): Promise<boolean> {
    try {
      // Validate webhook signature
      if (!this.validateWebhookSignature(payload)) {
        logger.warn('Invalid webhook signature', { event: payload.event });
        return false;
      }

      // Process based on event type
      switch (payload.event) {
        case 'charge.success':
          return await this.processSuccessfulPayment(payload.data);
        case 'charge.failed':
          return await this.processFailedPayment(payload.data);
        default:
          logger.info('Unhandled webhook event', { event: payload.event });
          return true; // Return true for events we don't need to process
      }
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to process payment webhook');
      return false;
    }
  },

  /**
   * Process successful payment notification
   */
  async processSuccessfulPayment(data: PaymentTransaction): Promise<boolean> {
    try {
      // Update payment record
      const updated = await this.updatePaymentStatus({
        reference: data.reference,
        status: 'success',
        transactionId: data.id?.toString(),
        paymentDate: data.transaction_date
      });

      if (!updated) {
        throw new Error(`Failed to update payment record for reference: ${data.reference}`);
      }

      // Get payment details to determine what was paid for
      const { data: paymentData, error } = await supabase
        .from('payments')
        .select('id, metadata, user_id')
        .eq('reference', data.reference)
        .single();

      if (error) {
        throw error;
      }

      // Process based on payment type
      if (paymentData.metadata?.type === 'booking') {
        await this.processBookingPayment(paymentData);
      } else if (paymentData.metadata?.type === 'subscription') {
        await this.processSubscriptionPayment(paymentData);
      }

      return true;
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to process successful payment');
      return false;
    }
  },

  /**
   * Process failed payment notification
   */
  async processFailedPayment(data: PaymentTransaction): Promise<boolean> {
    try {
      // Update payment record
      await this.updatePaymentStatus({
        reference: data.reference,
        status: 'failed',
        transactionId: data.id?.toString(),
        paymentDate: data.transaction_date
      });

      // Get payment details
      const { data: paymentData, error } = await supabase
        .from('payments')
        .select('id, metadata, user_id')
        .eq('reference', data.reference)
        .single();

      if (error) {
        throw error;
      }

      // Send notification to user about failed payment
      await this.sendPaymentFailureNotification(paymentData.user_id, data.reference);

      return true;
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to process failed payment');
      return false;
    }
  },

  /**
   * Process booking payment
   */
  async processBookingPayment(paymentData: any): Promise<void> {
    try {
      const bookingId = paymentData.metadata?.bookingId;
      
      if (!bookingId) {
        throw new Error('Booking ID not found in payment metadata');
      }

      // Update booking status
      const { error } = await supabase
        .from('bookings')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) {
        throw error;
      }

      // Send confirmation notification
      await this.sendBookingConfirmationNotification(paymentData.user_id, bookingId);
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to process booking payment');
      throw error;
    }
  },

  /**
   * Process subscription payment
   */
  async processSubscriptionPayment(paymentData: any): Promise<void> {
    try {
      const userId = paymentData.user_id;
      const planId = paymentData.metadata?.planId;
      
      if (!planId) {
        throw new Error('Plan ID not found in payment metadata');
      }

      // Get subscription plan details
      const { data: planData, error: planError } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (planError) {
        throw planError;
      }

      // Calculate expiry date
      const now = new Date();
      let expiryDate = new Date();
      
      switch (planData.billing_cycle) {
        case 'monthly':
          expiryDate.setMonth(now.getMonth() + 1);
          break;
        case 'quarterly':
          expiryDate.setMonth(now.getMonth() + 3);
          break;
        case 'yearly':
          expiryDate.setFullYear(now.getFullYear() + 1);
          break;
        default:
          expiryDate.setMonth(now.getMonth() + 1);
      }

      // Update or create subscription
      const { error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: userId,
          plan_id: planId,
          status: 'active',
          starts_at: now.toISOString(),
          expires_at: expiryDate.toISOString(),
          updated_at: now.toISOString()
        });

      if (subscriptionError) {
        throw subscriptionError;
      }

      // Send confirmation notification
      await this.sendSubscriptionConfirmationNotification(userId, planId);
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to process subscription payment');
      throw error;
    }
  },

  /**
   * Send booking confirmation notification
   */
  async sendBookingConfirmationNotification(userId: string, bookingId: string): Promise<void> {
    try {
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: 'booking_confirmed',
          title: 'Booking Confirmed',
          message: `Your booking #${bookingId} has been confirmed.`,
          data: { bookingId },
          read: false
        });
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to send booking confirmation notification');
    }
  },

  /**
   * Send subscription confirmation notification
   */
  async sendSubscriptionConfirmationNotification(userId: string, planId: string): Promise<void> {
    try {
      // Get plan name
      const { data: planData, error: planError } = await supabase
        .from('subscription_plans')
        .select('name')
        .eq('id', planId)
        .single();

      if (planError) {
        throw planError;
      }

      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: 'subscription_activated',
          title: 'Subscription Activated',
          message: `Your ${planData.name} subscription has been activated.`,
          data: { planId },
          read: false
        });
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to send subscription confirmation notification');
    }
  },

  /**
   * Send payment failure notification
   */
  async sendPaymentFailureNotification(userId: string, reference: string): Promise<void> {
    try {
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: 'payment_failed',
          title: 'Payment Failed',
          message: `Your payment (ref: ${reference}) has failed. Please try again or contact support.`,
          data: { reference },
          read: false
        });
    } catch (error) {
      ErrorHandler.handle(error, 'Failed to send payment failure notification');
    }
  },

  /**
   * Validate webhook signature
   */
  validateWebhookSignature(payload: any): boolean {
    // In a real implementation, this would verify the signature from headers
    // For now, we'll just do basic validation
    return !!payload && !!payload.event && !!payload.data;
  }
};
