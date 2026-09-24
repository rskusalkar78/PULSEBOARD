import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  FolderKanban,
  FileText,
  Users,
  Activity,
  Clock,
  Trash2,
  CornerDownLeft,
  Sparkles,
  LayoutDashboard,
  BarChart3,
  Settings,
  Tag,
  Clock3,
} from 'lucide-react';
import { useGlobalSearch } from '@/contexts/GlobalSearchContext';
import { searchService } from '@/services/search.service';
import { HighlightMatch } from './HighlightMatch';
import type { SearchResultItem, GroupedSearchResults, SearchCategory } from '@/types/search';
import { cn } from '@/utils/styles';

const CATEGORY_CONFIG: Record<
  SearchCategory,
  { label: string; icon: React.FC<{ className?: string }>; color: string; bgColor: string }
> = {
  projects: {
    label: 'Projects',
    icon: FolderKanban,
    color: 'text-violet-500 dark:text-violet-400',
    bgColor: 'bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300',
  },
  tasks: {
    label: 'Tasks',
    icon: FileText,
    color: 'text-blue-500 dark:text-blue-400',
    bgColor: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300',
  },
  users: {
    label: 'Team Members',
    icon: Users,
    color: 'text-emerald-500 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300',
  },
  activities: {
    label: 'Activities',
    icon: Activity,
    color: 'text-amber-500 dark:text-amber-400',
    bgColor: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300',
  },
};

const QUICK_PAGES = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, category: 'Page' },
  { title: 'Projects Overview', href: '/projects', icon: FolderKanban, category: 'Page' },
  { title: 'Tasks Kanban Board', href: '/tasks', icon: FileText, category: 'Page' },
  { title: 'Team Directory', href: '/team', icon: Users, category: 'Page' },
  { title: 'Activity Audit Log', href: '/activity', icon: Activity, category: 'Page' },
  { title: 'Analytics Metrics', href: '/analytics', icon: BarChart3, category: 'Page' },
  { title: 'Settings', href: '/settings', icon: Settings, category: 'Page' },
];

