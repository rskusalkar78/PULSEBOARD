import { Outlet } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ToastProvider, TaskProvider } from '@/contexts';

export function AppLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <ToastProvider>
            <TaskProvider>
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
            </TaskProvider>
          </ToastProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default AppLayout;
