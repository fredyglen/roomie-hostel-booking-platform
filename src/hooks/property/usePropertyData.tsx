
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
            email,
            phone
          )
        `)
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (fetchError) {
        logger.error('Error fetching properties', { error: fetchError });
        throw fetchError;
      }

      // Transform database properties to match our Property type
      const transformedProperties: Property[] = (data || []).map(property => {
        // Handle profiles - it might be an array or a single object
        const profileData = Array.isArray(property.profiles) ? property.profiles[0] : property.profiles;
        
        return {
          id: property.id,
          owner_id: property.owner_id,
          title: property.title,
          description: property.description,
          address: property.address,
          city: property.city,
          state: property.state,
          zip: property.zip,
          rent: property.rent,
          price: property.rent, // Map rent to price for consistency
          type: property.property_type,
          property_type: property.property_type,
          property_category: property.property_category,
          propertyCategory: property.property_category,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          size: property.size,
          available_from: property.available_from,
          available_to: property.available_to,
          is_furnished: property.is_furnished,
          is_available: property.is_available,
          images: property.images || [],
          amenities: property.amenities || [],
          gender_restriction: property.gender_restriction,
          genderType: property.gender_restriction,
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
          washroom_type: property.washroom_type,
          meter_type: property.meter_type,
          verification_status: property.verification_status,
          status: property.is_available ? 'Available' : 'Not Available',
          verified: property.verification_status === 'verified',
          priceUnit: 'month',
          location: `${property.address}, ${property.city}`,
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
          reviewCount: Math.floor(Math.random() * 50) + 5,
          created_at: property.created_at,
          updated_at: property.updated_at,
          house_rules: [
            'No smoking inside',
            'No loud music after 10 PM',
            'Keep common areas clean',
            'Visitors must be registered'
          ]
        };
      });

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
      const profileData = Array.isArray(data.profiles) ? data.profiles[0] : data.profiles;
      
      const transformedProperty: Property = {
        id: data.id,
        owner_id: data.owner_id,
        title: data.title,
        description: data.description,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        rent: data.rent,
        price: data.rent,
        type: data.property_type,
        property_type: data.property_type,
        property_category: data.property_category,
        propertyCategory: data.property_category,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        size: data.size,
        available_from: data.available_from,
        available_to: data.available_to,
        is_furnished: data.is_furnished,
        is_available: data.is_available,
        images: data.images || [],
        amenities: data.amenities || [],
        gender_restriction: data.gender_restriction,
        genderType: data.gender_restriction,
        parking_available: data.parking_available,
        total_rooms: data.total_rooms,
        rooms_available: data.rooms_available,
        beds_per_room: data.beds_per_room,
        beds_available: data.beds_available,
        max_occupants: data.max_occupants,
        has_bedframes: data.has_bedframes,
        has_mattresses: data.has_mattresses,
        has_wardrobes: data.has_wardrobes,
        has_fan: data.has_fan,
        has_tiled_room: data.has_tiled_room,
        has_individual_meters: data.has_individual_meters,
        washroom_type: data.washroom_type,
        meter_type: data.meter_type,
        verification_status: data.verification_status,
        status: data.is_available ? 'Available' : 'Not Available',
        verified: data.verification_status === 'verified',
        priceUnit: 'month',
        location: `${data.address}, ${data.city}`,
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
        reviewCount: Math.floor(Math.random() * 50) + 5,
        created_at: data.created_at,
        updated_at: data.updated_at,
        house_rules: [
          'No smoking inside',
          'No loud music after 10 PM',
          'Keep common areas clean',
          'Visitors must be registered'
        ]
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
