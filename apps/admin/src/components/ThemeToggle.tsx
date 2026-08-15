'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme, Theme } from '@/lib/theme-context';
import { Sun, Moon, Laptop, ChevronDown, Check } from 'lucide-react';

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options: { label: string; value: Theme; icon: React.ReactNode }[] = [
    { label: 'Light Mode', value: 'light', icon: <Sun className="h-4 w-4 text-amber-500" /> },
    { label: 'Dark Mode', value: 'dark', icon: <Moon className="h-4 w-4 text-gold-400" /> },
    { label: 'System Mode', value: 'system', icon: <Laptop className="h-4 w-4 text-slate-400" /> },
  ];

  const currentIcon =
    theme === 'system' ? (
      <Laptop className="h-4 w-4 text-gold-400" />
    ) : resolvedTheme === 'dark' ? (
      <Moon className="h-4 w-4 text-gold-400" />
    ) : (
      <Sun className="h-4 w-4 text-amber-500" />
    );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rounded-lg border border-ivory-400 dark:border-obsidian-700 bg-white/80 dark:bg-obsidian-850 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-sm transition hover:border-gold-500/50"
        title="Change Theme Appearance"
      >
        {currentIcon}
        <span className="capitalize hidden sm:inline text-[11px] font-semibold">
          {theme}
        </span>
        <ChevronDown className="h-3 w-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-ivory-400 dark:border-obsidian-700 bg-white/95 dark:bg-obsidian-900 p-1.5 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setTheme(opt.value);
                setIsOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition ${
                theme === opt.value
                  ? 'bg-gold-500/15 text-gold-700 dark:text-gold-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-ivory-200 dark:hover:bg-obsidian-800'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                {opt.icon}
                <span>{opt.label}</span>
              </div>
              {theme === opt.value && <Check className="h-3.5 w-3.5 text-gold-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
