
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Property } from '@/types/property';
import { normalizePropertyData, getSampleProperties } from './usePropertyData';

interface UsePropertyLoaderOptions {
  propertyId: string;
  enabled?: boolean;
  forOwner?: boolean;
}

export const usePropertyLoader = ({ propertyId, enabled = true, forOwner = false }: UsePropertyLoaderOptions) => {
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

      const { data, error } = await query.maybeSingle();

      if (error) {
        console.error("Error fetching property:", error);
        throw error;
      }
      
      // If no data found in database, check the sample properties
      if (!data) {
        console.log("Property not found in database, checking sample data for ID:", propertyId);
        const sampleProperties = getSampleProperties();
        const sampleProperty = sampleProperties.find(p => p.id === propertyId);
        
        if (!sampleProperty) {
          console.error("Property not found in sample data either");
          throw new Error('Property not found');
        }
        
        console.log("Found property in sample data:", sampleProperty.title);
        return sampleProperty;
      }

      // Convert database property to our frontend property format
      return normalizePropertyData(data);
    },
    enabled: !!propertyId && (!!user?.id || !forOwner) && enabled,
  });
};
