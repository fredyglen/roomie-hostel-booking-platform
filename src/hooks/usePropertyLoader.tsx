import { useQuery } from '@tanstack/react-query';
import { supabase, Property } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Story } from '@/types/property';

interface UsePropertyLoaderOptions {
  propertyId: string;
  enabled?: boolean;
  forOwner?: boolean;
}

export const usePropertyLoader = ({ propertyId, enabled = true, forOwner = false }: UsePropertyLoaderOptions) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['property', propertyId],
    queryFn: async (): Promise<Property> => {
      if (!propertyId) throw new Error('Property ID is required');
      
      // For owner view, we require owner authentication
      if (forOwner && !user?.id) throw new Error('User not authenticated');

      let query = supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId);
      
      // Add owner check if this is for owner view
      if (forOwner) {
        query = query.eq('owner_id', user!.id);
      }

      const { data, error } = await query.maybeSingle();

      if (error) throw error;
      if (!data) {
        // For now, return sample data if property not found in DB
        // This is a temporary solution until all properties are in the DB
        const sampleProperties = getSampleProperties();
        const sampleProperty = sampleProperties.find(p => p.id === propertyId);
        if (!sampleProperty) throw new Error('Property not found');
        return sampleProperty;
      }

      // Convert database property to our frontend property format
      // Add type assertion to include our custom properties
      const propertyData = data as any;
      
      return {
        ...data,
        owner_id: data.owner_id || '',
        city: data.city || '',
        state: data.state || '',
        zip: data.zip || '',
        bedrooms: data.bedrooms || 0,
        bathrooms: data.bathrooms || 0,
        available_from: data.available_from || '',
        created_at: data.created_at || '',
        updated_at: data.updated_at || '',
        type: data.property_type,
        price: data.rent,
        priceUnit: 'semester', // Default to semester
        status: data.is_available ? 'Available' : 'Not Available',
        occupancy: '0/1', // Default occupancy
        propertyCategory: propertyData.property_category || 'Hostel',
        allInclusive: propertyData.all_inclusive || false,
        all_inclusive: propertyData.all_inclusive || false,
        total_rooms: propertyData.total_rooms || 1,
        rooms_available: propertyData.rooms_available || 1,
        beds_per_room: propertyData.beds_per_room || 1,
        beds_available: propertyData.beds_available || 1,
        max_occupants: propertyData.max_occupants || 1,
        has_bedframes: propertyData.has_bedframes || false,
        has_mattresses: propertyData.has_mattresses || false,
        has_wardrobes: propertyData.has_wardrobes || false,
        has_individual_meters: propertyData.has_individual_meters || false,
        advance_payment_months: propertyData.advance_payment_months || 12,
        allow_bill_sharing: propertyData.allow_bill_sharing || false,
        landmark: propertyData.landmark || '',
        // Add stories from images if they exist
        stories: propertyData.stories || convertImagesToStories(data.images || [])
      } as Property;
    },
    enabled: !!propertyId && (!!user?.id || !forOwner) && enabled,
  });
};

// Convert images to stories if no stories are defined
function convertImagesToStories(images: string[]): Story[] {
  return images.map(imageUrl => ({
    type: 'image',
    url: imageUrl,
    duration: 5000
  }));
}

// Sample property data for fallback
function getSampleProperties() {
  return [
    {
      id: '1',
      title: 'Kitatsu Hostel (All Girls Hostel)',
      type: 'Hostel',
      price: 8500,
      priceUnit: 'semester',
      address: 'Near UPSA, Madina, Accra',
      distanceToCampus: '5 min walk',
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
        phone: '+233 50 123 4567',
        responseRate: '95%',
        verified: true
      },
      location: 'Madina',
      propertyCategory: 'Hostel',
      genderType: 'Girls',
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
      address: 'Opposite UPSA, East Legon, Accra',
      distanceToCampus: '2 min walk',
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
      address: 'Near UPSA, Accra',
      distanceToCampus: '5 min walk',
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
      address: 'Madina, Accra',
      distanceToCampus: '7 min walk',
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
      address: 'East Legon, Accra',
      distanceToCampus: '10 min walk',
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
      address: 'East Legon, Accra',
      distanceToCampus: '8 min walk',
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
