'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getProducts } from '@/services/catalog.service';
import { ProductCard } from '@/components/ProductCard';
import { ProductDto } from '@theblinghaven/shared';
import { PageStatusGuard } from '@/components/PageStatusGuard';
import {
  Sparkles,
  Crown,
  ShieldCheck,
  Truck,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';

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
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getProducts({ category: categorySlug, sortBy }).then((data) => {
      if (isMounted) {
        setProducts(data);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [categorySlug, sortBy]);

  return (
    <PageStatusGuard fallbackRoute={`/${categorySlug}`}>
      <div className="min-h-screen w-full flex flex-col space-y-12 sm:space-y-16 pb-20">
        {/* Full-bleed Luxury Hero Banner */}
        <div className="relative h-[48vh] sm:h-[58vh] w-full overflow-hidden bg-black select-none">
          <img
            src={heroBannerUrl}
            alt={categoryTitle}
            className="h-full w-full object-cover object-center filter brightness-[0.72] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950/80 via-transparent to-obsidian-950/40" />

          {/* Hero Content */}
          <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-16 space-y-3.5">
            <div className="inline-flex items-center space-x-2 rounded-full border border-gold-400/40 bg-obsidian-950/80 backdrop-blur-md px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-widest text-gold-300 w-fit">
              <Crown className="h-3 w-3 text-gold-400" />
              <span>{badgeText}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
              {categoryTitle}
            </h1>
            <p className="text-sm sm:text-base text-slate-200 font-light max-w-2xl drop-shadow">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
          {/* Highlights Ribbon */}
          {highlights && highlights.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-3xl border border-slate-200 dark:border-gold-500/20 bg-slate-50 dark:bg-obsidian-900/60 shadow-sm">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-center space-x-2.5 text-xs font-mono text-slate-700 dark:text-slate-300">
                  <Sparkles className="h-4 w-4 text-gold-500 flex-shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          )}

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 border-b border-slate-200 dark:border-white/10">
            <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
              Showing {products.length} Masterpiece Creations
            </span>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 px-4 py-2 pr-8 text-xs font-mono font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-gold-500 transition cursor-pointer"
              >
                <option value="featured">Featured Heirlooms</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Additions</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Products Grid */}
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
              {products.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </motion.div>
          ) : (
            <div className="py-20 text-center space-y-4 rounded-3xl border border-dashed border-slate-300 dark:border-white/10">
              <p className="text-slate-500">No creations found in this collection.</p>
            </div>
          )}

          {/* Artisan Heritage Footer */}
          {artisanDescription && (
            <div className="mt-16 p-8 sm:p-12 rounded-3xl border border-gold-500/30 bg-gradient-to-br from-obsidian-900 to-obsidian-950 text-slate-200 space-y-3 shadow-xl">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-gold-400">
                Maison Craftsmanship & Provenance
              </h3>
              <p className="text-xs sm:text-sm font-light leading-relaxed text-slate-300 max-w-4xl">
                {artisanDescription}
              </p>
            </div>
          )}
        </div>
      </div>
    </PageStatusGuard>
  );
}
