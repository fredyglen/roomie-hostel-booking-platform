import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Property } from '@/types/property';
import { logger } from '@/utils/logger';

// Sample properties data as fallback (keeping existing implementation)
const getSampleProperties = (): Property[] => {
  return [
    {
      id: "1",
      owner_id: "owner1",
      title: "Modern Student Apartment near Legon",
      description: "A beautiful 2-bedroom apartment perfect for students, located just 10 minutes walk from University of Ghana main campus.",
      type: "2 bedroom",
      address: "East Legon, Accra",
      city: "Accra",
      state: "Greater Accra",
      rent: 1800,
      bedrooms: 2,
      bathrooms: 1,
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800&h=600",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800&h=600"
      ],
      amenities: ["WiFi", "Air Conditioning", "Kitchen", "Parking", "Security"],
      rating: 4.5,
      owner: {
        name: "Kwame Asante",
        email: "kwame@example.com",
        phone: "+233 24 123 4567",
        responseRate: "95%",
        verified: true
      },
      available_from: "2024-08-01",
      created_at: "2024-01-15T00:00:00Z"
    }
    // ... other sample properties
  ];
};

export const normalizePropertyData = (dbProperty: any): Property => {
  const profileData = Array.isArray(dbProperty.profiles) ? dbProperty.profiles[0] : dbProperty.profiles;
  
  return {
    id: dbProperty.id,
    owner_id: dbProperty.owner_id,
    title: dbProperty.title,
    description: dbProperty.description,
    address: dbProperty.address,
    city: dbProperty.city,
    state: dbProperty.state,
    rent: dbProperty.rent,
    type: dbProperty.property_type,
    property_category: dbProperty.property_category,
    bedrooms: dbProperty.bedrooms,
    bathrooms: dbProperty.bathrooms,
    images: dbProperty.images || [],
    amenities: dbProperty.amenities || [],
    verification_status: dbProperty.verification_status,
    gender_restriction: dbProperty.gender_restriction,
    parking_available: dbProperty.parking_available,
    total_rooms: dbProperty.total_rooms,
    rooms_available: dbProperty.rooms_available,
    beds_per_room: dbProperty.beds_per_room,
    beds_available: dbProperty.beds_available,
    max_occupants: dbProperty.max_occupants,
    has_bedframes: dbProperty.has_bedframes,
    has_mattresses: dbProperty.has_mattresses,
    has_wardrobes: dbProperty.has_wardrobes,
    has_fan: dbProperty.has_fan,
    has_tiled_room: dbProperty.has_tiled_room,
    has_individual_meters: dbProperty.has_individual_meters,
    washroom_type: dbProperty.washroom_type,
    meter_type: dbProperty.meter_type,
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
    available_from: dbProperty.available_from,
    created_at: dbProperty.created_at,
    updated_at: dbProperty.updated_at,
    is_available: dbProperty.is_available
  };
};

export const usePropertyData = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      logger.info('Fetching properties from database');
      
      // Try to fetch from Supabase first
      const { data, error: fetchError } = await supabase
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

      if (fetchError) {
        logger.error('Error fetching properties from database:', fetchError);
        // Fall back to sample data
        logger.info('Falling back to sample properties');
        setProperties(getSampleProperties());
        return;
      }

      if (data && data.length > 0) {
        // Transform database properties to match our Property type
        const transformedProperties: Property[] = data.map(normalizePropertyData);
        setProperties(transformedProperties);
        logger.info(`Successfully loaded ${transformedProperties.length} properties from database`);
      } else {
        // No data in database, use sample data
        logger.info('No properties in database, using sample data');
        setProperties(getSampleProperties());
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch properties';
      logger.error('Property fetch error:', errorMessage);
      setError(errorMessage);
      // Fall back to sample data on error
      setProperties(getSampleProperties());
    } finally {
      setLoading(false);
    }
  };

  const getPropertyById = async (id: string): Promise<Property | null> => {
    try {
      logger.info('Fetching property by ID:', id);
      
      // First try database
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
        .eq('id', id)
        .single();

      if (error) {
        logger.error('Error fetching property by ID from database:', error);
        // Fall back to sample data
        const sampleProperties = getSampleProperties();
        return sampleProperties.find(p => p.id === id) || null;
      }

      if (data) {
        const transformedProperty = normalizePropertyData(data);
        logger.info('Successfully loaded property from database:', transformedProperty.title);
        return transformedProperty;
      }

      // Fall back to sample data
      const sampleProperties = getSampleProperties();
      return sampleProperties.find(p => p.id === id) || null;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch property';
      logger.error('Property fetch by ID error:', errorMessage);
      // Fall back to sample data
      const sampleProperties = getSampleProperties();
      return sampleProperties.find(p => p.id === id) || null;
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return {
    properties,
    loading,
    error,
    refreshProperties: fetchProperties,
    getPropertyById
  };
};

// Export the getSampleProperties for use in other components
export { getSampleProperties };
