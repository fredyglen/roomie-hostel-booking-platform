
import { useQuery } from '@tanstack/react-query';
import { supabase, Property } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

interface UsePropertyLoaderOptions {
  propertyId: string;
  enabled?: boolean;
  forOwner?: boolean;
}

export const usePropertyLoader = ({ propertyId, enabled = true, forOwner = true }: UsePropertyLoaderOptions) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['property', propertyId],
    queryFn: async (): Promise<Property> => {
      if (!propertyId) throw new Error('Property ID is required');
      
      // For owner view, we require owner authentication
      if (forOwner && !user?.id) throw new Error('User not authenticated');

      let query = supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId);
      
      // Add owner check if this is for owner view
      if (forOwner) {
        query = query.eq('owner_id', user!.id);
      }

      const { data, error } = await query.single();

      if (error) throw error;
      if (!data) throw new Error('Property not found');

      // Convert database property to our frontend property format
      // Add type assertion to include our custom properties
      const propertyData = data as any;
      
      return {
        ...data,
        type: data.property_type,
        price: data.rent,
        price_unit: 'month', // Default to month
        status: data.is_available ? 'Available' : 'Not Available',
        occupancy: '0/1', // Default occupancy
        propertyCategory: propertyData.property_category || 'Hostel',
        allInclusive: propertyData.all_inclusive || false,
        all_inclusive: propertyData.all_inclusive || false,
        total_rooms: propertyData.total_rooms || 1,
        rooms_available: propertyData.rooms_available || 1,
        beds_per_room: propertyData.beds_per_room || 1,
        beds_available: propertyData.beds_available || 1,
        max_occupants: propertyData.max_occupants || 1,
        has_bedframes: propertyData.has_bedframes || false,
        has_mattresses: propertyData.has_mattresses || false,
        has_wardrobes: propertyData.has_wardrobes || false,
        has_individual_meters: propertyData.has_individual_meters || false,
        advance_payment_months: propertyData.advance_payment_months || 12,
        allow_bill_sharing: propertyData.allow_bill_sharing || false,
        landmark: propertyData.landmark || '',
      } as Property;
    },
    enabled: !!propertyId && (!!user?.id || !forOwner) && enabled,
  });
};
