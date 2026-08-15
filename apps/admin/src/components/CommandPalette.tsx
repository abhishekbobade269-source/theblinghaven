'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/lib/theme-context';
import {
  Search,
  LayoutDashboard,
  Users,
  Shield,
  KeyRound,
  History,
  Package,
  Boxes,
  ShoppingCart,
  DollarSign,
  BarChart3,
  FileText,
  Image as ImageIcon,
  Sun,
  Moon,
  Sparkles,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';

interface CommandItem {
  id: string;
  category: 'Navigation' | 'Actions' | 'Settings';
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string[];
}

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const items: CommandItem[] = [
    // Navigation
    {
      id: 'nav-dashboard',
      category: 'Navigation',
      title: 'Executive Dashboard',
      subtitle: 'Real-time KPIs, multi-currency revenue and charts',
      icon: <LayoutDashboard className="h-4 w-4 text-gold-500" />,
      action: () => {
        router.push('/dashboard');
        onClose();
      },
      keywords: ['home', 'overview', 'kpi', 'sales', 'analytics'],
    },
    {
      id: 'nav-users',
      category: 'Navigation',
      title: 'Users & Roles (RBAC)',
      subtitle: 'Manage administrator accounts, roles and security policies',
      icon: <Users className="h-4 w-4 text-gold-500" />,
      action: () => {
        router.push('/users');
        onClose();
      },
      keywords: ['rbac', 'admins', 'roles', 'permissions', 'accounts'],
    },
    {
      id: 'nav-audit',
      category: 'Navigation',
      title: 'Security Audit Trail',
      subtitle: 'Immutable forensics ledger of privileged activities',
      icon: <History className="h-4 w-4 text-gold-500" />,
      action: () => {
        router.push('/audit');
        onClose();
      },
      keywords: ['logs', 'forensics', 'security', 'events', 'compliance'],
    },
    {
      id: 'nav-2fa',
      category: 'Navigation',
      title: 'Security & 2FA Setup',
      subtitle: 'Configure TOTP authenticator pairing and policy',
      icon: <Shield className="h-4 w-4 text-gold-500" />,
      action: () => {
        router.push('/security/mfa');
        onClose();
      },
      keywords: ['mfa', 'totp', 'authenticator', 'google', 'qr code'],
    },
    {
      id: 'nav-sessions',
      category: 'Navigation',
      title: 'Active Device Sessions',
      subtitle: 'Review and revoke concurrent privileged sessions',
      icon: <KeyRound className="h-4 w-4 text-gold-500" />,
      action: () => {
        router.push('/security/sessions');
        onClose();
      },
      keywords: ['devices', 'ip', 'revoke', 'logins'],
    },
    // Quick Actions
    {
      id: 'act-mfa',
      category: 'Actions',
      title: 'Pair New Authenticator (2FA)',
      subtitle: 'Open QR code authenticator setup flow',
      icon: <Sparkles className="h-4 w-4 text-emerald-500" />,
      action: () => {
        router.push('/security/mfa');
        onClose();
      },
    },
    {
      id: 'act-api-docs',
      category: 'Actions',
      title: 'Open API Swagger Documentation',
      subtitle: 'Inspect live backend REST endpoints and schemas',
      icon: <ExternalLink className="h-4 w-4 text-blue-500" />,
      action: () => {
        window.open('http://localhost:4000/docs', '_blank');
        onClose();
      },
      keywords: ['swagger', 'openapi', 'docs', 'endpoints', 'backend'],
    },
    {
      id: 'act-theme-toggle',
      category: 'Settings',
      title: resolvedTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      subtitle: 'Change visual interface theme',
      icon:
        resolvedTheme === 'dark' ? (
          <Sun className="h-4 w-4 text-amber-500" />
        ) : (
          <Moon className="h-4 w-4 text-gold-500" />
        ),
      action: () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
        onClose();
      },
      keywords: ['mode', 'color', 'light', 'dark', 'theme'],
    },
  ];

  const filteredItems = items.filter((item) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle?.toLowerCase().includes(q) ||
      item.keywords?.some((k) => k.toLowerCase().includes(q))
    );
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
      } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
        e.preventDefault();
        filteredItems[selectedIndex].action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-ivory-400 dark:border-obsidian-700 bg-white dark:bg-obsidian-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="relative border-b border-ivory-300 dark:border-obsidian-800 px-4 py-3.5 flex items-center">
          <Search className="h-5 w-5 text-slate-400 dark:text-slate-500 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, page name, or SKU..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
          />
          <span className="rounded border border-ivory-400 dark:border-obsidian-750 bg-ivory-100 dark:bg-obsidian-850 px-2 py-0.5 font-mono text-[10px] text-slate-500">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No matching commands or pages found for "{query}".
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left transition ${
                    isSelected
                      ? 'border border-gold-500/40 bg-gold-500/10 dark:bg-gold-500/10 text-slate-900 dark:text-slate-100'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-ivory-100 dark:hover:bg-obsidian-850'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="rounded-lg border border-ivory-300 dark:border-obsidian-750 bg-white dark:bg-obsidian-850 p-2">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold">{item.title}</p>
                      {item.subtitle && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <ArrowRight className="h-4 w-4 text-gold-600 dark:text-gold-400 shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-ivory-300 dark:border-obsidian-800 bg-ivory-50 dark:bg-obsidian-950 px-4 py-2 text-[11px] text-slate-500">
          <div className="flex items-center space-x-2">
            <span>Navigation:</span>
            <kbd className="rounded bg-ivory-200 dark:bg-obsidian-850 px-1.5 py-0.5 font-mono text-[10px]">
              ↑
            </kbd>
            <kbd className="rounded bg-ivory-200 dark:bg-obsidian-850 px-1.5 py-0.5 font-mono text-[10px]">
              ↓
            </kbd>
            <span>Select:</span>
            <kbd className="rounded bg-ivory-200 dark:bg-obsidian-850 px-1.5 py-0.5 font-mono text-[10px]">
              ↵
            </kbd>
          </div>
          <span>The Bling Haven Omni-Search</span>
        </div>
      </div>
    </div>
  );
}
