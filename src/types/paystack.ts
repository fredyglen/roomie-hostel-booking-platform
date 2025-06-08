import { Currency } from './payment';

export interface PaystackConfig {
  key: string;
  email: string;
  amount: number;
  currency: Currency;
  ref: string;
  callback: (response: PaystackResponse) => void;
  onClose: () => void;
}

export interface PaystackResponse {
  reference: string;
  trans: string;
  status: string;
  message: string;
  transaction: string;
  trxref: string;
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
    message: string;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: Currency;
    ip_address: string;
    metadata: Record<string, unknown>;
    log: Record<string, unknown>;
    fees: number;
    fees_split: Record<string, unknown>;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
    };
    customer: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      customer_code: string;
      phone: string;
      metadata: Record<string, unknown>;
      risk_action: string;
    };
    plan: null;
    split: Record<string, unknown>;
    order_id: null;
    paidAt: string;
    createdAt: string;
    requested_amount: number;
    pos_transaction_data: null;
    source: null;
    fees_breakdown: null;
    transaction_date: string;
    plan_object: Record<string, unknown>;
    subaccount: Record<string, unknown>;
  };
} 