
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Property } from '@/types/property';
import { logger } from '@/utils/logger';

export const usePropertyData = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      logger.info('Fetching properties from database');
      
      const { data, error: fetchError } = await supabase
        .from('properties')
        .select(`
          *,
          profiles!owner_id (
            first_name,
            last_name,
            email
          )
        `)
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (fetchError) {
        logger.error('Error fetching properties', { error: fetchError });
        throw fetchError;
      }

      // Transform database properties to match our Property type
      const transformedProperties: Property[] = (data || []).map(property => ({
        id: property.id,
        title: property.title,
        description: property.description,
        address: property.address,
        city: property.city,
        state: property.state,
        rent: property.rent,
        type: property.property_type,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        images: property.images || [],
        amenities: property.amenities || [],
        owner: property.profiles ? {
          id: property.owner_id,
          name: `${property.profiles.first_name || ''} ${property.profiles.last_name || ''}`.trim(),
          email: property.profiles.email
        } : undefined,
        distance: '1.2 km', // This would be calculated based on user location
        rating: 4.5, // This would come from reviews
        available_from: property.available_from,
        available_to: property.available_to,
        created_at: property.created_at,
        updated_at: property.updated_at
      }));

      setProperties(transformedProperties);
      logger.info(`Successfully loaded ${transformedProperties.length} properties`);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch properties';
      logger.error('Property fetch error', { error: errorMessage });
      setError(errorMessage);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const getPropertyById = async (id: string): Promise<Property | null> => {
    try {
      logger.info('Fetching property by ID', { id });
      
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
        logger.error('Error fetching property by ID', { error, id });
        throw error;
      }

      if (!data) {
        logger.warn('Property not found', { id });
        return null;
      }

      // Transform database property to match our Property type
      const transformedProperty: Property = {
        id: data.id,
        title: data.title,
        description: data.description,
        address: data.address,
        city: data.city,
        state: data.state,
        rent: data.rent,
        type: data.property_type,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        images: data.images || [],
        amenities: data.amenities || [],
        owner: data.profiles ? {
          id: data.owner_id,
          name: `${data.profiles.first_name || ''} ${data.profiles.last_name || ''}`.trim(),
          email: data.profiles.email,
          phone: data.profiles.phone
        } : undefined,
        distance: '1.2 km',
        rating: 4.5,
        available_from: data.available_from,
        available_to: data.available_to,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      logger.info('Successfully loaded property', { id: transformedProperty.id });
      return transformedProperty;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch property';
      logger.error('Property fetch by ID error', { error: errorMessage, id });
      return null;
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
