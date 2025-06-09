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
import { ModernPaystackPayment } from './ModernPaystackPayment';
import { BOOKING_PACKAGES } from '@/utils/paymentSplitting';
import { calculatePaymentBreakdown } from '@/utils/paymentCalculations';
import { formatCurrency } from '@/utils/currency';
import { Calendar, MapPin, User, Info } from 'lucide-react';
import { ErrorHandler } from '@/utils/ErrorHandler';
import { ConfirmedBookingData, ModernPaymentSuccessResult } from '@/types/booking';

// Define interface for confirmed booking data passed to onSuccess
interface ConfirmedBookingData { // TODO: Refine this interface based on actual booking object structure
  id?: string; // Assuming booking object has an id
  package_type?: string; // Assuming booking object has package_type
  start_date?: string; // Assuming booking object has start_date
  end_date?: string; // Assuming booking object has end_date
  [key: string]: unknown; // Allow other properties
}

interface BusinessPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (booking: ConfirmedBookingData) => void;
  propertyId: string;
  studentId: string;
  studentEmail: string;
  propertyOwnerId: string;
  agentId: string;
  startDate: string;
  endDate: string;
  metadata?: Record<string, unknown>;
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
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handlePaymentSuccess = (result: ModernPaymentSuccessResult) => {
    ErrorHandler.log('Payment successful:', result);
    
    // Convert ModernPaymentSuccessResult to ConfirmedBookingData
    const confirmedBooking: ConfirmedBookingData = {
      id: result.transaction?.reference || Math.random().toString(),
      booking_reference: result.reference,
      payment_reference: result.reference,
      total_amount: result.amount || 0,
      status: 'confirmed',
      package_type: selectedPackage,
      start_date: startDate,
      end_date: endDate,
      ...result
    };
    
    onSuccess(confirmedBooking);
    onClose();
  };

  const handlePaymentError = (error: string) => {
    ErrorHandler.handle('Payment error:', error);
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

  const selectedPackageData = BOOKING_PACKAGES[selectedPackage];
  const breakdown = getPackageBreakdown(selectedPackage);

  if (showPaymentForm) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>
              {selectedPackageData.type} Package - {formatCurrency(selectedPackageData.totalPrice)}
            </DialogDescription>
          </DialogHeader>

          <ModernPaystackPayment
            amount={selectedPackageData.totalPrice}
            email={studentEmail}
            metadata={{
              booking_source: 'property_listing',
              property_id: propertyId,
              student_id: studentId,
              property_owner_id: propertyOwnerId,
              agent_id: agentId,
              package_type: selectedPackage,
              start_date: startDate,
              end_date: endDate,
              ...metadata
            }}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            title={`${selectedPackageData.type} Package Payment`}
            description={`Complete your ${selectedPackageData.type.toLowerCase()} booking`}
          />

          <Button 
            variant="outline" 
            onClick={() => setShowPaymentForm(false)}
            className="w-full mt-4"
          >
            Back to Package Selection
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

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
                <Calendar className="h-5 w-5" />
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

          {/* Proceed to Payment Button */}
          <Button 
            onClick={() => setShowPaymentForm(true)}
            className="w-full bg-[#9b87f5] hover:bg-[#8b77f0]"
            size="lg"
          >
            Proceed to Payment - {formatCurrency(selectedPackageData.totalPrice)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessPaymentModal;
