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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/landing" element={<Landing />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Student Routes */}
            <Route path="/student">
              {/* Redirect student dashboard to properties list */}
              <Route path="dashboard" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Navigate to="/student/properties" replace />
                </ProtectedRoute>
              } />
              <Route path="properties" element={<Properties />} />
              <Route path="explore" element={<Explore />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="profile" element={<Profile />} />
              <Route path="subscription" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentSubscription />
                </ProtectedRoute>
              } />
              <Route path="property/:id" element={<PropertyDetail />} />
              <Route path="property/:id/story" element={<StoryView />} />
              <Route path="property/:id/book" element={<BookProperty />} />
              <Route path="property/:id/enhanced-story" element={<EnhancedStoryPage />} />
            </Route>
            
            {/* Owner/Agent Routes */}
            <Route path="/owner">
              <Route path="dashboard" element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <OwnerDashboard />
                </ProtectedRoute>
              } />
              <Route path="properties" element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <OwnerProperties />
                </ProtectedRoute>
              } />
              <Route path="property/new" element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <OwnerPropertyNew />
                </ProtectedRoute>
              } />
              <Route path="property/:id/edit" element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <OwnerPropertyEdit />
                </ProtectedRoute>
              } />
              <Route path="bookings" element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <OwnerBookings />
                </ProtectedRoute>
              } />
              <Route path="profile" element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <OwnerProfile />
                </ProtectedRoute>
              } />
              <Route path="subscription" element={
                <ProtectedRoute allowedRoles={['owner']}>
                  <OwnerSubscription />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* Admin Routes */}
            <Route path="/admin">
              <Route path="dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="users" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="properties" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminProperties />
                </ProtectedRoute>
              } />
              <Route path="bookings" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminBookings />
                </ProtectedRoute>
              } />
              <Route path="settings" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminSettings />
                </ProtectedRoute>
              } />
              <Route path="features" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminFeatureManagement />
                </ProtectedRoute>
              } />
              <Route path="subscriptions" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminSubscriptionManagement />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
