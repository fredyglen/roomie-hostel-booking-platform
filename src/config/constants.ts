
// Application configuration constants
export const APP_CONFIG = {
  // API Configuration
  SUPABASE: {
    URL: import.meta.env.VITE_SUPABASE_URL || '',
    ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  },
  
  // Payment Configuration
  PAYSTACK: {
    PUBLIC_KEY: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '',
    BASE_URL: import.meta.env.VITE_PAYSTACK_BASE_URL || 'https://api.paystack.co',
    CURRENCY: 'GHS' as const,
    CHANNELS: ['card', 'mobile_money', 'bank', 'ussd', 'qr'] as const
  },
  
  // UI Configuration
  PAGINATION: {
    DEFAULT_PAGE_SIZE: Number(import.meta.env.VITE_DEFAULT_PAGE_SIZE) || 10,
    MAX_PAGE_SIZE: Number(import.meta.env.VITE_MAX_PAGE_SIZE) || 100
  },
  
  // Media Configuration
  MEDIA: {
    MAX_IMAGE_SIZE: Number(import.meta.env.VITE_MAX_IMAGE_SIZE) || 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm']
  },
  
  // Feature Flags
  FEATURES: {
    ENABLE_NOTIFICATIONS: true,
    ENABLE_ANALYTICS: import.meta.env.PROD === true,
    ENABLE_OFFLINE_MODE: false
  }
}
