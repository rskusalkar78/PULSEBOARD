import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Activity,
  FolderKanban,
  Users,
  Settings,
  Bell,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  Sparkles,
  Search,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ThemeToggle } from '@/components/ui/Display/ThemeToggle';

interface NavItem {
  name: string;
  path: string;
  icon: typeof LayoutDashboard;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Activity', path: '/activity', icon: Activity },
  { name: 'Projects', path: '/projects', icon: FolderKanban },
  { name: 'Team', path: '/team', icon: Users },
  { name: 'Notifications', path: '/notifications', icon: Bell },
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, user, toggleAuth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const currentNav = NAV_ITEMS.find((item) => item.path === location.pathname);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        backgroundColor: 'var(--pb-bg-background)',
        color: 'var(--pb-text-primary)',
      }}
    >
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 backdrop-blur-sm lg:hidden"
          style={{ backgroundColor: 'var(--pb-bg-overlay)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundColor: 'var(--pb-bg-surface)',
          borderRight: '1px solid var(--pb-border)',
        }}
      >
        {/* Brand Header */}
        <div
          className="flex items-center justify-between h-16 px-6"
          style={{ borderBottom: '1px solid var(--pb-border)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span
                className="font-bold text-lg tracking-tight"
                style={{ color: 'var(--pb-text-primary)' }}
              >
                PulseBoard
              </span>
              <span
                className="text-[10px] uppercase font-semibold tracking-wider"
                style={{ color: 'var(--pb-primary-text)' }}
              >
                Enterprise v0.1
              </span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--pb-text-muted)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--pb-text-primary)';
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                'var(--pb-bg-subtle)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--pb-text-muted)';
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <div
            className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: 'var(--pb-text-muted)' }}
          >
            Navigation
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive ? 'nav-link-active' : 'nav-link-inactive'
                  }`
                }
                style={({ isActive }) =>
                  isActive
                    ? {
                        backgroundColor: 'var(--pb-primary-subtle)',
                        color: 'var(--pb-primary-text)',
                        border: '1px solid var(--pb-primary-muted)',
                      }
                    : {
                        color: 'var(--pb-text-secondary)',
                        border: '1px solid transparent',
                      }
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Auth Switcher Footer */}
        <div
          className="p-4"
          style={{ borderTop: '1px solid var(--pb-border)' }}
        >
          <div
            className="flex items-center justify-between gap-3 p-2.5 rounded-xl"
            style={{
              backgroundColor: 'var(--pb-bg-subtle)',
              border: '1px solid var(--pb-border)',
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white shrink-0">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'PB'}
              </div>
              <div className="min-w-0">
                <p
                  className="text-xs font-semibold truncate"
                  style={{ color: 'var(--pb-text-primary)' }}
                >
                  {user?.name || 'Guest'}
                </p>
                <p className="text-[10px] truncate" style={{ color: 'var(--pb-text-muted)' }}>
                  {user?.role || 'Visitor'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                toggleAuth();
                if (isAuthenticated) {
                  navigate('/login');
                }
              }}
              title={isAuthenticated ? 'Log Out' : 'Log In'}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--pb-text-muted)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--pb-primary-text)';
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  'var(--pb-bg-muted)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--pb-text-muted)';
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
              }}
            >
              {isAuthenticated ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header
          className="h-16 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 backdrop-blur-md"
          style={{
            backgroundColor: 'var(--pb-bg-surface)',
            borderBottom: '1px solid var(--pb-border)',
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg transition-colors"
              style={{ color: 'var(--pb-text-muted)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--pb-text-primary)';
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  'var(--pb-bg-subtle)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--pb-text-muted)';
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
              }}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <span className="hidden sm:inline" style={{ color: 'var(--pb-text-muted)' }}>
                PulseBoard
              </span>
              <ChevronRight
                className="w-4 h-4 hidden sm:inline"
                style={{ color: 'var(--pb-border-strong)' }}
              />
              <span className="font-semibold" style={{ color: 'var(--pb-text-primary)' }}>
                {currentNav?.name || 'Overview'}
              </span>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative hidden md:block w-64">
              <Search
                className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--pb-text-muted)' }}
              />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl focus:outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--pb-bg-subtle)',
                  border: '1px solid var(--pb-border)',
                  color: 'var(--pb-text-primary)',
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLInputElement).style.borderColor =
                    'var(--pb-border-focus)';
                  (e.currentTarget as HTMLInputElement).style.boxShadow =
                    '0 0 0 3px var(--pb-ring-color)';
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLInputElement).style.borderColor = 'var(--pb-border)';
                  (e.currentTarget as HTMLInputElement).style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Theme Toggle */}
            <ThemeToggle size="sm" />

            {/* Notification Bell Link */}
            <NavLink
              to="/notifications"
              className="relative p-2 rounded-xl transition-colors"
              style={{
                color: 'var(--pb-text-muted)',
                border: '1px solid transparent',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--pb-text-primary)';
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  'var(--pb-bg-subtle)';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--pb-border)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--pb-text-muted)';
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'transparent';
              }}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--pb-primary)] rounded-full animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--pb-primary)] rounded-full" />
            </NavLink>

            {/* Profile Avatar Link */}
            <NavLink
              to="/profile"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{
                backgroundColor: 'var(--pb-bg-muted)',
                border: '1px solid var(--pb-border)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  'var(--pb-primary)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--pb-border)';
              }}
            >
              <User className="w-4 h-4" style={{ color: 'var(--pb-primary-text)' }} />
            </NavLink>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
          style={{ backgroundColor: 'var(--pb-bg-background)' }}
        >
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
