
export type PropertyCategory = 'Hostel' | 'Apartment' | 'Shared' | 'Studio' | 'House' | 'Homestel';

export interface Story {
  type: 'image' | 'video';
  url: string;
  caption?: string;
  duration: number;
}

export interface RoomType {
  id: string;
  name: string;
  description?: string;
  capacity: number;
  price: number;
}

export interface PropertyOwner {
  name: string;
  email: string;
  phone: string;
  responseRate: string;
  verified: boolean;
}

export interface Property {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip?: string;
  rent: number;
  type: string;
  property_type?: string;
  property_category?: PropertyCategory;
  bedrooms: number;
  bathrooms: number;
  size?: number;
  available_from?: string;
  available_to?: string;
  is_furnished?: boolean;
  is_available?: boolean;
  images: string[];
  amenities: string[];
  gender_restriction?: string;
  parking_available?: boolean;
  total_rooms?: number;
  rooms_available?: number;
  beds_per_room?: number;
  beds_available?: number;
  max_occupants?: number;
  has_bedframes?: boolean;
  has_mattresses?: boolean;
  has_wardrobes?: boolean;
  has_fan?: boolean;
  has_tiled_room?: boolean;
  has_individual_meters?: boolean;
  washroom_type?: string;
  meter_type?: string;
  verification_status?: string;
  owner?: PropertyOwner;
  rating?: number;
  created_at?: string;
  updated_at?: string;
  
  // Additional frontend properties
  price?: number;
  priceUnit?: string;
  price_unit?: string;
  location?: string;
  distance_to_campus?: string;
  distanceToCampus?: string;
  propertyCategory?: PropertyCategory;
  genderType?: string;
  gender_type?: string;
  status?: string;
  verified?: boolean;
  availableUnits?: number;
  reviewCount?: number;
  house_rules?: string[];
  stories?: Story[];
  roomTypes?: RoomType[];
}

export interface PropertyFormValues {
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  property_type: string;
  property_category: PropertyCategory;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  size?: number;
  available_from: string;
  available_to?: string;
  is_furnished: boolean;
  amenities: string[];
  images: string[];
  gender_restriction?: string;
  parking_available: boolean;
  total_rooms?: number;
  rooms_available?: number;
  beds_per_room?: number;
  max_occupants?: number;
  has_bedframes: boolean;
  has_mattresses: boolean;
  has_wardrobes: boolean;
  has_fan: boolean;
  has_tiled_room: boolean;
  has_individual_meters: boolean;
  washroom_type?: string;
  meter_type?: string;
}

export interface PropertyInsert extends Omit<PropertyFormValues, 'images'> {
  owner_id: string;
  images?: string[];
}
