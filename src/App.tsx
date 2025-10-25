
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider, DefaultOptions } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/EnhancedAuthContext';
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { EnhancedErrorBoundary } from '@/components/common/EnhancedErrorBoundary';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { logger } from '@/utils/enhanced-logger';
import { unifiedConfigurationEngine } from '@/config/unified-configuration.config';
import AuthRedirect from '@/components/auth/AuthRedirect';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AdminAuthGuard, { SupremeAdminGuard, CampusAdminGuard } from '@/components/auth/AdminAuthGuard';
import AnalyticsDashboard from '@/pages/owner/AnalyticsDashboard';
import { UserRole } from '@/types/roles';
import { createAdminPermission } from '@/types/auth';
import { initializePerformanceOptimizations } from '@/utils/bundleOptimization';
import { showAuthError } from './components/auth/AuthFeedback';


// Lazy load all pages for better performance
const Index = React.lazy(() => import('@/pages/Index'));
const Landing = React.lazy(() => import('@/pages/Landing'));
const Welcome = React.lazy(() => import('@/pages/Welcome'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const PaymentSuccess = React.lazy(() => import('@/pages/PaymentSuccess'));
const TestPayment = React.lazy(() => import('@/pages/TestPayment'));
const TestAuth = React.lazy(() => import('@/pages/TestAuth'));

// Auth Pages
const Login = React.lazy(() => import('@/pages/auth/Login'));
const Register = React.lazy(() => import('@/pages/auth/Register'));
const AdminLogin = React.lazy(() => import('@/pages/auth/AdminLogin'));

// Student Pages
const StudentDashboard = React.lazy(() => import('@/pages/student/Dashboard'));
const Properties = React.lazy(() => import('@/pages/student/Properties'));
const PropertyDetail = React.lazy(() => import('@/pages/student/PropertyDetail'));
const BookProperty = React.lazy(() => import('@/pages/student/BookProperty'));
const BookingHistory = React.lazy(() => import('@/pages/student/BookingHistory'));
const StudentProfile = React.lazy(() => import('@/pages/student/Profile'));
const StudentSubscription = React.lazy(() => import('@/pages/student/Subscription'));
const Explore = React.lazy(() => import('@/pages/student/Explore'));
const Favorites = React.lazy(() => import('@/pages/student/Favorites'));
const StoryView = React.lazy(() => import('@/pages/student/StoryView'));
const StoryViewEnhanced = React.lazy(() => import('@/pages/student/StoryViewEnhanced'));
const EnhancedStoryPage = React.lazy(() => import('@/pages/student/EnhancedStoryPage'));
const PropertyStory = React.lazy(() => import('@/pages/student/PropertyStory'));
const BookingConfirmation = React.lazy(() => import('@/pages/student/BookingConfirmation'));
const StudentMaintenance = React.lazy(() => import('@/pages/student/Maintenance'));

// Owner Pages
const OwnerDashboard = React.lazy(() => import('@/pages/owner/Dashboard'));
const OwnerProperties = React.lazy(() => import('@/pages/owner/Properties'));
const PropertyNew = React.lazy(() => import('@/pages/owner/PropertyNew'));
const PropertyNewSimple = React.lazy(() => import('@/pages/owner/PropertyNewSimple'));
const PropertyEdit = React.lazy(() => import('@/pages/owner/PropertyEdit'));
const PropertyView = React.lazy(() => import('@/pages/owner/PropertyView'));
const OwnerBookings = React.lazy(() => import('@/pages/owner/Bookings'));
const OwnerProfile = React.lazy(() => import('@/pages/owner/Profile'));
const OwnerSettings = React.lazy(() => import('@/pages/owner/Settings'));
const OwnerSubscription = React.lazy(() => import('@/pages/owner/Subscription'));






// Enhanced Admin Pages with Role-Based Access
const AdminDashboard = React.lazy(() => import('@/pages/admin/Dashboard'));
const TestDashboard = React.lazy(() => import('@/pages/admin/TestDashboard'));
const AdminProperties = React.lazy(() => import('@/pages/admin/Properties'));
const AdminBookings = React.lazy(() => import('@/pages/admin/Bookings'));
const AdminUsers = React.lazy(() => import('@/pages/admin/Users'));
const AdminUserManagement = React.lazy(() => import('@/pages/admin/AdminUserManagement'));
const AdminSettings = React.lazy(() => import('@/pages/admin/Settings'));
const FeatureManagement = React.lazy(() => import('@/pages/admin/FeatureManagement'));
const SubscriptionManagement = React.lazy(() => import('@/pages/admin/SubscriptionManagement'));
const VerificationManagement = React.lazy(() => import('@/pages/admin/VerificationManagement'));
const OwnerSettingsAdmin = React.lazy(() => import('@/pages/admin/OwnerSettings'));
const QuickVerify = React.lazy(() => import('@/pages/admin/QuickVerify'));

// Supreme Admin Only Pages
const AdminGlobalManagement = React.lazy(() => import('@/pages/admin/GlobalManagement'));
const AdminSystemConfig = React.lazy(() => import('@/pages/admin/SystemConfig'));


// Finance Page
const AdminFinance = React.lazy(() => import('@/pages/admin/Finance'));

// Booking Components
const BookingStepsContainer = React.lazy(() => import('@/components/booking/BookingStepsContainer'));

// Configure QueryClient with enhanced error handling
const unifiedConfig = unifiedConfigurationEngine.getAllConfig();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: unifiedConfig.database.timeout / 6, // Based on configured timeout
      retry: (failureCount, error) => {
        logger.warn('Query retry attempt', {
          failureCount,
          error: error instanceof Error ? error.message : String(error)
        });
        return failureCount < unifiedConfig.database.retryAttempts;
      },
    },
    mutations: {
      onError: (error) => {
        logger.error('Mutation error', error instanceof Error ? error : new Error(String(error)));
      }
    },
    onError: (error: unknown) => {
       logger.error('Query error - Global Handler', error instanceof Error ? error : new Error(String(error)));
    }
  } as DefaultOptions,
});

