import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Map,
  MessageCircle,
  Bell,
  User,
  Calendar,
  Briefcase,
} from 'lucide-react';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { ConnectionStatus } from '@/components/realtime/ConnectionStatus';
import { useCurrentUser } from '@/hooks/useProfile';

interface NavLink {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const customerLinks: NavLink[] = [
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { to: '/services', label: 'Services', icon: <ShoppingBag className="h-4 w-4" /> },
  { to: '/map', label: 'Map', icon: <Map className="h-4 w-4" /> },
  { to: '/messages', label: 'Messages', icon: <MessageCircle className="h-4 w-4" /> },
  { to: '/notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
  { to: '/profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
];

const providerLinks: NavLink[] = [
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { to: '/my-services', label: 'My Services', icon: <Briefcase className="h-4 w-4" /> },
  { to: '/schedule', label: 'Schedule', icon: <Calendar className="h-4 w-4" /> },
  { to: '/messages', label: 'Messages', icon: <MessageCircle className="h-4 w-4" /> },
  { to: '/notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
  { to: '/profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
];

/**
 * Top navigation bar with role-based links, notification bell, and connection status.
 */
export function Navigation() {
  const location = useLocation();
  const { data: userResult } = useCurrentUser();
  const userType = userResult?.data?.userType ?? 'customer';
  const links = userType === 'provider' ? providerLinks : customerLinks;

  return (
    <nav className="bg-white dark:bg-card border-b dark:border-border shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/dashboard" className="font-bold text-lg text-blue-600 dark:text-blue-400">
            LaundryBer
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-muted hover:text-gray-900 dark:hover:text-foreground'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side: notification bell + connection status */}
          <div className="flex items-center gap-3">
            <ConnectionStatus />
            <NotificationBell />
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex overflow-x-auto gap-1 pb-2">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-muted'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
