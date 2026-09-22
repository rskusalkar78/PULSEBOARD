import React, { useState, useMemo } from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  PlusCircle,
  Inbox,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import {
  NotificationFilters,
  type ReadFilterOption,
} from '@/components/notifications/NotificationFilters';
import { NotificationPreferencesModal } from '@/components/notifications/NotificationPreferencesModal';
import type { NotificationType } from '@/types';

export function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    categoryCounts,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    clearReadNotifications,
    createNotification,
  } = useNotifications();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [readFilter, setReadFilter] = useState<ReadFilterOption>('all');
  const [isPreferencesOpen, setIsPreferencesOpen] = useState<boolean>(false);
  const [showSimulateBanner, setShowSimulateBanner] = useState<boolean>(false);

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      // Category filter
      if (selectedCategory !== 'all' && n.type !== selectedCategory) {
        return false;
      }
      // Read status filter
      if (readFilter === 'unread' && n.read) return false;
      if (readFilter === 'read' && !n.read) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = n.title.toLowerCase().includes(query);
        const messageMatch = n.message?.toLowerCase().includes(query) || false;
        const typeMatch = n.type.toLowerCase().includes(query);
        return titleMatch || messageMatch || typeMatch;
      }

      return true;
    });
  }, [notifications, selectedCategory, readFilter, searchQuery]);

  // Handler to simulate sending a test notification
  const handleSimulateNotification = (type: NotificationType) => {
    const titles: Record<NotificationType, string> = {
      assignment: 'Assigned to new task: API Rate Limiter Setup',
      mention: 'Mentioned in comment: @you review latest PR #142',
      comment: 'New feedback on task "Vite Optimization"',
      status_change: 'Project "PulseBoard v1.0" moved to Production',
      due_date: 'Deadline Warning: Analytics Dashboard due in 2 hours',
      team_invite: 'New team member joined workspace',
      system: 'Security Check: TLS Certificate renewed successfully',
    };

    createNotification({
      type,
      title: titles[type] || 'New Notification Alert',
      message: `Simulated ${type} event triggered at ${new Date().toLocaleTimeString()}`,
      action_url: type === 'assignment' ? '/tasks' : '/dashboard',
    });
    setShowSimulateBanner(true);
    setTimeout(() => setShowSimulateBanner(false), 3000);
  };

  const hasUnread = unreadCount > 0;
  const hasRead = notifications.some((n) => n.read);
  const hasTotal = notifications.length > 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Bell className="w-6 h-6" />
            </div>
            Notification Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time updates for task assignments, direct mentions, status changes, and system
            alerts.
          </p>
        </div>

        {/* Global Header Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleSimulateNotification('assignment')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-md shadow-indigo-600/20"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Simulate Alert
          </button>

          {hasTotal && (
            <button
              type="button"
              onClick={clearAllNotifications}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-xl text-xs font-semibold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Total Notifications
            </span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {notifications.length}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Unread Items
            </span>
            <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
              {unreadCount}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Assignments
            </span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {categoryCounts.assignment}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              System Alerts
            </span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {categoryCounts.system}
            </span>
          </div>
        </div>
      </div>

      {/* Notification Filters Bar */}
      <NotificationFilters
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        readFilter={readFilter}
        onReadFilterChange={setReadFilter}
        categoryCounts={categoryCounts}
        onMarkAllAsRead={markAllAsRead}
        onClearRead={clearReadNotifications}
        onClearAll={clearAllNotifications}
        onOpenPreferences={() => setIsPreferencesOpen(true)}
        hasUnread={hasUnread}
        hasRead={hasRead}
        hasTotal={hasTotal}
      />

      {/* Simulated Notification Success Banner */}
      {showSimulateBanner && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-between animate-in fade-in-0 duration-200">
          <span>Real notification generated and saved successfully!</span>
          <CheckCheck className="w-4 h-4" />
        </div>
      )}

      {/* Notifications List Feed */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
            <Bell className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              No notifications found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              {searchQuery || selectedCategory !== 'all' || readFilter !== 'all'
                ? 'Try adjusting your category filter, status filter, or search keywords.'
                : 'All caught up! You have zero active notifications in your inbox.'}
            </p>
            {(searchQuery || selectedCategory !== 'all' || readFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setReadFilter('all');
                }}
                className="mt-4 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/60 rounded-xl text-xs font-semibold transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
              onMarkAsUnread={markAsUnread}
              onDelete={deleteNotification}
            />
          ))
        )}
      </div>

      {/* Preferences Modal */}
      <NotificationPreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
      />
    </div>
  );
}

export default NotificationsPage;
