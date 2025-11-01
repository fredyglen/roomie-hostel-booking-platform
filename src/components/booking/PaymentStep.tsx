import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import Button from '@/components/common/Button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ModernPaystackPayment } from '@/components/payment/ModernPaystackPayment';
import { useAuth } from '@/context/EnhancedAuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { verifyPaystackPayment } from '@/utils/paystack-verification';
import useBookingAccess from '@/hooks/useBookingAccess';
import type { ModernPaymentSuccessResult } from '@/types/booking';
import { centralizedCommissionEngine } from '@/config/centralized-commission.config';
import { formatCurrency } from '@/utils/currency';

import { ArrowLeft, CreditCard as CreditCardIcon, Smartphone as SmartphoneIcon, Lock } from 'lucide-react';


// Derive the commission result type from the engine's calculateCommissions return type
type CommissionCalculationResult = ReturnType<typeof centralizedCommissionEngine.calculateCommissions>;


interface PaymentStepProps {
  totalAmount: number;
  onPaymentMethodSelect: (method: string) => void;
  termsAgreed: boolean;
  onTermsChange: (agreed: boolean) => void;
  onPaymentProceed: () => void;
  onPrevious?: () => void;
  // Optional metadata to be passed to Paystack
  /** Optional detailed fee breakdown from centralized engine */
  feeBreakdown?: CommissionCalculationResult;

  paystackMetadata?: Record<string, unknown>;
  // New: callback when payment has been verified server-side
  onPaymentVerified?: (verification: { reference: string; amount: number; channel?: string; id?: number; metadata?: Record<string, unknown> }) => void;
}

// Type for initialize-payment Edge Function response
type InitPaymentResponse = {
  status: boolean;
  message?: string;
  data?: {
    reference?: string;
    access_code?: string;
    authorization_url?: string;
  };
};

// Safe extractor for unknown errors
const extractErrorMessage = (err: unknown): string | undefined => {
  if (typeof err === 'string') return err;
  if (err && typeof err === 'object' && 'message' in err) {
    const msg = (err as { message?: unknown }).message;
    return typeof msg === 'string' ? msg : undefined;
  }
  return undefined;
};


