import type { UserPreferences } from './database.types';

export interface User {
  id: string;
  email: string;
  name?: string | undefined;
  role?: string | undefined;
  avatarUrl?: string | undefined;
  bio?: string | undefined;
  timezone?: string | undefined;
  preferences?: UserPreferences | undefined;
  emailConfirmedAt?: string | null | undefined;
  createdAt?: string | undefined;
}

export interface AuthSession {
  accessToken: string;
  refreshToken?: string | undefined;
  user: User;
}

export interface AuthResponse {
  user: User | null;
  session: AuthSession | null;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean | undefined;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string | undefined;
  termsAccepted: boolean;
}

export interface ForgotPasswordCredentials {
  email: string;
}

export interface ResetPasswordCredentials {
  password: string;
  confirmPassword?: string | undefined;
  token?: string | undefined;
}

export interface VerifyEmailCredentials {
  code?: string | undefined;
  email?: string | undefined;
  token?: string | undefined;
}
