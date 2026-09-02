/**
 * Project Service
 * Service for managing projects
 */

import { BaseService } from './base.service';
import { callFunction } from '@/lib/supabase';
import type {
  Project,
  ProjectInsert,
  ProjectUpdate,
  ProjectFilters,
  ProjectWithRelations,
  ApiResponse,
} from '@/types';

class ProjectService extends BaseService<Project, ProjectInsert, ProjectUpdate, ProjectFilters> {
  protected tableName = 'projects';

  /**
   * Get project with relations
   */
  async getWithRelations(id: string): Promise<ApiResponse<ProjectWithRelations>> {
    try {
      const { data, error } = await this.table
        .select(
          `
          *,
          owner:profiles!owner_id(*),
          team:teams(*)
        `
        )
        .eq('id', id)
        .single();

      if (error) return this.handleError(error);

      return this.handleSuccess(data as ProjectWithRelations);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get project by slug
   */
  async getBySlug(
    ownerIdOrTeamId: string,
    slug: string,
    isTeamProject = false
  ): Promise<ApiResponse<Project>> {
    try {
      let query = this.table.select('*').eq('slug', slug);

      if (isTeamProject) {
        query = query.eq('team_id', ownerIdOrTeamId);
      } else {
        query = query.eq('owner_id', ownerIdOrTeamId);
      }

      const { data, error } = await query.single();

      if (error) return this.handleError(error);

      return this.handleSuccess(data as Project);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Check if user can access project
   */
  async canUserAccess(userId: string, projectId: string): Promise<ApiResponse<boolean>> {
    try {
      const { data, error } = await callFunction('can_access_project', {
        user_uuid: userId,
        project_uuid: projectId,
      });

      if (error) return this.handleError(error);

      return this.handleSuccess(data as boolean);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get user's projects
   */
  async getUserProjects(userId: string): Promise<ApiResponse<Project[]>> {
    try {
      const { data, error } = await this.table
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      if (error) return this.handleError(error);

      return this.handleSuccess(data as Project[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get team projects
   */
  async getTeamProjects(teamId: string): Promise<ApiResponse<Project[]>> {
    try {
      const { data, error } = await this.table
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: false });

      if (error) return this.handleError(error);

      return this.handleSuccess(data as Project[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get accessible projects for user
   */
  async getAccessibleProjects(userId: string): Promise<ApiResponse<Project[]>> {
    try {
      // Get projects where user is owner, or public projects, or team projects
      const { data, error } = await this.table
        .select(
          `
          *,
          team:teams!inner(
            team_members!inner(user_id)
          )
        `
        )
        .or(
          `owner_id.eq.${userId},visibility.eq.public,and(visibility.eq.team,team.team_members.user_id.eq.${userId})`
        )
        .order('created_at', { ascending: false });

      if (error) return this.handleError(error);

      return this.handleSuccess(data as Project[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Archive project
   */
  async archive(id: string): Promise<ApiResponse<Project>> {
    return this.update(id, { status: 'archived' });
  }

  /**
   * Unarchive project
   */
  async unarchive(id: string): Promise<ApiResponse<Project>> {
    return this.update(id, { status: 'active' });
  }

  /**
   * Complete project
   */
  async complete(id: string): Promise<ApiResponse<Project>> {
    return this.update(id, { status: 'completed' });
  }

  /**
   * Update project settings
   */
  async updateSettings(
    id: string,
    settings: Partial<Project['settings']>
  ): Promise<ApiResponse<Project>> {
    try {
      // Get current settings
      const currentProject = await this.getById(id);
      if (!currentProject.success || !currentProject.data) {
        return currentProject;
      }

      // Merge settings
      const updatedSettings = {
        ...currentProject.data.settings,
        ...settings,
      };

      return this.update(id, { settings: updatedSettings });
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get projects by status
   */
  async getByStatus(status: Project['status'], userId?: string): Promise<ApiResponse<Project[]>> {
    try {
      let query = this.table.select('*').eq('status', status);

      if (userId) {
        query = query.eq('owner_id', userId);
      }

      const { data, error } = await query.order('created_at', {
        ascending: false,
      });

      if (error) return this.handleError(error);

      return this.handleSuccess(data as Project[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Search projects
   */
  async search(query: string, limit = 10): Promise<ApiResponse<Project[]>> {
    try {
      const { data, error } = await this.table
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(limit);

      if (error) return this.handleError(error);

      return this.handleSuccess(data as Project[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Apply filters to query
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected applyFilters(query: any, filters?: ProjectFilters) {
    if (!filters) return query;

    if (filters.owner_id) {
      query = query.eq('owner_id', filters.owner_id);
    }

    if (filters.team_id) {
      query = query.eq('team_id', filters.team_id);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.visibility) {
      query = query.eq('visibility', filters.visibility);
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    return query;
  }
}

export const projectService = new ProjectService();
export default projectService;
