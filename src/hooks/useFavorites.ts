/**
 * React Query hooks for favorites functionality
 * Wraps FavoritesQueries service with React Query for caching, optimistic updates, and real-time sync
 * 
 * Phase 4 of REVISED_FIX_PLAN_2025-11-05.md
 * Created: 2025-11-05
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FavoritesQueries, type Favorite } from '@/services/database/favoritesQueries';
import { useAuth } from '@/context/EnhancedAuthContext';
import { logger } from '@/utils/enhanced-logger';
import { toast } from '@/components/ui/use-toast';

/**
 * Query key factory for favorites
 */
const favoritesKeys = {
  all: ['favorites'] as const,
  lists: () => [...favoritesKeys.all, 'list'] as const,
  list: (userId: string) => [...favoritesKeys.lists(), userId] as const,
  ids: (userId: string) => [...favoritesKeys.all, 'ids', userId] as const,
  check: (userId: string, propertyId: string) => [...favoritesKeys.all, 'check', userId, propertyId] as const,
  count: (userId: string) => [...favoritesKeys.all, 'count', userId] as const,
};

/**
 * Hook to get all user favorites with property details
 */
export const useGetFavorites = (userId?: string) => {
  return useQuery({
    queryKey: favoritesKeys.list(userId || ''),
    queryFn: async () => {
      if (!userId) {
        return [];
      }
      return await FavoritesQueries.getUserFavorites(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to get user's favorite property IDs (for quick lookup)
 */
export const useGetFavoriteIds = (userId?: string) => {
  return useQuery({
    queryKey: favoritesKeys.ids(userId || ''),
    queryFn: async () => {
      if (!userId) {
        return [];
      }
      return await FavoritesQueries.getUserFavoriteIds(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to check if a specific property is favorited
 */
export const useIsFavorite = (propertyId: string, userId?: string) => {
  return useQuery({
    queryKey: favoritesKeys.check(userId || '', propertyId),
    queryFn: async () => {
      if (!userId) {
        return false;
      }
      return await FavoritesQueries.isFavorited(userId, propertyId);
    },
    enabled: !!userId && !!propertyId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to get favorites count
 */
export const useGetFavoritesCount = (userId?: string) => {
  return useQuery({
    queryKey: favoritesKeys.count(userId || ''),
    queryFn: async () => {
      if (!userId) {
        return 0;
      }
      return await FavoritesQueries.getFavoritesCount(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to add a property to favorites
 * Includes optimistic updates for instant UI feedback
 */
export const useAddFavorite = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (propertyId: string) => {
      if (!user?.id) {
        throw new Error('User must be logged in to add favorites');
      }
      return await FavoritesQueries.addFavorite(user.id, propertyId);
    },
    onMutate: async (propertyId: string) => {
      if (!user?.id) return;

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: favoritesKeys.list(user.id) });
      await queryClient.cancelQueries({ queryKey: favoritesKeys.ids(user.id) });
      await queryClient.cancelQueries({ queryKey: favoritesKeys.check(user.id, propertyId) });

      // Optimistically update check query
      queryClient.setQueryData(favoritesKeys.check(user.id, propertyId), true);

      // Optimistically update IDs list
      const previousIds = queryClient.getQueryData<string[]>(favoritesKeys.ids(user.id));
      if (previousIds && !previousIds.includes(propertyId)) {
        queryClient.setQueryData(favoritesKeys.ids(user.id), [...previousIds, propertyId]);
      }

      logger.info('Optimistically added favorite', { userId: user.id, propertyId });
    },
    onSuccess: (data, propertyId) => {
      if (!user?.id) return;

      // Invalidate all favorites queries to refetch with real data
      queryClient.invalidateQueries({ queryKey: favoritesKeys.list(user.id) });
      queryClient.invalidateQueries({ queryKey: favoritesKeys.ids(user.id) });
      queryClient.invalidateQueries({ queryKey: favoritesKeys.count(user.id) });

      toast({
        title: 'Added to favorites',
        description: 'Property saved to your favorites list',
      });

      logger.info('Favorite added successfully', { userId: user.id, propertyId });
    },
    onError: (error, propertyId) => {
      if (!user?.id) return;

      // Revert optimistic updates
      queryClient.invalidateQueries({ queryKey: favoritesKeys.list(user.id) });
      queryClient.invalidateQueries({ queryKey: favoritesKeys.ids(user.id) });
      queryClient.invalidateQueries({ queryKey: favoritesKeys.check(user.id, propertyId) });

      toast({
        title: 'Failed to add favorite',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });

      logger.error('Failed to add favorite', { error, userId: user.id, propertyId });
    },
  });
};

/**
 * Hook to remove a property from favorites
 * Includes optimistic updates for instant UI feedback
 */
export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (propertyId: string) => {
      if (!user?.id) {
        throw new Error('User must be logged in to remove favorites');
      }
      return await FavoritesQueries.removeFavorite(user.id, propertyId);
    },
    onMutate: async (propertyId: string) => {
      if (!user?.id) return;

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: favoritesKeys.list(user.id) });
      await queryClient.cancelQueries({ queryKey: favoritesKeys.ids(user.id) });
      await queryClient.cancelQueries({ queryKey: favoritesKeys.check(user.id, propertyId) });

      // Optimistically update check query
      queryClient.setQueryData(favoritesKeys.check(user.id, propertyId), false);

      // Optimistically update IDs list
      const previousIds = queryClient.getQueryData<string[]>(favoritesKeys.ids(user.id));
      if (previousIds) {
        queryClient.setQueryData(
          favoritesKeys.ids(user.id),
          previousIds.filter(id => id !== propertyId)
        );
      }

      // Optimistically update favorites list
      const previousFavorites = queryClient.getQueryData<Favorite[]>(favoritesKeys.list(user.id));
      if (previousFavorites) {
        queryClient.setQueryData(
          favoritesKeys.list(user.id),
          previousFavorites.filter(fav => fav.property_id !== propertyId)
        );
      }

      logger.info('Optimistically removed favorite', { userId: user.id, propertyId });
    },
    onSuccess: (data, propertyId) => {
      if (!user?.id) return;

      // Invalidate all favorites queries to refetch with real data
      queryClient.invalidateQueries({ queryKey: favoritesKeys.list(user.id) });
      queryClient.invalidateQueries({ queryKey: favoritesKeys.ids(user.id) });
      queryClient.invalidateQueries({ queryKey: favoritesKeys.count(user.id) });

      toast({
        title: 'Removed from favorites',
        description: 'Property removed from your favorites list',
      });

      logger.info('Favorite removed successfully', { userId: user.id, propertyId });
    },
    onError: (error, propertyId) => {
      if (!user?.id) return;

      // Revert optimistic updates
      queryClient.invalidateQueries({ queryKey: favoritesKeys.list(user.id) });
      queryClient.invalidateQueries({ queryKey: favoritesKeys.ids(user.id) });
      queryClient.invalidateQueries({ queryKey: favoritesKeys.check(user.id, propertyId) });

      toast({
        title: 'Failed to remove favorite',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });

      logger.error('Failed to remove favorite', { error, userId: user.id, propertyId });
    },
  });
};

/**
 * Hook to toggle favorite status (add if not favorited, remove if favorited)
 * Includes optimistic updates for instant UI feedback
 */
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (propertyId: string) => {
      if (!user?.id) {
        throw new Error('User must be logged in to toggle favorites');
      }
      return await FavoritesQueries.toggleFavorite(user.id, propertyId);
    },
    onMutate: async (propertyId: string) => {
      if (!user?.id) return;

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: favoritesKeys.list(user.id) });
      await queryClient.cancelQueries({ queryKey: favoritesKeys.ids(user.id) });
      await queryClient.cancelQueries({ queryKey: favoritesKeys.check(user.id, propertyId) });

      // Get current favorite status
      const isFavorited = queryClient.getQueryData<boolean>(favoritesKeys.check(user.id, propertyId));
      const newStatus = !isFavorited;

      // Optimistically update check query
      queryClient.setQueryData(favoritesKeys.check(user.id, propertyId), newStatus);

      // Optimistically update IDs list
      const previousIds = queryClient.getQueryData<string[]>(favoritesKeys.ids(user.id));
      if (previousIds) {
        if (newStatus && !previousIds.includes(propertyId)) {
          queryClient.setQueryData(favoritesKeys.ids(user.id), [...previousIds, propertyId]);
        } else if (!newStatus) {
          queryClient.setQueryData(
            favoritesKeys.ids(user.id),
            previousIds.filter(id => id !== propertyId)
          );
        }
      }

      logger.info('Optimistically toggled favorite', { userId: user.id, propertyId, newStatus });

      return { previousStatus: isFavorited };
    },
    onSuccess: (newStatus, propertyId) => {
      if (!user?.id) return;

      // Invalidate all favorites queries to refetch with real data
      queryClient.invalidateQueries({ queryKey: favoritesKeys.list(user.id) });
      queryClient.invalidateQueries({ queryKey: favoritesKeys.ids(user.id) });
      queryClient.invalidateQueries({ queryKey: favoritesKeys.count(user.id) });

      toast({
        title: newStatus ? 'Added to favorites' : 'Removed from favorites',
        description: newStatus
          ? 'Property saved to your favorites list'
          : 'Property removed from your favorites list',
      });

      logger.info('Favorite toggled successfully', { userId: user.id, propertyId, newStatus });
    },
    onError: (error, propertyId, context) => {
      if (!user?.id) return;

      // Revert optimistic updates
      queryClient.invalidateQueries({ queryKey: favoritesKeys.list(user.id) });
      queryClient.invalidateQueries({ queryKey: favoritesKeys.ids(user.id) });
      queryClient.invalidateQueries({ queryKey: favoritesKeys.check(user.id, propertyId) });

      toast({
        title: 'Failed to update favorite',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });

      logger.error('Failed to toggle favorite', { error, userId: user.id, propertyId });
    },
  });
};

