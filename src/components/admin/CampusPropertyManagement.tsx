/**
 * Campus Property Management Component
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Provides campus-specific property approval workflows and
 * oversight capabilities for Campus Admins with jurisdiction-based access
 * to properties within assigned university areas
 * 
 * Technical Implementation: Integrates with AdminAuthContext for jurisdiction
 * validation, property approval workflows, and campus-specific oversight
 * 
 * @author ROOMi Platform Team
 * @version 2.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin,
  Eye,
  AlertTriangle,
  Search,
  Filter,
  DollarSign,
  Users,
  Calendar,
  Star,
  Camera,
  FileText,
  Phone,
  Mail
} from 'lucide-react';
import { 
  createAdminPermission,
  createCampusJurisdiction,
  CampusJurisdiction
} from '@/types/auth';

// ============================================================================
// CAMPUS PROPERTY MANAGEMENT TYPES
// ============================================================================

interface PropertyApproval {
  readonly id: string;
  readonly propertyId: string;
  readonly title: string;
  readonly description: string;
  readonly ownerName: string;
  readonly ownerEmail: string;
  readonly ownerPhone: string;
  readonly location: string;
  readonly address: string;
  readonly nearestUniversity: string;
  readonly distanceToUniversity: number; // in km
  readonly propertyType: 'apartment' | 'hostel' | 'shared_room' | 'studio';
  readonly price: number;
  readonly currency: 'GHS';
  readonly amenities: readonly string[];
  readonly images: readonly string[];
  readonly submittedAt: Date;
  readonly status: 'pending' | 'approved' | 'rejected' | 'under_review';
  readonly reviewNotes?: string;
  readonly reviewedBy?: string;
  readonly reviewedAt?: Date;
  readonly rejectionReason?: string;
  readonly complianceChecks: PropertyComplianceCheck;
}

interface PropertyComplianceCheck {
  readonly safetyStandards: boolean;
  readonly fireExit: boolean;
  readonly electricalSafety: boolean;
  readonly waterSupply: boolean;
  readonly sanitationFacilities: boolean;
  readonly securityMeasures: boolean;
  readonly accessibilityCompliance: boolean;
  readonly documentationComplete: boolean;
}

interface PropertyStats {
  readonly totalProperties: number;
  readonly pendingApprovals: number;
  readonly approvedProperties: number;
  readonly rejectedProperties: number;
  readonly averageApprovalTime: number;
  readonly approvalRate: number;
  readonly campusBreakdown: Record<string, number>;
}

interface PropertyOwner {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly totalProperties: number;
  readonly approvedProperties: number;
  readonly rating: number;
  readonly joinedAt: Date;
}

// ============================================================================
// CAMPUS PROPERTY MANAGEMENT COMPONENT
// ============================================================================

/**
 * Campus Property Management Component
 * Provides comprehensive campus property approval and oversight
 */
