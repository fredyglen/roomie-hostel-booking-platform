// Property Viewing Tracker Hook
// Tracks anonymous user viewing behavior and enforces freemium limits

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/EnhancedAuthContext';

export interface ViewingLimits {
  maxImages: number;
  maxVideos: number;
  maxStoryViews: number;
  maxPropertyViews: number;
}

export interface ViewingStats {
  imagesViewed: number;
  videosViewed: number;
  storyViewsUsed: number;
  propertiesViewed: number;
  lastResetDate: string;
}

export interface ViewingRestriction {
  isRestricted: boolean;
  restrictionType: 'images' | 'videos' | 'stories' | 'properties' | null;
  remainingViews: number;
  totalLimit: number;
  message: string;
}

const STORAGE_KEY = 'roomi_viewing_stats';
const DEFAULT_LIMITS: ViewingLimits = {
  maxImages: 2,
  maxVideos: 1,
  maxStoryViews: 2,
  maxPropertyViews: 5
};

export const usePropertyViewingTracker = () => {
  const { user } = useAuth();
  const [viewingStats, setViewingStats] = useState<ViewingStats>(() => {
    // Load from localStorage for anonymous users
    if (!user) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Check if data is from today, reset if not
          const today = new Date().toDateString();
          if (parsed.lastResetDate !== today) {
            return {
              imagesViewed: 0,
              videosViewed: 0,
              storyViewsUsed: 0,
              propertiesViewed: 0,
              lastResetDate: today
            };
          }
          return parsed;
        } catch {
          // Invalid data, reset
        }
      }
    }
    
    return {
      imagesViewed: 0,
      videosViewed: 0,
      storyViewsUsed: 0,
      propertiesViewed: 0,
      lastResetDate: new Date().toDateString()
    };
  });

  // Save to localStorage whenever stats change (for anonymous users only)
  useEffect(() => {
    if (!user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(viewingStats));
    }
  }, [viewingStats, user]);

  // Reset stats daily
  useEffect(() => {
    const today = new Date().toDateString();
    if (viewingStats.lastResetDate !== today) {
      setViewingStats({
        imagesViewed: 0,
        videosViewed: 0,
        storyViewsUsed: 0,
        propertiesViewed: 0,
        lastResetDate: today
      });
    }
  }, [viewingStats.lastResetDate]);

  // Check if user has reached viewing limits
  const checkViewingRestriction = useCallback((type: 'images' | 'videos' | 'stories' | 'properties'): ViewingRestriction => {
    // Registered users have no restrictions
    if (user) {
      return {
        isRestricted: false,
        restrictionType: null,
        remainingViews: Infinity,
        totalLimit: Infinity,
        message: ''
      };
    }

    let currentCount: number;
    let limit: number;
    let message: string;

    switch (type) {
      case 'images':
        currentCount = viewingStats.imagesViewed;
        limit = DEFAULT_LIMITS.maxImages;
        message = `You've viewed ${currentCount}/${limit} images today. Register to view unlimited property images.`;
        break;
      case 'videos':
        currentCount = viewingStats.videosViewed;
        limit = DEFAULT_LIMITS.maxVideos;
        message = `You've viewed ${currentCount}/${limit} videos today. Register to view unlimited property videos.`;
        break;
      case 'stories':
        currentCount = viewingStats.storyViewsUsed;
        limit = DEFAULT_LIMITS.maxStoryViews;
        message = `You've viewed ${currentCount}/${limit} property stories today. Register for unlimited access.`;
        break;
      case 'properties':
        currentCount = viewingStats.propertiesViewed;
        limit = DEFAULT_LIMITS.maxPropertyViews;
        message = `You've viewed ${currentCount}/${limit} properties today. Register to explore unlimited properties.`;
        break;
      default:
        return {
          isRestricted: false,
          restrictionType: null,
          remainingViews: 0,
          totalLimit: 0,
          message: ''
        };
    }

    const isRestricted = currentCount >= limit;
    const remainingViews = Math.max(0, limit - currentCount);

    return {
      isRestricted,
      restrictionType: isRestricted ? type : null,
      remainingViews,
      totalLimit: limit,
      message
    };
  }, [user, viewingStats]);

  // Track image viewing
  const trackImageView = useCallback(() => {
    if (!user) {
      setViewingStats(prev => ({
        ...prev,
        imagesViewed: prev.imagesViewed + 1
      }));
    }
  }, [user]);

  // Track video viewing
  const trackVideoView = useCallback(() => {
    if (!user) {
      setViewingStats(prev => ({
        ...prev,
        videosViewed: prev.videosViewed + 1
      }));
    }
  }, [user]);

  // Track story viewing
  const trackStoryView = useCallback(() => {
    if (!user) {
      setViewingStats(prev => ({
        ...prev,
        storyViewsUsed: prev.storyViewsUsed + 1
      }));
    }
  }, [user]);

  // Track property viewing
  const trackPropertyView = useCallback(() => {
    if (!user) {
      setViewingStats(prev => ({
        ...prev,
        propertiesViewed: prev.propertiesViewed + 1
      }));
    }
  }, [user]);

  // Check if specific action is allowed
  const canViewImage = useCallback(() => {
    const restriction = checkViewingRestriction('images');
    return !restriction.isRestricted;
  }, [checkViewingRestriction]);

  const canViewVideo = useCallback(() => {
    const restriction = checkViewingRestriction('videos');
    return !restriction.isRestricted;
  }, [checkViewingRestriction]);

  const canViewStory = useCallback(() => {
    const restriction = checkViewingRestriction('stories');
    return !restriction.isRestricted;
  }, [checkViewingRestriction]);

  const canViewProperty = useCallback(() => {
    const restriction = checkViewingRestriction('properties');
    return !restriction.isRestricted;
  }, [checkViewingRestriction]);

  // Get remaining views for display
  const getRemainingViews = useCallback((type: 'images' | 'videos' | 'stories' | 'properties') => {
    const restriction = checkViewingRestriction(type);
    return restriction.remainingViews;
  }, [checkViewingRestriction]);

  // Get viewing progress for display
  const getViewingProgress = useCallback(() => {
    if (user) {
      return {
        images: { current: 0, total: Infinity, percentage: 0 },
        videos: { current: 0, total: Infinity, percentage: 0 },
        stories: { current: 0, total: Infinity, percentage: 0 },
        properties: { current: 0, total: Infinity, percentage: 0 }
      };
    }

    return {
      images: {
        current: viewingStats.imagesViewed,
        total: DEFAULT_LIMITS.maxImages,
        percentage: (viewingStats.imagesViewed / DEFAULT_LIMITS.maxImages) * 100
      },
      videos: {
        current: viewingStats.videosViewed,
        total: DEFAULT_LIMITS.maxVideos,
        percentage: (viewingStats.videosViewed / DEFAULT_LIMITS.maxVideos) * 100
      },
      stories: {
        current: viewingStats.storyViewsUsed,
        total: DEFAULT_LIMITS.maxStoryViews,
        percentage: (viewingStats.storyViewsUsed / DEFAULT_LIMITS.maxStoryViews) * 100
      },
      properties: {
        current: viewingStats.propertiesViewed,
        total: DEFAULT_LIMITS.maxPropertyViews,
        percentage: (viewingStats.propertiesViewed / DEFAULT_LIMITS.maxPropertyViews) * 100
      }
    };
  }, [user, viewingStats]);

  // Reset viewing stats (for testing or admin purposes)
  const resetViewingStats = useCallback(() => {
    const resetStats = {
      imagesViewed: 0,
      videosViewed: 0,
      storyViewsUsed: 0,
      propertiesViewed: 0,
      lastResetDate: new Date().toDateString()
    };
    setViewingStats(resetStats);
    if (!user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resetStats));
    }
  }, [user]);

  return {
    // Current stats
    viewingStats,
    
    // Tracking functions
    trackImageView,
    trackVideoView,
    trackStoryView,
    trackPropertyView,
    
    // Permission checks
    canViewImage,
    canViewVideo,
    canViewStory,
    canViewProperty,
    
    // Restriction checks
    checkViewingRestriction,
    
    // Utility functions
    getRemainingViews,
    getViewingProgress,
    resetViewingStats,
    
    // Status
    isAnonymous: !user,
    hasRestrictions: !user
  };
};

export default usePropertyViewingTracker;
