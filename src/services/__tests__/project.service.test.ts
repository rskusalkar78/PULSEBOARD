/**
 * Project Service Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { projectService } from '../project.service';
import {
  createMockSupabaseClient,
  createSuccessResponse,
  createErrorResponse,
} from '@/test/mocks/supabase';
import { createMockProject, createMockItems } from '@/test';

// Mock Supabase
const mockSupabase = createMockSupabaseClient();

vi.mock('@/lib/supabase', () => ({
  supabase: mockSupabase,
  callFunction: vi.fn(),
}));

describe('projectService.getById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retrieves project by ID', async () => {
    const mockProject = createMockProject();
    mockSupabase.from().single.mockResolvedValue(createSuccessResponse(mockProject));

    const result = await projectService.getById('proj-123');

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockProject);
    expect(mockSupabase.from).toHaveBeenCalledWith('projects');
  });

  it('handles not found error', async () => {
    mockSupabase
      .from()
      .single.mockResolvedValue(createErrorResponse('Project not found', 'PGRST116'));

    const result = await projectService.getById('non-existent');

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });
});

describe('projectService.getAll', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retrieves all projects', async () => {
    const mockProjects = createMockItems(createMockProject, 3);
    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(mockProjects));

    const result = await projectService.getAll();

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(3);
  });
});

describe('projectService.create', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a new project', async () => {
    const newProject = {
      name: 'New Project',
      description: 'A new project',
      team_id: 'team-123',
      owner_id: 'user-123',
    };

    const createdProject = createMockProject(newProject);
    mockSupabase.from().insert.mockResolvedValue(createSuccessResponse(createdProject));
    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(createdProject));
    mockSupabase.from().single.mockResolvedValue(createSuccessResponse(createdProject));

    const result = await projectService.create(newProject);

    expect(result.success).toBe(true);
    expect(result.data?.name).toBe('New Project');
    expect(mockSupabase.from).toHaveBeenCalledWith('projects');
  });

  it('handles creation errors', async () => {
    mockSupabase
      .from()
      .insert.mockResolvedValue(createErrorResponse('Invalid data', 'VALIDATION_ERROR'));

    const result = await projectService.create({
      name: '',
      team_id: 'team-123',
      owner_id: 'user-123',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });
});

describe('projectService.update', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates an existing project', async () => {
    const updatedProject = createMockProject({ name: 'Updated Name' });
    mockSupabase.from().update.mockResolvedValue(createSuccessResponse(updatedProject));
    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(updatedProject));
    mockSupabase.from().single.mockResolvedValue(createSuccessResponse(updatedProject));

    const result = await projectService.update('proj-123', { name: 'Updated Name' });

    expect(result.success).toBe(true);
    expect(result.data?.name).toBe('Updated Name');
  });
});

describe('projectService.delete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deletes a project', async () => {
    mockSupabase.from().delete.mockResolvedValue(createSuccessResponse(null));

    const result = await projectService.delete('proj-123');

    expect(result.success).toBe(true);
  });
});

describe('projectService.getUserProjects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retrieves projects for a user', async () => {
    const mockProjects = createMockItems(createMockProject, 2, [
      { owner_id: 'user-123' },
      { owner_id: 'user-123' },
    ]);

    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(mockProjects));

    const result = await projectService.getUserProjects('user-123');

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(mockSupabase.from().eq).toHaveBeenCalledWith('owner_id', 'user-123');
  });
});

describe('projectService.getTeamProjects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retrieves projects for a team', async () => {
    const mockProjects = createMockItems(createMockProject, 2, [
      { team_id: 'team-123' },
      { team_id: 'team-123' },
    ]);

    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(mockProjects));

    const result = await projectService.getTeamProjects('team-123');

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(mockSupabase.from().eq).toHaveBeenCalledWith('team_id', 'team-123');
  });
});

describe('projectService.archive', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('archives a project', async () => {
    const archivedProject = createMockProject({ status: 'archived' });
    mockSupabase.from().update.mockResolvedValue(createSuccessResponse(archivedProject));
    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(archivedProject));
    mockSupabase.from().single.mockResolvedValue(createSuccessResponse(archivedProject));

    const result = await projectService.archive('proj-123');

    expect(result.success).toBe(true);
    expect(result.data?.status).toBe('archived');
  });
});

describe('projectService.unarchive', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('unarchives a project', async () => {
    const activeProject = createMockProject({ status: 'active' });
    mockSupabase.from().update.mockResolvedValue(createSuccessResponse(activeProject));
    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(activeProject));
    mockSupabase.from().single.mockResolvedValue(createSuccessResponse(activeProject));

    const result = await projectService.unarchive('proj-123');

    expect(result.success).toBe(true);
    expect(result.data?.status).toBe('active');
  });
});

describe('projectService.complete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('marks project as completed', async () => {
    const completedProject = createMockProject({ status: 'completed' });
    mockSupabase.from().update.mockResolvedValue(createSuccessResponse(completedProject));
    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(completedProject));
    mockSupabase.from().single.mockResolvedValue(createSuccessResponse(completedProject));

    const result = await projectService.complete('proj-123');

    expect(result.success).toBe(true);
    expect(result.data?.status).toBe('completed');
  });
});

describe('projectService.getByStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retrieves projects by status', async () => {
    const activeProjects = createMockItems(createMockProject, 2, [
      { status: 'active' },
      { status: 'active' },
    ]);

    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(activeProjects));

    const result = await projectService.getByStatus('active');

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(mockSupabase.from().eq).toHaveBeenCalledWith('status', 'active');
  });

  it('filters by user when provided', async () => {
    const userProjects = createMockItems(createMockProject, 1, [
      { status: 'active', owner_id: 'user-123' },
    ]);

    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(userProjects));

    const result = await projectService.getByStatus('active', 'user-123');

    expect(result.success).toBe(true);
    expect(mockSupabase.from().eq).toHaveBeenCalledWith('status', 'active');
    expect(mockSupabase.from().eq).toHaveBeenCalledWith('owner_id', 'user-123');
  });
});

describe('projectService.search', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('searches projects by query', async () => {
    const matchingProjects = [
      createMockProject({ name: 'Dashboard Project' }),
      createMockProject({ name: 'Dashboard Analytics' }),
    ];

    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(matchingProjects));

    const result = await projectService.search('dashboard');

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(mockSupabase.from().or).toHaveBeenCalled();
  });

  it('respects limit parameter', async () => {
    mockSupabase.from().select.mockResolvedValue(createSuccessResponse([]));

    await projectService.search('test', 5);

    expect(mockSupabase.from().limit).toHaveBeenCalledWith(5);
  });
});

describe('projectService.updateSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('merges new settings with existing settings', async () => {
    const currentProject = createMockProject({
      settings: { existingSetting: 'value' },
    });

    const updatedProject = createMockProject({
      settings: { existingSetting: 'value', newSetting: 'new value' },
    });

    // Mock getById
    mockSupabase.from().select.mockResolvedValue(createSuccessResponse(currentProject));
    mockSupabase.from().single.mockResolvedValueOnce(createSuccessResponse(currentProject));

    // Mock update
    mockSupabase.from().update.mockResolvedValue(createSuccessResponse(updatedProject));
    mockSupabase.from().single.mockResolvedValueOnce(createSuccessResponse(updatedProject));

    const result = await projectService.updateSettings('proj-123', {
      newSetting: 'new value',
    });

    expect(result.success).toBe(true);
    expect(result.data?.settings).toHaveProperty('existingSetting');
    expect(result.data?.settings).toHaveProperty('newSetting');
  });
});
