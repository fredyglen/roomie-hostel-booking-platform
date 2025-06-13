import { supabase } from '@/lib/supabase';
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
      ErrorHandler.handle(error,