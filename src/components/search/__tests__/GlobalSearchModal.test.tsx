import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { GlobalSearchProvider, useGlobalSearch } from '@/contexts/GlobalSearchContext';
import { GlobalSearchModal } from '../GlobalSearchModal';
import { fuzzyGroupSearch, calculateFuzzyScore, getHighlightSegments } from '@/utils/fuzzySearch';
import { searchService } from '@/services/search.service';

const TestComponent = () => {
  const { openSearch } = useGlobalSearch();
  return (
    <div>
      <button onClick={openSearch}>Open Search Trigger</button>
      <GlobalSearchModal />
    </div>
  );
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <GlobalSearchProvider>{ui}</GlobalSearchProvider>
    </BrowserRouter>
  );
};

describe('Fuzzy Search Utility', () => {
  it('calculates fuzzy score correctly', () => {
    expect(calculateFuzzyScore('pulseboard', 'PulseBoard Redesign')).toBeGreaterThan(80);
    expect(calculateFuzzyScore('sarah', 'Sarah Chen')).toBeGreaterThan(80);
    expect(calculateFuzzyScore('nonexistentquery123', 'PulseBoard')).toBe(0);
  });

  it('groups search results by category', () => {
    const items = searchService.getAllSearchableItems();
    const result = fuzzyGroupSearch(items, 'design');

    expect(result).toHaveProperty('projects');
    expect(result).toHaveProperty('tasks');
    expect(result).toHaveProperty('users');
    expect(result).toHaveProperty('activities');

    const total =
      result.projects.length + result.tasks.length + result.users.length + result.activities.length;
    expect(total).toBeGreaterThan(0);
  });

  it('segments text for match highlighting', () => {
    const segments = getHighlightSegments('PulseBoard Redesign', 'pulse');
    expect(segments.length).toBeGreaterThan(1);
    expect(segments[0]!.isMatch).toBe(true);
    expect(segments[0]!.text.toLowerCase()).toBe('pulse');
  });
});

describe('GlobalSearchModal Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('opens and closes via shortcut Cmd+K or Ctrl+K', async () => {
    renderWithProviders(<TestComponent />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Trigger Cmd+K
    fireEvent.keyDown(window, { key: 'k', metaKey: true });

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Close via Escape
    fireEvent.keyDown(window, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('renders recent searches when query is empty', async () => {
    renderWithProviders(<TestComponent />);

    fireEvent.click(screen.getByText('Open Search Trigger'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    expect(screen.getByText('Recent Searches')).toBeInTheDocument();
    expect(screen.getByText('Quick Navigation')).toBeInTheDocument();
  });

  it('performs fuzzy search across projects, tasks, users, and activities', async () => {
    renderWithProviders(<TestComponent />);

    fireEvent.click(screen.getByText('Open Search Trigger'));

    const input = screen.getByPlaceholderText(/Search projects, tasks/i);
    fireEvent.change(input, { target: { value: 'Sarah' } });

    await waitFor(() => {
      const elements = screen.getAllByText(
        (_, element) => element?.textContent?.includes('Sarah Chen') ?? false
      );
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it('navigates search items using arrow keys', async () => {
    renderWithProviders(<TestComponent />);

    fireEvent.click(screen.getByText('Open Search Trigger'));

    const input = screen.getByPlaceholderText(/Search projects, tasks/i);

    // Press ArrowDown
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    const options = screen.getAllByRole('option');
    expect(options.length).toBeGreaterThan(0);
  });

  it('displays no results state for non-matching queries', async () => {
    renderWithProviders(<TestComponent />);

    fireEvent.click(screen.getByText('Open Search Trigger'));

    const input = screen.getByPlaceholderText(/Search projects, tasks/i);
    fireEvent.change(input, { target: { value: 'xyzunmatchedquery999' } });

    await waitFor(() => {
      expect(screen.getByText(/No results found for/i)).toBeInTheDocument();
    });
  });

  it('has correct accessibility role and attributes', async () => {
    renderWithProviders(<TestComponent />);

    fireEvent.click(screen.getByText('Open Search Trigger'));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-label', 'Global search command palette');

    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
    expect(input).toHaveAttribute('aria-expanded', 'true');
  });
});
