
import { Property, Story } from '@/types/property';

// Convert images to stories if no stories are defined
export function convertImagesToStories(images: string[]): Story[] {
  return images.map(imageUrl => ({
    type: 'image',
    url: imageUrl,
    duration: 5000
  }));
}

// Function to ensure property data consistency by providing defaults
export function normalizePropertyData(propertyData: any): Property {
  // Map database column gender_type to our frontend genderType
  const genderType = propertyData.gender_type || 'Mixed';

  return {
    ...propertyData,
    // Basic properties
    owner_id: propertyData.owner_id || '',
    city: propertyData.city || '',
    state: propertyData.state || '',
    zip: propertyData.zip || '',
    bedrooms: propertyData.bedrooms || 0,
    bathrooms: propertyData.bathrooms || 0,
    available_from: propertyData.available_from || '',
    created_at: propertyData.created_at || '',
    updated_at: propertyData.updated_at || '',
    
    // Normalize property type and category
    type: propertyData.property_type || '',
    property_type: propertyData.property_type || '',
    
    // Normalize price info
    price: propertyData.rent || 0,
    priceUnit: 'semester', // Default to semester
    price_unit: 'semester',
    
    // Normalize status
    status: propertyData.is_available ? 'Available' : 'Not Available',
    occupancy: '0/1', // Default occupancy
    
    // Normalize property category
    propertyCategory: (propertyData.property_category || 'Hostel'),
    property_category: (propertyData.property_category || 'Hostel'),
    
    // Normalize property features
    allInclusive: propertyData.all_inclusive || false,
    all_inclusive: propertyData.all_inclusive || false,
    total_rooms: propertyData.total_rooms || 1,
    rooms_available: propertyData.rooms_available || 1,
    beds_per_room: propertyData.beds_per_room || 1,
    beds_available: propertyData.beds_available || 1,
    max_occupants: propertyData.max_occupants || 1,
    
    // Normalize facility features
    has_bedframes: propertyData.has_bedframes || false,
    has_mattresses: propertyData.has_mattresses || false,
    has_wardrobes: propertyData.has_wardrobes || false,
    has_individual_meters: propertyData.has_individual_meters || false,
    
    // Normalize payment details
    advance_payment_months: propertyData.advance_payment_months || 12,
    allow_bill_sharing: propertyData.allow_bill_sharing || false,
    
    // Normalize location info
    landmark: propertyData.landmark || '',
    distanceToCampus: propertyData.distance_to_campus || '',
    distance_to_campus: propertyData.distance_to_campus || '',
    
    // Add frontend UI properties (not from database)
    rating: 4.5, // Default rating if not provided
    reviewCount: 10, // Default review count if not provided
    verified: true, // Default to verified
    
    // Add stories from images if not provided
    stories: propertyData.stories || convertImagesToStories(propertyData.images || []),
    
    // Map gender_type to genderType
    gender_type: propertyData.gender_type || 'Mixed',
    genderType: genderType as 'Girls' | 'Boys' | 'Mixed',
    
    // Add default owner information for display
    owner: propertyData.owner || {
      name: 'Property Owner',
      email: 'owner@example.com',
      phone: '+233 50 123 4567',
      responseRate: '90%',
      verified: true
    },
    
    // Add UI property for available units
    availableUnits: propertyData.availableUnits || 5
  } as Property;
}

