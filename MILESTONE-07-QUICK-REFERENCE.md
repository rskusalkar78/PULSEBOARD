# Milestone 07 - Quick Reference Guide

Quick reference for common operations and patterns.

## 🔗 Import Patterns

```typescript
// Services
import {
  profileService,
  projectService,
  taskService,
  teamService,
  activityService,
  notificationService,
  analyticsService,
} from '@/services';

// Hooks
import { useAsync, useLoading, useError, useToast } from '@/hooks';

// Types
import type { Profile, Project, Task, ApiResponse } from '@/types';

// Utilities
import { supabase, getCurrentUser, getUserFriendlyMessage } from '@/lib';
```

## 📝 Common Operations

### Authentication

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      full_name: 'John Doe',
    },
  },
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});

// Get current user
const user = await getCurrentUser();

// Sign out
await supabase.auth.signOut();

// Listen to auth changes
onAuthStateChange((event, session) => {
  console.log('Auth event:', event, session);
});
```

### Profile Operations

```typescript
// Get current profile
const { data: profile } = await profileService.getCurrentProfile();

// Update profile
await profileService.updateCurrentProfile({
  full_name: 'Jane Doe',
  bio: 'Software Engineer',
});

// Update preferences
await profileService.updatePreferences(userId, {
  theme: 'dark',
  notifications: { email: true, push: false },
});

// Search users
const { data: users } = await profileService.search('john', 10);
```

### Team Operations

```typescript
// Create team
const { data: team } = await teamService.create({
  name: 'Engineering Team',
  slug: 'engineering',
  owner_id: currentUserId,
  description: 'Core engineering team',
});

// Get team with members
const { data: teamWithMembers } = await teamService.getWithMembers(teamId);

// Add member
await teamService.addMember({
  team_id: teamId,
  user_id: userId,
  role: 'member',
});

// Remove member
await teamService.removeMember(memberId);

// Get user's teams
const { data: teams } = await teamService.getUserTeams(userId);
```

### Project Operations

```typescript
// Create project
const { data: project } = await projectService.create({
  name: 'Q1 2026 Roadmap',
  slug: 'q1-2026-roadmap',
  owner_id: currentUserId,
  team_id: teamId, // optional
  visibility: 'team',
  status: 'active',
  color: '#3B82F6',
});

// Get project
const { data: project } = await projectService.getById(projectId);

// Get project with relations
const { data: projectFull } = await projectService.getWithRelations(projectId);

// Update project
await projectService.update(projectId, {
  status: 'completed',
});

// Archive project
await projectService.archive(projectId);

// Get user's projects
const { data: projects } = await projectService.getUserProjects(userId);

// Get accessible projects
const { data: accessibleProjects } = await projectService.getAccessibleProjects(userId);

// Search projects
const { data: results } = await projectService.search('roadmap', 10);
```

### Task Operations

```typescript
// Create task
const { data: task } = await taskService.create({
  title: 'Implement user authentication',
  description: 'Add JWT-based auth',
  project_id: projectId,
  created_by: currentUserId,
  assigned_to: userId,
  status: 'todo',
  priority: 'high',
  due_date: '2026-09-01T00:00:00Z',
  tags: ['auth', 'security'],
});

// Get project tasks
const { data: tasks } = await taskService.getProjectTasks(projectId);

// Get user's tasks
const { data: myTasks } = await taskService.getUserTasks(userId);

// Update task status
await taskService.updateStatus(taskId, 'in_progress');

// Assign task
await taskService.assignTask(taskId, userId);

// Add tags
await taskService.addTags(taskId, ['urgent', 'bug']);

// Get overdue tasks
const { data: overdueTasks } = await taskService.getOverdueTasks(userId);

// Get task with relations
const { data: taskFull } = await taskService.getWithRelations(taskId);

