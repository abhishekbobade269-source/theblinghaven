'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface CategoryItem {
  id: string;
  name: string;
  image: string;
  href: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'bridal-sets',
    name: 'bridal sets',
    image: '/uploads/sets_00c2f42a_1s6a9390.jpg',
    href: '/bridal-sets',
  },
  {
    id: 'earrings',
    name: 'earrings',
    image: '/uploads/earrings_01462b03_1s6a0431.jpg',
    href: '/earrings',
  },
  {
    id: 'bangles',
    name: 'bangles',
    image: '/uploads/bangles_271ffaca_1s6a9933.jpg',
    href: '/bangles',
  },
];

/**
 * Custom IntersectionObserver hook (useInView)
 * Observes element; once isIntersecting is true, sets isVisible = true and unobserves.
 */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return { ref, isVisible };
}

export function CategoryVideoHero() {
  const { ref, isVisible } = useInView(0.1);

  return (
    <section className="w-full bg-white text-white min-h-screen flex flex-col justify-center p-0 m-0 overflow-hidden">
      {/* Full-width 3-column split view with IntersectionObserver reveal animation */}
      <div
        ref={ref}
        className={`grid grid-cols-1 md:grid-cols-3 w-full h-full min-h-screen transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        {CATEGORIES.map((cat, index) => (
          <div
            key={cat.id}
            style={{ transitionDelay: `${index * 150}ms` }}
            className="group relative flex flex-col justify-between items-start p-6 sm:p-8 md:p-12 min-h-[500px] sm:min-h-[600px] md:min-h-screen overflow-hidden select-none"
          >
            {/* Background Full Cover Jewelry Image */}
            <img
              src={cat.image}
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/30" />

            {/* Vertical Category Name (bottom-to-top) */}
            <h2
              style={{
                writingMode: 'vertical-lr',
                transform: 'rotate(180deg)',
              }}
              className="relative z-10 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium text-white tracking-wider lowercase transition-transform duration-500 group-hover:-translate-y-2 drop-shadow-xl font-sans"
            >
              {cat.name}
            </h2>

            {/* Shop Button */}
            <Link href={cat.href} className="relative z-10 mt-auto">
              <button
                type="button"
                className="btn-primary px-8 py-3.5 bg-white text-black rounded-full text-sm font-medium tracking-wide capitalize shadow-2xl transition-all"
              >
                shop {cat.name}
              </button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
