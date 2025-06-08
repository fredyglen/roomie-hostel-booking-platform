import { BaseEntity, Amenity } from './common';
import { PropertyStatus } from './property';

export interface Building extends BaseEntity {
  property_id: string;
  name: string;
  floors: Floor[];
  rooms: Room[];
  total_floors: number;
  total_rooms: number;
}

export interface Floor extends BaseEntity {
  building_id: string;
  number: number;
  name: string;
  description?: string;
}

export interface Room extends BaseEntity {
  floor_id: string;
  number: string;
  type: string;
  capacity: number;
  price: number;
  status: PropertyStatus;
  amenities: Amenity[];
  images: string[];
}

export interface RoomBooking {
  id: string;
  room_id: string;
  student_id: string;
  building_id: string;
  start_date: string;
  end_date: string;
  semester: string;
  academic_year: string;
  student_level?: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  amount: number;
  booking_type: 'immediate' | 'future';
  priority_score: number;
  created_at: string;
  updated_at: string;
}

export interface OccupancyTracking {
  id: string;
  room_id: string;
  building_id: string;
  floor_id: string;
  current_occupancy: number;
  available_spots: number;
  last_updated: string;
  updated_by?: string;
}
