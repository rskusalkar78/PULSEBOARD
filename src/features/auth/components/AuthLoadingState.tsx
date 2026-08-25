import React from 'react';
import { Sparkles } from 'lucide-react';

export const AuthLoadingState: React.FC<{ message?: string }> = ({
  message = 'Authenticating session...',
}) => {
  return (
    <div
      role="status"
      aria-label={message}
      className="flex flex-col items-center justify-center p-8 space-y-4 text-center animate-in fade-in-50 duration-300"
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-pulse">
          <Sparkles
            className="w-6 h-6 text-white animate-spin"
            style={{ animationDuration: '3s' }}
          />
        </div>
        <div className="absolute -inset-1 rounded-2xl bg-indigo-500/20 blur-sm -z-10 animate-ping" />
      </div>

      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-200">{message}</p>
        <p className="text-xs text-slate-400">
          Verifying security credentials and access permissions...
        </p>
      </div>

      <div className="w-36 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full animate-pulse w-3/4" />
      </div>
    </div>
  );
};
