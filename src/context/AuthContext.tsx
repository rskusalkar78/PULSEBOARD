import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email?: string) => void;
  logout: () => void;
  toggleAuth: () => void;
}

const DEFAULT_USER: User = {
  id: 'usr_1',
  name: 'Alex Morgan',
  email: 'alex.morgan@pulseboard.io',
  role: 'Product Lead',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'pulseboard_auth_state';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [user, setUser] = useState<User | null>(isAuthenticated ? DEFAULT_USER : null);

  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(isAuthenticated));
    setUser(isAuthenticated ? DEFAULT_USER : null);
  }, [isAuthenticated]);

  const login = (_email?: string) => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const toggleAuth = () => {
    setIsAuthenticated((prev) => !prev);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, toggleAuth }}>
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
