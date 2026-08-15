'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { ProductDto } from '@theblinghaven/shared';
import { PageStatusGuard } from '@/components/PageStatusGuard';
import {
  Sparkles,
  SlidersHorizontal,
  RefreshCw,
  Gem,
  Crown,
  ShieldCheck,
  Truck,
  RotateCw,
  ArrowRight,
  Filter,
  CheckCircle2,
} from 'lucide-react';

import productsManifest from '@/data/products-manifest.json';

interface CategoryShowcaseProps {
  categorySlug: string;
  categoryTitle: string;
  subtitle: string;
  heroBannerUrl: string;
  artisanDescription: string;
  badgeText: string;
  highlights: string[];
}

export function CategoryShowcase({
  categorySlug,
  categoryTitle,
  subtitle,
  heroBannerUrl,
  artisanDescription,
  badgeText,
  highlights,
}: CategoryShowcaseProps) {
  const initialCatProducts = (productsManifest as any[]).filter(
    (p) => p.categorySlug?.toLowerCase() === categorySlug.toLowerCase(),
  );

  const [products, setProducts] = useState<ProductDto[]>(
    initialCatProducts.length > 0 ? initialCatProducts : (productsManifest as any[]).slice(0, 12),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'FEATURED' | 'PRICE_LOW_HIGH' | 'PRICE_HIGH_LOW'>('FEATURED');
  const [selectedMetal, setSelectedMetal] = useState<string>('ALL');

  useEffect(() => {
    let isMounted = true;
    const fetchCategoryProducts = async () => {
      setIsLoading(true);
      try {
        let loaded: ProductDto[] = [];
        try {
          const catRes = await apiRequest<any>('/catalog/categories');
          const categories = Array.isArray(catRes) ? catRes : catRes?.data || [];
          const matchedCat = categories.find(
            (c: any) => c.slug?.toLowerCase() === categorySlug.toLowerCase(),
          );

          let url = '/catalog/products?limit=50';
          if (matchedCat) {
            url += `&categoryId=${matchedCat.id}`;
          }

          const res = await apiRequest<any>(url);
          const prodList = Array.isArray(res) ? res : res?.data || [];
          if (prodList.length > 0) {
            loaded = prodList;
          }
        } catch (err) {
          // Fallback to manifest
        }

        if (loaded.length === 0) {
          const filteredFromManifest = (productsManifest as any[]).filter(
            (p) => p.categorySlug?.toLowerCase() === categorySlug.toLowerCase(),
          );
          loaded = filteredFromManifest.length > 0 ? filteredFromManifest : (productsManifest as any[]).slice(0, 12);
        }

        if (!isMounted) return;
        setProducts(loaded);
      } catch (e) {
        console.error('Failed to load category products:', e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchCategoryProducts();
    return () => {
      isMounted = false;
    };
  }, [categorySlug]);

  // In-memory filter & sort
  let filtered = products.filter((p) => {
    if (selectedMetal !== 'ALL') {
      const pSpecs = JSON.stringify(p.specs || {}).toLowerCase();
      if (!pSpecs.includes(selectedMetal.toLowerCase())) return false;
    }
    return true;
  });

  if (sortBy === 'PRICE_LOW_HIGH') {
    filtered.sort((a, b) => a.basePriceUsd - b.basePriceUsd);
  } else if (sortBy === 'PRICE_HIGH_LOW') {
    filtered.sort((a, b) => b.basePriceUsd - a.basePriceUsd);
  }

  return (
    <PageStatusGuard fallbackRoute={`/${categorySlug}`}>
      <div className="space-y-10 sm:space-y-16 pb-20 overflow-x-hidden">
        {/* 1. Category Hero Banner */}
        <section className="relative h-[48dvh] sm:h-[55dvh] min-h-[380px] w-full overflow-hidden bg-[#0A0A0E]">
          <div className="absolute inset-0">
            <img
              src={heroBannerUrl}
              alt={categoryTitle}
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover object-center transform scale-100 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </div>

          <div className="relative h-full w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
            <div className="max-w-2xl space-y-3 sm:space-y-4">
              <div className="inline-flex items-center space-x-2 rounded-full border border-gold-500/40 bg-black/70 backdrop-blur-md px-3.5 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-mono tracking-widest uppercase text-gold-400">
                <Sparkles className="h-3.5 w-3.5 text-gold-400" />
                <span>{badgeText}</span>
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                {categoryTitle}
              </h1>

              <p className="text-xs sm:text-sm md:text-base text-slate-300 font-light leading-relaxed max-w-xl line-clamp-3 sm:line-clamp-none">
                {subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-2">
                {highlights.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-1.5 rounded-xl border border-gold-500/20 bg-black/60 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs text-slate-200 font-mono"
                  >
                    <CheckCircle2 className="h-3 w-3 text-gold-400 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 2. Main Content Grid & Filters */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Filter & Sort Bar */}
          <div className="rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-[#0E0E14] p-4 sm:p-5 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 text-xs font-mono">
              <span className="text-slate-500 dark:text-slate-400 font-bold uppercase shrink-0 mr-1 flex items-center space-x-1">
                <Filter className="h-3.5 w-3.5 text-gold-600" />
                <span>Filter Finish:</span>
              </span>
              {['ALL', 'Gold', 'Rhodium', 'Silver', 'Kundan'].map((metal) => (
                <button
                  key={metal}
                  onClick={() => setSelectedMetal(metal)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                    selectedMetal === metal
                      ? 'bg-gold-500 text-obsidian-950 shadow-md'
                      : 'bg-slate-100 dark:bg-obsidian-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10'
                  }`}
                >
                  {metal === 'ALL' ? 'All Finishes' : metal}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-bold">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-xl border border-slate-300 dark:border-gold-500/30 bg-slate-50 dark:bg-obsidian-900 px-3 py-1.5 text-xs font-mono text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none cursor-pointer"
              >
                <option value="FEATURED">Maison Featured</option>
                <option value="PRICE_LOW_HIGH">Price: Low to High</option>
                <option value="PRICE_HIGH_LOW">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid (Fluid Responsive across Mobile, Tablet, Desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filtered.length === 0 && !isLoading && (
            <div className="rounded-3xl border border-dashed border-slate-300 dark:border-gold-500/30 p-12 text-center space-y-3 bg-white dark:bg-obsidian-950/40">
              <Gem className="h-10 w-10 text-gold-500 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">No creations match this filter</h3>
              <p className="text-xs text-slate-500">Try selecting "All Finishes" to explore the full collection.</p>
            </div>
          )}
        </div>
      </div>
    </PageStatusGuard>
  );
}
