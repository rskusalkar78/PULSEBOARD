import { describe, it, expect } from 'vitest';
import { parseFilterUrl, serializeFilterUrl, countActiveFilters } from '../filterUrl';

describe('Filter URL utilities', () => {
  it('parses empty query params to default filter state', () => {
    const params = new URLSearchParams('');
    const state = parseFilterUrl(params);

    expect(state.search).toBeUndefined();
    expect(state.projects).toEqual([]);
    expect(state.teamMembers).toEqual([]);
    expect(state.statuses).toEqual([]);
    expect(state.priorities).toEqual([]);
    expect(state.categories).toEqual([]);
  });

  it('parses comma-separated multi-select parameters', () => {
    const params = new URLSearchParams('project=p1,p2&status=active&priority=high,urgent');
    const state = parseFilterUrl(params);

    expect(state.projects).toEqual(['p1', 'p2']);
    expect(state.statuses).toEqual(['active']);
    expect(state.priorities).toEqual(['high', 'urgent']);
  });

  it('parses date range filter params', () => {
    const params = new URLSearchParams('datePreset=7d&dateFrom=2026-09-01&dateTo=2026-09-07');
    const state = parseFilterUrl(params);

    expect(state.dateRange).toBeDefined();
    expect(state.dateRange?.preset).toBe('7d');
    expect(state.dateRange?.from).toBe('2026-09-01');
    expect(state.dateRange?.to).toBe('2026-09-07');
  });

  it('serializes filter state to URLSearchParams correctly', () => {
    const filters = {
      search: 'react',
      dateRange: { preset: '7d' as const, from: '2026-09-01', to: '2026-09-07' },
      projects: ['p1', 'p2'],
      teamMembers: ['u1'],
      statuses: ['active'],
      priorities: ['high'],
      categories: ['Frontend'],
    };

    const params = serializeFilterUrl(filters);
    expect(params.get('q')).toBe('react');
    expect(params.get('datePreset')).toBe('7d');
    expect(params.get('project')).toBe('p1,p2');
    expect(params.get('teamMember')).toBe('u1');
    expect(params.get('status')).toBe('active');
    expect(params.get('priority')).toBe('high');
    expect(params.get('category')).toBe('Frontend');
  });

  it('counts active filters correctly', () => {
    const filters = {
      search: 'test',
      projects: ['p1', 'p2'],
      teamMembers: [],
      statuses: ['active'],
      priorities: [],
      categories: [],
    };

    expect(countActiveFilters(filters)).toBe(4); // 1 search + 2 projects + 1 status
  });
});
