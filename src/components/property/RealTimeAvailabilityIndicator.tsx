/**
 * Real-Time Availability Indicator Component
 * 
 * PRODUCTION-GRADE real-time bed availability display.
 * Shows live occupancy status with beautiful visual indicators.
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useRealTimeBedAvailability } from '@/hooks/useRealTimeBedAvailability';
import { 
  getAvailabilityStatusDisplay, 
  formatAvailabilityMessage 
} from '@/services/realTimeBedAvailabilityService';
import { 
  Bed, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw
} from 'lucide-react';

interface RealTimeAvailabilityIndicatorProps {
  readonly propertyId: string;
  readonly variant?: 'compact' | 'detailed' | 'card' | 'mobile-inline';
  readonly showLastUpdated?: boolean;
  readonly enableRealTimeUpdates?: boolean;
}

/**
 * ✅ PRODUCTION-GRADE: Real-Time Availability Indicator
 */
const RealTimeAvailabilityIndicator: React.FC<RealTimeAvailabilityIndicatorProps> = ({
  propertyId,
  variant = 'compact',
  showLastUpdated = false,
  enableRealTimeUpdates = true
}) => {
  const { 
    availability, 
    isLoading, 
    error, 
    lastUpdated, 
    refetch, 
    isStale 
  } = useRealTimeBedAvailability({
    propertyId,
    enableRealTimeUpdates,
    refreshInterval: 30000
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-20" />
        {variant !== 'compact' && <Skeleton className="h-4 w-32" />}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <XCircle className="h-4 w-4" />
        <span className="text-sm">Availability unavailable</span>
        <button
          onClick={refetch}
          className="text-xs underline hover:no-underline"
        >
          Retry
        </button>
      </div>
    );
  }

  // No data
  if (!availability) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <AlertTriangle className="h-4 w-4" />
        <span className="text-sm">No availability data</span>
      </div>
    );
  }

  const { overall } = availability;
  const statusDisplay = getAvailabilityStatusDisplay(overall.status);
  const availabilityMessage = formatAvailabilityMessage(overall);

  // Mobile inline variant - ultra-compact for mobile property details
  if (variant === 'mobile-inline') {
    return (
      <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Bed className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Bed Availability</span>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className={`${statusDisplay.color} ${statusDisplay.bgColor} text-xs font-medium px-2 py-1`}
          >
            <div className="flex items-center gap-1">
              {overall.status === 'free' && <CheckCircle className="h-3 w-3" />}
              {overall.status === 'moderate' && <Clock className="h-3 w-3" />}
              {overall.status === 'filling_up' && <AlertTriangle className="h-3 w-3" />}
              {overall.status === 'full' && <XCircle className="h-3 w-3" />}
              <span>{statusDisplay.text}</span>
            </div>
          </Badge>

          <span className="text-xs text-gray-600 font-medium">
            {overall.availableBeds}/{overall.totalBeds}
          </span>

          {enableRealTimeUpdates && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          )}
        </div>
      </div>
    );
  }

  // Compact variant - for property cards
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        <Badge
          variant="secondary"
          className={`${statusDisplay.color} ${statusDisplay.bgColor} text-xs font-medium`}
        >
          <div className="flex items-center gap-1">
            {overall.status === 'free' && <CheckCircle className="h-3 w-3" />}
            {overall.status === 'moderate' && <Clock className="h-3 w-3" />}
            {overall.status === 'filling_up' && <AlertTriangle className="h-3 w-3" />}
            {overall.status === 'full' && <XCircle className="h-3 w-3" />}
            <span>{statusDisplay.text}</span>
          </div>
        </Badge>

        <span className="text-xs text-gray-600">
          {overall.availableBeds} available
        </span>

        {isStale && (
          <RefreshCw className="h-3 w-3 text-gray-400" />
        )}
      </div>
    );
  }

  // Detailed variant - for property details
  if (variant === 'detailed') {
    return (
      <div className="space-y-3">
        {/* Main Status - Responsive */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 text-center md:text-left">
            <Badge
              variant="secondary"
              className={`${statusDisplay.color} ${statusDisplay.bgColor} text-sm font-medium px-3 py-2 md:py-1 mx-auto md:mx-0 w-fit`}
            >
              <div className="flex items-center gap-2">
                {overall.status === 'free' && <CheckCircle className="h-4 w-4" />}
                {overall.status === 'moderate' && <Clock className="h-4 w-4" />}
                {overall.status === 'filling_up' && <AlertTriangle className="h-4 w-4" />}
                {overall.status === 'full' && <XCircle className="h-4 w-4" />}
                <span>{statusDisplay.text}</span>
              </div>
            </Badge>

            <span className="text-sm text-gray-600 font-medium md:font-normal">
              {availabilityMessage}
            </span>
          </div>

          {showLastUpdated && lastUpdated && (
            <div className="flex items-center justify-center md:justify-end gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>
                Updated {new Date(lastUpdated).toLocaleTimeString()}
              </span>
              {isStale && <span className="text-orange-500">(Stale)</span>}
            </div>
          )}
        </div>

        {/* Bed Statistics - Responsive Layout */}
        <div className="grid grid-cols-3 md:grid-cols-3 md:max-w-md md:mx-auto gap-4 text-sm">
          <div className="flex flex-col md:flex-row items-center md:gap-2 text-center md:text-left">
            <Bed className="h-4 w-4 text-gray-500 mb-1 md:mb-0" />
            <div>
              <div className="font-medium text-lg md:text-base">{overall.totalBeds}</div>
              <div className="text-xs text-gray-500">Total Beds</div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:gap-2 text-center md:text-left">
            <CheckCircle className="h-4 w-4 text-green-500 mb-1 md:mb-0" />
            <div>
              <div className="font-medium text-lg md:text-base text-green-600">{overall.availableBeds}</div>
              <div className="text-xs text-gray-500">Available</div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:gap-2 text-center md:text-left">
            <Users className="h-4 w-4 text-blue-500 mb-1 md:mb-0" />
            <div>
              <div className="font-medium text-lg md:text-base text-blue-600">{overall.occupiedBeds}</div>
              <div className="text-xs text-gray-500">Occupied</div>
            </div>
          </div>
        </div>

        {/* Occupancy Bar - Responsive */}
        <div className="space-y-1 md:max-w-md md:mx-auto">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Occupancy</span>
            <span>{Math.round(overall.occupancyRate * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 md:h-2">
            <div
              className={`h-3 md:h-2 rounded-full transition-all duration-300 ${
                overall.occupancyRate < 0.3 ? 'bg-green-500' :
                overall.occupancyRate < 0.7 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${Math.min(overall.occupancyRate * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Room Type Breakdown */}
        {availability.byRoomType.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">By Room Type</h4>
            <div className="space-y-1">
              {availability.byRoomType.map((roomType) => {
                const roomStatusDisplay = getAvailabilityStatusDisplay(roomType.status);
                return (
                  <div key={roomType.roomType} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{roomType.roomType}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {roomType.availableBeds}/{roomType.totalBeds}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className={`${roomStatusDisplay.color} ${roomStatusDisplay.bgColor} text-xs`}
                      >
                        {roomStatusDisplay.text}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Card variant - standalone card
  if (variant === 'card') {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <Bed className="h-4 w-4" />
              Bed Availability
            </h3>
            
            {enableRealTimeUpdates && (
              <div className="flex items-center gap-1 text-xs text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Live</span>
              </div>
            )}
          </div>

          <RealTimeAvailabilityIndicator
            propertyId={propertyId}
            variant="detailed"
            showLastUpdated={showLastUpdated}
            enableRealTimeUpdates={enableRealTimeUpdates}
          />
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default RealTimeAvailabilityIndicator;
