
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import StudentDashboard from "./pages/student/Dashboard";
import Properties from "./pages/student/Properties";
import PropertyDetail from "./pages/student/PropertyDetail";
import StoryView from "./pages/student/StoryView";
import BookProperty from "./pages/student/BookProperty";

// Owner/Agent Portal Pages
import OwnerDashboard from "./pages/owner/Dashboard";
import OwnerProperties from "./pages/owner/Properties";
import OwnerPropertyNew from "./pages/owner/PropertyNew";
import OwnerPropertyEdit from "./pages/owner/PropertyEdit";
import OwnerBookings from "./pages/owner/Bookings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/landing" element={<Landing />} />
          
          {/* Student Routes */}
          <Route path="/student">
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="properties" element={<Properties />} />
            <Route path="property/:id" element={<PropertyDetail />} />
            <Route path="property/:id/story" element={<StoryView />} />
            <Route path="property/:id/book" element={<BookProperty />} />
          </Route>
          
          {/* Owner/Agent Routes */}
          <Route path="/owner">
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route path="properties" element={<OwnerProperties />} />
            <Route path="property/new" element={<OwnerPropertyNew />} />
            <Route path="property/:id/edit" element={<OwnerPropertyEdit />} />
            <Route path="bookings" element={<OwnerBookings />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
