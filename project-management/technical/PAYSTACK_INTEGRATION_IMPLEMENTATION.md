# ROOMi Paystack Integration Implementation Plan

**Date**: December 17, 2024  
**Priority**: CRITICAL - Blocking Production Deployment  
**Estimated Implementation Time**: 6-8 hours  

---

## 🎯 **IMPLEMENTATION OVERVIEW**

This document provides the exact code changes needed to connect the existing `ModernPaystackPayment` component to the ROOMi booking flow completion. The implementation will replace the current payment simulation with real Paystack integration.

### **Current State Analysis**
- ✅ **ModernPaystackPayment Component**: Fully implemented and working
- ✅ **Paystack Integration Utilities**: Complete with error handling
- ✅ **Database Schema**: Ready with payment fields
- ❌ **Booking Flow Integration**: Currently simulated (lines 136-154 in useBookingViewModel.tsx)

---

## 🔧 **STEP-BY-STEP IMPLEMENTATION**

### **Step 1: Modify useBookingViewModel.tsx**

**File**: `src/hooks/booking/useBookingViewModel.tsx`  
**Lines to Replace**: 136-154 (processPayment function)

#### **Current Code (TO REMOVE)**
```typescript
const processPayment = () => {
  // Simulate payment processing
  toast({
    title: "Processing payment...",
  });
  
  setTimeout(() => {
    toast({
      title: "Payment successful!",
      description: "Booking confirmed."
    });
    
    // Clear booking form data from localStorage
    localStorage.removeItem(`booking_form_${id}`);
    
    // Redirect to dashboard
    navigate('/student/dashboard');
  }, 2000);
};
```

#### **New Code (TO IMPLEMENT)**
```typescript
import { ModernPaystackPayment } from '@/components/payment/ModernPaystackPayment';
import { BookingQueries } from '@/services/database/standardizedQueries';
import { useAuth } from '@/context/EnhancedAuthContext';
import { useState } from 'react';

// Add these state variables at the top of the hook
const [showPaymentModal, setShowPaymentModal] = useState(false);
const [isCreatingBooking, setIsCreatingBooking] = useState(false);
const [bookingId, setBookingId] = useState<string | null>(null);

// Business model configuration
const BUSINESS_MODEL = {
  platformCommissionRate: 0.05,  // 5%
  platformFixedFee: 100,         // 100 GHS
  paystackFeeRate: 0.0195        // 1.95%
};

const calculatePaymentDistribution = (basePrice: number) => {
  const platformCommission = basePrice * BUSINESS_MODEL.platformCommissionRate;
  const platformFee = BUSINESS_MODEL.platformFixedFee;
  const subtotal = basePrice + platformCommission + platformFee;
  const paystackFee = subtotal * BUSINESS_MODEL.paystackFeeRate;
  const totalAmount = subtotal + paystackFee;
  
  return {
    basePrice,
    platformCommission,
    platformFee,
    paystackFee,
    totalAmount,
    propertyOwnerAmount: basePrice
  };
};

const processPayment = async () => {
  try {
    setIsCreatingBooking(true);
    
    // Calculate payment distribution
    const distribution = calculatePaymentDistribution(totalPrice);
    
    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Create booking record first
    const bookingData = {
      student_id: user.id,
      property_id: id,
      property_owner_id: property?.owner_id || property?.user_id,
      room_id: property?.rooms?.[0]?.id, // Will be updated when room selection is integrated
      bed_id: property?.rooms?.[0]?.beds?.[0]?.id, // Will be updated when bed selection is integrated
      check_in_date: formData.checkInDate,
      check_out_date: new Date(new Date(formData.checkInDate).getTime() + (parseInt(formData.duration) * 30 * 24 * 60 * 60 * 1000)).toISOString(),
      total_amount: distribution.totalAmount,
      base_property_price: distribution.basePrice,
      platform_commission: distribution.platformCommission,
      platform_fee: distribution.platformFee,
      student_name: formData.fullName,
      student_email: formData.email,
      student_phone: formData.phone,
      emergency_contact_name: formData.emergencyContact,
      emergency_contact_phone: formData.emergencyPhone,
      special_requests: formData.roomType ? `Room type: ${formData.roomType}` : null
    };
    
    const booking = await BookingQueries.createBooking(bookingData);
    setBookingId(booking.id);
    setIsCreatingBooking(false);
    
    // Show payment modal
    setShowPaymentModal(true);
    
  } catch (error) {
    setIsCreatingBooking(false);
    toast({
      title: "Booking Creation Failed",
      description: error.message || "Failed to create booking. Please try again.",
      variant: "destructive"
    });
  }
};

const handlePaymentSuccess = async (paymentResult) => {
  try {
    // Update booking with payment information
    const { error } = await supabase
      .from('bookings')
      .update({
        payment_status: 'completed',
        status: 'confirmed',
        payment_reference: paymentResult.reference,
        paystack_reference: paymentResult.transaction.reference,
        payment_method: paymentResult.verification?.channel || 'card',
        paid_at: new Date().toISOString()
      })
      .eq('id', bookingId);
    
    if (error) throw error;
    
    // Clear form data
    localStorage.removeItem(`booking_form_${id}`);
    
    // Close payment modal
    setShowPaymentModal(false);
    
    // Show success message
    toast({
      title: "Payment Successful!",
      description: "Your booking has been confirmed.",
    });
    
    // Navigate to booking confirmation page
    navigate('/student/booking-confirmation', { 
      state: { 
        bookingId: bookingId,
        paymentReference: paymentResult.reference 
      } 
    });
    
  } catch (error) {
    toast({
      title: "Payment Processing Error",
      description: "Payment successful but booking update failed. Please contact support.",
      variant: "destructive"
    });
  }
};

const handlePaymentError = (error: string) => {
  toast({
    title: "Payment Failed",
    description: error,
    variant: "destructive"
  });
  
  // Keep payment modal open for retry
  // User can try again or close modal
};

const handlePaymentModalClose = () => {
  setShowPaymentModal(false);
  // Booking remains in pending state for user to retry later
};
```

