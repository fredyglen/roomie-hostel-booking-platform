import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Property } from '@/types/property';
import { logger } from '@/utils/logger';
import { ErrorHandler } from '@/utils/ErrorHandler';

// Sample properties data as fallback (keeping existing implementation)
const getSampleProperties = (): Property[] => {
  return [
    {
      id: '1',
      name: 'Modern Apartment',
      description: 'A modern apartment in Accra.',
      type: 'apartment',
      status: 'available',
      price: 1200,
      location: {
        address: '123 Main St',
        city: 'Accra',
        state: 'Greater Accra',
        country: 'Ghana',
      },
      owner_id: 'owner1',
      university_id: 'uni1',
      amenities: [
        { id: 'wifi', name: 'WiFi' },
        { id: 'ac', name: 'AC' },
        { id: 'parking', name: 'Parking' }
      ],
      images: [],
      created_at: '',
      updated_at: '',
      rating: 4.5,
      review_count: 10,
      rules: ['No smoking', 'No pets'],
      features: ['balcony', 'ensuite']
    }
    // ... other sample properties
  ];
};

export const normalizePropertyData = (dbProperty: Record<string, unknown>): Property => {
  const profileData = Array.isArray(dbProperty.profiles) ? dbProperty.profiles[0] : dbProperty.profiles;
  
  return {
    id: String(dbProperty.id ?? ''),
    owner_id: String(dbProperty.owner_id ?? ''),
    name: String(dbProperty.name ?? dbProperty.title ?? ''),
    description: String(dbProperty.description ?? ''),
    type: dbProperty.property_type as Property['type'] ?? 'apartment',
    status: dbProperty.status as Property['status'] ?? 'available',
    price: Number(dbProperty.price ?? dbProperty.rent ?? 0),
    location: typeof dbProperty.location === 'object' && dbProperty.location !== null
      ? dbProperty.location as Property['location']
      : {
          address: String(dbProperty.address ?? ''),
          city: String(dbProperty.city ?? ''),
          state: String(dbProperty.state ?? ''),
          country: String(dbProperty.country ?? 'Ghana'),
        },
    university_id: String(dbProperty.university_id ?? ''),
    amenities: Array.isArray(dbProperty.amenities) ? dbProperty.amenities as Property['amenities'] : [],
    images: Array.isArray(dbProperty.images) ? dbProperty.images as string[] : [],
    created_at: String(dbProperty.created_at ?? ''),
    updated_at: String(dbProperty.updated_at ?? ''),
    rating: Number(dbProperty.rating ?? 0),
    review_count: Number(dbProperty.review_count ?? 0),
    rules: Array.isArray(dbProperty.rules) ? dbProperty.rules as string[] : [],
    features: Array.isArray(dbProperty.features) ? dbProperty.features as string[] : [],
  };
};

export const usePropertyData = (): [Property[], boolean, string | null] => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
        ErrorHandler.handle(fetchError, 'usePropertyData error fetching properties from database');
        // Fall back to sample data
        logger.info('Falling back to sample properties after fetch error');
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
      ErrorHandler.handle(err, 'usePropertyData.fetchProperties');
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch properties';
      setError(errorMessage);
      setProperties([]);
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
        ErrorHandler.handle(error, 'usePropertyData error fetching property by ID from database');
        // Fall back to sample data
        const sampleProperties = getSampleProperties();
        const sampleProperty = sampleProperties.find(p => p.id === id);
        if (sampleProperty) {
          ErrorHandler.log(`Found property in sample data: ${sampleProperty.name}`);
          return sampleProperty;
        }
        return null;
      }

      if (data) {
        const transformedProperty = normalizePropertyData(data);
        logger.info('Successfully loaded property from database:', transformedProperty.name);
        return transformedProperty;
      }

      // Fall back to sample data
      const sampleProperties = getSampleProperties();
      const sampleProperty = sampleProperties.find(p => p.id === id);
      if (sampleProperty) {
        ErrorHandler.log(`Found property in sample data: ${sampleProperty.name}`);
        return sampleProperty;
      }
      return null;
      
    } catch (err) {
      ErrorHandler.handle(err, 'usePropertyData property fetch by ID error');
      // Fall back to sample data
      const sampleProperties = getSampleProperties();
      const sampleProperty = sampleProperties.find(p => p.id === id);
      if (sampleProperty) {
        ErrorHandler.log(`Found property in sample data: ${sampleProperty.name}`);
        return sampleProperty;
      }
      return null;
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return [properties, loading, error];
};

// Export the getSampleProperties for use in other components
export { getSampleProperties };
