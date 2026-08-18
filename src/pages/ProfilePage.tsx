import { User, Mail, Shield, Key, Clock, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <User className="w-6 h-6 text-indigo-400" />
          User Profile
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Account information, role privileges, and security settings.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center font-bold text-2xl text-white shadow-xl shadow-indigo-500/20">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'PB'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">{user?.name || 'Alex Morgan'}</h2>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                {user?.email || 'alex.morgan@pulseboard.io'}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log Out Session
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold uppercase text-slate-500 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              Role & Permissions
            </span>
            <p className="text-sm font-semibold text-slate-200">{user?.role || 'Product Lead'}</p>
            <p className="text-xs text-slate-400">Full administrative access to project clusters</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold uppercase text-slate-500 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-purple-400" />
              Security Auth Level
            </span>
            <p className="text-sm font-semibold text-slate-200">2FA Hardware Token Active</p>
            <p className="text-xs text-slate-400">Enforced by organizational policy</p>
          </div>
        </div>

        <div className="pt-2 text-xs text-slate-500 flex items-center gap-2 font-mono">
          <Clock className="w-3.5 h-3.5" />
          Last session login: 2026-08-18 20:15:00 UTC
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
