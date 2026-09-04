'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Camera, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { DiamondGlint } from '@/components/ui/DiamondGlint';
import { ShinyText, Magnet } from '@/components/react-bits';

export function VirtualTryOnBanner() {
  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-gold-500/30 bg-gradient-to-br from-[#0D0D14] via-[#09090D] to-[#14141E] p-8 sm:p-14 lg:p-16 shadow-[0_25px_70px_rgba(0,0,0,0.8)]">
        {/* Ambient Golden Glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-gold-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-600/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Description */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 rounded-full border border-gold-400/40 bg-gold-500/10 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-widest text-gold-300">
              <Camera className="h-3.5 w-3.5 text-gold-400" />
              <ShinyText text="Augmented Reality Studio" color="#facc15" shineColor="#ffffff" speed={2.5} />
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Fit Solitaires & Necklaces on Your Hand in Real Time
            </h2>

            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-xl">
              Experience our proprietary 3D AR Studio. Upload a hand photo or use your device camera to preview solitaire proportions, choker collar drops, and bangle diameters before acquiring.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gold-300/90 pt-1">
              <div className="flex items-center space-x-1.5">
                <Sparkles className="h-4 w-4 text-gold-400" />
                <span>True-to-Scale Diamond Sizing</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="h-4 w-4 text-gold-400" />
                <span>Zero App Download Required</span>
              </div>
            </div>

            <div className="pt-3">
              <Magnet padding={60} magnetStrength={3}>
                <Link
                  href="/try-on"
                  className="inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-gold-400 via-gold-500 to-amber-500 px-8 py-3.5 text-xs font-mono font-bold uppercase tracking-wider text-obsidian-950 hover:brightness-110 shadow-[0_10px_30px_rgba(212,175,55,0.4)] transition-all"
                >
                  <span>Launch AR Fitting Studio</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Magnet>
            </div>
          </div>

          {/* Right Visual Interactive Mockup */}
          <div className="lg:col-span-5 relative">
            <motion.div
              whileHover={{ scale: 1.03, rotateZ: 0.5 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="relative rounded-3xl overflow-hidden border-2 border-gold-500/40 bg-black shadow-2xl group"
            >
              <img
                src="/uploads/rings_15ca97c8_1s6a0175.jpg"
                alt="AR Virtual Try-On Fitting"
                className="w-full h-80 sm:h-96 object-cover object-center filter brightness-[0.88] transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />
              <DiamondGlint />

              {/* AR Overlay HUD Target Frame */}
              <div className="absolute inset-6 border border-gold-400/40 rounded-2xl pointer-events-none flex flex-col justify-between p-3.5 backdrop-blur-[1px]">
                <div className="flex justify-between items-center text-[10px] font-mono text-gold-400">
                  <span className="bg-black/60 px-2 py-0.5 rounded">SCALE: 1.00x</span>
                  <span className="bg-black/60 px-2 py-0.5 rounded">ROTATION: 0°</span>
                </div>
                <div className="text-center text-[10px] font-mono text-white/90 bg-black/70 border border-gold-500/30 rounded-lg py-1 px-3 mx-auto shadow-lg">
                  LIVE FITTING CANVAS ACTIVE
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
