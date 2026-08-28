/**
 * Supabase Storage Utilities
 * Helper functions for file uploads and storage management
 *
 * SECURITY NOTES:
 * - Files should have proper RLS policies in Supabase
 * - Validate file types and sizes on client and server
 * - Use signed URLs for private files
 */

import { supabase } from './supabase';
import type { UploadOptions, SignedUrlOptions } from '@/types';

// =====================================================
// STORAGE BUCKETS
// =====================================================

export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  PROJECTS: 'projects',
  ATTACHMENTS: 'attachments',
} as const;

export type StorageBucket =
  (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

// =====================================================
// FILE VALIDATION
// =====================================================

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
];

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
];

export interface FileValidationOptions {
  maxSize?: number;
  allowedTypes?: string[];
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate file before upload
 */
export function validateFile(
  file: File,
  options: FileValidationOptions = {}
): FileValidationResult {
  const maxSize = options.maxSize || MAX_FILE_SIZE;
  const allowedTypes = options.allowedTypes || [
    ...ALLOWED_IMAGE_TYPES,
    ...ALLOWED_DOCUMENT_TYPES,
  ];

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${(maxSize / 1024 / 1024).toFixed(1)}MB limit`,
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type "${file.type}" is not allowed`,
    };
  }

  return { valid: true };
}

// =====================================================
// UPLOAD FUNCTIONS
// =====================================================

export interface UploadResult {
  path: string;
  publicUrl?: string | undefined;
  error?: string | undefined;
}

/**
 * Upload file to storage bucket
 */
export async function uploadFile(
  bucket: StorageBucket,
  path: string,
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  try {
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return {
        path,
        error: validation.error,
      };
    }

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: options.cacheControl || '3600',
        contentType: options.contentType || file.type,
        upsert: options.upsert || false,
      });

    if (error) {
      console.error('Upload error:', error);
      return {
        path,
        error: error.message,
      };
    }

    // Get public URL if bucket is public
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return {
      path: data.path,
      publicUrl,
    };
  } catch (error) {
    console.error('Upload exception:', error);
    return {
      path,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Upload avatar image
 */
export async function uploadAvatar(
  userId: string,
  file: File
): Promise<UploadResult> {
  // Validate image
  const validation = validateFile(file, {
    maxSize: MAX_IMAGE_SIZE,
    allowedTypes: ALLOWED_IMAGE_TYPES,
  });

  if (!validation.valid) {
    return {
      path: '',
      error: validation.error,
    };
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  return uploadFile(STORAGE_BUCKETS.AVATARS, filePath, file, {
    upsert: true,
  });
}

/**
 * Upload project attachment
 */
export async function uploadProjectFile(
  projectId: string,
  file: File
): Promise<UploadResult> {
  // Generate unique filename  
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = `${projectId}/${fileName}`;

  return uploadFile(STORAGE_BUCKETS.PROJECTS, filePath, file);
}

// =====================================================
// DOWNLOAD FUNCTIONS
// =====================================================

/**
 * Get signed URL for private file
 */
export async function getSignedUrl(
  bucket: StorageBucket,
  path: string,
  options: SignedUrlOptions = {}
): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, options.expiresIn || 3600);

    if (error) {
      console.error('Signed URL error:', error);
      return null;
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Signed URL exception:', error);
    return null;
  }
}

/**
 * Get public URL for file
 */
export function getPublicUrl(bucket: StorageBucket, path: string): string {
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  return publicUrl;
}

/**
 * Download file as blob
 */
export async function downloadFile(
  bucket: StorageBucket,
  path: string
): Promise<Blob | null> {
  try {
    const { data, error } = await supabase.storage.from(bucket).download(path);

    if (error) {
      console.error('Download error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Download exception:', error);
    return null;
  }
}

// =====================================================
// DELETE FUNCTIONS
// =====================================================

/**
 * Delete file from storage
 */
export async function deleteFile(
  bucket: StorageBucket,
  path: string
): Promise<boolean> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete exception:', error);
    return false;
  }
}

/**
 * Delete multiple files from storage
 */
export async function deleteFiles(
  bucket: StorageBucket,
  paths: string[]
): Promise<boolean> {
  try {
    const { error } = await supabase.storage.from(bucket).remove(paths);

    if (error) {
      console.error('Batch delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Batch delete exception:', error);
    return false;
  }
}

// =====================================================
// LIST FUNCTIONS
// =====================================================

/**
 * List files in a directory
 */
export async function listFiles(bucket: StorageBucket, path: string = '') {
  try {
    const { data, error } = await supabase.storage.from(bucket).list(path);

    if (error) {
      console.error('List files error:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('List files exception:', error);
    return [];
  }
}

// =====================================================
// HELPER UTILITIES
// =====================================================

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Check if file is an image
 */
export function isImageFile(file: File): boolean {
  return ALLOWED_IMAGE_TYPES.includes(file.type);
}

/**
 * Generate unique filename
 */
export function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = getFileExtension(originalFilename);
  const nameWithoutExt = originalFilename.replace(`.${extension}`, '');
  const sanitizedName = nameWithoutExt.replace(/[^a-z0-9]/gi, '-').toLowerCase();

  return `${sanitizedName}-${timestamp}-${random}.${extension}`;
}
