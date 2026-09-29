/**
 * Test Data Factories
 * Factory functions for creating mock data objects for tests
 */

import type { User, AuthSession } from '@/types/auth';
import type { Project, Task, Notification, Profile, Team } from '@/types';

/**
 * User Factory
 */
export const createMockUser = (overrides?: Partial<User>): User => ({
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  role: 'Developer',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TestUser',
  bio: 'Test user bio',
  timezone: 'America/New_York',
  emailConfirmedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  ...overrides,
});

/**
 * Auth Session Factory
 */
export const createMockSession = (userOverrides?: Partial<User>): AuthSession => ({
  accessToken: 'mock-access-token-123',
  refreshToken: 'mock-refresh-token-456',
  user: createMockUser(userOverrides),
});

/**
 * Profile Factory
 */
export const createMockProfile = (overrides?: Partial<Profile>): Profile => ({
  id: 'profile-123',
  user_id: 'user-123',
  full_name: 'Test User',
  email: 'test@example.com',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TestUser',
  bio: 'Test user bio',
  timezone: 'America/New_York',
  preferences: {
    theme: 'light',
    notifications_enabled: true,
    email_notifications: true,
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

/**
 * Team Factory
 */
export const createMockTeam = (overrides?: Partial<Team>): Team => ({
  id: 'team-123',
  name: 'Test Team',
  description: 'A test team for testing purposes',
  avatar_url: 'https://api.dicebear.com/7.x/identicon/svg?seed=TestTeam',
  owner_id: 'user-123',
  settings: {
    allow_public_projects: false,
    default_project_visibility: 'private',
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

/**
 * Project Factory
 */
export const createMockProject = (overrides?: Partial<Project>): Project => ({
  id: 'proj-123',
  name: 'Test Project',
  description: 'A test project for testing purposes',
  status: 'active',
  priority: 'high',
  visibility: 'private',
  start_date: new Date('2024-01-01').toISOString(),
  end_date: new Date('2024-12-31').toISOString(),
  team_id: 'team-123',
  owner_id: 'user-123',
  settings: {},
  tags: ['testing', 'development'],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

/**
 * Task Factory
 */
export const createMockTask = (overrides?: Partial<Task>): Task => ({
  id: 'task-123',
  title: 'Test Task',
  description: 'A test task for testing purposes',
  status: 'todo',
  priority: 'medium',
  project_id: 'proj-123',
  assignee_id: 'user-123',
  creator_id: 'user-123',
  due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  tags: ['backend', 'api'],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

/**
 * Notification Factory
 */
export const createMockNotification = (overrides?: Partial<Notification>): Notification => ({
  id: 'notif-123',
  user_id: 'user-123',
  type: 'task_assigned',
  entity_type: 'task',
  entity_id: 'task-123',
  title: 'Task Assigned',
  message: 'You have been assigned a new task',
  read_at: null,
  action_url: '/tasks/task-123',
  metadata: {},
  created_at: new Date().toISOString(),
  ...overrides,
});

/**
 * Create multiple items with factory
 */
export const createMockItems = <T>(
  factory: (overrides?: Partial<T>) => T,
  count: number,
  overridesArray?: Array<Partial<T>>
): T[] => {
  return Array.from({ length: count }, (_, index) => {
    const overrides = overridesArray?.[index] || {};
    return factory({
      ...overrides,
      id: `${(overrides as Record<string, unknown>)?.id || 'item'}-${index + 1}`,
    } as Partial<T>);
  });
};

/**
 * Project with Relations Factory
 */
export const createMockProjectWithRelations = (overrides?: Record<string, unknown>) => ({
  ...createMockProject(overrides),
  team: createMockTeam(),
  owner: createMockProfile(),
  task_count: 10,
  completed_tasks: 5,
  members_count: 3,
});

/**
 * Task with Relations Factory
 */
export const createMockTaskWithRelations = (overrides?: Record<string, unknown>) => ({
  ...createMockTask(overrides),
  project: createMockProject(),
  assignee: createMockProfile(),
  creator: createMockProfile({ id: 'creator-456', full_name: 'Creator User' }),
});

/**
 * Notification with Relations Factory
 */
export const createMockNotificationWithRelations = (overrides?: Record<string, unknown>) => ({
  ...createMockNotification(overrides),
  actor: createMockProfile({ id: 'actor-789', full_name: 'Actor User' }),
});
