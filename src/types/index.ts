/**
 * Types Index
 * Central export point for all type definitions
 */

// Database types
export type {
  // Enums
  UserRole,
  TeamMemberRole,
  ProjectStatus,
  ProjectVisibility,
  TaskStatus,
  TaskPriority,
  ActivityEntityType,
  NotificationType,
  NotificationEntityType,
  AnalyticsEventCategory,
  // Settings & Preferences
  UserPreferences,
  TeamSettings,
  TeamMemberPermissions,
  ProjectSettings,
  // Core Tables
  Profile,
  Team,
  TeamMember,
  Project,
  Task,
  Activity,
  Notification,
  AnalyticsEvent,
  // Insert Types
  ProfileInsert,
  TeamInsert,
  TeamMemberInsert,
  ProjectInsert,
  TaskInsert,
  ActivityInsert,
  NotificationInsert,
  AnalyticsEventInsert,
  // Update Types
  ProfileUpdate,
  TeamUpdate,
  TeamMemberUpdate,
  ProjectUpdate,
  TaskUpdate,
  NotificationUpdate,
  // Extended Types with Relations
  ProfileWithTeams,
  TeamWithMembers,
  TeamMemberWithProfile,
  TeamMemberWithTeam,
  ProjectWithRelations,
  TaskWithRelations,
  ActivityWithRelations,
  NotificationWithRelations,
  // Filter Types
  ProfileFilters,
  TeamFilters,
  ProjectFilters,
  TaskFilters,
  ActivityFilters,
  NotificationFilters,
  AnalyticsEventFilters,
  // Pagination & Sorting
  PaginationParams,
  SortParams,
  PaginatedResponse,
  // Database Schema
  Database,
} from './database.types';

// Supabase types
export type {
  // Supabase Client Types
  Tables,
  TablesInsert,
  TablesUpdate,
  Enums,
  Functions,
  // API Response Types
  ApiResponse,
  ApiError,
  SupabaseResponse,
  // Auth Types
  SignUpData,
  SignInData,
  AuthUser,
  AuthSession,
  // Realtime Types
  RealtimeChannel,
  RealtimePayload,
  RealtimeCallback,
  // Query Builder Types
  QueryOptions,
  CountOptions,
  // Storage Types
  StorageBucket,
  FileObject,
  UploadOptions,
  SignedUrlOptions,
  // Helper Utility Types
  DeepPartial,
  RequireAtLeastOne,
  RequireOnlyOne,
  // Service Method Types
  ServiceOptions,
  CreateOptions,
  UpdateOptions,
  DeleteOptions,
  ListOptions,
  // Validation Types
  ValidationError,
  ValidationResult,
  // Webhook Types
  WebhookPayload,
  // Batch Operation Types
  BatchOperation,
  BatchResult,
} from './supabase.types';
