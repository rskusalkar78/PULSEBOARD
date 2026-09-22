import React from 'react';
import { Search, CheckCheck, Trash2, SlidersHorizontal } from 'lucide-react';
import type { CategoryCount } from '@/context/NotificationContext';
import { cn } from '@/utils/styles';

export type ReadFilterOption = 'all' | 'unread' | 'read';

export interface NotificationFiltersProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  readFilter: ReadFilterOption;
  onReadFilterChange: (filter: ReadFilterOption) => void;
  categoryCounts: CategoryCount;
  onMarkAllAsRead: () => void;
  onClearRead: () => void;
  onClearAll: () => void;
  onOpenPreferences: () => void;
  hasUnread: boolean;
  hasRead: boolean;
  hasTotal: boolean;
}

const CATEGORY_TABS: Array<{ id: string; label: string; key: keyof CategoryCount }> = [
  { id: 'all', label: 'All', key: 'all' },
  { id: 'assignment', label: 'Assignments', key: 'assignment' },
  { id: 'mention', label: 'Mentions', key: 'mention' },
  { id: 'comment', label: 'Comments', key: 'comment' },
  { id: 'status_change', label: 'Status Updates', key: 'status_change' },
  { id: 'due_date', label: 'Due Dates', key: 'due_date' },
  { id: 'team_invite', label: 'Team', key: 'team_invite' },
  { id: 'system', label: 'System Alerts', key: 'system' },
];

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  readFilter,
  onReadFilterChange,
  categoryCounts,
  onMarkAllAsRead,
  onClearRead,
  _onClearAll,
  onOpenPreferences,
  hasUnread,
  hasRead,
  _hasTotal,
}: NotificationFiltersProps & { _onClearAll?: () => void; _hasTotal?: boolean }) => {
  return (
    <div className="space-y-4">
      {/* Top Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, description or author..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Read Status Selector & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Read Status Dropdown */}
          <div className="relative">
            <select
              value={readFilter}
              onChange={(e) => onReadFilterChange(e.target.value as ReadFilterOption)}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {hasUnread && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-xl text-xs font-semibold transition-colors"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark All Read
            </button>
          )}

          {hasRead && (
            <button
              type="button"
              onClick={onClearRead}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear Read
            </button>
          )}

          <button
            type="button"
            onClick={onOpenPreferences}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors"
            title="Configure Preferences"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Preferences
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORY_TABS.map((tab) => {
          const count = categoryCounts[tab.key] || 0;
          const isActive = selectedCategory === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectCategory(tab.id)}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border',
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  'px-1.5 py-0.2 rounded-md text-[10px] font-mono font-bold',
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