#### **Update Return Object**
Add these new values to the return object:
```typescript
return {
  // ... existing returns
  showPaymentModal,
  setShowPaymentModal,
  isCreatingBooking,
  handlePaymentSuccess,
  handlePaymentError,
  handlePaymentModalClose,
  paymentDistribution: calculatePaymentDistribution(totalPrice)
};
```

---

### **Step 2: Update Booking Flow Component**

**File**: `src/components/booking/BookingStepsContainer.tsx` or wherever the payment step is rendered

#### **Add Payment Modal Integration**
```typescript
import { ModernPaystackPayment } from '@/components/payment/ModernPaystackPayment';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// In the component where payment step is rendered, add:
{showPaymentModal && (
  <Dialog open={showPaymentModal} onOpenChange={handlePaymentModalClose}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Complete Payment</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        {/* Payment Summary */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <h4 className="font-medium">Payment Summary</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Property Rent:</span>
              <span>GH₵{paymentDistribution.basePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform Commission (5%):</span>
              <span>GH₵{paymentDistribution.platformCommission.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform Fee:</span>
              <span>GH₵{paymentDistribution.platformFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Processing Fee:</span>
              <span>GH₵{paymentDistribution.paystackFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-1">
              <span>Total Amount:</span>
              <span>GH₵{paymentDistribution.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {/* Payment Component */}
        <ModernPaystackPayment
          amount={paymentDistribution.totalAmount}
          email={formData.email}
          firstName={formData.fullName.split(' ')[0]}
          lastName={formData.fullName.split(' ').slice(1).join(' ')}
          phone={formData.phone}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          title="Pay for Accommodation"
          description="Secure payment via Paystack"
        />
      </div>
    </DialogContent>
  </Dialog>
)}
```

---

### **Step 3: Create Booking Confirmation Page**

**File**: `src/pages/student/BookingConfirmation.tsx` (NEW FILE)

