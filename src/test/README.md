# Test Utilities

This directory contains shared testing utilities, mock factories, and test helpers used across the PulseBoard test suite.

## Structure

```
test/
├── setup.ts          # Global test configuration
├── factories.ts      # Mock data factories
├── render.tsx        # Custom render utilities with providers
├── index.ts         # Central exports
└── mocks/
    ├── supabase.ts  # Supabase client mocks
    └── handlers.ts  # MSW request handlers
```

## Usage

### Mock Factories

Create realistic test data with factory functions:

```typescript
import {
  createMockUser,
  createMockProject,
  createMockTask,
  createMockNotification,
  createMockItems,
} from '@/test';

// Single item
const user = createMockUser({ email: 'test@example.com' });

// Multiple items
const projects = createMockItems(createMockProject, 5);

// With custom overrides
const tasks = createMockItems(createMockTask, 3, [
  { status: 'todo' },
  { status: 'in_progress' },
  { status: 'completed' },
]);
```

### Render Utilities

Render components with necessary providers:

```typescript
import { renderWithProviders, renderWithAuth, renderWithRouter } from '@/test';

// With all providers (Auth + Notifications + Router)
renderWithProviders(<MyComponent />, {
  authValue: { user: createMockUser() },
  routerProps: { initialEntries: ['/dashboard'] },
});

// With auth only
renderWithAuth(<MyComponent />, {
  user: createMockUser(),
  loading: false,
});

// With router only
renderWithRouter(<MyComponent />, {
  initialEntries: ['/projects'],
});
```

### Supabase Mocks

Mock Supabase client for service tests:

```typescript
import {
  createMockSupabaseClient,
  createSuccessResponse,
  createErrorResponse,
} from '@/test/mocks/supabase';

const mockSupabase = createMockSupabaseClient();

// Mock successful response
mockSupabase.from().select.mockResolvedValue(createSuccessResponse([{ id: '1', name: 'Project' }]));

// Mock error response
mockSupabase.from().select.mockResolvedValue(createErrorResponse('Database error', 'PGRST116'));
```

## Available Factories

### User & Auth

- `createMockUser(overrides?)` - User object
- `createMockSession(userOverrides?)` - Auth session
- `createMockProfile(overrides?)` - User profile

### Projects & Tasks

- `createMockProject(overrides?)` - Project object
- `createMockTask(overrides?)` - Task object
- `createMockProjectWithRelations()` - Project with team/owner
- `createMockTaskWithRelations()` - Task with project/assignee

### Notifications & Teams

- `createMockNotification(overrides?)` - Notification object
- `createMockTeam(overrides?)` - Team object

### Utilities

- `createMockItems(factory, count, overridesArray?)` - Multiple items

## Context Providers

### MockAuthContextValue

```typescript
interface MockAuthContextValue {
  user: User | null;
  session: AuthSession | null;
  loading: boolean;
  signIn: vi.fn;
  signUp: vi.fn;
  signOut: vi.fn;
  resetPassword: vi.fn;
  verifyEmail: vi.fn;
  updateProfile: vi.fn;
}
```

### MockNotificationContextValue

```typescript
interface MockNotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: vi.fn;
  markAllAsRead: vi.fn;
  deleteNotification: vi.fn;
  clearAll: vi.fn;
  refetch: vi.fn;
}
```

## Best Practices

1. **Use factories over manual mocks** - Factories provide realistic, consistent data
2. **Override only what you need** - Let factories handle defaults
3. **Mock at the boundary** - Mock Supabase client, not individual functions
4. **Clean up between tests** - Use `vi.clearAllMocks()` in `beforeEach`
5. **Test behavior, not implementation** - Use render utilities to test user-facing behavior

## Adding New Factories

When adding a new factory:

1. Define the type interface
2. Create the factory function in `factories.ts`
3. Export it from `index.ts`
4. Add JSDoc comments
5. Update this README

Example:

```typescript
/**
 * Comment Factory
 */
export const createMockComment = (overrides?: Partial<Comment>): Comment => ({
  id: 'comment-123',
  content: 'Test comment',
  author_id: 'user-123',
  created_at: new Date().toISOString(),
  ...overrides,
});
```

## Related Documentation

- [Main Testing Guide](../../TESTING.md)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