// Enhanced route wrapper with error boundary and loading
const SafeRoute: React.FC<{element: React.ReactElement}> = ({ element }) => {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        logger.error('SafeRoute: ErrorBoundary caught an error', { error, errorInfo });
        if (import.meta.env.DEV) {
          console.error('🚨 Route Error:', error, errorInfo);
        }
      }}
    >
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      }>
        {element}
      </Suspense>
    </ErrorBoundary>
  );
};

function App() {
  // Initialize performance optimizations
  React.useEffect(() => {
    initializePerformanceOptimizations();
  }, []);

  // Remove console.log in production
  if (import.meta.env.DEV) {
    console.log('🚀 Application started');
  }
  logger.info('Application started');

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <ErrorBoundary
            onError={(error, errorInfo) => {
              logger.error('App: Top-level ErrorBoundary caught an error', { error, errorInfo });
              console.error('🚨 Critical App Error:', error, errorInfo);
            }}
          >
            <AuthProvider>
              <AdminAuthProvider>
                <div className="min-h-screen bg-gray-50">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                {/* Public Routes */}
                <Route path="/" element={<SafeRoute element={<AuthRedirect />} />} />
                <Route path="/landing" element={<SafeRoute element={<Landing />} />} />
                <Route path="/welcome" element={<SafeRoute element={<Welcome />} />} />
                <Route path="/login" element={<SafeRoute element={<Login />} />} />
                <Route path="/register" element={<SafeRoute element={<Register />} />} />
                <Route path="/admin/login" element={<SafeRoute element={<AdminLogin />} />} />
                <Route path="/payment-success" element={<SafeRoute element={<PaymentSuccess />} />} />
                <Route path="/test-payment" element={<SafeRoute element={<TestPayment />} />} />
                <Route path="/test-auth" element={<SafeRoute element={<TestAuth />} />} />

                {/* Test Route for Flow Verification */}
                <Route path="/test-flow" element={
                  <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                      <h1 className="text-2xl font-bold mb-4">Flow Test Page</h1>
                      <p className="text-gray-600 mb-6">This page verifies the application flow is working correctly.</p>
                      <div className="space-y-4">
                        <a href="/welcome" className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700">
                          Start from Welcome
                        </a>
                        <a href="/landing" className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded hover:bg-green-700">
                          Go to Landing
                        </a>
                        <a href="/login" className="block w-full bg-purple-600 text-white text-center py-2 px-4 rounded hover:bg-purple-700">
                          Go to Login
                        </a>
                        <a href="/test-auth" className="block w-full bg-red-600 text-white text-center py-2 px-4 rounded hover:bg-red-700">
                          Test Authentication
                        </a>
                      </div>
                    </div>
                  </div>
                } />

                {/* Student Routes */}
                <Route path="/student/dashboard" element={
                  <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                    <SafeRoute element={<StudentDashboard />} />
                  </ProtectedRoute>
                } />
                <Route path="/student/properties" element={
                  <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                    <SafeRoute element={<Properties />} />
                  </ProtectedRoute>
                } />
                <Route path="/student/property/:propertyId/story" element={
                  <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                    <SafeRoute element={<PropertyStory />} />
                  </ProtectedRoute>
                } />
                <Route path="/student/property/:id" element={
                  <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                    <SafeRoute element={<PropertyDetail />} />
                  </ProtectedRoute>
                } />
                <Route path="/student/book-property/:id" element={
                  <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                    <SafeRoute element={<BookProperty />} />
                  </ProtectedRoute>
                } />
                <Route path="/student/book/:id" element={
                  <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                    <SafeRoute element={<BookingStepsContainer />} />
                  </ProtectedRoute>
                } />
                <Route path="/student/booking-confirmation" element={
                  <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                    <SafeRoute element={<BookingConfirmation />} />
                  </ProtectedRoute>
                } />
                <Route path="/student/booking-history" element={
                  <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                    <SafeRoute element={<BookingHistory />} />
                  </ProtectedRoute>
                } />
                <Route path="/student/maintenance" element={
                  <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                    <SafeRoute element={<StudentMaintenance />} />
                  </ProtectedRoute>
                } />
                <Route path="/student/profile" element={
                  <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                    <SafeRoute element={<StudentProfile />} />
                  </ProtectedRoute>
                } />
                <Route path="/student/subscription" element={
                  <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                    <SafeRoute element={<StudentSubscription />} />
                  </ProtectedRoute>
                } />
                <Route path="/student/explore" element={
                  <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                    <SafeRoute element={<Explore />} />
                  </ProtectedRoute>
                } />
                <Route path="/student/favorites" element={
                  <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                    <SafeRoute element={<Favorites />} />
                  </ProtectedRoute>
                } />
                <Route path="/student/story/:id" element={
                  <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                    <SafeRoute element={<StoryView />} />
                  </ProtectedRoute>
                } />
                <Route path="/student/story-enhanced/:id" element={
                  <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                    <SafeRoute element={<StoryViewEnhanced />} />
                  </ProtectedRoute>
                } />
                <Route path="/student/property/:id/enhanced-story" element={
                  <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                    <SafeRoute element={<EnhancedStoryPage />} />
                  </ProtectedRoute>
                } />
                <Route path="/student/property-listing" element={
                  <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
                    <SafeRoute element={<Properties />} />
                  </ProtectedRoute>
                } />
                <Route path="/unauthorized" element={
                  <SafeRoute element={
                    <div className="min-h-screen flex items-center justify-center bg-gray-50">
                      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
                        <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
                        <button
                          onClick={() => window.history.back()}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Go Back
                        </button>
                      </div>
                    </div>
                  } />
                } />

                {/* Owner Routes */}
                <Route path="/owner/dashboard" element={
                  <ProtectedRoute allowedRoles={[UserRole.OWNER]}>
                    <SafeRoute element={<OwnerDashboard />} />
                  </ProtectedRoute>
                } />
                <Route path="/owner/analytics" element={
                  <ProtectedRoute allowedRoles={[UserRole.OWNER]}>
                    <SafeRoute element={<AnalyticsDashboard />} />
                  </ProtectedRoute>
                } />
                <Route path="/owner/properties" element={
                  <ProtectedRoute allowedRoles={[UserRole.OWNER, UserRole.AGENT]}>
                    <SafeRoute element={<OwnerProperties />} />
                  </ProtectedRoute>
                } />
                <Route path="/owner/property/new" element={
                  <ProtectedRoute allowedRoles={[UserRole.OWNER, UserRole.AGENT]}>
                    <SafeRoute element={<PropertyNew />} />
                  </ProtectedRoute>
                } />
                <Route path="/owner/property/new-simple" element={
                  <ProtectedRoute allowedRoles={[UserRole.OWNER, UserRole.AGENT]}>
                    <SafeRoute element={<PropertyNewSimple />} />
                  </ProtectedRoute>
                } />
                <Route path="/owner/properties/:id/edit" element={
                  <ProtectedRoute allowedRoles={[UserRole.OWNER, UserRole.AGENT]}>
                    <SafeRoute element={<PropertyEdit />} />
                  </ProtectedRoute>
                } />
                <Route path="/owner/property/:id/view" element={
                  <ProtectedRoute allowedRoles={[UserRole.OWNER, UserRole.AGENT]}>
                    <SafeRoute element={<PropertyView />} />
                  </ProtectedRoute>
                } />
                <Route path="/owner/bookings" element={
                  <ProtectedRoute allowedRoles={[UserRole.OWNER, UserRole.AGENT]}>
                    <SafeRoute element={<OwnerBookings />} />
                  </ProtectedRoute>
                } />
                <Route path="/owner/profile" element={
                  <ProtectedRoute allowedRoles={[UserRole.OWNER, UserRole.AGENT]}>
                    <SafeRoute element={<OwnerProfile />} />
                  </ProtectedRoute>
                } />
                <Route path="/owner/settings" element={
                  <ProtectedRoute allowedRoles={[UserRole.OWNER, UserRole.AGENT]}>
                    <SafeRoute element={<OwnerSettings />} />
                  </ProtectedRoute>
                } />
                <Route path="/owner/subscription" element={
                  <ProtectedRoute allowedRoles={[UserRole.OWNER, UserRole.AGENT]}>
                    <SafeRoute element={<OwnerSubscription />} />
                  </ProtectedRoute>
                } />

                {/* Enhanced Admin Routes with Role-Based Access Control */}
                <Route path="/admin/dashboard" element={
                  <AdminAuthGuard>
                    <SafeRoute element={<AdminDashboard />} />
                  </AdminAuthGuard>
                } />
                <Route path="/admin/properties" element={
                  <AdminAuthGuard requiredPermission={createAdminPermission('properties.approve')}>
                    <SafeRoute element={<AdminProperties />} />
                  </AdminAuthGuard>
                } />
                <Route path="/admin/bookings" element={
                  <AdminAuthGuard requiredPermission={createAdminPermission('bookings.read')}>
                    <SafeRoute element={<AdminBookings />} />
                  </AdminAuthGuard>
                } />
                <Route path="/admin/users" element={
                  <AdminAuthGuard requiredPermission={createAdminPermission('users.read')}>
                    <SafeRoute element={<AdminUsers />} />
                  </AdminAuthGuard>
                } />
                <Route path="/admin/user-management" element={
                  <AdminAuthGuard requiredPermission={createAdminPermission('users.manage')}>
                    <SafeRoute element={<AdminUserManagement />} />
                  </AdminAuthGuard>
                } />
                <Route path="/admin/settings" element={
                  <AdminAuthGuard>
                    <SafeRoute element={<AdminSettings />} />
                  </AdminAuthGuard>
                } />

                <Route path="/admin/quick-verify" element={
                  <AdminAuthGuard>
                    <SafeRoute element={<QuickVerify />} />
                  </AdminAuthGuard>
                } />
                <Route path="/admin/finance" element={
                  <AdminAuthGuard>
                    <SafeRoute element={<AdminFinance />} />
                  </AdminAuthGuard>
                } />

                {/* Supreme Admin Only Routes */}
                <Route path="/admin/global" element={
                  <SupremeAdminGuard>
                    <SafeRoute element={<AdminGlobalManagement />} />
                  </SupremeAdminGuard>
                } />
                <Route path="/admin/system" element={
                  <SupremeAdminGuard>
                    <SafeRoute element={<AdminSystemConfig />} />
                  </SupremeAdminGuard>
                } />
                <Route path="/admin/features" element={
                  <SupremeAdminGuard>
                    <SafeRoute element={<FeatureManagement />} />
                  </SupremeAdminGuard>
                } />
                <Route path="/admin/subscriptions" element={
                  <SupremeAdminGuard>
                    <SafeRoute element={<SubscriptionManagement />} />
                  </SupremeAdminGuard>
                } />
                <Route path="/admin/verification" element={
                  <AdminAuthGuard requiredPermission={createAdminPermission('properties.approve')}>
                    <SafeRoute element={<VerificationManagement />} />
                  </AdminAuthGuard>
                } />
                <Route path="/admin/owner-settings" element={
                  <AdminAuthGuard>
                    <SafeRoute element={<OwnerSettingsAdmin />} />
                  </AdminAuthGuard>
                } />

                {/* Catch all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              </Suspense>
              </div>
              <Toaster />
            </AdminAuthProvider>
          </AuthProvider>
        </ErrorBoundary>
      </Router>
    </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
