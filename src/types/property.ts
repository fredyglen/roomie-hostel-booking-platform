
// Story types
export type Story = {
  type: string;
  url: string;
  duration: number;
  caption?: string;
};

// Room type
export type RoomType = {
  name: string;
  price: number;
  unit: string;
  bedsAvailable?: number;
  totalBeds?: number;
};

// Property types
export type PropertyCategory = 'Hostel' | 'Homestel' | 'Apartment';

export type Property = {
  id: string;
  title: string;
  type: string;
  price: number;
  priceUnit: string;
  address: string;
  distanceToCampus: string;
  stories: Story[];
  amenities?: string[];
  description?: string;
  rating?: number;
  reviewCount?: number;
  verified?: boolean;
  availableUnits?: number;
  owner?: {
    name: string;
    phone: string;
    responseRate: string;
    verified: boolean;
  };
  roomTypes?: RoomType[];
  occupancy?: string;
  propertyCategory?: PropertyCategory;
  property_category?: PropertyCategory; // Added for database compatibility
  allInclusive?: boolean;
  all_inclusive?: boolean; // Added for database compatibility
  utilities?: string[];
  location?: string;
  landmark?: string;
  total_rooms?: number;
  rooms_available?: number;
  beds_per_room?: number;
  beds_available?: number;
  max_occupants?: number;
  has_bedframes?: boolean;
  has_mattresses?: boolean;
  has_wardrobes?: boolean;
  has_individual_meters?: boolean;
  advance_payment_months?: number;
  allow_bill_sharing?: boolean;
};

// This interface is for the PropertyForm component
export interface PropertyFormValues {
  title: string;
  type: string;
  propertyCategory: PropertyCategory;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  price_unit: string;
  description: string;
  distance_to_campus?: string;
  amenities?: string;
  house_rules?: string;
  status: string;
  occupancy?: string;
  image_url?: string;
  all_inclusive: boolean;
  utilities?: string;
  location?: string;
  landmark?: string;
  bedrooms: number;
  bathrooms: number;
  total_rooms?: number;
  rooms_available?: number;
  beds_per_room?: number;
  beds_available?: number;
  max_occupants?: number;
  has_bedframes?: boolean;
  has_mattresses?: boolean;
  has_wardrobes?: boolean;
  has_individual_meters?: boolean;
  advance_payment_months?: number;
  allow_bill_sharing?: boolean;
}

// This interface is for inserting into the database
export interface PropertyInsert {
  owner_id: string;
  title: string;
  property_type: string;
  property_category?: string;
  rent: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  bedrooms: number;
  bathrooms: number;
  available_from: string;
  description: string;
  amenities?: string[];
  images?: string[];
  is_available?: boolean;
  distance_to_campus?: string;
  house_rules?: string[];
  all_inclusive?: boolean;
  utilities?: string[];
  location?: string;
  landmark?: string;
  total_rooms?: number;
  rooms_available?: number;
  beds_per_room?: number;
  beds_available?: number;
  max_occupants?: number;
  has_bedframes?: boolean;
  has_mattresses?: boolean;
  has_wardrobes?: boolean;
  has_individual_meters?: boolean;
  advance_payment_months?: number;
  allow_bill_sharing?: boolean;
}
