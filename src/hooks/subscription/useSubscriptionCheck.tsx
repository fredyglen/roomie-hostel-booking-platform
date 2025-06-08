import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/EnhancedAuthContext';
import { ErrorHandler } from '@/utils/ErrorHandler';

export interface SubscriptionStatus {
  isActive: boolean;
  isPremium: boolean;
  tierName: string;
  features: Record<string, boolean>;
  limits: Record<string, number>;
  expiresAt?: string;
}

// Default free tier features for fallback
const FREE_STUDENT_FEATURES = {
  basic_search: true,
  advanced_filters: false,
  unlimited_search_results: false,
  ai_hostel_matching: false,
  roommate_recommendations: false,
  priority_booking: false,
  future_semester_booking: false,
  rent_financing_access: false,
  property_alerts: false,
  virtual_tours: false,
  premium_support: false
};

const FREE_OWNER_FEATURES = {
  basic_property_listing: true,
  unlimited_property_listings: false,
  advanced_analytics: false,
  occupancy_real_time_tracking: false,
  revenue_analytics: false,
  export_data_csv: false,
  export_data_excel: false,
  export_financial_reports: false,
  tenant_communication_tools: false,
  automated_notifications: false,
  pricing_optimization_suggestions: false
};

export const useSubscriptionCheck = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    isActive: false,
    isPremium: false,
    tierName: 'Free',
    features: {},
    limits: {}
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      checkSubscription();
    } else {
      setLoading(false);
    }
  }, [user]);

  const checkSubscription = async () => {
    try {
      // Since the subscription tables aren't in the current schema yet,
      // we'll implement a fallback that uses the user's role from profiles
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single();

      if (error || !profile) {
        ErrorHandler.handle(error, 'useSubscriptionCheck error fetching user profile');
        setDefaultFreeStatus();
        return;
      }

      // For now, set default free tier based on user role
      const isStudent = profile.role === 'student';
      const features = isStudent ? FREE_STUDENT_FEATURES : FREE_OWNER_FEATURES;
      
      setSubscriptionStatus({
        isActive: true,
        isPremium: false,
        tierName: isStudent ? 'Free Student' : 'Free Owner',
        features,
        limits: {
          search_results_per_day: 10,
          saved_properties: 3,
          property_listings: isStudent ? 0 : 2,
          booking_requests: 1
        }
      });

    } catch (error) {
      ErrorHandler.handle(error, 'useSubscriptionCheck error checking subscription');
      setDefaultFreeStatus();
    } finally {
      setLoading(false);
    }
  };

  const setDefaultFreeStatus = () => {
    setSubscriptionStatus({
      isActive: false,
      isPremium: false,
      tierName: 'Free',
      features: FREE_STUDENT_FEATURES,
      limits: {}
    });
  };

  const hasFeature = (featureKey: string): boolean => {
    return subscriptionStatus.features[featureKey] === true;
  };

  const checkLimit = (limitKey: string, currentUsage: number): boolean => {
    const limit = subscriptionStatus.limits[limitKey];
    if (limit === -1) return true; // Unlimited
    return currentUsage < limit;
  };

  const getLimit = (limitKey: string): number => {
    return subscriptionStatus.limits[limitKey] || 0;
  };

  return {
    subscriptionStatus,
    loading,
    hasFeature,
    checkLimit,
    getLimit,
    refetch: checkSubscription
  };
};
