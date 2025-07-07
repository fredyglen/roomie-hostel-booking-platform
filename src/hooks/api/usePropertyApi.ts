import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '@/services/propertyService';
import { Property, PropertyId, PropertyInsert, PropertyUpdate } from '@/types/property';

export function usePropertyApi() {
  const queryClient = useQueryClient();

  const propertiesQuery = useQuery({
    queryKey: ['properties'],
    queryFn: propertyService.getProperties,
  });

  const createProperty = useMutation({
    mutationFn: propertyService.createProperty,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['properties'] }),
  });

  const updateProperty = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Property> }) => propertyService.updateProperty(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['properties'] }),
  });

  const deleteProperty = useMutation({
    mutationFn: propertyService.deleteProperty,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['properties'] }),
  });

  return {
    properties: propertiesQuery.data,
    isLoading: propertiesQuery.isLoading,
    error: propertiesQuery.error,
    createProperty: createProperty.mutateAsync,
    updateProperty: updateProperty.mutateAsync,
    deleteProperty: deleteProperty.mutateAsync,
  };
} 