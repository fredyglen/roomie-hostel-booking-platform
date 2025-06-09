import { NavigateFunction } from 'react-router-dom';

interface NavigationOptions {
  from?: string;
  preserveHistory?: boolean;
  replace?: boolean;
  state?: unknown;
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
  state?: unknown
) => {
  if (state?.from) {
    navigate(state.from);
  } else if (window.history.length > 1) {
    navigate(-1);
  } else {
    navigate(fallbackPath);
  }
};

export const navigateToProperties = (navigate: (path: string) => void, filters?: Record<string, string>) => {
  if (!filters || Object.keys(filters).length === 0) {
    navigate('/student/properties');
    return;
  }
  
  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value.trim() !== '') {
      queryParams.append(key, value);
    }
  });
  
  const queryString = queryParams.toString();
  navigate(`/student/properties${queryString ? `?${queryString}` : ''}`);
};
