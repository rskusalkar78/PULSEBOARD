import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Layers,
  Terminal,
  Settings,
  ShieldCheck,
  Database,
  Component,
  Globe,
  Cpu,
  TestTube2,
  Rocket,
  GitPullRequest,
  Sun,
  Moon,
  ChevronRight,
  Menu,
  X,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/styles';

interface DocSection {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export default function DocsPage() {
  const { resolvedTheme, setMode } = useTheme();
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sections: DocSection[] = useMemo(
    () => [
      {
        id: 'overview',
        title: 'Overview',
        category: 'Getting Started',
        icon: <BookOpen className="h-4 w-4" />,
        content: (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 mb-3">
                <Sparkles className="h-3.5 w-3.5" /> Enterprise Agile Management
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                PulseBoard Technical Documentation
              </h1>
              <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
                PulseBoard is a high-performance, real-time project management and team analytics
                platform built with React 19, TypeScript, Tailwind CSS, and Supabase.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <div className="h-10 w-10 rounded-lg bg-violet-100 dark:bg-violet-950 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-3">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Agile Workspace</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Interactive Kanban boards with drag-and-drop powered by HTML5 Drag & Drop API.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Supabase Auth & RLS
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Enterprise-grade authentication with Row Level Security (RLS) policies.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
                  <Cpu className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  State & Theme System
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Full CSS design token system with light/dark theme persistence and custom hooks.
                </p>
              </div>
            </div>

            <div className="border-l-4 border-violet-500 bg-violet-50 dark:bg-violet-950/30 p-4 rounded-r-lg">
              <h4 className="font-semibold text-violet-900 dark:text-violet-200 text-sm">
                Key System Capabilities
              </h4>
              <ul className="mt-2 text-sm text-violet-800 dark:text-violet-300 space-y-1 list-disc list-inside">
                <td>Real-time task synchronization across clients</td>
                <td>Comprehensive design token system adhering to WCAG AA compliance</td>
                <td>Built-in keyboard shortcuts and global search modal (Cmd+K / Ctrl+K)</td>
                <td>Modular architecture supporting Vitest and Playwright test suites</td>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: 'architecture',
        title: 'Architecture',
        category: 'Architecture',
        icon: <Layers className="h-4 w-4" />,
        content: (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                System Architecture
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                PulseBoard follows a modular feature-first frontend architecture coupled with a
                decoupled BaaS backend (Supabase).
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto shadow-md">
              <pre>{`
+-----------------------------------------------------------------------+
|                            PulseBoard UI                              |
|   +-------------------+   +--------------------+  +---------------+   |
|   | React 19 Views    |   | Context Providers  |  | Custom Hooks  |   |
|   +---------+---------+   +---------+----------+  +-------+-------+   |
+-------------|-----------------------|---------------------|-----------+
              |                       |                     |
              v                       v                     v
+-----------------------------------------------------------------------+
|                          Service Layer                                |
|   +-------------------+   +--------------------+  +---------------+   |
|   |  Task Service     |   | Auth / Profile     |  | Analytics Service|
|   +---------+---------+   +---------+----------+  +-------+-------+   |
+-------------|-----------------------|---------------------|-----------+
              |                       |                     |
              v                       v                     v
+-----------------------------------------------------------------------+
|                        Supabase Client SDK                            |
|             +---------------------------------------+                 |
|             | REST API / Realtime WebSockets        |                 |
+-------------+-------------------+-------------------+-----------------+
                                  |
                                  v
+-----------------------------------------------------------------------+
|                      Supabase Cloud / Postgres                        |
|   +-------------------+   +--------------------+  +---------------+   |
|   | Database Tables   |   | Row Level Security |  | Auth / Storage|   |
|   +-------------------+   +--------------------+  +---------------+   |
+-----------------------------------------------------------------------+
              `}</pre>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Directory Structure Overview
              </h3>
              <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-mono text-slate-800 dark:text-slate-200">
                <div>src/</div>
                <div className="ml-4">
                  ├── app/ # App entry point, routing setup, router definition
                </div>
                <div className="ml-4">
                  ├── components/ # UI components (atoms, molecules, domain features)
                </div>
                <div className="ml-4">
                  ├── context/ # Theme, Auth, Notification, Global Search Providers
                </div>
                <div className="ml-4">
                  ├── hooks/ # Custom React hooks (useTasks, useTheme, useAuth)
                </div>
                <div className="ml-4">├── layouts/ # AppLayout, AuthLayout, DashboardLayout</div>
                <div className="ml-4">├── pages/ # Lazy-loaded route views</div>
                <div className="ml-4">
                  ├── services/ # API service layer (Supabase integrations)
                </div>
                <div className="ml-4">├── tokens/ # CSS Design tokens & theme variables</div>
                <div className="ml-4">└── types/ # TypeScript interfaces & domain models</div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'installation',
        title: 'Installation',
        category: 'Getting Started',
        icon: <Terminal className="h-4 w-4" />,
        content: (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Installation & Setup
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Follow these steps to set up PulseBoard locally on your system.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Prerequisites
              </h3>
              <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 space-y-1">
                <td>Node.js 18.x or higher installed</td>
                <td>npm 9.x or higher (or pnpm/yarn)</td>
                <td>Git</td>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                1. Clone & Install Dependencies
              </h3>
              <div className="relative bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-sm">
                <button
                  onClick={() =>
                    copyCode(
                      `git clone https://github.com/rskusalkar78/PULSEBOARD.git\ncd PULSEBOARD\nnpm install`,
                      'install-code'
                    )
                  }
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Copy code"
                >
                  {copiedId === 'install-code' ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
                <pre>{`git clone https://github.com/rskusalkar78/PULSEBOARD.git
cd PULSEBOARD
npm install`}</pre>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                2. Start Development Server
              </h3>
              <div className="relative bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-sm">
                <button
                  onClick={() => copyCode('npm run dev', 'dev-code')}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  {copiedId === 'dev-code' ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
                <pre>{`npm run dev`}</pre>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                The app will launch at{' '}
                <code className="text-violet-600 dark:text-violet-400">http://localhost:5173</code>.
              </p>
            </div>
          </div>
        ),
      },
      {
        id: 'configuration',
        title: 'Configuration',
        category: 'Getting Started',
        icon: <Settings className="h-4 w-4" />,
        content: (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Environment Configuration
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Configure your local environment variables in a{' '}
                <code className="text-violet-600 dark:text-violet-400">.env</code> file.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Environment Variables (.env)
              </h3>
              <div className="relative bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-sm">
                <button
                  onClick={() =>
                    copyCode(
                      `VITE_SUPABASE_URL=https://your-project.supabase.co\nVITE_SUPABASE_ANON_KEY=your-anon-key-here\nVITE_APP_TITLE=PulseBoard`,
                      'env-code'
                    )
                  }
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  {copiedId === 'env-code' ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
                <pre>{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_TITLE=PulseBoard`}</pre>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-slate-900 dark:text-white text-sm">
                Variable Reference
              </h4>
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold">
                    <tr>
                      <th className="p-3">Variable</th>
                      <th className="p-3">Required</th>
                      <th className="p-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    <tr>
                      <td className="p-3 font-mono text-xs text-violet-600 dark:text-violet-400">
                        VITE_SUPABASE_URL
                      </td>
                      <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">
                        Yes
                      </td>
                      <td className="p-3">URL endpoint of your Supabase database instance.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-xs text-violet-600 dark:text-violet-400">
                        VITE_SUPABASE_ANON_KEY
                      </td>
                      <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">
                        Yes
                      </td>
                      <td className="p-3">Public anonymous client key for client-side queries.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'authentication',
        title: 'Authentication',
        category: 'Core Modules',
        icon: <ShieldCheck className="h-4 w-4" />,
        content: (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Authentication Architecture
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                PulseBoard manages authentication state using{' '}
                <code className="text-violet-600 dark:text-violet-400">AuthContext</code> backed by
                Supabase Auth listeners.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Authentication Flow
              </h3>
              <ol className="list-decimal list-inside text-sm text-slate-600 dark:text-slate-300 space-y-2">
                <td>
                  <strong>Login/Register:</strong> Credentials submitted via forms styled with Zod
                  schema validation.
                </td>
                <td>
                  <strong>Session Initialization:</strong> Supabase returns JWT tokens which are
                  stored securely in browser state/storage.
                </td>
                <td>
                  <strong>Route Protection:</strong>{' '}
                  <code className="text-violet-600 dark:text-violet-400">ProtectedRoute</code>{' '}
                  guards protected endpoints and redirects unauthorized users to{' '}
                  <code className="text-violet-600 dark:text-violet-400">/login</code>.
                </td>
              </ol>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Code Example: Using Auth Hook
              </h3>
              <div className="relative bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-sm">
                <button
                  onClick={() =>
                    copyCode(
                      `import { useAuth } from '@/context/AuthContext';\n\nexport function UserProfileHeader() {\n  const { user, signOut } = useAuth();\n\n  return (\n    <div>\n      <p>Welcome, {user?.email}</p>\n      <button onClick={signOut}>Sign Out</button>\n    </div>\n  );\n}`,
                      'auth-code'
                    )
                  }
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  {copiedId === 'auth-code' ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
                <pre>{`import { useAuth } from '@/context/AuthContext';

export function UserProfileHeader() {
  const { user, signOut } = useAuth();

  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}`}</pre>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'database',
        title: 'Database Schema',
        category: 'Core Modules',
        icon: <Database className="h-4 w-4" />,
        content: (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Database & Supabase RLS
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                PulseBoard utilizes PostgreSQL schemas stored in Supabase with strict Row Level
                Security policies.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Core Tables</h3>
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold">
                    <tr>
                      <th className="p-3">Table Name</th>
                      <th className="p-3">Primary Key</th>
                      <th className="p-3">Key Foreign Keys</th>
                      <th className="p-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    <tr>
                      <td className="p-3 font-mono text-xs text-violet-600 dark:text-violet-400">
                        profiles
                      </td>
                      <td className="p-3 font-mono text-xs">id</td>
                      <td className="p-3 font-mono text-xs">auth.users(id)</td>
                      <td className="p-3">Extended user profiles (name, avatar, role).</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-xs text-violet-600 dark:text-violet-400">
                        projects
                      </td>
                      <td className="p-3 font-mono text-xs">id</td>
                      <td className="p-3 font-mono text-xs">owner_id (profiles)</td>
                      <td className="p-3">Project workspace containers.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-xs text-violet-600 dark:text-violet-400">
                        tasks
                      </td>
                      <td className="p-3 font-mono text-xs">id</td>
                      <td className="p-3 font-mono text-xs">project_id, assignee_id</td>
                      <td className="p-3">Kanban tasks and backlog items.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'components',
        title: 'Components & Design System',
        category: 'UI Library',
        icon: <Component className="h-4 w-4" />,
        content: (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Design System & UI Components
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                PulseBoard incorporates a rich UI component architecture governed by central CSS
                tokens.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                to="/design-system"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white font-medium text-sm hover:bg-violet-700 transition-colors"
              >
                Interactive Design System <ExternalLink className="h-4 w-4" />
              </Link>
              <Link
                to="/theme-verification"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Theme Verification
              </Link>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Component Hierarchy
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <li className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="font-semibold text-slate-900 dark:text-white">Atoms:</span>{' '}
                  Button, Input, Badge, Avatar, Separator
                </li>
                <li className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="font-semibold text-slate-900 dark:text-white">Molecules:</span>{' '}
                  Modal, Dropdown, Pagination, Form Fields
                </li>
                <li className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="font-semibold text-slate-900 dark:text-white">Organisms:</span>{' '}
                  KanbanBoard, TaskCard, Header, Sidebar
                </li>
                <li className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="font-semibold text-slate-900 dark:text-white">Templates:</span>{' '}
                  DashboardLayout, AppLayout
                </li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: 'api-services',
        title: 'API & Services',
        category: 'Core Modules',
        icon: <Globe className="h-4 w-4" />,
        content: (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Services Layer</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                All data fetching logic is encapsulated inside standard service modules located
                under <code className="text-violet-600 dark:text-violet-400">src/services/</code>.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Task Service Example
              </h3>
              <div className="relative bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-sm">
                <button
                  onClick={() =>
                    copyCode(
                      `import { taskService } from '@/services/task.service';\n\n// Fetch tasks for workspace\nconst tasks = await taskService.getTasks();\n\n// Update task status on kanban move\nawait taskService.updateTask(taskId, { status: 'in-progress' });`,
                      'service-code'
                    )
                  }
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  {copiedId === 'service-code' ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
                <pre>{`import { taskService } from '@/services/task.service';

// Fetch tasks for workspace
const tasks = await taskService.getTasks();

// Update task status on kanban move
await taskService.updateTask(taskId, { status: 'in-progress' });`}</pre>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'state-management',
        title: 'State Management',
        category: 'Architecture',
        icon: <Cpu className="h-4 w-4" />,
        content: (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                State Management Paradigm
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                PulseBoard combines React Context for global UI concerns with custom hooks for
                domain data states.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <h4 className="font-semibold text-slate-900 dark:text-white">Context Providers</h4>
                <ul className="mt-2 text-sm text-slate-600 dark:text-slate-300 space-y-1">
                  <td>
                    <code className="text-violet-600 dark:text-violet-400">ThemeProvider</code>:
                    Manages light/dark mode persistence
                  </td>
                  <td>
                    <code className="text-violet-600 dark:text-violet-400">AuthProvider</code>:
                    Manages user login & session
                  </td>
                  <td>
                    <code className="text-violet-600 dark:text-violet-400">TaskProvider</code>:
                    Manages tasks & kanban filters
                  </td>
                  <td>
                    <code className="text-violet-600 dark:text-violet-400">
                      GlobalSearchProvider
                    </code>
                    : Manages modal shortcut state
                  </td>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <h4 className="font-semibold text-slate-900 dark:text-white">
                  Local & Derived State
                </h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Form states are managed via React Hook Form + Zod resolvers. Complex list
                  filtering and analytics aggregates leverage React's{' '}
                  <code className="text-violet-600 dark:text-violet-400">useMemo</code> hook.
                </p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'testing',
        title: 'Testing Strategy',
        category: 'Quality Assurance',
        icon: <TestTube2 className="h-4 w-4" />,
        content: (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Testing Suite</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                PulseBoard features end-to-end and unit testing powered by Vitest, Testing Library,
                and Playwright.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Available Test Commands
              </h3>
              <div className="relative bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-sm space-y-2">
                <div>
                  <span className="text-slate-500"># Run unit tests</span>
                </div>
                <div>npm run test</div>
                <div>
                  <span className="text-slate-500"># Run unit test coverage</span>
                </div>
                <div>npm run test:coverage</div>
                <div>
                  <span className="text-slate-500"># Run Playwright E2E tests</span>
                </div>
                <div>npm run test:e2e</div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'deployment',
        title: 'Deployment',
        category: 'Operations',
        icon: <Rocket className="h-4 w-4" />,
        content: (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Production Deployment
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Building and deploying PulseBoard to Vercel, Netlify, or AWS Amplify.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                1. Production Build
              </h3>
              <div className="relative bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-sm">
                <button
                  onClick={() => copyCode('npm run build', 'build-code')}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  {copiedId === 'build-code' ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
                <pre>{`npm run build`}</pre>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Outputs compiled static assets to the{' '}
                <code className="text-violet-600 dark:text-violet-400">dist/</code> directory.
              </p>
            </div>
          </div>
        ),
      },
      {
        id: 'contributing',
        title: 'Contributing Guidelines',
        category: 'Operations',
        icon: <GitPullRequest className="h-4 w-4" />,
        content: (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Contributing to PulseBoard
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                We welcome contributions! Please follow our code standards and lint rules before
                opening a PR.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Code Style & Formatting
              </h3>
              <div className="relative bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-sm">
                <pre>{`npm run lint
npm run format:check`}</pre>
              </div>
            </div>
          </div>
        ),
      },
    ],
    [copiedId]
  );

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const query = searchQuery.toLowerCase();
    return sections.filter(
      (sec) =>
        sec.title.toLowerCase().includes(query) ||
        sec.category.toLowerCase().includes(query) ||
        sec.id.toLowerCase().includes(query)
    );
  }, [sections, searchQuery]);

  const activeDoc = sections.find((sec) => sec.id === activeSection) ?? sections[0];

  if (!activeDoc) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle Documentation Navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 text-white font-bold text-sm shadow-sm">
              P
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              PulseBoard
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300">
              Docs v1.0
            </span>
          </Link>
        </div>

        {/* Global Search Bar */}
        <div className="relative max-w-md w-full hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search documentation (e.g. Auth, Database, Setup)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-100 dark:bg-slate-800/60 border border-transparent focus:border-violet-500 rounded-lg outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-colors"
          />
        </div>

        {/* Theme Toggle & Back Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMode(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle theme"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="h-5 w-5 text-amber-400" />
            ) : (
              <Moon className="h-5 w-5 text-slate-600" />
            )}
          </button>
          <Link
            to="/dashboard"
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400"
          >
            Back to App &rarr;
          </Link>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 gap-8">
        {/* Sidebar Navigation */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 transition-transform lg:static lg:block lg:w-64 lg:bg-transparent lg:border-none lg:p-0',
            mobileMenuOpen ? 'translate-x-0 top-16' : '-translate-x-full lg:translate-x-0'
          )}
        >
          <div className="md:hidden mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
              />
            </div>
          </div>

          <nav className="space-y-6">
            {[
              'Getting Started',
              'Architecture',
              'Core Modules',
              'UI Library',
              'Quality Assurance',
              'Operations',
            ].map((cat) => {
              const catSections = filteredSections.filter((s) => s.category === cat);
              if (catSections.length === 0) return null;

              return (
                <div key={cat} className="space-y-1">
                  <h4 className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {cat}
                  </h4>
                  {catSections.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                        activeSection === item.id
                          ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                      {activeSection === item.id && (
                        <ChevronRight className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                      )}
                    </button>
                  ))}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 lg:p-10 shadow-sm">
          {activeDoc.content}
        </main>
      </div>
    </div>
  );
}
