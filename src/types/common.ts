
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface Amenity {
  id: string;
  name: string;
}

// User types
export interface User {
  id: string;
  email: string;
  role: 'owner' | 'student' | 'admin';
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  createdAt?: string;
}

// Booking related types
export interface BookingFormData {
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  roomType: string;
  duration: string;
  durationType: string;
  fullName: string;
  email: string;
  phone: string;
  emergencyPhone: string;
  specialRequests?: string;
  emergencyContact: EmergencyContact;
  roommates: RoommateInfo[];
  idType: string;
  studentId: string;
  university: string;
  program: string;
  idImage: File | FileList | null;
  termsAgreed: boolean;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
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
export interface PaymentData {
  amount: number;
  email: string;
  reference: string;
  metadata?: Record<string, unknown>;
}

// Building types
export interface Building extends BaseEntity {
  property_id: string;
  name: string;
  description?: string;
  floors_count: number;
}

// Log context type
export interface LogContext {
  [key: string]: unknown;
}

// Note: Paystack Window interface is declared in src/types/paystack.d.ts
