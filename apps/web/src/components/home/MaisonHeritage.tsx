'use client';

import React from 'react';
import { ShieldCheck, Truck, Sparkles, Award } from 'lucide-react';
import { SpotlightCard, ShinyText, CountUp } from '@/components/react-bits';

export function MaisonHeritage() {
  const stats = [
    { value: 100, suffix: '%', label: 'BIS Hallmarked Purity' },
    { value: 300, suffix: '+', label: 'Artisanal Masterpieces' },
    { value: 48, suffix: 'h', label: 'Insured Armored Dispatch' },
    { value: 0, suffix: ' Tarnish', label: 'Gold Bonding Guarantee' },
  ];

  const pillars = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-gold-500" />,
      title: 'Certified BIS & Hallmarked',
      description: 'Every gold-plated setting and 925 sterling piece carries micro-engraved authenticity stamps.',
    },
    {
      icon: <Truck className="h-6 w-6 text-gold-500" />,
      title: '100% Insured Worldwide Transit',
      description: 'Complimentary tamper-evident armoring and signature delivery across Canada, US, and UK.',
    },
    {
      icon: <Award className="h-6 w-6 text-gold-500" />,
      title: 'Anti-Tarnish Lifetime Guarantee',
      description: 'Proprietary electro-plating shields against oxidation, humidity, and perfume contact.',
    },
    {
      icon: <Sparkles className="h-6 w-6 text-gold-500" />,
      title: 'Conflict-Free Gemstones',
      description: 'Ethically sourced AAA+ Austrian crystals and lab-grown stones crafted to diamond facet parity.',
    },
  ];

  return (
    <section className="py-20 border-t border-slate-200/80 dark:border-white/5 bg-slate-50/80 dark:bg-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Animated Metrics Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-3xl border border-gold-500/20 bg-gradient-to-br from-gold-500/5 via-transparent to-amber-500/5 backdrop-blur-md">
          {stats.map((s, idx) => (
            <div key={idx} className="flex flex-col items-center text-center space-y-1">
              <div className="font-serif text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 flex items-center">
                <CountUp to={s.value} duration={2} />
                <span className="text-gold-500">{s.suffix}</span>
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400">
            <Sparkles className="h-3.5 w-3.5" />
            <ShinyText text="The Maison Standard" color="#ca8a04" shineColor="#fef08a" speed={3} />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Craftsmanship That Outlasts Generations
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-light leading-relaxed">
            Every piece from The Bling Haven is hallmarked and sealed in Toronto, Canada, under uncompromising standards of haute joaillerie.
          </p>
        </div>

        {/* Spotlight Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => (
            <SpotlightCard
              key={idx}
              spotlightColor="rgba(212, 175, 55, 0.22)"
              className="p-6 flex flex-col items-start space-y-4 rounded-3xl"
            >
              <div className="p-3 rounded-2xl bg-gold-500/10 border border-gold-500/25 shadow-inner">
                {p.icon}
              </div>
              <h4 className="font-serif text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                {p.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                {p.description}
              </p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
