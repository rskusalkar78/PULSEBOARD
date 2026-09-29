/**
 * Supabase Mock
 * Mock implementation of Supabase client for testing
 */

import { vi } from 'vitest';

/**
 * Mock Supabase Client
 */
export const createMockSupabaseClient = () => {
  const mockSelect = vi.fn().mockReturnThis();
  const mockInsert = vi.fn().mockReturnThis();
  const mockUpdate = vi.fn().mockReturnThis();
  const mockDelete = vi.fn().mockReturnThis();
  const mockEq = vi.fn().mockReturnThis();
  const mockIn = vi.fn().mockReturnThis();
  const mockGte = vi.fn().mockReturnThis();
  const mockLte = vi.fn().mockReturnThis();
  const mockOrder = vi.fn().mockReturnThis();
  const mockLimit = vi.fn().mockReturnThis();
  const mockSingle = vi.fn().mockResolvedValue({ data: null, error: null });
  const mockMaybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
  const mockRange = vi.fn().mockReturnThis();

  const mockFrom = vi.fn(() => ({
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
    eq: mockEq,
    in: mockIn,
    gte: mockGte,
    lte: mockLte,
    order: mockOrder,
    limit: mockLimit,
    single: mockSingle,
    maybeSingle: mockMaybeSingle,
    range: mockRange,
  }));

  const mockAuth = {
    signInWithPassword: vi.fn().mockResolvedValue({
      data: { user: null, session: null },
      error: null,
    }),
    signUp: vi.fn().mockResolvedValue({
      data: { user: null, session: null },
      error: null,
    }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    getSession: vi.fn().mockResolvedValue({
      data: { session: null },
      error: null,
    }),
    getUser: vi.fn().mockResolvedValue({
      data: { user: null },
      error: null,
    }),
    resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
    updateUser: vi.fn().mockResolvedValue({
      data: { user: null },
      error: null,
    }),
    verifyOtp: vi.fn().mockResolvedValue({
      data: { session: null },
      error: null,
    }),
    resend: vi.fn().mockResolvedValue({ error: null }),
    onAuthStateChange: vi.fn(() => ({
      data: { subscription: { unsubscribe: vi.fn() } },
    })),
  };

  const mockStorage = {
    from: vi.fn(() => ({
      upload: vi.fn().mockResolvedValue({ data: null, error: null }),
      download: vi.fn().mockResolvedValue({ data: null, error: null }),
      remove: vi.fn().mockResolvedValue({ data: null, error: null }),
      list: vi.fn().mockResolvedValue({ data: [], error: null }),
      getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'https://example.com/file.jpg' } })),
    })),
  };

  const mockChannel = vi.fn(() => ({
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn().mockResolvedValue({ status: 'ok' }),
    unsubscribe: vi.fn().mockResolvedValue({ status: 'ok' }),
  }));

  return {
    from: mockFrom,
    auth: mockAuth,
    storage: mockStorage,
    channel: mockChannel,
    removeChannel: vi.fn(),
    getChannels: vi.fn(() => []),
  };
};

/**
 * Create successful database response
 */
export const createSuccessResponse = <T>(data: T) => ({
  data,
  error: null,
  count: null,
  status: 200,
  statusText: 'OK',
});

/**
 * Create error database response
 */
export const createErrorResponse = (message: string, code?: string) => ({
  data: null,
  error: {
    message,
    code: code || 'PGRST116',
    details: '',
    hint: '',
  },
  count: null,
  status: 400,
  statusText: 'Bad Request',
});

/**
 * Create paginated response
 */
export const createPaginatedResponse = <T>(data: T[], count: number) => ({
  data,
  error: null,
  count,
  status: 200,
  statusText: 'OK',
});
