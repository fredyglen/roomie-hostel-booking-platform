
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { PlatformFeatures } from '@/types/subscription';

interface FeatureItem {
  key: string;
  name: string;
  description: string;
  category: string;
  defaultValue: boolean;
  impact: 'low' | 'medium' | 'high';
}

const STUDENT_FEATURES: FeatureItem[] = [
  { key: 'basic_search', name: 'Basic Property Search', description: 'Search for properties with basic filters', category: 'Search & Discovery', defaultValue: false, impact: 'low' },
  { key: 'advanced_filters', name: 'Advanced Search Filters', description: 'Gender type, price range, amenities, proximity filters', category: 'Search & Discovery', defaultValue: true, impact: 'medium' },
  { key: 'unlimited_search_results', name: 'Unlimited Search Results', description: 'View all search results (free users see limited results)', category: 'Search & Discovery', defaultValue: true, impact: 'medium' },
  { key: 'ai_hostel_matching', name: 'AI Hostel Matching', description: 'Personalized property recommendations using AI algorithms', category: 'AI & Personalization', defaultValue: true, impact: 'high' },
  { key: 'roommate_recommendations', name: 'AI Roommate Matching', description: 'Smart roommate compatibility suggestions', category: 'AI & Personalization', defaultValue: true, impact: 'high' },
  { key: 'priority_booking', name: 'Priority Booking Access', description: 'Book popular properties before non-premium users', category: 'Booking & Reservations', defaultValue: true, impact: 'high' },
  { key: 'future_semester_booking', name: 'Future Semester Booking', description: 'Reserve accommodation for upcoming semesters', category: 'Booking & Reservations', defaultValue: true, impact: 'high' },
  { key: 'rent_financing_access', name: 'Rent Financing Options', description: 'Access to rent-now-pay-later services', category: 'Financial Services', defaultValue: true, impact: 'high' },
  { key: 'property_alerts', name: 'Property Alerts & Notifications', description: 'Get notified about new properties and price changes', category: 'Communication', defaultValue: true, impact: 'medium' },
  { key: 'virtual_tours', name: 'Virtual Property Tours', description: 'Access to 360° tours and video walkthroughs', category: 'Property Experience', defaultValue: true, impact: 'medium' },
  { key: 'saved_properties_unlimited', name: 'Unlimited Saved Properties', description: 'Save unlimited properties to favorites', category: 'User Experience', defaultValue: true, impact: 'low' },
  { key: 'booking_history', name: 'Detailed Booking History', description: 'View complete booking and payment history', category: 'Account Management', defaultValue: true, impact: 'low' },
  { key: 'payment_tracking', name: 'Advanced Payment Tracking', description: 'Track payment schedules and get reminders', category: 'Financial Services', defaultValue: true, impact: 'medium' },
  { key: 'premium_support', name: 'Priority Customer Support', description: '24/7 support with faster response times', category: 'Support', defaultValue: true, impact: 'medium' },
  { key: 'mobile_app_access', name: 'Mobile App Access', description: 'Access to premium mobile app features', category: 'Platform Access', defaultValue: true, impact: 'medium' },
  { key: 'offline_property_viewing', name: 'Offline Property Viewing', description: 'Download properties for offline viewing', category: 'User Experience', defaultValue: true, impact: 'low' }
];

const OWNER_FEATURES: FeatureItem[] = [
  { key: 'basic_property_listing', name: 'Basic Property Listing', description: 'List up to 2 properties with basic information', category: 'Property Management', defaultValue: false, impact: 'low' },
  { key: 'unlimited_property_listings', name: 'Unlimited Property Listings', description: 'List unlimited properties with full details', category: 'Property Management', defaultValue: true, impact: 'high' },
  { key: 'advanced_analytics', name: 'Advanced Analytics Dashboard', description: 'Detailed insights on bookings, revenue, and trends', category: 'Analytics & Reporting', defaultValue: true, impact: 'high' },
  { key: 'occupancy_real_time_tracking', name: 'Real-time Occupancy Tracking', description: 'Live updates on room occupancy across all properties', category: 'Property Management', defaultValue: true, impact: 'high' },
  { key: 'revenue_analytics', name: 'Revenue Analytics', description: 'Detailed revenue tracking and forecasting', category: 'Analytics & Reporting', defaultValue: true, impact: 'high' },
  { key: 'export_data_csv', name: 'CSV Data Export', description: 'Export booking and financial data as CSV files', category: 'Data Export', defaultValue: true, impact: 'medium' },
  { key: 'export_data_excel', name: 'Excel Data Export', description: 'Export data with advanced Excel formatting', category: 'Data Export', defaultValue: true, impact: 'medium' },
  { key: 'export_financial_reports', name: 'Financial Report Generation', description: 'Generate comprehensive financial reports', category: 'Data Export', defaultValue: true, impact: 'high' },
  { key: 'tenant_communication_tools', name: 'Tenant Communication Tools', description: 'Messaging system and announcements', category: 'Communication', defaultValue: true, impact: 'medium' },
  { key: 'automated_notifications', name: 'Automated Notifications', description: 'Auto-send booking confirmations and reminders', category: 'Communication', defaultValue: true, impact: 'medium' },
  { key: 'booking_management', name: 'Advanced Booking Management', description: 'Comprehensive booking workflow management', category: 'Property Management', defaultValue: true, impact: 'high' },
  { key: 'pricing_optimization_suggestions', name: 'AI Pricing Optimization', description: 'AI-powered pricing recommendations', category: 'AI & Optimization', defaultValue: true, impact: 'high' },
  { key: 'marketing_boost', name: 'Marketing Boost', description: 'Featured listings and promotional opportunities', category: 'Marketing', defaultValue: true, impact: 'high' },
  { key: 'priority_listing_placement', name: 'Priority Listing Placement', description: 'Properties appear higher in search results', category: 'Marketing', defaultValue: true, impact: 'high' },
  { key: 'multi_property_management', name: 'Multi-Property Management', description: 'Manage multiple properties from single dashboard', category: 'Property Management', defaultValue: true, impact: 'medium' },
  { key: 'staff_account_management', name: 'Staff Account Management', description: 'Add staff members with different permission levels', category: 'Account Management', defaultValue: true, impact: 'medium' },
  { key: 'api_access', name: 'API Access', description: 'Integrate with external systems via API', category: 'Platform Access', defaultValue: true, impact: 'low' },
  { key: 'white_label_options', name: 'White Label Options', description: 'Custom branding for large property managers', category: 'Branding', defaultValue: true, impact: 'low' }
];

