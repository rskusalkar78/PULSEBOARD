/**
 * Mock data for the Executive Dashboard
 * Provides realistic typed sample data for development and testing
 */

import type {
  DashboardData,
  TeamMember,
  ActivityLog,
  Deadline,
  ProjectMetrics,
  TeamActivity,
} from '@/types/dashboard';

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Project Manager',
    avatar: 'SC',
    status: 'active',
    email: 'sarah.chen@pulseboard.dev',
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    role: 'Lead Developer',
    avatar: 'MR',
    status: 'active',
    email: 'michael.rodriguez@pulseboard.dev',
  },
  {
    id: '3',
    name: 'Emily Watson',
    role: 'UI/UX Designer',
    avatar: 'EW',
    status: 'idle',
    email: 'emily.watson@pulseboard.dev',
  },
  {
    id: '4',
    name: 'James Park',
    role: 'QA Engineer',
    avatar: 'JP',
    status: 'active',
    email: 'james.park@pulseboard.dev',
  },
  {
    id: '5',
    name: 'Priya Patel',
    role: 'Product Lead',
    avatar: 'PP',
    status: 'offline',
    email: 'priya.patel@pulseboard.dev',
  },
  {
    id: '6',
    name: 'David Kim',
    role: 'Backend Developer',
    avatar: 'DK',
    status: 'active',
    email: 'david.kim@pulseboard.dev',
  },
];

const generateActivityLogs = (): ActivityLog[] => {
  const now = new Date();
  return [
    {
      id: '1',
      type: 'task_completed',
      user: mockTeamMembers[0]!,
      title: 'Design System Documentation Completed',
      description:
        'Sarah completed the comprehensive design system documentation for all UI components.',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: '2',
      type: 'project_created',
      user: mockTeamMembers[1]!,
      title: 'New Mobile App Project Initiated',
      description: 'Michael created a new project for the cross-platform mobile application.',
      timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
    {
      id: '3',
      type: 'task_completed',
      user: mockTeamMembers[3]!,
      title: 'Performance Testing Suite Completed',
      description: 'James finished the comprehensive performance testing suite.',
      timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000), // 8 hours ago
    },
    {
      id: '4',
      type: 'comment_added',
      user: mockTeamMembers[2]!,
      title: 'New Design Review Comments Added',
      description: 'Emily provided feedback on the latest design mockups.',
      timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000), // 12 hours ago
    },
    {
      id: '5',
      type: 'project_updated',
      user: mockTeamMembers[5]!,
      title: 'API Integration Layer Refactored',
      description: 'David refactored the API integration layer for better maintainability.',
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: '6',
      type: 'team_member_joined',
      user: mockTeamMembers[4]!,
      title: 'Priya Joined PulseBoard Team',
      description: 'Priya has been added as Product Lead to the organization.',
      timestamp: new Date(now.getTime() - 48 * 60 * 60 * 1000), // 2 days ago
    },
  ];
};

const generateUpcomingDeadlines = (): Deadline[] => {
  const now = new Date();
  return [
    {
      id: '1',
      projectId: 'proj-001',
      projectName: 'Mobile App MVP',
      title: 'UI Implementation Complete',
      dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days
      priority: 'urgent',
      status: 'in_progress',
      assignee: mockTeamMembers[2]!,
    },
    {
      id: '2',
      projectId: 'proj-002',
      projectName: 'Backend API Redesign',
      title: 'API Documentation',
      dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days
      priority: 'high',
      status: 'in_progress',
      assignee: mockTeamMembers[5]!,
    },
    {
      id: '3',
      projectId: 'proj-003',
      projectName: 'Analytics Dashboard',
      title: 'Beta Testing Setup',
      dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
      priority: 'medium',
      status: 'not_started',
      assignee: mockTeamMembers[3]!,
    },
    {
      id: '4',
      projectId: 'proj-001',
      projectName: 'Mobile App MVP',
      title: 'Client Presentation',
      dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days
      priority: 'medium',
      status: 'not_started',
      assignee: mockTeamMembers[0]!,
    },
    {
      id: '5',
      projectId: 'proj-004',
      projectName: 'Security Audit',
      title: 'Penetration Testing Report',
      dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days overdue
      priority: 'urgent',
      status: 'overdue',
      assignee: mockTeamMembers[4]!,
    },
  ];
};

const generateProjectProgress = (): ProjectMetrics[] => {
  return [
    {
      id: 'proj-001',
      name: 'Mobile App MVP',
      completion: 68,
      status: 'active',
      taskCount: 45,
      completedTasks: 31,
      teamSize: 5,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'proj-002',
      name: 'Backend API Redesign',
      completion: 45,
      status: 'active',
      taskCount: 32,
      completedTasks: 14,
      teamSize: 3,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'proj-003',
      name: 'Analytics Dashboard',
      completion: 82,
      status: 'active',
      taskCount: 28,
      completedTasks: 23,
      teamSize: 4,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'proj-004',
      name: 'Security Audit',
      completion: 25,
      status: 'planning',
      taskCount: 20,
      completedTasks: 5,
      teamSize: 2,
      dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'proj-005',
      name: 'Documentation Portal',
      completion: 100,
      status: 'completed',
      taskCount: 18,
      completedTasks: 18,
      teamSize: 2,
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  ];
};

const generateTeamActivityTrend = (): TeamActivity[] => {
  const data: TeamActivity[] = [];
  const now = new Date();

  for (let i = 13; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    data.push({
      date,
      completedTasks: Math.floor(Math.random() * 25) + 8,
      activeUsers: Math.floor(Math.random() * 4) + 3,
      newProjects: Math.floor(Math.random() * 3),
    });
  }

  return data;
};

/**
 * Get mock dashboard data
 * Returns static, typed mock data that doesn't change on every render
 */
export const getMockDashboardData = (): DashboardData => {
  return {
    kpis: {
      totalProjects: 12,
      activeProjects: 8,
      completedTasks: 247,
      productivityScore: 8.4, // out of 10
    },
    teamMembers: mockTeamMembers,
    recentActivity: generateActivityLogs(),
    upcomingDeadlines: generateUpcomingDeadlines(),
    projectProgress: generateProjectProgress(),
    teamActivityTrend: generateTeamActivityTrend(),
  };
};

// Cache the data so it doesn't regenerate on every call
let cachedData: DashboardData | null = null;

/**
 * Get cached mock dashboard data
 * This ensures consistent data across renders without random generation
 */
export const getCachedDashboardData = (): DashboardData => {
  if (!cachedData) {
    cachedData = getMockDashboardData();
  }
  return cachedData;
};
