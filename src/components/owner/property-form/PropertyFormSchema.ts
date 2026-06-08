import { z } from 'zod';
import { PropertyType, PropertyCategory, PropertyStatus } from '@/types/property';
import { typeToCategory } from '@/config/property-types.config';

// Simple transform functions (identity - no branded types needed)
const createPropertyTitle = (title: string): string => title;
const createPropertyDescription = (desc: string): string => desc;
const createPropertyPrice = (price: number): number => price;
const createBedroomCount = (count: number): number => count;
const createWashroomCount = (count: number): number => count;
const createMaxOccupants = (count: number): number => count;

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

// Structure type as determined by IntelligentPropertyRouter
const structureTypeSchema = z.enum(['simple', 'building', 'compound'] as const);

// Room types - Comprehensive for all property categories (Hostel & Homestel share the same X-in-a-Room taxonomy)
const roomTypeSchema = z.enum([
  '1_in_a_room', '2_in_a_room', '3_in_a_room', '4_in_a_room', '5_in_a_room', '6_in_a_room',
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

// Canonical room-type groupings used for category-specific validation
const HOSTEL_LIKE_ROOM_TYPES = [
  '1_in_a_room',
  '2_in_a_room',
  '3_in_a_room',
  '4_in_a_room',
  '5_in_a_room',
  '6_in_a_room',
] as const;

const APARTMENT_ROOM_TYPES = [
  '1_bedroom_apartment',
  '2_bedroom_apartment',
  '3_bedroom_apartment',
] as const;

export const propertyFormSchema = z.object({
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

  booking_duration: bookingDurationSchema.default('semester'),
  custom_duration_weeks: z.number().min(1).max(52).optional(), // For custom duration

  // Dynamic pricing matrix based on room types and duration
  price: z.number().min(1, 'Price must be greater than 0').transform(createPropertyPrice),
  room_type_pricing: z.record(z.string(), z.number()).optional(), // Dynamic pricing per room type
  beds_available_by_room_type: z.record(z.string(), z.number()).optional(), // Optional UI helper to capture beds per room type
  // Homestel flexible duration pricing (non-breaking optional)
  homestel_pricing_matrix: z.record(z.string(), z.record(z.string(), z.number())).optional(),
  homestel_advance: z.object({ enabled: z.boolean().optional(), months: z.number().optional() }).optional(),

  rent: z.number().min(1, 'Rent must be greater than 0').optional(),
  price_unit: bookingDurationSchema.default('semester'), // Aligned with booking_duration

  description: z.preprocess(sanitizeString, z.string().min(10, 'Description must be at least 10 characters')).transform(createPropertyDescription),
  distance_to_campus: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  house_rules: z.string().optional(),

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

  // Availability and furnishing
  available_from: z.string().optional(),
  available_to: z.string().optional(),
  furnished: z.boolean().optional(),

  // Enhanced facility features
  has_bedframes: z.boolean().optional(),
  has_mattresses: z.boolean().optional(),
  has_wardrobes: z.boolean().optional(),
  has_fan: z.boolean().optional(),
  has_tiled_room: z.boolean().optional(),
  has_individual_meters: z.boolean().optional(),

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

	// Structure metadata – driven by IntelligentPropertyRouter
	structure_type: structureTypeSchema.optional(),

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
})
  // Category-aware invariants that were previously only enforced in UI
  .superRefine((data, ctx) => {
    // Keep propertyCategory consistent with type using centralized helper
    try {
	      const expectedCategory = typeToCategory(data.type as PropertyType) as PropertyCategory;
      if (data.propertyCategory !== expectedCategory) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['propertyCategory'],
          message: `Property category must match property type (${expectedCategory}).`,
        });
      }
    } catch {
      // If type is somehow invalid, let the base enum validation surface that error instead.
    }

    // Hostels: X-in-a-room only, semester/academic_year durations
    if (data.type === 'hostel') {
      if (!data.room_types.every((rt) => HOSTEL_LIKE_ROOM_TYPES.includes(rt as any))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['room_types'],
          message: 'Hostels can only use "1 in a Room" to "6 in a Room" room types.',
        });
      }

      if (data.booking_duration !== 'semester' && data.booking_duration !== 'academic_year') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['booking_duration'],
          message: 'Hostels must be priced per semester or academic year.',
        });
      }
    }

    // Homestels: also use X-in-a-room taxonomy
    if (data.type === 'homestel') {
      if (!data.room_types.every((rt) => HOSTEL_LIKE_ROOM_TYPES.includes(rt as any))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['room_types'],
          message: 'Homestels must use the standard "X in a Room" room types.',
        });
      }
    }

    // Apartments: restrict to apartment-style room types for now
    if (data.type === 'apartment') {
      if (!data.room_types.every((rt) => APARTMENT_ROOM_TYPES.includes(rt as any))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['room_types'],
          message: 'Apartments must use apartment room types (e.g. 1/2/3 bedroom apartment).',
        });
      }
    }
  });

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;
