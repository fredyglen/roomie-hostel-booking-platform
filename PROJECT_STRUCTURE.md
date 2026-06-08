# ROOMie Project Structure Documentation

Complete guide to every file and folder in the codebase.
Generated: April 2026

---

## Root Source Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main app component - contains routing, providers, and app-wide setup |
| `src/App.css` | Global app styles |
| `src/main.tsx` | Application entry point - renders App component to DOM |
| `src/index.css` | Global CSS styles, Tailwind imports, custom properties |
| `src/vite-env.d.ts` | TypeScript type declarations for Vite environment |
| `src/supabase-setup.sql` | Database schema setup SQL script |

---

## 📁 `src/pages/` - Page Components (80 files)

Full-screen pages that correspond to routes.

### Public/Landing Pages
| File | Route | Purpose |
|------|-------|---------|
| `Welcome.tsx` | `/welcome` | First-time user welcome screen with slideshow |
| `Landing.tsx` | `/landing` | Main marketing landing page |
| `OwnerLanding.tsx` | `/owner-landing` | Landing page for property owners |
| `ModernHomepage.tsx` | `/` | Alternative homepage design |

### Informational Pages
| File | Route | Purpose |
|------|-------|---------|
| `About.tsx` | `/about` | About ROOMie company page |
| `Pricing.tsx` | `/pricing` | Pricing information for students and owners |
| `HelpFAQ.tsx` | `/help-faq` | Help center and FAQ page |
| `HowItWorks.tsx` | `/how-it-works` | How ROOMie works explanation |
| `Transparency.tsx` | `/transparency` | Legal documents and transparency info |
| `Contact.tsx` | `/contact` | Contact form and information |
| `TrustSafety.tsx` | `/trust-safety` | Trust and safety information |
| `Resources.tsx` | `/resources` | Student resources page |

### Authentication Pages
| File | Route | Purpose |
|------|-------|---------|
| `Login.tsx` | `/login` | User login page |
| `Register.tsx` | `/register` | User registration page |
| `ForgotPassword.tsx` | `/forgot-password` | Password reset request |
| `ResetPassword.tsx` | `/reset-password` | Set new password page |
| `VerifyEmail.tsx` | `/verify-email` | Email verification page |

### Student Pages (`pages/student/`)
| File | Route | Purpose |
|------|-------|---------|
| `StudentDashboard.tsx` | `/student/dashboard` | Student main dashboard |
| `PropertyListing.tsx` | `/student/properties` | Browse/search properties |
| `PropertyDetail.tsx` | `/student/property/:id` | Individual property view |
| `Booking.tsx` | `/student/booking/:id` | Make a booking |
| `Checkout.tsx` | `/student/checkout` | Checkout and payment |
| `MyBookings.tsx` | `/student/bookings` | View my bookings |
| `Favorites.tsx` | `/student/favorites` | Saved favorite properties |
| `Profile.tsx` | `/student/profile` | Student profile management |
| `RoommateMatching.tsx` | `/student/roommates` | Find compatible roommates |
| `RoommateProfile.tsx` | `/student/roommate-profile` | Roommate profile setup |

### Owner Pages (`pages/owner/`)
| File | Route | Purpose |
|------|-------|---------|
| `OwnerDashboard.tsx` | `/owner/dashboard` | Owner main dashboard |
| `ListProperty.tsx` | `/owner/list-property` | Create new property listing |
| `ManageProperties.tsx` | `/owner/properties` | Manage existing properties |
| `EditProperty.tsx` | `/owner/property/:id/edit` | Edit property details |
| `OwnerBookings.tsx` | `/owner/bookings` | View bookings for owner properties |
| `OwnerProfile.tsx` | `/owner/profile` | Owner profile settings |
| `Earnings.tsx` | `/owner/earnings` | View earnings and payouts |
| `Subscription.tsx` | `/owner/subscription` | Manage subscription plan |
| `Verification.tsx` | `/owner/verification` | Owner verification process |

