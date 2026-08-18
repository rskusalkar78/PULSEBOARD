import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedRoute } from '@/components/routes/ProtectedRoute';
import { PublicRoute } from '@/components/routes/PublicRoute';
import { PageLoader } from '@/components/common/PageLoader';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

// Lazy-loaded route page components for route-level loading states
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage'));
const ActivityPage = lazy(() => import('@/pages/ActivityPage'));
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage'));
const TeamPage = lazy(() => import('@/pages/TeamPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      // Protected Application Routes
      {
        element: <ProtectedRoute />,
        errorElement: <ErrorBoundary />,
        children: [
          {
            element: <DashboardLayout />,
            errorElement: <ErrorBoundary />,
            children: [
              {
                path: 'dashboard',
                element: withSuspense(DashboardPage),
              },
              {
                path: 'analytics',
                element: withSuspense(AnalyticsPage),
              },
              {
                path: 'activity',
                element: withSuspense(ActivityPage),
              },
              {
                path: 'projects',
                element: withSuspense(ProjectsPage),
              },
              {
                path: 'team',
                element: withSuspense(TeamPage),
              },
              {
                path: 'settings',
                element: withSuspense(SettingsPage),
              },
              {
                path: 'notifications',
                element: withSuspense(NotificationsPage),
              },
              {
                path: 'profile',
                element: withSuspense(ProfilePage),
              },
            ],
          },
        ],
      },
      // Public Unauthenticated Routes
      {
        element: <PublicRoute />,
        errorElement: <ErrorBoundary />,
        children: [
          {
            element: <AuthLayout />,
            errorElement: <ErrorBoundary />,
            children: [
              {
                path: 'login',
                element: withSuspense(LoginPage),
              },
            ],
          },
        ],
      },
      // 404 Catch-All Route
      {
        path: '*',
        element: withSuspense(NotFoundPage),
      },
    ],
  },
]);

export default router;
