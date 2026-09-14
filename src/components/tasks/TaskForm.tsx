/**
 * Task Form Component
 * Form for creating and editing tasks using React Hook Form + Zod
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createTaskFormSchema,
  editTaskFormSchema,
  type CreateTaskFormData,
  type EditTaskFormData,
} from '@/schemas/task.schema';
import { useTaskContext } from '@/contexts/TaskContext';
import { useToastContext } from '@/contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import { X, Calendar, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/styles';
import type { Task, TaskStatus, TaskPriority } from '@/types';

// =====================================================
// TYPES
// =====================================================

export interface TaskFormProps {
  task?: Task | undefined;
  projectId?: string;
  onClose?: () => void;
  onSuccess?: (task: Task) => void;
}

// =====================================================
// CONSTANTS
// =====================================================

const TASK_STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'in_review', label: 'In Review' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const TASK_PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

// =====================================================
// FORM FIELD COMPONENTS
// =====================================================

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string | undefined;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ label, required, error, children }) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
      {label}
      {required && <span className="text-rose-500">*</span>}
    </label>
    {children}
    {error && (
      <div className="flex items-center gap-2 text-sm text-rose-600 dark:text-rose-400 mt-1.5">
        <AlertCircle className="h-4 w-4" />
        {error}
      </div>
    )}
  </div>
);

// =====================================================
// MAIN COMPONENT
// =====================================================

export const TaskForm: React.FC<TaskFormProps> = ({ task, projectId, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const { createTask, updateTask } = useTaskContext();
  const toast = useToastContext();
  const isEditing = !!task;

  // Determine schema based on whether we're creating or editing
  const schema = isEditing ? editTaskFormSchema : createTaskFormSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    watch,
  } = useForm<CreateTaskFormData | EditTaskFormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: isEditing
      ? {
          title: task.title,
          description: task.description || '',
          project_id: task.project_id,
          assigned_to: task.assigned_to || '',
          status: task.status,
          priority: task.priority,
          due_date: task.due_date ? new Date(task.due_date) : undefined,
          tags: task.tags || [],
          estimated_hours: task.estimated_hours || undefined,
          parent_task_id: task.parent_task_id || '',
        }
      : {
          project_id: projectId || '',
          status: 'todo' as TaskStatus,
          priority: 'medium' as TaskPriority,
          tags: [],
        },
  });

  const tagsInput = watch('tags');

  // =====================================================
  // HANDLERS
  // =====================================================

  const onSubmit = async (data: CreateTaskFormData | EditTaskFormData) => {
    try {
      // Convert date to ISO string if needed
      const submitData = {
        ...data,
        due_date: data.due_date ? new Date(data.due_date).toISOString() : null,
      };

      let result: Task | null = null;

      if (isEditing) {
        result = await updateTask(task.id, submitData);
      } else {
        result = await createTask(submitData);
      }

      if (result) {
        onSuccess?.(result);
        if (!onClose) {
          navigate('/tasks');
        } else {
          onClose();
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save task';
      toast.error(message);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.currentTarget;
      const tag = input.value.trim();

      if (tag && !tagsInput?.includes(tag)) {
        // Note: This would need form state update - simpler approach in actual implementation
        input.value = '';
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = (tagsInput || []).filter((tag) => tag !== tagToRemove);
    reset({ ...watch(), tags: newTags });
  };

  return (
    <div className="bg-white dark:bg-slate-950 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          {isEditing ? 'Edit Task' : 'Create Task'}
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Title */}
        <FormField label="Task Title" required error={errors.title?.message}>
          <input
            {...register('title')}
            type="text"
            placeholder="Enter task title"
            className={cn(
              'w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500',
              errors.title
                ? 'border-rose-300 dark:border-rose-700'
                : 'border-slate-200 dark:border-slate-800'
            )}
          />
        </FormField>

        {/* Description */}
        <FormField label="Description" error={errors.description?.message}>
          <textarea
            {...register('description')}
            placeholder="Enter task description (optional)"
            rows={4}
            className={cn(
              'w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none',
              errors.description
                ? 'border-rose-300 dark:border-rose-700'
                : 'border-slate-200 dark:border-slate-800'
            )}
          />
        </FormField>

        {/* Grid: Project, Status, Priority */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Project ID */}
          {!isEditing && (
            <FormField label="Project" required error={errors.project_id?.message}>
              <select
                {...register('project_id')}
                className={cn(
                  'w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500',
                  errors.project_id
                    ? 'border-rose-300 dark:border-rose-700'
                    : 'border-slate-200 dark:border-slate-800'
                )}
              >
                <option value="">Select a project</option>
                <option value="project-1">Sample Project 1</option>
                <option value="project-2">Sample Project 2</option>
              </select>
            </FormField>
          )}

          {/* Status */}
          <FormField label="Status" required error={errors.status?.message}>
            <select
              {...register('status')}
              className={cn(
                'w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500',
                errors.status
                  ? 'border-rose-300 dark:border-rose-700'
                  : 'border-slate-200 dark:border-slate-800'
              )}
            >
              {TASK_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FormField>

          {/* Priority */}
          <FormField label="Priority" required error={errors.priority?.message}>
            <select
              {...register('priority')}
              className={cn(
                'w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500',
                errors.priority
                  ? 'border-rose-300 dark:border-rose-700'
                  : 'border-slate-200 dark:border-slate-800'
              )}
            >
              {TASK_PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        {/* Grid: Assignee, Due Date, Estimated Hours */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Assignee */}
          <FormField label="Assign To" error={errors.assigned_to?.message}>
            <select
              {...register('assigned_to')}
              className={cn(
                'w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500',
                errors.assigned_to
                  ? 'border-rose-300 dark:border-rose-700'
                  : 'border-slate-200 dark:border-slate-800'
              )}
            >
              <option value="">Unassigned</option>
              <option value="user-1">John Doe</option>
              <option value="user-2">Jane Smith</option>
            </select>
          </FormField>

          {/* Due Date */}
          <FormField label="Due Date" error={errors.due_date?.message}>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                {...register('due_date')}
                type="date"
                className={cn(
                  'w-full pl-10 pr-4 py-2.5 border rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500',
                  errors.due_date
                    ? 'border-rose-300 dark:border-rose-700'
                    : 'border-slate-200 dark:border-slate-800'
                )}
              />
            </div>
          </FormField>

          {/* Estimated Hours */}
          <FormField label="Estimated Hours" error={errors.estimated_hours?.message}>
            <input
              {...register('estimated_hours', { valueAsNumber: true })}
              type="number"
              placeholder="0.0"
              step="0.5"
              min="0"
              className={cn(
                'w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500',
                errors.estimated_hours
                  ? 'border-rose-300 dark:border-rose-700'
                  : 'border-slate-200 dark:border-slate-800'
              )}
            />
          </FormField>
        </div>

        {/* Labels/Tags */}
        <FormField label="Labels" error={errors.tags?.message}>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Type and press Enter to add tags"
              onKeyDown={handleAddTag}
              className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            {tagsInput && tagsInput.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tagsInput.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleRemoveTag(tag)}
                    type="button"
                    className="inline-flex items-center gap-1 px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-lg text-sm font-medium hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors"
                  >
                    {tag}
                    <X className="h-3 w-3" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </FormField>

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 font-medium hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className={cn(
              'flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors',
              isSubmitting || !isValid
                ? 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-400 cursor-not-allowed'
                : 'bg-violet-600 hover:bg-violet-700 text-white'
            )}
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
