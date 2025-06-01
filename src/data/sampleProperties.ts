import { Property } from '@/types/property';

export const sampleProperties: Property[] = [
  {
    id: '1',
    owner_id: 'sample-owner-1',
    title: 'Modern Student Apartment - Action School Area',
    description: 'A comfortable 4-in-room accommodation perfect for students. Located in a secure area with easy access to campus facilities.',
    address: '123 Action School Road, Accra',
    city: 'Accra',
    state: 'Greater Accra',
    rent: 2700,
    bedrooms: 4,
    bathrooms: 2,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800&h=600',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800&h=600'
    ],
    price: 2700,
    priceUnit: 'semester',
    type: 'Apartment',
    propertyCategory: 'Apartment',
    genderType: 'Mixed',
    distanceToCampus: '5 min walk',
    rating: 4.5,
    reviewCount: 12,
    verified: true,
    availableUnits: 3,
    amenities: ['WiFi', 'Air Conditioning', 'Security', 'Water'],
    stories: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800&h=600',
        duration: 5000
      }
    ]
  },
  {
    id: '2',
    owner_id: 'sample-owner-2',
    title: 'Cozy 3-in-room - Rawlings Circle',
    description: 'Well-maintained 3-in-room accommodation with modern amenities in the heart of Rawlings Circle.',
    address: '456 Rawlings Circle, Accra',
    city: 'Accra',
    state: 'Greater Accra',
    rent: 3600,
    bedrooms: 3,
    bathrooms: 1,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800&h=600',
      'https://images.unsplash.com/photo-1571624436279-b272aff752b5?auto=format&fit=crop&q=80&w=800&h=600'
    ],
    price: 3600,
    priceUnit: 'semester',
    type: 'Hostel',
    propertyCategory: 'Hostel',
    genderType: 'Boys',
    distanceToCampus: '10 min walk',
    rating: 4.2,
    reviewCount: 8,
    verified: true,
    availableUnits: 2,
    amenities: ['WiFi', 'Security', 'Water', 'Electricity'],
    stories: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800&h=600',
        duration: 5000
      }
    ]
  },
  {
    id: '3',
    title: 'Executive 2-in-room - Palace Area',
    description: 'Premium 2-in-room accommodation with excellent facilities and prime location near Palace.',
    address: '789 Palace Road, Accra',
    images: [
      'https://images.unsplash.com/photo-1571624436279-b272aff752b5?auto=format&fit=crop&q=80&w=800&h=600',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800&h=600'
    ],
    price: 4000,
    priceUnit: 'semester',
    type: 'Apartment',
    propertyCategory: 'Apartment',
    genderType: 'Girls',
    distanceToCampus: '8 min walk',
    rating: 4.7,
    reviewCount: 15,
    verified: true,
    availableUnits: 1,
    amenities: ['WiFi', 'Air Conditioning', 'Security', 'Water', 'Generator'],
    owner_id: 'sample-owner-3',
    stories: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1571624436279-b272aff752b5?auto=format&fit=crop&q=80&w=800&h=600',
        duration: 5000
      }
    ]
  },
  {
    id: '4',
    title: 'Luxury 1-in-room Executive - Madina',
    description: 'Premium single occupancy room with top-notch amenities in the prestigious Madina area.',
    address: '101 Executive Lane, Madina',
    images: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800&h=600',
      'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&q=80&w=800&h=600'
    ],
    price: 10000,
    priceUnit: 'semester',
    type: 'Apartment',
    propertyCategory: 'Apartment',
    genderType: 'Mixed',
    distanceToCampus: '15 min drive',
    rating: 4.9,
    reviewCount: 20,
    verified: true,
    availableUnits: 1,
    amenities: ['WiFi', 'Air Conditioning', 'Security', 'Water', 'Generator', 'Gym', 'Pool'],
    owner_id: 'sample-owner-4',
    stories: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800&h=600',
        duration: 5000
      }
    ]
  },
  {
    id: '5',
    title: 'Budget-Friendly Hostel - Campus Gate',
    description: 'Affordable accommodation right at the campus gate, perfect for budget-conscious students.',
    address: '202 Campus Gate, University Road',
    images: [
      'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&q=80&w=800&h=600',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800&h=600'
    ],
    price: 2200,
    priceUnit: 'semester',
    type: 'Hostel',
    propertyCategory: 'Hostel',
    genderType: 'Boys',
    distanceToCampus: '2 min walk',
    rating: 4.0,
    reviewCount: 25,
    verified: true,
    availableUnits: 5,
    amenities: ['WiFi', 'Security', 'Water'],
    owner_id: 'sample-owner-5',
    stories: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&q=80&w=800&h=600',
        duration: 5000
      }
    ]
  },
  {
    id: '6',
    title: 'Female-Only Residence - East Legon',
    description: 'Safe and secure female-only accommodation in the upscale East Legon area.',
    address: '303 East Legon Hills, Accra',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800&h=600',
      'https://images.unsplash.com/photo-1571624436279-b272aff752b5?auto=format&fit=crop&q=80&w=800&h=600'
    ],
    price: 4500,
    priceUnit: 'semester',
    type: 'Apartment',
    propertyCategory: 'Apartment',
    genderType: 'Girls',
    distanceToCampus: '20 min drive',
    rating: 4.6,
    reviewCount: 18,
    verified: true,
    availableUnits: 2,
    amenities: ['WiFi', 'Air Conditioning', 'Security', 'Water', 'Generator', 'Gym'],
    owner_id: 'sample-owner-6',
    stories: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800&h=600',
        duration: 5000
      }
    ]
  },
  {
    id: '7',
    title: 'Shared Apartment - Tema Station',
    description: 'Affordable shared apartment with good transport links to campus.',
    address: '404 Tema Station Road, Accra',
    images: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800&h=600',
      'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&q=80&w=800&h=600'
    ],
    price: 2800,
    priceUnit: 'semester',
    type: 'Shared Apartment',
    propertyCategory: 'Apartment',
    genderType: 'Mixed',
    distanceToCampus: '25 min drive',
    rating: 4.1,
    reviewCount: 10,
    verified: false,
    availableUnits: 3,
    amenities: ['WiFi', 'Security', 'Water', 'Transport'],
    owner_id: 'sample-owner-7',
    stories: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800&h=600',
        duration: 5000
      }
    ]
  },
  {
    id: '8',
    title: 'Study-Friendly Hostel - Library Area',
    description: 'Quiet hostel perfect for serious students, located near the main library.',
    address: '505 Library Complex, University Campus',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800&h=600',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800&h=600'
    ],
    price: 3200,
    priceUnit: 'semester',
    type: 'Hostel',
    propertyCategory: 'Hostel',
    genderType: 'Mixed',
    distanceToCampus: '3 min walk',
    rating: 4.4,
    reviewCount: 22,
    verified: true,
    availableUnits: 4,
    amenities: ['WiFi', 'Security', 'Water', 'Study Room', 'Library Access'],
    owner_id: 'sample-owner-8',
    stories: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800&h=600',
        duration: 5000
      }
    ]
  },
  {
    id: '9',
    title: 'Modern Studio - Cantonment',
    description: 'Contemporary studio apartment in the prestigious Cantonment area.',
    address: '606 Cantonment Road, Accra',
    images: [
      'https://images.unsplash.com/photo-1571624436279-b272aff752b5?auto=format&fit=crop&q=80&w=800&h=600',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800&h=600'
    ],
    price: 6000,
    priceUnit: 'semester',
    type: 'Apartment',
    propertyCategory: 'Apartment',
    genderType: 'Mixed',
    distanceToCampus: '30 min drive',
    rating: 4.8,
    reviewCount: 14,
    verified: true,
    availableUnits: 1,
    amenities: ['WiFi', 'Air Conditioning', 'Security', 'Water', 'Generator', 'Kitchen'],
    owner_id: 'sample-owner-9',
    stories: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1571624436279-b272aff752b5?auto=format&fit=crop&q=80&w=800&h=600',
        duration: 5000
      }
    ]
  },
  {
    id: '10',
    title: 'Economy Hostel - Ring Road',
    description: 'Basic but clean accommodation with essential amenities at an affordable price.',
    address: '707 Ring Road Central, Accra',
    images: [
      'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&q=80&w=800&h=600',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800&h=600'
    ],
    price: 1800,
    priceUnit: 'semester',
    type: 'Hostel',
    propertyCategory: 'Hostel',
    genderType: 'Boys',
    distanceToCampus: '15 min walk',
    rating: 3.8,
    reviewCount: 30,
    verified: false,
    availableUnits: 8,
    amenities: ['WiFi', 'Security', 'Water'],
    owner_id: 'sample-owner-10',
    stories: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&q=80&w=800&h=600',
        duration: 5000
      }
    ]
  }
];
