import { useNavigate } from 'react-router-dom';
import { useConversations } from '@/hooks/useMessages';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ConversationListProps {
  activeUserId?: string;
}

/**
 * Displays a list of conversations for the current user.
 * Clicking a conversation navigates to /messages/:userId.
 */
export function ConversationList({ activeUserId }: ConversationListProps) {
  const navigate = useNavigate();
  const { data: result, isLoading } = useConversations();
  const conversations = result?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-400 dark:text-gray-500">
        Loading conversations...
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-400 dark:text-gray-500 text-sm">
        No conversations yet.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100 dark:divide-border">
      {conversations.map((conv) => {
        const isActive = conv.otherUser.id === activeUserId;
        const time = conv.lastMessage
          ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
          : '';

        return (
          <button
            key={conv.otherUser.id}
            onClick={() => navigate(`/messages/${conv.otherUser.id}`)}
            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-muted transition-colors text-left ${
              isActive ? 'bg-blue-50 dark:bg-blue-900/20' : ''
            }`}
          >
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarFallback>{(conv.otherUser.fullName || (conv.otherUser as any).name || "U").charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <span className="font-medium text-sm truncate">
                  {conv.otherUser.fullName || (conv.otherUser as any).name || "User"}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500 ml-2 flex-shrink-0">{time}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {conv.lastMessage?.content ?? 'No messages yet'}
              </p>
            </div>
            {conv.unreadCount > 0 && (
              <Badge className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full flex-shrink-0">
                {conv.unreadCount}
              </Badge>
            )}
          </button>
        );
      })}
    </div>
  );
}
