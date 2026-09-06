'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductDto } from '@theblinghaven/shared';
import { ProductCard } from '@/components/ProductCard';
import { Sparkles, ArrowRight } from 'lucide-react';
import { ShinyText, Magnet } from '@/components/react-bits';

interface CuratedCollectionRailProps {
  products: ProductDto[];
}

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'rings', label: 'Rings' },
  { id: 'bridal-sets', label: 'Necklaces & Sets' },
  { id: 'earrings', label: 'Earrings' },
  { id: 'bangles', label: 'Bangles' },
  { id: 'artisan-silver', label: 'Silver Jewellery' },
];

export function CuratedCollectionRail({ products }: CuratedCollectionRailProps) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredProducts = useMemo(() => {
    if (activeTab === 'all') return products.slice(0, 8);
    return products
      .filter((p) => {
        const catId = p.categoryId?.toLowerCase() || '';
        const catName = p.categoryName?.toLowerCase() || '';
        const target = activeTab.toLowerCase().replace('-', ' ');
        return catId.includes(activeTab) || catName.includes(target);
      })
      .slice(0, 8);
  }, [products, activeTab]);

  return (
    <section className="py-16 sm:py-24 bg-[#FAF7F2]/80 dark:bg-black/40 border-y border-[#EADBCE] dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        {/* Header and Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400">
              <Sparkles className="h-3.5 w-3.5" />
              <ShinyText text="Featured Collections" color="#ca8a04" shineColor="#fef08a" speed={2.5} />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Featured Jewellery
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-light max-w-xl">
              Discover our most popular designs, featuring handcrafted rings, necklace sets, earrings, and bangles.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-full bg-slate-200/70 dark:bg-obsidian-900 border border-slate-300/50 dark:border-white/10 self-start md:self-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-obsidian-950 dark:text-slate-900 font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-gold-400 to-amber-500 shadow-md"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid with Stagger Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7"
          >
            {filteredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Explore All CTA */}
        <div className="pt-4 text-center">
          <Magnet padding={50} magnetStrength={3}>
            <Link
              href={`/catalog${activeTab !== 'all' ? `?category=${activeTab}` : ''}`}
              className="inline-flex items-center space-x-2 rounded-full border border-gold-500/40 bg-white dark:bg-obsidian-900 px-8 py-3.5 text-xs font-mono font-bold uppercase tracking-wider text-gold-700 dark:text-gold-300 hover:bg-gold-500 hover:text-obsidian-950 transition-all shadow-md"
            >
              <span>Explore Complete {activeTab !== 'all' ? activeTab.replace('-', ' ') : 'Maison'} Catalog</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Magnet>
        </div>
      </div>
    </section>
  );
}
