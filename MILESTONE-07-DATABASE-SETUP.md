# Milestone 07 - Database Setup Guide

Complete guide for setting up the PulseBoard database with Supabase.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Project Setup](#supabase-project-setup)
3. [Environment Configuration](#environment-configuration)
4. [Running Migrations](#running-migrations)
5. [Storage Buckets Setup](#storage-buckets-setup)
6. [Testing RLS Policies](#testing-rls-policies)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Node.js 18+ installed
- A Supabase account ([supabase.com](https://supabase.com))
- Git for version control
- Basic understanding of SQL and PostgreSQL

---

## Supabase Project Setup

### 1. Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in the details:
   - **Name:** PulseBoard
   - **Database Password:** (Choose a strong password and save it securely)
   - **Region:** (Choose closest to your users)
   - **Pricing Plan:** Free tier is sufficient for development
4. Click **"Create new project"**
5. Wait for the project to be provisioned (2-3 minutes)

### 2. Get Your API Credentials

Once your project is ready:

1. Go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (this is safe to use in frontend)
   - ⚠️ **NEVER use the `service_role` key in frontend code**

---

## Environment Configuration

### 1. Update `.env` File

Copy the credentials to your `.env` file:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

### 2. Verify Environment Variables

The application will automatically validate these on startup. If invalid, you'll see an error in the console.

---

## Running Migrations

### Option 1: Supabase Dashboard (Recommended for First Time)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **"New query"**
4. Copy the contents of `supabase/migrations/20260828000001_initial_schema.sql`
5. Paste into the SQL Editor
6. Click **"Run"**
7. Repeat for `supabase/migrations/20260828000002_rls_policies.sql`

**Expected Result:**

- All tables created successfully
- RLS policies enabled
- Triggers and functions created
- No errors in the output

### Option 2: Supabase CLI (For Development/Production)

1. **Install Supabase CLI:**

```bash
npm install -g supabase
```

2. **Login to Supabase:**

```bash
supabase login
```

3. **Link Your Project:**

```bash
supabase link --project-ref your-project-ref
```

Get your `project-ref` from the Project Settings > General > Reference ID

4. **Run Migrations:**

```bash
supabase db push
```

This will apply all migrations in the `supabase/migrations` directory.

5. **Verify Migrations:**

```bash
supabase db diff
```

Should show no differences if migrations are applied correctly.

---

## Storage Buckets Setup

### 1. Create Storage Buckets

Go to **Storage** in your Supabase dashboard and create the following buckets:

#### Avatars Bucket

- **Name:** `avatars`
- **Public:** ✅ Yes
- **File size limit:** 2MB
- **Allowed MIME types:** `image/*`

#### Projects Bucket

- **Name:** `projects`
- **Public:** ❌ No
- **File size limit:** 5MB
- **Allowed MIME types:** `image/*, application/pdf, text/*`

#### Attachments Bucket

- **Name:** `attachments`
- **Public:** ❌ No
- **File size limit:** 10MB
- **Allowed MIME types:** `*/*` (or specify as needed)

### 2. Configure Storage Policies

For each bucket, add the following RLS policies:

#### Avatars Bucket Policies

**Allow authenticated users to upload their own avatar:**

```sql
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

**Allow public read access:**

```sql
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

**Allow users to update their own avatar:**

```sql
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

**Allow users to delete their own avatar:**

```sql
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Projects/Attachments Bucket Policies

Apply similar patterns based on project ownership and team membership.

---

## Testing RLS Policies

### 1. Test Authentication

```typescript
import { supabase } from '@/lib/supabase';

// Sign up a test user
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'testpassword123',
});

console.log('User created:', data.user);
```

### 2. Test Profile Creation

Profiles should be automatically created via the `on_auth_user_created` trigger.

```typescript
import { profileService } from '@/services';

// Get current user's profile
const { data: profile } = await profileService.getCurrentProfile();
console.log('Profile:', profile);
```

### 3. Test RLS Policies

**Test Project Access:**

```typescript
import { projectService } from '@/services';

// Create a personal project
const { data: project } = await projectService.create({
  name: 'Test Project',
  slug: 'test-project',
  owner_id: 'current-user-id',
  visibility: 'private',
});

// Try to access as another user (should fail)
// Try to access with same user (should succeed)
```

### 4. Verify RLS is Enabled

Run this SQL in Supabase SQL Editor:

```sql
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

All tables should have `rowsecurity = true`.

---

## Database Schema Overview

### Tables Structure

```
profiles (extends auth.users)
  ├── id (UUID, PK)
  ├── email (TEXT, UNIQUE)
  ├── full_name (TEXT)
  ├── avatar_url (TEXT)
  ├── role (ENUM: user, admin, manager)
  └── preferences (JSONB)

teams
  ├── id (UUID, PK)
  ├── name (TEXT)
  ├── slug (TEXT, UNIQUE)
  ├── owner_id (UUID, FK → profiles)
  └── settings (JSONB)

team_members
  ├── id (UUID, PK)
  ├── team_id (UUID, FK → teams)
  ├── user_id (UUID, FK → profiles)
  ├── role (ENUM: owner, admin, member, viewer)
  └── permissions (JSONB)

projects
  ├── id (UUID, PK)
  ├── name (TEXT)
  ├── slug (TEXT)
  ├── owner_id (UUID, FK → profiles)
  ├── team_id (UUID, FK → teams)
  ├── status (ENUM: active, archived, completed, on_hold)
  ├── visibility (ENUM: private, team, public)
  └── settings (JSONB)

tasks
  ├── id (UUID, PK)
  ├── title (TEXT)
  ├── project_id (UUID, FK → projects)
  ├── created_by (UUID, FK → profiles)
  ├── assigned_to (UUID, FK → profiles)
  ├── status (ENUM: todo, in_progress, in_review, completed, cancelled)
  ├── priority (ENUM: low, medium, high, urgent)
  ├── parent_task_id (UUID, FK → tasks) [for subtasks]
  └── metadata (JSONB)

activities
  ├── id (UUID, PK)
  ├── actor_id (UUID, FK → profiles)
  ├── action (TEXT)
  ├── entity_type (ENUM: project, task, team, user, comment)
  ├── entity_id (UUID)
  └── metadata (JSONB)

notifications
  ├── id (UUID, PK)
  ├── user_id (UUID, FK → profiles)
  ├── type (ENUM: mention, assignment, comment, status_change, etc.)
  ├── title (TEXT)
  ├── read (BOOLEAN)
  └── metadata (JSONB)

analytics_events
  ├── id (UUID, PK)
  ├── user_id (UUID, FK → profiles)
  ├── event_name (TEXT)
  ├── event_category (ENUM: user, project, task, team, system)
  ├── properties (JSONB)
  └── session_id (UUID)
```

### Key Features

- **Automatic timestamps:** `created_at`, `updated_at` via triggers
- **Cascade deletes:** Properly configured foreign key constraints
- **Indexes:** Optimized for common queries
- **Helper functions:** `get_user_teams()`, `can_access_project()`
- **RLS policies:** Complete row-level security for all tables

---

## Security Best Practices

### ✅ DO

- Use `anon` key in frontend code
- Always rely on RLS policies for access control
- Validate data on both client and server
- Use parameterized queries (handled by Supabase client)
- Enable MFA for Supabase dashboard access
- Regularly rotate database passwords
- Monitor database activity logs

### ❌ DON'T

- **NEVER** expose `service_role` key in frontend
- Don't bypass RLS in frontend code
- Don't store sensitive data in `metadata` JSON fields without encryption
- Don't disable RLS policies in production
- Don't commit `.env` files to git

---

## Common Operations

### 1. Creating a User Profile

Users are automatically created via auth trigger. To update:

```typescript
import { profileService } from '@/services';

await profileService.updateCurrentProfile({
  full_name: 'John Doe',
  bio: 'Software Developer',
});
```

### 2. Creating a Team

```typescript
import { teamService } from '@/services';

const { data: team } = await teamService.create({
  name: 'My Team',
  slug: 'my-team',
  owner_id: 'current-user-id',
  description: 'Team description',
});
```

### 3. Adding Team Members

```typescript
import { teamService } from '@/services';

await teamService.addMember({
  team_id: 'team-id',
  user_id: 'user-id',
  role: 'member',
});
```

### 4. Creating a Project

```typescript
import { projectService } from '@/services';

const { data: project } = await projectService.create({
  name: 'My Project',
  slug: 'my-project',
  owner_id: 'current-user-id',
  team_id: 'team-id', // optional
  visibility: 'team',
  status: 'active',
});
```

### 5. Creating Tasks

```typescript
import { taskService } from '@/services';

const { data: task } = await taskService.create({
  title: 'Implement feature',
  project_id: 'project-id',
  created_by: 'current-user-id',
  status: 'todo',
  priority: 'high',
});
```

---

## Troubleshooting

### Error: "Missing Supabase environment variables"

**Solution:** Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in `.env`

### Error: "Invalid URL"

**Solution:** Ensure the Supabase URL includes `https://` and is the correct format

### Error: "Row level security policy violation"

**Solution:**

- Check that RLS policies are correctly applied
- Verify the user is authenticated
- Ensure the user has permission for the operation

### Error: "relation does not exist"

**Solution:**

- Migrations may not have run successfully
- Check Supabase SQL Editor for errors
- Re-run migrations

### Slow Queries

**Solution:**

- Check that indexes are created (see migration files)
- Use `EXPLAIN ANALYZE` in SQL Editor
- Consider adding more specific indexes

### Can't Upload Files

**Solution:**

- Verify storage buckets exist
- Check storage RLS policies
- Ensure file size is within limits
- Verify MIME type is allowed

---

## Monitoring and Maintenance

### 1. Database Statistics

Monitor in Supabase Dashboard > Database:

- Connection pool usage
- Query performance
- Table sizes
- Index usage

### 2. Logs

Check in Supabase Dashboard > Logs:

- API logs for request errors
- Database logs for query errors
- Auth logs for authentication issues

### 3. Backups

Supabase automatically backs up your database. To download:

1. Go to Database > Backups
2. Select backup
3. Download SQL dump

### 4. Analytics Cleanup

Run periodically to clean old analytics data:

```sql
DELETE FROM public.analytics_events
WHERE created_at < NOW() - INTERVAL '90 days';
```

---

## Next Steps

1. ✅ Database schema created
2. ✅ RLS policies configured
3. ✅ Storage buckets set up
4. ⬜ Set up authentication UI
5. ⬜ Implement real-time subscriptions
6. ⬜ Add data seeding for development
7. ⬜ Set up CI/CD for migrations

---

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)

---

## Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review Supabase logs in dashboard
3. Check the project's GitHub issues
4. Ask in team Slack/Discord

---

**Last Updated:** August 28, 2026
**Version:** 1.0.0
