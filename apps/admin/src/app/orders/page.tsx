'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/AdminLayout';
import { apiRequest } from '@/lib/api';
import { OrderDto, OrderStatus } from '@theblinghaven/shared';
import {
  ShoppingCart,
  Search,
  Filter,
  RefreshCw,
  Eye,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock,
  Gem,
  DollarSign,
  ArrowUpRight,
  UserCheck,
} from 'lucide-react';

const STATUS_FILTERS: { key: string; label: string }[] = [
  { key: 'ALL', label: 'All Orders' },
  { key: 'PENDING_VERIFICATION', label: 'Order Placed' },
  { key: 'CONFIRMED', label: 'Payment Confirmed' },
  { key: 'VAULT_ALLOCATION', label: 'Packed & Ready' },
  { key: 'CUSTOM_SIZING_IN_PROGRESS', label: 'Quality Check & Sizing' },
  { key: 'SECURE_DISPATCH_ARMORED', label: 'Dispatched (DTDC / Blue Dart)' },
  { key: 'DELIVERED_SIGNATURE_REQUIRED', label: 'Delivered to Customer' },
];

export default function OrdersDirectoryPage() {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [meta, setMeta] = useState({ total: 0, totalRevenueUsd: 0 });

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const q = new URLSearchParams();
      if (search) q.set('search', search);
      if (statusFilter !== 'ALL') q.set('status', statusFilter);

      const res = await apiRequest<any>(`/admin/orders?${q.toString()}`);
      if (res && res.data) {
        setOrders(res.data);
        if (res.meta) setMeta(res.meta);
      } else if (Array.isArray(res)) {
        setOrders(res);
      }
    } catch (e) {
      console.error('Failed to load orders:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const activeFulfillments = orders.filter(
    (o) => o.status !== 'DELIVERED_SIGNATURE_REQUIRED' && o.status !== 'CANCELLED',
  ).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-ivory-400 dark:border-obsidian-750 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
              <Truck className="h-4 w-4" />
              <span>Express Courier Logistics & Dispatch (DTDC / Blue Dart / Speed Post)</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
              Jewelry Orders & Shipments
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Manage live customer orders, courier tracking numbers, and multi-currency invoicing.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchOrders}
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
              Total Processed Revenue
            </span>
            <p className="mt-2 text-2xl font-bold text-gold-700 dark:text-gold-400 font-serif">
              ${meta.totalRevenueUsd.toLocaleString()} USD
            </p>
            <p className="mt-1 text-xs text-slate-400">Multi-currency gross transaction volume</p>
          </div>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active In-Flight Orders
            </span>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif">
              {activeFulfillments} High-Value Shipments
            </p>
            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              Armored courier & sizing in progress
            </p>
          </div>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Order Volume
            </span>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif">
              {meta.total} Fine Orders
            </p>
            <p className="mt-1 text-xs text-slate-400">100% insured delivery guaranteed</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                  statusFilter === f.key
                    ? 'bg-gold-500 text-obsidian-950 shadow-md'
                    : 'bg-white dark:bg-obsidian-900 text-slate-700 dark:text-slate-300 border border-ivory-300 dark:border-obsidian-750'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search order #, customer, tracking..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
              className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 py-2 pl-9 pr-4 text-xs text-slate-800 dark:text-slate-200 focus:border-gold-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[950px]">
            <thead>
              <tr className="border-b border-ivory-300 dark:border-obsidian-800 text-slate-500 dark:text-slate-400">
                <th className="pb-3 font-bold uppercase tracking-wider">Order #</th>
                <th className="pb-3 font-bold uppercase tracking-wider">VIP Client</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Jewelry Pieces</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Total Value</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Armored Logistics</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Fulfillment Status</th>
                <th className="pb-3 font-bold uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-300 dark:divide-obsidian-800 text-slate-700 dark:text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
                      <span>Loading luxury orders...</span>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No jewelry orders found matching the filter.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr
                    key={ord.id}
                    className="hover:bg-ivory-100 dark:hover:bg-obsidian-850/50 transition"
                  >
                    <td className="py-3.5">
                      <Link href={`/orders/${ord.id}`} className="group block">
                        <span className="font-mono font-bold text-gold-700 dark:text-gold-400 group-hover:underline">
                          {ord.orderNumber}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </p>
                      </Link>
                    </td>

                    <td className="py-3.5">
                      <div>
                        <p className="font-serif font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {ord.customerName}
                        </p>
                        <div className="flex items-center space-x-1.5 mt-0.5">
                          <span
                            className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                              ord.customerVipTier === 'ROYAL_CONCIERGE'
                                ? 'bg-gold-500/20 text-gold-800 dark:text-gold-300'
                                : ord.customerVipTier === 'GOLD_PATRON'
                                ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300'
                                : 'bg-slate-200 dark:bg-obsidian-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {ord.customerVipTier}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            • {ord.shippingAddress.city}, {ord.shippingAddress.country}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5">
                      <div className="flex items-center space-x-2">
                        {ord.items.slice(0, 2).map((item) => (
                          <div
                            key={item.id}
                            className="h-9 w-9 overflow-hidden rounded-lg border border-ivory-300 dark:border-obsidian-800 bg-obsidian-950"
                            title={item.title}
                          >
                            <img
                              src={item.primaryImageUrl}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ))}
                        <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                          {ord.items.length} {ord.items.length === 1 ? 'Piece' : 'Pieces'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5">
                      <p className="font-serif font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {ord.currencySymbol} {ord.totalAmountLocal.toLocaleString()}
                      </p>
                      {ord.currencyCode !== 'USD' && (
                        <p className="text-[10px] text-slate-400 font-mono">
                          (${ord.totalAmountUsd.toLocaleString()} USD)
                        </p>
                      )}
                    </td>

                    <td className="py-3.5">
                      {ord.trackingNumber ? (
                        <div>
                          <span className="inline-flex items-center space-x-1 font-mono text-[11px] font-bold text-gold-700 dark:text-gold-400">
                            <ShieldCheck className="h-3 w-3" />
                            <span>{ord.shippingCarrier?.replace('_', ' ')}</span>
                          </span>
                          <p className="text-[10px] text-slate-400 font-mono">{ord.trackingNumber}</p>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Preparing in Safe</span>
                      )}
                    </td>

                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          ord.status === 'DELIVERED_SIGNATURE_REQUIRED'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : ord.status === 'SECURE_DISPATCH_ARMORED'
                            ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                            : ord.status === 'CUSTOM_SIZING_IN_PROGRESS'
                            ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400'
                            : 'bg-gold-500/15 text-gold-700 dark:text-gold-400'
                        }`}
                      >
                        {ord.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 text-right">
                      <Link
                        href={`/orders/${ord.id}`}
                        className="inline-flex items-center space-x-1 rounded-xl border border-ivory-300 dark:border-obsidian-750 bg-ivory-100 dark:bg-obsidian-800 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-gold-600 dark:hover:text-gold-400 transition"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Inspect</span>
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
