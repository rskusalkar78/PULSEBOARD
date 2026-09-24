import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { SearchResultItem, RecentSearchItem } from '@/types/search';

const STORAGE_KEY = 'pulseboard_recent_searches_v1';
const MAX_RECENT_ITEMS = 8;

export interface GlobalSearchContextType {
  isOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  recentSearches: RecentSearchItem[];
  addRecentSearch: (search: SearchResultItem | string) => void;
  removeRecentSearch: (id: string) => void;
  clearRecentSearches: () => void;
}

const GlobalSearchContext = createContext<GlobalSearchContextType | undefined>(undefined);

export const GlobalSearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load recent searches from localStorage:', e);
    }
    // Default initial recent searches
    return [
      {
        id: 'recent-1',
        query: 'PulseBoard Redesign',
        item: {
          id: 'proj-1',
          category: 'projects',
          title: 'PulseBoard Redesign',
          subtitle: 'Core App UI Modernization',
          href: '/projects',
          status: 'active',
          priority: 'high',
        },
        timestamp: Date.now() - 1000 * 60 * 30,
      },
      {
        id: 'recent-2',
        query: 'Sarah Chen',
        item: {
          id: 'usr-1',
          category: 'users',
          title: 'Sarah Chen',
          subtitle: 'Project Manager',
          href: '/team',
          email: 'sarah.chen@pulseboard.dev',
        },
        timestamp: Date.now() - 1000 * 60 * 120,
      },
    ];
  });

  // Save to localStorage when recentSearches updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSearches));
    } catch (e) {
      console.error('Failed to save recent searches to localStorage:', e);
    }
  }, [recentSearches]);

  const openSearch = useCallback(() => setIsOpen(true), []);
  const closeSearch = useCallback(() => setIsOpen(false), []);
  const toggleSearch = useCallback(() => setIsOpen((prev) => !prev), []);

  const addRecentSearch = useCallback((search: SearchResultItem | string) => {
    setRecentSearches((prev) => {
      let newItem: RecentSearchItem;
      if (typeof search === 'string') {
        const queryText = search.trim();
        if (!queryText) return prev;
        newItem = {
          id: `recent-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          query: queryText,
          timestamp: Date.now(),
        };
      } else {
        newItem = {
          id: `recent-${search.id}`,
          query: search.title,
          item: search,
          timestamp: Date.now(),
        };
      }

      // Filter out duplicate by query or item id
      const filtered = prev.filter((r) => {
        if (typeof search === 'string') {
          return r.query?.toLowerCase() !== search.toLowerCase();
        } else {
          return r.item?.id !== search.id && r.query?.toLowerCase() !== search.title.toLowerCase();
        }
      });

      return [newItem, ...filtered].slice(0, MAX_RECENT_ITEMS);
    });
  }, []);

  const removeRecentSearch = useCallback((id: string) => {
    setRecentSearches((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, []);

  // Global keyboard shortcut: Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <GlobalSearchContext.Provider
      value={{
        isOpen,
        openSearch,
        closeSearch,
        toggleSearch,
        recentSearches,
        addRecentSearch,
        removeRecentSearch,
        clearRecentSearches,
      }}
    >
      {children}
    </GlobalSearchContext.Provider>
  );
};

export const useGlobalSearch = (): GlobalSearchContextType => {
  const context = useContext(GlobalSearchContext);
  if (!context) {
    throw new Error('useGlobalSearch must be used within a GlobalSearchProvider');
  }
  return context;
};
