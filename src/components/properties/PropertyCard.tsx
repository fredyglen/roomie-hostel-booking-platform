
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Bed, Bath, Lock, Eye } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import LazyImage from '@/components/common/LazyImage';
import { getOptimizedPropertyImageUrl } from '@/utils/imageOptimization';

import { usePropertyViewingTracker, ViewingRestriction } from '@/hooks/usePropertyViewingTracker';
import ViewingLimitOverlay from './ViewingLimitOverlay';
import { useNavigate } from 'react-router-dom';

import RealTimeAvailabilityIndicator from '@/components/property/RealTimeAvailabilityIndicator';
import PropertyCardOverlay from '@/components/property/PropertyCardOverlay';
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

import { PropertyId, PropertyPrice } from '@/types/property';
import {
  PropertyTitle,
  BedroomCount,
  WashroomCount,
  MaxOccupants
} from '@/types/apple-grade-foundation';

export interface PropertyCardProps {
  readonly id: PropertyId | string;
  readonly title: PropertyTitle | string;
  readonly rent: PropertyPrice | number;
  readonly location: string;
  readonly bedrooms: BedroomCount | number;
  readonly bathrooms: WashroomCount | number;
  readonly maxOccupants: MaxOccupants | number;
  readonly images: string[];
  readonly amenities: string[];
  readonly propertyType: string; // 'hostel', 'homestel', 'apartment'
  readonly genderRestriction?: string;
  readonly isAvailable: boolean;
  // ROOMi-specific properties
  readonly roomTypes?: Array<{
    readonly type: string; // "1 in a room", "2 in a room", etc.
    readonly price: number;
    readonly bedsAvailable: number;
    readonly totalBeds: number;
  }>;
  readonly distanceToCampus?: string;
  readonly totalBedsAvailable?: number;
  readonly totalBeds?: number;
  readonly priceUnit?: 'semester' | 'month' | 'year';
  // Compound information (if part of a compound)
  readonly isPartOfCompound?: boolean;
  readonly compoundName?: string;
  readonly blockIdentifier?: string;
  readonly onViewDetails: () => void;
  readonly onViewStory?: () => void;
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
  // Type-safe property ID handling
  const propertyId = typeof id === 'string' ? id : String(id);

  // Type-safe rent handling
  const rentAmount = typeof rent === 'number' ? rent : Number(rent);
  const navigate = useNavigate();
  const {
    trackImageView,
    trackStoryView,
    trackPropertyView,
    canViewImage,
    canViewStory,
    checkViewingRestriction,
    isAnonymous
  } = usePropertyViewingTracker();

  const [showViewingLimitOverlay, setShowViewingLimitOverlay] = useState(false);
  const [viewingRestriction, setViewingRestriction] = useState<ViewingRestriction | null>(null);
  const [hasTrackedView, setHasTrackedView] = useState(false);

  // Get primary image with fallback - handle both array and string formats
  const primaryImage = (() => {
    // First check images array
    if (Array.isArray(images) && images.length > 0 && images[0]?.trim()) {
      // Filter out blob URLs that won't work
      const validImage = images.find(img => {
        if (!img || typeof img !== 'string') return false;
        const url = img.trim();
        if (!url) return false;
        if (url.startsWith('blob:')) return false;
        if (url.includes('localhost')) return false;
        if (!url.startsWith('http://') && !url.startsWith('https://')) return false;
        return true;
      });
      if (validImage) {
        return validImage;
      }
    }

    // Check if images is a string
    if (typeof images === 'string') {
      const url = images.trim();
      if (
        url &&
        !url.startsWith('blob:') &&
        !url.includes('localhost') &&
        (url.startsWith('http://') || url.startsWith('https://'))
      ) {
        return url;
      }
    }

    // No valid remote image; let LazyImage fall back to local placeholder
    return '';
  })();

  const optimizedPrimaryImage = getOptimizedPropertyImageUrl(primaryImage, {
    width: 800,
    quality: 80,
    resize: 'cover',
  });

  // Handle property card click - just navigate, no booking verification
  const handlePropertyClick = () => {
    onViewDetails();
  };

  // Handle story view attempt
  const handleStoryAttempt = () => {
    if (onViewStory) {
      onViewStory();
    }
  };

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
      className="overflow-hidden card-premium animate-fade-in-up h-[280px] sm:h-[280px] flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-200 w-full"
      onClick={() => {
        console.log(`Navigating to property details for: ${title}`);
        handlePropertyClick();
      }}
    >

      {/* Enhanced Image Section with Production-Grade Overlay */}
      <div className="relative h-[70px] flex-shrink-0">
        <LazyImage
          src={optimizedPrimaryImage || '/placeholder.svg'}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${
            isAnonymous && !canViewImage() ? 'blur-sm' : ''
          }`}
          width={400}
          height={70}
          priority={false}
          onLoad={() => {
            if (isAnonymous) {
              handleImageView();
            }
          }}
        />

        {/* REMOVED: Overlay system from property cards - only for detail page */}

        {/* Image viewing limit overlay */}
        {isAnonymous && !canViewImage() && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
            <div className="bg-white/90 rounded-lg p-1 flex items-center gap-1 text-xs">
              <Lock size={10} className="text-primary" />
              <span className="font-medium text-gray-800">Register for more</span>
            </div>
          </div>
        )}

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



        {/* Story View Button - Bottom Left */}
        {onViewStory && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Story view icon clicked for property:', id);
              handleStoryAttempt();
            }}
            className="absolute bottom-1 left-1 bg-white/90 hover:bg-white rounded-full p-1 transition-all duration-200 shadow-md"
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
            {title}
          </h3>
          <div className="text-right flex-shrink-0">
            <div className="text-lg font-bold text-primary">
              ¢{rent.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">/{priceUnit}</div>
          </div>
        </div>

        {/* Location and Distance */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <div className="flex items-center flex-1">
            <LocationIcon size={12} />
            <span className="ml-1 truncate">{location}</span>
          </div>
          {distanceToCampus && (
            <span className="text-primary font-medium ml-1 flex-shrink-0 text-sm">
              {distanceToCampus}
            </span>
          )}
        </div>

        {/* Room Type and Real-Time Bed Availability */}
        <div className="flex items-center justify-between text-sm mb-2">
          <div className="flex items-center">
            <BedroomIcon size={12} />
            <span className="ml-1 font-medium text-gray-700">
              {getRoomTypeDisplay()}
            </span>
          </div>

          {/* ✅ PRODUCTION-GRADE: Real-Time Availability */}
          <RealTimeAvailabilityIndicator
            propertyId={propertyId}
            variant="compact"
            enableRealTimeUpdates={true}
          />
        </div>

        {/* Amenities - Enhanced */}
        <div className="flex flex-wrap gap-1 mb-2">
          {amenities.slice(0, 2).map((amenity, index) => (
            <div key={index} className="flex items-center bg-blue-50 rounded-full px-2 py-1 text-sm text-primary">
              {getAmenityIcon(amenity)}
              <span className="ml-1 font-medium">{amenity}</span>
            </div>
          ))}
          {amenities.length > 2 && (
            <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 text-sm text-gray-600">
              +{amenities.length - 2}
            </div>
          )}
        </div>



      </div>



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
