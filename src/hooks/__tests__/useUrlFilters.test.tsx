import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { useUrlFilters } from '../useUrlFilters';

function createWrapper(initialEntries: string[] = ['/']) {
  return ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
  );
}

describe('useUrlFilters hook', () => {
  it('parses initial filters from URL correctly', () => {
    const { result } = renderHook(() => useUrlFilters(), {
      wrapper: createWrapper([
        '/?q=pulse&project=proj-1,proj-2&teamMember=user-1&status=active&priority=high&category=Backend&datePreset=7d',
      ]),
    });

    expect(result.current.filters.search).toBe('pulse');
    expect(result.current.filters.projects).toEqual(['proj-1', 'proj-2']);
    expect(result.current.filters.teamMembers).toEqual(['user-1']);
    expect(result.current.filters.statuses).toEqual(['active']);
    expect(result.current.filters.priorities).toEqual(['high']);
    expect(result.current.filters.categories).toEqual(['Backend']);
    expect(result.current.filters.dateRange?.preset).toBe('7d');
    expect(result.current.hasActiveFilters).toBe(true);
    expect(result.current.activeCount).toBe(8);
  });

  it('updates a specific filter', () => {
    const { result } = renderHook(() => useUrlFilters(), {
      wrapper: createWrapper(['/']),
    });

    act(() => {
      result.current.setFilter('search', 'analytics');
    });

    expect(result.current.filters.search).toBe('analytics');
    expect(result.current.activeCount).toBe(1);

    act(() => {
      result.current.setFilter('projects', ['proj-3']);
    });

    expect(result.current.filters.projects).toEqual(['proj-3']);
  });

  it('toggles array filter items', () => {
    const { result } = renderHook(() => useUrlFilters(), {
      wrapper: createWrapper(['/']),
    });

    act(() => {
      result.current.toggleArrayFilter('projects', 'proj-1');
    });
    expect(result.current.filters.projects).toEqual(['proj-1']);

    act(() => {
      result.current.toggleArrayFilter('projects', 'proj-2');
    });
    expect(result.current.filters.projects).toEqual(['proj-1', 'proj-2']);

    act(() => {
      result.current.toggleArrayFilter('projects', 'proj-1');
    });
    expect(result.current.filters.projects).toEqual(['proj-2']);
  });

  it('removes specific filter item or category', () => {
    const { result } = renderHook(() => useUrlFilters(), {
      wrapper: createWrapper(['/?q=test&project=p1,p2&status=active']),
    });

    act(() => {
      result.current.removeFilterItem('projects', 'p1');
    });
    expect(result.current.filters.projects).toEqual(['p2']);

    act(() => {
      result.current.removeFilterItem('search');
    });
    expect(result.current.filters.search).toBeUndefined();

    act(() => {
      result.current.removeFilterItem('statuses');
    });
    expect(result.current.filters.statuses).toEqual([]);
  });

  it('clears all active filters', () => {
    const { result } = renderHook(() => useUrlFilters(), {
      wrapper: createWrapper(['/?q=test&project=p1&status=active']),
    });

    expect(result.current.hasActiveFilters).toBe(true);

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.hasActiveFilters).toBe(false);
    expect(result.current.activeCount).toBe(0);
    expect(result.current.filters.search).toBeUndefined();
    expect(result.current.filters.projects).toEqual([]);
  });
});
