'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Shirt, Sparkles, Wand2, ArrowRight, UserCheck } from 'lucide-react';

export function AIStylistBanner() {
  return (
    <section className="py-8 sm:py-12 bg-[#fbf9f5] dark:bg-obsidian-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-amber-900/10 dark:border-gold-500/20 bg-gradient-to-r from-[#f5ede2] via-[#faf4ea] to-[#f4ebe0] dark:from-stone-900 dark:via-obsidian-900 dark:to-stone-900 p-6 sm:p-10 lg:p-12 shadow-lg">
          
          {/* Delicate Botanical Ambient Silhouette Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-rose-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: Smartphone Mockup */}
            <div className="lg:col-span-3 flex justify-center">
              <div className="relative w-44 sm:w-52 rounded-[32px] border-[5px] border-stone-800 dark:border-stone-700 bg-white dark:bg-stone-950 p-2 shadow-2xl overflow-hidden">
                {/* Phone Speaker Notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-stone-800 rounded-full z-20" />
                
                {/* Phone Screen Mockup Content */}
                <div className="rounded-[22px] overflow-hidden bg-stone-50 dark:bg-stone-900 pt-6 pb-4 px-3 space-y-3">
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-sm">
                    <img
                      src="/images/models/woman_1.png"
                      alt="AI Stylist Recommendation"
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute bottom-1.5 left-1.5 right-1.5 rounded-lg bg-black/60 backdrop-blur-md px-2 py-1 text-[8px] font-mono text-white text-center font-semibold">
                      ✨ 98% Match for Wedding Saree
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="h-2 w-3/4 rounded bg-stone-300 dark:bg-stone-700 animate-pulse" />
                    <div className="h-2 w-1/2 rounded bg-stone-200 dark:bg-stone-800 animate-pulse" />
                  </div>

                  <div className="p-2 rounded-lg bg-gold-500/20 border border-gold-500/30 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-stone-800 dark:text-gold-300">
                      Curated Parure
                    </span>
                    <span className="text-[9px] font-mono text-gold-600 dark:text-gold-400 font-bold">
                      ₹ 18,999
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center: Headlines & Call to Action */}
            <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
              <div className="inline-block">
                <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.2em] text-gold-700 dark:text-gold-400 uppercase">
                  Not Sure What to Wear?
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 dark:text-white leading-tight">
                Let our AI Stylist find your perfect jewellery.
              </h3>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-light leading-relaxed max-w-lg">
                Tell us your occasion, outfit, skin tone & style preferences and get personalised recommendations crafted for your celebration.
              </p>

              <div className="pt-2">
                <Link
                  href="/ai-assistant"
                  className="inline-flex items-center space-x-2.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-600 to-amber-600 px-7 py-3.5 text-xs font-mono font-bold uppercase tracking-widest text-obsidian-950 shadow-[0_8px_20px_rgba(212,175,55,0.3)] hover:brightness-110 transition-all group"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Try AI Stylist</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right: 4 Consultation Criteria Badges */}
            <div className="lg:col-span-3 grid grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3.5 rounded-2xl border border-stone-300/60 dark:border-white/10 bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm text-center space-y-1.5 shadow-sm">
                <Calendar className="h-5 w-5 mx-auto text-gold-600 dark:text-gold-400" />
                <span className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-stone-800 dark:text-stone-200">
                  Occasion
                </span>
              </div>

              <div className="p-3.5 rounded-2xl border border-stone-300/60 dark:border-white/10 bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm text-center space-y-1.5 shadow-sm">
                <Shirt className="h-5 w-5 mx-auto text-gold-600 dark:text-gold-400" />
                <span className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-stone-800 dark:text-stone-200">
                  Outfit
                </span>
              </div>

              <div className="p-3.5 rounded-2xl border border-stone-300/60 dark:border-white/10 bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm text-center space-y-1.5 shadow-sm">
                <UserCheck className="h-5 w-5 mx-auto text-gold-600 dark:text-gold-400" />
                <span className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-stone-800 dark:text-stone-200">
                  Skin Tone
                </span>
              </div>

              <div className="p-3.5 rounded-2xl border border-stone-300/60 dark:border-white/10 bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm text-center space-y-1.5 shadow-sm">
                <Wand2 className="h-5 w-5 mx-auto text-gold-600 dark:text-gold-400" />
                <span className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-stone-800 dark:text-stone-200">
                  Style
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
