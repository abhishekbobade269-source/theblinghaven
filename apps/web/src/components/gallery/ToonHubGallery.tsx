'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Sparkles, Gem, Play, Pause, Maximize2 } from 'lucide-react';

export interface GalleryItem {
  id: string;
  name?: string;
  title: string;
  src: string;
  bg: string;
  panel: string;
  headline: string;
  description: string;
  tag?: string;
  link: string;
}

// Exact character-figurine data matching the prompt specifications
export const TOONHUB_ITEMS: GalleryItem[] = [
  {
    id: 'toon-1',
    name: 'Blaze Mech',
    title: '3D SHAPE',
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png',
    bg: '#F4845F',
    panel: '#F79B7F',
    headline: 'TOONHUB FIGURINES',
    description:
      'The artwork is stunning, shipped fully prepared. The finish is a vision, the 3D craft is flawless. Many thanks! Wishing you the win. Order now.',
    tag: 'Figurine #001 • Edition 1/50',
    link: '#discover',
  },
  {
    id: 'toon-2',
    name: 'Verdant Rex',
    title: '3D SHAPE',
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png',
    bg: '#6BBF7A',
    panel: '#85CC92',
    headline: 'TOONHUB FIGURINES',
    description:
      'The artwork is stunning, shipped fully prepared. The finish is a vision, the 3D craft is flawless. Many thanks! Wishing you the win. Order now.',
    tag: 'Figurine #002 • Edition 1/50',
    link: '#discover',
  },
  {
    id: 'toon-3',
    name: 'Sakura Bloom',
    title: '3D SHAPE',
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png',
    bg: '#E882B4',
    panel: '#ED9DC4',
    headline: 'TOONHUB FIGURINES',
    description:
      'The artwork is stunning, shipped fully prepared. The finish is a vision, the 3D craft is flawless. Many thanks! Wishing you the win. Order now.',
    tag: 'Figurine #003 • Edition 1/50',
    link: '#discover',
  },
  {
    id: 'toon-4',
    name: 'Azure Frost',
    title: '3D SHAPE',
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png',
    bg: '#6EB5FF',
    panel: '#8DC4FF',
    headline: 'TOONHUB FIGURINES',
    description:
      'The artwork is stunning, shipped fully prepared. The finish is a vision, the 3D craft is flawless. Many thanks! Wishing you the win. Order now.',
    tag: 'Figurine #004 • Edition 1/50',
    link: '#discover',
  },
];

// Luxury Haute Joaillerie edition for The Bling Haven gallery integration
export const JEWELRY_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'jewel-1',
    name: 'The Grand Imperial Solitaire',
    title: 'DIAMOND',
    src: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
    bg: '#141419',
    panel: '#24242E',
    headline: 'SOLITAIRE ARCHIVE',
    description:
      'A masterclass in light dispersion. Handcrafted 3.5ct AAA+ brilliant cut solitaire crowned with 18K solid white gold six-prong cathedral architecture.',
    tag: 'Haute Joaillerie • Certified VVS1',
    link: '/catalog?category=rings',
  },
  {
    id: 'jewel-2',
    name: 'Verdant Empress Emerald',
    title: 'EMERALD',
    src: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
    bg: '#0D211A',
    panel: '#18382D',
    headline: 'ROYAL HEIRLOOMS',
    description:
      'Vivid Colombian emerald cabochon embraced by 22K micro-gold filigree prongs, radiating sovereign majesty and timeless bespoke elegance.',
    tag: 'Royal Vault • 22K Micro Gold',
    link: '/catalog?category=bridal',
  },
  {
    id: 'jewel-3',
    name: 'Celestial Sapphire Parure',
    title: 'SAPPHIRE',
    src: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85',
    bg: '#10192A',
    panel: '#1C2945',
    headline: 'SAPPHIRE SUITE',
    description:
      'Deep Kashmir midnight blue sapphire cascading into diamond clusters. Certified conflict-free Canadian artisanal refinement.',
    tag: 'Maison Masterpiece 2026',
    link: '/catalog?category=earrings',
  },
  {
    id: 'jewel-4',
    name: 'Champagne Rose Atelier Cuff',
    title: 'ROSE GOLD',
    src: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85',
    bg: '#25151D',
    panel: '#3D2230',
    headline: 'ROSE GOLD ATELIER',
    description:
      'Scintillating Austrian crystal droplets pavé-set over an articulated 18K champagne rose gold bangle with double-locking concealment.',
    tag: 'Signature Atelier • Limited Run',
    link: '/catalog?category=bangles',
  },
];

