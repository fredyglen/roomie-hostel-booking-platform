export type PropertyType = 'APARTMENT' | 'HOUSE' | 'HOSTEL' | 'DORMITORY';
export type PropertyStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SOLD';

export interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface PropertyAmenity {
  id: string;
  name: string;
  category: string;
  icon?: string;
}

export interface PropertyRoom {
  id: string;
  name: string;
  description?: string;
  price: number;
  capacity: number;
  amenities: string[];
  images: string[];
  isAvailable: boolean;
}

export interface PropertyBuilding {
  id: string;
  name: string;
  floors: number;
  rooms: PropertyRoom[];
}

export interface Property {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  location: PropertyLocation;
  amenities: string[];
  images: string[];
  videos?: string[];
  buildings?: PropertyBuilding[];
  rules?: string[];
  created_at: string;
  updated_at: string;
  owner?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    avatar_url?: string;
  };
}

export type PropertyInsert = Omit<Property, 'id' | 'created_at' | 'updated_at'>;
export type PropertyUpdate = Partial<PropertyInsert>;

export interface PropertySearchParams {
  type?: PropertyType;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: PropertyStatus;
}
