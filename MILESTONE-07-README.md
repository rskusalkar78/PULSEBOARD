# Milestone 07 - Backend and Database Foundation

Complete backend integration with Supabase for PulseBoard application.

## 🎯 Overview

This milestone establishes the complete backend infrastructure including:

- Database schema with 8 core tables
- Type-safe TypeScript integration
- Secure Row Level Security (RLS) policies
- Comprehensive service layer for data operations
- Error handling and loading state management
- File storage configuration

## 📋 Completed Features

### ✅ Database Schema

- **8 Core Tables:**
  - `profiles` - User profiles extending Supabase auth
  - `teams` - Organizations/workspaces
  - `team_members` - Team membership with roles
  - `projects` - Project management
  - `tasks` - Task tracking with subtasks support
  - `activities` - Activity feed
  - `notifications` - User notifications
  - `analytics_events` - Event tracking

- **Advanced Features:**
  - Automatic timestamps with triggers
  - Cascade delete constraints
  - Optimized indexes for performance
  - Helper functions for common operations
  - JSONB fields for flexible metadata

### ✅ Row Level Security (RLS)

Complete RLS policies for all tables ensuring:

- Users can only access their own data
- Team members can access team resources
- Project visibility controls (private/team/public)
- Automatic profile creation on signup
- Immutable activity and analytics logs

### ✅ TypeScript Types

Full type safety with:

- Database schema types
- Insert/Update types
- Extended types with relations
- Filter types for queries
- Pagination and sorting types
- API response types
- Supabase client types

### ✅ Supabase Client

Secure client configuration with:

- Environment variable validation
- Type-safe table references
- Helper functions for auth operations
- Error classification utilities
- Development debugging tools

### ✅ Service Layer

7 Specialized services:

1. **ProfileService** - User profile management
2. **TeamService** - Team and membership operations
3. **ProjectService** - Project CRUD with access control
4. **TaskService** - Task management with subtasks
5. **ActivityService** - Activity feed operations
6. **NotificationService** - Notification management
7. **AnalyticsService** - Event tracking

Each service includes:

- Full CRUD operations
- Search and filtering
- Pagination support
- Domain-specific methods
- Type safety throughout

### ✅ Storage Management

File upload utilities for:

- Avatar images
- Project attachments
- General file uploads
- Signed URLs for private files
- File validation (size, type)
- Helper utilities

### ✅ Error Handling

Comprehensive error system:

- Custom error classes (Auth, Validation, NotFound, etc.)
- Error classification helpers
- User-friendly error messages
- Error logging utilities
- Retry logic with exponential backoff

### ✅ Loading States

React hooks for state management:

- `useLoading` - Multi-key loading states
- `useDebouncedLoading` - Delayed loading indicators
- `useOptimistic` - Optimistic UI updates
- `useAsync` - Async operation handling
- `useAsyncApi` - API response handling

### ✅ Toast Notifications

Global notification system:

- Success, error, warning, info types
- Auto-dismiss with configurable duration
- Action buttons support
- Context provider for global access

## 📁 Project Structure

```
src/
├── lib/
│   ├── supabase.ts          # Supabase client configuration
│   ├── config.ts            # App configuration
│   ├── storage.ts           # File storage utilities
│   ├── errors.ts            # Error handling
│   └── index.ts             # Library exports
│
├── types/
│   ├── database.types.ts    # Database schema types
│   ├── supabase.types.ts    # Supabase client types
│   └── index.ts             # Type exports
│
├── services/
│   ├── base.service.ts      # Base service class
│   ├── profile.service.ts   # Profile operations
│   ├── team.service.ts      # Team operations
│   ├── project.service.ts   # Project operations
│   ├── task.service.ts      # Task operations
│   ├── activity.service.ts  # Activity operations
│   ├── notification.service.ts  # Notification operations
│   ├── analytics.service.ts # Analytics tracking
│   └── index.ts             # Service exports
│
├── hooks/
│   ├── useLoading.ts        # Loading state hooks
│   ├── useAsync.ts          # Async operation hooks
│   ├── useError.ts          # Error handling hooks
│   ├── useToast.ts          # Toast notification hook
│   └── index.ts             # Hook exports
│
├── contexts/
│   ├── ToastContext.tsx     # Toast provider
│   └── index.ts             # Context exports
│
└── env.d.ts                 # Environment type definitions

supabase/
└── migrations/
    ├── 20260828000001_initial_schema.sql   # Database schema
    └── 20260828000002_rls_policies.sql     # RLS policies
```

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 18+
- Supabase account
- Git

