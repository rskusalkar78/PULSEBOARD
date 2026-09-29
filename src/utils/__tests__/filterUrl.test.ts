/**
 * Filter URL Utility Tests
 */

import { describe, it, expect } from 'vitest';
import {
  parseFilterUrl,
  serializeFilterUrl,
  countActiveFilters,
  DEFAULT_FILTER_STATE,
} from '../filterUrl';
import type { FilterState } from '@/types/filter';

describe('parseFilterUrl', () => {
  it('returns default state for empty URLSearchParams', () => {
    const params = new URLSearchParams();
    const result = parseFilterUrl(params);

    expect(result.search).toBeUndefined();
    expect(result.dateRange).toBeUndefined();
    expect(result.projects).toEqual([]);
    expect(result.teamMembers).toEqual([]);
    expect(result.statuses).toEqual([]);
    expect(result.priorities).toEqual([]);
    expect(result.categories).toEqual([]);
  });

  it('parses search query from "q" parameter', () => {
    const params = new URLSearchParams('?q=test');
    const result = parseFilterUrl(params);
    expect(result.search).toBe('test');
  });

  it('parses search query from "search" parameter', () => {
    const params = new URLSearchParams('?search=dashboard');
    const result = parseFilterUrl(params);
    expect(result.search).toBe('dashboard');
  });

  it('prefers "q" over "search" when both present', () => {
    const params = new URLSearchParams('?q=query&search=other');
    const result = parseFilterUrl(params);
    expect(result.search).toBe('query');
  });

  it('parses date range preset', () => {
    const params = new URLSearchParams('?datePreset=7d');
    const result = parseFilterUrl(params);
    expect(result.dateRange?.preset).toBe('7d');
  });

  it('parses custom date range', () => {
    const params = new URLSearchParams('?dateFrom=2024-01-01&dateTo=2024-12-31');
    const result = parseFilterUrl(params);
    expect(result.dateRange?.preset).toBe('custom');
    expect(result.dateRange?.from).toBe('2024-01-01');
    expect(result.dateRange?.to).toBe('2024-12-31');
  });

  it('parses comma-separated array values', () => {
    const params = new URLSearchParams('?project=proj-1,proj-2,proj-3');
    const result = parseFilterUrl(params);
    expect(result.projects).toEqual(['proj-1', 'proj-2', 'proj-3']);
  });

  it('parses multiple query parameters of same name', () => {
    const params = new URLSearchParams();
    params.append('project', 'proj-1');
    params.append('project', 'proj-2');
    const result = parseFilterUrl(params);
    expect(result.projects).toEqual(['proj-1', 'proj-2']);
  });

  it('trims whitespace from array values', () => {
    const params = new URLSearchParams('?status=active, completed , on_hold');
    const result = parseFilterUrl(params);
    expect(result.statuses).toEqual(['active', 'completed', 'on_hold']);
  });

  it('filters out empty array values', () => {
    const params = new URLSearchParams('?priority=high,,low,');
    const result = parseFilterUrl(params);
    expect(result.priorities).toEqual(['high', 'low']);
  });

  it('parses all filter types together', () => {
    const params = new URLSearchParams(
      '?q=search&project=p1,p2&teamMember=u1&status=active&priority=high&category=Backend&datePreset=30d'
    );
    const result = parseFilterUrl(params);

    expect(result.search).toBe('search');
    expect(result.projects).toEqual(['p1', 'p2']);
    expect(result.teamMembers).toEqual(['u1']);
    expect(result.statuses).toEqual(['active']);
    expect(result.priorities).toEqual(['high']);
    expect(result.categories).toEqual(['Backend']);
    expect(result.dateRange?.preset).toBe('30d');
  });

  it('handles URL encoding correctly', () => {
    const params = new URLSearchParams('?q=test%20search&category=Front%20End');
    const result = parseFilterUrl(params);
    expect(result.search).toBe('test search');
    expect(result.categories).toEqual(['Front End']);
  });
});

