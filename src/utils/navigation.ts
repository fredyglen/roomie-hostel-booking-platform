
import { NavigateFunction } from 'react-router-dom';

/**
 * Enhanced navigation utility functions with proper state management
 */

export interface NavigationState {
  from?: string;
  preserveHistory?: boolean;
  replace?: boolean;
}

/**
 * Navigate to a property detail page with proper state
 */
export const navigateToProperty = (
  navigate: NavigateFunction,
  propertyId: string,
  state?: NavigationState
): void => {
  if (!propertyId) {
    console.error("Cannot navigate to property: Invalid ID");
    return;
  }

  navigate(`/student/property/${propertyId}`, { 
    state: { 
      from: state?.from || window.location.pathname,
      ...state 
    } 
  });
};

/**
 * Navigate to the property booking page with state preservation
 */
export const navigateToBooking = (
  navigate: NavigateFunction,
  propertyId: string,
  state?: NavigationState
): void => {
  if (!propertyId) {
    console.error("Cannot navigate to booking: Invalid property ID");
    return;
  }

  navigate(`/student/book/${propertyId}`, { 
    state: { 
      from: state?.from || window.location.pathname,
      ...state 
    } 
  });
};

/**
 * Navigate to a property story view with context preservation
 */
export const navigateToStory = (
  navigate: NavigateFunction,
  propertyId: string,
  state?: NavigationState
): void => {
  if (!propertyId) {
    console.error("Cannot navigate to story: Invalid property ID");
    return;
  }

  navigate(`/student/property/${propertyId}/enhanced-story`, { 
    state: { 
      from: state?.from || window.location.pathname,
      ...state 
    } 
  });
};

/**
 * Navigate to the properties listing page with optional filter parameters
 */
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
  
  navigate(url, { 
    state: state?.replace ? undefined : { 
      from: state?.from || window.location.pathname,
      ...state 
    },
    replace: state?.replace 
  });
};

/**
 * Smart back navigation with fallback support
 */
export const navigateBack = (
  navigate: NavigateFunction,
  fallbackPath: string = '/student/properties',
  locationState?: any
): void => {
  // Check if there's a stored previous location in state
  const previousPath = locationState?.from;
  
  if (previousPath && previousPath !== window.location.pathname) {
    navigate(previousPath, { replace: true });
  } else if (window.history.length > 1) {
    navigate(-1);
  } else {
    navigate(fallbackPath, { replace: true });
  }
};

/**
 * Navigate to the dashboard based on user role
 */
export const navigateToDashboard = (
  navigate: NavigateFunction,
  userRole: string = 'student'
): void => {
  switch (userRole) {
    case 'student':
      navigate('/student/properties');
      break;
    case 'owner':
      navigate('/owner/dashboard');
      break;
    case 'admin':
      navigate('/admin/dashboard');
      break;
    default:
      navigate('/student/properties');
  }
};

/**
 * Navigate to subscription page based on user role
 */
export const navigateToSubscription = (
  navigate: NavigateFunction,
  userRole: string = 'student'
): void => {
  switch (userRole) {
    case 'student':
      navigate('/student/subscription');
      break;
    case 'owner':
      navigate('/owner/subscription');
      break;
    case 'admin':
      navigate('/admin/subscriptions');
      break;
    default:
      navigate('/student/subscription');
  }
};

/**
 * Navigate to profile page based on user role
 */
export const navigateToProfile = (
  navigate: NavigateFunction,
  userRole: string = 'student'
): void => {
  switch (userRole) {
    case 'student':
      navigate('/student/profile');
      break;
    case 'owner':
      navigate('/owner/profile');
      break;
    default:
      navigate('/student/profile');
  }
};

/**
 * Handle modal/sheet close with proper navigation
 */
export const handleModalClose = (
  navigate: NavigateFunction,
  onClose?: () => void,
  fallbackPath?: string
): void => {
  if (onClose) {
    onClose();
  } else {
    navigateBack(navigate, fallbackPath);
  }
};
