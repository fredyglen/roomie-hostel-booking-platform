import { BaseEntity } from './common';
import { PaymentStatus } from './booking';
import { Property } from './property';

export type PaymentMethod = 'mobile_money' | 'bank' | 'bank_transfer' | 'ussd' | 'qr';
export type MobileMoneyNetwork = 'mtn' | 'vodafone' | 'airtel';
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

export interface PaystackConfig {
  email: string;
  amount: number;
  currency?: string;
  reference?: string;
  metadata?: Record<string, unknown>;
  callback_url?: string;
  plan?: string;
  channels?: string[];
  split_code?: string;
  subaccount?: string;
}

export interface PaystackResponse {
  status: boolean;
  message: string;
  data?: Record<string, unknown>;
}

export interface PaymentInitResult {
  success: boolean;
  message?: string;
  paymentData?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
  error?: unknown;
}

export interface PaymentVerificationResult {
  success: boolean;
  message?: string;
  data?: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: Record<string, unknown>;
    log: unknown;
    fees: number;
    fees_split: unknown;
    authorization: unknown;
    customer: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      customer_code: string;
      phone: string;
      metadata: unknown;
      risk_action: string;
    };
  };
  error?: unknown;
}

export interface PaymentData {
  amount: number;
  email: string;
  reference: string;
  metadata?: Record<string, unknown>;
  onSuccess: (transaction: PaymentTransaction) => void;
  onCancel: () => void;
}

export interface PaymentTransaction {
  reference: string;
  status: 'success' | 'failed' | 'pending';
  amount: number;
  currency: string;
  transaction_date: string;
  id?: number;
}

export type TransactionStatus = 
  | 'pending' 
  | 'success' 
  | 'failed' 
  | 'refunded';
