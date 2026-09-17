/**
 * Task List Component
 * Displays a list of tasks with filtering, sorting, and search capabilities
 */

import React, { useEffect, useState } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  MoreVertical,
  Trash2,
  Edit,
} from 'lucide-react';
import { useTaskContext } from '@/contexts/TaskContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/styles';
import { Card, CardContent } from '@/components/ui/Display/Card';
import type { Task, TaskStatus, TaskPriority } from '@/types';

// =====================================================
// TYPES
// =====================================================

export interface TaskListProps {
  projectId?: string;
  onTaskSelect?: (task: Task) => void;
  showFilters?: boolean;
  showSearch?: boolean;
}

// =====================================================
// CONSTANTS
// =====================================================

const STATUS_CONFIG: Record<TaskStatus, { bg: string; text: string; icon: React.ReactNode }> = {
  todo: {
    bg: 'bg-slate-100 dark:bg-slate-900',
    text: 'text-slate-700 dark:text-slate-300',
    icon: <AlertCircle className="h-4 w-4" />,
  },
  in_progress: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
    icon: <Clock className="h-4 w-4" />,
  },
  in_review: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-300',
    icon: <AlertCircle className="h-4 w-4" />,
  },
  completed: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-700 dark:text-emerald-300',
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  cancelled: {
    bg: 'bg-rose-100 dark:bg-rose-900/30',
    text: 'text-rose-700 dark:text-rose-300',
    icon: <AlertCircle className="h-4 w-4" />,
  },
};

const PRIORITY_CONFIG: Record<TaskPriority, { color: string; label: string }> = {
  low: { color: 'text-slate-500', label: 'Low' },
  medium: { color: 'text-blue-500', label: 'Medium' },
  high: { color: 'text-amber-500', label: 'High' },
  urgent: { color: 'text-rose-500', label: 'Urgent' },
};

// =====================================================
// COMPONENTS
// =====================================================

/**
 * Task item row component
 */
