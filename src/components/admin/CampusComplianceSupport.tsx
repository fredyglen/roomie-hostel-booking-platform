/**
 * Campus Compliance & Support Component
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Provides campus-specific compliance monitoring and local
 * support ticket management for Campus Admins within Ghana market framework
 * 
 * Technical Implementation: Integrates with AdminAuthContext for jurisdiction
 * validation, Ghana compliance standards, and campus-specific support workflows
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
  Shield, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  MessageSquare,
  Phone,
  Mail,
  User,
  Building,
  Calendar,
  Flag,
  Eye,
  Send,
  Archive
} from 'lucide-react';
import { 
  createAdminPermission,
  createCampusJurisdiction,
  CampusJurisdiction
} from '@/types/auth';

// ============================================================================
// CAMPUS COMPLIANCE & SUPPORT TYPES
// ============================================================================

interface ComplianceCheck {
  readonly id: string;
  readonly category: 'safety' | 'legal' | 'academic' | 'financial' | 'data_protection';
  readonly title: string;
  readonly description: string;
  readonly status: 'compliant' | 'non_compliant' | 'pending_review' | 'needs_attention';
  readonly lastChecked: Date;
  readonly nextReview: Date;
  readonly responsible: string;
  readonly priority: 'low' | 'medium' | 'high' | 'critical';
  readonly documents: readonly string[];
}

interface SupportTicket {
  readonly id: string;
  readonly ticketNumber: string;
  readonly title: string;
  readonly description: string;
  readonly category: 'technical' | 'billing' | 'property' | 'student' | 'general';
  readonly priority: 'low' | 'medium' | 'high' | 'urgent';
  readonly status: 'open' | 'in_progress' | 'pending_response' | 'resolved' | 'closed';
  readonly submittedBy: string;
  readonly submitterEmail: string;
  readonly submitterPhone?: string;
  readonly assignedTo?: string;
  readonly campus: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly responses: readonly TicketResponse[];
}

interface TicketResponse {
  readonly id: string;
  readonly message: string;
  readonly author: string;
  readonly authorType: 'admin' | 'user' | 'system';
  readonly createdAt: Date;
  readonly attachments?: readonly string[];
}

interface ComplianceStats {
  readonly totalChecks: number;
  readonly compliantChecks: number;
  readonly pendingChecks: number;
  readonly criticalIssues: number;
  readonly complianceScore: number;
  readonly lastAudit: Date;
  readonly nextAudit: Date;
}

interface SupportStats {
  readonly totalTickets: number;
  readonly openTickets: number;
  readonly resolvedTickets: number;
  readonly averageResponseTime: number;
  readonly averageResolutionTime: number;
  readonly satisfactionScore: number;
  readonly ticketsByCategory: Record<string, number>;
}

// ============================================================================
// CAMPUS COMPLIANCE & SUPPORT COMPONENT
// ============================================================================

/**
 * Campus Compliance & Support Component
 * Provides comprehensive compliance monitoring and support management
 */
