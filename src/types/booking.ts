
import { Property } from './property';
import { User } from './core';

export interface Booking {
  id: string;
  propertyId: string;
  property?: Property;
  roomId: string;
  studentId: string;
  student?: User;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  totalAmount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  paymentDetails?: PaymentDetails;
  createdAt: string;
  updatedAt: string;
  emergencyContact?: EmergencyContact;
  notes?: string;
}

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'REJECTED';

export type PaymentStatus =
  | 'PENDING'
  | 'PARTIAL'
  | 'PAID'
  | 'REFUNDED'
  | 'FAILED';

export interface PaymentDetails {
  reference: string;
  method: PaymentMethod;
  paidAmount: number;
  paidAt?: string;
  transactionId?: string;
  receiptUrl?: string;
}

export type PaymentMethod =
  | 'card'
  | 'mobile_money'
  | 'bank_transfer'
  | 'ussd'
  | 'qr';

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface BookingFormValues {
  propertyId: string;
  roomId: string;
  startDate: string;
  endDate: string;
  emergencyContact: EmergencyContact;
  notes?: string;
}

export type BookingInsert = Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'property' | 'student'>;


// -- Payment flow shared types --
export interface PaystackVerificationData {
  reference: string;
  amount: number;
  customer: Record<string, unknown>;
  channel: string;
  id: number;
  metadata?: Record<string, unknown>;
}

export interface ModernPaymentSuccessResult {
  reference: string;
  status: 'success' | 'failed' | 'pending' | string;
  amount?: number;
  transaction: {
    reference: string;
    amount: number;
    status: 'success' | 'failed' | 'pending' | string;
  };
  verification?: PaystackVerificationData;
}

export interface ConfirmedBookingData {
  id: string;
  booking_reference: string;
  payment_reference: string;
  total_amount: number;
  status: 'confirmed' | 'pending' | 'failed' | string;
  package_type?: string;
  start_date?: string;
  end_date?: string;
}
