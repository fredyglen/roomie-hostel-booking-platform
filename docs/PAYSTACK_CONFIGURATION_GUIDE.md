# 🔧 Paystack Configuration Guide for ROOMie

## Step 1: Get Your Paystack Keys

### From Paystack Dashboard:

1. **Login to Paystack:** https://dashboard.paystack.com/
2. **Navigate to Settings:**
   - Click on **Settings** in the left sidebar
   - Click on **API Keys & Webhooks**

3. **Copy Your Keys:**
   - **Test Public Key:** Starts with `pk_test_...`
   - **Test Secret Key:** Click "Show" to reveal, starts with `sk_test_...`
   - **Live Public Key:** Starts with `pk_live_...` (for production)
   - **Live Secret Key:** Starts with `sk_live_...` (for production)

---

## Step 2: Configure Paystack in Supabase

### A. Add Environment Variables to Supabase Edge Functions

1. **Go to Supabase Dashboard:** https://supabase.com/dashboard
2. **Select your project:** `roomi-campus-nest-1`
3. **Navigate to Edge Functions:**
   - Click **Edge Functions** in the left sidebar
   - Click **Manage secrets** (or **Settings** → **Edge Functions**)

4. **Add these secrets:**
   ```
   PAYSTACK_SECRET_KEY=sk_test_your_actual_secret_key_here
   PAYSTACK_PUBLIC_KEY=pk_test_your_actual_public_key_here
   ```

### B. Add Environment Variables to Frontend (.env file)

1. **Open your `.env` file** in the project root
2. **Add these variables:**
   ```env
   VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_actual_public_key_here
   ```

---

## Step 3: Configure Webhook URL in Paystack

### In Paystack Dashboard:

1. **Go to Settings → API Keys & Webhooks**
2. **Scroll to "Webhook URL" section**
3. **Enter your webhook URL:**
   ```
   https://ymqnbekeqarjmxftzvks.supabase.co/functions/v1/paystack-webhook
   ```

4. **Click "Save Changes"**

---

## Step 4: Test the Configuration

### Test Payment Flow:

1. **Use Paystack Test Cards:**
   - **Success:** `4084084084084081` (CVV: 408, Expiry: any future date)
   - **Insufficient Funds:** `5060666666666666666` (CVV: 123)
   - **PIN:** `0000` (when prompted)
   - **OTP:** `123456` (when prompted)

2. **Complete a test booking:**
   - Select a property
   - Fill in booking details
   - Use test card above
   - Verify payment succeeds

---

## Step 5: Verify Webhook is Working

### Check Webhook Logs:

1. **In Paystack Dashboard:**
   - Go to **Settings → API Keys & Webhooks**
   - Scroll to **Webhook Logs**
   - Verify events are being sent (status 200 = success)

2. **In Supabase Dashboard:**
   - Go to **Edge Functions**
   - Click on `paystack-webhook`
   - Check **Logs** tab for any errors

---

## Common Issues & Solutions

### Issue 1: "Edge Function returned a non-2xx status code"

**Causes:**
- Missing `PAYSTACK_SECRET_KEY` in Supabase Edge Functions
- Invalid Paystack keys
- Edge function not deployed

**Solution:**
1. Verify environment variables are set in Supabase
2. Redeploy the edge function:
   ```bash
   supabase functions deploy paystack-webhook
   ```

### Issue 2: "Payment initialization failed"

**Causes:**
- Missing `VITE_PAYSTACK_PUBLIC_KEY` in frontend
- Invalid public key

**Solution:**
1. Check `.env` file has correct public key
2. Restart dev server: `npm run dev`

### Issue 3: Webhook not receiving events

**Causes:**
- Incorrect webhook URL in Paystack
- Webhook signature verification failing

**Solution:**
1. Verify webhook URL is correct
2. Check Paystack webhook logs for errors
3. Verify `PAYSTACK_SECRET_KEY` matches in both places

---

## Quick Checklist

- [ ] Copied Test Public Key from Paystack
- [ ] Copied Test Secret Key from Paystack
- [ ] Added `PAYSTACK_SECRET_KEY` to Supabase Edge Functions
- [ ] Added `VITE_PAYSTACK_PUBLIC_KEY` to `.env` file
- [ ] Configured webhook URL in Paystack dashboard
- [ ] Deployed edge function: `supabase functions deploy paystack-webhook`
- [ ] Restarted dev server: `npm run dev`
- [ ] Tested payment with test card
- [ ] Verified webhook logs show success (200)

---

## Need Help?

If you're still having issues:
1. Check Supabase Edge Function logs
2. Check browser console for errors
3. Check Paystack webhook logs
4. Verify all environment variables are set correctly

