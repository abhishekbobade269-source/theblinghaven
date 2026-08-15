'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { apiRequest } from '@/lib/api';
import { PromotionDto, PromotionType } from '@theblinghaven/shared';
import {
  Tag,
  Plus,
  Search,
  RefreshCw,
  Copy,
  Check,
  Trash2,
  Sparkles,
  Crown,
  Calendar,
  Percent,
  DollarSign,
  Gift,
  Truck,
  X,
  CheckCircle2,
} from 'lucide-react';

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<PromotionDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<{
    code: string;
    name: string;
    description: string;
    type: PromotionType;
    value: number;
    minPurchaseAmountUsd?: number;
    maxDiscountAmountUsd?: number;
    vipTierRequired?: string;
    usageLimit?: number;
  }>({
    code: '',
    name: '',
    description: '',
    type: 'PERCENTAGE_OFF',
    value: 10,
    minPurchaseAmountUsd: 1000,
    maxDiscountAmountUsd: undefined,
    vipTierRequired: '',
    usageLimit: 100,
  });

  const fetchPromotions = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest<any>('/admin/promotions');
      setPromotions(Array.isArray(res) ? res : res?.data || []);
    } catch (e) {
      console.error('Failed to load promotions:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiRequest('/admin/promotions', {
        method: 'POST',
        data: {
          ...form,
          code: form.code.toUpperCase().trim(),
          vipTierRequired: form.vipTierRequired || undefined,
        },
      });
      alert('Promotional privilege created successfully.');
      setIsModalOpen(false);
      fetchPromotions();
    } catch (e: any) {
      alert(e.message || 'Failed to create promotion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this promotional code?')) return;
    try {
      await apiRequest(`/admin/promotions/${id}`, { method: 'DELETE' });
      alert('Promotion revoked.');
      fetchPromotions();
    } catch (e: any) {
      alert(e.message || 'Failed to delete promotion.');
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const filtered = promotions.filter(
    (p) =>
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const activeCount = promotions.filter((p) => p.isActive).length;
  const totalUses = promotions.reduce((acc, p) => acc + p.usageCount, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-ivory-400 dark:border-obsidian-750 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
              <Sparkles className="h-4 w-4" />
              <span>VIP Privileges & Atelier Private Invitations</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
              Promotions & VIP Offers
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Configure promotional coupons, minimum order limits, and exclusive privileges for Royal Concierge collectors.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 rounded-xl border border-gold-500/60 bg-gradient-to-r from-gold-600 to-gold-500 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-obsidian-950 shadow-lg shadow-gold-500/20 hover:from-gold-500 hover:to-gold-400 transition"
            >
              <Plus className="h-4 w-4" />
              <span>New Privilege Code</span>
            </button>
            <button
              onClick={fetchPromotions}
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
              Active Privilege Codes
            </span>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif">
              {activeCount} Live Codes
            </p>
            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              Ready for client checkout application
            </p>
          </div>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Times Redeemed
            </span>
            <p className="mt-2 text-2xl font-bold text-gold-700 dark:text-gold-400 font-serif">
              {totalUses} Redemptions
            </p>
            <p className="mt-1 text-xs text-slate-400">Tracked in customer checkout ledger</p>
          </div>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              VIP Tier Exclusivity
            </span>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif">
              Tier Locked
            </p>
            <p className="mt-1 text-xs text-slate-400">Royal Concierge & Gold Patron gates</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search coupon code or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 py-2 pl-9 pr-4 text-xs text-slate-800 dark:text-slate-200 focus:border-gold-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Promotions Table */}
        <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[900px]">
            <thead>
              <tr className="border-b border-ivory-300 dark:border-obsidian-800 text-slate-500 dark:text-slate-400">
                <th className="pb-3 font-bold uppercase tracking-wider">Coupon Code</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Privilege Name</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Discount Type & Value</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Min Spend</th>
                <th className="pb-3 font-bold uppercase tracking-wider">VIP Exclusivity</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Usage Progress</th>
                <th className="pb-3 font-bold uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-300 dark:divide-obsidian-800 text-slate-700 dark:text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
                      <span>Loading promotional privileges...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No promotional codes found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-ivory-100 dark:hover:bg-obsidian-850/50 transition"
                  >
                    <td className="py-3.5">
                      <div className="flex items-center space-x-2">
                        <span className="rounded-lg border border-gold-500/40 bg-gold-500/10 px-2.5 py-1 font-mono text-xs font-bold text-gold-800 dark:text-gold-300">
                          {p.code}
                        </span>
                        <button
                          onClick={() => copyCode(p.code)}
                          className="rounded p-1 text-slate-400 hover:text-gold-600"
                          title="Copy Code"
                        >
                          {copiedCode === p.code ? (
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5">
                      <p className="font-serif font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {p.name}
                      </p>
                      {p.description && (
                        <p className="text-[10px] text-slate-400 truncate max-w-xs">{p.description}</p>
                      )}
                    </td>

                    <td className="py-3.5">
                      <span className="font-mono font-bold text-gold-700 dark:text-gold-400">
                        {p.type === 'PERCENTAGE_OFF'
                          ? `${p.value}% OFF`
                          : p.type === 'FIXED_AMOUNT_OFF'
                          ? `$${p.value} USD OFF`
                          : p.type === 'FREE_ARMORED_SHIPPING'
                          ? 'Free Armored Freight'
                          : 'Bespoke Gift'}
                      </span>
                    </td>

                    <td className="py-3.5 font-mono">
                      {p.minPurchaseAmountUsd ? `$${p.minPurchaseAmountUsd.toLocaleString()}` : 'No Min'}
                    </td>

                    <td className="py-3.5">
                      {p.vipTierRequired ? (
                        <span className="inline-flex items-center space-x-1 rounded-full bg-gold-500/20 px-2 py-0.5 text-[9px] font-bold text-gold-800 dark:text-gold-300">
                          <Crown className="h-2.5 w-2.5" />
                          <span>{p.vipTierRequired.replace('_', ' ')}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">All Clients</span>
                      )}
                    </td>

                    <td className="py-3.5 font-mono text-[11px]">
                      {p.usageCount} / {p.usageLimit || '∞'}
                    </td>

                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="rounded-lg p-1.5 text-red-500 hover:bg-red-500/10"
                        title="Revoke Code"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Create Promotion Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
            <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-ivory-300 dark:border-obsidian-800 pb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
                    Create VIP Privilege & Coupon
                  </h3>
                  <p className="text-xs text-slate-400">Configure promotional discount rule</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Coupon Code
                    </label>
                    <input
                      type="text"
                      required
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                      className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 font-mono text-xs font-bold text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                      placeholder="e.g. ROYAL2026"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Privilege Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                      placeholder="e.g. Royal Concierge 15% VIP"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Discount Type
                    </label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value as PromotionType })}
                      className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs font-bold text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                    >
                      <option value="PERCENTAGE_OFF">Percentage Off (%)</option>
                      <option value="FIXED_AMOUNT_OFF">Fixed Amount Off ($ USD)</option>
                      <option value="FREE_ARMORED_SHIPPING">Free Armored Shipping</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Discount Value (% or $)
                    </label>
                    <input
                      type="number"
                      required
                      value={form.value}
                      onChange={(e) => setForm({ ...form, value: parseFloat(e.target.value) || 0 })}
                      className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 font-mono text-xs font-bold text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Min Purchase ($ USD)
                    </label>
                    <input
                      type="number"
                      value={form.minPurchaseAmountUsd || ''}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          minPurchaseAmountUsd: e.target.value ? parseFloat(e.target.value) : undefined,
                        })
                      }
                      className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 font-mono text-xs text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                      placeholder="e.g. 5000"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      VIP Tier Gate (Optional)
                    </label>
                    <select
                      value={form.vipTierRequired}
                      onChange={(e) => setForm({ ...form, vipTierRequired: e.target.value })}
                      className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs font-bold text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                    >
                      <option value="">No VIP Gate (All Clients)</option>
                      <option value="ROYAL_CONCIERGE">ROYAL CONCIERGE Only</option>
                      <option value="GOLD_PATRON">GOLD PATRON & Above</option>
                      <option value="SILVER">SILVER & Above</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-ivory-300 dark:border-obsidian-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl border border-ivory-300 dark:border-obsidian-750 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-ivory-100 dark:hover:bg-obsidian-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl border border-gold-500/60 bg-gradient-to-r from-gold-600 to-gold-500 px-5 py-2 text-xs font-bold uppercase tracking-wider text-obsidian-950 shadow-md hover:from-gold-500 hover:to-gold-400 transition disabled:opacity-50"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Privilege'}
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
