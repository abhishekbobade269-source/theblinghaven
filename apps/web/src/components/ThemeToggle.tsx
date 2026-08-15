'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="flex items-center space-x-1.5 rounded-full border border-gold-500/40 bg-black/40 dark:bg-white/10 px-3 py-1.5 text-xs font-mono font-bold tracking-wider text-gold-400 dark:text-gold-300 hover:border-gold-400 hover:bg-gold-500/10 transition-all duration-300 shadow-sm"
      title={`Switch to ${theme === 'dark' ? 'Light Ivory' : 'Obsidian Dark'} Theme`}
    >
      {theme === 'dark' ? (
        <>
          <Sun className="h-3.5 w-3.5 text-amber-400 animate-spin-slow" />
          <span className="hidden md:inline">Light</span>
        </>
      ) : (
        <>
          <Moon className="h-3.5 w-3.5 text-gold-400" />
          <span className="hidden md:inline">Dark</span>
        </>
      )}
    </button>
  );
}
