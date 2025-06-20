// Viewing Progress Indicator Component
// Shows anonymous users their viewing progress and remaining limits

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Image, Video, Play, Eye, ArrowRight, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ViewingProgress {
  images: { current: number; total: number; percentage: number };
  videos: { current: number; total: number; percentage: number };
  stories: { current: number; total: number; percentage: number };
  properties: { current: number; total: number; percentage: number };
}

interface ViewingProgressIndicatorProps {
  progress: ViewingProgress;
  isVisible: boolean;
  className?: string;
}

const ViewingProgressIndicator: React.FC<ViewingProgressIndicatorProps> = ({
  progress,
  isVisible,
  className = ''
}) => {
  const navigate = useNavigate();

  if (!isVisible) return null;

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 75) return 'bg-orange-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getProgressVariant = (percentage: number) => {
    if (percentage >= 100) return 'destructive';
    if (percentage >= 75) return 'secondary';
    return 'default';
  };

  const progressItems = [
    {
      icon: <Image size={16} />,
      label: 'Images',
      current: progress.images.current,
      total: progress.images.total,
      percentage: progress.images.percentage,
      color: 'text-blue-600'
    },
    {
      icon: <Video size={16} />,
      label: 'Videos',
      current: progress.videos.current,
      total: progress.videos.total,
      percentage: progress.videos.percentage,
      color: 'text-purple-600'
    },
    {
      icon: <Play size={16} />,
      label: 'Stories',
      current: progress.stories.current,
      total: progress.stories.total,
      percentage: progress.stories.percentage,
      color: 'text-green-600'
    },
    {
      icon: <Eye size={16} />,
      label: 'Properties',
      current: progress.properties.current,
      total: progress.properties.total,
      percentage: progress.properties.percentage,
      color: 'text-orange-600'
    }
  ];

  const hasReachedAnyLimit = progressItems.some(item => item.percentage >= 100);
  const isNearingLimits = progressItems.some(item => item.percentage >= 75);

  return (
    <Card className={`border-l-4 border-l-primary shadow-sm ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-primary" />
            <h4 className="font-semibold text-gray-900 text-sm">
              Daily Viewing Limits
            </h4>
          </div>
          {hasReachedAnyLimit && (
            <Badge variant="destructive" className="text-xs">
              Limit Reached
            </Badge>
          )}
          {!hasReachedAnyLimit && isNearingLimits && (
            <Badge variant="secondary" className="text-xs">
              Almost Full
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          {progressItems.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className={`flex items-center gap-2 ${item.color}`}>
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </div>
                <span className="text-gray-600 text-xs">
                  {item.current}/{item.total === Infinity ? '∞' : item.total}
                </span>
              </div>
              {item.total !== Infinity && (
                <Progress 
                  value={Math.min(item.percentage, 100)} 
                  className="h-2"
                />
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="text-center space-y-2">
            <p className="text-xs text-gray-600">
              {hasReachedAnyLimit 
                ? 'You\'ve reached your daily viewing limits' 
                : 'Register for unlimited access to all features'
              }
            </p>
            <Button
              onClick={() => navigate('/register')}
              size="sm"
              className="w-full text-xs py-2 h-8"
            >
              <ArrowRight size={12} className="mr-1" />
              Create Free Account
            </Button>
          </div>
        </div>

        {/* Reset Info */}
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500">
            Limits reset daily at midnight
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ViewingProgressIndicator;
