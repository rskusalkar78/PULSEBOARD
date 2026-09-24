/**
 * Contexts Index
 * Central export point for all context providers
 */

export { ToastProvider, useToastContext } from './ToastContext';
export type { ToastProviderProps } from './ToastContext';

export { TaskProvider, useTaskContext } from './TaskContext';
export type {
  TaskProviderProps,
  TaskContextType,
  TaskFilter,
  TaskSort,
  TaskPagination,
} from './TaskContext';

export { GlobalSearchProvider, useGlobalSearch } from './GlobalSearchContext';
export type { GlobalSearchContextType } from './GlobalSearchContext';
