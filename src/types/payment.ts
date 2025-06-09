import { BaseEntity } from './common';
import { PaymentStatus } from './booking';
import { Property } from './property';

export type PaymentMethod = 'paystack' | 'bank_transfer' | 'cash';
export type Currency = 'GHS' | 'NGN' | 'USD' | 'ZAR' | 'KES';

export interface Transaction extends BaseEntity {
  booking_id: string;
  amount: number;
  currency: Currency;
  payment_method: PaymentMethod;
  status: PaymentStatus;
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

export interface PaymentCalculationConfig {
  agentCommissionRate?: number;
  platformCommissionRate?: number;
  propertyOwnerRetention?: number;
  paystackFeeRate?: number;
  paystackFixedFee?: number;
} 