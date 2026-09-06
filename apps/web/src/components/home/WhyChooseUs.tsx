'use client';

import React from 'react';
import { Award, Sparkles, Droplets, ShieldCheck, Package, RotateCcw } from 'lucide-react';

const PILLARS = [
  {
    icon: Award,
    title: 'Premium Finish',
    description: 'Luxury you can see and feel',
  },
  {
    icon: Sparkles,
    title: 'Anti-Tarnish',
    description: 'Long-lasting shine',
  },
  {
    icon: Droplets,
    title: 'Water Resistant',
    description: 'Wear it, love it, always',
  },
  {
    icon: ShieldCheck,
    title: 'Nickel-Free & Hypoallergenic',
    description: 'Safe for sensitive skin',
  },
  {
    icon: Package,
    title: 'Secure Packaging',
    description: 'Arrives in perfect condition',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: 'Hassle-free process',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-14 sm:py-18 bg-[#fbf9f5] dark:bg-obsidian-950 border-t border-stone-200/70 dark:border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Section Heading */}
        <div className="mb-10">
          <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-gold-600 dark:text-gold-400 uppercase block mb-1">
            Our Hallmarks
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-white uppercase">
            Why Choose The Bling Haven?
          </h2>
        </div>

        {/* 6 Value Pillars Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-4">
          {PILLARS.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center space-y-2 p-3 rounded-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-stone-900 border border-gold-500/30 flex items-center justify-center text-gold-600 dark:text-gold-400 shadow-sm">
                  <Icon className="h-6 w-6 stroke-[1.75]" />
                </div>
                <h4 className="font-serif text-xs sm:text-sm font-bold text-stone-900 dark:text-white leading-tight">
                  {p.title}
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 font-light leading-snug">
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
