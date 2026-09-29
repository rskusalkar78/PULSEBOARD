/**
 * Auth Service Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../authService';
import { createMockUser } from '@/test';

// Mock the Supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn(),
      verifyOtp: vi.fn(),
      resend: vi.fn(),
    },
  },
}));

vi.mock('@/lib/supabaseConfig', () => ({
  isSupabaseConfigured: vi.fn(() => false),
}));

describe('authService.signIn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('returns user and session on successful login (mock mode)', async () => {
    const result = await authService.signIn({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.user).toBeTruthy();
    expect(result.user?.email).toBe('test@example.com');
    expect(result.session).toBeTruthy();
    expect(result.error).toBeNull();
  });

  it('returns error for invalid credentials (mock mode)', async () => {
    const result = await authService.signIn({
      email: 'test@example.com',
      password: 'invalid-pass',
    });

    expect(result.user).toBeNull();
    expect(result.session).toBeNull();
    expect(result.error).toBeTruthy();
    expect(result.error).toContain('Invalid login credentials');
  });

  it('stores user in localStorage on successful login (mock mode)', async () => {
    await authService.signIn({
      email: 'test@example.com',
      password: 'password123',
    });

    const stored = localStorage.getItem('pulseboard_mock_user');
    expect(stored).toBeTruthy();

    const user = JSON.parse(stored!);
    expect(user.email).toBe('test@example.com');
  });

  it('extracts name from email', async () => {
    const result = await authService.signIn({
      email: 'john.doe@example.com',
      password: 'password123',
    });

    expect(result.user?.name).toBe('john doe');
  });
});

describe('authService.signUp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('creates new user on registration (mock mode)', async () => {
    const result = await authService.signUp({
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      termsAccepted: true,
    });

    expect(result.user).toBeTruthy();
    expect(result.user?.email).toBe('john@example.com');
    expect(result.user?.name).toBe('John Doe');
    expect(result.error).toBeNull();
  });

  it('stores new user in localStorage (mock mode)', async () => {
    await authService.signUp({
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      termsAccepted: true,
    });

    const stored = localStorage.getItem('pulseboard_mock_user');
    expect(stored).toBeTruthy();

    const user = JSON.parse(stored!);
    expect(user.name).toBe('John Doe');
    expect(user.emailConfirmedAt).toBeNull();
  });

  it('sets role to Member for new users (mock mode)', async () => {
    const result = await authService.signUp({
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      termsAccepted: true,
    });

    expect(result.user?.role).toBe('Member');
  });
});

describe('authService.resetPasswordForEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns success for valid email (mock mode)', async () => {
    const result = await authService.resetPasswordForEmail('test@example.com');

    expect(result.error).toBeNull();
  });
});

describe('authService.updatePassword', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns success on password update (mock mode)', async () => {
    const result = await authService.updatePassword('newPassword123');

    expect(result.error).toBeNull();
  });
});

describe('authService.verifyOtp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('returns success for valid OTP (mock mode)', async () => {
    // Set up a mock user
    const mockUser = createMockUser({ emailConfirmedAt: null });
    localStorage.setItem('pulseboard_mock_user', JSON.stringify(mockUser));

    const result = await authService.verifyOtp('123456', 'test@example.com');

    expect(result.error).toBeNull();

    // Check that emailConfirmedAt was updated
    const stored = localStorage.getItem('pulseboard_mock_user');
    const user = JSON.parse(stored!);
    expect(user.emailConfirmedAt).toBeTruthy();
  });

  it('returns error for invalid OTP (mock mode)', async () => {
    const result = await authService.verifyOtp('000000', 'test@example.com');

    expect(result.error).toBeTruthy();
    expect(result.error).toContain('Invalid or expired');
  });
});

describe('authService.resendVerificationCode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns success (mock mode)', async () => {
    const result = await authService.resendVerificationCode('test@example.com');

    expect(result.error).toBeNull();
  });
});

describe('authService.signOut', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('clears localStorage on sign out (mock mode)', async () => {
    // Set up mock user
    localStorage.setItem('pulseboard_mock_user', JSON.stringify(createMockUser()));
    localStorage.setItem('pulseboard_auth_state', 'true');

    const result = await authService.signOut();

    expect(result.error).toBeNull();
    expect(localStorage.getItem('pulseboard_mock_user')).toBeNull();
    expect(localStorage.getItem('pulseboard_auth_state')).toBeNull();
  });
});

describe('authService.getInitialUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('returns mock user when authenticated (mock mode)', async () => {
    localStorage.setItem('pulseboard_auth_state', 'true');

    const user = await authService.getInitialUser();

    expect(user).toBeTruthy();
    expect(user?.email).toBe('alex.morgan@pulseboard.io');
  });

  it('returns stored user from localStorage (mock mode)', async () => {
    const mockUser = createMockUser({ email: 'stored@example.com' });
    localStorage.setItem('pulseboard_mock_user', JSON.stringify(mockUser));
    localStorage.setItem('pulseboard_auth_state', 'true');

    const user = await authService.getInitialUser();

    expect(user?.email).toBe('stored@example.com');
  });

  it('returns null when not authenticated (mock mode)', async () => {
    localStorage.setItem('pulseboard_auth_state', 'false');

    const user = await authService.getInitialUser();

    expect(user).toBeNull();
  });

  it('handles corrupted localStorage data gracefully (mock mode)', async () => {
    localStorage.setItem('pulseboard_mock_user', 'invalid json');
    localStorage.setItem('pulseboard_auth_state', 'true');

    const user = await authService.getInitialUser();

    // Should fallback to default mock user
    expect(user).toBeTruthy();
  });
});
