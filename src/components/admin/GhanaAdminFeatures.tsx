/**
 * Ghana-Specific Admin Features Component
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Provides Ghana market-specific administrative features
 * including commission management, university integration, payment oversight,
 * and local compliance monitoring for ROOMi platform
 * 
 * Technical Implementation: Integrates with AdminAuthContext for role-based
 * access, unified configuration for Ghana settings, and comprehensive error handling
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
  DollarSign, 
  School, 
  CreditCard, 
  FileCheck, 
  TrendingUp,
  Users,
  Building,
  AlertTriangle,
  CheckCircle,
  Globe,
  Smartphone
} from 'lucide-react';
import { 
  AdminRoleType, 
  createAdminPermission,
  createCampusJurisdiction,
  createCountryJurisdiction
} from '@/types/auth';

// ============================================================================
// GHANA ADMIN FEATURES TYPES
// ============================================================================

interface GhanaMetrics {
  readonly totalRevenue: number;
  readonly commissionEarned: number;
  readonly platformFees: number;
  readonly activeUniversities: number;
  readonly verifiedStudents: number;
  readonly mobileMoneyTransactions: number;
  readonly complianceScore: number;
}

interface UniversityStats {
  readonly name: string;
  readonly code: string;
  readonly students: number;
  readonly properties: number;
  readonly revenue: number;
  readonly status: 'active' | 'pending' | 'suspended';
}

interface PaymentMethodStats {
  readonly method: string;
  readonly transactions: number;
  readonly volume: number;
  readonly successRate: number;
}

// ============================================================================
// GHANA ADMIN FEATURES COMPONENT
// ============================================================================

/**
 * Ghana Admin Features Component
 * Provides comprehensive Ghana market administration
 */
