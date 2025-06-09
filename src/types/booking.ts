
import { BaseEntity } from './common';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Booking extends BaseEntity {
  property_id: string;
  user_id: string;
  check_in: string;
  check_out: string;
  status: BookingStatus;
  payment_status: PaymentStatus;
  total_amount: number;
  room_type: string;
  guest_count: number;
  special_requests?: string;
  transaction_id?: string;
  payment_reference?: string;
  booking_reference?: string;
}

export interface ConfirmedBookingData {
  id: string;
  booking_reference: string;
  payment_reference: string;
  total_amount: number;
  status: string;
  package_type?: string;
  start_date?: string;
  end_date?: string;
  [key: string]: any;
}

export interface ModernPaymentSuccessResult {
  reference: string;
  amount?: number;
  status?: string;
  transaction: MinimalPaystackTransaction;
  verification: PaystackVerificationData;
  [key: string]: any;
}

export interface PaymentVerificationData {
  success: boolean;
  verification?: {
    [key: string]: unknown;
    amount?: number;
    reference?: string;
    channel?: string;
  };
  booking?: {
    id: any;
    package_type?: string;
    start_date?: string;
    end_date?: string;
    [key: string]: unknown;
  } | null;
  error?: string;
}

export interface TestPaymentResult {
  reference: string;
  amount: number;
  status: string;
}

export interface PaystackVerificationData {
  [key: string]: unknown;
  amount?: number;
  reference?: string;
  channel?: string;
}

export interface MinimalPaystackTransaction {
  reference: string;
  amount: number;
  status: string;
}