describe('serializeFilterUrl', () => {
  it('returns empty params for default filter state', () => {
    const params = serializeFilterUrl(DEFAULT_FILTER_STATE);
    expect(params.toString()).toBe('');
  });

  it('serializes search query', () => {
    const filters: FilterState = {
      ...DEFAULT_FILTER_STATE,
      search: 'test query',
    };
    const params = serializeFilterUrl(filters);
    expect(params.get('q')).toBe('test query');
  });

  it('trims search query whitespace', () => {
    const filters: FilterState = {
      ...DEFAULT_FILTER_STATE,
      search: '  test  ',
    };
    const params = serializeFilterUrl(filters);
    expect(params.get('q')).toBe('test');
  });

  it('skips empty search query', () => {
    const filters: FilterState = {
      ...DEFAULT_FILTER_STATE,
      search: '   ',
    };
    const params = serializeFilterUrl(filters);
    expect(params.has('q')).toBe(false);
  });

  it('serializes date preset (non-custom)', () => {
    const filters: FilterState = {
      ...DEFAULT_FILTER_STATE,
      dateRange: { preset: '7d' },
    };
    const params = serializeFilterUrl(filters);
    expect(params.get('datePreset')).toBe('7d');
  });

  it('skips preset for custom date range', () => {
    const filters: FilterState = {
      ...DEFAULT_FILTER_STATE,
      dateRange: { preset: 'custom', from: '2024-01-01', to: '2024-12-31' },
    };
    const params = serializeFilterUrl(filters);
    expect(params.has('datePreset')).toBe(false);
    expect(params.get('dateFrom')).toBe('2024-01-01');
    expect(params.get('dateTo')).toBe('2024-12-31');
  });

  it('serializes arrays as comma-separated values', () => {
    const filters: FilterState = {
      ...DEFAULT_FILTER_STATE,
      projects: ['proj-1', 'proj-2', 'proj-3'],
    };
    const params = serializeFilterUrl(filters);
    expect(params.get('project')).toBe('proj-1,proj-2,proj-3');
  });

  it('skips empty arrays', () => {
    const filters: FilterState = {
      ...DEFAULT_FILTER_STATE,
      projects: [],
      statuses: [],
    };
    const params = serializeFilterUrl(filters);
    expect(params.has('project')).toBe(false);
    expect(params.has('status')).toBe(false);
  });

  it('serializes all filter types', () => {
    const filters: FilterState = {
      search: 'query',
      dateRange: { preset: '30d' },
      projects: ['p1', 'p2'],
      teamMembers: ['u1'],
      statuses: ['active', 'completed'],
      priorities: ['high'],
      categories: ['Backend', 'Frontend'],
    };
    const params = serializeFilterUrl(filters);

    expect(params.get('q')).toBe('query');
    expect(params.get('datePreset')).toBe('30d');
    expect(params.get('project')).toBe('p1,p2');
    expect(params.get('teamMember')).toBe('u1');
    expect(params.get('status')).toBe('active,completed');
    expect(params.get('priority')).toBe('high');
    expect(params.get('category')).toBe('Backend,Frontend');
  });

  it('handles special characters in values', () => {
    const filters: FilterState = {
      ...DEFAULT_FILTER_STATE,
      search: 'test & search',
      categories: ['Front End', 'Back-End'],
    };
    const params = serializeFilterUrl(filters);
    expect(params.toString()).toContain('test+%26+search');
  });
});

describe('countActiveFilters', () => {
  it('returns 0 for default filter state', () => {
    const count = countActiveFilters(DEFAULT_FILTER_STATE);
    expect(count).toBe(0);
  });

  it('counts search as 1 filter', () => {
    const filters: FilterState = {
      ...DEFAULT_FILTER_STATE,
      search: 'test',
    };
    expect(countActiveFilters(filters)).toBe(1);
  });

  it('does not count empty or whitespace-only search', () => {
    const filters1: FilterState = {
      ...DEFAULT_FILTER_STATE,
      search: '',
    };
    const filters2: FilterState = {
      ...DEFAULT_FILTER_STATE,
      search: '   ',
    };
    expect(countActiveFilters(filters1)).toBe(0);
    expect(countActiveFilters(filters2)).toBe(0);
  });

  it('counts date range as 1 filter regardless of type', () => {
    const filters1: FilterState = {
      ...DEFAULT_FILTER_STATE,
      dateRange: { preset: '7d' },
    };
    const filters2: FilterState = {
      ...DEFAULT_FILTER_STATE,
      dateRange: { preset: 'custom', from: '2024-01-01', to: '2024-12-31' },
    };
    expect(countActiveFilters(filters1)).toBe(1);
    expect(countActiveFilters(filters2)).toBe(1);
  });

  it('counts each array item individually', () => {
    const filters: FilterState = {
      ...DEFAULT_FILTER_STATE,
      projects: ['p1', 'p2', 'p3'],
      statuses: ['active', 'completed'],
    };
    expect(countActiveFilters(filters)).toBe(5); // 3 projects + 2 statuses
  });

  it('does not count empty arrays', () => {
    const filters: FilterState = {
      ...DEFAULT_FILTER_STATE,
      projects: [],
      statuses: [],
      priorities: [],
    };
    expect(countActiveFilters(filters)).toBe(0);
  });

  it('counts all filter types correctly', () => {
    const filters: FilterState = {
      search: 'query', // +1
      dateRange: { preset: '30d' }, // +1
      projects: ['p1', 'p2'], // +2
      teamMembers: ['u1'], // +1
      statuses: ['active'], // +1
      priorities: ['high', 'medium'], // +2
      categories: ['Backend'], // +1
    };
    expect(countActiveFilters(filters)).toBe(9);
  });
});

describe('parseFilterUrl and serializeFilterUrl round-trip', () => {
  it('maintains data through parse -> serialize -> parse cycle', () => {
    const original: FilterState = {
      search: 'test query',
      dateRange: { preset: '30d' },
      projects: ['proj-1', 'proj-2'],
      teamMembers: ['user-1'],
      statuses: ['active', 'completed'],
      priorities: ['high'],
      categories: ['Backend', 'Frontend'],
    };

    const serialized = serializeFilterUrl(original);
    const parsed = parseFilterUrl(serialized);

    expect(parsed).toEqual(original);
  });

  it('maintains data through serialize -> parse -> serialize cycle', () => {
    const urlString = '?q=test&project=p1,p2&status=active&datePreset=7d';
    const params1 = new URLSearchParams(urlString);
    const parsed = parseFilterUrl(params1);
    const params2 = serializeFilterUrl(parsed);

    expect(params2.toString()).toBe(params1.toString());
  });
});
