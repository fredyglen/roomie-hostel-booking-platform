/**
 * Notification Dropdown Component
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Displays dropdown list of recent notifications with
 * mark as read functionality and link to full notifications page
 * 
 * Technical Implementation: Scrollable list of notifications, individual
 * and bulk mark as read actions, type-based icons and styling
 * 
 * @author ROOMi Platform Team
 * @version 1.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  CreditCard,
  Home,
  Calendar,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useMarkAsRead, useMarkAllAsRead, Notification, NotificationType } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

// ============================================================================
// TYPES
// ============================================================================

interface NotificationDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  userId: string;
  onClose: () => void;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'error':
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'booking':
      return <Calendar className="h-5 w-5 text-blue-500" />;
    case 'payment':
      return <CreditCard className="h-5 w-5 text-green-500" />;
    case 'property':
      return <Home className="h-5 w-5 text-purple-500" />;
    case 'system':
      return <Settings className="h-5 w-5 text-gray-500" />;
    default:
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

// ============================================================================
// COMPONENT
// ============================================================================

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  unreadCount,
  userId,
  onClose,
}) => {
  const navigate = useNavigate();
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead } = useMarkAllAsRead();

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read if unread
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Navigate based on notification type and data
    if (notification.data?.booking_id) {
      navigate(`/student/bookings/${notification.data.booking_id}`);
    } else if (notification.data?.property_id) {
      navigate(`/property/${notification.data.property_id}`);
    }

    onClose();
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead(userId);
  };

  const handleViewAll = () => {
    navigate('/notifications');
    onClose();
  };

  // Show only recent 5 notifications in dropdown
  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-xs text-gray-500">({unreadCount} unread)</span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllAsRead}
            className="text-xs"
          >
            Mark all read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <ScrollArea className="h-[400px]">
        {recentNotifications.length > 0 ? (
          <div className="divide-y">
            {recentNotifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="flex-shrink-0">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <Bell className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">No notifications yet</p>
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      {notifications.length > 0 && (
        <>
          <Separator />
          <div className="p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewAll}
              className="w-full"
            >
              View all notifications
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;

