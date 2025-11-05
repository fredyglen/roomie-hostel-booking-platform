/**
 * Student Verification System Component
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Provides comprehensive student verification tools for Campus Admins
 * with university enrollment integration, document verification, and Ghana-specific
 * academic validation for UPSA, University of Ghana, KNUST, and UCC
 * 
 * Technical Implementation: Integrates with AdminAuthContext for jurisdiction validation,
 * university enrollment APIs, and comprehensive verification workflows
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
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText,
  School,
  AlertTriangle,
  Eye,
  Download,
  Search,
  Filter,
  Calendar,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { 
  createAdminPermission,
  createCampusJurisdiction,
  CampusJurisdiction
} from '@/types/auth';

// ============================================================================
// STUDENT VERIFICATION TYPES
// ============================================================================

interface StudentVerification {
  readonly id: string;
  readonly studentId: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phone: string;
  readonly university: string;
  readonly program: string;
  readonly yearOfStudy: number;
  readonly expectedGraduation: string;
  readonly studentIdNumber: string;
  readonly enrollmentStatus: 'active' | 'inactive' | 'graduated' | 'suspended';
  readonly submittedAt: Date;
  readonly status: 'pending' | 'approved' | 'rejected' | 'under_review';
  readonly documents: readonly VerificationDocument[];
  readonly verificationNotes?: string;
  readonly verifiedBy?: string;
  readonly verifiedAt?: Date;
  readonly rejectionReason?: string;
}

interface VerificationDocument {
  readonly id: string;
  readonly type: 'student_id' | 'enrollment_letter' | 'transcript' | 'passport' | 'other';
  readonly fileName: string;
  readonly fileUrl: string;
  readonly uploadedAt: Date;
  readonly verified: boolean;
}

interface UniversityEnrollmentData {
  readonly studentId: string;
  readonly isEnrolled: boolean;
  readonly program: string;
  readonly yearOfStudy: number;
  readonly enrollmentDate: Date;
  readonly status: 'active' | 'inactive' | 'graduated' | 'suspended';
  readonly gpa?: number;
  readonly lastUpdated: Date;
}

interface VerificationStats {
  readonly totalPending: number;
  readonly totalApproved: number;
  readonly totalRejected: number;
  readonly averageProcessingTime: number;
  readonly verificationRate: number;
  readonly campusBreakdown: Record<string, number>;
}

// ============================================================================
// STUDENT VERIFICATION SYSTEM COMPONENT
// ============================================================================

/**
 * Student Verification System Component
 * Provides comprehensive student verification and management
 */
