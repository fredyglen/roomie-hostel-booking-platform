import { z } from 'zod';
import { PropertyType, PropertyCategory, PropertyStatus } from '@/types/property';

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

// Room occupancy types - Ghana standard "X in a room" system
const roomOccupancyTypeSchema = z.enum(['1_in_a_room', '2_in_a_room', '3_in_a_room', '4_in_a_room'] as const);

// Gender restriction
const genderTypeSchema = z.enum(['male', 'female', 'mixed'] as const);

// Semester periods - Ghana academic calendar
const semesterPeriodSchema = z.enum(['first_semester', 'second_semester'] as const);

export const propertyFormSchema = z.object({
  // Core property identification - aligned with unified Property interface
  name: z.preprocess(sanitizeString, z.string().min(1, 'Property name is required')),
  title: z.preprocess(sanitizeString, z.string().min(1, 'Title is required')),
  type: propertyTypeSchema,
  propertyCategory: propertyCategorySchema,
  status: propertyStatusSchema.default('available'),

  // Location information
  address: z.preprocess(sanitizeString, z.string().min(1, 'Address is required')),
  city: z.preprocess(sanitizeString, z.string().min(1, 'City is required')),
  state: z.preprocess(sanitizeString, z.string().min(1, 'State/Region is required')),
  region: z.enum(ghanaRegions),
  zip: z.preprocess(sanitizeString, z.string().optional()),

  // Pricing information - using branded types
  price: z.number().min(1, 'Price must be greater than 0'),
  rent: z.number().min(1, 'Rent must be greater than 0').optional(),
  price_unit: z.enum(['week', 'month', 'year', 'semester']),

  // Property description and details
  description: z.preprocess(sanitizeString, z.string().min(10, 'Description must be at least 10 characters')),
  distance_to_campus: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  house_rules: z.string().optional(),
  
  // Basic property stats
  bedrooms: z.number().min(1, "Must have at least 1 bedroom"),
  bathrooms: z.number().min(1, "Must have at least 1 bathroom"),
  
  // Enhanced occupancy fields
  occupancy_type: z.enum(['beds', 'rooms', 'units']).optional(),
  occupancy_available: z.number().optional(),
  occupancy_total: z.number().optional(),
  
  // Room management fields
  total_rooms: z.number().optional(),
  rooms_available: z.number().optional(),
  beds_per_room: z.number().optional(),
  beds_available: z.number().optional(),
  max_occupants: z.number().optional(),
  
  // Enhanced facility features
  has_bedframes: z.boolean().optional(),
  has_mattresses: z.boolean().optional(),
  has_wardrobes: z.boolean().optional(),
  has_fan: z.boolean().optional(),
  has_tiled_room: z.boolean().optional(),
  has_individual_meters: z.boolean().optional(),
  
  // Washroom and meter configurations
  washroom_type: z.enum(['inside', 'outside', 'shared']).optional(),
  shared_washroom_count: z.number().optional(),
  meter_type: z.enum(['self', 'shared']).optional(),
  shared_meter_count: z.number().optional(),
  
  // Payment and occupancy details
  advance_payment_months: z.number().optional(),
  allow_bill_sharing: z.boolean().optional(),
  all_inclusive: z.boolean().default(false),
  utilities: z.string().optional(),
  location: z.string().optional(),
  landmark: z.string().optional(),
  
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
  gender_restriction: z.enum(['male', 'female', 'mixed']).optional(),
  semester_availability: z.array(z.enum(['semester_1', 'semester_2', 'year_round'])).optional(),
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
