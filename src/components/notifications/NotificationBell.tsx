/**
 * Notification Bell Component
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Displays notification bell icon with unread count badge
 * and dropdown list of recent notifications
 * 
 * Technical Implementation: Real-time updates via Supabase subscriptions,
 * dropdown menu with recent notifications, mark as read functionality
 * 
 * @author ROOMi Platform Team
 * @version 1.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useNotifications, useUnreadCount, useNotificationSubscription } from '@/hooks/useNotifications';
import NotificationDropdown from './NotificationDropdown';

// ============================================================================
// TYPES
// ============================================================================

interface NotificationBellProps {
  userId?: string;
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

const NotificationBell: React.FC<NotificationBellProps> = ({ userId, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Fetch notifications and unread count
  const { data: notifications = [] } = useNotifications(userId);
  const { data: unreadCount = 0 } = useUnreadCount(userId);

  // Subscribe to real-time updates
  useNotificationSubscription(userId);

  if (!userId) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`relative ${className}`}
          aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <NotificationDropdown
          notifications={notifications}
          unreadCount={unreadCount}
          userId={userId}
          onClose={() => setIsOpen(false)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;