### Admin Pages (`pages/admin/`)
| File | Route | Purpose |
|------|-------|---------|
| `AdminDashboard.tsx` | `/admin/dashboard` | Admin main dashboard |
| `UserManagement.tsx` | `/admin/users` | Manage all users |
| `PropertyManagement.tsx` | `/admin/properties` | Manage all properties |
| `BookingManagement.tsx` | `/admin/bookings` | Manage all bookings |
| `Analytics.tsx` | `/admin/analytics` | Platform analytics |
| `ContentManagement.tsx` | `/admin/content` | Manage CMS content |
| `SupportTickets.tsx` | `/admin/support` | Handle support tickets |
| `Settings.tsx` | `/admin/settings` | Platform settings |
| `DisputeResolution.tsx` | `/admin/disputes` | Handle disputes |
| `CommissionSettings.tsx` | `/admin/commission` | Configure commission rates |
| `FeatureFlags.tsx` | `/admin/features` | Manage feature flags |
| `DatabaseSeeder.tsx` | `/admin/seeder` | Seed database with test data |
| `SubscriptionPlans.tsx` | `/admin/subscriptions` | Manage subscription tiers |

### Error/Utility Pages
| File | Purpose |
|------|---------|
| `NotFound.tsx` | 404 Not Found page |
| `Unauthorized.tsx` | 403 Unauthorized page |
| `ServerError.tsx` | 500 Server Error page |
| `Maintenance.tsx` | Site maintenance mode page |

---

## 📁 `src/components/` - Reusable Components (296 files)

### Root Level Components
| File | Purpose |
|------|---------|
| `AuthOptions.tsx` | Authentication method selection UI |
| `ErrorBoundary.tsx` | React error boundary wrapper |
| `SplashScreen.tsx` | App loading splash screen |
| `StoryViewer.tsx` | Property story/image viewer |
| `UniversitySelector.tsx` | University selection dropdown |

### Admin Components (`components/admin/`)
| File | Purpose |
|------|---------|
| `AdminAccessTest.tsx` | Test admin access permissions |
| `CampusAdminDashboard.tsx` | Campus-specific admin dashboard |
| `CampusAnalytics.tsx` | Campus-level analytics |
| `CampusComplianceSupport.tsx` | Compliance tools for Ghana campus rules |
| `CampusPropertyManagement.tsx` | Manage properties per campus |
| `CommissionConfigManager.tsx` | Configure commission settings |
| `DatabaseSeeder.tsx` | UI for seeding test data |
| `FeatureManagement.tsx` | Enable/disable platform features |
| `GhanaAdminFeatures.tsx` | Ghana-specific admin tools |
| `LocalDisputeResolution.tsx` | Handle local disputes |
| `PropertyVisibilityMonitor.tsx` | Monitor property listing status |
| `QuickPropertyVerifier.tsx` | Fast property verification UI |
| `StudentVerificationSystem.tsx` | Student document verification |
| `SubscriptionManagement.tsx` | Manage subscriptions |
| `UniversityIntegration.tsx` | University system integration |

#### Admin User Management (`components/admin/user-management/`)
| File | Purpose |
|------|---------|
| `AdminUserFilters.tsx` | Filter controls for user list |
| `AdminUserTable.tsx` | Data table for users |
| `CreateAdminUserForm.tsx` | Form to create new admin user |
| `EditAdminUserForm.tsx` | Form to edit admin user |

### Auth Components (`components/auth/`)
| File | Purpose |
|------|---------|
| `AdminAuthGuard.tsx` | Route guard for admin-only pages |
| `AuthFeedback.tsx` | Success/error feedback messages |
| `AuthRedirect.tsx` | Redirect after auth actions |
| `DocumentUpload.tsx` | ID/document upload for verification |
| `LoginRedirect.tsx` | Handle post-login redirects |
| `MultiStepRegistration.tsx` | Multi-step registration wizard |
| `PermissionGuard.tsx` | Check user permissions |
| `ProtectedRoute.tsx` | Route guard for authenticated users |
| `RegistrationPromptModal.tsx` | Modal prompting registration |
| `SimpleRegistrationForm.tsx` | Simplified registration form |
| `SimpleRegistrationModal.tsx` | Modal version of registration |

### Booking Components (`components/booking/`)
| File | Purpose |
|------|---------|
| `AdvancedBookingForm.tsx` | Complex booking with options |
| `BookingConfirmation.tsx` | Booking success confirmation |
| `BookingForm.tsx` | Standard booking form |
| `BookingSummary.tsx` | Booking details summary |
| `DateRangePicker.tsx` | Check-in/check-out date picker |
| `GuestSelector.tsx` | Number of guests selector |
| `PaymentForm.tsx` | Payment information form |

