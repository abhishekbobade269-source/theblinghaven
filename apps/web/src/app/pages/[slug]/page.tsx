'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';
import { PageStatusGuard } from '@/components/PageStatusGuard';
import { ProductDto } from '@theblinghaven/shared';
import {
  Sparkles,
  RefreshCw,
  Gem,
  Crown,
  ArrowRight,
  Filter,
  CheckCircle2,
} from 'lucide-react';

export default function DynamicCustomPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';

  const [page, setPage] = useState<any>(null);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'FEATURED' | 'PRICE_LOW_HIGH' | 'PRICE_HIGH_LOW'>('FEATURED');

  useEffect(() => {
    if (!slug) return;

    const fetchCustomPage = async () => {
      setIsLoading(true);
      try {
        const res = await apiRequest<any>(`/cms/custom-pages/${encodeURIComponent(slug)}`);
        const data = res?.data || res;
        setPage(data?.page || null);
        setProducts(data?.products || []);
      } catch (e) {
        console.error('Failed to load custom page:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomPage();
  }, [slug]);

  let sorted = [...products];
  if (sortBy === 'PRICE_LOW_HIGH') {
    sorted.sort((a, b) => a.basePriceUsd - b.basePriceUsd);
  } else if (sortBy === 'PRICE_HIGH_LOW') {
    sorted.sort((a, b) => b.basePriceUsd - a.basePriceUsd);
  }

  return (
    <PageStatusGuard fallbackRoute={`/pages/${slug}`}>
      <div className="space-y-12 sm:space-y-16 pb-24">
        {/* 1. Custom Hero Banner */}
        <section className="relative h-[44vh] min-h-[360px] w-full overflow-hidden bg-[#0A0A0E]">
          <div className="absolute inset-0">
            <img
              src={page?.heroBannerUrl || '/uploads/sets_00c2f42a_1s6a9390.jpg'}
              alt={page?.pageTitle || 'Curated Collection'}
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#08080B]/95 via-[#08080B]/75 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08080B] via-transparent to-transparent" />
          </div>

          <div className="relative h-full w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
            <div className="max-w-2xl space-y-3">
              {page?.badgeText && (
                <div className="inline-flex items-center space-x-2 rounded-full border border-gold-500/40 bg-black/60 backdrop-blur-md px-3.5 py-1 text-xs font-mono tracking-wider uppercase text-gold-400 font-bold">
                  <Sparkles className="h-3.5 w-3.5 text-gold-400" />
                  <span>{page.badgeText}</span>
                </div>
              )}

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                {page?.pageTitle || 'Exclusive Jewellery Collection'}
              </h1>

              {page?.customSubtext && (
                <p className="text-xs sm:text-sm md:text-base text-slate-200 font-light leading-relaxed max-w-xl">
                  {page.customSubtext}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* 2. Main Content & Product Showcase */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Controls Bar with Porcelain Light Mode */}
          <div className="rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-[#0E0E14] p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-mono text-slate-600 dark:text-slate-400 font-bold">
              Curated Showcase • <strong className="text-gold-700 dark:text-gold-400">{sorted.length}</strong> items available
            </span>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-xl border border-slate-300 dark:border-gold-500/30 bg-slate-50 dark:bg-[#16161E] px-4 py-2 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 focus:border-gold-400 focus:outline-none cursor-pointer"
            >
              <option value="FEATURED">Featured First</option>
              <option value="PRICE_LOW_HIGH">Price: Low to High</option>
              <option value="PRICE_HIGH_LOW">Price: High to Low</option>
            </select>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <RefreshCw className="h-8 w-8 text-gold-400 animate-spin" />
              <p className="font-mono text-xs text-slate-400">Loading collection...</p>
            </div>
          ) : sorted.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 dark:border-gold-500/20 bg-white dark:bg-[#0E0E14] p-12 text-center space-y-4 shadow-xl">
              <Gem className="h-10 w-10 text-gold-500 mx-auto" />
              <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
                No jewellery items currently in this selection
              </h3>
              <p className="text-xs text-slate-500">Please check back soon as our catalog is updated.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {sorted.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageStatusGuard>
  );
}