const FeatureManagement: React.FC = () => {
  const [studentFeatures, setStudentFeatures] = useState<Record<string, boolean>>({});
  const [ownerFeatures, setOwnerFeatures] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCurrentSettings();
  }, []);

  const loadCurrentSettings = () => {
    // Initialize with default values
    const studentDefaults: Record<string, boolean> = {};
    const ownerDefaults: Record<string, boolean> = {};

    STUDENT_FEATURES.forEach(feature => {
      studentDefaults[feature.key] = feature.defaultValue;
    });

    OWNER_FEATURES.forEach(feature => {
      ownerDefaults[feature.key] = feature.defaultValue;
    });

    setStudentFeatures(studentDefaults);
    setOwnerFeatures(ownerDefaults);
  };

  const handleStudentFeatureChange = (featureKey: string, checked: boolean) => {
    setStudentFeatures(prev => ({
      ...prev,
      [featureKey]: checked
    }));
  };

  const handleOwnerFeatureChange = (featureKey: string, checked: boolean) => {
    setOwnerFeatures(prev => ({
      ...prev,
      [featureKey]: checked
    }));
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      // Here you would typically save to your backend
      console.log('Saving feature settings:', {
        student_features: studentFeatures,
        owner_features: ownerFeatures
      });

      toast({
        title: "Settings Saved",
        description: "Feature management settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    loadCurrentSettings();
    toast({
      title: "Reset Complete",
      description: "All features have been reset to default settings.",
    });
  };

  const getImpactBadge = (impact: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[impact as keyof typeof colors]}>{impact} impact</Badge>;
  };

  const groupFeaturesByCategory = (features: FeatureItem[]) => {
    return features.reduce((acc, feature) => {
      if (!acc[feature.category]) {
        acc[feature.category] = [];
      }
      acc[feature.category].push(feature);
      return acc;
    }, {} as Record<string, FeatureItem[]>);
  };

  const getPremiumFeatureCount = (userType: 'student' | 'owner') => {
    const features = userType === 'student' ? studentFeatures : ownerFeatures;
    return Object.values(features).filter(Boolean).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Feature Management</h2>
          <p className="text-gray-600 mt-1">Configure which features are behind the premium paywall</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
          <Button onClick={saveSettings} disabled={loading}>
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Student Premium Features</CardTitle>
            <CardDescription>
              {getPremiumFeatureCount('student')} features are currently premium
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Owner Premium Features</CardTitle>
            <CardDescription>
              {getPremiumFeatureCount('owner')} features are currently premium
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="student" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="student">Student Features</TabsTrigger>
          <TabsTrigger value="owner">Owner Features</TabsTrigger>
        </TabsList>

        <TabsContent value="student" className="space-y-6">
          {Object.entries(groupFeaturesByCategory(STUDENT_FEATURES)).map(([category, features]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {features.map((feature) => (
                  <div key={feature.key} className="flex items-start space-x-3">
                    <Checkbox
                      id={`student-${feature.key}`}
                      checked={studentFeatures[feature.key] || false}
                      onCheckedChange={(checked) => 
                        handleStudentFeatureChange(feature.key, checked as boolean)
                      }
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <label
                          htmlFor={`student-${feature.key}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {feature.name}
                        </label>
                        {getImpactBadge(feature.impact)}
                      </div>
                      <p className="text-xs text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="owner" className="space-y-6">
          {Object.entries(groupFeaturesByCategory(OWNER_FEATURES)).map(([category, features]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {features.map((feature) => (
                  <div key={feature.key} className="flex items-start space-x-3">
                    <Checkbox
                      id={`owner-${feature.key}`}
                      checked={ownerFeatures[feature.key] || false}
                      onCheckedChange={(checked) => 
                        handleOwnerFeatureChange(feature.key, checked as boolean)
                      }
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <label
                          htmlFor={`owner-${feature.key}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {feature.name}
                        </label>
                        {getImpactBadge(feature.impact)}
                      </div>
                      <p className="text-xs text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeatureManagement;
