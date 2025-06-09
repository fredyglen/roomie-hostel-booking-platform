
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Property, PropertyType, PropertyCategory } from '@/types/property';
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
              id,
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
          name: data.title,
          title: data.title,
          description: data.description,
          address: data.address,
          city: data.city,
          state: data.state,
          zip: data.zip || '00233',
          rent: data.rent,
          price: data.rent,
          type: (data.property_type as PropertyType) || 'hostel',
          propertyCategory: (data.property_category as PropertyCategory) || 'Hostel',
          verified: true,
          is_available: data.is_available,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          images: data.images || ['/placeholder.svg'],
          amenities: data.amenities || [],
          location: `${data.city}, ${data.state}`,
          available_from: data.available_from,
          available_to: data.available_to,
          created_at: data.created_at,
          updated_at: data.updated_at,
          owner: profileData ? {
            id: profileData.id || 'unknown',
            name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Property Owner',
            email: profileData.email || 'owner@example.com',
            phone: profileData.phone || '+233 50 123 4567',
            responseRate: '95%',
            verified: true
          } : {
            id: 'unknown',
            name: 'Property Owner',
            email: 'owner@example.com',
            phone: '+233 50 123 4567',
            responseRate: '95%',
            verified: true
          },
          house_rules: 'No smoking inside, No loud music after 10 PM',
          stories: [],
          features: []
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
