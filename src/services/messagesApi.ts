import { apiClient } from '@/lib/api/client';
import type { Conversation, Message, SendMessagePayload } from '@/types/api';

export const messagesApi = {
  /**
   * Retrieves all conversations for the current user.
   * @returns Promise resolving to array of conversations
   */
  async getConversations() {
    return apiClient.get<Conversation[]>(
      '/messages/conversations',
      {},
      'Failed to load conversations.'
    );
  },

  /**
   * Retrieves the message thread with a specific user.
   * @param userId - The other user's ID
   * @returns Promise resolving to array of messages
   */
  async getThread(userId: string) {
    return apiClient.get<Message[]>(
      `/messages/${userId}`,
      {},
      'Failed to load messages.'
    );
  },

  /**
   * Sends a message to another user.
   * @param payload - Message content and recipient
   * @returns Promise resolving to the created message
   */
  async send(payload: SendMessagePayload) {
    return apiClient.post<Message>(
      '/messages',
      payload,
      {},
      'Failed to send message.'
    );
  },
};
