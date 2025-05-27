
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export interface SubscriptionStatus {
  isActive: boolean;
  isPremium: boolean;
  tierName: string;
  features: Record<string, boolean>;
  limits: Record<string, number>;
  expiresAt?: string;
}

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
      const { data: subscription, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          tier:subscription_tiers(*)
        `)
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .single();

      if (error || !subscription) {
        // No active subscription, set to free tier
        setSubscriptionStatus({
          isActive: false,
          isPremium: false,
          tierName: 'Free',
          features: {},
          limits: {}
        });
      } else {
        setSubscriptionStatus({
          isActive: true,
          isPremium: subscription.tier.price > 0,
          tierName: subscription.tier.name,
          features: subscription.tier.features,
          limits: subscription.tier.limits,
          expiresAt: subscription.expires_at
        });
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setLoading(false);
    }
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
