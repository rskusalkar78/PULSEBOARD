-- =====================================================
-- PULSEBOARD DATABASE SCHEMA
-- Migration: 20260828000001_initial_schema
-- Description: Initial database schema with all core tables
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for secure functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- PROFILES TABLE
-- Extends Supabase auth.users with additional profile data
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'manager')),
  bio TEXT,
  timezone TEXT DEFAULT 'UTC',
  preferences JSONB DEFAULT '{
    "theme": "system",
    "notifications": {
      "email": true,
      "push": true,
      "inApp": true
    },
    "language": "en"
  }'::jsonb,
  onboarded BOOLEAN DEFAULT FALSE,
  last_seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles indexes
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_created_at ON public.profiles(created_at DESC);

-- Profiles updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- TEAMS TABLE
-- Organizations/workspaces for collaborative work
-- =====================================================
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  avatar_url TEXT,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  settings JSONB DEFAULT '{
    "defaultProjectVisibility": "private",
    "allowMemberInvites": true,
    "requireApproval": false
  }'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teams indexes
CREATE INDEX idx_teams_owner_id ON public.teams(owner_id);
CREATE INDEX idx_teams_slug ON public.teams(slug);
CREATE INDEX idx_teams_created_at ON public.teams(created_at DESC);

-- Teams updated_at trigger
CREATE TRIGGER teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- TEAM_MEMBERS TABLE
-- Junction table for team membership with roles
-- =====================================================
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  permissions JSONB DEFAULT '{
    "canCreateProjects": true,
    "canDeleteProjects": false,
    "canManageMembers": false,
    "canManageSettings": false
  }'::jsonb,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  invited_by UUID REFERENCES public.profiles(id),
  
  UNIQUE(team_id, user_id)
);

-- Team members indexes
CREATE INDEX idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX idx_team_members_role ON public.team_members(role);

-- =====================================================
-- PROJECTS TABLE
-- Projects contain tasks and belong to teams or users
-- =====================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'completed', 'on_hold')),
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'team', 'public')),
  color TEXT DEFAULT '#3B82F6',
  icon TEXT,
  start_date DATE,
  due_date DATE,
  settings JSONB DEFAULT '{
    "taskPrefix": "TASK",
    "allowComments": true,
    "requireTaskApproval": false
  }'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(owner_id, slug),
  UNIQUE(team_id, slug)
);

-- Projects indexes
CREATE INDEX idx_projects_owner_id ON public.projects(owner_id);
CREATE INDEX idx_projects_team_id ON public.projects(team_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_visibility ON public.projects(visibility);
CREATE INDEX idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX idx_projects_due_date ON public.projects(due_date) WHERE due_date IS NOT NULL;

-- Projects updated_at trigger
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- TASKS TABLE
-- Individual work items within projects
-- =====================================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  assigned_to UUID REFERENCES public.profiles(id),
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'in_review', 'completed', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  tags TEXT[] DEFAULT '{}',
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  estimated_hours DECIMAL(10, 2),
  actual_hours DECIMAL(10, 2),
  position INTEGER NOT NULL DEFAULT 0,
  parent_task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks indexes
CREATE INDEX idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX idx_tasks_created_by ON public.tasks(created_by);
CREATE INDEX idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_priority ON public.tasks(priority);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date) WHERE due_date IS NOT NULL;
CREATE INDEX idx_tasks_parent_task_id ON public.tasks(parent_task_id) WHERE parent_task_id IS NOT NULL;
CREATE INDEX idx_tasks_position ON public.tasks(project_id, position);
CREATE INDEX idx_tasks_tags ON public.tasks USING GIN(tags);

-- Tasks updated_at trigger
CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Auto-set completed_at when status changes to completed
CREATE OR REPLACE FUNCTION public.handle_task_completed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at = NOW();
  ELSIF NEW.status != 'completed' THEN
    NEW.completed_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tasks_completed_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_task_completed();

-- =====================================================
-- ACTIVITIES TABLE
-- Activity feed for all actions across the platform
-- =====================================================
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('project', 'task', 'team', 'user', 'comment')),
  entity_id UUID NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activities indexes
