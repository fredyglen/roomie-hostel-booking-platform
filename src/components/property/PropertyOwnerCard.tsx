
/**
 * Property Owner Card Component for ROOMi Platform
 * Displays owner information with proper type safety
 *
 * @fileoverview Apple-Level Property Owner Card Implementation
 * @author ROOMi Development Team
 * @version 1.0.0
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User } from '@/types/core';

interface PropertyOwnerCardProps {
  owner?: User;
}

/**
 * Property Owner Card Component
 * Displays owner information using the correct User interface
 */
const PropertyOwnerCard: React.FC<PropertyOwnerCardProps> = ({ owner }) => {
  if (!owner || !owner.profile) {
    return null;
  }

  // Extract owner data from User interface
  const { profile, email, role } = owner;
  const { firstName, lastName, phone, avatar } = profile;

  // Create full name
  const fullName = `${firstName} ${lastName}`.trim() || 'Property Owner';

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  // Check if owner is verified (simplified - would come from verification system)
  const isVerified = role === 'owner'; // Simplified verification check

  // Calculate response rate (placeholder - would come from messaging system)
  const responseRate = '95%'; // TODO: Implement actual response rate calculation

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Property Owner</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={avatar || ''} alt={fullName} />
            <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold">{fullName}</h3>
              {isVerified && (
                <Badge variant="secondary" className="text-xs">
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">
              Response rate: {responseRate}
            </p>
            {phone && (
              <p className="text-xs text-gray-500">
                {phone}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              // TODO: Implement contact owner functionality
              window.location.href = `mailto:${email}`;
            }}
          >
            Contact Owner
          </Button>
          <Button
            variant="ghost"
            className="w-full text-sm"
            onClick={() => {
              // TODO: Implement view profile functionality
              console.log('View profile for:', owner.id);
            }}
          >
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyOwnerCard;
