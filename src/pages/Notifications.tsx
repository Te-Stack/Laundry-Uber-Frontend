import { useState } from 'react';
import { ShoppingBag, CreditCard, MessageCircle, Info, Bell } from 'lucide-react';
import { useNotifications, useMarkAllNotificationsRead, useMarkNotificationRead } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/Navigation';
import type { NotificationType } from '@/types/api';

const FILTER_TABS = [
  { value: undefined, label: 'All' },
  { value: 'order', label: 'Orders' },
  { value: 'payment', label: 'Payments' },
  { value: 'message', label: 'Messages' },
  { value: 'system', label: 'System' },
];

function getTypeIcon(type: NotificationType) {
  switch (type) {
    case 'order': return <ShoppingBag className="h-5 w-5 text-blue-500" />;
    case 'payment': return <CreditCard className="h-5 w-5 text-green-500" />;
    case 'message': return <MessageCircle className="h-5 w-5 text-purple-500" />;
    default: return <Info className="h-5 w-5 text-gray-500" />;
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
 * Full notifications page with filter tabs and mark-all-read button.
 */
export function Notifications() {
  const [activeFilter, setActiveFilter] = useState<string | undefined>(undefined);
  const { data: result, isLoading } = useNotifications(
    activeFilter ? { type: activeFilter } : undefined
  );
  const { mutate: markAllRead, isPending: isMarkingAll } = useMarkAllNotificationsRead();
  const { mutate: markRead } = useMarkNotificationRead();

  const notifications = result?.data ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllRead()}
            disabled={isMarkingAll}
          >
            {isMarkingAll ? 'Marking...' : 'Mark All as Read'}
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveFilter(tab.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === tab.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications list */}
        {isLoading ? (
          <p className="text-center text-gray-400 py-12">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Bell className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p>No notifications found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border divide-y">
            {notifications.map((notif) => (
              <button
                key={notif.id}
                onClick={() => { if (!notif.isRead) markRead(notif.id); }}
                className={`w-full flex items-start gap-4 px-4 py-4 hover:bg-gray-50 text-left transition-colors ${
                  !notif.isRead ? 'bg-blue-50/40' : ''
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">{getTypeIcon(notif.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${!notif.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                      {notif.title}
                    </p>
                    <span className="text-xs text-gray-400 flex-shrink-0">{timeAgo(notif.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{notif.message}</p>
                </div>
                {!notif.isRead && (
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                )}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
