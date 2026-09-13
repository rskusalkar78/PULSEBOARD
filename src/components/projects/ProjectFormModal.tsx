import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  Input,
  Textarea,
  Select,
} from '@/components';
import type {
  ProjectWithDetails,
  Profile,
  Team,
  ProjectStatus,
  ProjectPriority,
  ProjectVisibility,
} from '@/types';

export interface ProjectFormData {
  name: string;
  description: string;
  owner_id: string;
  team_id: string | null;
  status: ProjectStatus;
  priority: ProjectPriority;
  visibility: ProjectVisibility;
  progress: number;
  start_date: string;
  due_date: string;
  color: string;
}

export interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: ProjectFormData) => Promise<void> | void;
  project?: ProjectWithDetails | null;
  profiles: Profile[];
  teams: Team[];
  isSubmitting?: boolean;
}

const PRESET_COLORS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#ef4444', // Red
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#64748b', // Slate
];

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  project,
  profiles,
  teams,
  isSubmitting = false,
}) => {
  const isEditing = Boolean(project);

  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    owner_id: '',
    team_id: null,
    status: 'active',
    priority: 'medium',
    visibility: 'team',
    progress: 0,
    start_date: '',
    due_date: '',
    color: '#6366f1',
  });

  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        owner_id: project.owner_id || (profiles[0]?.id ?? ''),
        team_id: project.team_id || null,
        status: project.status || 'active',
        priority: project.priority || 'medium',
        visibility: project.visibility || 'team',
        progress: project.progress || 0,
        start_date: project.start_date ? project.start_date.split('T')[0] : '',
        due_date: project.due_date ? project.due_date.split('T')[0] : '',
        color: project.color || '#6366f1',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        owner_id: profiles[0]?.id || '',
        team_id: teams[0]?.id || null,
        status: 'active',
        priority: 'medium',
        visibility: 'team',
        progress: 0,
        start_date: new Date().toISOString().split('T')[0],
        due_date: '',
        color: '#6366f1',
      });
    }
    setErrors({});
  }, [project, profiles, teams, isOpen]);

  const handleChange = (field: keyof ProjectFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === 'name' && errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrors({ name: 'Project name is required' });
      return;
    }

    await onSubmit(formData);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>{isEditing ? 'Edit Project' : 'Create New Project'}</DialogTitle>
        <DialogDescription>
          {isEditing
            ? 'Update the project details, status, priority, and assignees.'
            : 'Add a new project to track work, deadlines, and team progress.'}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {/* Project Name */}
        <Input
          label="Project Name *"
          placeholder="e.g., Redesign Dashboard UI"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
        />

        {/* Description */}
        <Textarea
          label="Description"
          placeholder="Brief overview of project goals and scope..."
          rows={3}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Owner Select */}
          <Select
            label="Project Owner"
            value={formData.owner_id}
            onChange={(e) => handleChange('owner_id', e.target.value)}
            options={
              profiles.length > 0
                ? profiles.map((p) => ({
                    value: p.id,
                    label: p.full_name || p.email,
                  }))
                : [{ value: '', label: 'No profiles available' }]
            }
          />

          {/* Team Select */}
          <Select
            label="Team (Optional)"
            value={formData.team_id || ''}
            onChange={(e) => handleChange('team_id', e.target.value || null)}
            options={[
              { value: '', label: 'None (Personal Project)' },
              ...teams.map((t) => ({
                value: t.id,
                label: t.name,
              })),
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Status Select */}
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value as ProjectStatus)}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'completed', label: 'Completed' },
              { value: 'on_hold', label: 'On Hold' },
              { value: 'archived', label: 'Archived' },
            ]}
          />

          {/* Priority Select */}
          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value as ProjectPriority)}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'urgent', label: 'Urgent' },
            ]}
          />

          {/* Visibility Select */}
          <Select
            label="Visibility"
            value={formData.visibility}
            onChange={(e) => handleChange('visibility', e.target.value as ProjectVisibility)}
            options={[
              { value: 'team', label: 'Team' },
              { value: 'private', label: 'Private' },
              { value: 'public', label: 'Public' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Start Date */}
          <Input
            type="date"
            label="Start Date"
            value={formData.start_date}
            onChange={(e) => handleChange('start_date', e.target.value)}
          />

          {/* Due Date */}
          <Input
            type="date"
            label="Due Date"
            value={formData.due_date}
            onChange={(e) => handleChange('due_date', e.target.value)}
          />

          {/* Progress % */}
          <Input
            type="number"
            min={0}
            max={100}
            label="Progress (%)"
            value={formData.progress}
            onChange={(e) =>
              handleChange(
                'progress',
                Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0))
              )
            }
          />
        </div>

        {/* Color Palette Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Project Color Accent
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={`h-7 w-7 rounded-full transition-transform border-2 ${
                  formData.color === c
                    ? 'border-slate-900 dark:border-white scale-110 shadow-md'
                    : 'border-transparent hover:scale-105'
                }`}
                style={{ backgroundColor: c }}
                onClick={() => handleChange('color', c)}
                aria-label={`Select color ${c}`}
              />
            ))}
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