const StudentVerificationSystem: React.FC = () => {
  const { 
    getAdminRole, 
    hasPermission, 
    hasJurisdiction,
    validateAccess 
  } = useAdminAuth();

  const queryClient = useQueryClient();
  const [selectedVerification, setSelectedVerification] = useState<StudentVerification | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [universityFilter, setUniversityFilter] = useState<string>('all');

  // ============================================================================
  // PERMISSION VALIDATION
  // ============================================================================

  if (!hasPermission(createAdminPermission('students.verify'))) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access student verification system.
        </AlertDescription>
      </Alert>
    );
  }

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  /**
   * Fetch verification statistics
   * TODO: Connect to real student_verifications table (Phase 6)
   */
  const { data: verificationStats, isLoading: statsLoading } = useQuery({
    queryKey: ['verification-stats'],
    queryFn: async (): Promise<VerificationStats> => {
      // Return empty stats until connected to database
      return {
        totalPending: 0,
        totalApproved: 0,
        totalRejected: 0,
        averageProcessingTime: 0,
        verificationRate: 0,
        campusBreakdown: {}
      };
    }
  });

  /**
   * Fetch student verifications with filtering
   * TODO: Connect to real student_verifications table (Phase 6)
   */
  const { data: verifications, isLoading: verificationsLoading } = useQuery({
    queryKey: ['student-verifications', searchTerm, statusFilter, universityFilter],
    queryFn: async (): Promise<StudentVerification[]> => {
      // Return empty array until connected to database
      // Real implementation will query: supabase.from('student_verifications').select('*')
      return [];

      /* REMOVED MOCK DATA - Will be replaced with real queries in Phase 6
      const mockVerifications: StudentVerification[] = [
        {
          id: '1',
          studentId: 'user_123',
          firstName: 'Kwame',
          lastName: 'Asante',
          email: 'kwame.asante@student.upsa.edu.gh',
          phone: '+233244123456',
          university: 'UPSA',
          program: 'Business Administration',
          yearOfStudy: 2,
          expectedGraduation: '2026-06',
          studentIdNumber: 'UPSA/2024/001234',
          enrollmentStatus: 'active',
          submittedAt: new Date('2024-01-08T10:30:00'),
          status: 'pending',
          documents: [
            {
              id: 'doc1',
              type: 'student_id',
              fileName: 'student_id_kwame.pdf',
              fileUrl: '/documents/student_id_kwame.pdf',
              uploadedAt: new Date('2024-01-08T10:30:00'),
              verified: false
            },
            {
              id: 'doc2',
              type: 'enrollment_letter',
              fileName: 'enrollment_letter_kwame.pdf',
              fileUrl: '/documents/enrollment_letter_kwame.pdf',
              uploadedAt: new Date('2024-01-08T10:30:00'),
              verified: false
            }
          ]
        },
        {
          id: '2',
          studentId: 'user_124',
          firstName: 'Ama',
          lastName: 'Osei',
          email: 'ama.osei@student.ug.edu.gh',
          phone: '+233244123457',
          university: 'UG',
          program: 'Computer Science',
          yearOfStudy: 3,
          expectedGraduation: '2025-06',
          studentIdNumber: 'UG/2022/005678',
          enrollmentStatus: 'active',
          submittedAt: new Date('2024-01-08T09:15:00'),
          status: 'under_review',
          documents: [
            {
              id: 'doc3',
              type: 'student_id',
              fileName: 'student_id_ama.pdf',
              fileUrl: '/documents/student_id_ama.pdf',
              uploadedAt: new Date('2024-01-08T09:15:00'),
              verified: true
            },
            {
              id: 'doc4',
              type: 'transcript',
              fileName: 'transcript_ama.pdf',
              fileUrl: '/documents/transcript_ama.pdf',
              uploadedAt: new Date('2024-01-08T09:15:00'),
              verified: false
            }
          ]
        }
      ];

      // Apply filters
      return mockVerifications.filter(verification => {
        const matchesSearch = searchTerm === '' ||
          verification.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          verification.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          verification.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          verification.studentIdNumber.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || verification.status === statusFilter;
        const matchesUniversity = universityFilter === 'all' || verification.university === universityFilter;

        return matchesSearch && matchesStatus && matchesUniversity;
      });
      */
    }
  });

  /**
   * Verify university enrollment
   * TODO: Integrate with Ghana university APIs (Phase 6)
   */
  const verifyEnrollmentMutation = useMutation({
    mutationFn: async (studentIdNumber: string): Promise<UniversityEnrollmentData> => {
      // Placeholder until university API integration
      throw new Error('University enrollment verification not yet connected. Coming soon in Phase 6.');
    }
  });

  /**
   * Approve student verification
   * TODO: Connect to student_verifications table (Phase 6)
   */
  const approveVerificationMutation = useMutation({
    mutationFn: async ({ verificationId, notes }: { verificationId: string; notes?: string }) => {
      // Placeholder until database integration
      throw new Error('Student verification approval not yet connected. Coming soon in Phase 6.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-verifications'] });
      queryClient.invalidateQueries({ queryKey: ['verification-stats'] });
      setSelectedVerification(null);
    }
  });

  /**
   * Reject student verification
   * TODO: Connect to student_verifications table (Phase 6)
   */
  const rejectVerificationMutation = useMutation({
    mutationFn: async ({ verificationId, reason }: { verificationId: string; reason: string }) => {
      // Placeholder until database integration
      throw new Error('Student verification rejection not yet connected. Coming soon in Phase 6.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-verifications'] });
      queryClient.invalidateQueries({ queryKey: ['verification-stats'] });
      setSelectedVerification(null);
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
   * Get document type display name
   */
  const getDocumentTypeName = (type: string): string => {
    switch (type) {
      case 'student_id': return 'Student ID';
      case 'enrollment_letter': return 'Enrollment Letter';
      case 'transcript': return 'Transcript';
      case 'passport': return 'Passport';
      default: return 'Other Document';
    }
  };

  // ============================================================================
  // RENDER COMPONENT
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Verification System</h1>
            <p className="text-gray-600">Verify student enrollment and manage campus access</p>
          </div>
        </div>
      </div>

      {/* Verification Statistics */}
      {verificationStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-yellow-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-xl font-bold">{verificationStats.totalPending}</p>
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
                  <p className="text-xl font-bold">{verificationStats.totalApproved}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <XCircle className="h-6 w-6 text-red-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-xl font-bold">{verificationStats.totalRejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Calendar className="h-6 w-6 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Avg. Time</p>
                  <p className="text-xl font-bold">{verificationStats.averageProcessingTime}d</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-xl font-bold">{verificationStats.verificationRate}%</p>
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
                  placeholder="Search by name, email, or student ID..."
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

      {/* Verification List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verification Queue */}
        <Card>
          <CardHeader>
            <CardTitle>Verification Queue</CardTitle>
          </CardHeader>
          <CardContent>
            {verificationsLoading ? (
              <div className="text-center py-4">Loading verifications...</div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {verifications?.map((verification) => (
                  <div 
                    key={verification.id} 
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedVerification?.id === verification.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedVerification(verification)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{verification.firstName} {verification.lastName}</h3>
                          <p className="text-sm text-gray-600">{verification.studentIdNumber}</p>
                          <p className="text-xs text-gray-500">{verification.university} - {verification.program}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusBadgeColor(verification.status)}>
                          {verification.status.replace('_', ' ')}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {verification.submittedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Verification Details */}
        <Card>
          <CardHeader>
            <CardTitle>Verification Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedVerification ? (
              <div className="space-y-4">
                {/* Student Information */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Student Information</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <Label className="text-gray-600">Name</Label>
                      <p className="font-medium">{selectedVerification.firstName} {selectedVerification.lastName}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Student ID</Label>
                      <p className="font-medium">{selectedVerification.studentIdNumber}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Email</Label>
                      <p className="font-medium">{selectedVerification.email}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Phone</Label>
                      <p className="font-medium">{selectedVerification.phone}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">University</Label>
                      <p className="font-medium">{selectedVerification.university}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Program</Label>
                      <p className="font-medium">{selectedVerification.program}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Year of Study</Label>
                      <p className="font-medium">Year {selectedVerification.yearOfStudy}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Expected Graduation</Label>
                      <p className="font-medium">{selectedVerification.expectedGraduation}</p>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Submitted Documents</h3>
                  <div className="space-y-2">
                    {selectedVerification.documents.map((document) => (
                      <div key={document.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-600" />
                          <div>
                            <p className="text-sm font-medium">{getDocumentTypeName(document.type)}</p>
                            <p className="text-xs text-gray-500">{document.fileName}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {document.verified && (
                            <Badge className="bg-green-100 text-green-800">Verified</Badge>
                          )}
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* University Enrollment Check */}
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">University Enrollment</h3>
                  <Button 
                    onClick={() => verifyEnrollmentMutation.mutate(selectedVerification.studentIdNumber)}
                    disabled={verifyEnrollmentMutation.isPending}
                    variant="outline"
                    className="w-full"
                  >
                    {verifyEnrollmentMutation.isPending ? 'Checking...' : 'Verify Enrollment'}
                  </Button>
                  
                  {verifyEnrollmentMutation.data && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Enrollment Verified</span>
                      </div>
                      <div className="mt-2 text-sm text-green-700">
                        <p>Status: {verifyEnrollmentMutation.data.status}</p>
                        <p>Program: {verifyEnrollmentMutation.data.program}</p>
                        <p>Year: {verifyEnrollmentMutation.data.yearOfStudy}</p>
                        {verifyEnrollmentMutation.data.gpa && (
                          <p>GPA: {verifyEnrollmentMutation.data.gpa}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Verification Actions */}
                {selectedVerification.status === 'pending' || selectedVerification.status === 'under_review' ? (
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">Verification Decision</h3>
                    <div className="space-y-3">
                      <Textarea 
                        placeholder="Add verification notes (optional)..."
                        className="min-h-20"
                      />
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => approveVerificationMutation.mutate({ verificationId: selectedVerification.id })}
                          disabled={approveVerificationMutation.isPending}
                          className="flex-1"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button 
                          onClick={() => rejectVerificationMutation.mutate({ 
                            verificationId: selectedVerification.id, 
                            reason: 'Invalid documents' 
                          })}
                          disabled={rejectVerificationMutation.isPending}
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
                      This verification has been {selectedVerification.status}.
                      {selectedVerification.verifiedBy && (
                        <span> Processed by {selectedVerification.verifiedBy}</span>
                      )}
                      {selectedVerification.verifiedAt && (
                        <span> on {selectedVerification.verifiedAt.toLocaleDateString()}</span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Select a verification to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentVerificationSystem;
