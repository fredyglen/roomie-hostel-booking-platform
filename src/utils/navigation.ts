
import { NavigateFunction } from 'react-router-dom';

interface NavigationState {
  from?: string;
  [key: string]: any;
}

export const navigationUtils = {
  goToProperty: (navigate: NavigateFunction, propertyId: string, from?: string) => {
    navigate(`/student/property/${propertyId}`, { 
      state: from ? { from } : undefined 
    });
  },

  goToStory: (navigate: NavigateFunction, propertyId: string, from?: string) => {
    navigate(`/student/property/${propertyId}/story`, { 
      state: from ? { from } : undefined 
    });
  },

  goToBooking: (navigate: NavigateFunction, propertyId: string, from?: string) => {
    navigate(`/student/property/${propertyId}/book`, { 
      state: from ? { from } : undefined 
    });
  },

  goBack: (navigate: NavigateFunction, fallbackPath: string = '/') => {
    navigate(-1);
  },

  goHome: (navigate: NavigateFunction) => {
    navigate('/');
  },

  goToExplore: (navigate: NavigateFunction) => {
    navigate('/student/explore');
  },

  goToDashboard: (navigate: NavigateFunction, userRole: string) => {
    const dashboardPath = userRole === 'owner' ? '/owner/dashboard' : '/student/dashboard';
    navigate(dashboardPath);
  },

  // Utility to get previous path from state
  getPreviousPath: (state: unknown, fallback: string = '/'): string => {
    if (state && typeof state === 'object' && state !== null && 'from' in state) {
      const navigationState = state as NavigationState;
      return navigationState.from || fallback;
    }
    return fallback;
  },

  // Utility to check if navigation has previous state
  hasPreviousState: (state: unknown): boolean => {
    if (state && typeof state === 'object' && state !== null && 'from' in state) {
      const navigationState = state as NavigationState;
      return Boolean(navigationState.from);
    }
    return false;
  }
};

// Export individual navigation functions for backward compatibility
export const navigateToProperty = (navigate: NavigateFunction, propertyId: string, options?: { from?: string; preserveHistory?: boolean }) => {
  if (!propertyId) {
    console.error('navigateToProperty: Invalid ID provided');
    return;
  }
  navigate(`/student/property/${propertyId}`, { 
    state: options?.from ? { from: options.from } : undefined 
  });
};

export const navigateToStory = (navigate: NavigateFunction, propertyId: string, options?: { from?: string; preserveHistory?: boolean }) => {
  if (!propertyId) {
    console.error('navigateToStory: Invalid ID provided');
    return;
  }
  navigate(`/student/property/${propertyId}/story`, { 
    state: options?.from ? { from: options.from } : undefined 
  });
};

export const navigateToBooking = (navigate: NavigateFunction, propertyId: string, options?: { from?: string; preserveHistory?: boolean }) => {
  if (!propertyId) {
    console.error('navigateToBooking: Invalid property ID provided');
    return;
  }
  // ✅ FIXED: Use correct booking route that exists in App.tsx
  navigate(`/student/book/${propertyId}`, {
    state: options?.from ? { from: options.from } : undefined
  });
};

export const navigateBack = (navigate: NavigateFunction, fallbackPath: string = '/', state?: unknown) => {
  if (state && typeof state === 'object' && state !== null && 'from' in state) {
    const navigationState = state as NavigationState;
    if (navigationState.from) {
      navigate(navigationState.from);
      return;
    }
  }
  navigate(fallbackPath);
};

export const navigateToProperties = (navigate: NavigateFunction, filters?: Record<string, string>) => {
  const baseUrl = '/student/properties';
  if (filters) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim()) {
        queryParams.append(key, value);
      }
    });
    const queryString = queryParams.toString();
    navigate(`${baseUrl}${queryString ? `?${queryString}` : ''}`);
  } else {
    navigate(baseUrl);
  }
};
