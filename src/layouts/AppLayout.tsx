import { Outlet } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ToastProvider, TaskProvider, GlobalSearchProvider } from '@/contexts';
import { GlobalSearchModal } from '@/components/search';

export function AppLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <ToastProvider>
            <TaskProvider>
              <GlobalSearchProvider>
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
                    <GlobalSearchModal />
                  </div>
                </ErrorBoundary>
              </GlobalSearchProvider>
            </TaskProvider>
          </ToastProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default AppLayout;
