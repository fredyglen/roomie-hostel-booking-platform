import { z } from 'zod';
import { PropertyType, PropertyCategory, PropertyStatus } from '@/types/property';
import {
  PropertyTitle,
  PropertyDescription,
  PropertyPrice,
  BedroomCount,
  WashroomCount,
  MaxOccupants,
  createPropertyTitle,
  createPropertyDescription,
  createPropertyPrice,
  createBedroomCount,
  createWashroomCount,
  createMaxOccupants
} from '@/types/apple-grade-foundation';

// Ghana regions enum
export const ghanaRegions = [
  'Greater Accra', 'Ashanti', 'Western', 'Eastern', 'Central', 
  'Northern', 'Upper East', 'Upper West', 'Volta', 'Brong-Ahafo',
  'Western North', 'Ahafo', 'Bono East', 'North East', 'Savannah', 'Oti'
] as const;

export type GhanaRegion = typeof ghanaRegions[number];

// Add string sanitization helper
const sanitizeString = (val: unknown) => typeof val === 'string' ? val.trim().replace(/<[^>]*>?/gm, '') : val;

// Property type validation aligned with unified Property interface
// ONLY these three property types
const propertyTypeSchema = z.enum(['hostel', 'homestel', 'apartment'] as const);
const propertyCategorySchema = z.enum(['Hostel', 'Homestel', 'Apartment'] as const);

// Room types - Comprehensive for all property categories
const roomTypeSchema = z.enum([
  // Hostel room types - Ghana standard "X in a room" system
  '1_in_a_room', '2_in_a_room', '3_in_a_room', '4_in_a_room', '5_in_a_room', '6_in_a_room',
  // Homestel room types
  'single_room', 'shared_room',
  // Apartment room types - bedroom-based units
  '1_bedroom_apartment', '2_bedroom_apartment', '3_bedroom_apartment'
] as const);

// Gender restriction
const genderTypeSchema = z.enum(['male', 'female', 'mixed'] as const);

// Semester periods - Ghana academic calendar
const semesterPeriodSchema = z.enum(['first_semester', 'second_semester'] as const);

// BE CONSCIOUS: Booking duration system - Ghana university standards compliance
const bookingDurationSchema = z.enum([
  'week',           // 1 week
  'month',          // 1 month
  'semester',       // 4 months (1 semester)
  'academic_year',  // 8 months (Ghana academic year - 2 semesters)
  'year',           // 12 months
  'custom'          // Custom duration for flexibility
] as const);

// BE CONSCIOUS: Redesigned washroom configuration types
const washroomLocationSchema = z.enum(['inside', 'outside'] as const);
const washroomSharingSchema = z.enum(['private', 'shared'] as const);

// Property status validation - aligned with PropertyStatus type
const propertyStatusSchema = z.enum(['available', 'unavailable', 'active', 'inactive', 'pending', 'rejected'] as const);

// Verification status validation
const verificationStatusSchema = z.enum(['pending', 'verified', 'rejected'] as const);

