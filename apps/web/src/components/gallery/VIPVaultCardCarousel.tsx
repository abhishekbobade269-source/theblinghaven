'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronUp, ChevronDown, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

export interface ShowcaseJewelryPiece {
  id: string;
  title: string;
  category: string;
  tag: string;
  price: string;
  image: string;
  metal: string;
  gemstones: string;
  craftsmanship: string;
  hallmark: string;
  link: string;
  edition: string;
}

// Authentic Haute Joaillerie Showcase Pieces from The Bling Haven
const JEWELRY_PIECES: ShowcaseJewelryPiece[] = [
  {
    id: 'piece-1',
    title: 'RINGS & SOLITAIRES',
    category: 'Solitaire Rings & Bands',
    tag: 'Collection 01 • Rings',
    price: '$1,250',
    image: '/gallery/processed/01_ring_transparent.png',
    metal: '22K Royal Yellow Gold (916 BIS)',
    gemstones: 'Hand-Cut Zambian Emerald & Brilliant Solitaires',
    craftsmanship: 'Hand-carved royal filigree gallery with micro-pavé band',
    hallmark: 'BIS 916 • HUID 8849 CERTIFIED',
    link: '/catalog?category=rings',
    edition: 'Edition 01 • Rings',
  },
  {
    id: 'piece-2',
    title: 'NECKLACES & SETS',
    category: 'Royal Bridal Necklaces',
    tag: 'Collection 02 • Necklaces',
    price: '$3,400',
    image: '/gallery/processed/02_necklace_transparent.png',
    metal: '24K Pure Gold Foil on Sterling Silver Base',
    gemstones: 'Uncut Polki Crystals & Natural Basra Pearls',
    craftsmanship: 'Traditional Mughal Jadau setting with Meenakari reverse enamel',
    hallmark: 'HERITAGE ARTISAN MASTERPIECE',
    link: '/catalog?category=bridal',
    edition: 'Edition 02 • Necklaces',
  },
  {
    id: 'piece-3',
    title: 'EARRINGS & CHANDELIERS',
    category: 'Haute Joaillerie Earrings',
    tag: 'Collection 03 • Earrings',
    price: '$1,850',
    image: '/gallery/processed/03_earrings_transparent.png',
    metal: '18K White Gold Finish',
    gemstones: 'Marquise-Cut Solitaires & Pear Emerald Teardrops',
    craftsmanship: 'Cascading multi-tier articulation engineered for fluid motion',
    hallmark: 'BIS 750 • 18K HALLMARKED',
    link: '/catalog?category=earrings',
    edition: 'Edition 03 • Earrings',
  },
  {
    id: 'piece-4',
    title: 'BANGLES & BRACELETS',
    category: 'Heritage Kada & Bangles',
    tag: 'Collection 04 • Bangles',
    price: '$2,100',
    image: '/gallery/processed/04_bangles_transparent.png',
    metal: '18K Two-Tone Gold',
    gemstones: '340+ Handset Brilliant-Cut Micro-Pavé Stones',
    craftsmanship: 'Intricate openwork lattice with concealed push-button safety clasp',
    hallmark: 'BIS 916 / 18K CERTIFIED',
    link: '/catalog?category=bangles',
    edition: 'Edition 04 • Bangles',
  },
  {
    id: 'piece-5',
    title: 'ROYAL CUSHION HALO RING',
    category: 'Solitaire Rings & Bands',
    tag: 'Collection 01 • Rings',
    price: '$1,680',
    image: '/uploads/rings_03526cf9_1s6a0179.jpg',
    metal: 'Platinum 950 & 18K Yellow Gold',
    gemstones: '2.8ct Cushion Violet Center with Dual Sapphire Halo',
    craftsmanship: 'Cathedral arch setting engineered for maximum fire and prismatic dispersion',
    hallmark: 'PLATINUM 950 • IGI CERTIFIED',
    link: '/catalog?category=rings',
    edition: 'Edition 05 • Rings',
  },
  {
    id: 'piece-6',
    title: 'DIAMOND LATTICE KADA',
    category: 'Heritage Kada & Bangles',
    tag: 'Collection 04 • Bangles',
    price: '$2,350',
    image: '/uploads/bangles_0a972019_1s6a9955.jpg',
    metal: '925 Sterling Silver with Anti-Tarnish Rhodium',
    gemstones: 'VVS Micro-Pavé Diamonds & Bezel Round Solitaires',
    craftsmanship: 'Double filigree lattice band with secure precision safety hinge',
    hallmark: '925 STERLING • ANTI-TARNISH',
    link: '/catalog?category=bangles',
    edition: 'Edition 06 • Bangles',
  },
];

