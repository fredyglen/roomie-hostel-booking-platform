
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useBusinessPaymentFlow } from '@/hooks/payment/useBusinessPaymentFlow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download, Home, MessageCircle } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import { ErrorHandler } from '@/utils/ErrorHandler';

interface PaymentVerificationData {
  success: boolean;
  verification?: {
    [key: string]: unknown;
    amount?: number;
    reference?: string;
    channel?: string;
  };
  booking?: {
    [key: string]: unknown;
    id?: string;
    package_type?: string;
    start_date?: string;
    end_date?: string;
  } | null;
  error?: string;
}

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [verificationResult, setVerificationResult] = useState<PaymentVerificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const { verifyAndProcessPayment } = useBusinessPaymentFlow();

  const reference = searchParams.get('reference');
  const trxref = searchParams.get('trxref');

  useEffect(() => {
    const verifyPayment = async () => {
      if (reference || trxref) {
        const paymentRef = reference || trxref;
        ErrorHandler.log('Verifying payment with reference:', paymentRef);
        
        const result = await verifyAndProcessPayment(paymentRef!);
        setVerificationResult(result);
      }
      setLoading(false);
    };

    verifyPayment();
  }, [reference, trxref, verifyAndProcessPayment]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9b87f5] mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (!verificationResult || !verificationResult.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">×</span>
            </div>
            <CardTitle className="text-red-600">Payment Verification Failed</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              We couldn't verify your payment. Please contact support if you believe this is an error.
            </p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link to="/student/properties">Back to Properties</Link>
              </Button>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { verification, booking } = verificationResult;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
            <p className="text-gray-600">Your booking has been confirmed</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Payment Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Payment Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Amount Paid:</span>
                  <span>{verification?.amount !== undefined ? formatCurrency(verification.amount / 100) : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Reference:</span>
                  <span className="font-mono text-xs">{verification?.reference ?? 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="capitalize">{verification?.channel ?? 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Package Type:</span>
                  <Badge variant="secondary" className="capitalize">
                    {booking?.package_type ?? 'N/A'} Package
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                </div>
              </div>
            </div>

            {/* Booking Information */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Booking Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Booking ID:</span>
                  <span className="font-mono text-xs">{booking?.id ?? 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-in Date:</span>
                  <span>{booking?.start_date ? new Date(booking.start_date).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-out Date:</span>
                  <span>{booking?.end_date ? new Date(booking.end_date).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-amber-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">What's Next?</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                  <span>You'll receive a confirmation email with your booking details</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                  <span>The property owner will contact you within 24 hours</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                  <span>Your agent will coordinate move-in details</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full" size="lg">
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" asChild>
                  <Link to="/student/bookings">
                    <Home className="mr-2 h-4 w-4" />
                    My Bookings
                  </Link>
                </Button>
                
                <Button variant="outline">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
              </div>
              
              <Button variant="ghost" asChild className="w-full">
                <Link to="/student/properties">
                  Continue Browsing Properties
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Support Information */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-sm text-gray-600">
              <p>Need help? Contact our support team:</p>
              <p className="font-semibold">support@roomi.com | +233 XX XXX XXXX</p>
              {verification?.reference && (
                <p className="text-xs mt-2">
                  Reference this payment: {verification.reference}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
