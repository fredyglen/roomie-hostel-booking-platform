
export interface Building {
  id: string;
  owner_id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zip?: string;
  description: string;
  total_floors: number;
  amenities: string[];
  house_rules: string[];
  images: string[];
  is_available: boolean;
  property_category: 'Hostel' | 'Homestel' | 'Apartment';
  gender_type: 'Girls' | 'Boys' | 'Mixed';
  all_inclusive: boolean;
  utilities: string[];
  distance_to_campus?: string;
  created_at: string;
  updated_at: string;
  floors?: Floor[];
}

export interface Floor {
  id: string;
  building_id: string;
  floor_number: number;
  floor_name?: string;
  total_rooms: number;
  amenities: string[];
  created_at: string;
  rooms?: Room[];
}

export interface Room {
  id: string;
  floor_id: string;
  room_number: string;
  room_name?: string;
  occupancy_limit: number;
  current_occupancy: number;
  price_per_student: number;
  price_unit: 'semester' | 'month' | 'year' | 'week';
  room_type: string;
  amenities: string[];
  is_available: boolean;
  created_at: string;
  updated_at: string;
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
