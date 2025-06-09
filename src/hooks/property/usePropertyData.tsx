
import { useState, useCallback } from 'react';
import { Property } from '@/types/property';
import { ErrorHandler } from '@/utils/ErrorHandler';
import { 
  fetchProperties, 
  fetchPropertyById, 
  PropertyQueryOptions, 
  PropertyData 
} from '@/services/propertyDataService';

export const usePropertyData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProperties = useCallback(async (options?: PropertyQueryOptions): Promise<PropertyData> => {
    try {
      setLoading(true);
      setError(null);
      return await fetchProperties(options);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch properties';
      setError(errorMessage);
      ErrorHandler.handle(err, 'Error fetching properties:');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPropertyById = useCallback(async (id: string): Promise<Property | null> => {
    try {
      setLoading(true);
      setError(null);
      return await fetchPropertyById(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch property';
      setError(errorMessage);
      ErrorHandler.handle(err, 'Error fetching property:');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getProperties,
    getPropertyById,
    loading,
    error
  };
};
