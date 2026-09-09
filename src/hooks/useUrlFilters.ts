import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { FilterState } from '@/types/filter';
import {
  parseFilterUrl,
  serializeFilterUrl,
  countActiveFilters,
  DEFAULT_FILTER_STATE,
} from '@/utils/filterUrl';

export interface UseUrlFiltersOptions {
  defaultFilters?: Partial<FilterState>;
  replaceHistory?: boolean;
}

export function useUrlFilters(options: UseUrlFiltersOptions = {}) {
  const { replaceHistory = true } = options;
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse current state from searchParams
  const filters = useMemo<FilterState>(() => {
    const parsed = parseFilterUrl(searchParams);
    return {
      ...DEFAULT_FILTER_STATE,
      ...options.defaultFilters,
      ...parsed,
    };
  }, [searchParams, options.defaultFilters]);

  // Total count of active filters
  const activeCount = useMemo(() => countActiveFilters(filters), [filters]);
  const hasActiveFilters = activeCount > 0;

  // Helper to push new filters to URL
  const updateFilters = useCallback(
    (newFilters: FilterState) => {
      const params = serializeFilterUrl(newFilters);
      setSearchParams(params, { replace: replaceHistory });
    },
    [setSearchParams, replaceHistory]
  );

  // Set specific filter section
  const setFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      const nextFilters = {
        ...filters,
        [key]: value,
      };
      updateFilters(nextFilters);
    },
    [filters, updateFilters]
  );

  // Toggle or add item in a array-based filter (e.g., project, status)
  const toggleArrayFilter = useCallback(
    (key: 'projects' | 'teamMembers' | 'statuses' | 'priorities' | 'categories', id: string) => {
      const currentList = filters[key] || [];
      const exists = currentList.includes(id);
      const nextList = exists ? currentList.filter((item) => item !== id) : [...currentList, id];

      setFilter(key, nextList);
    },
    [filters, setFilter]
  );

  // Remove a specific filter item or clear section
  const removeFilterItem = useCallback(
    (key: keyof FilterState, value?: string) => {
      if (key === 'search') {
        setFilter('search', undefined);
      } else if (key === 'dateRange') {
        setFilter('dateRange', undefined);
      } else if (value && Array.isArray(filters[key])) {
        const currentList = (filters[key] as string[]) || [];
        setFilter(
          key,
          currentList.filter((item) => item !== value)
        );
      } else {
        setFilter(key, []);
      }
    },
    [filters, setFilter]
  );

  // Clear all active filters
  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: replaceHistory });
  }, [setSearchParams, replaceHistory]);

  return {
    filters,
    activeCount,
    hasActiveFilters,
    setFilter,
    toggleArrayFilter,
    removeFilterItem,
    clearFilters,
    updateFilters,
  };
}
