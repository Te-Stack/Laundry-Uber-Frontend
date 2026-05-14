import { apiClient } from '@/lib/api/client';
import type { Notification, NotificationCount } from '@/types/api';

export interface NotificationFilter {
  type?: string;
  unreadOnly?: boolean;
}

export const notificationsApi = {
  /**
   * Retrieves all notifications for the current user.
   * @param filter - Optional filter parameters
   * @returns Promise resolving to array of notifications
   */
  async getAll(filter?: NotificationFilter) {
    const params = new URLSearchParams();
    if (filter?.type) params.set('type', filter.type);
    if (filter?.unreadOnly) params.set('unreadOnly', 'true');
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<Notification[]>(
      `/notifications${query}`,
      {},
      'Failed to load notifications.'
    );
  },

  /**
   * Retrieves the count of unread notifications.
   * @returns Promise resolving to unread count
   */
  async getUnreadCount() {
    return apiClient.get<NotificationCount>(
      '/notifications/unread/count',
      {},
      'Failed to load notification count.'
    );
  },

  /**
   * Marks a specific notification as read.
   * @param id - Notification ID
   * @returns Promise resolving to updated notification
   */
  async markAsRead(id: string) {
    return apiClient.patch<Notification>(
      `/notifications/${id}/read`,
      {},
      {},
      'Failed to mark notification as read.'
    );
  },

  /**
   * Marks all notifications as read.
   * @returns Promise resolving to success message
   */
  async markAllAsRead() {
    return apiClient.patch<{ message: string }>(
      '/notifications/read-all',
      {},
      {},
      'Failed to mark all notifications as read.'
    );
  },
};
