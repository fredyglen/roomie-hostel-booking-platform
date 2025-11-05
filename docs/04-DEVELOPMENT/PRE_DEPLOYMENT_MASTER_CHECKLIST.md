# 🚀 ROOMie Pre-Deployment Master Checklist

## 📋 OVERVIEW

This is your complete, actionable checklist for deploying ROOMie to production. Follow this step-by-step to ensure a successful launch.

**Current Status:** ✅ Development Complete | ⏳ Pre-Deployment Phase

---

## ✅ PHASE 1: INFRASTRUCTURE SETUP (Week 1)

### **1.1 Error Monitoring - Sentry**

**Status:** ⏳ **PENDING**

```bash
# Install Sentry
npm install @sentry/react @sentry/vite-plugin

# Sign up at https://sentry.io
# Get DSN: https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

**Tasks:**
- [ ] Create Sentry account
- [ ] Create new React project in Sentry
- [ ] Copy DSN to `.env.production`
- [ ] Create `src/config/sentry.config.ts`
- [ ] Initialize Sentry in `src/main.tsx`
- [ ] Test error reporting in development
- [ ] Verify errors appear in Sentry dashboard

**Environment Variable:**
```bash
VITE_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

---

### **1.2 Analytics - 

**

**Status:** ⏳ **PENDING**

```bash
# Install Aptabase
npm install @aptabase/react

# Sign up at https://aptabase.com
# Get App Key: A-XXXXXXXXXXXXXXXXXX
```

**Tasks:**
- [ ] Create Aptabase account
- [ ] Create new web app
- [ ] Copy App Key to `.env.production`
- [ ] Create `src/config/analytics.config.ts`
- [ ] Initialize Aptabase in `src/main.tsx`
- [ ] Add tracking events to key actions
- [ ] Test events in Aptabase dashboard

**Environment Variable:**
```bash
VITE_APTABASE_KEY=A-XXXXXXXXXXXXXXXXXX
```

---

### **1.3 Uptime Monitoring - UptimeRobot**

**Status:** ⏳ **PENDING**

**Tasks:**
- [ ] Sign up at https://uptimerobot.com (free tier)
- [ ] Add HTTPS monitor for production URL
- [ ] Set check interval to 5 minutes
- [ ] Add email alert contact
- [ ] Add SMS alert contact (optional)
- [ ] Test alert by pausing monitor

---

### **1.4 Database Backups - Supabase**

**Status:** ✅ **INCLUDED** (Verify)

**Tasks:**
- [ ] Login to Supabase Dashboard
- [ ] Navigate to Database → Backups
- [ ] Verify daily backups are enabled
- [ ] Download manual backup before deployment
- [ ] Document backup restoration procedure
- [ ] Test backup restoration in staging

---

## ✅ PHASE 2: DEPLOYMENT SETUP (Week 1-2)

### **2.1 Vercel Account & Project Setup**

**Status:** ⏳ **PENDING**

