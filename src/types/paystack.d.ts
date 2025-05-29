
// Paystack TypeScript declarations
declare global {
  interface Window {
    PaystackPop?: any;
  }
}

export interface PaystackPopup {
  resumeTransaction(accessCode: string, options?: {
    onSuccess?: (transaction: any) => void;
    onCancel?: () => void;
  }): void;
}

export {};
