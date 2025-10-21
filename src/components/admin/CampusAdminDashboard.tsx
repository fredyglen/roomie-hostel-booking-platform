/**
 * Campus Admin Dashboard Component
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Provides specialized dashboard for Campus Admins with
 * jurisdiction-based access to assigned university campuses, local property
 * management, student verification, and campus-specific analytics
 * 
 * Technical Implementation: Integrates with AdminAuthContext for jurisdiction
 * validation, campus-specific data filtering, and local administrative tools
 * 
 * @author ROOMi Platform Team
 * @version 2.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  School, 
  Users, 
  Building, 
  CheckCircle, 
  Clock,
  TrendingUp,
  AlertTriangle,
  FileCheck,
  MapPin,
  Calendar,
  DollarSign,
  Activity
} from 'lucide-react';
import { 
  AdminRoleType, 
  createAdminPermission,
  createCampusJurisdiction,
  CampusJurisdiction
} from '@/types/auth';

// ============================================================================
// CAMPUS ADMIN DASHBOARD TYPES
// ============================================================================

interface CampusMetrics {
  readonly campusName: string;
  readonly campusCode: string;
  readonly totalStudents: number;
  readonly verifiedStudents: number;
  readonly pendingVerifications: number;
  readonly totalProperties: number;
  readonly approvedProperties: number;
  readonly pendingApprovals: number;
  readonly monthlyRevenue: number;
  readonly occupancyRate: number;
  readonly activeDisputes: number;
  readonly resolvedDisputes: number;
}

interface StudentVerificationItem {
  readonly id: string;
  readonly studentName: string;
  readonly studentId: string;
  readonly university: string;
  readonly program: string;
  readonly submittedAt: Date;
  readonly status: 'pending' | 'approved' | 'rejected';
  readonly documents: readonly string[];
}

interface PropertyApprovalItem {
  readonly id: string;
  readonly propertyTitle: string;
  readonly ownerName: string;
  readonly location: string;
  readonly submittedAt: Date;
  readonly status: 'pending' | 'approved' | 'rejected';
  readonly price: number;
  readonly type: string;
}

interface CampusDispute {
  readonly id: string;
  readonly studentName: string;
  readonly propertyTitle: string;
  readonly issueType: string;
  readonly priority: 'low' | 'medium' | 'high';
  readonly status: 'open' | 'investigating' | 'resolved';
  readonly createdAt: Date;
}

// ============================================================================
// CAMPUS ADMIN DASHBOARD COMPONENT
// ============================================================================

/**
 * Campus Admin Dashboard Component
 * Provides comprehensive campus-level administration
 */
