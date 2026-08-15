'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Gem, Crown, Sparkles, MapPin, ArrowRight } from 'lucide-react';

export default function AboutHeritagePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-400">
          Maison de Haute Joaillerie
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-slate-100 leading-tight">
          The Art of Eternal Brilliance
        </h1>
        <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
          Founded on the ethos of timeless royal craftsmanship, The Bling Haven bridges century-old goldsmithing heritage with contemporary gemological precision.
        </p>
      </div>

      {/* Story Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative h-96 sm:h-[450px] w-full overflow-hidden rounded-3xl border border-gold-500/30 bg-obsidian-950 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85"
            alt="Artisanal Goldsmithing"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
          <div className="inline-flex items-center space-x-2 text-gold-400 font-mono text-xs font-bold uppercase">
            <Crown className="h-4 w-4" />
            <span>Artisanal Pedigree</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">
            Centuries of Goldsmithing Mastery
          </h2>

          <p>
            From the historic royal courts of Jaipur crafting intricate uncut Jadau polki, to the fine platinum micro-prong workshops of Geneva and London, each The Bling Haven piece is sculpted by master artisans with over three decades of individual bench experience.
          </p>

          <p>
            We adhere strictly to the Kimberley Process, ensuring every natural solitaire and colored gemstone is ethically sourced with verified conflict-free provenance.
          </p>

          <div className="pt-2">
            <Link
              href="/bespoke"
              className="inline-flex items-center space-x-2 rounded-2xl border border-gold-500/60 bg-gradient-to-r from-gold-600 to-gold-500 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-obsidian-950 shadow-lg"
            >
              <span>Explore Bespoke Creations</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3 Salons */}
      <div className="space-y-8 text-center">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">
          Global Private Salons
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="rounded-3xl border border-gold-500/20 bg-obsidian-900 p-6 space-y-2">
            <h3 className="font-serif text-lg font-bold text-gold-400">London Mayfair Atelier</h3>
            <p className="text-xs text-slate-400">14 Old Bond Street, Mayfair, London W1S 4PP</p>
            <p className="text-[11px] font-mono text-slate-500 pt-2">By Private Appointment Only</p>
          </div>

          <div className="rounded-3xl border border-gold-500/20 bg-obsidian-900 p-6 space-y-2">
            <h3 className="font-serif text-lg font-bold text-gold-400">Dubai Flagship Salon</h3>
            <p className="text-xs text-slate-400">Gate Precinct 4, DIFC, Dubai UAE</p>
            <p className="text-[11px] font-mono text-slate-500 pt-2">Private Champagne Viewing Suite</p>
          </div>

          <div className="rounded-3xl border border-gold-500/20 bg-obsidian-900 p-6 space-y-2">
            <h3 className="font-serif text-lg font-bold text-gold-400">Paris Place Vendôme</h3>
            <p className="text-xs text-slate-400">Place Vendôme, 75001 Paris, France</p>
            <p className="text-[11px] font-mono text-slate-500 pt-2">High Jewelry Partner Atelier</p>
          </div>
        </div>
      </div>
    </div>
  );
}
