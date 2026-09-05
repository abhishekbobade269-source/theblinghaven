'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/AdminLayout';
import { apiRequest } from '@/lib/api';
import { BespokeRequestDto } from '@theblinghaven/shared';
import {
  Sparkles,
  Search,
  RefreshCw,
  Eye,
  CheckCircle2,
  Clock,
  Palette,
  Trash2,
  FileText,
  Phone,
  Mail,
} from 'lucide-react';

const STATUS_FILTERS: { key: string; label: string }[] = [
  { key: 'ALL', label: 'All Inquiries' },
  { key: 'SUBMITTED', label: 'New Requests' },
  { key: 'CAD_DESIGN_IN_PROGRESS', label: 'Design Review' },
  { key: 'CASTING_AND_SETTING', label: 'In Crafting' },
  { key: 'COMPLETED_DISPATCHED', label: 'Dispatched / Contacted' },
];

export default function BespokePipelinePage() {
  const [projects, setProjects] = useState<BespokeRequestDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const q = new URLSearchParams();
      if (statusFilter !== 'ALL') q.set('status', statusFilter);
      const res = await apiRequest<any>(`/admin/bespoke?${q.toString()}`);
      setProjects(Array.isArray(res) ? res : res?.data || []);
    } catch (e) {
      console.error('Failed to load bespoke projects:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [statusFilter]);

  const handleDeleteProject = async (id: string, refNum: string) => {
    if (!confirm(`Are you sure you want to permanently delete Custom Request ${refNum}?`)) return;
    try {
      await apiRequest(`/admin/bespoke/${id}`, { method: 'DELETE' });
      fetchProjects();
    } catch (e: any) {
      alert(e.message || 'Failed to delete custom request.');
    }
  };

  const filtered = projects.filter(
    (p) =>
      p.referenceNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  const activeRequests = projects.filter(
    (p) => p.status !== 'COMPLETED_DISPATCHED' && p.status !== 'DECLINED',
  ).length;

  const newSubmissions = projects.filter((p) => p.status === 'SUBMITTED').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-ivory-400 dark:border-obsidian-750 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
              <Sparkles className="h-4 w-4" />
              <span>Custom Jewellery & Bridal Requests</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
              Custom Jewellery Requests
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Manage client custom inquiries for artificial rings, bangles, bridal sets, Kundan chokers, and custom designs.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchProjects}
              className="rounded-lg border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-850 p-2.5 text-slate-600 dark:text-slate-300 hover:bg-ivory-100 dark:hover:bg-obsidian-800"
              title="Refresh List"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              New Unreviewed Requests
            </span>
            <p className="mt-2 text-2xl font-bold text-gold-700 dark:text-gold-400 font-serif">
              {newSubmissions} Inquiries
            </p>
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400 font-medium">Awaiting team outreach</p>
          </div>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Inquiries
            </span>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif">
              {activeRequests} In Progress
            </p>
            <p className="mt-1 text-xs text-slate-400">Design review & crafting</p>
          </div>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Requests Received
            </span>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif">
              {projects.length} Total
            </p>
            <p className="mt-1 text-xs text-slate-400">Rings, bangles, necklaces & sets</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s.key}
                onClick={() => setStatusFilter(s.key)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                  statusFilter === s.key
                    ? 'bg-gold-500 text-obsidian-950 shadow-md'
                    : 'bg-white dark:bg-obsidian-900 text-slate-700 dark:text-slate-300 border border-ivory-300 dark:border-obsidian-750'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search ref #, client name, or item type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 py-2 pl-9 pr-4 text-xs text-slate-800 dark:text-slate-200 focus:border-gold-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Requests Table */}
        <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[900px]">
            <thead>
              <tr className="border-b border-ivory-300 dark:border-obsidian-800 text-slate-500 dark:text-slate-400">
                <th className="pb-3 font-bold uppercase tracking-wider">Ref # & Date</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Client Info</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Item Type</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Design Details / Notes</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Target Budget</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Status</th>
                <th className="pb-3 font-bold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-300 dark:divide-obsidian-800 text-slate-700 dark:text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
                      <span>Loading custom jewellery requests...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No custom requests found matching the current filter.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-ivory-100 dark:hover:bg-obsidian-850/50 transition"
                  >
                    <td className="py-3.5">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl border border-ivory-300 dark:border-obsidian-750 bg-obsidian-950">
                          {p.inspirationPhotoUrl ? (
                            <img
                              src={p.inspirationPhotoUrl}
                              alt={p.referenceNumber}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-gold-500">
                              <FileText className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-mono text-xs font-bold text-gold-700 dark:text-gold-400 block">
                            {p.referenceNumber}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(p.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5">
                      <p className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                        {p.clientName}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {p.clientCountry || 'Canada'}
                      </p>
                    </td>

                    <td className="py-3.5">
                      <span className="font-bold text-slate-900 dark:text-slate-100 block">
                        {p.category}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {p.metalPreference || 'Gold Plated / Brass'}
                      </span>
                    </td>

                    <td className="py-3.5 max-w-xs">
                      <p className="font-medium text-slate-800 dark:text-slate-200 line-clamp-2">
                        {p.gemstonePreference || 'Custom artificial piece'}
                      </p>
                    </td>

                    <td className="py-3.5">
                      <span className="text-xs font-mono font-bold text-gold-700 dark:text-gold-400">
                        {p.budgetRangeUsd || 'Flexible'}
                      </span>
                    </td>

                    <td className="py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          p.status === 'SUBMITTED'
                            ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300'
                            : p.status === 'CAD_DESIGN_IN_PROGRESS'
                            ? 'bg-blue-500/20 text-blue-800 dark:text-blue-300'
                            : p.status === 'COMPLETED_DISPATCHED'
                            ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                            : 'bg-slate-200 dark:bg-obsidian-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {p.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 text-right space-x-2">
                      <Link
                        href={`/bespoke/${p.id}`}
                        className="inline-flex items-center space-x-1 rounded-xl border border-ivory-300 dark:border-obsidian-750 bg-ivory-100 dark:bg-obsidian-800 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-gold-600 dark:hover:text-gold-400 transition"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View</span>
                      </Link>

                      <button
                        onClick={() => handleDeleteProject(p.id, p.referenceNumber)}
                        className="inline-flex items-center rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 p-1.5 text-rose-500 transition"
                        title="Delete Request"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
