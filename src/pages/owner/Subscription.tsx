
import React from 'react';
import OwnerLayout from '@/components/layout/OwnerLayout';
import SubscriptionManager from '@/components/subscription/SubscriptionManager';

const OwnerSubscription: React.FC = () => {
  return (
    <OwnerLayout pageTitle="Subscription Management">
      <SubscriptionManager />
    </OwnerLayout>
  );
};

export default OwnerSubscription;
