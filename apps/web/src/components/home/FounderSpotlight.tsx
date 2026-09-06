'use client';

import React from 'react';
import Link from 'next/link';
import { Crown, Sparkles, Instagram, ArrowRight, ExternalLink, Award } from 'lucide-react';
import { AnimatedBrandLogo } from '@/components/ui/AnimatedBrandLogo';

export function FounderSpotlight() {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden bg-gradient-to-b from-obsidian-950 via-stone-950 to-obsidian-950 text-white border-t border-gold-500/20">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 rounded-full bg-gold-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 rounded-full bg-pink-500/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Founder Portrait & Animated Emblem */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            <div className="relative w-full max-w-sm sm:max-w-md mx-auto">
              {/* Outer Golden Aura */}
              <div className="absolute -inset-2 rounded-[36px] bg-gradient-to-tr from-gold-500/40 via-pink-300/20 to-amber-400/50 opacity-80 blur-xl" />

              <div className="relative rounded-[32px] overflow-hidden border border-gold-500/30 bg-black aspect-[4/5] shadow-2xl">
                <img
                  src="/images/about/neha_singh.jpg"
                  alt="Neha Singh — Founder & Creative Director"
                  className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.03] transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Founder Info Overlay Card */}
                <div className="absolute bottom-6 inset-x-6">
                  <div className="p-4 rounded-2xl border border-white/15 bg-black/75 backdrop-blur-md flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-white tracking-wide">
                        Neha Singh
                      </h3>
                      <p className="text-[11px] font-mono uppercase tracking-widest text-gold-400">
                        Founder & Creative Director
                      </p>
                    </div>
                    <div className="p-2 rounded-full bg-gold-500/20 text-gold-400">
                      <Crown className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Animated Circular Brand Emblem */}
              <div className="absolute -top-6 -right-6 hidden sm:block">
                <AnimatedBrandLogo size="sm" enableGlint={true} />
              </div>
            </div>
          </div>

          {/* Right: Vision & Instagram Connection */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-gold-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-300">
                The Visionary Behind The Brand
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              "Every woman deserves to feel royal, confident, and eternal."
            </h2>

            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
              Conceived by <strong className="text-gold-400 font-semibold">Neha Singh</strong>, The Bling Haven was created to liberate royal Indian high jewelry from traditional retail markups. Every necklace set, chandelier earring, and solitare ring is hand-selected and crafted with 22K micro-gold plating, uncut polki stones, and anti-tarnish lifetime protection.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <div className="font-serif text-2xl font-bold text-gold-400">Jaipur & Surat</div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Artisanal Bench Karigars
                </div>
              </div>
              <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <div className="font-serif text-2xl font-bold text-gold-400">22K Micro-Gold</div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Anti-Tarnish Longevity
                </div>
              </div>
              <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm col-span-2 sm:col-span-1">
                <div className="font-serif text-2xl font-bold text-gold-400">1,400+</div>
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Instagram Connoisseurs
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/about"
                className="inline-flex items-center space-x-2 rounded-2xl border border-gold-500/60 bg-gradient-to-r from-gold-600 to-gold-500 px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-obsidian-950 shadow-lg hover:brightness-110 transition-all"
              >
                <span>Read Full Maison Story</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="https://www.instagram.com/the_bling_haven?stkn=dG54bGY1ZGgyMzJr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all shadow-sm"
              >
                <Instagram className="h-4 w-4 text-rose-400" />
                <span>Follow @the_bling_haven</span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
