import type { User } from './user';

// ============================================================================
// Message Types
// ============================================================================

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  requestId: string | null;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  sender?: User;
  receiver?: User;
}

export interface Conversation {
  otherUser: User;
  lastMessage: Message;
  unreadCount: number;
}

export interface SendMessagePayload {
  receiverId: string;
  content: string;
  requestId?: string;
}