const CampusPropertyManagement: React.FC = () => {
  const { 
    getAdminRole, 
    hasPermission, 
    hasJurisdiction,
    validateAccess 
  } = useAdminAuth();

  const queryClient = useQueryClient();
  const [selectedProperty, setSelectedProperty] = useState<PropertyApproval | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [universityFilter, setUniversityFilter] = useState<string>('all');
  const [reviewNotes, setReviewNotes] = useState('');

  // ============================================================================
  // PERMISSION VALIDATION
  // ============================================================================

  if (!hasPermission(createAdminPermission('properties.approve'))) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access property management system.
        </AlertDescription>
      </Alert>
    );
  }

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  /**
   * Fetch property statistics
   */
  const { data: propertyStats, isLoading: statsLoading } = useQuery({
    queryKey: ['property-stats'],
    queryFn: async (): Promise<PropertyStats> => {
      // Mock data - would integrate with actual property API
      return {
        totalProperties: 156,
        pendingApprovals: 23,
        approvedProperties: 128,
        rejectedProperties: 5,
        averageApprovalTime: 1.8, // days
        approvalRate: 96.2, // percentage
        campusBreakdown: {
          'UPSA': 45,
          'UG': 67,
          'KNUST': 28,
          'UCC': 16
        }
      };
    }
  });

  /**
   * Fetch property approvals with filtering
   */
  const { data: propertyApprovals, isLoading: approvalsLoading } = useQuery({
    queryKey: ['property-approvals', searchTerm, statusFilter, universityFilter],
    queryFn: async (): Promise<PropertyApproval[]> => {
      // Mock data - would integrate with actual property API
      const mockApprovals: PropertyApproval[] = [
        {
          id: '1',
          propertyId: 'prop_123',
          title: 'Modern 2BR Apartment near UPSA',
          description: 'Spacious 2-bedroom apartment with modern amenities, perfect for students.',
          ownerName: 'John Mensah',
          ownerEmail: 'john.mensah@gmail.com',
          ownerPhone: '+233244123456',
          location: 'East Legon, Accra',
          address: '123 East Legon Street, Accra',
          nearestUniversity: 'UPSA',
          distanceToUniversity: 2.5,
          propertyType: 'apartment',
          price: 1200,
          currency: 'GHS',
          amenities: ['WiFi', 'Air Conditioning', 'Kitchen', 'Parking', 'Security'],
          images: ['/images/property1_1.jpg', '/images/property1_2.jpg'],
          submittedAt: new Date('2024-01-08T08:00:00'),
          status: 'pending',
          complianceChecks: {
            safetyStandards: true,
            fireExit: true,
            electricalSafety: true,
            waterSupply: true,
            sanitationFacilities: true,
            securityMeasures: true,
            accessibilityCompliance: false,
            documentationComplete: true
          }
        },
        {
          id: '2',
          propertyId: 'prop_124',
          title: 'Student Hostel - UPSA Campus',
          description: 'Affordable hostel accommodation with shared facilities.',
          ownerName: 'Grace Adjei',
          ownerEmail: 'grace.adjei@gmail.com',
          ownerPhone: '+233244123457',
          location: 'Madina, Accra',
          address: '456 Madina Road, Accra',
          nearestUniversity: 'UPSA',
          distanceToUniversity: 1.2,
          propertyType: 'hostel',
          price: 800,
          currency: 'GHS',
          amenities: ['WiFi', 'Shared Kitchen', 'Study Room', 'Laundry'],
          images: ['/images/property2_1.jpg'],
          submittedAt: new Date('2024-01-07T16:30:00'),
          status: 'under_review',
          complianceChecks: {
            safetyStandards: true,
            fireExit: true,
            electricalSafety: true,
            waterSupply: true,
            sanitationFacilities: true,
            securityMeasures: false,
            accessibilityCompliance: false,
            documentationComplete: false
          }
        }
      ];

      // Apply filters
      return mockApprovals.filter(property => {
        const matchesSearch = searchTerm === '' || 
          property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.location.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
        const matchesUniversity = universityFilter === 'all' || property.nearestUniversity === universityFilter;

        return matchesSearch && matchesStatus && matchesUniversity;
      });
    }
  });

  /**
   * Approve property
   */
  const approvePropertyMutation = useMutation({
    mutationFn: async ({ propertyId, notes }: { propertyId: string; notes?: string }) => {
      // Mock API call - would integrate with actual property API
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-approvals'] });
      queryClient.invalidateQueries({ queryKey: ['property-stats'] });
      setSelectedProperty(null);
      setReviewNotes('');
    }
  });

  /**
   * Reject property
   */
  const rejectPropertyMutation = useMutation({
    mutationFn: async ({ propertyId, reason }: { propertyId: string; reason: string }) => {
      // Mock API call - would integrate with actual property API
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-approvals'] });
      queryClient.invalidateQueries({ queryKey: ['property-stats'] });
      setSelectedProperty(null);
      setReviewNotes('');
    }
  });

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  /**
   * Get status badge color
   */
  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  /**
   * Calculate compliance score
   */
  const getComplianceScore = (checks: PropertyComplianceCheck): number => {
    const total = Object.keys(checks).length;
    const passed = Object.values(checks).filter(Boolean).length;
    return Math.round((passed / total) * 100);
  };

  /**
   * Check if property can be approved
   */
  const canApproveProperty = (property: PropertyApproval): boolean => {
    const complianceScore = getComplianceScore(property.complianceChecks);
    return complianceScore >= 80; // Require 80% compliance
  };

  // ============================================================================
  // RENDER COMPONENT
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campus Property Management</h1>
            <p className="text-gray-600">Review and approve properties within your campus jurisdiction</p>
          </div>
        </div>
      </div>

      {/* Property Statistics */}
      {propertyStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Building className="h-6 w-6 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-xl font-bold">{propertyStats.totalProperties}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-yellow-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-xl font-bold">{propertyStats.pendingApprovals}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-xl font-bold">{propertyStats.approvedProperties}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Calendar className="h-6 w-6 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Avg. Time</p>
                  <p className="text-xl font-bold">{propertyStats.averageApprovalTime}d</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Star className="h-6 w-6 text-orange-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Approval Rate</p>
                  <p className="text-xl font-bold">{propertyStats.approvalRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by title, owner, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select 
              value={universityFilter}
              onChange={(e) => setUniversityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Universities</option>
              <option value="UPSA">UPSA</option>
              <option value="UG">University of Ghana</option>
              <option value="KNUST">KNUST</option>
              <option value="UCC">UCC</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Property Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Queue */}
        <Card>
          <CardHeader>
            <CardTitle>Property Approval Queue</CardTitle>
          </CardHeader>
          <CardContent>
            {approvalsLoading ? (
              <div className="text-center py-4">Loading properties...</div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {propertyApprovals?.map((property) => (
                  <div 
                    key={property.id} 
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedProperty?.id === property.id ? 'border-green-500 bg-green-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedProperty(property)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Building className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{property.title}</h3>
                          <p className="text-sm text-gray-600">{property.ownerName}</p>
                          <p className="text-xs text-gray-500">{property.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusBadgeColor(property.status)}>
                          {property.status.replace('_', ' ')}
                        </Badge>
                        <p className="text-sm font-medium mt-1">GHS {property.price}</p>
                        <p className="text-xs text-gray-500">
                          {property.submittedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedProperty ? (
              <div className="space-y-4">
                {/* Property Information */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Property Information</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <Label className="text-gray-600">Title</Label>
                      <p className="font-medium">{selectedProperty.title}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Type</Label>
                      <p className="font-medium capitalize">{selectedProperty.propertyType.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Price</Label>
                      <p className="font-medium">GHS {selectedProperty.price}/month</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">University</Label>
                      <p className="font-medium">{selectedProperty.nearestUniversity}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-gray-600">Location</Label>
                      <p className="font-medium">{selectedProperty.location}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-gray-600">Description</Label>
                      <p className="text-sm">{selectedProperty.description}</p>
                    </div>
                  </div>
                </div>

                {/* Owner Information */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Owner Information</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <Label className="text-gray-600">Name</Label>
                      <p className="font-medium">{selectedProperty.ownerName}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Email</Label>
                      <p className="font-medium">{selectedProperty.ownerEmail}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Phone</Label>
                      <p className="font-medium">{selectedProperty.ownerPhone}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Distance</Label>
                      <p className="font-medium">{selectedProperty.distanceToUniversity} km</p>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProperty.amenities.map((amenity, index) => (
                      <Badge key={index} variant="outline">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Compliance Checks */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Compliance Checks</h3>
                  <div className="space-y-2">
                    {Object.entries(selectedProperty.complianceChecks).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        {value ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2">
                    <Badge className={`${getComplianceScore(selectedProperty.complianceChecks) >= 80 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      Compliance Score: {getComplianceScore(selectedProperty.complianceChecks)}%
                    </Badge>
                  </div>
                </div>

                {/* Images */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Property Images</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedProperty.images.map((image, index) => (
                      <div key={index} className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                        <Camera className="h-8 w-8 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Approval Actions */}
                {selectedProperty.status === 'pending' || selectedProperty.status === 'under_review' ? (
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">Review Decision</h3>
                    <div className="space-y-3">
                      <Textarea 
                        placeholder="Add review notes..."
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        className="min-h-20"
                      />
                      
                      {!canApproveProperty(selectedProperty) && (
                        <Alert className="border-yellow-200 bg-yellow-50">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            Property does not meet minimum compliance requirements (80%). 
                            Compliance score: {getComplianceScore(selectedProperty.complianceChecks)}%
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => approvePropertyMutation.mutate({ 
                            propertyId: selectedProperty.id, 
                            notes: reviewNotes 
                          })}
                          disabled={approvePropertyMutation.isPending || !canApproveProperty(selectedProperty)}
                          className="flex-1"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button 
                          onClick={() => rejectPropertyMutation.mutate({ 
                            propertyId: selectedProperty.id, 
                            reason: reviewNotes || 'Does not meet requirements' 
                          })}
                          disabled={rejectPropertyMutation.isPending}
                          variant="destructive"
                          className="flex-1"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 border rounded">
                    <p className="text-sm text-gray-600">
                      This property has been {selectedProperty.status}.
                      {selectedProperty.reviewedBy && (
                        <span> Reviewed by {selectedProperty.reviewedBy}</span>
                      )}
                      {selectedProperty.reviewedAt && (
                        <span> on {selectedProperty.reviewedAt.toLocaleDateString()}</span>
                      )}
                    </p>
                    {selectedProperty.reviewNotes && (
                      <p className="text-sm text-gray-600 mt-1">
                        Notes: {selectedProperty.reviewNotes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Building className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Select a property to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CampusPropertyManagement;
