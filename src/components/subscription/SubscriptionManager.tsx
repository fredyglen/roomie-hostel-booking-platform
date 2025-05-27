
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@iconify/react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useSubscriptionCheck } from '@/hooks/subscription/useSubscriptionCheck';
import SubscriptionTierCard from './SubscriptionTierCard';
import PaymentModal from './PaymentModal';
import { formatCurrency } from '@/utils/currency';
import { SubscriptionTier } from '@/types/subscription';

const SubscriptionManager: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { subscriptionStatus, refetch } = useSubscriptionCheck();

  // Mock subscription tiers - in real implementation, fetch from API
  const subscriptionTiers: SubscriptionTier[] = [
    {
      id: 'free-student',
      name: 'Free Student',
      user_type: 'student',
      price: 0,
      billing_cycle: 'monthly',
      features: {
        basic_search: true,
        saved_properties: true,
        basic_booking: true,
        advanced_filters: false,
        ai_hostel_matching: false,
        priority_booking: false
      },
      limits: {
        search_results_per_day: 10,
        saved_properties: 3,
        booking_requests: 1
      },
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'premium-student',
      name: 'Premium Student',
      user_type: 'student',
      price: 15,
      billing_cycle: 'monthly',
      features: {
        basic_search: true,
        saved_properties: true,
        basic_booking: true,
        advanced_filters: true,
        ai_hostel_matching: true,
        priority_booking: true,
        rent_financing_access: true,
        virtual_tours: true,
        premium_support: true
      },
      limits: {
        search_results_per_day: -1, // Unlimited
        saved_properties: -1,
        booking_requests: -1
      },
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'free-owner',
      name: 'Free Owner',
      user_type: 'owner',
      price: 0,
      billing_cycle: 'monthly',
      features: {
        basic_property_listing: true,
        booking_management: true,
        tenant_communication_tools: false,
        advanced_analytics: false,
        unlimited_property_listings: false
      },
      limits: {
        property_listings: 2,
        monthly_bookings: 5
      },
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'premium-owner',
      name: 'Premium Owner',
      user_type: 'owner',
      price: 50,
      billing_cycle: 'monthly',
      features: {
        basic_property_listing: true,
        booking_management: true,
        tenant_communication_tools: true,
        advanced_analytics: true,
        unlimited_property_listings: true,
        revenue_analytics: true,
        export_data_csv: true,
        automated_notifications: true,
        pricing_optimization_suggestions: true
      },
      limits: {
        property_listings: -1,
        monthly_bookings: -1
      },
      is_active: true,
      created_at: new Date().toISOString()
    }
  ];

  // Filter tiers based on user type (from profile role)
  const userType = user?.user_metadata?.role || 'student';
  const availableTiers = subscriptionTiers.filter(tier => tier.user_type === userType);

  const handleSelectTier = (tier: SubscriptionTier) => {
    if (tier.price === 0) {
      // Handle free tier selection
      toast({
        title: "Free Plan Selected",
        description: "You're now on the free plan with basic features.",
      });
      return;
    }

    setSelectedTier(tier);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    setLoading(true);
    try {
      // In real implementation, process payment and update subscription
      await new Promise(resolve => setTimeout(resolve, 2000)); // Mock API call
      
      toast({
        title: "Subscription Updated",
        description: `Successfully upgraded to ${selectedTier?.name}!`,
      });
      
      setShowPaymentModal(false);
      setSelectedTier(null);
      refetch();
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const currentTierName = subscriptionStatus.tierName.toLowerCase();

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon="solar:crown-bold" className="text-yellow-500" />
            Current Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">{subscriptionStatus.tierName}</h3>
              <p className="text-sm text-gray-600">
                {subscriptionStatus.isPremium 
                  ? `Premium features enabled • Next billing: ${subscriptionStatus.expiresAt || 'N/A'}`
                  : 'Free tier with basic features'
                }
              </p>
            </div>
            <Badge variant={subscriptionStatus.isPremium ? "default" : "secondary"}>
              {subscriptionStatus.isPremium ? 'Premium' : 'Free'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableTiers.map(tier => (
            <SubscriptionTierCard
              key={tier.id}
              tier={tier}
              isCurrentTier={currentTierName.includes(tier.name.toLowerCase().replace(' ', '-'))}
              onSelectTier={() => handleSelectTier(tier)}
              isLoading={loading}
            />
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedTier && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          tier={selectedTier}
          onPaymentSuccess={handlePaymentSuccess}
          isLoading={loading}
        />
      )}
    </div>
  );
};

export default SubscriptionManager;
