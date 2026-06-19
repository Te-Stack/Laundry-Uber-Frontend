import { useEffect, useRef } from 'react';
import { useMessageThread } from '@/hooks/useMessages';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useCurrentUser } from '@/hooks/useProfile';

interface MessageThreadProps {
  userId: string;
}

/**
 * Displays the message thread with a specific user.
 * Auto-scrolls to the bottom when new messages arrive.
 */
export function MessageThread({ userId }: MessageThreadProps) {
  const { data: threadResult, isLoading } = useMessageThread(userId);
  const { data: userResult } = useCurrentUser();
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = threadResult?.data ?? [];
  const currentUserId = userResult?.data?.id;

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
        Loading messages...
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 text-sm">
        No messages yet. Start the conversation!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4 overflow-y-auto">
      {messages.map((msg) => {
        const isMine = msg.senderId === currentUserId;
        const senderName = msg.sender?.fullName ?? (isMine ? 'You' : 'Them');
        const time = new Date(msg.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        return (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {!isMine && (
              <Avatar className="h-7 w-7 flex-shrink-0">
                <AvatarFallback className="text-xs">{senderName.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div className={`max-w-xs lg:max-w-md ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
              {!isMine && (
                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">{senderName}</span>
              )}
              <div
                className={`px-3 py-2 rounded-2xl text-sm ${
                  isMine
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-gray-100 dark:bg-muted text-gray-900 dark:text-foreground rounded-bl-sm'
                }`}
              >
                {msg.content}
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">{time}</span>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