### 2. Environment Setup

Copy `.env.example` to `.env` and update:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Database Setup

See [MILESTONE-07-DATABASE-SETUP.md](./MILESTONE-07-DATABASE-SETUP.md) for detailed instructions.

Quick setup:

1. Create Supabase project
2. Run migrations via SQL Editor
3. Create storage buckets
4. Configure RLS policies

### 4. Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 💡 Usage Examples

### Authentication

```typescript
import { supabase } from '@/lib/supabase';

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});

// Sign out
await supabase.auth.signOut();
```

### Using Services

```typescript
import { profileService, projectService, taskService } from '@/services';

// Get current user profile
const { data: profile } = await profileService.getCurrentProfile();

// Create a project
const { data: project } = await projectService.create({
  name: 'My Project',
  slug: 'my-project',
  owner_id: profile.id,
  visibility: 'private',
});

// Create a task
const { data: task } = await taskService.create({
  title: 'Implement feature',
  project_id: project.id,
  created_by: profile.id,
  status: 'todo',
  priority: 'high',
});

// Get all tasks for project
const { data: tasks } = await taskService.getProjectTasks(project.id);
```

### Using Hooks

```typescript
import { useAsync, useLoading, useToast } from '@/hooks';
import { projectService } from '@/services';

function MyComponent() {
  const toast = useToast();
  const { loading, withLoading } = useLoading();

  const loadProjects = async () => {
    await withLoading(async () => {
      const { data, error } = await projectService.getAll();

      if (error) {
        toast.error('Failed to load projects');
        return;
      }

      toast.success('Projects loaded');
      return data;
    });
  };

  return (
    <button onClick={loadProjects} disabled={loading}>
      {loading ? 'Loading...' : 'Load Projects'}
    </button>
  );
}
```

### Error Handling

```typescript
import { useError } from '@/hooks';
import { AppError, getUserFriendlyMessage } from '@/lib/errors';

function MyComponent() {
  const { error, setError, clearError, errorMessage } = useError();

  const handleAction = async () => {
    try {
      // Your async operation
    } catch (err) {
      setError(err); // Automatically logs and formats error
    }
  };

  return (
    <>
      {error && (
        <div className="error">
          {errorMessage}
          <button onClick={clearError}>Dismiss</button>
        </div>
      )}
    </>
  );
}
```

## 🔒 Security

### Best Practices Implemented

✅ **Authentication**

- JWT-based auth with Supabase
- Automatic token refresh
- Secure session storage

✅ **Authorization**

- Row Level Security on all tables
- Role-based access control
- Team-based permissions

✅ **Data Protection**

- Anon key only in frontend
- Service role key never exposed
- Parameterized queries (SQL injection prevention)

✅ **File Storage**

- Size and type validation
- Signed URLs for private files
- Per-bucket RLS policies

### Security Checklist

- [ ] Never commit `.env` files
- [ ] Use `anon` key only in frontend
- [ ] Enable MFA on Supabase dashboard
- [ ] Regularly rotate database passwords
- [ ] Monitor database logs for suspicious activity
- [ ] Keep dependencies updated
- [ ] Use HTTPS in production

## 📊 Database Schema

See [MILESTONE-07-DATABASE-SETUP.md](./MILESTONE-07-DATABASE-SETUP.md) for complete schema documentation.

**Key Relationships:**

