/**
 * Context barrel — exports all context providers and hooks.
 */
export { AuthProvider, useAuth, type User } from './AuthContext';
export {
  ThemeProvider,
  useTheme,
  type ThemeMode,
  type ResolvedTheme,
  type ThemeContextValue,
} from './ThemeContext';
