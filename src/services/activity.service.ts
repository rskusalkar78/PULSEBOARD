/**
 * Activity Service
 * Centralized service for tracking and querying system activity events
 */

import { BaseService } from './base.service';
import { isSupabaseConfigured } from '@/lib/supabaseConfig';
import type {
  Activity,
  ActivityInsert,
  ActivityFilters,
  ActivityWithRelations,
  ActivityActionType,
  ActivityEntityType,
  ActivityMetadata,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  SortParams,
  TaskPriority,
  TaskStatus,
} from '@/types';

const STORAGE_KEY = 'pulseboard_activity_feed_v1';

// Initial realistic activities across all 7 event types for demo & offline mode
const INITIAL_DEMO_ACTIVITIES: ActivityWithRelations[] = [
  {
    id: 'act-1',
    actor_id: 'usr-1',
    action: 'task_completed',
    entity_type: 'task',
    entity_id: 'tsk-101',
    project_id: 'prj-1',
    team_id: 'team-1',
    metadata: {
      title: 'Completed UI Design Tokens',
      description: 'Marked "Design System Tokens Migration" as completed.',
      task_title: 'Design System Tokens Migration',
      task_status: 'completed',
      task_priority: 'high',
      project_name: 'PulseBoard Redesign',
    },
    created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(), // 12 mins ago
    actor: {
      id: 'usr-1',
      email: 'alex.morgan@pulseboard.dev',
      full_name: 'Alex Morgan',
      avatar_url: null,
      role: 'admin',
      bio: 'Lead Architect',
      timezone: 'America/New_York',
      preferences: {
        theme: 'dark',
        notifications: { email: true, push: true, inApp: true },
        language: 'en',
      },
      onboarded: true,
      last_seen_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    project: {
      id: 'prj-1',
      name: 'PulseBoard Redesign',
      slug: 'pulseboard-redesign',
      description: 'Next-generation dashboard UI and architecture overhaul',
      owner_id: 'usr-1',
      team_id: 'team-1',
      status: 'active',
      visibility: 'team',
      color: '#8b5cf6',
      icon: 'Layers',
      start_date: '2026-09-01',
      due_date: '2026-10-15',
      settings: { taskPrefix: 'PB', allowComments: true, requireTaskApproval: false },
      metadata: { priority: 'high', progress: 68 },
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 'act-2',
    actor_id: 'usr-2',
    action: 'task_assigned',
    entity_type: 'task',
    entity_id: 'tsk-102',
    project_id: 'prj-1',
    team_id: 'team-1',
    metadata: {
      title: 'Assigned Task to Sophia Chen',
      description: 'Assigned "WebSocket Live Updates Engine" to Sophia Chen.',
      task_title: 'WebSocket Live Updates Engine',
      task_priority: 'urgent',
      assigned_to_id: 'usr-3',
      assigned_to_name: 'Sophia Chen',
      project_name: 'PulseBoard Redesign',
    },
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    actor: {
      id: 'usr-2',
      email: 'marcus.vance@pulseboard.dev',
      full_name: 'Marcus Vance',
      avatar_url: null,
      role: 'manager',
      bio: 'Engineering Manager',
      timezone: 'America/Los_Angeles',
      preferences: {
        theme: 'dark',
        notifications: { email: true, push: true, inApp: true },
        language: 'en',
      },
      onboarded: true,
      last_seen_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 'act-3',
    actor_id: 'usr-3',
    action: 'task_created',
    entity_type: 'task',
    entity_id: 'tsk-103',
    project_id: 'prj-2',
    team_id: 'team-1',
    metadata: {
      title: 'Created New Task',
      description: 'Created task "Audit Accessible Contrast Ratios" in Design System.',
      task_title: 'Audit Accessible Contrast Ratios',
      task_status: 'todo',
      task_priority: 'medium',
      project_name: 'Accessibility Compliance',
    },
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    actor: {
      id: 'usr-3',
      email: 'sophia.chen@pulseboard.dev',
      full_name: 'Sophia Chen',
      avatar_url: null,
      role: 'user',
      bio: 'Frontend Engineer',
      timezone: 'Europe/London',
      preferences: {
        theme: 'light',
        notifications: { email: true, push: false, inApp: true },
        language: 'en',
      },
      onboarded: true,
      last_seen_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 'act-4',
    actor_id: 'usr-1',
    action: 'project_updated',
    entity_type: 'project',
    entity_id: 'prj-1',
    project_id: 'prj-1',
    team_id: 'team-1',
    metadata: {
      title: 'Updated Project Settings',
      description: 'Extended target completion date to October 15, 2026 and set priority to High.',
      project_name: 'PulseBoard Redesign',
      changes: {
        due_date: { from: '2026-09-30', to: '2026-10-15' },
        priority: { from: 'medium', to: 'high' },
      },
    },
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago
    actor: {
      id: 'usr-1',
      email: 'alex.morgan@pulseboard.dev',
      full_name: 'Alex Morgan',
      avatar_url: null,
      role: 'admin',
      bio: 'Lead Architect',
      timezone: 'America/New_York',
      preferences: {
        theme: 'dark',
        notifications: { email: true, push: true, inApp: true },
        language: 'en',
      },
      onboarded: true,
      last_seen_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 'act-5',
    actor_id: 'usr-4',
    action: 'member_joined',
    entity_type: 'team',
    entity_id: 'team-1',
    project_id: null,
    team_id: 'team-1',
    metadata: {
      title: 'New Member Joined Team',
      description: 'Elena Rostova joined Core Engineering as Senior Backend Engineer.',
      team_name: 'Core Engineering',
      member_role: 'member',
      assigned_to_name: 'Elena Rostova',
    },
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6 hours ago
    actor: {
      id: 'usr-4',
      email: 'elena.rostova@pulseboard.dev',
      full_name: 'Elena Rostova',
      avatar_url: null,
      role: 'user',
      bio: 'Senior Backend Engineer',
      timezone: 'Europe/Berlin',
      preferences: {
        theme: 'dark',
        notifications: { email: true, push: true, inApp: true },
        language: 'en',
      },
      onboarded: true,
      last_seen_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 'act-6',
    actor_id: 'usr-2',
    action: 'settings_changed',
    entity_type: 'settings',
    entity_id: 'team-1',
    project_id: null,
    team_id: 'team-1',
    metadata: {
      title: 'Workspace Settings Changed',
      description: 'Enabled strict pull request approval and team-wide visibility rules.',
      setting_scope: 'team',
      team_name: 'Core Engineering',
      changes: {
        requireApproval: { from: false, to: true },
        defaultProjectVisibility: { from: 'private', to: 'team' },
      },
    },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
    actor: {
      id: 'usr-2',
      email: 'marcus.vance@pulseboard.dev',
      full_name: 'Marcus Vance',
      avatar_url: null,
      role: 'manager',
      bio: 'Engineering Manager',
      timezone: 'America/Los_Angeles',
      preferences: {
        theme: 'dark',
        notifications: { email: true, push: true, inApp: true },
        language: 'en',
      },
      onboarded: true,
      last_seen_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 'act-7',
    actor_id: 'usr-1',
    action: 'project_created',
    entity_type: 'project',
    entity_id: 'prj-3',
    project_id: 'prj-3',
    team_id: 'team-1',
    metadata: {
      title: 'Created Project "AI Insights Engine"',
      description: 'Initialized new repository for AI metrics summarization & telemetry.',
      project_name: 'AI Insights Engine',
      task_priority: 'urgent',
    },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // Yesterday
    actor: {
      id: 'usr-1',
      email: 'alex.morgan@pulseboard.dev',
      full_name: 'Alex Morgan',
      avatar_url: null,
      role: 'admin',
      bio: 'Lead Architect',
      timezone: 'America/New_York',
      preferences: {
        theme: 'dark',
        notifications: { email: true, push: true, inApp: true },
        language: 'en',
      },
      onboarded: true,
      last_seen_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
];

type ActivityListener = (activity: ActivityWithRelations) => void;

class ActivityService extends BaseService<
  Activity,
  ActivityInsert,
  never, // Activities are immutable
  ActivityFilters
> {
  protected tableName = 'activities';
  private listeners: Set<ActivityListener> = new Set();
  private localActivitiesCache: ActivityWithRelations[] | null = null;

  constructor() {
    super();
    this.initLocalStore();
  }

  /**
   * Initialize local activities fallback storage
   */
  private initLocalStore(): ActivityWithRelations[] {
    if (this.localActivitiesCache) return this.localActivitiesCache;

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          this.localActivitiesCache = JSON.parse(stored);
          return this.localActivitiesCache!;
        }
      }
    } catch {
      // Ignore storage read errors
    }

    this.localActivitiesCache = [...INITIAL_DEMO_ACTIVITIES];
    this.persistLocalStore();
    return this.localActivitiesCache;
  }

  private persistLocalStore(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage && this.localActivitiesCache) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.localActivitiesCache));
      }
    } catch {
      // Ignore storage write errors
    }
  }

  /**
   * Subscribe to new activities in real-time
   */
  subscribe(listener: ActivityListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(activity: ActivityWithRelations) {
    this.listeners.forEach((listener) => {
      try {
        listener(activity);
      } catch (err) {
        console.error('Error in activity subscriber:', err);
      }
    });
  }

  /**
   * Core Log method
   */
  async log(
    actorId: string,
    action: ActivityActionType | string,
    entityType: ActivityEntityType,
    entityId: string,
    metadata?: ActivityMetadata,
    projectId?: string | null,
    teamId?: string | null
  ): Promise<ApiResponse<ActivityWithRelations>> {
    const activityRecord: ActivityWithRelations = {
      id:
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      actor_id: actorId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      metadata: (metadata || {}) as Record<string, unknown>,
      project_id: projectId || null,
      team_id: teamId || null,
      created_at: new Date().toISOString(),
      actor: {
        id: actorId,
        email: 'current.user@pulseboard.dev',
        full_name: 'Alex Morgan',
        avatar_url: null,
        role: 'admin',
        bio: null,
        timezone: 'UTC',
        preferences: {
          theme: 'dark',
          notifications: { email: true, push: true, inApp: true },
          language: 'en',
        },
        onboarded: true,
        last_seen_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };

    const withTimeout = async <T>(promise: Promise<T>, ms = 400): Promise<T> => {
      let timer: ReturnType<typeof setTimeout>;
      const timeoutPromise = new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('Network request timed out')), ms);
      });
      try {
        return await Promise.race([promise, timeoutPromise]);
      } finally {
        clearTimeout(timer);
      }
    };

    // Try Supabase first if configured
    if (isSupabaseConfigured()) {
      try {
        const response = await withTimeout(
          this.create({
            actor_id: actorId,
            action,
            entity_type: entityType,
            entity_id: entityId,
            metadata: activityRecord.metadata,
            project_id: projectId || null,
            team_id: teamId || null,
          }),
          400
        );

        if (response.success && response.data) {
          activityRecord.id = response.data.id;
          activityRecord.created_at = response.data.created_at;
        }
      } catch {
        // Fall through to local fallback
      }
    }

    // Save to local cache
    const current = this.initLocalStore();
    this.localActivitiesCache = [
      activityRecord,
      ...current.filter((a) => a.id !== activityRecord.id),
    ];
    this.persistLocalStore();

    // Broadcast
    this.notifyListeners(activityRecord);

    return this.handleSuccess(activityRecord);
  }

  // =====================================================
  // SPECIALIZED LOGGING HELPERS
  // =====================================================

  /**
   * 1. Track: project created
   */
  async logProjectCreated(
    actorId: string,
    project: {
      id: string;
      name: string;
      description?: string | null | undefined;
      team_id?: string | null | undefined;
      priority?: string | undefined;
    },
    metadata?: ActivityMetadata
  ): Promise<ApiResponse<ActivityWithRelations>> {
    const meta: ActivityMetadata = {
      title: `Created Project "${project.name}"`,
      description: project.description || `Initialized new project ${project.name}`,
      project_name: project.name,
      task_priority: project.priority as TaskPriority | undefined,
      ...metadata,
    };

    return this.log(
      actorId,
      'project_created',
      'project',
      project.id,
      meta,
      project.id,
      project.team_id || null
    );
  }

  /**
   * 2. Track: project updated
   */
  async logProjectUpdated(
    actorId: string,
    project: {
      id: string;
      name: string;
      team_id?: string | null | undefined;
    },
    changes?: Record<string, { from: unknown; to: unknown }> | undefined,
    metadata?: ActivityMetadata
  ): Promise<ApiResponse<ActivityWithRelations>> {
    const changeKeys = changes ? Object.keys(changes).join(', ') : 'details';
    const meta: ActivityMetadata = {
      title: `Updated Project "${project.name}"`,
      description: `Modified ${changeKeys} in project ${project.name}.`,
      project_name: project.name,
      changes: changes || undefined,
      ...metadata,
    };

    return this.log(
      actorId,
      'project_updated',
      'project',
      project.id,
      meta,
      project.id,
      project.team_id || null
    );
  }

  /**
   * 3. Track: task created
   */
  async logTaskCreated(
    actorId: string,
    task: {
      id: string;
      title: string;
      project_id: string;
      priority?: TaskPriority | undefined;
      status?: TaskStatus | undefined;
      assigned_to?: string | null | undefined;
      projectName?: string | undefined;
    },
    metadata?: ActivityMetadata
  ): Promise<ApiResponse<ActivityWithRelations>> {
    const meta: ActivityMetadata = {
      title: `Created Task "${task.title}"`,
      description: `Added new task to ${task.projectName || 'project'}.`,
      task_title: task.title,
      task_status: task.status,
      task_priority: task.priority,
      project_name: task.projectName,
      assigned_to_id: task.assigned_to || undefined,
      ...metadata,
    };

    return this.log(actorId, 'task_created', 'task', task.id, meta, task.project_id);
  }

  /**
   * 4. Track: task completed
   */
  async logTaskCompleted(
    actorId: string,
    task: {
      id: string;
      title: string;
      project_id: string;
      priority?: TaskPriority | undefined;
      projectName?: string | undefined;
    },
    metadata?: ActivityMetadata
  ): Promise<ApiResponse<ActivityWithRelations>> {
    const meta: ActivityMetadata = {
      title: `Completed Task "${task.title}"`,
      description: `Marked "${task.title}" as completed.`,
      task_title: task.title,
      task_status: 'completed',
      task_priority: task.priority,
      project_name: task.projectName,
      ...metadata,
    };

    return this.log(actorId, 'task_completed', 'task', task.id, meta, task.project_id);
  }

  /**
   * 5. Track: task assigned
   */
  async logTaskAssigned(
    actorId: string,
    task: {
      id: string;
      title: string;
      project_id: string;
      projectName?: string | undefined;
    },
    assignee: { id: string; name: string },
    metadata?: ActivityMetadata
  ): Promise<ApiResponse<ActivityWithRelations>> {
    const meta: ActivityMetadata = {
      title: `Assigned Task to ${assignee.name}`,
      description: `Assigned "${task.title}" to ${assignee.name}.`,
      task_title: task.title,
      assigned_to_id: assignee.id,
      assigned_to_name: assignee.name,
      project_name: task.projectName,
      ...metadata,
    };

    return this.log(actorId, 'task_assigned', 'task', task.id, meta, task.project_id);
  }

  /**
   * 6. Track: member joined
   */
  async logMemberJoined(
    actorId: string,
    teamId: string,
    member: { id: string; name: string; role: string; teamName?: string | undefined },
    metadata?: ActivityMetadata
  ): Promise<ApiResponse<ActivityWithRelations>> {
    const meta: ActivityMetadata = {
      title: `${member.name} joined the team`,
      description: `${member.name} joined as ${member.role} in ${member.teamName || 'the workspace'}.`,
      team_name: member.teamName,
      assigned_to_id: member.id,
      assigned_to_name: member.name,
      member_role: member.role,
      ...metadata,
    };

    return this.log(actorId, 'member_joined', 'team', teamId, meta, null, teamId);
  }

  /**
   * 7. Track: settings changed
   */
  async logSettingsChanged(
    actorId: string,
    scope: 'user' | 'team' | 'project' | 'system',
    changes: Record<string, { from: unknown; to: unknown }>,
    targetId?: string | undefined,
    metadata?: ActivityMetadata
  ): Promise<ApiResponse<ActivityWithRelations>> {
    const keys = Object.keys(changes).join(', ');
    const meta: ActivityMetadata = {
      title: `Updated ${scope.toUpperCase()} Settings`,
      description: `Changed configuration options: ${keys}.`,
      setting_scope: scope,
      changes,
      ...metadata,
    };

    return this.log(
      actorId,
      'settings_changed',
      'settings',
      targetId || actorId,
      meta,
      scope === 'project' ? targetId : null,
      scope === 'team' ? targetId : null
    );
  }

  // =====================================================
  // QUERY & FEED METHODS
  // =====================================================

  /**
   * Get activity with full relations
   */
  async getWithRelations(id: string): Promise<ApiResponse<ActivityWithRelations>> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await withTimeout(
          this.table
            .select(
              `
            *,
            actor:profiles!actor_id(*),
            project:projects(*),
            team:teams(*)
          `
            )
            .eq('id', id)
            .single(),
          400
        );

        if (!error && data) {
          return this.handleSuccess(data as ActivityWithRelations);
        }
      } catch {
        // Fall back to local store
      }
    }

    const item = this.initLocalStore().find((a) => a.id === id);
    if (item) return this.handleSuccess(item);

    return this.handleError(new Error(`Activity with id ${id} not found`));
  }

  /**
   * Get filtered, paginated activity feed
   */
  async getFeed(
    filters?: ActivityFilters,
    pagination: PaginationParams = { page: 1, limit: 10 },
    sort: SortParams = { sortBy: 'created_at', sortOrder: 'desc' }
  ): Promise<ApiResponse<PaginatedResponse<ActivityWithRelations>>> {
    const page = Math.max(1, pagination.page || 1);
    const limit = Math.max(1, pagination.limit || 10);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    if (isSupabaseConfigured()) {
      try {
        let query = this.table.select(
          `
          *,
          actor:profiles!actor_id(*),
          project:projects(*),
          team:teams(*)
        `,
          { count: 'exact' }
        );

        query = this.applyFilters(query, filters);

        const sortBy = sort.sortBy || 'created_at';
        query = query.order(sortBy, { ascending: sort.sortOrder === 'asc' });
        query = query.range(from, to);

        const { data, error, count } = await withTimeout(query, 400);

        if (!error && data && data.length > 0) {
          const total = count || data.length;
          const totalPages = Math.ceil(total / limit);

          return this.handleSuccess({
            data: data as ActivityWithRelations[],
            pagination: {
              page,
              limit,
              total,
              totalPages,
              hasMore: page < totalPages,
            },
          });
        }
      } catch {
        // Fall through to local fallback
      }
    }

    // Local in-memory filtering and pagination
    let items = [...this.initLocalStore()];

    if (filters) {
      if (filters.action && filters.action !== 'all') {
        items = items.filter((a) => a.action === filters.action);
      }
      if (filters.entity_type && (filters.entity_type as string) !== 'all') {
        items = items.filter((a) => a.entity_type === filters.entity_type);
      }
      if (filters.actor_id) {
        items = items.filter((a) => a.actor_id === filters.actor_id);
      }
      if (filters.project_id) {
        items = items.filter((a) => a.project_id === filters.project_id);
      }
      if (filters.team_id) {
        items = items.filter((a) => a.team_id === filters.team_id);
      }
      if (filters.search && filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        items = items.filter((a) => {
          const title = (a.metadata?.title as string) || '';
          const desc = (a.metadata?.description as string) || '';
          const actorName = a.actor?.full_name || '';
          const projectName = (a.metadata?.project_name as string) || a.project?.name || '';
          const taskTitle = (a.metadata?.task_title as string) || '';
          return (
            title.toLowerCase().includes(q) ||
            desc.toLowerCase().includes(q) ||
            actorName.toLowerCase().includes(q) ||
            projectName.toLowerCase().includes(q) ||
            taskTitle.toLowerCase().includes(q) ||
            a.action.toLowerCase().includes(q)
          );
        });
      }
      if (filters.date_from) {
        const fromTime = new Date(filters.date_from).getTime();
        items = items.filter((a) => new Date(a.created_at).getTime() >= fromTime);
      }
      if (filters.date_to) {
        const toTime = new Date(filters.date_to).getTime();
        items = items.filter((a) => new Date(a.created_at).getTime() <= toTime);
      }
    }

    // Sort
    items.sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return sort.sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });

    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginatedItems = items.slice(from, from + limit);

    return this.handleSuccess({
      data: paginatedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  }

  /**
   * Get activities for a project
   */
  async getProjectActivities(
    projectId: string,
    limit = 50
  ): Promise<ApiResponse<ActivityWithRelations[]>> {
    const res = await this.getFeed({ project_id: projectId }, { page: 1, limit });
    return this.handleSuccess(res.data?.data || []);
  }

  /**
   * Get activities for a team
   */
  async getTeamActivities(
    teamId: string,
    limit = 50
  ): Promise<ApiResponse<ActivityWithRelations[]>> {
    const res = await this.getFeed({ team_id: teamId }, { page: 1, limit });
    return this.handleSuccess(res.data?.data || []);
  }

  /**
   * Get activities by a user
   */
  async getUserActivities(
    userId: string,
    limit = 50
  ): Promise<ApiResponse<ActivityWithRelations[]>> {
    const res = await this.getFeed({ actor_id: userId }, { page: 1, limit });
    return this.handleSuccess(res.data?.data || []);
  }

  /**
   * Get activities for a specific entity
   */
  async getEntityActivities(
    entityType: Activity['entity_type'],
    entityId: string,
    limit = 50
  ): Promise<ApiResponse<ActivityWithRelations[]>> {
    const res = await this.getFeed(
      { entity_type: entityType, entity_id: entityId },
      { page: 1, limit }
    );
    return this.handleSuccess(res.data?.data || []);
  }

  /**
   * Get recent activities (feed)
   */
  async getRecentActivities(limit = 10): Promise<ApiResponse<ActivityWithRelations[]>> {
    const res = await this.getFeed(undefined, { page: 1, limit });
    return this.handleSuccess(res.data?.data || []);
  }

  /**
   * Get stats summary for activities
   */
  async getActivityStats(): Promise<
    ApiResponse<{
      totalToday: number;
      tasksCompleted: number;
      projectsUpdated: number;
      activeMembers: number;
    }>
  > {
    const all = this.initLocalStore();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayItems = all.filter((a) => new Date(a.created_at).getTime() >= today.getTime());
    const tasksCompleted = all.filter((a) => a.action === 'task_completed').length;
    const projectsUpdated = all.filter(
      (a) => a.action === 'project_updated' || a.action === 'project_created'
    ).length;
    const uniqueActors = new Set(all.map((a) => a.actor_id)).size;

    return this.handleSuccess({
      totalToday: todayItems.length || all.length,
      tasksCompleted,
      projectsUpdated,
      activeMembers: uniqueActors,
    });
  }

  /**
   * Clear local storage activities (for tests / reset)
   */
  resetLocalStore(): void {
    this.localActivitiesCache = [...INITIAL_DEMO_ACTIVITIES];
    this.persistLocalStore();
  }

  /**
   * Apply filters to query
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected override applyFilters(query: any, filters?: ActivityFilters) {
    if (!filters) return query;

    if (filters.actor_id) {
      query = query.eq('actor_id', filters.actor_id);
    }

    if (filters.entity_type && (filters.entity_type as string) !== 'all') {
      query = query.eq('entity_type', filters.entity_type);
    }

    if (filters.entity_id) {
      query = query.eq('entity_id', filters.entity_id);
    }

    if (filters.project_id) {
      query = query.eq('project_id', filters.project_id);
    }

    if (filters.team_id) {
      query = query.eq('team_id', filters.team_id);
    }

    if (filters.action && filters.action !== 'all') {
      query = query.eq('action', filters.action);
    }

    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from);
    }

    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to);
    }

    return query;
  }

  // Override update to prevent modifications (activities are immutable)
  override async update(): Promise<ApiResponse<Activity>> {
    return this.handleError(new Error('Activities cannot be updated'));
  }
}

export const activityService = new ActivityService();
export default activityService;
