
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface Amenity {
  id: string;
  name: string;
}

// Global window extension for Paystack
declare global {
  interface Window {
    PaystackPop?: any;
  }
}