export const GlobalSearchModal: React.FC = () => {
  const navigate = useNavigate();
  const {
    isOpen,
    closeSearch,
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  } = useGlobalSearch();

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GroupedSearchResults>({
    projects: [],
    tasks: [],
    users: [],
    activities: [],
  });
  const [focusedIndex, setFocusedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Store active element on open to restore focus on close & global Escape listener
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';

      const handleGlobalKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeSearch();
        }
      };

      window.addEventListener('keydown', handleGlobalKeyDown);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);

      return () => {
        window.removeEventListener('keydown', handleGlobalKeyDown);
      };
    } else {
      document.body.style.overflow = '';
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
      setQuery('');
      setFocusedIndex(0);
    }
  }, [isOpen, closeSearch]);

  // Debounced search query execution
  useEffect(() => {
    if (!query.trim()) {
      setResults({ projects: [], tasks: [], users: [], activities: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      searchService
        .search(query, 120)
        .then((res) => {
          setResults(res);
          setFocusedIndex(0);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  // Total results count
  const totalResults = useMemo(() => {
    return (
      results.projects.length +
      results.tasks.length +
      results.users.length +
      results.activities.length
    );
  }, [results]);

  // Flatten visible item list for unified keyboard navigation
  const flattenedList = useMemo(() => {
    if (!query.trim()) {
      // Recent searches mode
      const items: Array<{
        type: 'recent' | 'quick';
        id: string;
        title: string;
        subtitle?: string;
        href: string;
        item?: SearchResultItem;
        icon?: React.ReactNode;
      }> = [];

      recentSearches.forEach((recent) => {
        items.push({
          type: 'recent',
          id: recent.id,
          title: recent.item ? recent.item.title : recent.query || '',
          subtitle: recent.item?.subtitle || recent.item?.category || 'Recent search',
          href: recent.item?.href || '/projects',
          item: recent.item,
        });
      });

      QUICK_PAGES.forEach((page) => {
        items.push({
          type: 'quick',
          id: `quick-${page.title}`,
          title: page.title,
          subtitle: page.category,
          href: page.href,
          icon: <page.icon className="h-4 w-4 text-slate-400 dark:text-slate-500" />,
        });
      });

      return items;
    }

    // Search results mode
    const list: Array<{ type: 'result'; category: SearchCategory; item: SearchResultItem }> = [];
    const categories: SearchCategory[] = ['projects', 'tasks', 'users', 'activities'];

    categories.forEach((cat) => {
      results[cat].forEach((item) => {
        list.push({ type: 'result', category: cat, item });
      });
    });

    return list;
  }, [query, results, recentSearches]);

  // Ensure focused index stays within valid bounds
  useEffect(() => {
    if (focusedIndex >= flattenedList.length) {
      setFocusedIndex(Math.max(0, flattenedList.length - 1));
    }
  }, [flattenedList.length, focusedIndex]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector(`[data-index="${focusedIndex}"]`);
      if (activeEl && typeof activeEl.scrollIntoView === 'function') {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex]);

  const handleSelect = useCallback(
    (item: SearchResultItem | { title: string; href: string }) => {
      if ('category' in item) {
        addRecentSearch(item as SearchResultItem);
        navigate(item.href);
      } else {
        addRecentSearch(item.title);
        navigate(item.href);
      }
      closeSearch();
    },
    [addRecentSearch, closeSearch, navigate]
  );

  // Keyboard navigation handler inside search modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeSearch();
      return;
    }

    if (flattenedList.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % flattenedList.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + flattenedList.length) % flattenedList.length);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setFocusedIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setFocusedIndex(flattenedList.length - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const currentEntry = flattenedList[focusedIndex];
      if (currentEntry) {
        if (currentEntry.type === 'result' && currentEntry.item) {
          handleSelect(currentEntry.item);
        } else if (currentEntry.type === 'recent') {
          if (currentEntry.item) {
            handleSelect(currentEntry.item);
          } else {
            setQuery(currentEntry.title);
          }
        } else if (currentEntry.type === 'quick') {
          handleSelect({ title: currentEntry.title, href: currentEntry.href });
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1500] flex items-start justify-center pt-12 sm:pt-20 px-4 pb-6"
      role="dialog"
      aria-modal="true"
      aria-label="Global search command palette"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-200"
        onClick={closeSearch}
        aria-hidden="true"
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh] z-10">
        {/* Search Header */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <Search className="h-5 w-5 text-slate-400 dark:text-slate-500 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-autocomplete="list"
            aria-controls="global-search-results-list"
            aria-activedescendant={
              flattenedList.length > 0 ? `search-item-${focusedIndex}` : undefined
            }
            placeholder="Search projects, tasks, team members, activities... (Cmd+K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
          />

          {loading && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-medium shrink-0 mr-2 animate-pulse">
              <div className="h-3 w-3 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
              <span>Searching...</span>
            </div>
          )}

          {query && !loading && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search input"
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors mr-2 shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <button
            type="button"
            onClick={closeSearch}
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 bg-slate-200/60 dark:bg-slate-800 px-2 py-1 rounded transition-colors hover:text-slate-700 dark:hover:text-slate-300"
          >
            ESC
          </button>
        </div>

        {/* Live Region for Screen Reader Announcements */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {query.trim()
            ? loading
              ? 'Searching for results'
              : `${totalResults} search result${totalResults === 1 ? '' : 's'} available`
            : `${recentSearches.length} recent searches available`}
        </div>

        {/* Search Content / Results */}
        <div
          ref={listRef}
          id="global-search-results-list"
          role="listbox"
          aria-label="Search results"
          className="flex-1 overflow-y-auto p-2 sm:p-3 divide-y divide-slate-100 dark:divide-slate-800/40 space-y-4"
        >
          {/* Empty Query Mode: Recent Searches & Quick Links */}
          {!query.trim() && (
            <div className="space-y-4">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-violet-500" />
                      <span>Recent Searches</span>
                    </div>
                    <button
                      type="button"
                      onClick={clearRecentSearches}
                      className="text-[11px] font-normal text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      Clear all
                    </button>
                  </div>

                  <div className="mt-1 space-y-1">
                    {recentSearches.map((recent, index) => {
                      const isFocused = focusedIndex === index;
                      const flatIdx = index;

                      return (
                        <div
                          key={recent.id}
                          id={`search-item-${flatIdx}`}
                          data-index={flatIdx}
                          role="option"
                          aria-selected={isFocused}
                          onClick={() => {
                            if (recent.item) {
                              handleSelect(recent.item);
                            } else {
                              setQuery(recent.query || '');
                            }
                          }}
                          onMouseEnter={() => setFocusedIndex(flatIdx)}
                          className={cn(
                            'group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all border border-transparent',
                            isFocused
                              ? 'bg-violet-500/10 dark:bg-violet-500/20 border-violet-500/30 text-slate-900 dark:text-white'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                          )}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 text-slate-500 dark:text-slate-400 shrink-0">
                              <Clock3 className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">
                                {recent.item ? recent.item.title : recent.query}
                              </p>
                              <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                                {recent.item?.subtitle || recent.item?.category || 'Search query'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              aria-label={`Remove ${recent.query || 'search'} from recent searches`}
                              onClick={(e) => {
                                e.stopPropagation();
                                removeRecentSearch(recent.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-rose-500 transition-all"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                            <CornerDownLeft className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quick Navigation Pages */}
              <div>
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>Quick Navigation</span>
                </div>

                <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {QUICK_PAGES.map((page) => {
                    const flatIdx = recentSearches.length + QUICK_PAGES.indexOf(page);
                    const isFocused = focusedIndex === flatIdx;

                    return (
                      <div
                        key={page.title}
                        id={`search-item-${flatIdx}`}
                        data-index={flatIdx}
                        role="option"
                        aria-selected={isFocused}
                        onClick={() => handleSelect({ title: page.title, href: page.href })}
                        onMouseEnter={() => setFocusedIndex(flatIdx)}
                        className={cn(
                          'flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all border border-transparent',
                          isFocused
                            ? 'bg-violet-500/10 dark:bg-violet-500/20 border-violet-500/30 text-slate-900 dark:text-white'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                        )}
                      >
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                          <page.icon className="h-4 w-4 text-violet-500 dark:text-violet-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{page.title}</p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500">
                            Jump to page
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Loading Skeleton State */}
          {query.trim() && loading && (
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="flex items-center gap-3 animate-pulse">
                  <div className="h-9 w-9 rounded-lg bg-slate-200 dark:bg-slate-800" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-3 w-2/3 rounded bg-slate-100 dark:bg-slate-800/60" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results State */}
          {query.trim() && !loading && totalResults === 0 && (
            <div className="py-12 px-4 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mb-3">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                No results found for &quot;{query}&quot;
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                We couldn&apos;t find any matching projects, tasks, team members, or activities.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                <span>Try searching by:</span>
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                  Project title
                </span>
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                  Task name
                </span>
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                  Member email
                </span>
              </div>
            </div>
          )}

          {/* Grouped Search Results */}
          {query.trim() && !loading && totalResults > 0 && (
            <div className="space-y-4 pt-1">
              {(['projects', 'tasks', 'users', 'activities'] as SearchCategory[]).map(
                (category) => {
                  const categoryItems = results[category];
                  if (categoryItems.length === 0) return null;

                  const config = CATEGORY_CONFIG[category];
                  const CategoryIcon = config.icon;

                  return (
                    <div key={category} className="space-y-1">
                      {/* Group Header */}
                      <div className="flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <CategoryIcon className={cn('h-4 w-4', config.color)} />
                          <span>{config.label}</span>
                        </div>
                        <span className="text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
                          {categoryItems.length}
                        </span>
                      </div>

                      {/* Items List */}
                      <div className="space-y-1">
                        {categoryItems.map((item) => {
                          const flatIdx = flattenedList.findIndex(
                            (f) => f.type === 'result' && f.item.id === item.id
                          );
                          const isFocused = focusedIndex === flatIdx;

                          return (
                            <div
                              key={item.id}
                              id={`search-item-${flatIdx}`}
                              data-index={flatIdx}
                              role="option"
                              aria-selected={isFocused}
                              onClick={() => handleSelect(item)}
                              onMouseEnter={() => setFocusedIndex(flatIdx)}
                              className={cn(
                                'group flex items-start justify-between p-3 rounded-xl cursor-pointer transition-all border border-transparent',
                                isFocused
                                  ? 'bg-violet-500/10 dark:bg-violet-500/20 border-violet-500/30 text-slate-900 dark:text-white shadow-xs'
                                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                              )}
                            >
                              <div className="flex items-start gap-3 min-w-0 flex-1">
                                <div
                                  className={cn(
                                    'p-2 rounded-lg shrink-0 mt-0.5 transition-colors',
                                    config.bgColor
                                  )}
                                >
                                  <CategoryIcon className="h-4 w-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="text-sm font-semibold truncate">
                                      <HighlightMatch text={item.title} query={query} />
                                    </h4>

                                    {/* Item Badges */}
                                    {item.status && (
                                      <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded shrink-0">
                                        {item.status.replace('_', ' ')}
                                      </span>
                                    )}

                                    {item.priority && (
                                      <span
                                        className={cn(
                                          'text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0',
                                          item.priority === 'urgent'
                                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                            : item.priority === 'high'
                                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                        )}
                                      >
                                        {item.priority}
                                      </span>
                                    )}
                                  </div>

                                  {item.subtitle && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                                      <HighlightMatch text={item.subtitle} query={query} />
                                    </p>
                                  )}

                                  {item.description && (
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 line-clamp-1">
                                      <HighlightMatch text={item.description} query={query} />
                                    </p>
                                  )}

                                  {/* Tags / Metadata */}
                                  {item.tags && item.tags.length > 0 && (
                                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                      {item.tags.map((tag) => (
                                        <span
                                          key={tag}
                                          className="inline-flex items-center gap-1 text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-md"
                                        >
                                          <Tag className="h-2.5 w-2.5" />
                                          <HighlightMatch text={tag} query={query} />
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 ml-3 self-center">
                                <CornerDownLeft className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/80 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs font-sans text-[10px]">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs font-sans text-[10px]">
                ↓
              </kbd>
              <span className="ml-0.5">to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs font-sans text-[10px]">
                ↵
              </kbd>
              <span className="ml-0.5">to select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs font-sans text-[10px]">
                esc
              </kbd>
              <span className="ml-0.5">to close</span>
            </span>
          </div>

          <div className="hidden sm:block text-[11px] text-slate-400 dark:text-slate-500">
            Global Search
          </div>
        </div>
      </div>
    </div>
  );
};