// Create subtask
const { data: subtask } = await taskService.create({
  title: 'Subtask',
  project_id: projectId,
  created_by: currentUserId,
  parent_task_id: parentTaskId,
  status: 'todo',
  priority: 'medium',
});
```

### Activity Operations

```typescript
// Log activity
await activityService.log(
  currentUserId,
  'created_task',
  'task',
  taskId,
  { task_title: 'New Task' },
  projectId
);

// Get project activities
const { data: activities } = await activityService.getProjectActivities(projectId, 50);

// Get user activities
const { data: userActivities } = await activityService.getUserActivities(userId, 50);

// Get recent feed
const { data: feed } = await activityService.getRecentActivities(100);
```

### Notification Operations

```typescript
// Create notification
await notificationService.notify(
  userId,
  'assignment',
  'New Task Assigned',
  'You have been assigned to "Implement feature X"',
  `/tasks/${taskId}`,
  'task',
  taskId
);

// Get user notifications
const { data: notifications } = await notificationService.getUserNotifications(userId, 50);

// Get unread count
const { data: unreadCount } = await notificationService.getUnreadCount(userId);

// Mark as read
await notificationService.markAsRead(notificationId);

// Mark all as read
await notificationService.markAllAsRead(userId);
```

### Analytics Operations

```typescript
// Track event
await analyticsService.track(
  'button_clicked',
  'user',
  { button_name: 'create_project', page: '/dashboard' },
  userId
);

// Track page view
await analyticsService.trackPageView('/dashboard', userId);

// Track project event
await analyticsService.trackProjectEvent(
  'project_created',
  projectId,
  { name: 'My Project' },
  userId
);
```

## 🎣 React Hooks

### useAsync

```typescript
function MyComponent() {
  const {
    data,
    loading,
    error,
    execute,
    isSuccess,
    isError
  } = useAsync(() => projectService.getUserProjects(userId));

  useEffect(() => {
    execute();
  }, [execute]);

  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  if (data) return <ProjectList projects={data} />;
}
```

### useLoading

```typescript
function MyComponent() {
  const { loading, withLoading, isLoading } = useLoading();

  const handleCreate = async () => {
    await withLoading(async () => {
      await projectService.create({ /* ... */ });
    }, 'create'); // optional key
  };

  return (
    <button onClick={handleCreate} disabled={loading}>
      {isLoading('create') ? 'Creating...' : 'Create Project'}
    </button>
  );
}
```

### useError

```typescript
function MyComponent() {
  const { error, setError, clearError, errorMessage } = useError();

  const handleAction = async () => {
    try {
      await someAsyncOperation();
    } catch (err) {
      setError(err); // Auto-logs and formats
    }
  };

  return (
    <>
      {error && (
        <Alert type="error" onClose={clearError}>
          {errorMessage}
        </Alert>
      )}
    </>
  );
}
```

### useToast

```typescript
function MyComponent() {
  const toast = useToast();

  const handleSave = async () => {
    try {
      await projectService.update(id, data);
      toast.success('Project saved successfully');
    } catch (error) {
      toast.error('Failed to save project');
    }
  };

  return <button onClick={handleSave}>Save</button>;
}

// Or use global toast
import { toast } from '@/hooks';

