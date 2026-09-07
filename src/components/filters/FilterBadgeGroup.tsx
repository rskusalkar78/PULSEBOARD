import React from 'react';
import type { FilterState, FilterConfig } from '@/types/filter';
import { Badge } from '@/components/ui/Display/Badge';
import { Button } from '@/components/ui/Button/Button';
import { RotateCcw } from 'lucide-react';

export interface FilterBadgeGroupProps {
  filters: FilterState;
  config?: FilterConfig;
  onRemoveItem: (key: keyof FilterState, id?: string) => void;
  onClearAll: () => void;
  className?: string;
}

export const FilterBadgeGroup: React.FC<FilterBadgeGroupProps> = ({
  filters,
  config,
  onRemoveItem,
  onClearAll,
  className = '',
}) => {
  const getItemLabel = (key: keyof FilterConfig, id: string): string => {
    if (config && config[key]) {
      const option = config[key]?.find((opt) => opt.id === id);
      if (option) return option.label;
    }
    return id;
  };

  const hasAnyBadge =
    Boolean(filters.search) ||
    Boolean(filters.dateRange?.preset || filters.dateRange?.from || filters.dateRange?.to) ||
    filters.projects.length > 0 ||
    filters.teamMembers.length > 0 ||
    filters.statuses.length > 0 ||
    filters.priorities.length > 0 ||
    filters.categories.length > 0;

  if (!hasAnyBadge) return null;

  const getDateBadgeLabel = () => {
    if (!filters.dateRange) return '';
    const { preset, from, to } = filters.dateRange;
    if (preset && preset !== 'custom') {
      const presetLabels: Record<string, string> = {
        today: 'Today',
        '7d': 'Last 7 Days',
        '30d': 'Last 30 Days',
        '90d': 'Last 90 Days',
      };
      return `Date: ${presetLabels[preset] || preset}`;
    }
    if (from && to) return `Date: ${from} to ${to}`;
    if (from) return `Date: from ${from}`;
    if (to) return `Date: until ${to}`;
    return 'Date: Custom';
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 pt-2 ${className}`}>
      {/* Search Badge */}
      {filters.search && (
        <Badge variant="primary" onDismiss={() => onRemoveItem('search')} className="text-xs">
          Search: "{filters.search}"
        </Badge>
      )}

      {/* Date Range Badge */}
      {filters.dateRange &&
        (filters.dateRange.preset || filters.dateRange.from || filters.dateRange.to) && (
          <Badge variant="primary" onDismiss={() => onRemoveItem('dateRange')} className="text-xs">
            {getDateBadgeLabel()}
          </Badge>
        )}

      {/* Project Badges */}
      {filters.projects.map((id) => (
        <Badge
          key={`project-${id}`}
          variant="default"
          onDismiss={() => onRemoveItem('projects', id)}
          className="text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300"
        >
          Project: {getItemLabel('projects', id)}
        </Badge>
      ))}

      {/* Team Member Badges */}
      {filters.teamMembers.map((id) => (
        <Badge
          key={`team-${id}`}
          variant="default"
          onDismiss={() => onRemoveItem('teamMembers', id)}
          className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300"
        >
          Member: {getItemLabel('teamMembers', id)}
        </Badge>
      ))}

      {/* Status Badges */}
      {filters.statuses.map((id) => (
        <Badge
          key={`status-${id}`}
          variant="default"
          onDismiss={() => onRemoveItem('statuses', id)}
          className="text-xs bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300"
        >
          Status: {getItemLabel('statuses', id)}
        </Badge>
      ))}

      {/* Priority Badges */}
      {filters.priorities.map((id) => (
        <Badge
          key={`priority-${id}`}
          variant="default"
          onDismiss={() => onRemoveItem('priorities', id)}
          className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300"
        >
          Priority: {getItemLabel('priorities', id)}
        </Badge>
      ))}

      {/* Category Badges */}
      {filters.categories.map((id) => (
        <Badge
          key={`category-${id}`}
          variant="default"
          onDismiss={() => onRemoveItem('categories', id)}
          className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300"
        >
          Category: {getItemLabel('categories', id)}
        </Badge>
      ))}

      {/* Clear All Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        leftIcon={<RotateCcw className="h-3 w-3" />}
        className="text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 h-6 px-2"
      >
        Clear all
      </Button>
    </div>
  );
};
