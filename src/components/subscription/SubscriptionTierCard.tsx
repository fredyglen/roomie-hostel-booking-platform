
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@iconify/react';
import { formatCurrency } from '@/utils/currency';
import { SubscriptionTier } from '@/types/subscription';

interface SubscriptionTierCardProps {
  tier: SubscriptionTier;
  isCurrentTier?: boolean;
  onSelectTier: () => void;
  isLoading?: boolean;
}

const SubscriptionTierCard: React.FC<SubscriptionTierCardProps> = ({
  tier,
  isCurrentTier = false,
  onSelectTier,
  isLoading = false
}) => {
  const getFeatureIcon = (key: string): string => {
    if (key.includes('ai')) return 'solar:cpu-bolt-bold';
    if (key.includes('search')) return 'solar:magnifer-bold';
    if (key.includes('booking')) return 'solar:calendar-bold';
    if (key.includes('analytics')) return 'solar:chart-bold';
    if (key.includes('export')) return 'solar:download-bold';
    if (key.includes('communication')) return 'solar:chat-round-bold';
    return 'solar:check-circle-bold';
  };

  const formatFeatureName = (key: string): string => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const enabledFeatures = Object.entries(tier.features || {})
    .filter(([_, enabled]) => enabled)
    .slice(0, 6); // Show top 6 features

  const isPopular = tier.name.toLowerCase().includes('premium');

  return (
    <Card className={`relative ${isPopular ? 'border-blue-500 border-2' : ''} ${isCurrentTier ? 'bg-blue-50' : ''}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-blue-500 text-white px-3 py-1">Most Popular</Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl">{tier.name}</CardTitle>
        <div className="text-3xl font-bold text-blue-600">
          {formatCurrency(tier.price)}
          <span className="text-sm text-gray-500 font-normal">/{tier.billing_cycle}</span>
        </div>
        {isCurrentTier && (
          <Badge variant="secondary" className="mt-2">Current Plan</Badge>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {enabledFeatures.map(([key, _]) => (
            <div key={key} className="flex items-center gap-2 text-sm">
              <Icon icon={getFeatureIcon(key)} className="text-green-500" width={16} />
              <span>{formatFeatureName(key)}</span>
            </div>
          ))}
          {Object.keys(tier.features || {}).length > 6 && (
            <div className="text-xs text-gray-500">
              +{Object.keys(tier.features || {}).length - 6} more features
            </div>
          )}
        </div>
        
        <Button 
          onClick={onSelectTier}
          disabled={isCurrentTier || isLoading}
          className={`w-full ${isPopular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
        >
          {isLoading ? (
            <Icon icon="solar:spinner-bold" className="animate-spin mr-2" width={16} />
          ) : null}
          {isCurrentTier ? 'Current Plan' : tier.price === 0 ? 'Get Started' : 'Upgrade Now'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SubscriptionTierCard;
