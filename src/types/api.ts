/**
 * Barrel re-export for all API types.
 *
 * The types have been split into focused domain files:
 *   types/user.ts         - User, auth, profile, and schedule types
 *   types/requests.ts     - LaundryRequest, RequestStatus, RequestItem, etc.
 *   types/payments.ts     - Payment, InitializePayment, VerifyPayment
 *   types/messages.ts     - Message, Conversation, SendMessagePayload
 *   types/notifications.ts - Notification, NotificationType, NotificationCount
 *   types/services.ts     - Service, ServiceCategory, CreateServicePayload, etc.
 *   types/socket.ts       - Socket.IO event payload types
 *   types/common.ts       - RequestOptions, ApiErrorResponse
 *
 * All existing imports from '@/types/api' continue to work unchanged.
 */

export type * from './user';
export type * from './requests';
export type * from './payments';
export type * from './messages';
export type * from './notifications';
export type * from './services';
export type * from './socket';
export type * from './common';
