/**
 * Task Context
 * Global task state management for filtering, searching, and managing tasks
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Task, TaskStatus, TaskPriority, TaskInsert } from '@/types';
import { taskService } from '@/services/task.service';
import { useToastContext } from './ToastContext';

// =====================================================
// TYPES
// =====================================================

export interface TaskFilter {
  projectId?: string | undefined;
  status?: TaskStatus | undefined;
  priority?: TaskPriority | undefined;
  assignedTo?: string | undefined;
  search?: string | undefined;
  tags?: string[] | undefined;
  dueDateFrom?: string | undefined;
  dueDateTo?: string | undefined;
}

export interface TaskSort {
  sortBy: 'title' | 'priority' | 'due_date' | 'created_at' | 'updated_at' | 'status';
  sortOrder: 'asc' | 'desc';
}

export interface TaskPagination {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface TaskContextType {
  // State
  tasks: Task[];
  selectedTasks: Set<string>;
  filters: TaskFilter;
  sort: TaskSort;
  pagination: TaskPagination;
  loading: boolean;
  error: string | null;

  // Task management
  createTask: (data: Record<string, unknown>) => Promise<Task | null>;
  updateTask: (id: string, data: Record<string, unknown>) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;
  getTask: (id: string) => Promise<Task | null>;

  // List operations
  fetchTasks: (filters?: TaskFilter) => Promise<void>;
  searchTasks: (query: string) => Promise<void>;
  refreshTasks: () => Promise<void>;

  // Filtering & Sorting
  setFilters: (filters: TaskFilter) => void;
  clearFilters: () => void;
  setSort: (sort: TaskSort) => void;
  setPagination: (pagination: Partial<TaskPagination>) => void;

  // Selection
  selectTask: (id: string) => void;
  deselectTask: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  toggleTaskSelection: (id: string) => void;

  // Bulk operations
  bulkUpdateStatus: (status: TaskStatus) => Promise<boolean>;
  bulkDelete: () => Promise<boolean>;

  // Utility
  clearError: () => void;
  getTaskById: (id: string) => Task | undefined;
}

// =====================================================
// CONTEXT & PROVIDER
// =====================================================

const TaskContext = createContext<TaskContextType | null>(null);

export interface TaskProviderProps {
  children: ReactNode;
}

export function TaskProvider({ children }: TaskProviderProps) {
  const toast = useToastContext();

  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<TaskFilter>({});
  const [sort, setSort] = useState<TaskSort>({ sortBy: 'created_at', sortOrder: 'desc' });
  const [pagination, setPagination] = useState<TaskPagination>({
    page: 1,
    limit: 20,
    total: 0,
    hasMore: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // =====================================================
  // TASK MANAGEMENT OPERATIONS
  // =====================================================

  /**
   * Create a new task
   */
  const createTask = useCallback(
    async (data: Record<string, unknown>): Promise<Task | null> => {
      try {
        setLoading(true);
        setError(null);

        const result = await taskService.create(data as TaskInsert);

        if (!result.success) {
          const errorMsg = result.error?.message || 'Failed to create task';
          setError(errorMsg);
          toast.error(errorMsg);
          return null;
        }

        // Add new task to list
        setTasks((prev) => [result.data as Task, ...prev]);
        toast.success('Task created successfully');
        return result.data;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to create task';
        setError(errorMsg);
        toast.error(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  /**
   * Update an existing task
   */
  const updateTask = useCallback(
    async (id: string, data: Record<string, unknown>): Promise<Task | null> => {
      try {
        setLoading(true);
        setError(null);

        const result = await taskService.update(id, data);

        if (!result.success) {
          const errorMsg = result.error?.message || 'Failed to update task';
          setError(errorMsg);
          toast.error(errorMsg);
          return null;
        }

        // Update task in list
        setTasks((prev) => prev.map((task) => (task.id === id ? (result.data as Task) : task)));

        toast.success('Task updated successfully');
        return result.data;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to update task';
        setError(errorMsg);
        toast.error(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  /**
   * Delete a task
   */
  const deleteTask = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const result = await taskService.delete(id);

        if (!result.success) {
          const errorMsg = result.error?.message || 'Failed to delete task';
          setError(errorMsg);
          toast.error(errorMsg);
          return false;
        }

        // Remove task from list
        setTasks((prev) => prev.filter((task) => task.id !== id));
        setSelectedTasks((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });

        toast.success('Task deleted successfully');
        return true;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to delete task';
        setError(errorMsg);
        toast.error(errorMsg);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  /**
   * Get a single task
   */
  const getTask = useCallback(async (id: string): Promise<Task | null> => {
    try {
      const result = await taskService.getWithRelations(id);

      if (!result.success) {
        return null;
      }

      return result.data;
    } catch {
      return null;
    }
  }, []);

  // =====================================================
  // LIST OPERATIONS
  // =====================================================

  /**
   * Fetch tasks with current filters and sorting
   */
  const fetchTasks = useCallback(
    async (newFilters?: TaskFilter) => {
      try {
        setLoading(true);
        setError(null);

        const currentFilters = newFilters || filters;
        const page = newFilters ? 1 : pagination.page;

        const result = await taskService.advancedSearch({
          query: currentFilters.search || undefined,
          projectId: currentFilters.projectId || undefined,
          status: currentFilters.status || undefined,
          priority: currentFilters.priority || undefined,
          assignedTo: currentFilters.assignedTo || undefined,
          tags: currentFilters.tags || undefined,
          dueDateFrom: currentFilters.dueDateFrom || undefined,
          dueDateTo: currentFilters.dueDateTo || undefined,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
          page,
          limit: pagination.limit,
        });

        if (!result.success) {
          const errorMsg = result.error?.message || 'Failed to fetch tasks';
          setError(errorMsg);
          setTasks([]);
          return;
        }

        setTasks(result.data as Task[]);

        // Update filters if new ones provided
        if (newFilters) {
          setFilters(newFilters);
          setPagination((prev) => ({
            ...prev,
            page: 1,
          }));
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to fetch tasks';
        setError(errorMsg);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination, sort]
  );

  /**
   * Search tasks
   */
  const searchTasks = useCallback(
    async (query: string) => {
      try {
        setLoading(true);
        setError(null);

        const result = await taskService.search(query, {
          limit: pagination.limit,
          page: pagination.page,
          projectId: filters.projectId || undefined,
        });

        if (!result.success) {
          const errorMsg = result.error?.message || 'Failed to search tasks';
          setError(errorMsg);
          setTasks([]);
          return;
        }

        setTasks(result.data as Task[]);
        setFilters((prev) => ({ ...prev, search: query }));
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to search tasks';
        setError(errorMsg);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    },
    [filters.projectId, pagination]
  );

  /**
   * Refresh tasks (re-fetch with current filters)
   */
  const refreshTasks = useCallback(async () => {
    await fetchTasks();
  }, [fetchTasks]);

  // =====================================================
  // FILTERING & SORTING
  // =====================================================

  const handleSetFilters = useCallback((newFilters: TaskFilter) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const clearFiltersHandler = useCallback(() => {
    setFilters({});
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleSetSort = useCallback((newSort: TaskSort) => {
    setSort(newSort);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleSetPagination = useCallback((newPagination: Partial<TaskPagination>) => {
    setPagination((prev) => ({ ...prev, ...newPagination }));
  }, []);

  // =====================================================
  // SELECTION OPERATIONS
  // =====================================================

  const selectTask = useCallback((id: string) => {
    setSelectedTasks((prev) => new Set([...prev, id]));
  }, []);

  const deselectTask = useCallback((id: string) => {
    setSelectedTasks((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedTasks(new Set(tasks.map((task) => task.id)));
  }, [tasks]);

  const deselectAll = useCallback(() => {
    setSelectedTasks(new Set());
  }, []);

  const toggleTaskSelection = useCallback((id: string) => {
    setSelectedTasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  // =====================================================
  // BULK OPERATIONS
  // =====================================================

  /**
   * Bulk update status for selected tasks
   */
  const bulkUpdateStatus = useCallback(
    async (status: TaskStatus): Promise<boolean> => {
      if (selectedTasks.size === 0) {
        toast.warning('No tasks selected');
        return false;
      }

      try {
        setLoading(true);
        setError(null);

        const updates = Array.from(selectedTasks).map((taskId) =>
          taskService.update(taskId, { status })
        );

        const results = await Promise.all(updates);

        const failures = results.filter((r) => !r.success);
        if (failures.length > 0) {
          const errorMsg = `Failed to update ${failures.length} task(s)`;
          setError(errorMsg);
          toast.error(errorMsg);
          return false;
        }

        // Update tasks in state
        setTasks((prev) =>
          prev.map((task) => (selectedTasks.has(task.id) ? { ...task, status } : task))
        );

        setSelectedTasks(new Set());
        toast.success(`Updated ${results.length} task(s)`);
        return true;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to update tasks';
        setError(errorMsg);
        toast.error(errorMsg);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [selectedTasks, toast]
  );

  /**
   * Bulk delete selected tasks
   */
  const bulkDelete = useCallback(async (): Promise<boolean> => {
    if (selectedTasks.size === 0) {
      toast.warning('No tasks selected');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const taskIds = Array.from(selectedTasks);
      const result = await taskService.deleteMany(taskIds);

      if (!result.success) {
        const errorMsg = result.error?.message || 'Failed to delete tasks';
        setError(errorMsg);
        toast.error(errorMsg);
        return false;
      }

      // Remove tasks from state
      setTasks((prev) => prev.filter((task) => !selectedTasks.has(task.id)));
      setSelectedTasks(new Set());

      toast.success(`Deleted ${taskIds.length} task(s)`);
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete tasks';
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedTasks, toast]);

  // =====================================================
  // UTILITY
  // =====================================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getTaskById = useCallback(
    (id: string) => {
      return tasks.find((task) => task.id === id);
    },
    [tasks]
  );

  // =====================================================
  // CONTEXT VALUE
  // =====================================================

  const value: TaskContextType = {
    tasks,
    selectedTasks,
    filters,
    sort,
    pagination,
    loading,
    error,

    createTask,
    updateTask,
    deleteTask,
    getTask,

    fetchTasks,
    searchTasks,
    refreshTasks,

    setFilters: handleSetFilters,
    clearFilters: clearFiltersHandler,
    setSort: handleSetSort,
    setPagination: handleSetPagination,

    selectTask,
    deselectTask,
    selectAll,
    deselectAll,
    toggleTaskSelection,

    bulkUpdateStatus,
    bulkDelete,

    clearError,
    getTaskById,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

// =====================================================
// HOOKS
// =====================================================

/**
 * Hook to use task context
 */
export function useTaskContext(): TaskContextType {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error('useTaskContext must be used within TaskProvider');
  }

  return context;
}
