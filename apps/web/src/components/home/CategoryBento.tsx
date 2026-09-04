'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Crown, Sparkles, Gem } from 'lucide-react';
import { defaultCategories } from '@/services/catalog.service';

export function CategoryBento() {
  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
        <div className="inline-flex items-center space-x-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400">
          <Crown className="h-3.5 w-3.5" />
          <span>Curated Maison Parures</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Explore by Jewellery Category
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-light">
          Each heirloom is cast in Toronto using recycled precious metals, verified conflict-free gemstones, and stamped with authentic purity hallmarks.
        </p>
      </div>

      {/* Asymmetric Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Bridal Sets (Large Showcase - Col 1 to 7) */}
        <motion.div
          whileHover={{ y: -5 }}
          className="lg:col-span-7 group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-gold-500/20 bg-slate-100 dark:bg-obsidian-900 shadow-md hover:shadow-2xl transition-all duration-300 min-h-[320px] sm:min-h-[420px]"
        >
          <Link href="/bridal-sets" className="block h-full w-full">
            <img
              src="/uploads/sets_5621e16b_1s6a9422.jpg"
              alt="Royal Bridal Sets"
              className="absolute inset-0 h-full w-full object-cover object-center filter brightness-[0.82] transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-10 space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-400">
                Bridal & Solitaire Symphony
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
                Royal Kundan & Polki Sets
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light max-w-md">
                Heirloom bridal parures designed for sacred vows and regal grandeur.
              </p>
              <div className="pt-2 flex items-center space-x-1.5 text-xs font-mono font-bold text-gold-400 group-hover:text-gold-300">
                <span>View 70+ Parures</span>
                <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Solitaire Rings (Col 8 to 12) */}
        <motion.div
          whileHover={{ y: -5 }}
          className="lg:col-span-5 group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-gold-500/20 bg-slate-100 dark:bg-obsidian-900 shadow-md hover:shadow-2xl transition-all duration-300 min-h-[320px] sm:min-h-[420px]"
        >
          <Link href="/rings" className="block h-full w-full">
            <img
              src="/uploads/rings_15ca97c8_1s6a0175.jpg"
              alt="Solitaire Rings"
              className="absolute inset-0 h-full w-full object-cover object-center filter brightness-[0.82] transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-10 space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-400">
                18K Gold & Platinum
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
                Solitaire & Band Rings
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light">
                Cushion, oval, and emerald solitaires in micro-pavé bands.
              </p>
              <div className="pt-2 flex items-center space-x-1.5 text-xs font-mono font-bold text-gold-400 group-hover:text-gold-300">
                <span>View Solitaires</span>
                <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Fine Earrings (Col 1 to 4) */}
        <motion.div
          whileHover={{ y: -5 }}
          className="lg:col-span-4 group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-gold-500/20 bg-slate-100 dark:bg-obsidian-900 shadow-md hover:shadow-2xl transition-all duration-300 min-h-[280px]"
        >
          <Link href="/earrings" className="block h-full w-full">
            <img
              src="/uploads/earrings_01462b03_1s6a0431.jpg"
              alt="Fine Earrings"
              className="absolute inset-0 h-full w-full object-cover object-center filter brightness-[0.82] transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-end p-6 space-y-1.5">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-400">
                Chandbali & Drops
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Statement Earrings
              </h3>
              <div className="pt-1 flex items-center space-x-1 text-xs font-mono font-bold text-gold-400">
                <span>Explore Drops</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Heritage Bangles (Col 5 to 8) */}
        <motion.div
          whileHover={{ y: -5 }}
          className="lg:col-span-4 group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-gold-500/20 bg-slate-100 dark:bg-obsidian-900 shadow-md hover:shadow-2xl transition-all duration-300 min-h-[280px]"
        >
          <Link href="/bangles" className="block h-full w-full">
            <img
              src="/uploads/bangles_0deb44c0_1s6a9953.jpg"
              alt="Heritage Bangles"
              className="absolute inset-0 h-full w-full object-cover object-center filter brightness-[0.82] transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-end p-6 space-y-1.5">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-400">
                22K Gold Micro-Plating
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Bangles & Kadas
              </h3>
              <div className="pt-1 flex items-center space-x-1 text-xs font-mono font-bold text-gold-400">
                <span>View Bangles</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Artisan Silver (Col 9 to 12) */}
        <motion.div
          whileHover={{ y: -5 }}
          className="lg:col-span-4 group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-gold-500/20 bg-slate-100 dark:bg-obsidian-900 shadow-md hover:shadow-2xl transition-all duration-300 min-h-[280px]"
        >
          <Link href="/artisan-silver" className="block h-full w-full">
            <img
              src="/uploads/artisan_473a2ce6_1s6a0279.jpg"
              alt="Artisan Silver"
              className="absolute inset-0 h-full w-full object-cover object-center filter brightness-[0.82] transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-end p-6 space-y-1.5">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-400">
                925 Sterling Silver
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Artisan Silver
              </h3>
              <div className="pt-1 flex items-center space-x-1 text-xs font-mono font-bold text-gold-400">
                <span>Explore Silver</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
