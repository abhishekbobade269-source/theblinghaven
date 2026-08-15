'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/AdminLayout';
import { apiRequest } from '@/lib/api';
import { BespokeRequestDto, BespokeStatus } from '@theblinghaven/shared';
import {
  Sparkles,
  Crown,
  Search,
  RefreshCw,
  Eye,
  Gem,
  CheckCircle2,
  Clock,
  DollarSign,
  Palette,
  Shield,
  Layers,
  Trash2,
} from 'lucide-react';

const STATUS_FILTERS: { key: string; label: string }[] = [
  { key: 'ALL', label: 'All Commissions' },
  { key: 'SUBMITTED', label: 'New Requests' },
  { key: 'CAD_DESIGN_IN_PROGRESS', label: 'CAD 3D Modeling' },
  { key: 'CASTING_AND_SETTING', label: 'Atelier Goldsmith Bench' },
  { key: 'HALLMARK_AND_CERTIFICATION', label: 'Hallmarking & GIA' },
  { key: 'COMPLETED_DISPATCHED', label: 'Completed' },
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
    if (!confirm(`Are you sure you want to permanently delete Bespoke Commission ${refNum}?`)) return;
    try {
      await apiRequest(`/admin/bespoke/${id}`, { method: 'DELETE' });
      fetchProjects();
    } catch (e: any) {
      alert(e.message || 'Failed to delete bespoke project.');
    }
  };

  const filtered = projects.filter(
    (p) =>
      p.referenceNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  const totalQuotedValue = projects.reduce((acc, p) => acc + (p.quotedAmountUsd || 0), 0);
  const activeCommissions = projects.filter(
    (p) => p.status !== 'COMPLETED_DISPATCHED' && p.status !== 'DECLINED',
  ).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-ivory-400 dark:border-obsidian-750 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
              <Gem className="h-4 w-4" />
              <span>Haute Joaillerie Atelier Pipeline & CAD Studio</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
              Bespoke Jewelry Commissions
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Master custom creations, 3D CAD modeling, gemstone sourcing, and goldsmith bench allocations.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchProjects}
              className="rounded-lg border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-850 p-2.5 text-slate-600 dark:text-slate-300 hover:bg-ivory-100 dark:hover:bg-obsidian-800"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Quoted Atelier Pipeline
            </span>
            <p className="mt-2 text-2xl font-bold text-gold-700 dark:text-gold-400 font-serif">
              ${totalQuotedValue.toLocaleString()} USD
            </p>
            <p className="mt-1 text-xs text-slate-400">Aggregated bespoke creation volume</p>
          </div>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Atelier Bench Projects
            </span>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif">
              {activeCommissions} High Commissions
            </p>
            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              Assigned to Master Goldsmiths
            </p>
          </div>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Client Design Briefs
            </span>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif">
              {projects.length} Commissions
            </p>
            <p className="mt-1 text-xs text-slate-400">Rings, chokers, & bridal parures</p>
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
              placeholder="Search reference #, client name, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 py-2 pl-9 pr-4 text-xs text-slate-800 dark:text-slate-200 focus:border-gold-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Bespoke Table */}
        <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[1000px]">
            <thead>
              <tr className="border-b border-ivory-300 dark:border-obsidian-800 text-slate-500 dark:text-slate-400">
                <th className="pb-3 font-bold uppercase tracking-wider">Reference & Visual</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Client Profile</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Category & Metal</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Gemstone Specifications</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Quoted Amount</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Assigned Goldsmith</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Status Stage</th>
                <th className="pb-3 font-bold uppercase tracking-wider text-right">Studio File</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-300 dark:divide-obsidian-800 text-slate-700 dark:text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
                      <span>Loading bespoke atelier commissions...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No bespoke projects found matching the filter.
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
                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-ivory-300 dark:border-obsidian-750 bg-obsidian-950">
                          {p.inspirationPhotoUrl || p.cadRenderUrl ? (
                            <img
                              src={p.cadRenderUrl || p.inspirationPhotoUrl}
                              alt={p.referenceNumber}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-gold-500">
                              <Gem className="h-5 w-5" />
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
                      <p className="font-serif font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {p.clientName}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">{p.clientCountry}</p>
                      {p.vipTier && (
                        <span className="inline-flex items-center space-x-1 rounded-full bg-gold-500/20 px-2 py-0.5 text-[9px] font-bold text-gold-800 dark:text-gold-300 mt-0.5">
                          <Crown className="h-2.5 w-2.5" />
                          <span>{p.vipTier.replace('_', ' ')}</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5">
                      <p className="font-bold text-slate-900 dark:text-slate-100">{p.category}</p>
                      <p className="text-[10px] text-slate-500">{p.metalPreference}</p>
                    </td>

                    <td className="py-3.5 max-w-xs">
                      <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                        {p.gemstonePreference || 'Custom Selection'}
                      </p>
                      <p className="text-[10px] text-gold-700 dark:text-gold-400 font-mono">
                        {p.estimatedCaratWeight ? `${p.estimatedCaratWeight} ct` : ''}{' '}
                        {p.diamondShape ? `• ${p.diamondShape}` : ''}
                      </p>
                    </td>

                    <td className="py-3.5">
                      {p.quotedAmountUsd ? (
                        <div>
                          <p className="font-serif font-bold text-gold-700 dark:text-gold-400 text-sm">
                            ${p.quotedAmountUsd.toLocaleString()} USD
                          </p>
                          <p className="text-[9px] text-slate-400 font-mono">Formal Atelier Quote</p>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">{p.budgetRangeUsd}</span>
                      )}
                    </td>

                    <td className="py-3.5 text-[11px] text-slate-600 dark:text-slate-400">
                      {p.assignedGoldsmith || 'Pending Bench Allocation'}
                    </td>

                    <td className="py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          p.status === 'CASTING_AND_SETTING'
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
                        <span>Manage & CAD</span>
                      </Link>

                      <button
                        onClick={() => handleDeleteProject(p.id, p.referenceNumber)}
                        className="inline-flex items-center rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 p-1.5 text-rose-500 transition"
                        title="Delete Commission"
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
