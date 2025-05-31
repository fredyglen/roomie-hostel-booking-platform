
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBusinessPaymentFlow } from '@/hooks/payment/useBusinessPaymentFlow';
import { BOOKING_PACKAGES } from '@/utils/paymentSplitting';
import { formatCurrency } from '@/utils/currency';
import { Calendar, MapPin, User, CreditCard, Building } from 'lucide-react';

interface BusinessPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (booking: any) => void;
  propertyId: string;
  studentId: string;
  studentEmail: string;
  propertyOwnerId: string;
  agentId: string;
  startDate: string;
  endDate: string;
  metadata?: any;
}

const BusinessPaymentModal: React.FC<BusinessPaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  propertyId,
  studentId,
  studentEmail,
  propertyOwnerId,
  agentId,
  startDate,
  endDate,
  metadata
}) => {
  const [selectedPackage, setSelectedPackage] = useState<'standard' | 'premium' | 'luxury'>('standard');
  const { initializePayment, processing } = useBusinessPaymentFlow();

  const handlePayment = async () => {
    const result = await initializePayment({
      propertyId,
      studentId,
      propertyOwnerId,
      agentId,
      packageType: selectedPackage,
      startDate,
      endDate,
      studentEmail,
      metadata
    });

    if (result.success && result.paymentData) {
      // Open Paystack payment page in new tab
      window.open(result.paymentData.authorization_url, '_blank');
      onSuccess(result.booking);
    }
  };

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Booking</DialogTitle>
          <DialogDescription>
            Choose your package and complete payment to secure your accommodation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Booking Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{formatDateRange(startDate, endDate)}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{studentEmail}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>Property ID: {propertyId}</span>
              </div>
            </CardContent>
          </Card>

          {/* Package Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Your Package</h3>
            <div className="grid gap-4">
              {Object.entries(BOOKING_PACKAGES).map(([key, pkg]) => (
                <Card
                  key={key}
                  className={`cursor-pointer transition-all ${
                    selectedPackage === key
                      ? 'ring-2 ring-[#9b87f5] border-[#9b87f5]'
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPackage(key as 'standard' | 'premium' | 'luxury')}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold capitalize">{pkg.type} Package</h4>
                          {key === 'premium' && (
                            <Badge variant="secondary">Most Popular</Badge>
                          )}
                          {key === 'luxury' && (
                            <Badge className="bg-yellow-100 text-yellow-800">Premium</Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          <div>Property Rent: {formatCurrency(pkg.propertyRent)}</div>
                          <div>Platform Service: {formatCurrency(pkg.platformFee)}</div>
                          <div>Agent Fee: {formatCurrency(pkg.agentFee)}</div>
                          {pkg.additionalServices && (
                            <div>Additional Services: {formatCurrency(pkg.additionalServices)}</div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#9b87f5]">
                          {formatCurrency(pkg.totalPrice)}
                        </div>
                        <div className="text-sm text-gray-500">Total</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Package Features */}
          <Card>
            <CardHeader>
              <CardTitle>Package Features</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedPackage === 'standard' && (
                <ul className="space-y-2 text-sm">
                  <li>• Basic property booking</li>
                  <li>• Standard customer support</li>
                  <li>• Basic payment protection</li>
                  <li>• Property verification</li>
                </ul>
              )}
              {selectedPackage === 'premium' && (
                <ul className="space-y-2 text-sm">
                  <li>• All Standard features</li>
                  <li>• Priority customer support</li>
                  <li>• Enhanced booking protection</li>
                  <li>• Property maintenance support</li>
                  <li>• Flexible cancellation terms</li>
                </ul>
              )}
              {selectedPackage === 'luxury' && (
                <ul className="space-y-2 text-sm">
                  <li>• All Premium features</li>
                  <li>• 24/7 concierge service</li>
                  <li>• Premium property selection</li>
                  <li>• Personal property manager</li>
                  <li>• Complimentary room upgrades</li>
                  <li>• Express check-in/out</li>
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Payment Button */}
          <div className="flex justify-between items-center pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={processing}
              size="lg"
              className="bg-[#9b87f5] hover:bg-[#8b77f0]"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              {processing ? 'Processing...' : `Pay ${formatCurrency(BOOKING_PACKAGES[selectedPackage].totalPrice)}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessPaymentModal;
