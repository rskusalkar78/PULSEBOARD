import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type {
  User,
  AuthSession,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from '@/types/auth';

const MOCK_STORAGE_KEY = 'pulseboard_mock_user';

const DEFAULT_MOCK_USER: User = {
  id: 'usr_mock_123',
  email: 'alex.morgan@pulseboard.io',
  name: 'Alex Morgan',
  role: 'Product Lead',
  emailConfirmedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
};

const delay = (ms: number = 600) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  async signIn({ email, password }: LoginCredentials): Promise<AuthResponse> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, session: null, error: error.message };
      }

      const user: User | null = data.user
        ? {
            id: data.user.id,
            email: data.user.email || email,
            name: data.user.user_metadata?.full_name || email.split('@')[0],
            role: data.user.user_metadata?.role || 'Executive',
            avatarUrl: data.user.user_metadata?.avatar_url,
            emailConfirmedAt: data.user.email_confirmed_at ?? null,
            createdAt: data.user.created_at,
          }
        : null;

      if (!user) {
        return { user: null, session: null, error: 'User data not found.' };
      }

      const session: AuthSession | null = data.session
        ? {
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
            user,
          }
        : null;

      return { user, session, error: null };
    }

    // Mock Mode fallback
    await delay();
    if (password === 'invalid-pass') {
      return { user: null, session: null, error: 'Invalid login credentials. Please try again.' };
    }

    const emailNamePart = email.split('@')[0] ?? 'User';
    const mockUser: User = {
      ...DEFAULT_MOCK_USER,
      email,
      name: emailNamePart.replace('.', ' ') || 'User',
    };

    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(mockUser));

    return {
      user: mockUser,
      session: {
        accessToken: 'mock_access_token_' + Date.now(),
        user: mockUser,
      },
      error: null,
    };
  },

  async signUp({ fullName, email, password }: RegisterCredentials): Promise<AuthResponse> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { user: null, session: null, error: error.message };
      }

      const user: User | null = data.user
        ? {
            id: data.user.id,
            email: data.user.email || email,
            name: fullName,
            role: 'Member',
            emailConfirmedAt: data.user.email_confirmed_at ?? null,
            createdAt: data.user.created_at,
          }
        : null;

      return { user, session: null, error: null };
    }

    // Mock Mode fallback
    await delay();
    const newUser: User = {
      id: 'usr_' + Date.now(),
      email,
      name: fullName,
      role: 'Member',
      emailConfirmedAt: null, // Pending verification
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(newUser));

    return {
      user: newUser,
      session: null,
      error: null,
    };
  },

  async resetPasswordForEmail(email: string): Promise<{ error: string | null }> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error: error ? error.message : null };
    }

    await delay();
    return { error: null };
  },

  async updatePassword(password: string): Promise<{ error: string | null }> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.auth.updateUser({ password });
      return { error: error ? error.message : null };
    }

    await delay();
    return { error: null };
  },

  async verifyOtp(code: string, email?: string): Promise<{ error: string | null }> {
    if (isSupabaseConfigured() && supabase && email) {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'email',
      });
      return { error: error ? error.message : null };
    }

    await delay();
    if (code === '000000') {
      return { error: 'Invalid or expired verification code. Please request a new code.' };
    }

    const savedMock = localStorage.getItem(MOCK_STORAGE_KEY);
    if (savedMock) {
      const user: User = JSON.parse(savedMock);
      user.emailConfirmedAt = new Date().toISOString();
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(user));
    }

    return { error: null };
  },

  async resendVerificationCode(email: string): Promise<{ error: string | null }> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      return { error: error ? error.message : null };
    }

    await delay();
    return { error: null };
  },

  async signOut(): Promise<{ error: string | null }> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.auth.signOut();
      return { error: error ? error.message : null };
    }

    await delay(300);
    localStorage.removeItem(MOCK_STORAGE_KEY);
    localStorage.removeItem('pulseboard_auth_state');
    return { error: null };
  },

  async getInitialUser(): Promise<User | null> {
    if (isSupabaseConfigured() && supabase) {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        const sbUser = data.session.user;
        return {
          id: sbUser.id,
          email: sbUser.email || '',
          name: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0],
          role: sbUser.user_metadata?.role || 'Executive',
          avatarUrl: sbUser.user_metadata?.avatar_url,
          emailConfirmedAt: sbUser.email_confirmed_at ?? null,
          createdAt: sbUser.created_at,
        };
      }
      return null;
    }

    // Mock Mode fallback
    const saved = localStorage.getItem('pulseboard_auth_state');
    const isAuthenticated = saved !== null ? JSON.parse(saved) : true;
    if (!isAuthenticated) return null;

    const savedMockUser = localStorage.getItem(MOCK_STORAGE_KEY);
    if (savedMockUser) {
      try {
        return JSON.parse(savedMockUser);
      } catch {
        return DEFAULT_MOCK_USER;
      }
    }
    return DEFAULT_MOCK_USER;
  },
};
