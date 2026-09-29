/**
 * Fuzzy Search Utility Tests
 */

import { describe, it, expect } from 'vitest';
import {
  calculateFuzzyScore,
  scoreSearchItem,
  fuzzyGroupSearch,
  getHighlightSegments,
} from '../fuzzySearch';
import type { SearchResultItem } from '@/types/search';

describe('calculateFuzzyScore', () => {
  it('returns 0 for empty query or target', () => {
    expect(calculateFuzzyScore('', 'target')).toBe(0);
    expect(calculateFuzzyScore('query', '')).toBe(0);
    expect(calculateFuzzyScore('', '')).toBe(0);
  });

  it('returns 100 for exact match', () => {
    expect(calculateFuzzyScore('hello', 'hello')).toBe(100);
    expect(calculateFuzzyScore('HELLO', 'hello')).toBe(100); // case insensitive
  });

  it('returns 90 for startsWith match', () => {
    expect(calculateFuzzyScore('hel', 'hello')).toBe(90);
    expect(calculateFuzzyScore('test', 'testing')).toBe(90);
  });

  it('returns 85 for word boundary match', () => {
    expect(calculateFuzzyScore('world', 'hello-world')).toBe(85);
    expect(calculateFuzzyScore('bar', 'foo_bar_baz')).toBe(85);
  });

  it('returns 55-75 for substring match with position penalty', () => {
    const score = calculateFuzzyScore('llo', 'hello');
    expect(score).toBeGreaterThanOrEqual(55);
    expect(score).toBeLessThanOrEqual(75);
  });

  it('returns 70 for multi-word full match', () => {
    expect(calculateFuzzyScore('foo bar', 'this contains foo and bar')).toBe(70);
  });

  it('returns partial score for multi-word partial match', () => {
    const score = calculateFuzzyScore('foo bar baz', 'this has foo and bar only');
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(70);
  });

  it('returns score for fuzzy character sequence', () => {
    const score = calculateFuzzyScore('fzsr', 'fuzzy search');
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(65);
  });

  it('returns 0 for no match', () => {
    expect(calculateFuzzyScore('xyz', 'abc')).toBe(0);
    expect(calculateFuzzyScore('test', 'sample')).toBe(0);
  });

  it('handles special characters and spaces', () => {
    expect(calculateFuzzyScore('hello world', 'hello world')).toBe(100);
    expect(calculateFuzzyScore('test-case', 'test-case')).toBe(100);
  });
});

describe('scoreSearchItem', () => {
  const createTestItem = (overrides?: Partial<SearchResultItem>): SearchResultItem => ({
    id: 'test-1',
    title: 'Test Project',
    subtitle: 'Project subtitle',
    description: 'A test project description',
    category: 'projects',
    icon: 'folder',
    url: '/projects/test-1',
    ...overrides,
  });

  it('returns 0 for empty query', () => {
    const item = createTestItem();
    expect(scoreSearchItem(item, '')).toBe(0);
    expect(scoreSearchItem(item, '   ')).toBe(0);
  });

  it('scores title matches with highest weight (3.0x)', () => {
    const item = createTestItem({ title: 'Dashboard Project' });
    const titleScore = scoreSearchItem(item, 'dashboard');

    const itemNoTitle = createTestItem({ title: 'Other', description: 'Dashboard description' });
    const descScore = scoreSearchItem(itemNoTitle, 'dashboard');

    expect(titleScore).toBeGreaterThan(descScore);
  });

  it('scores subtitle matches with 1.8x weight', () => {
    const item = createTestItem({ subtitle: 'Analytics Module' });
    const score = scoreSearchItem(item, 'analytics');
    expect(score).toBeGreaterThan(0);
  });

  it('scores email matches with 2.0x weight', () => {
    const item = createTestItem({
      category: 'users',
      email: 'john.doe@example.com',
    });
    const score = scoreSearchItem(item, 'john.doe');
    expect(score).toBeGreaterThan(0);
  });

  it('scores tag matches with 2.2x weight', () => {
    const item = createTestItem({ tags: ['backend', 'api', 'typescript'] });
    const score = scoreSearchItem(item, 'backend');
    expect(score).toBeGreaterThan(0);
  });

  it('returns the maximum score across all fields', () => {
    const item = createTestItem({
      title: 'Other Title',
      subtitle: 'Test Subtitle',
      description: 'Something else',
      tags: ['production', 'test', 'staging'],
    });
    const score = scoreSearchItem(item, 'test');
    expect(score).toBeGreaterThan(0);
  });

  it('handles items without optional fields', () => {
    const minimalItem = createTestItem({
      subtitle: undefined,
      description: undefined,
      email: undefined,
      role: undefined,
      tags: undefined,
    });
    const score = scoreSearchItem(minimalItem, 'test');
    expect(score).toBeGreaterThan(0); // Should still match title
  });
});

