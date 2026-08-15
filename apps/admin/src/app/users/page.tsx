'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/AdminLayout';
import { apiRequest } from '@/lib/api';
import { AdminUserDto, AdminRole, ROLE_METADATA } from '@theblinghaven/shared';
import {
  Users,
  UserPlus,
  Shield,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  Lock,
  Unlock,
  ExternalLink,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  Eye,
} from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUserDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: AdminRole.CATALOG_MANAGER,
    password: '',
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams();
      if (searchTerm) query.set('search', searchTerm);
      if (selectedRole) query.set('role', selectedRole);
      const res = await apiRequest<any>(`/admin/users?${query.toString()}`);
      if (Array.isArray(res)) {
        setUsers(res);
      } else if (res && Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        setUsers([]);
      }
    } catch (e) {
      console.error('Failed to load users:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedRole]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/admin/users', {
        method: 'POST',
        data: newUser,
      });
      setIsCreateModalOpen(false);
      setNewUser({
        email: '',
        firstName: '',
        lastName: '',
        role: AdminRole.CATALOG_MANAGER,
        password: '',
      });
      fetchUsers();
    } catch (e: any) {
      alert(e.message || 'Failed to create admin user.');
    }
  };

  const toggleUserStatus = async (user: AdminUserDto) => {
    try {
      await apiRequest(`/admin/users/${user.id}`, {
        method: 'PUT',
        data: { isActive: !user.isActive },
      });
      fetchUsers();
    } catch (e: any) {
      alert(e.message || 'Failed to update user status.');
    }
  };

  const unlockAccount = async (userId: string) => {
    try {
      await apiRequest(`/admin/users/${userId}/unlock`, { method: 'POST' });
      alert('Account unlocked.');
      fetchUsers();
    } catch (e: any) {
      alert(e.message || 'Failed to unlock account.');
    }
  };

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const mfaUsers = users.filter((u) => u.mfaEnabled).length;
  const mfaRate = totalUsers > 0 ? Math.round((mfaUsers / totalUsers) * 100) : 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-ivory-400 dark:border-obsidian-750 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
              <Shield className="h-4 w-4" />
              <span>Role-Based Access Control (RBAC)</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
              Admin Users & Roles
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Manage privileged administrator identities, roles, and security policies.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/roles"
              className="flex items-center space-x-2 rounded-lg border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-850 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-ivory-100 dark:hover:bg-obsidian-800 transition"
            >
              <ShieldCheck className="h-4 w-4 text-gold-500" />
              <span>Role Permissions Matrix</span>
            </Link>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center space-x-2 rounded-lg border border-gold-500/60 bg-gradient-to-r from-gold-600 to-gold-500 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-obsidian-950 shadow-lg shadow-gold-500/20 hover:from-gold-500 hover:to-gold-400"
            >
              <UserPlus className="h-4 w-4" />
              <span>Create Admin User</span>
            </button>
          </div>
        </div>

        {/* 3 Identity KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Administrators
              </span>
              <Users className="h-4 w-4 text-gold-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif">
              {totalUsers} Accounts
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {activeUsers} active / {totalUsers - activeUsers} deactivated
            </p>
          </div>

          <div className="rounded-2xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                2FA Adoption Rate
              </span>
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                {mfaRate}% ENFORCED
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif">
              {mfaUsers} of {totalUsers} Enabled
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Phishing-resistant TOTP authenticators
            </p>
          </div>

          <div className="rounded-2xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                RBAC Role Coverage
              </span>
              <Shield className="h-4 w-4 text-gold-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif">
              10 Roles / 29 Perms
            </p>
            <p className="mt-1 text-xs text-gold-700 dark:text-gold-400 font-bold">
              <Link href="/roles" className="hover:underline flex items-center space-x-1">
                <span>View Full Permissions Matrix</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
              className="w-full rounded-lg border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 py-2 pl-9 pr-4 text-xs text-slate-800 dark:text-slate-200 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="rounded-lg border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:border-gold-500 focus:outline-none"
          >
            <option value="">All Roles</option>
            {Object.values(AdminRole).map((r) => (
              <option key={r} value={r}>
                {r.replace('_', ' ')}
              </option>
            ))}
          </select>

          <button
            onClick={fetchUsers}
            className="rounded-lg border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-850 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-ivory-100 dark:hover:bg-obsidian-800"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Users Table */}
        <div className="rounded-2xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-ivory-300 dark:border-obsidian-800 text-slate-500 dark:text-slate-400">
                <th className="pb-3 font-bold uppercase tracking-wider">User</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Role & Permissions</th>
                <th className="pb-3 font-bold uppercase tracking-wider">MFA Status</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Account Status</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Last Sign In</th>
                <th className="pb-3 font-bold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-300 dark:divide-obsidian-800 text-slate-700 dark:text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gold-500 border-t-transparent"></div>
                      <span>Loading admin users...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No admin users found matching the selected criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const roleMeta = ROLE_METADATA[u.role] || {
                    label: u.role,
                    color: '#C5A880',
                  };

                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-ivory-100 dark:hover:bg-obsidian-850/50 transition"
                    >
                      <td className="py-3">
                        <Link
                          href={`/users/${u.id}`}
                          className="group block"
                        >
                          <p className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition">
                            {u.firstName} {u.lastName}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono">{u.email}</p>
                        </Link>
                      </td>
                      <td className="py-3">
                        <span
                          className="inline-flex items-center rounded-md px-2 py-0.5 font-bold border text-[11px]"
                          style={{
                            borderColor: `${roleMeta.color}40`,
                            backgroundColor: `${roleMeta.color}15`,
                            color: roleMeta.color,
                          }}
                        >
                          {u.role.replace('_', ' ')}
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">
                          {u.permissions.length} capabilities
                        </span>
                      </td>
                      <td className="py-3">
                        {u.mfaEnabled ? (
                          <span className="inline-flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Enabled</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-slate-400 dark:text-slate-500">
                            <XCircle className="h-3.5 w-3.5" />
                            <span>Not Configured</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            u.isActive
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                              : 'bg-red-500/20 text-red-600 dark:text-red-400'
                          }`}
                        >
                          {u.isActive ? 'ACTIVE' : 'DEACTIVATED'}
                        </span>
                      </td>
                      <td className="py-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                        {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Never'}
                      </td>
                      <td className="py-3 text-right space-x-2">
                        <Link
                          href={`/users/${u.id}`}
                          className="inline-flex items-center rounded border border-ivory-400 dark:border-obsidian-700 bg-ivory-100 dark:bg-obsidian-800 p-1.5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                          title="View detailed user profile"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          onClick={() => unlockAccount(u.id)}
                          className="rounded border border-ivory-400 dark:border-obsidian-700 bg-ivory-100 dark:bg-obsidian-800 p-1.5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                          title="Reset Lockout"
                        >
                          <Unlock className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => toggleUserStatus(u)}
                          className={`rounded border p-1 text-xs font-bold ${
                            u.isActive
                              ? 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20'
                              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                          }`}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Create User Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-900 p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Create New Administrator
              </h3>
              <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newUser.firstName}
                      onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                      className="w-full rounded border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newUser.lastName}
                      onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                      className="w-full rounded border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full rounded border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">
                    Role Assignment
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as AdminRole })}
                    className="w-full rounded border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                  >
                    {Object.values(AdminRole).map((r) => (
                      <option key={r} value={r}>
                        {r.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">
                    Initial Temporary Password
                  </label>
                  <input
                    type="password"
                    placeholder="Leave blank for system default"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full rounded border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="rounded border border-ivory-400 dark:border-obsidian-750 bg-ivory-100 dark:bg-obsidian-850 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded border border-gold-500/60 bg-gradient-to-r from-gold-600 to-gold-500 px-4 py-2 font-bold text-obsidian-950 hover:from-gold-500 hover:to-gold-400"
                  >
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
