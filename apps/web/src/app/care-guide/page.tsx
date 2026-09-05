'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Droplets, Sparkles, HeartHandshake, Sun, ArrowRight } from 'lucide-react';

export default function CareGuidePage() {
  return (
    <div className="min-h-screen bg-[#FAF9F5] dark:bg-[#09090C] text-stone-900 dark:text-stone-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 bg-gold-400/10 text-gold-600 dark:text-gold-400 border border-gold-400/30 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> Haute Joaillerie Preservation
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-medium tracking-tight mb-4">
            Jewellery Care & Anti-Tarnish Manual
          </h1>
          <p className="text-stone-600 dark:text-stone-400 max-w-xl mx-auto text-sm sm:text-base">
            Every creation from The Bling Haven is sealed with multi-micron 22K gold plating and
            hypoallergenic electro-coatings. Follow our care rituals to maintain showroom brilliance
            for generations.
          </p>
        </div>

        {/* 4 Golden Rules Cards */}
        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 rounded-2xl shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-roseGold-300/20 text-roseGold-600 flex items-center justify-center mb-4">
              <Droplets className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-medium mb-2">1. The &quot;Last On, First Off&quot; Rule</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Always apply perfumes, hair sprays, deodorants, and body lotions <strong>before</strong>{' '}
              wearing your jewellery. Alcohol and aerosol mists can compromise micro-coatings over
              extended periods.
            </p>
          </div>

          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 rounded-2xl shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-gold-400/20 text-gold-600 flex items-center justify-center mb-4">
              <Sun className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-medium mb-2">2. Avoid Moisture & Saltwater</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Remove your jewellery before showering, swimming, or rigorous workouts. Chlorine,
              hot tubs, and persistent humidity can dull hand-set Austrian crystals and Polki foils.
            </p>
          </div>

          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 rounded-2xl shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-celestial-300/30 text-blue-600 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-medium mb-2">3. Gentle Microfiber Cleaning</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              After wearing, gently wipe the surface with the complimentary lint-free microfiber
              cloth included in your box. Never use harsh ultrasonic cleaners or chemical solutions
              on foil-backed Kundan.
            </p>
          </div>

          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 rounded-2xl shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-700 flex items-center justify-center mb-4">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-medium mb-2">4. Individual Velvet Storage</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Store each piece in its bespoke The Bling Haven airtight pouch or velvet box. Keeping
              pieces separated prevents stone friction and protects delicate prong settings.
            </p>
          </div>
        </div>

        {/* Craftsmanship & Plating Technology Section */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-8 sm:p-10 mb-12 shadow-sm">
          <h2 className="text-2xl font-serif font-medium mb-4">
            Our Plating & Anti-Tarnish Commitment
          </h2>
          <div className="space-y-4 text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
            <p>
              Unlike fast-fashion brass jewellery that oxidizes within weeks, The Bling Haven uses
              proprietary <strong>Electro-deposition Plating</strong> with 22-karat real gold layering
              and an invisible protective nano-ceramic shield.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-stone-200 dark:border-stone-800">
              <div className="p-4 bg-stone-50 dark:bg-stone-950/40 rounded-xl">
                <span className="text-xs font-semibold text-gold-600 dark:text-gold-400 uppercase tracking-wider">
                  Nickel & Lead Free
                </span>
                <p className="text-xs text-stone-500 mt-1">
                  100% hypoallergenic formulations safe for sensitive skin.
                </p>
              </div>
              <div className="p-4 bg-stone-50 dark:bg-stone-950/40 rounded-xl">
                <span className="text-xs font-semibold text-gold-600 dark:text-gold-400 uppercase tracking-wider">
                  Nano-Ceramic Seal
                </span>
                <p className="text-xs text-stone-500 mt-1">
                  Locks in golden luster and shields against atmospheric oxidation.
                </p>
              </div>
              <div className="p-4 bg-stone-50 dark:bg-stone-950/40 rounded-xl">
                <span className="text-xs font-semibold text-gold-600 dark:text-gold-400 uppercase tracking-wider">
                  Complimentary Re-Polish
                </span>
                <p className="text-xs text-stone-500 mt-1">
                  Available through our Toronto atelier for registered VIP clients.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-black text-white dark:bg-white dark:text-black rounded-full text-xs font-semibold uppercase tracking-wider shadow-lg hover:opacity-90 transition-all"
          >
            Explore Protected Collections <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
