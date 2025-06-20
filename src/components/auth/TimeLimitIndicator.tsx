// Time Limit Indicator Component
// Shows countdown timer for anonymous users

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Timer } from 'lucide-react';

interface TimeLimitIndicatorProps {
  timeRemaining: number;
  isActive: boolean;
  isExpired: boolean;
  className?: string;
}

const TimeLimitIndicator: React.FC<TimeLimitIndicatorProps> = ({
  timeRemaining,
  isActive,
  isExpired,
  className = ''
}) => {
  const navigate = useNavigate();

  if (!isActive) return null;

  const getFormattedTime = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    
    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${seconds}s`;
    }
  };

  const getVariant = () => {
    if (isExpired) return 'destructive';
    if (timeRemaining <= 10) return 'destructive';
    if (timeRemaining <= 20) return 'secondary';
    return 'outline';
  };

  const getIcon = () => {
    if (isExpired || timeRemaining <= 10) {
      return <Clock size={12} className="animate-pulse" />;
    }
    return <Timer size={12} />;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge variant={getVariant()} className="flex items-center gap-1 font-mono">
        {getIcon()}
        {isExpired ? 'Expired' : getFormattedTime()}
      </Badge>
      
      {(timeRemaining <= 15 || isExpired) && (
        <Button
          size="sm"
          onClick={() => navigate('/register')}
          className="h-6 px-2 text-xs"
        >
          Register
        </Button>
      )}
    </div>
  );
};

export default TimeLimitIndicator;
