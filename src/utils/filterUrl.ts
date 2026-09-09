import type { FilterState, DateRangePreset } from '@/types/filter';

export const DEFAULT_FILTER_STATE: FilterState = {
  search: undefined,
  dateRange: undefined,
  projects: [],
  teamMembers: [],
  statuses: [],
  priorities: [],
  categories: [],
};

/**
 * Parses URLSearchParams into a structured FilterState object.
 */
export function parseFilterUrl(searchParams: URLSearchParams): FilterState {
  const search = searchParams.get('q') || searchParams.get('search') || '';

  // Date Range parsing
  const presetParam = searchParams.get('datePreset') as DateRangePreset | null;
  const fromParam = searchParams.get('dateFrom') || undefined;
  const toParam = searchParams.get('dateTo') || undefined;

  let dateRange: FilterState['dateRange'] = undefined;
  if (presetParam || fromParam || toParam) {
    dateRange = {
      preset: presetParam || (fromParam || toParam ? 'custom' : undefined),
      from: fromParam,
      to: toParam,
    };
  }

  // Multi-select helper: splits comma-separated string or multiple query keys
  const getArrayParam = (paramName: string): string[] => {
    const raw = searchParams.getAll(paramName);
    if (raw.length === 0) return [];
    return raw
      .flatMap((item) => item.split(','))
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  };

  return {
    search: search || undefined,
    dateRange,
    projects: getArrayParam('project'),
    teamMembers: getArrayParam('teamMember'),
    statuses: getArrayParam('status'),
    priorities: getArrayParam('priority'),
    categories: getArrayParam('category'),
  };
}

/**
 * Serializes a FilterState object into URLSearchParams.
 */
export function serializeFilterUrl(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.search && filters.search.trim()) {
    params.set('q', filters.search.trim());
  }

  if (filters.dateRange) {
    if (filters.dateRange.preset && filters.dateRange.preset !== 'custom') {
      params.set('datePreset', filters.dateRange.preset);
    }
    if (filters.dateRange.from) {
      params.set('dateFrom', filters.dateRange.from);
    }
    if (filters.dateRange.to) {
      params.set('dateTo', filters.dateRange.to);
    }
  }

  if (filters.projects && filters.projects.length > 0) {
    params.set('project', filters.projects.join(','));
  }

  if (filters.teamMembers && filters.teamMembers.length > 0) {
    params.set('teamMember', filters.teamMembers.join(','));
  }

  if (filters.statuses && filters.statuses.length > 0) {
    params.set('status', filters.statuses.join(','));
  }

  if (filters.priorities && filters.priorities.length > 0) {
    params.set('priority', filters.priorities.join(','));
  }

  if (filters.categories && filters.categories.length > 0) {
    params.set('category', filters.categories.join(','));
  }

  return params;
}

/**
 * Computes total number of active filters
 */
export function countActiveFilters(filters: FilterState): number {
  let count = 0;

  if (filters.search && filters.search.trim()) count += 1;
  if (
    filters.dateRange &&
    (filters.dateRange.preset || filters.dateRange.from || filters.dateRange.to)
  )
    count += 1;
  if (filters.projects) count += filters.projects.length;
  if (filters.teamMembers) count += filters.teamMembers.length;
  if (filters.statuses) count += filters.statuses.length;
  if (filters.priorities) count += filters.priorities.length;
  if (filters.categories) count += filters.categories.length;

  return count;
}
