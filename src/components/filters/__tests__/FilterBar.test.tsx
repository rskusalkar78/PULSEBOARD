import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FilterBar } from '../FilterBar';
import type { FilterState, FilterConfig } from '@/types/filter';

const mockConfig: FilterConfig = {
  projects: [
    { id: 'p1', label: 'Project 1' },
    { id: 'p2', label: 'Project 2' },
  ],
  teamMembers: [{ id: 'u1', label: 'User 1' }],
  statuses: [
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
  ],
  priorities: [{ id: 'high', label: 'High' }],
  categories: [{ id: 'frontend', label: 'Frontend' }],
};

const emptyFilters: FilterState = {
  search: undefined,
  dateRange: undefined,
  projects: [],
  teamMembers: [],
  statuses: [],
  priorities: [],
  categories: [],
};

describe('FilterBar component', () => {
  it('renders search input and trigger buttons', () => {
    const handleSetFilter = vi.fn();
    const handleRemoveItem = vi.fn();
    const handleClearFilters = vi.fn();

    render(
      <FilterBar
        filters={emptyFilters}
        config={mockConfig}
        activeCount={0}
        onSetFilter={handleSetFilter}
        onRemoveItem={handleRemoveItem}
        onClearFilters={handleClearFilters}
        placeholder="Search items..."
      />
    );

    expect(screen.getByPlaceholderText('Search items...')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Project/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Team Member/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Status/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Priority/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Category/i })[0]).toBeInTheDocument();
  });

  it('triggers onSetFilter when typing into search box', () => {
    const handleSetFilter = vi.fn();

    render(
      <FilterBar
        filters={emptyFilters}
        config={mockConfig}
        activeCount={0}
        onSetFilter={handleSetFilter}
        onRemoveItem={vi.fn()}
        onClearFilters={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText('Search by keyword...');
    fireEvent.change(input, { target: { value: 'pulse' } });

    expect(handleSetFilter).toHaveBeenCalledWith('search', 'pulse');
  });

  it('displays filter badges when filters are active', () => {
    const activeFilters: FilterState = {
      ...emptyFilters,
      search: 'react',
      projects: ['p1'],
    };

    render(
      <FilterBar
        filters={activeFilters}
        config={mockConfig}
        activeCount={2}
        onSetFilter={vi.fn()}
        onRemoveItem={vi.fn()}
        onClearFilters={vi.fn()}
      />
    );

    expect(screen.getByText('Search: "react"')).toBeInTheDocument();
    expect(screen.getByText('Project: Project 1')).toBeInTheDocument();
  });

  it('calls onClearFilters when Clear All button is clicked', () => {
    const handleClear = vi.fn();
    const activeFilters: FilterState = {
      ...emptyFilters,
      search: 'test',
    };

    render(
      <FilterBar
        filters={activeFilters}
        config={mockConfig}
        activeCount={1}
        onSetFilter={vi.fn()}
        onRemoveItem={vi.fn()}
        onClearFilters={handleClear}
      />
    );

    const clearBtn = screen.getByRole('button', { name: /Clear all/i });
    fireEvent.click(clearBtn);

    expect(handleClear).toHaveBeenCalledTimes(1);
  });
});