const TaskRow: React.FC<{
  task: Task;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}> = ({ task, isSelected, onSelect, onEdit, onDelete }) => {
  const statusConfig = STATUS_CONFIG[task.status];
  const priorityConfig = PRIORITY_CONFIG[task.priority];
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: new Date(date).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  };

  return (
    <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
      {/* Checkbox */}
      <td className="px-6 py-4 w-12">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(task.id)}
          className="rounded border-slate-300 dark:border-slate-700 cursor-pointer"
        />
      </td>

      {/* Title */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => onSelect(task.id)} className="text-left flex-1 group">
            <p className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-1">
              {task.title}
            </p>
            {task.description && (
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
                {task.description}
              </p>
            )}
          </button>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <div
          className={cn(
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium',
            statusConfig.bg,
            statusConfig.text
          )}
        >
          {statusConfig.icon}
          <span className="capitalize">{task.status.replace('_', ' ')}</span>
        </div>
      </td>

      {/* Priority */}
      <td className="px-6 py-4">
        <span className={cn('text-sm font-medium', priorityConfig.color)}>
          {priorityConfig.label}
        </span>
      </td>

      {/* Due Date */}
      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
        {formatDate(task.due_date)}
      </td>

      {/* Tags */}
      <td className="px-6 py-4">
        <div className="flex gap-1 flex-wrap max-w-xs">
          {task.tags &&
            task.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-block px-2.5 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          {task.tags && task.tags.length > 2 && (
            <span className="inline-block px-2.5 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-xs font-medium">
              +{task.tags.length - 2}
            </span>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <MoreVertical className="h-4 w-4 text-slate-500 dark:text-slate-400" />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-10">
            <button
              onClick={() => {
                onEdit(task);
                setShowMenu(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors first:rounded-t-lg"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={() => {
                onDelete(task.id);
                setShowMenu(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors last:rounded-b-lg"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

/**
 * Filter toolbar component
 */
const FilterToolbar: React.FC<{
  onFilterChange: (filters: Record<string, unknown>) => void;
  onSearch: (query: string) => void;
}> = ({ onFilterChange, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | ''>('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = (e.target.value || undefined) as TaskStatus | undefined;
    setStatusFilter(status || '');
    onFilterChange({ status });
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const priority = (e.target.value || undefined) as TaskPriority | undefined;
    setPriorityFilter(priority || '');
    onFilterChange({ priority });
  };

  return (
    <div className="flex gap-4 flex-wrap mb-6">
      {/* Search */}
      <div className="flex-1 min-w-xs relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      {/* Status Filter */}
      <select
        value={statusFilter}
        onChange={handleStatusChange}
        className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500"
      >
        <option value="">All Status</option>
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="in_review">In Review</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      {/* Priority Filter */}
      <select
        value={priorityFilter}
        onChange={handlePriorityChange}
        className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500"
      >
        <option value="">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
      </select>
    </div>
  );
};

// =====================================================
// MAIN COMPONENT
// =====================================================

export const TaskList: React.FC<TaskListProps> = ({
  projectId,
  onTaskSelect,
  showFilters = true,
  showSearch = true,
}) => {
  const navigate = useNavigate();
  const {
    tasks,
    loading,
    error,
    filters,
    setFilters,
    fetchTasks,
    deleteTask,
    selectedTasks,
    toggleTaskSelection,
    selectAll,
    deselectAll,
  } = useTaskContext();

  // Fetch tasks on component mount or when project changes
  useEffect(() => {
    fetchTasks(projectId ? { ...filters, projectId } : filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleFilterChange = (newFilters: Record<string, unknown>) => {
    setFilters({
      ...filters,
      ...Object.fromEntries(
        Object.entries(newFilters).filter(([, v]) => v !== undefined && v !== null && v !== '')
      ),
      projectId: projectId || filters.projectId,
    });
  };

  const handleSearch = (query: string) => {
    setFilters({
      ...filters,
      search: query,
      projectId: projectId || filters.projectId,
    });
  };

  const handleEdit = (task: Task) => {
    navigate(`/tasks/${task.id}/edit`);
  };

  const handleDelete = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId);
    }
  };

  if (error && tasks.length === 0) {
    return (
      <Card className="border-rose-200 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-950/10">
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-rose-600 dark:text-rose-400 mx-auto mb-2" />
            <p className="text-sm text-rose-700 dark:text-rose-300">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Tasks {tasks.length > 0 && <span className="text-slate-500">({tasks.length})</span>}
        </h2>
        <button
          onClick={() => navigate('/tasks/create')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Task
        </button>
      </div>

      {/* Filters */}
      {showFilters && showSearch && (
        <FilterToolbar onFilterChange={handleFilterChange} onSearch={handleSearch} />
      )}

      {/* Task Table */}
      <Card>
        {loading && tasks.length === 0 ? (
          <CardContent className="py-12">
            <div className="text-center">
              <div className="inline-block">
                <div className="h-8 w-8 bg-slate-300 dark:bg-slate-700 rounded-lg animate-pulse mb-4" />
              </div>
              <p className="text-slate-600 dark:text-slate-400">Loading tasks...</p>
            </div>
          </CardContent>
        ) : tasks.length === 0 ? (
          <CardContent className="py-12">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">
                No tasks found
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Create your first task to get started
              </p>
            </div>
          </CardContent>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700 dark:text-slate-300 w-12">
                    <input
                      type="checkbox"
                      checked={selectedTasks.size === tasks.length && tasks.length > 0}
                      onChange={() => {
                        if (selectedTasks.size === tasks.length) {
                          deselectAll();
                        } else {
                          selectAll();
                        }
                      }}
                      className="rounded border-slate-300 dark:border-slate-700 cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                    Task
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                    Labels
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700 dark:text-slate-300 w-12">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    isSelected={selectedTasks.has(task.id)}
                    onSelect={() => toggleTaskSelection(task.id)}
                    onEdit={() => {
                      handleEdit(task);
                      onTaskSelect?.(task);
                    }}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Loading indicator */}
      {loading && tasks.length > 0 && (
        <div className="text-center text-sm text-slate-600 dark:text-slate-400">
          Updating tasks...
        </div>
      )}
    </div>
  );
};

export default TaskList;
