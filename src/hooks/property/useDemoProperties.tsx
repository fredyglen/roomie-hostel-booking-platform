import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Property, PropertyCategory } from '@/types/property';
import { ErrorHandler } from '@/utils/ErrorHandler';

export const useDemoProperties = () => {
  return useQuery({
    queryKey: ['demo-properties'],
    queryFn: async (): Promise<Property[]> => {
      try {
        ErrorHandler.log('Fetching demo properties from database');
        
        const { data, error } = await supabase
          .from('properties')
          .select(`
            *,
            profiles!owner_id (
              first_name,
              last_name,
              email,
              phone
            )
          `)
          .eq('is_available', true)
          .order('created_at', { ascending: false });

        if (error) {
          ErrorHandler.handle('Error fetching properties:', error);
          throw error;
        }
        // Transform database properties to match our Property type
        const transformedProperties: Property[] = (data || []).map(property => {
          const profileData = Array.isArray(property.profiles) ? property.profiles[0] : property.profiles;
          
          return {
            id: property.id,
            name: property.title, // Add required name field
            status: 'available', // Add required status field
            price: property.rent, // Add required price field
            location: `${property.city}, ${property.state}`, // Add required location field
            university_id: null, // Add required university_id field
            owner_id: property.owner_id,
            title: property.title,
            description: property.description,
            address: property.address,
            city: property.city,
            state: property.state,
            rent: property.rent,
            type: property.property_type,
            property_category: property.property_category as PropertyCategory,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            images: property.images || [],
            amenities: property.amenities || [],
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
            owner: profileData ? {
              name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
              email: profileData.email,
              phone: profileData.phone || '',
              responseRate: '95%',
              verified: true
            } : {
              name: 'Property Owner',
              email: 'owner@example.com',
              phone: '+233 50 123 4567',
              responseRate: '95%',
              verified: true
            },
            rating: 4.5,
            available_from: property.available_from,
            created_at: property.created_at,
            updated_at: property.updated_at,
            is_available: property.is_available
          };
        });

        ErrorHandler.log(`Successfully loaded ${transformedProperties.length} properties`);
        return transformedProperties;
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch properties';
        ErrorHandler.handle('Property fetch error:', errorMessage);
        throw new Error(errorMessage);
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2
  });
};
