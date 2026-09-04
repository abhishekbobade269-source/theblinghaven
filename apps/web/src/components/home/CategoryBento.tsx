'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Crown, Sparkles } from 'lucide-react';
import { DiamondGlint } from '@/components/ui/DiamondGlint';
import { ShinyText, SpotlightCard } from '@/components/react-bits';

export function CategoryBento() {
  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
        <div className="inline-flex items-center space-x-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400">
          <Crown className="h-3.5 w-3.5" />
          <ShinyText text="Curated Maison Parures" color="#ca8a04" shineColor="#fef08a" speed={2.5} />
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
          whileHover={{ y: -6, scale: 1.008 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="lg:col-span-7 group relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-gold-500/20 bg-slate-100 dark:bg-obsidian-900 shadow-md hover:shadow-2xl transition-all duration-300 min-h-[340px] sm:min-h-[440px]"
        >
          <Link href="/bridal-sets" className="block h-full w-full relative">
            <img
              src="/uploads/sets_5621e16b_1s6a9422.jpg"
              alt="Royal Bridal Sets"
              className="absolute inset-0 h-full w-full object-cover object-center filter brightness-[0.80] transition-transform duration-700 ease-out group-hover:scale-108"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <DiamondGlint />
            <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-10 space-y-2.5">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-400">
                Bridal & Solitaire Symphony
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
                Royal Kundan & Polki Sets
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light max-w-md">
                Heirloom bridal parures designed for sacred vows and regal grandeur.
              </p>
              <div className="pt-2 flex items-center space-x-1.5 text-xs font-mono font-bold text-gold-400 group-hover:text-gold-300">
                <span>View 70+ Parures</span>
                <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Solitaire Rings (Col 8 to 12) */}
        <motion.div
          whileHover={{ y: -6, scale: 1.008 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="lg:col-span-5 group relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-gold-500/20 bg-slate-100 dark:bg-obsidian-900 shadow-md hover:shadow-2xl transition-all duration-300 min-h-[340px] sm:min-h-[440px]"
        >
          <Link href="/rings" className="block h-full w-full relative">
            <img
              src="/uploads/rings_15ca97c8_1s6a0175.jpg"
              alt="Solitaire Rings"
              className="absolute inset-0 h-full w-full object-cover object-center filter brightness-[0.80] transition-transform duration-700 ease-out group-hover:scale-108"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <DiamondGlint />
            <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-10 space-y-2.5">
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
                <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Fine Earrings (Col 1 to 4) */}
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="lg:col-span-4 group relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-gold-500/20 bg-slate-100 dark:bg-obsidian-900 shadow-md hover:shadow-2xl transition-all duration-300 min-h-[290px]"
        >
          <Link href="/earrings" className="block h-full w-full relative">
            <img
              src="/uploads/earrings_01462b03_1s6a0431.jpg"
              alt="Fine Earrings"
              className="absolute inset-0 h-full w-full object-cover object-center filter brightness-[0.80] transition-transform duration-700 ease-out group-hover:scale-108"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <DiamondGlint />
            <div className="relative z-10 h-full flex flex-col justify-end p-6 space-y-1.5">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-400">
                Chandbali & Drops
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Statement Earrings
              </h3>
              <div className="pt-1 flex items-center space-x-1 text-xs font-mono font-bold text-gold-400">
                <span>Explore Drops</span>
                <ArrowUpRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Heritage Bangles (Col 5 to 8) */}
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="lg:col-span-4 group relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-gold-500/20 bg-slate-100 dark:bg-obsidian-900 shadow-md hover:shadow-2xl transition-all duration-300 min-h-[290px]"
        >
          <Link href="/bangles" className="block h-full w-full relative">
            <img
              src="/uploads/bangles_0deb44c0_1s6a9953.jpg"
              alt="Heritage Bangles"
              className="absolute inset-0 h-full w-full object-cover object-center filter brightness-[0.80] transition-transform duration-700 ease-out group-hover:scale-108"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <DiamondGlint />
            <div className="relative z-10 h-full flex flex-col justify-end p-6 space-y-1.5">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-400">
                22K Gold Micro-Plating
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Bangles & Kadas
              </h3>
              <div className="pt-1 flex items-center space-x-1 text-xs font-mono font-bold text-gold-400">
                <span>View Bangles</span>
                <ArrowUpRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Artisan Silver (Col 9 to 12) */}
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="lg:col-span-4 group relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-gold-500/20 bg-slate-100 dark:bg-obsidian-900 shadow-md hover:shadow-2xl transition-all duration-300 min-h-[290px]"
        >
          <Link href="/artisan-silver" className="block h-full w-full relative">
            <img
              src="/uploads/artisan_473a2ce6_1s6a0279.jpg"
              alt="Artisan Silver"
              className="absolute inset-0 h-full w-full object-cover object-center filter brightness-[0.80] transition-transform duration-700 ease-out group-hover:scale-108"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <DiamondGlint />
            <div className="relative z-10 h-full flex flex-col justify-end p-6 space-y-1.5">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-400">
                925 Sterling Silver
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Artisan Silver
              </h3>
              <div className="pt-1 flex items-center space-x-1 text-xs font-mono font-bold text-gold-400">
                <span>Explore Silver</span>
                <ArrowUpRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
