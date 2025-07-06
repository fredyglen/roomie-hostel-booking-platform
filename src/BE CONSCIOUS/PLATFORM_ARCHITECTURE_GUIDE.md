# ROOMi Platform Architecture Guide

## Apple-Grade Development Standards & Architecture Patterns

This document outlines the comprehensive architecture patterns, data flows, and integration standards for the ROOMi platform, following Apple-level development practices.

## 🏗️ Architecture Overview

### Core Principles
- **Zero Tolerance for `any` Types**: Complete type safety throughout the codebase
- **Branded Types**: Compile-time type safety for IDs and domain objects
- **Immutable Data Structures**: All entities use `readonly` properties
- **Comprehensive Error Handling**: Structured error responses with detailed context
- **Performance First**: Optimized for mobile-first Ghana market conditions

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite (PWA)
- **Backend**: Supabase (PostgreSQL + Real-time + Auth + Storage)
- **Payments**: Paystack (Ghana mobile money + cards)
- **State Management**: Zustand with TypeScript
- **Styling**: Tailwind CSS with mobile-first approach
- **Deployment**: Vercel (Edge functions for Ghana proximity)

## 📊 Data Architecture

### Entity Relationship Model

```
Users (Students, Owners, Agents, Admins)
  ↓
Properties (Hostels, Apartments, Homestels)
  ↓
Rooms (1-4 occupancy types)
  ↓
Beds (Individual booking units)
  ↓
Bookings (Semester-based reservations)
  ↓
Payments (Paystack transactions)
```

### Core Data Flows

#### 1. Student Booking Flow
```typescript
Student Search → Property Discovery → Room Selection → 
Bed Reservation → Document Upload → Payment Processing → 
Booking Confirmation → Check-in Management
```

#### 2. Owner Property Management Flow
```typescript
Property Registration → Room Configuration → 
Media Upload → Verification Process → 
Booking Management → Payment Collection
```

#### 3. Payment Processing Flow
```typescript
Booking Creation → Payment Initialization → 
Paystack Integration → Transaction Verification → 
Commission Distribution → Settlement Processing
```

## 🔄 API Architecture

### RESTful API Design Patterns

#### Standard Response Format
```typescript
interface ApiResponse<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: ApiError;
  readonly message?: string;
  readonly timestamp: string;
  readonly request_id: string;
}
```

#### Error Handling Pattern
```typescript
interface ApiError {
  readonly code: string;
  readonly message: string;
  readonly details?: Record<string, unknown>;
  readonly field_errors?: Record<string, readonly string[]>;
}
```

#### Pagination Pattern
```typescript
interface PaginatedResponse<T> {
  readonly data: readonly T[];
  readonly pagination: PaginationInfo;
  readonly total_count: number;
  readonly has_next_page: boolean;
  readonly has_previous_page: boolean;
}
```

### API Endpoints Structure

#### Authentication Endpoints
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - User logout
- `POST /auth/reset-password` - Password reset

#### Property Management Endpoints
- `GET /properties` - Search and filter properties
- `POST /properties` - Create new property
- `GET /properties/:id` - Get property details
- `PUT /properties/:id` - Update property
- `DELETE /properties/:id` - Delete property
- `GET /properties/:id/availability` - Check availability

#### Booking Management Endpoints
- `POST /bookings` - Create booking
- `GET /bookings` - List user bookings
- `GET /bookings/:id` - Get booking details
- `PUT /bookings/:id/status` - Update booking status
- `POST /bookings/:id/cancel` - Cancel booking

#### Payment Processing Endpoints
- `POST /payments/initialize` - Initialize payment
- `POST /payments/verify` - Verify payment
- `POST /payments/refund` - Process refund
- `GET /payments/history` - Payment history

## 🔐 Security Architecture

### Authentication & Authorization

#### JWT Token Structure
```typescript
interface JWTPayload {
  readonly user_id: UserId;
  readonly role: UserRole;
  readonly email: string;
  readonly verification_status: VerificationStatus;
  readonly iat: number;
  readonly exp: number;
}
```

#### Role-Based Access Control (RBAC)
```typescript
const ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: ['manage_users', 'manage_properties', 'manage_platform'],
  [UserRole.OWNER]: ['manage_own_properties', 'view_own_bookings'],
  [UserRole.AGENT]: ['manage_assigned_properties', 'view_assigned_bookings'],
  [UserRole.STUDENT]: ['view_properties', 'create_bookings', 'manage_own_profile']
} as const;
```

### Data Protection

