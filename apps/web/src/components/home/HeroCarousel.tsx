'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Sparkles, ArrowRight } from 'lucide-react';

interface HeroSlide {
  id: string;
  tagline: string;
  title: string;
  subtitle: string;
  image: string;
  quote: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  bgGradient: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    tagline: 'TIMELESS ELEGANCE',
    title: 'CRAFTED FOR YOU',
    subtitle: 'Discover jewellery that makes every moment unforgettable.',
    image: '/images/models/hero_bride_emerald.png',
    quote: "More\nthan just\njewellery,\nit's a feeling.",
    primaryCtaText: 'SHOP COLLECTION',
    primaryCtaLink: '/catalog',
    secondaryCtaText: 'EXPLORE BRIDAL',
    secondaryCtaLink: '/bridal-sets',
    bgGradient: 'from-[#1a1208] via-[#241a0d] to-[#120c06]',
  },
  {
    id: 'slide-2',
    tagline: 'ROYAL HERITAGE',
    title: 'STATEMENT CHANDELIERS',
    subtitle: 'Handcrafted 22K micro-gold chandelier ear candy designed to turn heads.',
    image: '/images/models/woman_2.png',
    quote: "Wear the\nlight of\nuncompromised\ngrace.",
    primaryCtaText: 'SHOP EARRINGS',
    primaryCtaLink: '/earrings',
    secondaryCtaText: 'VIEW LOOKBOOK',
    secondaryCtaLink: '/gallery',
    bgGradient: 'from-[#0d1a14] via-[#15261d] to-[#0a140f]',
  },
  {
    id: 'slide-3',
    tagline: 'MAISON ATELIER',
    title: 'SACRED POLKI HEIRLOOMS',
    subtitle: 'Uncut polki stones set in anti-tarnish micro-gold with heirloom durability.',
    image: '/images/models/woman_1.png',
    quote: "Every stone\ntells an\neternal\nlove story.",
    primaryCtaText: 'EXPLORE BESPOKE',
    primaryCtaLink: '/bespoke',
    secondaryCtaText: 'MEET FOUNDER',
    secondaryCtaLink: '/about',
    bgGradient: 'from-[#1f1610] via-[#2a1e14] to-[#140e0a]',
  },
];

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 7500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const slide = HERO_SLIDES[currentIndex];

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full overflow-hidden bg-[#fbf9f5] dark:bg-obsidian-950 transition-colors duration-500"
    >
      {/* Editorial Canvas Container */}
      <div className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] w-full flex items-center">
        {/* Animated Background Mood & Ambience */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${slide.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Soft Warm Editorial Ambient Lighting */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#fbf8f2] via-[#f7f2e7]/80 to-[#eee5d3]/40 dark:from-obsidian-950 dark:via-stone-950/95 dark:to-obsidian-900" />
            
            {/* Subtle Royal Gold Bokeh Aura */}
            <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-gold-400/10 dark:bg-gold-500/10 blur-[130px]" />
            <div className="absolute -bottom-20 right-1/4 w-[450px] h-[450px] rounded-full bg-rose-400/10 dark:bg-rose-500/10 blur-[140px]" />
          </motion.div>
        </AnimatePresence>

        {/* Hero Slide Content Wrapper */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
            
            {/* Left Column: Editorial Headline & Actions (lg:col-span-5) */}
            <motion.div
              key={`text-${slide.id}`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="lg:col-span-5 space-y-6 text-left"
            >
              {/* Tagline / Subtitle Pill */}
              <div className="inline-flex items-center space-x-2">
                <span className="text-xs sm:text-sm font-mono font-semibold uppercase tracking-[0.25em] text-gold-700 dark:text-gold-400">
                  {slide.tagline}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-[4rem] font-bold text-slate-900 dark:text-white tracking-tight leading-[1.08]">
                {slide.title}
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 font-light leading-relaxed max-w-md">
                {slide.subtitle}
              </p>

              {/* Double Call to Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href={slide.primaryCtaText ? slide.primaryCtaLink : '/catalog'}
                  className="inline-flex items-center space-x-3 rounded-full bg-gradient-to-r from-gold-500 via-gold-600 to-amber-600 px-7 sm:px-8 py-3.5 sm:py-4 text-xs font-mono font-bold uppercase tracking-widest text-obsidian-950 shadow-[0_8px_25px_rgba(212,175,55,0.32)] hover:brightness-110 hover:shadow-[0_10px_30px_rgba(212,175,55,0.45)] transition-all group"
                >
                  <span>{slide.primaryCtaText}</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href={slide.secondaryCtaLink}
                  className="inline-flex items-center space-x-2 rounded-full border border-stone-400/60 dark:border-gold-500/40 bg-white/40 dark:bg-black/30 backdrop-blur-md px-6 sm:px-7 py-3.5 sm:py-4 text-xs font-mono font-bold uppercase tracking-widest text-stone-900 dark:text-stone-200 hover:bg-white/80 dark:hover:bg-gold-500/20 hover:border-gold-500 transition-all shadow-sm"
                >
                  <span>{slide.secondaryCtaText}</span>
                </Link>
              </div>
            </motion.div>

            {/* Center Column: Model Hero Portrait (lg:col-span-5) */}
            <motion.div
              key={`img-${slide.id}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="lg:col-span-5 relative flex justify-center items-center"
            >
              {/* Soft Ambient Radial Backlight */}
              <div className="absolute inset-0 -m-8 rounded-full bg-radial from-amber-200/40 dark:from-gold-600/20 via-transparent to-transparent blur-3xl pointer-events-none" />

              <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-none rounded-[28px] overflow-hidden shadow-2xl border border-amber-900/10 dark:border-gold-500/20 bg-stone-100 dark:bg-stone-900 group">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-[400px] sm:h-[480px] lg:h-[540px] object-cover object-top filter brightness-[1.02] contrast-[1.02] transition-transform duration-1000 group-hover:scale-105"
                />

                {/* Subtle bottom gradient melt */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none" />
              </div>
            </motion.div>

            {/* Right Column: Editorial Poetic Card (lg:col-span-2) */}
            <motion.div
              key={`quote-${slide.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-2 hidden lg:flex flex-col justify-center items-start pl-4 border-l border-amber-900/10 dark:border-white/10 space-y-4"
            >
              <div className="space-y-1">
                {slide.quote.split('\n').map((line, idx) => (
                  <p
                    key={idx}
                    className="font-serif text-base xl:text-lg text-stone-700 dark:text-stone-300 italic leading-snug"
                  >
                    {line}
                  </p>
                ))}
              </div>

              <div className="pt-2 text-gold-600 dark:text-gold-400">
                <Heart className="h-4 w-4 fill-current opacity-80" />
              </div>
            </motion.div>

          </div>
        </div>

        {/* Carousel Arrow Controls */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-stone-300/80 dark:border-white/20 bg-white/70 dark:bg-black/60 backdrop-blur-md flex items-center justify-center text-stone-800 dark:text-white shadow-lg hover:scale-110 hover:border-gold-500 hover:text-gold-600 dark:hover:text-gold-400 transition-all"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-stone-300/80 dark:border-white/20 bg-white/70 dark:bg-black/60 backdrop-blur-md flex items-center justify-center text-stone-800 dark:text-white shadow-lg hover:scale-110 hover:border-gold-500 hover:text-gold-600 dark:hover:text-gold-400 transition-all"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* Bottom Slide Dot Indicators */}
        <div className="absolute bottom-4 inset-x-0 z-20 flex items-center justify-center space-x-2">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-8 bg-gold-600 dark:bg-gold-400 shadow-[0_0_8px_rgba(212,175,55,0.7)]'
                  : 'w-2 bg-stone-300 dark:bg-white/30 hover:bg-stone-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
