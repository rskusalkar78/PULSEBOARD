/**
 * Hooks Index
 * Central export point for all custom hooks
 */

export { useAsync, useAsyncApi } from './useAsync';
export type { UseAsyncState, UseAsyncOptions } from './useAsync';

export { useLoading, useDebouncedLoading, useOptimistic } from './useLoading';
export type { UseLoadingReturn } from './useLoading';

export { useError, useFieldErrors, useRetry } from './useError';
export type { UseErrorReturn, UseFieldErrorsReturn, UseRetryReturn, FieldError } from './useError';

export { useToast, setGlobalToast, toast } from './useToast';
export type { Toast, ToastType, ToastOptions, UseToastReturn } from './useToast';

export { useProfile } from './useProfile';
