'use client';

import React, { useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
} from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

// 8 Parallax Floating Squares data: [x%, y%, sizePx]
const FLOATING_SQUARES = [
  { x: 6, y: 20, size: 12 },
  { x: 12, y: 32, size: 8 },
  { x: 8, y: 44, size: 6 },
  { x: 88, y: 18, size: 10 },
  { x: 92, y: 30, size: 14 },
  { x: 85, y: 42, size: 7 },
  { x: 90, y: 52, size: 5 },
  { x: 14, y: 56, size: 5 },
];

// 4 Case Studies / Featured Jewelry data in simple layman terms
interface CaseStudy {
  id: string;
  title: string;
  category: string;
  tag: string;
  image: string;
  href: string;
  squares: { x: number; y: number; size: number }[];
}

const FEATURED_DESIGNS: CaseStudy[] = [
  {
    id: 'bridal-choker',
    title: 'Royal Bridal Gulbandh Set',
    category: 'Necklace & Matching Chandbalis',
    tag: 'Best Seller',
    image: '/uploads/sets_00c2f42a_1s6a9390.jpg',
    href: '/bridal-sets',
    squares: [
      { x: 5, y: 30, size: 16 },
      { x: 10, y: 42, size: 10 },
      { x: 3, y: 52, size: 7 },
      { x: 80, y: 70, size: 14 },
      { x: 85, y: 82, size: 9 },
      { x: 78, y: 60, size: 6 },
    ],
  },
  {
    id: 'solitaire-ring',
    title: 'Crystal Solitaire Angoothi',
    category: 'Adjustable Finger Angoothi',
    tag: 'Trending',
    image: '/uploads/rings_0345f0a9_1s6a0180.jpg',
    href: '/rings',
    squares: [
      { x: 82, y: 55, size: 16 },
      { x: 88, y: 68, size: 10 },
      { x: 78, y: 72, size: 7 },
      { x: 85, y: 42, size: 6 },
      { x: 90, y: 80, size: 8 },
    ],
  },
  {
    id: 'kundan-earrings',
    title: 'Kundan Pearl Chandbalis',
    category: 'Traditional Festive Chandbalis & Jhumkas',
    tag: 'Popular',
    image: '/uploads/earrings_01462b03_1s6a0431.jpg',
    href: '/earrings',
    squares: [
      { x: 4, y: 24, size: 16 },
      { x: 10, y: 36, size: 10 },
      { x: 2, y: 44, size: 7 },
      { x: 78, y: 78, size: 14 },
      { x: 84, y: 88, size: 8 },
    ],
  },
  {
    id: 'antique-gold-bangles',
    title: 'Antique Gold Kadas',
    category: 'Set of 2 Jadau Openable Kadas',
    tag: '22K Plated',
    image: '/uploads/bangles_271ffaca_1s6a9933.jpg',
    href: '/bangles',
    squares: [
      { x: 82, y: 26, size: 14 },
      { x: 88, y: 38, size: 10 },
      { x: 78, y: 44, size: 7 },
      { x: 84, y: 54, size: 5 },
      { x: 90, y: 60, size: 8 },
    ],
  },
];

// Jewelry hallmark trust badges in simple layman terms
const MARQUEE_BADGES = [
  { name: '100% Anti-Tarnish', icon: 'sparkle' },
  { name: '22K Gold Plated', icon: 'crown' },
  { name: 'AAA+ Austrian Crystals', icon: 'gem' },
  { name: 'Skin Safe & Hypoallergenic', icon: 'shield' },
  { name: 'Free Canada Delivery', icon: 'truck' },
  { name: 'Handcrafted Artistry', icon: 'heart' },
  { name: 'Hallmark Quality Certified', icon: 'award' },
  { name: 'Easy Size Exchange', icon: 'refresh' },
];

function BadgeIcon({ type }: { type: string }) {
  switch (type) {
    case 'sparkle':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
      );
    case 'crown':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.269a4 4 0 0 1-3.86 2.934H8.713a4 4 0 0 1-3.86-2.934L2.019 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
          <path d="M5 21h14" />
        </svg>
      );
    case 'gem':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3h12l4 6-10 12L2 9Z" />
          <path d="M11 3 8 9l4 12 4-12-3-6" />
          <path d="M2 9h20" />
        </svg>
      );
    case 'shield':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 'truck':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
          <path d="M15 18H9" />
          <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
          <circle cx="17" cy="18" r="2" />
          <circle cx="7" cy="18" r="2" />
        </svg>
      );
    case 'heart':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      );
    case 'award':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6" />
          <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
        </svg>
      );
    case 'refresh':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M8 16H3v5" />
        </svg>
      );
    default:
      return null;
  }
}

