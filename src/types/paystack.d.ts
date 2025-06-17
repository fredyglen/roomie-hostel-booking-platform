
// Paystack TypeScript declarations
declare module '@paystack/inline-js' {
  interface PaystackTransaction {
    reference: string;
    status: string;
    amount: number;
    currency: string;
    paid_at?: string;
    channel?: string;
    [key: string]: unknown;
  }

  interface PaystackConfig {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    ref?: string;
    channels?: string[];
    metadata?: Record<string, unknown>;
    onSuccess: (transaction: PaystackTransaction) => void;
    onCancel: () => void;
    onClose?: () => void;
  }

  interface PaystackInstance {
    openIframe(): void;
    newTransaction(config: PaystackConfig): void;
  }

  interface PaystackPop {
    setup(config: PaystackConfig): PaystackInstance;
  }

  const PaystackPop: PaystackPop;
  export default PaystackPop;
}

declare global {
  interface Window {
    PaystackPop?: PaystackPop;
  }
}

export interface PaystackPopup {
  resumeTransaction(accessCode: string, options?: {
    onSuccess?: (transaction: PaystackTransaction) => void;
    onCancel?: () => void;
  }): void;
}

export {};
