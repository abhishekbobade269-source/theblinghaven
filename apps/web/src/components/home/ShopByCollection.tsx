'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface CollectionItem {
  id: string;
  name: string;
  href: string;
  image: string;
}

const COLLECTIONS: CollectionItem[] = [
  {
    id: 'rings',
    name: 'RINGS',
    href: '/rings',
    image: '/uploads/rings_15ca97c8_1s6a0175.jpg',
  },
  {
    id: 'bridal',
    name: 'BRIDAL JEWELLERY',
    href: '/bridal-sets',
    image: '/uploads/sets_5621e16b_1s6a9422.jpg',
  },
  {
    id: 'earrings',
    name: 'EARRINGS',
    href: '/earrings',
    image: '/uploads/earrings_08f6c633_1s6a0440.jpg',
  },
  {
    id: 'bangles',
    name: 'BANGLES & KADA',
    href: '/bangles',
    image: '/uploads/bangles_255ba756_1s6a0023.jpg',
  },
  {
    id: 'silver',
    name: 'SILVER JEWELLERY',
    href: '/artisan-silver',
    image: '/uploads/handmade_8aafcd39_1s6a0402.jpg',
  },
];

export function ShopByCollection() {
  return (
    <section className="py-12 sm:py-16 bg-[#fbf9f5] dark:bg-obsidian-950 border-t border-stone-200/70 dark:border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex items-center space-x-4 mb-8">
          <h2 className="font-mono text-xs sm:text-sm font-bold tracking-[0.25em] text-stone-800 dark:text-stone-200 uppercase">
            Shop by Collection
          </h2>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-stone-300 dark:from-white/10 to-transparent" />
        </div>

        {/* 5 Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {COLLECTIONS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group relative block rounded-2xl overflow-hidden aspect-[4/3] bg-stone-200 dark:bg-stone-900 shadow-md hover:shadow-xl transition-all duration-500"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover object-center filter brightness-[0.95] contrast-[1.03] transition-transform duration-700 group-hover:scale-110"
              />

              {/* Bottom Gradient for Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

              {/* Card Label Pill */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                <span className="font-mono text-[10px] sm:text-xs font-bold tracking-wider uppercase drop-shadow">
                  {item.name}
                </span>
                <span className="text-gold-400 group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
