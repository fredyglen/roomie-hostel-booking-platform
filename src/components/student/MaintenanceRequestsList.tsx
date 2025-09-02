/**
 * Maintenance Requests List Component
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Displays student's maintenance requests with status tracking
 * and real-time updates from owner responses
 * 
 * Technical Implementation: Type-safe data fetching, comprehensive error handling,
 * and zero tolerance for 'any' types
 * 
 * @author ROOMi Platform Team
 * @version 1.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Calendar,
  MapPin,
  DollarSign,
  Plus,
  RefreshCw
} from 'lucide-react';
import MaintenanceRequestService from '@/services/maintenanceService';
import MaintenanceRequestForm from './MaintenanceRequestForm';
import {
  MaintenanceRequestWithProperty,
  PRIORITY_COLORS,
  STATUS_COLORS,
  MaintenanceStatus,
  MaintenancePriority
} from '@/types/maintenance';
import { logger } from '@/utils/enhanced-logger';
import { formatDistanceToNow } from 'date-fns';

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface MaintenanceRequestsListProps {
  readonly studentId: string;
  readonly propertyId?: string; // Optional filter by property
}

// ============================================================================
// STATUS ICONS
// ============================================================================

const getStatusIcon = (status: MaintenanceStatus) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4" />;
    case 'in_progress':
      return <AlertTriangle className="h-4 w-4" />;
    case 'completed':
      return <CheckCircle className="h-4 w-4" />;
    case 'cancelled':
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

// ============================================================================
// COMPONENT IMPLEMENTATION
// ============================================================================

const MaintenanceRequestsList: React.FC<MaintenanceRequestsListProps> = ({
  studentId,
  propertyId
}) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  // --------------------------------------------------------------------------
  // DATA FETCHING
  // --------------------------------------------------------------------------

  const {
    data: requestsResponse,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['maintenance-requests', studentId, propertyId],
    queryFn: () => MaintenanceRequestService.getStudentMaintenanceRequests(studentId),
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  const requests = requestsResponse?.data || [];
  const filteredRequests = propertyId 
    ? requests.filter(req => req.property_id === propertyId)
    : requests;

  // --------------------------------------------------------------------------
  // EVENT HANDLERS
  // --------------------------------------------------------------------------

  const handleNewRequest = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedPropertyId(null);
    refetch();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedPropertyId(null);
  };

  // --------------------------------------------------------------------------
  // LOADING STATE
  // --------------------------------------------------------------------------

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>Loading maintenance requests...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // --------------------------------------------------------------------------
  // ERROR STATE
  // --------------------------------------------------------------------------

  if (error) {
    logger.error('Failed to load maintenance requests', { error, studentId });
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load maintenance requests. Please try again.
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            className="ml-2"
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // --------------------------------------------------------------------------
  // FORM VIEW
  // --------------------------------------------------------------------------

  if (showForm && selectedPropertyId) {
    return (
      <MaintenanceRequestForm
        propertyId={selectedPropertyId}
        studentId={studentId}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
      />
    );
  }

  // --------------------------------------------------------------------------
  // MAIN RENDER
  // --------------------------------------------------------------------------

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Maintenance Requests</h2>
        <Button
          onClick={() => handleNewRequest(propertyId || '')}
          disabled={!propertyId}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Empty State */}
      {filteredRequests.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No maintenance requests yet
            </h3>
            <p className="text-gray-600 mb-4">
              Submit a maintenance request for any issues with your accommodation.
            </p>
            {propertyId && (
              <Button onClick={() => handleNewRequest(propertyId)}>
                <Plus className="h-4 w-4 mr-2" />
                Submit First Request
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Requests List */}
      {filteredRequests.map((request) => (
        <Card key={request.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">{request.title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{request.property?.title}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge className={STATUS_COLORS[request.status]}>
                  {getStatusIcon(request.status)}
                  <span className="ml-1 capitalize">{request.status.replace('_', ' ')}</span>
                </Badge>
                <Badge className={PRIORITY_COLORS[request.priority as MaintenancePriority]}>
                  {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <p className="text-gray-700 mb-4">{request.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="font-medium">Submitted</p>
                  <p className="text-gray-600">
                    {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-600 capitalize">{request.category}</span>
              </div>
              
              {request.estimated_cost && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">Estimated</p>
                    <p className="text-gray-600">GHS {request.estimated_cost}</p>
                  </div>
                </div>
              )}
              
              {request.actual_cost && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">Actual Cost</p>
                    <p className="text-gray-600">GHS {request.actual_cost}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Scheduled Date */}
            {request.scheduled_date && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    Scheduled for: {new Date(request.scheduled_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

            {/* Completion Date */}
            {request.completed_date && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">
                    Completed on: {new Date(request.completed_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

            {/* Assigned To */}
            {request.assigned_to && (
              <div className="mt-4 text-sm">
                <span className="font-medium">Assigned to:</span>
                <span className="ml-2 text-gray-600">{request.assigned_to}</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MaintenanceRequestsList;