const CampusAdminDashboard: React.FC = () => {
  const { 
    adminUser,
    getAdminRole, 
    hasPermission, 
    hasJurisdiction,
    validateAccess 
  } = useAdminAuth();

  const [selectedCampus, setSelectedCampus] = useState<CampusJurisdiction | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('current_month');

  // ============================================================================
  // JURISDICTION VALIDATION
  // ============================================================================

  // Verify Campus Admin access
  if (getAdminRole() !== 'campus_admin') {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Campus Dashboard is only available to Campus Administrators.
        </AlertDescription>
      </Alert>
    );
  }

  // Get assigned campuses for this admin
  const assignedCampuses: CampusJurisdiction[] = [
    createCampusJurisdiction('UPSA-Accra'),
    createCampusJurisdiction('UG-Legon')
  ]; // Would come from adminSession.jurisdiction.campuses

  // Set default campus if none selected
  React.useEffect(() => {
    if (!selectedCampus && assignedCampuses.length > 0) {
      setSelectedCampus(assignedCampuses[0]);
    }
  }, [selectedCampus, assignedCampuses]);

  // ============================================================================
  // DATA FETCHING WITH JURISDICTION FILTERING
  // ============================================================================

  /**
   * Fetch campus-specific metrics
   */
  const { data: campusMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['campus-metrics', selectedCampus, selectedTimeRange],
    queryFn: async (): Promise<CampusMetrics> => {
      // Mock data - would integrate with actual campus metrics API
      const campusData: Record<string, CampusMetrics> = {
        'UPSA-Accra': {
          campusName: 'University of Professional Studies, Accra',
          campusCode: 'UPSA',
          totalStudents: 456,
          verifiedStudents: 423,
          pendingVerifications: 33,
          totalProperties: 23,
          approvedProperties: 20,
          pendingApprovals: 3,
          monthlyRevenue: 45600,
          occupancyRate: 87.5,
          activeDisputes: 2,
          resolvedDisputes: 15
        },
        'UG-Legon': {
          campusName: 'University of Ghana, Legon',
          campusCode: 'UG',
          totalStudents: 678,
          verifiedStudents: 634,
          pendingVerifications: 44,
          totalProperties: 34,
          approvedProperties: 31,
          pendingApprovals: 3,
          monthlyRevenue: 67800,
          occupancyRate: 92.3,
          activeDisputes: 1,
          resolvedDisputes: 22
        }
      };

      return campusData[selectedCampus || 'UPSA-Accra'] || campusData['UPSA-Accra'];
    },
    enabled: !!selectedCampus && hasPermission(createAdminPermission('campus.read'))
  });

  /**
   * Fetch pending student verifications
   */
  const { data: pendingVerifications, isLoading: verificationsLoading } = useQuery({
    queryKey: ['campus-verifications', selectedCampus],
    queryFn: async (): Promise<StudentVerificationItem[]> => {
      // Mock data - would integrate with actual verification API
      return [
        {
          id: '1',
          studentName: 'Obed Afrifa ',
          studentId: 'UPSA/2025/001234',
          university: 'UPSA',
          program: 'BSc in Business Administration',
          submittedAt: new Date('2024-01-08T10:30:00'),
          status: 'pending',
          documents: ['student_id.pdf', 'enrollment_letter.pdf']
        }
        
        {
          id: '1',
          studentName: 'Obed Afrifa ',
          studentId: 'UPSA/2025/001234',
          university: 'University of Professional Studies',
          program: 'BSc in Information Technology',
          submittedAt: new Date('2024-01-08T10:30:00'),
          status: 'pending',
          documents: ['student_id.pdf', 'enrollment_letter.pdf']
        }
        ,
        {
          id: '2',
          studentName: 'Precious Blame',
          studentId: 'UPSA/2025/001235',
          university: 'UPSA',
          program: 'Computer Science',
          submittedAt: new Date('2024-01-08T09:15:00'),
          status: 'pending',
          documents: ['student_id.pdf', 'transcript.pdf']
        }
      ];
    },
    enabled: !!selectedCampus && hasPermission(createAdminPermission('students.verify'))
  });

  /**
   * Fetch pending property approvals
   */
  const { data: pendingApprovals, isLoading: approvalsLoading } = useQuery({
    queryKey: ['campus-approvals', selectedCampus],
    queryFn: async (): Promise<PropertyApprovalItem[]> => {
      // Mock data - would integrate with actual property approval API
      return [
        {
          id: '1',
          propertyTitle: 'Heavens Gate Hostel near UPSA',
          ownerName: 'Mr. Henry Ghaan',
          location: 'East Legon, Accra',
          submittedAt: new Date('2024-01-08T08:00:00'),
          status: 'pending',
          price: 1200,
          type: 'Apartment'
        },
        {
          id: '2',
          propertyTitle: 'Student Hostel - UPSA Campus',
          ownerName: 'Grace Adjei',
          location: 'Madina, Accra',
          submittedAt: new Date('2024-01-07T16:30:00'),
          status: 'pending',
          price: 800,
          type: 'Hostel'
        }
      ];
    },
    enabled: !!selectedCampus && hasPermission(createAdminPermission('properties.approve'))
  });

  /**
   * Fetch campus disputes
   */
  const { data: campusDisputes, isLoading: disputesLoading } = useQuery({
    queryKey: ['campus-disputes', selectedCampus],
    queryFn: async (): Promise<CampusDispute[]> => {
      // Mock data - would integrate with actual disputes API
      return [
        {
          id: '1',
          studentName: 'Kofi Boateng',
          propertyTitle: 'Student Lodge UPSA',
          issueType: 'Maintenance Issue',
          priority: 'medium',
          status: 'investigating',
          createdAt: new Date('2024-01-07T14:20:00')
        },
        {
          id: '2',
          studentName: 'Akosua Frimpong',
          propertyTitle: 'Campus View Apartments',
          issueType: 'Payment Dispute',
          priority: 'high',
          status: 'open',
          createdAt: new Date('2024-01-08T11:45:00')
        }
      ];
    },
    enabled: !!selectedCampus && hasPermission(createAdminPermission('disputes.resolve'))
  });

  // ============================================================================
  // RENDER COMPONENT
  // ============================================================================

  if (!selectedCampus) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          No campus jurisdiction assigned. Please contact your administrator.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Campus Admin Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <School className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campus Administration</h1>
            <p className="text-gray-600">
              {campusMetrics?.campusName || 'Loading campus...'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Campus Selector */}
          {assignedCampuses.length > 1 && (
            <select 
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value as CampusJurisdiction)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              {assignedCampuses.map((campus) => (
                <option key={campus} value={campus}>
                  {campus.replace('-', ' - ')}
                </option>
              ))}
            </select>
          )}
          
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-2">
            <School className="h-4 w-4" />
            Campus Admin
          </Badge>
        </div>
      </div>

      {/* Campus Metrics Overview */}
      {campusMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-xl font-bold">{campusMetrics.totalStudents}</p>
                  <p className="text-xs text-green-600">{campusMetrics.verifiedStudents} verified</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Properties</p>
                  <p className="text-xl font-bold">{campusMetrics.totalProperties}</p>
                  <p className="text-xs text-blue-600">{campusMetrics.approvedProperties} approved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-xl font-bold">GHS {campusMetrics.monthlyRevenue.toLocaleString()}</p>
                  <p className="text-xs text-purple-600">{campusMetrics.occupancyRate}% occupancy</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-orange-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Active Issues</p>
                  <p className="text-xl font-bold">{campusMetrics.activeDisputes}</p>
                  <p className="text-xs text-orange-600">{campusMetrics.resolvedDisputes} resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Campus Management Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="disputes">Disputes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button className="h-20 flex flex-col">
                    <CheckCircle className="h-6 w-6 mb-2" />
                    Verify Students
                    {campusMetrics && (
                      <Badge variant="secondary" className="mt-1">
                        {campusMetrics.pendingVerifications}
                      </Badge>
                    )}
                  </Button>
                  
                  <Button variant="outline" className="h-20 flex flex-col">
                    <Building className="h-6 w-6 mb-2" />
                    Approve Properties
                    {campusMetrics && (
                      <Badge variant="secondary" className="mt-1">
                        {campusMetrics.pendingApprovals}
                      </Badge>
                    )}
                  </Button>
                  
                  <Button variant="outline" className="h-20 flex flex-col">
                    <AlertTriangle className="h-6 w-6 mb-2" />
                    Resolve Disputes
                    {campusMetrics && (
                      <Badge variant="secondary" className="mt-1">
                        {campusMetrics.activeDisputes}
                      </Badge>
                    )}
                  </Button>
                  
                  <Button variant="outline" className="h-20 flex flex-col">
                    <TrendingUp className="h-6 w-6 mb-2" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-green-400 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Student verified</p>
                      <p className="text-xs text-gray-600">Kwame Asante - 2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-blue-400 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Property approved</p>
                      <p className="text-xs text-gray-600">Modern 2BR Apartment - 4 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-orange-400 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Dispute resolved</p>
                      <p className="text-xs text-gray-600">Maintenance issue - 1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Student Verification Queue</CardTitle>
            </CardHeader>
            <CardContent>
              {verificationsLoading ? (
                <div className="text-center py-4">Loading verifications...</div>
              ) : (
                <div className="space-y-4">
                  {pendingVerifications?.map((verification) => (
                    <div key={verification.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Users className="h-6 w-6 text-blue-600" />
                        <div>
                          <h3 className="font-medium">{verification.studentName}</h3>
                          <p className="text-sm text-gray-600">{verification.studentId}</p>
                          <p className="text-xs text-gray-500">{verification.program}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">
                          {verification.documents.length} docs
                        </Badge>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {verification.submittedAt.toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {verification.submittedAt.toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Review
                          </Button>
                          <Button size="sm">
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Properties Tab */}
        <TabsContent value="properties">
          <Card>
            <CardHeader>
              <CardTitle>Property Approval Queue</CardTitle>
            </CardHeader>
            <CardContent>
              {approvalsLoading ? (
                <div className="text-center py-4">Loading approvals...</div>
              ) : (
                <div className="space-y-4">
                  {pendingApprovals?.map((property) => (
                    <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Building className="h-6 w-6 text-green-600" />
                        <div>
                          <h3 className="font-medium">{property.propertyTitle}</h3>
                          <p className="text-sm text-gray-600">{property.ownerName}</p>
                          <p className="text-xs text-gray-500">{property.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-center">
                          <p className="text-sm font-medium">GHS {property.price}</p>
                          <p className="text-xs text-gray-600">{property.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {property.submittedAt.toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {property.submittedAt.toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Review
                          </Button>
                          <Button size="sm">
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Disputes Tab */}
        <TabsContent value="disputes">
          <Card>
            <CardHeader>
              <CardTitle>Campus Disputes</CardTitle>
            </CardHeader>
            <CardContent>
              {disputesLoading ? (
                <div className="text-center py-4">Loading disputes...</div>
              ) : (
                <div className="space-y-4">
                  {campusDisputes?.map((dispute) => (
                    <div key={dispute.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className={`h-6 w-6 ${
                          dispute.priority === 'high' ? 'text-red-600' : 
                          dispute.priority === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                        }`} />
                        <div>
                          <h3 className="font-medium">{dispute.studentName}</h3>
                          <p className="text-sm text-gray-600">{dispute.propertyTitle}</p>
                          <p className="text-xs text-gray-500">{dispute.issueType}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge 
                          variant={dispute.priority === 'high' ? 'destructive' : 'secondary'}
                          className={dispute.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : ''}
                        >
                          {dispute.priority}
                        </Badge>
                        <Badge variant="outline">
                          {dispute.status}
                        </Badge>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {dispute.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                        <Button size="sm">
                          Resolve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Campus Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Student Verification Rate</span>
                    <span className="font-medium">92.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Property Approval Time</span>
                    <span className="font-medium">2.3 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Dispute Resolution Time</span>
                    <span className="font-medium">1.8 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Student Satisfaction</span>
                    <span className="font-medium">4.6/5.0</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">New Students</span>
                    <span className="font-medium text-green-600">+15.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Property Listings</span>
                    <span className="font-medium text-blue-600">+8.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Booking Volume</span>
                    <span className="font-medium text-purple-600">+12.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Revenue Growth</span>
                    <span className="font-medium text-orange-600">+18.9%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampusAdminDashboard;
