import { BaseEntity, Amenity } from './common';

export type PropertyType = 'apartment' | 'hostel' | 'shared-apartment' | 'studio' | 'room';

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
  features?: string[];
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
