/**
 * Global Search Service
 * Aggregates searchable data across Projects, Tasks, Users, and Activities
 */

import type { SearchResultItem, GroupedSearchResults } from '@/types/search';
import { fuzzyGroupSearch } from '@/utils/fuzzySearch';

// Default static items ensuring instant, rich search results across all 4 categories
const DEFAULT_SEARCHABLE_ITEMS: SearchResultItem[] = [
  // PROJECTS
  {
    id: 'proj-1',
    category: 'projects',
    title: 'PulseBoard Redesign',
    subtitle: 'Core App UI Modernization',
    description: 'Redesigning the main dashboard and task management interface with modern tokens.',
    href: '/projects',
    status: 'active',
    priority: 'high',
    tags: ['UI', 'React', 'Design System'],
  },
  {
    id: 'proj-2',
    category: 'projects',
    title: 'Analytics Pipeline',
    subtitle: 'Real-time Event Ingestion',
    description: 'Building event streaming pipeline for user activity and performance metrics.',
    href: '/projects',
    status: 'active',
    priority: 'high',
    tags: ['Data', 'Analytics', 'Backend'],
  },
  {
    id: 'proj-3',
    category: 'projects',
    title: 'Mobile App Support',
    subtitle: 'iOS & Android Native App',
    description: 'Cross-platform mobile client for team members on the go.',
    href: '/projects',
    status: 'active',
    priority: 'urgent',
    tags: ['Mobile', 'React Native', 'iOS', 'Android'],
  },
  {
    id: 'proj-4',
    category: 'projects',
    title: 'Backend API Redesign',
    subtitle: 'GraphQL & REST V2 Services',
    description: 'Refactoring REST endpoints and migrating core services to microservices.',
    href: '/projects',
    status: 'planning',
    priority: 'high',
    tags: ['API', 'Backend', 'Node.js'],
  },
  {
    id: 'proj-5',
    category: 'projects',
    title: 'Security Audit & Compliance',
    subtitle: 'SOC2 Type II & OAuth2 Hardening',
    description: 'Penetration testing, encryption at rest, and access control audit.',
    href: '/projects',
    status: 'in_progress',
    priority: 'urgent',
    tags: ['Security', 'Compliance', 'Audit'],
  },
  {
    id: 'proj-6',
    category: 'projects',
    title: 'Documentation Portal',
    subtitle: 'Developer Knowledge Base',
    description: 'Interactive API reference, component showcase, and onboarding guides.',
    href: '/projects',
    status: 'completed',
    priority: 'medium',
    tags: ['Docs', 'DX', 'Knowledge Base'],
  },

  // TASKS
  {
    id: 'tsk-101',
    category: 'tasks',
    title: 'Database Schema Audit & Migration',
    subtitle: 'PulseBoard Redesign • High Priority',
    description: 'Review index optimizations and foreign key constraints across Postgres tables.',
    href: '/tasks',
    status: 'in_progress',
    priority: 'high',
    tags: ['Database', 'Postgres', 'Backend'],
  },
  {
    id: 'tsk-102',
    category: 'tasks',
    title: 'Design System Tokens Migration',
    subtitle: 'PulseBoard Redesign • Completed',
    description: 'Migrated color palette and typography scales to CSS custom properties.',
    href: '/tasks',
    status: 'completed',
    priority: 'high',
    tags: ['Design System', 'CSS', 'UI'],
  },
  {
    id: 'tsk-103',
    category: 'tasks',
    title: 'Fix Auth Token Expiration Refresh',
    subtitle: 'Security Audit • Urgent',
    description: 'Handle silent session refresh failure on background tab activation.',
    href: '/tasks',
    status: 'in_progress',
    priority: 'urgent',
    tags: ['Auth', 'Security', 'Bug'],
  },
  {
    id: 'tsk-104',
    category: 'tasks',
    title: 'API Rate Limiting Middleware',
    subtitle: 'Backend API Redesign • Medium Priority',
    description: 'Implement sliding window algorithm for API request rate limiting per IP.',
    href: '/tasks',
    status: 'in_review',
    priority: 'medium',
    tags: ['API', 'Middleware', 'Performance'],
  },
  {
    id: 'tsk-105',
    category: 'tasks',
    title: 'Performance Testing Suite',
    subtitle: 'Analytics Pipeline • Completed',
    description: 'Added load testing scripts using k6 and Lighthouse performance benchmarks.',
    href: '/tasks',
    status: 'completed',
    priority: 'high',
    tags: ['Testing', 'Performance', 'QA'],
  },
  {
    id: 'tsk-106',
    category: 'tasks',
    title: 'User Profile & Settings Layout Redesign',
    subtitle: 'PulseBoard Redesign • Low Priority',
    description: 'Redesign user account settings, notification preferences, and avatar editor.',
    href: '/tasks',
    status: 'todo',
    priority: 'low',
    tags: ['Profile', 'UI', 'Settings'],
  },
  {
    id: 'tsk-107',
    category: 'tasks',
    title: 'Export CSV & PDF Reports for Analytics',
    subtitle: 'Analytics Pipeline • Medium Priority',
    description: 'Allow team leads to download weekly velocity and task completion reports.',
    href: '/tasks',
    status: 'todo',
    priority: 'medium',
    tags: ['Analytics', 'Export', 'Reports'],
  },

  // USERS
  {
    id: 'usr-1',
    category: 'users',
    title: 'Sarah Chen',
    subtitle: 'Project Manager',
    description: 'Leading workspace planning, sprint ceremonies, and release timelines.',
    href: '/team',
    email: 'sarah.chen@pulseboard.dev',
    role: 'Admin / Project Manager',
    tags: ['Management', 'Sprint Lead'],
  },
  {
    id: 'usr-2',
    category: 'users',
    title: 'Michael Rodriguez',
    subtitle: 'Lead Developer',
    description: 'Full-stack engineering, system design, and frontend architecture.',
    href: '/team',
    email: 'michael.rodriguez@pulseboard.dev',
    role: 'Lead Developer',
    tags: ['Engineering', 'React', 'Node.js'],
  },
  {
    id: 'usr-3',
    category: 'users',
    title: 'Emily Watson',
    subtitle: 'UI/UX Designer',
    description: 'Creating design system, user research, wireframes, and interactive prototypes.',
    href: '/team',
    email: 'emily.watson@pulseboard.dev',
    role: 'UI/UX Designer',
    tags: ['Design', 'Figma', 'UI/UX'],
  },
  {
    id: 'usr-4',
    category: 'users',
    title: 'James Park',
    subtitle: 'QA Engineer',
    description: 'Automated testing, end-to-end integration test suites, and quality assurance.',
    href: '/team',
    email: 'james.park@pulseboard.dev',
    role: 'QA Engineer',
    tags: ['QA', 'Playwright', 'Vitest'],
  },
  {
    id: 'usr-5',
    category: 'users',
    title: 'Priya Patel',
    subtitle: 'Product Lead',
    description:
      'Product strategy, customer feedback analysis, and feature roadmap prioritization.',
    href: '/team',
    email: 'priya.patel@pulseboard.dev',
    role: 'Product Lead',
    tags: ['Product', 'Strategy', 'Roadmap'],
  },
  {
    id: 'usr-6',
    category: 'users',
    title: 'David Kim',
    subtitle: 'Backend Developer',
    description: 'Postgres database architecture, Supabase integration, and cloud backend.',
    href: '/team',
    email: 'david.kim@pulseboard.dev',
    role: 'Backend Developer',
    tags: ['Backend', 'Postgres', 'Supabase'],
  },
  {
    id: 'usr-7',
    category: 'users',
    title: 'Alex Morgan',
    subtitle: 'Lead Architect',
    description: 'Infrastructure architecture, DevOps pipelines, and security standards.',
    href: '/team',
    email: 'alex.morgan@pulseboard.dev',
    role: 'Admin / Lead Architect',
    tags: ['Architect', 'DevOps', 'Security'],
  },

  // ACTIVITIES
  {
    id: 'act-1',
    category: 'activities',
    title: 'Completed Design System Documentation',
    subtitle: 'Task Completed by Sarah Chen • 2 hours ago',
    description: 'Sarah completed comprehensive design system documentation for UI components.',
    href: '/activity',
    timestamp: '2 hours ago',
    tags: ['task_completed', 'Design System'],
  },
  {
    id: 'act-2',
    category: 'activities',
    title: 'Initiated Mobile App MVP Project',
    subtitle: 'Project Created by Michael Rodriguez • 5 hours ago',
    description: 'Michael created a new project for the cross-platform mobile application.',
    href: '/activity',
    timestamp: '5 hours ago',
    tags: ['project_created', 'Mobile App'],
  },
  {
    id: 'act-3',
    category: 'activities',
    title: 'Finished Performance Testing Suite',
    subtitle: 'Task Completed by James Park • 8 hours ago',
    description: 'James finished the comprehensive performance testing suite and benchmarks.',
    href: '/activity',
    timestamp: '8 hours ago',
    tags: ['task_completed', 'QA', 'Performance'],
  },
  {
    id: 'act-4',
    category: 'activities',
    title: 'New Design Review Comments Added',
    subtitle: 'Comment Added by Emily Watson • 12 hours ago',
    description: 'Emily provided feedback on the latest dashboard and navigation mockups.',
    href: '/activity',
    timestamp: '12 hours ago',
    tags: ['comment_added', 'Design'],
  },
  {
    id: 'act-5',
    category: 'activities',
    title: 'API Integration Layer Refactored',
    subtitle: 'Project Updated by David Kim • 1 day ago',
    description: 'David refactored the API integration layer for better maintainability.',
    href: '/activity',
    timestamp: '1 day ago',
    tags: ['project_updated', 'API'],
  },
  {
    id: 'act-6',
    category: 'activities',
    title: 'Priya Joined PulseBoard Team',
    subtitle: 'Team Member Joined • 2 days ago',
    description: 'Priya Patel has been added as Product Lead to the organization.',
    href: '/activity',
    timestamp: '2 days ago',
    tags: ['team_member_joined', 'Team'],
  },
];

export class SearchService {
  private customItems: SearchResultItem[] = [];

  /**
   * Register dynamic items from live context/state
   */
  public registerItems(items: SearchResultItem[]): void {
    this.customItems = items;
  }

  /**
   * Get all searchable items
   */
  public getAllSearchableItems(): SearchResultItem[] {
    if (this.customItems.length > 0) {
      // Merge unique by ID
      const itemMap = new Map<string, SearchResultItem>();
      DEFAULT_SEARCHABLE_ITEMS.forEach((i) => itemMap.set(i.id, i));
      this.customItems.forEach((i) => itemMap.set(i.id, i));
      return Array.from(itemMap.values());
    }
    return DEFAULT_SEARCHABLE_ITEMS;
  }

  /**
   * Perform asynchronous fuzzy search with simulated debounce latency
   */
  public async search(query: string, delayMs = 150): Promise<GroupedSearchResults> {
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    const items = this.getAllSearchableItems();
    return fuzzyGroupSearch(items, query);
  }
}

export const searchService = new SearchService();
