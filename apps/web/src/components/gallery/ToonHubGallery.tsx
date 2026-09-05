'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Gem,
  Play,
  Pause,
  Maximize2,
  Eye,
  Layers,
  Compass,
  ShoppingBag,
  Check,
  Info,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  Film,
  Image as ImageIcon,
} from 'lucide-react';

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

export interface PinpointItem {
  id: string;
  galleryIndex: number;
  title: string;
  category: string;
  price: string;
  craftsmanship: string;
  top: string;
  left: string;
  src: string;
  link: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
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

// Luxury Haute Joaillerie edition for The Bling Haven gallery integration (Indian English theme)
export const JEWELRY_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'jewel-1',
    name: 'ANGOOTHI',
    title: 'ANGOOTHI',
    src: '/gallery/processed/01_ring_transparent.png',
    bg: '#0B231A',
    panel: '#153C2D',
    headline: 'ANGOOTHI (RINGS)',
    description:
      'Handcrafted 22K royal yellow gold filigree setting adorned with uncut polki diamonds, crowned by a breathtaking octagonal-cut Zambian emerald centerpiece.',
    tag: 'Collection 01 • Angoothi',
    link: '/catalog?category=rings',
  },
  {
    id: 'jewel-2',
    name: 'CHOKER',
    title: 'CHOKER',
    src: '/gallery/processed/02_necklace_transparent.png',
    bg: '#211812',
    panel: '#36281E',
    headline: 'GULBANDH (CHOKER)',
    description:
      'Opulent handcrafted crescent Kundan choker accompanied by matching chandbalis, strung with lustrous natural freshwater pearl drops and vibrant emerald cabochons.',
    tag: 'Collection 02 • Bridal Choker',
    link: '/catalog?category=bridal',
  },
  {
    id: 'jewel-3',
    name: 'CHANDBALIS',
    title: 'CHANDBALIS',
    src: '/gallery/processed/03_earrings_transparent.png',
    bg: '#0F2018',
    panel: '#193629',
    headline: 'CHANDBALIS (EARRINGS)',
    description:
      '18K white gold architectural chandelier chandbalis featuring cascading marquise-cut diamonds crowned with twin luminous pear-cut emerald teardrops.',
    tag: 'Collection 03 • Chandbalis',
    link: '/catalog?category=earrings',
  },
  {
    id: 'jewel-4',
    name: 'KADAS',
    title: 'KADAS',
    src: '/gallery/processed/04_bangles_transparent.png',
    bg: '#171720',
    panel: '#282736',
    headline: 'KADAS (BANGLES)',
    description:
      'Intricate openwork lattice royal kadas encrusted with handset micro-pavé diamonds and bezel-set brilliant accent solitaires with concealed safety locks.',
    tag: 'Collection 04 • Royal Kadas',
    link: '/catalog?category=bangles',
  },
];

// Interactive radar pinpoints on the royal model image (Indian English theme)
export const ROYAL_LOOK_PINPOINTS: PinpointItem[] = [
  {
    id: 'pin-ring',
    galleryIndex: 0,
    title: 'Imperial Emerald Angoothi',
    category: 'Solitaire Statement Angoothi',
    price: '$1,250',
    craftsmanship: '22K Gold Filigree • Uncut Polki Diamonds • Hand-set Zambian Emerald',
    top: '48.5%',
    left: '43.2%',
    src: '/gallery/processed/01_ring_transparent.png',
    link: '/catalog?category=rings',
    placement: 'left',
  },
  {
    id: 'pin-necklace',
    galleryIndex: 1,
    title: 'Shahi Polki Emerald Choker',
    category: 'Bridal Gulbandh Choker Set',
    price: '$2,450',
    craftsmanship: 'Handcrafted Kundan Karigari • Colombian Pear-Cut Centerpiece • Natural Pearl Fringe',
    top: '63.2%',
    left: '52.0%',
    src: '/gallery/processed/02_necklace_transparent.png',
    link: '/catalog?category=bridal',
    placement: 'bottom',
  },
  {
    id: 'pin-earrings',
    galleryIndex: 2,
    title: 'Cascading Emerald Chandbalis',
    category: 'Shahi Chandbali Jhumkas',
    price: '$1,890',
    craftsmanship: '18K White Gold Finish • Marquise Jadau Arches • Handcrafted Emerald Drops',
    top: '36.5%',
    left: '58.7%',
    src: '/gallery/processed/03_earrings_transparent.png',
    link: '/catalog?category=earrings',
    placement: 'right',
  },
  {
    id: 'pin-bangles',
    galleryIndex: 3,
    title: 'Heritage Micro-Pavé Kadas',
    category: 'Openwork Diamond Kadas',
    price: '$2,100',
    craftsmanship: 'Handset Micro-Pavé Solitaires • Anti-Tarnish Polish • Concealed Safety Lock',
    top: '87.5%',
    left: '36.0%',
    src: '/gallery/processed/04_bangles_transparent.png',
    link: '/catalog?category=bangles',
    placement: 'top',
  },
];

