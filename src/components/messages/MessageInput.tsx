import { useState } from 'react';
import { useSendMessage } from '@/hooks/useMessages';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const MAX_CHARS = 500;

interface MessageInputProps {
  receiverId: string;
  requestId?: string;
}

/**
 * Controlled message input with character count and send functionality.
 */
export function MessageInput({ receiverId, requestId }: MessageInputProps) {
  const [content, setContent] = useState('');
  const { mutate: sendMessage, isPending } = useSendMessage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isPending) return;

    sendMessage(
      { receiverId, content: content.trim(), requestId },
      {
        onSuccess: () => {
          setContent('');
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const remaining = MAX_CHARS - content.length;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-3 border-t bg-white">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value.slice(0, MAX_CHARS))}
        onKeyDown={handleKeyDown}
        placeholder="Type a message... (Enter to send)"
        rows={2}
        className="resize-none"
        disabled={isPending}
      />
      <div className="flex items-center justify-between">
        <span className={`text-xs ${remaining < 50 ? 'text-red-500' : 'text-gray-400'}`}>
          {remaining} characters remaining
        </span>
        <Button
          type="submit"
          size="sm"
          disabled={!content.trim() || isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isPending ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </form>
  );
}
