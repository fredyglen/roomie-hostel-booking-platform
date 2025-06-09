
import { BaseEntity, Amenity } from './common';

export type PropertyType = 'apartment' | 'hostel' | 'shared-apartment' | 'studio' | 'room';
export type PropertyCategory = 'Hostel' | 'Homestel' | 'Apartment';

export interface Location {
  city: string;
  state: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
  verified: boolean;
  responseRate?: number;
}

export interface Story {
  id: string;
  type: 'image' | 'video';
  url: string;
  duration?: number;
  caption?: string;
}

export interface Property extends BaseEntity {
  title: string;
  name: string;
  description: string;
  location: string | Location;
  price: number;
  rent: number;
  type: PropertyType;
  propertyCategory: string;
  property_category: string;
  images: string[];
  amenities: (string | Amenity)[];
  bedrooms: number;
  bathrooms: number;
  max_occupants: number;
  verified: boolean;
  verification_status: string;
  available_from: string;
  available_to?: string;
  owner: Owner;
  owner_id: string;
  city: string;
  state: string;
  address: string;
  distanceToCampus?: number;
  distance_to_campus?: number;
  reviewCount?: number;
  review_count?: number;
  rating?: number;
  house_rules?: string[];
  property_type?: string;
  availableUnits?: number;
  priceUnit?: string;
  price_unit?: string;
  features?: string[];
  roomTypes?: string[];
  stories?: Story[];
  status?: string;
}

export interface PropertyFormData {
  title: string;
  description: string;
  location: Location;
  price: number;
  type: PropertyType;
  images: string[];
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  max_occupants: number;
}

export interface PropertyFormValues {
  title: string;
  propertyCategory: PropertyCategory;
  type: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  location?: string;
  landmark?: string;
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
  bedrooms: number;
  bathrooms: number;
  max_occupants?: number;
  total_rooms?: number;
  rooms_available?: number;
  beds_per_room?: number;
  beds_available?: number;
  has_bedframes: boolean;
  has_mattresses: boolean;
  has_wardrobes: boolean;
  has_individual_meters: boolean;
  advance_payment_months?: number;
  allow_bill_sharing: boolean;
}
