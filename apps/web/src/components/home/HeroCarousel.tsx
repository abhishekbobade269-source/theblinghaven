'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useHeroBanners } from '@/hooks/useHeroBanners';
import { ShinyText, Magnet } from '@/components/react-bits';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

export function HeroCarousel() {
  const {
    banners,
    currentBanner,
    currentIndex,
    nextSlide,
    prevSlide,
    goToSlide,
    setIsPaused,
    isLoading,
  } = useHeroBanners(6500);

  if (isLoading || !currentBanner) {
    return (
      <div className="relative h-[65vh] sm:h-[80vh] w-full bg-obsidian-950 animate-pulse flex items-center justify-center">
        <Sparkles className="h-10 w-10 text-gold-500/40 animate-spin" />
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative h-[70vh] sm:h-[84vh] w-full overflow-hidden bg-obsidian-950 select-none"
    >
      {/* Background Image Carousel with Ken Burns subtle scale */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBanner.id || currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img
            src={currentBanner.imageUrl}
            alt={currentBanner.title}
            className="h-full w-full object-cover object-center filter brightness-[0.78] contrast-[1.05]"
          />
          {/* Multi-layered Vignette & Luxury Gradient Shading */}
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950/80 via-transparent to-obsidian-950/50" />
        </motion.div>
      </AnimatePresence>

      {/* Content Container */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-24">
        <motion.div
          key={`content-${currentIndex}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.15 }}
          className="max-w-2xl space-y-4 sm:space-y-6"
        >
          {/* Subtitle Badge */}
          {(currentBanner.badgeText || currentBanner.subtitle) && (
            <div className="inline-flex items-center space-x-2 rounded-full border border-gold-400/40 bg-obsidian-950/80 backdrop-blur-md px-3.5 py-1 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-gold-300 shadow-xl">
              <Sparkles className="h-3 w-3 text-gold-400" />
              <ShinyText
                text={currentBanner.badgeText || currentBanner.subtitle || ''}
                color="#facc15"
                shineColor="#ffffff"
                speed={2.2}
              />
            </div>
          )}

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-50 tracking-tight leading-[1.1] drop-shadow-lg">
            {currentBanner.title}
          </h1>

          {/* Subtitle / Description */}
          {currentBanner.subtitle && currentBanner.badgeText && (
            <p className="text-sm sm:text-base text-slate-200/90 font-light leading-relaxed max-w-xl drop-shadow">
              {currentBanner.subtitle}
            </p>
          )}

          {/* Call-to-Actions */}
          <div className="pt-2 flex flex-wrap items-center gap-3.5">
            <Magnet padding={50} magnetStrength={3}>
              <Link
                href={currentBanner.ctaLink || '/catalog'}
                className="inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-gold-400 via-gold-500 to-amber-500 px-6 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-obsidian-950 hover:brightness-110 shadow-[0_10px_30px_rgba(212,175,55,0.35)] transition-all"
              >
                <span>{currentBanner.ctaText || 'Explore Collection'}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Magnet>

            <Magnet padding={40} magnetStrength={3.5}>
              <Link
                href="/gallery"
                className="inline-flex items-center space-x-2 rounded-full border border-white/40 bg-white/10 hover:bg-white/20 backdrop-blur-md px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-white transition-all shadow-lg"
              >
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>3D Gallery</span>
              </Link>
            </Magnet>
          </div>
        </motion.div>
      </div>

      {/* Progress Indicators & Navigation Controls */}
      <div className="absolute bottom-6 inset-x-0 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Slide Progress Bars */}
        <div className="flex items-center space-x-2.5">
          {banners.map((b, idx) => (
            <button
              key={b.id || idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
              className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300"
              style={{ width: idx === currentIndex ? '3rem' : '1.25rem' }}
            >
              <div
                className={`h-full w-full ${
                  idx === currentIndex
                    ? 'bg-gold-400 shadow-[0_0_8px_rgba(212,175,55,0.8)]'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Next / Prev Arrows */}
        <div className="flex items-center space-x-2">
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="h-9 w-9 rounded-full border border-white/20 bg-obsidian-950/70 backdrop-blur-md flex items-center justify-center text-white hover:border-gold-400 hover:text-gold-400 transition"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="h-9 w-9 rounded-full border border-white/20 bg-obsidian-950/70 backdrop-blur-md flex items-center justify-center text-white hover:border-gold-400 hover:text-gold-400 transition"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
