// ============================================================================
// Notification Types
// ============================================================================

export type NotificationType = 'order' | 'payment' | 'message' | 'promo' | 'system';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationCount {
  count: number;
}
