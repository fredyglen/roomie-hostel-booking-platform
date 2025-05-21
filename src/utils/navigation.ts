
import { NavigateFunction } from 'react-router-dom';

/**
 * Navigation utility functions to standardize routing throughout the application
 */

/**
 * Navigate to a property detail page
 */
export const navigateToProperty = (
  navigate: NavigateFunction,
  propertyId: string
): void => {
  if (!propertyId) {
    console.error("Cannot navigate to property: Invalid ID");
    return;
  }

  navigate(`/student/property/${propertyId}`);
};

/**
 * Navigate to the property booking page
 */
export const navigateToBooking = (
  navigate: NavigateFunction,
  propertyId: string
): void => {
  if (!propertyId) {
    console.error("Cannot navigate to booking: Invalid property ID");
    return;
  }

  navigate(`/student/book/${propertyId}`);
};

/**
 * Navigate to a property story view
 */
export const navigateToStory = (
  navigate: NavigateFunction,
  propertyId: string
): void => {
  if (!propertyId) {
    console.error("Cannot navigate to story: Invalid property ID");
    return;
  }

  navigate(`/student/property/${propertyId}/story`);
};

/**
 * Navigate to the properties listing page with optional filter parameters
 */
export const navigateToProperties = (
  navigate: NavigateFunction,
  filters?: Record<string, string>
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
  
  navigate(url);
};

/**
 * Navigate back to the previous page
 */
export const navigateBack = (
  navigate: NavigateFunction
): void => {
  navigate(-1);
};

/**
 * Navigate to the dashboard
 */
export const navigateToDashboard = (
  navigate: NavigateFunction
): void => {
  navigate('/student/dashboard');
};
