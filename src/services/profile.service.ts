/**
 * Profile Service
 * Service for managing user profiles
 */

import { BaseService } from './base.service';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/lib/supabaseConfig';
import type {
  Profile,
  ProfileInsert,
  ProfileUpdate,
  ProfileFilters,
  ApiResponse,
  ProfileWithTeams,
} from '@/types';

class ProfileService extends BaseService<Profile, ProfileInsert, ProfileUpdate, ProfileFilters> {
  protected tableName = 'profiles';

  /**
   * Get current user's profile
   */
  async getCurrentProfile(): Promise<ApiResponse<Profile>> {
    try {
      if (!isSupabaseConfigured() || !supabase) {
        return this.handleError(new Error('Supabase not configured'));
      }
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return this.handleError(new Error('Not authenticated'));
      }

      return this.getById(user.id);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Upload user avatar
   */
  async uploadAvatar(userId: string, file: File): Promise<ApiResponse<string>> {
    try {
      if (isSupabaseConfigured() && supabase) {
        const fileExt = file.name.split('.').pop() || 'png';
        const filePath = `${userId}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file, { upsert: true });

        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
          if (urlData?.publicUrl) {
            return this.handleSuccess(urlData.publicUrl);
          }
        }
      }

      // Offline / Mock fallback: Convert file to Data URL
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(this.handleSuccess(reader.result as string));
        };
        reader.onerror = () => {
          resolve(this.handleError(new Error('Failed to read image file')));
        };
        reader.readAsDataURL(file);
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get profile by email
   */
  async getByEmail(email: string): Promise<ApiResponse<Profile>> {
    try {
      const { data, error } = await this.table.select('*').eq('email', email).single();

      if (error) return this.handleError(error);

      return this.handleSuccess(data as Profile);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get profile with teams
   */
  async getWithTeams(id: string): Promise<ApiResponse<ProfileWithTeams>> {
    try {
      const { data, error } = await this.table
        .select(
          `
          *,
          teams:team_members(
            id,
            role,
            joined_at,
            team:teams(*)
          )
        `
        )
        .eq('id', id)
        .single();

      if (error) return this.handleError(error);

      return this.handleSuccess(data as ProfileWithTeams);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Search profiles by name or email
   */
  async search(query: string, limit = 10): Promise<ApiResponse<Profile[]>> {
    try {
      const { data, error } = await this.table
        .select('*')
        .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(limit);

      if (error) return this.handleError(error);

      return this.handleSuccess(data as Profile[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Update current user's profile
   */
  async updateCurrentProfile(data: ProfileUpdate): Promise<ApiResponse<Profile>> {
    try {
      if (!supabase) return this.handleError(new Error('Supabase not configured'));
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return this.handleError(new Error('Not authenticated'));
      }

      return this.update(user.id, data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Update user preferences
   */
  async updatePreferences(
    id: string,
    preferences: Partial<Profile['preferences']>
  ): Promise<ApiResponse<Profile>> {
    try {
      // Get current preferences
      const currentProfile = await this.getById(id);
      if (!currentProfile.success || !currentProfile.data) {
        return currentProfile;
      }

      // Merge preferences
      const updatedPreferences = {
        ...currentProfile.data.preferences,
        ...preferences,
      };

      return this.update(id, { preferences: updatedPreferences });
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Update last seen timestamp
   */
  async updateLastSeen(id: string): Promise<ApiResponse<boolean>> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (this.table.update as any)({
        last_seen_at: new Date().toISOString(),
      }).eq('id', id);

      if (error) return this.handleError(error);

      return this.handleSuccess(true);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Mark user as onboarded
   */
  async markOnboarded(id: string): Promise<ApiResponse<Profile>> {
    return this.update(id, { onboarded: true });
  }

  /**
   * Get profiles by role
   */
  async getByRole(role: Profile['role']): Promise<ApiResponse<Profile[]>> {
    try {
      const { data, error } = await this.table.select('*').eq('role', role);

      if (error) return this.handleError(error);

      return this.handleSuccess(data as Profile[]);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Apply filters to query
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected override applyFilters(query: any, filters?: ProfileFilters) {
    if (!filters) return query;

    if (filters.role) {
      query = query.eq('role', filters.role);
    }

    if (filters.onboarded !== undefined) {
      query = query.eq('onboarded', filters.onboarded);
    }

    if (filters.search) {
      query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    return query;
  }
}

export const profileService = new ProfileService();
export default profileService;
