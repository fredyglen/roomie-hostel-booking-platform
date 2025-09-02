// Booking related type definitions
// Property and User types are imported where needed

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIAL';

export type PaymentMethod = 
  | 'card' 
  | 'mobile_money' 
  | 'bank_transfer' 
  | 'ussd' 
  | 'qr';

export type MobileMoneyNetwork = 'mtn' | 'vodafone' | 'airtel';
export type Currency = 'GHS' | 'NGN' | 'USD' | 'ZAR' | 'KES';

export interface BookingPayment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: string;
  reference: string;
  date: string;
}

export interface Booking {
  id: string;
  property_id: string;
  room_id?: string;
  student_id: string;
  start_date: string;
  end_date: string;
  status: BookingStatus;
  payment_status: PaymentStatus;
  total_amount: number;
  deposit_amount?: number;
  payment_details?: Record<string, unknown>;
  notes?: string;
  created_at: string;
  updated_at: string;
  property?: Record<string, unknown>; // Property data from join
  student?: Record<string, unknown>; // Student data from join
  payments?: BookingPayment[];
}

export type BookingInsert = Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'property' | 'student' | 'payments'>;
export type BookingUpdate = Partial<Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'property' | 'student' | 'payments'>>;

export interface PaymentDetails {
  reference: string;
  method: PaymentMethod;
  paidAmount: number;
  paidAt?: string;
  transactionId?: string;
  receiptUrl?: string;
}

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
  checkInDate?: string;
  checkOutDate?: string;
  guestCount?: number;
  roomType?: string;
  duration?: string;
  durationType?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  emergencyPhone?: string;
  specialRequests?: string;
  roommates?: RoommateInfo[];
  idType?: string;
  studentId?: string;
  university?: string;
  program?: string;
  idImage?: File | string; // File for upload, string for URL
  termsAgreed?: boolean;
}

export interface RoommateInfo {
  id?: string;
  name: string;
  email: string;
  phone: string;
  university: string;
  studentId: string;
  program: string;
  yearOfStudy: string;
}

// Payment types
export interface Transaction {
  id: string;
  booking_id: string;
  amount: number;
  currency: Currency;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  reference: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface PaymentData {
  amount: number;
  email: string;
  reference: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentConfig {
  publicKey: string;
  currency: string;
  channels: string[];
  onSuccess: (reference: string) => void;
  onCancel: () => void;
  onError: (error: unknown) => void;
  onClose?: () => void;
}

export interface RefundRequest {
  transactionId: string;
  amount?: number;
  reason: string;
  isFullRefund: boolean;
}
