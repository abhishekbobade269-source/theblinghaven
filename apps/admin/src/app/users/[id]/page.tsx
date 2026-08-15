'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/AdminLayout';
import { apiRequest } from '@/lib/api';
import {
  AdminUserDto,
  AdminRole,
  Permission,
  AuditLogDto,
  PERMISSION_GROUPS,
  ROLE_METADATA,
} from '@theblinghaven/shared';
import {
  Shield,
  CheckCircle2,
  XCircle,
  KeyRound,
  History,
  Unlock,
  Edit,
  ArrowLeft,
  Calendar,
  Mail,
  User,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<AdminUserDto | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    role: AdminRole.CATALOG_MANAGER,
    isActive: true,
  });

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const [uRes, auditRes] = await Promise.all([
        apiRequest<any>(`/admin/users/${userId}`),
        apiRequest<any>(`/admin/users/${userId}/audit`).catch(() => []),
      ]);
      const userData = uRes.data || uRes;
      setUser(userData);
      setAuditLogs(Array.isArray(auditRes) ? auditRes : auditRes?.data || []);
      setEditForm({
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        isActive: userData.isActive,
      });
    } catch (e: any) {
      alert(e.message || 'Failed to load user profile.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadUserData();
    }
  }, [userId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest(`/admin/users/${userId}`, {
        method: 'PUT',
        data: editForm,
      });
      setIsEditModalOpen(false);
      loadUserData();
    } catch (e: any) {
      alert(e.message || 'Failed to update admin profile.');
    }
  };

  const handleUnlock = async () => {
    try {
      await apiRequest(`/admin/users/${userId}/unlock`, { method: 'POST' });
      alert('Account unlocked successfully.');
      loadUserData();
    } catch (e: any) {
      alert(e.message || 'Failed to unlock account.');
    }
  };

  if (isLoading || !user) {
    return (
      <AdminLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="flex flex-col items-center space-y-3 text-slate-400">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
            <p className="text-xs">Loading administrator profile...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const roleMeta = ROLE_METADATA[user.role] || {
    label: user.role,
    description: 'Privileged identity',
    color: '#C5A880',
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-6xl">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-ivory-400 dark:border-obsidian-750 pb-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/users"
              className="rounded-lg border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-850 p-2 text-slate-600 dark:text-slate-300 hover:bg-ivory-100 dark:hover:bg-obsidian-800 transition"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
                <ShieldCheck className="h-4 w-4" />
                <span>Administrator Identity & Forensics</span>
              </div>
              <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
                {user.firstName} {user.lastName}
              </h1>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                {user.email} • ID: {user.id}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleUnlock}
              className="flex items-center space-x-2 rounded-lg border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-850 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-ivory-100 dark:hover:bg-obsidian-800 transition"
            >
              <Unlock className="h-3.5 w-3.5" />
              <span>Reset Lockout</span>
            </button>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center space-x-2 rounded-lg border border-gold-500/60 bg-gradient-to-r from-gold-600 to-gold-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-obsidian-950 shadow-md hover:from-gold-500 hover:to-gold-400 transition"
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Profile & Role</span>
            </button>
          </div>
        </div>

        {/* Identity Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Role & Privileges */}
          <div className="rounded-2xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Assigned Privileged Role
            </span>
            <div className="mt-3 flex items-center space-x-3">
              <span
                className="inline-block h-3.5 w-3.5 rounded-full"
                style={{ backgroundColor: roleMeta.color }}
              />
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100 font-serif">
                {roleMeta.label}
              </p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              {roleMeta.description}
            </p>
            <div className="mt-4 pt-3 border-t border-ivory-300 dark:border-obsidian-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Effective Permissions:</span>
              <span className="font-bold text-gold-700 dark:text-gold-400 font-mono">
                {user.permissions.length} Active
              </span>
            </div>
          </div>

          {/* MFA & Authentication */}
          <div className="rounded-2xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Authentication Security
            </span>
            <div className="mt-3 flex items-center space-x-2">
              {user.mfaEnabled ? (
                <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-base font-bold">2FA Active (TOTP)</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-base font-bold">2FA Not Configured</span>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              {user.mfaEnabled
                ? 'Time-based one-time password challenge required at sign-in.'
                : 'Account is relying on password authentication only.'}
            </p>
            <div className="mt-4 pt-3 border-t border-ivory-300 dark:border-obsidian-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Last Sign-In:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}
              </span>
            </div>
          </div>

          {/* Account Status */}
          <div className="rounded-2xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Account Status & Lifecycle
            </span>
            <div className="mt-3">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                  user.isActive
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-red-500/20 text-red-600 dark:text-red-400'
                }`}
              >
                {user.isActive ? 'ACTIVE & AUTHORIZED' : 'SUSPENDED / DEACTIVATED'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Account provisioned on {new Date(user.createdAt).toLocaleDateString()}.
            </p>
            <div className="mt-4 pt-3 border-t border-ivory-300 dark:border-obsidian-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Brute-Force State:</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                Unlocked (0/5)
              </span>
            </div>
          </div>
        </div>

        {/* Effective Permissions Breakdown */}
        <div className="rounded-2xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm">
          <div className="pb-4 mb-4 border-b border-ivory-300 dark:border-obsidian-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Shield className="h-5 w-5 text-gold-600 dark:text-gold-400" />
                <span>Effective Permissions Breakdown</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Granular capabilities granted by the {roleMeta.label} role assignment
              </p>
            </div>
            <Link
              href="/roles"
              className="text-xs font-bold text-gold-700 dark:text-gold-400 hover:underline"
            >
              Inspect Full Matrix
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PERMISSION_GROUPS.map((group, gIdx) => {
              const groupPerms = group.permissions.map((p) => p.key);
              const activeInGroup = groupPerms.filter((p) => user.permissions.includes(p));

              return (
                <div
                  key={gIdx}
                  className="rounded-xl border border-ivory-300 dark:border-obsidian-800 bg-ivory-50 dark:bg-obsidian-850 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {group.name}
                    </h3>
                    <span className="font-mono text-[10px] font-bold text-gold-700 dark:text-gold-400">
                      {activeInGroup.length}/{groupPerms.length}
                    </span>
                  </div>
                  <div className="space-y-1.5 mt-3">
                    {group.permissions.map((p) => {
                      const isGranted = user.permissions.includes(p.key);
                      return (
                        <div
                          key={p.key}
                          className="flex items-center space-x-2 text-[11px]"
                        >
                          {isGranted ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-slate-300 dark:text-slate-700 shrink-0" />
                          )}
                          <span
                            className={
                              isGranted
                                ? 'text-slate-800 dark:text-slate-200 font-medium'
                                : 'text-slate-400 dark:text-slate-600 line-through'
                            }
                          >
                            {p.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Administrator Activity & Audit Trail */}
        <div className="rounded-2xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm">
          <div className="pb-4 mb-4 border-b border-ivory-300 dark:border-obsidian-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <History className="h-5 w-5 text-gold-600 dark:text-gold-400" />
                <span>Security Forensics & Activity Log</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Chronological security events and role modifications for this administrator
              </p>
            </div>
            <span className="font-mono text-xs text-slate-500">
              {auditLogs.length} Records Captured
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-ivory-300 dark:border-obsidian-800 text-slate-500 dark:text-slate-400">
                  <th className="pb-3 font-bold uppercase tracking-wider">Event Type</th>
                  <th className="pb-3 font-bold uppercase tracking-wider">IP Address</th>
                  <th className="pb-3 font-bold uppercase tracking-wider">Metadata</th>
                  <th className="pb-3 font-bold uppercase tracking-wider text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-300 dark:divide-obsidian-800 text-slate-700 dark:text-slate-300">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400">
                      No security audit events recorded for this user yet.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-ivory-100 dark:hover:bg-obsidian-850/50 transition"
                    >
                      <td className="py-3">
                        <span className="inline-flex items-center rounded-md bg-gold-500/10 px-2 py-0.5 font-mono text-[11px] font-bold text-gold-800 dark:text-gold-300 border border-gold-500/20">
                          {log.eventType}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-slate-500">{log.ipAddress || '—'}</td>
                      <td className="py-3 font-mono text-[10px] text-slate-500 truncate max-w-xs">
                        {log.metadata ? JSON.stringify(log.metadata) : '—'}
                      </td>
                      <td className="py-3 text-right text-slate-500 font-mono">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit User Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-900 p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Edit Administrator Profile
              </h3>
              <form onSubmit={handleUpdate} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
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
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      className="w-full rounded border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">
                    Privileged Role Assignment
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm({ ...editForm, role: e.target.value as AdminRole })
                    }
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
                    Account Status
                  </label>
                  <select
                    value={editForm.isActive ? 'true' : 'false'}
                    onChange={(e) =>
                      setEditForm({ ...editForm, isActive: e.target.value === 'true' })
                    }
                    className="w-full rounded border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                  >
                    <option value="true">Active & Authorized</option>
                    <option value="false">Suspended / Deactivated</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="rounded border border-ivory-400 dark:border-obsidian-750 bg-ivory-100 dark:bg-obsidian-850 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded border border-gold-500/60 bg-gradient-to-r from-gold-600 to-gold-500 px-4 py-2 font-bold text-obsidian-950 hover:from-gold-500 hover:to-gold-400"
                  >
                    Save Changes
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
