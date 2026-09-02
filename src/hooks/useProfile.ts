import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { profileService } from '@/services/profile.service';
import { validateAvatarFile, type ProfileFormData } from '@/features/auth/schemas/profileSchemas';
import type { UserPreferences, ProfileUpdate } from '@/types/database.types';

export function useProfile() {
  const { user, updateUser } = useAuth();
  const { mode: currentTheme, setMode: setThemeMode } = useTheme();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Default initial profile state derived from user in AuthContext
  const [profileData, setProfileData] = useState<ProfileFormData>({
    fullName: user?.name || 'Alex Morgan',
    email: user?.email || 'alex.morgan@pulseboard.io',
    role: user?.role || 'Executive Lead',
    timezone: user?.timezone || 'America/New_York',
    bio: user?.bio || 'Executive team member focused on operational performance and metrics.',
    avatarUrl: user?.avatarUrl || '',
    preferences: user?.preferences || {
      theme: (currentTheme as 'light' | 'dark' | 'system') || 'dark',
      notifications: {
        email: true,
        push: true,
        inApp: true,
      },
      language: 'en',
    },
  });

  // Keep local state in sync when user context changes
  useEffect(() => {
    if (user) {
      setProfileData((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
        role: user.role || prev.role,
        timezone: user.timezone || prev.timezone,
        bio: user.bio !== undefined ? user.bio : prev.bio,
        avatarUrl: user.avatarUrl !== undefined ? user.avatarUrl : prev.avatarUrl,
        preferences: user.preferences || prev.preferences,
      }));
    }
  }, [user]);

  /**
   * Fetch latest profile from service
   */
  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await profileService.getCurrentProfile();
      if (response.success && response.data) {
        const p = response.data;
        const fetchedData: ProfileFormData = {
          fullName: p.full_name || user?.name || '',
          email: p.email || user?.email || '',
          role: p.role || user?.role || 'Executive',
          timezone: p.timezone || 'America/New_York',
          bio: p.bio || '',
          avatarUrl: p.avatar_url || '',
          preferences: p.preferences || {
            theme: currentTheme || 'dark',
            notifications: { email: true, push: true, inApp: true },
            language: 'en',
          },
        };
        setProfileData(fetchedData);

        // Update auth context
        updateUser({
          name: fetchedData.fullName,
          email: fetchedData.email,
          role: fetchedData.role,
          timezone: fetchedData.timezone,
          bio: fetchedData.bio,
          avatarUrl: fetchedData.avatarUrl,
          preferences: fetchedData.preferences,
        });
      }
    } catch (err) {
      console.warn('Fetch profile warning:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.name, user?.email, user?.role, currentTheme, updateUser]);

  /**
   * Update Profile with Optimistic UI & Auto Rollback
   */
  const updateProfile = useCallback(
    async (formData: ProfileFormData): Promise<boolean> => {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      // Save previous state for optimistic rollback
      const previousProfileData = { ...profileData };
      const previousUser = user ? { ...user } : null;

      // 1. Optimistically update local state & contexts
      setProfileData(formData);

      if (formData.preferences?.theme) {
        setThemeMode(formData.preferences.theme as 'light' | 'dark' | 'system');
      }

      updateUser({
        name: formData.fullName,
        email: formData.email,
        role: formData.role,
        timezone: formData.timezone,
        bio: formData.bio,
        avatarUrl: formData.avatarUrl,
        preferences: formData.preferences,
      });

      try {
        const updatePayload = {
          full_name: formData.fullName,
          email: formData.email,
          role: formData.role as unknown as ProfileUpdate['role'],
          timezone: formData.timezone,
          bio: formData.bio || null,
          avatar_url: formData.avatarUrl || null,
          preferences: formData.preferences as UserPreferences,
        };

        const response = await profileService.updateCurrentProfile(updatePayload);

        if (!response.success && response.error) {
          // If backend requires authentic DB and fails, roll back optimistic updates unless demo mode
          if (
            response.error.message?.includes('Not authenticated') ||
            response.error.message?.includes('Supabase not configured')
          ) {
            // In local/demo mode, retain changes gracefully!
            setSuccessMessage('Profile updated successfully (Demo Mode)');
            return true;
          }

          // Rollback on genuine API error
          setProfileData(previousProfileData);
          if (previousUser) updateUser(previousUser);
          setError(response.error.message || 'Failed to update profile');
          return false;
        }

        setSuccessMessage('Profile updated successfully');
        return true;
      } catch (err: unknown) {
        const errorObj = err as Error;
        // Rollback on exception
        setProfileData(previousProfileData);
        if (previousUser) updateUser(previousUser);
        setError(errorObj.message || 'An unexpected error occurred while updating profile');
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [profileData, user, updateUser, setThemeMode]
  );

  /**
   * Upload Avatar Image
   */
  const uploadAvatar = useCallback(
    async (file: File): Promise<string | null> => {
      const validation = validateAvatarFile(file);
      if (!validation.valid) {
        setError(validation.error || 'Invalid file');
        return null;
      }

      setIsUploadingAvatar(true);
      setError(null);

      const userId = user?.id || 'usr_demo';
      try {
        const response = await profileService.uploadAvatar(userId, file);
        if (response.success && response.data) {
          const newAvatarUrl = response.data;
          setProfileData((prev) => ({ ...prev, avatarUrl: newAvatarUrl }));
          updateUser({ avatarUrl: newAvatarUrl });
          setSuccessMessage('Avatar uploaded successfully');
          return newAvatarUrl;
        } else {
          setError(response.error?.message || 'Avatar upload failed');
          return null;
        }
      } catch (err: unknown) {
        const errorObj = err as Error;
        setError(errorObj.message || 'Failed to upload avatar');
        return null;
      } finally {
        setIsUploadingAvatar(false);
      }
    },
    [user?.id, updateUser]
  );

  /**
   * Remove Avatar
   */
  const removeAvatar = useCallback(() => {
    setProfileData((prev) => ({ ...prev, avatarUrl: '' }));
    updateUser({ avatarUrl: '' });
    setSuccessMessage('Avatar removed');
  }, [updateUser]);

  return {
    profileData,
    isLoading,
    isSaving,
    isUploadingAvatar,
    error,
    successMessage,
    setError,
    setSuccessMessage,
    fetchProfile,
    updateProfile,
    uploadAvatar,
    removeAvatar,
  };
}