- Profiles ← Teams (via team_members)
- Projects → Teams (optional)
- Tasks → Projects (required)
- Activities → Projects/Teams
- Notifications → Profiles

## 🧪 Testing

### Manual Testing

```typescript
// Test profile operations
import { profileService } from '@/services';

const profile = await profileService.getCurrentProfile();
console.log('Current profile:', profile);

// Test RLS policies
const projects = await projectService.getAll();
// Should only return projects user has access to
```

### Automated Testing

```bash
npm test
```

Tests should cover:

- Service CRUD operations
- Error handling
- Type safety
- Hook behavior

## 📈 Performance

### Optimizations Implemented

- Database indexes on frequently queried columns
- Pagination for large datasets
- Selective field loading with `select()`
- Connection pooling via Supabase
- Optimistic UI updates
- Debounced loading states

### Query Performance Tips

```typescript
// Good: Select only needed fields
const { data } = await supabase
  .from('tasks')
  .select('id, title, status')
  .eq('project_id', projectId);

// Good: Use pagination
const { data } = await taskService.list({
  page: 1,
  limit: 20,
  filters: { status: 'todo' },
});

// Good: Use indexes
// All indexes defined in migration files
```

## 🐛 Troubleshooting

See [MILESTONE-07-DATABASE-SETUP.md](./MILESTONE-07-DATABASE-SETUP.md) for common issues and solutions.

**Quick Fixes:**

- **Can't connect:** Check environment variables
- **RLS errors:** Verify user is authenticated
- **Slow queries:** Check indexes exist
- **File upload fails:** Check storage bucket policies

## 📚 API Documentation

### ProfileService

```typescript
getCurrentProfile(): Promise<ApiResponse<Profile>>
getById(id: string): Promise<ApiResponse<Profile>>
getByEmail(email: string): Promise<ApiResponse<Profile>>
updateCurrentProfile(data: ProfileUpdate): Promise<ApiResponse<Profile>>
search(query: string, limit?: number): Promise<ApiResponse<Profile[]>>
```

### ProjectService

```typescript
create(data: ProjectInsert): Promise<ApiResponse<Project>>
getById(id: string): Promise<ApiResponse<Project>>
getWithRelations(id: string): Promise<ApiResponse<ProjectWithRelations>>
getUserProjects(userId: string): Promise<ApiResponse<Project[]>>
update(id: string, data: ProjectUpdate): Promise<ApiResponse<Project>>
delete(id: string): Promise<ApiResponse<boolean>>
```

### TaskService

```typescript
create(data: TaskInsert): Promise<ApiResponse<Task>>
getProjectTasks(projectId: string): Promise<ApiResponse<Task[]>>
getUserTasks(userId: string): Promise<ApiResponse<Task[]>>
updateStatus(id: string, status: TaskStatus): Promise<ApiResponse<Task>>
assignTask(id: string, userId: string): Promise<ApiResponse<Task>>
```

## 🔄 Migration Guide

### From Mock Data to Real Database

1. Update imports from mock services to real services
2. Replace mock data with database queries
3. Add error handling for network failures
4. Implement loading states
5. Add optimistic updates where appropriate

Example:

```typescript
// Before (mock)
const projects = MOCK_PROJECTS;

// After (real)
const { data: projects, loading, error } = useAsync(() => projectService.getUserProjects(userId));
```

## 🚧 Future Enhancements

- [ ] Real-time subscriptions for live updates
- [ ] Database functions for complex queries
- [ ] Full-text search with PostgreSQL
- [ ] Materialized views for analytics
- [ ] Database triggers for notifications
- [ ] Webhook support for external integrations
- [ ] Advanced caching strategies
- [ ] Query result streaming

## 📞 Support

For issues or questions:

1. Check troubleshooting guide
2. Review Supabase logs
3. Check project documentation
4. Open GitHub issue

## 📄 License

MIT License - See LICENSE file for details

---

**Milestone 07 Complete** ✅

Ready for UI integration and feature development!
