/**
 * Comprehensive validation schemas for ROOMi platform
 * Uses Zod for type-safe validation
 */

import { z } from 'zod';

// Common validation patterns
const phoneRegex = /^(\+233|0)[2-9]\d{8}$/; // Ghana phone number format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Custom validation messages
const messages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid Ghana phone number',
  password: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be no more than ${max} characters`,
  positive: 'Must be a positive number',
  future: 'Date must be in the future',
  past: 'Date must be in the past',
};

// Base schemas
export const emailSchema = z
  .string({ required_error: messages.required })
  .min(1, messages.required)
  .regex(emailRegex, messages.email)
  .transform(val => val.toLowerCase().trim());

export const phoneSchema = z
  .string({ required_error: messages.required })
  .min(1, messages.required)
  .regex(phoneRegex, messages.phone)
  .transform(val => val.replace(/\s+/g, ''));

export const passwordSchema = z
  .string({ required_error: messages.required })
  .min(8, messages.minLength(8))
  .regex(passwordRegex, messages.password);

export const nameSchema = z
  .string({ required_error: messages.required })
  .min(2, messages.minLength(2))
  .max(50, messages.maxLength(50))
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
  .transform(val => val.trim());

export const urlSchema = z
  .string()
  .url('Please enter a valid URL')
  .optional()
  .or(z.literal(''));

// Authentication schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, messages.required),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  role: z.enum(['student', 'owner'], {
    required_error: 'Please select a role',
  }),
  university: z.string().min(1, messages.required).optional(),
  studentId: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
  token: z.string().min(1, 'Invalid reset token'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Profile schemas
export const profileUpdateSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema,
  bio: z.string().max(500, messages.maxLength(500)).optional(),
  university: z.string().optional(),
  program: z.string().optional(),
  yearOfStudy: z.string().optional(),
  emergencyContact: z.object({
    name: nameSchema,
    phone: phoneSchema,
    relationship: z.string().min(1, messages.required),
  }).optional(),
});

// Property schemas - aligned with unified Property interface
export const propertySchema = z.object({
  // Core identification
  name: z.string().min(5, messages.minLength(5)).max(100, messages.maxLength(100)),
  title: z.string().min(5, messages.minLength(5)).max(100, messages.maxLength(100)).optional(),
  description: z.string().min(20, messages.minLength(20)).max(2000, messages.maxLength(2000)),

  // Location
  address: z.string().min(10, messages.minLength(10)).max(200, messages.maxLength(200)),
  city: z.string().min(2, messages.minLength(2)),
  state: z.string().min(2, messages.minLength(2)),
  region: z.string().min(2, messages.minLength(2)),
  country: z.string().default('Ghana'),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),

  // Property classification
  type: z.enum(['hostel', 'homestel', 'apartment', 'shared_room'], {
    required_error: 'Please select a property type',
  }),
  propertyCategory: z.enum(['Hostel', 'Homestel', 'Apartment']).optional(),
  status: z.enum(['available', 'occupied', 'maintenance', 'inactive']).default('available'),

  // Physical features
  bedrooms: z.number().int().min(1).max(20),
  bathrooms: z.number().int().min(1).max(20),
  maxOccupants: z.number().int().min(1).max(50),

  // Pricing
  price: z.number().positive(messages.positive),
  rent: z.number().positive(messages.positive).optional(),
  pricePerMonth: z.number().positive(messages.positive).optional(),
  pricePerSemester: z.number().positive(messages.positive).optional(),
  pricePerYear: z.number().positive(messages.positive).optional(),
  currency: z.string().default('GHS'),

  // Location features
  distanceToCampus: z.number().positive().optional(),
  nearestUniversity: z.string().optional(),

  // Features and amenities
  amenities: z.array(z.string()).default([]),
  rules: z.array(z.string()).default([]),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),

  // Availability
  availableFrom: z.string().datetime().optional(),
  availableTo: z.string().datetime().optional(),
  isActive: z.boolean().default(true),
  is_available: z.boolean().default(true),
  allowPets: z.boolean().default(false),
  allowSmoking: z.boolean().default(false),
  wifiIncluded: z.boolean().default(false),
  utilitiesIncluded: z.boolean().default(false),
  securityDeposit: z.number().min(0).optional(),
  minimumStay: z.number().int().min(1).optional(), // in months
});

// Booking schemas
export const bookingSchema = z.object({
  propertyId: z.string().uuid('Invalid property ID'),
  roomId: z.string().optional(),
  checkInDate: z.string().datetime(),
  checkOutDate: z.string().datetime(),
  guestCount: z.number().int().min(1).max(20),
  duration: z.number().int().min(1), // in months
  totalAmount: z.number().positive(),
  emergencyContact: z.object({
    name: nameSchema,
    phone: phoneSchema,
    relationship: z.string().min(1, messages.required),
  }),
  specialRequests: z.string().max(500, messages.maxLength(500)).optional(),
  termsAgreed: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
}).refine(data => {
  const checkIn = new Date(data.checkInDate);
  const checkOut = new Date(data.checkOutDate);
  return checkOut > checkIn;
}, {
  message: 'Check-out date must be after check-in date',
  path: ['checkOutDate'],
});

// Payment schemas
export const paymentSchema = z.object({
  amount: z.number().positive(messages.positive),
  currency: z.string().default('GHS'),
  paymentMethod: z.enum(['mobile_money', 'bank_transfer']),
  mobileMoneyNetwork: z.enum(['mtn', 'vodafone', 'airtel']).optional(),
  phoneNumber: phoneSchema.optional(),
  email: emailSchema,
  reference: z.string().min(1, messages.required),
  metadata: z.record(z.unknown()).optional(),
});

// Search schemas
export const propertySearchSchema = z.object({
  query: z.string().max(100, messages.maxLength(100)).optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  propertyType: z.enum(['apartment', 'house', 'hostel', 'shared_room']).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  bedrooms: z.number().int().min(1).max(20).optional(),
  bathrooms: z.number().int().min(1).max(20).optional(),
  maxDistance: z.number().min(0).optional(), // km from campus
  amenities: z.array(z.string()).optional(),
  availableFrom: z.string().datetime().optional(),
  sortBy: z.enum(['price_asc', 'price_desc', 'distance', 'rating', 'newest']).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

// Contact/Support schemas
export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  subject: z.string().min(5, messages.minLength(5)).max(100, messages.maxLength(100)),
  message: z.string().min(20, messages.minLength(20)).max(1000, messages.maxLength(1000)),
  category: z.enum(['general', 'technical', 'billing', 'property', 'booking']),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

// Review schemas
export const reviewSchema = z.object({
  propertyId: z.string().uuid('Invalid property ID'),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(5, messages.minLength(5)).max(100, messages.maxLength(100)),
  comment: z.string().min(20, messages.minLength(20)).max(1000, messages.maxLength(1000)),
  wouldRecommend: z.boolean(),
  categories: z.object({
    cleanliness: z.number().int().min(1).max(5),
    location: z.number().int().min(1).max(5),
    value: z.number().int().min(1).max(5),
    communication: z.number().int().min(1).max(5),
    amenities: z.number().int().min(1).max(5),
  }),
});

// File upload schemas
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  maxSize: z.number().default(5 * 1024 * 1024), // 5MB
  allowedTypes: z.array(z.string()).default(['image/jpeg', 'image/png', 'image/webp']),
}).refine(data => data.file.size <= data.maxSize, {
  message: 'File size exceeds maximum allowed size',
}).refine(data => data.allowedTypes.includes(data.file.type), {
  message: 'File type not allowed',
});

// Export type definitions
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
export type PropertyFormData = z.infer<typeof propertySchema>;
export type BookingFormData = z.infer<typeof bookingSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
export type PropertySearchData = z.infer<typeof propertySearchSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type FileUploadData = z.infer<typeof fileUploadSchema>;
