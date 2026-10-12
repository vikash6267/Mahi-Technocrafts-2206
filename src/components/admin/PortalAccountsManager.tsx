'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowUpRight,
  Bell,
  Check,
  CheckCircle2,
  CircleAlert,
  Clock3,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  Loader2,
  MessageSquare,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Ticket,
  Trash2,
  UserRound,
  Users,
  UserX,
  X
} from 'lucide-react';
import type { PortalIssue, PortalUser } from '@/lib/portal';

type AccountForm = { name: string; email: string; company: string; role: 'client' | 'staff'; password: string };

const statuses: Record<string, string> = {
  open: 'Open',
  'in-progress': 'In progress',
  'waiting-client': 'Waiting on client',
  resolved: 'Resolved'
};

const badgeStyles: Record<string, string> = {
  open: 'bg-amber-50 text-amber-700 ring-amber-200 border-amber-200',
  'in-progress': 'bg-blue-50 text-blue-700 ring-blue-200 border-blue-200',
  'waiting-client': 'bg-violet-50 text-violet-700 ring-violet-200 border-violet-200',
  resolved: 'bg-emerald-50 text-emerald-700 ring-emerald-200 border-emerald-200'
};

const priorityStyles: Record<string, string> = {
  low: 'bg-slate-100 text-slate-700',
  normal: 'bg-cyan-50 text-cyan-700',
  high: 'bg-orange-50 text-orange-700',
  urgent: 'bg-rose-50 text-rose-700 font-bold'
};

export default function PortalAccountsPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/admin/dashboard?section=portal'); }, [router]);
  return <main className="grid min-h-screen place-items-center bg-slate-50 text-sm text-slate-500"><Loader2 className="animate-spin text-cyan-700"/><span className="sr-only">Opening admin dashboard…</span></main>;
}

