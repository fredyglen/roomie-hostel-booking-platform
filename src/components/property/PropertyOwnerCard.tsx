
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Owner } from '@/types/property';

interface PropertyOwnerCardProps {
  owner?: Owner;
}

const PropertyOwnerCard: React.FC<PropertyOwnerCardProps> = ({ owner }) => {
  if (!owner) {
    return null;
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Property Owner</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="" alt={owner.name} />
            <AvatarFallback>{getInitials(owner.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold">{owner.name}</h3>
              {owner.verified && (
                <Badge variant="secondary" className="text-xs">
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">Response rate: {owner.responseRate || 'N/A'}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button variant="outline" className="w-full">
            Contact Owner
          </Button>
          <Button variant="ghost" className="w-full text-sm">
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyOwnerCard;
