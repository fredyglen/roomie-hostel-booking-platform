// Booking Access Control Hook
// Manages access levels for booking functionality based on user authentication status

import { useAuth } from '@/context/EnhancedAuthContext';
import { UserRole } from '@/types/roles';

export interface BookingAccessLevel {
  canViewBasicInfo: boolean;
  canViewDetailedInfo: boolean;
  canViewExactLocation: boolean;
  canInitiateBooking: boolean;
  canViewPremiumFeatures: boolean;
  accessTier: 'anonymous' | 'registered' | 'verified' | 'premium';
  restrictionMessage?: string;
}

export interface PropertyViewingLimits {
  maxImages: number;
  maxVideos: number;
  maxStoryViews: number;
  showBlurOverlay: boolean;
  requireRegistration: boolean;
}

export const useBookingAccess = () => {
  const { user, loading } = useAuth();

  // Determine user access level
  const getAccessLevel = (): BookingAccessLevel => {
    // Loading state - restrict access
    if (loading) {
      return {
        canViewBasicInfo: true,
        canViewDetailedInfo: false,
        canViewExactLocation: false,
        canInitiateBooking: false,
        canViewPremiumFeatures: false,
        accessTier: 'anonymous',
        restrictionMessage: 'Loading user authentication...'
      };
    }

    // Anonymous user - basic access only
    if (!user) {
      return {
        canViewBasicInfo: true,
        canViewDetailedInfo: false,
        canViewExactLocation: false,
        canInitiateBooking: false,
        canViewPremiumFeatures: false,
        accessTier: 'anonymous',
        restrictionMessage: 'Please register to access booking features and detailed property information'
      };
    }

    // Registered user - enhanced access (no document verification required for browsing)
    if (user && !user.verified) {
      return {
        canViewBasicInfo: true,
        canViewDetailedInfo: true,
        canViewExactLocation: true, // Allow location viewing for registered users
        canInitiateBooking: false, // Require verification only for booking
        canViewPremiumFeatures: true, // Allow premium features for registered users
        accessTier: 'registered',
        restrictionMessage: 'Student verification required to book properties. Upload your student ID to complete booking.'
      };
    }

    // Verified student - full access
    if (user && user.verified) {
      return {
        canViewBasicInfo: true,
        canViewDetailedInfo: true,
        canViewExactLocation: true,
        canInitiateBooking: true,
        canViewPremiumFeatures: true,
        accessTier: 'verified'
      };
    }

    // Default to registered level
    return {
      canViewBasicInfo: true,
      canViewDetailedInfo: true,
      canViewExactLocation: false,
      canInitiateBooking: true,
      canViewPremiumFeatures: false,
      accessTier: 'registered'
    };
  };

  // Get property viewing limits for anonymous users
  const getViewingLimits = (): PropertyViewingLimits => {
    const accessLevel = getAccessLevel();

    if (accessLevel.accessTier === 'anonymous') {
      return {
        maxImages: 2,
        maxVideos: 1,
        maxStoryViews: 2,
        showBlurOverlay: true,
        requireRegistration: true
      };
    }

    // No limits for registered users
    return {
      maxImages: Infinity,
      maxVideos: Infinity,
      maxStoryViews: Infinity,
      showBlurOverlay: false,
      requireRegistration: false
    };
  };

  // Check if user can perform specific booking action
  const canPerformAction = (action: 'view_details' | 'start_booking' | 'view_location' | 'view_premium') => {
    const accessLevel = getAccessLevel();

    switch (action) {
      case 'view_details':
        return accessLevel.canViewDetailedInfo;
      case 'start_booking':
        return accessLevel.canInitiateBooking;
      case 'view_location':
        return accessLevel.canViewExactLocation;
      case 'view_premium':
        return accessLevel.canViewPremiumFeatures;
      default:
        return false;
    }
  };

  // Get filtered property data based on access level
  const filterPropertyData = (propertyData: Record<string, unknown>) => {
    const accessLevel = getAccessLevel();

    const filteredData = { ...propertyData };

    // Level 1: Public (Anonymous users)
    if (accessLevel.accessTier === 'anonymous') {
      return {
        id: filteredData.id,
        title: filteredData.title,
        location: filteredData.location?.split(',')[0] + ', General Area', // Hide specific location
        rent: filteredData.rent,
        roomType: filteredData.roomType,
        images: filteredData.images?.slice(0, 2) || [], // Limit to 2 images
        amenities: filteredData.amenities?.slice(0, 3) || [], // Basic amenities only
        propertyType: filteredData.propertyType,
        genderRestriction: filteredData.genderRestriction,
        isAvailable: filteredData.isAvailable,
        distanceToCampus: 'Near campus', // Generic distance
        maxOccupants: filteredData.maxOccupants
      };
    }

    // Level 2: Registered users
    if (accessLevel.accessTier === 'registered') {
      return {
        ...filteredData,
        // Hide exact coordinates but show street address
        exactCoordinates: undefined,
        ownerContact: undefined // Hide owner contact until verified
      };
    }

    // Level 3+: Verified users get full access
    return filteredData;
  };

  // Generate registration prompt message
  const getRegistrationPrompt = () => {
    const accessLevel = getAccessLevel();
    
    if (accessLevel.accessTier === 'anonymous') {
      return {
        title: 'Register to Continue',
        message: 'Create a free account to continue browsing properties.',
        actionText: 'Register Now'
      };
    }

    if (accessLevel.accessTier === 'registered') {
      return {
        title: 'Student Verification Required for Booking',
        message: 'Upload your student ID or proof of enrollment to book properties.',
        actionText: 'Start Booking Process'
      };
    }

    return null;
  };

  return {
    accessLevel: getAccessLevel(),
    viewingLimits: getViewingLimits(),
    canPerformAction,
    filterPropertyData,
    getRegistrationPrompt,
    isAuthenticated: !!user,
    isVerified: !!user?.verified,
    userRole: user?.role || null,
    loading
  };
};

export default useBookingAccess;
