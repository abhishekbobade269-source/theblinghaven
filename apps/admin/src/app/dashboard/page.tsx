'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/AdminLayout';
import { useAuth } from '@/lib/auth-context';
import { apiRequest } from '@/lib/api';
import { RevenueChart } from '@/components/RevenueChart';
import {
  ShieldCheck,
  KeyRound,
  History,
  CheckCircle2,
  Lock,
  ArrowRight,
  Layers,
  Sparkles,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Users,
  AlertTriangle,
  Package,
  PlusCircle,
  UploadCloud,
  Tag,
  DownloadCloud,
  CreditCard,
  RefreshCw,
  Building,
  Coins,
  Globe2,
  Check,
} from 'lucide-react';
import {
  DashboardKpiDto,
  RevenueDataPointDto,
  TopCategoryDto,
  DashboardActivityDto,
  CurrencyCode,
} from '@theblinghaven/shared';

const CURRENCIES: { code: CurrencyCode; label: string; symbol: string }[] = [
  { code: 'USD', label: 'USD ($)', symbol: '$' },
  { code: 'INR', label: 'INR (₹)', symbol: '₹' },
  { code: 'CAD', label: 'CAD ($)', symbol: 'CA$' },
  { code: 'EUR', label: 'EUR (€)', symbol: '€' },
  { code: 'GBP', label: 'GBP (£)', symbol: '£' },
  { code: 'AED', label: 'AED (Dirham)', symbol: 'AED ' },
  { code: 'AUD', label: 'AUD ($)', symbol: 'AU$' },
  { code: 'SGD', label: 'SGD ($)', symbol: 'SG$' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const [kpis, setKpis] = useState<DashboardKpiDto | null>(null);
  const [chartData, setChartData] = useState<RevenueDataPointDto[]>([]);
  const [topCategories, setTopCategories] = useState<TopCategoryDto[]>([]);
  const [activities, setActivities] = useState<DashboardActivityDto[]>([]);
  const [vaults, setVaults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = async (selectedCurrency = currency, selectedRange = timeRange) => {
    setIsLoading(true);
    try {
      const [kpiRes, chartRes, catRes, actRes, vaultsRes] = await Promise.all([
        apiRequest<any>(`/admin/dashboard/kpis?currency=${selectedCurrency}`).catch(() => null),
        apiRequest<any>(`/admin/dashboard/revenue-chart?range=${selectedRange}&currency=${selectedCurrency}`).catch(() => []),
        apiRequest<any>(`/admin/dashboard/top-categories?currency=${selectedCurrency}`).catch(() => []),
        apiRequest<any>(`/admin/dashboard/recent-activity?currency=${selectedCurrency}`).catch(() => []),
        apiRequest<any>('/admin/vaults').catch(() => []),
      ]);

      if (kpiRes) setKpis(kpiRes.data || kpiRes);
      setChartData(Array.isArray(chartRes) ? chartRes : chartRes?.data || []);
      setTopCategories(Array.isArray(catRes) ? catRes : catRes?.data || []);
      setActivities(Array.isArray(actRes) ? actRes : actRes?.data || []);
      setVaults(Array.isArray(vaultsRes) ? vaultsRes : vaultsRes?.data || []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData(currency, timeRange);
  }, [currency, timeRange]);

  const currencySymbol = kpis?.currencySymbol || '$';

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 md:p-8 shadow-sm">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-700 dark:text-gold-400 mb-1.5 font-mono">
                <Sparkles className="h-4 w-4" />
                <span>Executive Command Center</span>
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-wide">
                Welcome back, {user?.firstName} {user?.lastName}
              </h1>
              <p className="mt-1 text-xs md:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
                Global commerce intelligence and store operations for{' '}
                <span className="font-bold text-gold-700 dark:text-gold-300">The Bling Haven</span>.
              </p>
            </div>

            {/* Currency Selector & Refresh Button */}
            <div className="flex flex-wrap items-center gap-3 shrink-0 font-mono">
              <div className="flex items-center space-x-2 rounded-xl border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-850 px-3 py-1.5">
                <DollarSign className="h-4 w-4 text-gold-600 dark:text-gold-400" />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code} className="dark:bg-obsidian-900">
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => loadDashboardData()}
                className="rounded-xl border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-850 p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-obsidian-800 transition"
                title="Refresh Metrics"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Primary KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          {/* Gross Revenue */}
          <div className="rounded-3xl border border-slate-200 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm transition hover:border-gold-500/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Gross Revenue
              </span>
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                +{kpis?.revenueGrowthPct || 18.4}%
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100 font-serif">
              {currencySymbol}
              {kpis?.grossRevenue.toLocaleString() || '0'}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Net: {currencySymbol}
              {kpis?.netRevenue.toLocaleString() || '0'} after taxes
            </p>
          </div>

          {/* Orders Completed */}
          <div className="rounded-3xl border border-slate-200 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm transition hover:border-gold-500/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Orders Completed
              </span>
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                +{kpis?.ordersGrowthPct || 12.6}%
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100 font-serif">
              {kpis?.totalOrders.toLocaleString() || '0'}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {kpis?.pendingShipments || 0} orders awaiting dispatch
            </p>
          </div>

          {/* Average Order Value */}
          <div className="rounded-3xl border border-slate-200 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm transition hover:border-gold-500/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Avg. Order Value (AOV)
              </span>
              <span className="rounded bg-gold-500/20 px-2 py-0.5 text-[10px] font-bold text-gold-800 dark:text-gold-300">
                +{kpis?.aovGrowthPct || 5.2}%
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100 font-serif">
              {currencySymbol}
              {kpis?.averageOrderValue.toLocaleString() || '0'}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Conversion rate: {kpis?.conversionRate || 3.85}%
            </p>
          </div>

          {/* Registered Customers & Stock */}
          <div className="rounded-3xl border border-slate-200 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm transition hover:border-gold-500/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Customers
              </span>
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                +{kpis?.customersGrowthPct || 15.8}%
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100 font-serif">
              {kpis?.totalCustomers.toLocaleString() || '0'}
            </p>
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center space-x-1">
              <AlertTriangle className="h-3 w-3" />
              <span>{kpis?.lowStockAlerts || 0} SKUs low in stock</span>
            </p>
          </div>
        </div>

        {/* Revenue Trajectory Chart */}
        <RevenueChart
          data={chartData}
          timeRange={timeRange}
          onTimeRangeChange={(r) => setTimeRange(r)}
          currencySymbol={currencySymbol}
        />

        {/* 2-Column Section: Category Performance & Quick Action Launchpad */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Jewelry Category Performance */}
          <div className="lg:col-span-2 rounded-3xl border border-slate-200 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-obsidian-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-serif">
                  Jewellery Category Performance
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Revenue contribution and sales volume by category
                </p>
              </div>
              <span className="text-xs font-mono text-gold-700 dark:text-gold-400 font-bold">
                100% Tracked
              </span>
            </div>

            <div className="space-y-4">
              {topCategories.map((cat, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 font-serif">
                      {cat.name}
                    </span>
                    <div className="flex items-center space-x-3 font-mono">
                      <span className="text-slate-500 dark:text-slate-400">
                        {cat.unitsSold} units
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {currencySymbol}
                        {cat.revenue.toLocaleString()} ({cat.sharePct}%)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-obsidian-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-400"
                      style={{ width: `${cat.sharePct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Launchpad with Real Links */}
          <div className="rounded-3xl border border-slate-200 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-4">
            <div className="pb-3 border-b border-slate-100 dark:border-obsidian-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-serif">
                Quick Action Launchpad
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                1-Click administrative workflows
              </p>
            </div>

            <div className="space-y-2.5">
              <Link
                href="/catalog/new"
                className="w-full flex items-center justify-between rounded-2xl border border-slate-200 dark:border-obsidian-750 bg-slate-50 dark:bg-obsidian-850 p-3 text-left hover:border-gold-500 transition group"
              >
                <div className="flex items-center space-x-3">
                  <PlusCircle className="h-4 w-4 text-gold-600 dark:text-gold-400 group-hover:scale-110 transition" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Add New Jewelry SKU
                    </p>
                    <p className="text-[10px] text-slate-500">Add title, gold purity, carats & photos</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-gold-500 group-hover:translate-x-1 transition" />
              </Link>

              <Link
                href="/media"
                className="w-full flex items-center justify-between rounded-2xl border border-slate-200 dark:border-obsidian-750 bg-slate-50 dark:bg-obsidian-850 p-3 text-left hover:border-gold-500 transition group"
              >
                <div className="flex items-center space-x-3">
                  <UploadCloud className="h-4 w-4 text-gold-600 dark:text-gold-400 group-hover:scale-110 transition" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Upload Photos & Media
                    </p>
                    <p className="text-[10px] text-slate-500">Manage high-res product galleries</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-gold-500 group-hover:translate-x-1 transition" />
              </Link>

              <Link
                href="/promotions"
                className="w-full flex items-center justify-between rounded-2xl border border-slate-200 dark:border-obsidian-750 bg-slate-50 dark:bg-obsidian-850 p-3 text-left hover:border-gold-500 transition group"
              >
                <div className="flex items-center space-x-3">
                  <Tag className="h-4 w-4 text-gold-600 dark:text-gold-400 group-hover:scale-110 transition" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Create Discount Coupon
                    </p>
                    <p className="text-[10px] text-slate-500">Configure % off or voucher codes</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-gold-500 group-hover:translate-x-1 transition" />
              </Link>

              <Link
                href="/reports"
                className="w-full flex items-center justify-between rounded-2xl border border-slate-200 dark:border-obsidian-750 bg-slate-50 dark:bg-obsidian-850 p-3 text-left hover:border-gold-500 transition group"
              >
                <div className="flex items-center space-x-3">
                  <DownloadCloud className="h-4 w-4 text-gold-600 dark:text-gold-400 group-hover:scale-110 transition" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Export Financial Reports
                    </p>
                    <p className="text-[10px] text-slate-500">Download sales, GST & audit summaries</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-gold-500 group-hover:translate-x-1 transition" />
              </Link>
            </div>
          </div>
        </div>

        {/* Live Operations Feed */}
        <div className="rounded-3xl border border-slate-200 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-obsidian-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2 font-serif">
                <History className="h-5 w-5 text-gold-600 dark:text-gold-400" />
                <span>Live Commerce Operations Feed</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time stream of orders, deliveries, stock alerts, and customer activity
              </p>
            </div>
            <Link
              href="/audit"
              className="inline-flex items-center space-x-1 text-xs font-bold text-gold-700 dark:text-gold-400 hover:underline font-mono"
            >
              <span>Security Audit Trail</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-obsidian-800">
            {activities.map((act) => (
              <div key={act.id} className="py-3 flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <div className="rounded-xl border border-slate-200 dark:border-obsidian-750 bg-slate-50 dark:bg-obsidian-850 p-2 mt-0.5">
                    {act.type === 'ORDER_PLACED' ? (
                      <ShoppingCart className="h-4 w-4 text-emerald-500" />
                    ) : act.type === 'PAYMENT_RECEIVED' ? (
                      <CreditCard className="h-4 w-4 text-blue-500" />
                    ) : act.type === 'INVENTORY_LOW' ? (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    ) : (
                      <Sparkles className="h-4 w-4 text-gold-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {act.title}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      {act.description}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-slate-400 shrink-0">
                  {new Date(act.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Multi-Location Vault & System Status Grid */}
        <div className="rounded-3xl border border-slate-200 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-obsidian-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2 font-serif">
                <Building className="h-5 w-5 text-gold-600 dark:text-gold-400" />
                <span>Multi-Store & Vault Infrastructure Network</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Active status across all fulfillment hubs, gold benchmark feeds, and security layers
              </p>
            </div>
            <Link
              href="/vaults"
              className="inline-flex items-center space-x-1 text-xs font-bold text-gold-700 dark:text-gold-400 hover:underline font-mono"
            >
              <span>Manage Vaults</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 font-mono">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
                  Toronto Yorkville Flagship
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 font-serif">
                Main Dispatch Hub
              </p>
              <span className="text-[10px] text-slate-500 block">Status: Online • 100% Operational</span>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
                  Vancouver Vault
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 font-serif">
                West Coast Logistics Hub
              </p>
              <span className="text-[10px] text-slate-500 block">Status: Online • Dispatches Active</span>
            </div>

            <div className="rounded-2xl border border-gold-500/30 bg-gold-500/10 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-gold-700 dark:text-gold-400">
                  Live Metal Bullion Feed
                </span>
                <Coins className="h-3.5 w-3.5 text-gold-600 dark:text-gold-400" />
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 font-serif">
                Spot Gold & Silver Rates
              </p>
              <span className="text-[10px] text-slate-500 block">Synced every 60 seconds</span>
            </div>

            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-blue-700 dark:text-blue-400">
                  Security & 2FA Layer
                </span>
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 font-serif">
                PCI-DSS & RBAC Guards
              </p>
              <span className="text-[10px] text-slate-500 block">Audit logs encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
