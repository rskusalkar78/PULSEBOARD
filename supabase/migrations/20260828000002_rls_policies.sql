-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- Migration: 20260828000002_rls_policies
-- Description: Comprehensive RLS policies for all tables
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROFILES POLICIES
-- =====================================================

-- Users can view all profiles (for mentions, assignments, etc.)
CREATE POLICY "profiles_select_authenticated"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Users can insert their own profile
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users cannot delete profiles (CASCADE from auth.users handles this)
-- Admins can update any profile (for moderation)
CREATE POLICY "profiles_update_admin"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- TEAMS POLICIES
-- =====================================================

-- Users can view teams they are members of
CREATE POLICY "teams_select_member"
  ON public.teams FOR SELECT
  TO authenticated
  USING (
    -- Owner can see
    owner_id = auth.uid()
    OR
    -- Team members can see
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = teams.id AND user_id = auth.uid()
    )
  );

-- Users can create teams
CREATE POLICY "teams_insert_authenticated"
  ON public.teams FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

-- Team owners and admins can update teams
CREATE POLICY "teams_update_owner_admin"
  ON public.teams FOR UPDATE
  TO authenticated
  USING (
    owner_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = teams.id 
        AND user_id = auth.uid() 
        AND role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    owner_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = teams.id 
        AND user_id = auth.uid() 
        AND role IN ('owner', 'admin')
    )
  );

-- Only team owners can delete teams
CREATE POLICY "teams_delete_owner"
  ON public.teams FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- =====================================================
-- TEAM_MEMBERS POLICIES
-- =====================================================

-- Users can view team members of teams they belong to
CREATE POLICY "team_members_select_member"
  ON public.team_members FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.team_id = team_members.team_id 
        AND tm.user_id = auth.uid()
    )
  );

-- Team owners and admins can add members
CREATE POLICY "team_members_insert_owner_admin"
  ON public.team_members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.teams t
      LEFT JOIN public.team_members tm ON t.id = tm.team_id AND tm.user_id = auth.uid()
      WHERE t.id = team_members.team_id
        AND (
          t.owner_id = auth.uid()
          OR tm.role IN ('owner', 'admin')
        )
    )
  );

-- Team owners and admins can update member roles
CREATE POLICY "team_members_update_owner_admin"
  ON public.team_members FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.teams t
      LEFT JOIN public.team_members tm ON t.id = tm.team_id AND tm.user_id = auth.uid()
      WHERE t.id = team_members.team_id
        AND (
          t.owner_id = auth.uid()
          OR tm.role IN ('owner', 'admin')
        )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.teams t
      LEFT JOIN public.team_members tm ON t.id = tm.team_id AND tm.user_id = auth.uid()
      WHERE t.id = team_members.team_id
        AND (
          t.owner_id = auth.uid()
          OR tm.role IN ('owner', 'admin')
        )
    )
  );

-- Team owners, admins, or the member themselves can remove membership
CREATE POLICY "team_members_delete_owner_admin_self"
  ON public.team_members FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM public.teams t
      LEFT JOIN public.team_members tm ON t.id = tm.team_id AND tm.user_id = auth.uid()
      WHERE t.id = team_members.team_id
        AND (
          t.owner_id = auth.uid()
          OR tm.role IN ('owner', 'admin')
        )
    )
  );

-- =====================================================
-- PROJECTS POLICIES
-- =====================================================

-- Users can view projects based on visibility and access
CREATE POLICY "projects_select_access"
  ON public.projects FOR SELECT
  TO authenticated
  USING (
    -- Owner can see
    owner_id = auth.uid()
    OR
    -- Public projects
    visibility = 'public'
    OR
    -- Team projects where user is a team member
    (
      visibility = 'team'
      AND team_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.team_members
        WHERE team_id = projects.team_id AND user_id = auth.uid()
      )
    )
  );

-- Users can create personal projects or team projects (if team member)
CREATE POLICY "projects_insert_authenticated"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Must be owner
    auth.uid() = owner_id
    AND
    (
      -- Personal project
      team_id IS NULL
      OR
      -- Team project where user is a member
      EXISTS (
        SELECT 1 FROM public.team_members
        WHERE team_id = projects.team_id AND user_id = auth.uid()
      )
    )
  );

-- Project owners and team admins can update projects
CREATE POLICY "projects_update_owner_team_admin"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (
    owner_id = auth.uid()
    OR
    (
      team_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.team_members
        WHERE team_id = projects.team_id 
          AND user_id = auth.uid()
          AND role IN ('owner', 'admin')
      )
    )
  )
  WITH CHECK (
    owner_id = auth.uid()
    OR
    (
      team_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.team_members
        WHERE team_id = projects.team_id 
          AND user_id = auth.uid()
          AND role IN ('owner', 'admin')
      )
    )
  );