### Building Components (`components/building/`)
| File | Purpose |
|------|---------|
| `BuildingCard.tsx` | Building listing card |
| `BuildingList.tsx` | List of buildings |
| `BuildingMap.tsx` | Map view of buildings |
| `FloorPlan.tsx` | Interactive floor plan viewer |
| `OccupancyDisplay.tsx` | Show room occupancy status |
| `RoomSelector.tsx` | Select specific room |

### Common Components (`components/common/`)
| File | Purpose |
|------|---------|
| `Button.tsx` | Custom button component |
| `Card.tsx` | Card container component |
| `Checkbox.tsx` | Custom checkbox input |
| `DatePicker.tsx` | Date selection component |
| `FileUpload.tsx` | File upload with drag-drop |
| `ImageCarousel.tsx` | Image gallery carousel |
| `Input.tsx` | Text input component |
| `LoadingSpinner.tsx` | Loading indicator |
| `Logo.tsx` | ROOMie logo component |
| `Modal.tsx` | Modal/dialog wrapper |
| `Pagination.tsx` | Page navigation |
| `Rating.tsx` | Star rating display |
| `SearchBar.tsx` | Search input component |
| `Select.tsx` | Dropdown select input |
| `Skeleton.tsx` | Loading skeleton placeholders |
| `StepIndicator.tsx` | Multi-step progress indicator |
| `Toast.tsx` | Notification toast |
| `Tooltip.tsx` | Hover tooltip |

### Layout Components (`components/layout/`)
| File | Purpose |
|------|---------|
| `Footer.tsx` | Site footer |
| `Header.tsx` | Site header with navigation |
| `MobileMenu.tsx` | Mobile navigation menu |
| `PageContainer.tsx` | Page layout wrapper |
| `Sidebar.tsx` | Dashboard sidebar |
| `TopBar.tsx` | Top navigation bar |

### Legal Components (`components/legal/`)
| File | Purpose |
|------|---------|
| `LegalModal.tsx` | Modal for Terms/Privacy/Cookies |
| `LegalModalTrigger.tsx` | Button to open legal modal |
| `TermsContent.tsx` | Terms of Service content |
| `PrivacyContent.tsx` | Privacy Policy content |
| `CookiesContent.tsx` | Cookie policy content |

### Mobile Drawer Components (`components/mobile-drawers/`)
| File | Purpose |
|------|---------|
| `MobilePageDrawers.tsx` | Mobile drawer wrappers for pages |
| `PricingContent.tsx` | Drawer content for Pricing page |
| `HelpFAQContent.tsx` | Drawer content for HelpFAQ page |
| `HowItWorksContent.tsx` | Drawer content for HowItWorks page |

### Payment Components (`components/payment/`)
| File | Purpose |
|------|---------|
| `PaymentMethodSelector.tsx` | Choose payment method |
| `PaystackCheckout.tsx` | Paystack payment integration |
| `PaymentSuccess.tsx` | Payment success view |
| `PaymentFailure.tsx` | Payment failure view |
| `ReceiptViewer.tsx` | View/download receipts |

### Profile Components (`components/profile/`)
| File | Purpose |
|------|---------|
| `ProfileForm.tsx` | Edit profile information |
| `ProfilePicture.tsx` | Avatar upload and display |
| `VerificationBadge.tsx` | Show verification status |

### Property Components (`components/property/`)
| File | Purpose |
|------|---------|
| `PropertyCard.tsx` | Property listing card (legacy) |
| `PropertyDetailView.tsx` | Detailed property view |
| `PropertyFilters.tsx` | Search filters for properties |
| `PropertyGrid.tsx` | Grid layout for properties |
| `PropertyImageGallery.tsx` | Property photo gallery |
| `PropertyList.tsx` | List layout for properties |
| `PropertyMap.tsx` | Map showing properties |
| `PropertyReviews.tsx` | Property reviews section |
| `PropertyStories.tsx` | Property story highlights |
| `SearchFilters.tsx` | Advanced search filters |
| `VirtualTourViewer.tsx` | 360° virtual tour viewer |

#### Property Components (`components/properties/`)
| File | Purpose |
|------|---------|
| `HostelCard.tsx` | Hostel listing card |
| `PremiumPropertyCard.tsx` | Enhanced property card |
| `PropertyBadge.tsx` | Status badges (verified, new, etc.) |
| `PropertyImage.tsx` | Optimized property image |
| `PropertyRating.tsx` | Rating display component |

### Review Components (`components/reviews/`)
| File | Purpose |
|------|---------|
| `ReviewCard.tsx` | Individual review display |
| `ReviewForm.tsx` | Write a review form |
| `ReviewList.tsx` | List of reviews |
| `ReviewSummary.tsx` | Rating summary stats |

