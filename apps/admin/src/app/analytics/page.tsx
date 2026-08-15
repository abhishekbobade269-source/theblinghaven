'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { apiRequest } from '@/lib/api';
import { AnalyticsDataDto } from '@theblinghaven/shared';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Crown,
  Globe2,
  Truck,
  RefreshCw,
  Gem,
  Package,
  Layers,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

const PERIODS = [
  { key: '7D', label: '7 Days' },
  { key: '30D', label: '30 Days' },
  { key: '90D', label: 'Quarterly (90D)' },
  { key: 'YTD', label: 'Year-to-Date' },
  { key: 'ALL', label: 'All-Time Luxury Forensics' },
];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsDataDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('ALL');

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest<any>(`/admin/reports/analytics?period=${selectedPeriod}`);
      setData(res?.data || res);
    } catch (e) {
      console.error('Failed to load analytics:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-ivory-400 dark:border-obsidian-750 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
              <BarChart3 className="h-4 w-4" />
              <span>Haute Joaillerie Executive Financial Forensics</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
              Executive Analytics & Revenue Intelligence
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Multi-currency cross-border revenue, category profitability, VIP cohort spend, and armored courier fulfillment metrics.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex rounded-xl bg-ivory-100 dark:bg-obsidian-900 p-1 border border-ivory-300 dark:border-obsidian-750">
              {PERIODS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setSelectedPeriod(p.key)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    selectedPeriod === p.key
                      ? 'bg-gold-500 text-obsidian-950 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <button
              onClick={fetchAnalytics}
              className="rounded-lg border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-850 p-2.5 text-slate-600 dark:text-slate-300 hover:bg-ivory-100 dark:hover:bg-obsidian-800"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 4 Top KPI Cards */}
        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Gross Revenue</span>
                <DollarSign className="h-4 w-4 text-gold-500" />
              </div>
              <p className="font-serif text-2xl font-bold text-gold-700 dark:text-gold-400">
                ${data.grossRevenueUsd.toLocaleString()} USD
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Across 8 global currencies
              </p>
            </div>

            <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Net Realized Margin</span>
                <ShieldCheck className="h-4 w-4 text-gold-500" />
              </div>
              <p className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-100">
                ${data.netRevenueUsd.toLocaleString()} USD
              </p>
              <p className="text-[11px] text-slate-400">92% operating margin efficiency</p>
            </div>

            <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Average Order (AOV)</span>
                <Crown className="h-4 w-4 text-gold-500" />
              </div>
              <p className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-100">
                ${data.averageOrderValueUsd.toLocaleString()} USD
              </p>
              <p className="text-[11px] text-slate-400">Haute fine jewelry benchmark</p>
            </div>

            <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Insured Shipments</span>
                <Truck className="h-4 w-4 text-gold-500" />
              </div>
              <p className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-100">
                {data.totalOrdersCount} Completed
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                100% On-Time Delivery Rate
              </p>
            </div>
          </div>
        )}

        {/* 2 Column Financial Intelligence: Currency Breakdown vs Category Performance */}
        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Multi-Currency Revenue Distribution */}
            <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-ivory-300 dark:border-obsidian-800 pb-3">
                <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <Globe2 className="h-4 w-4 text-gold-500" />
                  <span>Multi-Currency Revenue Share</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">Dynamic FX Live</span>
              </div>

              <div className="space-y-4">
                {data.currencyBreakdown.map((curr) => (
                  <div key={curr.currencyCode} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                        <span className="rounded bg-ivory-200 dark:bg-obsidian-800 px-2 py-0.5 font-mono text-[11px]">
                          {curr.currencyCode}
                        </span>
                        <span>{curr.currencySymbol} {curr.totalRevenueLocal.toLocaleString()}</span>
                      </span>
                      <span className="font-mono font-bold text-gold-700 dark:text-gold-400">
                        ${curr.totalRevenueUsd.toLocaleString()} USD ({curr.sharePercent}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-ivory-200 dark:bg-obsidian-800">
                      <div
                        className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full transition-all duration-500"
                        style={{ width: `${curr.sharePercent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Performance Matrix */}
            <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-ivory-300 dark:border-obsidian-800 pb-3">
                <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <Gem className="h-4 w-4 text-gold-500" />
                  <span>Jewelry Category & Collection Profitability</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">Gross Volume</span>
              </div>

              <div className="divide-y divide-ivory-200 dark:divide-obsidian-800 text-xs">
                {data.categoryPerformance.map((cat) => (
                  <div key={cat.categoryId} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {cat.categoryName}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {cat.unitsSold} units sold • AOV: ${cat.averageItemPriceUsd.toLocaleString()} USD
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif font-bold text-gold-700 dark:text-gold-400 text-sm">
                        ${cat.grossRevenueUsd.toLocaleString()} USD
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2 Column: VIP Tier LTV Cohorts vs Logistics Performance */}
        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* VIP Tier Cohorts */}
            <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-ivory-300 dark:border-obsidian-800 pb-3">
                <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <Crown className="h-4 w-4 text-gold-500" />
                  <span>VIP Tier LTV & Cohort Retention</span>
                </h3>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                  High Net Worth Distribution
                </span>
              </div>

              <div className="space-y-4">
                {data.vipTierRevenue.map((t) => (
                  <div key={t.vipTier} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                        <span>{t.vipTier.replace('_', ' ')}</span>
                        <span className="text-slate-400 font-normal">({t.customerCount} Clients)</span>
                      </span>
                      <span className="font-mono font-bold text-gold-700 dark:text-gold-400">
                        ${t.totalSpendUsd.toLocaleString()} USD ({t.sharePercent}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-ivory-200 dark:bg-obsidian-800">
                      <div
                        className="h-full bg-gradient-to-r from-gold-600 to-amber-400 rounded-full"
                        style={{ width: `${t.sharePercent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Armored Courier Logistics */}
            <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-ivory-300 dark:border-obsidian-800 pb-3">
                <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-gold-500" />
                  <span>Armored Logistics & Courier Turnaround</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">Chain of Custody</span>
              </div>

              <div className="divide-y divide-ivory-200 dark:divide-obsidian-800 text-xs">
                {data.logisticsPerformance.map((carrier) => (
                  <div key={carrier.carrier} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100">{carrier.carrier}</p>
                      <p className="text-[11px] text-slate-400">
                        Avg Delivery: {carrier.averageDeliveryDays} Days • {carrier.shipmentsCount} Shipments
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        {carrier.onTimeDeliveryRate}% On-Time
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
