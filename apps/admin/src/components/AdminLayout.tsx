'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ThemeToggle } from './ThemeToggle';
import { CommandPalette } from './CommandPalette';
import {
  LayoutDashboard,
  Shield,
  Users,
  Image as ImageIcon,
  FileText,
  Package,
  Boxes,
  ShoppingCart,
  DollarSign,
  BarChart3,
  LogOut,
  KeyRound,
  History,
  Menu,
  X,
  Search,
  Sparkles,
  Command,
  ChevronDown,
  Tag,
  Landmark,
  Headphones,
  Gem,
  FileSpreadsheet,
  Coins,
  ShieldCheck,
  Camera,
  Crown,
  Building,
  Bot,
  FileCheck,
  LifeBuoy,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavSection {
  title: string;
  items: {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    disabled?: boolean;
  }[];
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapse preference
  useEffect(() => {
    const saved = localStorage.getItem('tbh_admin_sidebar_collapsed');
    if (saved === 'true') {
      setIsCollapsed(true);
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('tbh_admin_sidebar_collapsed', String(next));
      return next;
    });
  };

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-ivory-100 dark:bg-obsidian-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gold-500/20 border-t-gold-500"></div>
          <p className="text-sm font-medium tracking-wider text-gold-700 dark:text-gold-300">
            LOADING ADMIN PORTAL...
          </p>
        </div>
      </div>
    );
  }

  const navSections: NavSection[] = [
    {
      title: 'Overview & Security',
      items: [
        { label: 'Admin Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Financial Analytics', href: '/analytics', icon: BarChart3, badge: 'Live' },
        { label: 'Staff & Team Users', href: '/users', icon: Users, badge: 'RBAC' },
        { label: 'Roles & Permissions', href: '/roles', icon: Shield, badge: '10 Roles' },
        { label: 'Security Audit Log', href: '/audit', icon: History },
        { label: 'Two-Factor Auth (2FA)', href: '/security/mfa', icon: KeyRound },
        { label: 'Active Login Sessions', href: '/security/sessions', icon: KeyRound },
      ],
    },
    {
      title: 'Jewellery & Stock',
      items: [
        { label: 'Jewellery Catalog', href: '/catalog', icon: Package, badge: 'Active' },
        { label: 'Inventory & Stock', href: '/inventory', icon: Boxes, badge: 'Active' },
        { label: 'Multi-Currency Pricing', href: '/pricing', icon: DollarSign, badge: 'Active' },
        { label: 'Gold & Silver Rates', href: '/metals', icon: Coins, badge: 'Live' },
        { label: 'Certificates & Hallmarks', href: '/certificates', icon: ShieldCheck, badge: 'GIA / 4Cs' },
        { label: 'Virtual Try-On Studio', href: '/try-on', icon: Camera, badge: 'AR Live' },
        { label: 'Store & Vault Network', href: '/vaults', icon: Building, badge: 'Locations' },
      ],
    },
    {
      title: 'Orders & Customers',
      items: [
        { label: 'Orders & Deliveries', href: '/orders', icon: ShoppingCart, badge: 'Live' },
        { label: 'Customer Directory', href: '/customers', icon: Users, badge: 'VIP' },
        { label: 'Customer Support Desk', href: '/support', icon: LifeBuoy, badge: 'Tickets' },
        { label: 'VIP Club & Offers', href: '/vip', icon: Crown, badge: 'VIP' },
        { label: 'AI Voice Assistant', href: '/ai-concierge', icon: Bot, badge: 'Voice AI' },
        { label: 'Showroom Appointments', href: '/concierge', icon: Headphones, badge: 'Bookings' },
        { label: 'Custom 3D Designs', href: '/bespoke', icon: Gem, badge: 'CAD' },
      ],
    },
    {
      title: 'Marketing & Accounts',
      items: [
        { label: 'Discount Coupons & Offers', href: '/promotions', icon: Tag, badge: 'Coupons' },
        { label: 'GST & Taxes', href: '/taxes', icon: Landmark, badge: 'GST/Tax' },
        { label: 'Sales & Audit Reports', href: '/reports', icon: FileSpreadsheet, badge: 'Reports' },
        { label: 'Daily Accounts & Closing', href: '/fiscal-close', icon: FileCheck, badge: 'Daily EOD' },
      ],
    },
    {
      title: 'Website & Media',
      items: [
        { label: 'Website CMS & Pages', href: '/cms', icon: FileText, badge: 'Master' },
        { label: 'Media & Image Library', href: '/media', icon: ImageIcon, badge: 'Images' },
      ],
    },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8F7F4] dark:bg-obsidian-950 text-slate-800 dark:text-slate-200 transition-colors">
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col h-screen shrink-0 border-r border-slate-200 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 shadow-lg transition-all duration-300 z-30 ${
          isCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Brand Header with Collapse Toggle */}
        <div className="flex h-20 items-center justify-between border-b border-slate-200 dark:border-obsidian-750 px-4">
          <Link href="/dashboard" className="flex items-center space-x-3 group overflow-hidden">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-gold-500/40 bg-white p-1 shadow-sm transition group-hover:border-gold-500">
              <img
                src="/images/logo.png"
                alt="The Bling Haven Logo"
                className="h-full w-full object-contain"
              />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 transition-opacity duration-200">
                <span className="font-serif text-base font-bold tracking-wider text-slate-900 dark:text-slate-100 truncate block">
                  THE BLING HAVEN
                </span>
                <span className="block text-[9px] font-bold uppercase tracking-widest text-gold-700 dark:text-gold-400">
                  ADMIN PORTAL
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-slate-400 hover:text-gold-600 dark:hover:text-gold-400 hover:bg-slate-100 dark:hover:bg-white/5 transition"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Quick Search trigger button */}
        {!isCollapsed && (
          <div className="px-4 pt-3 pb-1">
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-obsidian-950 text-xs text-slate-400 hover:border-gold-500/50 hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              <div className="flex items-center space-x-2">
                <Search className="h-3.5 w-3.5" />
                <span>Search pages & orders...</span>
              </div>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-200 dark:bg-obsidian-800 text-[10px] font-mono text-slate-500">
                Ctrl+K
              </kbd>
            </button>
          </div>
        )}

        {/* Scrollable Navigation Sections */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-6 custom-scrollbar">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed && (
                <p className="px-3 text-[10px] font-mono uppercase tracking-widest text-slate-600 dark:text-slate-400 font-bold">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={isCollapsed ? item.label : undefined}
                    className={`flex items-center rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-gold-500/15 text-gold-700 dark:text-gold-400 font-bold border border-gold-500/30 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-obsidian-800 hover:text-slate-900 dark:hover:text-slate-100'
                    } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <Icon className="h-4 w-4 shrink-0" />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>
                    {!isCollapsed && item.badge && (
                      <span className="rounded bg-slate-200 dark:bg-obsidian-800 px-1.5 py-0.5 text-[9px] font-mono text-slate-600 dark:text-slate-400 shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Footer */}
        <div className="border-t border-slate-200 dark:border-obsidian-750 p-3 bg-slate-50 dark:bg-obsidian-950">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-500/20 font-serif font-bold text-gold-700 dark:text-gold-400 border border-gold-500/30">
                {user?.firstName?.charAt(0) || 'A'}
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Administrator'}
                  </p>
                  <p className="text-[10px] text-gold-700 dark:text-gold-400 font-mono truncate">
                    {user?.role ? user.role.replace(/_/g, ' ') : 'SUPER ADMIN'}
                  </p>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <div className="flex items-center space-x-1">
                <ThemeToggle />
                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header Bar */}
        <header className="lg:hidden flex h-16 items-center justify-between border-b border-slate-200 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 px-4">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-obsidian-800"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-serif text-sm font-bold text-slate-900 dark:text-slate-100">
            THE BLING HAVEN ADMIN
          </span>
          <ThemeToggle />
        </header>

        {/* Mobile Slide-Over Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="w-80 bg-white dark:bg-obsidian-900 h-full flex flex-col p-4 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-obsidian-750 pb-3">
                <span className="font-serif font-bold text-slate-900 dark:text-slate-100">Navigation</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-slate-400">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4">
                {navSections.map((section, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="px-2 text-[10px] font-mono uppercase text-slate-400 font-bold">
                      {section.title}
                    </p>
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs ${
                            isActive
                              ? 'bg-gold-500 text-obsidian-950 font-bold'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>

              <button
                onClick={logout}
                className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-rose-500/10 text-rose-600 text-xs font-bold"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Body */}
        <main className="flex-1 overflow-y-auto bg-[#F8F7F4] dark:bg-obsidian-950 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
