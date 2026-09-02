import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, LoginCredentials, RegisterCredentials } from '@/types/auth';
import { authService } from '@/services/authService';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/lib/supabaseConfig';

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  user: User | null;
  login: (credentials: LoginCredentials | string) => Promise<{ error: string | null }>;
  register: (
    credentials: RegisterCredentials
  ) => Promise<{ error: string | null; user: User | null }>;
  forgotPassword: (email: string) => Promise<{ error: string | null }>;
  resetPassword: (password: string) => Promise<{ error: string | null }>;
  verifyEmail: (code: string, email?: string) => Promise<{ error: string | null }>;
  resendVerification: (email: string) => Promise<{ error: string | null }>;

  logout: () => Promise<void>;
  toggleAuth: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'pulseboard_auth_state';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        const initialUser = await authService.getInitialUser();
        if (isMounted) {
          setUser(initialUser);
        }
      } catch (err) {
        console.error('Error initializing auth state:', err);
      } finally {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      }
    }

    initAuth();

    let authListener: { subscription: { unsubscribe: () => void } } | null = null;

    if (isSupabaseConfigured() && supabase) {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (!isMounted) return;

        if (session?.user) {
          const sbUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            role: session.user.user_metadata?.role || 'Executive',
            avatarUrl: session.user.user_metadata?.avatar_url,
            emailConfirmedAt: session.user.email_confirmed_at,
            createdAt: session.user.created_at,
          };
          setUser(sbUser);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }

        setIsAuthLoading(false);
      });
      authListener = data;
    }

    return () => {
      isMounted = false;
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const isAuthenticated = !!user;

  const login = async (
    credentials: LoginCredentials | string
  ): Promise<{ error: string | null }> => {
    setIsAuthLoading(true);
    try {
      const creds: LoginCredentials =
        typeof credentials === 'string'
          ? { email: credentials, password: 'password123' }
          : credentials;

      const res = await authService.signIn(creds);
      if (res.error) {
        return { error: res.error };
      }
      setUser(res.user);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(true));
      return { error: null };
    } finally {
      setIsAuthLoading(false);
    }
  };

  const register = async (
    credentials: RegisterCredentials
  ): Promise<{ error: string | null; user: User | null }> => {
    setIsAuthLoading(true);
    try {
      const res = await authService.signUp(credentials);
      if (res.error) {
        return { error: res.error, user: null };
      }
      if (res.session) {
        setUser(res.user);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(true));
      }
      return { error: null, user: res.user };
    } finally {
      setIsAuthLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<{ error: string | null }> => {
    return authService.resetPasswordForEmail(email);
  };

  const resetPassword = async (password: string): Promise<{ error: string | null }> => {
    return authService.updatePassword(password);
  };

  const verifyEmail = async (code: string, email?: string): Promise<{ error: string | null }> => {
    setIsAuthLoading(true);
    try {
      const res = await authService.verifyOtp(code, email);
      if (res.error) {
        return res;
      }

      const updatedUser = await authService.getInitialUser();
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(true));
      }

      return { error: null };
    } finally {
      setIsAuthLoading(false);
    }
  };

  const resendVerification = async (email: string): Promise<{ error: string | null }> => {
    return authService.resendVerificationCode(email);
  };

  const logout = async (): Promise<void> => {
    setIsAuthLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(false));
    } finally {
      setIsAuthLoading(false);
    }
  };

  const toggleAuth = () => {
    if (user) {
      logout();
    } else {
      login('alex.morgan@pulseboard.io');
    }
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAuthLoading,
        user,
        login,
        register,
        forgotPassword,
        resetPassword,
        verifyEmail,
        resendVerification,
        logout,
        toggleAuth,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
