
// Security-safe configuration - only client-safe keys included
export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    // SECURITY: Service role key removed from client-side config
  },
  paystack: {
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    baseUrl: import.meta.env.VITE_PAYSTACK_BASE_URL || 'https://api.paystack.co',
  },
  app: {
    baseUrl: import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5173',
    imageCdnUrl: import.meta.env.VITE_IMAGE_CDN_URL || '',
    defaultPageSize: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE || '10'),
    maxPageSize: parseInt(import.meta.env.VITE_MAX_PAGE_SIZE || '100'),
    maxImageSize: parseInt(import.meta.env.VITE_MAX_IMAGE_SIZE || '5242880'), // 5MB
  },
  business: {
    platformCommissionRate: parseFloat(import.meta.env.VITE_PLATFORM_COMMISSION_RATE || '0.05'),
    agentCommissionRate: parseFloat(import.meta.env.VITE_AGENT_COMMISSION_RATE || '0.10'),
    agentMinimumFee: parseFloat(import.meta.env.VITE_AGENT_MINIMUM_FEE || '50'),
    paystackFeeRate: parseFloat(import.meta.env.VITE_PAYSTACK_FEE_RATE || '0.015'),
    bookingFeeRate: parseFloat(import.meta.env.VITE_BOOKING_FEE_RATE || '0.02'),
  },
};

// Validation function to ensure required environment variables are present
export function validateConfig(): void {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
  ];

  const missing = requiredVars.filter((key) => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  console.log('✅ Configuration validated successfully');
}

// Initialize validation
validateConfig();
