/**
 * Property Card Overlay Component
 * 
 * PRODUCTION-GRADE overlay system for property cards.
 * Displays comprehensive real-time information beautifully on cover images.
 * Optimized for mobile-first design with Apple-level polish.
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useRealTimeBedAvailability } from '@/hooks/useRealTimeBedAvailability';
import { getAvailabilityStatusDisplay } from '@/services/realTimeBedAvailabilityService';
import { 
  Bed, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Zap,
  Eye
} from 'lucide-react';

interface PropertyCardOverlayProps {
  readonly propertyId: string;
  readonly price: number;
  readonly priceUnit?: 'semester' | 'month';
  readonly isVerified?: boolean;
  readonly isPopular?: boolean;
  readonly viewCount?: number;
  readonly variant?: 'default' | 'compact' | 'minimal';
  readonly showLiveIndicator?: boolean;
  readonly showPrice?: boolean;
  readonly className?: string;
}

/**
 * ✅ PRODUCTION-GRADE: Property Card Overlay with Real-Time Information
 */
const PropertyCardOverlay: React.FC<PropertyCardOverlayProps> = ({
  propertyId,
  price,
  priceUnit = 'semester',
  isVerified = false,
  isPopular = false,
  viewCount = 0,
  variant = 'default',
  showLiveIndicator = true,
  showPrice = true,
  className = ''
}) => {
  const { availability, isLoading, error } = useRealTimeBedAvailability({
    propertyId,
    enableRealTimeUpdates: true,
    refreshInterval: 30000
  });

  // Format price display
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get urgency level based on availability
  const getUrgencyLevel = () => {
    if (!availability) return 'none';
    const { overall } = availability;
    
    if (overall.status === 'full') return 'critical';
    if (overall.status === 'filling_up') return 'high';
    if (overall.status === 'moderate') return 'medium';
    return 'low';
  };

  const urgencyLevel = getUrgencyLevel();
  const statusDisplay = availability ? getAvailabilityStatusDisplay(availability.overall.status) : null;

  // Compact variant for small cards
  if (variant === 'compact') {
    return (
      <div className={`absolute inset-0 pointer-events-none ${className}`}>
        {/* Top-left: Status only */}
        {!isLoading && !error && availability && statusDisplay && (
          <div className="absolute top-1 left-1 z-10">
            <Badge className={`${statusDisplay.bgColor} ${statusDisplay.color} text-xs px-1.5 py-0.5 shadow-sm`}>
              {availability.overall.availableBeds > 0 ? `${availability.overall.availableBeds} left` : 'Full'}
            </Badge>
          </div>
        )}

        {/* Top-right: Price */}
        {showPrice && (
          <div className="absolute top-1 right-1 z-10">
            <div className="bg-white/90 rounded px-1.5 py-0.5 shadow-sm">
              <span className="text-xs font-medium text-gray-900">
                {formatPrice(price)}
              </span>
            </div>
          </div>
        )}

        {/* Live indicator */}
        {showLiveIndicator && (
          <div className="absolute bottom-1 right-1 z-10">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-sm" />
          </div>
        )}
      </div>
    );
  }

  // Minimal variant for very small cards
  if (variant === 'minimal') {
    return (
      <div className={`absolute inset-0 pointer-events-none ${className}`}>
        {!isLoading && !error && availability && (
          <div className="absolute top-1 left-1 z-10">
            <div className={`w-3 h-3 rounded-full shadow-sm ${
              availability.overall.status === 'free' ? 'bg-green-500' :
              availability.overall.status === 'moderate' ? 'bg-yellow-500' :
              availability.overall.status === 'filling_up' ? 'bg-orange-500' :
              'bg-red-500'
            }`} />
          </div>
        )}
      </div>
    );
  }

  // Default variant - full overlay
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* ✅ TOP-LEFT: Verification & Popular Badges */}
      <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
        {isVerified && (
          <Badge className="bg-green-600 text-white text-xs font-medium px-2 py-1 shadow-lg">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )}
        
        {isPopular && (
          <Badge className="bg-orange-500 text-white text-xs font-medium px-2 py-1 shadow-lg">
            <TrendingUp className="h-3 w-3 mr-1" />
            Popular
          </Badge>
        )}
      </div>

      {/* ✅ TOP-RIGHT: Live Indicator & View Count */}
      <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10">
        {/* Live Indicator */}
        <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-white text-xs font-medium">Live</span>
        </div>

        {/* View Count */}
        {viewCount > 0 && (
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
            <Eye className="h-3 w-3 text-white" />
            <span className="text-white text-xs">{viewCount}</span>
          </div>
        )}
      </div>

      {/* ✅ BOTTOM-LEFT: Real-Time Availability Status */}
      {!isLoading && !error && availability && statusDisplay && (
        <div className="absolute bottom-2 left-2 z-10">
          <div className="bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
            <div className="flex items-center gap-2">
              {/* Status Icon */}
              <div className="flex-shrink-0">
                {availability.overall.status === 'free' && <CheckCircle className="h-4 w-4 text-green-400" />}
                {availability.overall.status === 'moderate' && <Clock className="h-4 w-4 text-yellow-400" />}
                {availability.overall.status === 'filling_up' && <AlertTriangle className="h-4 w-4 text-orange-400" />}
                {availability.overall.status === 'full' && <XCircle className="h-4 w-4 text-red-400" />}
              </div>

              {/* Availability Info */}
              <div className="text-white">
                <div className="text-xs font-medium">
                  {availability.overall.availableBeds}/{availability.overall.totalBeds} beds
                </div>
                <div className="text-xs opacity-90">
                  {statusDisplay.text}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ BOTTOM-RIGHT: Price & Urgency */}
      <div className="absolute bottom-2 right-2 flex flex-col gap-1 items-end z-10">
        {/* Urgency Indicator */}
        {urgencyLevel !== 'none' && urgencyLevel !== 'low' && (
          <div className={`flex items-center gap-1 rounded-full px-2 py-1 shadow-lg ${
            urgencyLevel === 'critical' ? 'bg-red-600' :
            urgencyLevel === 'high' ? 'bg-orange-500' :
            'bg-yellow-500'
          }`}>
            <Zap className="h-3 w-3 text-white" />
            <span className="text-white text-xs font-medium">
              {urgencyLevel === 'critical' ? 'Full' :
               urgencyLevel === 'high' ? 'Filling Fast' :
               'Limited'}
            </span>
          </div>
        )}

        {/* Price Badge */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
          <div className="text-center">
            <div className="text-sm font-bold text-gray-900">
              {formatPrice(price)}
            </div>
            <div className="text-xs text-gray-600">
              /{priceUnit}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ CENTER: Loading/Error States */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2">
            <div className="flex items-center gap-2 text-white">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-xs">Loading...</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute bottom-2 left-2 z-10">
          <div className="bg-red-600/90 backdrop-blur-sm rounded-lg px-3 py-2">
            <div className="flex items-center gap-2 text-white">
              <XCircle className="h-4 w-4" />
              <span className="text-xs">Data unavailable</span>
            </div>
          </div>
        </div>
      )}

      {/* ✅ GRADIENT OVERLAY for Better Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
    </div>
  );
};

export default PropertyCardOverlay;
