'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Maximize2, ArrowRight, Gem, Box, Layers } from 'lucide-react';
import { Magnet } from '@/components/react-bits';

const PREVIEW_JEWELRY = [
  {
    name: 'Rings',
    title: 'RINGS',
    src: '/gallery/processed/01_ring_transparent.png',
    bg: '#0B231A',
    label: 'GALLERY 01',
  },
  {
    name: 'Necklaces',
    title: 'NECKLACES',
    src: '/gallery/processed/02_necklace_transparent.png',
    bg: '#211812',
    label: 'GALLERY 02',
  },
  {
    name: 'Earrings',
    title: 'EARRINGS',
    src: '/gallery/processed/03_earrings_transparent.png',
    bg: '#0F2018',
    label: 'GALLERY 03',
  },
  {
    name: 'Bangles',
    title: 'BANGLES',
    src: '/gallery/processed/04_bangles_transparent.png',
    bg: '#171720',
    label: 'GALLERY 04',
  },
];

export function InteractiveGalleryBanner() {
  return (
    <section className="relative py-16 sm:py-24 overflow-hidden bg-[#FAF8F5] dark:bg-[#09090C] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Card Container with Warm Ivory & Gold Aesthetic */}
        <div className="relative rounded-3xl overflow-hidden border border-[#EADBCE] dark:border-gold-500/30 bg-gradient-to-br from-[#FFFDF9] via-[#FAF7F2] to-[#F5EFEB] dark:from-[#111116] dark:via-[#0E0E12] dark:to-[#09090C] p-6 sm:p-10 lg:p-14 shadow-[0_20px_50px_rgba(184,144,32,0.08)]">
          {/* Subtle gold decorative glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold-400/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-roseGold-400/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-5 text-left">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 rounded-full px-3.5 py-1.5 bg-gold-500/15 border border-gold-500/30 text-gold-800 dark:text-gold-300 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest">
                <Sparkles className="h-3.5 w-3.5 text-gold-600 dark:text-gold-400" />
                <span>Interactive Jewellery Gallery</span>
              </div>

              {/* Title */}
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight leading-[1.15]">
                Luxury Jewellery &amp; <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-amber-600 dark:from-gold-300 dark:via-gold-400 dark:to-amber-200">
                  Interactive 3D Gallery
                </span>
              </h2>

              {/* Description */}
              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed font-normal max-w-xl">
                Experience our full-viewport interactive gallery. Explore certified rings, bridal choker necklaces, chandelier earrings, and handcrafted bangles with cinematic 3D views.
              </p>

              {/* Features List */}
              <div className="grid grid-cols-2 gap-3 pt-1 text-xs font-mono text-stone-700 dark:text-stone-300">
                <div className="flex items-center space-x-2">
                  <Box className="w-4 h-4 text-gold-600 dark:text-gold-400 shrink-0" />
                  <span>Interactive 4-Way Depth</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-gold-600 dark:text-gold-400 shrink-0" />
                  <span>650ms Fluid Physics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Gem className="w-4 h-4 text-gold-600 dark:text-gold-400 shrink-0" />
                  <span>Royal Karigari Archive</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Maximize2 className="w-4 h-4 text-gold-600 dark:text-gold-400 shrink-0" />
                  <span>Full-Screen Immersive</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Magnet padding={40} magnetStrength={3}>
                  <Link
                    href="/gallery"
                    className="inline-flex items-center space-x-2.5 rounded-full bg-gradient-to-r from-gold-500 via-amber-500 to-gold-600 hover:from-gold-600 hover:to-amber-600 px-7 py-3.5 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-stone-950 shadow-[0_10px_25px_rgba(184,144,32,0.3)] transition-all hover:scale-105 active:scale-95"
                  >
                    <Maximize2 className="h-4 w-4" />
                    <span>Explore Gallery</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Magnet>

                <Link
                  href="/catalog"
                  className="inline-flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-gold-700 dark:text-gold-400 hover:underline py-3 px-2"
                >
                  <span>Explore All Jewellery</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Interactive Preview Carousel Card */}
            <div className="lg:col-span-6">
              <Link
                href="/gallery"
                className="group relative block aspect-[4/3] w-full rounded-2xl overflow-hidden border-2 border-[#EADBCE] dark:border-gold-500/40 shadow-2xl transition-all duration-300 hover:shadow-[0_25px_50px_rgba(184,144,32,0.2)] hover:scale-[1.02]"
              >
                {/* 4 Multi-tone background preview strips matching gallery pieces */}
                <div className="absolute inset-0 grid grid-cols-4">
                  {PREVIEW_JEWELRY.map((item) => (
                    <div
                      key={item.name}
                      style={{ backgroundColor: item.bg }}
                      className="relative h-full transition-transform duration-500 group-hover:scale-105 flex flex-col justify-between items-center py-4 px-1"
                    >
                      <span className="text-[9px] sm:text-[10px] font-mono font-bold text-amber-300/80 uppercase tracking-widest">
                        {item.label}
                      </span>
                      <div className="relative w-full h-[65%] flex items-center justify-center p-1">
                        <img
                          src={item.src}
                          alt={item.name}
                          className="w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1"
                        />
                      </div>
                      <span className="text-[10px] sm:text-xs font-serif font-bold text-white tracking-wider uppercase opacity-95">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Center Floating Pill Overlay */}
                <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-stone-950/10 transition-colors flex items-center justify-center pointer-events-none">
                  <div className="rounded-full bg-stone-950/85 backdrop-blur-md px-5 py-2.5 text-white flex items-center space-x-2 border border-gold-500/40 shadow-2xl group-hover:scale-110 transition-transform">
                    <Maximize2 className="h-4 w-4 text-gold-400 animate-pulse" />
                    <span className="text-xs font-mono uppercase font-bold tracking-widest text-gold-200">
                      Explore Interactive Gallery
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default InteractiveGalleryBanner;

