'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';
import { useUserAuth } from '@/context/UserAuthContext';
import { apiRequest } from '@/lib/api';
import { ThemeToggle } from './ThemeToggle';
import { ShinyText } from '@/components/react-bits';
import {
  ShoppingBag,
  Globe2,
  Sparkles,
  Menu,
  X,
  ChevronDown,
  Crown,
  PhoneCall,
  Gem,
  Bot,
  LifeBuoy,
  ShieldCheck,
  Truck,
  ArrowRight,
  CircleDot,
  Award,
  User,
  Heart,
  Tag,
  LogOut,
  Package,
  Maximize2,
} from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Rings',
    subtitle: 'Solitaires, cocktail rings & eternity bands',
    href: '/rings',
    icon: Gem,
    thumbnail: '/uploads/rings_03526cf9_1s6a0179.jpg',
  },
  {
    name: 'Necklaces & Sets',
    subtitle: 'Chokers, bridal sets & statement necklaces',
    href: '/bridal-sets',
    icon: Crown,
    thumbnail: '/uploads/sets_00c2f42a_1s6a9390.jpg',
  },
  {
    name: 'Earrings',
    subtitle: 'Studs, jhumkas, drops & chandeliers',
    href: '/earrings',
    icon: Sparkles,
    thumbnail: '/uploads/earrings_d696144e_1s6a9783.jpg',
  },
  {
    name: 'Bangles & Bracelets',
    subtitle: 'Traditional kadas, bangles & tennis bracelets',
    href: '/bangles',
    icon: Award,
    thumbnail: '/uploads/bangles_8897c8d9_1s6a0166.jpg',
  },
  {
    name: 'Silver Jewellery',
    subtitle: '925 sterling silver chains, pendants & daily wear',
    href: '/artisan-silver',
    icon: CircleDot,
    thumbnail: '/uploads/handmade_59b489a2_1s6a0201.jpg',
  },
];