// 12 columns x 8 rows pixel-block hover overlay
const COLS = 12;
const ROWS = 8;
const PIXEL_BLOCKS = Array.from({ length: ROWS }, (_, row) =>
  Array.from({ length: COLS }, (_, col) => ({ row, col }))
).flat();

/**
 * Single Magnetic Square inside Card
 */
function CardMagneticSquare({
  square,
  mouseX,
  mouseY,
  isHovered,
}: {
  square: { x: number; y: number; size: number };
  mouseX: any;
  mouseY: any;
  isHovered: boolean;
}) {
  const normX = square.x / 100;
  const normY = square.y / 100;

  const rawShiftX = useTransform(mouseX, (val: number) => {
    if (!isHovered) return 0;
    return (val - normX) * 40;
  });

  const rawShiftY = useTransform(mouseY, (val: number) => {
    if (!isHovered) return 0;
    return (val - normY) * 40;
  });

  const springX = useSpring(rawShiftX, { stiffness: 80, damping: 18, mass: 0.6 });
  const springY = useSpring(rawShiftY, { stiffness: 80, damping: 18, mass: 0.6 });

  return (
    <motion.div
      style={{
        left: `${square.x}%`,
        top: `${square.y}%`,
        width: square.size,
        height: square.size,
        x: springX,
        y: springY,
      }}
      className="pointer-events-none absolute z-10 bg-black shadow-sm"
    />
  );
}

/**
 * Single Case Study Card with Pixel-Block Dissolve Overlay & Magnetic Squares
 */
function CaseStudyCard({ card, index }: { card: CaseStudy; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width;
      const normY = (e.clientY - rect.top) / rect.height;
      mouseX.set(normX);
      mouseY.set(normY);
    },
    [mouseX, mouseY]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  }, [mouseX, mouseY]);

  return (
    <Link href={card.href} className="block w-full">
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.7,
          delay: index * 0.1,
          ease: EASE,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group relative aspect-[4/3] w-full overflow-hidden select-none cursor-pointer bg-neutral-100 rounded-lg shadow-sm border border-stone-200"
      >
        {/* 1. Background image */}
        <img
          src={card.image}
          alt={card.title}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />

        {/* 2. Pixel-block hover overlay (12x8 grid) */}
        <div className="pointer-events-none absolute inset-0 z-[5]">
          {PIXEL_BLOCKS.map(({ row, col }) => {
            const delayIn = (row + col) * 0.018;
            const delayOut = (8 - row + (12 - col)) * 0.012;

            return (
              <motion.div
                key={`${row}-${col}`}
                style={{
                  left: `${(col * 100) / COLS}%`,
                  top: `${(row * 100) / ROWS}%`,
                  width: `${100 / COLS}%`,
                  height: `${100 / ROWS}%`,
                }}
                initial={false}
                animate={{
                  scale: isHovered ? 1 : 0,
                  opacity: isHovered ? 1 : 0,
                }}
                transition={{
                  duration: 0.25,
                  delay: isHovered ? delayIn : delayOut,
                  ease: 'easeOut',
                }}
                className="absolute bg-black/80"
              />
            );
          })}
        </div>

        {/* 3. Magnetic squares */}
        {card.squares.map((sq, i) => (
          <CardMagneticSquare
            key={i}
            square={sq}
            mouseX={mouseX}
            mouseY={mouseY}
            isHovered={isHovered}
          />
        ))}

        {/* 4. Plus button (top right) */}
        <div
          style={{ zIndex: 10 }}
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center border border-white/40 bg-black/30 backdrop-blur-sm text-xs text-white rounded transition-colors duration-300 group-hover:border-white group-hover:bg-white/20"
        >
          +
        </div>

        {/* 5. Info plate (bottom left) */}
        <div
          style={{ zIndex: 20, maxWidth: '75%' }}
          className="absolute bottom-0 left-0 bg-white px-4 pb-3 pt-2.5 shadow-md rounded-tr-md"
        >
          <h3 className="text-[clamp(1.1rem,1.8vw,1.6rem)] font-serif font-medium leading-tight text-black">
            {card.title}
          </h3>
          <div className="mt-1 flex flex-row items-center gap-3 text-[11px] sm:text-[12px]">
            <span className="text-black/60">{card.category}</span>
            <span className="font-semibold text-gold-700">{card.tag}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

/**
 * Parallax floating square in Header
 */
function HeaderParallaxSquare({
  square,
  index,
  scrollYProgress,
}: {
  square: { x: number; y: number; size: number };
  index: number;
  scrollYProgress: any;
}) {
  const rawY = useTransform(scrollYProgress, [0, 1], [0, -(80 + index * 30)]);
  const springY = useSpring(rawY, { stiffness: 40, damping: 20 });

  return (
    <motion.div
      style={{
        left: `${square.x}%`,
        top: `${square.y}%`,
        width: square.size,
        height: square.size,
        y: springY,
      }}
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 3 + index * 0.4,
        ease: 'easeInOut',
        repeat: Infinity,
        delay: index * 0.3,
      }}
      className="absolute bg-black shadow-sm"
    />
  );
}

