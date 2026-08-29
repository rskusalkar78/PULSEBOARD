/**
 * Library Index
 * Central export point for core library modules
 */

export { isSupabaseConfigured } from './supabaseConfig';

// Configuration
export { config, validateConfig, isDevelopment, isProduction, isDebugEnabled } from './config';
export type { AppConfig } from './config';

// Supabase Client
export {
  supabase,
  getCurrentUser,
  getSession,
  isAuthenticated,
  signOut,
  onAuthStateChange,
  getTable,
  callFunction,
  isAuthError,
  isPermissionError,
  isNotFoundError,
  formatSupabaseError,
} from './supabase';

// Error Handling
export {
  AppError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ValidationError,
  NetworkError,
  DatabaseError,
  RateLimitError,
  isAuthError as isAuthenticationError,
  isAuthorizationError,
  isNotFoundError as isNotFound,
  isValidationError,
  isNetworkError,
  isRateLimitError,
  toApiError,
  formatErrorMessage,
  getUserFriendlyMessage,
  logError,
  isRetryableError,
  retryWithBackoff,
  getInitialErrorState,
  handleErrorBoundary,
} from './errors';
export type { ErrorBoundaryState } from './errors';

// Storage
export {
  uploadFile,
  uploadAvatar,
  uploadProjectFile,
  getSignedUrl,
  getPublicUrl,
  downloadFile,
  deleteFile,
  deleteFiles,
  listFiles,
  validateFile,
  formatFileSize,
  getFileExtension,
  isImageFile,
  generateUniqueFilename,
  STORAGE_BUCKETS,
  MAX_FILE_SIZE,
  MAX_IMAGE_SIZE,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_DOCUMENT_TYPES,
} from './storage';
export type {
  StorageBucket,
  FileValidationOptions,
  FileValidationResult,
  UploadResult,
} from './storage';

export { supabase as default };
