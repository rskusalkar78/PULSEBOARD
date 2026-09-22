import React from 'react';
import { Bell } from 'lucide-react';
import { IconButton } from '@/components/ui';

export interface NotificationBellProps {
  unreadCount: number;
  isOpen: boolean;
  onToggle: () => void;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  unreadCount,
  isOpen,
  onToggle,
  buttonRef,
}) => {
  return (
    <div className="relative inline-flex items-center">
      <IconButton
        ref={buttonRef}
        icon={<Bell className="h-5 w-5 transition-transform group-hover:scale-110" />}
        variant="ghost"
        size="md"
        onClick={onToggle}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="text-slate-700 dark:text-slate-300 relative"
      />

      {unreadCount > 0 && (
        <span
          className="absolute -top-1 -right-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900 shadow-md animate-pulse"
          aria-hidden="true"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </div>
  );
};
