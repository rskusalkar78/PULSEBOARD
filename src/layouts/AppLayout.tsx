import { Outlet } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export function AppLayout() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
          <Outlet />
        </div>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default AppLayout;