#### Row Level Security (RLS) Policies
- Users can only access their own data
- Property owners can only manage their properties
- Agents can only access assigned properties
- Students can only view their bookings

#### Input Validation & Sanitization
- Zod schemas for all API inputs
- SQL injection prevention through parameterized queries
- XSS protection through content sanitization
- File upload validation and virus scanning

## 💳 Payment Integration Architecture

### Paystack Integration Pattern

#### Payment Flow
```typescript
1. Payment Initialization
   ↓
2. Paystack Checkout
   ↓
3. Transaction Verification
   ↓
4. Webhook Processing
   ↓
5. Commission Distribution
   ↓
6. Settlement Processing
```

#### Commission Calculation
```typescript
interface PaymentBreakdown {
  readonly base_amount: number;           // Property price
  readonly platform_commission: number;   // 5% platform fee
  readonly agent_commission: number;      // 3.7% agent fee (if applicable)
  readonly paystack_fee: number;         // 1.95% payment processing
  readonly total_amount: number;         // Total charged to student
  readonly owner_receives: number;       // Amount to property owner
}
```

### Mobile Money Integration (Ghana)
- MTN Mobile Money
- Vodafone Cash
- AirtelTigo Money
- Bank transfers and USSD codes

## 📱 Frontend Architecture

### Component Architecture

#### Atomic Design Pattern
```
Atoms (Buttons, Inputs, Icons)
  ↓
Molecules (SearchBar, PropertyCard, BookingForm)
  ↓
Organisms (PropertyList, BookingWizard, PaymentFlow)
  ↓
Templates (PropertySearchTemplate, BookingTemplate)
  ↓
Pages (HomePage, PropertyDetailsPage, BookingPage)
```

#### State Management Pattern
```typescript
// Zustand store structure
interface AppState {
  readonly auth: AuthState;
  readonly properties: PropertyState;
  readonly bookings: BookingState;
  readonly payments: PaymentState;
  readonly ui: UIState;
}
```

### Mobile-First Design Principles

#### Responsive Breakpoints
- Mobile: 320px - 768px (Primary focus)
- Tablet: 768px - 1024px
- Desktop: 1024px+ (Secondary)

#### Performance Optimization
- Image lazy loading and optimization
- Code splitting by routes
- Service worker for offline functionality
- Critical CSS inlining
- Bundle size optimization

## 🔄 Real-time Features

### Supabase Real-time Subscriptions

#### Property Availability Updates
```typescript
supabase
  .channel('property-availability')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'properties',
    filter: 'available_beds=neq.0'
  }, handleAvailabilityUpdate)
  .subscribe();
```

#### Booking Status Updates
```typescript
supabase
  .channel(`booking-${bookingId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'bookings',
    filter: `id=eq.${bookingId}`
  }, handleBookingUpdate)
  .subscribe();
```

## 📊 Analytics & Monitoring

### Performance Monitoring
- Core Web Vitals tracking
- API response time monitoring
- Error rate tracking
- User journey analytics

### Business Intelligence
- Booking conversion rates
- Property performance metrics
- Payment success rates
- User engagement analytics

## 🚀 Deployment Architecture

### Environment Configuration
- **Development**: Local Supabase + Paystack test keys
- **Staging**: Supabase staging + Paystack test keys
- **Production**: Supabase production + Paystack live keys

### CI/CD Pipeline
```yaml
1. Code Push → GitHub
2. Automated Tests → Jest + Playwright
3. Type Checking → TypeScript compiler
4. Build → Vite production build
5. Deploy → Vercel Edge Functions
6. Monitoring → Error tracking + Performance
```

### Scalability Considerations
- CDN for static assets (images, videos)
- Database connection pooling
- API rate limiting
- Horizontal scaling with Vercel Edge Functions
- Caching strategies for frequently accessed data

## 🔧 Development Standards

### Code Quality Standards
- 100% TypeScript coverage (zero `any` types)
- ESLint + Prettier configuration
- Husky pre-commit hooks
- Comprehensive unit and integration tests
- API documentation with OpenAPI/Swagger

### File Organization
```
src/
├── types/                 # Type definitions
│   ├── platform-core.ts   # Core types and enums
│   ├── platform-entities.ts # Business entities
│   ├── platform-api.ts    # API contracts
│   └── business-rules.ts  # Business logic types
├── components/            # React components
├── services/             # API services
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
├── constants/            # Application constants
└── BE CONSCIOUS/         # Architecture documentation
```

This architecture guide ensures maintainable, scalable, and type-safe development following Apple-grade standards for the ROOMi platform.
