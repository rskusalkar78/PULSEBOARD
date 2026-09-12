import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  FolderKanban,
  Users,
  CheckCircle2,
  AlertTriangle,
  Tag,
} from 'lucide-react';
import type { FilterState, FilterConfig } from '@/types/filter';
import { Input } from '@/components/ui/Form/Input';
import { Button } from '@/components/ui/Button/Button';
import { FilterDateRangePicker } from './FilterDateRangePicker';
import { FilterMultiSelect } from './FilterMultiSelect';
import { FilterBadgeGroup } from './FilterBadgeGroup';
import { FilterDrawer } from './FilterDrawer';

export interface FilterBarProps {
  filters: FilterState;
  config: FilterConfig;
  activeCount: number;
  onSetFilter: <K extends keyof FilterState>(key: K, val: FilterState[K]) => void;
  onRemoveItem: (key: keyof FilterState, id?: string) => void;
  onClearFilters: () => void;
  placeholder?: string;
  showSearch?: boolean;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  config,
  activeCount,
  onSetFilter,
  onRemoveItem,
  onClearFilters,
  placeholder = 'Search by keyword...',
  showSearch = true,
  className = '',
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Top Bar: Search Input & Filter Triggers */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {showSearch && (
          <div className="flex-1 min-w-[200px]">
            <Input
              type="text"
              placeholder={placeholder}
              value={filters.search || ''}
              onChange={(e) => onSetFilter('search', e.target.value || undefined)}
              leftAddon={<Search className="h-4 w-4 text-slate-400" />}
            />
          </div>
        )}

        {/* Desktop Filter Dropdowns */}
        <div className="hidden lg:flex items-center flex-wrap gap-2">
          {/* Date Range */}
          <FilterDateRangePicker
            value={filters.dateRange}
            onChange={(val) => onSetFilter('dateRange', val)}
          />

          {/* Project */}
          {config.projects && config.projects.length > 0 && (
            <FilterMultiSelect
              label="Project"
              options={config.projects}
              selectedValues={filters.projects}
              onChange={(vals) => onSetFilter('projects', vals)}
              icon={<FolderKanban className="h-4 w-4 text-slate-400" />}
            />
          )}

          {/* Team Member */}
          {config.teamMembers && config.teamMembers.length > 0 && (
            <FilterMultiSelect
              label="Team Member"
              options={config.teamMembers}
              selectedValues={filters.teamMembers}
              onChange={(vals) => onSetFilter('teamMembers', vals)}
              icon={<Users className="h-4 w-4 text-slate-400" />}
            />
          )}

          {/* Status */}
          {config.statuses && config.statuses.length > 0 && (
            <FilterMultiSelect
              label="Status"
              options={config.statuses}
              selectedValues={filters.statuses}
              onChange={(vals) => onSetFilter('statuses', vals)}
              icon={<CheckCircle2 className="h-4 w-4 text-slate-400" />}
            />
          )}

          {/* Priority */}
          {config.priorities && config.priorities.length > 0 && (
            <FilterMultiSelect
              label="Priority"
              options={config.priorities}
              selectedValues={filters.priorities}
              onChange={(vals) => onSetFilter('priorities', vals)}
              icon={<AlertTriangle className="h-4 w-4 text-slate-400" />}
            />
          )}

          {/* Category */}
          {config.categories && config.categories.length > 0 && (
            <FilterMultiSelect
              label="Category"
              options={config.categories}
              selectedValues={filters.categories}
              onChange={(vals) => onSetFilter('categories', vals)}
              icon={<Tag className="h-4 w-4 text-slate-400" />}
            />
          )}
        </div>

        {/* Mobile Filter Drawer Trigger */}
        <div className="lg:hidden flex items-center">
          <Button
            variant={activeCount > 0 ? 'primary' : 'outline'}
            size="md"
            leftIcon={<SlidersHorizontal className="h-4 w-4" />}
            onClick={() => setIsDrawerOpen(true)}
            className="w-full sm:w-auto"
          >
            Filters {activeCount > 0 ? `(${activeCount})` : ''}
          </Button>
        </div>
      </div>

      {/* Filter Badges */}
      <FilterBadgeGroup
        filters={filters}
        config={config}
        onRemoveItem={onRemoveItem}
        onClearAll={onClearFilters}
      />

      {/* Mobile Drawer */}
      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        filters={filters}
        config={config}
        onSetFilter={onSetFilter}
        onClearFilters={onClearFilters}
        activeCount={activeCount}
      />
    </div>
  );
};
