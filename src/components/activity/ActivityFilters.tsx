import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button, Input, Select } from '@/components';
import type {
  ActivityFilters as FilterOptions,
  ActivityActionType,
  ActivityEntityType,
} from '@/types';

export interface ActivityFilterBarProps {
  filters: FilterOptions;
  timePeriod: 'all' | 'today' | 'week' | 'month';
  onFilterChange: (newFilters: FilterOptions) => void;
  onTimePeriodChange: (period: 'all' | 'today' | 'week' | 'month') => void;
  onReset: () => void;
  totalResults: number;
}

const ACTION_OPTIONS = [
  { value: 'all', label: 'All Event Types' },
  { value: 'project_created', label: 'Project Created' },
  { value: 'project_updated', label: 'Project Updated' },
  { value: 'task_created', label: 'Task Created' },
  { value: 'task_completed', label: 'Task Completed' },
  { value: 'task_assigned', label: 'Task Assigned' },
  { value: 'member_joined', label: 'Member Joined' },
  { value: 'settings_changed', label: 'Settings Changed' },
];

const ENTITY_OPTIONS = [
  { value: 'all', label: 'All Entities' },
  { value: 'project', label: 'Projects' },
  { value: 'task', label: 'Tasks' },
  { value: 'team', label: 'Teams & Members' },
  { value: 'settings', label: 'Settings' },
];

const TIME_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'Past 7 Days' },
  { value: 'month', label: 'Past 30 Days' },
];

export const ActivityFilters: React.FC<ActivityFilterBarProps> = ({
  filters,
  timePeriod,
  onFilterChange,
  onTimePeriodChange,
  onReset,
  totalResults,
}) => {
  const hasActiveFilters =
    Boolean(filters.search?.trim()) ||
    (filters.action && filters.action !== 'all') ||
    (filters.entity_type && (filters.entity_type as string) !== 'all') ||
    timePeriod !== 'all';

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      search: e.target.value,
    });
  };

  const handleActionSelect = (value: string) => {
    onFilterChange({
      ...filters,
      action: value === 'all' ? undefined : (value as ActivityActionType),
    });
  };

  const handleEntitySelect = (value: string) => {
    onFilterChange({
      ...filters,
      entity_type: value === 'all' ? undefined : (value as ActivityEntityType),
    });
  };

  const handleTimeSelect = (value: string) => {
    const period = value as 'all' | 'today' | 'week' | 'month';
    onTimePeriodChange(period);
  };

  return (
    <div className="space-y-3 bg-white dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
      {/* Search and Primary Selects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Input
            placeholder="Search activities, users, tasks..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            leftAddon={<Search className="w-4 h-4 text-slate-400" />}
            className="w-full text-sm"
          />
        </div>

        {/* Event Type Filter */}
        <div>
          <Select
            options={ACTION_OPTIONS}
            value={filters.action || 'all'}
            onChange={handleActionSelect}
            aria-label="Filter by Event Type"
          />
        </div>

        {/* Entity Type Filter */}
        <div>
          <Select
            options={ENTITY_OPTIONS}
            value={filters.entity_type || 'all'}
            onChange={handleEntitySelect}
            aria-label="Filter by Entity Type"
          />
        </div>

        {/* Time Period Filter */}
        <div>
          <Select
            options={TIME_OPTIONS}
            value={timePeriod}
            onChange={handleTimeSelect}
            aria-label="Filter by Time Period"
          />
        </div>
      </div>

      {/* Active Filter Chips & Summary */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-purple-500" />
            Showing {totalResults} {totalResults === 1 ? 'activity' : 'activities'}
          </span>

          {hasActiveFilters && (
            <>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              {filters.search && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  Keyword: "{filters.search}"
                  <button
                    type="button"
                    onClick={() => onFilterChange({ ...filters, search: undefined })}
                    className="hover:text-purple-900 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.action && filters.action !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Event: {ACTION_OPTIONS.find((o) => o.value === filters.action)?.label}
                  <button
                    type="button"
                    onClick={() => onFilterChange({ ...filters, action: undefined })}
                    className="hover:text-blue-900 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.entity_type && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  Entity: {ENTITY_OPTIONS.find((o) => o.value === filters.entity_type)?.label}
                  <button
                    type="button"
                    onClick={() => onFilterChange({ ...filters, entity_type: undefined })}
                    className="hover:text-amber-900 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {timePeriod !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Period: {TIME_OPTIONS.find((o) => o.value === timePeriod)?.label}
                  <button
                    type="button"
                    onClick={() => onTimePeriodChange('all')}
                    className="hover:text-emerald-900 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            Clear all filters
          </Button>
        )}
      </div>
    </div>
  );
};
export default ActivityFilters;
