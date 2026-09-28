/**
 * Test Render Utilities
 * Custom render functions with providers for testing components
 */

import type { RenderOptions, RenderResult } from '@testing-library/react';
import { render } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import type { MemoryRouterProps } from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { AuthContext } from '@/context/AuthContext';
import { NotificationContext } from '@/context/NotificationContext';
import { createMockUser, createMockSession } from './factories';
import type { User, AuthSession } from '@/types/auth';
import type { Notification } from '@/types';

/**
 * Mock Auth Context Value
 */
export interface MockAuthContextValue {
  user: User | null;
  session: AuthSession | null;
  loading: boolean;
  signIn: ReturnType<typeof vi.fn>;
  signUp: ReturnType<typeof vi.fn>;
  signOut: ReturnType<typeof vi.fn>;
  resetPassword: ReturnType<typeof vi.fn>;
  verifyEmail: ReturnType<typeof vi.fn>;
  updateProfile: ReturnType<typeof vi.fn>;
}

export const createMockAuthContext = (
  overrides?: Partial<MockAuthContextValue>
): MockAuthContextValue => {
  const defaultUser = createMockUser();
  const defaultSession = createMockSession();

  return {
    user: defaultUser,
    session: defaultSession,
    loading: false,
    signIn: vi.fn().mockResolvedValue({ user: defaultUser, session: defaultSession, error: null }),
    signUp: vi.fn().mockResolvedValue({ user: defaultUser, session: null, error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    resetPassword: vi.fn().mockResolvedValue({ error: null }),
    verifyEmail: vi.fn().mockResolvedValue({ error: null }),
    updateProfile: vi.fn().mockResolvedValue(defaultUser),
    ...overrides,
  };
};

/**
 * Mock Notification Context Value
 */
export interface MockNotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: ReturnType<typeof vi.fn>;
  markAllAsRead: ReturnType<typeof vi.fn>;
  deleteNotification: ReturnType<typeof vi.fn>;
  clearAll: ReturnType<typeof vi.fn>;
  refetch: ReturnType<typeof vi.fn>;
}

export const createMockNotificationContext = (
  overrides?: Partial<MockNotificationContextValue>
): MockNotificationContextValue => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  markAsRead: vi.fn().mockResolvedValue(undefined),
  markAllAsRead: vi.fn().mockResolvedValue(undefined),
  deleteNotification: vi.fn().mockResolvedValue(undefined),
  clearAll: vi.fn().mockResolvedValue(undefined),
  refetch: vi.fn().mockResolvedValue(undefined),
  ...overrides,
});

/**
 * All Providers Wrapper
 */
interface AllProvidersProps {
  children: ReactNode;
  authValue?: MockAuthContextValue;
  notificationValue?: MockNotificationContextValue;
  routerProps?: MemoryRouterProps;
}

export const AllProviders = ({
  children,
  authValue,
  notificationValue,
  routerProps = {},
}: AllProvidersProps) => {
  const defaultAuthValue = createMockAuthContext(authValue);
  const defaultNotificationValue = createMockNotificationContext(notificationValue);

  return (
    <MemoryRouter {...routerProps}>
      <AuthContext.Provider value={defaultAuthValue}>
        <NotificationContext.Provider value={defaultNotificationValue}>
          {children}
        </NotificationContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

/**
 * Custom Render with All Providers
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  authValue?: Partial<MockAuthContextValue>;
  notificationValue?: Partial<MockNotificationContextValue>;
  routerProps?: MemoryRouterProps;
}

export const renderWithProviders = (
  ui: ReactElement,
  options?: CustomRenderOptions
): RenderResult => {
  const { authValue, notificationValue, routerProps, ...renderOptions } = options || {};

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <AllProviders
      authValue={authValue}
      notificationValue={notificationValue}
      routerProps={routerProps}
    >
      {children}
    </AllProviders>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

/**
 * Render with Router Only
 */
export const renderWithRouter = (
  ui: ReactElement,
  routerProps?: MemoryRouterProps
): RenderResult => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter {...routerProps}>{children}</MemoryRouter>
  );

  return render(ui, { wrapper: Wrapper });
};

/**
 * Render with Auth Context Only
 */
export const renderWithAuth = (
  ui: ReactElement,
  authValue?: Partial<MockAuthContextValue>
): RenderResult => {
  const defaultAuthValue = createMockAuthContext(authValue);

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <AuthContext.Provider value={defaultAuthValue}>{children}</AuthContext.Provider>
  );

  return render(ui, { wrapper: Wrapper });
};

/**
 * Wait for Loading to Complete
 * Utility to wait for loading states to resolve
 */
export const waitForLoadingToFinish = async () => {
  const { waitFor } = await import('@testing-library/react');
  await waitFor(
    () => {
      expect(document.querySelector('[data-loading="true"]')).not.toBeInTheDocument();
    },
    { timeout: 3000 }
  );
};
