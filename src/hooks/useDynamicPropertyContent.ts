/**
 * Dynamic Property Content Hook
 * Apple-Grade React Hook for Owner-Managed Property Content
 * 
 * Purpose: Replace hardcoded values with database-driven dynamic content
 * Compliance: BE CONSCIOUS zero tolerance for any types
 * Architecture: Clean React patterns with proper error handling and loading states
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  PropertyWithDynamicContent,
  PropertyContent,
  PropertyContentInput,
  PropertyConsiderationInput
} from '@/types/dynamic-property-content';
import { dynamicPropertyContentService } from '@/services/dynamic-property-content.service';
import { enhancedLogger } from '@/utils/enhanced-logger';
import { Result } from '@/types/result';

// ============================================================================
// HOOK INTERFACES
// ============================================================================

interface UseDynamicPropertyContentState {
  readonly data: PropertyWithDynamicContent | null;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly isContentComplete: boolean;
  readonly hasVerifiedMedia: boolean;
  readonly totalConsiderations: number;
  readonly criticalConsiderations: number;
}

interface UseDynamicPropertyContentActions {
  readonly refetch: () => Promise<void>;
  readonly updateContent: (content: PropertyContentInput) => Promise<Result<PropertyContent, Error>>;
  readonly updateAmenities: (amenityIds: ReadonlyArray<string>) => Promise<Result<void, Error>>;
  readonly addConsideration: (consideration: PropertyConsiderationInput) => Promise<Result<void, Error>>;
  readonly validateCompleteness: () => Promise<Result<{
    isComplete: boolean;
    contentExists: boolean;
    amenitiesCount: number;
    mediaCount: number;
    coverImageExists: boolean;
  }, Error>>;
}

interface UseDynamicPropertyContentReturn extends UseDynamicPropertyContentState, UseDynamicPropertyContentActions {}

// ============================================================================
// MAIN HOOK
// ============================================================================

export function useDynamicPropertyContent(
  propertyId: string | null,
  userId: string | null
): UseDynamicPropertyContentReturn {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [state, setState] = useState<UseDynamicPropertyContentState>({
    data: null,
    isLoading: false,
    error: null,
    isContentComplete: false,
    hasVerifiedMedia: false,
    totalConsiderations: 0,
    criticalConsiderations: 0
  });

  // ============================================================================
  // FETCH PROPERTY CONTENT
  // ============================================================================

  const fetchPropertyContent = useCallback(async (): Promise<void> => {
    if (!propertyId) {
      setState(prev => ({
        ...prev,
        data: null,
        isLoading: false,
        error: null,
        isContentComplete: false,
        hasVerifiedMedia: false,
        totalConsiderations: 0,
        criticalConsiderations: 0
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      enhancedLogger.info('Fetching dynamic property content', { propertyId });

      const result = await dynamicPropertyContentService.getPropertyDynamicContent(propertyId);

      if (result.success) {
        setState(prev => ({
          ...prev,
          data: result.data,
          isLoading: false,
          error: null,
          isContentComplete: result.data.isContentComplete,
          hasVerifiedMedia: result.data.hasVerifiedMedia,
          totalConsiderations: result.data.totalConsiderations,
          criticalConsiderations: result.data.criticalConsiderations
        }));

        enhancedLogger.info('Successfully fetched dynamic property content', { 
          propertyId,
          isComplete: result.data.isContentComplete,
          amenitiesCount: result.data.amenities.length,
          considerationsCount: result.data.considerations.length
        });
      } else {
        const errorMessage = result.error.message;
        setState(prev => ({
          ...prev,
          data: null,
          isLoading: false,
          error: errorMessage,
          isContentComplete: false,
          hasVerifiedMedia: false,
          totalConsiderations: 0,
          criticalConsiderations: 0
        }));

        enhancedLogger.error('Failed to fetch dynamic property content', { 
          propertyId, 
          error: errorMessage 
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setState(prev => ({
        ...prev,
        data: null,
        isLoading: false,
        error: errorMessage,
        isContentComplete: false,
        hasVerifiedMedia: false,
        totalConsiderations: 0,
        criticalConsiderations: 0
      }));

      enhancedLogger.error('Unexpected error fetching dynamic property content', { 
        propertyId, 
        error: errorMessage 
      });
    }
  }, [propertyId]);

  // ============================================================================
  // CONTENT MANAGEMENT ACTIONS
  // ============================================================================

  const updateContent = useCallback(async (
    contentInput: PropertyContentInput
  ): Promise<Result<PropertyContent, Error>> => {
    if (!propertyId || !userId) {
      const error = new Error('Property ID and User ID are required');
      enhancedLogger.error('Cannot update content without propertyId and userId', { propertyId, userId });
      return { success: false, error };
    }

    try {
      enhancedLogger.info('Updating property content', { propertyId, userId });

      const result = await dynamicPropertyContentService.upsertPropertyContent(
        propertyId,
        contentInput,
        userId
      );

      if (result.success) {
        // Refetch to get updated data
        await fetchPropertyContent();
        
        enhancedLogger.info('Successfully updated property content', { propertyId, userId });
      } else {
        enhancedLogger.error('Failed to update property content', { 
          propertyId, 
          userId, 
          error: result.error.message 
        });
      }

      return result;
    } catch (error) {
      const errorResult = error instanceof Error ? error : new Error('Unknown error');
      enhancedLogger.error('Unexpected error updating property content', { 
        propertyId, 
        userId, 
        error: errorResult.message 
      });
      return { success: false, error: errorResult };
    }
  }, [propertyId, userId, fetchPropertyContent]);

  const updateAmenities = useCallback(async (
    amenityIds: ReadonlyArray<string>
  ): Promise<Result<void, Error>> => {
    if (!propertyId || !userId) {
      const error = new Error('Property ID and User ID are required');
      enhancedLogger.error('Cannot update amenities without propertyId and userId', { propertyId, userId });
      return { success: false, error };
    }

    try {
      enhancedLogger.info('Updating property amenities', { 
        propertyId, 
        userId, 
        amenityCount: amenityIds.length 
      });

      const result = await dynamicPropertyContentService.updatePropertyAmenities(
        propertyId,
        amenityIds,
        userId
      );

      if (result.success) {
        // Refetch to get updated data
        await fetchPropertyContent();
        
        enhancedLogger.info('Successfully updated property amenities', { 
          propertyId, 
          userId, 
          amenityCount: result.data.length 
        });
        
        return { success: true, data: undefined };
      } else {
        enhancedLogger.error('Failed to update property amenities', { 
          propertyId, 
          userId, 
          error: result.error.message 
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorResult = error instanceof Error ? error : new Error('Unknown error');
      enhancedLogger.error('Unexpected error updating property amenities', { 
        propertyId, 
        userId, 
        error: errorResult.message 
      });
      return { success: false, error: errorResult };
    }
  }, [propertyId, userId, fetchPropertyContent]);

  const addConsideration = useCallback(async (
    considerationInput: PropertyConsiderationInput
  ): Promise<Result<void, Error>> => {
    if (!propertyId || !userId) {
      const error = new Error('Property ID and User ID are required');
      enhancedLogger.error('Cannot add consideration without propertyId and userId', { propertyId, userId });
      return { success: false, error };
    }

    try {
      enhancedLogger.info('Adding property consideration', { propertyId, userId });

      const result = await dynamicPropertyContentService.addPropertyConsideration(
        propertyId,
        considerationInput,
        userId
      );

      if (result.success) {
        // Refetch to get updated data
        await fetchPropertyContent();
        
        enhancedLogger.info('Successfully added property consideration', { 
          propertyId, 
          userId, 
          considerationId: result.data.id 
        });
        
        return { success: true, data: undefined };
      } else {
        enhancedLogger.error('Failed to add property consideration', { 
          propertyId, 
          userId, 
          error: result.error.message 
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorResult = error instanceof Error ? error : new Error('Unknown error');
      enhancedLogger.error('Unexpected error adding property consideration', { 
        propertyId, 
        userId, 
        error: errorResult.message 
      });
      return { success: false, error: errorResult };
    }
  }, [propertyId, userId, fetchPropertyContent]);

  const validateCompleteness = useCallback(async (): Promise<Result<{
    isComplete: boolean;
    contentExists: boolean;
    amenitiesCount: number;
    mediaCount: number;
    coverImageExists: boolean;
  }, Error>> => {
    if (!propertyId) {
      const error = new Error('Property ID is required');
      enhancedLogger.error('Cannot validate completeness without propertyId', { propertyId });
      return { success: false, error };
    }

    try {
      enhancedLogger.info('Validating property content completeness', { propertyId });

      const result = await dynamicPropertyContentService.validatePropertyContentCompleteness(propertyId);

      if (result.success) {
        enhancedLogger.info('Successfully validated property content completeness', { 
          propertyId, 
          isComplete: result.data.isComplete 
        });
      } else {
        enhancedLogger.error('Failed to validate property content completeness', { 
          propertyId, 
          error: result.error.message 
        });
      }

      return result;
    } catch (error) {
      const errorResult = error instanceof Error ? error : new Error('Unknown error');
      enhancedLogger.error('Unexpected error validating property content completeness', { 
        propertyId, 
        error: errorResult.message 
      });
      return { success: false, error: errorResult };
    }
  }, [propertyId]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    fetchPropertyContent();
  }, [fetchPropertyContent]);

  // ============================================================================
  // RETURN HOOK INTERFACE
  // ============================================================================

  return {
    // State
    data: state.data,
    isLoading: state.isLoading,
    error: state.error,
    isContentComplete: state.isContentComplete,
    hasVerifiedMedia: state.hasVerifiedMedia,
    totalConsiderations: state.totalConsiderations,
    criticalConsiderations: state.criticalConsiderations,
    
    // Actions
    refetch: fetchPropertyContent,
    updateContent,
    updateAmenities,
    addConsideration,
    validateCompleteness
  };
}

// ============================================================================
// AMENITIES HOOK
// ============================================================================

interface UseAvailableAmenitiesReturn {
  readonly amenities: ReadonlyArray<{
    readonly id: string;
    readonly name: string;
    readonly category: string;
    readonly iconName: string;
    readonly isPremium: boolean;
  }> | null;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly refetch: () => Promise<void>;
}

export function useAvailableAmenities(): UseAvailableAmenitiesReturn {
  const [amenities, setAmenities] = useState<ReadonlyArray<{
    readonly id: string;
    readonly name: string;
    readonly category: string;
    readonly iconName: string;
    readonly isPremium: boolean;
  }> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAmenities = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      enhancedLogger.info('Fetching available amenities');

      const result = await dynamicPropertyContentService.getAvailableAmenities();

      if (result.success) {
        setAmenities(result.data);
        enhancedLogger.info('Successfully fetched available amenities', { count: result.data.length });
      } else {
        setError(result.error.message);
        enhancedLogger.error('Failed to fetch available amenities', { error: result.error.message });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      enhancedLogger.error('Unexpected error fetching available amenities', { error: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAmenities();
  }, [fetchAmenities]);

  return {
    amenities,
    isLoading,
    error,
    refetch: fetchAmenities
  };
}
