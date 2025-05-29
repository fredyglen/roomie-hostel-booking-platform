
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBusinessPaymentFlow } from '@/hooks/payment/useBusinessPaymentFlow';
import { BOOKING_PACKAGES } from '@/utils/paymentSplitting';
import { formatCurrency } from '@/utils/currency';
import { Loader2, Check, Crown, Star } from 'lucide-react';

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
      // Redirect to Paystack payment page
      window.location.href = result.paymentData.authorization_url;
    }
  };

  const getPackageIcon = (type: string) => {
    switch (type) {
      case 'standard': return <Check className="h-5 w-5" />;
      case 'premium': return <Star className="h-5 w-5" />;
      case 'luxury': return <Crown className="h-5 w-5" />;
      default: return <Check className="h-5 w-5" />;
    }
  };

  const getPackageColor = (type: string) => {
    switch (type) {
      case 'standard': return 'border-blue-200 bg-blue-50';
      case 'premium': return 'border-purple-200 bg-purple-50';
      case 'luxury': return 'border-gold-200 bg-amber-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Choose Your Booking Package
          </DialogTitle>
          <p className="text-center text-gray-600">
            Select the service level that best fits your needs
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <RadioGroup 
            value={selectedPackage} 
            onValueChange={(value) => setSelectedPackage(value as 'standard' | 'premium' | 'luxury')}
            className="space-y-4"
          >
            {Object.entries(BOOKING_PACKAGES).map(([key, pkg]) => (
              <Card 
                key={key} 
                className={`cursor-pointer transition-all ${
                  selectedPackage === key ? getPackageColor(key) + ' ring-2 ring-blue-500' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedPackage(key as 'standard' | 'premium' | 'luxury')}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value={key} id={key} />
                      <div className="flex items-center space-x-2">
                        {getPackageIcon(key)}
                        <Label htmlFor={key} className="font-semibold capitalize cursor-pointer">
                          {key} Package
                        </Label>
                        {key === 'premium' && (
                          <Badge variant="secondary">Popular</Badge>
                        )}
                        {key === 'luxury' && (
                          <Badge className="bg-amber-100 text-amber-800">Premium</Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#9b87f5]">
                        {formatCurrency(pkg.totalPrice)}
                      </p>
                      <p className="text-sm text-gray-500">per semester</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Standard Package Features */}
                    {key === 'standard' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Property Rent</span>
                          <span>{formatCurrency(pkg.propertyRent)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Platform Service</span>
                          <span>{formatCurrency(pkg.platformFee)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Agent Consultation</span>
                          <span>{formatCurrency(pkg.agentFee)}</span>
                        </div>
                        <div className="mt-3 space-y-1">
                          <div className="flex items-center text-sm text-green-600">
                            <Check className="h-4 w-4 mr-2" />
                            Basic property listing
                          </div>
                          <div className="flex items-center text-sm text-green-600">
                            <Check className="h-4 w-4 mr-2" />
                            Standard booking process
                          </div>
                          <div className="flex items-center text-sm text-green-600">
                            <Check className="h-4 w-4 mr-2" />
                            Email support
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Premium Package Features */}
                    {key === 'premium' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Property Rent</span>
                          <span>{formatCurrency(pkg.propertyRent)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Premium Platform Service</span>
                          <span>{formatCurrency(pkg.platformFee)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Premium Agent Service</span>
                          <span>{formatCurrency(pkg.agentFee)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Express Guarantee</span>
                          <span>{formatCurrency(pkg.additionalServices || 0)}</span>
                        </div>
                        <div className="mt-3 space-y-1">
                          <div className="flex items-center text-sm text-green-600">
                            <Check className="h-4 w-4 mr-2" />
                            Priority booking support
                          </div>
                          <div className="flex items-center text-sm text-green-600">
                            <Check className="h-4 w-4 mr-2" />
                            Virtual property tours
                          </div>
                          <div className="flex items-center text-sm text-green-600">
                            <Check className="h-4 w-4 mr-2" />
                            24/7 customer support
                          </div>
                          <div className="flex items-center text-sm text-green-600">
                            <Check className="h-4 w-4 mr-2" />
                            Property quality guarantee
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Luxury Package Features */}
                    {key === 'luxury' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Property Rent</span>
                          <span>{formatCurrency(pkg.propertyRent)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Luxury Platform Service</span>
                          <span>{formatCurrency(pkg.platformFee)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Concierge Agent Service</span>
                          <span>{formatCurrency(pkg.agentFee)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Property Upgrades</span>
                          <span>{formatCurrency(pkg.additionalServices || 0)}</span>
                        </div>
                        <div className="mt-3 space-y-1">
                          <div className="flex items-center text-sm text-green-600">
                            <Check className="h-4 w-4 mr-2" />
                            Personal booking concierge
                          </div>
                          <div className="flex items-center text-sm text-green-600">
                            <Check className="h-4 w-4 mr-2" />
                            VIP property access
                          </div>
                          <div className="flex items-center text-sm text-green-600">
                            <Check className="h-4 w-4 mr-2" />
                            Dedicated support manager
                          </div>
                          <div className="flex items-center text-sm text-green-600">
                            <Check className="h-4 w-4 mr-2" />
                            Move-in assistance
                          </div>
                          <div className="flex items-center text-sm text-green-600">
                            <Check className="h-4 w-4 mr-2" />
                            Property upgrade options
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </RadioGroup>

          <div className="bg-gray-50 rounded-lg p-4 mt-6">
            <h3 className="font-semibold mb-2">What's Included in All Packages:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center text-green-600">
                <Check className="h-4 w-4 mr-2" />
                Secure payment processing
              </div>
              <div className="flex items-center text-green-600">
                <Check className="h-4 w-4 mr-2" />
                Verified property listings
              </div>
              <div className="flex items-center text-green-600">
                <Check className="h-4 w-4 mr-2" />
                Legal document templates
              </div>
              <div className="flex items-center text-green-600">
                <Check className="h-4 w-4 mr-2" />
                Booking confirmation
              </div>
            </div>
          </div>

          <Button 
            onClick={handlePayment}
            disabled={processing}
            className="w-full bg-[#9b87f5] hover:bg-[#8b77f0] text-white py-3 text-lg"
            size="lg"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ${formatCurrency(BOOKING_PACKAGES[selectedPackage].totalPrice)} - ${selectedPackage.charAt(0).toUpperCase() + selectedPackage.slice(1)} Package`
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Secure payment powered by Paystack. Your payment information is safe and encrypted.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessPaymentModal;
