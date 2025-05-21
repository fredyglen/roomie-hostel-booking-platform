
import * as z from "zod";

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
  state: z.string().min(1, {
    message: "State is required",
  }),
  zip: z.string().min(1, {
    message: "Zip code is required",
  }),
  location: z.string().optional(),
  landmark: z.string().optional(),
  price: z.number().positive({
    message: "Price must be a positive number.",
  }),
  price_unit: z.string().min(1, {
    message: "Please select a price unit.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  distance_to_campus: z.string().optional(),
  amenities: z.string().optional(),
  house_rules: z.string().optional(),
  status: z.string().min(1, {
    message: "Please select a property status.",
  }),
  occupancy: z.string().optional(),
  image_url: z.string().optional(),
  all_inclusive: z.boolean().default(false),
  utilities: z.string().optional(),
  bedrooms: z.number().positive({
    message: "Bedrooms must be a positive number.",
  }),
  bathrooms: z.number().positive({
    message: "Bathrooms must be a positive number.",
  }),
  max_occupants: z.number().optional(),
  total_rooms: z.number().optional(),
  rooms_available: z.number().optional(),
  beds_per_room: z.number().optional(),
  beds_available: z.number().optional(),
  has_bedframes: z.boolean().default(false),
  has_mattresses: z.boolean().default(false),
  has_wardrobes: z.boolean().default(false),
  has_individual_meters: z.boolean().default(false),
  advance_payment_months: z.number().optional(),
  allow_bill_sharing: z.boolean().default(false),
});

// Export the type for use throughout the application
export type PropertyFormValues = z.infer<typeof propertyFormSchema>;
