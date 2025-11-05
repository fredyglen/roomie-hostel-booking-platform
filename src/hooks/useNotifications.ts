/**
 * Notifications Hooks
 * Apple-Grade implementation following BE CONSCIOUS standards
 * 
 * Business Purpose: Provides real-time notification management for all user portals
 * with Supabase real-time subscriptions for instant updates
 * 
 * Technical Implementation: React Query hooks wrapping Supabase queries with
 * real-time subscriptions, optimistic updates, and automatic cache invalidation
 * 
 * @author ROOMi Platform Team
 * @version 1.0.0
 * @compliance BE CONSCIOUS Apple-Grade Standards
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { useEffect } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export interface Notification {
  readonly id: string;
  readonly created_at: string;
  readonly updated_at: string;
  readonly user_id: string;
  readonly title: string;
  readonly message: string;
  readonly type: NotificationType;
  readonly read: boolean;
  readonly data?: Record<string, unknown> | null;
}

export type NotificationType = 
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'booking'
  | 'payment'
  | 'property'
  | 'system';

export interface NotificationInsert {
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  data?: Record<string, unknown>;
}

// ============================================================================
// QUERY KEY FACTORY
// ============================================================================

const notificationsKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationsKeys.all, 'list'] as const,
  list: (userId: string) => [...notificationsKeys.lists(), userId] as const,
  unreadCount: (userId: string) => [...notificationsKeys.all, 'unread-count', userId] as const,
};

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Get all notifications for a user
 * Sorted by created_at DESC (newest first)
 */
export const useNotifications = (userId?: string) => {
  return useQuery({
    queryKey: notificationsKeys.list(userId || ''),
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!userId,
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Get count of unread notifications for a user
 */
export const useUnreadCount = (userId?: string) => {
  return useQuery({
    queryKey: notificationsKeys.unreadCount(userId || ''),
    queryFn: async () => {
      if (!userId) return 0;

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!userId,
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
};

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Mark a single notification as read
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true, updated_at: new Date().toISOString() })
        .eq('id', notificationId)
        .select()
        .single();

      if (error) throw error;
      return data as Notification;
    },
    onSuccess: (data) => {
      // Invalidate notifications list and unread count
      queryClient.invalidateQueries({ queryKey: notificationsKeys.list(data.user_id) });
      queryClient.invalidateQueries({ queryKey: notificationsKeys.unreadCount(data.user_id) });
    },
    onError: (error) => {
      console.error('Failed to mark notification as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Mark all notifications as read for a user
 */
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      return userId;
    },
    onSuccess: (userId) => {
      // Invalidate notifications list and unread count
      queryClient.invalidateQueries({ queryKey: notificationsKeys.list(userId) });
      queryClient.invalidateQueries({ queryKey: notificationsKeys.unreadCount(userId) });

      toast({
        title: 'Success',
        description: 'All notifications marked as read',
      });
    },
    onError: (error) => {
      console.error('Failed to mark all notifications as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark all notifications as read',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Send a new notification
 */
export const useSendNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notification: NotificationInsert) => {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: notification.user_id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          data: notification.data || {},
          read: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Notification;
    },
    onSuccess: (data) => {
      // Invalidate notifications list and unread count for recipient
      queryClient.invalidateQueries({ queryKey: notificationsKeys.list(data.user_id) });
      queryClient.invalidateQueries({ queryKey: notificationsKeys.unreadCount(data.user_id) });
    },
    onError: (error) => {
      console.error('Failed to send notification:', error);
      toast({
        title: 'Error',
        description: 'Failed to send notification',
        variant: 'destructive',
      });
    },
  });
};

// ============================================================================
// REAL-TIME SUBSCRIPTION HOOK
// ============================================================================

/**
 * Subscribe to real-time notification updates for a user
 * Automatically refetches notifications and unread count when new notifications arrive
 */
export const useNotificationSubscription = (userId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    // Subscribe to INSERT events for new notifications
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('New notification received:', payload);

          // Invalidate queries to refetch data
          queryClient.invalidateQueries({ queryKey: notificationsKeys.list(userId) });
          queryClient.invalidateQueries({ queryKey: notificationsKeys.unreadCount(userId) });

          // Show toast notification
          const notification = payload.new as Notification;
          toast({
            title: notification.title,
            description: notification.message,
            variant: notification.type === 'error' ? 'destructive' : 'default',
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          // Invalidate queries when notifications are updated (e.g., marked as read)
          queryClient.invalidateQueries({ queryKey: notificationsKeys.list(userId) });
          queryClient.invalidateQueries({ queryKey: notificationsKeys.unreadCount(userId) });
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);
};

