/**
 * Property Pricing Matrix Component
 * 
 * Beautiful display of all available room options and their respective prices
 * on the property details page. Shows dynamic pricing from owner configuration.
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { usePropertyRoomTypes, getRoomTypeAvailabilityStatus, getAvailabilityStatusDisplay } from '@/hooks/usePropertyRoomTypes';
import { formatCurrency } from '@/utils/currency';
import { Users, Bed, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface PropertyPricingMatrixProps {
  readonly propertyId: string;
  readonly propertyCategory?: string;
  readonly onRoomTypeSelect?: (roomTypeValue: string, price: number) => void;
  readonly selectedRoomType?: string;
  readonly showBookingButton?: boolean;
}

/**
 * ✅ PRODUCTION-GRADE: Property Pricing Matrix Component
 */
const PropertyPricingMatrix: React.FC<PropertyPricingMatrixProps> = ({
  propertyId,
  propertyCategory,
  onRoomTypeSelect,
  selectedRoomType,
  showBookingButton = false
}) => {
  const { roomTypes, isLoading, error, hasRoomTypes } = usePropertyRoomTypes({
    propertyId,
    propertyCategory,
    enableFallback: true
  });

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bed className="h-5 w-5" />
            Room Options & Pricing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bed className="h-5 w-5" />
            Room Options & Pricing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-2">Unable to load pricing information</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No room types available
  if (!hasRoomTypes || roomTypes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bed className="h-5 w-5" />
            Room Options & Pricing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No room options available</p>
            <p className="text-sm text-gray-500">Contact the property owner for more information</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bed className="h-5 w-5" />
          Room Options & Pricing
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Choose from {roomTypes.length} available room {roomTypes.length === 1 ? 'type' : 'types'}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {roomTypes.map((roomType) => {
            const status = getRoomTypeAvailabilityStatus(roomType);
            const statusDisplay = getAvailabilityStatusDisplay(status);
            const isSelected = selectedRoomType === roomType.value;
            const isAvailable = status !== 'full';

            return (
              <div
                key={roomType.value}
                className={`
                  border rounded-lg p-4 transition-all duration-200 cursor-pointer
                  ${isSelected 
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                    : isAvailable 
                      ? 'border-gray-200 hover:border-primary/50 hover:bg-gray-50' 
                      : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                  }
                `}
                onClick={() => {
                  if (isAvailable && onRoomTypeSelect) {
                    onRoomTypeSelect(roomType.value, roomType.price);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  {/* Room Type Info */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-900">
                        {roomType.label}
                      </span>
                    </div>
                    
                    {/* Availability Badge */}
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${statusDisplay.color} ${statusDisplay.bgColor}`}
                    >
                      {statusDisplay.text}
                    </Badge>

                    {/* Selected Indicator */}
                    {isSelected && (
                      <Badge variant="default" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Selected
                      </Badge>
                    )}
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      {formatCurrency(roomType.price)}
                    </div>
                    <div className="text-xs text-gray-500">per semester</div>
                  </div>
                </div>

                {/* Bed Availability Info */}
                {roomType.totalBeds > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Bed className="h-4 w-4" />
                        <span>
                          {roomType.bedsAvailable} of {roomType.totalBeds} beds available
                        </span>
                      </div>
                      
                      {/* Occupancy Indicator */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: roomType.occupants }).map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 rounded-full bg-primary/30"
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">
                          {roomType.occupants} {roomType.occupants === 1 ? 'person' : 'people'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Book Now Button */}
                {showBookingButton && isSelected && isAvailable && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <Button 
                      className="w-full" 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle booking action
                      }}
                    >
                      Book This Room Type
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {roomTypes.filter(rt => getRoomTypeAvailabilityStatus(rt) !== 'full').length} available options
            </span>
            <span>
              Starting from {formatCurrency(Math.min(...roomTypes.map(rt => rt.price)))}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyPricingMatrix;
