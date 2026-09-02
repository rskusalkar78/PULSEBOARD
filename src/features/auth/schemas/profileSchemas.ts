import { z } from 'zod';

export const SUPPORTED_TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Kolkata',
  'Asia/Tokyo',
  'Australia/Sydney',
] as const;

export const MAX_AVATAR_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

export const profileSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Display name is required')
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name cannot exceed 50 characters'),
  email: z.string().min(1, 'Email address is required').email('Please enter a valid email address'),
  role: z.string().min(1, 'Role is required').max(30, 'Role cannot exceed 30 characters'),
  timezone: z.string().min(1, 'Timezone selection is required'),
  bio: z.string().max(300, 'Bio cannot exceed 300 characters').optional(),
  avatarUrl: z.string().optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']),
    notifications: z.object({
      email: z.boolean(),
      push: z.boolean(),
      inApp: z.boolean(),
    }),
    language: z.string().min(2, 'Language code is required'),
  }),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const validateAvatarFile = (file: File): { valid: boolean; error?: string } => {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (file.size > MAX_AVATAR_FILE_SIZE) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Only .jpg, .jpeg, .png, .webp, and .gif formats are supported' };
  }

  return { valid: true };
};
