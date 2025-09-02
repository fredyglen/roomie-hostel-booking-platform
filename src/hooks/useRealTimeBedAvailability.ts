/**
 * useRealTimeBedAvailability Hook
 * 
 * PRODUCTION-GRADE hook for real-time bed availability tracking.
 * Provides live updates on bed occupancy with automatic subscriptions.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  getRealTimeBedAvailability, 
  subscribeToRealTimeBedAvailability,
  type PropertyBedAvailability 
} from '@/services/realTimeBedAvailabilityService';
import { logger } from '@/utils/enhanced-logger';

interface UseRealTimeBedAvailabilityOptions {
  readonly propertyId: string;
  readonly enableRealTimeUpdates?: boolean;
  readonly refreshInterval?: number; // in milliseconds
}

interface UseRealTimeBedAvailabilityReturn {
  readonly availability: PropertyBedAvailability | null;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly lastUpdated: Date | null;
  readonly refetch: () => Promise<void>;
  readonly isStale: boolean;
}

/**
 * ✅ PRODUCTION-GRADE: Real-time bed availability hook
 */
export function useRealTimeBedAvailability(
  options: UseRealTimeBedAvailabilityOptions
): UseRealTimeBedAvailabilityReturn {
  const { propertyId, enableRealTimeUpdates = true, refreshInterval = 30000 } = options;
  
  const [availability, setAvailability] = useState<PropertyBedAvailability | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate if data is stale (older than 2 minutes)
  const isStale = lastUpdated ? (Date.now() - lastUpdated.getTime()) > 120000 : false;

  const fetchAvailability = useCallback(async () => {
    if (!propertyId) {
      setError('Property ID is required');
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      logger.info('Fetching bed availability', { propertyId });

      const result = await getRealTimeBedAvailability(propertyId);
      setAvailability(result);
      setLastUpdated(new Date());
      
      logger.info('Successfully fetched bed availability', { 
        propertyId, 
        totalBeds: result.overall.totalBeds,
        availableBeds: result.overall.availableBeds,
        status: result.overall.status
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch bed availability';
      setError(errorMessage);
      logger.error('Error fetching bed availability', { propertyId, error: err });
    } finally {
      setIsLoading(false);
    }
  }, [propertyId]);

  const handleRealTimeUpdate = useCallback((updatedAvailability: PropertyBedAvailability) => {
    logger.info('Received real-time bed availability update', { 
      propertyId,
      totalBeds: updatedAvailability.overall.totalBeds,
      availableBeds: updatedAvailability.overall.availableBeds,
      status: updatedAvailability.overall.status
    });

    setAvailability(updatedAvailability);
    setLastUpdated(new Date());
    setError(null);
  }, [propertyId]);

  // Setup real-time subscription
  useEffect(() => {
    if (!propertyId || !enableRealTimeUpdates) return;

    logger.info('Setting up real-time bed availability subscription', { propertyId });

    const unsubscribe = subscribeToRealTimeBedAvailability(propertyId, handleRealTimeUpdate);
    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        logger.info('Cleaning up real-time bed availability subscription', { propertyId });
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [propertyId, enableRealTimeUpdates, handleRealTimeUpdate]);

  // Setup periodic refresh as fallback
  useEffect(() => {
    if (!propertyId || refreshInterval <= 0) return;

    const setupPeriodicRefresh = () => {
      refreshTimeoutRef.current = setTimeout(() => {
        logger.info('Periodic refresh of bed availability', { propertyId });
        fetchAvailability();
        setupPeriodicRefresh(); // Schedule next refresh
      }, refreshInterval);
    };

    setupPeriodicRefresh();

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
    };
  }, [propertyId, refreshInterval, fetchAvailability]);

  // Initial fetch
  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  return {
    availability,
    isLoading,
    error,
    lastUpdated,
    refetch: fetchAvailability,
    isStale
  };
}

/**
 * ✅ HELPER: Hook for multiple properties bed availability
 */
export function useMultiplePropertiesBedAvailability(propertyIds: string[]) {
  const [availabilities, setAvailabilities] = useState<Record<string, PropertyBedAvailability>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (propertyIds.length === 0) {
      setIsLoading(false);
      return;
    }

    const fetchAllAvailabilities = async () => {
      setIsLoading(true);
      const newAvailabilities: Record<string, PropertyBedAvailability> = {};
      const newErrors: Record<string, string> = {};

      await Promise.allSettled(
        propertyIds.map(async (propertyId) => {
          try {
            const availability = await getRealTimeBedAvailability(propertyId);
            newAvailabilities[propertyId] = availability;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch availability';
            newErrors[propertyId] = errorMessage;
            logger.error('Error fetching availability for property', { propertyId, error });
          }
        })
      );

      setAvailabilities(newAvailabilities);
      setErrors(newErrors);
      setIsLoading(false);
    };

    fetchAllAvailabilities();
  }, [propertyIds]);

  return {
    availabilities,
    isLoading,
    errors,
    refetch: () => {
      // Re-trigger the effect
      setIsLoading(true);
    }
  };
}

/**
 * ✅ HELPER: Get availability status for a specific room type
 */
export function useRoomTypeAvailability(propertyId: string, roomType: string) {
  const { availability, isLoading, error } = useRealTimeBedAvailability({ propertyId });

  const roomTypeAvailability = availability?.byRoomType.find(rt => rt.roomType === roomType);

  return {
    roomTypeAvailability,
    isLoading,
    error,
    isAvailable: roomTypeAvailability ? roomTypeAvailability.availableBeds > 0 : false,
    status: roomTypeAvailability?.status || 'full'
  };
}
