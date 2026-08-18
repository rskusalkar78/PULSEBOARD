import { Bell, CheckCircle2, Info, AlertTriangle, Trash2 } from 'lucide-react';

export function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      title: 'Security Alert: New login from London, UK',
      body: 'An authorized session was established on Chrome / macOS.',
      time: '10 minutes ago',
      type: 'warning',
      unread: true,
    },
    {
      id: 2,
      title: 'Database Backup Completed Successfully',
      body: 'Automated snapshot pb-db-20260818-2000 saved to S3 bucket.',
      time: '1 hour ago',
      type: 'info',
      unread: true,
    },
    {
      id: 3,
      title: 'Deployment Success',
      body: 'PulseBoard v0.1-beta successfully deployed to production.',
      time: '3 hours ago',
      type: 'success',
      unread: false,
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-400" />
            Notifications Center
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            System warnings, deployment updates, and security events.
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium rounded-xl border border-slate-800 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
          Clear All
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
              n.unread
                ? 'bg-slate-900/90 border-indigo-500/30 shadow-md shadow-indigo-500/5'
                : 'bg-slate-900/40 border-slate-800/80 opacity-80'
            }`}
          >
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
              {n.type === 'warning' ? (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              ) : n.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Info className="w-4 h-4 text-indigo-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-200 truncate">{n.title}</h3>
                <span className="text-[11px] text-slate-500 font-mono shrink-0">{n.time}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{n.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationsPage;
