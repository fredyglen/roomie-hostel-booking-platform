
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { usePropertyRoomTypes, useRoomTypeSelection, getRoomTypeAvailabilityStatus, getAvailabilityStatusDisplay } from '@/hooks/usePropertyRoomTypes';

interface RoomSelectionStepProps {
  selectedRoomType: string;
  extraRequests: string;
  onRoomTypeChange: (value: string) => void;
  onRoomTypeSelect?: (value: string, price: number) => void;
  onRequestsChange: (value: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  // ✅ NEW: Dynamic property data instead of hardcoded types
  propertyId: string;
  propertyCategory?: string;
}

const RoomSelectionStep: React.FC<RoomSelectionStepProps> = ({
  selectedRoomType,
  extraRequests,
  onRoomTypeChange,
  onRoomTypeSelect,
  onRequestsChange,
  onPrevious,
  onNext,
  propertyId,
  propertyCategory
}) => {
  // ✅ PRODUCTION-GRADE: Load dynamic room types from owner configuration
  const { roomTypes, isLoading, error, hasRoomTypes } = usePropertyRoomTypes({
    propertyId,
    propertyCategory,
    enableFallback: true
  });

  const isValid = selectedRoomType; // ✅ FIXED: Only room type required now

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Room Selection</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Room Selection</h2>
        <div className="text-red-600 p-4 border border-red-200 rounded-lg">
          <p>Unable to load room types: {error}</p>
          <Button variant="outline" onClick={() => window.location.reload()} className="mt-2">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Room Selection</h2>

      <div>
        <Label htmlFor="roomType">Room Type</Label>
        <Select value={selectedRoomType} onValueChange={(value) => { onRoomTypeChange(value); const rt = roomTypes.find(r => r.value === value); if (rt && onRoomTypeSelect) onRoomTypeSelect(value, rt.price); }}>
          <SelectTrigger>
            <SelectValue placeholder="Select room type" />
          </SelectTrigger>
          <SelectContent>
            {roomTypes.length > 0 ? (
              roomTypes.map((roomType) => {
                const status = getRoomTypeAvailabilityStatus(roomType);
                const statusDisplay = getAvailabilityStatusDisplay(status);

                return (
                  <SelectItem
                    key={roomType.value}
                    value={roomType.value}
                    disabled={status === 'full'}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{roomType.label}</span>
                      <div className="flex items-center gap-2 ml-4">
                        <span className="text-sm font-medium">₵{roomType.price.toLocaleString()}</span>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${statusDisplay.color} ${statusDisplay.bgColor}`}
                        >
                          {statusDisplay.text}
                        </Badge>
                      </div>
                    </div>
                  </SelectItem>
                );
              })
            ) : (
              <SelectItem value="none" disabled>No room types available</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      
      {/* ✅ REMOVED: Furnishing selection removed as per Ghana hostel standards */}
      {/* Students will see owner-provided furnishing details as read-only information */}
      

      
      <div>
        <Label htmlFor="extraRequests">Special Requests (Optional)</Label>
        <Textarea
          id="extraRequests"
          value={extraRequests}
          onChange={(e) => onRequestsChange(e.target.value)}
          placeholder="Any special requests or requirements..."
          rows={3}
        />
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={onNext} disabled={!isValid}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default RoomSelectionStep;
