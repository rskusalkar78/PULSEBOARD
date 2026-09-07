import React from 'react';
import type { FilterState, FilterConfig } from '@/types/filter';
import { Drawer } from '@/components/ui/Overlay/Drawer';
import { Button } from '@/components/ui/Button/Button';
import { FilterDateRangePicker } from './FilterDateRangePicker';
import { FilterMultiSelect } from './FilterMultiSelect';
import { FolderKanban, Users, CheckCircle2, AlertTriangle, Tag, RotateCcw } from 'lucide-react';

export interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  config: FilterConfig;
  onSetFilter: <K extends keyof FilterState>(key: K, val: FilterState[K]) => void;
  onClearFilters: () => void;
  activeCount: number;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  config,
  onSetFilter,
  onClearFilters,
  activeCount,
}) => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} side="right" className="w-full max-w-sm p-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Filter Options</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {activeCount > 0 ? `${activeCount} filter(s) applied` : 'No active filters'}
          </p>
        </div>
      </div>

      <div className="flex-1 py-6 space-y-6 overflow-y-auto">
        {/* Date Range */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Date Range
          </label>
          <FilterDateRangePicker
            value={filters.dateRange}
            onChange={(val) => onSetFilter('dateRange', val)}
            className="w-full"
          />
        </div>

        {/* Project */}
        {config.projects && config.projects.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Project
            </label>
            <FilterMultiSelect
              label="Projects"
              options={config.projects}
              selectedValues={filters.projects}
              onChange={(vals) => onSetFilter('projects', vals)}
              icon={<FolderKanban className="h-4 w-4 text-slate-500" />}
              className="w-full"
            />
          </div>
        )}

        {/* Team Member */}
        {config.teamMembers && config.teamMembers.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Team Member
            </label>
            <FilterMultiSelect
              label="Team Members"
              options={config.teamMembers}
              selectedValues={filters.teamMembers}
              onChange={(vals) => onSetFilter('teamMembers', vals)}
              icon={<Users className="h-4 w-4 text-slate-500" />}
              className="w-full"
            />
          </div>
        )}

        {/* Status */}
        {config.statuses && config.statuses.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Status
            </label>
            <FilterMultiSelect
              label="Status"
              options={config.statuses}
              selectedValues={filters.statuses}
              onChange={(vals) => onSetFilter('statuses', vals)}
              icon={<CheckCircle2 className="h-4 w-4 text-slate-500" />}
              className="w-full"
            />
          </div>
        )}

        {/* Priority */}
        {config.priorities && config.priorities.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Priority
            </label>
            <FilterMultiSelect
              label="Priority"
              options={config.priorities}
              selectedValues={filters.priorities}
              onChange={(vals) => onSetFilter('priorities', vals)}
              icon={<AlertTriangle className="h-4 w-4 text-slate-500" />}
              className="w-full"
            />
          </div>
        )}

        {/* Category */}
        {config.categories && config.categories.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Category
            </label>
            <FilterMultiSelect
              label="Category"
              options={config.categories}
              selectedValues={filters.categories}
              onChange={(vals) => onSetFilter('categories', vals)}
              icon={<Tag className="h-4 w-4 text-slate-500" />}
              className="w-full"
            />
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex gap-3">
        <Button
          variant="outline"
          size="md"
          className="flex-1"
          leftIcon={<RotateCcw className="h-4 w-4" />}
          onClick={onClearFilters}
          disabled={activeCount === 0}
        >
          Reset
        </Button>
        <Button variant="primary" size="md" className="flex-1" onClick={onClose}>
          Apply Filters
        </Button>
      </div>
    </Drawer>
  );
};
