/**
 * Student Maintenance Page
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Central hub for students to manage maintenance requests
 * with real-time status updates and cross-portal synchronization
 * 
 * Technical Implementation: Type-safe components, comprehensive error handling,
 * and zero tolerance for 'any' types
 * 
 * @author ROOMi Platform Team
 * @version 1.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/EnhancedAuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StudentNavBar from '@/components/navigation/StudentNavBar';
import MaintenanceRequestsList from '@/components/student/MaintenanceRequestsList';
import MaintenanceRequestForm from '@/components/student/MaintenanceRequestForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Wrench, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  ArrowLeft,
  Home
} from 'lucide-react';
import { BookingQueries } from '@/services/database/standardizedQueries';
import MaintenanceRequestService from '@/services/maintenanceService';
import { logger } from '@/utils/enhanced-logger';

// ============================================================================
// COMPONENT IMPLEMENTATION
// ============================================================================

const StudentMaintenance: React.FC = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  // --------------------------------------------------------------------------
  // DATA FETCHING
  // --------------------------------------------------------------------------

  // Get student's active bookings to show available properties for maintenance requests
  const { data: activeBookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['student-active-bookings', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const bookings = await BookingQueries.getBookingsByStudent(user.id);
      // Filter for confirmed bookings that haven't ended yet
      const today = new Date().toISOString().split('T')[0];
      return bookings.filter(booking => 
        booking.status === 'confirmed' && 
        booking.end_date >= today
      );
    },
    enabled: !!user?.id,
  });

  // Get maintenance analytics for the student
  const { data: maintenanceStats } = useQuery({
    queryKey: ['student-maintenance-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const response = await MaintenanceRequestService.getStudentMaintenanceRequests(user.id);
      if (!response.success || !response.data) return null;
      
      const requests = response.data;
      return {
        total: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        in_progress: requests.filter(r => r.status === 'in_progress').length,
        completed: requests.filter(r => r.status === 'completed').length,
      };
    },
    enabled: !!user?.id,
  });

  // --------------------------------------------------------------------------
  // EVENT HANDLERS
  // --------------------------------------------------------------------------

  const handleNewRequest = (propertyId?: string) => {
    if (propertyId) {
      setSelectedPropertyId(propertyId);
    } else if (activeBookings && activeBookings.length === 1) {
      setSelectedPropertyId(activeBookings[0].property_id);
    }
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedPropertyId(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedPropertyId(null);
  };

  // --------------------------------------------------------------------------
  // LOADING STATE
  // --------------------------------------------------------------------------

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please log in to access maintenance requests.
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
        <StudentNavBar />
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // FORM VIEW
  // --------------------------------------------------------------------------

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleFormCancel}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Maintenance
            </Button>
          </div>
          
          {selectedPropertyId ? (
            <MaintenanceRequestForm
              propertyId={selectedPropertyId}
              studentId={user.id}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please select a property to submit a maintenance request.
              </AlertDescription>
            </Alert>
          )}
        </main>
        <Footer />
        <StudentNavBar />
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // MAIN VIEW
  // --------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Wrench className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Maintenance Requests</h1>
          </div>
          <p className="text-gray-600">
            Submit and track maintenance requests for your accommodations
          </p>
        </div>

        {/* Stats Cards */}
        {maintenanceStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{maintenanceStats.total}</div>
                <div className="text-sm text-gray-600">Total Requests</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{maintenanceStats.pending}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{maintenanceStats.in_progress}</div>
                <div className="text-sm text-gray-600">In Progress</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{maintenanceStats.completed}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Active Properties */}
        {activeBookings && activeBookings.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Your Active Accommodations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {activeBookings.map((booking) => (
                  <div 
                    key={booking.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <h3 className="font-medium">{booking.property?.title || 'Property'}</h3>
                      <p className="text-sm text-gray-600">
                        Booking until {new Date(booking.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleNewRequest(booking.property_id)}
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Request Maintenance
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Active Bookings */}
        {activeBookings && activeBookings.length === 0 && !bookingsLoading && (
          <Alert className="mb-8">
            <Home className="h-4 w-4" />
            <AlertDescription>
              You don't have any active bookings. Maintenance requests can only be submitted for properties you currently have confirmed bookings for.
            </AlertDescription>
          </Alert>
        )}

        {/* Maintenance Requests List */}
        <MaintenanceRequestsList studentId={user.id} />
      </main>
      <Footer />
      <StudentNavBar />
    </div>
  );
};

export default StudentMaintenance;
