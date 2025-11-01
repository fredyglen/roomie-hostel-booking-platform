# ROOMi Payment Integration Testing Guide

**Date**: December 17, 2024  
**Implementation Status**: ✅ **COMPLETE**  
**Testing Priority**: 🚨 **CRITICAL**

---

## 🎯 **TESTING OVERVIEW**

This guide provides comprehensive testing procedures for the newly implemented ROOMi Paystack payment integration. All critical components have been updated and are ready for testing.

### **✅ Implementation Completed**
1. **ModernPaystackPayment Component**: ✅ Upgraded to InlineJS V2 with split payment support
2. **useBookingViewModel Hook**: ✅ Real payment integration replacing simulation
3. **BookingStepsContainer**: ✅ Payment modal integration with business model calculations
4. **BookingConfirmation Page**: ✅ Complete confirmation flow with payment details
5. **App Routing**: ✅ New route added for booking confirmation

---

## 🧪 **STEP 4: TESTING REQUIREMENTS**

### **🔧 Environment Setup**

#### **1. Required Environment Variables**
```bash
# Add to .env file
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_test_key_here
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here

# For production deployment:
# VITE_PAYSTACK_PUBLIC_KEY=pk_live_your_live_key_here
# PAYSTACK_SECRET_KEY=sk_live_your_secret_key_here
```

#### **2. Test Cards for Ghana (From Paystack Documentation)**
```typescript
const GHANA_TEST_CARDS = {
  // Successful Payments
  successful_visa: '4084084084084081',
  successful_mastercard: '5060666666666666666',
  
  // Failed Payments
  declined_card: '4084084084084099',
  insufficient_funds: '4084084084084107',
  
  // Mobile Money Test Numbers
  mtn_mobile_money: '055 123 498 7',
  vodafone_cash: '020 123 456 7',
  airtel_tigo: '027 123 456 7'
};
```

#### **3. Test User Credentials**
```typescript
const TEST_USERS = {
  student: {
    email: 'student@test.com',
    password: 'testpassword123',
    phone: '+233551234567'
  },
  property_owner: {
    email: 'owner@test.com',
    password: 'testpassword123',
    phone: '+233201234567'
  }
};
```

---

## 🔍 **CRITICAL TEST SCENARIOS**

### **Test 1: Complete Booking Flow (SUCCESS PATH)**

#### **Steps:**
1. **Login as Student**
   - Navigate to `/auth/login`
   - Login with test student credentials
   - Verify redirect to student dashboard

2. **Property Selection**
   - Navigate to property listing
   - Select a property with available rooms
   - Click "Book Now" button

3. **Booking Form Completion**
   - Fill all required booking information:
     - Full Name: "Test Student"
     - Email: "student@test.com"
     - Phone: "+233551234567"
     - Check-in Date: Future date
     - Duration: "4 months"
     - Emergency Contact: "Emergency Contact"
     - Emergency Phone: "+233201234567"

4. **Payment Step Verification**
   - Navigate through booking steps to payment (Step 7)
   - Verify payment breakdown shows:
     - Property Rent: Base price
     - Platform Commission: 5% of base price
     - Platform Fee: 100 GHS
     - Processing Fee: 1.95% of subtotal
     - Total Amount: Calculated correctly

5. **Payment Processing**
   - Click "Proceed to Payment"
   - Verify booking creation (should show "Creating Booking...")
   - Verify payment modal opens with Paystack V2
   - Use test card: `4084084084084081`
   - Complete payment flow

6. **Payment Success Verification**
   - Verify redirect to `/student/booking-confirmation`
   - Verify booking details display correctly
   - Verify payment reference is stored
   - Verify booking status is "confirmed"

#### **Expected Results:**
- ✅ Booking created with "pending" status initially
- ✅ Payment modal opens with correct amount
- ✅ Payment processes successfully
- ✅ Booking status updates to "confirmed"
- ✅ Payment reference stored in database
- ✅ User redirected to confirmation page
- ✅ Confirmation page shows all booking details

---

### **Test 2: Payment Failure Handling**

#### **Steps:**
1. Follow Test 1 steps 1-4
2. **Payment Processing with Failed Card**
   - Click "Proceed to Payment"
   - Use declined test card: `4084084084084099`
   - Attempt payment

#### **Expected Results:**
- ✅ Payment fails with appropriate error message
- ✅ Booking remains in "pending" status
- ✅ Payment modal remains open for retry
- ✅ User can try different payment method
- ✅ No redirect to confirmation page

---

### **Test 3: Ghana Mobile Money Integration**

#### **Steps:**
1. Follow Test 1 steps 1-4
2. **Mobile Money Payment**
   - Click "Proceed to Payment"
   - Select Mobile Money option in Paystack popup
   - Choose MTN Mobile Money
   - Use test number: `055 123 498 7`
   - Complete USSD simulation