export function VIPVaultCardCarousel() {
  const cardCount = JEWELRY_PIECES.length;
  const cardsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const frameId = useRef<number>(0);

  // Continuous progress & target progression for crisp button transitions
  const progress = useRef<number>(0);
  const targetProgress = useRef<number>(0);
  const isAnimatingToTarget = useRef<boolean>(false);

  // Track mouse coordinates for interactive 3D parallax tilt with inertia damping
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Responsive state containing card dimensions
  const [metrics, setMetrics] = useState({
    cardW: 390,
    cardH: 260,
  });

  // Current active index for indicator
  const [currentDisplayIndex, setCurrentDisplayIndex] = useState<number>(0);

  // Mouse move handler for 3D parallax tilt (does NOT affect scrolling)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const ry = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      mouse.current.targetX = Math.max(-1, Math.min(1, rx));
      mouse.current.targetY = Math.max(-1, Math.min(1, ry));
    };

    const handleMouseLeave = () => {
      mouse.current.targetX = 0;
      mouse.current.targetY = 0;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Responsive resize handler
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      let cardW = Math.round(w * 0.22 + 160);
      const heightFactor = Math.min(1.0, Math.max(0.7, h / 850));
      cardW = Math.round(cardW * heightFactor);
      cardW = Math.min(420, Math.max(280, cardW));
      const cardH = Math.round(cardW / 1.5);

      setMetrics({ cardW, cardH });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Left-side step button controls (Only scroll with these buttons)
  const stepCarousel = useCallback((direction: 'next' | 'prev') => {
    const step = direction === 'next' ? 1 : -1;
    const currentRounded = Math.round(progress.current);
    targetProgress.current = currentRounded + step;
    isAnimatingToTarget.current = true;
  }, []);

  // Left-side direct jump to piece
  const jumpToPiece = useCallback(
    (index: number) => {
      const currentRounded = Math.round(progress.current);
      const currentMod = ((currentRounded % cardCount) + cardCount) % cardCount;
      let diff = index - currentMod;
      if (diff > cardCount / 2) diff -= cardCount;
      if (diff < -cardCount / 2) diff += cardCount;
      targetProgress.current = currentRounded + diff;
      isAnimatingToTarget.current = true;
    },
    [cardCount]
  );

  // 60fps render loop
  const renderLoop = () => {
    // 1. Smoothly glide to target progress on button click
    if (isAnimatingToTarget.current) {
      const dist = targetProgress.current - progress.current;
      if (Math.abs(dist) < 0.001) {
        progress.current = targetProgress.current;
        isAnimatingToTarget.current = false;
      } else {
        progress.current += dist * 0.12; // buttery smooth 60fps ease
      }
    }

    // 2. Smooth mouse tilt interpolation
    mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.08;
    mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.08;

    const cards = cardsRefs.current;
    const h = window.innerHeight;
    const { cardH } = metrics;

    const continuousProgress = progress.current;
    const roundedIndex = Math.round(continuousProgress);
    const diffFromRound = continuousProgress - roundedIndex;

    // Magnetic step logic: gentle dwell at center front before fluid transition
    const easedDiff =
      (Math.sign(diffFromRound) * Math.pow(Math.abs(diffFromRound) * 2, 4.2)) / 2;
    const virtualActiveIndex = roundedIndex + easedDiff;

    // Update active index state for indicators
    const normalizedActive = ((roundedIndex % cardCount) + cardCount) % cardCount;
    if (normalizedActive !== currentDisplayIndex) {
      setCurrentDisplayIndex(normalizedActive);
    }

    for (let i = 0; i < cardCount; i++) {
      const card = cards[i];
      if (!card) continue;

      let offset = i - virtualActiveIndex;
      const halfCount = cardCount / 2;
      while (offset > halfCount) offset -= cardCount;
      while (offset < -halfCount) offset += cardCount;

      const absOffset = Math.abs(offset);
      const sign = Math.sign(offset);

      if (absOffset > 3.0) {
        card.style.visibility = 'hidden';
        continue;
      } else {
        card.style.visibility = 'visible';
      }

      const gap = 42;
      const peekAmount = -55;
      const D = 1350;

      let y = 0;
      let z = 0;
      let rot = 0;

      if (absOffset <= 1) {
        const t = absOffset;
        const easedT = t * t * (3 - 2 * t);
        const targetY = cardH + gap;
        y = -sign * (easedT * targetY);
        z = 400 + easedT * (220 - 400);
        rot = easedT * 132;
      } else if (absOffset <= 2) {
        const t = absOffset - 1;
        const easedT = t * t * (3 - 2 * t);
        const yStart = cardH + gap;
        const zStart = 220;
        const rotStart = 132;
        const zEnd = -60;
        const rotEnd = 175;

        const sEnd = D / (D - zEnd);
        const yEnd = (h / 2 - peekAmount) / sEnd - cardH / 2;

        const currentY = yStart + easedT * (yEnd - yStart);
        y = -sign * currentY;
        z = zStart + easedT * (zEnd - zStart);
        rot = rotStart + easedT * (rotEnd - rotStart);
      } else {
        const t = Math.min(absOffset - 2, 1);
        const easedT = t * t * (3 - 2 * t);
        const zStart = -60;
        const rotStart = 175;
        const zEnd3 = -250;
        const rotEnd3 = 195;

        const sEnd2 = D / (D - zStart);
        const yEnd2 = (h / 2 - peekAmount) / sEnd2 - cardH / 2;

        const sEnd3 = D / (D - zEnd3);
        const yEnd3 = (h / 2 + 100) / sEnd3 + cardH / 2;

        const currentY = yEnd2 + easedT * (yEnd3 - yEnd2);
        y = -sign * currentY;
        z = zStart + easedT * (zEnd3 - zStart);
        rot = rotStart + easedT * (rotEnd3 - rotStart);
      }

      const localCardRotation = -sign * rot;
      const centerFactor = Math.max(0, 1 - absOffset);

      const maxTiltY = 16;
      const maxTiltX = 12;

      const activeTiltX = -mouse.current.y * maxTiltX * centerFactor;
      const activeTiltY = mouse.current.x * maxTiltY * centerFactor;

      const totalRotX = localCardRotation + activeTiltX;
      const totalRotY = activeTiltY;

      card.style.zIndex = Math.round(z).toString();
      card.style.opacity = '1';

      card.style.transform = `translateY(${y.toFixed(2)}px) translateZ(${z.toFixed(2)}px) rotateX(${totalRotX.toFixed(2)}deg) rotateY(${totalRotY.toFixed(2)}deg) rotateZ(-2.5deg)`;
    }
  };

  useEffect(() => {
    const tick = () => {
      renderLoop();
      frameId.current = requestAnimationFrame(tick);
    };

    frameId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId.current);
  }, [metrics]);

  // Slices for 3D volumetric depth with dense parallel layering
  const thicknessLayers = [-1.8, -0.9, 0, 0.9, 1.8];

  return (
    <section
      id="vip-vault-cards-showcase"
      className="relative w-full h-[100dvh] min-h-[640px] max-h-[1350px] bg-[#000000] text-white flex items-center justify-center overflow-hidden select-none border-t border-amber-500/20"
      aria-label="The Bling Haven 3D Interactive Jewellery Showcase Cylinder"
    >
      {/* Subtle Atmospheric Top Navigation Bar */}
      <div className="absolute top-4 sm:top-6 inset-x-3 sm:inset-x-8 z-30 flex items-center justify-between max-w-7xl mx-auto pointer-events-auto">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider bg-black/85 text-amber-300 backdrop-blur-xl border border-amber-400/35 shadow-xl">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
            Maison Atelier • 3D Showcase Cylinder
          </span>
          <span className="hidden md:inline-flex items-center text-[10px] font-mono text-stone-400 tracking-wider">
            Navigate using left controls • Hover over cards to tilt
          </span>
        </div>

        {/* Scroll back up to Orbit View */}
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById('3d-orbit-showcase');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-black/85 hover:bg-black/95 border border-amber-400/35 text-stone-300 hover:text-amber-300 text-[10px] font-mono tracking-wider transition-all backdrop-blur-xl"
        >
          <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
          <span>RETURN TO ORBIT</span>
        </button>
      </div>

      {/* LEFT SIDE NAVIGATION CONTROLS (Only controls that rotate the cards) */}
      <div className="absolute left-4 sm:left-8 lg:left-14 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center space-y-3 pointer-events-auto">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => stepCarousel('prev')}
          aria-label="Previous Jewellery Piece"
          title="Previous Piece"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/80 hover:bg-amber-400 text-stone-300 hover:text-stone-950 border-2 border-amber-400/50 backdrop-blur-xl flex items-center justify-center transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.8)] hover:scale-108 active:scale-95 group focus:outline-none"
        >
          <ChevronUp
            className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-y-0.5 text-amber-300 group-hover:text-stone-950"
            strokeWidth={2.4}
          />
        </button>

        {/* Counter Badge */}
        <div className="flex flex-col items-center py-1 text-[11px] font-mono font-bold tracking-widest text-amber-300/90 select-none">
          <span>0{currentDisplayIndex + 1}</span>
          <span className="w-3.5 h-px bg-amber-400/40 my-1" />
          <span className="text-stone-500 text-[10px]">0{cardCount}</span>
        </div>

        {/* Vertical Step Dots */}
        <div className="flex flex-col space-y-2 py-1">
          {JEWELRY_PIECES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => jumpToPiece(idx)}
              aria-label={`Jump to piece ${idx + 1}`}
              title={`View Piece 0${idx + 1}`}
              className={`w-2 rounded-full transition-all duration-300 focus:outline-none ${
                idx === currentDisplayIndex
                  ? 'h-6 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]'
                  : 'h-2 bg-white/30 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => stepCarousel('next')}
          aria-label="Next Jewellery Piece"
          title="Next Piece"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/80 hover:bg-amber-400 text-stone-300 hover:text-stone-950 border-2 border-amber-400/50 backdrop-blur-xl flex items-center justify-center transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.8)] hover:scale-108 active:scale-95 group focus:outline-none"
        >
          <ChevronDown
            className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-y-0.5 text-amber-300 group-hover:text-stone-950"
            strokeWidth={2.4}
          />
        </button>
      </div>

      {/* 3D perspective camera space */}
      <div
        className="relative w-full h-full flex items-center justify-center pointer-events-none"
        style={{
          perspective: '1350px',
        }}
      >
        {/* Dynamic 3D coordinate viewport */}
        <div
          className="absolute"
          style={{
            width: `${metrics.cardW}px`,
            height: `${metrics.cardH}px`,
            transformStyle: 'preserve-3d',
          }}
        >
          {JEWELRY_PIECES.map((piece, i) => (
            <div
              key={piece.id}
              ref={(el) => {
                cardsRefs.current[i] = el;
              }}
              className="absolute inset-0 pointer-events-auto"
              style={{
                width: `${metrics.cardW}px`,
                height: `${metrics.cardH}px`,
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'visible',
              }}
            >
              {/* Physical 3D volumetric thickness by dense parallel layering */}
              {thicknessLayers.map((zOffset, layerIdx) => {
                const isFrontFace = layerIdx === thicknessLayers.length - 1;
                const isBackFace = layerIdx === 0;

                // Middle structural slice (Solid 18K/22K Gold Core Layer)
                if (!isFrontFace && !isBackFace) {
                  return (
                    <div
                      key={layerIdx}
                      className="absolute inset-0 rounded-[22px] border border-[#8a723e] pointer-events-none overflow-hidden"
                      style={{
                        backgroundColor: '#524326',
                        transform: `translateZ(${zOffset}px)`,
                      }}
                    />
                  );
                }

                // Front Face: Haute Joaillerie Showcase Plaque
                if (isFrontFace) {
                  return (
                    <div
                      key={layerIdx}
                      className="absolute inset-0 rounded-[22px] border border-amber-400/45 overflow-hidden"
                      style={{
                        background:
                          'radial-gradient(130% 130% at 50% 25%, rgba(32,24,16,0.98) 0%, rgba(15,12,10,0.99) 60%, rgba(6,5,4,1) 100%)',
                        transform: `translateZ(${zOffset}px)`,
                        backfaceVisibility: 'hidden',
                        boxShadow:
                          'inset 0 1px 2px rgba(251, 191, 36, 0.4), inset 0 0 35px rgba(0,0,0,0.7), 0 25px 50px -10px rgba(0, 0, 0, 0.95)',
                      }}
                    >
                      {/* Atmospheric golden radial spotlight behind the piece */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            'radial-gradient(circle at 50% 46%, rgba(251,191,36,0.22) 0%, rgba(217,119,6,0.08) 45%, transparent 72%)',
                        }}
                      />

                      {/* Content Layout */}
                      <div className="relative z-10 flex flex-col justify-between h-full p-4 sm:p-5 text-white">
                        {/* Card Header: Brand Crest & Archive Edition */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5">
                            {/* Royal Crown Crest */}
                            <svg
                              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
                            </svg>
                            <span className="font-serif text-[10.5px] sm:text-[12px] font-bold tracking-[0.18em] text-amber-200 uppercase">
                              The Bling Haven
                            </span>
                          </div>

                          <span className="text-[7.5px] sm:text-[8.5px] font-mono tracking-widest text-amber-300/90 uppercase px-2.5 py-0.5 rounded-full bg-black/70 border border-amber-400/30">
                            {piece.edition}
                          </span>
                        </div>

                        {/* Center: High-Resolution Authentic Jewellery Showcase (Larger Size) */}
                        <div className="relative flex-1 flex items-center justify-center my-0.5 group">
                          <div className="relative flex items-center justify-center max-h-[145px] sm:max-h-[165px] w-full">
                            <img
                              src={piece.image}
                              alt={piece.title}
                              draggable={false}
                              className={`max-h-[135px] sm:max-h-[155px] max-w-[90%] object-contain select-none transition-transform duration-500 group-hover:scale-108 ${
                                piece.image.endsWith('.jpg') || piece.image.endsWith('.jpeg')
                                  ? 'rounded-xl border border-amber-400/35 shadow-[0_10px_25px_rgba(0,0,0,0.85)]'
                                  : 'drop-shadow-[0_14px_28px_rgba(0,0,0,0.92)]'
                              }`}
                            />
                          </div>
                        </div>

                        {/* Card Footer: Category, Title, Hallmark & Price */}
                        <div className="flex items-end justify-between border-t border-amber-400/25 pt-2.5">
                          <div className="flex flex-col text-left">
                            <span className="text-[7px] sm:text-[8px] font-mono tracking-widest text-amber-400/90 uppercase font-semibold">
                              {piece.category}
                            </span>
                            <h3 className="font-serif text-[12px] sm:text-[14px] font-bold text-white tracking-wide uppercase leading-tight mt-0.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                              {piece.title}
                            </h3>
                            <span className="text-[7px] sm:text-[8px] font-mono text-stone-300 tracking-wider uppercase mt-0.5">
                              {piece.metal}
                            </span>
                          </div>

                          <div className="flex flex-col items-end">
                            <span className="text-xs sm:text-sm font-mono font-bold text-amber-300 tracking-tight">
                              {piece.price}
                            </span>
                            <span className="text-[7px] sm:text-[7.5px] font-mono tracking-widest text-white/70 uppercase">
                              BIS 916
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Back Face: Gemological Masterpiece Plaque
                if (isBackFace) {
                  return (
                    <div
                      key={layerIdx}
                      className="absolute inset-0 rounded-[22px] border border-amber-400/40 overflow-hidden shadow-2xl"
                      style={{
                        background:
                          'linear-gradient(145deg, rgba(24,18,14,0.99) 0%, rgba(12,10,8,1) 100%)',
                        transform: `translateZ(${zOffset}px) rotateX(180deg)`,
                        backfaceVisibility: 'hidden',
                        boxShadow:
                          'inset 0 1px 2px rgba(251, 191, 36, 0.3), inset 0 0 30px rgba(0,0,0,0.75), 0 25px 50px -10px rgba(0, 0, 0, 0.95)',
                      }}
                    >
                      {/* Content Layout */}
                      <div className="relative z-10 flex flex-col justify-between h-full p-4 sm:p-5 text-white">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-amber-400/25 pb-2">
                          <div className="flex items-center space-x-1.5 text-amber-300">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span className="text-[9.5px] sm:text-[10.5px] font-mono font-bold tracking-widest uppercase">
                              CRAFTSMANSHIP REPORT
                            </span>
                          </div>
                          <span className="text-[7.5px] sm:text-[8.5px] font-mono text-stone-300 tracking-wider uppercase">
                            {piece.hallmark}
                          </span>
                        </div>

                        {/* Specifications Grid */}
                        <div className="flex flex-col space-y-1.5 text-left py-1 font-mono text-[8px] sm:text-[9.5px]">
                          <div className="flex justify-between border-b border-white/10 pb-1">
                            <span className="text-stone-400 uppercase">PRECIOUS METAL</span>
                            <span className="text-amber-200 font-medium text-right max-w-[62%]">
                              {piece.metal}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-white/10 pb-1">
                            <span className="text-stone-400 uppercase">GEMSTONES</span>
                            <span className="text-stone-200 font-medium text-right max-w-[62%] line-clamp-1">
                              {piece.gemstones}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-400 uppercase">INLAY METHOD</span>
                            <span className="text-stone-200 font-medium text-right max-w-[62%] line-clamp-1">
                              {piece.craftsmanship}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Inquire & View Link */}
                        <div className="pt-2 border-t border-amber-400/25 flex items-center justify-between">
                          <div className="flex flex-col text-left">
                            <span className="text-[7px] sm:text-[7.5px] font-mono text-stone-400 uppercase">
                              VALUATION
                            </span>
                            <span className="text-xs sm:text-sm font-mono font-bold text-amber-300">
                              {piece.price}
                            </span>
                          </div>

                          <Link
                            href={piece.link}
                            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-[9px] sm:text-[10px] font-mono uppercase tracking-wider transition-all duration-200 shadow-md hover:scale-105 active:scale-95"
                          >
                            <span>DISCOVER PIECE</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default VIPVaultCardCarousel;
