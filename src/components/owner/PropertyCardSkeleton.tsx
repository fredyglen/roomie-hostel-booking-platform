
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

const PropertyCardSkeleton: React.FC = () => {
  return (
    <Card className="overflow-hidden">
      <div className="h-48 bg-gray-200 animate-pulse" />
      <CardContent className="pt-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 bg-gray-100 rounded animate-pulse" />
          <div className="flex justify-between items-center">
            <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-12 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
      </CardFooter>
    </Card>
  );
};

export default PropertyCardSkeleton;
