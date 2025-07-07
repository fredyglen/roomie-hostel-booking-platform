
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icon } from '@iconify/react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FeatureConfig {
  id: string;
  feature_key: string;
  display_name: string;
  description: string;
  category: string;
  user_type: 'student' | 'owner' | 'both';
  is_premium: boolean;
  impact_level: 'high' | 'medium' | 'low';
  revenue_impact: 'high' | 'medium' | 'low';
}

const FeatureManagement: React.FC = () => {
  const [features, setFeatures] = useState<FeatureConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Default features configuration
  const defaultFeatures: FeatureConfig[] = [
    // Student Features - Search & Discovery
    {
      id: '1',
      feature_key: 'basic_search',
      display_name: 'Basic Property Search',
      description: 'Simple search functionality with basic filters',
      category: 'search',
      user_type: 'student',
      is_premium: false,
      impact_level: 'high',
      revenue_impact: 'low'
    },
    {
      id: '2',
      feature_key: 'advanced_filters',
      display_name: 'Advanced Search Filters',
      description: 'Detailed filtering by price, amenities, location radius',
      category: 'search',
      user_type: 'student',
      is_premium: true,
      impact_level: 'high',
      revenue_impact: 'high'
    },
    {
      id: '3',
      feature_key: 'unlimited_search_results',
      display_name: 'Unlimited Search Results',
      description: 'View all available properties without pagination limits',
      category: 'search',
      user_type: 'student',
      is_premium: true,
      impact_level: 'medium',
      revenue_impact: 'medium'
    },
    {
      id: '4',
      feature_key: 'ai_hostel_matching',
      display_name: 'AI-Powered Hostel Matching',
      description: 'Personalized recommendations based on preferences and behavior',
      category: 'ai',
      user_type: 'student',
      is_premium: true,
      impact_level: 'high',
      revenue_impact: 'high'
    },
    {
      id: '5',
      feature_key: 'roommate_recommendations',
      display_name: 'Roommate Recommendations',
      description: 'AI-driven roommate compatibility matching',
      category: 'ai',
      user_type: 'student',
      is_premium: true,
      impact_level: 'high',
      revenue_impact: 'high'
    },
    
    // Student Features - Booking
    {
      id: '6',
      feature_key: 'basic_booking',
      display_name: 'Basic Booking',
      description: 'Standard room booking for current semester',
      category: 'booking',
      user_type: 'student',
      is_premium: false,
      impact_level: 'high',
      revenue_impact: 'low'
    },
    {
      id: '7',
      feature_key: 'priority_booking',
      display_name: 'Priority Booking',
      description: 'Skip booking queues and get first preference',
      category: 'booking',
      user_type: 'student',
      is_premium: true,
      impact_level: 'high',
      revenue_impact: 'high'
    },
    {
      id: '8',
      feature_key: 'future_semester_booking',
      display_name: 'Future Semester Booking',
      description: 'Book accommodations for upcoming semesters',
      category: 'booking',
      user_type: 'student',
      is_premium: true,
      impact_level: 'medium',
      revenue_impact: 'high'
    },
    {
      id: '9',
      feature_key: 'rent_financing_access',
      display_name: 'Rent Financing Access',
      description: 'Access to rent-now-pay-later services',
      category: 'booking',
      user_type: 'student',
      is_premium: true,
      impact_level: 'high',
      revenue_impact: 'high'
    },
    
    // Student Features - Communication & Support
    {
      id: '10',
      feature_key: 'property_alerts',
      display_name: 'Property Availability Alerts',
      description: 'Real-time notifications for new listings and availability',
      category: 'communication',
      user_type: 'student',
      is_premium: true,
      impact_level: 'medium',
      revenue_impact: 'medium'
    },
    {
      id: '11',
      feature_key: 'virtual_tours',
      display_name: 'Virtual Property Tours',
      description: '360° virtual tours and video walkthroughs',
      category: 'communication',
      user_type: 'student',
      is_premium: true,
      impact_level: 'medium',
      revenue_impact: 'medium'
    },
    {
      id: '12',
      feature_key: 'premium_support',
      display_name: 'Premium Customer Support',
      description: '24/7 priority support with dedicated agents',
      category: 'communication',
      user_type: 'student',
      is_premium: true,
      impact_level: 'low',
      revenue_impact: 'medium'
    },
    
    // Owner Features - Property Management
    {
      id: '13',
      feature_key: 'basic_property_listing',
      display_name: 'Basic Property Listing',
      description: 'List up to 2 properties with basic information',
      category: 'analytics',
      user_type: 'owner',
      is_premium: false,
      impact_level: 'high',
      revenue_impact: 'low'
    },
    {
      id: '14',
      feature_key: 'unlimited_property_listings',
      display_name: 'Unlimited Property Listings',
      description: 'List unlimited properties with enhanced features',
      category: 'analytics',
      user_type: 'owner',
      is_premium: true,
      impact_level: 'high',
      revenue_impact: 'high'
    },
    {
      id: '15',
      feature_key: 'advanced_analytics',
      display_name: 'Advanced Analytics Dashboard',
      description: 'Detailed performance metrics and insights',
      category: 'analytics',
      user_type: 'owner',
      is_premium: true,
      impact_level: 'high',
      revenue_impact: 'high'
    },
    {
      id: '16',
      feature_key: 'occupancy_real_time_tracking',
      display_name: 'Real-time Occupancy Tracking',
      description: 'Live occupancy monitoring across all properties',
      category: 'analytics',
      user_type: 'owner',
      is_premium: true,
      impact_level: 'high',
      revenue_impact: 'high'
    },
    {
      id: '17',
      feature_key: 'revenue_analytics',
      display_name: 'Revenue Analytics',
      description: 'Comprehensive revenue tracking and forecasting',
      category: 'analytics',
      user_type: 'owner',
      is_premium: true,
      impact_level: 'high',
      revenue_impact: 'high'
    },
    
    // Owner Features - Export & Reporting
    {
      id: '18',
      feature_key: 'export_data_csv',
      display_name: 'Export Data (CSV)',
      description: 'Export booking and tenant data in CSV format',
      category: 'export',
      user_type: 'owner',
      is_premium: true,
      impact_level: 'medium',
      revenue_impact: 'medium'
    },
    {
      id: '19',
      feature_key: 'export_data_excel',
      display_name: 'Export Data (Excel)',
      description: 'Export detailed reports in Excel format',
      category: 'export',
      user_type: 'owner',
      is_premium: true,
      impact_level: 'medium',
      revenue_impact: 'medium'
    },
    {
      id: '20',
      feature_key: 'export_financial_reports',
      display_name: 'Financial Reports Export',
      description: 'Generate and export comprehensive financial reports',
      category: 'export',
      user_type: 'owner',
      is_premium: true,
      impact_level: 'high',
      revenue_impact: 'high'
    },
    
    // Owner Features - Communication
    {
      id: '21',
      feature_key: 'tenant_communication_tools',
      display_name: 'Tenant Communication Tools',
      description: 'Direct messaging and announcement system',
      category: 'communication',
      user_type: 'owner',
      is_premium: true,
      impact_level: 'medium',
      revenue_impact: 'medium'
    },
    {
      id: '22',
      feature_key: 'automated_notifications',
      display_name: 'Automated Notifications',
      description: 'Automated alerts for bookings, payments, and maintenance',
      category: 'communication',
      user_type: 'owner',
      is_premium: true,
      impact_level: 'medium',
      revenue_impact: 'medium'
    },
    {
      id: '23',
      feature_key: 'pricing_optimization_suggestions',
      display_name: 'AI Pricing Optimization',
      description: 'AI-powered pricing recommendations based on market data',
      category: 'ai',
      user_type: 'owner',
      is_premium: true,
      impact_level: 'high',
      revenue_impact: 'high'
    }
  ];

  useEffect(() => {
    setFeatures(defaultFeatures);
  }, []);

  const toggleFeaturePremium = async (featureId: string) => {
    setFeatures(prev => prev.map(feature => 
      feature.id === featureId 
        ? { ...feature, is_premium: !feature.is_premium }
        : feature
    ));

    toast({
      title: "Feature Updated",
      description: "Feature premium status has been updated successfully.",
    });
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return 'solar:arrow-up-bold';
      case 'medium': return 'solar:minus-bold';
      case 'low': return 'solar:arrow-down-bold';
      default: return 'solar:minus-bold';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'search': return 'solar:magnifer-bold';
      case 'booking': return 'solar:calendar-bold';
      case 'analytics': return 'solar:chart-bold';
      case 'communication': return 'solar:chat-round-bold';
      case 'ai': return 'solar:cpu-bolt-bold';
      case 'export': return 'solar:download-bold';
      default: return 'solar:settings-bold';
    }
  };

  const categories = Array.from(new Set(features.map(f => f.category)));
  const userTypes = ['student', 'owner'];

  const getFeaturesByCategory = (category: string, userType: string) => {
    return features.filter(f => f.category === category && (f.user_type === userType || f.user_type === 'both'));
  };

  const premiumCount = features.filter(f => f.is_premium).length;
  const freeCount = features.filter(f => !f.is_premium).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Feature Management</h1>
          <p className="text-gray-600">Configure which features are behind the paywall</p>
        </div>
        <div className="flex gap-4">
          <Badge variant="secondary">
            <Icon icon="solar:lock-bold" className="mr-1" />
            {premiumCount} Premium
          </Badge>
          <Badge variant="outline">
            <Icon icon="solar:unlock-bold" className="mr-1" />
            {freeCount} Free
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="student" className="space-y-6">
        <TabsList>
          <TabsTrigger value="student">
            <Icon icon="solar:user-bold" className="mr-2" />
            Student Features
          </TabsTrigger>
          <TabsTrigger value="owner">
            <Icon icon="solar:home-bold" className="mr-2" />
            Owner Features
          </TabsTrigger>
        </TabsList>

        {userTypes.map(userType => (
          <TabsContent key={userType} value={userType} className="space-y-6">
            {categories.map(category => {
              const categoryFeatures = getFeaturesByCategory(category, userType);
              
              if (categoryFeatures.length === 0) return null;

              return (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 capitalize">
                      <Icon icon={getCategoryIcon(category)} className="text-blue-600" />
                      {category} Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {categoryFeatures.map(feature => (
                        <div key={feature.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-medium">{feature.display_name}</h3>
                              <div className="flex gap-2">
                                <Badge variant={feature.is_premium ? "default" : "secondary"}>
                                  <Icon 
                                    icon={feature.is_premium ? "solar:lock-bold" : "solar:unlock-bold"} 
                                    className="mr-1" 
                                    width={12} 
                                  />
                                  {feature.is_premium ? 'Premium' : 'Free'}
                                </Badge>
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Icon 
                                    icon={getImpactIcon(feature.impact_level)} 
                                    className={getImpactColor(feature.impact_level)}
                                    width={12}
                                  />
                                  Impact: {feature.impact_level}
                                </Badge>
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Icon 
                                    icon="solar:dollar-bold" 
                                    className={getImpactColor(feature.revenue_impact)}
                                    width={12}
                                  />
                                  Revenue: {feature.revenue_impact}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{feature.description}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">
                              {feature.is_premium ? 'Premium Only' : 'Free Access'}
                            </span>
                            <Switch
                              checked={feature.is_premium}
                              onCheckedChange={() => toggleFeaturePremium(feature.id)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        ))}
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon="solar:info-circle-bold" className="text-blue-600" />
            Impact Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-1">
                <Icon icon="solar:arrow-up-bold" className="text-red-600" width={16} />
                High Impact
              </h4>
              <p className="text-gray-600">Core features that significantly affect user experience and conversion rates</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-1">
                <Icon icon="solar:minus-bold" className="text-yellow-600" width={16} />
                Medium Impact
              </h4>
              <p className="text-gray-600">Important features that enhance user experience but aren't critical</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-1">
                <Icon icon="solar:arrow-down-bold" className="text-green-600" width={16} />
                Low Impact
              </h4>
              <p className="text-gray-600">Nice-to-have features that provide added value but low conversion impact</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureManagement;