```typescript
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface BookingConfirmationProps {}

const BookingConfirmation: React.FC<BookingConfirmationProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { bookingId, paymentReference } = location.state || {};
  
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        navigate('/student/dashboard');
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            properties (title, address, images),
            rooms (room_number, beds_count)
          `)
          .eq('id', bookingId)
          .single();
        
        if (error) throw error;
        setBooking(data);
      } catch (error) {
        console.error('Error fetching booking:', error);
        navigate('/student/dashboard');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [bookingId, navigate]);
  
  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  
  if (!booking) {
    return <div>Booking not found</div>;
  }
  
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Booking Confirmed!</CardTitle>
          <p className="text-gray-600">Your accommodation has been successfully booked</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Booking Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Booking Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Booking Reference:</span>
                <p>{booking.booking_reference}</p>
              </div>
              <div>
                <span className="font-medium">Payment Reference:</span>
                <p>{paymentReference}</p>
              </div>
              <div>
                <span className="font-medium">Property:</span>
                <p>{booking.properties?.title}</p>
              </div>
              <div>
                <span className="font-medium">Total Amount:</span>
                <p>GH₵{booking.total_amount}</p>
              </div>
              <div>
                <span className="font-medium">Check-in Date:</span>
                <p>{new Date(booking.check_in_date).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="font-medium">Check-out Date:</span>
                <p>{new Date(booking.check_out_date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          
          {/* Next Steps */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• You'll receive a confirmation email shortly</li>
              <li>• Property owner will contact you within 24 hours</li>
              <li>• Prepare your documents for check-in</li>
              <li>• Contact support if you have any questions</li>
            </ul>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => navigate('/student/dashboard')}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.print()}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingConfirmation;
```

---

### **Step 4: Add Route for Booking Confirmation**

**File**: `src/App.tsx`

Add this route to the student routes:
```typescript
<Route path="/student/booking-confirmation" element={<BookingConfirmation />} />
```

---

### **Step 5: Environment Variables Setup**

**File**: `.env` (ensure these are set)

```bash
# Paystack Configuration
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_test_key_here
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here

# For production, replace with:
# VITE_PAYSTACK_PUBLIC_KEY=pk_live_your_live_key_here
# PAYSTACK_SECRET_KEY=sk_live_your_secret_key_here
```

---

## 🧪 **TESTING CHECKLIST**

### **Before Implementation**
- [ ] Backup current `useBookingViewModel.tsx`
- [ ] Ensure Paystack test keys are configured
- [ ] Verify database has payment fields

### **After Implementation**
- [ ] Test complete booking flow from property selection to confirmation
- [ ] Test payment success scenario
- [ ] Test payment failure scenario
- [ ] Test payment cancellation
- [ ] Verify booking record creation
- [ ] Verify payment reference storage
- [ ] Test booking confirmation page
- [ ] Test mobile responsiveness

### **Test Payment Scenarios**
```typescript
// Test card numbers for Paystack
const TEST_CARDS = {
  success: '4084084084084081',
  failure: '4084084084084099',
  insufficient_funds: '4084084084084107'
};
```

---

## 🚨 **CRITICAL CONSIDERATIONS**

### **Error Handling**
- Payment success but booking update failure
- Network interruption during payment
- User closes payment modal
- Invalid payment amount

### **Data Consistency**
- Booking created before payment
- Payment reference stored correctly
- Status updates are atomic

### **User Experience**
- Clear payment summary
- Loading states during booking creation
- Retry options for failed payments
- Confirmation page with next steps

---

## 📋 **DEPLOYMENT CHECKLIST**

- [ ] All code changes implemented
- [ ] Environment variables configured
- [ ] Database schema updated
- [ ] Payment flow tested end-to-end
- [ ] Error scenarios tested
- [ ] Mobile experience verified
- [ ] Booking confirmation page working
- [ ] Email notifications configured (future)

This implementation will connect the existing Paystack infrastructure to the booking flow, enabling real payment processing and booking confirmation for the ROOMi platform.
