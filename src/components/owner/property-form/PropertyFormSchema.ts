
import * as z from "zod";

// Ghana regions enum
export const GhanaRegions = [
  'Greater Accra', 'Ashanti', 'Western', 'Eastern', 'Central', 
  'Northern', 'Upper East', 'Upper West', 'Volta', 'Brong-Ahafo', 
  'Western North', 'Ahafo', 'Bono East', 'North East', 'Savannah', 'Oti'
] as const;

// Define the property form schema to use with zod validation
export const propertyFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  propertyCategory: z.enum(['Hostel', 'Homestel', 'Apartment'] as const, {
    message: "Please select a property category.",
  }),
  type: z.string().min(1, {
    message: "Please select a property type.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(1, {
    message: "City is required",
  }),
  region: z.enum(GhanaRegions, {
    message: "Please select a region",
  }),
  zip: z.string().min(1, {
    message: "Zip code is required",
  }),
  location: z.string().optional().default(""),
  landmark: z.string().optional().default(""),
  price: z.number().positive({
    message: "Price must be a positive number.",
  }),
  price_unit: z.enum(['week', 'month', 'year', 'semester'] as const, {
    message: "Please select a price unit.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  distance_to_campus: z.string().optional().default(""),
  amenities: z.string().optional().default(""),
  house_rules: z.string().optional().default(""),
  status: z.string().min(1, {
    message: "Please select a property status.",
  }),
  // Occupancy type selection (checkbox-based)
  occupancy_type: z.enum(['beds', 'rooms', 'units'] as const).optional(),
  occupancy_available: z.number().optional().default(0),
  occupancy_total: z.number().optional().default(0),
  
  image_url: z.string().optional().default(""),
  images: z.array(z.string()).optional().default([]),
  all_inclusive: z.boolean().default(false),
  utilities: z.string().optional().default(""),
  bedrooms: z.number().positive({
    message: "Bedrooms must be a positive number.",
  }),
  bathrooms: z.number().positive({
    message: "Bathrooms must be a positive number.",
  }),
  max_occupants: z.number().optional().default(1),
  total_rooms: z.number().optional().default(1),
  rooms_available: z.number().optional().default(1),
  beds_per_room: z.number().optional().default(1),
  beds_available: z.number().optional().default(1),
  
  // Room Features & Furnishing (without allow_bill_sharing)
  has_bedframes: z.boolean().default(false),
  has_mattresses: z.boolean().default(false),
  has_wardrobes: z.boolean().default(false),
  has_fan: z.boolean().default(false),
  has_tiled_room: z.boolean().default(false),
  
  // Washroom options
  washroom_type: z.enum(['inside', 'outside', 'shared'] as const).optional(),
  shared_washroom_count: z.number().optional(),
  
  // Meter options  
  meter_type: z.enum(['self', 'shared'] as const).optional(),
  shared_meter_count: z.number().optional(),
  
  has_individual_meters: z.boolean().default(false),
  advance_payment_months: z.number().optional().default(12),
  
  // Move allow_bill_sharing to property details section
  allow_bill_sharing: z.boolean().default(false),
});

// Export the type for use throughout the application
export type PropertyFormValues = z.infer<typeof propertyFormSchema>;
