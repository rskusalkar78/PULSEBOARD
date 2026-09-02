import { describe, it, expect } from 'vitest';
import { profileSchema, validateAvatarFile, MAX_AVATAR_FILE_SIZE } from '../schemas/profileSchemas';

describe('profileSchemas validation', () => {
  it('validates a correct profile object', () => {
    const validProfile = {
      fullName: 'Alex Morgan',
      email: 'alex.morgan@pulseboard.io',
      role: 'Executive Lead',
      timezone: 'America/New_York',
      bio: 'Engineering executive',
      avatarUrl: 'https://example.com/avatar.jpg',
      preferences: {
        theme: 'dark' as const,
        notifications: {
          email: true,
          push: false,
          inApp: true,
        },
        language: 'en',
      },
    };

    const result = profileSchema.safeParse(validProfile);
    expect(result.success).toBe(true);
  });

  it('fails when full name is empty or too short', () => {
    const invalidProfile = {
      fullName: 'A',
      email: 'alex@example.com',
      role: 'Manager',
      timezone: 'UTC',
      preferences: {
        theme: 'system' as const,
        notifications: { email: true, push: true, inApp: true },
        language: 'en',
      },
    };

    const result = profileSchema.safeParse(invalidProfile);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.format().fullName?._errors[0]).toBe(
        'Display name must be at least 2 characters'
      );
    }
  });

  it('fails on invalid email format', () => {
    const invalidEmail = {
      fullName: 'Alex Morgan',
      email: 'invalid-email-format',
      role: 'Manager',
      timezone: 'UTC',
      preferences: {
        theme: 'light' as const,
        notifications: { email: true, push: true, inApp: true },
        language: 'en',
      },
    };

    const result = profileSchema.safeParse(invalidEmail);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.format().email?._errors[0]).toBe('Please enter a valid email address');
    }
  });

  it('validates avatar files correctly', () => {
    const validFile = new File(['dummy content'], 'avatar.png', { type: 'image/png' });
    expect(validateAvatarFile(validFile)).toEqual({ valid: true });

    const oversizeFile = new File([new ArrayBuffer(MAX_AVATAR_FILE_SIZE + 100)], 'huge.png', {
      type: 'image/png',
    });
    expect(validateAvatarFile(oversizeFile)).toEqual({
      valid: false,
      error: 'File size must be less than 5MB',
    });

    const invalidTypeFile = new File(['pdf data'], 'doc.pdf', { type: 'application/pdf' });
    expect(validateAvatarFile(invalidTypeFile)).toEqual({
      valid: false,
      error: 'Only .jpg, .jpeg, .png, .webp, and .gif formats are supported',
    });
  });
});
