/**
 * Task Schema
 * Zod validation schemas for task forms and operations
 */

import { z } from 'zod';
import type { TaskStatus, TaskPriority } from '@/types';

// =====================================================
// ENUMS & CONSTANTS
// =====================================================

export const TASK_STATUS_OPTIONS = [
  'todo',
  'in_progress',
  'in_review',
  'completed',
  'cancelled',
] as const;

export const TASK_PRIORITY_OPTIONS = ['low', 'medium', 'high', 'urgent'] as const;

// =====================================================
// FIELD SCHEMAS
// =====================================================

/**
 * Title validation: 1-255 characters, required
 */
export const taskTitleSchema = z
  .string()
  .min(1, 'Task title is required')
  .max(255, 'Task title must be less than 255 characters')
  .trim();

/**
 * Description validation: 0-5000 characters, optional
 */
export const taskDescriptionSchema = z
  .string()
  .max(5000, 'Task description must be less than 5000 characters')
  .trim()
  .optional()
  .nullable();

/**
 * Status validation: must be valid status
 */
export const taskStatusSchema = z.enum([
  'todo',
  'in_progress',
  'in_review',
  'completed',
  'cancelled',
] as unknown as [TaskStatus, ...TaskStatus[]]);

/**
 * Priority validation: must be valid priority
 */
export const taskPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent'] as unknown as [
  TaskPriority,
  ...TaskPriority[],
]);

/**
 * Project ID validation: UUID format, required
 */
export const taskProjectIdSchema = z.string().uuid('Invalid project ID').describe('Project ID');

/**
 * Assignee validation: UUID format or null
 */
export const taskAssigneeSchema = z
  .string()
  .uuid('Invalid assignee ID')
  .optional()
  .nullable()
  .describe('User ID to assign task to');

/**
 * Due date validation: ISO date or null
 */
export const taskDueDateSchema = z
  .union([
    z.string().datetime(),
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid due date'),
    z.date(),
  ])
  .optional()
  .nullable()
  .refine((date) => {
    if (!date) return true;

    const dueDate =
      typeof date === 'string'
        ? new Date(date.length === 10 ? `${date}T00:00:00.000Z` : date)
        : date;

    return !isNaN(dueDate.getTime());
  }, 'Invalid due date')
  .describe('Due date for task');

/**
 * Labels/Tags validation: array of strings, max 10 tags
 */
export const taskLabelsSchema = z
  .array(z.string().trim().min(1).max(50))
  .max(10, 'Maximum 10 labels allowed')
  .default([])
  .describe('Task labels/tags');

/**
 * Estimated hours validation: positive number or null
 */
export const taskEstimatedHoursSchema = z
  .number()
  .positive('Estimated hours must be positive')
  .optional()
  .nullable()
  .describe('Estimated hours to complete task');

/**
 * Actual hours validation: positive number or null
 */
export const taskActualHoursSchema = z
  .number()
  .positive('Actual hours must be positive')
  .optional()
  .nullable()
  .describe('Actual hours spent on task');

// =====================================================
// FORM SCHEMAS
// =====================================================

/**
 * Create task form schema
 * Used when creating a new task
 */
export const createTaskFormSchema = z.object({
  title: taskTitleSchema,
  description: taskDescriptionSchema,
  project_id: taskProjectIdSchema,
  assigned_to: taskAssigneeSchema,
  status: taskStatusSchema.default('todo' as TaskStatus),
  priority: taskPrioritySchema.default('medium' as TaskPriority),
  due_date: taskDueDateSchema,
  tags: taskLabelsSchema,
  estimated_hours: taskEstimatedHoursSchema,
  parent_task_id: z
    .string()
    .uuid('Invalid parent task ID')
    .optional()
    .nullable()
    .describe('Parent task ID for subtasks'),
});

export type CreateTaskFormData = z.infer<typeof createTaskFormSchema>;

/**
 * Edit task form schema
 * Used when editing an existing task
 * All fields are optional except project_id
 */
export const editTaskFormSchema = createTaskFormSchema.partial().extend({
  project_id: taskProjectIdSchema, // Keep project_id as required
});

export type EditTaskFormData = z.infer<typeof editTaskFormSchema>;

/**
 * Task status update schema
 * Minimal schema for just updating status
 */
export const taskStatusUpdateSchema = z.object({
  status: taskStatusSchema,
});

export type TaskStatusUpdateData = z.infer<typeof taskStatusUpdateSchema>;

/**
 * Task assignment schema
 * For assigning/unassigning tasks to users
 */
export const taskAssignmentSchema = z.object({
  assigned_to: z
    .string()
    .uuid('Invalid assignee ID')
    .nullable()
    .optional()
    .describe('User ID to assign task to, or null to unassign'),
});

export type TaskAssignmentData = z.infer<typeof taskAssignmentSchema>;

/**
 * Task priority update schema
 * For updating task priority
 */
export const taskPriorityUpdateSchema = z.object({
  priority: taskPrioritySchema,
});

export type TaskPriorityUpdateData = z.infer<typeof taskPriorityUpdateSchema>;

/**
 * Task due date update schema
 * For updating due date
 */
export const taskDueDateUpdateSchema = z.object({
  due_date: taskDueDateSchema,
});

export type TaskDueDateUpdateData = z.infer<typeof taskDueDateUpdateSchema>;

/**
 * Task labels update schema
 * For updating tags/labels
 */
export const taskLabelsUpdateSchema = z.object({
  tags: taskLabelsSchema,
});

export type TaskLabelsUpdateData = z.infer<typeof taskLabelsUpdateSchema>;

/**
 * Bulk task status update schema
 * For updating status of multiple tasks
 */
export const bulkTaskStatusUpdateSchema = z.object({
  task_ids: z
    .array(z.string().uuid())
    .min(1, 'At least one task ID is required')
    .describe('Array of task IDs to update'),
  status: taskStatusSchema,
});

export type BulkTaskStatusUpdateData = z.infer<typeof bulkTaskStatusUpdateSchema>;

/**
 * Task search/filter schema
 * For filtering and searching tasks
 */
export const taskFilterSchema = z.object({
  project_id: z.string().uuid().optional(),
  assigned_to: z.string().uuid().optional().nullable(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
  due_date_from: z.union([z.string().datetime(), z.date()]).optional(),
  due_date_to: z.union([z.string().datetime(), z.date()]).optional(),
  sort_by: z
    .enum(['title', 'priority', 'due_date', 'created_at', 'updated_at', 'status'])
    .optional()
    .default('created_at'),
  sort_order: z.enum(['asc', 'desc']).optional().default('desc'),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(20),
});

export type TaskFilterData = z.infer<typeof taskFilterSchema>;

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Validate task creation data
 */
export function validateCreateTask(data: unknown) {
  return createTaskFormSchema.safeParse(data);
}

/**
 * Validate task edit data
 */
export function validateEditTask(data: unknown) {
  return editTaskFormSchema.safeParse(data);
}

/**
 * Validate task filter data
 */
export function validateTaskFilter(data: unknown) {
  return taskFilterSchema.safeParse(data);
}

/**
 * Parse and validate task data from form input
 * Handles date conversion and type coercion
 */
export function parseTaskFormData(data: Record<string, unknown>) {
  // Convert date strings to Date objects if needed
  const parsed = {
    ...data,
    due_date:
      data.due_date instanceof Date
        ? data.due_date
        : data.due_date
          ? new Date(data.due_date as string)
          : null,
    estimated_hours: data.estimated_hours ? Number(data.estimated_hours) : null,
  };

  return parsed;
}
