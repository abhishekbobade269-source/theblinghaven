'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/AdminLayout';
import { apiRequest } from '@/lib/api';
import {
  ProductDto,
  CategoryDto,
  CollectionDto,
  ProductStatus,
} from '@theblinghaven/shared';
import {
  Package,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  Edit,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  DollarSign,
  Gem,
} from 'lucide-react';

export default function CatalogDirectoryPage() {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const fetchCatalog = async () => {
    setIsLoading(true);
    try {
      const q = new URLSearchParams();
      if (selectedCategory !== 'ALL') q.set('categoryId', selectedCategory);
      if (selectedStatus !== 'ALL') q.set('status', selectedStatus);
      if (search) q.set('search', search);

      const [prodRes, catRes] = await Promise.all([
        apiRequest<any>(`/admin/catalog/products?${q.toString()}`),
        apiRequest<any>('/admin/catalog/categories'),
      ]);

      setProducts(Array.isArray(prodRes) ? prodRes : prodRes?.data || []);
      setCategories(Array.isArray(catRes) ? catRes : catRes?.data || []);
    } catch (e) {
      console.error('Failed to load catalog:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, [selectedCategory, selectedStatus]);

  const totalSKUs = products.length;
  const activeSKUs = products.filter((p) => p.status === 'ACTIVE').length;
  const totalVaultValue = products.reduce((acc, p) => acc + p.basePriceUsd * p.stockQuantity, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-ivory-400 dark:border-obsidian-750 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-1">
              <Gem className="h-4 w-4" />
              <span>Haute Joaillerie & SKU Management</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
              Jewelry Product Catalog
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Manage precious metal SKUs, diamond specifications, multi-currency pricing, and vault stock.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/catalog/new"
              className="flex items-center space-x-2 rounded-xl border border-gold-500/60 bg-gradient-to-r from-gold-600 to-gold-500 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-obsidian-950 shadow-lg shadow-gold-500/20 hover:from-gold-500 hover:to-gold-400 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Jewelry SKU</span>
            </Link>
            <button
              onClick={fetchCatalog}
              className="rounded-lg border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-850 p-2.5 text-slate-600 dark:text-slate-300 hover:bg-ivory-100 dark:hover:bg-obsidian-800"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Catalog SKUs Count
            </span>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif">
              {totalSKUs} Master SKUs
            </p>
            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              {activeSKUs} Live on Global Storefront
            </p>
          </div>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Vault Inventory Value
            </span>
            <p className="mt-2 text-2xl font-bold text-gold-700 dark:text-gold-400 font-serif">
              ${totalVaultValue.toLocaleString()} USD
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Across solid gold, platinum & diamonds
            </p>
          </div>

          <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-5 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Taxonomy Hierarchy
            </span>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif">
              {categories.length} Fine Categories
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Rings, Bridal, Earrings, Bangles, Silver
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                selectedCategory === 'ALL'
                  ? 'bg-gold-500 text-obsidian-950 shadow-md'
                  : 'bg-white dark:bg-obsidian-900 text-slate-700 dark:text-slate-300 border border-ivory-300 dark:border-obsidian-750'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                  selectedCategory === cat.id
                    ? 'bg-gold-500 text-obsidian-950 shadow-md'
                    : 'bg-white dark:bg-obsidian-900 text-slate-700 dark:text-slate-300 border border-ivory-300 dark:border-obsidian-750'
                }`}
              >
                {cat.name} ({cat.productCount})
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search SKU or title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchCatalog()}
                className="w-full rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 py-2 pl-9 pr-3 text-xs text-slate-800 dark:text-slate-200 focus:border-gold-500 focus:outline-none"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:border-gold-500 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="rounded-3xl border border-ivory-400 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[950px]">
            <thead>
              <tr className="border-b border-ivory-300 dark:border-obsidian-800 text-slate-500 dark:text-slate-400">
                <th className="pb-3 font-bold uppercase tracking-wider w-16">Item</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Product & SKU</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Jewelry Specs</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Base Price (USD)</th>
                <th className="pb-3 font-bold uppercase tracking-wider">Vault Stock</th>
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
                      <span>Loading luxury jewelry catalog...</span>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No jewelry products found matching the criteria.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-ivory-100 dark:hover:bg-obsidian-850/50 transition"
                  >
                    <td className="py-3">
                      <div className="h-12 w-12 overflow-hidden rounded-xl border border-ivory-300 dark:border-obsidian-800 bg-obsidian-950">
                        <img
                          src={p.primaryImageUrl}
                          alt={p.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </td>
                    <td className="py-3">
                      <Link href={`/catalog/${p.id}`} className="group block">
                        <p className="font-serif font-bold text-slate-900 dark:text-slate-100 group-hover:text-gold-600 dark:group-hover:text-gold-400 text-sm">
                          {p.title}
                        </p>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="font-mono text-[11px] font-bold text-gold-700 dark:text-gold-400">
                            {p.sku}
                          </span>
                          <span className="text-[10px] text-slate-400">• {p.categoryName}</span>
                          {p.isFeatured && (
                            <span className="rounded bg-gold-500/15 px-1.5 py-0.2 text-[9px] font-bold text-gold-800 dark:text-gold-300">
                              FEATURED
                            </span>
                          )}
                        </div>
                      </Link>
                    </td>
                    <td className="py-3">
                      <span className="inline-block rounded-md bg-ivory-200 dark:bg-obsidian-800 px-2 py-0.5 font-medium text-[11px]">
                        {p.specs.metalType || 'Gold / Silver'} ({p.specs.grossWeightGrams}g)
                      </span>
                      {p.specs.diamondWeightCarats && (
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          💎 {p.specs.diamondWeightCarats}ct {p.specs.diamondColor || 'D'}/{p.specs.diamondClarity || 'VVS'}
                        </p>
                      )}
                    </td>
                    <td className="py-3">
                      <p className="font-serif font-bold text-slate-900 dark:text-slate-100 text-sm">
                        ${p.basePriceUsd.toLocaleString()}
                      </p>
                      {p.comparePriceUsd && (
                        <p className="text-[10px] text-slate-400 line-through">
                          ${p.comparePriceUsd.toLocaleString()}
                        </p>
                      )}
                    </td>
                    <td className="py-3">
                      <span
                        className={`font-mono text-xs font-bold ${
                          p.stockQuantity <= p.lowStockThreshold
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {p.stockQuantity} in Vault
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          p.status === 'ACTIVE'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : p.status === 'DRAFT'
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                            : 'bg-red-500/15 text-red-600 dark:text-red-400'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/catalog/${p.id}`}
                        className="inline-flex items-center space-x-1 rounded-xl border border-ivory-300 dark:border-obsidian-750 bg-ivory-100 dark:bg-obsidian-800 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-gold-600 dark:hover:text-gold-400 transition"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Edit SKU</span>
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
