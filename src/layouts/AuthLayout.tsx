import { Outlet } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Dynamic Ambient Glow Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          PulseBoard
        </span>
      </div>

      {/* Auth Card Container */}
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </div>

      {/* Auth Footer */}
      <p className="mt-8 text-xs text-slate-500 text-center relative z-10">
        &copy; {new Date().getFullYear()} PulseBoard Inc. All rights reserved.
      </p>
    </div>
  );
}

export default AuthLayout;
