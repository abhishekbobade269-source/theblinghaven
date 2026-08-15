'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/AdminLayout';
import { apiRequest } from '@/lib/api';
import {
  AdminRole,
  Permission,
  RoleMatrixItemDto,
  PERMISSION_GROUPS,
  ROLE_METADATA,
  ROLE_PERMISSIONS,
} from '@theblinghaven/shared';
import {
  Shield,
  CheckCircle2,
  XCircle,
  Search,
  Users,
  UserPlus,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Filter,
  Check,
  RotateCcw,
  Lock,
} from 'lucide-react';

export default function RolesMatrixPage() {
  const [roles, setRoles] = useState<RoleMatrixItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [highlightRole, setHighlightRole] = useState<AdminRole | null>(null);
  const [savingRole, setSavingRole] = useState<AdminRole | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const fetchMatrix = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest<any>('/admin/users/roles-matrix');
      setRoles(Array.isArray(res) ? res : res?.data || []);
    } catch (e) {
      console.error('Failed to load roles matrix:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatrix();
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleTogglePermission = async (role: AdminRole, permKey: Permission) => {
    if (role === AdminRole.SUPER_ADMIN) {
      alert('Super Administrator inherently maintains all permissions for system security.');
      return;
    }

    const currentRole = roles.find((r) => r.role === role);
    if (!currentRole) return;

    const hasPerm = currentRole.permissions.includes(permKey);
    const updatedPermissions = hasPerm
      ? currentRole.permissions.filter((p) => p !== permKey)
      : [...currentRole.permissions, permKey];

    // Optimistic UI update
    setRoles((prev) =>
      prev.map((r) => (r.role === role ? { ...r, permissions: updatedPermissions } : r)),
    );

    setSavingRole(role);
    try {
      await apiRequest(`/admin/users/roles-matrix/${role}`, {
        method: 'PUT',
        data: { permissions: updatedPermissions },
      });
      showToast(`Updated permissions for ${ROLE_METADATA[role]?.label || role}`);
    } catch (e: any) {
      alert(e.message || 'Failed to update role permissions.');
      fetchMatrix(); // Revert on failure
    } finally {
      setSavingRole(null);
    }
  };

  const handleResetDefaults = async (role: AdminRole) => {
    if (role === AdminRole.SUPER_ADMIN) return;
    const defaultPerms = ROLE_PERMISSIONS[role] || [];
    if (!confirm(`Reset permissions for ${ROLE_METADATA[role]?.label || role} to system defaults?`)) {
      return;
    }

    setSavingRole(role);
    try {
      await apiRequest(`/admin/users/roles-matrix/${role}`, {
        method: 'PUT',
        data: { permissions: defaultPerms },
      });
      showToast(`Reset ${ROLE_METADATA[role]?.label || role} to standard defaults`);
      fetchMatrix();
    } catch (e: any) {
      alert(e.message || 'Failed to reset role permissions.');
    } finally {
      setSavingRole(null);
    }
  };

  const totalAdmins = roles.reduce((acc, r) => acc + r.userCount, 0);

  // Filter permission groups
  const filteredGroups = PERMISSION_GROUPS.map((group) => {
    if (selectedGroup !== 'ALL' && group.name !== selectedGroup) {
      return null;
    }
    const permissions = group.permissions.filter((p) => {
      if (!searchFilter) return true;
      const q = searchFilter.toLowerCase();
      return (
        p.label.toLowerCase().includes(q) ||
        p.key.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    });
    return permissions.length > 0 ? { ...group, permissions } : null;
  }).filter(Boolean) as typeof PERMISSION_GROUPS;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Toast Notification */}
        {successToast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 rounded-xl border border-emerald-500/40 bg-white/95 dark:bg-obsidian-900/95 px-4 py-3 text-xs font-bold text-emerald-600 dark:text-emerald-400 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-ivory-400 dark:border-obsidian-750 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
              <Shield className="h-4 w-4" />
              <span>Interactive RBAC Matrix & Governance</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
              Role Permissions Matrix
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Click any checkbox in the matrix to dynamically grant or revoke permissions for any privileged role.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/users"
              className="flex items-center space-x-2 rounded-lg border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-850 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-ivory-100 dark:hover:bg-obsidian-800 transition"
            >
              <Users className="h-4 w-4" />
              <span>Admin Directory ({totalAdmins})</span>
            </Link>
            <button
              onClick={fetchMatrix}
              className="rounded-lg border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-850 p-2.5 text-slate-600 dark:text-slate-300 hover:bg-ivory-100 dark:hover:bg-obsidian-800"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 10 Role Identity Cards Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Privileged Roles ({roles.length})
            </h2>
            <span className="text-xs text-slate-500">
              Click a role card to highlight column or reset defaults
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {roles.map((r) => {
              const isHighlighted = highlightRole === r.role;
              const isSaving = savingRole === r.role;

              return (
                <div
                  key={r.role}
                  className={`relative rounded-xl border p-4 transition-all ${
                    isHighlighted
                      ? 'border-gold-500 bg-gold-500/10 dark:bg-gold-500/10 shadow-md ring-1 ring-gold-500'
                      : 'border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 hover:border-gold-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: r.color }}
                    />
                    <span className="rounded bg-ivory-100 dark:bg-obsidian-800 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      {r.userCount} {r.userCount === 1 ? 'User' : 'Users'}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {r.label}
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {r.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-ivory-300 dark:border-obsidian-800 pt-2 text-[10px]">
                    <span className="font-bold text-gold-700 dark:text-gold-400">
                      {isSaving ? 'Saving...' : `${r.permissions.length} Perms`}
                    </span>

                    <div className="flex items-center space-x-1">
                      {r.role !== AdminRole.SUPER_ADMIN && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResetDefaults(r.role);
                          }}
                          className="text-slate-400 hover:text-amber-500 transition p-1"
                          title="Reset to default permissions"
                        >
                          <RotateCcw className="h-3 w-3" />
                        </button>
                      )}
                      <button
                        onClick={() => setHighlightRole(isHighlighted ? null : r.role)}
                        className="font-mono text-[9px] font-bold uppercase text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                      >
                        {isHighlighted ? 'Clear' : 'Filter'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters & Domain Selector */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search permissions by keyword or capability..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full rounded-lg border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 py-2 pl-9 pr-4 text-xs text-slate-800 dark:text-slate-200 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="rounded-lg border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:border-gold-500 focus:outline-none"
          >
            <option value="ALL">All Permission Domains (7)</option>
            {PERMISSION_GROUPS.map((g) => (
              <option key={g.name} value={g.name}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* Interactive Matrix Table */}
        <div className="space-y-6">
          {filteredGroups.map((group, groupIdx) => (
            <div
              key={groupIdx}
              className="rounded-2xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm overflow-x-auto"
            >
              <div className="pb-3 mb-4 border-b border-ivory-300 dark:border-obsidian-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-gold-500" />
                  <span>{group.name}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {group.description}
                </p>
              </div>

              <table className="w-full text-left text-xs min-w-[950px]">
                <thead>
                  <tr className="border-b border-ivory-300 dark:border-obsidian-800 text-slate-500 dark:text-slate-400 text-[11px]">
                    <th className="pb-3 font-bold uppercase tracking-wider w-80">
                      Permission & Scope
                    </th>
                    {roles.map((r) => {
                      const isHighlighted = highlightRole === r.role;
                      return (
                        <th
                          key={r.role}
                          className={`pb-3 font-bold uppercase tracking-wider text-center px-2 transition ${
                            isHighlighted
                              ? 'text-gold-700 dark:text-gold-300 bg-gold-500/10 rounded-t'
                              : ''
                          }`}
                        >
                          <span className="truncate block max-w-[90px]" title={r.label}>
                            {r.role.replace('_', ' ')}
                          </span>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-300 dark:divide-obsidian-800 text-slate-700 dark:text-slate-300">
                  {group.permissions.map((perm) => (
                    <tr
                      key={perm.key}
                      className="hover:bg-ivory-100 dark:hover:bg-obsidian-850/50 transition"
                    >
                      <td className="py-3 pr-4">
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {perm.label}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono">{perm.key}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{perm.description}</p>
                      </td>
                      {roles.map((r) => {
                        const hasPerm = r.permissions.includes(perm.key);
                        const isHighlighted = highlightRole === r.role;
                        const isSuperAdmin = r.role === AdminRole.SUPER_ADMIN;

                        return (
                          <td
                            key={r.role}
                            className={`py-3 text-center px-2 ${
                              isHighlighted ? 'bg-gold-500/5' : ''
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => handleTogglePermission(r.role, perm.key)}
                              disabled={isSuperAdmin}
                              title={
                                isSuperAdmin
                                  ? 'Super Administrator has full permanent root permissions'
                                  : `Click to ${hasPerm ? 'revoke' : 'grant'} for ${r.label}`
                              }
                              className={`inline-flex items-center justify-center h-7 w-7 rounded-lg transition ${
                                isSuperAdmin
                                  ? 'bg-gold-500/20 text-gold-700 dark:text-gold-300 cursor-not-allowed opacity-80'
                                  : hasPerm
                                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-red-500/20 hover:text-red-500 border border-emerald-500/30'
                                  : 'bg-ivory-200 dark:bg-obsidian-800 text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-500 border border-transparent'
                              }`}
                            >
                              {isSuperAdmin ? (
                                <Lock className="h-3.5 w-3.5" />
                              ) : hasPerm ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <span className="h-1.5 w-1.5 bg-slate-400 dark:bg-slate-600 rounded-full" />
                              )}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
