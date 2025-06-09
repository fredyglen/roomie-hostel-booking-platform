import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Property } from '@/types/property';
import { logger } from '@/utils/logger';

export const usePropertyLoader = (propertyId: string | undefined) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProperty = async () => {
      if (!propertyId) {
        setError('Property ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        logger.info('Loading property', { propertyId });
        
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
          .eq('id', propertyId)
          .eq('is_available', true)
          .single();

        if (fetchError) {
          logger.error('Error fetching property', { error: fetchError, propertyId });
          setError(fetchError.message);
          setProperty(null);
          setLoading(false);
          return;
        }

        if (!data) {
          throw new Error('Property not found');
        }

        // Transform database property to match our Property type
        // Handle profiles - it might be an array or a single object
        const profileData = Array.isArray(data.profiles) ? data.profiles[0] : data.profiles;
        
        const transformedProperty: Property = {
          id: data.id,
          owner_id: data.owner_id,
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
          available_from: data.available_from,
          available_to: data.available_to,
          created_at: data.created_at,
          updated_at: data.updated_at
        };

        setProperty(transformedProperty);
        logger.info('Property loaded successfully', { propertyId });
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load property';
        logger.error('Property loading error', { error: errorMessage, propertyId });
        setError(errorMessage);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [propertyId]);

  return { property, loading, error };
};