const PaymentStep: React.FC<PaymentStepProps> = ({
  totalAmount,
  onPaymentMethodSelect,
  termsAgreed,
  onTermsChange,
  onPaymentProceed,
  onPaymentVerified,
  onPrevious,
  paystackMetadata,
  feeBreakdown
}) => {
  const { user } = useAuth();
  const { isVerified } = useBookingAccess();

  const { toast } = useToast();
  const [initializingPayment, setInitializingPayment] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);


  // Prefer explicit prop; fall back to metadata provided by parent
  const commission: CommissionCalculationResult | undefined =
    (typeof feeBreakdown !== 'undefined' && feeBreakdown) ||
    ((paystackMetadata as any)?.commission_breakdown as CommissionCalculationResult | undefined);

  const [selectedMethod, setSelectedMethod] = useState<string>('card');
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Prefer dynamic property cover image from metadata; fallback to placeholder
  const coverImageUrl = (paystackMetadata as any)?.propertyCoverImage ||
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop';

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
    onPaymentMethodSelect(method);
  };

  const handlePaymentSuccess = async (result: ModernPaymentSuccessResult) => {
    try {
      const reference = result?.reference;
      if (!reference) {
        toast({ title: 'Payment Error', description: 'Missing payment reference.', variant: 'destructive' });
        return;
      }

      const verification = await verifyPaystackPayment(reference);
      if (!verification.success) {
        toast({ title: 'Verification Failed', description: verification.message || 'Could not verify your payment.', variant: 'destructive' });
        setShowPaymentModal(false);
        return;
      }

      toast({ title: 'Payment Successful!', description: 'Your payment has been verified.' });
      setShowPaymentModal(false);

      if (typeof onPaymentVerified === 'function') {
        onPaymentVerified({
          reference,
          amount: totalAmount,
          channel: verification.data?.channel,
          id: verification.data?.id,
          metadata: verification.data?.metadata,
        });
      } else {
        onPaymentProceed();
      }
    } catch (e) {
      toast({
        title: 'Payment Handling Error',
        description: e instanceof Error ? e.message : 'Something went wrong after payment.',
        variant: 'destructive',
      });
    }
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
    setShowPaymentModal(false);
  };

  const handleProceedToPayment = async () => {
    if (!termsAgreed || !selectedMethod) {
      toast({
        title: "Missing Information",
        description: "Please select a payment method and agree to the terms.",
        variant: "destructive",
      });
      return;
    }

    if (totalAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Payment amount must be greater than zero.',
        variant: 'destructive',
      });
      return;
    }

    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to proceed with payment.',
        variant: 'destructive',
      });
      return;
    }

    // Temporarily allow skipping verification in development unless explicitly required via env flag
    const verificationRequired = import.meta.env.PROD && import.meta.env.VITE_REQUIRE_VERIFICATION !== 'false';
    if (verificationRequired && !isVerified) {
      toast({
        title: 'Student Verification Required',
        description: 'Please complete student verification before proceeding to payment.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setInitializingPayment(true);
      const { data, error } = await supabase.functions.invoke<InitPaymentResponse>('initialize-payment', {
        body: {
          email: user?.email || '',
          amount: totalAmount,
          currency: 'GHS',
          metadata: paystackMetadata,
          channels: ['card', 'mobile_money', 'bank', 'ussd'],
          // Ensure Paystack redirects back to our frontend after payment
          callback_url: `${window.location.origin}/payment-success`,
        },
      });

      if (error || !data?.status) {
        toast({
          title: 'Payment Initialization Failed',
          description: extractErrorMessage(error) || data?.message || 'Could not start payment. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      const ref = data?.data?.reference;
      if (!ref) {
        toast({
          title: 'Payment Initialization Error',
          description: 'Missing payment reference from provider. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      setPaymentReference(ref);
      setShowPaymentModal(true);
    } catch (e) {
      toast({
        title: 'Payment Initialization Error',
        description: e instanceof Error ? e.message : 'Unexpected error starting payment.',
        variant: 'destructive',
      });
    } finally {
      setInitializingPayment(false);
    }
  };

  return (
    <div className="space-y-6 pb-32 md:pb-0">
      {/* Sticky Mobile Header */}
      <header className="md:hidden sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4">
        <div className="flex h-14 items-center">
          <button
            type="button"
            onClick={onPrevious}
            className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-[#111318] flex-1 text-center pr-10">Confirm & Pay</h1>
        </div>
      </header>

      {/* Main Content (Mobile) */}
      <main className="md:hidden flex-1">
        {/* Total Amount Card */}
        <div className="px-4 pt-4">
          <div className="rounded-xl overflow-hidden bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
            <div
              className="w-full aspect-[2/1] bg-cover bg-center rounded-t-xl"
              style={{ backgroundImage: `url(${coverImageUrl})` }}
            />
            <div className="p-4">
              <p className="text-sm font-normal text-[#616e89]">Total Amount</p>
              <p className="text-3xl font-bold tracking-tight text-[#111318]">{formatCurrency(totalAmount)}</p>
              <p className="text-base font-normal text-[#616e89] mt-1">{(paystackMetadata as any)?.propertyTitle || (paystackMetadata as any)?.listing_title || 'For your selected accommodation'}</p>
            </div>
          </div>
        </div>

        {/* Price Details */}
        <h3 className="text-[#111318] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Price Details</h3>
        <div className="px-4">
          <div className="rounded-lg bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
            {commission ? (
              <>
                <div className="flex justify-between py-2">
                  <p className="text-[#616e89] text-sm">Base Rent</p>
                  <p className="text-[#111318] text-sm">{formatCurrency(commission.baseAmount)}</p>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-100">
                  <p className="text-[#616e89] text-sm">Platform Commission</p>
                  <p className="text-[#111318] text-sm">{formatCurrency(commission.platformCommission)}</p>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-100">
                  <p className="text-[#616e89] text-sm">Platform Fixed Fee</p>
                  <p className="text-[#111318] text-sm">{formatCurrency(commission.platformFixedFee)}</p>
                </div>
                {commission.agentCommission > 0 && (
                  <div className="flex justify-between py-2 border-t border-gray-100">
                    <p className="text-[#616e89] text-sm">Agent Commission</p>
                    <p className="text-[#111318] text-sm">{formatCurrency(commission.agentCommission)}</p>
                  </div>
                )}
                <div className="flex justify-between py-2 border-t border-gray-100">
                  <p className="text-[#616e89] text-sm">Paystack Fee</p>
                  <p className="text-[#111318] text-sm">{formatCurrency(commission.paystackFee)}</p>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-100">
                  <p className="text-[#616e89] text-sm">VAT</p>
                  <p className="text-[#111318] text-sm">{formatCurrency(commission.vatAmount)}</p>
                </div>
                <div className="flex justify-between pt-3 mt-2 border-t-2 border-gray-200">
                  <p className="text-[#111318] text-base font-bold">Total</p>
                  <p className="text-[#111318] text-base font-bold">{formatCurrency(commission.totalAmount)}</p>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">Loading price details...</p>
            )}
          </div>
        </div>

        {/* Payment Method */}
        <h3 className="text-[#111318] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-6">How would you like to pay?</h3>
        <div className="px-4 space-y-3">
          <label className={`flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition-all ${selectedMethod === 'card' ? 'border-primary bg-primary/10' : 'border-gray-200 bg-white'}`}>
            <input
              type="radio"
              name="payment-method"
              className="h-5 w-5 border-gray-300 text-primary focus:ring-primary"
              checked={selectedMethod === 'card'}
              onChange={() => handleMethodSelect('card')}
            />
            <div className="flex-1">
              <p className="font-bold text-gray-800">Card</p>
              <p className="text-sm text-gray-600">Pay with your debit or credit card</p>
            </div>
            <CreditCardIcon className="h-6 w-6 text-gray-800" />
          </label>

          <label className={`flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition-all ${selectedMethod === 'mobile_money' ? 'border-primary bg-primary/10' : 'border-gray-200 bg-white'}`}>
            <input
              type="radio"
              name="payment-method"
              className="h-5 w-5 border-gray-300 text-primary focus:ring-primary"
              checked={selectedMethod === 'mobile_money'}
              onChange={() => handleMethodSelect('mobile_money')}
            />
            <div className="flex-1">

              <p className="font-bold text-gray-800">Mobile Money</p>
              <p className="text-sm text-gray-600">Pay with MTN, Vodafone, AirtelTigo</p>
            </div>
            <SmartphoneIcon className="h-6 w-6 text-gray-800" />
          </label>
        </div>

        {/* Terms & Conditions (Mobile) */}
        <div className="px-4 pt-4">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="termsAgreed"
              checked={termsAgreed}
              onCheckedChange={(checked: boolean | "indeterminate") => onTermsChange(Boolean(checked))}
            />
            <div className="space-y-1">
              <label htmlFor="termsAgreed" className="text-sm font-medium leading-none">
                I agree to the ROOMie Terms and Conditions
              </label>
              <p className="text-sm text-gray-500">
                By checking this box, you agree to our{' '}
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
        </div>

        {/* Secured by */}
        <div className="flex items-center justify-center gap-2 pt-4 px-4">
          <p className="text-xs text-gray-500">Secured by</p>
          <span className="text-xs font-medium text-[#111318]">Paystack</span>
        </div>
      </main>
      {/* Mobile Fixed Footer */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4">
        <Button
          onClick={handleProceedToPayment}
          disabled={!termsAgreed || !selectedMethod || initializingPayment}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-bold text-white"
        >
          <Lock className="h-5 w-5" />
          Proceed to Pay {formatCurrency(totalAmount)}
        </Button>
      </footer>


      {/* Desktop Content */}
      <div className="hidden md:block space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Confirm &amp; Pay</h2>
          <p className="text-gray-600">Please review the details and choose a payment method.</p>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Amount</span>
            <span className="text-2xl font-bold text-primary">{formatCurrency(totalAmount)}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{(paystackMetadata as any)?.propertyTitle || (paystackMetadata as any)?.listing_title || 'For your selected accommodation'}</p>
        </div>

        <div>
          <h3 className="text-lg font-bold leading-tight tracking-[-0.015em]">Price Details</h3>
          <div className="rounded-lg bg-white">
            {commission ? (
              <>
                <div className="flex justify-between py-2">
                  <p className="text-gray-600 text-sm">Base Rent</p>
                  <p className="text-gray-900 text-sm">{formatCurrency(commission.baseAmount)}</p>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-100">
                  <p className="text-gray-600 text-sm">Platform Commission</p>
                  <p className="text-gray-900 text-sm">{formatCurrency(commission.platformCommission)}</p>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-100">
                  <p className="text-gray-600 text-sm">Platform Fixed Fee</p>
                  <p className="text-gray-900 text-sm">{formatCurrency(commission.platformFixedFee)}</p>
                </div>
                {commission.agentCommission > 0 && (
                  <div className="flex justify-between py-2 border-t border-gray-100">
                    <p className="text-gray-600 text-sm">Agent Commission</p>
                    <p className="text-gray-900 text-sm">{formatCurrency(commission.agentCommission)}</p>
                  </div>
                )}
                <div className="flex justify-between py-2 border-t border-gray-100">
                  <p className="text-gray-600 text-sm">Paystack Fee</p>
                  <p className="text-gray-900 text-sm">{formatCurrency(commission.paystackFee)}</p>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-100">
                  <p className="text-gray-600 text-sm">VAT</p>
                  <p className="text-gray-900 text-sm">{formatCurrency(commission.vatAmount)}</p>
                </div>
                <div className="flex justify-between pt-3 mt-2 border-t-2 border-gray-200">
                  <p className="text-gray-900 text-base font-bold">Total</p>
                  <p className="text-gray-900 text-base font-bold">{formatCurrency(commission.totalAmount)}</p>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">Loading price details...</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold leading-tight tracking-[-0.015em]">How would you like to pay?</h3>
          <div className="space-y-3">
            <label className={`flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition-all ${selectedMethod === 'card' ? 'border-primary bg-primary/10' : 'border-gray-200 bg-white'}`}>
              <input
                type="radio"
                name="payment-method-desktop"
                className="h-5 w-5 border-gray-300 text-primary focus:ring-primary"
                checked={selectedMethod === 'card'}
                onChange={() => handleMethodSelect('card')}
              />
              <div className="flex-1">
                <p className="font-bold text-gray-800">Card</p>
                <p className="text-sm text-gray-600">Pay with your debit or credit card</p>
              </div>
              <CreditCardIcon className="h-6 w-6 text-gray-800" />
            </label>

            <label className={`flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition-all ${selectedMethod === 'mobile_money' ? 'border-primary bg-primary/10' : 'border-gray-200 bg-white'}`}>
              <input
                type="radio"
                name="payment-method-desktop"
                className="h-5 w-5 border-gray-300 text-primary focus:ring-primary"
                checked={selectedMethod === 'mobile_money'}
                onChange={() => handleMethodSelect('mobile_money')}
              />
              <div className="flex-1">
                <p className="font-bold text-gray-800">Mobile Money</p>
                <p className="text-sm text-gray-600">Pay with MTN, Vodafone, AirtelTigo</p>
              </div>
              <SmartphoneIcon className="h-6 w-6 text-gray-800" />
            </label>
          </div>
        </div>

        <div>
          <div className="flex items-start space-x-2">
            <Checkbox
              id="termsAgreedDesktop"
              checked={termsAgreed}
              onCheckedChange={(checked: boolean | "indeterminate") => onTermsChange(Boolean(checked))}
            />
            <div className="space-y-1">
              <label htmlFor="termsAgreedDesktop" className="text-sm font-medium leading-none">
                I agree to the ROOMie Terms and Conditions
              </label>
              <p className="text-sm text-gray-500">
                By checking this box, you agree to our{' '}
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
        </div>
      </div>


      <div className="hidden md:flex gap-4 pt-4">
        {onPrevious && (
          <Button
            variant="outline"
            onClick={onPrevious}
            className="flex-1"
          >
            Previous
          </Button>
        )}
        <Button
          variant="primary"
          className="flex-1"
          disabled={!termsAgreed || !selectedMethod || initializingPayment}
          onClick={handleProceedToPayment}
        >
          {initializingPayment ? 'Starting payment...' : 'Proceed to Payment'}
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
              By booking accommodation through ROOMie, you agree to pay the full amount specified in the
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
              ROOMie reserves the right to verify all information provided during the booking
              process. Providing false information may result in booking cancellation without refund.
            </p>

            <p><strong>5. Liability</strong></p>
            <p>
              ROOMie acts as an intermediary between property owners and students. While we vet all
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

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>
              Secure payment processing via Paystack
            </DialogDescription>
          </DialogHeader>

          <ModernPaystackPayment
            amount={totalAmount}
            email={user?.email || ''}
            firstName={user?.user_metadata?.first_name || ''}
            lastName={user?.user_metadata?.last_name || ''}
            phone={user?.user_metadata?.phone || ''}
            reference={paymentReference || undefined}
            metadata={paystackMetadata}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            title="ROOMie Accommodation Payment"
            description="Complete your booking payment"
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPaymentModal(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentStep;