### Roommate Components (`components/roommate/`)
| File | Purpose |
|------|---------|
| `CompatibilityScore.tsx` | Show match percentage |
| `RoommateCard.tsx` | Roommate profile card |
| `RoommateFilters.tsx` | Filter potential roommates |
| `RoommatePreferences.tsx` | Set roommate preferences |

### UI Components (`components/ui/`)

Shadcn/ui components - 50+ standardized UI components including:
- `accordion.tsx`, `alert.tsx`, `alert-dialog.tsx`, `avatar.tsx`
- `badge.tsx`, `button.tsx`, `calendar.tsx`, `card.tsx`
- `checkbox.tsx`, `collapsible.tsx`, `command.tsx`, `context-menu.tsx`
- `dialog.tsx`, `drawer.tsx`, `dropdown-menu.tsx`
- `form.tsx`, `hover-card.tsx`, `input.tsx`, `label.tsx`
- `menubar.tsx`, `navigation-menu.tsx`, `popover.tsx`, `progress.tsx`
- `radio-group.tsx`, `scroll-area.tsx`, `select.tsx`, `separator.tsx`
- `sheet.tsx`, `skeleton.tsx`, `slider.tsx`, `switch.tsx`
- `table.tsx`, `tabs.tsx`, `textarea.tsx`, `toast.tsx`, `toggle.tsx`
- `tooltip.tsx`

---

## 📁 `src/services/` - Business Logic (37 files)

API calls, data fetching, and business logic layer.

| File | Purpose |
|------|---------|
| `admin.service.ts` | Admin operations (users, properties, bookings) |
| `analytics.service.ts` | Analytics data fetching |
| `apple-grade.service.ts` | Apple-grade property data service |
| `auth.service.ts` | Authentication (login, register, logout) |
| `booking.service.ts` | Booking CRUD operations |
| `building.service.ts` | Building data management |
| `cache.service.ts` | Caching utilities |
| `commission.service.ts` | Commission calculations |
| `content.service.ts` | CMS content management |
| `database.service.ts` | Database operations |
| `dispute.service.ts` | Dispute handling |
| `enhanced-property.service.ts` | Advanced property service |
| `favorite.service.ts` | Favorites management |
| `ghana-campus.service.ts` | Ghana campus-specific operations |
| `hostel-management.service.ts` | Hostel/property data with images |
| `image.service.ts` | Image upload and management |
| `notification.service.ts` | Push/email notifications |
| `owner.service.ts` | Owner-specific operations |
| `payment.service.ts` | Payment processing |
| `property-owner.service.ts` | Property-owner relationship |
| `property.service.ts` | Property CRUD operations |
| `review.service.ts` | Reviews management |
| `roommate.service.ts` | Roommate matching logic |
| `search.service.ts` | Property search functionality |
| `seeding.service.ts` | Database seeding |
| `storage.service.ts` | File storage operations |
| `student.service.ts` | Student-specific operations |
| `subscription.service.ts` | Subscription management |
| `support.service.ts` | Support ticket operations |
| `university.service.ts` | University data |
| `user.service.ts` | User profile operations |
| `verification.service.ts` | Document verification |
| `virtual-tour.service.ts` | Virtual tour operations |
| `webhook.service.ts` | Webhook handlers |

---

## 📁 `src/hooks/` - Custom React Hooks (68 files)

Reusable logic hooks.

| File | Purpose |
|------|---------|
| `useAdmin.ts` | Admin status and permissions |
| `useAnalytics.ts` | Analytics data hook |
| `useAuth.ts` | Authentication state |
| `useBooking.ts` | Booking operations |
| `useCache.ts` | Caching hook |
| `useCampus.ts` | Campus context |
| `useDebounce.ts` | Debounce user input |
| `useFavorites.ts` | Manage favorites |
| `useForm.ts` | Form handling |
| `useImageUpload.ts` | Image upload logic |
| `useLocalStorage.ts` | LocalStorage access |
| `useMediaQuery.ts` | Responsive breakpoints |
| `useNotifications.ts` | Notification management |
| `useOwner.ts` | Owner context |
| `usePagination.ts` | Pagination logic |
| `usePayment.ts` | Payment operations |
| `useProperties.ts` | Property list management |
| `useProperty.ts` | Single property operations |
| `useReviews.ts` | Reviews data |
| `useRoommate.ts` | Roommate matching |
| `useSearch.ts` | Search functionality |
| `useStudent.ts` | Student context |
| `useSubscription.ts` | Subscription status |
| `useToast.ts` | Toast notifications |
| `useUniversity.ts` | University data |
| `useUser.ts` | User profile data |
| `useVerification.ts` | Verification status |
| `useVirtualTour.ts` | Virtual tour state |

