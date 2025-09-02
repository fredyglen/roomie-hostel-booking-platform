import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/EnhancedAuthContext';
import { Property } from '@/types/property';
import { normalizePropertyData, getSampleProperties } from './usePropertyData';
import { ErrorHandler } from '@/utils/ErrorHandler';

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
        ErrorHandler.log(`Fetching property with ID: ${propertyId}`);
        
        // First check if the ID is a valid UUID format (required for Supabase query)
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
            ErrorHandler.handle(error, "usePropertyLoader error fetching property from database");
            throw error;
          }
          
          if (data) {
            ErrorHandler.log(`Found property in database: ${data.title}`);
            // Convert database property to our frontend property format
            const normalizedProperty = normalizePropertyData(data);
            return normalizedProperty;
          }
        }

        // CRITICAL FIX: No fallback to sample data
        // This ensures students only see real owner-provided properties
        ErrorHandler.log(`Property not found in database: ${propertyId}`);
        throw new Error('Property not found');
      } catch (error) {
        ErrorHandler.handle("Error in property loader:", error);
        throw error;
      }
    },
    enabled: !!propertyId && (!!user?.id || !forOwner) && enabled,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1, // Only retry once to avoid infinite retries on 404
  });
};
