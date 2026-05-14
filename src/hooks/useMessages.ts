import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { messagesApi } from '@/services/messagesApi';
import { queryKeys } from '@/lib/queryKeys';
import { queryClient as globalQueryClient } from '@/lib/queryClient';
import { useSocket } from '@/contexts/SocketContext';
import type { Message, SendMessagePayload, SocketNewMessagePayload } from '@/types/api';

/**
 * Query hook to fetch all conversations for the current user.
 */
export function useConversations() {
  return useQuery({
    queryKey: queryKeys.messages.conversations(),
    queryFn: () => messagesApi.getConversations(),
  });
}

/**
 * Query hook to fetch the message thread with a specific user.
 * Also listens for incoming socket messages and updates the cache.
 * @param userId - The other user's ID
 */
export function useMessageThread(userId: string | null) {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  // Side effect: listen for new messages via socket
  useEffect(() => {
    if (!socket || !userId) return;

    const handleNewMessage = (data: SocketNewMessagePayload) => {
      const msg = data.message;
      // Only update if this message belongs to the current thread
      if (msg.senderId === userId || msg.receiverId === userId) {
        queryClient.setQueryData(
          queryKeys.messages.thread(userId),
          (old: { data: Message[] | null } | undefined) => {
            const existing = old?.data ?? [];
            // Avoid duplicates
            if (existing.some((m) => m.id === msg.id)) return old;
            return { ...old, data: [...existing, msg] };
          }
        );
        // Also invalidate conversations to update last message
        queryClient.invalidateQueries({ queryKey: queryKeys.messages.conversations() });
      }
    };

    socket.on('newMessage', handleNewMessage);
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, userId, queryClient]);

  return useQuery({
    queryKey: queryKeys.messages.thread(userId ?? ''),
    queryFn: () => messagesApi.getThread(userId!),
    enabled: !!userId,
  });
}

/**
 * Mutation hook to send a message with optimistic update.
 */
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendMessagePayload) => messagesApi.send(payload),
    onMutate: async (payload) => {
      const threadKey = queryKeys.messages.thread(payload.receiverId);
      await queryClient.cancelQueries({ queryKey: threadKey });

      const previous = queryClient.getQueryData(threadKey);

      // Optimistic update: add a temporary message
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        senderId: 'me',
        receiverId: payload.receiverId,
        requestId: payload.requestId ?? null,
        content: payload.content,
        isRead: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData(
        threadKey,
        (old: { data: Message[] | null } | undefined) => ({
          ...old,
          data: [...(old?.data ?? []), optimisticMessage],
        })
      );

      return { previous, threadKey };
    },
    onError: (_err, _payload, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(context.threadKey, context.previous);
      }
    },
    onSettled: (_data, _err, payload) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.thread(payload.receiverId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.messages.conversations() });
    },
  });
}

export { globalQueryClient };
