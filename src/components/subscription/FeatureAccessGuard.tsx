
import React from 'react';
import { useSubscriptionCheck } from '@/hooks/subscription/useSubscriptionCheck';
import PaywallPrompt from './PaywallPrompt';

interface FeatureAccessGuardProps {
  feature: string;
  featureName: string;
  featureDescription: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onUpgrade?: () => void;
}

const FeatureAccessGuard: React.FC<FeatureAccessGuardProps> = ({
  feature,
  featureName,
  featureDescription,
  children,
  fallback,
  onUpgrade
}) => {
  const { subscriptionStatus, hasFeature } = useSubscriptionCheck();
  const [showPaywall, setShowPaywall] = React.useState(false);

  const handleFeatureAccess = () => {
    if (hasFeature(feature)) {
      return children;
    }
    
    if (fallback) {
      return fallback;
    }
    
    setShowPaywall(true);
    return null;
  };

  const handleUpgrade = () => {
    setShowPaywall(false);
    if (onUpgrade) {
      onUpgrade();
    }
  };

  // Determine user type from subscription tier
  const userType = subscriptionStatus.tierName.toLowerCase().includes('student') ? 'student' : 'owner';

  return (
    <>
      {hasFeature(feature) ? children : handleFeatureAccess()}
      
      <PaywallPrompt
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        featureName={featureName}
        featureDescription={featureDescription}
        userType={userType}
        onUpgrade={handleUpgrade}
      />
    </>
  );
};

export default FeatureAccessGuard;
