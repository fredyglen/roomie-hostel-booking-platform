
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/EnhancedAuthContext';
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

      try {
        console.log("Fetching property with ID:", propertyId);
        
        // First check sample properties since they're readily available
        const sampleProperties = getSampleProperties();
        
        // Handle different ID formats consistently (string vs number)
        const sampleProperty = sampleProperties.find(p => 
          p.id === propertyId || 
          p.id === String(propertyId) || 
          String(p.id) === propertyId
        );
        
        if (sampleProperty) {
          console.log("Found property in sample data:", sampleProperty.title);
          return sampleProperty;
        }
        
        // If not found in sample data, check database (for UUID format only)
        const isUuid = propertyId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
        
        if (isUuid) {
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
            console.error("Error fetching property from database:", error);
            throw error;
          }
          
          if (data) {
            console.log("Found property in database:", data.title);
            // Convert database property to our frontend property format
            const normalizedProperty = normalizePropertyData(data);
            return normalizedProperty;
          }
        }

        console.error("Property not found anywhere");
        throw new Error('Property not found');
      } catch (error) {
        console.error("Error in property loader:", error);
        throw error;
      }
    },
    enabled: !!propertyId && (!!user?.id || !forOwner) && enabled,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1, // Only retry once to avoid infinite retries on 404
  });
};
