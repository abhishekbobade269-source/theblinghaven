'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/AdminLayout';
import { apiRequest } from '@/lib/api';
import { CustomerDto, CustomerVipTier } from '@theblinghaven/shared';
import {
  Users,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Crown,
  Sparkles,
  MapPin,
  Mail,
  Phone,
  DollarSign,
  Gem,
  Calendar,
} from 'lucide-react';

const VIP_TIERS: { key: string; label: string }[] = [
  { key: 'ALL', label: 'All Clients' },
  { key: 'ROYAL_CONCIERGE', label: 'Royal Concierge (HNW)' },
  { key: 'GOLD_PATRON', label: 'Gold Patrons' },
  { key: 'SILVER', label: 'Silver Collector' },
  { key: 'STANDARD', label: 'Standard VIP' },
];

export default function CustomerDirectoryPage() {
  const [customers, setCustomers] = useState<CustomerDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [vipTierFilter, setVipTierFilter] = useState('ALL');
  const [meta, setMeta] = useState({ total: 0, royalConciergeCount: 0 });

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const q = new URLSearchParams();
      if (search) q.set('search', search);
      if (vipTierFilter !== 'ALL') q.set('vipTier', vipTierFilter);

      const res = await apiRequest<any>(`/admin/customers?${q.toString()}`);
      if (res && res.data) {
        setCustomers(res.data);
        if (res.meta) setMeta(res.meta);
      } else if (Array.isArray(res)) {
        setCustomers(res);
      }
    } catch (e) {
      console.error('Failed to load customers:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [vipTierFilter]);

  const totalVaultLtv = customers.reduce((acc, c) => acc + c.totalSpendUsd, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-ivory-400 dark:border-obsidian-750 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
              <Crown className="h-4 w-4" />
              <span>VIP Clienteling & Private Client Management</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
              Customer Directory & Collectors
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Private client files, ring/bangle size preferences, milestones, and high-jewelry lifetime value (LTV).
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchCustomers}
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
              Total Private Client LTV
            </span>
            <p className="mt-2 text-2xl font-bold text-gold-700 dark:text-gold-400 font-serif">
              ${totalVaultLtv.toLocaleString()} USD
            </p>
            <p className="mt-1 text-xs text-slate-400">Aggregated high-jewelry spend</p>
          </div>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Royal Concierge VIPs
            </span>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif">
              {meta.royalConciergeCount} HNW Patrons
            </p>
            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              Assigned dedicated private advisors
            </p>
          </div>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Registered Collectors
            </span>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif">
              {meta.total} Fine Clients
            </p>
            <p className="mt-1 text-xs text-slate-400">Across US, UK, UAE & India</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {VIP_TIERS.map((t) => (
              <button
                key={t.key}
                onClick={() => setVipTierFilter(t.key)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                  vipTierFilter === t.key
                    ? 'bg-gold-500 text-obsidian-950 shadow-md'
                    : 'bg-white dark:bg-obsidian-900 text-slate-700 dark:text-slate-300 border border-ivory-300 dark:border-obsidian-750'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by client name, email, or country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchCustomers()}
              className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 py-2 pl-9 pr-4 text-xs text-slate-800 dark:text-slate-200 focus:border-gold-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Customers Table */}
        <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[950px]">
            <thead>
              <tr className="border-b border-ivory-300 dark:border-obsidian-800 text-slate-500 dark:text-slate-400">
                <th className="pb-3 font-bold uppercase tracking-wider">Private Client</th>
                <th className="pb-3 font-bold uppercase tracking-wider">VIP Tier</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Residence & Contact</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Lifetime Value (LTV)</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Orders</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Assigned Advisor</th>
                <th className="pb-3 font-bold uppercase tracking-wider text-right">Client File</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-300 dark:divide-obsidian-800 text-slate-700 dark:text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
                      <span>Loading private client directory...</span>
                    </div>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No private clients found matching the filter.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-ivory-100 dark:hover:bg-obsidian-850/50 transition"
                  >
                    <td className="py-3.5">
                      <Link href={`/customers/${c.id}`} className="group block">
                        <p className="font-serif font-bold text-slate-900 dark:text-slate-100 group-hover:text-gold-600 dark:group-hover:text-gold-400 text-sm">
                          {c.fullName}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">{c.email}</p>
                      </Link>
                    </td>

                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          c.vipTier === 'ROYAL_CONCIERGE'
                            ? 'bg-gold-500/20 text-gold-800 dark:text-gold-300 border border-gold-500/40'
                            : c.vipTier === 'GOLD_PATRON'
                            ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300'
                            : 'bg-slate-200 dark:bg-obsidian-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {c.vipTier === 'ROYAL_CONCIERGE' && <Crown className="h-3 w-3" />}
                        <span>{c.vipTier.replace('_', ' ')}</span>
                      </span>
                    </td>

                    <td className="py-3.5">
                      <p className="text-slate-800 dark:text-slate-200 font-medium">
                        {c.city ? `${c.city}, ` : ''}{c.country}
                      </p>
                      {c.phone && <p className="text-[10px] text-slate-400 font-mono">{c.phone}</p>}
                    </td>

                    <td className="py-3.5">
                      <p className="font-serif font-bold text-slate-900 dark:text-slate-100 text-sm">
                        ${c.totalSpendUsd.toLocaleString()} USD
                      </p>
                      <p className="text-[10px] text-slate-400">
                        AOV: ${c.averageOrderValueUsd.toLocaleString()}
                      </p>
                    </td>

                    <td className="py-3.5 font-mono font-bold">{c.totalOrdersCount} Orders</td>

                    <td className="py-3.5 text-[11px] text-slate-600 dark:text-slate-400">
                      {c.assignedAdvisor || 'Atelier Concierge Desk'}
                    </td>

                    <td className="py-3.5 text-right">
                      <Link
                        href={`/customers/${c.id}`}
                        className="inline-flex items-center space-x-1 rounded-xl border border-ivory-300 dark:border-obsidian-750 bg-ivory-100 dark:bg-obsidian-800 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-gold-600 dark:hover:text-gold-400 transition"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Inspect File</span>
                      </Link>
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
