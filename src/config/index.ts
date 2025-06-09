export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    serviceRoleKey: import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
  },
  paystack: {
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    secretKey: import.meta.env.VITE_PAYSTACK_SECRET_KEY,
    baseUrl: import.meta.env.VITE_PAYSTACK_BASE_URL || 'https://api.paystack.co',
  },
  app: {
    baseUrl: import.meta.env.VITE_APP_BASE_URL,
    imageCdnUrl: import.meta.env.VITE_IMAGE_CDN_URL,
    defaultPageSize: Number(import.meta.env.VITE_DEFAULT_PAGE_SIZE || 10),
    maxPageSize: Number(import.meta.env.VITE_MAX_PAGE_SIZE || 100),
    maxImageSize: Number(import.meta.env.VITE_MAX_IMAGE_SIZE || 5 * 1024 * 1024),
  },
  payment: {
    platformCommissionRate: Number(import.meta.env.VITE_PLATFORM_COMMISSION_RATE || 0.042),
    agentCommissionRate: Number(import.meta.env.VITE_AGENT_COMMISSION_RATE || 0.037),
    agentMinimumFee: Number(import.meta.env.VITE_AGENT_MINIMUM_FEE || 100),
    propertyOwnerRetention: Number(import.meta.env.VITE_PROPERTY_OWNER_RETENTION || 0.98),
    paystackFeeRate: Number(import.meta.env.VITE_PAYSTACK_FEE_RATE || 0.0195),
    bookingFeeRate: Number(import.meta.env.VITE_BOOKING_FEE_RATE || 0.02),
  },
}; 