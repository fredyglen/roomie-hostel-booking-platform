# 🚀 Paystack Webhook Setup - Quick Answers

## 1️⃣ WEBHOOK URL CONFIGURATION

**Q: What URL should I configure in my Paystack dashboard?**

**A:** 
```
https://ymqnbekeqarjmxftzvks.supabase.co/functions/v1/paystack-webhook
```

**How to configure:**
1. Go to: https://dashboard.paystack.com/settings/developer
2. Scroll to **Webhook URL** section
3. Paste the URL above
4. Click **Save**

---

## 2️⃣ WEBHOOK SECRET

**Q: Where do I find/set the webhook secret?**

**A: The webhook secret is your Paystack Secret Key**

### **Find Your Secret Key:**
1. Go to: https://dashboard.paystack.com/settings/developer
2. Copy your **Secret Key** (starts with `sk_test_` for test mode)
3. Keep it safe - never commit to Git!

### **Set in ROOMie Codebase:**

**Option A: Using Supabase CLI (Recommended)**
```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref ymqnbekeqarjmxftzvks

# Set the secret
supabase secrets set PAYSTACK_SECRET_KEY=sk_test_your_actual_key_here

# Verify it was set
supabase secrets list

# Deploy the Edge Function
supabase functions deploy paystack-webhook
```

**Option B: Using Supabase Dashboard**
1. Go to: https://supabase.com/dashboard/project/ymqnbekeqarjmxftzvks/settings/functions
2. Click **Edge Functions**
3. Click **Secrets**
4. Add secret: `PAYSTACK_SECRET_KEY` = `sk_test_your_key_here`
5. Save

**Where it's used in code:**
- File: `supabase/functions/paystack-webhook/index.ts`
- Line 15: `const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY')!`
- Used to verify webhook signature (HMAC-SHA512)

---

## 3️⃣ TEST WEBHOOK PAYLOAD

**Q: Provide a sample webhook payload for testing**

**A: Copy-paste this JSON:**

```json
{
  "event": "charge.success",
  "data": {
    "id": 1234567890,
    "domain": "test",
    "status": "success",
    "reference": "test_ref_1234567890",
    "amount": 110000,
    "message": "Approved",
    "gateway_response": "Successful",
    "paid_at": "2024-11-14T12:00:00.000Z",
    "created_at": "2024-11-14T11:55:00.000Z",
    "channel": "card",
    "currency": "GHS",
    "ip_address": "192.168.1.1",
    "metadata": {
      "booking_id": "replace_with_actual_booking_id",
      "property_id": "replace_with_actual_property_id",
      "user_id": "replace_with_actual_user_id",
      "property_rent": 1000,
      "platform_fee": 80,
      "processing_fee": 20,
      "owner_commission": 100,
      "commission_breakdown": {
        "baseAmount": 1000,
        "platformCommission": 100,
        "platformFixedFee": 100,
        "agentCommission": 0,
        "paystackFee": 21.45,
        "vatAmount": 0,
        "totalAmount": 1100,
        "ownerReceives": 900
      }
    },
    "customer": {
      "id": 123456,
      "first_name": "Test",
      "last_name": "Student",
      "email": "test.student@example.com",
      "customer_code": "CUS_test123",
      "phone": "+233501234567",
      "metadata": null,
      "risk_action": "default"
    },
    "authorization": {
      "authorization_code": "AUTH_test123",
      "bin": "408408",
      "last4": "4081",
      "exp_month": "12",
      "exp_year": "2025",
      "channel": "card",
      "card_type": "visa DEBIT",
      "bank": "Test Bank",
      "country_code": "GH",
      "brand": "visa",
      "reusable": true,
      "signature": "SIG_test123",
      "account_name": "Test Student"
    },
    "fees": 2145,
    "fees_split": null
  }
}
```

**Key fields explained:**
- `amount`: 110000 pesewas = 1100 GHS (1000 rent + 100 booking fee)
- `reference`: Unique transaction reference (must match booking)
- `metadata.booking_id`: **REPLACE** with actual booking ID from your database
- `metadata.commission_breakdown`: Shows new business model calculations

---

## 4️⃣ TESTING INSTRUCTIONS

### **Method 1: Paystack Dashboard (Easiest)**

1. **Go to Paystack Dashboard:**
   - URL: https://dashboard.paystack.com/settings/developer
   - Scroll to **Webhook URL** section

2. **Send Test Event:**
   - Click **Send Test Event**
   - Select event type: `charge.success`
   - Click **Send**

3. **Verify in Supabase:**
   ```bash
   # Watch real-time logs
   supabase functions logs paystack-webhook --tail
   
   # Check webhook received
   supabase db query "SELECT * FROM payment_webhooks ORDER BY created_at DESC LIMIT 1"
   ```

### **Method 2: cURL (Local Testing)**