**Tasks:**
- [ ] Create Vercel account (https://vercel.com/signup)
- [ ] Connect GitHub account
- [ ] Import `roomi-campus-nest-1` repository
- [ ] Select "Vite" framework preset
- [ ] Configure build settings:
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Install Command: `npm install`

---

### **2.2 Environment Variables Configuration**

**Status:** ⏳ **PENDING**

**Critical Variables to Add in Vercel:**

```bash
# === SUPABASE ===
VITE_SUPABASE_URL=https://ymqnbekeqarjmxftzvks.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# === PAYSTACK (LIVE KEYS) ===
VITE_PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxxxxx
VITE_PAYSTACK_BASE_URL=https://api.paystack.co
VITE_PAYSTACK_CALLBACK_URL=https://your-domain.vercel.app/payment/callback

# === APPLICATION ===
VITE_APP_NAME=ROOMie
VITE_APP_VERSION=1.0.0
VITE_APP_BASE_URL=https://your-domain.vercel.app
MODE=production

# === COMMISSION RATES ===
VITE_PLATFORM_COMMISSION_RATE=0.05
VITE_AGENT_COMMISSION_RATE=0.037
VITE_PLATFORM_FEE=100
VITE_AGENT_MINIMUM_FEE=100
VITE_PAYSTACK_FEE_RATE=0.0195
VITE_VAT_RATE=0.125

# === FEATURE FLAGS ===
VITE_PAYMENT_ENABLED=true
VITE_UPLOAD_ENABLED=true
VITE_ANALYTICS_ENABLED=true
VITE_NOTIFICATIONS_ENABLED=true

# === MONITORING ===
VITE_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
VITE_APTABASE_KEY=A-XXXXXXXXXXXXXXXXXX

# === FILE UPLOAD ===
VITE_MAX_IMAGE_SIZE=5242880
VITE_MAX_IMAGES_PER_PROPERTY=10
VITE_IMAGE_COMPRESSION_QUALITY=0.8
```

**Tasks:**
- [ ] Copy all environment variables to Vercel
- [ ] Verify each variable is correct
- [ ] Double-check LIVE Paystack keys (not test keys)
- [ ] Update callback URLs with production domain
- [ ] Save and verify

---

### **2.3 Paystack Webhook Configuration**

**Status:** ⏳ **PENDING**

**Tasks:**

**Step 1: Update Supabase Secrets**
```bash
# Switch to LIVE Paystack secret key
supabase secrets set PAYSTACK_SECRET_KEY=sk_live_your_actual_live_secret_key

# Verify
supabase secrets list
```

**Step 2: Configure Paystack Dashboard**
- [ ] Login to Paystack Dashboard (https://dashboard.paystack.com)
- [ ] **Switch to LIVE MODE** (toggle in top-right)
- [ ] Navigate to Settings → API Keys & Webhooks
- [ ] Add Webhook URL: `https://ymqnbekeqarjmxftzvks.supabase.co/functions/v1/paystack-webhook`
- [ ] Select events:
  - ✅ `charge.success`
  - ✅ `paymentrequest.success`
  - ✅ `refund.processed`
- [ ] Click Save Changes

**Step 3: Test Webhook**
```bash
# Test webhook endpoint
curl -X POST https://ymqnbekeqarjmxftzvks.supabase.co/functions/v1/paystack-webhook \
  -H "Content-Type: application/json" \
  -H "x-paystack-signature: test" \
  -d '{"event":"charge.success","data":{"reference":"test_ref"}}'
```

- [ ] Verify webhook responds (200 OK or 400)
- [ ] Check Supabase logs for webhook processing
- [ ] Test with real payment in test mode first

---

### **2.4 Deploy to Vercel**

**Status:** ⏳ **PENDING**

**Tasks:**
- [ ] Click "Deploy" in Vercel dashboard
- [ ] Wait for build to complete (~2-3 minutes)
- [ ] Verify deployment succeeded
- [ ] Get production URL: `https://your-project-name.vercel.app`
- [ ] Visit production URL and verify site loads
- [ ] Check browser console for errors
- [ ] Test basic navigation

---

## ✅ PHASE 3: POST-DEPLOYMENT VERIFICATION (Week 2)

### **3.1 Functional Testing**

**Status:** ⏳ **PENDING**

**Authentication:**
- [ ] Visit `/login` page
- [ ] Create new test account
- [ ] Verify email confirmation works
- [ ] Login with test account
- [ ] Logout and login again
- [ ] Test password reset flow

**Property Browsing:**
- [ ] Visit `/student/properties`
- [ ] Verify properties load from database
- [ ] Test filtering by university
- [ ] Test filtering by price range
- [ ] Test filtering by property type
- [ ] Verify images load correctly
- [ ] Test property detail page

**Booking Flow:**
- [ ] Start booking process
- [ ] Complete all 5 steps
- [ ] Verify student verification works
- [ ] Test payment with Paystack test card:
  - Card: 4084 0840 8408 4081
  - CVV: 408
  - Expiry: Any future date
  - PIN: 0000
  - OTP: 123456
- [ ] Verify booking confirmation
- [ ] Check webhook updated booking status
- [ ] Verify receipt download works

**Owner Portal:**
- [ ] Login as property owner
- [ ] View owner dashboard
- [ ] Verify property listings load
- [ ] Test property edit modal
- [ ] Verify revenue analytics display
- [ ] Test property creation flow

**Admin Portal:**
- [ ] Login as admin
- [ ] View admin dashboard
- [ ] Verify Finance Dashboard loads
- [ ] Test Properties Edit Modal
- [ ] Verify commission calculations
- [ ] Test user management features

---

### **3.2 Performance Testing**

**Status:** ⏳ **PENDING**

**Tasks:**
- [ ] Run Lighthouse audit (target: 90+ performance)
- [ ] Test on 3G connection (Ghana mobile simulation)
- [ ] Verify images load with lazy loading
- [ ] Check Time to First Byte (TTFB < 600ms)
- [ ] Verify Core Web Vitals:
  - LCP (Largest Contentful Paint) < 2.5s
  - FID (First Input Delay) < 100ms
  - CLS (Cumulative Layout Shift) < 0.1

**Tools:**
- Chrome DevTools → Lighthouse
- WebPageTest.org
- GTmetrix.com

---

### **3.3 Security Testing**

**Status:** ⏳ **PENDING**

**Tasks:**
- [ ] Verify HTTPS is enforced
- [ ] Test authentication flows for vulnerabilities
- [ ] Verify payment data is not logged
- [ ] Check for exposed API keys in client code
- [ ] Test CORS configuration
- [ ] Verify Supabase RLS policies are active
- [ ] Test file upload restrictions
- [ ] Verify webhook signature validation

---

### **3.4 Monitoring Setup**

**Status:** ⏳ **PENDING**

**Sentry:**
- [ ] Verify errors are being captured
- [ ] Set up error alerts (email/Slack)
- [ ] Configure error grouping rules
- [ ] Set up release tracking

**Aptabase:**
- [ ] Verify events are being tracked
- [ ] Create custom dashboards
- [ ] Set up conversion funnels
- [ ] Monitor key metrics

**Vercel Analytics:**
- [ ] Enable Web Analytics in Vercel dashboard
- [ ] Monitor Core Web Vitals
- [ ] Track page views and unique visitors

**UptimeRobot:**
- [ ] Verify uptime monitoring is active
- [ ] Test alert notifications
- [ ] Set up status page (optional)

---

## ✅ PHASE 4: LEGAL & COMPLIANCE (Week 2-3)

### **4.1 Critical Legal Documents**

**Status:** ⏳ **PENDING**

**Must Complete Before Launch:**
- [ ] Terms and Conditions (drafted and reviewed by lawyer)
- [ ] Privacy Policy (drafted and reviewed by lawyer)
- [ ] Refund & Cancellation Policy (finalized)
- [ ] Cookie Policy (implemented with consent banner)

**Implementation:**
- [ ] Add legal pages to footer
- [ ] Implement cookie consent banner
- [ ] Add terms acceptance checkbox on signup
- [ ] Link policies in booking flow
- [ ] Create `/legal/terms` route
- [ ] Create `/legal/privacy` route
- [ ] Create `/legal/refund` route
- [ ] Create `/legal/cookies` route

**Budget:** GHS 10,000 - 17,000 for legal review

**Recommended Law Firms (Ghana):**
- Bentsi-Enchill, Letsa & Ankomah
- Reindorf Chambers
- AB & David Africa

---

### **4.2 Ghana Regulatory Compliance**

**Status:** ⏳ **PENDING**

**Data Protection Commission:**
- [ ] Register as data controller
- [ ] Appoint Data Protection Officer (if required)
- [ ] Submit compliance documentation
- [ ] Set up annual reporting schedule

**Ghana Revenue Authority (GRA):**
- [ ] Register for TIN (Tax Identification Number)
- [ ] Register for VAT (if applicable)
- [ ] Set up monthly/quarterly tax filing schedule

**Registrar General's Department:**
- [ ] Verify business name registration
- [ ] Verify company incorporation
- [ ] Update business details if needed

---

## ✅ PHASE 5: LANDING PAGE & MARKETING (Week 3-4)

### **5.1 Landing Page Redesign**

**Status:** ⏳ **PENDING**

**Tasks:**
- [ ] Review `LANDING_PAGE_COPY_REWRITE.md`
- [ ] Create design mockups in Figma
- [ ] Implement new landing page copy
- [ ] Add trust signals (stats, testimonials)
- [ ] Implement owner/agent business value section
- [ ] Add pricing transparency section
- [ ] Optimize for mobile
- [ ] A/B test headline variations

---

### **5.2 Marketing Materials**

**Status:** ⏳ **PENDING**

**Tasks:**
- [ ] Create social media graphics
- [ ] Design property owner brochure
- [ ] Create student onboarding guide
- [ ] Design email templates
- [ ] Create WhatsApp message templates
- [ ] Design campus flyers/posters
- [ ] Create demo video (2-3 minutes)

---

## ✅ PHASE 6: SOFT LAUNCH (Week 4)

### **6.1 Beta Testing**

**Status:** ⏳ **PENDING**

**Tasks:**
- [ ] Recruit 10-20 beta testers
  - 5-8 students
  - 3-5 property owners
  - 2-3 agents
- [ ] Create beta testing guide
- [ ] Set up feedback collection form
- [ ] Monitor beta user activity
- [ ] Collect and analyze feedback
- [ ] Fix critical issues
- [ ] Iterate based on feedback

---

### **6.2 Campus Partnerships**

**Status:** ⏳ **PENDING**

**Target Universities:**
- [ ] UPSA (University of Professional Studies, Accra)
- [ ] University of Ghana (Legon)
- [ ] KNUST (Kwame Nkrumah University of Science and Technology)
- [ ] UCC (University of Cape Coast)
- [ ] UEW (University of Education, Winneba)

**Tasks per University:**
- [ ] Contact student affairs office
- [ ] Present ROOMie platform
- [ ] Negotiate partnership terms
- [ ] Get approval for campus marketing
- [ ] Set up campus ambassador program

---

## ✅ PHASE 7: FULL LAUNCH (Week 5)

### **7.1 Launch Day Checklist**

**Status:** ⏳ **PENDING**

**Morning of Launch:**
- [ ] Verify all systems operational
- [ ] Check Sentry for any overnight errors
- [ ] Verify Paystack webhook is responding
- [ ] Check database backups are current
- [ ] Verify uptime monitoring is active
- [ ] Prepare support team for inquiries

**Launch Announcement:**
- [ ] Post on social media (Facebook, Twitter, Instagram)
- [ ] Send email to beta testers
- [ ] Post in university WhatsApp groups
- [ ] Update website with launch banner
- [ ] Press release to Ghana tech blogs

**Monitoring (First 24 Hours):**
- [ ] Monitor Sentry for errors (check every 2 hours)
- [ ] Monitor Aptabase for user activity
- [ ] Monitor Paystack for payment issues
- [ ] Monitor support channels (email, WhatsApp)
- [ ] Track conversion rates
- [ ] Monitor server performance

---

### **7.2 Post-Launch Support**

**Status:** ⏳ **PENDING**

**Week 1 After Launch:**
- [ ] Daily error monitoring
- [ ] Daily user feedback review
- [ ] Daily performance checks
- [ ] Hot-fix critical issues immediately
- [ ] Collect user testimonials
- [ ] Monitor social media mentions

**Week 2-4 After Launch:**
- [ ] Weekly performance reports
- [ ] Weekly user feedback analysis
- [ ] Bi-weekly feature updates
- [ ] Monthly analytics review
- [ ] Quarterly legal compliance review

---

## 📊 SUCCESS METRICS

### **Launch Goals (First Month):**

**User Acquisition:**
- [ ] 100+ student signups
- [ ] 20+ property listings
- [ ] 5+ agent signups

**Engagement:**
- [ ] 50+ property views per day
- [ ] 10+ bookings completed
- [ ] 70%+ booking completion rate

**Revenue:**
- [ ] GHS 5,000+ in platform fees
- [ ] GHS 500+ in commission earnings

**Technical:**
- [ ] 99.9% uptime
- [ ] <5% error rate
- [ ] <2s average page load time

---

## 🚨 ROLLBACK PLAN

### **If Critical Issues Arise:**

**Immediate Actions:**
1. [ ] Pause new user signups
2. [ ] Display maintenance banner
3. [ ] Notify active users via email
4. [ ] Investigate root cause
5. [ ] Fix issue in staging
6. [ ] Test fix thoroughly
7. [ ] Deploy fix to production
8. [ ] Resume normal operations
9. [ ] Post-mortem analysis

**Rollback Procedure:**
```bash
# Revert to previous deployment in Vercel
vercel rollback

# Or redeploy previous commit
git revert HEAD
git push origin main
```

---

## 📞 EMERGENCY CONTACTS

**Technical Issues:**
- Supabase Support: support@supabase.io
- Vercel Support: support@vercel.com
- Paystack Support: support@paystack.com

**Legal Issues:**
- Law Firm: [Your chosen firm]
- Data Protection Commission: info@dataprotection.org.gh

**Business Issues:**
- Founder/CEO: [Your contact]
- CTO: [Your contact]
- Support Lead: [Your contact]

---

## ✅ FINAL PRE-LAUNCH CHECKLIST

**24 Hours Before Launch:**
- [ ] All environment variables configured
- [ ] All legal documents published
- [ ] All monitoring tools active
- [ ] All team members briefed
- [ ] Support channels ready
- [ ] Backup plan documented
- [ ] Rollback procedure tested

**Launch Day:**
- [ ] Deploy to production
- [ ] Verify deployment successful
- [ ] Run smoke tests
- [ ] Announce launch
- [ ] Monitor closely

**You're Ready to Launch! 🚀**

---

**END OF PRE-DEPLOYMENT MASTER CHECKLIST**

