import type React from 'react';

export type DateRangePreset = 'today' | '7d' | '30d' | '90d' | 'custom';

export interface DateRangeFilter {
  preset?: DateRangePreset;
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
}

export interface FilterOption {
  id: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  color?: string;
  avatar?: string;
}

export interface FilterState {
  search?: string | undefined;
  dateRange?: DateRangeFilter | undefined;
  projects: string[];
  teamMembers: string[];
  statuses: string[];
  priorities: string[];
  categories: string[];
}

export interface FilterConfig {
  projects?: FilterOption[];
  teamMembers?: FilterOption[];
  statuses?: FilterOption[];
  priorities?: FilterOption[];
  categories?: FilterOption[];
}

export type FilterType =
  'search' | 'dateRange' | 'projects' | 'teamMembers' | 'statuses' | 'priorities' | 'categories';
