/**
 * Notification Service Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { notificationService } from '../notification.service';
import { createMockSupabaseClient, createSuccessResponse } from '@/test/mocks/supabase';
import { createMockNotification, createMockItems } from '@/test';

// Mock Supabase
const mockSupabase = createMockSupabaseClient();

vi.mock('@/lib/supabase', () => ({
  supabase: mockSupabase,
}));

describe('notificationService.getUserNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retrieves notifications for a user', async () => {
    const mockNotifications = createMockItems(createMockNotification, 3, [
      { user_id: 'user-123' },
      { user_id: 'user-123' },
      { user_id: 'user-123' },
    ]);

    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(mockNotifications));

    const result = await notificationService.getUserNotifications('user-123');

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(3);
    expect(mockSupabase.from).toHaveBeenCalledWith('notifications');
    expect(mockSupabase.from().eq).toHaveBeenCalledWith('user_id', 'user-123');
  });

  it('respects limit parameter', async () => {
    mockSupabase.from().select.mockResolvedValue(createSuccessResponse([]));

    await notificationService.getUserNotifications('user-123', 10);

    expect(mockSupabase.from().limit).toHaveBeenCalledWith(10);
  });

  it('orders by created_at descending', async () => {
    mockSupabase.from().select.mockResolvedValue(createSuccessResponse([]));

    await notificationService.getUserNotifications('user-123');

    expect(mockSupabase.from().order).toHaveBeenCalledWith('created_at', { ascending: false });
  });
});

describe('notificationService.getUnreadNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retrieves only unread notifications', async () => {
    const unreadNotifications = createMockItems(createMockNotification, 2, [
      { user_id: 'user-123', read_at: null },
      { user_id: 'user-123', read_at: null },
    ]);

    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(unreadNotifications));

    const result = await notificationService.getUnreadNotifications('user-123');

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(mockSupabase.from().eq).toHaveBeenCalledWith('user_id', 'user-123');
    expect(mockSupabase.from().eq).toHaveBeenCalledWith('read', false);
  });
});

describe('notificationService.getUnreadCount', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns count of unread notifications', async () => {
    mockSupabase.from().select.mockResolvedValue({ data: null, error: null, count: 5 });

    const result = await notificationService.getUnreadCount('user-123');

    expect(result.success).toBe(true);
    expect(result.data).toBe(5);
    expect(mockSupabase.from().eq).toHaveBeenCalledWith('user_id', 'user-123');
    expect(mockSupabase.from().eq).toHaveBeenCalledWith('read', false);
  });

  it('returns 0 when count is null', async () => {
    mockSupabase.from().select.mockResolvedValue({ data: null, error: null, count: null });

    const result = await notificationService.getUnreadCount('user-123');

    expect(result.success).toBe(true);
    expect(result.data).toBe(0);
  });
});

describe('notificationService.markAsRead', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('marks notification as read', async () => {
    const readNotification = createMockNotification({ read_at: new Date().toISOString() });
    mockSupabase.from().update.mockResolvedValue(createSuccessResponse(readNotification));
    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(readNotification));
    mockSupabase.from().single.mockResolvedValue(createSuccessResponse(readNotification));

    const result = await notificationService.markAsRead('notif-123');

    expect(result.success).toBe(true);
    expect(result.data?.read_at).toBeTruthy();
  });
});

describe('notificationService.markAsUnread', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('marks notification as unread', async () => {
    const unreadNotification = createMockNotification({ read_at: null });
    mockSupabase.from().update.mockResolvedValue(createSuccessResponse(unreadNotification));
    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(unreadNotification));
    mockSupabase.from().single.mockResolvedValue(createSuccessResponse(unreadNotification));

    const result = await notificationService.markAsUnread('notif-123');

    expect(result.success).toBe(true);
    expect(result.data?.read_at).toBeNull();
  });
});

describe('notificationService.markAllAsRead', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('marks all user notifications as read', async () => {
    mockSupabase.from().update.mockResolvedValue(createSuccessResponse(true));

    const result = await notificationService.markAllAsRead('user-123');

    expect(result.success).toBe(true);
    expect(result.data).toBe(true);
  });
});

describe('notificationService.notify', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a notification for a user', async () => {
    const newNotification = createMockNotification({
      user_id: 'user-123',
      type: 'task_assigned',
      title: 'New Task Assigned',
      message: 'You have been assigned a new task',
    });

    mockSupabase.from().insert.mockResolvedValue(createSuccessResponse(newNotification));
    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(newNotification));
    mockSupabase.from().single.mockResolvedValue(createSuccessResponse(newNotification));

    const result = await notificationService.notify(
      'user-123',
      'task_assigned',
      'New Task Assigned',
      'You have been assigned a new task'
    );

    expect(result.success).toBe(true);
    expect(result.data?.user_id).toBe('user-123');
    expect(result.data?.type).toBe('task_assigned');
    expect(result.data?.title).toBe('New Task Assigned');
  });

  it('includes optional fields when provided', async () => {
    const newNotification = createMockNotification({
      entity_type: 'task',
      entity_id: 'task-123',
      action_url: '/tasks/task-123',
      metadata: { priority: 'high' },
    });

    mockSupabase.from().insert.mockResolvedValue(createSuccessResponse(newNotification));
    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(newNotification));
    mockSupabase.from().single.mockResolvedValue(createSuccessResponse(newNotification));

    const result = await notificationService.notify(
      'user-123',
      'task_assigned',
      'New Task',
      'Message',
      '/tasks/task-123',
      'task',
      'task-123',
      { priority: 'high' }
    );

    expect(result.success).toBe(true);
    expect(result.data?.entity_type).toBe('task');
    expect(result.data?.entity_id).toBe('task-123');
    expect(result.data?.action_url).toBe('/tasks/task-123');
  });
});

describe('notificationService.notifyMany', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates notifications for multiple users', async () => {
    const userIds = ['user-1', 'user-2', 'user-3'];
    const mockNotifications = userIds.map((userId) =>
      createMockNotification({ user_id: userId, type: 'team_invite' })
    );

    mockSupabase.from().insert.mockResolvedValue(createSuccessResponse(mockNotifications));
    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(mockNotifications));

    const result = await notificationService.notifyMany(
      userIds,
      'team_invite',
      'Team Invitation',
      'You have been invited to join a team'
    );

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(3);
  });
});

describe('notificationService.deleteOldRead', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deletes old read notifications', async () => {
    mockSupabase.from().delete.mockResolvedValue(createSuccessResponse(null));

    const result = await notificationService.deleteOldRead('user-123', 30);

    expect(result.success).toBe(true);
    expect(result.data).toBe(true);
    expect(mockSupabase.from().eq).toHaveBeenCalledWith('user_id', 'user-123');
    expect(mockSupabase.from().eq).toHaveBeenCalledWith('read', true);
    expect(mockSupabase.from().lt).toHaveBeenCalled();
  });

  it('uses default 30 days if not specified', async () => {
    mockSupabase.from().delete.mockResolvedValue(createSuccessResponse(null));

    await notificationService.deleteOldRead('user-123');

    expect(mockSupabase.from().delete).toHaveBeenCalled();
  });
});

describe('notificationService.getByType', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retrieves notifications by type', async () => {
    const taskNotifications = createMockItems(createMockNotification, 2, [
      { type: 'task_assigned', user_id: 'user-123' },
      { type: 'task_assigned', user_id: 'user-123' },
    ]);

    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(taskNotifications));

    const result = await notificationService.getByType('user-123', 'task_assigned');

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(mockSupabase.from().eq).toHaveBeenCalledWith('user_id', 'user-123');
    expect(mockSupabase.from().eq).toHaveBeenCalledWith('type', 'task_assigned');
  });
});

describe('notificationService.getEntityNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retrieves notifications for a specific entity', async () => {
    const entityNotifications = createMockItems(createMockNotification, 2, [
      { entity_type: 'task', entity_id: 'task-123', user_id: 'user-123' },
      { entity_type: 'task', entity_id: 'task-123', user_id: 'user-123' },
    ]);

    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(entityNotifications));

    const result = await notificationService.getEntityNotifications('user-123', 'task', 'task-123');

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(mockSupabase.from().eq).toHaveBeenCalledWith('user_id', 'user-123');
    expect(mockSupabase.from().eq).toHaveBeenCalledWith('entity_type', 'task');
    expect(mockSupabase.from().eq).toHaveBeenCalledWith('entity_id', 'task-123');
  });
});

describe('notificationService.create', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a new notification', async () => {
    const newNotification = createMockNotification({
      user_id: 'user-123',
      type: 'mention',
      title: 'You were mentioned',
    });

    mockSupabase.from().insert.mockResolvedValue(createSuccessResponse(newNotification));
    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(newNotification));
    mockSupabase.from().single.mockResolvedValue(createSuccessResponse(newNotification));

    const result = await notificationService.create({
      user_id: 'user-123',
      type: 'mention',
      title: 'You were mentioned',
      entity_type: 'comment',
      entity_id: 'comment-123',
    });

    expect(result.success).toBe(true);
    expect(result.data).toBeTruthy();
    expect(mockSupabase.from).toHaveBeenCalledWith('notifications');
  });
});

describe('notificationService.delete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deletes a notification', async () => {
    mockSupabase.from().delete.mockResolvedValue(createSuccessResponse(null));

    const result = await notificationService.delete('notif-123');

    expect(result.success).toBe(true);
  });
});
