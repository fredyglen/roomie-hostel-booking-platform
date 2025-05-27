
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Welcome from "./pages/Welcome";
import ModernHomepage from "./pages/ModernHomepage";
import EnhancedStoryPage from "./pages/student/EnhancedStoryPage";

// Student Portal Pages
import StudentDashboard from "./pages/student/Dashboard";
import Properties from "./pages/student/Properties";
import Explore from "./pages/student/Explore";
import Favorites from "./pages/student/Favorites";
import Profile from "./pages/student/Profile";
import PropertyDetail from "./pages/student/PropertyDetail";
import StoryView from "./pages/student/StoryView";
import BookProperty from "./pages/student/BookProperty";
import StudentSubscription from "./pages/student/Subscription";

// Owner/Agent Portal Pages
import OwnerDashboard from "./pages/owner/Dashboard";
import OwnerProperties from "./pages/owner/Properties";
import OwnerPropertyNew from "./pages/owner/PropertyNew";
import OwnerPropertyEdit from "./pages/owner/PropertyEdit";
import OwnerBookings from "./pages/owner/Bookings";
import OwnerProfile from "./pages/owner/Profile";
import OwnerSubscription from "./pages/owner/Subscription";

// Admin Portal Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminProperties from "./pages/admin/Properties";
import AdminBookings from "./pages/admin/Bookings";
import AdminSettings from "./pages/admin/Settings";
import AdminSubscriptionManagement from "./pages/admin/SubscriptionManagement";
import AdminFeatureManagement from "./pages/admin/FeatureManagement";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
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
            <Route path="/" element={<ModernHomepage />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/index" element={<Index />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Student Routes */}
            <Route path="/student">
              {/* Dashboard route - NO automatic redirect */}
              <Route path="dashboard" element={
                <ProtectedRoute allowedRoles={['student']} preserveLocation={false}>
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              
              {/* Main student pages */}
              <Route path="properties" element={
                <ProtectedRoute allowedRoles={['student']} preserveLocation={false}>
                  <Properties />
                </ProtectedRoute>
              } />
              <Route path="explore" element={
                <ProtectedRoute allowedRoles={['student']} preserveLocation={false}>
                  <Explore />
                </ProtectedRoute>
              } />
              <Route path="favorites" element={
                <ProtectedRoute allowedRoles={['student']} preserveLocation={false}>
                  <Favorites />
                </ProtectedRoute>
              } />
              <Route path="profile" element={
                <ProtectedRoute allowedRoles={['student']} preserveLocation={false}>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="subscription" element={
                <ProtectedRoute allowedRoles={['student']} preserveLocation={false}>
                  <StudentSubscription />
                </ProtectedRoute>
              } />
              
              {/* Property-specific routes */}
              <Route path="property/:id" element={
                <ProtectedRoute allowedRoles={['student']} preserveLocation={false}>
                  <PropertyDetail />
                </ProtectedRoute>
              } />
              <Route path="property/:id/story" element={
                <ProtectedRoute allowedRoles={['student']} preserveLocation={false}>
                  <StoryView />
                </ProtectedRoute>
              } />
              <Route path="property/:id/enhanced-story" element={
                <ProtectedRoute allowedRoles={['student']} preserveLocation={false}>
                  <EnhancedStoryPage />
                </ProtectedRoute>
              } />
              <Route path="property/:id/book" element={
                <ProtectedRoute allowedRoles={['student']} preserveLocation={false}>
                  <BookProperty />
                </ProtectedRoute>
              } />
              
              {/* Legacy routes with proper redirects */}
              <Route path="book/:id" element={
                <Navigate to="/student/property/:id/book" replace />
              } />
              
              {/* Default student route */}
              <Route index element={
                <Navigate to="/student/properties" replace />
              } />
            </Route>
            
            {/* Owner/Agent Routes */}
            <Route path="/owner">
              <Route path="dashboard" element={
                <ProtectedRoute allowedRoles={['owner']} preserveLocation={false}>
                  <OwnerDashboard />
                </ProtectedRoute>
              } />
              <Route path="properties" element={
                <ProtectedRoute allowedRoles={['owner']} preserveLocation={false}>
                  <OwnerProperties />
                </ProtectedRoute>
              } />
              <Route path="property/new" element={
                <ProtectedRoute allowedRoles={['owner']} preserveLocation={false}>
                  <OwnerPropertyNew />
                </ProtectedRoute>
              } />
              <Route path="property/:id/edit" element={
                <ProtectedRoute allowedRoles={['owner']} preserveLocation={false}>
                  <OwnerPropertyEdit />
                </ProtectedRoute>
              } />
              <Route path="bookings" element={
                <ProtectedRoute allowedRoles={['owner']} preserveLocation={false}>
                  <OwnerBookings />
                </ProtectedRoute>
              } />
              <Route path="profile" element={
                <ProtectedRoute allowedRoles={['owner']} preserveLocation={false}>
                  <OwnerProfile />
                </ProtectedRoute>
              } />
              <Route path="subscription" element={
                <ProtectedRoute allowedRoles={['owner']} preserveLocation={false}>
                  <OwnerSubscription />
                </ProtectedRoute>
              } />
              
              {/* Default owner route */}
              <Route index element={
                <Navigate to="/owner/dashboard" replace />
              } />
            </Route>
            
            {/* Admin Routes */}
            <Route path="/admin">
              <Route path="dashboard" element={
                <ProtectedRoute allowedRoles={['admin']} preserveLocation={false}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="users" element={
                <ProtectedRoute allowedRoles={['admin']} preserveLocation={false}>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="properties" element={
                <ProtectedRoute allowedRoles={['admin']} preserveLocation={false}>
                  <AdminProperties />
                </ProtectedRoute>
              } />
              <Route path="bookings" element={
                <ProtectedRoute allowedRoles={['admin']} preserveLocation={false}>
                  <AdminBookings />
                </ProtectedRoute>
              } />
              <Route path="settings" element={
                <ProtectedRoute allowedRoles={['admin']} preserveLocation={false}>
                  <AdminSettings />
                </ProtectedRoute>
              } />
              <Route path="features" element={
                <ProtectedRoute allowedRoles={['admin']} preserveLocation={false}>
                  <AdminFeatureManagement />
                </ProtectedRoute>
              } />
              <Route path="subscriptions" element={
                <ProtectedRoute allowedRoles={['admin']} preserveLocation={false}>
                  <AdminSubscriptionManagement />
                </ProtectedRoute>
              } />
              
              {/* Default admin route */}
              <Route index element={
                <Navigate to="/admin/dashboard" replace />
              } />
            </Route>
            
            {/* Catch-all route - MUST be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
