/**
 * Team Service
 * Service for managing teams and team memberships
 */

import { BaseService } from './base.service';
import { supabase } from '@/lib/supabase';
import type {
  Team,
  TeamInsert,
  TeamUpdate,
  TeamFilters,
  TeamMember,
  TeamMemberInsert,
  TeamMemberUpdate,
  TeamWithMembers,
  ApiResponse,
} from '@/types';

class TeamService extends BaseService<Team, TeamInsert, TeamUpdate, TeamFilters> {
  protected tableName = 'teams';

  /**
   * Get team with members
   */
  async getWithMembers(id: string): Promise<ApiResponse<TeamWithMembers>> {
    try {
      const { data, error } = await this.table
        .select(
          `
          *,
          owner:profiles!owner_id(*),
          members:team_members(
            *,
            profile:profiles(*)
          )
        `
        )
        .eq('id', id)
        .single();

      if (error) return this.handleError(error);

      return this.handleSuccess(data as TeamWithMembers);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get team by slug
   */
  async getBySlug(slug: string): Promise<ApiResponse<Team>> {
    try {
      const { data, error } = await this.table.select('*').eq('slug', slug).single();

      if (error) return this.handleError(error);

      return this.handleSuccess(data as Team);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get teams for a user
   */
  async getUserTeams(userId: string): Promise<ApiResponse<Team[]>> {
    try {
      const { data, error } = await this.table
        .select(
          `
          *,
          team_members!inner(user_id)
        `
        )
        .eq('team_members.user_id', userId);

      if (error) return this.handleError(error);

      return this.handleSuccess(data as Team[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Check if user is team member
   */
  async isTeamMember(teamId: string, userId: string): Promise<ApiResponse<boolean>> {
    try {
      if (!supabase) return this.handleError(new Error('Supabase not configured'));
      const { count, error } = await supabase
        .from('team_members')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', teamId)
        .eq('user_id', userId);

      if (error) return this.handleError(error);

      return this.handleSuccess((count || 0) > 0);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Add member to team
   */
  async addMember(data: TeamMemberInsert): Promise<ApiResponse<TeamMember>> {
    try {
      if (!supabase) return this.handleError(new Error('Supabase not configured'));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: result, error } = await (supabase.from('team_members').insert as any)(data)
        .select('*')
        .single();

      if (error) return this.handleError(error);

      return this.handleSuccess(result as TeamMember);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Update team member
   */
  async updateMember(memberId: string, data: TeamMemberUpdate): Promise<ApiResponse<TeamMember>> {
    try {
      if (!supabase) return this.handleError(new Error('Supabase not configured'));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: result, error } = await (supabase.from('team_members').update as any)(data)
        .eq('id', memberId)
        .select('*')
        .single();

      if (error) return this.handleError(error);

      return this.handleSuccess(result as TeamMember);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Remove member from team
   */
  async removeMember(memberId: string): Promise<ApiResponse<boolean>> {
    try {
      if (!supabase) return this.handleError(new Error('Supabase not configured'));
      const { error } = await supabase.from('team_members').delete().eq('id', memberId);

      if (error) return this.handleError(error);

      return this.handleSuccess(true);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get team members
   */
  async getMembers(teamId: string): Promise<ApiResponse<TeamMember[]>> {
    try {
      if (!supabase) return this.handleError(new Error('Supabase not configured'));
      const { data, error } = await supabase
        .from('team_members')
        .select(
          `
          *,
          profile:profiles(*)
        `
        )
        .eq('team_id', teamId);

      if (error) return this.handleError(error);

      return this.handleSuccess(data as TeamMember[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Update team settings
   */
  async updateSettings(
    id: string,
    settings: Partial<Team['settings']>
  ): Promise<ApiResponse<Team>> {
    try {
      // Get current settings
      const currentTeam = await this.getById(id);
      if (!currentTeam.success || !currentTeam.data) {
        return currentTeam;
      }

      // Merge settings
      const updatedSettings = {
        ...currentTeam.data.settings,
        ...settings,
      };

      return this.update(id, { settings: updatedSettings });
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Transfer team ownership
   */
  async transferOwnership(teamId: string, newOwnerId: string): Promise<ApiResponse<Team>> {
    try {
      // Update team owner
      const teamResult = await this.update(teamId, { owner_id: newOwnerId });
      if (!teamResult.success) {
        return teamResult;
      }

      if (!supabase) return this.handleError(new Error('Supabase not configured'));
      // Update new owner's role to owner
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: memberError } = await (supabase.from('team_members').update as any)({
        role: 'owner',
      })
        .eq('team_id', teamId)
        .eq('user_id', newOwnerId);

      if (memberError) return this.handleError(memberError);

      return teamResult;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Apply filters to query
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected override applyFilters(query: any, filters?: TeamFilters) {
    if (!filters) return query;

    if (filters.owner_id) {
      query = query.eq('owner_id', filters.owner_id);
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    return query;
  }
}

export const teamService = new TeamService();
export default teamService;
