import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '@/contexts/SocketContext';
import { queryKeys } from '@/lib/queryKeys';
import type { SocketRequestStatusUpdatePayload, SocketRequestAcceptedPayload } from '@/types/api';

/**
 * Hook that joins a request room and listens for real-time updates.
 * Invalidates React Query cache when status changes occur.
 * @param requestId - The request ID to track
 */
export function useRequestRealtime(requestId: string | null) {
  const { socket, joinRoom, leaveRoom } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!requestId || !socket) return;

    // Side effect: join the socket room for this request
    joinRoom(requestId);

    const handleStatusUpdate = (data: SocketRequestStatusUpdatePayload) => {
      if (data.request.id === requestId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.requests.detail(requestId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.requests.customer() });
        queryClient.invalidateQueries({ queryKey: queryKeys.requests.provider() });
      }
    };

    const handleRequestAccepted = (data: SocketRequestAcceptedPayload) => {
      if (data.request.id === requestId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.requests.list() });
        queryClient.invalidateQueries({ queryKey: queryKeys.requests.customer() });
      }
    };

    socket.on('requestStatusUpdate', handleStatusUpdate);
    socket.on('requestAccepted', handleRequestAccepted);

    return () => {
      // Side effect cleanup: leave the room and remove listeners
      leaveRoom(requestId);
      socket.off('requestStatusUpdate', handleStatusUpdate);
      socket.off('requestAccepted', handleRequestAccepted);
    };
  }, [requestId, socket, joinRoom, leaveRoom, queryClient]);
}
