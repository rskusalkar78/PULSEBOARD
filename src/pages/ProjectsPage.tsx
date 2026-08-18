import { FolderKanban, Plus, Layers, ShieldCheck, Zap } from 'lucide-react';

export function ProjectsPage() {
  const projects = [
    {
      id: 'proj-1',
      name: 'PulseBoard Core API',
      status: 'Active',
      tech: 'TypeScript / Node.js',
      health: '99.9%',
      updated: '2h ago',
    },
    {
      id: 'proj-2',
      name: 'Realtime Telemetry Pipeline',
      status: 'Deploying',
      tech: 'Go / Kafka',
      health: '100%',
      updated: '10m ago',
    },
    {
      id: 'proj-3',
      name: 'Analytics Data Warehouse',
      status: 'Active',
      tech: 'Python / Snowflake',
      health: '99.8%',
      updated: '1d ago',
    },
    {
      id: 'proj-4',
      name: 'Mobile Gateway Service',
      status: 'Maintenance',
      tech: 'Rust / gRPC',
      health: '98.5%',
      updated: '3d ago',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-cyan-400" />
            Projects Registry
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Active application services, microservices, and system projects.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-600/20 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Create Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-slate-100 text-base flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  {proj.name}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">{proj.tech}</p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                  proj.status === 'Active'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : proj.status === 'Deploying'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}
              >
                {proj.status}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Uptime: <strong className="text-slate-200">{proj.health}</strong>
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Updated {proj.updated}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectsPage;
