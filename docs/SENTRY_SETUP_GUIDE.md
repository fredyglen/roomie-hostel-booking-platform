# Sentry Integration Setup Guide - ROOMie

**Status:** ✅ Code Implementation Complete  
**Date:** 2025-11-06  
**Estimated Setup Time:** 15-20 minutes

---

## 📋 Prerequisites

- [x] Sentry account created at [sentry.io](https://sentry.io)
- [x] ROOMie project created in Sentry dashboard
- [ ] Sentry DSN obtained
- [ ] Sentry Auth Token created
- [ ] Environment variables configured

---

## 🚀 Step-by-Step Setup

### Step 1: Install Sentry Packages

```bash
npm install @sentry/react --save
npm install @sentry/vite-plugin --save-dev
```

**Expected Output:**
```
added 2 packages, and audited X packages in Xs
```

---

### Step 2: Get Sentry Credentials

#### A. Get Your DSN (Data Source Name)

1. Log in to [sentry.io](https://sentry.io)
2. Navigate to: **Settings** (left sidebar) → **Projects** → Select **ROOMie**
3. Click **Client Keys (DSN)** in the left menu
4. Copy the **DSN** (looks like: `https://abc123@o0.ingest.sentry.io/123456`)

#### B. Create Auth Token for Source Maps

1. Go to: **Settings** → **Account** → **Auth Tokens**
2. Click **Create New Token**
3. Configure:
   - **Name:** `ROOMie Source Maps Upload`
   - **Scopes:** Check these:
     - ✅ `project:read`
     - ✅ `project:releases`
     - ✅ `org:read`
4. Click **Create Token**
5. **COPY THE TOKEN IMMEDIATELY** (you won't see it again!)

#### C. Get Organization Slug and Project Name

- **Organization Slug:** Found in URL: `https://sentry.io/organizations/{org-slug}/`
- **Project Name:** Usually `roomie` (visible in project dropdown)

---

### Step 3: Configure Environment Variables

#### Update `.env` file:

```bash
# Add these lines to your .env file:
VITE_SENTRY_DSN=https://your-actual-dsn@o0.ingest.sentry.io/your-project-id
SENTRY_AUTH_TOKEN=your-auth-token-here
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=roomie
```

**⚠️ IMPORTANT:**
- Only `VITE_SENTRY_DSN` needs the `VITE_` prefix (exposed to browser)
- `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` are build-time only

#### Verify `.env.example` is updated:

The `.env.example` file should already contain Sentry placeholders. If not, add:

```bash
# ERROR MONITORING (SENTRY)
VITE_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
SENTRY_AUTH_TOKEN=your_sentry_auth_token
SENTRY_ORG=your_sentry_org_slug
SENTRY_PROJECT=roomie
```

---

### Step 4: Verify Code Changes

The following files have been updated with Sentry integration:

#### ✅ Files Modified:

1. **`vite.config.ts`** - Added Sentry Vite plugin for source map uploads
2. **`src/main.tsx`** - Initialize Sentry on app startup
3. **`src/utils/ErrorHandler.ts`** - Integrated with Sentry's captureException
4. **`.env.example`** - Added Sentry environment variable templates

#### ✅ Files Created:

1. **`src/config/sentry.config.ts`** - Centralized Sentry configuration
2. **`src/pages/SentryTestPage.tsx`** - Test page for verification
3. **`docs/SENTRY_SETUP_GUIDE.md`** - This guide

---

### Step 5: Test the Integration

#### Option A: Development Testing (Recommended First)

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Check console output:**
   - You should see: `[Sentry] Skipping initialization (not production or DSN missing)`
   - This is correct! Sentry only runs in production mode.

3. **Test with production build:**
   ```bash
   npm run build
   npm run preview
   ```

4. **Check console output:**
   - You should see: `[Sentry] Initialized successfully`

#### Option B: Using the Test Page

1. **Add route to your router** (e.g., in `src/App.tsx` or router config):
   ```tsx
   import SentryTestPage from './pages/SentryTestPage';
   
   // Add route:
   <Route path="/sentry-test" element={<SentryTestPage />} />
   ```

2. **Build and preview:**
   ```bash
   npm run build
   npm run preview
   ```

3. **Navigate to:** `http://localhost:4173/sentry-test`

4. **Click test buttons** and verify errors appear in Sentry dashboard

5. **⚠️ IMPORTANT:** Remove the test page and route before production deployment!

---

### Step 6: Verify in Sentry Dashboard

1. Go to [sentry.io](https://sentry.io)
2. Navigate to: **Issues** → **All Issues**
3. You should see test errors appear within 1-2 seconds
4. Click on an error to see:
   - Full stack trace
   - Breadcrumbs (user actions before error)
   - Device/browser information
   - Source code context (if source maps uploaded correctly)

---

## 🔐 Step 7: Add to GitHub Secrets (for CI/CD)

### Add Sentry Auth Token to GitHub:

1. Go to your GitHub repository
2. Navigate to: **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add:
   - **Name:** `SENTRY_AUTH_TOKEN`
   - **Value:** Your Sentry auth token
5. Click **Add secret**

### Add Other Secrets:

Repeat for these secrets:
- `SENTRY_ORG` - Your organization slug
- `SENTRY_PROJECT` - Your project name (usually `roomie`)
- `VITE_SENTRY_DSN` - Your Sentry DSN

---

## ✅ Verification Checklist

- [ ] Sentry packages installed (`@sentry/react`, `@sentry/vite-plugin`)
- [ ] DSN obtained from Sentry dashboard
- [ ] Auth token created with correct scopes
- [ ] Environment variables added to `.env`
- [ ] `.env.example` updated with placeholders
- [ ] Production build succeeds: `npm run build`
- [ ] Sentry initializes in production mode
- [ ] Test error appears in Sentry dashboard
- [ ] Source maps working (can see original TypeScript code in Sentry)
- [ ] GitHub secrets configured for CI/CD
- [ ] Test page removed before production deployment

---

## 🎯 What's Working Now

### ✅ Error Monitoring
- All errors automatically captured in production
- Stack traces with source maps
- User context and breadcrumbs
- Performance monitoring

### ✅ Integration Points
- `ErrorHandler.handle()` - Automatically reports to Sentry
- Global error handlers - Uncaught errors captured
- Promise rejections - Unhandled rejections captured
- Manual reporting - Use `captureSentryException()` or `captureSentryMessage()`

### ✅ Privacy & Filtering
- Browser extension errors filtered out
- Ad blocker errors filtered out
- Sensitive data (passwords, tokens) removed from breadcrumbs
- Session replay with text/media masking

---

## 📊 Expected Sentry Dashboard

After setup, you should see:

1. **Issues Tab:**
   - Test errors from SentryTestPage
   - Real errors from production usage

2. **Performance Tab:**
   - Page load times
   - API request durations
   - Transaction traces

3. **Replays Tab:**
   - Session recordings for errors
   - User interaction playback

---

## 🐛 Troubleshooting

### Issue: "Sentry not initializing"

**Solution:**
- Check that `VITE_SENTRY_DSN` is set in `.env`
- Verify you're running in production mode: `npm run build && npm run preview`
- Check console for initialization message

### Issue: "Source maps not working"

**Solution:**
- Verify `SENTRY_AUTH_TOKEN` is set
- Check `SENTRY_ORG` and `SENTRY_PROJECT` match your Sentry dashboard
- Ensure `vite.config.ts` has the Sentry plugin configured
- Check build output for source map upload logs

### Issue: "Too many errors in Sentry"

**Solution:**
- Adjust `tracesSampleRate` in `src/config/sentry.config.ts` (reduce from 1.0 to 0.1)
- Add more error filters in `filterError()` function
- Review `ignoreErrors` array and add common non-critical errors

---

## 📚 Next Steps

1. **Monitor for 24 hours** - Check Sentry dashboard for real errors
2. **Adjust sample rates** - Reduce if too many events
3. **Set up alerts** - Configure email/Slack notifications for critical errors
4. **Review and fix** - Address real errors found in production
5. **Proceed to next service** - Resend (transactional email)

---

## 🎉 Success Criteria

✅ Sentry is successfully integrated when:
1. Production build completes without errors
2. Sentry initializes in production mode
3. Test errors appear in Sentry dashboard within seconds
4. Source maps show original TypeScript code
5. No errors in browser console related to Sentry

---

**Ready to proceed to the next service (Resend)?** ✅

