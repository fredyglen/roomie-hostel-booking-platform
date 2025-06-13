
import { User, UserRole } from './core';

// Property types
export interface Property {
  id: string;
  name: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  address: Address;
  price: PropertyPrice;
  features: PropertyFeatures;
  media: PropertyMedia[];
  buildings: Building[];
  ownerId: string;
  owner?: User;
  createdAt: string;
  updatedAt: string;
  verificationStatus: VerificationStatus;
  verificationDetails?: VerificationDetails;
}

export type PropertyType = 'hostel' | 'homestel' | 'apartment';

export type PropertyStatus = 'active' | 'inactive' | 'pending' | 'rejected';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface VerificationDetails {
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  notes?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface PropertyPrice {
  amount: number;
  currency: string;
  period: 'day' | 'week' | 'month' | 'semester' | 'year';
  isNegotiable: boolean;
  discounts?: Discount[];
}

export interface Discount {
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
}

export interface PropertyFeatures {
  bedrooms: number;
  bathrooms: number;
  kitchens: number;
  parkingSpaces: number;
  furnished: boolean;
  petsAllowed: boolean;
  utilities: Utilities;
  amenities: string[];
  rules: string[];
}

export interface Utilities {
  water: boolean;
  electricity: boolean;
  internet: boolean;
  gas: boolean;
  cleaning: boolean;
  security: boolean;
}

export interface PropertyMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
  isCover: boolean;
  caption?: string;
}

export interface Building {
  id: string;
  name: string;
  floors: Floor[];
}

export interface Floor {
  id: string;
  name: string;
  rooms: Room[];
}

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  capacity: number;
  price: number;
  isAvailable: boolean;
  features?: string[];
}

export type RoomType = 'single' | 'double' | 'triple' | 'quad' | 'suite';

// Property form values
export interface PropertyFormValues {
  name: string;
  description: string;
  type: PropertyType;
  address: Address;
  price: PropertyPrice;
  features: PropertyFeatures;
  media: PropertyMedia[];
  buildings: Building[];
}

// Property insert type (for database operations)
export type PropertyInsert = Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'owner'>;
