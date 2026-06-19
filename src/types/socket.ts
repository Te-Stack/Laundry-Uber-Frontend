import type { LaundryRequest } from './requests';
import type { Message } from './messages';
import type { Notification } from './notifications';

// ============================================================================
// Socket.IO Event Types
// ============================================================================

export interface SocketRequestAcceptedPayload {
  request: LaundryRequest;
}

export interface SocketRequestStatusUpdatePayload {
  request: LaundryRequest;
}

export interface SocketNewMessagePayload {
  message: Message;
}

export interface SocketNewNotificationPayload {
  notification: Notification;
}

export interface SocketProviderLocationPayload {
  providerId: string;
  latitude: number;
  longitude: number;
}
