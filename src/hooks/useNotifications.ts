import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsApi, type NotificationFilter } from '@/services/notificationsApi';
import { queryKeys } from '@/lib/queryKeys';
import { useSocket } from '@/contexts/SocketContext';

/**
 * Query hook to fetch the unread notification count.
 * Also listens for newNotification socket events and invalidates the count.
 */
export function useNotificationCount() {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  // Side effect: listen for new notifications via socket
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.count() });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.list() });
    };

    socket.on('newNotification', handleNewNotification);
    return () => {
      socket.off('newNotification', handleNewNotification);
    };
  }, [socket, queryClient]);

  return useQuery({
    queryKey: queryKeys.notifications.count(),
    queryFn: () => notificationsApi.getUnreadCount(),
    refetchInterval: 60_000, // Refresh every minute as fallback
  });
}

/**
 * Query hook to fetch all notifications with optional filtering.
 * @param filter - Optional filter (type, unreadOnly)
 */
export function useNotifications(filter?: NotificationFilter) {
  return useQuery({
    queryKey: queryKeys.notifications.list(filter?.type),
    queryFn: () => notificationsApi.getAll(filter),
  });
}

/**
 * Mutation hook to mark a single notification as read.
 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}

/**
 * Mutation hook to mark all notifications as read.
 */
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}
