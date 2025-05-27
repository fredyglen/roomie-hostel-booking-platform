
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icon } from '@iconify/react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/currency';

interface SubscriptionAnalytics {
  totalRevenue: number;
  activeSubscriptions: number;
  freeTierUsers: number;
  premiumUsers: number;
  conversionRate: number;
  churnRate: number;
}

const SubscriptionManagement: React.FC = () => {
  const [analytics] = useState<SubscriptionAnalytics>({
    totalRevenue: 12500,
    activeSubscriptions: 245,
    freeTierUsers: 1850,
    premiumUsers: 245,
    conversionRate: 11.7,
    churnRate: 3.2
  });

  const [pricing, setPricing] = useState({
    studentMonthly: 15,
    studentYearly: 150,
    ownerMonthly: 50,
    ownerYearly: 500,
    serviceFee: 5
  });

  const { toast } = useToast();

  const handlePricingUpdate = () => {
    toast({
      title: "Pricing Updated",
      description: "Subscription pricing has been updated successfully.",
    });
  };

  const mockSubscriptions = [
    { id: '1', userEmail: 'student1@university.edu', plan: 'Premium Student', status: 'active', revenue: 15, nextBilling: '2024-02-15' },
    { id: '2', userEmail: 'owner1@properties.com', plan: 'Premium Owner', status: 'active', revenue: 50, nextBilling: '2024-02-12' },
    { id: '3', userEmail: 'student2@university.edu', plan: 'Premium Student', status: 'cancelled', revenue: 0, nextBilling: null },
    { id: '4', userEmail: 'owner2@properties.com', plan: 'Premium Owner', status: 'active', revenue: 50, nextBilling: '2024-02-20' }
  ];

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Icon icon="solar:dollar-bold" className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.totalRevenue)}</div>
            <p className="text-xs text-gray-600">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Icon icon="solar:crown-bold" className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeSubscriptions}</div>
            <p className="text-xs text-gray-600">+8.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Icon icon="solar:chart-bold" className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.conversionRate}%</div>
            <p className="text-xs text-gray-600">+2.1% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Management</TabsTrigger>
          <TabsTrigger value="subscriptions">Active Subscriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Free Tier Users</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{analytics.freeTierUsers}</span>
                      <Badge variant="secondary">88.3%</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Premium Users</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{analytics.premiumUsers}</span>
                      <Badge variant="default">11.7%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Monthly Recurring Revenue</span>
                    <span className="text-sm font-medium">{formatCurrency(analytics.totalRevenue)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Conversion Rate</span>
                    <span className="text-sm font-medium">{analytics.conversionRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Churn Rate</span>
                    <span className="text-sm font-medium">{analytics.churnRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Pricing</CardTitle>
              <p className="text-sm text-gray-600">Update subscription prices for different user types</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Student Plans</h3>
                  <div className="space-y-2">
                    <Label htmlFor="studentMonthly">Monthly Plan (GHS)</Label>
                    <Input
                      id="studentMonthly"
                      type="number"
                      value={pricing.studentMonthly}
                      onChange={(e) => setPricing(prev => ({ ...prev, studentMonthly: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studentYearly">Yearly Plan (GHS)</Label>
                    <Input
                      id="studentYearly"
                      type="number"
                      value={pricing.studentYearly}
                      onChange={(e) => setPricing(prev => ({ ...prev, studentYearly: Number(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Owner Plans</h3>
                  <div className="space-y-2">
                    <Label htmlFor="ownerMonthly">Monthly Plan (GHS)</Label>
                    <Input
                      id="ownerMonthly"
                      type="number"
                      value={pricing.ownerMonthly}
                      onChange={(e) => setPricing(prev => ({ ...prev, ownerMonthly: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerYearly">Yearly Plan (GHS)</Label>
                    <Input
                      id="ownerYearly"
                      type="number"
                      value={pricing.ownerYearly}
                      onChange={(e) => setPricing(prev => ({ ...prev, ownerYearly: Number(e.target.value) }))}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Label htmlFor="serviceFee">Service Fee (%)</Label>
                <Input
                  id="serviceFee"
                  type="number"
                  value={pricing.serviceFee}
                  onChange={(e) => setPricing(prev => ({ ...prev, serviceFee: Number(e.target.value) }))}
                  className="w-32"
                />
              </div>

              <Button onClick={handlePricingUpdate} className="mt-4">
                Update Pricing
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">User</th>
                      <th className="text-left p-2">Plan</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Revenue</th>
                      <th className="text-left p-2">Next Billing</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockSubscriptions.map(sub => (
                      <tr key={sub.id} className="border-b">
                        <td className="p-2">{sub.userEmail}</td>
                        <td className="p-2">{sub.plan}</td>
                        <td className="p-2">
                          <Badge variant={sub.status === 'active' ? 'default' : 'secondary'}>
                            {sub.status}
                          </Badge>
                        </td>
                        <td className="p-2">{formatCurrency(sub.revenue)}</td>
                        <td className="p-2">{sub.nextBilling || 'N/A'}</td>
                        <td className="p-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubscriptionManagement;
