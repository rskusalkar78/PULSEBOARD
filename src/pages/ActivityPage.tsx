import { Activity, CheckCircle2, AlertCircle, Clock, GitCommit } from 'lucide-react';

export function ActivityPage() {
  const activities = [
    {
      id: 1,
      title: 'Deployed release v1.4.2 to Production',
      time: '12 minutes ago',
      type: 'success',
      icon: CheckCircle2,
      user: 'Alex Morgan',
    },
    {
      id: 2,
      title: 'Database connection pool auto-scaled (+5 nodes)',
      time: '45 minutes ago',
      type: 'info',
      icon: GitCommit,
      user: 'System Bot',
    },
    {
      id: 3,
      title: 'API Rate limit warning triggered on /v1/telemetry',
      time: '2 hours ago',
      type: 'warning',
      icon: AlertCircle,
      user: 'Security Monitor',
    },
    {
      id: 4,
      title: 'Completed automated security vulnerability scan',
      time: '5 hours ago',
      type: 'success',
      icon: CheckCircle2,
      user: 'Scanner CI',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Activity className="w-6 h-6 text-purple-400" />
          System Activity Feed
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Chronological log of infrastructure events, deployments, and alerts.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
          {activities.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="relative flex items-start justify-between gap-4">
                <div className="absolute -left-6 top-0.5 p-1 rounded-full bg-slate-900 border border-slate-700 text-indigo-400">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Triggered by {item.user}</p>
                </div>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-mono shrink-0">
                  <Clock className="w-3 h-3" />
                  {item.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ActivityPage;
