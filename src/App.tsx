
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/context/EnhancedAuthContext';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { logger } from '@/utils/enhanced-logger';

// Lazy load all pages for better performance
const Index = React.lazy(() => import('@/pages/Index'));
const Landing = React.lazy(() => import('@/pages/Landing'));
const Welcome = React.lazy(() => import('@/pages/Welcome'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const PaymentSuccess = React.lazy(() => import('@/pages/PaymentSuccess'));
const TestPayment = React.lazy(() => import('@/pages/TestPayment'));

// Auth Pages
const Login = React.lazy(() => import('@/pages/auth/Login'));
const Register = React.lazy(() => import('@/pages/auth/Register'));

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

// Owner Pages
const OwnerDashboard = React.lazy(() => import('@/pages/owner/Dashboard'));
const OwnerProperties = React.lazy(() => import('@/pages/owner/Properties'));
const PropertyNew = React.lazy(() => import('@/pages/owner/PropertyNew'));
const PropertyEdit = React.lazy(() => import('@/pages/owner/PropertyEdit'));
const OwnerBookings = React.lazy(() => import('@/pages/owner/Bookings'));
const OwnerProfile = React.lazy(() => import('@/pages/owner/Profile'));
const OwnerSettings = React.lazy(() => import('@/pages/owner/Settings'));
const OwnerSubscription = React.lazy(() => import('@/pages/owner/Subscription'));

// Admin Pages
const AdminDashboard = React.lazy(() => import('@/pages/admin/Dashboard'));
const AdminProperties = React.lazy(() => import('@/pages/admin/Properties'));
const AdminBookings = React.lazy(() => import('@/pages/admin/Bookings'));
const AdminUsers = React.lazy(() => import('@/pages/admin/Users'));
const AdminSettings = React.lazy(() => import('@/pages/admin/Settings'));
const FeatureManagement = React.lazy(() => import('@/pages/admin/FeatureManagement'));
const SubscriptionManagement = React.lazy(() => import('@/pages/admin/SubscriptionManagement'));
const VerificationManagement = React.lazy(() => import('@/pages/admin/VerificationManagement'));
const OwnerSettingsAdmin = React.lazy(() => import('@/pages/admin/OwnerSettings'));

// Booking Components
const BookingStepsContainer = React.lazy(() => import('@/components/booking/BookingStepsContainer'));

// Configure QueryClient with enhanced error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error) => {
        logger.warn('Query retry attempt', { 
          failureCount, 
          error: error instanceof Error ? error.message : String(error) 
        });
        return failureCount < 2;
      },
      onError: (error) => {
        logger.error('Query error', error instanceof Error ? error : new Error(String(error)));
      }
    },
    mutations: {
      onError: (error) => {
        logger.error('Mutation error', error instanceof Error ? error : new Error(String(error)));
      }
    }
  },
});

// Enhanced route wrapper with error boundary and loading
const SafeRoute: React.FC<{element: React.ReactElement}> = ({ element }) => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner />}>
      {element}
    </Suspense>
  </ErrorBoundary>
);

function App() {
  logger.info('Application started');

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<SafeRoute element={<Index />} />} />
              <Route path="/landing" element={<SafeRoute element={<Landing />} />} />
              <Route path="/welcome" element={<SafeRoute element={<Welcome />} />} />
              <Route path="/login" element={<SafeRoute element={<Login />} />} />
              <Route path="/register" element={<SafeRoute element={<Register />} />} />
              <Route path="/payment-success" element={<SafeRoute element={<PaymentSuccess />} />} />
              <Route path="/test-payment" element={<SafeRoute element={<TestPayment />} />} />

              {/* Student Routes */}
              <Route path="/student/dashboard" element={<SafeRoute element={<StudentDashboard />} />} />
              <Route path="/student/properties" element={<SafeRoute element={<Properties />} />} />
              <Route path="/student/property/:id" element={<SafeRoute element={<PropertyDetail />} />} />
              <Route path="/student/book-property/:id" element={<SafeRoute element={<BookProperty />} />} />
              <Route path="/student/book/:id" element={<SafeRoute element={<BookingStepsContainer />} />} />
              <Route path="/student/booking-history" element={<SafeRoute element={<BookingHistory />} />} />
              <Route path="/student/profile" element={<SafeRoute element={<StudentProfile />} />} />
              <Route path="/student/subscription" element={<SafeRoute element={<StudentSubscription />} />} />
              <Route path="/student/explore" element={<SafeRoute element={<Explore />} />} />
              <Route path="/student/favorites" element={<SafeRoute element={<Favorites />} />} />
              <Route path="/student/story/:id" element={<SafeRoute element={<StoryView />} />} />
              <Route path="/student/story-enhanced/:id" element={<SafeRoute element={<StoryViewEnhanced />} />} />
              <Route path="/student/property/:id/enhanced-story" element={<SafeRoute element={<EnhancedStoryPage />} />} />

              {/* Owner Routes */}
              <Route path="/owner/dashboard" element={<SafeRoute element={<OwnerDashboard />} />} />
              <Route path="/owner/properties" element={<SafeRoute element={<OwnerProperties />} />} />
              <Route path="/owner/property/new" element={<SafeRoute element={<PropertyNew />} />} />
              <Route path="/owner/properties/:id/edit" element={<SafeRoute element={<PropertyEdit />} />} />
              <Route path="/owner/bookings" element={<SafeRoute element={<OwnerBookings />} />} />
              <Route path="/owner/profile" element={<SafeRoute element={<OwnerProfile />} />} />
              <Route path="/owner/settings" element={<SafeRoute element={<OwnerSettings />} />} />
              <Route path="/owner/subscription" element={<SafeRoute element={<OwnerSubscription />} />} />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<SafeRoute element={<AdminDashboard />} />} />
              <Route path="/admin/properties" element={<SafeRoute element={<AdminProperties />} />} />
              <Route path="/admin/bookings" element={<SafeRoute element={<AdminBookings />} />} />
              <Route path="/admin/users" element={<SafeRoute element={<AdminUsers />} />} />
              <Route path="/admin/settings" element={<SafeRoute element={<AdminSettings />} />} />
              <Route path="/admin/features" element={<SafeRoute element={<FeatureManagement />} />} />
              <Route path="/admin/subscriptions" element={<SafeRoute element={<SubscriptionManagement />} />} />
              <Route path="/admin/verification" element={<SafeRoute element={<VerificationManagement />} />} />
              <Route path="/admin/owner-settings" element={<SafeRoute element={<OwnerSettingsAdmin />} />} />

              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Toaster />
          <SonnerToaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
