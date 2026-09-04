'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DiamondGlintProps {
  delay?: number;
  className?: string;
}

export function DiamondGlint({ delay = 0, className = '' }: DiamondGlintProps) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* 45-degree crystalline light sweep */}
      <motion.div
        initial={{ x: '-150%', opacity: 0 }}
        whileHover={{
          x: '200%',
          opacity: [0, 0.4, 0.8, 0.4, 0],
          transition: { duration: 0.8, ease: 'easeInOut', delay },
        }}
        className="absolute -inset-y-10 -inset-x-20 w-32 bg-gradient-to-r from-transparent via-white/40 dark:via-gold-300/30 to-transparent transform -skew-x-12 blur-[1px]"
      />
      {/* Subtle secondary glint */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileHover={{
          scale: [0, 1.2, 0.8, 0],
          opacity: [0, 0.9, 0.6, 0],
          transition: { duration: 0.6, delay: delay + 0.2 },
        }}
        className="absolute top-4 right-4 h-4 w-4 bg-gradient-radial from-white via-gold-200/50 to-transparent rounded-full shadow-[0_0_12px_rgba(255,255,255,0.8)]"
      />
    </div>
  );
}
