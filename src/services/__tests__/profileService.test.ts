import { describe, it, expect, vi, beforeEach } from 'vitest';
import { profileService } from '../profile.service';

describe('ProfileService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('uploads avatar file and returns data URL as fallback when offline/demo mode', async () => {
    const file = new File(['test image data'], 'avatar.png', { type: 'image/png' });
    const response = await profileService.uploadAvatar('usr_123', file);

    expect(response.success).toBe(true);
    expect(response.data).toContain('data:image/png;base64,');
    expect(response.error).toBeNull();
  });

  it('updates preferences by merging with current preferences', async () => {
    const getByIdSpy = vi.spyOn(profileService, 'getById').mockResolvedValue({
      success: true,
      data: {
        id: 'usr_123',
        email: 'test@example.com',
        full_name: 'Test User',
        avatar_url: null,
        role: 'user',
        bio: null,
        timezone: 'UTC',
        preferences: {
          theme: 'light',
          notifications: { email: true, push: true, inApp: true },
          language: 'en',
        },
        onboarded: true,
        last_seen_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      error: null,
    });

    const updateSpy = vi.spyOn(profileService, 'update').mockResolvedValue({
      success: true,
      data: {
        id: 'usr_123',
        email: 'test@example.com',
        full_name: 'Test User',
        avatar_url: null,
        role: 'user',
        bio: null,
        timezone: 'UTC',
        preferences: {
          theme: 'dark',
          notifications: { email: true, push: true, inApp: true },
          language: 'en',
        },
        onboarded: true,
        last_seen_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      error: null,
    });

    const result = await profileService.updatePreferences('usr_123', { theme: 'dark' });

    expect(getByIdSpy).toHaveBeenCalledWith('usr_123');
    expect(updateSpy).toHaveBeenCalledWith('usr_123', {
      preferences: {
        theme: 'dark',
        notifications: { email: true, push: true, inApp: true },
        language: 'en',
      },
    });
    expect(result.success).toBe(true);
    expect(result.data?.preferences.theme).toBe('dark');
  });
});
