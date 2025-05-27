
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { formatCurrency } from '@/utils/currency';

interface OccupancyDisplayProps {
  title: string;
  current: number;
  total: number;
  available: number;
  percentage: number;
  lastUpdated?: string;
  onRefresh?: () => void;
}

const OccupancyDisplay: React.FC<OccupancyDisplayProps> = ({
  title,
  current,
  total,
  available,
  percentage,
  lastUpdated,
  onRefresh
}) => {
  const getStatusColor = () => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusText = () => {
    if (percentage >= 90) return 'Nearly Full';
    if (percentage >= 70) return 'Filling Up';
    return 'Available';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className={`${getStatusColor()} text-white border-transparent`}>
            {getStatusText()}
          </Badge>
          {onRefresh && (
            <Button variant="ghost" size="sm" onClick={onRefresh}>
              <Icon icon="solar:refresh-linear" className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Occupied: {current}</span>
            <span>Available: {available}</span>
          </div>
          
          <Progress value={percentage} className="h-2" />
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>{current} of {total} spots filled</span>
            <span>{percentage.toFixed(1)}% occupied</span>
          </div>
          
          {lastUpdated && (
            <div className="text-xs text-gray-400">
              Last updated: {new Date(lastUpdated).toLocaleTimeString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OccupancyDisplay;