toast.success('Operation completed');
toast.error('Something went wrong');
toast.warning('Please review your changes');
toast.info('New feature available');
```

### Combined Pattern

```typescript
function ProjectList() {
  const toast = useToast();
  const { loading, withLoading } = useLoading();
  const { error, setError } = useError();

  const [projects, setProjects] = useState<Project[]>([]);

  const loadProjects = async () => {
    await withLoading(async () => {
      try {
        const { data, error } = await projectService.getUserProjects(userId);

        if (error) throw error;

        setProjects(data);
        toast.success('Projects loaded');
      } catch (err) {
        setError(err);
        toast.error('Failed to load projects');
      }
    });
  };

  useEffect(() => {
    loadProjects();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage />;

  return <div>{/* render projects */}</div>;
}
```

## 🎨 Component Patterns

### With Loading State

```typescript
function Component() {
  const [data, setData] = useState(null);
  const { loading, withLoading } = useLoading();

  const fetchData = () => withLoading(async () => {
    const result = await service.getData();
    setData(result.data);
  });

  return (
    <div>
      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>
      {data && <Display data={data} />}
    </div>
  );
}
```

### With Error Handling

```typescript
function Component() {
  const { error, setError, clearError, errorMessage } = useError();

  const handleSubmit = async (formData) => {
    clearError();
    try {
      await service.create(formData);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <Alert type="error">{errorMessage}</Alert>}
      {/* form fields */}
    </form>
  );
}
```

### Optimistic Updates

```typescript
function TaskItem({ task }) {
  const toast = useToast();
  const [localTask, setLocalTask] = useState(task);

  const toggleStatus = async () => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';

    // Optimistic update
    setLocalTask({ ...localTask, status: newStatus });

    try {
      await taskService.updateStatus(task.id, newStatus);
      toast.success('Task updated');
    } catch (error) {
      // Rollback on error
      setLocalTask(task);
      toast.error('Failed to update task');
    }
  };

  return (
    <div>
      <input
        type="checkbox"
        checked={localTask.status === 'completed'}
        onChange={toggleStatus}
      />
      {localTask.title}
    </div>
  );
}
```

## 🔍 Filtering and Pagination

```typescript
// With filters
const { data: tasks } = await taskService.list({
  page: 1,
  limit: 20,
  sortBy: 'created_at',
  sortOrder: 'desc',
  filters: {
    status: 'todo',
    priority: 'high',
    assigned_to: userId,
  },
});

// Pagination response
console.log(tasks.pagination);
// {
//   page: 1,
//   limit: 20,
//   total: 100,
//   totalPages: 5,
//   hasMore: true
// }

// Search
const { data: results } = await projectService.search('roadmap', 10);
```

## 🗄️ Storage Operations

```typescript
import { uploadAvatar, uploadProjectFile, getPublicUrl } from '@/lib';

// Upload avatar
const result = await uploadAvatar(userId, file);
if (result.publicUrl) {
  await profileService.update(userId, {
    avatar_url: result.publicUrl,
  });
}

// Upload project file
const result = await uploadProjectFile(projectId, file);

// Get public URL
const url = getPublicUrl('avatars', 'user-id/avatar.jpg');
```

## ⚠️ Error Types

```typescript
import {
  AppError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ValidationError,
  NetworkError,
} from '@/lib/errors';

// Throwing errors
throw new ValidationError('Invalid email format');
throw new AuthenticationError('Please sign in');
throw new NotFoundError('Project');

// Checking error types
if (isAuthenticationError(error)) {
  // Redirect to login
}
if (isValidationError(error)) {
  // Show validation message
}
```

## 🔄 Real-time Subscriptions (Coming Soon)

```typescript
// Subscribe to changes
const subscription = supabase
  .channel('tasks')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'tasks',
      filter: `project_id=eq.${projectId}`,
    },
    (payload) => {
      console.log('Task changed:', payload);
    }
  )
  .subscribe();

// Cleanup
subscription.unsubscribe();
```

## 📊 Query Performance

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
});

// Good: Use indexes (already created in migrations)
// Bad: Select * from large tables
// Bad: N+1 queries in loops
```

## 🧪 Testing

```typescript
// Mock service in tests
vi.mock('@/services', () => ({
  projectService: {
    getById: vi.fn().mockResolvedValue({
      data: mockProject,
      error: null,
      success: true,
    }),
  },
}));

// Test component
render(<ProjectDetails id="123" />);
await waitFor(() => {
  expect(screen.getByText('Project Name')).toBeInTheDocument();
});
```

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Hooks](https://react.dev/reference/react)

---

Keep this guide handy for quick reference during development!
