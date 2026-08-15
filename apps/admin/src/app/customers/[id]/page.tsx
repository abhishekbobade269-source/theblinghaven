'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AdminLayout } from '@/components/AdminLayout';
import { apiRequest } from '@/lib/api';
import {
  CustomerDto,
  CustomerVipTier,
} from '@theblinghaven/shared';
import {
  ArrowLeft,
  Save,
  Crown,
  Sparkles,
  MapPin,
  Mail,
  Phone,
  DollarSign,
  Gem,
  Calendar,
  Heart,
  FileText,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';

export default function CustomerProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const [customer, setCustomer] = useState<CustomerDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [form, setForm] = useState<{
    firstName: string;
    lastName: string;
    phone: string;
    country: string;
    city: string;
    vipTier: CustomerVipTier;
    conciergeNotes: string;
    assignedAdvisor: string;
    preferences: {
      preferredRingSize: string;
      preferredBangleSize: string;
      preferredMetal: string;
      favoriteGemstones: string[];
      anniversaryDate: string;
      birthDate: string;
      giftPreferences: string;
    };
  }>({
    firstName: '',
    lastName: '',
    phone: '',
    country: '',
    city: '',
    vipTier: 'STANDARD',
    conciergeNotes: '',
    assignedAdvisor: '',
    preferences: {
      preferredRingSize: '',
      preferredBangleSize: '',
      preferredMetal: '',
      favoriteGemstones: [],
      anniversaryDate: '',
      birthDate: '',
      giftPreferences: '',
    },
  });

  const fetchCustomer = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest<any>(`/admin/customers/${id}`);
      const data: CustomerDto = res.data || res;
      setCustomer(data);
      setForm({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || '',
        country: data.country,
        city: data.city || '',
        vipTier: data.vipTier,
        conciergeNotes: data.conciergeNotes || '',
        assignedAdvisor: data.assignedAdvisor || '',
        preferences: {
          preferredRingSize: data.preferences?.preferredRingSize || '',
          preferredBangleSize: data.preferences?.preferredBangleSize || '',
          preferredMetal: data.preferences?.preferredMetal || '',
          favoriteGemstones: data.preferences?.favoriteGemstones || [],
          anniversaryDate: data.preferences?.anniversaryDate || '',
          birthDate: data.preferences?.birthDate || '',
          giftPreferences: data.preferences?.giftPreferences || '',
        },
      });
    } catch (e: any) {
      alert(e.message || 'Failed to load client profile.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await apiRequest(`/admin/customers/${id}`, {
        method: 'PUT',
        data: form,
      });
      alert('Private client file updated.');
      fetchCustomer();
    } catch (e: any) {
      alert(e.message || 'Failed to update client profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !customer) {
    return (
      <AdminLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="flex flex-col items-center space-x-2 text-slate-400">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
            <p className="text-xs mt-2">Loading private client file...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <form onSubmit={handleSave} className="space-y-6 max-w-6xl">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-ivory-400 dark:border-obsidian-750 pb-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/customers"
              className="rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-850 p-2 text-slate-600 dark:text-slate-300 hover:bg-ivory-100 dark:hover:bg-obsidian-800 transition"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
                <Crown className="h-4 w-4" />
                <span>Private Client Profile & Preferences</span>
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
                {customer.fullName}
              </h1>
              <p className="mt-0.5 text-xs text-slate-500 font-mono">
                Client ID: {customer.id} • Registered {new Date(customer.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center space-x-2 rounded-xl border border-gold-500/60 bg-gradient-to-r from-gold-600 to-gold-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-obsidian-950 shadow-md hover:from-gold-500 hover:to-gold-400 transition disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Saving...' : 'Save Client File'}</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Lifetime Value (LTV)
            </span>
            <p className="font-serif text-2xl font-bold text-gold-700 dark:text-gold-400">
              ${customer.totalSpendUsd.toLocaleString()} USD
            </p>
            <p className="text-xs text-slate-400">Across {customer.totalOrdersCount} Completed Orders</p>
          </div>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Assigned Advisor
            </span>
            <p className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
              {customer.assignedAdvisor || 'Atelier Concierge Desk'}
            </p>
            <p className="text-xs text-slate-400">Dedicated private client manager</p>
          </div>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              VIP Tier Status
            </span>
            <p className="font-serif text-lg font-bold text-gold-700 dark:text-gold-400 flex items-center space-x-1">
              <Crown className="h-4 w-4" />
              <span>{customer.vipTier.replace('_', ' ')}</span>
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              White-Glove Armored Shipping Enabled
            </p>
          </div>
        </div>

        {/* Profile & Sizing Preferences Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Jewelry Sizing & Aesthetics Box */}
          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2 border-b border-ivory-300 dark:border-obsidian-800 pb-3">
              <Gem className="h-4 w-4 text-gold-500" />
              <span>Jewelry Sizing & Metal Preferences</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Preferred Ring Size
                </label>
                <input
                  type="text"
                  value={form.preferences.preferredRingSize}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      preferences: { ...form.preferences, preferredRingSize: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-ivory-300 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs text-slate-900 dark:text-slate-100"
                  placeholder="e.g. US 6.5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Preferred Bangle Size
                </label>
                <input
                  type="text"
                  value={form.preferences.preferredBangleSize}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      preferences: { ...form.preferences, preferredBangleSize: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-ivory-300 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs text-slate-900 dark:text-slate-100"
                  placeholder="e.g. Size 2.6 (60mm)"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                Preferred Precious Metal Alloy
              </label>
              <input
                type="text"
                value={form.preferences.preferredMetal}
                onChange={(e) =>
                  setForm({
                    ...form,
                    preferences: { ...form.preferences, preferredMetal: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-ivory-300 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs text-slate-900 dark:text-slate-100"
                placeholder="e.g. 22K Solid Gold & Pt950 Platinum"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                Gift Packaging & Trunk Preferences
              </label>
              <textarea
                rows={2}
                value={form.preferences.giftPreferences}
                onChange={(e) =>
                  setForm({
                    ...form,
                    preferences: { ...form.preferences, giftPreferences: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-ivory-300 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs text-slate-900 dark:text-slate-100"
                placeholder="e.g. Italian velvet presentation box with wax seal..."
              />
            </div>
          </div>

          {/* Personal Milestones & Concierge Notes */}
          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2 border-b border-ivory-300 dark:border-obsidian-800 pb-3">
              <Calendar className="h-4 w-4 text-gold-500" />
              <span>Milestones & Concierge Log</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Wedding Anniversary
                </label>
                <input
                  type="date"
                  value={form.preferences.anniversaryDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      preferences: { ...form.preferences, anniversaryDate: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-ivory-300 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Client Birthday
                </label>
                <input
                  type="date"
                  value={form.preferences.birthDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      preferences: { ...form.preferences, birthDate: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-ivory-300 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                VIP Tier Status
              </label>
              <select
                value={form.vipTier}
                onChange={(e) => setForm({ ...form, vipTier: e.target.value as CustomerVipTier })}
                className="w-full rounded-xl border border-ivory-300 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs font-bold text-slate-900 dark:text-slate-100"
              >
                <option value="ROYAL_CONCIERGE">ROYAL CONCIERGE (Private HNW)</option>
                <option value="GOLD_PATRON">GOLD PATRON</option>
                <option value="SILVER">SILVER</option>
                <option value="STANDARD">STANDARD</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                Private Concierge Notes (Internal Confidential)
              </label>
              <textarea
                rows={3}
                value={form.conciergeNotes}
                onChange={(e) => setForm({ ...form, conciergeNotes: e.target.value })}
                className="w-full rounded-xl border border-ivory-300 dark:border-obsidian-750 bg-ivory-50 dark:bg-obsidian-950 p-2.5 text-xs text-slate-900 dark:text-slate-100"
                placeholder="Record client preferences, bespoke inquiries, and high-value collection requests..."
              />
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
