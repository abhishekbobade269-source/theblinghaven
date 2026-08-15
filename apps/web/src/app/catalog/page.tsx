'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { ProductDto, CategoryDto, CollectionDto } from '@theblinghaven/shared';
import {
  Filter,
  Search,
  RefreshCw,
  Gem,
  SlidersHorizontal,
  ChevronDown,
  X,
} from 'lucide-react';

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'ALL';
  const initialCollection = searchParams.get('collection') || 'ALL';

  const [products, setProducts] = useState<ProductDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [collections, setCollections] = useState<CollectionDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCollection, setSelectedCollection] = useState(initialCollection);
  const [selectedMetal, setSelectedMetal] = useState('ALL');
  const [sortBy, setSortBy] = useState('FEATURED');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, colRes] = await Promise.all([
          apiRequest<any>('/catalog/categories'),
          apiRequest<any>('/catalog/collections'),
        ]);
        setCategories(Array.isArray(catRes) ? catRes : catRes?.data || []);
        setCollections(Array.isArray(colRes) ? colRes : colRes?.data || []);
      } catch (e) {
        console.error('Failed to load categories/collections:', e);
      }
    };
    fetchMetadata();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const q = new URLSearchParams();
      if (selectedCategory !== 'ALL') {
        const matched = categories.find(
          (c) =>
            c.slug?.toLowerCase() === selectedCategory.toLowerCase() ||
            c.name.toLowerCase().includes(selectedCategory.toLowerCase()) ||
            c.id === selectedCategory
        );
        if (matched) q.set('categoryId', matched.id);
      }
      if (selectedCollection !== 'ALL') q.set('collectionId', selectedCollection);
      if (search) q.set('search', search);

      const res = await apiRequest<any>(`/catalog/products?${q.toString()}`);
      setProducts(Array.isArray(res) ? res : res?.data || []);
    } catch (e) {
      console.error('Failed to load products:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedCollection, search]);

  // Apply in-memory sort & metal filter
  let filtered = products.filter((p) => {
    if (selectedMetal !== 'ALL') {
      const pMetal = p.specs?.metalType || '';
      if (!pMetal.toLowerCase().includes(selectedMetal.toLowerCase())) return false;
    }
    return true;
  });

  if (sortBy === 'PRICE_LOW_HIGH') {
    filtered.sort((a, b) => a.basePriceUsd - b.basePriceUsd);
  } else if (sortBy === 'PRICE_HIGH_LOW') {
    filtered.sort((a, b) => b.basePriceUsd - a.basePriceUsd);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8 sm:space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2.5">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-700 dark:text-gold-400">
          The Bling Haven Vault
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 dark:text-slate-100">
          Haute Joaillerie Catalog
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Certified AAA+ CZ solitaires, royal polki bridal sets, and handcrafted demi-fine jewelry.
        </p>
      </div>

      {/* Filter & Search Bar (Full Theme-Aware) */}
      <div className="rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-[#0E0E14] p-5 space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Category Chips */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition font-mono ${
                selectedCategory === 'ALL'
                  ? 'bg-gold-500 text-obsidian-950 shadow-md'
                  : 'bg-slate-100 dark:bg-obsidian-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-gold-500'
              }`}
            >
              All Pieces ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition font-mono ${
                  selectedCategory.toLowerCase() === cat.name.toLowerCase()
                    ? 'bg-gold-500 text-obsidian-950 shadow-md'
                    : 'bg-slate-100 dark:bg-obsidian-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-gold-500'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[280px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search solitaire, SKU, finish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 dark:border-gold-500/30 bg-slate-50 dark:bg-obsidian-950 py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Second Row: Metal Filter & Sort */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200 dark:border-white/10 text-xs font-mono">
          <div className="flex items-center space-x-3">
            <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">Finish Alloy:</span>
            <select
              value={selectedMetal}
              onChange={(e) => setSelectedMetal(e.target.value)}
              className="rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-obsidian-950 px-3 py-1.5 text-slate-900 dark:text-slate-200 focus:border-gold-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Alloys & Finishes</option>
              <option value="Platinum">Platinum / Rhodium Pt950</option>
              <option value="18K">18K White / Yellow Gold</option>
              <option value="22K">22K Micro Gold Plated</option>
              <option value="Silver">Artisan 925 Silver</option>
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-obsidian-950 px-3 py-1.5 text-slate-900 dark:text-slate-200 focus:border-gold-500 focus:outline-none cursor-pointer"
            >
              <option value="FEATURED">Maison Curated (Featured)</option>
              <option value="PRICE_HIGH_LOW">Price: High to Low</option>
              <option value="PRICE_LOW_HIGH">Price: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-3 text-slate-400">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
          <p className="text-xs font-mono">Accessing High-Jewelry Vault...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 space-y-3">
          <div className="rounded-full border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-obsidian-900 p-4 text-gold-600 dark:text-gold-400 mx-auto w-fit shadow-md">
            <Gem className="h-8 w-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-slate-200">No creations match your filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your finish or category selection to view our catalog.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSelectedMetal('ALL');
              setSearch('');
            }}
            className="rounded-xl bg-gold-500 px-5 py-2 text-xs font-bold text-obsidian-950 uppercase font-mono shadow-md"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[70vh] items-center justify-center">
          <div className="flex flex-col items-center space-x-2 text-slate-400">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
            <p className="text-xs font-mono mt-3">Accessing High-Jewelry Vault...</p>
          </div>
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