describe('fuzzyGroupSearch', () => {
  const createTestItems = (): SearchResultItem[] => [
    {
      id: 'proj-1',
      title: 'Dashboard Project',
      category: 'projects',
      icon: 'folder',
      url: '/projects/proj-1',
    },
    {
      id: 'task-1',
      title: 'Dashboard Design',
      category: 'tasks',
      icon: 'check',
      url: '/tasks/task-1',
    },
    {
      id: 'user-1',
      title: 'John Dashboard',
      category: 'users',
      icon: 'user',
      url: '/users/user-1',
      email: 'john@example.com',
    },
    {
      id: 'proj-2',
      title: 'API Integration',
      category: 'projects',
      icon: 'folder',
      url: '/projects/proj-2',
    },
    {
      id: 'task-2',
      title: 'Low score task',
      category: 'tasks',
      icon: 'check',
      url: '/tasks/task-2',
    },
  ];

  it('returns empty groups for empty query', () => {
    const items = createTestItems();
    const result = fuzzyGroupSearch(items, '');

    expect(result.projects).toHaveLength(0);
    expect(result.tasks).toHaveLength(0);
    expect(result.users).toHaveLength(0);
    expect(result.activities).toHaveLength(0);
  });

  it('groups results by category', () => {
    const items = createTestItems();
    const result = fuzzyGroupSearch(items, 'dashboard');

    expect(result.projects.length).toBeGreaterThan(0);
    expect(result.tasks.length).toBeGreaterThan(0);
    expect(result.users.length).toBeGreaterThan(0);

    expect(result.projects[0].category).toBe('projects');
    expect(result.tasks[0].category).toBe('tasks');
  });

  it('filters by minimum score threshold', () => {
    const items = createTestItems();
    const resultLowThreshold = fuzzyGroupSearch(items, 'dashboard', 10);
    const resultHighThreshold = fuzzyGroupSearch(items, 'dashboard', 80);

    const totalLow =
      resultLowThreshold.projects.length +
      resultLowThreshold.tasks.length +
      resultLowThreshold.users.length;

    const totalHigh =
      resultHighThreshold.projects.length +
      resultHighThreshold.tasks.length +
      resultHighThreshold.users.length;

    expect(totalLow).toBeGreaterThanOrEqual(totalHigh);
  });

  it('sorts results by score in descending order', () => {
    const items = createTestItems();
    const result = fuzzyGroupSearch(items, 'dashboard');

    const allScores = [
      ...result.projects,
      ...result.tasks,
      ...result.users,
      ...result.activities,
    ].map((item) => item.score || 0);

    for (let i = 0; i < allScores.length - 1; i++) {
      expect(allScores[i]).toBeGreaterThanOrEqual(allScores[i + 1]);
    }
  });

  it('excludes items below minimum score', () => {
    const items = createTestItems();
    const result = fuzzyGroupSearch(items, 'xyz-nomatch', 15);

    expect(result.projects).toHaveLength(0);
    expect(result.tasks).toHaveLength(0);
    expect(result.users).toHaveLength(0);
    expect(result.activities).toHaveLength(0);
  });
});

describe('getHighlightSegments', () => {
  it('returns single non-match segment for empty query', () => {
    const segments = getHighlightSegments('hello world', '');
    expect(segments).toHaveLength(1);
    expect(segments[0]).toEqual({ text: 'hello world', isMatch: false });
  });

  it('returns single non-match segment for no match', () => {
    const segments = getHighlightSegments('hello world', 'xyz');
    expect(segments).toHaveLength(1);
    expect(segments[0]).toEqual({ text: 'hello world', isMatch: false });
  });

  it('highlights exact match', () => {
    const segments = getHighlightSegments('hello world', 'world');
    expect(segments).toHaveLength(2);
    expect(segments[0]).toEqual({ text: 'hello ', isMatch: false });
    expect(segments[1]).toEqual({ text: 'world', isMatch: true });
  });

  it('highlights match at start', () => {
    const segments = getHighlightSegments('hello world', 'hello');
    expect(segments).toHaveLength(2);
    expect(segments[0]).toEqual({ text: 'hello', isMatch: true });
    expect(segments[1]).toEqual({ text: ' world', isMatch: false });
  });

  it('highlights multiple matches', () => {
    const segments = getHighlightSegments('test test test', 'test');
    const matchCount = segments.filter((s) => s.isMatch).length;
    expect(matchCount).toBeGreaterThan(1);
  });

  it('highlights query with multiple tokens', () => {
    const segments = getHighlightSegments('react hooks testing library', 'react library');
    const matchedTexts = segments.filter((s) => s.isMatch).map((s) => s.text.toLowerCase());
    expect(matchedTexts).toContain('react');
    expect(matchedTexts).toContain('library');
  });

  it('is case insensitive', () => {
    const segments = getHighlightSegments('Hello World', 'hello');
    const matchSegment = segments.find((s) => s.isMatch);
    expect(matchSegment?.text).toBe('Hello');
  });

  it('merges overlapping ranges', () => {
    const segments = getHighlightSegments('aaa', 'aa');
    const text = segments.map((s) => s.text).join('');
    expect(text).toBe('aaa');
  });

  it('handles empty text', () => {
    const segments = getHighlightSegments('', 'query');
    expect(segments).toHaveLength(0);
  });

  it('preserves full text when combined', () => {
    const originalText = 'This is a test string for highlighting';
    const segments = getHighlightSegments(originalText, 'test');
    const combined = segments.map((s) => s.text).join('');
    expect(combined).toBe(originalText);
  });
});
