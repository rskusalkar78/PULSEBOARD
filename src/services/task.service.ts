/**
 * Task Service
 * Service for managing tasks
 */

import { BaseService } from './base.service';
import type {
  Task,
  TaskInsert,
  TaskUpdate,
  TaskFilters,
  TaskWithRelations,
  ApiResponse,
} from '@/types';

class TaskService extends BaseService<
  Task,
  TaskInsert,
  TaskUpdate,
  TaskFilters
> {
  protected tableName = 'tasks';

  /**
   * Get task with relations
   */
  async getWithRelations(id: string): Promise<ApiResponse<TaskWithRelations>> {
    try {
      const { data, error } = await this.table
        .select(
          `
          *,
          project:projects(*),
          created_by_profile:profiles!created_by(*),
          assigned_to_profile:profiles!assigned_to(*),
          parent_task:tasks!parent_task_id(*),
          subtasks:tasks!parent_task_id(*)
        `
        )
        .eq('id', id)
        .single();

      if (error) return this.handleError(error);

      return this.handleSuccess(data as TaskWithRelations);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get tasks for a project
   */
  async getProjectTasks(projectId: string): Promise<ApiResponse<Task[]>> {
    try {
      const { data, error } = await this.table
        .select('*')
        .eq('project_id', projectId)
        .order('position', { ascending: true });

      if (error) return this.handleError(error);

      return this.handleSuccess(data as Task[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get tasks assigned to a user
   */
  async getUserTasks(userId: string): Promise<ApiResponse<Task[]>> {
    try {
      const { data, error } = await this.table
        .select('*, project:projects(*)')
        .eq('assigned_to', userId)
        .order('due_date', { ascending: true, nullsFirst: false });

      if (error) return this.handleError(error);

      return this.handleSuccess(data as Task[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get tasks created by a user
   */
  async getCreatedTasks(userId: string): Promise<ApiResponse<Task[]>> {
    try {
      const { data, error } = await this.table
        .select('*, project:projects(*)')
        .eq('created_by', userId)
        .order('created_at', { ascending: false });

      if (error) return this.handleError(error);

      return this.handleSuccess(data as Task[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get tasks by status
   */
  async getByStatus(
    status: Task['status'],
    projectId?: string
  ): Promise<ApiResponse<Task[]>> {
    try {
      let query = this.table.select('*').eq('status', status);

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query.order('position', { ascending: true });

      if (error) return this.handleError(error);

      return this.handleSuccess(data as Task[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get tasks by priority
   */
  async getByPriority(
    priority: Task['priority'],
    projectId?: string
  ): Promise<ApiResponse<Task[]>> {
    try {
      let query = this.table.select('*').eq('priority', priority);

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query.order('due_date', {
        ascending: true,
        nullsFirst: false,
      });

      if (error) return this.handleError(error);

      return this.handleSuccess(data as Task[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get overdue tasks
   */
  async getOverdueTasks(userId?: string): Promise<ApiResponse<Task[]>> {
    try {
      let query = this.table
        .select('*, project:projects(*)')
        .lt('due_date', new Date().toISOString())
        .neq('status', 'completed')
        .neq('status', 'cancelled');

      if (userId) {
        query = query.eq('assigned_to', userId);
      }

      const { data, error } = await query.order('due_date', { ascending: true });

      if (error) return this.handleError(error);

      return this.handleSuccess(data as Task[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get subtasks for a parent task
   */
  async getSubtasks(parentTaskId: string): Promise<ApiResponse<Task[]>> {
    try {
      const { data, error } = await this.table
        .select('*')
        .eq('parent_task_id', parentTaskId)
        .order('position', { ascending: true });

      if (error) return this.handleError(error);

      return this.handleSuccess(data as Task[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Update task status
   */
  async updateStatus(
    id: string,
    status: Task['status']
  ): Promise<ApiResponse<Task>> {
    return this.update(id, { status });
  }

  /**
   * Assign task to user
   */
  async assignTask(
    id: string,
    userId: string | null
  ): Promise<ApiResponse<Task>> {
    return this.update(id, { assigned_to: userId });
  }

  /**
   * Update task position (for drag and drop)
   */
  async updatePosition(
    id: string,
    position: number
  ): Promise<ApiResponse<Task>> {
    return this.update(id, { position });
  }

  /**
   * Reorder tasks in a project
   */
  async reorderTasks(
    projectId: string,
    taskOrders: Array<{ id: string; position: number }>
  ): Promise<ApiResponse<boolean>> {
    try {
      // Update positions for all tasks
      const updates = taskOrders.map(({ id, position }) =>
        this.table.update({ position }).eq('id', id).eq('project_id', projectId)
      );

      await Promise.all(updates);

      return this.handleSuccess(true);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Add tags to task
   */
  async addTags(id: string, tags: string[]): Promise<ApiResponse<Task>> {
    try {
      const current = await this.getById(id);
      if (!current.success || !current.data) {
        return current;
      }

      const currentTags = current.data.tags || [];
      const newTags = Array.from(new Set([...currentTags, ...tags]));

      return this.update(id, { tags: newTags });
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Remove tags from task
   */
  async removeTags(id: string, tags: string[]): Promise<ApiResponse<Task>> {
    try {
      const current = await this.getById(id);
      if (!current.success || !current.data) {
        return current;
      }

      const currentTags = current.data.tags || [];
      const newTags = currentTags.filter((tag) => !tags.includes(tag));

      return this.update(id, { tags: newTags });
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Search tasks
   */
  async search(query: string, limit = 10): Promise<ApiResponse<Task[]>> {
    try {
      const { data, error } = await this.table
        .select('*, project:projects(*)')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(limit);

      if (error) return this.handleError(error);

      return this.handleSuccess(data as Task[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get task statistics for a project
   */
  async getProjectStats(projectId: string): Promise<
    ApiResponse<{
      total: number;
      todo: number;
      in_progress: number;
      in_review: number;
      completed: number;
      cancelled: number;
    }>
  > {
    try {
      const { data, error } = await this.table
        .select('status')
        .eq('project_id', projectId);

      if (error) return this.handleError(error);

      const stats = {
        total: data.length,
        todo: 0,
        in_progress: 0,
        in_review: 0,
        completed: 0,
        cancelled: 0,
      };

      data.forEach((task) => {
        if (task.status in stats) {
          stats[task.status as keyof typeof stats]++;
        }
      });

      return this.handleSuccess(stats);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Apply filters to query
   */
  protected applyFilters(query: any, filters?: TaskFilters) {
    if (!filters) return query;

    if (filters.project_id) {
      query = query.eq('project_id', filters.project_id);
    }

    if (filters.created_by) {
      query = query.eq('created_by', filters.created_by);
    }

    if (filters.assigned_to) {
      query = query.eq('assigned_to', filters.assigned_to);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.priority) {
      query = query.eq('priority', filters.priority);
    }

    if (filters.tags && filters.tags.length > 0) {
      query = query.contains('tags', filters.tags);
    }

    if (filters.parent_task_id !== undefined) {
      if (filters.parent_task_id === null) {
        query = query.is('parent_task_id', null);
      } else {
        query = query.eq('parent_task_id', filters.parent_task_id);
      }
    }

    if (filters.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
      );
    }

    return query;
  }
}

export const taskService = new TaskService();
export default taskService;
