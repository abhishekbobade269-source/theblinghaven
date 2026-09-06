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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [metalRates, setMetalRates] = useState<any[]>([]);
  const [pageControls, setPageControls] = useState<any[]>([]);
  const [activeNavDropdown, setActiveNavDropdown] = useState<'collections' | 'help' | null>(null);
  const dropdownCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleOpenDropdown = (name: 'collections' | 'help') => {
    if (dropdownCloseTimeoutRef.current) {
      clearTimeout(dropdownCloseTimeoutRef.current);
      dropdownCloseTimeoutRef.current = null;
    }
    setActiveNavDropdown(name);
  };

  const handleCloseDropdown = () => {
    if (dropdownCloseTimeoutRef.current) {
      clearTimeout(dropdownCloseTimeoutRef.current);
    }
    dropdownCloseTimeoutRef.current = setTimeout(() => {
      setActiveNavDropdown(null);
    }, 250);
  };

  const handleImmediateClose = () => {
    if (dropdownCloseTimeoutRef.current) {
      clearTimeout(dropdownCloseTimeoutRef.current);
      dropdownCloseTimeoutRef.current = null;
    }
    setActiveNavDropdown(null);
  };

  useEffect(() => {
    return () => {
      if (dropdownCloseTimeoutRef.current) {
        clearTimeout(dropdownCloseTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    handleImmediateClose();
  }, [pathname]);

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
      {/* Top Announcement Bar from Reference Design */}
      <div className="bg-[#f7f2e9] dark:bg-[#120f0b] border-b border-stone-200/60 dark:border-gold-500/10 py-1.5 px-4 text-center select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-3 text-[10px] sm:text-xs font-mono font-medium text-stone-700 dark:text-stone-300">
          <span className="text-gold-600 dark:text-gold-400">‹</span>
          <span className="tracking-wide">Free Shipping on Orders Above ₹999</span>
          <span className="opacity-30">|</span>
          <span className="tracking-wide">Secure Payments</span>
          <span className="opacity-30">|</span>
          <span className="tracking-wide">Easy Returns</span>
          <span className="text-gold-600 dark:text-gold-400">›</span>
        </div>
      </div>

      {/* Main Navigation Header (Transparent per page with warm golden glassmorphism) */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 border-b ${
          isDarkAtmospherePage
            ? 'text-white'
            : 'bg-white/75 dark:bg-[#0A0A0E]/75 backdrop-blur-xl border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-slate-100 shadow-sm'
        }`}
        style={
          isDarkAtmospherePage
            ? {
                background:
                  'linear-gradient(180deg, rgba(22, 16, 10, 0.88) 0%, rgba(16, 12, 8, 0.80) 100%)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
                boxShadow:
                  '0 8px 32px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(251, 191, 36, 0.25)',
              }
            : undefined
        }
      >
        <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 flex h-16 sm:h-20 items-center justify-between">
          {/* Mobile Menu Trigger */}
          <div className="flex items-center xl:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`rounded-2xl border p-2 sm:p-2.5 transition ${
                isDarkAtmospherePage
                  ? 'border-white/20 text-white hover:bg-white/10'
                  : 'border-slate-300 dark:border-gold-500/30 text-slate-700 dark:text-gold-400 hover:text-gold-600'
              }`}
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Brand Identity */}
          <Link href="/" className="flex items-center space-x-2.5 sm:space-x-4 group shrink-0">
            <div
              className={`relative h-10 w-10 sm:h-12 sm:w-12 overflow-hidden rounded-full border p-0.5 shadow-md group-hover:scale-108 transition-all duration-300 ${
                isDarkAtmospherePage
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
                className={`font-serif text-base sm:text-xl font-bold tracking-[0.14em] uppercase block transition ${
                  isDarkAtmospherePage
                    ? 'text-white group-hover:text-gold-300'
                    : 'text-slate-900 dark:text-slate-100 group-hover:text-gold-600 dark:group-hover:text-gold-400'
                }`}
              >
                THE BLING HAVEN
              </span>
              <span className="text-[7.5px] sm:text-[9px] font-sans tracking-[0.24em] text-gold-600 dark:text-gold-400 font-semibold block uppercase">
                Luxury Fashion & Bridal Jewellery
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className={`hidden xl:flex items-center space-x-5 2xl:space-x-7 text-[11px] 2xl:text-[12px] font-sans tracking-[0.14em] uppercase font-semibold transition-colors ${
              isDarkAtmospherePage ? 'text-white/85' : 'text-slate-800 dark:text-slate-200'
            }`}
          >
            {/* 1. Jewellery Collections Mega Menu */}
            <div
              className="relative py-2"
              onMouseEnter={() => handleOpenDropdown('collections')}
              onMouseLeave={handleCloseDropdown}
            >
              <Link
                href="/catalog"
                onClick={handleImmediateClose}
                className={`flex items-center space-x-1.5 transition py-1.5 group ${
                  pathname.startsWith('/catalog') || activeNavDropdown === 'collections'
                    ? 'text-gold-500 dark:text-gold-400 font-bold'
                    : 'hover:text-gold-500 dark:hover:text-gold-400'
                }`}
              >
                <span>Collections</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-gold-500 transition-transform duration-200 ${
                    activeNavDropdown === 'collections' ? 'rotate-180' : ''
                  }`}
                />
              </Link>

              {/* Mega Menu Dropdown */}
              <div
                onMouseEnter={() => handleOpenDropdown('collections')}
                onMouseLeave={handleCloseDropdown}
                className={`absolute left-1/2 -translate-x-1/2 top-full w-[820px] pt-2.5 z-[100] transition-all duration-200 ease-out ${
                  activeNavDropdown === 'collections'
                    ? 'opacity-100 visible pointer-events-auto translate-y-0'
                    : 'opacity-0 invisible pointer-events-none -translate-y-1'
                }`}
              >
                {/* Invisible Hover Bridge */}
                <div className="absolute -top-4 inset-x-0 h-6 bg-transparent" />

                <div
                  className={`rounded-3xl border p-6 shadow-2xl grid grid-cols-12 gap-6 backdrop-blur-2xl transition-colors ${
                    isDarkAtmospherePage
                      ? 'border-white/20 bg-stone-950/95 text-white'
                      : 'border-slate-200/80 dark:border-gold-500/40 bg-white/95 dark:bg-[#0C0C10]/95 text-slate-900 dark:text-slate-100'
                  }`}
                >
                  <div
                    className={`col-span-7 space-y-2 border-r pr-4 ${
                      isDarkAtmospherePage ? 'border-white/10' : 'border-slate-200/80 dark:border-white/10'
                    }`}
                  >
                    <div
                      className={`flex items-center justify-between pb-2 border-b ${
                        isDarkAtmospherePage ? 'border-white/10' : 'border-slate-200/80 dark:border-white/10'
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase tracking-widest text-gold-500 dark:text-gold-400 font-bold">
                        Browse by Category
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">All Collections</span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {visibleCategories.map((cat) => {
                        const IconComponent = cat.icon;
                        const catStatus = getRouteStatus(cat.href);
                        return (
                          <Link
                            key={cat.name}
                            href={cat.href}
                            onClick={handleImmediateClose}
                            className={`group/item flex items-center space-x-3 rounded-2xl p-2.5 border transition ${
                              isDarkAtmospherePage
                                ? 'bg-white/[0.04] border-white/10 hover:border-gold-400 hover:bg-gold-500/10'
                                : 'bg-slate-50/80 dark:bg-white/[0.04] border-slate-200/60 dark:border-white/10 hover:border-gold-500 hover:bg-gold-500/10'
                            }`}
                          >
                            <div className="rounded-xl border border-slate-200/60 dark:border-gold-500/30 bg-white dark:bg-black/60 p-2 text-gold-600 dark:text-gold-400 group-hover/item:bg-gold-500 group-hover/item:text-obsidian-950 transition shrink-0 shadow-sm">
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <p
                                  className={`font-serif font-bold text-xs normal-case transition truncate ${
                                    isDarkAtmospherePage
                                      ? 'text-white group-hover/item:text-gold-300'
                                      : 'text-slate-900 dark:text-slate-100 group-hover/item:text-gold-600 dark:group-hover/item:text-gold-400'
                                  }`}
                                >
                                  {cat.name}
                                </p>
                                {catStatus === 'COMING_SOON' && (
                                  <span className="rounded bg-gold-500/20 px-1.5 py-0.5 text-[8px] font-mono text-gold-700 dark:text-gold-400 uppercase font-bold">
                                    Soon
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-400 normal-case line-clamp-1 font-normal">
                                {cat.subtitle}
                              </p>
                            </div>
                            <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover/item:text-gold-500 group-hover/item:translate-x-1 transition shrink-0" />
                          </Link>
                        );
                      })}

                      {customNavPages.length > 0 && (
                        <div
                          className={`pt-2 border-t mt-2 space-y-1 ${
                            isDarkAtmospherePage ? 'border-white/10' : 'border-slate-200/80 dark:border-white/10'
                          }`}
                        >
                          <span className="text-[9px] font-mono uppercase tracking-widest text-gold-500 dark:text-gold-400 font-bold block px-1">
                            Special Collections
                          </span>
                          {customNavPages.map((cp) => (
                            <Link
                              key={cp.id}
                              href={cp.pageRoute}
                              onClick={handleImmediateClose}
                              className={`group/item flex items-center justify-between rounded-xl px-3 py-1.5 border transition text-xs font-serif ${
                                isDarkAtmospherePage
                                  ? 'bg-white/[0.04] border-white/10 text-white/90 hover:text-gold-300 hover:bg-gold-500/10'
                                  : 'bg-slate-100/70 dark:bg-white/[0.04] border-slate-200/60 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:text-gold-600 dark:hover:text-gold-400'
                              }`}
                            >
                              <span className="truncate">{cp.pageTitle}</span>
                              {cp.badgeText && (
                                <span className="text-[8px] font-mono bg-gold-500/20 text-gold-800 dark:text-gold-300 px-1.5 py-0.5 rounded font-bold uppercase">
                                  {cp.badgeText}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`col-span-5 flex flex-col justify-between rounded-2xl border p-4 relative overflow-hidden ${
                      isDarkAtmospherePage
                        ? 'border-white/10 bg-white/[0.03]'
                        : 'border-slate-200/80 dark:border-white/10 bg-slate-50/60 dark:bg-white/[0.03]'
                    }`}
                  >
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-gold-500/30 mb-3 bg-black">
                      <img
                        src="/uploads/sets_00c2f42a_1s6a9390.jpg"
                        alt="Featured Jewellery"
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute top-2 left-2 rounded-full bg-gold-500 px-2.5 py-0.5 font-mono text-[8px] font-bold text-obsidian-950 uppercase tracking-wider shadow-md">
                        Best Seller
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4
                        className={`font-serif font-bold text-xs normal-case ${
                          isDarkAtmospherePage ? 'text-white' : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        Royal Kundan Bridal Set
                      </h4>
                      <p className="font-mono text-xs font-bold text-gold-500 dark:text-gold-400">
                        ₹ 14,999 / CAD $249
                      </p>
                      <p className="text-[10px] text-slate-400 normal-case">
                        Handcrafted in 22K gold plating with emerald beads.
                      </p>
                    </div>

                    <Link
                      href="/catalog"
                      onClick={handleImmediateClose}
                      className="mt-3 flex items-center justify-center space-x-2 rounded-xl bg-gold-500 hover:bg-gold-400 py-2.5 text-[10px] font-bold uppercase tracking-wider text-obsidian-950 transition shadow-md"
                    >
                      <span>Shop All Jewellery</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Custom Jewellery */}
            {isRouteVisible('/bespoke') && (
              <Link
                href="/bespoke"
                className={`transition flex items-center space-x-1.5 py-1.5 ${
                  pathname === '/bespoke'
                    ? 'text-gold-500 dark:text-gold-400 font-bold'
                    : 'hover:text-gold-500 dark:hover:text-gold-400'
                }`}
              >
                <span>Custom Jewellery</span>
              </Link>
            )}

            {/* 3. AI Stylist */}
            <Link
              href="/ai-assistant"
              className={`transition flex items-center space-x-1.5 py-1.5 relative group ${
                pathname === '/ai-assistant'
                  ? 'text-gold-500 dark:text-gold-400 font-bold'
                  : 'hover:text-gold-500 dark:hover:text-gold-400'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-gold-400 group-hover:scale-110 transition" />
              <span>AI Stylist</span>
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
            </Link>

            {/* 4. Gallery Showcase */}
            <Link
              href="/gallery"
              className={`transition flex items-center space-x-1.5 py-1.5 ${
                pathname === '/gallery'
                  ? 'text-gold-500 dark:text-gold-400 font-bold'
                  : 'hover:text-gold-500 dark:hover:text-gold-400'
              }`}
            >
              <span>Gallery</span>
            </Link>

            {/* 5. Client Services & Atelier Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => handleOpenDropdown('help')}
              onMouseLeave={handleCloseDropdown}
            >
              <button
                type="button"
                onClick={() =>
                  setActiveNavDropdown(activeNavDropdown === 'help' ? null : 'help')
                }
                className={`flex items-center space-x-1.5 cursor-pointer transition py-1.5 focus:outline-none ${
                  activeNavDropdown === 'help' || pathname === '/care-guide' || pathname === '/size-guide'
                    ? 'text-gold-500 dark:text-gold-400 font-bold'
                    : 'hover:text-gold-500 dark:hover:text-gold-400'
                }`}
              >
                <span>Client Services</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-gold-500 transition-transform duration-200 ${
                    activeNavDropdown === 'help' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                onMouseEnter={() => handleOpenDropdown('help')}
                onMouseLeave={handleCloseDropdown}
                className={`absolute right-0 top-full w-[380px] pt-2.5 z-[100] transition-all duration-200 ease-out ${
                  activeNavDropdown === 'help'
                    ? 'opacity-100 visible pointer-events-auto translate-y-0'
                    : 'opacity-0 invisible pointer-events-none -translate-y-1'
                }`}
              >
                <div className="absolute -top-4 inset-x-0 h-6 bg-transparent" />

                <div
                  className={`rounded-3xl border p-5 shadow-2xl space-y-2 backdrop-blur-2xl transition-colors ${
                    isDarkAtmospherePage
                      ? 'border-white/20 bg-stone-950/95 text-white'
                      : 'border-slate-200/80 dark:border-gold-500/40 bg-white/95 dark:bg-[#0C0C10]/95 text-slate-900 dark:text-slate-100'
                  }`}
                >
                  <div
                    className={`flex items-center justify-between pb-2 border-b ${
                      isDarkAtmospherePage ? 'border-white/10' : 'border-slate-200/80 dark:border-white/10'
                    }`}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gold-500 dark:text-gold-400 font-bold">
                      Atelier Assistance
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">Customer Care</span>
                  </div>

                  <Link
                    href="/care-guide"
                    onClick={handleImmediateClose}
                    className={`group/item flex items-center space-x-3 rounded-2xl p-2.5 border transition ${
                      isDarkAtmospherePage
                        ? 'bg-white/[0.04] border-white/10 hover:border-gold-400 hover:bg-gold-500/10'
                        : 'bg-slate-50/80 dark:bg-white/[0.04] border-slate-200/60 dark:border-white/10 hover:border-gold-500 hover:bg-gold-500/10'
                    }`}
                  >
                    <div className="rounded-xl border border-slate-200/60 dark:border-gold-500/30 bg-white dark:bg-black/60 p-2 text-gold-600 dark:text-gold-400 group-hover/item:bg-gold-500 group-hover/item:text-obsidian-950 transition">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p
                        className={`font-serif font-bold text-xs normal-case transition ${
                          isDarkAtmospherePage
                            ? 'text-white group-hover/item:text-gold-300'
                            : 'text-slate-900 dark:text-slate-100 group-hover/item:text-gold-600 dark:group-hover/item:text-gold-400'
                        }`}
                      >
                        Jewellery Care Guide
                      </p>
                      <p className="text-[10px] text-slate-400 normal-case font-normal">
                        22K gold & rhodium anti-tarnish longevity tips
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/size-guide"
                    onClick={handleImmediateClose}
                    className={`group/item flex items-center space-x-3 rounded-2xl p-2.5 border transition ${
                      isDarkAtmospherePage
                        ? 'bg-white/[0.04] border-white/10 hover:border-gold-400 hover:bg-gold-500/10'
                        : 'bg-slate-50/80 dark:bg-white/[0.04] border-slate-200/60 dark:border-white/10 hover:border-gold-500 hover:bg-gold-500/10'
                    }`}
                  >
                    <div className="rounded-xl border border-slate-200/60 dark:border-gold-500/30 bg-white dark:bg-black/60 p-2 text-gold-600 dark:text-gold-400 group-hover/item:bg-gold-500 group-hover/item:text-obsidian-950 transition">
                      <Gem className="h-4 w-4" />
                    </div>
                    <div>
                      <p
                        className={`font-serif font-bold text-xs normal-case transition ${
                          isDarkAtmospherePage
                            ? 'text-white group-hover/item:text-gold-300'
                            : 'text-slate-900 dark:text-slate-100 group-hover/item:text-gold-600 dark:group-hover/item:text-gold-400'
                        }`}
                      >
                        Ring & Bangle Sizing Chart
                      </p>
                      <p className="text-[10px] text-slate-400 normal-case font-normal">
                        Interactive millimeter size calculator & conversion
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/track"
                    onClick={handleImmediateClose}
                    className={`group/item flex items-center space-x-3 rounded-2xl p-2.5 border transition ${
                      isDarkAtmospherePage
                        ? 'bg-white/[0.04] border-white/10 hover:border-gold-400 hover:bg-gold-500/10'
                        : 'bg-slate-50/80 dark:bg-white/[0.04] border-slate-200/60 dark:border-white/10 hover:border-gold-500 hover:bg-gold-500/10'
                    }`}
                  >
                    <div className="rounded-xl border border-slate-200/60 dark:border-gold-500/30 bg-white dark:bg-black/60 p-2 text-gold-600 dark:text-gold-400 group-hover/item:bg-gold-500 group-hover/item:text-obsidian-950 transition">
                      <Truck className="h-4 w-4" />
                    </div>
                    <div>
                      <p
                        className={`font-serif font-bold text-xs normal-case transition ${
                          isDarkAtmospherePage
                            ? 'text-white group-hover/item:text-gold-300'
                            : 'text-slate-900 dark:text-slate-100 group-hover/item:text-gold-600 dark:group-hover/item:text-gold-400'
                        }`}
                      >
                        Track Your Courier
                      </p>
                      <p className="text-[10px] text-slate-400 normal-case font-normal">
                        Real-time delivery status & dispatch tracking
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/support"
                    onClick={handleImmediateClose}
                    className={`group/item flex items-center space-x-3 rounded-2xl p-2.5 border transition ${
                      isDarkAtmospherePage
                        ? 'bg-white/[0.04] border-white/10 hover:border-gold-400 hover:bg-gold-500/10'
                        : 'bg-slate-50/80 dark:bg-white/[0.04] border-slate-200/60 dark:border-white/10 hover:border-gold-500 hover:bg-gold-500/10'
                    }`}
                  >
                    <div className="rounded-xl border border-slate-200/60 dark:border-gold-500/30 bg-white dark:bg-black/60 p-2 text-gold-600 dark:text-gold-400 group-hover/item:bg-gold-500 group-hover/item:text-obsidian-950 transition">
                      <LifeBuoy className="h-4 w-4" />
                    </div>
                    <div>
                      <p
                        className={`font-serif font-bold text-xs normal-case transition ${
                          isDarkAtmospherePage
                            ? 'text-white group-hover/item:text-gold-300'
                            : 'text-slate-900 dark:text-slate-100 group-hover/item:text-gold-600 dark:group-hover/item:text-gold-400'
                        }`}
                      >
                        Concierge Helpdesk
                      </p>
                      <p className="text-[10px] text-slate-400 normal-case font-normal">
                        WhatsApp stylist support & customer inquiries
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* 6. About Us */}
            <Link
              href="/about"
              className={`transition py-1.5 ${
                pathname === '/about'
                  ? 'text-gold-500 dark:text-gold-400 font-bold'
                  : 'hover:text-gold-500 dark:hover:text-gold-400'
              }`}
            >
              About
            </Link>
          </nav>

          {/* Right Action Suite (Restructured, cohesive, and elegant) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 xl:space-x-2.5 pl-1.5 sm:pl-3 lg:pl-6 shrink-0">
            {/* Currency Selector */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className={`flex items-center space-x-1.5 rounded-full border px-3 py-1.5 text-xs font-mono font-medium transition backdrop-blur-sm ${
                  isDarkAtmospherePage
                    ? 'border-amber-400/30 bg-black/40 text-stone-100 hover:border-gold-400 hover:bg-gold-500/10'
                    : 'border-slate-300/80 dark:border-white/15 bg-slate-100/80 dark:bg-white/[0.06] text-slate-800 dark:text-slate-200 hover:border-gold-500'
                }`}
              >
                <Globe2 className="h-3.5 w-3.5 text-gold-500" />
                <span>{currentCurrency}</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </button>

              {isCurrencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-3xl border border-white/20 dark:border-gold-500/50 bg-white dark:bg-[#0C0C10] p-3 shadow-2xl z-[100] animate-in fade-in slide-in-from-top-1">
                  <div className="text-[9px] uppercase font-mono font-bold text-gold-600 dark:text-gold-400 px-3 py-1 border-b border-slate-200 dark:border-white/10 mb-1.5">
                    Select Currency
                  </div>
                  <div className="space-y-1">
                    {rates.map((r) => (
                      <button
                        key={r.currencyCode}
                        onClick={() => {
                          setCurrency(r.currencyCode);
                          setIsCurrencyDropdownOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition font-mono ${
                          currentCurrency === r.currencyCode
                            ? 'bg-gold-500 text-obsidian-950 font-bold shadow-sm'
                            : 'text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-[#14141A] hover:bg-gold-500/20 hover:text-gold-700 dark:hover:text-gold-400'
                        }`}
                      >
                        <span>{r.currencyCode}</span>
                        <span className="font-serif font-bold">
                          {r.symbol} {r.currencyName}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <Link
              href="/account"
              className={`relative rounded-full border p-2.5 transition backdrop-blur-sm shadow-sm ${
                isDarkAtmospherePage
                  ? 'border-amber-400/30 bg-black/40 text-stone-100 hover:text-rose-400 hover:border-rose-400/50'
                  : 'border-slate-300/80 dark:border-white/15 bg-slate-100/80 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 hover:border-gold-500 hover:text-rose-500'
              }`}
              title="My Wishlist"
            >
              <Heart className="h-4 w-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-white font-mono text-[9px] font-bold shadow-md">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative rounded-full border border-gold-500/40 bg-gold-500/10 hover:bg-gold-500 hover:text-obsidian-950 p-2.5 text-gold-600 dark:text-gold-400 transition-all duration-300 shadow-sm backdrop-blur-sm"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="h-4 w-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-obsidian-950 font-mono text-[9px] font-bold shadow-lg">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Profile / Login Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className={`flex items-center space-x-2 rounded-full border p-1 pr-3 transition shadow-sm backdrop-blur-sm ${
                    isDarkAtmospherePage
                      ? 'border-gold-400/40 bg-white/[0.06] text-white hover:border-gold-400'
                      : 'border-gold-500/40 bg-slate-100/80 dark:bg-white/[0.06] hover:border-gold-500'
                  }`}
                >
                  <div className="h-7 w-7 rounded-full overflow-hidden border border-gold-500/40 bg-gold-500/10">
                    <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" />
                  </div>
                  <span className="hidden md:inline font-mono text-xs font-bold max-w-[90px] truncate">
                    {user.firstName}
                  </span>
                  <ChevronDown className="h-3 w-3 text-gold-500 hidden sm:block" />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-3xl border border-white/20 dark:border-gold-500/40 bg-white dark:bg-[#0C0C10] p-4 shadow-2xl z-[100] animate-in fade-in slide-in-from-top-1 text-slate-900 dark:text-slate-100 font-mono text-xs space-y-3">
                    <div className="border-b border-slate-100 dark:border-white/10 pb-3 space-y-0.5">
                      <p className="font-serif font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                        {user.fullName}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 rounded-full bg-gold-500/20 text-gold-700 dark:text-gold-400 text-[9px] font-bold px-2 py-0.5">
                        Member Account
                      </span>
                    </div>

                    <div className="space-y-1">
                      <Link
                        href="/account"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 p-2 rounded-xl hover:bg-gold-500/15 transition text-slate-800 dark:text-slate-200"
                      >
                        <User className="h-4 w-4 text-gold-600 dark:text-gold-400" />
                        <span>My Profile & Settings</span>
                      </Link>

                      <Link
                        href="/account"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 p-2 rounded-xl hover:bg-gold-500/15 transition text-slate-800 dark:text-slate-200"
                      >
                        <Package className="h-4 w-4 text-gold-600 dark:text-gold-400" />
                        <span>My Orders & Tracking</span>
                      </Link>

                      <Link
                        href="/account"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 p-2 rounded-xl hover:bg-gold-500/15 transition text-slate-800 dark:text-slate-200"
                      >
                        <Heart className="h-4 w-4 text-gold-600 dark:text-gold-400" />
                        <span>Wishlist ({wishlistCount})</span>
                      </Link>

                      <Link
                        href="/account"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 p-2 rounded-xl hover:bg-gold-500/15 transition text-slate-800 dark:text-slate-200"
                      >
                        <Tag className="h-4 w-4 text-gold-600 dark:text-gold-400" />
                        <span>Discount Coupons</span>
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 dark:border-white/10 pt-2">
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          logout();
                        }}
                        className="flex w-full items-center space-x-2 p-2 rounded-xl text-rose-600 hover:bg-rose-500/10 transition"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('LOGIN')}
                className={`flex items-center space-x-1.5 rounded-full border px-3.5 py-1.5 text-xs font-mono font-medium transition backdrop-blur-sm ${
                  isDarkAtmospherePage
                    ? 'border-amber-400/35 bg-black/40 text-stone-100 hover:border-gold-400 hover:bg-gold-500/20'
                    : 'border-slate-300/80 dark:border-white/15 bg-slate-100/80 dark:bg-white/[0.06] text-slate-800 dark:text-slate-200 hover:border-gold-500'
                }`}
              >
                <User className="h-3.5 w-3.5 text-gold-500" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Theme Toggle Button */}
            <ThemeToggle
              className={
                isDarkAtmospherePage
                  ? '!border-amber-400/30 !bg-black/40 !text-amber-300 hover:!border-gold-400'
                  : ''
              }
            />
          </div>
        </div>

        {/* Mobile Slide-Over Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 dark:border-gold-500/30 bg-white dark:bg-[#0C0C10] px-6 py-6 space-y-6 animate-in slide-in-from-top duration-200 z-50 shadow-2xl font-mono text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#14141A] border border-slate-200 dark:border-gold-500/20 flex items-center justify-between">
              {user ? (
                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 flex-1 min-w-0"
                >
                  <img src={user.avatarUrl} alt={user.fullName} className="h-9 w-9 rounded-xl object-cover border border-gold-500/40" />
                  <div className="min-w-0 flex-1">
                    <p className="font-serif font-bold text-slate-900 dark:text-slate-100 truncate">{user.fullName}</p>
                    <span className="text-[10px] text-gold-700 dark:text-gold-400 font-bold block">View My Profile</span>
                  </div>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAuthModal('LOGIN');
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl bg-gold-500 text-obsidian-950 font-bold uppercase tracking-wider"
                >
                  <User className="h-4 w-4" />
                  <span>Sign In / Create Account</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold-700 dark:text-gold-400 block font-bold">
                Jewellery Categories
              </span>
              <div className="grid grid-cols-1 gap-2">
                {visibleCategories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-50 dark:bg-[#14141A] text-slate-800 dark:text-slate-200 hover:text-gold-600 dark:hover:text-gold-400 font-serif text-sm border border-slate-200 dark:border-gold-500/20"
                  >
                    <div className="h-2 w-2 rounded-full bg-gold-500" />
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 dark:border-gold-500/20">
              <Link
                href="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-50 dark:bg-[#14141A] text-xs font-mono uppercase font-bold text-slate-800 dark:text-slate-200"
              >
                <User className="h-4 w-4 text-gold-500" />
                <span>My Profile</span>
              </Link>
              <Link
                href="/bespoke"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-50 dark:bg-[#14141A] text-xs font-mono uppercase font-bold text-slate-800 dark:text-slate-200"
              >
                <Gem className="h-4 w-4 text-gold-500" />
                <span>Custom Designs</span>
              </Link>              <Link
                href="/gallery"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-50 dark:bg-[#14141A] text-xs font-mono uppercase font-bold text-slate-800 dark:text-slate-200"
              >
                <Maximize2 className="h-4 w-4 text-gold-500" />
                <span>Gallery</span>
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-50 dark:bg-[#14141A] text-xs font-mono uppercase font-bold text-slate-800 dark:text-slate-200"
              >
                <span>About Us</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
