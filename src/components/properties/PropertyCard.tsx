
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Bed, Bath, Lock, Eye } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import LazyImage from '@/components/common/LazyImage';
import { useBookingAccess } from '@/hooks/useBookingAccess';
import RegistrationPromptModal from '@/components/auth/RegistrationPromptModal';
import { usePropertyViewingTracker } from '@/hooks/usePropertyViewingTracker';
import ViewingLimitOverlay from './ViewingLimitOverlay';
import { useNavigate } from 'react-router-dom';
import {
  WifiIcon,
  AirConditionIcon,
  LaundryIcon,
  StudyAreaIcon,
  BedroomIcon,
  LocationIcon,
  SecurityIcon,
  KitchenIcon
} from '@/components/ui/SolarIcons';

export interface PropertyCardProps {
  id: string;
  title: string;
  rent: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  maxOccupants: number;
  images: string[];
  amenities: string[];
  propertyType: string;
  genderRestriction?: string;
  isAvailable: boolean;
  // ROOMi-specific properties
  roomTypes?: Array<{
    type: string; // "1 in a room", "2 in a room", etc.
    price: number;
    bedsAvailable: number;
    totalBeds: number;
  }>;
  distanceToCampus?: string;
  totalBedsAvailable?: number;
  totalBeds?: number;
  priceUnit?: 'semester' | 'month' | 'year';
  onViewDetails: () => void;
  onViewStory?: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  rent,
  location,
  bedrooms,
  bathrooms,
  maxOccupants,
  images,
  amenities,
  propertyType,
  genderRestriction,
  isAvailable,
  roomTypes,
  distanceToCampus,
  totalBedsAvailable = 0,
  totalBeds = 1,
  priceUnit = 'semester',
  onViewDetails,
  onViewStory
}) => {
  const navigate = useNavigate();
  const { accessLevel, canPerformAction, filterPropertyData, getRegistrationPrompt } = useBookingAccess();
  const {
    trackImageView,
    trackStoryView,
    trackPropertyView,
    canViewImage,
    canViewStory,
    checkViewingRestriction,
    isAnonymous
  } = usePropertyViewingTracker();

  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showViewingLimitOverlay, setShowViewingLimitOverlay] = useState(false);
  const [viewingRestriction, setViewingRestriction] = useState<any>(null);
  const [hasTrackedView, setHasTrackedView] = useState(false);

  // Filter property data based on user access level
  const filteredProperty = filterPropertyData({
    id, title, rent, location, bedrooms, bathrooms, maxOccupants,
    images, amenities, propertyType, genderRestriction, isAvailable,
    roomTypes, distanceToCampus, totalBedsAvailable, totalBeds, priceUnit
  });

  const primaryImage = filteredProperty.images && filteredProperty.images.length > 0 ? filteredProperty.images[0] : undefined;

  // Handle booking attempt
  const handleBookingAttempt = () => {
    if (!canPerformAction('start_booking')) {
      setShowRegistrationModal(true);
      return;
    }
    onViewDetails();
  };

  // Handle story view attempt
  const handleStoryAttempt = () => {
    if (!canPerformAction('view_details') && onViewStory) {
      setShowRegistrationModal(true);
      return;
    }
    if (onViewStory) {
      onViewStory();
    }
  };

  // Get registration prompt data
  const registrationPrompt = getRegistrationPrompt();

  // Track property view on mount (for anonymous users)
  useEffect(() => {
    if (isAnonymous && !hasTrackedView) {
      trackPropertyView();
      setHasTrackedView(true);
    }
  }, [isAnonymous, hasTrackedView, trackPropertyView]);

  // Handle image viewing with limits
  const handleImageView = () => {
    if (isAnonymous) {
      if (!canViewImage()) {
        const restriction = checkViewingRestriction('images');
        setViewingRestriction(restriction);
        setShowViewingLimitOverlay(true);
        return false;
      }
      trackImageView();
    }
    return true;
  };

  // Handle story viewing with limits
  const handleStoryViewAttempt = () => {
    if (isAnonymous) {
      if (!canViewStory()) {
        const restriction = checkViewingRestriction('stories');
        setViewingRestriction(restriction);
        setShowViewingLimitOverlay(true);
        return;
      }
      trackStoryView();
    }

    if (!canPerformAction('view_details') && onViewStory) {
      setShowRegistrationModal(true);
      return;
    }
    if (onViewStory) {
      onViewStory();
    }
  };

  // Handle registration/login from viewing limit overlay
  const handleRegisterFromOverlay = () => {
    setShowViewingLimitOverlay(false);
    navigate('/register');
  };

  const handleLoginFromOverlay = () => {
    setShowViewingLimitOverlay(false);
    navigate('/login');
  };

  // Calculate bed availability percentage for color coding
  const availabilityPercentage = totalBeds > 0 ? (totalBedsAvailable / totalBeds) * 100 : 0;

  // Get availability status and color
  const getAvailabilityStatus = () => {
    if (totalBedsAvailable === 0) return { status: 'FULL', color: 'bg-red-500', textColor: 'text-white' };
    if (availabilityPercentage <= 25) return { status: 'LIMITED', color: 'bg-orange-500', textColor: 'text-white' };
    return { status: 'AVAILABLE', color: 'bg-green-500', textColor: 'text-white' };
  };

  const availabilityInfo = getAvailabilityStatus();



  // Get room type display (most common or cheapest)
  const getRoomTypeDisplay = () => {
    if (!roomTypes || roomTypes.length === 0) {
      return `${maxOccupants} in a room`;
    }
    // Show the room type with most availability or lowest price
    const sortedByAvailability = roomTypes.sort((a, b) => b.bedsAvailable - a.bedsAvailable);
    return sortedByAvailability[0]?.type || `${maxOccupants} in a room`;
  };

  const getAmenityIcon = (amenity: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'WiFi': <WifiIcon size={14} />,
      'AC': <AirConditionIcon size={14} />,
      'Air Condition': <AirConditionIcon size={14} />,
      'Laundry': <LaundryIcon size={14} />,
      'Study Area': <StudyAreaIcon size={14} />,
      'Kitchen': <KitchenIcon size={14} />,
      'Security': <SecurityIcon size={14} />
    };
    return iconMap[amenity] || null;
  };

  return (
    <Card
      className={`overflow-hidden card-premium animate-fade-in-up h-[280px] sm:h-[280px] flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-200 w-full ${
        !canPerformAction('view_details') ? 'relative' : ''
      }`}
      onClick={() => {
        console.log(`Navigating to property details for: ${filteredProperty.title}`);
        handleBookingAttempt();
      }}
    >
      {/* Access Restriction Overlay */}
      {!canPerformAction('view_details') && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <div className="bg-white/90 rounded-lg p-3 flex items-center gap-2 shadow-lg">
            <Lock size={16} className="text-primary" />
            <span className="text-sm font-medium text-gray-800">Register to View Details</span>
          </div>
        </div>
      )}
      {/* Enhanced Image Section with Better Visibility */}
      <div className="relative h-[70px] flex-shrink-0">
        <LazyImage
          src={primaryImage || '/placeholder-property.jpg'}
          alt={filteredProperty.title}
          className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${
            isAnonymous && !canViewImage() ? 'blur-sm' : ''
          }`}
          width={400}
          height={70}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          priority={false}
          onLoad={() => {
            if (isAnonymous) {
              handleImageView();
            }
          }}
        />

        {/* Image viewing limit overlay */}
        {isAnonymous && !canViewImage() && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <div className="bg-white/90 rounded-lg p-1 flex items-center gap-1 text-xs">
              <Lock size={10} className="text-primary" />
              <span className="font-medium text-gray-800">Register for more</span>
            </div>
          </div>
        )}

        {/* Bed Availability Badge - Top Left */}
        <div className="absolute top-1 left-1">
          <Badge
            className={`${availabilityInfo.color} ${availabilityInfo.textColor} text-xs font-bold px-1 py-0.5`}
          >
            {availabilityInfo.status}
          </Badge>
        </div>

        {/* Gender Restriction - Top Right */}
        {genderRestriction && genderRestriction !== 'mixed' && (
          <div className="absolute top-1 right-1">
            <Badge
              variant="outline"
              className="bg-white/90 text-gray-800 text-xs font-medium border-gray-300 px-1 py-0.5"
            >
              {genderRestriction === 'male' ? '♂' : '♀'}
            </Badge>
          </div>
        )}

        {/* Property Type Badge - Bottom Right */}
        <div className="absolute bottom-1 right-1">
          <Badge
            variant="secondary"
            className="bg-black/70 text-white text-xs font-medium px-1 py-0.5"
          >
            {propertyType}
          </Badge>
        </div>

        {/* Story View Button - Bottom Left */}
        {onViewStory && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Story view icon clicked for property:', id);
              handleStoryAttempt();
            }}
            className={`absolute bottom-1 left-1 bg-white/90 hover:bg-white rounded-full p-1 transition-all duration-200 shadow-md ${
              !canPerformAction('view_details') ? 'opacity-50' : ''
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-primary">
              <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Enhanced Content Section */}
      <div className="p-2 flex-1 flex flex-col justify-between min-h-0">
        {/* Header with Title and Price */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-1 flex-1 mr-2">
            {filteredProperty.title}
          </h3>
          <div className="text-right flex-shrink-0">
            <div className="text-lg font-bold text-primary">
              ¢{filteredProperty.rent.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">/{filteredProperty.priceUnit}</div>
          </div>
        </div>

        {/* Location and Distance */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <div className="flex items-center flex-1">
            <LocationIcon size={12} />
            <span className="ml-1 truncate">{filteredProperty.location}</span>
            {!canPerformAction('view_location') && (
              <Lock size={10} className="ml-1 text-gray-400" />
            )}
          </div>
          {filteredProperty.distanceToCampus && (
            <span className="text-primary font-medium ml-1 flex-shrink-0 text-sm">
              {filteredProperty.distanceToCampus}
            </span>
          )}
        </div>

        {/* Room Type and Bed Availability */}
        <div className="flex items-center justify-between text-sm mb-2">
          <div className="flex items-center">
            <BedroomIcon size={12} />
            <span className="ml-1 font-medium text-gray-700">
              {getRoomTypeDisplay()}
            </span>
          </div>
          <div className="text-right">
            <span className={`font-bold text-sm ${
              totalBedsAvailable > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {totalBedsAvailable} available
            </span>
          </div>
        </div>

        {/* Amenities - Enhanced */}
        <div className="flex flex-wrap gap-1 mb-2">
          {filteredProperty.amenities.slice(0, 2).map((amenity, index) => (
            <div key={index} className="flex items-center bg-blue-50 rounded-full px-2 py-1 text-sm text-primary">
              {getAmenityIcon(amenity)}
              <span className="ml-1 font-medium">{amenity}</span>
            </div>
          ))}
          {filteredProperty.amenities.length > 2 && (
            <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 text-sm text-gray-600">
              +{filteredProperty.amenities.length - 2}
              {!canPerformAction('view_details') && (
                <Lock size={10} className="ml-1 text-gray-400" />
              )}
            </div>
          )}
        </div>

        {/* Access Level Indicator */}
        {accessLevel.accessTier === 'anonymous' && (
          <div className="mt-2 text-xs text-gray-500 text-center">
            <Lock size={10} className="inline mr-1" />
            Register to view all details
          </div>
        )}

      </div>

      {/* Registration Prompt Modal */}
      {registrationPrompt && (
        <RegistrationPromptModal
          isOpen={showRegistrationModal}
          onClose={() => setShowRegistrationModal(false)}
          title={registrationPrompt.title}
          message={registrationPrompt.message}
          actionText={registrationPrompt.actionText}
          benefits={registrationPrompt.benefits}
          trigger="booking_attempt"
        />
      )}

      {/* Viewing Limit Overlay */}
      {viewingRestriction && (
        <ViewingLimitOverlay
          isVisible={showViewingLimitOverlay}
          restrictionType={viewingRestriction.restrictionType}
          remainingViews={viewingRestriction.remainingViews}
          totalLimit={viewingRestriction.totalLimit}
          message={viewingRestriction.message}
          onRegisterClick={handleRegisterFromOverlay}
          onLoginClick={handleLoginFromOverlay}
        />
      )}
    </Card>
  );
};

export default PropertyCard;
