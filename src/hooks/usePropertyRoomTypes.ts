/**
 * usePropertyRoomTypes Hook - Dynamic Room Types Loading
 * 
 * Replaces hardcoded room types with dynamic loading from owner configuration.
 * Provides real-time room availability and pricing data.
 */

import { useState, useEffect } from 'react';
import { fetchPropertyRoomTypes, getFallbackRoomTypes, type PropertyRoomTypes, type RoomTypeOption } from '@/services/roomTypesService';
import { logger } from '@/utils/enhanced-logger';

interface UsePropertyRoomTypesOptions {
  readonly propertyId: string;
  readonly propertyCategory?: string;
  readonly enableFallback?: boolean;
}

interface UsePropertyRoomTypesReturn {
  readonly roomTypes: readonly RoomTypeOption[];
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly hasRoomTypes: boolean;
  readonly refetch: () => Promise<void>;
}

/**
 * ✅ PRODUCTION-GRADE: Hook for dynamic room types loading
 */
export function usePropertyRoomTypes(options: UsePropertyRoomTypesOptions): UsePropertyRoomTypesReturn {
  const { propertyId, propertyCategory, enableFallback = true } = options;
  
  const [roomTypes, setRoomTypes] = useState<readonly RoomTypeOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasRoomTypes, setHasRoomTypes] = useState(false);

  const fetchRoomTypes = async () => {
    if (!propertyId) {
      setError('Property ID is required');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      logger.info('Fetching room types for property', { propertyId });

      const result = await fetchPropertyRoomTypes(propertyId);
      
      if (result.hasRoomTypes) {
        setRoomTypes(result.roomTypes);
        setHasRoomTypes(true);
        logger.info('Successfully loaded room types from owner configuration', { 
          propertyId, 
          roomTypesCount: result.roomTypes.length 
        });
      } else if (enableFallback && propertyCategory) {
        // Use fallback room types based on property category
        const fallbackTypes = getFallbackRoomTypes(propertyCategory);
        setRoomTypes(fallbackTypes);
        setHasRoomTypes(fallbackTypes.length > 0);
        logger.warn('Using fallback room types for property', { 
          propertyId, 
          propertyCategory, 
          fallbackTypesCount: fallbackTypes.length 
        });
      } else {
        setRoomTypes([]);
        setHasRoomTypes(false);
        logger.warn('No room types available for property', { propertyId });
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch room types';
      setError(errorMessage);
      setRoomTypes([]);
      setHasRoomTypes(false);
      logger.error('Error fetching room types', { propertyId, error: err });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, [propertyId, propertyCategory]);

  return {
    roomTypes,
    isLoading,
    error,
    hasRoomTypes,
    refetch: fetchRoomTypes
  };
}

/**
 * ✅ HELPER: Hook for room type selection state
 */
export function useRoomTypeSelection(roomTypes: readonly RoomTypeOption[]) {
  const [selectedRoomType, setSelectedRoomType] = useState<string>('');
  const [selectedRoomTypeData, setSelectedRoomTypeData] = useState<RoomTypeOption | null>(null);

  useEffect(() => {
    if (roomTypes.length > 0 && !selectedRoomType) {
      // Auto-select first available room type
      const firstAvailable = roomTypes.find(rt => rt.bedsAvailable > 0) || roomTypes[0];
      setSelectedRoomType(firstAvailable.value);
    }
  }, [roomTypes]);

  useEffect(() => {
    const roomTypeData = roomTypes.find(rt => rt.value === selectedRoomType) || null;
    setSelectedRoomTypeData(roomTypeData);
  }, [selectedRoomType, roomTypes]);

  const handleRoomTypeChange = (roomTypeValue: string) => {
    setSelectedRoomType(roomTypeValue);
  };

  return {
    selectedRoomType,
    selectedRoomTypeData,
    handleRoomTypeChange,
    setSelectedRoomType
  };
}

/**
 * ✅ HELPER: Get room type availability status
 */
export function getRoomTypeAvailabilityStatus(roomType: RoomTypeOption): 'free' | 'moderate' | 'filling_up' | 'full' {
  if (roomType.bedsAvailable === 0) return 'full';
  
  const occupancyRate = (roomType.totalBeds - roomType.bedsAvailable) / roomType.totalBeds;
  
  if (occupancyRate < 0.3) return 'free';
  if (occupancyRate < 0.7) return 'moderate';
  return 'filling_up';
}

/**
 * ✅ HELPER: Get availability status color and text
 */
export function getAvailabilityStatusDisplay(status: ReturnType<typeof getRoomTypeAvailabilityStatus>) {
  switch (status) {
    case 'free':
      return { color: 'text-green-600', bgColor: 'bg-green-100', text: 'Available' };
    case 'moderate':
      return { color: 'text-yellow-600', bgColor: 'bg-yellow-100', text: 'Moderate' };
    case 'filling_up':
      return { color: 'text-orange-600', bgColor: 'bg-orange-100', text: 'Filling Up' };
    case 'full':
      return { color: 'text-red-600', bgColor: 'bg-red-100', text: 'Full' };
  }
}
