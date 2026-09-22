/**
 * Context barrel — exports all context providers and hooks.
 */
export { AuthProvider, useAuth } from './AuthContext';
export type { User } from '@/types/auth';

export {
  ThemeProvider,
  useTheme,
  type ThemeMode,
  type ResolvedTheme,
  type ThemeContextValue,
} from './ThemeContext';

export {
  NotificationProvider,
  useNotifications,
  type NotificationPreferencesState,
  type CategoryCount,
} from './NotificationContext';
