
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
import { calculatePaymentBreakdown } from '@/utils/paymentCalculations';
import { formatCurrency } from '@/utils/currency';
import { Calendar, MapPin, User, CreditCard, Building, Info } from 'lucide-react';

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

  const getPackageBreakdown = (packageType: string) => {
    const pkg = BOOKING_PACKAGES[packageType];
    return calculatePaymentBreakdown(pkg.totalPrice);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
              {Object.entries(BOOKING_PACKAGES).map(([key, pkg]) => {
                const breakdown = getPackageBreakdown(key);
                return (
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
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold capitalize">{pkg.type} Package</h4>
                            {key === 'premium' && (
                              <Badge variant="secondary">Most Popular</Badge>
                            )}
                            {key === 'luxury' && (
                              <Badge className="bg-yellow-100 text-yellow-800">Premium</Badge>
                            )}
                          </div>
                          
                          {/* Payment Breakdown */}
                          <div className="bg-gray-50 p-3 rounded-lg text-sm">
                            <div className="font-medium text-gray-700 mb-2">Payment Breakdown:</div>
                            <div className="space-y-1 text-gray-600">
                              <div className="flex justify-between">
                                <span>Property Owner (98%):</span>
                                <span>{formatCurrency(breakdown.propertyOwnerAmount)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Agent Commission (3.7%):</span>
                                <span>{formatCurrency(breakdown.agentCommission)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Platform Fee (4.2%):</span>
                                <span>{formatCurrency(breakdown.platformFee)}</span>
                              </div>
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>Paystack Fee (absorbed):</span>
                                <span>{formatCurrency(breakdown.paystackFee)}</span>
                              </div>
                            </div>
                          </div>

                          {pkg.additionalServices && (
                            <div className="text-sm text-gray-600">
                              <div>Additional Services: {formatCurrency(pkg.additionalServices)}</div>
                            </div>
                          )}
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
                );
              })}
            </div>
          </div>

          {/* Package Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="h-5 w-5" />
                <span>Package Features</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedPackage === 'standard' && (
                <ul className="space-y-2 text-sm">
                  <li>• Basic property booking and verification</li>
                  <li>• Standard customer support (business hours)</li>
                  <li>• Basic payment protection and escrow</li>
                  <li>• Property quality verification</li>
                  <li>• Email booking confirmations</li>
                </ul>
              )}
              {selectedPackage === 'premium' && (
                <ul className="space-y-2 text-sm">
                  <li>• All Standard features included</li>
                  <li>• Priority customer support (extended hours)</li>
                  <li>• Enhanced booking protection and insurance</li>
                  <li>• Property maintenance coordination</li>
                  <li>• Flexible cancellation terms</li>
                  <li>• SMS + Email notifications</li>
                </ul>
              )}
              {selectedPackage === 'luxury' && (
                <ul className="space-y-2 text-sm">
                  <li>• All Premium features included</li>
                  <li>• 24/7 concierge and support service</li>
                  <li>• Premium property selection and upgrades</li>
                  <li>• Personal property manager assignment</li>
                  <li>• Complimentary room inspections</li>
                  <li>• Express check-in/out services</li>
                  <li>• Priority booking for future semesters</li>
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Transparency Notice */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <div className="font-medium mb-1">Transparent Pricing</div>
                  <div>Your payment is automatically distributed: Property owner receives 98% of the amount, agent gets their commission, and our platform fee covers payment processing, customer support, and platform maintenance.</div>
                </div>
              </div>
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
