import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AuthLoadingState } from '@/features/auth/components/AuthLoadingState';

export function ProtectedRoute() {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return <AuthLoadingState message="Verifying security credentials..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
