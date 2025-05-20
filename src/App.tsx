
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
          <Route path="/student">
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="properties" element={<Properties />} />
            <Route path="property/:id" element={<PropertyDetail />} />
            <Route path="property/:id/story" element={<StoryView />} />
            <Route path="property/:id/book" element={<BookProperty />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