-- Only project owners can delete projects
CREATE POLICY "projects_delete_owner"
  ON public.projects FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- =====================================================
-- TASKS POLICIES
-- =====================================================

-- Users can view tasks in projects they have access to
CREATE POLICY "tasks_select_project_access"
  ON public.tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = tasks.project_id
        AND (
          p.owner_id = auth.uid()
          OR p.visibility = 'public'
          OR (
            p.visibility = 'team'
            AND p.team_id IS NOT NULL
            AND EXISTS (
              SELECT 1 FROM public.team_members tm
              WHERE tm.team_id = p.team_id AND tm.user_id = auth.uid()
            )
          )
        )
    )
  );

-- Users can create tasks in projects they have access to
CREATE POLICY "tasks_insert_project_access"
  ON public.tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = created_by
    AND
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = tasks.project_id
        AND (
          p.owner_id = auth.uid()
          OR (
            p.visibility = 'team'
            AND p.team_id IS NOT NULL
            AND EXISTS (
              SELECT 1 FROM public.team_members tm
              WHERE tm.team_id = p.team_id 
                AND tm.user_id = auth.uid()
                AND tm.role IN ('owner', 'admin', 'member')
            )
          )
        )
    )
  );

-- Task creators, assignees, and project owners can update tasks
CREATE POLICY "tasks_update_creator_assignee_owner"
  ON public.tasks FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid()
    OR assigned_to = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = tasks.project_id AND p.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    created_by = auth.uid()
    OR assigned_to = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = tasks.project_id AND p.owner_id = auth.uid()
    )
  );

-- Task creators and project owners can delete tasks
CREATE POLICY "tasks_delete_creator_owner"
  ON public.tasks FOR DELETE
  TO authenticated
  USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = tasks.project_id AND p.owner_id = auth.uid()
    )
  );

-- =====================================================
-- ACTIVITIES POLICIES
-- =====================================================

-- Users can view activities for projects/teams they have access to
CREATE POLICY "activities_select_access"
  ON public.activities FOR SELECT
  TO authenticated
  USING (
    actor_id = auth.uid()
    OR
    (
      project_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = activities.project_id
          AND (
            p.owner_id = auth.uid()
            OR p.visibility = 'public'
            OR (
              p.visibility = 'team'
              AND p.team_id IS NOT NULL
              AND EXISTS (
                SELECT 1 FROM public.team_members tm
                WHERE tm.team_id = p.team_id AND tm.user_id = auth.uid()
              )
            )
          )
      )
    )
    OR
    (
      team_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.team_members tm
        WHERE tm.team_id = activities.team_id AND tm.user_id = auth.uid()
      )
    )
  );

-- Authenticated users can create activities
CREATE POLICY "activities_insert_authenticated"
  ON public.activities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = actor_id);

-- Users cannot update or delete activities (immutable log)
-- Admins can delete activities for moderation
CREATE POLICY "activities_delete_admin"
  ON public.activities FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- NOTIFICATIONS POLICIES
-- =====================================================

-- Users can only view their own notifications
CREATE POLICY "notifications_select_own"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- System can create notifications (typically via backend functions)
CREATE POLICY "notifications_insert_system"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Users can update their own notifications (mark as read)
CREATE POLICY "notifications_update_own"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own notifications
CREATE POLICY "notifications_delete_own"
  ON public.notifications FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- =====================================================
-- ANALYTICS_EVENTS POLICIES
-- =====================================================

-- Users can view their own analytics events
CREATE POLICY "analytics_events_select_own"
  ON public.analytics_events FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can view all analytics events
CREATE POLICY "analytics_events_select_admin"
  ON public.analytics_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- System can insert analytics events
CREATE POLICY "analytics_events_insert_system"
  ON public.analytics_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Analytics events are immutable (no updates or deletes)
-- Admins can delete for data cleanup
CREATE POLICY "analytics_events_delete_admin"
  ON public.analytics_events FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- AUTOMATIC PROFILE CREATION
-- =====================================================

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile automatically
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- REALTIME CONFIGURATION
-- =====================================================

-- Enable realtime for notifications (user-specific, safe)
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Enable realtime for activities (filtered by RLS)
ALTER PUBLICATION supabase_realtime ADD TABLE public.activities;

-- Enable realtime for tasks (filtered by RLS)
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON POLICY "profiles_select_authenticated" ON public.profiles IS 'All authenticated users can view profiles for collaboration features';
COMMENT ON POLICY "teams_select_member" ON public.teams IS 'Users can only see teams they are members of';
COMMENT ON POLICY "projects_select_access" ON public.projects IS 'Complex visibility rules: owner, public, or team member';
COMMENT ON POLICY "tasks_select_project_access" ON public.tasks IS 'Tasks inherit access from their parent project';
COMMENT ON POLICY "notifications_select_own" ON public.notifications IS 'Users can only see their own notifications';
