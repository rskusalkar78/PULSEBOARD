/**
 * Database Types
 * Auto-generated TypeScript types for Supabase database schema
 * These types mirror the database structure defined in migrations
 */

// =====================================================
// ENUMS
// =====================================================

export type UserRole = 'user' | 'admin' | 'manager';

export type TeamMemberRole = 'owner' | 'admin' | 'member' | 'viewer';

export type ProjectStatus = 'active' | 'archived' | 'completed' | 'on_hold';

export type ProjectVisibility = 'private' | 'team' | 'public';

export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'completed' | 'cancelled';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type ActivityEntityType = 'project' | 'task' | 'team' | 'user' | 'comment';

export type NotificationType =
  'mention' | 'assignment' | 'comment' | 'status_change' | 'due_date' | 'team_invite' | 'system';

export type NotificationEntityType = 'project' | 'task' | 'team' | 'comment';

export type AnalyticsEventCategory = 'user' | 'project' | 'task' | 'team' | 'system';

// =====================================================
// PREFERENCE & SETTINGS TYPES
// =====================================================

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  language: string;
}

export interface TeamSettings {
  defaultProjectVisibility: ProjectVisibility;
  allowMemberInvites: boolean;
  requireApproval: boolean;
}

export interface TeamMemberPermissions {
  canCreateProjects: boolean;
  canDeleteProjects: boolean;
  canManageMembers: boolean;
  canManageSettings: boolean;
}

export interface ProjectSettings {
  taskPrefix: string;
  allowComments: boolean;
  requireTaskApproval: boolean;
}

// =====================================================
// DATABASE TABLES
// =====================================================