// Sample property data for fallback
export function getSampleProperties(): Property[] {
  return [
    {
      id: '1',
      owner_id: 'sample-owner-1',
      title: 'Kitatsu Hostel (All Girls Hostel)',
      type: 'Hostel',
      property_type: 'Hostel',
      price: 8500,
      rent: 8500,
      price_unit: 'semester',
      priceUnit: 'semester',
      address: 'Near UPSA, Madina, Accra',
      distanceToCampus: '5 min walk',
      distance_to_campus: '5 min walk',
      images: ['/lovable-uploads/kitatsu_hostel.jpg', '/lovable-uploads/kitatsu_hostel_2.jpg'],
      rating: 4.5,
      reviewCount: 23,
      verified: true,
      amenities: ['Water Supply', 'Shared Toilet', 'Security'],
      description: "This is an all girls hostel located very close to the UPSA. It's one of the few hostels located in Madina which take in only female students. This hostel has water flowing and shared toilet facilities.",
      house_rules: [
        'No visitors after 10 PM',
        'Keep noise levels down',
        'Clean common areas after use'
      ],
      availableUnits: 5,
      owner: {
        name: 'Mrs. Kitatsu',
        email: 'kitatsu@example.com',
        phone: '+233 50 123 4567',
        responseRate: '95%',
        verified: true
      },
      location: 'Madina',
      propertyCategory: 'Hostel',
      property_category: 'Hostel',
      genderType: 'Girls',
      city: 'Accra',
      state: 'Greater Accra',
      zip: '00000',
      bedrooms: 1,
      bathrooms: 1,
      available_from: '2025-01-01',
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
      stories: [
        {
          type: 'image',
          url: '/lovable-uploads/kitatsu_hostel.jpg',
          duration: 5000,
          caption: 'Front view of Kitatsu Hostel'
        },
        {
          type: 'image',
          url: '/lovable-uploads/kitatsu_hostel_2.jpg',
          duration: 5000,
          caption: 'Common area at Kitatsu Hostel'
        }
      ]
    },
    {
      id: '2',
      title: 'Prestige Hostel',
      type: 'Hostel',
      price: 12000,
      priceUnit: 'semester',
      price_unit: 'semester',
      address: 'Opposite UPSA, East Legon, Accra',
      distanceToCampus: '2 min walk',
      distance_to_campus: '2 min walk',
      images: ['/lovable-uploads/prestige_hostel.jpg', '/lovable-uploads/prestige_hostel_2.jpg'],
      rating: 4.7,
      reviewCount: 42,
      verified: true,
      amenities: ['Wi-Fi', 'Air Conditioning', 'Self-contained', 'Study Area', 'Kitchen'],
      description: 'Located just opposite the UPSA, the Prestige hostel is a popular hostel in East Legon. The proximity to the campus makes it one of the most preferred hostels for UPSA students. The rooms are spacious and self-contained with each room having its own toilet and bath. There are a study and kitchen on each floor for convenience. The security within the hostel is also taken very seriously.',
      house_rules: [
        'No smoking',
        'No pets',
        'Quiet hours from 10 PM to 6 AM'
      ],
      availableUnits: 3,
      owner: {
        name: 'Prestige Housing Ltd',
        phone: '+233 24 567 8901',
        responseRate: '98%',
        verified: true
      },
      location: 'East Legon',
      propertyCategory: 'Hostel',
      genderType: 'Mixed',
      // Required properties for the Property type
      owner_id: '',
      city: 'Accra',
      state: 'Greater Accra',
      zip: '00000',
      bedrooms: 1,
      bathrooms: 1,
      available_from: '2025-01-01',
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
      stories: [
        {
          type: 'image',
          url: '/lovable-uploads/prestige_hostel.jpg',
          duration: 5000,
          caption: 'Front view of Prestige Hostel'
        },
        {
          type: 'image',
          url: '/lovable-uploads/prestige_hostel_2.jpg',
          duration: 5000,
          caption: 'Common area at Prestige Hostel'
        }
      ]
    },
    {
      id: '3',
      title: 'Makasella Hostel',
      type: 'Hostel',
      price: 7500,
      priceUnit: 'semester',
      price_unit: 'semester',
      address: 'Near UPSA, Accra',
      distanceToCampus: '5 min walk',
      distance_to_campus: '5 min walk',
      images: ['/lovable-uploads/makasella_hostel.jpg', '/lovable-uploads/makasella_hostel_2.jpg'],
      rating: 4.2,
      reviewCount: 18,
      verified: true,
      amenities: ['Wi-Fi', 'Security', 'Water Supply'],
      description: 'Located close to UPSA, Makasella hostel is a peaceful and comfortable hostel with many rooms. The hostel houses both male and female students in its walled compound. Students can walk for about 5 minutes to get to the UPSA.',
      house_rules: [
        'No loud music',
        'Keep premises clean',
        'No cooking in rooms'
      ],
      availableUnits: 8,
      owner: {
        name: 'Mr. Makasella',
        phone: '+233 55 234 5678',
        responseRate: '90%',
        verified: true
      },
      location: 'Accra',
      propertyCategory: 'Hostel',
      genderType: 'Mixed',
      // Required properties for the Property type
      owner_id: '',
      city: 'Accra',
      state: 'Greater Accra',
      zip: '00000',
      bedrooms: 1,
      bathrooms: 1,
      available_from: '2025-01-01',
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
      stories: [
        {
          type: 'image',
          url: '/lovable-uploads/makasella_hostel.jpg',
          duration: 5000,
          caption: 'Front view of Makasella Hostel'
        },
        {
          type: 'image',
          url: '/lovable-uploads/makasella_hostel_2.jpg',
          duration: 5000,
          caption: 'Common area at Makasella Hostel'
        }
      ]
    },
    {
      id: '4',
      title: 'MB3 Hostel',
      type: 'Hostel',
      price: 9000,
      priceUnit: 'semester',
      price_unit: 'semester',
      address: 'Madina, Accra',
      distanceToCampus: '7 min walk',
      distance_to_campus: '7 min walk',
      images: ['/lovable-uploads/mb3_hostel.jpg', '/lovable-uploads/mb3_hostel_2.jpg'],
      rating: 4.6,
      reviewCount: 31,
      verified: true,
      amenities: ['Wi-Fi', 'Self-contained', 'Security', 'Study Area'],
      description: 'A very neat and well organized hostel, MB3 hostel is a favourite for students due to its proximity to campus and the great facilities. The rooms are spacious and self contained. You also have access to eateries and shops all around the hostel.',
      house_rules: [
        'No visitors after 9 PM',
        'Register all overnight guests',
        'No cooking in rooms'
      ],
      availableUnits: 4,
      owner: {
        name: 'MB3 Properties Ltd',
        phone: '+233 27 345 6789',
        responseRate: '95%',
        verified: true
      },
      location: 'Madina',
      propertyCategory: 'Hostel',
      genderType: 'Mixed',
      // Required properties for the Property type
      owner_id: '',
      city: 'Accra',
      state: 'Greater Accra',
      zip: '00000',
      bedrooms: 1,
      bathrooms: 1,
      available_from: '2025-01-01',
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
      stories: [
        {
          type: 'image',
          url: '/lovable-uploads/mb3_hostel.jpg',
          duration: 5000,
          caption: 'Front view of MB3 Hostel'
        },
        {
          type: 'image',
          url: '/lovable-uploads/mb3_hostel_2.jpg',
          duration: 5000,
          caption: 'Common area at MB3 Hostel'
        }
      ]
    },
    {
      id: '5',
      title: 'Joy Hostel',
      type: 'Hostel',
      price: 7800,
      priceUnit: 'semester',
      price_unit: 'semester',
      address: 'East Legon, Accra',
      distanceToCampus: '10 min walk',
      distance_to_campus: '10 min walk',
      images: ['/lovable-uploads/joy_hostel.jpg', '/lovable-uploads/joy_hostel_2.jpg'],
      rating: 4.0,
      reviewCount: 15,
      verified: true,
      amenities: ['Shared Facilities', 'Security', 'Water Supply'],
      description: 'Joy hostel is a large hostel for students in East Legon. Rooms are spacious and have shared facilities. Students of Lancaster University can be found in this hostel.',
      house_rules: [
        'Keep noise levels down',
        'No cooking in rooms',
        'No pets allowed'
      ],
      availableUnits: 12,
      owner: {
        name: 'Joy Hostels Ltd',
        phone: '+233 20 456 7890',
        responseRate: '85%',
        verified: true
      },
      location: 'Accra',
      propertyCategory: 'Hostel',
      genderType: 'Mixed',
      // Required properties for the Property type
      owner_id: '',
      city: 'Accra',
      state: 'Greater Accra',
      zip: '00000',
      bedrooms: 1,
      bathrooms: 1,
      available_from: '2025-01-01',
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
      stories: [
        {
          type: 'image',
          url: '/lovable-uploads/joy_hostel.jpg',
          duration: 5000,
          caption: 'Front view of Joy Hostel'
        },
        {
          type: 'image',
          url: '/lovable-uploads/joy_hostel_2.jpg',
          duration: 5000,
          caption: 'Common area at Joy Hostel'
        }
      ]
    },
    {
      id: '6',
      title: 'Heavens Gate Hostel',
      type: 'Hostel',
      price: 10500,
      priceUnit: 'semester',
      price_unit: 'semester',
      address: 'East Legon, Accra',
      distanceToCampus: '8 min walk',
      distance_to_campus: '8 min walk',
      images: ['/lovable-uploads/heavens_gate_hostel.jpg', '/lovable-uploads/heavens_gate_hostel_2.jpg'],
      rating: 4.4,
      reviewCount: 27,
      verified: true,
      amenities: ['Wi-Fi', 'Self-contained', 'Security'],
      description: 'Heavens Gate hostel is located in East Legon and is now a twin hostel. The hostel has an old and a new block as well as spacious self contained rooms for students. All rooms here are 4 in a room which is ideal for UPSA students.',
      house_rules: [
        'No smoking',
        'No parties',
        'Quiet hours from 10 PM'
      ],
      availableUnits: 6,
      owner: {
        name: 'Heavens Gate Ltd',
        phone: '+233 23 567 8901',
        responseRate: '92%',
        verified: true
      },
      location: 'East Legon',
      propertyCategory: 'Hostel',
      genderType: 'Mixed',
      // Required properties for the Property type
      owner_id: '',
      city: 'Accra',
      state: 'Greater Accra',
      zip: '00000',
      bedrooms: 1,
      bathrooms: 1,
      available_from: '2025-01-01',
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
      stories: [
        {
          type: 'image',
          url: '/lovable-uploads/heavens_gate_hostel.jpg',
          duration: 5000,
          caption: 'Front view of Heavens Gate Hostel'
        },
        {
          type: 'image',
          url: '/lovable-uploads/heavens_gate_hostel_2.jpg',
          duration: 5000,
          caption: 'Common area at Heavens Gate Hostel'
        }
      ]
    }
  ];
}
