/**
 * Activity Service
 * Service for managing activity feed
 */

import { BaseService } from './base.service';
import type {
  Activity,
  ActivityInsert,
  ActivityFilters,
  ActivityWithRelations,
  ApiResponse,
} from '@/types';

class ActivityService extends BaseService<
  Activity,
  ActivityInsert,
  never, // Activities are immutable
  ActivityFilters
> {
  protected tableName = 'activities';

  /**
   * Get activity with relations
   */
  async getWithRelations(id: string): Promise<ApiResponse<ActivityWithRelations>> {
    try {
      const { data, error } = await this.table
        .select(
          `
          *,
          actor:profiles!actor_id(*),
          project:projects(*),
          team:teams(*)
        `
        )
        .eq('id', id)
        .single();

      if (error) return this.handleError(error);

      return this.handleSuccess(data as ActivityWithRelations);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get activities for a project
   */
  async getProjectActivities(projectId: string, limit = 50): Promise<ApiResponse<Activity[]>> {
    try {
      const { data, error } = await this.table
        .select('*, actor:profiles!actor_id(*)')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) return this.handleError(error);

      return this.handleSuccess(data as Activity[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get activities for a team
   */
  async getTeamActivities(teamId: string, limit = 50): Promise<ApiResponse<Activity[]>> {
    try {
      const { data, error } = await this.table
        .select('*, actor:profiles!actor_id(*)')
        .eq('team_id', teamId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) return this.handleError(error);

      return this.handleSuccess(data as Activity[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get activities by a user
   */
  async getUserActivities(userId: string, limit = 50): Promise<ApiResponse<Activity[]>> {
    try {
      const { data, error } = await this.table
        .select('*, project:projects(*), team:teams(*)')
        .eq('actor_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) return this.handleError(error);

      return this.handleSuccess(data as Activity[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get activities for a specific entity
   */
  async getEntityActivities(
    entityType: Activity['entity_type'],
    entityId: string,
    limit = 50
  ): Promise<ApiResponse<Activity[]>> {
    try {
      const { data, error } = await this.table
        .select('*, actor:profiles!actor_id(*)')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) return this.handleError(error);

      return this.handleSuccess(data as Activity[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get recent activities (feed)
   */
  async getRecentActivities(limit = 50): Promise<ApiResponse<Activity[]>> {
    try {
      const { data, error } = await this.table
        .select('*, actor:profiles!actor_id(*), project:projects(*)')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) return this.handleError(error);

      return this.handleSuccess(data as Activity[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Log an activity
   */
  async log(
    actorId: string,
    action: string,
    entityType: Activity['entity_type'],
    entityId: string,
    metadata?: Record<string, unknown>,
    projectId?: string,
    teamId?: string
  ): Promise<ApiResponse<Activity>> {
    return this.create({
      actor_id: actorId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      metadata: metadata || {},
      project_id: projectId,
      team_id: teamId,
    });
  }

  /**
   * Apply filters to query
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected applyFilters(query: any, filters?: ActivityFilters) {
    if (!filters) return query;

    if (filters.actor_id) {
      query = query.eq('actor_id', filters.actor_id);
    }

    if (filters.entity_type) {
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

    if (filters.action) {
      query = query.eq('action', filters.action);
    }

    return query;
  }

  // Override update to prevent modifications (activities are immutable)
  async update(): Promise<ApiResponse<Activity>> {
    return this.handleError(new Error('Activities cannot be updated'));
  }
}

export const activityService = new ActivityService();
export default activityService;
