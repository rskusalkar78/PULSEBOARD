import React from 'react';
import { Plus, DownloadCloud } from 'lucide-react';
import { PageHeader, Button } from '@/components';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import {
  KPICard,
  TeamActivity,
  RecentActivity,
  UpcomingDeadlines,
  ProjectProgress,
  QuickActions,
  TeamActivityChart,
} from '@/components/dashboard';
import { DashboardError, DashboardEmpty } from '@/components/dashboard/DashboardError';
import { getCachedDashboardData } from '@/services/dashboardMockData';
import type { DashboardData } from '@/types/dashboard';

const DashboardContent: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate data fetching with a small delay for better UX
    const loadData = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        const data = getCachedDashboardData();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error('Failed to load dashboard data');
        setError(errorObj);
        setDashboardData(null);
        console.error('Dashboard load error:', errorObj);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // Retry loading data
    const loadData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const data = getCachedDashboardData();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error('Failed to load dashboard data');
        setError(errorObj);
        console.error('Dashboard retry error:', errorObj);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  };

  const handleCreateProject = () => {
    console.log('Create new project');
  };

  const handleCreateTask = () => {
    console.log('Create new task');
  };

  const handleInviteTeam = () => {
    console.log('Invite team members');
  };

  const handleViewReports = () => {
    console.log('View reports');
  };

  const handleGenerateInsights = () => {
    console.log('Generate AI insights');
  };

  const handleOpenSettings = () => {
    console.log('Open settings');
  };

  const handleExport = () => {
    console.log('Export dashboard data');
  };

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Welcome back! Here's an overview of your workspace."
          breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Dashboard' }]}
        />
        <DashboardError
          title="Failed to Load Dashboard"
          message={error.message || 'An error occurred while loading the dashboard data.'}
          error={error}
          onRetry={handleRetry}
          onNavigateHome={() => (window.location.href = '/dashboard')}
        />
      </div>
    );
  }

  if (!dashboardData && !loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Welcome back! Here's an overview of your workspace."
          breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Dashboard' }]}
        />
        <DashboardEmpty onAction={handleCreateProject} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your workspace."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Dashboard' }]}
        actions={
          <>
            <Button
              variant="outline"
              size="md"
              leftIcon={<DownloadCloud className="h-4 w-4" />}
              onClick={handleExport}
            >
              Export
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={handleCreateProject}
            >
              New Project
            </Button>
          </>
        }
      />

      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <KPICard key={i} label="Loading..." value="-" loading variant="primary" />
          ))}
        </div>
      ) : dashboardData ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            label="Total Projects"
            value={dashboardData.kpis.totalProjects}
            variant="primary"
            trend={{
              value: 3,
              direction: 'up',
              label: 'vs last month',
            }}
          />
          <KPICard
            label="Active Projects"
            value={dashboardData.kpis.activeProjects}
            variant="success"
            trend={{
              value: 2,
              direction: 'up',
              label: 'this week',
            }}
          />
          <KPICard
            label="Completed Tasks"
            value={dashboardData.kpis.completedTasks}
            variant="info"
            trend={{
              value: 12,
              direction: 'up',
              label: 'vs last week',
            }}
          />
          <KPICard
            label="Productivity Score"
            value={`${dashboardData.kpis.productivityScore}/10`}
            variant="warning"
            trend={{
              value: 1.2,
              direction: 'up',
              label: 'improvement',
            }}
          />
        </div>
      ) : null}

      {/* Quick Actions and Chart */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="h-96 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
          </div>
          <div className="h-96 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
        </div>
      ) : dashboardData ? (
        <>
          {/* Quick Actions */}
          <QuickActions
            onCreateProject={handleCreateProject}
            onCreateTask={handleCreateTask}
            onInviteTeam={handleInviteTeam}
            onViewReports={handleViewReports}
            onGenerateInsights={handleGenerateInsights}
            onOpenSettings={handleOpenSettings}
          />

          {/* Chart and Team Activity */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TeamActivityChart data={dashboardData.teamActivityTrend} />
            </div>
            <TeamActivity
              teamMembers={dashboardData.teamMembers}
              activityTrend={dashboardData.teamActivityTrend}
            />
          </div>
        </>
      ) : null}

      {/* Recent Activity and Upcoming Deadlines */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-96 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
          <div className="h-96 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
        </div>
      ) : dashboardData ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RecentActivity activities={dashboardData.recentActivity} />
          <UpcomingDeadlines deadlines={dashboardData.upcomingDeadlines} />
        </div>
      ) : null}

      {/* Project Progress */}
      {loading ? (
        <div className="h-96 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
      ) : dashboardData ? (
        <ProjectProgress projects={dashboardData.projectProgress} />
      ) : null}
    </div>
  );
};

export const DashboardPage: React.FC = () => {
  return (
    <ErrorBoundary
      fallback={
        <div className="space-y-6">
          <PageHeader
            title="Dashboard"
            description="Welcome back! Here's an overview of your workspace."
            breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Dashboard' }]}
          />
          <DashboardError
            title="Dashboard Error"
            message="An unexpected error occurred while rendering the dashboard."
            onNavigateHome={() => (window.location.href = '/dashboard')}
          />
        </div>
      }
    >
      <DashboardContent />
    </ErrorBoundary>
  );
};

export default DashboardPage;
