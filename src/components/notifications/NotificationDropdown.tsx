import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ShoppingBag, CreditCard, MessageCircle, Info } from 'lucide-react';
import { useNotifications, useMarkNotificationRead } from '@/hooks/useNotifications';
import type { NotificationType } from '@/types/api';

interface NotificationDropdownProps {
  onClose: () => void;
}

function getTypeIcon(type: NotificationType) {
  switch (type) {
    case 'order': return <ShoppingBag className="h-4 w-4 text-blue-500" />;
    case 'payment': return <CreditCard className="h-4 w-4 text-green-500" />;
    case 'message': return <MessageCircle className="h-4 w-4 text-purple-500" />;
    default: return <Info className="h-4 w-4 text-gray-500" />;
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

/**
 * Dropdown showing the 5 most recent notifications.
 * Marks notifications as read on click.
 */
export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const { data: result } = useNotifications();
  const { mutate: markRead } = useMarkNotificationRead();

  const notifications = (result?.data ?? []).slice(0, 5);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <span className="font-semibold text-sm">Notifications</span>
        <Bell className="h-4 w-4 text-gray-400" />
      </div>

      {notifications.length === 0 ? (
        <div className="px-4 py-6 text-center text-sm text-gray-400">
          No notifications yet.
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {notifications.map((notif) => (
            <button
              key={notif.id}
              onClick={() => {
                if (!notif.isRead) markRead(notif.id);
                onClose();
              }}
              className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 text-left transition-colors ${
                !notif.isRead ? 'bg-blue-50/50' : ''
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">{getTypeIcon(notif.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{notif.title}</p>
                <p className="text-xs text-gray-500 truncate">{notif.message}</p>
                <p className="text-xs text-gray-400 mt-0.5">{timeAgo(notif.createdAt)}</p>
              </div>
              {!notif.isRead && (
                <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
              )}
            </button>
          ))}
        </div>
      )}

      <div className="px-4 py-2 border-t">
        <button
          onClick={() => {
            navigate('/notifications');
            onClose();
          }}
          className="text-sm text-blue-600 hover:underline w-full text-center"
        >
          View All Notifications
        </button>
      </div>
    </div>
  );
}
