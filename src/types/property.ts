
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
};

// Property types
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
  propertyCategory?: 'Hostel' | 'Homestel' | 'Apartment';
};