export function Header() {
  const pathname = usePathname();
  if (pathname === '/future-fashion') return null;

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDarkAtmospherePage =
    pathname === '/gallery' ||
    pathname === '/ai-assistant' ||
    pathname === '/ai-concierge' ||
    pathname === '/vip-lounge' ||
    (pathname === '/' && !isScrolled);

  const { currentCurrency, currencySymbol, rates, setCurrency } = useCurrency();
  const { itemCount, setIsCartOpen } = useCart();
  const { user, openAuthModal, logout, wishlistCount } = useUserAuth();

  const [isEditorialMenuOpen, setIsEditorialMenuOpen] = useState(false);
  const [isActionHubOpen, setIsActionHubOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [metalRates, setMetalRates] = useState<any[]>([]);
  const [pageControls, setPageControls] = useState<any[]>([]);
  const actionHubTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMenuMouseEnter = () => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
      menuTimeoutRef.current = null;
    }
    setIsActionHubOpen(false);
    setIsCurrencyDropdownOpen(false);
    setIsEditorialMenuOpen(true);
  };

  const handleMenuMouseLeave = () => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    menuTimeoutRef.current = setTimeout(() => {
      setIsEditorialMenuOpen(false);
    }, 240);
  };

  const handleHubMouseEnter = () => {
    if (actionHubTimeoutRef.current) {
      clearTimeout(actionHubTimeoutRef.current);
      actionHubTimeoutRef.current = null;
    }
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
      menuTimeoutRef.current = null;
    }
    setIsEditorialMenuOpen(false);
    setIsActionHubOpen(true);
  };

  const handleHubMouseLeave = () => {
    actionHubTimeoutRef.current = setTimeout(() => {
      setIsActionHubOpen(false);
      setIsCurrencyDropdownOpen(false);
    }, 280);
  };

  useEffect(() => {
    return () => {
      if (actionHubTimeoutRef.current) {
        clearTimeout(actionHubTimeoutRef.current);
      }
      if (menuTimeoutRef.current) {
        clearTimeout(menuTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setIsEditorialMenuOpen(false);
    setIsActionHubOpen(false);
    setIsCurrencyDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsEditorialMenuOpen(false);
        setIsActionHubOpen(false);
      }
    };
    if (isEditorialMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEditorialMenuOpen]);

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const [metalsRes, pagesRes] = await Promise.all([
          apiRequest<any>('/metals/rates'),
          apiRequest<any>('/cms/page-controls'),
        ]);
        setMetalRates(Array.isArray(metalsRes) ? metalsRes : metalsRes?.data || []);
        const pcList = Array.isArray(pagesRes) ? pagesRes : pagesRes?.data || [];
        setPageControls(pcList);
      } catch {}
    };
    fetchHeaderData();
  }, []);

  const isRouteVisible = (routePath: string) => {
    const pc = pageControls.find((p) => p.pageRoute === routePath);
    if (!pc) return true;
    if (pc.hideFromNavigation) return false;
    if (pc.status === 'DISABLED') return false;
    return true;
  };

  const getRouteStatus = (routePath: string) => {
    const pc = pageControls.find((p) => p.pageRoute === routePath);
    return pc?.status || 'ACTIVE';
  };

  const customNavPages = pageControls.filter(
    (p) => p.pageType === 'CUSTOM_PAGE' && isRouteVisible(p.pageRoute)
  );

  const visibleCategories = CATEGORIES.filter((c) => isRouteVisible(c.href));

  const rate22K = metalRates.find((m) => m.purityCode === '22K_916');
  const rate18K = metalRates.find((m) => m.purityCode === '18K_750');

  const activeRateRecord = rates.find((r) => r.currencyCode === currentCurrency) || rates[0];
  const conv22K = rate22K
    ? Math.round(rate22K.spotPriceUsdPerGram * (activeRateRecord?.effectiveRate || 1) * 10) / 10
    : 108.3;
  const conv18K = rate18K
    ? Math.round(rate18K.spotPriceUsdPerGram * (activeRateRecord?.effectiveRate || 1) * 10) / 10
    : 81.9;

  return (
    <>
      {/* Main Navigation Header (Transparent per page with warm golden glassmorphism) */}
      <header
        className={`sticky top-0 z-[350] transition-all duration-300 border-b ${
          isDarkAtmospherePage || isEditorialMenuOpen
            ? 'text-white'
            : 'bg-white/75 dark:bg-[#0A0A0E]/75 backdrop-blur-xl border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-slate-100 shadow-sm'
        }`}
        style={
          isDarkAtmospherePage || isEditorialMenuOpen
            ? {
                background:
                  'linear-gradient(180deg, rgba(14, 10, 8, 0.92) 0%, rgba(10, 8, 6, 0.88) 100%)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
                boxShadow:
                  '0 8px 32px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(251, 191, 36, 0.25)',
              }
            : undefined
        }
      >
        <div className="w-full px-4 sm:px-8 xl:px-12 flex h-16 sm:h-20 items-center justify-between">
          {/* Brand Identity */}
          <Link href="/" className="flex items-center space-x-2.5 sm:space-x-4 group shrink-0">
            <div
              className={`relative h-10 w-10 sm:h-12 sm:w-12 overflow-hidden rounded-full border p-0.5 shadow-md group-hover:scale-108 transition-all duration-300 ${
                isDarkAtmospherePage || isEditorialMenuOpen
                  ? 'border-gold-400/60 bg-black/50 shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : 'border-gold-500/50 bg-white dark:bg-black/50 shadow-[0_0_15px_rgba(212,175,55,0.25)]'
              }`}
            >
              <img
                src="/images/logo_circle.png"
                alt="The Bling Haven Logo"
                className="h-full w-full object-cover rounded-full"
              />
            </div>
            <div>
              <span
                className={`font-marcellus text-base sm:text-xl font-bold tracking-[0.18em] uppercase block transition ${
                  isDarkAtmospherePage || isEditorialMenuOpen
                    ? 'text-white group-hover:text-gold-300'
                    : 'text-slate-900 dark:text-slate-100 group-hover:text-gold-600 dark:group-hover:text-gold-400'
                }`}
              >
                THE BLING HAVEN
              </span>
              <span className="text-[7.5px] sm:text-[9px] font-marcellus tracking-[0.26em] text-gold-600 dark:text-gold-400 font-semibold block uppercase">
                Luxury Fashion &amp; Bridal Jewellery
              </span>
            </div>
          </Link>

          {/* Central Editorial MENU (Clean normal text in Anton font, opens on hover, closes on cursor leave) */}
          <div
            className="flex items-center justify-center py-2"
            onMouseEnter={handleMenuMouseEnter}
            onMouseLeave={handleMenuMouseLeave}
          >
            <button
              type="button"
              onMouseEnter={handleMenuMouseEnter}
              onClick={() => setIsEditorialMenuOpen((prev) => !prev)}
              className={`font-anton text-2xl sm:text-3xl tracking-[0.22em] uppercase transition-all duration-300 hover:scale-108 cursor-pointer select-none ${
                isEditorialMenuOpen
                  ? 'text-gold-400 scale-105'
                  : isDarkAtmospherePage
                    ? 'text-white hover:text-gold-400'
                    : 'text-stone-900 dark:text-stone-100 hover:text-gold-600 dark:hover:text-gold-400'
              }`}
              aria-label="Open Navigation Menu"
            >
              MENU
            </button>
          </div>

          {/* Consolidated Action Hub (Dynamic Theme Adapted Circle with Cascading Options Downside) */}
          <div
            className="relative"
            onMouseEnter={handleHubMouseEnter}
            onMouseLeave={handleHubMouseLeave}
          >
            {/* Master Circle Trigger */}
            <button
              type="button"
              onClick={() => setIsActionHubOpen(!isActionHubOpen)}
              className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-108 backdrop-blur-xl cursor-pointer ${
                isActionHubOpen
                  ? 'border-gold-400 bg-gold-500 text-obsidian-950 shadow-[0_0_20px_rgba(212,175,55,0.5)]'
                  : isDarkAtmospherePage
                    ? 'border-gold-500/50 bg-stone-950/80 text-gold-400 hover:border-gold-400 hover:bg-stone-900 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
                    : 'border-stone-300/80 dark:border-gold-500/40 bg-white/90 dark:bg-stone-950/80 text-stone-800 dark:text-gold-400 hover:border-gold-500 shadow-md'
              }`}
              aria-label="Atelier Quick Actions"
            >
              {/* Minimal geometric diamond hub icon */}
              <div className="grid grid-cols-2 gap-1 p-0.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    isActionHubOpen
                      ? 'bg-obsidian-950'
                      : isDarkAtmospherePage
                        ? 'bg-gold-400'
                        : 'bg-stone-800 dark:bg-gold-400'
                  }`}
                />
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    isActionHubOpen
                      ? 'bg-obsidian-950'
                      : isDarkAtmospherePage
                        ? 'bg-gold-400'
                        : 'bg-stone-800 dark:bg-gold-400'
                  }`}
                />
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    isActionHubOpen
                      ? 'bg-obsidian-950'
                      : isDarkAtmospherePage
                        ? 'bg-gold-400'
                        : 'bg-stone-800 dark:bg-gold-400'
                  }`}
                />
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    isActionHubOpen
                      ? 'bg-obsidian-950'
                      : isDarkAtmospherePage
                        ? 'bg-gold-400'
                        : 'bg-stone-800 dark:bg-gold-400'
                  }`}
                />
              </div>

              {/* Notification count badge if bag or wishlist has items */}
              {(itemCount > 0 || wishlistCount > 0) && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-obsidian-950 font-mono text-[9px] font-bold shadow-md ring-2 ring-stone-950 dark:ring-stone-950">
                  {itemCount > 0 ? itemCount : wishlistCount}
                </span>
              )}
            </button>

            {/* Invisible hover bridge to prevent mouse leaving container */}
            <div className="absolute top-full -right-2 w-16 h-3 bg-transparent" />

            {/* Cascading Dropdown Circles Downside */}
            <div
              className={`absolute right-0 top-full pt-3 z-[150] flex flex-col items-center space-y-2.5 transition-all duration-300 ${
                isActionHubOpen
                  ? 'opacity-100 visible pointer-events-auto translate-y-0'
                  : 'opacity-0 invisible pointer-events-none -translate-y-2'
              }`}
            >
              {/* 1. Shopping Bag Circle */}
              <div className="relative group/circle">
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(true);
                    setIsActionHubOpen(false);
                  }}
                  className={`relative w-11 h-11 rounded-full border flex items-center justify-center shadow-xl transition-all duration-200 hover:scale-110 backdrop-blur-2xl cursor-pointer ${
                    isDarkAtmospherePage
                      ? 'border-gold-400/40 bg-stone-950/95 text-gold-400 hover:bg-gold-500 hover:text-obsidian-950'
                      : 'border-stone-200 dark:border-gold-500/30 bg-white/95 dark:bg-stone-950/95 text-stone-800 dark:text-gold-400 hover:bg-gold-500 hover:text-obsidian-950 hover:border-gold-500'
                  }`}
                  aria-label="Shopping Bag"
                >
                  <ShoppingBag className="h-4 w-4" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-obsidian-950 font-mono text-[9px] font-bold shadow-md">
                      {itemCount}
                    </span>
                  )}
                </button>
                <span
                  className={`pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl border px-3 py-1 text-[11px] font-marcellus tracking-wider shadow-xl opacity-0 group-hover/circle:opacity-100 transition-opacity ${
                    isDarkAtmospherePage
                      ? 'bg-stone-950/95 border-gold-500/30 text-gold-300'
                      : 'bg-white/95 dark:bg-stone-950/95 border-stone-200 dark:border-gold-500/30 text-stone-800 dark:text-gold-300'
                  }`}
                >
                  Shopping Bag {itemCount > 0 ? `(${itemCount})` : ''}
                </span>
              </div>

              {/* 2. Wishlist Circle */}
              <div className="relative group/circle">
                <Link
                  href="/account"
                  onClick={() => setIsActionHubOpen(false)}
                  className={`relative w-11 h-11 rounded-full border flex items-center justify-center shadow-xl transition-all duration-200 hover:scale-110 backdrop-blur-2xl ${
                    isDarkAtmospherePage
                      ? 'border-gold-400/40 bg-stone-950/95 text-gold-400 hover:bg-rose-500 hover:text-white hover:border-rose-400'
                      : 'border-stone-200 dark:border-gold-500/30 bg-white/95 dark:bg-stone-950/95 text-stone-800 dark:text-gold-400 hover:bg-rose-500 hover:text-white hover:border-rose-400'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className="h-4 w-4" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-white font-mono text-[9px] font-bold shadow-md">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <span
                  className={`pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl border px-3 py-1 text-[11px] font-marcellus tracking-wider shadow-xl opacity-0 group-hover/circle:opacity-100 transition-opacity ${
                    isDarkAtmospherePage
                      ? 'bg-stone-950/95 border-gold-500/30 text-gold-300'
                      : 'bg-white/95 dark:bg-stone-950/95 border-stone-200 dark:border-gold-500/30 text-stone-800 dark:text-gold-300'
                  }`}
                >
                  Wishlist {wishlistCount > 0 ? `(${wishlistCount})` : ''}
                </span>
              </div>

              {/* 3. Currency Changer Circle */}
              <div className="relative group/circle">
                <button
                  type="button"
                  onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                  className={`relative w-11 h-11 rounded-full border flex items-center justify-center shadow-xl transition-all duration-200 hover:scale-110 backdrop-blur-2xl font-marcellus text-[10px] font-bold tracking-wider cursor-pointer ${
                    isDarkAtmospherePage
                      ? 'border-gold-400/40 bg-stone-950/95 text-gold-400 hover:bg-gold-500 hover:text-obsidian-950'
                      : 'border-stone-200 dark:border-gold-500/30 bg-white/95 dark:bg-stone-950/95 text-stone-800 dark:text-gold-400 hover:bg-gold-500 hover:text-obsidian-950 hover:border-gold-500'
                  }`}
                  aria-label="Select Currency"
                >
                  <span>{currentCurrency}</span>
                </button>
                <span
                  className={`pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl border px-3 py-1 text-[11px] font-marcellus tracking-wider shadow-xl opacity-0 group-hover/circle:opacity-100 transition-opacity ${
                    isDarkAtmospherePage
                      ? 'bg-stone-950/95 border-gold-500/30 text-gold-300'
                      : 'bg-white/95 dark:bg-stone-950/95 border-stone-200 dark:border-gold-500/30 text-stone-800 dark:text-gold-300'
                  }`}
                >
                  Currency: {currentCurrency}
                </span>

                {/* Currency Flyout Submenu */}
                {isCurrencyDropdownOpen && (
                  <div
                    className={`absolute right-full mr-3 top-0 w-48 rounded-2xl border p-2 shadow-2xl backdrop-blur-2xl z-[160] animate-in fade-in slide-in-from-right-1 duration-150 ${
                      isDarkAtmospherePage
                        ? 'border-gold-500/40 bg-stone-950/95 text-stone-300'
                        : 'border-stone-200 dark:border-gold-500/40 bg-white/95 dark:bg-stone-950/95 text-stone-800 dark:text-stone-300'
                    }`}
                  >
                    <div className="text-[9px] uppercase font-marcellus font-bold text-gold-500 dark:text-gold-400 px-2.5 py-1 border-b border-stone-200 dark:border-white/10 mb-1">
                      Select Currency
                    </div>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {rates.map((r) => (
                        <button
                          key={r.currencyCode}
                          onClick={() => {
                            setCurrency(r.currencyCode);
                            setIsCurrencyDropdownOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition font-marcellus ${
                            currentCurrency === r.currencyCode
                              ? 'bg-gold-500 text-obsidian-950 font-bold'
                              : 'hover:bg-gold-500/20 hover:text-gold-600 dark:hover:text-gold-300'
                          }`}
                        >
                          <span>{r.currencyCode}</span>
                          <span>{r.symbol} {r.currencyName}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. User Account / Sign In Circle */}
              <div className="relative group/circle">
                {user ? (
                  <Link
                    href="/account"
                    onClick={() => setIsActionHubOpen(false)}
                    className={`relative w-11 h-11 rounded-full border flex items-center justify-center shadow-xl transition-all duration-200 hover:scale-110 backdrop-blur-2xl overflow-hidden ${
                      isDarkAtmospherePage
                        ? 'border-gold-400/40 bg-stone-950/95 text-gold-400 hover:bg-gold-500 hover:text-obsidian-950'
                        : 'border-stone-200 dark:border-gold-500/30 bg-white/95 dark:bg-stone-950/95 text-stone-800 dark:text-gold-400 hover:bg-gold-500 hover:text-obsidian-950 hover:border-gold-500'
                    }`}
                    aria-label="My Account"
                  >
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      openAuthModal('LOGIN');
                      setIsActionHubOpen(false);
                    }}
                    className={`relative w-11 h-11 rounded-full border flex items-center justify-center shadow-xl transition-all duration-200 hover:scale-110 backdrop-blur-2xl cursor-pointer ${
                      isDarkAtmospherePage
                        ? 'border-gold-400/40 bg-stone-950/95 text-gold-400 hover:bg-gold-500 hover:text-obsidian-950'
                        : 'border-stone-200 dark:border-gold-500/30 bg-white/95 dark:bg-stone-950/95 text-stone-800 dark:text-gold-400 hover:bg-gold-500 hover:text-obsidian-950 hover:border-gold-500'
                    }`}
                    aria-label="Sign In"
                  >
                    <User className="h-4 w-4" />
                  </button>
                )}
                <span
                  className={`pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl border px-3 py-1 text-[11px] font-marcellus tracking-wider shadow-xl opacity-0 group-hover/circle:opacity-100 transition-opacity ${
                    isDarkAtmospherePage
                      ? 'bg-stone-950/95 border-gold-500/30 text-gold-300'
                      : 'bg-white/95 dark:bg-stone-950/95 border-stone-200 dark:border-gold-500/30 text-stone-800 dark:text-gold-300'
                  }`}
                >
                  {user ? user.firstName || 'My Account' : 'Sign In'}
                </span>
              </div>

              {/* 5. Dark / Light Theme Mode Circle */}
              <div className="relative group/circle">
                <ThemeToggle
                  className={`!w-11 !h-11 !rounded-full !shadow-xl !backdrop-blur-2xl ${
                    isDarkAtmospherePage
                      ? '!border-gold-400/40 !bg-stone-950/95 !text-gold-400 hover:!bg-gold-500 hover:!text-obsidian-950'
                      : '!border-stone-200 dark:!border-gold-500/30 !bg-white/95 dark:!bg-stone-950/95 !text-stone-800 dark:!text-gold-400 hover:!bg-gold-500 hover:!text-obsidian-950'
                  }`}
                />
                <span
                  className={`pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl border px-3 py-1 text-[11px] font-marcellus tracking-wider shadow-xl opacity-0 group-hover/circle:opacity-100 transition-opacity ${
                    isDarkAtmospherePage
                      ? 'bg-stone-950/95 border-gold-500/30 text-gold-300'
                      : 'bg-white/95 dark:bg-stone-950/95 border-stone-200 dark:border-gold-500/30 text-stone-800 dark:text-gold-300'
                  }`}
                >
                  Theme Mode
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Full-Screen Editorial Menu (No Card, Clean Floating Anton Typography, Closes on Cursor Leave) */}
      {isEditorialMenuOpen && (
        <div
          className="fixed inset-0 z-[300] bg-black/85 backdrop-blur-3xl flex flex-col items-center justify-center animate-in fade-in duration-200"
          onMouseEnter={handleMenuMouseLeave}
          onClick={() => setIsEditorialMenuOpen(false)}
        >
          {/* Central Interactive Menu Column (Floating in the center of full screen) */}
          <div
            className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-24 pb-10 max-w-3xl w-full min-h-screen select-none"
            onMouseEnter={handleMenuMouseEnter}
            onMouseLeave={handleMenuMouseLeave}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Centered Large Bold Editorial Menu (Anton font, oversized, high-fashion) */}
            <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 md:space-y-5 text-center my-auto">
              <Link
                href="/catalog"
                onClick={() => setIsEditorialMenuOpen(false)}
                className="font-anton text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-stone-100 hover:text-gold-400 hover:scale-105 transition-all duration-200 block"
              >
                COLLECTIONS
              </Link>

              <Link
                href="/bespoke"
                onClick={() => setIsEditorialMenuOpen(false)}
                className="font-anton text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-stone-100 hover:text-gold-400 hover:scale-105 transition-all duration-200 block"
              >
                CUSTOM JEWELLERY
              </Link>

              <Link
                href="/ai-assistant"
                onClick={() => setIsEditorialMenuOpen(false)}
                className="font-anton text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-stone-100 hover:text-gold-400 hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 sm:space-x-3"
              >
                <span>AI STYLIST</span>
                <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 text-gold-400 inline-block animate-pulse" />
              </Link>

              <Link
                href="/gallery"
                onClick={() => setIsEditorialMenuOpen(false)}
                className="font-anton text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-stone-100 hover:text-gold-400 hover:scale-105 transition-all duration-200 block"
              >
                GALLERY
              </Link>

              <Link
                href="/care-guide"
                onClick={() => setIsEditorialMenuOpen(false)}
                className="font-anton text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-stone-100 hover:text-gold-400 hover:scale-105 transition-all duration-200 block"
              >
                CLIENT SERVICES
              </Link>

              <Link
                href="/about"
                onClick={() => setIsEditorialMenuOpen(false)}
                className="font-anton text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-stone-100 hover:text-gold-400 hover:scale-105 transition-all duration-200 block"
              >
                ABOUT
              </Link>
            </div>

            {/* Subtle luxury gold divider line */}
            <div className="w-48 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent my-5 sm:my-7" />

            {/* Sub-tier Quick Links Bar */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-marcellus tracking-[0.22em] uppercase text-stone-300">
              <Link href="/rings" onClick={() => setIsEditorialMenuOpen(false)} className="hover:text-gold-400 transition-colors">Rings</Link>
              <span className="text-gold-500/50">•</span>
              <Link href="/bridal-sets" onClick={() => setIsEditorialMenuOpen(false)} className="hover:text-gold-400 transition-colors">Necklaces</Link>
              <span className="text-gold-500/50">•</span>
              <Link href="/earrings" onClick={() => setIsEditorialMenuOpen(false)} className="hover:text-gold-400 transition-colors">Earrings</Link>
              <span className="text-gold-500/50">•</span>
              <Link href="/bangles" onClick={() => setIsEditorialMenuOpen(false)} className="hover:text-gold-400 transition-colors">Bangles</Link>
              <span className="text-gold-500/50">•</span>
              <Link href="/artisan-silver" onClick={() => setIsEditorialMenuOpen(false)} className="hover:text-gold-400 transition-colors">Silver</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
