/**
 * Task Detail Component
 * Displays detailed information about a single task
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  AlertCircle,
  CheckCircle2,
  Edit,
  Trash2,
} from 'lucide-react';
import { useTaskContext } from '@/contexts/TaskContext';
import { cn } from '@/utils/styles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Display/Card';
import type { Task, TaskStatus, TaskPriority } from '@/types';

// =====================================================
// TYPES
// =====================================================

export interface TaskDetailProps {
  taskId?: string;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
}

// =====================================================
// CONSTANTS
// =====================================================

const STATUS_CONFIG: Record<TaskStatus, { bg: string; text: string; icon: React.ReactNode }> = {
  todo: {
    bg: 'bg-slate-100 dark:bg-slate-900',
    text: 'text-slate-700 dark:text-slate-300',
    icon: <AlertCircle className="h-5 w-5" />,
  },
  in_progress: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
    icon: <Clock className="h-5 w-5" />,
  },
  in_review: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-300',
    icon: <AlertCircle className="h-5 w-5" />,
  },
  completed: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-700 dark:text-emerald-300',
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
  cancelled: {
    bg: 'bg-rose-100 dark:bg-rose-900/30',
    text: 'text-rose-700 dark:text-rose-300',
    icon: <AlertCircle className="h-5 w-5" />,
  },
};

const PRIORITY_CONFIG: Record<TaskPriority, { color: string; bg: string; label: string }> = {
  low: { color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-900', label: 'Low' },
  medium: {
    color: 'text-blue-500',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    label: 'Medium',
  },
  high: { color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30', label: 'High' },
  urgent: { color: 'text-rose-500', bg: 'bg-rose-100 dark:bg-rose-900/30', label: 'Urgent' },
};

// =====================================================
// MAIN COMPONENT
// =====================================================

export const TaskDetail: React.FC<TaskDetailProps> = ({ taskId: propTaskId, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { id: paramTaskId } = useParams<{ id: string }>();
  const { getTask } = useTaskContext();

  const taskId = propTaskId || paramTaskId;
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch task details
  useEffect(() => {
    if (!taskId) {
      setError('No task ID provided');
      setLoading(false);
      return;
    }

    const fetchTask = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedTask = await getTask(taskId);

        if (!fetchedTask) {
          setError('Task not found');
        } else {
          setTask(fetchedTask);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load task');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId, getTask]);

  // Format functions
  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const isOverdue = () => {
    if (!task?.due_date || task.status === 'completed' || task.status === 'cancelled') {
      return false;
    }
    return new Date(task.due_date) < new Date();
  };

  // Handle edit
  const handleEdit = () => {
    if (task) {
      onEdit?.(task);
      navigate(`/tasks/${task.id}/edit`);
    }
  };

  // Handle delete
  const handleDelete = () => {
    if (!task) return;

    if (confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      onDelete?.(task.id);
      navigate('/tasks');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error || !task) {
    return (
      <Card className="border-rose-200 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-950/10">
        <CardContent className="py-12">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-rose-600 dark:text-rose-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-rose-900 dark:text-rose-200 mb-2">
              {error || 'Task not found'}
            </h3>
            <button
              onClick={() => navigate('/tasks')}
              className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition-colors"
            >
              Back to Tasks
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusConfig = STATUS_CONFIG[task.status];
  const priorityConfig = PRIORITY_CONFIG[task.priority];

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/tasks')}
          className="inline-flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tasks
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            {/* Title & Status */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-3">{task.title}</CardTitle>
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
              </div>

              {/* Priority Badge */}
              <div
                className={cn(
                  'px-4 py-2 rounded-lg font-medium text-center min-w-max',
                  priorityConfig.bg,
                  priorityConfig.color
                )}
              >
                {priorityConfig.label}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Description */}
          {task.description && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Description
              </h3>
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Due Date */}
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                <Calendar className="h-4 w-4" />
                Due Date
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn('font-medium', isOverdue() && 'text-rose-600 dark:text-rose-400')}
                >
                  {formatDate(task.due_date)}
                </span>
                {isOverdue() && (
                  <span className="inline-block px-2 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded text-xs font-medium">
                    Overdue
                  </span>
                )}
              </div>
            </div>

            {/* Estimated Hours */}
            {task.estimated_hours && (
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  <Clock className="h-4 w-4" />
                  Estimated Hours
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {task.estimated_hours} hours
                </span>
              </div>
            )}

            {/* Actual Hours */}
            {task.actual_hours && (
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  <Clock className="h-4 w-4" />
                  Actual Hours
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {task.actual_hours} hours
                </span>
              </div>
            )}

            {/* Project */}
            {task.project_id && (
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  <AlertCircle className="h-4 w-4" />
                  Project
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {task.project_id}
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                <Tag className="h-4 w-4" />
                Tags
              </div>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-3 py-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-lg text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <div>
              <span className="font-medium">Created:</span> {formatDate(task.created_at)} at{' '}
              {formatTime(task.created_at)}
            </div>
            <div>
              <span className="font-medium">Updated:</span> {formatDate(task.updated_at)} at{' '}
              {formatTime(task.updated_at)}
            </div>
            {task.completed_at && (
              <div>
                <span className="font-medium">Completed:</span> {formatDate(task.completed_at)} at{' '}
                {formatTime(task.completed_at)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskDetail;
