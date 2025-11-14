# 🚀 Paystack Webhook Testing - New Business Model

## ✅ NEW BUSINESS MODEL (Phase 1)
- **Students pay**: Property rent + 100 GHS (80 platform + 20 processing)
- **Owners pay**: 10% commission on property rent (deducted from payout)
- **Platform absorbs**: Paystack fees (1.95%)
- **VAT**: Removed (0%)
- **Agent commission**: Disabled (0%)

---

## 1️⃣ WEBHOOK URL CONFIGURATION

### **Your Webhook Endpoint:**
```
https://ymqnbekeqarjmxftzvks.supabase.co/functions/v1/paystack-webhook
```

### **Configure in Paystack Dashboard:**
1. Go to: https://dashboard.paystack.com/settings/developer
2. Scroll to **Webhook URL** section
3. Paste: `https://ymqnbekeqarjmxftzvks.supabase.co/functions/v1/paystack-webhook`
4. Click **Save**

---

## 2️⃣ WEBHOOK SECRET CONFIGURATION

### **A. Find Your Paystack Secret Key:**
1. Go to: https://dashboard.paystack.com/settings/developer
2. Copy your **Secret Key** (starts with `sk_test_` for test mode)

### **B. Set Supabase Secret:**
```bash
# Login to Supabase CLI
supabase login

# Link your project
supabase link --project-ref ymqnbekeqarjmxftzvks

# Set the Paystack secret key
supabase secrets set PAYSTACK_SECRET_KEY=sk_test_your_actual_key_here

# Verify it was set
supabase secrets list
```

### **C. Deploy Edge Function:**
```bash
supabase functions deploy paystack-webhook
```

---

## 3️⃣ TEST WEBHOOK PAYLOAD (NEW BUSINESS MODEL)

### **Example: 1000 GHS Property Rent**

**Calculation:**
- Property rent: 1000 GHS
- Student pays: 1100 GHS (1000 + 80 platform + 20 processing)
- Paystack amount: 110,000 pesewas (1100 GHS × 100)
- Owner receives: 900 GHS (1000 - 10% commission)
- Platform revenue: 200 GHS (100 from student + 100 from owner)
- Paystack fee: ~21.45 GHS (1.95% of 1100)
- Platform net: ~178.55 GHS

### **Copy-Paste Test Payload:**

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
      "booking_id": "your_booking_id_here",
      "property_id": "your_property_id_here",
      "user_id": "your_user_id_here",
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

---

## 4️⃣ TESTING INSTRUCTIONS

### **Method 1: Using Paystack Dashboard (Recommended)**

1. **Go to Paystack Dashboard:**
   - Navigate to: https://dashboard.paystack.com/settings/developer
   - Scroll to **Webhook URL** section
   - Click **Send Test Event**

2. **Select Event Type:**
   - Choose `charge.success`
   - Click **Send**



### **Method 3: Using Postman**

1. **Create New Request:**
   - Method: `POST`
   - URL: `https://ymqnbekeqarjmxftzvks.supabase.co/functions/v1/paystack-webhook`

2. **Add Headers:**
   ```
   Content-Type: application/json
   x-paystack-signature: [Generate using HMAC-SHA512 with your secret key]
   ```

3. **Add Body (Raw JSON):**
   - Copy the test payload from section 3️⃣ above
   - Replace `your_booking_id_here`, `your_property_id_here`, `your_user_id_here` with actual IDs

4. **Generate Signature:**
   - Use online HMAC generator: https://www.freeformatter.com/hmac-generator.html
   - Algorithm: SHA-512
   - Secret Key: Your Paystack secret key
   - Message: The entire JSON payload (minified, no spaces)

5. **Send Request**

---

## 5️⃣ VERIFICATION CHECKLIST

### **A. Check Webhook Received:**
```sql
-- Run in Supabase SQL Editor
SELECT
  event_type,
  reference,
  status,
  processed,
  created_at,
  payload->>'data'->>'amount' as amount_pesewas
FROM payment_webhooks
WHERE reference = 'test_ref_1234567890'
ORDER BY created_at DESC
LIMIT 1;
```

**Expected Result:**
- `event_type`: `charge.success`
- `status`: `processed`
- `processed`: `true`
- `amount_pesewas`: `110000`

### **B. Check Booking Updated:**
```sql
-- Run in Supabase SQL Editor
SELECT
  id,
  status,
  payment_status,
  total_amount,
  platform_commission,
  platform_fee,
  agent_commission,
  owner_receives,
  transaction_reference,
  updated_at
FROM bookings_enhanced
WHERE transaction_reference = 'test_ref_1234567890';
```

**Expected Result:**
- `status`: `confirmed`
- `payment_status`: `paid`
- `total_amount`: `1100` (student paid)
- `platform_commission`: `100` (10% from owner)
- `platform_fee`: `100` (80 + 20 from student)
- `agent_commission`: `0` (disabled)
- `owner_receives`: `900` (1000 - 10%)

### **C. Check Transaction Record:**
```sql
-- Run in Supabase SQL Editor
SELECT
  reference,
  status,
  amount,
  webhook_verified,
  paystack_response,
  updated_at
FROM transactions
WHERE reference = 'test_ref_1234567890';
```

