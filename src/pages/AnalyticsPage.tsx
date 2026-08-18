import { BarChart3, PieChart, LineChart } from 'lucide-react';

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            Performance & Analytics
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Deep insights into system metrics, query latency, and traffic trends.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-semibold text-slate-200 text-sm flex items-center gap-2">
              <LineChart className="w-4 h-4 text-indigo-400" />
              Traffic Volume (24h)
            </span>
            <span className="text-xs text-emerald-400 font-mono">+18.2% vs yesterday</span>
          </div>
          <div className="h-44 flex items-end justify-between gap-2 pt-6">
            {[40, 65, 50, 85, 90, 75, 95, 110, 80, 100, 120, 105].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-indigo-600 to-cyan-400 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                  style={{ height: `${(h / 120) * 100}%` }}
                />
                <span className="text-[10px] text-slate-500 font-mono">{i * 2}h</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-semibold text-slate-200 text-sm flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-400" />
              Resource Allocation Breakdown
            </span>
            <span className="text-xs text-slate-400">Total: 100%</span>
          </div>
          <div className="space-y-3 pt-2">
            {[
              { label: 'Compute Instances (Kubernetes)', pct: '45%', color: 'bg-indigo-500' },
              { label: 'Database Cluster (PostgreSQL)', pct: '30%', color: 'bg-purple-500' },
              { label: 'Caching & Redis Nodes', pct: '15%', color: 'bg-cyan-500' },
              { label: 'Object Storage & CDN', pct: '10%', color: 'bg-emerald-500' },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-slate-300">
                  <span>{item.label}</span>
                  <span className="font-mono text-slate-400">{item.pct}</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: item.pct }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
