'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Maximize2, ArrowRight, Gem, ShieldCheck, Compass, Eye } from 'lucide-react';
import { Magnet } from '@/components/react-bits';

interface ShowcasePiece {
  id: string;
  name: string;
  category: string;
  src: string;
  bgGlow: string;
  accentColor: string;
  tag: string;
  specs: string[];
  hotspots: {
    title: string;
    description: string;
    top: string;
    left: string;
  }[];
}

const SHOWCASE_PIECES: ShowcasePiece[] = [
  {
    id: 'ring',
    name: 'Imperial Emerald Angoothi',
    category: 'RINGS',
    src: '/gallery/processed/01_ring_transparent.png',
    bgGlow: 'radial-gradient(circle, rgba(16,77,54,0.45) 0%, rgba(11,35,26,0.15) 50%, transparent 80%)',
    accentColor: '#10B981',
    tag: 'Haute Solitaire #01',
    specs: ['AAA+ Zambian Emerald', '24K Micron Gold Plating', 'Anti-Tarnish Seal'],
    hotspots: [
      {
        title: 'Octagon Zambian Emerald',
        description: 'Vibrant verdant brilliance with double-halo micro-pavé CZ frame.',
        top: '36%',
        left: '42%',
      },
      {
        title: 'Filigree Gold Band',
        description: 'Hand-carved royal Mughal arabesque engraving along the shank.',
        top: '72%',
        left: '58%',
      },
    ],
  },
  {
    id: 'necklace',
    name: 'Shahi Polki Gulbandh Choker',
    category: 'NECKLACES',
    src: '/gallery/processed/02_necklace_transparent.png',
    bgGlow: 'radial-gradient(circle, rgba(184,144,32,0.4) 0%, rgba(45,30,18,0.2) 50%, transparent 80%)',
    accentColor: '#F59E0B',
    tag: 'Royal Bridal Trousseau',
    specs: ['Uncut Jadau Kundan', 'Basra Pearl Droplets', 'Hand-woven Dori'],
    hotspots: [
      {
        title: 'Jadau Polki Setting',
        description: 'Traditional foil-backed natural gemstones with uncut reflective lustre.',
        top: '38%',
        left: '48%',
      },
      {
        title: 'Cluster Pearl Hangings',
        description: 'Cultured seed pearls hand-linked with micro-gold wire.',
        top: '68%',
        left: '52%',
      },
    ],
  },
  {
    id: 'earrings',
    name: 'Chandbali Emerald Drops',
    category: 'EARRINGS',
    src: '/gallery/processed/03_earrings_transparent.png',
    bgGlow: 'radial-gradient(circle, rgba(16,77,54,0.38) 0%, rgba(15,32,24,0.15) 50%, transparent 80%)',
    accentColor: '#10B981',
    tag: 'Heritage Statement Pair',
    specs: ['Featherlight Weight (18g)', 'Dual Chand Motif', 'Hypoallergenic Post'],
    hotspots: [
      {
        title: 'Crescent Meenakari',
        description: 'Vibrant hot-enamel hand-painted pink and emerald motifs.',
        top: '32%',
        left: '46%',
      },
      {
        title: 'Emerald Teardrop',
        description: 'Precision faceted teardrop briolette with 360° light dispersion.',
        top: '74%',
        left: '50%',
      },
    ],
  },
  {
    id: 'bangles',
    name: 'Heritage Micro-Pavé Kadas',
    category: 'BANGLES',
    src: '/gallery/processed/04_bangles_transparent.png',
    bgGlow: 'radial-gradient(circle, rgba(148,163,184,0.35) 0%, rgba(23,23,32,0.15) 50%, transparent 80%)',
    accentColor: '#94A3B8',
    tag: 'Bespoke Wristwear Pair',
    specs: ['Concealed Push Clasp', '100% Water Resistant', 'Zero Snag Edges'],
    hotspots: [
      {
        title: 'Dual Safety Clasp',
        description: 'Precision engineered hidden clasp for secure, seamless wear.',
        top: '42%',
        left: '60%',
      },
      {
        title: 'Continuous Micro-Pavé',
        description: 'Over 400 individually hand-set AAA+ stones for 360° sparkle.',
        top: '58%',
        left: '38%',
      },
    ],
  },
];