---

## 📁 `src/types/` - TypeScript Types (29 files)

Type definitions for the entire app.

| File | Purpose |
|------|---------|
| `admin.ts` | Admin user types |
| `analytics.ts` | Analytics data types |
| `api.ts` | API response/request types |
| `booking.ts` | Booking data types |
| `building.ts` | Building types |
| `commission.ts` | Commission types |
| `enums.ts` | Enum definitions |
| `errors.ts` | Error types |
| `hostel-management.ts` | Hostel management types |
| `index.ts` | Type exports |
| `maintenance.ts` | Maintenance types |
| `payment.ts` | Payment types |
| `paystack.ts` | Paystack integration types |
| `platform-api.ts` | Platform API types |
| `platform-core.ts` | Core platform types |
| `platform-entities.ts` | Entity definitions |
| `property.ts` | Property types |
| `result.ts` | Result wrapper types |
| `reviews.ts` | Review types |
| `roles.ts` | User role types |
| `subscription.ts` | Subscription types |
| `UserTypes.ts` | User type definitions |

---

## 📁 `src/utils/` - Utility Functions (34 files)

Helper functions and utilities.

| File | Purpose |
|------|---------|
| `admin-setup.ts` | Admin account setup |
| `apiClient.ts` | API client configuration |
| `apiErrorInterceptor.ts` | API error handling |
| `bookingCalculations.ts` | Booking math utilities |
| `bundleOptimization.ts` | Code splitting helpers |
| `csrf-protection.ts` | CSRF security |
| `currency.ts` | Currency formatting |
| `data-seeder.ts` | Test data generation |
| `enhanced-logger.ts` | Advanced logging |
| `env-validator.ts` | Environment validation |
| `ErrorHandler.ts` | Error handling utilities |
| `executeHostelSeeding.ts` | Seed hostel data |
| `formatters.ts` | Data formatting |
| `formErrorUtils.ts` | Form error handling |
| `image-optimizer.ts` | Image optimization |
| `imageOptimization.ts` | Image processing |
| `input-sanitizer.ts` | Input sanitization |
| `logger.ts` | Basic logging |
| `navigation.ts` | Navigation helpers |
| `paymentCalculations.ts` | Payment math |
| `paystack-errors.ts` | Paystack error handling |
| `paystack-verification.ts` | Paystack verification |
| `paystackIntegration.ts` | Paystack integration |
| `property-adapter.ts` | Property data adapter |
| `propertyPreviewCache.ts` | Property cache |
| `propertyTransforms.ts` | Property data transforms |
| `seed-ghana-hostels.ts` | Ghana hostel seeding |
| `toast.ts` | Toast notifications |

---

## 📁 `src/api/` - API Layer (5 files)

Direct API communication.

| File | Purpose |
|------|---------|
| `apple-grade-auth.service.ts` | Apple-grade authentication |
| `authService.ts` | Authentication API |
| `bookingService.ts` | Booking API |
| `propertyService.ts` | Property API |
| `userService.ts` | User API |

---

## 📁 `src/config/` - Configuration (13 files)

App configuration files.

| File | Purpose |
|------|---------|
| `app.config.ts` | App-wide configuration |
| `auth.config.ts` | Authentication config |
| `business-rules.ts` | Business rule definitions |
| `campus.config.ts` | Campus settings |
| `feature-flags.ts` | Feature flag definitions |
| `ghana.config.ts` | Ghana-specific config |
| `payment.config.ts` | Payment settings |
| `routes.config.ts` | Route definitions |
| `seo.config.ts` | SEO metadata |
| `supabase.config.ts` | Supabase configuration |
| `theme.config.ts` | Theme settings |
| `universities.ts` | University list |

---

## 📁 `src/constants/` - Constants (4 files)

Constant values.

| File | Purpose |
|------|---------|
| `api.constants.ts` | API endpoints |
| `app.constants.ts` | App constants |
| `error-messages.ts` | Error message strings |
| `routes.ts` | Route path constants |

---

## 📁 `src/context/` - React Context (2 files)

Global state providers.

