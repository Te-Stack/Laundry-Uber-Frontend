import { useParams } from 'react-router-dom';
import { ConversationList } from '@/components/messages/ConversationList';
import { MessageThread } from '@/components/messages/MessageThread';
import { MessageInput } from '@/components/messages/MessageInput';
import { Navigation } from '@/components/Navigation';
import { Message01Icon } from 'hugeicons-react';

/**
 * Messages page with conversation list on the left and thread on the right.
 */
export function Messages() {
  const { userId } = useParams<{ userId?: string }>();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background flex flex-col">
      <Navigation />
      <div className="flex-1 flex max-w-6xl mx-auto w-full px-4 py-6 gap-4">
        {/* Conversation list */}
        <div className="w-full md:w-72 lg:w-80 bg-white dark:bg-card rounded-xl border dark:border-border overflow-hidden flex-shrink-0">
          <div className="px-4 py-3 border-b dark:border-border">
            <h2 className="font-semibold text-sm">Conversations</h2>
          </div>
          <ConversationList activeUserId={userId} />
        </div>

        {/* Message thread */}
        <div className="flex-1 bg-white dark:bg-card rounded-xl border dark:border-border overflow-hidden flex flex-col min-h-0">
          {userId ? (
            <>
              <div className="flex-1 overflow-y-auto">
                <MessageThread userId={userId} />
              </div>
              <MessageInput receiverId={userId} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 gap-3">
              <Message01Icon className="h-12 w-12" />
              <p className="text-sm">Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
