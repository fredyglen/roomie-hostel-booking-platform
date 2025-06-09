
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ModernPaystackPayment } from './ModernPaystackPayment';
import { formatCurrency } from '@/utils/currency';
import { Calculator, Calendar, MapPin, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ModernPaymentSuccessResult, ConfirmedBookingData } from '@/types/booking';

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
  metadata = {}
}) => {
  const { toast } = useToast();
  const [paymentStage, setPaymentStage] = useState<'selection' | 'payment'>('selection');
  const [selectedPackage, setSelectedPackage] = useState<string>('');

  const packages = [
    {
      id: 'semester',
      name: 'Semester Package',
      price: 1200,
      duration: '4 months',
      description: 'Perfect for one academic semester',
      features: ['4 months accommodation', 'Utilities included', 'Study area access']
    },
    {
      id: 'academic_year',
      name: 'Academic Year Package', 
      price: 2000,
      duration: '8 months',
      description: 'Complete academic year coverage',
      features: ['8 months accommodation', 'Utilities included', 'Priority support', '10% discount']
    }
  ];

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
    setPaymentStage('payment');
  };

  const handlePaymentSuccess = (result: ModernPaymentSuccessResult) => {
    // Convert ModernPaymentSuccessResult to ConfirmedBookingData
    const confirmedBooking: ConfirmedBookingData = {
      id: result.transaction.reference,
      booking_reference: `BK-${Date.now()}`,
      payment_reference: result.reference,
      total_amount: result.verification?.amount || result.amount || 0,
      status: 'confirmed',
      package_type: selectedPackage,
      start_date: startDate,
      end_date: endDate
    };
    
    onSuccess(confirmedBooking);
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive"
    });
    setPaymentStage('selection');
  };

  const selectedPkg = packages.find(pkg => pkg.id === selectedPackage);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Complete Your Booking</DialogTitle>
        </DialogHeader>

        {paymentStage === 'selection' && (
          <div className="space-y-6">
            <div className="grid gap-4">
              {packages.map((pkg) => (
                <Card key={pkg.id} className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handlePackageSelect(pkg.id)}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{pkg.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{pkg.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{formatCurrency(pkg.price)}</div>
                        <Badge variant="secondary">{pkg.duration}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-1">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="text-sm flex items-center">
                          <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
            </div>
          </div>
        )}

        {paymentStage === 'payment' && selectedPkg && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Package:</span>
                  <span className="font-medium">{selectedPkg.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">{selectedPkg.duration}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total Amount:</span>
                  <span>{formatCurrency(selectedPkg.price)}</span>
                </div>
              </CardContent>
            </Card>

            <ModernPaystackPayment
              amount={selectedPkg.price}
              email={studentEmail}
              firstName="Student"
              lastName="User"
              phone="0200000000"
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              title={`Payment for ${selectedPkg.name}`}
              description={`Secure payment for accommodation booking`}
            />

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setPaymentStage('selection')}>
                Back to Packages
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BusinessPaymentModal;