**Expected Result:**
- `status`: `success`
- `amount`: `1100`
- `webhook_verified`: `true`

### **D. Check Payment Audit Log:**
```sql
-- Run in Supabase SQL Editor
SELECT
  event_type,
  reference,
  amount,
  status,
  metadata,
  created_at
FROM payment_audit_log
WHERE reference = 'test_ref_1234567890'
ORDER BY created_at DESC;
```

---

## 6️⃣ PAYSTACK WEBHOOK EVENTS TO HANDLE

### **Currently Implemented:**

1. **`charge.success`** ✅
   - Triggered when a payment is successful
   - Updates booking status to `confirmed`
   - Updates payment status to `paid`
   - Records transaction details

2. **`paymentrequest.success`** ✅
   - Triggered for payment request completions
   - Similar to charge.success

3. **`refund.processed`** ✅
   - Triggered when a refund is completed
   - Updates booking status accordingly

### **Recommended to Add:**

4. **`charge.failed`** ⚠️
   - Handle failed payments
   - Update booking status to `payment_failed`

5. **`transfer.success`** 💰
   - For owner payouts
   - Confirm owner received funds

6. **`transfer.failed`** ⚠️
   - Handle failed owner payouts
   - Retry or alert admin

---

## 7️⃣ TESTING WITH REAL PAYMENT (Test Mode)

### **Paystack Test Cards:**

**Successful Payment:**
```
Card Number: 4084 0840 8408 4081
CVV: 408
Expiry: Any future date
PIN: 0000
OTP: 123456
```

**Failed Payment:**
```
Card Number: 5060 6666 6666 6666 6666
CVV: 123
Expiry: Any future date
```

### **Test Flow:**
1. Create a booking in the Student Portal
2. Proceed to payment step
3. Use test card above
4. Complete payment
5. Verify webhook received in Supabase logs
6. Check booking status updated to `confirmed`
7. Verify commission calculations are correct

---

## 8️⃣ MONITORING & DEBUGGING

### **Watch Real-Time Logs:**
```bash
# Terminal 1: Watch webhook function logs
supabase functions logs paystack-webhook --tail

# Terminal 2: Watch database changes
supabase db query "SELECT * FROM payment_webhooks ORDER BY created_at DESC LIMIT 1" --watch
```

### **Common Issues:**

| Issue | Cause | Solution |
|-------|-------|----------|
| "No signature provided" | Webhook URL not configured | Add URL in Paystack Dashboard |
| "Invalid signature" | Wrong secret key | Re-run: `supabase secrets set PAYSTACK_SECRET_KEY=sk_test_xxx` |
| Webhook not received | Edge function not deployed | Run: `supabase functions deploy paystack-webhook` |
| Booking not updated | Missing booking_id in metadata | Ensure metadata includes booking_id |
| Wrong commission amounts | Old commission engine | Verify centralized engine updated (v2.0.0) |

---

## 9️⃣ PRODUCTION DEPLOYMENT

### **Before Going Live:**

1. ✅ Update Paystack secret key to production key (`sk_live_xxx`)
2. ✅ Update webhook URL in Paystack Dashboard (production)
3. ✅ Test with small real payment (e.g., 10 GHS)
4. ✅ Verify commission calculations are correct
5. ✅ Set up monitoring alerts for failed webhooks
6. ✅ Document rollback plan

### **Production Webhook URL:**
```
https://ymqnbekeqarjmxftzvks.supabase.co/functions/v1/paystack-webhook
```
(Same URL, but use production Paystack keys)

---

## 🎯 QUICK TEST CHECKLIST

- [ ] Webhook URL configured in Paystack Dashboard
- [ ] Paystack secret key set in Supabase
- [ ] Edge function deployed
- [ ] Test payload sent successfully
- [ ] Webhook received (check `payment_webhooks` table)
- [ ] Booking status updated to `confirmed`
- [ ] Payment status updated to `paid`
- [ ] Commission calculations correct (10% owner, 100 GHS student)
- [ ] Owner receives correct amount (baseAmount - 10%)
- [ ] Platform revenue correct (100 + 100 = 200 GHS)
- [ ] Real-time logs showing successful processing

---

**Need Help?** Check the Edge Function code at: `supabase/functions/paystack-webhook/index.ts`

3. **Verify in Supabase:**
   ```bash
   # Watch real-time logs
   supabase functions logs paystack-webhook --tail

   # Check webhook events table
   supabase db query "SELECT * FROM payment_webhooks ORDER BY created_at DESC LIMIT 5"
   ```

### **Method 2: Using cURL (Local Testing)**

```bash
# Generate HMAC signature (replace with your secret key)
SECRET_KEY="sk_test_your_actual_key_here"
PAYLOAD='{"event":"charge.success","data":{"id":1234567890,"reference":"test_ref_1234567890","amount":110000,"status":"success","currency":"GHS","customer":{"email":"test@example.com"}}}'

# Calculate signature
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha512 -hmac "$SECRET_KEY" | awk '{print $2}')

# Send webhook
curl -X POST https://ymqnbekeqarjmxftzvks.supabase.co/functions/v1/paystack-webhook \
  -H "Content-Type: application/json" \
  -H "x-paystack-signature: $SIGNATURE" \
  -d "$PAYLOAD"
```


