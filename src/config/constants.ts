
export const APP_CONFIG = {
  // API Configuration
  SUPABASE: {
    URL: 'https://ymqnbekeqarjmxftzvks.supabase.co',
    ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltcW5iZWtlcWFyam14ZnR6dmtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MDQzOTgsImV4cCI6MjA2MzI4MDM5OH0.X9FeOLvG4zDQkFyHP7evIXXzAiWnw5UbfwFv1E9UEVY'
  },
  
  // Payment Configuration
  PAYSTACK: {
    PUBLIC_KEY: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder',
    CURRENCY: 'GHS' as const,
    CHANNELS: ['card', 'mobile_money', 'bank', 'ussd', 'qr'] as const
  },
  
  // UI Configuration
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100
  },
  
  // Feature Flags
  FEATURES: {
    ENABLE_NOTIFICATIONS: true,
    ENABLE_ANALYTICS: false,
    ENABLE_OFFLINE_MODE: false
  },
  
  // Timeouts and Limits
  TIMEOUTS: {
    API_REQUEST: 30000,
    PAYMENT_PROCESSING: 120000,
    IMAGE_UPLOAD: 60000
  },
  
  // File Upload Limits
  UPLOAD: {
    MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    MAX_FILES_PER_PROPERTY: 10
  }
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  STUDENT: {
    DASHBOARD: '/student/dashboard',
    PROPERTIES: '/student/properties',
    PROPERTY_DETAIL: '/student/property/:id',
    BOOKING: '/student/book/:id',
    BOOKING_HISTORY: '/student/booking-history',
    PROFILE: '/student/profile'
  },
  OWNER: {
    DASHBOARD: '/owner/dashboard',
    PROPERTIES: '/owner/properties',
    PROPERTY_NEW: '/owner/property/new',
    PROPERTY_EDIT: '/owner/properties/:id/edit',
    BOOKINGS: '/owner/bookings',
    PROFILE: '/owner/profile'
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    PROPERTIES: '/admin/properties',
    USERS: '/admin/users',
    SETTINGS: '/admin/settings'
  }
} as const;
