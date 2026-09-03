/**
 * Dashboard types for KPIs, metrics, and related data
 */

export interface KPICard {
  id: string;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label: string;
  };
  icon?: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: 'active' | 'idle' | 'offline';
  email: string;
}

export interface ActivityLog {
  id: string;
  type:
    | 'project_created'
    | 'task_completed'
    | 'comment_added'
    | 'project_updated'
    | 'team_member_joined';
  user: TeamMember;
  title: string;
  description?: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface Deadline {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  assignee: TeamMember;
}

export interface ProjectMetrics {
  id: string;
  name: string;
  completion: number; // 0-100
  status: 'planning' | 'active' | 'completed' | 'on_hold';
  taskCount: number;
  completedTasks: number;
  teamSize: number;
  dueDate: Date;
}

export interface TeamActivity {
  date: Date;
  completedTasks: number;
  activeUsers: number;
  newProjects: number;
}

export interface DashboardData {
  kpis: {
    totalProjects: number;
    activeProjects: number;
    completedTasks: number;
    productivityScore: number;
  };
  teamMembers: TeamMember[];
  recentActivity: ActivityLog[];
  upcomingDeadlines: Deadline[];
  projectProgress: ProjectMetrics[];
  teamActivityTrend: TeamActivity[];
}
