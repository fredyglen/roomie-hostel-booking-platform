
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/EnhancedAuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Welcome from "./pages/Welcome";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";
import StudentDashboard from "./pages/student/Dashboard";
import StudentProperties from "./pages/student/Properties";
import PropertyDetail from "./pages/student/PropertyDetail";
import BookProperty from "./pages/student/BookProperty";
import BookingHistory from "./pages/student/BookingHistory";
import Explore from "./pages/student/Explore";
import Favorites from "./pages/student/Favorites";
import StudentProfile from "./pages/student/Profile";
import StudentSubscription from "./pages/student/Subscription";
import StoryView from "./pages/student/StoryView";
import StoryViewEnhanced from "./pages/student/StoryViewEnhanced";
import EnhancedStoryPage from "./pages/student/EnhancedStoryPage";
import TestPayment from "./pages/TestPayment";
import OwnerDashboard from "./pages/owner/Dashboard";
import OwnerProperties from "./pages/owner/Properties";
import PropertyNew from "./pages/owner/PropertyNew";
import PropertyEdit from "./pages/owner/PropertyEdit";
import OwnerBookings from "./pages/owner/Bookings";
import OwnerProfile from "./pages/owner/Profile";
import OwnerSettings from "./pages/owner/Settings";
import OwnerSubscription from "./pages/owner/Subscription";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminProperties from "./pages/admin/Properties";
import AdminBookings from "./pages/admin/Bookings";
import VerificationManagement from "./pages/admin/VerificationManagement";
import AdminSettings from "./pages/admin/Settings";
import AdminOwnerSettings from "./pages/admin/OwnerSettings";
import AdminFeatureManagement from "./pages/admin/FeatureManagement";
import AdminSubscriptionManagement from "./pages/admin/SubscriptionManagement";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/test-payment" element={<TestPayment />} />

            {/* Student Routes */}
            <Route
              path="/student/*"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Routes>
                    <Route path="dashboard" element={<StudentDashboard />} />
                    <Route path="properties" element={<StudentProperties />} />
                    <Route path="property/:id" element={<PropertyDetail />} />
                    <Route path="property/:id/book" element={<BookProperty />} />
                    <Route path="property/:id/enhanced-story" element={<EnhancedStoryPage />} />
                    <Route path="booking-history" element={<BookingHistory />} />
                    <Route path="explore" element={<Explore />} />
                    <Route path="favorites" element={<Favorites />} />
                    <Route path="profile" element={<StudentProfile />} />
                    <Route path="subscription" element={<StudentSubscription />} />
                    <Route path="story/:id" element={<StoryView />} />
                    <Route path="stories/:id" element={<StoryViewEnhanced />} />
                    {/* Redirect any unmatched student routes to dashboard */}
                    <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
                  </Routes>
                </ProtectedRoute>
              }
            />

            {/* Owner Routes */}
            <Route
              path="/owner/*"
              element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <Routes>
                    <Route path="dashboard" element={<OwnerDashboard />} />
                    <Route path="properties" element={<OwnerProperties />} />
                    <Route path="properties/new" element={<PropertyNew />} />
                    <Route path="properties/:id/edit" element={<PropertyEdit />} />
                    <Route path="bookings" element={<OwnerBookings />} />
                    <Route path="profile" element={<OwnerProfile />} />
                    <Route path="settings" element={<OwnerSettings />} />
                    <Route path="subscription" element={<OwnerSubscription />} />
                    {/* Redirect any unmatched owner routes to dashboard */}
                    <Route path="*" element={<Navigate to="/owner/dashboard" replace />} />
                  </Routes>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="properties" element={<AdminProperties />} />
                    <Route path="bookings" element={<AdminBookings />} />
                    <Route path="verifications" element={<VerificationManagement />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="owner-settings" element={<AdminOwnerSettings />} />
                    <Route path="features" element={<AdminFeatureManagement />} />
                    <Route path="subscriptions" element={<AdminSubscriptionManagement />} />
                    {/* Redirect any unmatched admin routes to dashboard */}
                    <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                  </Routes>
                </ProtectedRoute>
              }
            />

            {/* Catch all route - redirect to 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