export function PortalAccountsManager({ embedded = false }: { embedded?: boolean }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'issues' | 'accounts'>('issues');
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [issues, setIssues] = useState<PortalIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Account search & form
  const [query, setQuery] = useState('');
  const [form, setForm] = useState<AccountForm>({ name: '', email: '', company: '', role: 'client', password: '' });

  // Issue filters & modal
  const [issueQuery, setIssueQuery] = useState('');
  const [issueStatusFilter, setIssueStatusFilter] = useState('all');
  const [issuePriorityFilter, setIssuePriorityFilter] = useState('all');
  const [selectedIssue, setSelectedIssue] = useState<PortalIssue | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isUpdatingIssue, setIsUpdatingIssue] = useState(false);

  const load = useCallback(async () => {
    try {
      const auth = await fetch('/api/admin/login');
      if (!auth.ok) { router.replace('/admin'); return; }
      const response = await fetch('/api/admin/portal');
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Could not load portal data.');
      setUsers(data.users || []);
      setIssues(data.issues || []);
      setError('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not load portal data.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { void load(); }, [load]);

  // Derived metrics
  const staffMembers = useMemo(() =>
    users.filter(user => String(user.role || '').toLowerCase() === 'staff'),
    [users]
  );
  const activeStaffMembers = useMemo(() =>
    staffMembers.filter(user => user.active !== false),
    [staffMembers]
  );
  const activeClients = users.filter(user => user.role === 'client' && user.active).length;
  const openIssuesCount = issues.filter(i => i.status === 'open').length;
  const inProgressCount = issues.filter(i => i.status === 'in-progress').length;
  const resolvedCount = issues.filter(i => i.status === 'resolved').length;

  // Filtered lists
  const visibleUsers = useMemo(() => users.filter(user =>
    `${user.name} ${user.email} ${user.company || ''} ${user.role}`.toLowerCase().includes(query.toLowerCase())
  ), [users, query]);

  const visibleIssues = useMemo(() => issues.filter(issue => {
    const matchesStatus = issueStatusFilter === 'all' || issue.status === issueStatusFilter;
    const matchesPriority = issuePriorityFilter === 'all' || issue.priority === issuePriorityFilter;
    const matchesSearch = `${issue.title} ${issue.description} ${issue.clientName} ${issue.clientEmail} ${issue.id} ${issue.category} ${issue.assignedName || ''}`
      .toLowerCase()
      .includes(issueQuery.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  }), [issues, issueStatusFilter, issuePriorityFilter, issueQuery]);

  // Create new account
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch('/api/admin/portal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to create account.');
      setUsers(current => [data, ...current]);
      setMessage(`${data.role === 'client' ? 'Client' : 'Staff'} login created for ${data.email}. Share credentials securely.`);
      setForm(current => ({ name: '', email: '', company: '', role: current.role, password: '' }));
      void load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to create account.');
    } finally {
      setSaving(false);
    }
  };

  // Toggle account active status
  const toggle = async (user: PortalUser) => {
    setBusyId(user.id);
    setError('');
    try {
      const response = await fetch('/api/admin/portal', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: user.id, active: !user.active }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to update account.');
      setUsers(current => current.map(item => item.id === user.id ? { ...item, active: !user.active } : item));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to update account.');
    } finally {
      setBusyId('');
    }
  };

  // Delete account
  const deleteAccount = async (userId: string, email: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete the account for "${email}"? This will revoke all their portal access.`)) return;
    setBusyId(userId);
    setError('');
    try {
      const response = await fetch(`/api/admin/portal?userId=${encodeURIComponent(userId)}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to delete account.');
      setUsers(current => current.filter(item => item.id !== userId));
      setMessage(`Account ${email} deleted successfully.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to delete account.');
    } finally {
      setBusyId('');
    }
  };

  // Update issue details (status, assignment, or admin reply)
  const updateIssue = async (issueId: string, payload: Record<string, unknown>) => {
    setIsUpdatingIssue(true);
    setError('');
    try {
      const response = await fetch('/api/admin/portal', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'issue', issueId, ...payload })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to update issue.');

      if (data.issue) {
        setIssues(current => current.map(i => i.id === issueId ? data.issue : i));
        setSelectedIssue(data.issue);
      } else {
        await load();
      }
      setReplyText('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to update issue.');
    } finally {
      setIsUpdatingIssue(false);
    }
  };

  // Delete issue as admin
  const deleteIssue = async (issueId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this support ticket? This action cannot be undone.')) return;
    setBusyId(issueId);
    setError('');
    try {
      const response = await fetch(`/api/admin/portal?issueId=${encodeURIComponent(issueId)}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to delete issue.');
      setIssues(current => current.filter(item => item.id !== issueId));
      if (selectedIssue?.id === issueId) setSelectedIssue(null);
      setMessage('Support ticket deleted successfully.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to delete issue.');
    } finally {
      setBusyId('');
    }
  };

  if (loading) return <main className="grid min-h-screen place-items-center bg-[#f4f7fb] text-slate-500"><Loader2 className="animate-spin text-cyan-700"/><span className="sr-only">Loading support portal…</span></main>;

  return (
    <main className={`${embedded ? 'rounded-2xl bg-[#f4f7fb] p-3 text-slate-900 sm:p-5' : 'min-h-screen bg-[#f4f7fb] px-4 py-6 text-slate-900 sm:px-7 sm:py-9'}`}>
      <div className="mx-auto max-w-7xl">
        <div className={`grid items-start gap-6 ${embedded ? '' : 'xl:grid-cols-[15rem_minmax(0,1fr)]'}`}>
          {!embedded && (
            <aside className="rounded-[24px] border border-slate-200/80 bg-white p-3 shadow-[0_12px_35px_-28px_rgba(15,23,42,.5)] xl:sticky xl:top-6">
              <div className="flex items-center gap-3 border-b border-slate-100 px-3 py-3">
                <span className="grid size-10 place-items-center rounded-xl bg-[#101b33] text-cyan-300"><ShieldCheck size={19}/></span>
                <div>
                  <p className="text-xs font-black tracking-wide text-slate-900">MAHI TECH</p>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[.15em] text-slate-400">Admin workspace</p>
                </div>
              </div>
              <p className="px-3 pb-2 pt-5 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">Management</p>
              <nav aria-label="Admin sidebar" className="flex gap-1 overflow-x-auto pb-1 xl:flex-col xl:overflow-visible">
                <a href="/admin/dashboard" className="inline-flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 xl:w-full"><LayoutDashboard size={17}/>CMS dashboard</a>
                <a href="/admin/portal" aria-current="page" className="inline-flex min-h-11 shrink-0 items-center gap-3 rounded-xl bg-cyan-50 px-3 text-sm font-semibold text-cyan-900 ring-1 ring-inset ring-cyan-100 xl:w-full"><Ticket size={17}/>Support & Portal</a>
                <a href="/portal" className="inline-flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 xl:w-full"><LifeBuoy size={17}/>Support portal<ArrowUpRight size={14} className="ml-auto text-slate-400"/></a>
              </nav>
            </aside>
          )}

          <div className="min-w-0">
            <div className={`mb-4 flex justify-between items-center ${embedded ? 'hidden' : ''}`}>
              <a href="/admin/dashboard" className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-950 xl:hidden"><ArrowLeft size={16}/>CMS dashboard</a>
              <a href="/portal" target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-cyan-300 hover:text-cyan-800 ml-auto">Open support portal<ArrowUpRight size={15}/></a>
            </div>

            {/* Header banner */}
            <section className="relative mb-6 overflow-hidden rounded-[28px] bg-[#101b33] px-5 py-7 text-white shadow-[0_24px_70px_-38px_rgba(15,23,42,.75)] sm:px-8 sm:py-8">
              <div className="pointer-events-none absolute -right-16 -top-28 size-72 rounded-full bg-cyan-400/20 blur-3xl"/>
              <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                <div className="max-w-2xl">
                  <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.18em] text-cyan-200">
                    <ShieldCheck size={14}/>Support & Portal Administration
                  </p>
                  <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                    Client Issues & Team Workspace
                  </h1>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
                    Review incoming support tickets from clients, assign staff members, post updates, and manage client & team credentials.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                  <Summary label="Total tickets" value={issues.length} icon={<Ticket size={16}/>} />
                  <Summary label="Open issues" value={openIssuesCount} icon={<Bell size={16}/>} />
                  <Summary label="In progress" value={inProgressCount} icon={<Clock3 size={16}/>} />
                  <Summary label="Resolved" value={resolvedCount} icon={<CheckCircle2 size={16}/>} />
                </div>
              </div>
            </section>

            {/* Alerts */}
            {(error || message) && (
              <div role={error ? 'alert' : 'status'} className={`mb-5 flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm ${error ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>
                {error ? <CircleAlert size={17} className="mt-0.5 shrink-0"/> : <Check size={17} className="mt-0.5 shrink-0"/>}
                <span className="flex-1">{error || message}</span>
                <button onClick={() => { setError(''); setMessage(''); }} className="text-xs font-semibold opacity-70 hover:opacity-100">Dismiss</button>
              </div>
            )}

            {/* Tab Navigation */}
            <div className="mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
              <button
                onClick={() => setActiveTab('issues')}
                className={`inline-flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === 'issues'
                    ? 'bg-[#101b33] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Ticket size={15}/>
                Support Tickets & Issues
                {openIssuesCount > 0 && (
                  <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-black text-slate-950">
                    {openIssuesCount} open
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('accounts')}
                className={`inline-flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === 'accounts'
                    ? 'bg-[#101b33] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Users size={15}/>
                Clients & Staff Logins
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                  {users.length}
                </span>
              </button>
            </div>

            {/* TAB 1: SUPPORT TICKETS & ISSUES */}
            {activeTab === 'issues' && (
              <section className="space-y-4">
                <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-3 transition focus-within:border-cyan-500 focus-within:bg-white w-full sm:w-64">
                      <Search size={15} className="shrink-0 text-slate-400"/>
                      <input
                        aria-label="Search tickets"
                        value={issueQuery}
                        onChange={e => setIssueQuery(e.target.value)}
                        placeholder="Search tickets, clients..."
                        className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-slate-400"
                      />
                    </label>
                    <select
                      aria-label="Filter status"
                      value={issueStatusFilter}
                      onChange={e => setIssueStatusFilter(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none"
                    >
                      <option value="all">All statuses</option>
                      {Object.entries(statuses).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                    <select
                      aria-label="Filter priority"
                      value={issuePriorityFilter}
                      onChange={e => setIssuePriorityFilter(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none"
                    >
                      <option value="all">All priorities</option>
                      <option value="low">Low priority</option>
                      <option value="normal">Normal priority</option>
                      <option value="high">High priority</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <p className="text-xs text-slate-500">
                    Showing <strong>{visibleIssues.length}</strong> of {issues.length} tickets
                  </p>
                </div>

                {visibleIssues.length === 0 ? (
                  <div className="rounded-[24px] border border-slate-200 bg-white p-12 text-center shadow-sm">
                    <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-500">
                      <MessageSquare size={22}/>
                    </span>
                    <h3 className="mt-4 font-semibold text-slate-900">
                      {issues.length ? 'No tickets matching your filter' : 'No client issues raised yet'}
                    </h3>
                    <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
                      {issues.length ? 'Try resetting search query or status filter.' : 'When clients log into /portal and submit an issue, it will immediately appear here.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {visibleIssues.map(issue => (
                      <article
                        key={issue.id}
                        className="group relative flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm transition hover:border-cyan-300 hover:shadow-md sm:flex-row sm:items-center sm:p-5"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${badgeStyles[issue.status] || 'bg-slate-100 text-slate-600'}`}>
                              {statuses[issue.status] || issue.status}
                            </span>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wide ${priorityStyles[issue.priority] || 'bg-slate-100 text-slate-700'}`}>
                              {issue.priority}
                            </span>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                              {issue.category}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              #{issue.id.slice(0, 8)}
                            </span>
                          </div>

                          <h3 className="mt-2 text-base font-semibold text-slate-900 group-hover:text-cyan-800 transition">
                            {issue.title}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">
                            {issue.description}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                            <span>
                              Client: <strong className="font-semibold text-slate-800">{issue.clientName}</strong> ({issue.clientEmail})
                            </span>
                            <span>·</span>
                            <span>
                              Assigned to: <strong className="font-semibold text-slate-800">{issue.assignedName || 'Unassigned'}</strong>
                            </span>
                            <span>·</span>
                            <span>
                              Updates: <strong>{issue.updates?.length || 0}</strong>
                            </span>
                            <span>·</span>
                            <span className="text-slate-400">
                              Updated {new Date(issue.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 pt-2 border-t border-slate-100 sm:border-t-0 sm:pt-0">
                          <button
                            onClick={() => setSelectedIssue(issue)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-2.5 text-xs font-semibold text-slate-800 transition hover:bg-[#101b33] hover:text-white"
                          >
                            <Ticket size={14}/>
                            Manage & Reply
                          </button>
                          <button
                            disabled={busyId === issue.id}
                            onClick={() => void deleteIssue(issue.id)}
                            title="Delete issue"
                            className="grid size-9 place-items-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                          >
                            {busyId === issue.id ? <Loader2 size={14} className="animate-spin"/> : <Trash2 size={14}/>}
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* TAB 2: PORTAL ACCOUNTS (CLIENTS & STAFF) */}
            {activeTab === 'accounts' && (
              <div className="grid items-start gap-5 xl:grid-cols-[minmax(320px,.78fr)_minmax(0,1.22fr)]">
                {/* Create Login form */}
                <section className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_35px_-28px_rgba(15,23,42,.5)] sm:p-6">
                  <div className="mb-5 flex items-start gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-cyan-50 text-cyan-800"><Plus size={20}/></span>
                    <div>
                      <h2 className="text-lg font-semibold tracking-tight">Create a portal login</h2>
                      <p className="mt-1 text-xs leading-5 text-slate-500">Create login credentials for a new client or team staff member.</p>
                    </div>
                  </div>
                  <form onSubmit={submit} className="space-y-4">
                    <Field label="Full name">
                      <input required minLength={2} value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} className="admin-input" placeholder="Client or staff name" autoComplete="name"/>
                    </Field>
                    <Field label="Email address">
                      <input type="email" required value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} className="admin-input" placeholder="name@company.com" autoComplete="email"/>
                    </Field>
                    <Field label="Account type">
                      <select value={form.role} onChange={event => setForm({ ...form, role: event.target.value as AccountForm['role'] })} className="admin-input">
                        <option value="client">Client</option>
                        <option value="staff">Staff member</option>
                      </select>
                    </Field>
                    {form.role === 'client' && (
                      <Field label="Company name (optional)">
                        <input value={form.company} onChange={event => setForm({ ...form, company: event.target.value })} className="admin-input" placeholder="Company or project" autoComplete="organization"/>
                      </Field>
                    )}
                    <Field label="Temporary password">
                      <span className="relative block">
                        <KeyRound size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
                        <input type="password" required minLength={8} autoComplete="new-password" value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} className="admin-input pl-10" placeholder="At least 8 characters"/>
                      </span>
                    </Field>
                    <button disabled={saving} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#101b33] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60">
                      {saving ? <Loader2 size={17} className="animate-spin"/> : <Plus size={17}/>}
                      {saving ? 'Creating login…' : `Create ${form.role} login`}
                    </button>
                    <p className="text-xs leading-5 text-slate-500">
                      Passwords are encrypted via HMAC-SHA256 scrypt. Share temporary password privately with the user.
                    </p>
                  </form>
                </section>

                {/* Accounts list */}
                <section className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_12px_35px_-28px_rgba(15,23,42,.5)]">
                  <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                      <h2 className="text-lg font-semibold tracking-tight">Portal accounts</h2>
                      <p className="mt-1 text-xs text-slate-500">{users.length} accounts · {activeClients} clients · {staffMembers.length} staff</p>
                    </div>
                    <label className="flex min-h-11 w-full items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 transition focus-within:border-cyan-400 focus-within:bg-white sm:max-w-xs">
                      <Search size={16} className="shrink-0 text-slate-400"/>
                      <input aria-label="Search accounts" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search name, email..." className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-slate-400"/>
                    </label>
                  </div>
                  {visibleUsers.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                      <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-500"><Users size={20}/></span>
                      <p className="mt-4 font-semibold text-sm">{users.length ? 'No matching accounts' : 'No portal accounts yet'}</p>
                      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">{users.length ? 'Try searching with a different keyword.' : 'Create a client or staff login to get started.'}</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {visibleUsers.map(user => (
                        <article key={user.id} className="flex flex-col gap-3 p-4 transition hover:bg-slate-50/70 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                          <div className="flex min-w-0 items-center gap-3.5">
                            <span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${user.role === 'staff' ? 'bg-violet-50 text-violet-700' : 'bg-cyan-50 text-cyan-700'}`}>
                              {user.role === 'staff' ? <ShieldCheck size={19}/> : <UserRound size={19}/>}
                            </span>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="max-w-full truncate text-sm font-semibold text-slate-900">{user.name}</p>
                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${user.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                  {user.active ? 'Active' : 'Disabled'}
                                </span>
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold capitalize text-slate-600">
                                  {user.role}
                                </span>
                              </div>
                              <p className="mt-0.5 truncate text-xs text-slate-500">{user.email}{user.company ? ` · ${user.company}` : ''}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            <button
                              disabled={busyId === user.id}
                              onClick={() => void toggle(user)}
                              className={`inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl px-3 text-xs font-semibold transition disabled:opacity-50 ${user.active ? 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                            >
                              {busyId === user.id ? <Loader2 size={13} className="animate-spin"/> : user.active ? <UserX size={13}/> : <Check size={13}/>}
                              {user.active ? 'Disable' : 'Enable'}
                            </button>
                            <button
                              disabled={busyId === user.id}
                              onClick={() => void deleteAccount(user.id, user.email)}
                              title="Delete account"
                              className="grid size-9 place-items-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                            >
                              <Trash2 size={13}/>
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ADMIN TICKET MODAL */}
      {selectedIssue && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          onMouseDown={e => { if (e.target === e.currentTarget) setSelectedIssue(null); }}
        >
          <section className="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-2xl sm:rounded-2xl sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badgeStyles[selectedIssue.status]}`}>
                    {statuses[selectedIssue.status]}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase font-semibold ${priorityStyles[selectedIssue.priority]}`}>
                    {selectedIssue.priority}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    #{selectedIssue.id.slice(0, 8)}
                  </span>
                </div>
                <h2 className="mt-2 text-xl font-bold text-slate-900">{selectedIssue.title}</h2>
              </div>
              <button
                onClick={() => setSelectedIssue(null)}
                aria-label="Close"
                className="grid size-9 place-items-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                <X size={17}/>
              </button>
            </div>

            <div className="space-y-5">
              {/* Client & Description Info */}
              <div className="grid gap-3 rounded-xl bg-slate-50 p-4 text-xs sm:grid-cols-3">
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider">Client Info</span>
                  <p className="mt-1 font-semibold text-slate-900 text-sm truncate">{selectedIssue.clientName}</p>
                  <p className="text-slate-500 truncate">{selectedIssue.clientEmail}</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider">Assigned Staff</span>
                  <p className="mt-1 font-semibold text-slate-900 text-sm">
                    {selectedIssue.assignedName || 'Unassigned'}
                  </p>
                  <p className="text-slate-500">{selectedIssue.category}</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider">Date Raised</span>
                  <p className="mt-1 font-semibold text-slate-800">{new Date(selectedIssue.createdAt).toLocaleDateString()}</p>
                  <p className="text-slate-500">{new Date(selectedIssue.createdAt).toLocaleTimeString()}</p>
                </div>
              </div>

              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider">Description</span>
                <div className="mt-1.5 rounded-xl border border-slate-200 bg-white p-3.5 text-xs leading-6 text-slate-700 whitespace-pre-wrap">
                  {selectedIssue.description}
                </div>
              </div>

              {/* Status & Assignment controls */}
              <div className="grid gap-4 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Change Status</label>
                  <select
                    value={selectedIssue.status}
                    onChange={e => {
                      const nextStatus = e.target.value as PortalIssue['status'];
                      setSelectedIssue({ ...selectedIssue, status: nextStatus });
                      void updateIssue(selectedIssue.id, { status: nextStatus });
                    }}
                    className="admin-input text-xs"
                  >
                    {Object.entries(statuses).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Assign Staff Member</label>
                    <span className="text-[10px] font-semibold text-cyan-800">
                      ({staffMembers.length} staff available)
                    </span>
                  </div>
                  <select
                    value={selectedIssue.assignedTo || ''}
                    onChange={e => {
                      const staffId = e.target.value;
                      const member = staffMembers.find(u => u.id === staffId);
                      const assignedName = member ? member.name : '';
                      setSelectedIssue({ ...selectedIssue, assignedTo: staffId, assignedName });
                      void updateIssue(selectedIssue.id, { assignedTo: staffId, assignedName });
                    }}
                    className="admin-input text-xs"
                  >
                    <option value="">Unassigned</option>
                    {staffMembers.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.email}){s.active ? '' : ' [Inactive]'}
                      </option>
                    ))}
                  </select>
                  {staffMembers.length === 0 ? (
                    <p className="mt-1.5 text-[11px] text-amber-600 font-medium">
                      ⚠️ Koi staff account nahi mila. Pehle &apos;Clients &amp; Staff Logins&apos; tab par jaakar Account Type = &apos;Staff member&apos; banayein.
                    </p>
                  ) : (
                    <p className="mt-1 text-[11px] text-slate-500">
                      Current: <strong className="text-slate-800">{selectedIssue.assignedName || 'Unassigned'}</strong>
                    </p>
                  )}
                </div>
              </div>

              {/* Conversation Updates */}
              <div>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                  Discussion & Updates ({selectedIssue.updates?.length || 0})
                </h3>
                <div className="max-h-60 space-y-2.5 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50/40 p-3">
                  {!selectedIssue.updates || selectedIssue.updates.length === 0 ? (
                    <p className="text-center py-4 text-xs text-slate-400">No updates or replies posted yet.</p>
                  ) : (
                    selectedIssue.updates.map(item => (
                      <div key={item.id} className="rounded-xl border border-slate-200/70 bg-white p-3 text-xs shadow-xs">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-800">{item.authorName}</span>
                          <span className="text-slate-400">{new Date(item.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="mt-1 whitespace-pre-wrap leading-5 text-slate-700">{item.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Admin reply form */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (replyText.trim()) void updateIssue(selectedIssue.id, { message: replyText.trim() });
                }}
                className="space-y-2"
              >
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Post Admin Reply</label>
                <div className="flex gap-2">
                  <input
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Write an update for the client or staff..."
                    className="admin-input flex-1 text-xs"
                  />
                  <button
                    disabled={!replyText.trim() || isUpdatingIssue}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#101b33] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50"
                  >
                    <Send size={13}/>
                    Send
                  </button>
                </div>
              </form>

              {/* Danger Zone: Delete Issue */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <button
                  type="button"
                  disabled={busyId === selectedIssue.id}
                  onClick={() => void deleteIssue(selectedIssue.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/70 px-3.5 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
                >
                  <Trash2 size={14}/>
                  Delete this ticket
                </button>
                <span className="text-xs text-slate-400">Created {new Date(selectedIssue.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </section>
        </div>
      )}

      <style jsx global>{`
        .admin-input {
          width: 100%;
          min-height: 42px;
          border: 1px solid #dbe2ea;
          border-radius: 12px;
          background: #fff;
          padding: 8px 12px;
          font-size: 13px;
          color: #0f172a;
          outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        .admin-input:focus {
          border-color: #06b6d4;
          box-shadow: 0 0 0 3px rgb(6 182 212 / .12);
        }
        .admin-input::placeholder {
          color: #94a3b8;
        }
      `}</style>
    </main>
  );
}

function Summary({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
  return (
    <div className="min-w-[80px] rounded-2xl border border-white/10 bg-white/[.07] px-3 py-2.5 sm:px-4 sm:py-3">
      <div className="flex items-center justify-between gap-2 text-cyan-200">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-300">{label}</span>
        {icon}
      </div>
      <p className="mt-1.5 text-xl font-bold tabular-nums sm:text-2xl">{value}</p>
    </div>
  );
}

function Field({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <label className="block text-xs font-medium text-slate-700">
      <span className="mb-1 block font-semibold">{label}</span>
      {children}
    </label>
  );
}
