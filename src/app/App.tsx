import type { JSX } from 'react';
import { APP_CONFIG } from '@/constants';

export function App(): JSX.Element {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-xl p-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Foundation Ready
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent mb-4">
          {APP_CONFIG.title}
        </h1>

        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          Production-grade React 19 + TypeScript + Vite + Tailwind CSS scaffold successfully
          configured.
        </p>

        <div className="grid grid-cols-2 gap-3 text-left bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
          <div>
            <span className="text-slate-500">ENV:</span> {APP_CONFIG.env}
          </div>
          <div>
            <span className="text-slate-500">API:</span> {APP_CONFIG.apiBaseUrl}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
