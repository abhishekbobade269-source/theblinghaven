'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showLabel?: boolean;
  className?: string;
  enableGlint?: boolean;
}

export function AnimatedBrandLogo({
  size = 'md',
  showLabel = false,
  className = '',
  enableGlint = true,
}: AnimatedBrandLogoProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-44 h-44',
    hero: 'w-56 h-56 sm:w-64 sm:h-64',
  }[size];

  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      {/* Outer ambient golden glow ring */}
      <motion.div
        className="absolute -inset-2 rounded-full opacity-60 filter blur-xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(234,179,8,0.45) 0%, rgba(244,114,182,0.25) 45%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.45, 0.75, 0.45],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Rotating thin orbital golden ring */}
      <motion.div
        className="absolute -inset-1 rounded-full border border-gold-400/40 border-dashed pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Interactive logo badge with tilt and hover scale */}
      <motion.div
        whileHover={{ scale: 1.06, rotate: 1.5 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`relative ${sizeClasses} rounded-full p-1 bg-gradient-to-tr from-gold-500/60 via-pink-200/50 to-gold-400/80 shadow-[0_10px_35px_rgba(212,175,55,0.28)] overflow-hidden cursor-pointer`}
      >
        {/* Core circle logo image */}
        <img
          src="/images/logo_circle.png"
          alt="The Bling Haven Logo"
          className="w-full h-full object-cover rounded-full select-none"
        />

        {/* Shimmer sweep reflection */}
        {enableGlint && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none"
            initial={{ x: '-150%', y: '-150%' }}
            animate={{ x: '150%', y: '150%' }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              repeatDelay: 2.5,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.div>

      {showLabel && (
        <div className="mt-3 text-center">
          <span className="block font-serif text-lg font-bold tracking-wider text-slate-900 dark:text-slate-100">
            The Bling Haven
          </span>
          <span className="block text-[10px] font-mono tracking-widest text-gold-600 dark:text-gold-400 uppercase">
            Maison de Haute Joaillerie
          </span>
        </div>
      )}
    </div>
  );
}