const CampusComplianceSupport: React.FC = () => {
  const { 
    getAdminRole, 
    hasPermission, 
    hasJurisdiction,
    validateAccess 
  } = useAdminAuth();

  const queryClient = useQueryClient();
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [selectedCampus, setSelectedCampus] = useState<CampusJurisdiction | null>(null);

  // ============================================================================
  // PERMISSION VALIDATION
  // ============================================================================

  if (!hasPermission(createAdminPermission('compliance.monitor')) && 
      !hasPermission(createAdminPermission('support.manage'))) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access compliance and support management.
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
  // DATA FETCHING
  // ============================================================================

  /**
   * Fetch compliance statistics
   */
  const { data: complianceStats, isLoading: complianceStatsLoading } = useQuery({
    queryKey: ['compliance-stats', selectedCampus],
    queryFn: async (): Promise<ComplianceStats> => {
      // Mock data - would integrate with actual compliance API
      return {
        totalChecks: 24,
        compliantChecks: 22,
        pendingChecks: 2,
        criticalIssues: 0,
        complianceScore: 91.7,
        lastAudit: new Date('2024-01-01'),
        nextAudit: new Date('2024-04-01')
      };
    },
    enabled: !!selectedCampus
  });

  /**
   * Fetch compliance checks
   */
  const { data: complianceChecks, isLoading: complianceLoading } = useQuery({
    queryKey: ['compliance-checks', selectedCampus],
    queryFn: async (): Promise<ComplianceCheck[]> => {
      // Mock data - would integrate with actual compliance API
      return [
        {
          id: '1',
          category: 'data_protection',
          title: 'Ghana Data Protection Act 2012 Compliance',
          description: 'Ensure all student data handling complies with Ghana Data Protection Act 2012',
          status: 'compliant',
          lastChecked: new Date('2024-01-05'),
          nextReview: new Date('2024-04-05'),
          responsible: 'Campus Admin',
          priority: 'high',
          documents: ['data_protection_policy.pdf', 'privacy_notice.pdf']
        },
        {
          id: '2',
          category: 'safety',
          title: 'Property Safety Standards',
          description: 'Verify all listed properties meet Ghana building safety standards',
          status: 'compliant',
          lastChecked: new Date('2024-01-03'),
          nextReview: new Date('2024-02-03'),
          responsible: 'Property Inspector',
          priority: 'critical',
          documents: ['safety_inspection_report.pdf']
        },
        {
          id: '3',
          category: 'academic',
          title: 'Student Verification Process',
          description: 'Ensure proper verification of student enrollment status',
          status: 'pending_review',
          lastChecked: new Date('2024-01-01'),
          nextReview: new Date('2024-01-15'),
          responsible: 'Academic Liaison',
          priority: 'medium',
          documents: ['verification_guidelines.pdf']
        },
        {
          id: '4',
          category: 'financial',
          title: 'Payment Processing Compliance',
          description: 'Compliance with Bank of Ghana payment regulations',
          status: 'needs_attention',
          lastChecked: new Date('2023-12-28'),
          nextReview: new Date('2024-01-10'),
          responsible: 'Finance Team',
          priority: 'high',
          documents: ['payment_compliance_report.pdf']
        }
      ];
    },
    enabled: !!selectedCampus && hasPermission(createAdminPermission('compliance.monitor'))
  });

  /**
   * Fetch support statistics
   */
  const { data: supportStats, isLoading: supportStatsLoading } = useQuery({
    queryKey: ['support-stats', selectedCampus],
    queryFn: async (): Promise<SupportStats> => {
      // Mock data - would integrate with actual support API
      return {
        totalTickets: 45,
        openTickets: 8,
        resolvedTickets: 37,
        averageResponseTime: 2.3, // hours
        averageResolutionTime: 18.5, // hours
        satisfactionScore: 4.6,
        ticketsByCategory: {
          'technical': 12,
          'billing': 8,
          'property': 15,
          'student': 7,
          'general': 3
        }
      };
    },
    enabled: !!selectedCampus
  });

  /**
   * Fetch support tickets
   */
  const { data: supportTickets, isLoading: ticketsLoading } = useQuery({
    queryKey: ['support-tickets', selectedCampus],
    queryFn: async (): Promise<SupportTicket[]> => {
      // Mock data - would integrate with actual support API
      return [
        {
          id: '1',
          ticketNumber: 'UPSA-2024-001',
          title: 'Property listing not appearing in search',
          description: 'My property listing is not showing up when students search for accommodation near UPSA.',
          category: 'technical',
          priority: 'medium',
          status: 'open',
          submittedBy: 'John Mensah',
          submitterEmail: 'john.mensah@gmail.com',
          submitterPhone: '+233244123456',
          campus: 'UPSA',
          createdAt: new Date('2024-01-08T09:30:00'),
          updatedAt: new Date('2024-01-08T09:30:00'),
          responses: []
        },
        {
          id: '2',
          ticketNumber: 'UPSA-2024-002',
          title: 'Payment not processed',
          description: 'Student payment was deducted from mobile money but booking was not confirmed.',
          category: 'billing',
          priority: 'high',
          status: 'in_progress',
          submittedBy: 'Ama Osei',
          submitterEmail: 'ama.osei@student.upsa.edu.gh',
          assignedTo: 'Campus Admin',
          campus: 'UPSA',
          createdAt: new Date('2024-01-08T11:15:00'),
          updatedAt: new Date('2024-01-08T14:20:00'),
          responses: [
            {
              id: 'r1',
              message: 'Thank you for reporting this issue. We are investigating the payment processing delay.',
              author: 'Campus Admin',
              authorType: 'admin',
              createdAt: new Date('2024-01-08T14:20:00')
            }
          ]
        }
      ];
    },
    enabled: !!selectedCampus && hasPermission(createAdminPermission('support.manage'))
  });

  /**
   * Respond to support ticket
   */
  const respondToTicketMutation = useMutation({
    mutationFn: async ({ ticketId, message }: { ticketId: string; message: string }) => {
      // Mock API call - would integrate with actual support API
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      setResponseMessage('');
    }
  });

  /**
   * Update ticket status
   */
  const updateTicketStatusMutation = useMutation({
    mutationFn: async ({ ticketId, status }: { ticketId: string; status: string }) => {
      // Mock API call - would integrate with actual support API
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['support-stats'] });
    }
  });

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  /**
   * Get compliance status color
   */
  const getComplianceStatusColor = (status: string): string => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800';
      case 'non_compliant': return 'bg-red-100 text-red-800';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'needs_attention': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  /**
   * Get priority color
   */
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  /**
   * Get ticket status color
   */
  const getTicketStatusColor = (status: string): string => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending_response': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campus Compliance & Support</h1>
            <p className="text-gray-600">Monitor compliance and manage support tickets</p>
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
            <Shield className="h-4 w-4" />
            Compliance & Support
          </Badge>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {complianceStats && (
          <>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                    <p className="text-xl font-bold">{complianceStats.complianceScore}%</p>
                    <p className="text-xs text-green-600">{complianceStats.compliantChecks}/{complianceStats.totalChecks} checks</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                    <p className="text-xl font-bold">{complianceStats.pendingChecks}</p>
                    <p className="text-xs text-orange-600">Require attention</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {supportStats && (
          <>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                    <p className="text-xl font-bold">{supportStats.openTickets}</p>
                    <p className="text-xs text-blue-600">{supportStats.totalTickets} total</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Clock className="h-6 w-6 text-purple-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Avg Response</p>
                    <p className="text-xl font-bold">{supportStats.averageResponseTime}h</p>
                    <p className="text-xs text-purple-600">{supportStats.satisfactionScore}/5.0 rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Compliance & Support Tabs */}
      <Tabs defaultValue="compliance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="compliance">Compliance Monitoring</TabsTrigger>
          <TabsTrigger value="support">Support Management</TabsTrigger>
        </TabsList>

        {/* Compliance Tab */}
        <TabsContent value="compliance">
          {hasPermission(createAdminPermission('compliance.monitor')) ? (
            <div className="space-y-6">
              {/* Ghana Compliance Framework */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flag className="h-5 w-5" />
                    🇬🇭 Ghana Compliance Framework
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <FileCheck className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-medium">Data Protection Act 2012</h3>
                      <p className="text-sm text-gray-600">Student data privacy compliance</p>
                      <Badge className="mt-2 bg-green-100 text-green-800">Compliant</Badge>
                    </div>

                    <div className="text-center p-4 border rounded-lg">
                      <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <h3 className="font-medium">Building Safety Standards</h3>
                      <p className="text-sm text-gray-600">Property safety regulations</p>
                      <Badge className="mt-2 bg-blue-100 text-blue-800">Monitored</Badge>
                    </div>

                    <div className="text-center p-4 border rounded-lg">
                      <Building className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <h3 className="font-medium">Payment Regulations</h3>
                      <p className="text-sm text-gray-600">Bank of Ghana compliance</p>
                      <Badge className="mt-2 bg-yellow-100 text-yellow-800">Review Needed</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Compliance Checks */}
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Checks</CardTitle>
                </CardHeader>
                <CardContent>
                  {complianceLoading ? (
                    <div className="text-center py-4">Loading compliance checks...</div>
                  ) : (
                    <div className="space-y-3">
                      {complianceChecks?.map((check) => (
                        <div key={check.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`h-3 w-3 rounded-full ${
                              check.status === 'compliant' ? 'bg-green-500' :
                              check.status === 'non_compliant' ? 'bg-red-500' :
                              check.status === 'pending_review' ? 'bg-yellow-500' :
                              'bg-orange-500'
                            }`} />
                            <div>
                              <h3 className="font-medium">{check.title}</h3>
                              <p className="text-sm text-gray-600">{check.description}</p>
                              <p className="text-xs text-gray-500">
                                Last checked: {check.lastChecked.toLocaleDateString()} |
                                Next review: {check.nextReview.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getPriorityColor(check.priority)}>
                              {check.priority}
                            </Badge>
                            <Badge className={getComplianceStatusColor(check.status)}>
                              {check.status.replace('_', ' ')}
                            </Badge>
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              Review
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to view compliance monitoring.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Support Tab */}
        <TabsContent value="support">
          {hasPermission(createAdminPermission('support.manage')) ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Support Tickets List */}
              <Card>
                <CardHeader>
                  <CardTitle>Support Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  {ticketsLoading ? (
                    <div className="text-center py-4">Loading support tickets...</div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {supportTickets?.map((ticket) => (
                        <div
                          key={ticket.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedTicket?.id === ticket.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <MessageSquare className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-medium">{ticket.title}</h3>
                                <p className="text-sm text-gray-600">{ticket.submittedBy}</p>
                                <p className="text-xs text-gray-500">#{ticket.ticketNumber}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={getTicketStatusColor(ticket.status)}>
                                {ticket.status.replace('_', ' ')}
                              </Badge>
                              <Badge className={`mt-1 ${getPriorityColor(ticket.priority)}`}>
                                {ticket.priority}
                              </Badge>
                              <p className="text-xs text-gray-500 mt-1">
                                {ticket.createdAt.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Ticket Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Ticket Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedTicket ? (
                    <div className="space-y-4">
                      {/* Ticket Information */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">{selectedTicket.title}</h3>
                          <Badge className={getTicketStatusColor(selectedTicket.status)}>
                            {selectedTicket.status.replace('_', ' ')}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <Label className="text-gray-600">Ticket Number</Label>
                            <p className="font-medium">#{selectedTicket.ticketNumber}</p>
                          </div>
                          <div>
                            <Label className="text-gray-600">Category</Label>
                            <p className="font-medium capitalize">{selectedTicket.category}</p>
                          </div>
                          <div>
                            <Label className="text-gray-600">Priority</Label>
                            <Badge className={getPriorityColor(selectedTicket.priority)}>
                              {selectedTicket.priority}
                            </Badge>
                          </div>
                          <div>
                            <Label className="text-gray-600">Campus</Label>
                            <p className="font-medium">{selectedTicket.campus}</p>
                          </div>
                          <div>
                            <Label className="text-gray-600">Submitted By</Label>
                            <p className="font-medium">{selectedTicket.submittedBy}</p>
                          </div>
                          <div>
                            <Label className="text-gray-600">Created</Label>
                            <p className="font-medium">{selectedTicket.createdAt.toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div>
                          <Label className="text-gray-600">Description</Label>
                          <p className="text-sm mt-1">{selectedTicket.description}</p>
                        </div>

                        <div>
                          <Label className="text-gray-600">Contact Information</Label>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-sm">{selectedTicket.submitterEmail}</span>
                            </div>
                            {selectedTicket.submitterPhone && (
                              <div className="flex items-center space-x-1">
                                <Phone className="h-3 w-3 text-gray-400" />
                                <span className="text-sm">{selectedTicket.submitterPhone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Ticket Responses */}
                      <div className="space-y-3">
                        <h3 className="font-medium text-gray-900">Responses</h3>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {selectedTicket.responses.map((response) => (
                            <div key={response.id} className="p-3 bg-gray-50 rounded">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">{response.author}</span>
                                <span className="text-xs text-gray-500">
                                  {response.createdAt.toLocaleDateString()} {response.createdAt.toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-sm">{response.message}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Response Form */}
                      {selectedTicket.status !== 'closed' && (
                        <div className="space-y-3">
                          <h3 className="font-medium text-gray-900">Add Response</h3>
                          <Textarea
                            placeholder="Type your response..."
                            value={responseMessage}
                            onChange={(e) => setResponseMessage(e.target.value)}
                            className="min-h-20"
                          />
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => respondToTicketMutation.mutate({
                                ticketId: selectedTicket.id,
                                message: responseMessage
                              })}
                              disabled={!responseMessage.trim() || respondToTicketMutation.isPending}
                              className="flex-1"
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Send Response
                            </Button>

                            {selectedTicket.status === 'open' && (
                              <Button
                                onClick={() => updateTicketStatusMutation.mutate({
                                  ticketId: selectedTicket.id,
                                  status: 'resolved'
                                })}
                                disabled={updateTicketStatusMutation.isPending}
                                variant="outline"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Resolve
                              </Button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Ticket Actions */}
                      <div className="flex space-x-2 pt-3 border-t">
                        <Button
                          onClick={() => updateTicketStatusMutation.mutate({
                            ticketId: selectedTicket.id,
                            status: selectedTicket.status === 'open' ? 'in_progress' : 'open'
                          })}
                          disabled={updateTicketStatusMutation.isPending}
                          variant="outline"
                          size="sm"
                        >
                          {selectedTicket.status === 'open' ? 'Start Progress' : 'Reopen'}
                        </Button>

                        {selectedTicket.status !== 'closed' && (
                          <Button
                            onClick={() => updateTicketStatusMutation.mutate({
                              ticketId: selectedTicket.id,
                              status: 'closed'
                            })}
                            disabled={updateTicketStatusMutation.isPending}
                            variant="outline"
                            size="sm"
                          >
                            <Archive className="h-3 w-3 mr-1" />
                            Close
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>Select a ticket to view details</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You don't have permission to manage support tickets.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampusComplianceSupport;
