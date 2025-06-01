
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/context/EnhancedAuthContext';
import ErrorBoundary from '@/components/common/ErrorBoundary';

// Pages
import Index from '@/pages/Index';
import Landing from '@/pages/Landing';
import Welcome from '@/pages/Welcome';
import NotFound from '@/pages/NotFound';
import PaymentSuccess from '@/pages/PaymentSuccess';
import TestPayment from '@/pages/TestPayment';

// Auth Pages
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';

// Student Pages
import StudentDashboard from '@/pages/student/Dashboard';
import Properties from '@/pages/student/Properties';
import PropertyDetail from '@/pages/student/PropertyDetail';
import BookProperty from '@/pages/student/BookProperty';
import BookingHistory from '@/pages/student/BookingHistory';
import StudentProfile from '@/pages/student/Profile';
import StudentSubscription from '@/pages/student/Subscription';
import Explore from '@/pages/student/Explore';
import Favorites from '@/pages/student/Favorites';
import StoryView from '@/pages/student/StoryView';
import StoryViewEnhanced from '@/pages/student/StoryViewEnhanced';
import EnhancedStoryPage from '@/pages/student/EnhancedStoryPage';

// Owner Pages
import OwnerDashboard from '@/pages/owner/Dashboard';
import OwnerProperties from '@/pages/owner/Properties';
import PropertyNew from '@/pages/owner/PropertyNew';
import PropertyEdit from '@/pages/owner/PropertyEdit';
import OwnerBookings from '@/pages/owner/Bookings';
import OwnerProfile from '@/pages/owner/Profile';
import OwnerSettings from '@/pages/owner/Settings';
import OwnerSubscription from '@/pages/owner/Subscription';

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminProperties from '@/pages/admin/Properties';
import AdminBookings from '@/pages/admin/Bookings';
import AdminUsers from '@/pages/admin/Users';
import AdminSettings from '@/pages/admin/Settings';
import FeatureManagement from '@/pages/admin/FeatureManagement';
import SubscriptionManagement from '@/pages/admin/SubscriptionManagement';
import VerificationManagement from '@/pages/admin/VerificationManagement';
import OwnerSettingsAdmin from '@/pages/admin/OwnerSettings';

// Booking Components
import BookingStepsContainer from '@/components/booking/BookingStepsContainer';

// Configure QueryClient with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1
    }
  },
});

// Wrap route components with ErrorBoundary
const SafeRoute: React.FC<{element: React.ReactElement}> = ({ element }) => (
  <ErrorBoundary>{element}</ErrorBoundary>
);

function App() {
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