```bash
# Step 1: Set your secret key
SECRET_KEY="sk_test_your_actual_key_here"

# Step 2: Create payload (minified JSON)
PAYLOAD='{"event":"charge.success","data":{"id":1234567890,"reference":"test_ref_1234567890","amount":110000,"status":"success","currency":"GHS","customer":{"email":"test@example.com"},"metadata":{"booking_id":"your_booking_id_here"}}}'

# Step 3: Generate HMAC-SHA512 signature
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha512 -hmac "$SECRET_KEY" | awk '{print $2}')

# Step 4: Send webhook
curl -X POST https://ymqnbekeqarjmxftzvks.supabase.co/functions/v1/paystack-webhook \
  -H "Content-Type: application/json" \
  -H "x-paystack-signature: $SIGNATURE" \
  -d "$PAYLOAD"

# Expected response: "OK" (status 200)
```

### **Method 3: Postman**

1. **Create New Request:**
   - Method: `POST`
   - URL: `https://ymqnbekeqarjmxftzvks.supabase.co/functions/v1/paystack-webhook`

2. **Add Headers:**
   ```
   Content-Type: application/json
   x-paystack-signature: [Generate using HMAC-SHA512]
   ```

3. **Generate Signature:**
   - Go to: https://www.freeformatter.com/hmac-generator.html
   - Algorithm: SHA-512
   - Secret Key: Your Paystack secret key
   - Message: The entire JSON payload (minified, no spaces)
   - Copy the generated hash

4. **Add Body:**
   - Select **Raw** → **JSON**
   - Paste the test payload from section 3️⃣
   - Replace `booking_id`, `property_id`, `user_id` with actual IDs

5. **Send Request**

### **Method 4: Real Payment (Test Mode)**

1. **Create a booking in Student Portal**
2. **Proceed to payment step**
3. **Use Paystack test card:**
   ```
   Card Number: 4084 0840 8408 4081
   CVV: 408
   Expiry: Any future date (e.g., 12/25)
   PIN: 0000
   OTP: 123456
   ```
4. **Complete payment**
5. **Webhook automatically sent by Paystack**

---

## 5️⃣ VERIFICATION STEPS

### **Step 1: Check Webhook Received**
```sql
-- Run in Supabase SQL Editor
SELECT 
  event_type,
  reference,
  status,
  processed,
  created_at
FROM payment_webhooks
WHERE reference = 'test_ref_1234567890'
ORDER BY created_at DESC
LIMIT 1;
```

**Expected:**
- `event_type`: `charge.success`
- `status`: `processed`
- `processed`: `true`

### **Step 2: Check Booking Updated**
```sql
SELECT 
  id,
  status,
  payment_status,
  total_amount,
  platform_commission,
  platform_fee,
  owner_receives
FROM bookings_enhanced
WHERE transaction_reference = 'test_ref_1234567890';
```

**Expected:**
- `status`: `confirmed`
- `payment_status`: `paid`
- `total_amount`: `1100` (student paid)
- `platform_commission`: `100` (10% from owner)
- `platform_fee`: `100` (80 + 20 from student)
- `owner_receives`: `900` (1000 - 10%)

### **Step 3: Check Student Dashboard**
- Navigate to: `/student/bookings`
- Find the booking
- Verify status shows "Confirmed"
- Verify payment breakdown shows:
  - Property Rent: 1000 GHS
  - Platform Fee: 80 GHS
  - Processing Fee: 20 GHS
  - Total: 1100 GHS

### **Step 4: Check Owner Dashboard**
- Navigate to: `/owner/bookings`
- Find the booking
- Verify owner receives: 900 GHS (1000 - 10% commission)

---

## 6️⃣ WEBHOOK EVENTS TO HANDLE

**Currently Implemented:**
- ✅ `charge.success` - Payment successful
- ✅ `paymentrequest.success` - Payment request completed
- ✅ `refund.processed` - Refund completed

**Recommended to Add:**
- ⚠️ `charge.failed` - Payment failed
- 💰 `transfer.success` - Owner payout successful
- ⚠️ `transfer.failed` - Owner payout failed

---

## 🎯 QUICK CHECKLIST

- [ ] Webhook URL configured in Paystack Dashboard
- [ ] Paystack secret key set in Supabase (`PAYSTACK_SECRET_KEY`)
- [ ] Edge Function deployed (`supabase functions deploy paystack-webhook`)
- [ ] Test webhook sent (using Paystack Dashboard or cURL)
- [ ] Webhook received (check `payment_webhooks` table)
- [ ] Booking status updated to `confirmed`
- [ ] Commission calculations correct (10% owner, 100 GHS student)
- [ ] Real payment test completed with test card

---

**Need more details?** See: `docs/WEBHOOK_TESTING_NEW_BUSINESS_MODEL.md`

