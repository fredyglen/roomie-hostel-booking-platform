
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
    if (state && typeof state === 'object' && state !== null) {
      const navigationState = state as NavigationState;
      return navigationState.from || fallback;
    }
    return fallback;
  },

  // Utility to check if navigation has previous state
  hasPreviousState: (state: unknown): boolean => {
    if (state && typeof state === 'object' && state !== null) {
      const navigationState = state as NavigationState;
      return Boolean(navigationState.from);
    }
    return false;
  }
};
