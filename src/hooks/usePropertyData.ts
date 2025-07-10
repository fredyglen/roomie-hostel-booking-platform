/**
 * ⚠️ DEPRECATED HOOK - USE useDynamicProperties INSTEAD
 *
 * This hook contains hardcoded sample data and is being replaced by:
 * - useDynamicProperties from @/hooks/property/useDynamicProperties
 * - enhancedPropertyService from @/services/enhanced-property.service
 *
 * This file remains for backward compatibility only.
 * All new components should use the dynamic data loading system.
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Property,
  PropertyId,
  PropertyPrice,
  createPropertyId,
  createPropertyPrice
} from '@/types/property';
import { User } from '@/types/core';
import { logger } from '@/utils/logger';
import { ErrorHandler } from '@/utils/ErrorHandler';

// Sample properties data as fallback (using unified Property interface)
const getSampleProperties = (): Property[] => {
  return [
    {
      // Core identification with branded types
      id: createPropertyId('sample-1'),
      name: 'Modern Apartment',
      description: 'A modern apartment in Accra with excellent amenities.',
      type: 'apartment',
      status: 'available',

      // Location information
      address: {
        street: '123 Main St',
        city: 'Accra',
        state: 'Greater Accra',
        zipCode: '00233',
        country: 'Ghana',
        coordinates: {
          latitude: 5.6037,
          longitude: -0.1870
        }
      },

      // Pricing with branded types
      price: createPropertyPrice(1200),

      // Physical features
      features: {
        bedrooms: 2,
        bathrooms: 2,
        kitchens: 1,
        parkingSpaces: 1,
        furnished: true,
        petsAllowed: false,
        utilities: {
          water: true,
          electricity: true,
          internet: true,
          gas: true,
          cleaning: false,
          security: true,
        },
        amenities: ['WiFi', 'Air Conditioning', 'Parking', 'Security'],
        rules: ['No smoking', 'No pets'],
      },

      // Media
      media: [
        {
          id: 'sample-1-img-1',
          url: '/images/sample-apartment-1.jpg',
          type: 'image',
          isCover: true,
        }
      ],

      // Ownership and metadata
      ownerId: 'owner1',
      owner: {
        id: 'owner1',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone: '+233123456789',
        role: 'owner',
      },
      buildings: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      verificationStatus: 'verified',
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
    title: String(dbProperty.title ?? dbProperty.name ?? ''),
    description: String(dbProperty.description ?? ''),
    type: dbProperty.property_type as Property['type'] ?? 'apartment',
    status: dbProperty.status as Property['status'] ?? 'available',
    price: Number(dbProperty.price ?? dbProperty.rent ?? 0),
    rent: Number(dbProperty.price ?? dbProperty.rent ?? 0),
    location: typeof dbProperty.location === 'object' && dbProperty.location !== null
      ? dbProperty.location as Property['location']
      : {
          address: String(dbProperty.address ?? ''),
          city: String(dbProperty.city ?? ''),
          state: String(dbProperty.state ?? ''),
        },
    address: String(dbProperty.address ?? ''),
    city: String(dbProperty.city ?? ''),
    state: String(dbProperty.state ?? ''),
    zip: String(dbProperty.zip ?? ''),
    propertyCategory: dbProperty.property_category as Property['propertyCategory'] ?? 'Hostel',
    verified: Boolean(dbProperty.verified ?? true),
    is_available: Boolean(dbProperty.is_available ?? true),
    bedrooms: Number(dbProperty.bedrooms ?? 1),
    bathrooms: Number(dbProperty.bathrooms ?? 1),
    available_from: String(dbProperty.available_from ?? ''),
    amenities: Array.isArray(dbProperty.amenities) ? dbProperty.amenities as string[] : [],
    images: Array.isArray(dbProperty.images) ? dbProperty.images as string[] : [],
    created_at: String(dbProperty.created_at ?? ''),
    updated_at: String(dbProperty.updated_at ?? ''),
    owner: profileData ? {
      id: String(profileData.id ?? 'unknown'),
      name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Property Owner',
      email: profileData.email || 'owner@example.com',
      phone: profileData.phone || '+233123456789',
      responseRate: '95%',
      verified: true
    } : undefined,
    house_rules: String(dbProperty.house_rules ?? ''),
    stories: [],
    features: Array.isArray(dbProperty.features) ? dbProperty.features as string[] : []
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
        // CRITICAL FIX: Return empty array instead of sample data
        // This ensures students only see real owner-provided properties
        logger.info('Database error - showing empty state instead of fake data');
        setProperties([]);
        return;
      }

      if (data && data.length > 0) {
        // Transform database properties to match our Property type
        const transformedProperties: Property[] = data.map(normalizePropertyData);
        setProperties(transformedProperties);
        logger.info(`Successfully loaded ${transformedProperties.length} properties from database`);
      } else {
        // CRITICAL FIX: Show empty state instead of sample data
        // This ensures students only see real owner-provided properties
        logger.info('No properties in database - showing empty state');
        setProperties([]);
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
        // CRITICAL FIX: Return null instead of falling back to sample data
        // This ensures students only see real owner-provided properties
        logger.info('Database error - property not found');
        return null;
      }

      if (data) {
        const transformedProperty = normalizePropertyData(data);
        logger.info('Successfully loaded property from database:', transformedProperty.name);
        return transformedProperty;
      }

      // CRITICAL FIX: Return null instead of sample data
      // This ensures students only see real owner-provided properties
      return null;
      
    } catch (err) {
      ErrorHandler.handle(err, 'usePropertyData property fetch by ID error');
      // CRITICAL FIX: Return null instead of sample data
      // This ensures students only see real owner-provided properties
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
    getPropertyById,
    fetchProperties
  };
};

// Export the getSampleProperties for use in other components
export { getSampleProperties };
