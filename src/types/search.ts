/**
 * Search Types
 * Type definitions for the Global Command Palette Search system
 */

export type SearchCategory = 'projects' | 'tasks' | 'users' | 'activities';

export interface SearchResultItem {
  id: string;
  category: SearchCategory;
  title: string;
  subtitle?: string;
  description?: string;
  href: string;
  status?: string;
  priority?: string;
  role?: string;
  email?: string;
  timestamp?: string;
  tags?: string[];
  score?: number;
}

export type GroupedSearchResults = Record<SearchCategory, SearchResultItem[]>;

export interface RecentSearchItem {
  id: string;
  query?: string;
  item?: SearchResultItem;
  timestamp: number;
}

export interface SearchState {
  query: string;
  results: GroupedSearchResults;
  totalResults: number;
  loading: boolean;
  isOpen: boolean;
  recentSearches: RecentSearchItem[];
}