interface ToonHubGalleryProps {
  initialItems?: GalleryItem[];
  allowModeSwitch?: boolean;
}

export function ToonHubGallery({
  initialItems = TOONHUB_ITEMS,
  allowModeSwitch = true,
}: ToonHubGalleryProps) {
  const [mode, setMode] = useState<'toonhub' | 'jewelry'>('toonhub');
  const items = mode === 'toonhub' ? TOONHUB_ITEMS : JEWELRY_GALLERY_ITEMS;

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isAutoplay, setIsAutoplay] = useState<boolean>(false);
  const [mouseOffset, setMouseOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Touch gesture tracking
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Preload all 4 images on mount
  useEffect(() => {
    [...TOONHUB_ITEMS, ...JEWELRY_GALLERY_ITEMS].forEach((item) => {
      const img = new Image();
      img.src = item.src;
    });
  }, []);

  // Handle responsive resize (mobile threshold: 640px)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigation logic with 650ms lock
  const navigate = useCallback(
    (direction: 'next' | 'prev') => {
      if (isAnimating) return;
      setIsAnimating(true);
      setActiveIndex((prev) => {
        return direction === 'next' ? (prev + 1) % 4 : (prev + 3) % 4;
      });
      setTimeout(() => {
        setIsAnimating(false);
      }, 650);
    },
    [isAnimating]
  );

  // Jump to specific index directly (improvised feature)
  const jumpToIndex = useCallback(
    (targetIndex: number) => {
      if (isAnimating || targetIndex === activeIndex) return;
      setIsAnimating(true);
      setActiveIndex(targetIndex);
      setTimeout(() => {
        setIsAnimating(false);
      }, 650);
    },
    [isAnimating, activeIndex]
  );

  // Keyboard navigation (ArrowLeft, ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        navigate('next');
      } else if (e.key === 'ArrowLeft') {
        navigate('prev');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Autoplay support with pause on hover
  useEffect(() => {
    if (!isAutoplay) return;
    const interval = setInterval(() => {
      navigate('next');
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoplay, navigate]);

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    const diffY = e.changedTouches[0].clientY - (touchStartY.current || 0);

    // Horizontal swipe must be stronger than vertical scroll
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        navigate('next');
      } else {
        navigate('prev');
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Subtle 3D mouse parallax on center figurine
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x: x * 18, y: y * 18 });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  // Derive roles from activeIndex
  const getRole = (index: number): 'center' | 'left' | 'right' | 'back' => {
    if (index === activeIndex) return 'center';
    if (index === (activeIndex + 3) % 4) return 'left';
    if (index === (activeIndex + 1) % 4) return 'right';
    return 'back';
  };

  const currentItem = items[activeIndex];

  return (
    <div
      style={{
        backgroundColor: currentItem.bg,
        transition: 'background-color 650ms cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: "'Inter', sans-serif",
      }}
      className="relative w-full overflow-hidden select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Interactive 3D Carousel Gallery"
    >
      <div className="relative w-full h-[100vh] min-h-[600px] overflow-hidden">
        {/* 1. Grain Overlay (SVG fractalNoise data URI) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 50,
            opacity: 0.4,
            backgroundImage: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='noiseFilter'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23noiseFilter)' opacity='0.08'/></svg>")`,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
          }}
        />

        {/* 2. Giant Ghost Text "3D SHAPE" */}
        <div
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none"
          style={{
            zIndex: 2,
            top: isMobile ? '16%' : '18%',
          }}
        >
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(90px, 28vw, 380px)',
              fontWeight: 900,
              color: 'rgba(255, 255, 255, 1)',
              opacity: 1,
              lineHeight: 1,
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
              filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.08))',
              transition: 'transform 650ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {currentItem.title}
          </span>
        </div>

        {/* 3. Top Header Bar: Brand Label + Improvised Mode Switcher */}
        <header
          className="absolute top-6 left-4 right-4 sm:left-8 sm:right-8 flex items-center justify-between"
          style={{ zIndex: 60 }}
        >
          {/* Top-left brand label "TOONHUB" */}
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
              {mode === 'toonhub' ? 'TOONHUB' : 'THE BLING HAVEN'}
            </span>
            {currentItem.tag && (
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/15 text-white backdrop-blur-md border border-white/20">
                {currentItem.tag}
              </span>
            )}
          </div>

          {/* Improvised Controls: Mode Switcher & Autoplay */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {allowModeSwitch && (
              <div className="flex items-center p-0.5 rounded-full bg-black/25 backdrop-blur-md border border-white/20">
                <button
                  type="button"
                  onClick={() => {
                    setMode('toonhub');
                    setActiveIndex(0);
                  }}
                  className={`px-3 py-1 text-[11px] font-bold rounded-full transition-all duration-200 ${
                    mode === 'toonhub'
                      ? 'bg-white text-obsidian-950 shadow-md'
                      : 'text-white/75 hover:text-white'
                  }`}
                >
                  TOONHUB 3D
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('jewelry');
                    setActiveIndex(0);
                  }}
                  className={`px-3 py-1 text-[11px] font-bold rounded-full transition-all duration-200 flex items-center space-x-1 ${
                    mode === 'jewelry'
                      ? 'bg-gradient-to-r from-amber-400 to-amber-200 text-obsidian-950 shadow-md'
                      : 'text-white/75 hover:text-white'
                  }`}
                >
                  <Gem className="w-3 h-3 mr-1 inline" />
                  <span>VAULT</span>
                </button>
              </div>
            )}

            {/* Autoplay toggle */}
            <button
              type="button"
              onClick={() => setIsAutoplay((prev) => !prev)}
              title={isAutoplay ? 'Pause Carousel' : 'Autoplay Carousel'}
              className="p-2 rounded-full bg-black/20 hover:bg-black/35 text-white/80 hover:text-white border border-white/20 backdrop-blur-md transition-all duration-150"
            >
              {isAutoplay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>
        </header>

        {/* 4. The 3D Carousel Viewport */}
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          {items.map((item, index) => {
            const role = getRole(index);

            // Compute precise role-based transformations matching specification
            let transform = 'translateX(-50%) scale(1)';
            let filter = 'blur(0px)';
            let opacity = 1;
            let zIndex = 10;
            let left = '50%';
            let height = isMobile ? '60%' : '92%';
            let bottom = isMobile ? '22%' : '0%';
            let pointerEvents: 'auto' | 'none' = 'none';
            let cursor = 'default';

            if (role === 'center') {
              const scale = isMobile ? 1.25 : 1.68;
              // Center item includes subtle interactive mouse tilt
              const tiltX = mouseOffset.x * 0.15;
              const tiltY = -mouseOffset.y * 0.15;
              transform = `translateX(-50%) perspective(1000px) rotateY(${tiltX}deg) rotateX(${tiltY}deg) scale(${scale})`;
              filter = 'blur(0px)';
              opacity = 1;
              zIndex = 20;
              left = '50%';
              height = isMobile ? '60%' : '92%';
              bottom = isMobile ? '22%' : '0%';
              pointerEvents = 'auto';
            } else if (role === 'left') {
              transform = 'translateX(-50%) scale(1)';
              filter = 'blur(2px)';
              opacity = 0.85;
              zIndex = 10;
              left = isMobile ? '20%' : '30%';
              height = isMobile ? '16%' : '28%';
              bottom = isMobile ? '32%' : '12%';
              pointerEvents = 'auto';
              cursor = 'pointer';
            } else if (role === 'right') {
              transform = 'translateX(-50%) scale(1)';
              filter = 'blur(2px)';
              opacity = 0.85;
              zIndex = 10;
              left = isMobile ? '80%' : '70%';
              height = isMobile ? '16%' : '28%';
              bottom = isMobile ? '32%' : '12%';
              pointerEvents = 'auto';
              cursor = 'pointer';
            } else if (role === 'back') {
              transform = 'translateX(-50%) scale(1)';
              filter = 'blur(4px)';
              opacity = 1;
              zIndex = 5;
              left = '50%';
              height = isMobile ? '13%' : '22%';
              bottom = isMobile ? '32%' : '12%';
              pointerEvents = 'none';
            }

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (role === 'left') navigate('prev');
                  if (role === 'right') navigate('next');
                }}
                style={{
                  position: 'absolute',
                  aspectRatio: '0.6 / 1',
                  transform,
                  filter,
                  opacity,
                  zIndex,
                  left,
                  height,
                  bottom,
                  pointerEvents,
                  cursor,
                  transition:
                    'transform 650ms cubic-bezier(0.4, 0, 0.2, 1), filter 650ms cubic-bezier(0.4, 0, 0.2, 1), opacity 650ms cubic-bezier(0.4, 0, 0.2, 1), left 650ms cubic-bezier(0.4, 0, 0.2, 1), bottom 650ms cubic-bezier(0.4, 0, 0.2, 1), height 650ms cubic-bezier(0.4, 0, 0.2, 1)',
                  willChange: 'transform, filter, opacity, left, bottom, height',
                }}
                className="transition-all duration-650 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none"
                role="group"
                aria-roledescription="slide"
                aria-label={`${item.name || item.headline} (${role})`}
              >
                {/* Figurine / Masterpiece Image Container */}
                <img
                  src={item.src}
                  alt={item.name || item.headline}
                  draggable={false}
                  className="w-full h-full object-contain object-bottom select-none drop-shadow-[0_25px_35px_rgba(0,0,0,0.35)]"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'bottom center',
                  }}
                />

                {/* Micro-indicator when hovering preview cards */}
                {(role === 'left' || role === 'right') && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/20 text-white backdrop-blur-md border border-white/30">
                      {role === 'left' ? '← PREV' : 'NEXT →'}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 5. Bottom-Left Text & Navigation Buttons */}
        <div
          className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24"
          style={{ zIndex: 60, maxWidth: '320px' }}
        >
          {/* Active number ticker (Improvised) */}
          <div className="flex items-center space-x-2 mb-2 text-xs font-mono font-bold tracking-widest text-white/70">
            <span>0{activeIndex + 1}</span>
            <span className="text-white/30">/</span>
            <span>0{items.length}</span>
            <span className="text-white/40">•</span>
            <span className="text-white/80">{currentItem.name}</span>
          </div>

          {/* Headline */}
          <p
            className="mb-2 sm:mb-3 text-base sm:text-[22px] font-bold uppercase text-white/95"
            style={{ letterSpacing: '0.02em', lineHeight: 1.15 }}
          >
            {currentItem.headline}
          </p>

          {/* Body description (hidden on mobile) */}
          <p className="hidden sm:block text-xs sm:text-sm text-white/85 mb-4 sm:mb-5 leading-[1.6]">
            {currentItem.description}
          </p>

          {/* Navigation Controls: Two Circular Buttons */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => navigate('prev')}
              disabled={isAnimating}
              aria-label="Previous Item"
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-transparent border-2 border-white text-white flex items-center justify-center transition-all duration-150 hover:scale-[1.08] hover:bg-white/15 active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <ArrowLeft size={26} strokeWidth={2.25} />
            </button>

            <button
              type="button"
              onClick={() => navigate('next')}
              disabled={isAnimating}
              aria-label="Next Item"
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-transparent border-2 border-white text-white flex items-center justify-center transition-all duration-150 hover:scale-[1.08] hover:bg-white/15 active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <ArrowRight size={26} strokeWidth={2.25} />
            </button>

            {/* Quick-jump Dots Indicator (Improvised) */}
            <div className="flex items-center space-x-1.5 ml-2">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => jumpToIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === activeIndex
                      ? 'w-6 bg-white'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Jump to item ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 6. Bottom-Right Link "DISCOVER IT" */}
        <div
          className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10"
          style={{ zIndex: 60 }}
        >
          <Link
            href={currentItem.link}
            className="group flex items-center space-x-2 text-white/95 hover:text-white transition-opacity duration-200 no-underline focus:outline-none"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(20px, 4vw, 56px)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              textTransform: 'uppercase',
            }}
          >
            <span className="group-hover:tracking-tight transition-all duration-200">
              DISCOVER IT
            </span>
            <ArrowRight
              className="w-5 h-5 sm:w-8 sm:h-8 transition-transform duration-200 group-hover:translate-x-1.5"
              strokeWidth={2.25}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ToonHubGallery;