export function InteractiveGalleryBanner() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const activePiece = SHOWCASE_PIECES[activeIdx];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden bg-[#FAF7F2] dark:bg-[#070605] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Editorial Card Container */}
        <div className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/35 dark:border-[#D4AF37]/40 bg-gradient-to-br from-[#FFFDF9] via-[#FAF6F0] to-[#F5EFEB] dark:from-[#11100D] dark:via-[#0D0C0A] dark:to-[#070605] p-6 sm:p-10 lg:p-14 shadow-[0_25px_60px_rgba(212,175,55,0.12)]">
          {/* Ambient Lighting Orbs */}
          <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-gradient-to-br from-amber-400/20 via-gold-400/15 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-gradient-to-tr from-amber-600/15 via-gold-500/10 to-transparent blur-3xl pointer-events-none" />

          {/* Corner Hallmark Ornament */}
          <div className="absolute top-4 right-6 hidden md:flex items-center space-x-2 text-[10px] font-mono tracking-widest text-[#B38728] dark:text-[#E8C574] opacity-80 uppercase">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>Atelier Vault • 3D Haute Joaillerie</span>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-5 space-y-6 text-left">
              {/* Pill Badge */}
              <div className="inline-flex items-center space-x-2 rounded-full px-4 py-1.5 bg-[#F4EDE2] dark:bg-[#1C1812] border border-[#D4AF37]/40 text-[#996515] dark:text-[#E8C574] text-[11px] font-mono font-bold uppercase tracking-widest shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-[#D4AF37] animate-pulse" />
                <span>Interactive 3D Jewellery Gallery</span>
              </div>

              {/* Display Heading */}
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1A1817] dark:text-[#F3EDE2] tracking-tight leading-[1.18]">
                Cinematic 3D Vault &amp;{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B38728] via-[#D4AF37] to-[#AA771C] dark:from-[#F3D78A] dark:via-[#D4AF37] dark:to-[#C69C3A]">
                  Interactive Gallery
                </span>
              </h2>

              {/* Refined Luxury Description */}
              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                Step inside our virtual atelier. Inspect uncut Polki facets, hand-crafted micro-pavé settings, and 24K gold vermeil finishes with responsive 360° interactive depth before ordering.
              </p>

              {/* High-End Craftsmanship Pillars */}
              <div className="grid grid-cols-2 gap-3.5 pt-2 text-xs font-mono text-stone-800 dark:text-stone-200">
                <div className="flex items-center space-x-2.5 bg-white/70 dark:bg-white/5 backdrop-blur-sm p-2.5 rounded-xl border border-[#D4AF37]/20">
                  <Gem className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span className="font-medium">360° Facet Inspection</span>
                </div>
                <div className="flex items-center space-x-2.5 bg-white/70 dark:bg-white/5 backdrop-blur-sm p-2.5 rounded-xl border border-[#D4AF37]/20">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span className="font-medium">100% Anti-Tarnish Gold</span>
                </div>
                <div className="flex items-center space-x-2.5 bg-white/70 dark:bg-white/5 backdrop-blur-sm p-2.5 rounded-xl border border-[#D4AF37]/20">
                  <Compass className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span className="font-medium">Interactive Tilt Physics</span>
                </div>
                <div className="flex items-center space-x-2.5 bg-white/70 dark:bg-white/5 backdrop-blur-sm p-2.5 rounded-xl border border-[#D4AF37]/20">
                  <Maximize2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span className="font-medium">Full-Screen Vault View</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-3 flex flex-wrap items-center gap-4">
                <Magnet padding={40} magnetStrength={3}>
                  <Link
                    href="/gallery"
                    className="inline-flex items-center space-x-2.5 rounded-full bg-gradient-to-r from-[#B38728] via-[#D4AF37] to-[#996515] hover:from-[#C69C3A] hover:to-[#B38728] px-7 py-3.5 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-stone-950 shadow-[0_12px_28px_rgba(212,175,55,0.35)] transition-all hover:scale-105 active:scale-95"
                  >
                    <Maximize2 className="h-4 w-4" />
                    <span>Open Gallery</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Magnet>

                <Link
                  href="/catalog"
                  className="inline-flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-[#996515] dark:text-[#E8C574] hover:underline py-3 px-2 group"
                >
                  <span>Explore All Jewellery</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right 3D Jewellery Image Showcase */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              {/* Category Switcher Tabs */}
              <div className="flex items-center justify-between gap-1.5 p-1.5 rounded-2xl bg-white/80 dark:bg-[#151310] border border-[#D4AF37]/30 shadow-sm overflow-x-auto no-scrollbar">
                {SHOWCASE_PIECES.map((piece, idx) => (
                  <button
                    key={piece.id}
                    onClick={() => {
                      setActiveIdx(idx);
                      setActiveHotspot(null);
                    }}
                    className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-[11px] font-mono font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-1.5 ${
                      activeIdx === idx
                        ? 'bg-gradient-to-r from-[#B38728] to-[#D4AF37] text-stone-950 shadow-[0_4px_12px_rgba(212,175,55,0.3)] scale-[1.02]'
                        : 'text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <span>{piece.category}</span>
                  </button>
                ))}
              </div>

              {/* 3D Floating Jewel Card */}
              <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden border-2 border-[#D4AF37]/40 bg-gradient-to-b from-[#14120F] via-[#0E0D0B] to-[#070605] shadow-[0_25px_60px_rgba(0,0,0,0.5)] select-none group"
                style={{ perspective: 1000 }}
              >
                {/* Dynamic Gemstone Atmospheric Ambient Glow */}
                <div
                  className="absolute inset-0 transition-all duration-700 pointer-events-none opacity-80"
                  style={{ background: activePiece.bgGlow }}
                />

                {/* Soft Reflective Dais Light */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[75%] h-24 bg-gradient-to-t from-gold-500/15 via-gold-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

                {/* Top Corner 3D Badge */}
                <div className="absolute top-4 left-4 z-20 flex items-center pointer-events-none">
                  <div className="rounded-full bg-black/75 backdrop-blur-md px-3.5 py-1.5 text-white border border-[#D4AF37]/35 flex items-center space-x-2 shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 text-[#E8C574]" />
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[#E8C574] uppercase">
                      3D Showcase • {activePiece.tag}
                    </span>
                  </div>
                </div>

                {/* Center 3D Floating Jewel with Responsive Tilt Physics */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePiece.id}
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      rotateX: mousePos.y,
                      rotateY: mousePos.x,
                    }}
                    exit={{ opacity: 0, scale: 0.9, y: -15 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                    className="absolute inset-0 flex items-center justify-center p-6 z-10"
                  >
                    <img
                      src={activePiece.src}
                      alt={activePiece.name}
                      className="max-h-[78%] max-w-[78%] object-contain drop-shadow-[0_22px_40px_rgba(0,0,0,0.9)] filter brightness-105 contrast-105 transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Interactive Hotspot Pins */}
                    {activePiece.hotspots.map((spot, hIdx) => {
                      const isOpen = activeHotspot === hIdx;
                      return (
                        <div
                          key={spot.title}
                          style={{ top: spot.top, left: spot.left }}
                          className="absolute z-30"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveHotspot(isOpen ? null : hIdx);
                          }}
                        >
                          <div className="relative group/spot">
                            <button
                              type="button"
                              className="w-6 h-6 rounded-full bg-[#D4AF37] text-stone-950 flex items-center justify-center shadow-[0_0_15px_#D4AF37] hover:scale-125 transition-transform animate-pulse"
                              aria-label={spot.title}
                            >
                              <Sparkles className="w-3 h-3" />
                            </button>

                            {/* Hotspot Tooltip */}
                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: 8, scale: 0.9 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 8, scale: 0.9 }}
                                  className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 p-2.5 rounded-xl bg-stone-950/95 backdrop-blur-md border border-[#D4AF37]/50 shadow-2xl text-left pointer-events-auto z-40"
                                >
                                  <p className="text-[11px] font-mono font-bold text-[#E8C574] leading-tight">
                                    {spot.title}
                                  </p>
                                  <p className="text-[10px] text-stone-300 mt-1 leading-snug font-sans">
                                    {spot.description}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>

                {/* Bottom Stage Details & Open Gallery CTA */}
                <Link
                  href="/gallery"
                  className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between p-3 rounded-2xl bg-black/80 backdrop-blur-md border border-[#D4AF37]/35 group/link hover:border-[#D4AF37] transition-all shadow-xl"
                >
                  <div className="text-left">
                    <p className="text-xs font-serif font-bold text-white tracking-wide">
                      {activePiece.name}
                    </p>
                    <p className="text-[10px] font-mono text-[#E8C574]/90 flex items-center gap-1.5">
                      <span>{activePiece.specs.join(' • ')}</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 rounded-full px-4 py-1.5 bg-gradient-to-r from-[#B38728] to-[#D4AF37] text-stone-950 text-[11px] font-mono font-bold uppercase tracking-wider shadow-md group-hover/link:scale-105 transition-transform">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Open Gallery</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default InteractiveGalleryBanner;


