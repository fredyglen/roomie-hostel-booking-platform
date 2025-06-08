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
} 