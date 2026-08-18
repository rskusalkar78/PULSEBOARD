import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-md space-y-6">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-semibold">
            404 Error
          </span>
          <h1 className="text-3xl font-extrabold text-slate-100">Page Not Found</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            The route or resource you requested does not exist or has been relocated within
            PulseBoard.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            to="/dashboard"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-indigo-600/20"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition-colors border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
