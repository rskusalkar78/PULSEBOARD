import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, Mail, AlertCircle } from 'lucide-react';
import { IconButton } from '@/components/ui';
import { cn } from '@/utils/styles';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'info',
    title: 'New message',
    message: 'You have a new message from Sarah Chen',
    timestamp: '5 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'success',
    title: 'Task completed',
    message: 'Design review has been completed',
    timestamp: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    type: 'warning',
    title: 'Update required',
    message: 'Please update your profile information',
    timestamp: '2 hours ago',
    read: true,
  },
];

const iconMap = {
  info: Mail,
  success: Check,
  warning: AlertCircle,
  error: AlertCircle,
};

export const NotificationButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div className="relative">
      {/* Notification Button */}
      <div className="relative">
        <IconButton
          ref={buttonRef}
          icon={<Bell className="h-5 w-5" />}
          variant="ghost"
          size="md"
          onClick={handleToggle}
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
          aria-expanded={isOpen}
          aria-haspopup="true"
          className="text-slate-700 dark:text-slate-300"
        />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900"
            aria-hidden="true"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </div>

      {/* Notification Panel */}
      {isOpen && (
        <div
          ref={menuRef}
          className={cn(
            'absolute right-0 top-full mt-2',
            'w-[380px] max-w-[calc(100vw-2rem)]',
            'bg-white dark:bg-slate-900',
            'border border-slate-200 dark:border-slate-800',
            'rounded-lg shadow-lg',
            'z-[1350]',
            'animate-in fade-in-0 slide-in-from-top-2 duration-200'
          )}
          role="menu"
          aria-orientation="vertical"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">No notifications</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                {notifications.map((notification) => {
                  const Icon = iconMap[notification.type];
                  return (
                    <li
                      key={notification.id}
                      className={cn(
                        'px-4 py-3 transition-colors',
                        !notification.read && 'bg-violet-50/50 dark:bg-violet-950/20',
                        'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div
                          className={cn(
                            'flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center',
                            notification.type === 'info' && 'bg-blue-100 dark:bg-blue-950/50',
                            notification.type === 'success' &&
                              'bg-emerald-100 dark:bg-emerald-950/50',
                            notification.type === 'warning' && 'bg-amber-100 dark:bg-amber-950/50',
                            notification.type === 'error' && 'bg-rose-100 dark:bg-rose-950/50'
                          )}
                        >
                          <Icon
                            className={cn(
                              'h-4 w-4',
                              notification.type === 'info' && 'text-blue-600 dark:text-blue-400',
                              notification.type === 'success' &&
                                'text-emerald-600 dark:text-emerald-400',
                              notification.type === 'warning' &&
                                'text-amber-600 dark:text-amber-400',
                              notification.type === 'error' && 'text-rose-600 dark:text-rose-400'
                            )}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="flex-shrink-0 h-2 w-2 rounded-full bg-violet-600" />
                            )}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                            {notification.timestamp}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex-shrink-0 flex gap-1">
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
                              aria-label="Mark as read"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
                            aria-label="Delete notification"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  setIsOpen(false);
                  // Navigate to notifications page
                }}
                className="text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
