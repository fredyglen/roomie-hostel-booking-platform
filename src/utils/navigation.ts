
import { NavigateFunction } from 'react-router-dom';

interface NavigationOptions {
  from?: string;
  preserveHistory?: boolean;
  replace?: boolean;
}

export const navigateToProperty = (
  navigate: NavigateFunction, 
  propertyId: string, 
  options?: NavigationOptions
) => {
  const path = `/student/property/${propertyId}`;
  
  if (options?.replace) {
    navigate(path, { replace: true, state: { from: options.from } });
  } else {
    navigate(path, { state: { from: options?.from } });
  }
};

export const navigateToBooking = (
  navigate: NavigateFunction, 
  propertyId: string, 
  options?: NavigationOptions
) => {
  const path = `/student/book/${propertyId}`;
  
  if (options?.replace) {
    navigate(path, { replace: true, state: { from: options.from } });
  } else {
    navigate(path, { state: { from: options?.from } });
  }
};

export const navigateToStory = (
  navigate: NavigateFunction, 
  propertyId: string, 
  options?: NavigationOptions
) => {
  const path = `/student/story/${propertyId}`;
  
  if (options?.replace) {
    navigate(path, { replace: true, state: { from: options.from } });
  } else {
    navigate(path, { state: { from: options?.from } });
  }
};

export const navigateBack = (
  navigate: NavigateFunction, 
  fallbackPath: string = '/', 
  state?: any
) => {
  if (state?.from) {
    navigate(state.from);
  } else if (window.history.length > 1) {
    navigate(-1);
  } else {
    navigate(fallbackPath);
  }
};
