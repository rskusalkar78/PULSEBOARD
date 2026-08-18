import { Users, Mail, Shield, UserPlus } from 'lucide-react';

export function TeamPage() {
  const members = [
    {
      name: 'Alex Morgan',
      role: 'Product Lead',
      email: 'alex.morgan@pulseboard.io',
      status: 'Online',
    },
    {
      name: 'Sarah Chen',
      role: 'Principal Architect',
      email: 'sarah.chen@pulseboard.io',
      status: 'Online',
    },
    {
      name: 'Marcus Vance',
      role: 'DevOps Lead',
      email: 'marcus.vance@pulseboard.io',
      status: 'Away',
    },
    {
      name: 'Elena Rostova',
      role: 'Frontend Engineer',
      email: 'elena.rostova@pulseboard.io',
      status: 'Offline',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            Team Roster & Access
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage organization members, security roles, and permissions.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-600/20 self-start sm:self-auto">
          <UserPlus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Member</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {members.map((member) => (
                <tr key={member.email} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white">
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                    {member.name}
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-400">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300">
                      <Shield className="w-3 h-3 text-indigo-400" />
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      {member.email}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        member.status === 'Online'
                          ? 'text-emerald-400'
                          : member.status === 'Away'
                            ? 'text-amber-400'
                            : 'text-slate-500'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          member.status === 'Online'
                            ? 'bg-emerald-400 animate-pulse'
                            : member.status === 'Away'
                              ? 'bg-amber-400'
                              : 'bg-slate-600'
                        }`}
                      />
                      {member.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TeamPage;
