import { Outlet } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export function AppLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ErrorBoundary>
          <div
            className="min-h-screen font-sans antialiased"
            style={{
              backgroundColor: 'var(--pb-bg-background)',
              color: 'var(--pb-text-primary)',
              fontFamily: 'var(--pb-font-sans)',
            }}
          >
            <Outlet />
          </div>
        </ErrorBoundary>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default AppLayout;