#### **Expected Results:**
- ✅ Mobile money option available
- ✅ MTN, Vodafone, AirtelTigo networks shown
- ✅ Payment processes via USSD simulation
- ✅ Success flow same as card payment

---

### **Test 4: Business Model Calculation Verification**

#### **Test Data:**
```typescript
const testScenarios = [
  {
    basePrice: 1000,
    expectedCommission: 50,      // 5%
    expectedPlatformFee: 100,    // Fixed
    expectedSubtotal: 1150,      // 1000 + 50 + 100
    expectedPaystackFee: 22.43,  // 1.95% of 1150
    expectedTotal: 1172.43       // Final amount
  },
  {
    basePrice: 2000,
    expectedCommission: 100,     // 5%
    expectedPlatformFee: 100,    // Fixed
    expectedSubtotal: 2200,      // 2000 + 100 + 100
    expectedPaystackFee: 42.90,  // 1.95% of 2200
    expectedTotal: 2242.90       // Final amount
  }
];
```

#### **Verification Steps:**
1. Select properties with different base prices
2. Navigate to payment step
3. Verify calculations match expected values
4. Test with multiple price points

---

### **Test 5: Database Persistence Verification**

#### **Database Queries to Run:**
```sql
-- Verify booking creation
SELECT 
  id, booking_reference, student_id, property_id,
  total_amount, base_property_price, platform_commission, platform_fee,
  payment_status, status, created_at
FROM bookings 
WHERE student_id = 'test_student_id'
ORDER BY created_at DESC;

-- Verify payment information storage
SELECT 
  id, payment_reference, paystack_reference, payment_method,
  paid_at, payment_status
FROM bookings 
WHERE payment_status = 'completed'
ORDER BY paid_at DESC;

-- Verify payment distribution calculation
SELECT 
  total_amount,
  base_property_price,
  platform_commission,
  platform_fee,
  (base_property_price + platform_commission + platform_fee) as calculated_subtotal,
  (total_amount - base_property_price - platform_commission - platform_fee) as paystack_fee
FROM bookings 
WHERE payment_status = 'completed';
```

---

### **Test 6: Error Scenarios**

#### **Network Interruption Test:**
1. Start payment process
2. Disconnect internet during payment
3. Reconnect internet
4. Verify payment state recovery

#### **Booking Creation Failure Test:**
1. Temporarily break database connection
2. Attempt booking creation
3. Verify appropriate error handling
4. Verify no orphaned payment attempts

#### **Payment Modal Closure Test:**
1. Start payment process
2. Close payment modal without completing payment
3. Verify booking remains in pending state
4. Verify user can retry payment later

---

## 📊 **SUCCESS CRITERIA**

### **✅ All Tests Must Pass:**
- [ ] Complete booking flow works end-to-end
- [ ] Payment calculations are mathematically correct
- [ ] Ghana mobile money integration functions
- [ ] Error handling works appropriately
- [ ] Database persistence is accurate
- [ ] User experience is smooth and intuitive

### **✅ Performance Requirements:**
- [ ] Payment modal loads within 2 seconds
- [ ] Booking creation completes within 5 seconds
- [ ] Payment processing completes within 30 seconds
- [ ] Page transitions are smooth

### **✅ Security Verification:**
- [ ] No sensitive data exposed in browser console
- [ ] Payment references are properly generated
- [ ] User authentication is maintained throughout flow
- [ ] Database updates are atomic and consistent

---

## 🚨 **CRITICAL ISSUES TO WATCH FOR**

### **Payment Integration Issues:**
- Payment modal not loading (check Paystack V2 script)
- Incorrect amount calculations (verify business model math)
- Payment success not updating booking status
- Missing payment references in database

### **User Experience Issues:**
- Broken navigation after payment
- Missing error messages for failed payments
- Slow loading times
- Mobile responsiveness problems

### **Database Issues:**
- Booking creation failures
- Missing payment fields
- Incorrect status updates
- Data consistency problems

---

## 📞 **SUPPORT DURING TESTING**

### **If Issues Are Found:**
1. **Check Browser Console** for JavaScript errors
2. **Verify Environment Variables** are set correctly
3. **Check Database Logs** for any SQL errors
4. **Test with Different Browsers** (Chrome, Safari, Firefox)
5. **Test on Mobile Devices** for Ghana market compatibility

### **Common Fixes:**
- **Paystack Script Loading**: Clear browser cache
- **Payment Modal Issues**: Check network connectivity
- **Database Errors**: Verify Supabase connection
- **Calculation Errors**: Check business model constants

This testing guide ensures the ROOMi payment integration is production-ready and provides a seamless experience for Ghana's student housing market.