| File | Purpose |
|------|---------|
| `AuthContext.tsx` | Authentication state |
| `ThemeContext.tsx` | Theme state |

---

## 📁 `src/lib/` - Library Code (8 files)

Third-party library configurations.

| File | Purpose |
|------|---------|
| `queryClient.ts` | React Query setup |
| `supabase.ts` | Supabase client |
| `utils.ts` | Utility functions |
| `validations.ts` | Validation schemas |

---

## 📁 `src/schemas/` - Validation Schemas (2 files)

Zod/Yup validation schemas.

| File | Purpose |
|------|---------|
| `authSchemas.ts` | Auth form validation |
| `propertySchemas.ts` | Property form validation |

---

## 📁 `src/scripts/` - Scripts (13 files)

Utility scripts.

| File | Purpose |
|------|---------|
| `createAdmin.ts` | Create admin user |
| `createTestData.ts` | Generate test data |
| `db-setup.ts` | Database setup |
| `seedDatabase.ts` | Seed database |
| `syncUniversities.ts` | Sync university data |

---

## 📁 `src/tests/` - Test Files (30 files)

Test suites.

| File | Purpose |
|------|---------|
| `setup.ts` | Test setup |
| `auth.test.ts` | Auth tests |
| `booking.test.ts` | Booking tests |
| `property.test.ts` | Property tests |
| `utils.test.ts` | Utility tests |

---

## Documentation Folders

### `src/BE CONSCIOUS/` (15 files)
Development standards and guidelines.
- `ANTI_HARDCODED_DATA_STANDARDS.md`
- `APPLE GRADE.MD`
- `APPLE LEVEL GRADE.MD`
- `CODE GENERATION SYSTEM SUPPORT.MD`
- `COMPREHENSIVE_ROOMI_PLATFORM_DOCUMENTATION.md`
- `CONFIGURATION_MIGRATION_GUIDE.md`
- `DATABASE_COST_OPTIMIZATION_ANALYSIS.md`
- `MANDATORY_DEVELOPMENT_PROTOCOL.md`
- `NO TOLERANCE.MD`
- `PLATFORM_ARCHITECTURE_GUIDE.md`
- `ROOMI_COMPREHENSIVE_TECHNICAL_ANALYSIS.md`
- `TASK PLAM.md`
- `TROUBLESHOOTING_PROTOCOL.md`
- `platform-definitions.ts`

### `src/be_conscious/` (5 files)
Additional dev docs.
- `PROPERTY_PIPELINE_CONTRACT.md`
- `ROOMIE_DEV_WORKFLOW.md`
- `code_standards.md`
- `decision_log.md`
- `project_state.md`

### `src/docs/` (2 files)
General documentation.

### `src/paystack docs/` (1 file)
Paystack integration docs.

---

## Quick Reference by Feature

| Feature | Key Files |
|---------|-----------|
| **Authentication** | `pages/Login.tsx`, `pages/Register.tsx`, `services/auth.service.ts`, `hooks/useAuth.ts`, `components/auth/` |
| **Properties** | `pages/student/PropertyListing.tsx`, `pages/student/PropertyDetail.tsx`, `services/property.service.ts`, `components/properties/` |
| **Bookings** | `pages/student/Booking.tsx`, `pages/student/Checkout.tsx`, `services/booking.service.ts`, `components/booking/` |
| **Payments** | `components/payment/`, `services/payment.service.ts`, `utils/paystackIntegration.ts` |
| **Admin** | `pages/admin/`, `components/admin/`, `services/admin.service.ts` |
| **Owner** | `pages/owner/`, `services/owner.service.ts` |
| **Student** | `pages/student/`, `services/student.service.ts` |
| **Roommate** | `pages/student/RoommateMatching.tsx`, `components/roommate/`, `services/roommate.service.ts` |
| **Search** | `components/property/SearchFilters.tsx`, `services/search.service.ts`, `hooks/useSearch.ts` |
| **Images** | `components/common/ImageCarousel.tsx`, `utils/image-optimizer.ts`, `services/image.service.ts` |

---

## Total File Count

| Category | Count |
|----------|-------|
| Pages | ~80 |
| Components | ~296 |
| Services | ~37 |
| Hooks | ~68 |
| Types | ~29 |
| Utils | ~34 |
| Config | ~13 |
| API | ~5 |
| Tests | ~30 |
| **Total TS/TSX** | **~600+** |

---

*Last updated: April 2026*
