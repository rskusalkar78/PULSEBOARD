import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  FolderKanban,
  ArrowUpRight,
  Activity,
} from 'lucide-react';

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-slate-900 border border-indigo-500/20">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-indigo-400" />
            Executive Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time metric telemetry and high-level system overview.
          </p>
        </div>
        <Link
          to="/analytics"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-600/20 self-start sm:self-auto"
        >
          View Analytics
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active Users
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-100">14,280</span>
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-0.5">
              +12.4% <TrendingUp className="w-3 h-3" />
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active Projects
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-100">38</span>
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-0.5">
              +4 new <TrendingUp className="w-3 h-3" />
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              System Activity
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-100">99.98%</span>
            <span className="text-xs font-medium text-emerald-400">Operational</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Throughput
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-100">4.8k ops/s</span>
            <span className="text-xs font-medium text-indigo-400">Peak Load</span>
          </div>
        </div>
      </div>

      {/* Navigation Quick Links Grid */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <h2 className="text-base font-semibold text-slate-200 mb-4">Quick Navigation Modules</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            { label: 'Analytics', path: '/analytics' },
            { label: 'Activity Feed', path: '/activity' },
            { label: 'Projects', path: '/projects' },
            { label: 'Team Roster', path: '/team' },
            { label: 'Notifications', path: '/notifications' },
            { label: 'User Profile', path: '/profile' },
            { label: 'Settings', path: '/settings' },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 text-xs font-medium text-slate-300 hover:text-indigo-300 transition-colors flex items-center justify-between"
            >
              <span>{item.label}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
