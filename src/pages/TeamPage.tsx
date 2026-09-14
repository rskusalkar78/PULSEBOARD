import React, { useState } from 'react';
import {
  Users,
  Mail,
  Shield,
  UserPlus,
  MoreHorizontal,
  Edit2,
  Trash2,
  Search,
  User,
  AlertTriangle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from '@/components/ui/Overlay/Dropdown';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Overlay/Dialog';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Form/Input';
import { Select } from '@/components/ui/Form/Select';
import { useToast } from '@/hooks/useToast';

export interface TeamMemberItem {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'Online' | 'Away' | 'Offline';
}

const INITIAL_MEMBERS: TeamMemberItem[] = [
  {
    id: 'mem-1',
    name: 'Alex Morgan',
    role: 'Product Lead',
    email: 'alex.morgan@pulseboard.io',
    status: 'Online',
  },
  {
    id: 'mem-2',
    name: 'Sarah Chen',
    role: 'Principal Architect',
    email: 'sarah.chen@pulseboard.io',
    status: 'Online',
  },
  {
    id: 'mem-3',
    name: 'Marcus Vance',
    role: 'DevOps Lead',
    email: 'marcus.vance@pulseboard.io',
    status: 'Away',
  },
  {
    id: 'mem-4',
    name: 'Elena Rostova',
    role: 'Frontend Engineer',
    email: 'elena.rostova@pulseboard.io',
    status: 'Offline',
  },
];

const ROLE_OPTIONS = [
  { value: 'Product Lead', label: 'Product Lead' },
  { value: 'Principal Architect', label: 'Principal Architect' },
  { value: 'DevOps Lead', label: 'DevOps Lead' },
  { value: 'Frontend Engineer', label: 'Frontend Engineer' },
  { value: 'Backend Engineer', label: 'Backend Engineer' },
  { value: 'Product Manager', label: 'Product Manager' },
  { value: 'Admin', label: 'Admin' },
];

const STATUS_STYLES: Record<TeamMemberItem['status'], { text: string; dot: string }> = {
  Online: {
    text: 'text-emerald-400',
    dot: 'bg-emerald-400 animate-pulse',
  },
  Away: {
    text: 'text-amber-400',
    dot: 'bg-amber-400',
  },
  Offline: {
    text: 'text-slate-500',
    dot: 'bg-slate-600',
  },
};

export function TeamPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [members, setMembers] = useState<TeamMemberItem[]>(INITIAL_MEMBERS);
  const [searchQuery, setSearchQuery] = useState('');

  // ── Edit Role dialog ──────────────────────────────────────────────────────
  const [editingMember, setEditingMember] = useState<TeamMemberItem | null>(null);
  const [newRole, setNewRole] = useState('');

  // ── Remove confirmation dialog ────────────────────────────────────────────
  const [removingMember, setRemovingMember] = useState<TeamMemberItem | null>(null);

  // ── Invite Member dialog ──────────────────────────────────────────────────
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Frontend Engineer');

  // ── Derived state ─────────────────────────────────────────────────────────
  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleViewProfile = () => {
    // Navigate to the shared /profile page.
    // In an app with per-user profile routes this would be /profile/:id.
    navigate('/profile');
  };

  const handleOpenEditRole = (member: TeamMemberItem) => {
    setEditingMember(member);
    setNewRole(member.role);
  };

  const handleSaveRole = () => {
    if (!editingMember) return;
    setMembers((prev) =>
      prev.map((m) => (m.id === editingMember.id ? { ...m, role: newRole } : m))
    );
    toast.success({
      title: 'Role updated',
      message: `${editingMember.name}'s role has been updated to ${newRole}.`,
    });
    setEditingMember(null);
  };

  /** Opens the remove confirmation dialog — does NOT remove immediately. */
  const handleRequestRemove = (member: TeamMemberItem) => {
    setRemovingMember(member);
  };

  /** Called only after user confirms removal inside the dialog. */
  const handleConfirmRemove = () => {
    if (!removingMember) return;
    setMembers((prev) => prev.filter((m) => m.id !== removingMember.id));
    toast.success({
      title: 'Member removed',
      message: `${removingMember.name} has been removed from the team.`,
    });
    setRemovingMember(null);
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) {
      toast.error({ title: 'Validation error', message: 'Name and email are required.' });
      return;
    }

    const newMember: TeamMemberItem = {
      id: `mem-${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      status: 'Online',
    };

    setMembers((prev) => [...prev, newMember]);
    toast.success({
      title: 'Invitation sent',
      message: `${newMember.name} has been invited as ${newMember.role}.`,
    });
    setInviteName('');
    setInviteEmail('');
    setIsInviteOpen(false);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" aria-hidden="true" />
            Team Roster &amp; Access
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage organization members, security roles, and permissions.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsInviteOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-600/20 self-start sm:self-auto cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <UserPlus className="w-4 h-4" aria-hidden="true" />
          Invite Member
        </button>
      </div>

      {/* Search / count bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/40 p-3 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search members or roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search team members"
            className="w-full pl-9 pr-4 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>
        <p
          className="text-xs text-slate-400 font-medium self-end sm:self-auto"
          aria-live="polite"
          aria-atomic="true"
        >
          Showing {filteredMembers.length} of {members.length} members
        </p>
      </div>

      {/*
       * Members table
       *
       * IMPORTANT: We intentionally do NOT set overflow-hidden on this wrapper.
       * overflow-hidden would create a new stacking/clipping context that clips the
       * Dropdown menus rendered inside the table cells.  We use overflow-x-auto
       * only on the inner scroll container so horizontal scrolling still works on
       * narrow viewports while the absolute-positioned menus can escape vertically.
       */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th scope="col" className="px-6 py-4">
                  Member
                </th>
                <th scope="col" className="px-6 py-4">
                  Role
                </th>
                <th scope="col" className="px-6 py-4">
                  Email
                </th>
                <th scope="col" className="px-6 py-4">
                  Status
                </th>
                {/* Narrow fixed-width column; visually labelled for a11y */}
                <th scope="col" className="px-4 py-4 w-14">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500 text-sm">
                    No team members found matching &ldquo;{searchQuery}&rdquo;.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => {
                  const statusStyle = STATUS_STYLES[member.status];
                  return (
                    <tr key={member.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Member */}
                      <td className="px-6 py-4 font-medium text-slate-100">
                        <div className="flex items-center gap-3">
                          <div
                            aria-hidden="true"
                            className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-sm select-none"
                          >
                            {member.name.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="truncate">{member.name}</span>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4 text-xs font-mono text-slate-400">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300">
                          <Shield className="w-3 h-3 text-indigo-400" aria-hidden="true" />
                          {member.role}
                        </span>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 text-xs text-slate-400">
                        <a
                          href={`mailto:${member.email}`}
                          className="inline-flex items-center gap-1.5 hover:text-indigo-400 transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                          {member.email}
                        </a>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium ${statusStyle.text}`}
                        >
                          <span
                            aria-hidden="true"
                            className={`w-2 h-2 rounded-full ${statusStyle.dot}`}
                          />
                          {member.status}
                        </span>
                      </td>

                      {/*
                       * Actions – More (⋯) menu
                       *
                       * Uses the compound Dropdown API so we can render a visual separator
                       * between the normal actions and the destructive Remove action.
                       *
                       * The Dropdown wrapper is position:relative so the DropdownContent
                       * (position:absolute) anchors to this cell without being clipped by
                       * the table's overflow-x-auto container.
                       */}
                      <td className="px-4 py-4">
                        <div className="flex justify-end">
                          <Dropdown align="right">
                            <DropdownTrigger>
                              <button
                                type="button"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                aria-label={`More actions for ${member.name}`}
                              >
                                <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
                              </button>
                            </DropdownTrigger>
                            <DropdownContent align="right">
                              <DropdownItem
                                icon={<User className="h-4 w-4" />}
                                onClick={handleViewProfile}
                              >
                                View Profile
                              </DropdownItem>
                              <DropdownItem
                                icon={<Edit2 className="h-4 w-4" />}
                                onClick={() => handleOpenEditRole(member)}
                              >
                                Edit Role
                              </DropdownItem>
                              <DropdownItem
                                icon={<Mail className="h-4 w-4" />}
                                onClick={() => {
                                  window.location.href = `mailto:${member.email}`;
                                }}
                              >
                                Send Email
                              </DropdownItem>
                              <DropdownSeparator />
                              <DropdownItem
                                icon={<Trash2 className="h-4 w-4" />}
                                danger
                                onClick={() => handleRequestRemove(member)}
                              >
                                Remove Member
                              </DropdownItem>
                            </DropdownContent>
                          </Dropdown>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Edit Role dialog ─────────────────────────────────────────────────── */}
      <Dialog isOpen={Boolean(editingMember)} onClose={() => setEditingMember(null)}>
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>
            Update the organizational role for{' '}
            <strong className="text-slate-300">{editingMember?.name}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Select
            label="Role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            options={ROLE_OPTIONS}
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={() => setEditingMember(null)}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSaveRole}>
            Save Changes
          </Button>
        </DialogFooter>
      </Dialog>

      {/* ── Remove confirmation dialog ────────────────────────────────────────── */}
      <Dialog
        isOpen={Boolean(removingMember)}
        onClose={() => setRemovingMember(null)}
        closeOnOutsideClick={false}
      >
        <DialogHeader>
          <DialogTitle>Remove Team Member</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <div className="my-2 p-4 rounded-xl bg-rose-950/40 border border-rose-900/50 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-sm space-y-1">
            <p className="font-semibold text-rose-200">
              Remove &ldquo;{removingMember?.name}&rdquo;?
            </p>
            <p className="text-xs text-rose-300/80">
              They will immediately lose access to all team resources and projects.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" size="sm" onClick={() => setRemovingMember(null)}>
            Cancel
          </Button>
          <Button type="button" variant="danger" size="sm" onClick={handleConfirmRemove}>
            Remove Member
          </Button>
        </DialogFooter>
      </Dialog>

      {/* ── Invite Member dialog ──────────────────────────────────────────────── */}
      <Dialog isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)}>
        <DialogHeader>
          <DialogTitle>Invite New Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation to join your organization roster.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleInviteSubmit} className="space-y-4 py-2">
          <Input
            label="Full Name"
            placeholder="e.g. Jordan Lee"
            value={inviteName}
            onChange={(e) => setInviteName(e.target.value)}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. jordan.lee@pulseboard.io"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            required
          />
          <Select
            label="Role"
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            options={ROLE_OPTIONS}
          />
          <DialogFooter>
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsInviteOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Send Invite
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}

export default TeamPage;