export function AtelierCaseStudies() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-60px' });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  return (
    <section
      ref={sectionRef}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="relative w-full bg-white text-black overflow-hidden"
    >
      {/* Top Area: Header with floating squares */}
      <div className="relative px-6 pb-10 pt-20 sm:px-10 lg:px-16 lg:pt-28">
        {/* Parallax floating black squares */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {FLOATING_SQUARES.map((sq, index) => (
            <HeaderParallaxSquare
              key={index}
              square={sq}
              index={index}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* Centered Header Text in Simple Layman Terms */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative mx-auto max-w-7xl text-center"
        >
          <span className="mb-4 inline-block bg-black px-4 py-1.5 text-[13px] font-medium tracking-wide text-white rounded-full">
            Featured Designs
          </span>
          <h2 className="text-[clamp(1.8rem,3.2vw,2.8rem)] font-light leading-[1.25] tracking-tight">
            Handcrafted Jewellery <span className="text-black/40">Loved By</span>
            <br />
            <span className="text-black/40">Our Customers</span>
          </h2>
          <p className="mt-3 text-sm text-black/60 max-w-md mx-auto">
            Explore our most popular bridal trousseau sets, sparkling angoothis, and traditional kadas.
          </p>
        </motion.div>
      </div>

      {/* Featured Cards: 2x2 Grid with Simple Layman Names */}
      <div className="mx-auto max-w-7xl px-6 pb-16 sm:px-10 lg:px-16">
        <div className="grid gap-4 md:grid-cols-2">
          {FEATURED_DESIGNS.map((card, index) => (
            <CaseStudyCard key={card.id} card={card} index={index} />
          ))}
        </div>
      </div>

      {/* Footer Area with Layman Jewelry Messaging & Marquee */}
      <div className="mx-auto max-w-7xl px-6 pb-6 sm:px-10 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          {/* Left Side: Layman Jewelry Promise */}
          <div className="max-w-md">
            <div className="mb-3 flex h-7 w-7 items-center justify-center border border-black/20 text-xs text-black font-semibold rounded">
              ✦
            </div>
            <p className="text-[14px] leading-[1.7] text-black/70">
              Every piece at The Bling Haven is handcrafted with precision, multi-layer 22K gold
              polish, and AAA+ sparkling Austrian stones — bringing you royal elegance for weddings,
              parties, and festive celebrations.
            </p>

            <Link href="/catalog" className="inline-block mt-5">
              <button
                type="button"
                className="group flex items-end cursor-pointer"
              >
                <span className="inline-flex items-center gap-[10px] border border-black/20 bg-black px-4 py-2.5 text-sm sm:text-base font-medium text-white transition-colors duration-200 group-hover:bg-black/85 rounded-l">
                  Shop All Collections
                </span>
                <span className="mb-6 h-6 w-6 bg-black flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:mb-9 rounded-r">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="white"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M18.75 6V15.75C18.75 15.949 18.671 16.14 18.53 16.28C18.39 16.421 18.199 16.5 18 16.5C17.801 16.5 17.61 16.421 17.47 16.28C17.329 16.14 17.25 15.949 17.25 15.75V7.81L6.53 18.53C6.39 18.671 6.199 18.75 6 18.75C5.801 18.75 5.61 18.671 5.47 18.53C5.329 18.39 5.25 18.199 5.25 18C5.25 17.801 5.329 17.61 5.47 17.47L16.19 6.75H8.25C8.051 6.75 7.86 6.671 7.72 6.53C7.579 6.39 7.5 6.199 7.5 6C7.5 5.801 7.579 5.61 7.72 5.47C7.86 5.329 8.051 5.25 8.25 5.25H18C18.199 5.25 18.39 5.329 18.53 5.47C18.671 5.61 18.75 5.801 18.75 6Z" />
                  </svg>
                </span>
              </button>
            </Link>
          </div>

          {/* Right Side: Trust & Quality Marquee */}
          <div className="flex-1 overflow-hidden border-t border-black/10 md:border-t-0 md:ml-10">
            <div className="overflow-hidden py-4">
              <div className="marquee-projects flex w-max">
                {/* 8 jewelry trust badges doubled for seamless looping */}
                {[...MARQUEE_BADGES, ...MARQUEE_BADGES].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex shrink-0 items-center gap-2.5 px-6"
                  >
                    <span className="text-black">
                      <BadgeIcon type={item.icon} />
                    </span>
                    <span className="whitespace-nowrap text-xs sm:text-sm font-medium tracking-wide text-black/80">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Spacer */}
      <div className="h-10" />
    </section>
  );
}
