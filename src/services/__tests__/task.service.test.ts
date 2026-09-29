/**
 * Task Service Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { taskService } from '../task.service';
import { createMockSupabaseClient, createSuccessResponse } from '@/test/mocks/supabase';
import { createMockTask, createMockItems } from '@/test';

// Mock Supabase
const mockSupabase = createMockSupabaseClient();

vi.mock('@/lib/supabase', () => ({
  supabase: mockSupabase,
}));

describe('taskService.getById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retrieves task by ID', async () => {
    const mockTask = createMockTask();
    mockSupabase.from().single.mockResolvedValue(createSuccessResponse(mockTask));

    const result = await taskService.getById('task-123');

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockTask);
    expect(mockSupabase.from).toHaveBeenCalledWith('tasks');
  });
});

describe('taskService.getProjectTasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retrieves all tasks for a project', async () => {
    const mockTasks = createMockItems(createMockTask, 3, [
      { project_id: 'proj-123' },
      { project_id: 'proj-123' },
      { project_id: 'proj-123' },
    ]);

    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(mockTasks));

    const result = await taskService.getProjectTasks('proj-123');

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(3);
    expect(mockSupabase.from().eq).toHaveBeenCalledWith('project_id', 'proj-123');
  });
});

describe('taskService.getUserTasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retrieves tasks assigned to a user', async () => {
    const mockTasks = createMockItems(createMockTask, 2, [
      { assignee_id: 'user-123' },
      { assignee_id: 'user-123' },
    ]);

    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(mockTasks));

    const result = await taskService.getUserTasks('user-123');

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(mockSupabase.from().eq).toHaveBeenCalledWith('assigned_to', 'user-123');
  });
});

describe('taskService.getByStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retrieves tasks by status', async () => {
    const todoTasks = createMockItems(createMockTask, 2, [{ status: 'todo' }, { status: 'todo' }]);

    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(todoTasks));

    const result = await taskService.getByStatus('todo');

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(mockSupabase.from().eq).toHaveBeenCalledWith('status', 'todo');
  });

  it('filters by project when provided', async () => {
    const projectTasks = createMockItems(createMockTask, 1, [
      { status: 'todo', project_id: 'proj-123' },
    ]);

    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(projectTasks));

    const result = await taskService.getByStatus('todo', 'proj-123');

    expect(result.success).toBe(true);
    expect(mockSupabase.from().eq).toHaveBeenCalledWith('status', 'todo');
    expect(mockSupabase.from().eq).toHaveBeenCalledWith('project_id', 'proj-123');
  });
});

describe('taskService.getByPriority', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retrieves tasks by priority', async () => {
    const highPriorityTasks = createMockItems(createMockTask, 2, [
      { priority: 'high' },
      { priority: 'high' },
    ]);

    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(highPriorityTasks));

    const result = await taskService.getByPriority('high');

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(mockSupabase.from().eq).toHaveBeenCalledWith('priority', 'high');
  });
});

describe('taskService.getOverdueTasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retrieves overdue tasks', async () => {
    const overdueTasks = createMockItems(createMockTask, 2, [
      { due_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), status: 'todo' },
      { due_date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), status: 'in_progress' },
    ]);

    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(overdueTasks));

    const result = await taskService.getOverdueTasks();

    expect(result.success).toBe(true);
    expect(mockSupabase.from().lt).toHaveBeenCalled();
    expect(mockSupabase.from().neq).toHaveBeenCalledWith('status', 'completed');
    expect(mockSupabase.from().neq).toHaveBeenCalledWith('status', 'cancelled');
  });

  it('filters by user when provided', async () => {
    const overdueTasks = createMockItems(createMockTask, 1);
    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(overdueTasks));

    await taskService.getOverdueTasks('user-123');

    expect(mockSupabase.from().eq).toHaveBeenCalledWith('assigned_to', 'user-123');
  });
});

describe('taskService.getSubtasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retrieves subtasks for a parent task', async () => {
    const subtasks = createMockItems(createMockTask, 2, [
      { parent_task_id: 'task-parent' },
      { parent_task_id: 'task-parent' },
    ]);

    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(subtasks));

    const result = await taskService.getSubtasks('task-parent');

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(mockSupabase.from().eq).toHaveBeenCalledWith('parent_task_id', 'task-parent');
  });
});

describe('taskService.updateStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates task status', async () => {
    const completedTask = createMockTask({ status: 'completed' });
    mockSupabase.from().update.mockResolvedValue(createSuccessResponse(completedTask));
    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(completedTask));
    mockSupabase.from().single.mockResolvedValue(createSuccessResponse(completedTask));

    const result = await taskService.updateStatus('task-123', 'completed');

    expect(result.success).toBe(true);
    expect(result.data?.status).toBe('completed');
  });
});

describe('taskService.assignTask', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('assigns task to user', async () => {
    const assignedTask = createMockTask({ assignee_id: 'user-456' });
    mockSupabase.from().update.mockResolvedValue(createSuccessResponse(assignedTask));
    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(assignedTask));
    mockSupabase.from().single.mockResolvedValue(createSuccessResponse(assignedTask));

    const result = await taskService.assignTask('task-123', 'user-456');

    expect(result.success).toBe(true);
    expect(result.data?.assignee_id).toBe('user-456');
  });

  it('unassigns task when userId is null', async () => {
    const unassignedTask = createMockTask({ assignee_id: null });
    mockSupabase.from().update.mockResolvedValue(createSuccessResponse(unassignedTask));
    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(unassignedTask));
    mockSupabase.from().single.mockResolvedValue(createSuccessResponse(unassignedTask));

    const result = await taskService.assignTask('task-123', null);

    expect(result.success).toBe(true);
    expect(result.data?.assignee_id).toBeNull();
  });
});

describe('taskService.updatePosition', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates task position', async () => {
    const repositionedTask = createMockTask({ position: 5 });
    mockSupabase.from().update.mockResolvedValue(createSuccessResponse(repositionedTask));
    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(repositionedTask));
    mockSupabase.from().single.mockResolvedValue(createSuccessResponse(repositionedTask));

    const result = await taskService.updatePosition('task-123', 5);

    expect(result.success).toBe(true);
    expect(result.data?.position).toBe(5);
  });
});

describe('taskService.addTags', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds tags to task', async () => {
    const currentTask = createMockTask({ tags: ['backend'] });
    mockSupabase.from().single.mockResolvedValueOnce(createSuccessResponse(currentTask));

    const updatedTask = createMockTask({ tags: ['backend', 'api', 'urgent'] });
    mockSupabase.from().update.mockResolvedValue(createSuccessResponse(updatedTask));
    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(updatedTask));
    mockSupabase.from().single.mockResolvedValueOnce(createSuccessResponse(updatedTask));

    const result = await taskService.addTags('task-123', ['api', 'urgent']);

    expect(result.success).toBe(true);
    expect(result.data?.tags).toContain('backend');
    expect(result.data?.tags).toContain('api');
    expect(result.data?.tags).toContain('urgent');
  });

  it('prevents duplicate tags', async () => {
    const currentTask = createMockTask({ tags: ['backend', 'api'] });
    mockSupabase.from().single.mockResolvedValueOnce(createSuccessResponse(currentTask));

    const updatedTask = createMockTask({ tags: ['backend', 'api'] });
    mockSupabase.from().update.mockResolvedValue(createSuccessResponse(updatedTask));
    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(updatedTask));
    mockSupabase.from().single.mockResolvedValueOnce(createSuccessResponse(updatedTask));

    const result = await taskService.addTags('task-123', ['api', 'backend']);

    expect(result.success).toBe(true);
    expect(result.data?.tags).toHaveLength(2);
  });
});

describe('taskService.removeTags', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('removes tags from task', async () => {
    const currentTask = createMockTask({ tags: ['backend', 'api', 'urgent'] });
    mockSupabase.from().single.mockResolvedValueOnce(createSuccessResponse(currentTask));

    const updatedTask = createMockTask({ tags: ['backend'] });
    mockSupabase.from().update.mockResolvedValue(createSuccessResponse(updatedTask));
    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(updatedTask));
    mockSupabase.from().single.mockResolvedValueOnce(createSuccessResponse(updatedTask));

    const result = await taskService.removeTags('task-123', ['api', 'urgent']);

    expect(result.success).toBe(true);
    expect(result.data?.tags).toContain('backend');
    expect(result.data?.tags).not.toContain('api');
    expect(result.data?.tags).not.toContain('urgent');
  });
});

describe('taskService.search', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('searches tasks by query', async () => {
    const matchingTasks = [
      createMockTask({ title: 'Dashboard Task' }),
      createMockTask({ description: 'Build dashboard' }),
    ];

    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(matchingTasks));

    const result = await taskService.search('dashboard');

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(mockSupabase.from().or).toHaveBeenCalled();
  });

  it('filters by project when provided', async () => {
    mockSupabase.from().select.mockResolvedValue(createSuccessResponse([]));

    await taskService.search('test', { projectId: 'proj-123' });

    expect(mockSupabase.from().eq).toHaveBeenCalledWith('project_id', 'proj-123');
  });

  it('uses pagination options', async () => {
    mockSupabase.from().select.mockResolvedValue(createSuccessResponse([]));

    await taskService.search('test', { limit: 10, page: 2 });

    expect(mockSupabase.from().range).toHaveBeenCalledWith(10, 19);
  });
});

describe('taskService.getProjectStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calculates task statistics for a project', async () => {
    const mockTasks = [
      createMockTask({ status: 'todo' }),
      createMockTask({ status: 'todo' }),
      createMockTask({ status: 'in_progress' }),
      createMockTask({ status: 'completed' }),
      createMockTask({ status: 'completed' }),
      createMockTask({ status: 'completed' }),
    ];

    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(mockTasks));

    const result = await taskService.getProjectStats('proj-123');

    expect(result.success).toBe(true);
    expect(result.data?.total).toBe(6);
    expect(result.data?.todo).toBe(2);
    expect(result.data?.in_progress).toBe(1);
    expect(result.data?.completed).toBe(3);
  });
});

describe('taskService.getDueToday', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retrieves tasks due today', async () => {
    const today = new Date();
    const dueTodayTasks = createMockItems(createMockTask, 2, [
      { due_date: today.toISOString(), status: 'todo' },
      { due_date: today.toISOString(), status: 'in_progress' },
    ]);

    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(dueTodayTasks));

    const result = await taskService.getDueToday();

    expect(result.success).toBe(true);
    expect(mockSupabase.from().gte).toHaveBeenCalled();
    expect(mockSupabase.from().lt).toHaveBeenCalled();
  });
});

describe('taskService.getUserTaskSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calculates task summary for a user', async () => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const mockTasks = [
      createMockTask({ status: 'todo', due_date: new Date().toISOString() }),
      createMockTask({ status: 'in_progress', due_date: yesterday.toISOString() }),
      createMockTask({ status: 'completed', due_date: new Date().toISOString() }),
      createMockTask({ status: 'completed', due_date: new Date().toISOString() }),
    ];

    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(mockTasks));

    const result = await taskService.getUserTaskSummary('user-123');

    expect(result.success).toBe(true);
    expect(result.data?.total).toBe(4);
    expect(result.data?.completed).toBe(2);
    expect(result.data?.assigned).toBe(2);
    expect(result.data?.overdue).toBeGreaterThanOrEqual(1);
  });
});
