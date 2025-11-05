/**
 * useNearbyProperties
 * Schema-backed proximity hook powered by properties_nearby RPC
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Property } from '@/types/property';

export interface NearbyInput {
  latitude: number;
  longitude: number;
  radiusKm?: number | null;
  limit?: number;
  offset?: number;
}

export interface NearbyResult {
  properties: readonly Property[];
  distancesById: Readonly<Record<string, number>>;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

function mapDbToProperty(p: any): Property {
  return {
    id: p.id,
    name: p.title || p.name,
    title: p.title,
    description: p.description,
    price: p.price,
    rent: p.rent ?? p.price,
    location: p.address || `${p.city}, ${p.state}`,
    address: p.address,
    city: p.city,
    state: p.state,
    zip: p.zip || '00000',
    type: p.type,
    propertyCategory: p.property_category,
    property_category: p.property_category,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    max_occupants: p.max_occupants,
    images: Array.isArray(p.images) ? p.images : [],
    amenities: Array.isArray(p.amenities) ? p.amenities : [],
    verified: p.verification_status === 'verified',
    verification_status: p.verification_status || 'pending',
    available_from: p.available_from,
    is_available: p.is_available,
    status: p.is_available ? 'available' : 'unavailable',
    owner_id: p.owner_id,
    rating: 4.5,
    house_rules: p.house_rules || '',
    stories: [],
    features: p.features || [],
  } as Property;
}

export function useNearbyProperties(input: NearbyInput | null, enabled = true): NearbyResult {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['properties', 'nearby', input],
    enabled: enabled && !!input,
    queryFn: async () => {
      if (!input) throw new Error('Input is required');
      const { latitude, longitude, radiusKm = null, limit = 20, offset = 0 } = input;
      const { data, error } = await supabase.rpc('properties_nearby', {
        user_lat: latitude,
        user_lon: longitude,
        radius_km: radiusKm,
        limit_count: limit,
        offset_count: offset,
      });
      if (error) throw new Error(error.message);
      const rows = (data || []) as any[];
      const props = rows.map(mapDbToProperty);
      const distances = Object.fromEntries(rows.map((r) => [String(r.id), Number(r.distance_km || 0)]));
      return { props, distances } as const;
    },
  });

  return {
    properties: data?.props || [],
    distancesById: (data?.distances || {}) as Readonly<Record<string, number>>,
    isLoading,
    isError,
    error: (error as Error) || null,
    refetch,
  };
}

