import React from 'react';
import { X, Bell, Mail, Smartphone, Monitor, Check } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import { cn } from '@/utils/styles';

export interface NotificationPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_TOGGLES = [
  {
    key: 'assignment' as const,
    title: 'Task Assignments',
    description: 'Receive alerts when you are assigned or unassigned from tasks.',
  },
  {
    key: 'mention' as const,
    title: 'Direct Mentions',
    description: 'Notifications when someone @mentions you in comments or descriptions.',
  },
  {
    key: 'comment' as const,
    title: 'Comment Updates',
    description: 'Get notified when new comments are posted on your projects or tasks.',
  },
  {
    key: 'status_change' as const,
    title: 'Status & Progress Changes',
    description: 'Alerts when project or task workflow status updates occur.',
  },
  {
    key: 'due_date' as const,
    title: 'Due Date Reminders',
    description: 'Upcoming task deadline alerts and overdue warnings.',
  },
  {
    key: 'team_invite' as const,
    title: 'Team Invitations & Activity',
    description: 'Updates regarding team member joins, invites, and permission changes.',
  },
  {
    key: 'system' as const,
    title: 'System & Security Alerts',
    description: 'Critical infrastructure updates, database snapshot logs, and security events.',
  },
];

export const NotificationPreferencesModal: React.FC<NotificationPreferencesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { preferences, updatePreferences } = useNotifications();

  if (!isOpen) return null;

  const handleChannelToggle = (channel: 'email' | 'push' | 'inApp') => {
    updatePreferences({
      [channel]: !preferences[channel],
    });
  };

  const handleCategoryToggle = (categoryKey: keyof typeof preferences.categories) => {
    updatePreferences({
      categories: {
        ...preferences.categories,
        [categoryKey]: !preferences.categories[categoryKey],
      },
    });
  };

  return (
    <div className="fixed inset-0 z-[1400] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in-0 duration-200">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notif-pref-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="notif-pref-title"
                className="text-base font-bold text-slate-900 dark:text-white"
              >
                Notification Preferences
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customize delivery channels and notification categories.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Section 1: Delivery Channels */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Delivery Channels
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* In-App */}
              <button
                type="button"
                onClick={() => handleChannelToggle('inApp')}
                className={cn(
                  'p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all',
                  preferences.inApp
                    ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-500/40 text-indigo-900 dark:text-indigo-100 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                )}
              >
                <div className="flex items-center justify-between">
                  <Monitor className="h-5 w-5 text-indigo-500" />
                  <div
                    className={cn(
                      'h-4 w-4 rounded-full flex items-center justify-center text-[10px] text-white',
                      preferences.inApp ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                    )}
                  >
                    {preferences.inApp && <Check className="h-3 w-3" />}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold block">In-App Alerts</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Bell badge & popups
                  </span>
                </div>
              </button>

              {/* Email */}
              <button
                type="button"
                onClick={() => handleChannelToggle('email')}
                className={cn(
                  'p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all',
                  preferences.email
                    ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-500/40 text-indigo-900 dark:text-indigo-100 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                )}
              >
                <div className="flex items-center justify-between">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <div
                    className={cn(
                      'h-4 w-4 rounded-full flex items-center justify-center text-[10px] text-white',
                      preferences.email ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                    )}
                  >
                    {preferences.email && <Check className="h-3 w-3" />}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold block">Email Digest</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Daily / immediate emails
                  </span>
                </div>
              </button>

              {/* Push */}
              <button
                type="button"
                onClick={() => handleChannelToggle('push')}
                className={cn(
                  'p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all',
                  preferences.push
                    ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-500/40 text-indigo-900 dark:text-indigo-100 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                )}
              >
                <div className="flex items-center justify-between">
                  <Smartphone className="h-5 w-5 text-emerald-500" />
                  <div
                    className={cn(
                      'h-4 w-4 rounded-full flex items-center justify-center text-[10px] text-white',
                      preferences.push ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                    )}
                  >
                    {preferences.push && <Check className="h-3 w-3" />}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold block">Push Notifications</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Browser & device push
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Section 2: Category Subscriptions */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Notification Categories
            </h3>
            <div className="space-y-2.5">
              {CATEGORY_TOGGLES.map((cat) => {
                const isEnabled = preferences.categories[cat.key] ?? true;
                return (
                  <div
                    key={cat.key}
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="pr-4">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                        {cat.title}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                        {cat.description}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCategoryToggle(cat.key)}
                      className={cn(
                        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                        isEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                      )}
                      role="switch"
                      aria-checked={isEnabled}
                    >
                      <span
                        className={cn(
                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                          isEnabled ? 'translate-x-5' : 'translate-x-0'
                        )}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-md shadow-indigo-600/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
