/**
 * Property Views Hooks
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Tracks property views for analytics and engagement metrics
 * Supports both authenticated and anonymous users with device detection
 * 
 * Technical Implementation: Automatic view tracking on component mount,
 * duration tracking on unmount, device detection, and analytics queries
 * 
 * @author ROOMi Platform Team
 * @version 1.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import { useEffect, useRef } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// ============================================================================
// TYPES
// ============================================================================

export interface PropertyView {
  readonly id: string;
  readonly user_id: string;
  readonly property_id: string;
  readonly viewed_at: string;
  readonly session_id?: string | null;
  readonly user_agent?: string | null;
  readonly ip_address?: string | null;
  readonly view_duration?: number | null;
  readonly source_page?: string | null;
  readonly device_type?: 'mobile' | 'tablet' | 'desktop' | null;
  readonly created_at?: string | null;
  readonly viewed_hour_epoch?: number | null;
}

export interface PropertyViewInsert {
  user_id: string;
  property_id: string;
  session_id?: string;
  user_agent?: string;
  view_duration?: number;
  source_page?: string;
  device_type?: 'mobile' | 'tablet' | 'desktop';
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get or create anonymous session ID
 */
const getAnonymousSessionId = (): string => {
  const storageKey = 'roomi_anonymous_session';
  let sessionId = localStorage.getItem(storageKey);
  
  if (!sessionId) {
    sessionId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(storageKey, sessionId);
  }
  
  return sessionId;
};

/**
 * Detect device type from window width
 */
const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

/**
 * Get user agent string
 */
const getUserAgent = (): string => {
  if (typeof navigator === 'undefined') return '';
  return navigator.userAgent;
};

/**
 * Get source page (referrer)
 */
const getSourcePage = (): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  return document.referrer || undefined;
};

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Track a property view
 * Fire-and-forget pattern - no loading states or error handling shown to user
 */
const useTrackViewMutation = () => {
  return useMutation({
    mutationFn: async (viewData: PropertyViewInsert) => {
      const { data, error } = await supabase
        .from('property_views')
        .insert({
          user_id: viewData.user_id,
          property_id: viewData.property_id,
          session_id: viewData.session_id,
          user_agent: viewData.user_agent,
          view_duration: viewData.view_duration,
          source_page: viewData.source_page,
          device_type: viewData.device_type,
        })
        .select()
        .single();

      if (error) throw error;
      return data as PropertyView;
    },
    onError: (error) => {
      // Silent failure - don't disrupt user experience
      console.error('Failed to track property view:', error);
    },
  });
};

/**
 * Update view duration when user leaves
 */
const useUpdateViewDuration = () => {
  return useMutation({
    mutationFn: async ({ viewId, duration }: { viewId: string; duration: number }) => {
      const { error } = await supabase
        .from('property_views')
        .update({ view_duration: duration })
        .eq('id', viewId);

      if (error) throw error;
    },
    onError: (error) => {
      // Silent failure
      console.error('Failed to update view duration:', error);
    },
  });
};

// ============================================================================
// MAIN HOOK
// ============================================================================

/**
 * Track property view automatically when component mounts
 * Tracks duration when component unmounts
 *
 * @param propertyId - Property being viewed
 * @param userId - Authenticated user ID (optional, will use anonymous if not provided)
 */
export const useTrackPropertyView = (propertyId: string, userId?: string) => {
  const { mutate: trackView } = useTrackViewMutation();
  const { mutate: updateDuration } = useUpdateViewDuration();
  const viewIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // Track view on mount
    const effectiveUserId = userId || getAnonymousSessionId();

    trackView(
      {
        user_id: effectiveUserId,
        property_id: propertyId,
        session_id: getAnonymousSessionId(),
        user_agent: getUserAgent(),
        source_page: getSourcePage(),
        device_type: getDeviceType(),
      },
      {
        onSuccess: (data) => {
          viewIdRef.current = data.id;
          startTimeRef.current = Date.now();
        },
      }
    );

    // Update duration on unmount
    return () => {
      if (viewIdRef.current) {
        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000); // seconds
        updateDuration({ viewId: viewIdRef.current, duration });
      }
    };
  }, [propertyId, userId, trackView, updateDuration]);
};

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Get total view count for a property
 */
export const usePropertyViewCount = (propertyId: string) => {
  return useQuery({
    queryKey: ['property-views', 'count', propertyId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('property_views')
        .select('*', { count: 'exact', head: true })
        .eq('property_id', propertyId);

      if (error) throw error;
      return count || 0;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Get unique viewer count for a property
 */
export const usePropertyUniqueViewers = (propertyId: string) => {
  return useQuery({
    queryKey: ['property-views', 'unique', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_views')
        .select('user_id')
        .eq('property_id', propertyId);

      if (error) throw error;

      // Count unique user_ids
      const uniqueUsers = new Set(data.map(v => v.user_id));
      return uniqueUsers.size;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Get average view duration for a property
 */
export const usePropertyAvgDuration = (propertyId: string) => {
  return useQuery({
    queryKey: ['property-views', 'avg-duration', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_views')
        .select('view_duration')
        .eq('property_id', propertyId)
        .not('view_duration', 'is', null);

      if (error) throw error;

      if (!data || data.length === 0) return 0;

      const total = data.reduce((sum, v) => sum + (v.view_duration || 0), 0);
      return Math.floor(total / data.length);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

