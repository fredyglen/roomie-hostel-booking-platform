
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import Button from '@/components/common/Button';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PaymentStepProps {
  totalAmount: number;
  onPaymentMethodSelect: (method: string) => void;
  termsAgreed: boolean;
  onTermsChange: (agreed: boolean) => void;
  onPaymentProceed: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  totalAmount,
  onPaymentMethodSelect,
  termsAgreed,
  onTermsChange,
  onPaymentProceed
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  
  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
    onPaymentMethodSelect(method);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Payment</h2>
        <p className="text-gray-600 mb-4">Please select your preferred payment method to complete your booking.</p>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="font-medium">Total Amount</span>
          <span className="text-xl font-bold text-roomi-blue">₵{totalAmount.toLocaleString()}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          This includes your accommodation fee, security deposit, and service fee.
        </p>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium">Select Payment Method</h3>
        
        <div 
          className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedMethod === 'mobile_money' ? 'border-roomi-blue bg-blue-50' : ''}`}
          onClick={() => handleMethodSelect('mobile_money')}
        >
          <div className="flex items-start">
            <div className={`w-5 h-5 rounded-full border mr-3 mt-1 flex items-center justify-center ${selectedMethod === 'mobile_money' ? 'border-roomi-blue' : 'border-gray-400'}`}>
              {selectedMethod === 'mobile_money' && (
                <div className="w-3 h-3 rounded-full bg-roomi-blue"></div>
              )}
            </div>
            <div>
              <h4 className="font-medium">Mobile Money</h4>
              <p className="text-sm text-gray-600">Pay using MTN, Vodafone, or AirtelTigo Mobile Money</p>
            </div>
          </div>
        </div>
        
        <div 
          className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedMethod === 'bank_transfer' ? 'border-roomi-blue bg-blue-50' : ''}`}
          onClick={() => handleMethodSelect('bank_transfer')}
        >
          <div className="flex items-start">
            <div className={`w-5 h-5 rounded-full border mr-3 mt-1 flex items-center justify-center ${selectedMethod === 'bank_transfer' ? 'border-roomi-blue' : 'border-gray-400'}`}>
              {selectedMethod === 'bank_transfer' && (
                <div className="w-3 h-3 rounded-full bg-roomi-blue"></div>
              )}
            </div>
            <div>
              <h4 className="font-medium">Bank Transfer</h4>
              <p className="text-sm text-gray-600">Make a direct bank transfer to our account</p>
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="flex items-start space-x-2">
        <Checkbox 
          id="termsAgreed" 
          checked={termsAgreed}
          onCheckedChange={(checked) => onTermsChange(checked as boolean)} 
        />
        <div className="space-y-1">
          <label
            htmlFor="termsAgreed"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the ROOMi Terms and Conditions
          </label>
          <p className="text-sm text-gray-500">
            By checking this box, you agree to our{" "}
            <button
              type="button"
              className="text-roomi-blue hover:underline focus:outline-none"
              onClick={() => setTermsDialogOpen(true)}
            >
              Terms and Conditions
            </button>
            .
          </p>
        </div>
      </div>
      
      <div className="pt-4">
        <Button 
          variant="primary" 
          fullWidth
          disabled={!termsAgreed || !selectedMethod}
          onClick={onPaymentProceed}
        >
          Pay Now
        </Button>
      </div>
      
      {/* Terms and Conditions Dialog */}
      <Dialog open={termsDialogOpen} onOpenChange={setTermsDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Terms and Conditions</DialogTitle>
            <DialogDescription>
              Please read these terms carefully before completing your booking.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 text-sm">
            <p><strong>1. Booking and Payment</strong></p>
            <p>
              By booking accommodation through ROOMi, you agree to pay the full amount specified in the 
              booking summary. A security deposit is required for all bookings and will be refunded 
              at the end of your stay, subject to inspection and deductions for any damages.
            </p>
            
            <p><strong>2. Cancellation Policy</strong></p>
            <p>
              - Cancellations made more than 30 days before check-in: Full refund minus service fee<br />
              - Cancellations made 15-30 days before check-in: 50% refund minus service fee<br />
              - Cancellations made less than 15 days before check-in: No refund
            </p>
            
            <p><strong>3. House Rules</strong></p>
            <p>
              All tenants must abide by the house rules specified by the property owner or manager. 
              Failure to comply with house rules may result in termination of tenancy.
            </p>
            
            <p><strong>4. Verification</strong></p>
            <p>
              ROOMi reserves the right to verify all information provided during the booking 
              process. Providing false information may result in booking cancellation without refund.
            </p>
            
            <p><strong>5. Liability</strong></p>
            <p>
              ROOMi acts as an intermediary between property owners and students. While we vet all 
              listings, we are not liable for any discrepancies between the listed property and actual conditions.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setTermsDialogOpen(false)}>Close</Button>
            <Button 
              variant="primary"
              onClick={() => {
                onTermsChange(true);
                setTermsDialogOpen(false);
              }}
            >
              Accept Terms
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentStep;
