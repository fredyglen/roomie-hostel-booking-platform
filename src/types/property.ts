import { BaseEntity, Amenity } from './common';

export type PropertyCategory = 'Hostel' | 'Apartment' | 'Shared' | 'Studio' | 'House' | 'Homestel';
export type PropertyType = 'hostel' | 'apartment' | 'house';
export type PropertyStatus = 'available' | 'booked' | 'maintenance' | 'unavailable';

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
  unit?: string;
}

export interface PropertyOwner {
  name: string;
  email: string;
  phone: string;
  responseRate: string;
  verified: boolean;
}

export interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Property extends BaseEntity {
  name: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  location: Location;
  owner_id: string;
  university_id: string;
  amenities: Amenity[];
  images: string[];
  rating?: number;
  review_count?: number;
  rules?: string[];
  features?: string[];
  title?: string;
  address?: string;
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
