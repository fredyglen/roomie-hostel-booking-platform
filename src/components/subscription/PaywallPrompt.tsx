
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@iconify/react';
import { formatCurrency } from '@/utils/currency';

interface PaywallPromptProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  featureDescription: string;
  userType: 'student' | 'owner';
  onUpgrade: () => void;
}

const PaywallPrompt: React.FC<PaywallPromptProps> = ({
  isOpen,
  onClose,
  featureName,
  featureDescription,
  userType,
  onUpgrade
}) => {
  const premiumPrice = userType === 'student' ? 15 : 50;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2 mb-2">
            <Icon icon="solar:crown-bold" className="text-yellow-500 h-6 w-6" />
            <DialogTitle>Premium Feature</DialogTitle>
          </div>
          <DialogDescription>
            Unlock <strong>{featureName}</strong> with ROOMi Premium
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">{featureName}</h4>
            <p className="text-sm text-gray-600">{featureDescription}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Premium {userType === 'student' ? 'Student' : 'Owner'}</span>
              <Badge variant="secondary">{formatCurrency(premiumPrice)}/month</Badge>
            </div>
            
            <div className="text-xs text-gray-500">
              {userType === 'student' ? (
                "Includes AI matching, priority booking, financing access, and more"
              ) : (
                "Includes unlimited listings, advanced analytics, export tools, and more"
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={onClose}>
            Maybe Later
          </Button>
          <Button onClick={onUpgrade} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Icon icon="solar:crown-bold" className="mr-2 h-4 w-4" />
            Upgrade Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaywallPrompt;
