'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCatalog } from '@/hooks/useCatalog';
import { ProductCard } from '@/components/ProductCard';
import { PageStatusGuard } from '@/components/PageStatusGuard';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  X,
  Sparkles,
} from 'lucide-react';

function CatalogContent() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('category') || 'all';

  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');

  const {
    products,
    categories,
    isLoading,
    totalCount,
    updateFilters,
  } = useCatalog({
    category: selectedCategory,
    sortBy,
    search: searchQuery,
  });

  const handleCategoryChange = (catSlug: string) => {
    setSelectedCategory(catSlug);
    updateFilters({ category: catSlug });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    updateFilters({ search: val });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as any;
    setSortBy(val);
    updateFilters({ sortBy: val });
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Title & Description */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Haute Joaillerie Archive</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Complete Jewellery Vault
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-light">
          Browse 300+ certified solitaires, royal bridal sets, chandelier drops, and 22K micro-gold plated bangles.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-obsidian-900/70 backdrop-blur-md shadow-sm">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by stone, SKU, or style..."
            className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 pl-10 pr-4 py-2.5 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-gold-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                updateFilters({ search: '' });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills Rail */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider transition whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-gold-500 text-obsidian-950 shadow-md'
                : 'bg-slate-100 dark:bg-obsidian-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-obsidian-700'
            }`}
          >
            All Vault
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider transition whitespace-nowrap ${
                selectedCategory === cat.slug
                  ? 'bg-gold-500 text-obsidian-950 shadow-md'
                  : 'bg-slate-100 dark:bg-obsidian-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-obsidian-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="relative w-full md:w-auto self-end md:self-auto">
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="w-full md:w-auto appearance-none rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 px-4 py-2.5 pr-8 text-xs font-mono font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-gold-500 transition cursor-pointer"
          >
            <option value="featured">Featured Heirlooms</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Results Count Header */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 px-1">
        <span>Displaying {totalCount} Designs</span>
        <span>Standard Tracked Courier Delivery</span>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-3xl bg-slate-200/60 dark:bg-obsidian-900/60 animate-pulse border border-slate-200 dark:border-white/5"
            />
          ))}
        </div>
      ) : products.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7"
        >
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </motion.div>
      ) : (
        <div className="py-20 text-center space-y-4 rounded-3xl border border-dashed border-slate-300 dark:border-white/10">
          <p className="text-base text-slate-600 dark:text-slate-400">
            No jewellery creations matched your current search filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              updateFilters({ category: 'all', search: '' });
            }}
            className="rounded-full bg-gold-500 px-6 py-2.5 text-xs font-mono font-bold uppercase text-obsidian-950"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <PageStatusGuard fallbackRoute="/catalog">
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <CatalogContent />
      </Suspense>
    </PageStatusGuard>
  );
}
