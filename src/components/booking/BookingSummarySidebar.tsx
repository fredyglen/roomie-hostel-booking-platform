import React from 'react';
import type { Property } from '@/types/property';
import type { BookingFormState, BookingState } from '@/hooks/booking/useEnhancedBooking';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { centralizedCommissionEngine } from '@/config/centralized-commission.config';
import { useRealTimeCommissionConfig } from '@/hooks/useRealTimeCommissionConfig';
import { deriveCoverImageFromProperty } from '@/utils/propertyPreviewCache';

// Re-use the pricing shape from the enhanced booking hook
export type BookingPricing = BookingState['pricing'];

interface BookingSummarySidebarProps {
  property: Property;
  pricing: BookingPricing;
  formData: BookingFormState;
  currentStep: number;
}

const BookingSummarySidebar: React.FC<BookingSummarySidebarProps> = ({
  property,
  pricing,
  formData,
}) => {
	  const { rates, config } = useRealTimeCommissionConfig({ portal: 'student' });

	  const coverImageUrl = deriveCoverImageFromProperty(property);
  const commissionRate = (
    (rates?.platform ?? centralizedCommissionEngine.getCommissionRates().platform) * 100
  ).toFixed(2);
  const fixedFee = config?.fees.fixed ?? centralizedCommissionEngine.getPlatformFees().fixed;

  return (
	      <Card>
	        <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
      </CardHeader>
	        <CardContent className="space-y-4">
	          <div className="w-full overflow-hidden rounded-lg">
	            <div
	              className="aspect-[4/3] w-full bg-cover bg-center"
	              style={{ backgroundImage: `url(${coverImageUrl || '/placeholder.svg'})` }}
	            />
	          </div>

        <div className="space-y-1">
          <p className="font-semibold text-gray-900">{property.title || property.name}</p>
          {property.address && <p className="text-sm text-gray-600">{property.address}</p>}
          {formData.roomType && (
            <p className="text-sm text-gray-700">
              Room type: <span className="font-medium">{formData.roomType}</span>
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Property Rent</span>
            <span>₵{pricing.propertyRent.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Platform Commission ({commissionRate}%)</span>
            <span>₵{pricing.platformCommission.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Service Fee (GHS {fixedFee.toLocaleString()})</span>
            <span>₵{pricing.platformFixedFee.toLocaleString()}</span>
          </div>
          {pricing.agentFee > 0 && (
            <div className="flex justify-between">
              <span>Agent Fee</span>
              <span>₵{pricing.agentFee.toLocaleString()}</span>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-primary">₵{pricing.totalAmount.toLocaleString()}</span>
        </div>

        <div className="text-sm text-gray-600 space-y-1">
          {formData.duration && <p>Duration: {formData.duration}</p>}
          {formData.startDate && <p>Move-in: {formData.startDate.toLocaleDateString()}</p>}
          {formData.endDate && <p>Move-out: {formData.endDate.toLocaleDateString()}</p>}
          {formData.roomType && <p>Room: {formData.roomType}</p>}
          {formData.roommates.length > 0 && (
            <p>Roommates: {formData.roommates.length}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingSummarySidebar;