interface ToonHubGalleryProps {
  initialItems?: GalleryItem[];
  allowModeSwitch?: boolean;
  defaultView?: 'orbit' | 'lookbook';
}

export function ToonHubGallery({
  initialItems = JEWELRY_GALLERY_ITEMS,
  allowModeSwitch = false,
  defaultView = 'lookbook',
}: ToonHubGalleryProps) {
  const [viewMode, setViewMode] = useState<'orbit' | 'lookbook'>(defaultView);
  const [activePinpoint, setActivePinpoint] = useState<PinpointItem | null>(null);
  const [mediaMode, setMediaMode] = useState<'video' | 'still'>('video');
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const toggleVideoPlayback = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  const toggleVideoMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsVideoMuted(videoRef.current.muted);
  };

  const [mode, setMode] = useState<'toonhub' | 'jewelry'>('jewelry');
  const items = mode === 'jewelry' ? JEWELRY_GALLERY_ITEMS : TOONHUB_ITEMS;

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

  // Smooth scroll helper to jump down to 3D Orbit
  const scrollToOrbit = (targetIndex?: number) => {
    if (typeof targetIndex === 'number') {
      setActiveIndex(targetIndex);
    }
    const el = document.getElementById('3d-orbit-showcase');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Smooth scroll helper to jump back up to Model Lookbook
  const scrollToLookbook = () => {
    const el = document.getElementById('royal-model-lookbook');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full overflow-x-hidden select-none bg-[#120F0C] text-white">
      {/* ==================================================================== */}
      {/* SECTION 1 (TOP): FULL-SCREEN ROYAL MODEL CINEMATIC FILM & INSPECTION */}
      {/* ==================================================================== */}
      <section
        id="royal-model-lookbook"
        className="relative w-full h-[100dvh] min-h-[520px] max-h-[1400px] overflow-hidden select-none bg-black border-b border-amber-500/20"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* FULL-SCREEN CINEMATIC MEDIA LAYER */}
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
          {mediaMode === 'video' ? (
            <video
              ref={videoRef}
              src="/gallery/model_royal_jewelry_video.mp4"
              autoPlay
              loop
              playsInline
              muted={isVideoMuted}
              className="w-full h-full object-cover select-none"
              style={{
                transform: 'scale(1.1) translate(2.5%, 0)',
                transformOrigin: 'center center',
              }}
            />
          ) : (
            <img
              src="/gallery/model_royal_jewelry.jpeg"
              alt="Royal Indian Model Adorned in The Bling Haven Haute Joaillerie"
              className="w-full h-full object-cover select-none"
              draggable={false}
            />
          )}

          {/* Cinematic Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/85 pointer-events-none" />
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        </div>

        {/* 1. Floating Sub-Bar Overlay (Positioned below the transparent main nav bar) */}
        <div className="absolute top-18 sm:top-22 lg:top-24 inset-x-3 sm:inset-x-6 lg:inset-x-8 z-40 flex flex-wrap items-center justify-between gap-2 sm:gap-3 max-w-7xl mx-auto pointer-events-auto">
          {/* Left: Lookbook Badge & Cinema Camera Spec */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-black/70 text-amber-300 backdrop-blur-xl border border-amber-400/40 shadow-xl">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              Shahi Palace Alcove Lookbook
            </span>
            <span className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-mono text-white/90 bg-black/60 backdrop-blur-md border border-white/20 shadow-md">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-1.5" />
              ARRI ALEXA 65 • 24FPS
            </span>
          </div>

          {/* Right: Media Switcher, Orbit Jump & Playback Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* 8K Motion Film vs Interactive Pinpoints Toggle */}
            <div className="flex items-center p-1 rounded-full bg-black/70 backdrop-blur-xl border border-amber-400/40 shadow-xl">
              <button
                type="button"
                onClick={() => setMediaMode('video')}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 ${
                  mediaMode === 'video'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 shadow-md scale-105'
                    : 'text-stone-300 hover:text-white'
                }`}
                aria-label="View 8K Cinematic Motion Film"
              >
                <Film className="w-3.5 h-3.5" />
                <span>8K FILM</span>
              </button>

              <button
                type="button"
                onClick={() => setMediaMode('still')}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 ${
                  mediaMode === 'still'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 shadow-md scale-105'
                    : 'text-stone-300 hover:text-white'
                }`}
                aria-label="View Interactive Jewellery Radar Pinpoints"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>PINPOINTS</span>
              </button>
            </div>

            {/* Video Playback & Sound Controls (if video mode) */}
            {mediaMode === 'video' && (
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={toggleVideoPlayback}
                  className="p-2 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-xl border border-white/25 text-white transition-all hover:scale-105 shadow-md"
                  title={isVideoPlaying ? 'Pause Video' : 'Play Video'}
                  aria-label={isVideoPlaying ? 'Pause Video' : 'Play Video'}
                >
                  {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={toggleVideoMute}
                  className="p-2 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-xl border border-white/25 text-white transition-all hover:scale-105 shadow-md"
                  title={isVideoMuted ? 'Unmute Audio' : 'Mute Audio'}
                  aria-label={isVideoMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {isVideoMuted ? <VolumeX className="w-3.5 h-3.5 text-stone-400" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              </div>
            )}

            {/* Quick jump down to Gallery Carousel */}
            <button
              type="button"
              onClick={() => scrollToOrbit()}
              className="inline-flex items-center space-x-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-black/70 hover:bg-black/90 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-xl shadow-lg active:scale-95 transition-all"
            >
              <Gem className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">EXPLORE GALLERY</span>
              <span className="sm:hidden">GALLERY</span>
              <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
        </div>

        {/* 2. Overlays Specific to Mode */}
        {mediaMode === 'video' ? (
          <>



            {/* Switch to interactive pinpoints prompt */}
            <button
              type="button"
              onClick={() => setMediaMode('still')}
              className="hidden sm:flex absolute bottom-[105px] left-8 z-30 px-3.5 py-1.5 rounded-full bg-black/65 hover:bg-black/85 backdrop-blur-xl border border-amber-400/40 text-xs font-mono text-amber-300 items-center space-x-1.5 transition-all hover:scale-105 shadow-lg"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Inspect Radar Pinpoints →</span>
            </button>
          </>
        ) : (
          /* ========================================================== */
          /* FULL-SCREEN INTERACTIVE RADAR PINPOINTS OVER MODEL        */
          /* ========================================================== */
          <>
            {ROYAL_LOOK_PINPOINTS.map((pin) => {
              const isSelected = activePinpoint?.id === pin.id;

              return (
                <div
                  key={pin.id}
                  style={{
                    position: 'absolute',
                    top: pin.top,
                    left: pin.left,
                    transform: 'translate(-50%, -50%)',
                    zIndex: isSelected ? 45 : 30,
                  }}
                  className="group"
                >
                  {/* Interactive Radar Hotspot */}
                  <button
                    type="button"
                    onClick={() => setActivePinpoint(isSelected ? null : pin)}
                    onMouseEnter={() => setActivePinpoint(pin)}
                    aria-label={`Inspect ${pin.title}`}
                    className="relative flex items-center justify-center p-2 focus:outline-none"
                  >
                    {/* Outer Pulsing Ping Ring */}
                    <span
                      className={`absolute inline-flex h-9 w-9 rounded-full bg-amber-400/50 ${
                        isSelected ? 'animate-ping opacity-90' : 'opacity-40 group-hover:animate-ping'
                      }`}
                    />

                    {/* Middle Glowing Ring */}
                    <span
                      className={`relative inline-flex rounded-full transition-all duration-300 ${
                        isSelected
                          ? 'h-5 w-5 bg-gradient-to-r from-amber-400 to-yellow-300 ring-4 ring-amber-300/60 shadow-[0_0_20px_#f59e0b]'
                          : 'h-4 w-4 bg-amber-400/90 ring-2 ring-white/70 group-hover:ring-amber-300 group-hover:scale-125'
                      }`}
                    >
                      <span className="m-auto block h-1.5 w-1.5 rounded-full bg-black/80" />
                    </span>

                    {/* Pill Tag Next to Pinpoint */}
                    <span
                      className={`ml-2 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold tracking-wider uppercase transition-all duration-200 pointer-events-none whitespace-nowrap ${
                        isSelected
                          ? 'bg-amber-400 text-stone-950 shadow-lg scale-105'
                          : 'bg-black/70 text-white/95 backdrop-blur-md border border-white/25 group-hover:bg-black/90'
                      }`}
                    >
                      {pin.title.split(' ')[0]}
                    </span>
                  </button>

                  {/* FLOATING LUXURY INSPECTION POPOVER CARD */}
                  {isSelected && (
                    <div
                      style={{
                        position: 'absolute',
                        zIndex: 50,
                        width: '280px',
                        ...(pin.placement === 'left'
                          ? { right: '110%', top: '50%', transform: 'translateY(-50%)' }
                          : pin.placement === 'right'
                          ? { left: '110%', top: '50%', transform: 'translateY(-50%)' }
                          : pin.placement === 'top'
                          ? { bottom: '110%', left: '50%', transform: 'translateX(-50%)' }
                          : { top: '110%', left: '50%', transform: 'translateX(-50%)' }),
                      }}
                      className="rounded-2xl p-4 bg-[#0e0c0a]/95 text-white backdrop-blur-2xl border border-amber-400/50 shadow-[0_25px_50px_rgba(0,0,0,0.95)] transition-all animate-in fade-in zoom-in-95 duration-200"
                    >
                      {/* Category & Price */}
                      <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                        <span className="font-mono text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                          {pin.category}
                        </span>
                        <span className="font-mono font-extrabold text-white text-sm">
                          {pin.price}
                        </span>
                      </div>

                      {/* Image & Title */}
                      <div className="flex items-center space-x-3 py-3">
                        <div className="w-14 h-14 rounded-xl bg-white/5 p-1 border border-white/10 shrink-0 flex items-center justify-center">
                          <img
                            src={pin.src}
                            alt={pin.title}
                            className="w-full h-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                          />
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-sm text-stone-100 leading-tight">
                            {pin.title}
                          </h4>
                          <p className="text-[11px] text-stone-300 font-sans mt-0.5 line-clamp-2">
                            {pin.craftsmanship}
                          </p>
                        </div>
                      </div>

                      {/* Actions: Jump to Gallery or Shop */}
                      <div className="flex items-center space-x-2 pt-2.5 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => scrollToOrbit(pin.galleryIndex)}
                          className="flex-1 py-2 px-2.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-stone-950 text-[11px] font-mono font-extrabold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all shadow-md active:scale-95"
                        >
                          <Gem className="w-3.5 h-3.5" />
                          <span>View in Gallery ↓</span>
                        </button>

                        <Link
                          href={pin.link}
                          className="py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono font-bold uppercase tracking-wider flex items-center justify-center transition-all"
                        >
                          <span>Shop</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Instruction Banner in Pinpoints Mode */}
            <div className="absolute bottom-[90px] sm:bottom-[105px] left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/75 backdrop-blur-xl border border-white/25 text-xs font-mono text-white/90 flex items-center space-x-2 pointer-events-none shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Tap or hover over any glowing gold radar point to inspect piece</span>
            </div>
          </>
        )}

        {/* 3. Floating Bottom Controls: Ensemble Bar & Scroll Cue */}
        <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 inset-x-3 sm:inset-x-4 z-40 flex flex-col items-center gap-1.5 sm:gap-2 max-w-4xl mx-auto pointer-events-auto">
          {/* Ensemble Bar */}
          <div className="w-full p-1.5 sm:p-2 rounded-2xl bg-black/70 backdrop-blur-xl border border-amber-400/25 shadow-2xl flex items-center justify-between gap-1.5 sm:gap-2">
            <span className="hidden md:inline-block text-[10px] lg:text-[11px] font-mono font-bold text-amber-400 tracking-widest uppercase pl-3 shrink-0">
              SHAHI TROUSSEAU:
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2 w-full justify-around overflow-x-auto py-0.5">
              {ROYAL_LOOK_PINPOINTS.map((pin) => {
                const isSelected = activePinpoint?.id === pin.id;
                return (
                  <button
                    key={pin.id}
                    type="button"
                    onClick={() => {
                      setActivePinpoint(pin);
                      scrollToOrbit(pin.galleryIndex);
                    }}
                    className={`flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl text-xs transition-all ${
                      isSelected
                        ? 'bg-amber-400 text-stone-950 font-bold shadow-md scale-105'
                        : 'bg-white/5 hover:bg-white/10 text-white/85 hover:text-white'
                    }`}
                  >
                    <img src={pin.src} alt={pin.title} className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
                    <span className="text-[10px] sm:text-[11px] font-sans font-medium whitespace-nowrap">
                      {pin.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scroll Cue down to 3D Orbit */}
          <button
            type="button"
            onClick={() => scrollToOrbit()}
            className="group flex items-center space-x-2 text-stone-300 hover:text-amber-300 transition-colors focus:outline-none"
          >
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] text-stone-400 group-hover:text-amber-300">
              SCROLL DOWN TO EXPLORE GALLERY
            </span>
            <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-bounce text-amber-400" />
          </button>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 2 (BELOW): ROYAL JEWELLERY GALLERY SHOWCASE                  */}
      {/* ==================================================================== */}
      <section
        id="3d-orbit-showcase"
        style={{
          backgroundColor: currentItem.bg,
          transition: 'background-color 650ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        className="relative w-full h-[100dvh] min-h-[540px] max-h-[1400px] overflow-hidden select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label="Royal Jewellery Gallery Showcase"
      >
        {/* Grain Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 50,
            opacity: 0.35,
            backgroundImage: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='noiseFilter'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23noiseFilter)' opacity='0.08'/></svg>")`,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
          }}
        />

        {/* Header Bar inside Section 2 */}
        <header
          className="absolute top-16 sm:top-20 md:top-24 left-3 right-3 sm:left-6 sm:right-6 lg:left-8 lg:right-8 flex items-center justify-between"
          style={{ zIndex: 40 }}
        >
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              type="button"
              onClick={() => scrollToLookbook()}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white/90 hover:text-white backdrop-blur-md border border-white/25 text-xs font-mono font-bold transition-all shadow-sm"
              title="Return up to Shahi Lookbook"
            >
              <ChevronUp className="w-3.5 h-3.5" />
              <span>SHAHI LOOK</span>
            </button>
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-white/90">
              ROYAL JEWELLERY GALLERY
            </span>
            {currentItem.tag && (
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/15 text-white backdrop-blur-md border border-white/20">
                {currentItem.tag}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Autoplay toggle */}
            <button
              type="button"
              onClick={() => setIsAutoplay((prev) => !prev)}
              title={isAutoplay ? 'Pause Orbit' : 'Autoplay Orbit'}
              className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white border border-white/20 backdrop-blur-md transition-all duration-150"
            >
              {isAutoplay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>
        </header>

        {/* Giant Section Title "RINGS", "NECKLACE", etc. positioned in background layer for 3D overlap */}
        <div
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none"
          style={{
            zIndex: 10,
            top: isMobile ? '14%' : 'clamp(12%, 15vh, 17%)',
          }}
        >
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(42px, min(13vw, 15vh), 175px)',
              fontWeight: 900,
              color: 'rgba(255, 255, 255, 0.92)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
              filter: 'drop-shadow(0 20px 35px rgba(0, 0, 0, 0.4))',
              transition: 'transform 650ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {currentItem.title}
          </span>
        </div>

        {/* 3D Carousel Viewport (Foreground Layer Overlapping Background Text) */}
        <div className="absolute inset-0 overflow-visible" style={{ zIndex: 20 }}>
          {items.map((item, index) => {
            const role = getRole(index);

            let transform = 'translate(-50%, -50%) scale(1)';
            let filter = 'blur(0px)';
            let opacity = 1;
            let zIndex = 10;
            let left = '50%';
            let top = isMobile ? '53%' : '50%';
            let height = isMobile ? '64%' : 'clamp(54%, 68vh, 74%)';
            let pointerEvents: 'auto' | 'none' = 'none';
            let cursor = 'default';

            if (role === 'center') {
              const scale = isMobile ? 1.15 : 1.25;
              const tiltX = mouseOffset.x * 0.22;
              const tiltY = -mouseOffset.y * 0.22;
              transform = `translate(-50%, -50%) perspective(1200px) rotateY(${tiltX}deg) rotateX(${tiltY}deg) scale(${scale})`;
              filter =
                'drop-shadow(0 28px 56px rgba(0, 0, 0, 0.82)) drop-shadow(0 12px 24px rgba(0, 0, 0, 0.55)) drop-shadow(0 0 45px rgba(245, 158, 11, 0.22))';
              opacity = 1;
              zIndex = 35;
              left = '50%';
              top = isMobile ? '53%' : '50%';
              height = isMobile ? '64%' : 'clamp(54%, 68vh, 74%)';
              pointerEvents = 'auto';
            } else if (role === 'left') {
              transform = 'translate(-50%, -50%) perspective(1200px) rotateY(16deg) scale(0.95)';
              filter = 'blur(1.5px) drop-shadow(0 18px 36px rgba(0, 0, 0, 0.6))';
              opacity = 0.75;
              zIndex = 15;
              left = isMobile ? '10%' : '17%';
              top = isMobile ? '56%' : '53%';
              height = isMobile ? '32%' : 'clamp(28%, 38vh, 42%)';
              pointerEvents = 'auto';
              cursor = 'pointer';
            } else if (role === 'right') {
              transform = 'translate(-50%, -50%) perspective(1200px) rotateY(-16deg) scale(0.95)';
              filter = 'blur(1.5px) drop-shadow(0 18px 36px rgba(0, 0, 0, 0.6))';
              opacity = 0.75;
              zIndex = 15;
              left = isMobile ? '90%' : '83%';
              top = isMobile ? '56%' : '53%';
              height = isMobile ? '32%' : 'clamp(28%, 38vh, 42%)';
              pointerEvents = 'auto';
              cursor = 'pointer';
            } else if (role === 'back') {
              transform = 'translate(-50%, -50%) scale(0.75)';
              filter = 'blur(5px)';
              opacity = 0.3;
              zIndex = 5;
              left = '50%';
              top = isMobile ? '45%' : '42%';
              height = isMobile ? '20%' : 'clamp(18%, 24vh, 26%)';
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
                  aspectRatio: '1 / 1',
                  maxHeight:
                    role === 'center'
                      ? isMobile
                        ? '64vh'
                        : 'min(72vh, 650px)'
                      : isMobile
                      ? '34vh'
                      : 'min(40vh, 380px)',
                  maxWidth:
                    role === 'center'
                      ? isMobile
                        ? '90vw'
                        : 'min(80vw, 650px)'
                      : isMobile
                      ? '44vw'
                      : 'min(38vw, 380px)',
                  transform,
                  filter,
                  opacity,
                  zIndex,
                  left,
                  top,
                  height,
                  pointerEvents,
                  cursor,
                  transition:
                    'transform 650ms cubic-bezier(0.4, 0, 0.2, 1), filter 650ms cubic-bezier(0.4, 0, 0.2, 1), opacity 650ms cubic-bezier(0.4, 0, 0.2, 1), left 650ms cubic-bezier(0.4, 0, 0.2, 1), top 650ms cubic-bezier(0.4, 0, 0.2, 1), height 650ms cubic-bezier(0.4, 0, 0.2, 1)',
                  willChange: 'transform, filter, opacity, left, top, height',
                }}
                className="transition-all duration-650 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none flex items-center justify-center"
                role="group"
                aria-roledescription="slide"
                aria-label={`${item.name || item.headline} (${role})`}
              >
                <img
                  src={item.src}
                  alt={item.name || item.headline}
                  draggable={false}
                  className="w-full h-full object-contain object-center select-none"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'center',
                  }}
                />

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

        {/* Bottom-Left Text & Navigation Buttons */}
        <div
          className="absolute bottom-4 left-3 sm:bottom-8 sm:left-8 lg:bottom-12 lg:left-14"
          style={{ zIndex: 60, maxWidth: 'clamp(260px, 32vw, 380px)' }}
        >
          <div className="flex items-center space-x-2 mb-1.5 sm:mb-2 text-[11px] sm:text-xs font-mono font-bold tracking-widest text-white/70">
            <span>0{activeIndex + 1}</span>
            <span className="text-white/30">/</span>
            <span>0{items.length}</span>
            <span className="text-white/40">•</span>
            <span className="text-white/80">{currentItem.name}</span>
          </div>

          <p
            className="mb-1.5 sm:mb-2 text-base sm:text-lg lg:text-[22px] font-bold uppercase text-white/95"
            style={{ letterSpacing: '0.02em', lineHeight: 1.15 }}
          >
            {currentItem.headline}
          </p>

          <p className="hidden sm:block text-[11px] sm:text-xs lg:text-sm text-white/85 mb-3 sm:mb-4 leading-[1.5] line-clamp-2 lg:line-clamp-3">
            {currentItem.description}
          </p>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <button
              type="button"
              onClick={() => navigate('prev')}
              disabled={isAnimating}
              aria-label="Previous Item"
              className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-transparent border-2 border-white text-white flex items-center justify-center transition-all duration-150 hover:scale-[1.08] hover:bg-white/15 active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.25} />
            </button>

            <button
              type="button"
              onClick={() => navigate('next')}
              disabled={isAnimating}
              aria-label="Next Item"
              className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-transparent border-2 border-white text-white flex items-center justify-center transition-all duration-150 hover:scale-[1.08] hover:bg-white/15 active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.25} />
            </button>

            {/* Quick-jump Dots Indicator */}
            <div className="flex items-center space-x-1.5 ml-2">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => jumpToIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === activeIndex ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Jump to item ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom-Right Link "DISCOVER IT" */}
        <div
          className="absolute bottom-4 right-3 sm:bottom-8 sm:right-8 lg:bottom-12 lg:right-14"
          style={{ zIndex: 60 }}
        >
          <Link
            href={currentItem.link}
            className="group flex items-center space-x-2 text-white/95 hover:text-white transition-opacity duration-200 no-underline focus:outline-none"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(18px, min(3.8vw, 4.5vh), 52px)',
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
              className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 transition-transform duration-200 group-hover:translate-x-1.5"
              strokeWidth={2.25}
            />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default ToonHubGallery;
