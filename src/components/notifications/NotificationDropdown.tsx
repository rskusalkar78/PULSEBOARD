import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Trash2, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import { NotificationItem } from './NotificationItem';
import { cn } from '@/utils/styles';

export interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPreferences?: () => void;
  menuRef?: React.RefObject<HTMLDivElement | null>;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  onOpenPreferences,
  menuRef,
}) => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    clearReadNotifications,
  } = useNotifications();
  const [tab, setTab] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter((n) => {
    if (tab === 'unread') return !n.read;
    return true;
  });

  const displayList = filteredNotifications.slice(0, 6);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className={cn(
        'absolute right-0 top-full mt-2.5',
        'w-[400px] max-w-[calc(100vw-2rem)]',
        'bg-white dark:bg-slate-900',
        'border border-slate-200 dark:border-slate-800',
        'rounded-2xl shadow-2xl shadow-indigo-500/10',
        'z-[1350] overflow-hidden',
        'animate-in fade-in-0 slide-in-from-top-2 duration-200'
      )}
      role="menu"
      aria-orientation="vertical"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="h-4 w-4 text-indigo-500" />
            Notifications
          </h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => markAllAsRead()}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors"
              title="Mark all as read"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Mark all read</span>
            </button>
          )}

          {onOpenPreferences && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPreferences();
              }}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Notification Settings"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-4 bg-slate-100/40 dark:bg-slate-950/40">
        <button
          type="button"
          onClick={() => setTab('all')}
          className={cn(
            'px-3 py-2 text-xs font-semibold border-b-2 transition-colors',
            tab === 'all'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          )}
        >
          All ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setTab('unread')}
          className={cn(
            'px-3 py-2 text-xs font-semibold border-b-2 transition-colors',
            tab === 'unread'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          )}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-[380px] overflow-y-auto p-2 space-y-2">
        {displayList.length === 0 ? (
          <div className="py-10 text-center">
            <Bell className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {tab === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </p>
          </div>
        ) : (
          displayList.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onMarkAsRead={markAsRead}
              onMarkAsUnread={markAsUnread}
              onDelete={deleteNotification}
              onCloseDropdown={onClose}
              compact
            />
          ))
        )}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
        <button
          type="button"
          onClick={() => {
            onClose();
            navigate('/notifications');
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          View all notifications center
          <ArrowRight className="h-3.5 w-3.5" />
        </button>

        {notifications.some((n) => n.read) && (
          <button
            type="button"
            onClick={() => clearReadNotifications()}
            className="text-[11px] font-medium text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1"
          >
            <Trash2 className="h-3 w-3" />
            Clear read
          </button>
        )}
      </div>
    </div>
  );
};
