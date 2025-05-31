
import { NavigateFunction } from 'react-router-dom';
import { logger } from './logger';

export interface NavigationState {
  from?: string;
  preserveHistory?: boolean;
  replace?: boolean;
}

export const navigateToProperty = (
  navigate: NavigateFunction,
  propertyId: string,
  state?: NavigationState
): void => {
  if (!propertyId) {
    logger.error("Cannot navigate to property: Invalid ID");
    return;
  }

  const path = `/student/property/${propertyId}`;
  logger.debug("Navigating to property", { propertyId, path });
  
  navigate(path, { 
    state: { 
      from: state?.from || window.location.pathname,
      ...state 
    },
    replace: state?.replace || false
  });
};

export const navigateToStory = (
  navigate: NavigateFunction,
  propertyId: string,
  state?: NavigationState
): void => {
  if (!propertyId) {
    logger.error("Cannot navigate to story: Invalid property ID");
    return;
  }

  const path = `/student/property/${propertyId}/enhanced-story`;
  logger.debug("Navigating to story", { propertyId, path });
  
  navigate(path, { 
    state: { 
      from: state?.from || window.location.pathname,
      ...state 
    },
    replace: state?.replace || false
  });
};

export const navigateToProperties = (
  navigate: NavigateFunction,
  filters?: Record<string, string>,
  state?: NavigationState
): void => {
  let url = '/student/properties';
  
  if (filters && Object.keys(filters).length > 0) {
    const searchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });
    
    const searchString = searchParams.toString();
    if (searchString) url += `?${searchString}`;
  }
  
  logger.debug("Navigating to properties", { url, filters });
  
  navigate(url, { 
    state: state?.replace ? undefined : { 
      from: state?.from || window.location.pathname,
      ...state 
    },
    replace: state?.replace || false
  });
};

export const navigateBack = (
  navigate: NavigateFunction,
  fallbackPath: string = '/student/properties',
  locationState?: any
): void => {
  logger.debug('Navigation back called', { locationState, fallbackPath });
  
  const previousPath = locationState?.from;
  
  if (previousPath && previousPath !== window.location.pathname) {
    logger.debug('Using previous path', { previousPath });
    navigate(previousPath);
    return;
  }

  if (window.history.length > 1) {
    logger.debug('Using browser back navigation');
    navigate(-1);
    return;
  }

  logger.debug('Using fallback path', { fallbackPath });
  navigate(fallbackPath);
};

export const navigateToDashboard = (
  navigate: NavigateFunction,
  userRole: string = 'student'
): void => {
  const dashboardPaths = {
    student: '/student/dashboard',
    owner: '/owner/dashboard',
    admin: '/admin/dashboard'
  };
  
  const path = dashboardPaths[userRole as keyof typeof dashboardPaths] || dashboardPaths.student;
  logger.debug('Navigating to dashboard', { userRole, path });
  navigate(path);
};
