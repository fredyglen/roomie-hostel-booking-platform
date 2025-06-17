
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Property, PropertyCategory, PropertyType } from '@/types/property';
import { ErrorHandler } from '@/utils/ErrorHandler';
import { ghanaHostelsSemesterPricing } from '@/data/ghana-hostels-semester-pricing';

// Transform mock Ghana hostel data to Property format
const transformMockData = (): Property[] => {
  return ghanaHostelsSemesterPricing.map(hostel => ({
    id: hostel.id,
    name: hostel.name,
    title: hostel.name,
    status: 'available' as const,
    price: hostel.pricePerSemester,
    rent: hostel.pricePerSemester,
    location: `${hostel.location.city}, ${hostel.location.state}`,
    zip: '00000',
    propertyCategory: 'Hostel' as PropertyCategory,
    verified: true,
    owner_id: hostel.owner.id,
    description: hostel.description,
    address: hostel.location.address,
    city: hostel.location.city,
    state: hostel.location.state,
    type: hostel.propertyType as PropertyType,
    property_category: 'Hostel' as PropertyCategory,
    bedrooms: hostel.bedrooms,
    bathrooms: hostel.bathrooms,
    images: hostel.images,
    amenities: hostel.amenities,
    is_available: hostel.isActive,
    available_from: hostel.availableFrom,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    verification_status: 'verified' as const,
    gender_restriction: hostel.amenities.includes('Female Only') ? 'female' :
                       hostel.amenities.includes('Male Only') ? 'male' : 'mixed',
    parking_available: hostel.amenities.includes('Parking Space'),
    total_rooms: 10,
    rooms_available: 8,
    beds_per_room: hostel.maxOccupants,
    beds_available: 8 * hostel.maxOccupants,
    max_occupants: hostel.maxOccupants,
    has_bedframes: true,
    has_mattresses: true,
    has_wardrobes: true,
    has_fan: true,
    has_tiled_room: true,
    has_individual_meters: hostel.amenities.includes('Self-Contained'),
    washroom_type: hostel.bathrooms > 0 ? 'inside' : 'shared' as const,
    meter_type: 'shared' as const,
    owner: hostel.owner,
    rating: 4.5,
    house_rules: hostel.house_rules,
    stories: hostel.stories || [],
    features: hostel.features
  }));
};

export const useDemoProperties = () => {
  return useQuery({
    queryKey: ['demo-properties'],
    queryFn: async (): Promise<Property[]> => {
      try {
        ErrorHandler.log('Fetching demo properties from database');
        
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('is_available', true)
          .order('created_at', { ascending: false });

        if (error) {
          ErrorHandler.handle('Error fetching properties', error.message);
          // Fallback to mock data if database query fails
          return transformMockData();
        }

        // If no data from database, use mock data
        if (!data || data.length === 0) {
          ErrorHandler.log('No properties in database, using mock data');
          return transformMockData();
        }

        // Transform database properties to match our Property type
        const transformedProperties: Property[] = (data || []).map(property => {
          
          return {
            id: property.id,
            name: property.title,
            title: property.title,
            status: 'available',
            price: property.rent,
            rent: property.rent,
            location: `${property.city}, ${property.state}`,
            zip: property.zip || '00000',
            propertyCategory: (property.property_category as PropertyCategory) || 'Hostel',
            verified: property.verification_status === 'verified',
            owner_id: property.owner_id,
            description: property.description,
            address: property.address,
            city: property.city,
            state: property.state,
            type: (property.property_type as PropertyType) || 'hostel',
            property_category: property.property_category as PropertyCategory,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            images: property.images || [],
            amenities: property.amenities || [],
            is_available: property.is_available,
            available_from: property.available_from,
            created_at: property.created_at,
            updated_at: property.updated_at,
            verification_status: property.verification_status as 'pending' | 'verified' | 'rejected',
            gender_restriction: property.gender_restriction,
            parking_available: property.parking_available,
            total_rooms: property.total_rooms,
            rooms_available: property.rooms_available,
            beds_per_room: property.beds_per_room,
            beds_available: property.beds_available,
            max_occupants: property.max_occupants,
            has_bedframes: property.has_bedframes,
            has_mattresses: property.has_mattresses,
            has_wardrobes: property.has_wardrobes,
            has_fan: property.has_fan,
            has_tiled_room: property.has_tiled_room,
            has_individual_meters: property.has_individual_meters,
            washroom_type: property.washroom_type as 'inside' | 'outside' | 'shared',
            meter_type: property.meter_type as 'self' | 'shared',
            owner: {
              id: property.owner_id || 'unknown',
              name: 'Property Owner',
              email: 'owner@example.com',
              phone: '+233 50 123 4567',
              responseRate: '95%',
              verified: true
            },
            rating: 4.5,
            house_rules: '',
            stories: [],
            features: []
          };
        });

        ErrorHandler.log(`Successfully loaded ${transformedProperties.length} properties`);
        return transformedProperties;
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch properties';
        ErrorHandler.handle('Property fetch error', errorMessage);
        throw new Error(errorMessage);
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2
  });
};
