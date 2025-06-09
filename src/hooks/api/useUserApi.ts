import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import { User } from '@/types/common';

export function useUserApi() {
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers,
  });

  const createUser = useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const updateUser = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<User> }) => userService.updateUser(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const deleteUser = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  return {
    users: usersQuery.data,
    isLoading: usersQuery.isLoading,
    error: usersQuery.error,
    createUser: createUser.mutateAsync,
    updateUser: updateUser.mutateAsync,
    deleteUser: deleteUser.mutateAsync,
  };
} 