const GhanaAdminFeatures: React.FC = () => {
  const { 
    getAdminRole, 
    hasPermission, 
    hasJurisdiction,
    validateAccess 
  } = useAdminAuth();

  const [selectedPeriod, setSelectedPeriod] = useState('current_month');

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  /**
   * Fetch Ghana-specific metrics
   */
  const { data: ghanaMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['ghana-admin-metrics', selectedPeriod],
    queryFn: async (): Promise<GhanaMetrics> => {
      // Mock data - would integrate with actual Ghana metrics API
      return {
        totalRevenue: 156800, // GHS
        commissionEarned: 7840, // 5% commission
        platformFees: 3400, // 100 GHS per booking
        activeUniversities: 8,
        verifiedStudents: 2340,
        mobileMoneyTransactions: 1890,
        complianceScore: 98.5
      };
    },
    enabled: hasPermission(createAdminPermission('revenue.global')) || 
             hasPermission(createAdminPermission('revenue.campus'))
  });

  /**
   * Fetch university statistics
   */
  const { data: universityStats, isLoading: universitiesLoading } = useQuery({
    queryKey: ['ghana-universities', selectedPeriod],
    queryFn: async (): Promise<UniversityStats[]> => {
      // Mock data - would integrate with actual university data
      return [
        {
          name: 'University of Professional Studies, Accra',
          code: 'UPSA',
          students: 456,
          properties: 23,
          revenue: 45600,
          status: 'active'
        },
        {
          name: 'University of Ghana',
          code: 'UG',
          students: 678,
          properties: 34,
          revenue: 67800,
          status: 'active'
        },
        {
          name: 'Kwame Nkrumah University of Science and Technology',
          code: 'KNUST',
          students: 543,
          properties: 28,
          revenue: 54300,
          status: 'active'
        },
        {
          name: 'University of Cape Coast',
          code: 'UCC',
          students: 234,
          properties: 15,
          revenue: 23400,
          status: 'active'
        }
      ];
    },
    enabled: hasPermission(createAdminPermission('campus.read'))
  });

  /**
   * Fetch payment method statistics
   */
  const { data: paymentStats, isLoading: paymentsLoading } = useQuery({
    queryKey: ['ghana-payments', selectedPeriod],
    queryFn: async (): Promise<PaymentMethodStats[]> => {
      // Mock data - would integrate with payment providers
      return [
        {
          method: 'MTN Mobile Money',
          transactions: 1245,
          volume: 124500,
          successRate: 98.2
        },
        {
          method: 'AirtelTigo Money',
          transactions: 567,
          volume: 56700,
          successRate: 97.8
        },
        {
          method: 'Vodafone Cash',
          transactions: 234,
          volume: 23400,
          successRate: 96.5
        },
        {
          method: 'Paystack',
          transactions: 890,
          volume: 89000,
          successRate: 99.1
        },
        {
          method: 'Bank Transfer',
          transactions: 123,
          volume: 12300,
          successRate: 95.2
        }
      ];
    },
    enabled: hasPermission(createAdminPermission('revenue.global'))
  });

  // ============================================================================
  // PERMISSION CHECKS
  // ============================================================================

  if (!hasPermission(createAdminPermission('global.read')) && 
      !hasPermission(createAdminPermission('campus.read'))) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to view Ghana admin features.
        </AlertDescription>
      </Alert>
    );
  }

  // ============================================================================
  // RENDER COMPONENT
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Ghana Market Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🇬🇭</span>
            <h2 className="text-xl font-semibold text-gray-900">Ghana Market Administration</h2>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Primary Market
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="current_month">Current Month</option>
            <option value="last_month">Last Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Ghana Metrics Overview */}
      {ghanaMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-xl font-bold">GHS {ghanaMetrics.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-green-600">+12.5% from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Commission (5%)</p>
                  <p className="text-xl font-bold">GHS {ghanaMetrics.commissionEarned.toLocaleString()}</p>
                  <p className="text-xs text-blue-600">Platform earnings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <School className="h-8 w-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Universities</p>
                  <p className="text-xl font-bold">{ghanaMetrics.activeUniversities}</p>
                  <p className="text-xs text-purple-600">Active partnerships</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Smartphone className="h-8 w-8 text-orange-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Mobile Money</p>
                  <p className="text-xl font-bold">{ghanaMetrics.mobileMoneyTransactions}</p>
                  <p className="text-xs text-orange-600">Transactions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Ghana Administration */}
      <Tabs defaultValue="universities" className="space-y-4">
        <TabsList>
          <TabsTrigger value="universities">Universities</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          {getAdminRole() === 'supreme_admin' && (
            <TabsTrigger value="settings">Ghana Settings</TabsTrigger>
          )}
        </TabsList>

        {/* Universities Tab */}
        <TabsContent value="universities">
          <Card>
            <CardHeader>
              <CardTitle>Ghana University Partners</CardTitle>
            </CardHeader>
            <CardContent>
              {universitiesLoading ? (
                <div className="text-center py-4">Loading universities...</div>
              ) : (
                <div className="space-y-4">
                  {universityStats?.map((university) => (
                    <div key={university.code} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <School className="h-8 w-8 text-blue-600" />
                        <div>
                          <h3 className="font-medium">{university.name}</h3>
                          <p className="text-sm text-gray-600">{university.code}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm font-medium">{university.students}</p>
                          <p className="text-xs text-gray-600">Students</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">{university.properties}</p>
                          <p className="text-xs text-gray-600">Properties</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">GHS {university.revenue.toLocaleString()}</p>
                          <p className="text-xs text-gray-600">Revenue</p>
                        </div>
                        <Badge 
                          variant={university.status === 'active' ? 'default' : 'secondary'}
                          className={university.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {university.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Ghana Payment Methods Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {paymentsLoading ? (
                <div className="text-center py-4">Loading payment data...</div>
              ) : (
                <div className="space-y-4">
                  {paymentStats?.map((payment) => (
                    <div key={payment.method} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-6 w-6 text-green-600" />
                        <div>
                          <h3 className="font-medium">{payment.method}</h3>
                          <p className="text-sm text-gray-600">{payment.successRate}% success rate</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm font-medium">{payment.transactions}</p>
                          <p className="text-xs text-gray-600">Transactions</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">GHS {payment.volume.toLocaleString()}</p>
                          <p className="text-xs text-gray-600">Volume</p>
                        </div>
                        <div className={`h-2 w-16 rounded-full ${payment.successRate > 98 ? 'bg-green-400' : payment.successRate > 95 ? 'bg-yellow-400' : 'bg-red-400'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Ghana Regulatory Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <h3 className="font-medium">Ghana Data Protection Act 2012</h3>
                      <p className="text-sm text-gray-600">Personal data protection compliance</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <h3 className="font-medium">Bank of Ghana Payment Systems Act</h3>
                      <p className="text-sm text-gray-600">Payment processing regulations</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileCheck className="h-6 w-6 text-blue-600" />
                    <div>
                      <h3 className="font-medium">Student Verification Standards</h3>
                      <p className="text-sm text-gray-600">University enrollment verification</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ghana Settings Tab - Supreme Admin Only */}
        {getAdminRole() === 'supreme_admin' && (
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Ghana Market Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <Globe className="h-4 w-4" />
                    <AlertDescription>
                      Ghana market settings can only be modified by Supreme Administrators.
                      Changes affect all campus administrators and platform operations.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col">
                      <DollarSign className="h-6 w-6 mb-2" />
                      Commission Settings
                    </Button>
                    
                    <Button variant="outline" className="h-20 flex flex-col">
                      <School className="h-6 w-6 mb-2" />
                      University Management
                    </Button>
                    
                    <Button variant="outline" className="h-20 flex flex-col">
                      <CreditCard className="h-6 w-6 mb-2" />
                      Payment Providers
                    </Button>
                    
                    <Button variant="outline" className="h-20 flex flex-col">
                      <FileCheck className="h-6 w-6 mb-2" />
                      Compliance Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default GhanaAdminFeatures;
