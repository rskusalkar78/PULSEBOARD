import React, { useMemo } from 'react';
import type { FilterConfig } from '@/components';
import { PageHeader, Card, FilterBar, useUrlFilters, Badge, Avatar } from '@/components';
import { FolderKanban, Calendar } from 'lucide-react';

interface MockProject {
  id: string;
  name: string;
  category: string;
  teamMember: string;
  status: 'active' | 'completed' | 'on_hold' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  description: string;
}

const MOCK_PROJECTS: MockProject[] = [
  {
    id: 'proj-1',
    name: 'PulseBoard Redesign',
    category: 'Design System',
    teamMember: 'user-1',
    status: 'active',
    priority: 'high',
    createdAt: '2026-09-01',
    description: 'Overhauling the component library and modern UI design system.',
  },
  {
    id: 'proj-2',
    name: 'Analytics Pipeline',
    category: 'Backend',
    teamMember: 'user-2',
    status: 'active',
    priority: 'urgent',
    createdAt: '2026-08-15',
    description: 'High performance data processing and Supabase integration.',
  },
  {
    id: 'proj-3',
    name: 'Mobile App Support',
    category: 'Mobile',
    teamMember: 'user-3',
    status: 'on_hold',
    priority: 'medium',
    createdAt: '2026-08-20',
    description: 'Cross-platform PWA setup and native feature integrations.',
  },
  {
    id: 'proj-4',
    name: 'Authentication Upgrade',
    category: 'Security',
    teamMember: 'user-1',
    status: 'completed',
    priority: 'high',
    createdAt: '2026-07-10',
    description: '2FA authentication and Supabase Row Level Security configuration.',
  },
  {
    id: 'proj-5',
    name: 'Customer Dashboard',
    category: 'Frontend',
    teamMember: 'user-4',
    status: 'active',
    priority: 'low',
    createdAt: '2026-09-05',
    description: 'Real-time telemetry and project monitoring dashboard.',
  },
];

const FILTER_CONFIG: FilterConfig = {
  projects: [
    { id: 'proj-1', label: 'PulseBoard Redesign' },
    { id: 'proj-2', label: 'Analytics Pipeline' },
    { id: 'proj-3', label: 'Mobile App Support' },
    { id: 'proj-4', label: 'Authentication Upgrade' },
    { id: 'proj-5', label: 'Customer Dashboard' },
  ],
  teamMembers: [
    {
      id: 'user-1',
      label: 'Alex Morgan',
      sublabel: 'Lead Designer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    {
      id: 'user-2',
      label: 'Sarah Chen',
      sublabel: 'Senior Engineer',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    },
    {
      id: 'user-3',
      label: 'Michael Brown',
      sublabel: 'Mobile Dev',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    },
    {
      id: 'user-4',
      label: 'Emma Watson',
      sublabel: 'Product Manager',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    },
  ],
  statuses: [
    { id: 'active', label: 'Active', color: '#10b981' },
    { id: 'completed', label: 'Completed', color: '#3b82f6' },
    { id: 'on_hold', label: 'On Hold', color: '#f59e0b' },
    { id: 'archived', label: 'Archived', color: '#64748b' },
  ],
  priorities: [
    { id: 'low', label: 'Low', color: '#64748b' },
    { id: 'medium', label: 'Medium', color: '#3b82f6' },
    { id: 'high', label: 'High', color: '#f59e0b' },
    { id: 'urgent', label: 'Urgent', color: '#ef4444' },
  ],
  categories: [
    { id: 'Design System', label: 'Design System' },
    { id: 'Backend', label: 'Backend' },
    { id: 'Mobile', label: 'Mobile' },
    { id: 'Security', label: 'Security' },
    { id: 'Frontend', label: 'Frontend' },
  ],
};

export const ProjectsPage: React.FC = () => {
  const { filters, activeCount, setFilter, removeFilterItem, clearFilters } = useUrlFilters();

  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS.filter((project) => {
      // Search filter
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchName = project.name.toLowerCase().includes(query);
        const matchDesc = project.description.toLowerCase().includes(query);
        if (!matchName && !matchDesc) return false;
      }

      // Project filter
      if (filters.projects.length > 0 && !filters.projects.includes(project.id)) {
        return false;
      }

      // Team Member filter
      if (filters.teamMembers.length > 0 && !filters.teamMembers.includes(project.teamMember)) {
        return false;
      }

      // Status filter
      if (filters.statuses.length > 0 && !filters.statuses.includes(project.status)) {
        return false;
      }

      // Priority filter
      if (filters.priorities.length > 0 && !filters.priorities.includes(project.priority)) {
        return false;
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(project.category)) {
        return false;
      }

      // Date Range filter
      if (filters.dateRange?.from) {
        if (project.createdAt < filters.dateRange.from) return false;
      }
      if (filters.dateRange?.to) {
        if (project.createdAt > filters.dateRange.to) return false;
      }

      return true;
    });
  }, [filters]);

  const getMember = (id: string) => FILTER_CONFIG.teamMembers?.find((m) => m.id === id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Manage your projects with advanced URL-synchronized filters."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Projects' }]}
      />

      {/* Filter Bar */}
      <Card className="p-4">
        <FilterBar
          filters={filters}
          config={FILTER_CONFIG}
          activeCount={activeCount}
          onSetFilter={setFilter}
          onRemoveItem={removeFilterItem}
          onClearFilters={clearFilters}
          placeholder="Search projects by title or description..."
        />
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Showing{' '}
          <span className="text-slate-900 dark:text-white font-bold">
            {filteredProjects.length}
          </span>{' '}
          of {MOCK_PROJECTS.length} projects
        </p>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <FolderKanban className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            No projects found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting or clearing your active filters to view more projects.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 text-xs font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400"
          >
            Clear all filters
          </button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const member = getMember(project.teamMember);
            return (
              <Card
                key={project.id}
                className="p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center shrink-0">
                        <FolderKanban className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white line-clamp-1">
                          {project.name}
                        </h3>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {project.category}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        project.status === 'completed'
                          ? 'success'
                          : project.status === 'active'
                            ? 'primary'
                            : 'warning'
                      }
                      size="sm"
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                    {project.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    {member && <Avatar src={member.avatar} alt={member.label} size="xs" />}
                    <span>{member?.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{project.createdAt}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
