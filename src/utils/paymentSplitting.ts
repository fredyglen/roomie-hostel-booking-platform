
// Payment splitting utilities for booking packages

export interface BookingPackage {
  id: string;
  name: string;
  type: string;
  description: string;
  totalPrice: number;
  duration: string;
  features: string[];
  additionalServices?: number;
}

export const BOOKING_PACKAGES: Record<string, BookingPackage> = {
  standard: {
    id: 'standard',
    name: '4-in-room Package',
    type: 'standard',
    description: 'Shared accommodation with 3 other students',
    totalPrice: 2700,
    duration: 'Per Semester',
    features: [
      'Shared room with 4 beds',
      'Basic amenities',
      'Shared bathroom',
      'Wi-Fi included',
      'Security deposit required'
    ]
  },
  premium: {
    id: 'premium',
    name: '3-in-room Package',
    type: 'premium',
    description: 'Shared accommodation with 2 other students',
    totalPrice: 3600,
    duration: 'Per Semester',
    features: [
      'Shared room with 3 beds',
      'Enhanced amenities',
      'Shared bathroom',
      'Wi-Fi included',
      'Study area access',
      'Security deposit required'
    ],
    additionalServices: 200
  },
  luxury: {
    id: 'luxury',
    name: '2-in-room Package',
    type: 'luxury',
    description: 'Shared accommodation with 1 other student',
    totalPrice: 4000,
    duration: 'Per Semester',
    features: [
      'Shared room with 2 beds',
      'Premium amenities',
      'Private bathroom',
      'High-speed Wi-Fi',
      'Study area access',
      'Laundry service',
      'Security deposit required'
    ],
    additionalServices: 500
  }
};

export const getPackageById = (packageId: string): BookingPackage | null => {
  return BOOKING_PACKAGES[packageId] || null;
};

export const getAllPackages = (): BookingPackage[] => {
  return Object.values(BOOKING_PACKAGES);
};

export const formatPackagePrice = (price: number): string => {
  return `GHS ${price.toLocaleString()}`;
};
