
// Paystack configuration and utilities
export const PAYSTACK_CONFIG = {
  publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder',
  currency: 'GHS',
  channels: ['card', 'mobile_money', 'bank'],
  scriptUrl: 'https://js.paystack.co/v2/inline.js'
};

// Load Paystack script
export const loadPaystackScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).PaystackPop) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = PAYSTACK_CONFIG.scriptUrl;
    script.async = true;
    
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    
    document.body.appendChild(script);
  });
};

// Initialize Paystack
export const initializePaystack = async () => {
  const loaded = await loadPaystackScript();
  if (!loaded) {
    throw new Error('Failed to load Paystack script');
  }
  return (window as any).PaystackPop;
};

// Paystack supported countries and currencies
export const SUPPORTED_CURRENCIES = {
  GHS: { name: 'Ghana Cedi', symbol: '₵', subunit: 'pesewa', factor: 100 },
  NGN: { name: 'Nigerian Naira', symbol: '₦', subunit: 'kobo', factor: 100 },
  USD: { name: 'US Dollar', symbol: '$', subunit: 'cent', factor: 100 },
  ZAR: { name: 'South African Rand', symbol: 'R', subunit: 'cent', factor: 100 },
  KES: { name: 'Kenyan Shilling', symbol: 'Ksh', subunit: 'cent', factor: 100 }
};

// Convert amount to subunits (e.g., cedis to pesewas)
export const convertToSubunits = (amount: number, currency: string = 'GHS'): number => {
  const currencyConfig = SUPPORTED_CURRENCIES[currency as keyof typeof SUPPORTED_CURRENCIES];
  if (!currencyConfig) {
    throw new Error(`Unsupported currency: ${currency}`);
  }
  return Math.round(amount * currencyConfig.factor);
};

// Convert from subunits to main units
export const convertFromSubunits = (amount: number, currency: string = 'GHS'): number => {
  const currencyConfig = SUPPORTED_CURRENCIES[currency as keyof typeof SUPPORTED_CURRENCIES];
  if (!currencyConfig) {
    throw new Error(`Unsupported currency: ${currency}`);
  }
  return amount / currencyConfig.factor;
};

// Validate payment amount limits
export const validateAmount = (amount: number, currency: string = 'GHS'): boolean => {
  const limits = {
    GHS: { min: 0.10, max: 50000 },
    NGN: { min: 50, max: 10000000 },
    USD: { min: 2, max: 100000 },
    ZAR: { min: 1, max: 100000 },
    KES: { min: 1, max: 1000000 }
  };

  const limit = limits[currency as keyof typeof limits];
  if (!limit) return false;

  return amount >= limit.min && amount <= limit.max;
};
