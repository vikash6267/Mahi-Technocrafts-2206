'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  UserPlus,
  Search,
  CheckCircle2,
  XCircle,
  KeyRound,
  Edit2,
  Trash2,
  Lock,
  User,
  Mail,
  Loader2,
  RefreshCw,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
  X,
  Sparkles,
  ShieldAlert,
  Users,
  Settings,
  Clock,
  Wallet,
  FileText,
  Inbox,
  Briefcase,
  Star
} from 'lucide-react';
import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell';
import { AdminRole, AdminPermissionDef } from '@/lib/admin-auth';

interface AdminUserRecord {
  id: string;
  username: string;
  name: string;
  email?: string;
  role: AdminRole;
  permissions: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<AdminPermissionDef[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | AdminRole>('all');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserRecord | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'subadmin' as AdminRole,
    permissions: ['dashboard'] as string[],
    active: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        if (data.availablePermissions) {
          setAvailablePermissions(data.availablePermissions);
        }
      }
    } catch (err) {
      console.error('Failed to load admin users:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchUsers();
  };

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      username: '',
      email: '',
      password: '',
      role: 'subadmin',
      permissions: ['dashboard'],
      active: true
    });
    setModalError('');
    setModalSuccess('');
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: AdminUserRecord) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      email: user.email || '',
      password: '', // leave empty to not change
      role: user.role,
      permissions: user.permissions || [],
      active: user.active
    });
    setModalError('');
    setModalSuccess('');
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleTogglePermission = (permId: string) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(permId);
      let updated: string[];
      if (exists) {
        updated = prev.permissions.filter((p) => p !== permId);
      } else {
        updated = [...prev.permissions, permId];
      }
      return { ...prev, permissions: updated };
    });
  };

  const handleSelectAllPermissions = () => {
    setFormData((prev) => ({
      ...prev,
      permissions: availablePermissions.map((p) => p.id)
    }));
  };

  const handleClearPermissions = () => {
    setFormData((prev) => ({
      ...prev,
      permissions: ['dashboard']
    }));
  };

  // Preset role helpers
  const applyPreset = (presetType: 'finance' | 'content' | 'support' | 'full') => {
    if (presetType === 'full') {
      handleSelectAllPermissions();
    } else if (presetType === 'finance') {
      setFormData((prev) => ({
        ...prev,
        permissions: ['dashboard', 'finance', 'reminders']
      }));
    } else if (presetType === 'content') {
      setFormData((prev) => ({
        ...prev,
        permissions: ['dashboard', 'blogs', 'reviews', 'careers', 'settings']
      }));
    } else if (presetType === 'support') {
      setFormData((prev) => ({
        ...prev,
        permissions: ['dashboard', 'portal', 'contacts']
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');

    if (!formData.name.trim() || !formData.username.trim()) {
      setModalError('Full name and username are required.');
      return;
    }

    if (!editingUser && (!formData.password || formData.password.length < 6)) {
      setModalError('Password must be at least 6 characters long.');
      return;
    }

    if (editingUser && formData.password && formData.password.length < 6) {
      setModalError('New password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      const isEdit = Boolean(editingUser);
      const url = '/api/admin/users';
      const method = isEdit ? 'PATCH' : 'POST';

      const payload: any = {
        name: formData.name.trim(),
        username: formData.username.trim().toLowerCase(),
        email: formData.email.trim() || undefined,
        role: formData.role,
        permissions: formData.role === 'superadmin' ? availablePermissions.map((p) => p.id) : formData.permissions,
        active: formData.active
      };

      if (isEdit) {
        payload.id = editingUser!.id;
        if (formData.password) {
          payload.password = formData.password;
        }
      } else {
        payload.password = formData.password;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setModalSuccess(data.message || 'Saved successfully');
        setTimeout(() => {
          setIsModalOpen(false);
          fetchUsers();
        }, 800);
      } else {
        setModalError(data.error || 'Failed to save user.');
      }
    } catch (err) {
      console.error('Save user error:', err);
      setModalError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (user: AdminUserRecord) => {
    if (user.role === 'superadmin' || user.username === 'superadmin') {
      alert('Master Super-Admin account cannot be deleted.');
      return;
    }

    if (!confirm(`Are you sure you want to delete subadmin "${user.name}" (@${user.username})? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(user.id);
    try {
      const res = await fetch(`/api/admin/users?id=${user.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
      } else {
        alert(data.error || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Delete user error:', err);
      alert('Connection error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (user: AdminUserRecord) => {
    if (user.role === 'superadmin' || user.username === 'superadmin') {
      alert('Master Super-Admin account cannot be deactivated.');
      return;
    }

    const nextStatus = !user.active;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, active: nextStatus })
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, active: nextStatus } : u))
        );
      }
    } catch (err) {
      console.error('Toggle active error:', err);
    }
  };

  // Filtered list
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = u.name.toLowerCase().includes(q);
        const matchUsername = u.username.toLowerCase().includes(q);
        const matchEmail = (u.email || '').toLowerCase().includes(q);
        if (!matchName && !matchUsername && !matchEmail) return false;
      }
      return true;
    });
  }, [users, roleFilter, searchQuery]);

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.active).length;
    const superadmins = users.filter((u) => u.role === 'superadmin').length;
    const subadmins = users.filter((u) => u.role === 'subadmin').length;
    return { total, active, superadmins, subadmins };
  }, [users]);

  // Icon mapping for permissions
  const getPermissionIcon = (id: string) => {
    switch (id) {
      case 'dashboard': return <Users size={12} />;
      case 'reminders': return <Clock size={12} />;
      case 'finance': return <Wallet size={12} />;
      case 'blogs': return <FileText size={12} />;
      case 'contacts': return <Inbox size={12} />;
      case 'portal': return <ShieldCheck size={12} />;
      case 'projects': return <Briefcase size={12} />;
      case 'services': return <Sparkles size={12} />;
      case 'reviews': return <Star size={12} />;
      case 'careers': return <Users size={12} />;
      case 'settings': return <Settings size={12} />;
      case 'users': return <KeyRound size={12} />;
      default: return <Check size={12} />;
    }
  };

  return (
    <AdminLayoutShell
      title="Admin & Subadmin Management"
      subtitle="Create subadmin accounts, assign granular permissions, and restrict sidebar menu access"
    >
      <div className="space-y-6">
        {/* Top Control Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <KeyRound size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-display font-black text-slate-900 dark:text-white">
                  Access Control & Subadmins
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold uppercase tracking-wider">
                  Role-Based Access
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {users.length} authorized administrators • Manage who sees what on the admin panel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 flex items-center justify-center transition-colors cursor-pointer"
              title="Refresh User List"
            >
              <RefreshCw size={15} className={isRefreshing ? 'animate-spin text-sky-500' : ''} />
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-sky-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-600/25 cursor-pointer"
            >
              <UserPlus size={15} />
              Add Subadmin
            </button>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Total Accounts</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.total}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Active Staff</p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{stats.active}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Super Admins</p>
            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{stats.superadmins}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-sky-600 dark:text-sky-400">Sub-Admins</p>
            <p className="text-2xl font-black text-sky-600 dark:text-sky-400 mt-1">{stats.subadmins}</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, @username or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'superadmin', 'admin', 'subadmin'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  roleFilter === r
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {r === 'all' ? 'All Roles' : r}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <Loader2 size={24} className="animate-spin text-indigo-500" />
              <p className="text-xs">Loading admin & subadmin accounts...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Users size={20} />
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No users found</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/40 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">User Details</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Sidebar Permissions</th>
                    <th className="py-3.5 px-4">Last Activity</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {filteredUsers.map((user) => {
                    const isMaster = user.username === 'superadmin';
                    return (
                      <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                        {/* Name & Avatar */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-black text-white shadow-sm shrink-0 ${
                              user.role === 'superadmin'
                                ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-indigo-500/20'
                                : user.role === 'admin'
                                ? 'bg-gradient-to-tr from-sky-600 to-blue-600'
                                : 'bg-gradient-to-tr from-emerald-600 to-teal-600'
                            }`}>
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900 dark:text-white">
                                  {user.name}
                                </span>
                                {isMaster && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold uppercase tracking-wider">
                                    Master
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                <span>@{user.username}</span>
                                {user.email && <span>• {user.email}</span>}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role Badge */}
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider ${
                            user.role === 'superadmin'
                              ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                              : user.role === 'admin'
                              ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                              : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          }`}>
                            <ShieldCheck size={11} />
                            {user.role}
                          </span>
                        </td>

                        {/* Active Status */}
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleActive(user)}
                            disabled={isMaster}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                              user.active
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'
                                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60'
                            } ${isMaster ? 'cursor-not-allowed opacity-80' : 'cursor-pointer hover:opacity-80'}`}
                            title={isMaster ? 'Master Super-Admin cannot be deactivated' : 'Click to toggle status'}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${user.active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            {user.active ? 'Active' : 'Inactive'}
                          </button>
                        </td>

                        {/* Permissions Badges */}
                        <td className="py-3.5 px-4 max-w-xs">
                          {user.role === 'superadmin' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                              <Sparkles size={11} />
                              Full Unrestricted Access (All 12 Modules)
                            </span>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {user.permissions && user.permissions.length > 0 ? (
                                user.permissions.map((pId) => {
                                  const def = availablePermissions.find((d) => d.id === pId);
                                  return (
                                    <span
                                      key={pId}
                                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold capitalize"
                                    >
                                      {getPermissionIcon(pId)}
                                      {def?.label.split(' ')[0] || pId}
                                    </span>
                                  );
                                })
                              ) : (
                                <span className="text-[11px] text-slate-400 italic">No modules assigned</span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Last Activity */}
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                          {user.lastLoginAt ? (
                            <div>
                              <p className="font-semibold text-slate-700 dark:text-slate-300">
                                {new Date(user.lastLoginAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {new Date(user.lastLoginAt).toLocaleTimeString('en-IN', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          ) : (
                            <span className="italic text-slate-400">Never logged in</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditModal(user)}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-indigo-600 hover:border-indigo-300 transition-colors cursor-pointer"
                              title="Edit user & permissions"
                            >
                              <Edit2 size={13} />
                            </button>

                            {!isMaster && (
                              <button
                                onClick={() => handleDeleteUser(user)}
                                disabled={deletingId === user.id}
                                className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/30 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer"
                                title="Delete account"
                              >
                                {deletingId === user.id ? (
                                  <Loader2 size={13} className="animate-spin" />
                                ) : (
                                  <Trash2 size={13} />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Add / Edit Subadmin Modal */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div
            className="w-full max-w-2xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            style={{
              boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.25), 0 0 30px rgba(0, 0, 0, 0.2)'
            }}
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-gradient-to-r from-indigo-50 via-white to-sky-50 dark:from-slate-900 dark:via-[#070918] dark:to-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <KeyRound size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                    Administrator Security Desk
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {editingUser ? `Edit Subadmin: ${editingUser.name}` : 'Create New Subadmin Account'}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              {modalError && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span className="font-semibold">{modalError}</span>
                </div>
              )}

              {modalSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 size={15} className="shrink-0" />
                  <span className="font-semibold">{modalSuccess}</span>
                </div>
              )}

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Username * (Login ID)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
                    <input
                      type="text"
                      required
                      disabled={Boolean(editingUser)}
                      placeholder="rahul_staff"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().trim() })}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      placeholder="rahul@mahitechnocrafts.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    {editingUser ? 'Change Password (Leave blank to keep)' : 'Login Password * (Min 6 chars)'}
                  </label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={editingUser ? '•••••••• (unchanged)' : 'Enter secure password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Account Role *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'subadmin', label: 'Sub-Admin', desc: 'Custom sidebar permissions' },
                    { id: 'admin', label: 'Admin', desc: 'Broad administrative access' },
                    { id: 'superadmin', label: 'Super-Admin', desc: 'Full unrestricted master access' }
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: r.id as AdminRole })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        formData.role === r.id
                          ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <p className="font-bold text-xs">{r.label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{r.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Permissions Config (Only if not superadmin) */}
              {formData.role !== 'superadmin' ? (
                <div className="space-y-3 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Sidebar Modules Access ({formData.permissions.length} Selected)
                      </label>
                      <p className="text-[10px] text-slate-400">
                        Only checked modules will appear in this subadmin&apos;s navigation menu.
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleSelectAllPermissions}
                        className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold hover:bg-slate-200 cursor-pointer"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={handleClearPermissions}
                        className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold hover:bg-slate-200 cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Preset quick buttons */}
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Quick Presets:</span>
                    <button
                      type="button"
                      onClick={() => applyPreset('finance')}
                      className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold hover:opacity-80 cursor-pointer"
                    >
                      💰 Finance & Accounts Desk
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset('content')}
                      className="px-2 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-[10px] font-bold hover:opacity-80 cursor-pointer"
                    >
                      ✍️ Content & SEO Manager
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset('support')}
                      className="px-2 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-[10px] font-bold hover:opacity-80 cursor-pointer"
                    >
                      🛡️ Client Support & Portal
                    </button>
                  </div>

                  {/* Checkbox Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {availablePermissions.map((perm) => {
                      const isChecked = formData.permissions.includes(perm.id);
                      return (
                        <div
                          key={perm.id}
                          onClick={() => handleTogglePermission(perm.id)}
                          className={`p-3 rounded-xl border flex items-start gap-2.5 transition-all cursor-pointer ${
                            isChecked
                              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40'
                              : 'border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isChecked ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 dark:border-slate-700'
                          }`}>
                            {isChecked && <Check size={11} strokeWidth={3} />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                              {perm.label}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {perm.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50 flex items-center gap-3">
                  <ShieldCheck size={20} className="text-purple-600 shrink-0" />
                  <div>
                    <p className="font-bold text-purple-800 dark:text-purple-300 text-xs">
                      Full Administrative Access Granted
                    </p>
                    <p className="text-[11px] text-purple-600 dark:text-purple-400">
                      Super-Admins have unrestricted access to all 12 modules, financial records, and subadmin management.
                    </p>
                  </div>
                </div>
              )}
            </form>

            {/* Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Saving Account...</span>
                  </>
                ) : (
                  <span>{editingUser ? 'Update Subadmin' : 'Create Subadmin'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayoutShell>
  );
}
