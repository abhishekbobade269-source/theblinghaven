'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/AdminLayout';
import { apiRequest } from '@/lib/api';
import {
  InventoryItemDto,
  InventoryLogDto,
  StockChangeType,
} from '@theblinghaven/shared';
import {
  Boxes,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  History,
  ShieldCheck,
  Edit,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  X,
  Lock,
  Warehouse,
} from 'lucide-react';

const VAULT_LOCATIONS = [
  'Vault A - High-Security Solitaires & Platinum',
  'Vault B - Royal Heritage Bridal Sets & Polki',
  'Vault C - 22K Solid Gold Bangles & Kadas',
  'Vault D - Artisan Sterling Silver & Pendants',
  'Vault E - Diamond Tennis Bracelets & Drops',
  'Vault F - Reserve Atelier Safes',
];

export default function VaultInventoryPage() {
  const [items, setItems] = useState<InventoryItemDto[]>([]);
  const [logs, setLogs] = useState<InventoryLogDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [meta, setMeta] = useState({ total: 0, lowStockCount: 0 });

  // Modal & Drawer State
  const [adjustingItem, setAdjustingItem] = useState<InventoryItemDto | null>(null);
  const [isLogDrawerOpen, setIsLogDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [adjustForm, setAdjustForm] = useState<{
    newQuantity: number;
    changeType: StockChangeType;
    reason: string;
    vaultLocation: string;
  }>({
    newQuantity: 1,
    changeType: 'RESTOCK',
    reason: '',
    vaultLocation: VAULT_LOCATIONS[0],
  });

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const q = new URLSearchParams();
      if (search) q.set('search', search);
      if (lowStockOnly) q.set('lowStockOnly', 'true');

      const [invRes, logsRes] = await Promise.all([
        apiRequest<any>(`/admin/inventory?${q.toString()}`),
        apiRequest<any>('/admin/inventory/logs'),
      ]);

      if (invRes && invRes.data) {
        setItems(invRes.data);
        if (invRes.meta) setMeta(invRes.meta);
      } else if (Array.isArray(invRes)) {
        setItems(invRes);
      }

      if (logsRes && logsRes.data) {
        setLogs(logsRes.data);
      } else if (Array.isArray(logsRes)) {
        setLogs(logsRes);
      }
    } catch (e) {
      console.error('Failed to load vault inventory:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [lowStockOnly]);

  const openAdjustModal = (item: InventoryItemDto) => {
    setAdjustingItem(item);
    setAdjustForm({
      newQuantity: item.stockQuantity,
      changeType: 'RESTOCK',
      reason: '',
      vaultLocation: item.vaultLocation || VAULT_LOCATIONS[0],
    });
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingItem) return;
    if (!adjustForm.reason.trim()) {
      alert('Audit trail requires an adjustment reason.');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest('/admin/inventory/adjust', {
        method: 'POST',
        data: {
          productId: adjustingItem.productId,
          newQuantity: adjustForm.newQuantity,
          changeType: adjustForm.changeType,
          reason: adjustForm.reason.trim(),
          vaultLocation: adjustForm.vaultLocation,
        },
      });
      alert('Vault stock count updated and logged in immutable ledger.');
      setAdjustingItem(null);
      fetchInventory();
    } catch (e: any) {
      alert(e.message || 'Failed to adjust stock.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalVaultUnits = items.reduce((acc, i) => acc + i.stockQuantity, 0);
  const totalReserved = items.reduce((acc, i) => acc + i.reservedQuantity, 0);
  const totalAvailable = items.reduce((acc, i) => acc + i.availableQuantity, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-ivory-400 dark:border-obsidian-750 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
              <ShieldCheck className="h-4 w-4" />
              <span>Physical Vault Security & Stock Ledger</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
              Vault & Inventory Operations
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Physical vault locations, reserved checkout holds, safety thresholds, and audited stock ledger.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsLogDrawerOpen(true)}
              className="flex items-center space-x-2 rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-850 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200 shadow-sm hover:bg-ivory-100 dark:hover:bg-obsidian-800 transition"
            >
              <History className="h-4 w-4 text-gold-500" />
              <span>Vault Audit Ledger ({logs.length})</span>
            </button>
            <button
              onClick={fetchInventory}
              className="rounded-lg border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-850 p-2.5 text-slate-600 dark:text-slate-300 hover:bg-ivory-100 dark:hover:bg-obsidian-800"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Vault Units
            </span>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif">
              {totalVaultUnits} Master Pieces
            </p>
            <p className="mt-1 text-xs text-slate-400">Across 6 physical vaults</p>
          </div>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Available For Purchase
            </span>
            <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-serif">
              {totalAvailable} Units
            </p>
            <p className="mt-1 text-xs text-slate-400">Instant worldwide dispatch</p>
          </div>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Reserved / In Checkout
            </span>
            <p className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400 font-serif">
              {totalReserved} Units
            </p>
            <p className="mt-1 text-xs text-slate-400">Locked in payment sessions</p>
          </div>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Critical Shortages
            </span>
            <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400 font-serif">
              {meta.lowStockCount} SKUs Low
            </p>
            <p className="mt-1 text-xs text-slate-400">Below safety threshold</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setLowStockOnly(false)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                !lowStockOnly
                  ? 'bg-gold-500 text-obsidian-950 shadow-md'
                  : 'bg-white dark:bg-obsidian-900 text-slate-700 dark:text-slate-300 border border-ivory-300 dark:border-obsidian-750'
              }`}
            >
              All Vault SKUs ({meta.total})
            </button>
            <button
              onClick={() => setLowStockOnly(true)}
              className={`flex items-center space-x-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                lowStockOnly
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-white dark:bg-obsidian-900 text-slate-700 dark:text-slate-300 border border-ivory-300 dark:border-obsidian-750'
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              <span>Low Stock Alerts ({meta.lowStockCount})</span>
            </button>
          </div>

          <div className="relative min-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search SKU, title, or vault location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchInventory()}
              className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 py-2 pl-9 pr-4 text-xs text-slate-800 dark:text-slate-200 focus:border-gold-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Master Inventory Table */}
        <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[900px]">
            <thead>
              <tr className="border-b border-ivory-300 dark:border-obsidian-800 text-slate-500 dark:text-slate-400">
                <th className="pb-3 font-bold uppercase tracking-wider w-14">Item</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Product & SKU</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Physical Vault Location</th>
                <th className="pb-3 font-bold uppercase tracking-wider text-center">Total Stock</th>
                <th className="pb-3 font-bold uppercase tracking-wider text-center">Reserved</th>
                <th className="pb-3 font-bold uppercase tracking-wider text-center">Available</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Safety Status</th>
                <th className="pb-3 font-bold uppercase tracking-wider text-right">Stock Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-300 dark:divide-obsidian-800 text-slate-700 dark:text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
                      <span>Loading vault inventory ledger...</span>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No vault inventory items found.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.productId}
                    className="hover:bg-ivory-100 dark:hover:bg-obsidian-850/50 transition"
                  >
                    <td className="py-3">
                      <div className="h-10 w-10 overflow-hidden rounded-xl border border-ivory-300 dark:border-obsidian-800 bg-obsidian-950">
                        <img
                          src={item.primaryImageUrl}
                          alt={item.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </td>
                    <td className="py-3">
                      <p className="font-serif font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {item.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className="font-mono text-[11px] font-bold text-gold-700 dark:text-gold-400">
                          {item.sku}
                        </span>
                        <span className="text-[10px] text-slate-400">• {item.categoryName}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center space-x-1 rounded-md bg-ivory-200 dark:bg-obsidian-800 px-2 py-0.5 text-[11px] font-mono text-slate-800 dark:text-slate-200">
                        <Warehouse className="h-3 w-3 text-gold-600" />
                        <span>{item.vaultLocation}</span>
                      </span>
                    </td>
                    <td className="py-3 text-center font-mono font-bold text-sm">
                      {item.stockQuantity}
                    </td>
                    <td className="py-3 text-center font-mono text-amber-600 dark:text-amber-400">
                      {item.reservedQuantity}
                    </td>
                    <td className="py-3 text-center">
                      <span
                        className={`inline-block font-mono text-sm font-bold ${
                          item.isLowStock
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {item.availableQuantity}
                      </span>
                    </td>
                    <td className="py-3">
                      {item.isLowStock ? (
                        <span className="inline-flex items-center space-x-1 rounded-full bg-red-500/15 px-2.5 py-0.5 text-[10px] font-bold text-red-600 dark:text-red-400">
                          <AlertTriangle className="h-3 w-3" />
                          <span>LOW (≤{item.lowStockThreshold})</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>SECURE</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => openAdjustModal(item)}
                        className="inline-flex items-center space-x-1 rounded-xl border border-ivory-300 dark:border-obsidian-750 bg-ivory-100 dark:bg-obsidian-800 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-gold-600 dark:hover:text-gold-400 transition"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Adjust Stock</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Adjust Stock Modal */}
        {adjustingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
            <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-ivory-300 dark:border-obsidian-800 pb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
                    Adjust Vault Stock Count
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {adjustingItem.sku} • {adjustingItem.title}
                  </p>
                </div>
                <button
                  onClick={() => setAdjustingItem(null)}
                  className="rounded-full p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAdjustSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Current Stock
                    </label>
                    <p className="rounded-xl bg-ivory-100 dark:bg-obsidian-850 p-3 font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
                      {adjustingItem.stockQuantity} Units
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      New Total Stock Count
                    </label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={adjustForm.newQuantity}
                      onChange={(e) =>
                        setAdjustForm({ ...adjustForm, newQuantity: parseInt(e.target.value) || 0 })
                      }
                      className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 font-mono text-sm font-bold text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Movement Type
                  </label>
                  <select
                    value={adjustForm.changeType}
                    onChange={(e) =>
                      setAdjustForm({ ...adjustForm, changeType: e.target.value as StockChangeType })
                    }
                    className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs font-bold text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                  >
                    <option value="RESTOCK">RESTOCK (Atelier Arrival)</option>
                    <option value="AUDIT_RECOUNT">AUDIT RECOUNT (Discrepancy Correction)</option>
                    <option value="DAMAGE_WRITE_OFF">DAMAGE WRITE OFF</option>
                    <option value="RETURN_RESTOCK">CUSTOMER RETURN RESTOCK</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Vault Allocation Location
                  </label>
                  <select
                    value={adjustForm.vaultLocation}
                    onChange={(e) => setAdjustForm({ ...adjustForm, vaultLocation: e.target.value })}
                    className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs font-bold text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                  >
                    {VAULT_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Audit Trail Reason (Mandatory)
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={adjustForm.reason}
                    onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                    className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                    placeholder="e.g. Received new shipment of 2 pieces from master jeweler atelier..."
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-ivory-300 dark:border-obsidian-800">
                  <button
                    type="button"
                    onClick={() => setAdjustingItem(null)}
                    className="rounded-xl border border-ivory-300 dark:border-obsidian-750 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-ivory-100 dark:hover:bg-obsidian-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl border border-gold-500/60 bg-gradient-to-r from-gold-600 to-gold-500 px-5 py-2 text-xs font-bold uppercase tracking-wider text-obsidian-950 shadow-md hover:from-gold-500 hover:to-gold-400 transition disabled:opacity-50"
                  >
                    {isSubmitting ? 'Recording...' : 'Commit Stock & Audit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Global Vault Audit Ledger Drawer */}
        {isLogDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm animate-in fade-in">
            <div className="h-full w-full max-w-xl bg-white dark:bg-obsidian-900 border-l border-ivory-400 dark:border-obsidian-750 p-6 overflow-y-auto space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-ivory-300 dark:border-obsidian-800 pb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
                    Vault Stock Movement Ledger
                  </h3>
                  <p className="text-xs text-slate-400">
                    Chronological immutable audit log of all vault entries and deductions
                  </p>
                </div>
                <button
                  onClick={() => setIsLogDrawerOpen(false)}
                  className="rounded-full p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                {logs.length === 0 ? (
                  <p className="py-12 text-center text-xs text-slate-400">
                    No physical vault movements recorded yet.
                  </p>
                ) : (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      className="rounded-2xl border border-ivory-300 dark:border-obsidian-800 bg-ivory-50 dark:bg-obsidian-850 p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-gold-700 dark:text-gold-400">
                          {log.sku}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-xs font-serif font-bold text-slate-900 dark:text-slate-100">
                        {log.productTitle}
                      </p>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-ivory-200 dark:border-obsidian-800">
                        <span className="rounded-md bg-ivory-200 dark:bg-obsidian-800 px-2 py-0.5 text-[10px] font-bold uppercase">
                          {log.changeType}
                        </span>
                        <span className="font-mono font-bold">
                          {log.previousQuantity} ➔ {log.newQuantity} (
                          {log.quantityChange > 0 ? `+${log.quantityChange}` : log.quantityChange})
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 italic bg-white dark:bg-obsidian-900 p-2 rounded-lg border border-ivory-200 dark:border-obsidian-800">
                        "{log.reason}"
                      </p>

                      <p className="text-[10px] text-slate-400 text-right">
                        Actor: {log.actorEmail || 'System'}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
