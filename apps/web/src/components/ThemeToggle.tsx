'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative p-2.5 rounded-full border border-stone-300/40 dark:border-white/15 bg-stone-100/60 dark:bg-white/[0.06] text-stone-700 dark:text-gold-400 hover:border-gold-400/60 hover:text-gold-500 dark:hover:text-gold-300 hover:bg-gold-500/10 transition-all duration-300 shadow-sm backdrop-blur-sm ${className}`}
      title={`Switch to ${theme === 'dark' ? 'Light Ivory' : 'Obsidian Dark'} Theme`}
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 hover:rotate-90" />
      ) : (
        <Moon className="h-4 w-4 text-stone-700 hover:text-gold-600 transition-transform duration-300" />
      )}
    </button>
  );
}
