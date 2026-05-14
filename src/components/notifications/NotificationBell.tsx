import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotificationCount } from '@/hooks/useNotifications';
import { NotificationDropdown } from './NotificationDropdown';

/**
 * Bell icon with unread notification badge.
 * Toggles the notification dropdown on click.
 */
export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: countResult } = useNotificationCount();
  const count = countResult?.data?.count ?? 0;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label={`Notifications${count > 0 ? ` (${count} unread)` : ''}`}
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {count > 0 && (
          <span className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationDropdown onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
}
