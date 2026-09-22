import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  AtSign,
  CheckCircle2,
  MessageSquare,
  RefreshCw,
  Clock,
  UserPlus,
  ShieldAlert,
  Check,
  RotateCcw,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import type { Notification, NotificationType } from '@/types';
import { cn } from '@/utils/styles';

export interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onMarkAsUnread?: (id: string) => void;
  onDelete?: (id: string) => void;
  onCloseDropdown?: () => void;
  compact?: boolean;
}

const CATEGORY_CONFIG: Record<
  NotificationType,
  {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    bgClass: string;
    textClass: string;
    badgeClass: string;
  }
> = {
  assignment: {
    icon: CheckCircle2,
    label: 'Assignment',
    bgClass: 'bg-violet-500/10 dark:bg-violet-500/20 border-violet-500/20',
    textClass: 'text-violet-600 dark:text-violet-400',
    badgeClass: 'bg-violet-100 text-violet-700 dark:bg-violet-950/80 dark:text-violet-300',
  },
  mention: {
    icon: AtSign,
    label: 'Mention',
    bgClass: 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/20',
    textClass: 'text-blue-600 dark:text-blue-400',
    badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300',
  },
  comment: {
    icon: MessageSquare,
    label: 'Comment',
    bgClass: 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/20',
    textClass: 'text-emerald-600 dark:text-emerald-400',
    badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300',
  },
  status_change: {
    icon: RefreshCw,
    label: 'Status',
    bgClass: 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/20',
    textClass: 'text-amber-600 dark:text-amber-400',
    badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300',
  },
  due_date: {
    icon: Clock,
    label: 'Due Date',
    bgClass: 'bg-rose-500/10 dark:bg-rose-500/20 border-rose-500/20',
    textClass: 'text-rose-600 dark:text-rose-400',
    badgeClass: 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300',
  },
  team_invite: {
    icon: UserPlus,
    label: 'Team',
    bgClass: 'bg-cyan-500/10 dark:bg-cyan-500/20 border-cyan-500/20',
    textClass: 'text-cyan-600 dark:text-cyan-400',
    badgeClass: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/80 dark:text-cyan-300',
  },
  system: {
    icon: ShieldAlert,
    label: 'System',
    bgClass: 'bg-indigo-500/10 dark:bg-indigo-500/20 border-indigo-500/20',
    textClass: 'text-indigo-600 dark:text-indigo-400',
    badgeClass: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300',
  },
};

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
  onCloseDropdown,
  compact = false,
}) => {
  const config = CATEGORY_CONFIG[notification.type] || {
    icon: Bell,
    label: 'Notification',
    bgClass: 'bg-slate-500/10 border-slate-500/20',
    textClass: 'text-slate-400',
    badgeClass: 'bg-slate-800 text-slate-300',
  };

  const IconComponent = config.icon;
  const isUnread = !notification.read;

  const handleActionClick = () => {
    if (isUnread && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    if (onCloseDropdown) {
      onCloseDropdown();
    }
  };

  return (
    <div
      className={cn(
        'group relative flex items-start gap-3 rounded-xl transition-all duration-200 border',
        compact ? 'p-3 text-xs' : 'p-4 text-sm',
        isUnread
          ? 'bg-slate-900/90 dark:bg-slate-900/90 border-indigo-500/30 shadow-sm shadow-indigo-500/5'
          : 'bg-white/60 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800/80 opacity-85 hover:opacity-100 hover:bg-slate-50 dark:hover:bg-slate-800/40'
      )}
    >
      {/* Category Icon Badge */}
      <div
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-transform group-hover:scale-105',
          config.bgClass
        )}
      >
        <IconComponent className={cn('h-4 w-4', config.textClass)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={cn(
                'inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider shrink-0',
                config.badgeClass
              )}
            >
              {config.label}
            </span>
            <h4
              className={cn(
                'font-semibold text-slate-900 dark:text-slate-100 truncate',
                compact ? 'text-xs' : 'text-sm'
              )}
            >
              {notification.title}
            </h4>
          </div>
          <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 shrink-0">
            {formatRelativeTime(notification.created_at)}
          </span>
        </div>

        {notification.message && (
          <p
            className={cn(
              'mt-1 text-slate-600 dark:text-slate-300 leading-relaxed',
              compact ? 'line-clamp-2 text-[11px]' : 'text-xs'
            )}
          >
            {notification.message}
          </p>
        )}

        {/* Action Link if provided */}
        {notification.action_url && (
          <div className="mt-2 flex items-center gap-1.5">
            <Link
              to={notification.action_url}
              onClick={handleActionClick}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              View details
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        )}
      </div>

      {/* Right Controls / Unread Dot */}
      <div className="flex items-center gap-1 shrink-0 self-center">
        {isUnread && (
          <span className="h-2 w-2 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20 animate-pulse" />
        )}

        {/* Action Buttons (Mark read/unread, delete) */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {isUnread
            ? onMarkAsRead && (
                <button
                  type="button"
                  onClick={() => onMarkAsRead(notification.id)}
                  title="Mark as read"
                  aria-label="Mark notification as read"
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
              )
            : onMarkAsUnread && (
                <button
                  type="button"
                  onClick={() => onMarkAsUnread(notification.id)}
                  title="Mark as unread"
                  aria-label="Mark notification as unread"
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              )}

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(notification.id)}
              title="Delete notification"
              aria-label="Delete notification"
              className="p-1 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