export interface Profile {
  id: string; // UUID references auth.users(id)
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  bio: string | null;
  timezone: string;
  preferences: UserPreferences;
  onboarded: boolean;
  last_seen_at: string | null; // ISO timestamp
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface Team {
  id: string; // UUID
  name: string;
  slug: string;
  description: string | null;
  avatar_url: string | null;
  owner_id: string; // UUID references profiles(id)
  settings: TeamSettings;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface TeamMember {
  id: string; // UUID
  team_id: string; // UUID references teams(id)
  user_id: string; // UUID references profiles(id)
  role: TeamMemberRole;
  permissions: TeamMemberPermissions;
  joined_at: string; // ISO timestamp
  invited_by: string | null; // UUID references profiles(id)
}

export interface Project {
  id: string; // UUID
  name: string;
  description: string | null;
  slug: string;
  owner_id: string; // UUID references profiles(id)
  team_id: string | null; // UUID references teams(id)
  status: ProjectStatus;
  visibility: ProjectVisibility;
  color: string;
  icon: string | null;
  start_date: string | null; // ISO date
  due_date: string | null; // ISO date
  settings: ProjectSettings;
  metadata: Record<string, unknown>;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface Task {
  id: string; // UUID
  title: string;
  description: string | null;
  project_id: string; // UUID references projects(id)
  created_by: string; // UUID references profiles(id)
  assigned_to: string | null; // UUID references profiles(id)
  status: TaskStatus;
  priority: TaskPriority;
  tags: string[];
  due_date: string | null; // ISO timestamp
  completed_at: string | null; // ISO timestamp
  estimated_hours: number | null;
  actual_hours: number | null;
  position: number;
  parent_task_id: string | null; // UUID references tasks(id)
  metadata: Record<string, unknown>;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface Activity {
  id: string; // UUID
  actor_id: string; // UUID references profiles(id)
  action: string;
  entity_type: ActivityEntityType;
  entity_id: string; // UUID
  project_id: string | null; // UUID references projects(id)
  team_id: string | null; // UUID references teams(id)
  metadata: Record<string, unknown>;
  created_at: string; // ISO timestamp
}

export interface Notification {
  id: string; // UUID
  user_id: string; // UUID references profiles(id)
  type: NotificationType;
  title: string;
  message: string | null;
  action_url: string | null;
  read: boolean;
  read_at: string | null; // ISO timestamp
  entity_type: NotificationEntityType | null;
  entity_id: string | null; // UUID
  metadata: Record<string, unknown>;
  created_at: string; // ISO timestamp
}

export interface AnalyticsEvent {
  id: string; // UUID
  user_id: string | null; // UUID references profiles(id)
  event_name: string;
  event_category: AnalyticsEventCategory;
  properties: Record<string, unknown>;
  session_id: string | null; // UUID
  ip_address: string | null;
  user_agent: string | null;
  created_at: string; // ISO timestamp
}

// =====================================================
// INSERT TYPES (for creating new records)
// =====================================================

export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at' | 'last_seen_at'> &
  Partial<Pick<Profile, 'role' | 'timezone' | 'preferences' | 'onboarded'>>;

export type TeamInsert = Omit<Team, 'id' | 'created_at' | 'updated_at'> &
  Partial<Pick<Team, 'settings'>>;

export type TeamMemberInsert = Omit<TeamMember, 'id' | 'joined_at'> &
  Partial<Pick<TeamMember, 'role' | 'permissions' | 'invited_by'>>;

export type ProjectInsert = Omit<Project, 'id' | 'created_at' | 'updated_at'> &
  Partial<
    Pick<
      Project,
      | 'description'
      | 'team_id'
      | 'status'
      | 'visibility'
      | 'color'
      | 'icon'
      | 'start_date'
      | 'due_date'
      | 'settings'
      | 'metadata'
    >
  >;

export type TaskInsert = Omit<Task, 'id' | 'created_at' | 'updated_at' | 'completed_at'> &
  Partial<
    Pick<
      Task,
      | 'description'
      | 'assigned_to'
      | 'status'
      | 'priority'
      | 'tags'
      | 'due_date'
      | 'estimated_hours'
      | 'actual_hours'
      | 'position'
      | 'parent_task_id'
      | 'metadata'
    >
  >;

export type ActivityInsert = Omit<Activity, 'id' | 'created_at'> &
  Partial<Pick<Activity, 'project_id' | 'team_id' | 'metadata'>>;

export type NotificationInsert = Omit<Notification, 'id' | 'created_at' | 'read' | 'read_at'> &
  Partial<Pick<Notification, 'message' | 'action_url' | 'entity_type' | 'entity_id' | 'metadata'>>;

export type AnalyticsEventInsert = Omit<AnalyticsEvent, 'id' | 'created_at'> &
  Partial<
    Pick<AnalyticsEvent, 'user_id' | 'properties' | 'session_id' | 'ip_address' | 'user_agent'>
  >;

// =====================================================
// UPDATE TYPES (for updating existing records)
// =====================================================

export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'email' | 'created_at' | 'updated_at'>>;

export type TeamUpdate = Partial<Omit<Team, 'id' | 'slug' | 'created_at' | 'updated_at'>>;

export type TeamMemberUpdate = Partial<
  Omit<TeamMember, 'id' | 'team_id' | 'user_id' | 'joined_at'>
>;

export type ProjectUpdate = Partial<Omit<Project, 'id' | 'owner_id' | 'created_at' | 'updated_at'>>;

export type TaskUpdate = Partial<
  Omit<Task, 'id' | 'project_id' | 'created_by' | 'created_at' | 'updated_at'>
>;

export type NotificationUpdate = Partial<Omit<Notification, 'id' | 'user_id' | 'created_at'>>;

// =====================================================
// EXTENDED TYPES WITH RELATIONS
// =====================================================

export interface ProfileWithTeams extends Profile {
  teams?: TeamMemberWithTeam[];
}

export interface TeamWithMembers extends Team {
  members?: TeamMemberWithProfile[];
  owner?: Profile;
  _count?: {
    members: number;
    projects: number;
  };
}

export interface TeamMemberWithProfile extends TeamMember {
  profile?: Profile;
}

export interface TeamMemberWithTeam extends TeamMember {
  team?: Team;
}

export interface ProjectWithRelations extends Project {
  owner?: Profile;
  team?: Team;
  _count?: {
    tasks: number;
    activities: number;
  };
}

export interface TaskWithRelations extends Task {
  project?: Project;
  created_by_profile?: Profile;
  assigned_to_profile?: Profile;
  parent_task?: Task;
  subtasks?: Task[];
}

export interface ActivityWithRelations extends Activity {
  actor?: Profile;
  project?: Project;
  team?: Team;
}

export interface NotificationWithRelations extends Notification {
  user?: Profile;
}

// =====================================================
// QUERY FILTER TYPES
// =====================================================

export interface ProfileFilters {
  role?: UserRole;
  search?: string;
  onboarded?: boolean;
}

export interface TeamFilters {
  owner_id?: string;
  search?: string;
}

export interface ProjectFilters {
  owner_id?: string;
  team_id?: string;
  status?: ProjectStatus;
  visibility?: ProjectVisibility;
  search?: string;
}

export interface TaskFilters {
  project_id?: string;
  created_by?: string;
  assigned_to?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  tags?: string[];
  parent_task_id?: string | null;
  search?: string;
}

export interface ActivityFilters {
  actor_id?: string;
  entity_type?: ActivityEntityType;
  entity_id?: string;
  project_id?: string;
  team_id?: string;
  action?: string;
}

export interface NotificationFilters {
  user_id?: string;
  type?: NotificationType;
  read?: boolean;
  entity_type?: NotificationEntityType;
}

export interface AnalyticsEventFilters {
  user_id?: string;
  event_name?: string;
  event_category?: AnalyticsEventCategory;
  session_id?: string;
  date_from?: string;
  date_to?: string;
}

// =====================================================
// PAGINATION & SORTING
// =====================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// =====================================================
// SUPABASE RESPONSE TYPES
// =====================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      teams: {
        Row: Team;
        Insert: TeamInsert;
        Update: TeamUpdate;
      };
      team_members: {
        Row: TeamMember;
        Insert: TeamMemberInsert;
        Update: TeamMemberUpdate;
      };
      projects: {
        Row: Project;
        Insert: ProjectInsert;
        Update: ProjectUpdate;
      };
      tasks: {
        Row: Task;
        Insert: TaskInsert;
        Update: TaskUpdate;
      };
      activities: {
        Row: Activity;
        Insert: ActivityInsert;
        Update: never; // Activities are immutable
      };
      notifications: {
        Row: Notification;
        Insert: NotificationInsert;
        Update: NotificationUpdate;
      };
      analytics_events: {
        Row: AnalyticsEvent;
        Insert: AnalyticsEventInsert;
        Update: never; // Analytics events are immutable
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_user_teams: {
        Args: { user_uuid: string };
        Returns: {
          team_id: string;
          team_name: string;
          team_slug: string;
          member_role: TeamMemberRole;
          joined_at: string;
        }[];
      };
      can_access_project: {
        Args: { user_uuid: string; project_uuid: string };
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
      team_member_role: TeamMemberRole;
      project_status: ProjectStatus;
      project_visibility: ProjectVisibility;
      task_status: TaskStatus;
      task_priority: TaskPriority;
      activity_entity_type: ActivityEntityType;
      notification_type: NotificationType;
      notification_entity_type: NotificationEntityType;
      analytics_event_category: AnalyticsEventCategory;
    };
  };
}
