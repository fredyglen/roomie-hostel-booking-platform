# Resend Email Integration Setup Guide for ROOMie

This guide provides complete step-by-step instructions for setting up Resend transactional email service in the ROOMie platform.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Resend Account Setup](#resend-account-setup)
3. [Domain Verification](#domain-verification)
4. [API Key Configuration](#api-key-configuration)
5. [Environment Variables](#environment-variables)
6. [Testing the Integration](#testing-the-integration)
7. [Production Deployment](#production-deployment)
8. [Troubleshooting](#troubleshooting)

---

## 1. Prerequisites

Before starting, ensure you have:

- ✅ A Resend account (sign up at [resend.com](https://resend.com))
- ✅ A verified domain (or use `resend.dev` for testing)
- ✅ Node.js and npm installed
- ✅ Access to your DNS provider (for domain verification)
- ✅ ROOMie codebase cloned and running locally

---

## 2. Resend Account Setup

### Step 1: Create a Resend Account

1. Go to [resend.com](https://resend.com)
2. Click **"Sign Up"** in the top right corner
3. Sign up using:
   - **GitHub** (recommended for developers)
   - **Google**
   - **Email + Password**
4. Verify your email address (check your inbox)
5. Complete the onboarding questionnaire

### Step 2: Explore the Dashboard

Once logged in, you'll see:
- **Overview** - Usage statistics and recent emails
- **Emails** - Email logs and delivery status
- **API Keys** - Manage your API keys
- **Domains** - Add and verify domains
- **Settings** - Account settings and billing

---

## 3. Domain Verification

### Option A: Use `resend.dev` for Testing (Quick Start)

For development and testing, you can use Resend's test domain:

- **From Address:** `onboarding@resend.dev`
- **Limitations:** 
  - Can only send to your own verified email
  - Not suitable for production
  - No custom branding

**To use `resend.dev`:**
1. Skip domain verification
2. Use `onboarding@resend.dev` as the `from` address in emails
3. Only send test emails to your own email address

### Option B: Verify Your Own Domain (Production)

For production use, you must verify your own domain:

#### Step 1: Add Your Domain

1. In Resend dashboard, click **"Domains"** in the left sidebar
2. Click **"Add Domain"**
3. Enter your domain (e.g., `yourdomain.com`)
4. Click **"Add"**

#### Step 2: Add DNS Records

Resend will provide you with DNS records to add to your domain:

**SPF Record (TXT):**
```
Name: @
Type: TXT
Value: v=spf1 include:_spf.resend.com ~all
```

**DKIM Record (TXT):**
```
Name: resend._domainkey
Type: TXT
Value: [Provided by Resend - copy from dashboard]
```

**DMARC Record (TXT):**
```
Name: _dmarc
Type: TXT
Value: v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com
```

#### Step 3: Add DNS Records to Your Provider

**For Cloudflare:**
1. Log in to Cloudflare
2. Select your domain
3. Go to **DNS** → **Records**
4. Click **"Add record"**
5. Add each record (SPF, DKIM, DMARC)
6. Set **Proxy status** to **DNS only** (grey cloud)
7. Click **"Save"**

**For Other Providers:**
- Follow your DNS provider's instructions for adding TXT records
- Common providers: GoDaddy, Namecheap, Google Domains, AWS Route 53

#### Step 4: Verify Domain

1. Return to Resend dashboard
2. Click **"Verify"** next to your domain
3. Wait for DNS propagation (can take 5-60 minutes)
4. Once verified, you'll see a green checkmark ✅

---

## 4. API Key Configuration

### Step 1: Create an API Key

1. In Resend dashboard, click **"API Keys"** in the left sidebar
2. Click **"Create API Key"**
3. Configure the key:
   - **Name:** `ROOMie Production` (or `ROOMie Development`)
   - **Permission:** `Sending access` (default)
   - **Domain:** Select your verified domain (or leave as "All Domains")
4. Click **"Add"**
5. **IMPORTANT:** Copy the API key immediately - you won't be able to see it again!

**API Key Format:**
```
re_123abc456def789ghi012jkl345mno678
```

### Step 2: Store API Key Securely

**⚠️ SECURITY WARNING:**
- Never commit API keys to version control
- Never share API keys publicly
- Use environment variables for all keys
- Rotate keys regularly (every 90 days recommended)

---

## 5. Environment Variables

### Step 1: Update `.env` File

1. Open your `.env` file (create one if it doesn't exist)
2. Add the Resend API key:

```bash
# ============================================
# TRANSACTIONAL EMAIL (RESEND)
# ============================================
VITE_RESEND_API_KEY=re_your_actual_api_key_here
```

3. Save the file

### Step 2: Verify `.env.example`

The `.env.example` file should already have the placeholder:

```bash
# ============================================
# TRANSACTIONAL EMAIL (RESEND)
# ============================================
# VITE_RESEND_API_KEY=re_your_api_key
```

### Step 3: Update Email Configuration

1. Open `src/config/resend.config.ts`
2. Update the default email addresses:

```typescript
const DEFAULT_FROM_EMAIL = 'ROOMie <noreply@yourdomain.com>'; // Update with your verified domain
const DEFAULT_REPLY_TO = 'support@yourdomain.com'; // Update with your support email
```

**Example:**
```typescript
const DEFAULT_FROM_EMAIL = 'ROOMie <noreply@roomie.com>';
const DEFAULT_REPLY_TO = 'support@roomie.com';
```

---

## 6. Testing the Integration

### Step 1: Install Dependencies

```bash
npm install resend
```

### Step 2: Start Development Server

```bash
npm run dev
```

### Step 3: Access Test Page

1. Navigate to: `http://localhost:5173/test/resend`
2. You should see the **Resend Email Test Page**

### Step 4: Run Tests

1. Enter your email address in the **"Test Email Address"** field
2. Click each test button to send different email types:
   - **Booking Confirmation** - Tests booking confirmation email
   - **Password Reset** - Tests password reset email
   - **Email Verification** - Tests email verification email
   - **Property Approval** - Tests property approval email

3. Check your email inbox for the test emails
4. Verify that:
   - ✅ Emails are delivered
   - ✅ Templates render correctly
   - ✅ Links work properly
   - ✅ Branding looks professional

### Step 5: Check Resend Dashboard

1. Go to Resend dashboard → **"Emails"**
2. You should see your test emails listed
3. Click on an email to see:
   - Delivery status
   - Open/click tracking (if enabled)
   - Full email content
   - Delivery logs

---

## 7. Production Deployment

### Step 1: Add Environment Variables to Hosting Platform

**For Vercel:**
```bash
vercel env add VITE_RESEND_API_KEY
# Paste your API key when prompted
```

**For Netlify:**
1. Go to Site Settings → Environment Variables
2. Click "Add a variable"
3. Key: `VITE_RESEND_API_KEY`
4. Value: Your API key
5. Click "Save"

**For Other Platforms:**
- Follow your hosting provider's instructions for adding environment variables

### Step 2: Remove Test Page

**IMPORTANT:** Before deploying to production, remove the test page:

1. Delete `src/pages/ResendTestPage.tsx`
2. Remove the test route from your router configuration
3. Commit the changes

### Step 3: Deploy

```bash
git add .
git commit -m "feat: integrate Resend email service"
git push origin main
```

### Step 4: Verify Production

1. Test email sending in production
2. Monitor Resend dashboard for delivery issues
3. Check error logs for any email-related errors

---

## 8. Troubleshooting

### Issue: "Resend is not configured" Error

**Cause:** API key not set in environment variables

**Solution:**
1. Check that `VITE_RESEND_API_KEY` is in your `.env` file
2. Restart your development server
3. Verify the API key is correct (no extra spaces)

### Issue: Emails Not Sending

**Possible Causes:**
1. **Invalid API Key** - Check that your API key is correct
2. **Domain Not Verified** - Verify your domain in Resend dashboard
3. **Rate Limiting** - Check if you've exceeded your plan limits
4. **Invalid Email Address** - Ensure recipient email is valid

**Solution:**
1. Check Resend dashboard → "Emails" for error messages
2. Verify domain verification status
3. Check API key permissions
4. Review error logs in browser console

### Issue: Emails Going to Spam

**Causes:**
- Domain not properly verified
- Missing SPF/DKIM/DMARC records
- Poor email content (too many links, spammy words)

**Solution:**
1. Verify all DNS records are correct
2. Use [mail-tester.com](https://www.mail-tester.com) to check email score
3. Improve email content and formatting
4. Add unsubscribe links (for marketing emails)

### Issue: Slow Email Delivery

**Causes:**
- DNS propagation delays
- Recipient server delays
- Network issues

**Solution:**
1. Check Resend dashboard for delivery status
2. Wait a few minutes and check again
3. Contact Resend support if persistent

---

## 📊 Resend Pricing (2025)

**Free Tier:**
- 3,000 emails/month
- 100 emails/day
- All features included

**Pro Plan ($20/month):**
- 50,000 emails/month
- Unlimited daily sending
- Priority support

**Scale Plan ($80/month):**
- 1,000,000 emails/month
- Dedicated IP address
- Custom volume pricing available

---

## 📚 Additional Resources

- **Resend Documentation:** [resend.com/docs](https://resend.com/docs)
- **Resend API Reference:** [resend.com/docs/api-reference](https://resend.com/docs/api-reference)
- **Resend Status Page:** [status.resend.com](https://status.resend.com)
- **Resend Support:** [resend.com/support](https://resend.com/support)

---

## ✅ Setup Complete!

You've successfully integrated Resend email service into ROOMie. Your platform can now send:
- ✅ Booking confirmations
- ✅ Password reset emails
- ✅ Email verification emails
- ✅ Property approval notifications
- ✅ And more!

**Next Steps:**
- Integrate email sending into your booking flow
- Add email notifications for property approvals
- Set up automated email campaigns (optional)
- Monitor email delivery rates in Resend dashboard

---

**Need Help?** Contact the ROOMie development team or refer to the Resend documentation.