export const propertyFormSchema = z.object({
  // Core property identification - Apple-grade branded types
  name: z.preprocess(sanitizeString, z.string().min(1, 'Property name is required')).transform(createPropertyTitle),
  title: z.preprocess(sanitizeString, z.string().min(1, 'Title is required')).transform(createPropertyTitle),
  type: propertyTypeSchema,
  propertyCategory: propertyCategorySchema,
  status: propertyStatusSchema.default('available'),

  // Location information
  address: z.preprocess(sanitizeString, z.string().min(1, 'Address is required')),
  city: z.preprocess(sanitizeString, z.string().min(1, 'City is required')),
  state: z.preprocess(sanitizeString, z.string().min(1, 'State/Region is required')),
  region: z.enum(ghanaRegions),
  zip: z.preprocess(sanitizeString, z.string().optional()),
  nearest_university: z.preprocess(sanitizeString, z.string().min(1, 'Nearest university is required')),

  // BE CONSCIOUS: Enhanced pricing system with booking duration compliance
  booking_duration: bookingDurationSchema.default('semester'),
  custom_duration_weeks: z.number().min(1).max(52).optional(), // For custom duration

  // Dynamic pricing matrix based on room types and duration
  price: z.number().min(1, 'Price must be greater than 0').transform(createPropertyPrice),
  room_type_pricing: z.record(z.string(), z.number()).optional(), // Dynamic pricing per room type
  rent: z.number().min(1, 'Rent must be greater than 0').optional(),
  price_unit: bookingDurationSchema.default('semester'), // Aligned with booking_duration

  // Property description and details - Apple-grade branded types
  description: z.preprocess(sanitizeString, z.string().min(10, 'Description must be at least 10 characters')).transform(createPropertyDescription),
  distance_to_campus: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  house_rules: z.string().optional(),
  
  // Basic property stats - Apple-grade branded types
  bedrooms: z.number().min(1, "Must have at least 1 room").transform(createBedroomCount),
  bathrooms: z.number().min(1, "Must have at least 1 washroom").transform(createWashroomCount),

  // Room types - Comprehensive for all property categories
  room_types: z.array(roomTypeSchema).min(1, 'Select at least one room type'),
  
  // Enhanced occupancy fields
  occupancy_type: z.enum(['beds', 'rooms', 'units']).optional(),
  occupancy_available: z.number().optional(),
  occupancy_total: z.number().optional(),
  
  // Room management fields
  total_rooms: z.number().optional(),
  rooms_available: z.number().optional(),
  beds_per_room: z.number().min(1, "Please select beds per room based on your room types").optional(),
  beds_available: z.number().optional(),
  max_occupants: z.number().min(1, "Must specify how many students can stay").transform(createMaxOccupants).optional(),
  
  // Enhanced facility features
  has_bedframes: z.boolean().optional(),
  has_mattresses: z.boolean().optional(),
  has_wardrobes: z.boolean().optional(),
  has_fan: z.boolean().optional(),
  has_tiled_room: z.boolean().optional(),
  has_individual_meters: z.boolean().optional(),
  
  // BE CONSCIOUS: Redesigned washroom configuration system
  washroom_location: washroomLocationSchema.optional(),
  washroom_sharing: washroomSharingSchema.optional(),
  people_per_washroom: z.number().optional(),
  meter_type: z.enum(['shared', 'individual', 'all_inclusive']).optional(),
  shared_meter_count: z.number().optional(),
  
  // Payment and occupancy details
  advance_payment_months: z.number().optional(),
  allow_bill_sharing: z.boolean().optional(),
  all_inclusive: z.boolean().default(false),
  utilities: z.string().optional(),
  location: z.string().optional(),
  landmark: z.string().optional(),

  // Transparency and considerations
  good_to_know: z.preprocess(sanitizeString, z.string().max(500, 'Please keep this under 500 characters').optional()),

  // Media fields
  image_url: z.preprocess(sanitizeString, z.string().optional()),
  images: z.array(z.preprocess(sanitizeString, z.string())).optional(),
  
  // Enhanced fields for verification and features
  verification_status: verificationStatusSchema.optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  has_accessibility_features: z.boolean().optional(),
  pet_policy: z.enum(['not_allowed', 'allowed', 'cats_only', 'small_pets']).optional(),
  parking_available: z.boolean().optional(),
  parking_cost: z.number().optional(),
  security_features: z.array(z.string()).optional(),
  internet_speed: z.enum(['basic', 'standard', 'high_speed', 'fiber']).optional(),
  // BE CONSCIOUS: Critical fields restoration - Ghana university compliance
  gender_restriction: genderTypeSchema.default('mixed'),
  semester_availability: z.array(z.enum(['semester_1', 'semester_2', 'year_round'])).default(['semester_1', 'semester_2']),
  cancellation_policy: z.enum(['flexible', 'moderate', 'strict']).optional(),
  virtual_tour_url: z.string().optional(),
  
  // Building structure fields (optional for non-subscription users)
  buildings: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    floors: z.array(z.object({
      id: z.string(),
      floorNumber: z.number(),
      name: z.string(),
      description: z.string().optional(),
      rooms: z.array(z.object({
        id: z.string(),
        roomNumber: z.string(),
        roomType: z.string(),
        bedCount: z.number(),
        bedsAvailable: z.number(),
        maxOccupants: z.number(),
        rentAmount: z.number(),
        amenities: z.array(z.string()).optional(),
        description: z.string().optional()
      }))
    }))
  })).optional()
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;
