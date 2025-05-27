
import { NavigateFunction } from 'react-router-dom';

/**
 * Enhanced navigation utility functions with proper state management and browser history respect
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
    },
    replace: state?.replace || false
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

  navigate(`/student/property/${propertyId}/book`, { 
    state: { 
      from: state?.from || window.location.pathname,
      ...state 
    },
    replace: state?.replace || false
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
    },
    replace: state?.replace || false
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
    replace: state?.replace || false
  });
};

/**
 * Enhanced back navigation that respects browser history
 */
export const navigateBack = (
  navigate: NavigateFunction,
  fallbackPath: string = '/student/properties',
  locationState?: any
): void => {
  console.log('Navigation back called with state:', locationState);
  
  // If we have a referrer in the state, use it
  const previousPath = locationState?.from;
  
  if (previousPath && previousPath !== window.location.pathname) {
    console.log('Navigating to previous path:', previousPath);
    navigate(previousPath);
    return;
  }

  // Check if we can go back in browser history
  if (window.history.length > 1) {
    console.log('Using browser back navigation');
    navigate(-1);
    return;
  }

  // Fallback to default path
  console.log('Using fallback path:', fallbackPath);
  navigate(fallbackPath);
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
      navigate('/student/dashboard');
      break;
    case 'owner':
      navigate('/owner/dashboard');
      break;
    case 'admin':
      navigate('/admin/dashboard');
      break;
    default:
      navigate('/student/dashboard');
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

/**
 * Enhanced navigation helper that preserves browser navigation behavior
 */
export const enhancedNavigate = (
  navigate: NavigateFunction,
  to: string,
  options?: {
    replace?: boolean;
    state?: any;
    preserveHistory?: boolean;
  }
): void => {
  const navigationOptions: any = {
    replace: options?.replace || false
  };

  if (options?.state || options?.preserveHistory) {
    navigationOptions.state = {
      from: window.location.pathname,
      ...options?.state
    };
  }

  navigate(to, navigationOptions);
};
