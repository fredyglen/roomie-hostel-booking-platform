# ⚡ Paystack Webhook Quick Setup (5 Minutes)

## 🎯 YOUR WEBHOOK URL
```
https://ymqnbekeqarjmxftzvks.supabase.co/functions/v1/paystack-webhook
```

---

## 📝 SETUP STEPS

### 1️⃣ **Set Supabase Secret** (2 mins)
```bash
supabase login
supabase link --project-ref ymqnbekeqarjmxftzvks
supabase secrets set PAYSTACK_SECRET_KEY=sk_test_your_key_here
supabase functions deploy paystack-webhook
```

### 2️⃣ **Configure Paystack Dashboard** (2 mins)
1. Go to: https://dashboard.paystack.com/settings/developer
2. Paste webhook URL: `https://ymqnbekeqarjmxftzvks.supabase.co/functions/v1/paystack-webhook`
3. Click **Save**

### 3️⃣ **Test** (1 min)
```bash
# Send test event from Paystack Dashboard
# OR make a test payment with card: 4084 0840 8408 4081

# Verify in database:
supabase db query "SELECT * FROM payment_webhooks ORDER BY created_at DESC LIMIT 5"
```

---

## ✅ VERIFICATION

```bash
# Check secrets are set
supabase secrets list

# Check function is deployed
supabase functions list

# Watch real-time logs
supabase functions logs paystack-webhook --tail
```

---

## 🐛 QUICK TROUBLESHOOTING

| Issue | Solution |
|-------|----------|
| "No signature provided" | Verify webhook URL in Paystack Dashboard |
| "Invalid signature" | Re-run: `supabase secrets set PAYSTACK_SECRET_KEY=sk_test_xxx` |
| No events received | Check Edge Function logs: `supabase functions logs paystack-webhook` |

---

## 🚀 PRODUCTION CHECKLIST

- [ ] Update to live keys: `supabase secrets set PAYSTACK_SECRET_KEY=sk_live_xxx`
- [ ] Redeploy: `supabase functions deploy paystack-webhook`
- [ ] Update Paystack Dashboard with same webhook URL (works for both test/live)
- [ ] Test with real payment (1 GHS)
- [ ] Monitor logs for 24 hours

---

**That's it! Your webhook is ready.** 🎉

See `PAYSTACK_WEBHOOK_SETUP_GUIDE.md` for detailed documentation.

