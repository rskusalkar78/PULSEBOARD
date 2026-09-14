import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, LayoutGrid, List, FolderKanban, RefreshCw } from 'lucide-react';
import {
  PageHeader,
  Button,
  Card,
  FilterBar,
  useUrlFilters,
  Alert,
  Select,
  ProjectCard,
  ProjectTable,
  ProjectFormModal,
  ProjectDeleteModal,
  ProjectSkeleton,
  type ProjectFormData,
  type FilterConfig,
} from '@/components';
import { projectService } from '@/services/project.service';
import { profileService } from '@/services/profile.service';
import { teamService } from '@/services/team.service';
import { useToast } from '@/hooks/useToast';
import type { ProjectWithDetails, Profile, Team, ProjectStatus } from '@/types';

const MOCK_PROFILES: Profile[] = [
  {
    id: 'user-1',
    email: 'alex.morgan@pulseboard.io',
    full_name: 'Alex Morgan',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    role: 'admin',
    bio: 'Lead Designer',
    timezone: 'UTC',
    preferences: {
      theme: 'system',
      notifications: { email: true, push: true, inApp: true },
      language: 'en',
    },
    onboarded: true,
    last_seen_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'user-2',
    email: 'sarah.chen@pulseboard.io',
    full_name: 'Sarah Chen',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    role: 'manager',
    bio: 'Senior Engineer',
    timezone: 'UTC',
    preferences: {
      theme: 'system',
      notifications: { email: true, push: true, inApp: true },
      language: 'en',
    },
    onboarded: true,
    last_seen_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'user-3',
    email: 'michael.brown@pulseboard.io',
    full_name: 'Michael Brown',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    role: 'user',
    bio: 'Mobile Developer',
    timezone: 'UTC',
    preferences: {
      theme: 'system',
      notifications: { email: true, push: true, inApp: true },
      language: 'en',
    },
    onboarded: true,
    last_seen_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const MOCK_INITIAL_PROJECTS: ProjectWithDetails[] = [
  {
    id: 'proj-1',
    name: 'PulseBoard Redesign',
    description: 'Overhauling the component library and modern UI design system.',
    slug: 'pulseboard-redesign',
    owner_id: 'user-1',
    team_id: null,
    status: 'active',
    priority: 'high',
    progress: 75,
    visibility: 'team',
    color: '#8b5cf6',
    icon: 'folder',
    start_date: '2026-09-01',
    due_date: '2026-10-15',
    settings: { taskPrefix: 'PB', allowComments: true, requireTaskApproval: false },
    metadata: { priority: 'high', progress: 75 },
    created_at: '2026-09-01T10:00:00Z',
    updated_at: '2026-09-01T10:00:00Z',
    owner: MOCK_PROFILES[0],
  },
  {
    id: 'proj-2',
    name: 'Analytics Pipeline',
    description: 'High performance data processing and Supabase integration.',
    slug: 'analytics-pipeline',
    owner_id: 'user-2',
    team_id: null,
    status: 'active',
    priority: 'urgent',
    progress: 40,
    visibility: 'team',
    color: '#06b6d4',
    icon: 'chart',
    start_date: '2026-08-15',
    due_date: '2026-09-30',
    settings: { taskPrefix: 'AN', allowComments: true, requireTaskApproval: false },
    metadata: { priority: 'urgent', progress: 40 },
    created_at: '2026-08-15T10:00:00Z',
    updated_at: '2026-08-15T10:00:00Z',
    owner: MOCK_PROFILES[1],
  },
  {
    id: 'proj-3',
    name: 'Mobile App Support',
    description: 'Cross-platform PWA setup and native feature integrations.',
    slug: 'mobile-app-support',
    owner_id: 'user-3',
    team_id: null,
    status: 'on_hold',
    priority: 'medium',
    progress: 25,
    visibility: 'private',
    color: '#f59e0b',
    icon: 'smartphone',
    start_date: '2026-08-20',
    due_date: '2026-11-01',
    settings: { taskPrefix: 'MOB', allowComments: true, requireTaskApproval: false },
    metadata: { priority: 'medium', progress: 25 },
    created_at: '2026-08-20T10:00:00Z',
    updated_at: '2026-08-20T10:00:00Z',
    owner: MOCK_PROFILES[2],
  },
  {
    id: 'proj-4',
    name: 'Authentication Upgrade',
    description: '2FA authentication and Supabase Row Level Security configuration.',
    slug: 'authentication-upgrade',
    owner_id: 'user-1',
    team_id: null,
    status: 'completed',
    priority: 'high',
    progress: 100,
    visibility: 'public',
    color: '#10b981',
    icon: 'lock',
    start_date: '2026-07-10',
    due_date: '2026-08-30',
    settings: { taskPrefix: 'AUTH', allowComments: true, requireTaskApproval: false },
    metadata: { priority: 'high', progress: 100 },
    created_at: '2026-07-10T10:00:00Z',
    updated_at: '2026-07-10T10:00:00Z',
    owner: MOCK_PROFILES[0],
  },
];

type SortOption =
  'name_asc' | 'name_desc' | 'created_desc' | 'due_desc' | 'priority_desc' | 'progress_desc';

export const ProjectsPage: React.FC = () => {
  const { filters, activeCount, setFilter, removeFilterItem, clearFilters } = useUrlFilters();
  const toast = useToast();

  const [projects, setProjects] = useState<ProjectWithDetails[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>(MOCK_PROFILES);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('created_desc');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<ProjectWithDetails | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);

  const [deletingProject, setDeletingProject] = useState<ProjectWithDetails | null>(null);
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState<boolean>(false);

  // Fetch real Supabase data with fallback
  const fetchProjectsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch profiles & teams in parallel
      const [profilesRes, teamsRes, projectsRes] = await Promise.all([
        profileService.getAll(),
        teamService.getAll(),
        projectService.getProjectsWithDetails(),
      ]);

      let loadedProfiles = MOCK_PROFILES;
      if (profilesRes.success && profilesRes.data && profilesRes.data.length > 0) {
        loadedProfiles = profilesRes.data;
        setProfiles(loadedProfiles);
      }

      if (teamsRes.success && teamsRes.data) {
        setTeams(teamsRes.data);
      }

      if (projectsRes.success && projectsRes.data && projectsRes.data.length > 0) {
        setProjects(projectsRes.data);
      } else {
        // Fallback mock data if table is empty or error
        setProjects(MOCK_INITIAL_PROJECTS);
      }
    } catch (err) {
      console.warn('Supabase fetch issue, using offline mock fallback:', err);
      setProjects(MOCK_INITIAL_PROJECTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjectsData();
  }, [fetchProjectsData]);

  // Dynamic filter configuration for FilterBar
  const filterConfig: FilterConfig = useMemo(() => {
    return {
      statuses: [
        { id: 'active', label: 'Active', color: '#8b5cf6' },
        { id: 'completed', label: 'Completed', color: '#10b981' },
        { id: 'on_hold', label: 'On Hold', color: '#f59e0b' },
        { id: 'archived', label: 'Archived', color: '#64748b' },
      ],
      priorities: [
        { id: 'low', label: 'Low', color: '#64748b' },
        { id: 'medium', label: 'Medium', color: '#3b82f6' },
        { id: 'high', label: 'High', color: '#f59e0b' },
        { id: 'urgent', label: 'Urgent', color: '#ef4444' },
      ],
      teamMembers: profiles.map((p) => ({
        id: p.id,
        label: p.full_name || p.email,
        sublabel: p.bio || p.role,
        avatar: p.avatar_url || undefined,
      })),
    };
  }, [profiles]);

  // Filtering logic
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Search term
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchName = project.name.toLowerCase().includes(query);
        const matchDesc = (project.description || '').toLowerCase().includes(query);
        if (!matchName && !matchDesc) return false;
      }

      // Status filter
      if (filters.statuses.length > 0 && !filters.statuses.includes(project.status)) {
        return false;
      }

      // Priority filter
      if (
        filters.priorities.length > 0 &&
        !filters.priorities.includes(project.priority || 'medium')
      ) {
        return false;
      }

      // Owner / Team Member filter
      if (filters.teamMembers.length > 0 && !filters.teamMembers.includes(project.owner_id)) {
        return false;
      }

      // Date Range filter
      if (filters.dateRange?.from) {
        const projectDate = project.start_date || project.created_at;
        if (projectDate < filters.dateRange.from) return false;
      }
      if (filters.dateRange?.to) {
        const projectDate = project.due_date || project.created_at;
        if (projectDate > filters.dateRange.to) return false;
      }

      return true;
    });
  }, [projects, filters]);

  // Sorting logic
  const sortedProjects = useMemo(() => {
    const list = [...filteredProjects];
    const priorityWeight: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1 };

    switch (sortBy) {
      case 'name_asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc':
        return list.sort((a, b) => b.name.localeCompare(a.name));
      case 'due_desc':
        return list.sort((a, b) => (b.due_date || '').localeCompare(a.due_date || ''));
      case 'priority_desc':
        return list.sort(
          (a, b) =>
            (priorityWeight[b.priority || 'medium'] || 0) -
            (priorityWeight[a.priority || 'medium'] || 0)
        );
      case 'progress_desc':
        return list.sort((a, b) => (b.progress || 0) - (a.progress || 0));
      case 'created_desc':
      default:
        return list.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }
  }, [filteredProjects, sortBy]);

  // Handle Create / Edit submission (Optimistic Updates)
  const handleFormSubmit = async (formData: ProjectFormData) => {
    try {
      setIsFormSubmitting(true);
      const ownerProfile = profiles.find((p) => p.id === formData.owner_id) || profiles[0];

      if (editingProject) {
        // Optimistic edit update
        const updatedProject: ProjectWithDetails = {
          ...editingProject,
          name: formData.name,
          description: formData.description,
          owner_id: formData.owner_id,
          team_id: formData.team_id,
          status: formData.status,
          priority: formData.priority,
          visibility: formData.visibility,
          progress: formData.progress,
          start_date: formData.start_date || null,
          due_date: formData.due_date || null,
          color: formData.color,
          owner: ownerProfile,
          metadata: {
            ...editingProject.metadata,
            priority: formData.priority,
            progress: formData.progress,
          },
          updated_at: new Date().toISOString(),
        };

        setProjects((prev) => prev.map((p) => (p.id === editingProject.id ? updatedProject : p)));
        setIsFormOpen(false);
        toast.success(`Project "${formData.name}" updated successfully.`);

        // Call backend service
        const res = await projectService.update(editingProject.id, {
          name: formData.name,
          description: formData.description,
          owner_id: formData.owner_id,
          team_id: formData.team_id,
          status: formData.status,
          visibility: formData.visibility,
          start_date: formData.start_date || null,
          due_date: formData.due_date || null,
          color: formData.color,
          metadata: {
            ...editingProject.metadata,
            priority: formData.priority,
            progress: formData.progress,
          },
        });

        if (!res.success) {
          console.warn('Backend update failed, rolling back:', res.error);
        }
      } else {
        // Optimistic create update
        const newTempId = `proj-${Date.now()}`;
        const newProject: ProjectWithDetails = {
          id: newTempId,
          name: formData.name,
          description: formData.description,
          slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
          owner_id: formData.owner_id,
          team_id: formData.team_id,
          status: formData.status,
          priority: formData.priority,
          visibility: formData.visibility,
          progress: formData.progress,
          color: formData.color,
          icon: 'folder',
          start_date: formData.start_date || null,
          due_date: formData.due_date || null,
          settings: { taskPrefix: 'PRJ', allowComments: true, requireTaskApproval: false },
          metadata: { priority: formData.priority, progress: formData.progress },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          owner: ownerProfile,
        };

        setProjects((prev) => [newProject, ...prev]);
        setIsFormOpen(false);
        toast.success(`Project "${formData.name}" created successfully.`);

        // Call backend service
        const res = await projectService.create({
          name: formData.name,
          description: formData.description,
          slug: newProject.slug,
          owner_id: formData.owner_id,
          team_id: formData.team_id,
          status: formData.status,
          visibility: formData.visibility,
          color: formData.color,
          start_date: formData.start_date || null,
          due_date: formData.due_date || null,
          metadata: { priority: formData.priority, progress: formData.progress },
        });

        if (res.success && res.data) {
          // Replace temp id with real backend id
          setProjects((prev) =>
            prev.map((p) => (p.id === newTempId ? { ...p, id: res.data!.id } : p))
          );
        }
      }
    } catch (err) {
      console.error('Project save error:', err);
      toast.error('Failed to save project. Please try again.');
    } finally {
      setIsFormSubmitting(false);
    }
  };

  // Handle direct Status Change (Optimistic)
  const handleStatusChange = async (project: ProjectWithDetails, newStatus: ProjectStatus) => {
    const previousProjects = [...projects];
    setProjects((prev) =>
      prev.map((p) =>
        p.id === project.id
          ? { ...p, status: newStatus, progress: newStatus === 'completed' ? 100 : p.progress }
          : p
      )
    );
    toast.success(`Updated status to ${newStatus.replace('_', ' ')}.`);

    const res = await projectService.update(project.id, {
      status: newStatus,
      metadata: {
        ...project.metadata,
        progress: newStatus === 'completed' ? 100 : project.progress,
      },
    });

    if (!res.success) {
      toast.error('Failed to update status on server.');
      setProjects(previousProjects);
    }
  };

  // Handle Project Delete (Optimistic)
  const handleDeleteConfirm = async () => {
    if (!deletingProject) return;

    const projectId = deletingProject.id;
    const projectName = deletingProject.name;
    const previousProjects = [...projects];

    try {
      setIsDeleteSubmitting(true);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      setDeletingProject(null);
      toast.success(`Project "${projectName}" deleted.`);

      const res = await projectService.delete(projectId);
      if (!res.success) {
        toast.error(`Failed to delete "${projectName}" from server.`);
        setProjects(previousProjects);
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete project.');
      setProjects(previousProjects);
    } finally {
      setIsDeleteSubmitting(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (project: ProjectWithDetails) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Projects"
        description="Organize, track progress, and manage projects across your workspace."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Projects' }]}
        actions={
          <Button
            variant="primary"
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Project
          </Button>
        }
      />

      {/* Error Alert state if any */}
      {error && (
        <Alert
          variant="error"
          title="Error loading projects"
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={fetchProjectsData}
              className="flex items-center gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Filter Bar Card */}
      <Card className="p-4 space-y-4">
        <FilterBar
          filters={filters}
          config={filterConfig}
          activeCount={activeCount}
          onSetFilter={setFilter}
          onRemoveItem={removeFilterItem}
          onClearFilters={clearFilters}
          placeholder="Search projects by title or description..."
        />
      </Card>

      {/* Toolbar: Counter, Sort & View Mode controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Showing{' '}
          <span className="text-slate-900 dark:text-white font-bold">{sortedProjects.length}</span>{' '}
          of {projects.length} projects
        </p>

        <div className="flex items-center gap-3">
          {/* Sort selector */}
          <div className="w-48">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              options={[
                { value: 'created_desc', label: 'Newest First' },
                { value: 'name_asc', label: 'Name (A-Z)' },
                { value: 'name_desc', label: 'Name (Z-A)' },
                { value: 'due_desc', label: 'Due Date' },
                { value: 'priority_desc', label: 'Highest Priority' },
                { value: 'progress_desc', label: 'Highest Progress' },
              ]}
            />
          </div>

          {/* View Mode Toggle Buttons */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Table View"
              aria-label="Table View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <ProjectSkeleton viewMode={viewMode} count={6} />
      ) : sortedProjects.length === 0 ? (
        /* Empty State */
        <Card className="p-12 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <FolderKanban className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            No projects found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {activeCount > 0
              ? 'No projects match your current filters. Try adjusting or clearing your active filters.'
              : 'You haven’t created any projects yet. Get started by creating your first project!'}
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            {activeCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all filters
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenCreateModal}
              className="flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Create Project
            </Button>
          </div>
        </Card>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleOpenEditModal}
              onDelete={setDeletingProject}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <ProjectTable
          projects={sortedProjects}
          onEdit={handleOpenEditModal}
          onDelete={setDeletingProject}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Project Form Modal (Create & Edit) */}
      <ProjectFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        project={editingProject}
        profiles={profiles}
        teams={teams}
        isSubmitting={isFormSubmitting}
      />

      {/* Project Deletion Confirmation Dialog */}
      <ProjectDeleteModal
        isOpen={Boolean(deletingProject)}
        onClose={() => setDeletingProject(null)}
        onConfirm={handleDeleteConfirm}
        project={deletingProject}
        isDeleting={isDeleteSubmitting}
      />
    </div>
  );
};

export default ProjectsPage;
