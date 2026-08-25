import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AuthLoadingState } from '@/features/auth/components/AuthLoadingState';

export function PublicRoute() {
  const { isAuthenticated, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <AuthLoadingState message="Checking authentication status..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default PublicRoute;