CREATE INDEX idx_activities_actor_id ON public.activities(actor_id);
CREATE INDEX idx_activities_entity_type_id ON public.activities(entity_type, entity_id);
CREATE INDEX idx_activities_project_id ON public.activities(project_id);
CREATE INDEX idx_activities_team_id ON public.activities(team_id);
CREATE INDEX idx_activities_created_at ON public.activities(created_at DESC);

-- =====================================================
-- NOTIFICATIONS TABLE
-- User notifications for important events
-- =====================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('mention', 'assignment', 'comment', 'status_change', 'due_date', 'team_invite', 'system')),
  title TEXT NOT NULL,
  message TEXT,
  action_url TEXT,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  entity_type TEXT CHECK (entity_type IN ('project', 'task', 'team', 'comment')),
  entity_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_user_read ON public.notifications(user_id, read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_notifications_entity ON public.notifications(entity_type, entity_id);

-- Auto-set read_at when read changes to true
CREATE OR REPLACE FUNCTION public.handle_notification_read()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.read = TRUE AND OLD.read = FALSE THEN
    NEW.read_at = NOW();
  ELSIF NEW.read = FALSE THEN
    NEW.read_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notifications_read_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_notification_read();

-- =====================================================
-- ANALYTICS_EVENTS TABLE
-- Track user actions and system events for analytics
-- =====================================================
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL,
  event_category TEXT NOT NULL CHECK (event_category IN ('user', 'project', 'task', 'team', 'system')),
  properties JSONB DEFAULT '{}'::jsonb,
  session_id UUID,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics indexes
CREATE INDEX idx_analytics_user_id ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_event_name ON public.analytics_events(event_name);
CREATE INDEX idx_analytics_event_category ON public.analytics_events(event_category);
CREATE INDEX idx_analytics_created_at ON public.analytics_events(created_at DESC);
CREATE INDEX idx_analytics_session_id ON public.analytics_events(session_id);

-- Partition analytics_events by month for better performance
-- This should be set up separately based on data volume

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to get user's team memberships
CREATE OR REPLACE FUNCTION public.get_user_teams(user_uuid UUID)
RETURNS TABLE (
  team_id UUID,
  team_name TEXT,
  team_slug TEXT,
  member_role TEXT,
  joined_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.name,
    t.slug,
    tm.role,
    tm.joined_at
  FROM public.teams t
  INNER JOIN public.team_members tm ON t.id = tm.team_id
  WHERE tm.user_id = user_uuid
  ORDER BY tm.joined_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can access project
CREATE OR REPLACE FUNCTION public.can_access_project(user_uuid UUID, project_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  project_owner UUID;
  project_team UUID;
  project_visibility TEXT;
  is_team_member BOOLEAN;
BEGIN
  -- Get project details
  SELECT owner_id, team_id, visibility 
  INTO project_owner, project_team, project_visibility
  FROM public.projects
  WHERE id = project_uuid;
  
  -- Owner can always access
  IF project_owner = user_uuid THEN
    RETURN TRUE;
  END IF;
  
  -- Public projects are accessible to all authenticated users
  IF project_visibility = 'public' THEN
    RETURN TRUE;
  END IF;
  
  -- Team projects: check team membership
  IF project_visibility = 'team' AND project_team IS NOT NULL THEN
    SELECT EXISTS(
      SELECT 1 FROM public.team_members
      WHERE team_id = project_team AND user_id = user_uuid
    ) INTO is_team_member;
    
    RETURN is_team_member;
  END IF;
  
  -- Private projects: only owner
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE public.profiles IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE public.teams IS 'Organizations or workspaces for collaborative work';
COMMENT ON TABLE public.team_members IS 'Team membership with roles and permissions';
COMMENT ON TABLE public.projects IS 'Projects containing tasks';
COMMENT ON TABLE public.tasks IS 'Individual work items within projects';
COMMENT ON TABLE public.activities IS 'Activity feed for all platform actions';
COMMENT ON TABLE public.notifications IS 'User notifications for important events';
COMMENT ON TABLE public.analytics_events IS 'Analytics and tracking events';
